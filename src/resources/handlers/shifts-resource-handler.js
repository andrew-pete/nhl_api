const { RESOURCE_TYPES } = require('../../utils/resource-util');
const ShiftsGenerator = require('../generators/shifts-generator');
const FilesystemResourceProvider = require('../filesystem-resource-provider');
const ResourceProviderChain = require('../resource-provider-chain');

const providers = [new FilesystemResourceProvider(), new ShiftsGenerator()];

class ShiftsResourceHandler {
    get type() {
        return RESOURCE_TYPES.SHIFTS;
    }

    async get(descriptor, isOptional) {
        return new ResourceProviderChain(providers).get(descriptor, isOptional);
    }
}

module.exports = ShiftsResourceHandler;