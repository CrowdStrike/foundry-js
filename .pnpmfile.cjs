function afterAllResolved(lockfile) {
  // Remove the tarball URLs from the lockfile
  for (const key in lockfile.packages) {
    if (lockfile.packages[key].resolution?.tarball) {
      delete lockfile.packages[key].resolution.tarball;
    }
  }
  return lockfile;
}

module.exports = {
  hooks: {
    afterAllResolved,
  },
};