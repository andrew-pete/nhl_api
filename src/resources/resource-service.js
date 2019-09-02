const SeasonResourceHandler = require('./handlers/season-resource-handler');
const ShiftsResourceHandler = require('./handlers/shifts-resource-handler');
const { parseResourceDescriptor } = require('../utils/resource-util');
const Timer = require('../utils/timer');

class ResourceService {
    constructor() {
        this.setResourceHandlers(
            new SeasonResourceHandler(),
            new ShiftsResourceHandler()
        );
        this.timer = new Timer();
    }

    async get(descriptor) {
        return this.doGet(descriptor, false);
    }

    async getIfPresent(descriptor) {
        return this.doGet(descriptor, true);
    }

    async doGet(descriptor, isOptional) {
        // start resource timer
        this.timer.reset().start();

        const { type } = parseResourceDescriptor(descriptor);
        const resource = await this.getResourceHandler(type).get(descriptor, isOptional);

        // stop resource timer
        this.timer.stop();
        console.log(`GET: ${descriptor} in ${this.timer.time} ms`);

        // return resource
        return resource;
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