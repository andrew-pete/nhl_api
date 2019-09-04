const request = require('request');
const { JSDOM } = require('jsdom');
const { parseResourceDescriptor } = require('../../utils/resource-util');
const { parseId, expandYear } = require('../../utils/url-util');

const PLAYER_HEADING_CLASS = 'playerHeading';
const HEADER_ARRAY = ['shift_no', 'period', 'start-time', 'end-time', 'duration', 'event'];

function isPlayerRow(tr) {
    return ['evenColor', 'oddColor'].includes(tr.className.trim());
}

function getPlayerMetadata(number, ...nameParts) {
    // remove the comma from the surname
    const surname = nameParts.shift().slice(0, -1);
    
    return {
        number,
        name: [surname].concat(nameParts).join("_") // e.g. JOSI_ROMAN
    }
}

class ShiftsGenerator {
    /**
      * @param {string} descriptor 
      */
    async get(descriptor) {
        const { home: homeUrl, away: awayUrl } = this._getHtmlReportsUrls(descriptor, true);
        
        // await for home and away shift tables to be processed into JSON
        const [ home, away ] = await Promise.all([this._getRequestPromiseChain(homeUrl), this._getRequestPromiseChain(awayUrl)]);
        
        return Promise.resolve({ home, away });
    }
    
    /**
      * @private
      * @return Promise corresponding that will resolve into JSON representation of the NHL shift table for this URL
      */
    _getRequestPromiseChain(url) {
        return this._getShiftsTable(url).then(this._parseBody.bind(this));
    }

    /**
     * @private
     * @param {string} url 
     * @return {Promise}
     */
    _getShiftsTable(url) {
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
    
    /**
     * @private
     */
    _parseBody(html) {
        const self = this;
        return new Promise((resolve, reject) => {
            const window = (new JSDOM(html)).window;
            const document = window.document;
            
            const playerTable = document.querySelectorAll('table table')[8];
            const tableRows = [].slice.call(playerTable.querySelectorAll('tr'));
            
            resolve(self._processRows(tableRows));
        });
    }
    
    /**
     * @private
     */
    _getHtmlReportsUrls(descriptor) {
        return {
            home: this._getHtmlReportsUrl(descriptor, true),
            away: this._getHtmlReportsUrl(descriptor, false)
        };
    }

    /**
     * @private
     */
    _getHtmlReportsUrl(descriptor, isHomeTeam) {
        const { id } = parseResourceDescriptor(descriptor);
        const { year, gameId } = parseId(id);
        const fullYear = expandYear(year);
        return `http://www.nhl.com/scores/htmlreports/${fullYear}/${isHomeTeam ? 'TH' : 'TV'}${gameId}.HTM`;
    }

    _processRows(tableRows) {
        // get all the start indices for the players using their unique class name
        const playerIndices = tableRows.reduce((indices, tr, i) => {
            if (tr.firstElementChild && tr.firstElementChild.classList && tr.firstElementChild.classList.contains(PLAYER_HEADING_CLASS)) {
                indices.push(i);
            }
            return indices;
        }, []);

        const startIndex = playerIndices.shift();
        let nextPlayerIndex = startIndex;
        
        let tr, didPlayerRowsStart, didPlayerRowsEnd, playerShifts;
        const shifts = [];
        for (var i = startIndex; i < tableRows.length; i++) {
            tr = tableRows[i];
            if (i === nextPlayerIndex) {
                // get next end index, shift array
                nextPlayerIndex = playerIndices.shift();

                // reset table state
                didPlayerRowsStart = false;
                didPlayerRowsEnd = false;

                // do not push in base case (first player)
                if (playerShifts) {
                    shifts.push(playerShifts);
                }

                // init playerShifts object
                playerShifts = {
                    player: getPlayerMetadata.apply(null, tr.textContent.trim().split(' ')),
                    shifts: []
                };
            }

            // mark that we are now processing the player rows
            if (!didPlayerRowsStart && isPlayerRow(tr))  {
                didPlayerRowsStart = true;
            } else if (didPlayerRowsStart && !isPlayerRow(tr)) {
                didPlayerRowsEnd = true;
            }
            
            // player row -> go through all cells and extract text
            if (isPlayerRow(tr) && !didPlayerRowsEnd) {
                playerShifts.shifts.push([].reduce.call(tr.querySelectorAll('td'), (shiftData, td, i) => {
                    const attr = HEADER_ARRAY[i];
                    if (i === 2 || i === 3) {
                        // time cell looks like `time:elapsed / time:remaining`, so get both and return
                        const [ elapsed, remaining ] = td.textContent.split(' / ');
                        shiftData[attr] = { elapsed, remaining };
                    } else {
                        // if not a time cell, then just return trimmed inner text content
                        shiftData[attr] = td.textContent.trim();
                    }
                    return shiftData;
                }, {}));
            } else {
                // header row or summary row... do nothing
            }
        }
        return shifts
    }
}

module.exports = ShiftsGenerator;