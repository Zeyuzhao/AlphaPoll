

function sgn(x) {
    return x < 0 ? -1 : 1;
}

// Compute laplace confidence interval of laplace(b)
// p is the confidence level
function laplaceCI(b, p) {
    const side = (1 - p) / 2;

    // Negate (cdf(x) < 0.5 -> value is negative)
    return -b * Math.log(2 * side);
}

// From wikipedia:
// Lap(X) = mu - b sgn(U) ln (1-2|U|) where U is a random variable between -0.5 and 0.5
function laplace(mu, b) {
    var U = Math.random() - 0.5;
    return mu - (b * sgn(U) * Math.log(1 - 2* Math.abs(U)));
}

// Privatizes value F with Laplace(deltaF/epsilon) noise
// For histograms, deltaF = 2
// Returns tuple (val, CI)
// val: privatized value
// CI: confidence bound on value

function privatize(F, epsilon, deltaF = 2, p = 0.95) {
    const b = deltaF/epsilon
    const val =  F + laplace(0.0, b);
    const CI = laplaceCI(b, p);
    return {val, CI};
}

module.exports =  privatize;
