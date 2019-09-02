const API_PREFIX = 'api';

const RESOURCE_TYPES = {
    SEASON: 'season',
    EVENTS: 'events',
    SHIFTS: 'shifts'
};

/**
 * resource looks like `${type}://{id}`
 * @param {string} descriptor 
 */
function parseResourceDescriptor(descriptor) {
    const [type, id] = descriptor.split('://');
    return { type, id };
}

function constructResourceDescriptorString({ type, id }) {
    return `${type}://${id}`;
}

function getResourceUrl(resource = {}) {
    const { type, id } = 
        typeof resource === 'string' ? parseResourceDescriptor(resource) : resource;

    return `/${API_PREFIX}/${type}/${id}`;
}

function parseUrl(url) {
    if (!url.startsWith('/')) {
        throw `Url must start with a '/': ${url}`;
    }

    const urlSub = url.substring(1);

    const parts = urlSub.split('/');
    const [prefix, type] = parts.splice(0,2);

    if (prefix !== API_PREFIX)
        throw `Invalid prefix: ${prefix}`;

    const id = parts.splice(-1, 1)[0];

    return { type, id };
}

module.exports = {
    API_PREFIX,
    RESOURCE_TYPES,
    parseResourceDescriptor,
    constructResourceDescriptorString,
    getResourceUrl,
    parseUrl
};

