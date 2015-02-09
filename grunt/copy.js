module.exports = {
  all: {
    files: [{
      expand: true,
      cwd: 'src/data',
      src: ['kimonoData.json'],
      dest: 'dist/data/'
    }]
  }
};
