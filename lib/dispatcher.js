/**
 * @file dispatcher
 * @author Leon(leon@outlook.com)
 */

/*eslint-env node*/


var transports = [];

var dispatcher = {};

var u = require('underscore');

dispatcher.addListener = function (transport) {
    if (
        !transport
        || !u.isFunction(transport.log)
        || !u.isFunction(transport.filter)
    ) {
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
