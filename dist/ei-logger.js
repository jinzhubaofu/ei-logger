/*! 2015 Baidu Inc. All Rights Reserved */
define('ei-logger/conf/level', [
    'require',
    'exports',
    'module'
], function (require, exports, module) {
    exports.levels = {
        silly: 0,
        debug: 1,
        verbose: 2,
        info: 3,
        warn: 4,
        error: 5
    };
    exports.level = 'info';
});
define('ei-logger/filter', [
    'require',
    'exports',
    'module',
    './conf/level'
], function (require, exports, module) {
    var LEVELS = require('./conf/level').levels;
    module.exports = function (levelName1, levelName2) {
        var levelValue1 = LEVELS[levelName1];
        var levelValue2 = LEVELS[levelName2];
        return levelValue1 >= levelValue2;
    };
});
define('ei-logger/dispatcher', [
    'require',
    'exports',
    'module'
], function (require, exports, module) {
    var handlers = [];
    var dispatcher = {};
    dispatcher.addListener = function (handler) {
        handlers.push(handler);
    };
    dispatcher.removeListener = function (handler) {
        for (var i = handlers.length - 1; i >= 0; --i) {
            if (handlers[i] === handler) {
                handlers.splice(i, 1);
                break;
            }
        }
    };
    dispatcher.dispatch = function () {
        var localHandlers = handlers.slice();
        for (var i = 0, len = localHandlers.length; i < len; ++i) {
            handlers[i].apply(null, arguments);
        }
    };
    module.exports = dispatcher;
});
define('ei-logger/Transport', [
    'require',
    'exports',
    'module',
    'underscore',
    './conf/level',
    './filter',
    './dispatcher'
], function (require, exports, module) {
    var u = require('underscore');
    var LEVEL = require('./conf/level');
    var filter = require('./filter');
    var dispatcher = require('./dispatcher');
    var TransportMixin = {
        init: function (options) {
            u.extend(this, {
                level: LEVEL.level,
                levels: LEVEL.levels
            }, options);
            dispatcher.addListener(u.bind(this.onLog, this));
        },
        onLog: function (level) {
            if (!this.filter(level)) {
                return;
            }
            this.log.apply(this, arguments);
        },
        filter: function (level) {
            return filter(level, this.level);
        }
    };
    var TRANSPORT_CLASS_POOL = {};
    exports.extend = function (options) {
        if (!options || !u.isFunction(options.log) || !options.type) {
            throw new Error('Transport must have a `type` and implement `log` method');
        }
        var type = options.type;
        if (TRANSPORT_CLASS_POOL[type]) {
            throw new Error('Transport ' + type + ' already exists');
        }
        var Transport = function (options) {
            this.init(options);
        };
        u.extend(Transport.prototype, TransportMixin, options);
        Transport.type = type;
        TRANSPORT_CLASS_POOL[type] = Transport;
        return Transport;
    };
    exports.getClass = function (type) {
        return TRANSPORT_CLASS_POOL[type];
    };
});
define('ei-logger/Logger', [
    'require',
    'exports',
    'module',
    'underscore',
    './dispatcher',
    './conf/level'
], function (require, exports, module) {
    var u = require('underscore');
    var dispatcher = require('./dispatcher');
    var LEVELS = require('./conf/level').levels;
    function Logger(name) {
        this.name = name;
        this.setLevels(LEVELS);
    }
    Logger.prototype.log = function () {
        dispatcher.dispatch.apply(dispatcher, arguments);
    };
    Logger.prototype.setLevels = function (levels) {
        u.each(this.levels, function (_, levelName) {
            delete this[levelName];
        }, this);
        u.each(levels, function (levelValue, levelName) {
            this[levelName] = u.partial(this.log, levelName);
        }, this);
        this.levels = levels;
    };
    Logger.get = function (name) {
        name = name || 'root';
        return new Logger(name);
    };
    module.exports = Logger;
});
define('ei-logger/main', [
    'require',
    'exports',
    'module',
    './Transport',
    './Logger'
], function (require, exports, module) {
    exports.Transport = require('./Transport');
    exports.Logger = require('./Logger');
});
/**
 * @file amd wrap
 * @author leon<lupengyu@baidu.com>
 */

define('ei-logger', ['ei-logger/main'], function (main) {
    return main;
});
