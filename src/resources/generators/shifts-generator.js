const request = require('request');
const jsdom = require('jsdom');
const { parseResourceDescriptor } = require('../../utils/resource-util');
const { parseId } = require('../../utils/url-util');


class ShiftsGenerator {
    async get(descriptor) {
        
        return {
            'data': 'blaaaaah'
        }
    }

    /**
     * @private
     */
    _getHtmlReportsUrl(descriptor, isHomeTeam) {
        const { id } = parseResourceDescriptor(descriptor);
        const { year, gameId } = parseId(id);

        return `http://www.nhl.com/scores/htmlreports/${year}/${isHomeTeam ? 'TH' : 'TV'}${gameId}.HTM`;
    }
}

module.exports = ShiftsGenerator;