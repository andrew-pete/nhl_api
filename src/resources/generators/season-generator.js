const request = require('request');
const { parseResourceDescriptor } = require('../../utils/resource-util');

/**
 * Generates the "season" json by querying NHL api
 * 
 * descriptor format: `season://<year>` i.e. `season://20182019`
 * url format: `/api/season/:year` i.e. `/api/season/20182019`
 */
class SeasonGenerator {
    constructor() {
        this._cache = {};
    }

    async get(descriptor) {
        return this.doGet(descriptor);
    }

    async doGet(descriptor) {
        // use cache as backup until filesystem cache is functional
        if (this._cache[descriptor]) {
            return this._cache[descriptor];
        }

        const url = this._getSeasonUrl(descriptor);
        const json = true;
        return new Promise((resolve, reject) => request({ url, json }, (err, res, jsonRes) => {
            if (!err && res.statusCode === 200) {
                const postProcessed = this._postProcess(jsonRes);
                this._cache[descriptor] = postProcessed;
                resolve(postProcessed);
            } else {
                reject(err);
            }
        }));
    }

    /**
     * @private
     */
    _getSeasonUrl(descriptor) {
        const { id: year } = parseResourceDescriptor(descriptor);

        return `https://statsapi.web.nhl.com/api/v1/schedule?season=${year}`;
    }

    /**
     * @private
     */
    _postProcess(json) {
        const games = json.dates.reduce( (acc, date) => acc.concat(date.games), []);
        return { games };
    }
}

module.exports = SeasonGenerator;