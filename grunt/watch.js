module.exports = {

    options: {
        spawn: false
    },

    src: {
        files: [
            'src/index.html'
        ],
        tasks: [
            'copy:index'
        ]
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
