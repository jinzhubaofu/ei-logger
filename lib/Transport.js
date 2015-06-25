/**
 * @file ei-logger Transport
 * @author Leon(leon@outlook.com)
 */

/*eslint-env node*/

var u = require('underscore');

var LEVEL = require('./conf/level');
var filter = require('./filter');
var dispatcher = require('./dispatcher');

var TransportMixin = {

    init: function (options) {

        u.extend(
            this,
            {
                level: LEVEL.level,
                levels: LEVEL.levels
            },
            options
        );

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
