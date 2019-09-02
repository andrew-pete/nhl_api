const { RESOURCE_TYPES } = require('../../utils/resource-util');
const SeasonGenerator = require('../generators/season-generator');
const FilesystemResourceProvider = require('../filesystem-resource-provider');
const ResourceProviderChain = require('../resource-provider-chain');

const providers = [new FilesystemResourceProvider(), new SeasonGenerator()];

class SeasonResourceHandler {
    get type() {
        return RESOURCE_TYPES.SEASON;
    }

    async get(descriptor, isOptional) {
        return new ResourceProviderChain(providers).get(descriptor, isOptional);
    }
}

module.exports = SeasonResourceHandler;