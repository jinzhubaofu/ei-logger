/*! 2015 Baidu Inc. All Rights Reserved */
define('ei-logger/dispatcher', [
    'require',
    'exports',
    'module',
    'underscore'
], function (require, exports, module) {
    var transports = [];
    var dispatcher = {};
    var u = require('underscore');
    dispatcher.addListener = function (transport) {
        if (!transport || !u.isFunction(transport.log) || !u.isFunction(transport.filter)) {
            throw new Error('transport must have `log` and `filter` interface');
        }
        transports.push(transport);
    };
    dispatcher.removeListener = function (transport) {
        for (var i = transports.length - 1; i >= 0; --i) {
            if (transports[i] === transport) {
                transports.splice(i, 1);
                break;
            }
        }
    };
    dispatcher.dispatch = function (loggerName, level) {
        var localTransports = transports.slice();
        for (var i = 0, len = localTransports.length; i < len; ++i) {
            var transport = localTransports[i];
            if (transport.filter(level)) {
                transport.log.apply(transport, arguments);
            }
        }
    };
    module.exports = dispatcher;
});
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
    module.exports = function (loggerLevel, transportLevel) {
        return LEVELS[loggerLevel] >= LEVELS[transportLevel];
    };
});
define('ei-logger/Emitter', [
    'require',
    'exports',
    'module',
    'underscore'
], function (require, exports, module) {
    var EMITTER_LISTENER_POOL_ATTR = '__listeners__';
    var u = require('underscore');
    function Emitter() {
    }
    var mixins = {
        on: function (name, handler) {
            var pool = this[EMITTER_LISTENER_POOL_ATTR];
            if (!pool) {
                pool = this[EMITTER_LISTENER_POOL_ATTR] = {};
            }
            var listeners = pool[name];
            if (!listeners) {
                listeners = pool[name] = [];
            }
            listeners.push(handler);
            return this;
        },
        off: function (name, handler) {
            var pool = this[EMITTER_LISTENER_POOL_ATTR];
            if (!pool) {
                return this;
            }
            if (!name) {
                this[EMITTER_LISTENER_POOL_ATTR] = null;
                return;
            }
            var listeners = pool[name];
            if (!listeners) {
                return this;
            }
            if (!handler) {
                pool[name] = [];
            }
            for (var i = listeners.length - 1; i >= 0; --i) {
                if (listeners[i] === handler) {
                    listeners.splice(i, 1);
                    return this;
                }
            }
            return this;
        },
        once: function (name, handler) {
            var me = this;
            var onceHandler = function () {
                me.off(name, onceHandler);
                return handler.apply(me, arguments);
            };
            me.on(name, onceHandler);
        },
        emit: function (name) {
            var pool = this[EMITTER_LISTENER_POOL_ATTR];
            if (!pool) {
                return this;
            }
            var listeners = pool[name];
            if (!listeners || !listeners.length) {
                return this;
            }
            var args = u.toArray(arguments).slice(1);
            listeners = listeners.slice();
            for (var i = 0, len = listeners.length; i < len; ++i) {
                listeners[i].apply(this, args);
            }
        }
    };
    u.extend(Emitter.prototype, mixins);
    Emitter.enable = function (target) {
        if (u.isFunction(target)) {
            target = target.prototype;
        }
        u.extend(target, mixins);
    };
    module.exports = Emitter;
});
define('ei-logger/Transport', [
    'require',
    'exports',
    'module',
    'underscore',
    './conf/level',
    './filter',
    './dispatcher',
    './Emitter'
], function (require, exports, module) {
    var u = require('underscore');
    var LEVEL = require('./conf/level');
    var filter = require('./filter');
    var dispatcher = require('./dispatcher');
    var Emitter = require('./Emitter');
    var TransportMixin = {
        init: u.noop,
        filter: function (loggerLevel) {
            return filter(loggerLevel, this.level);
        }
    };
    Emitter.enable(TransportMixin);
    exports.createClass = function (options) {
        if (!options || !u.isFunction(options.log)) {
            throw new Error('Transport must implement `log` method');
        }
        function Transport(options) {
            u.extend(this, {
                level: LEVEL.level,
                levels: LEVEL.levels
            }, options);
            this.init();
        }
        u.extend(Transport.prototype, TransportMixin, options);
        return Transport;
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
        dispatcher.dispatch.apply(dispatcher, [this.name].concat(u.toArray(arguments)));
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
    'underscore',
    './dispatcher',
    './Transport',
    './Logger'
], function (require, exports, module) {
    var u = require('underscore');
    var dispatcher = require('./dispatcher');
    var Transport = require('./Transport');
    var Logger = require('./Logger');
    var eiLogger = function (name) {
        return Logger.get(name);
    };
    eiLogger.createTransport = function (proto) {
        return Transport.createClass(proto);
    };
    eiLogger.addTransport = function (transport) {
        dispatcher.addListener(transport);
    };
    eiLogger.removeTransport = function (transport) {
        dispatcher.removeListener(transport);
    };
    module.exports = eiLogger;
});
/**
 * @file amd wrap
 * @author leon<lupengyu@baidu.com>
 */

define('ei-logger', ['ei-logger/main'], function (main) {
    return main;
});
