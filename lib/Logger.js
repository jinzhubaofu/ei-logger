/**
 * @file ei-logger Logger
 * @author Leon(leon@outlook.com)
 */

/*eslint-env node*/

var u = require('underscore');
var dispatcher = require('./dispatcher');
var LEVELS = require('./conf/level').levels;

function Logger(name) {
    this.name = name;
    this.setLevels(LEVELS);
}

Logger.prototype.log = function () {
    dispatcher.dispatch.apply(
        dispatcher,
        [this.name].concat(u.toArray(arguments))
    );
};

Logger.prototype.setLevels = function (levels) {

    u.each(
        this.levels,
        function (_, levelName) {
            delete this[levelName];
        },
        this
    );

    u.each(
        levels,
        function (levelValue, levelName) {
            this[levelName] = u.partial(this.log, levelName);
        },
        this
    );

    this.levels = levels;

};


Logger.get = function (name) {
    name = name || 'root';
    return new Logger(name);
};

module.exports = Logger;
