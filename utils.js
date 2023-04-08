const sortFiles = (a, b) => {
  const weights = { woff2: 4, woff: 3, ttf: 2, otf: 1 };
  const weightA = weights[a.srcFormat];
  const weightB = weights[b.srcFormat];

  if (weightA !== weightB) {
    return weightB - weightA;
  }
};

module.exports = {
  sortFiles,
};
