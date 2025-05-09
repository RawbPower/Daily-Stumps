const seedrandom = require('seedrandom');
var rng = null; // = seedrandom('07052025');

function initSeed(seed)
{
    rng = seedrandom(seed);
}

function rand()
{
    return rng();
}

function range(min, max)
{
    return Math.floor(rng() * (max - min) + min);
}

module.exports = {
	initSeed,
    rand,
    range
}