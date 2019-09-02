class ResourceProviderChain {
    constructor(providers) {
        this.providers = [].concat(providers || []);
    }

    async get(descriptor, isOptional) {
        const provider = this.providers.shift();
        // assert provider exists
        return provider.get(descriptor, isOptional, this);
    }
}

module.exports = ResourceProviderChain;