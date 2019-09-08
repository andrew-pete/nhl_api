const request = require('request');
const { JSDOM } = require('jsdom');

const { parseResourceDescriptor } = require('../../utils/resource-util');
const { parseId, expandYear } = require('../../utils/url-util');

const ROW_SELECTOR = 'tr.evenColor';
const ROW_HEADERS = ['event_no', 'period', 'strength', 'time', 'event', 'description', 'on_ice'];

function getOnIce(teamTable) {
    const playersTables = [].slice.call(teamTable.querySelectorAll('table'));
    const innerCells = playersTables.map( table => [].slice.call(table.querySelectorAll('td')));
    
    const onIce = innerCells.map(([ top ]) => {
        // "Defense - VICTOR METE"
        const playerInfoString = top.firstElementChild.title;
        const [ position, fullName ] = playerInfoString.split(' - ');
        const nameParts = fullName.split(' ');

        // move first name to end of array
        nameParts.push(nameParts.shift());
        return {
            position,
            name: nameParts.join('_').toUpperCase()
        }
    });

    return onIce;
}

// Expecting timeString of format `mm:ssmm:ss`, `m:ssmm:ss` or `mm:ssm:ss`
function getTimeObject(timeString) {
    const firstColonIndex = timeString.indexOf(':');
    return {
        elapsed: timeString.slice(0, firstColonIndex + 3),
        game: timeString.slice(firstColonIndex + 3)
    };
}

const SPECIAL_HANDLERS = {
    'time': (td) => {
        if (!(td && td.textContent)) {
            return undefined;
        }

        return getTimeObject(td.textContent);
    },

    'on_ice': (awayTd, homeTd) => {
        const awayPlayersTable = awayTd.querySelector('table');
        const homePlayersTable = homeTd.querySelector('table');

        return {
            home: getOnIce(homePlayersTable),
            away: getOnIce(awayPlayersTable)
        };
    }
}
/**
 * Generates the "season" json by querying NHL api
 * 
 * descriptor format: `events://<fullId>` i.e. `events://2018020001`
 * url format: `/api/events/:fullId` i.e. `/api/events/2018020001`
 */
class EventsGenerator {

    async get(descriptor) {
        const events = await this._getReportPromiseChain(descriptor);
        return Promise.resolve(events);
    }

    _getReportPromiseChain(descriptor) {
        return this._getHtmlReports(descriptor).then(this._parseBody.bind(this));
    }

    _getHtmlReports(descriptor) {
        const url = this._getHtmlReportsUrl(descriptor);

        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    resolve(body);
                } else {
                    reject(body);
                }
            });
        });
    }

    _parseBody(html) {
        return new Promise(( resolve, reject ) => {
            try {
                const window = (new JSDOM(html)).window;
                const events = this._getDataRows(window.document).map(this._parseRow);
                resolve(events);
            }
            catch(exception) {
                reject(exception);
            }
        });
    }

    _getHtmlReportsUrl(descriptor) {
        const { id: fullId } = parseResourceDescriptor(descriptor);
        const { gameId, year } = parseId(fullId);
        const fullYear = expandYear(year);

        return `http://www.nhl.com/scores/htmlreports/${fullYear}/PL${gameId}.HTM`;
    }

    _getDataRows(document) {
        return [].slice.call(document.querySelectorAll(ROW_SELECTOR));
    }

    _parseRow(tr) {
        const data = {};
        const children = tr.children;
        for (let i = 0; i < ROW_HEADERS.length; i++) {
            const header = ROW_HEADERS[i];

            if (SPECIAL_HANDLERS[header]) {
                // for game starts, etc, there is just a &nbsp; so don't bother with those
                data[header] = children[i].textContent.trim()
                    ? SPECIAL_HANDLERS[header](children[i], children[i+1])
                    : undefined;
            } else {
                data[header] = (children[i].textContent || '').trim();
            }
        }
        return data;
    }

}

module.exports = EventsGenerator;