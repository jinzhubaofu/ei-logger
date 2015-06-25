/**
 * @file dispatcher
 * @author Leon(leon@outlook.com)
 */

/*eslint-env node*/


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
