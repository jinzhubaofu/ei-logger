/**
 * @file build config
 * @author Leon(leon@outlook.com)
 */

/*eslint-env node*/

/*global LessCompiler:false*/
/*global CssCompressor:false*/
/*global ModuleCompiler:false*/
/*global JsCompressor:false*/
/*global VariableSubstitution:false*/
/*global OutputCleaner:false*/
/*global MD5Renamer:false*/
/*global PathMapper:false*/
/*global StringReplace:false*/
/*global AbstractProcessor:false*/
/*global AbstractProcessor:false*/

exports.input = __dirname;
exports.output = require('path').resolve(__dirname, 'dist');

exports.getProcessors = function () {

    /**
     * @file 添加版权声明的构建器
     * @author zhanglili[otakustay@gmail.com]
     */
    var util = require('util');
    var fs = require('fs');
    var path = require('path');


    /**
     * 添加版权声明的构建器
     *
     * @constructor
     * @param {Object} options 初始化参数
     */
    function AmdWrap(options) {
        AbstractProcessor.call(this, options);
    }
    util.inherits(AmdWrap, AbstractProcessor);

    AmdWrap.DEFAULT_OPTIONS = {
        name: 'amdwrap',
        files: ['*.js']
    };

    /**
     * 构建处理
     *
     * @param {FileInfo} file 文件信息对象
     * @param {ProcessContext} processContext 构建环境对象
     * @param {Function} callback 处理完成回调函数
     */
    AmdWrap.prototype.process = function (file, processContext, callback) {
        var data = 'define(function (require, exports, module) {\n' + file.data + '\n})';
        file.setData(data);
        callback && callback();
    };

    var amdwrap = new AmdWrap();

    var module = new ModuleCompiler({
        bizId: 'ei-logger'
    });

    var cleaner = new OutputCleaner({
        files: ['*.js', '!main.js']
    });

    /**
     * 添加版权声明的构建器
     *
     * @constructor
     * @param {Object} options 初始化参数
     */
    function MainModule(options) {
        AbstractProcessor.call(this, options);
    }

    util.inherits(MainModule, AbstractProcessor);

    MainModule.prototype.name = 'MainModule';

    /**
     * 构建处理
     *
     * @param {FileInfo} file 文件信息对象
     * @param {ProcessContext} processContext 构建环境对象
     * @param {Function} callback 处理完成回调函数
     */
    MainModule.prototype.process = function (file, processContext, callback) {
        file.setData(''
            + file.data
            + '\n'
            + fs.readFileSync(__dirname + '/tool/main.js', 'utf8')
        );

        callback();
    };

    return {
        'default': [
            amdwrap,
            module,
            new MainModule({
                files: ['lib/main.js']
            }),
            new AddCopyright(),
            // replace,
            // js,
            path,
            cleaner
        ]
    };
};

exports.exclude = [
    '*.map',
    'LICENSE',
    'coverage',
    'test',
    'node_modules',
    '.*',
    '*.json',
    '*.log',
    '*.md',
    '*.txt',
    'tool',
    'doc',
    'test',
    'mock',
    '*.conf',
    'dep/est',
    'dep/packages.manifest',
    'dep/*/*/test',
    'dep/*/*/doc',
    'dep/*/*/demo',
    'dep/*/*/tool',
    'dep/*/*/*.md',
    'dep/*/*/package.json',
    'edp-*',
    '.edpproj',
    '.svn',
    '.git',
    '.gitignore',
    '.idea',
    '.project',
    'Desktop.ini',
    'Thumbs.db',
    '.DS_Store',
    '*.tmp',
    '*.bak',
    '*.swp'
];

exports.injectProcessor = function (processors) {
    for (var key in processors) {
        global[key] = processors[key];
    }
};
