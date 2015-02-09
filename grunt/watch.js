module.exports = {

    options: {
        spawn: false,
        livereload: true
    },

    scripts: {
        files: [
            'src/scripts/*.js',
            '!kimonoTransform.js'
        ],
        tasks: [
            'jshint',
            'uglify'
        ]
    },

    styles: {
        files: [
            'src/styles/*.css'
        ],
        tasks: [
            'cssmin'
        ]
    },
};
