module.exports = {
  data: {
    files: [{
      expand: true,
      cwd: 'src/data',
      src: ['kimonoData.json'],
      dest: 'dist/data/'
    }]
  },
  index: {
    files: [{
      expand: true,
      cwd: 'src',
      src: ['index.html'],
      dest: 'dist'
    }]
  }
};
