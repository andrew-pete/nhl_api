const fs = require('fs');

class FileSystemResourceProvider {
    async get(descriptor, isOptional, chain) {
        // TODO: if exists, check file system
        if (isOptional) {
            return null;
        }

        const resource = await chain.get(descriptor);
        return resource;
    }
}

module.exports = FileSystemResourceProvider;