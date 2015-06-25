/**
 * @file file
 * @author Leon(leon@outlook.com)
 */

/*eslint-env node*/

var u = require('underscore');
var Logger = require('../lib/Logger');
var dispatcher = require('../lib/dispatcher');
var Transport = require('../lib/Transport');
var LEVELS = require('../lib/conf/level');

describe('Logger', function () {

    it('应该是一个类', function () {
        expect(u.isFunction(Logger)).toBe(true);
    });

    it('应该有静态方法get', function () {
        expect(u.isFunction(Logger.get)).toBe(true);
    });

    it('.get()可以得到一个logger实例', function () {
        expect(Logger.get('a') instanceof Logger).toBe(true);
    });


    it('logger有`log`方法', function () {
        var logger = Logger.get('a');
        expect(u.isFunction(logger.log)).toBe(true);
    });

    it('Logger实例应该有`debug` `info` `warning` `error`', function () {
        var logger = Logger.get('test');
        u.each(LEVELS.levels, function (_, name) {
            expect(u.isFunction(logger[name])).toBe(true);
        });
    });

    it('默认名称', function () {
        expect(Logger.get().name).toBe('root');
    });

    it('setLevels', function () {

        var logger = Logger.get('hehe');

        expect(u.isFunction(logger.setLevels)).toBe(true);

        logger.setLevels({
            hehe: 1,
            haha: 2
        });

        expect(u.isFunction(logger.debug)).toBe(false);
        expect(u.isFunction(logger.hehe)).toBe(true);
        expect(u.isFunction(logger.haha)).toBe(true);

    });

    it('log会触发dispatcher释放事件', function () {
        var spy = jasmine.createSpy();
        dispatcher.addListener(spy);
        var logger = Logger.get('aaa');
        logger.log('info', 'aaa');
        expect(spy).toHaveBeenCalledWith('info', 'aaa');
    });

    it('level方法会触发dispatcher事件', function () {
        var spy = jasmine.createSpy();
        dispatcher.addListener(spy);
        var logger = Logger.get('a');
        u.each(
            LEVELS.levels,
            function (_, levelName) {
                logger[levelName]('aaa');
                expect(spy).toHaveBeenCalledWith(levelName, 'aaa');
            }
        );
    });

    it('level方法会触发transport的log', function () {

        var TestTransport = Transport.extend({
            type: 'testtesttest',
            log: function () {
            }
        });

        var proto = TestTransport.prototype;

        spyOn(proto, 'log');

        new TestTransport({
            level: 'warn'
        });

        new TestTransport({
            level: 'debug'
        });

        var logger = Logger.get('aaa');

        var log = TestTransport.prototype.log;

        logger.debug('aaa');
        expect(log.calls.count()).toBe(1);
        expect(log).toHaveBeenCalledWith('debug', 'aaa');

        logger.info('aaa');
        expect(log.calls.count()).toBe(2);
        expect(log).toHaveBeenCalledWith('info', 'aaa');

        logger.error('aaa');
        expect(log.calls.count()).toBe(4);
        expect(log).toHaveBeenCalledWith('error', 'aaa');

    });


});
