module.exports = function(grunt){
    var transport = require('grunt-cmd-transport'),
        style = transport.style.init(grunt),
        text = transport.text.init(grunt),
        script = transport.script.init(grunt);

    grunt.initConfig({
        //监听文件改动自动触发构建工作
        watch: {
            scripts: {
                files: ['public/javascripts/movie/**/*.js'],
                tasks: ['copy','transport','concat','uglify','clean']
            }
        },
        //将dev环境下入口文件拷贝到产出目录
        copy: {
            movie: {
                expand: true,
                //cwd只针对src生效？
                cwd: 'public/javascripts/movie/dist_dev/',
                src: '*',
                dest: 'public/javascripts/movie/dist/'
            }
        },
        //创建临时目录，用于将匿名模块转为具名模块并保持独立地保存在临时目录中
        transport: {
            options: {
                paths: ['public']
            },
            movie: {
                options: {
                    //这里要特别注意模块的id和uri保持一致
                    idleading: '/javascripts/movie/'
                },
                files: [{
                    //相对路径
                    'cwd': 'public/javascripts/movie/',
                    //需要生成具名模块的文件集合,这里要注意的是上面相对路径只能理解成base而不可以在src属性值里使用./或者../这样的路径写法
                    'src': ['dist/a.js','src/b.js','src/c.js','src/d.js','src/e.js'],
                    //生成文件的临时存放目录，该目录与src里各文件带有的目录结构保持一致（默认该临时目录会在工程根目录下）
                    'dest': '.build/movie'
                }]
            }
        },
        //将临时目录下独立的具名模块合并为一个js文件，并将其拷贝到输出目录
        concat: {
            options: {
                include: 'relative'
            },
            movie: {
                files: {
                    'public/javascripts/movie/dist/a.js': ['.build/movie/dist/a.js','.build/movie/src/b.js','.build/movie/src/c.js','.build/movie/src/d.js','.build/movie/src/e.js']
                }
            }
        },
        //压缩这个合并后的js文件
        uglify: {
            movie: {
                files: {
                    'public/javascripts/movie/dist/a.js': ['public/javascripts/movie/dist/a.js']
                }
            }
        },
        //删除临时目录
        clean: {
            build: ['.build']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');


    grunt.registerTask('default',['copy','transport','concat','uglify','clean','watch']);
    //'transport','concat','uglify','clean'
};