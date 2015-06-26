/**
 * @file ei-logger main
 * @author Leon(leon@outlook.com)
 */

/*eslint-env node*/

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
