const { RESOURCE_TYPES } = require('../../utils/resource-util');
const EventsGenerator = require('../generators/events-generator');
const FilesystemResourceProvider = require('../filesystem-resource-provider');
const ResourceProviderChain = require('../resource-provider-chain');

const providers = [new FilesystemResourceProvider(), new EventsGenerator()];

class EventsResourceHandler {
    get type() {
        return RESOURCE_TYPES.EVENTS;
    }

    async get(descriptor, isOptional) {
        return new ResourceProviderChain(providers).get(descriptor, isOptional);
    }
}

module.exports = EventsResourceHandler;