

function sgn(x) {
    return x < 0 ? -1 : 1;
}

// From wikipedia:
// Lap(X) = mu - b sgn(U) ln (1-2|U|) where U is a random variable between -0.5 and 0.5
function laplace(mu, b) {
    var U = Math.random() - 0.5;
    return mu - (b * sgn(U) * Math.log(1 - 2* Math.abs(U)));
}

function privatize(F, deltaF, epsilon) {
    return F + laplace(0.0, 2 * deltaF/epsilon);
}

module.exports = privatize;
