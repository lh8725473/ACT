module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      'dark': {
        files: {
          'src/admin/admin.css': 'src/admin/admin.less',
          'src/app/app.css': 'src/app/app.less',
          'src/link-share/link-share.css': 'src/link-share/link-share.less'
        },
        options: {
          modifyVars: {
            theme: 'dark'
          }
        }
      },
      'default': {
        files: {
          'src/admin/admin.css': 'src/admin/admin.less',
          'src/app/app.css': 'src/app/app.less',
          'src/link-share/link-share.css': 'src/link-share/link-share.less'
        },
        options: {
          modifyVars: {
            theme: 'default'
          }
        }
      }
    },
    watch: {
      less: {
        files: ['src/**/*.less'],
        tasks: ['less:default'],
        options: {
          atBegin: true
        }
      }
    },
    copy: {
      html: {
        files: [{
          expand: true,
          cwd: './',
          src: ['*.html'],
          dest: 'production/'
        }]
      },
      images: {
        files: [{
          expand: true,
          cwd: './',
          src: ['images/**'],
          dest: 'production/'
        }]
      },
      homeFonts: {
        files: [{
          expand: true,
          cwd: './bower_components/bootstrap/dist/',
          src: ['fonts/**'],
          dest: 'production/bower_components/bootstrap/'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: './bower_components/bootstrap/dist/',
          src: ['fonts/**'],
          dest: 'production/css/'
        }]
      },
      ZeroClipboard: {
        files: [{
          expand: true,
          cwd: './',
          src: ['bower_components/zeroclipboard/dist/ZeroClipboard.swf'],
          dest: 'production/'
        }]
      },
      umeditor : {
        files: [{
          expand: true,
          cwd: './',
          src: ['bower_components/umeditor/**'],
          dest: 'production/'
        }]
      },
      ueditor : {
        files: [{
          expand: true,
          cwd: './',
          src: ['bower_components/ueditor/**'],
          dest: 'production/'
        }]
      }
    },
    clean: {
      build: ['build/'],
      production: ['production/'],
      umeditor: ['production/bower_components/umeditor'],
      umeditor: ['production/bower_components/ueditor']

    },
    useminPrepare: {
      html: [
        'production/about.html',
        'production/admin.html',
        'production/index.html',
        'production/login.html',
        'production/login-en.html',
        'production/home.html',
        'production/apps.html',
        'production/invite.html',
        'production/link.html',
        'production/findpassword.html',
        'production/regist.html',
        'production/renew.html',
        'production/pricing.html',
        'production/regist-success.html',
        'production/resetpassword.html',
        'production/verify-failed.html',
        'production/verify-success.html'
      ],
      options: {
        root: './',
        dest: 'production/'
      }
    },
    filerev: {
      production: {
        src: 'production/**/*.{css,js}'
      }
    },
    usemin: {
      html: [
        'production/about.html',
        'production/admin.html',
        'production/index.html',
        'production/login.html',
        'production/login-en.html',
        'production/home.html',
        'production/apps.html',
        'production/invite.html',
        'production/link.html',
        'production/findpassword.html',
        'production/regist.html',
        'production/renew.html',
        'production/pricing.html',
        'production/regist-success.html',
        'production/resetpassword.html',
        'production/verify-failed.html',
        'production/verify-success.html'
      ]
    },
    inline_angular_templates: {
      production: {
        files: {
          'production/admin.html': ['src/admin/**/*.html', 'src/global/**/*.html'],
          'production/index.html': ['src/app/**/*.html', 'src/global/**/*.html'],
          'production/link.html': ['src/link-share/**/*.html', 'src/global/**/*.html']
        }
      },
      options: {
        unescape: {
          '&apos;': '\''
        }
      }
    }
  })
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-usemin')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-filerev')
  grunt.loadNpmTasks('grunt-inline-angular-templates')

  grunt.registerTask('build', [
    'clean',
    'less',
    'copy',
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'copy:umeditor',
    'copy:ueditor',
    'inline_angular_templates'
  ])
}