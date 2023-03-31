const sortFiles = (a, b) => {
  if (a.ext < b.ext) {
    return -1;
  }
  if (a.ext > b.ext) {
    return 1;
  }
  return 0;
}

module.exports = {
  sortFiles,
};
