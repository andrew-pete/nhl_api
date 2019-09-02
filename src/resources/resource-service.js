const SeasonResourceHandler = require('./handlers/season-resource-handler');
const { parseResourceDescriptor } = require('../utils/resource-util');

class ResourceService {
    constructor() {
        this.setResourceHandlers(
            new SeasonResourceHandler()
        );
    }

    async get(descriptor) {
        return this.doGet(descriptor, false);
    }

    async getIfPresent(descriptor) {
        return this.doGet(descriptor, true);
    }

    async doGet(descriptor, isOptional) {
        const { type } = parseResourceDescriptor(descriptor);
        return this.getResourceHandler(type).get(descriptor, isOptional);
    }

    setResourceHandlers(...resourceHandlers) {
        this.resourceHandlers = resourceHandlers.reduce((handlers, handler) => {
            handlers[handler.type] = handler;
            return handlers;
        }, {});
    }

    getResourceHandler(type) {
        return this.resourceHandlers[type];
    }
}

module.exports = Object.assign(new ResourceService(), { ResourceService });