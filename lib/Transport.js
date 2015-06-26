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
    },

    /**
     * 记录日志
     * @param  {string} loggerName logger名称
     * @param  {string} level      level名称
     * @param  {*?}     messages
     */
    // log: function (loggerName, level, message1, message2, ...) {
    // },

    filter: function (loggerLevel) {
        return filter(loggerLevel, this.level);
    }

};

exports.createClass = function (options) {

    if (!options || !u.isFunction(options.log)) {
        throw new Error('Transport must implement `log` method');
    }

    function Transport(options) {
        this.init(options);
    }

    u.extend(Transport.prototype, TransportMixin, options);

    return Transport;
};
