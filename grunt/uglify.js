module.exports = {
  all: {
    files: [{
      expand: true,
      cwd: 'src/scripts',
      src: ['**/*.js', '!kimonoTransform.js'],
      dest: 'dist/scripts/',
      extDot: 'last',
      ext: '.min.js'
    }]
  }
};
