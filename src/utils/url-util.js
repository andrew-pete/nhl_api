function parseId(fullId) {
    const year = fullId.substring(0, 8);
    const gameId = fullId.substring(8);

    return { year, gameId };
}

module.exports = {
    parseId,
};

