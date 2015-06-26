/**
 * @file dispatcher spec
 * @author Leon(leon@outlook.com)
 */

/*eslint-env node*/

var u = require('underscore');
var dispatcher = require('../lib/dispatcher');

describe('dispatcher', function () {

    it('有addListener方法', function () {
        expect(u.isFunction(dispatcher.addListener)).toBe(true);
    });

    it('有removeListener方法', function () {
        expect(u.isFunction(dispatcher.removeListener)).toBe(true);
    });

    it('addListener会校验tranport的两个必要的方法', function () {

        expect(function () {
            dispatcher.addListener();
        }).toThrow();

        expect(function () {
            dispatcher.addListener({
                log: u.noop
            });
        }).toThrow();

        expect(function () {
            dispatcher.addListener({
                filter: u.noop
            });
        }).toThrow();

    });

    it('执行dispatch会触发Transport的`filter`和`log`', function () {

        var fakeTransport = {
            level: 'debug',
            log: function () {
            },
            // jasmine的狗蛋spyOn，不管你这里写返回啥
            // 它都不会理你，必须用下边那个returnValue才成
            filter: function (loggerLevel) {
                return true;
            }
        };

        spyOn(fakeTransport, 'log');
        spyOn(fakeTransport, 'filter').and.returnValue(true);

        dispatcher.addListener(fakeTransport);

        dispatcher.dispatch('test', 'debug', 'aaa');

        expect(fakeTransport.filter).toHaveBeenCalledWith('debug');
        expect(fakeTransport.log).toHaveBeenCalledWith('test', 'debug', 'aaa');

        dispatcher.removeListener(fakeTransport);

        dispatcher.dispatch('test', 'info', 'bbb');

        expect(fakeTransport.log).not.toHaveBeenCalledWith('test', 'info', 'bbb');

    });

});
