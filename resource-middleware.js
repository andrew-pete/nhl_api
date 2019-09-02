const { parseUrl, constructResourceDescriptorString, RESOURCE_TYPES, API_PREFIX} = require('./src/utils/resource-util');
const resourceService = require('./src/resources/resource-service');

function resourceMiddleware() {
    return async function resources(req, res, next) {
        const { path } = req;
        
        if (!path.startsWith(`/${API_PREFIX}`)) {
            return next();
        }
        const { type, id } = parseUrl(path);

        const isValidType = Object.values(RESOURCE_TYPES).includes(type);

        if (!isValidType) {
            return res.status(400).send(`Invalid resource type: ${type}`);
        }

        const descriptor = constructResourceDescriptorString({ type, id });
        const resource = await resourceService.get(descriptor);

        return res.status(400).send(resource);
    }
}

module.exports = { resourceMiddleware };