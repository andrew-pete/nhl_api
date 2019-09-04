function parseId(fullId) {
    const year = fullId.substring(0, 4);
    const gameId = fullId.substring(4);

    return { year, gameId };
}

function expandYear(year) {
    if (year.length === 8) {
        return year;
    } else if (year.length === 4 && !isNaN(+year)) {
        const yearStart = +year;
        const yearPlusOne = yearStart + 1;
        return `${yearStart}${yearPlusOne}`;
    } else {
        throw `Invalid year: ${year}`;
    }
}

module.exports = {
    parseId,
    expandYear
};

