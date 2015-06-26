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

    it('Logger实例应该有各level方法', function () {
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

    it('level方法会触发transport的log', function () {

        var spy = jasmine.createSpy();

        var TestTransport = Transport.createClass({
            log: spy
        });

        var testTransport = new TestTransport();

        // spyOn(testTransport, 'log');
        // spyOn(testTransport, 'filter').and.returnValue(true);

        dispatcher.addListener(testTransport);

        var logger = Logger.get('kkk');

        logger.debug('aaa');
        // expect(spy.calls.count()).toBe(0);
        // expect(testTransport.filter.calls.count()).toBe(1);
        expect(spy).not.toHaveBeenCalledWith('kkk', 'debug', 'aaa');

        logger.info('aaa');
        // expect(spy.calls.count()).toBe(1);
        // expect(testTransport.filter.calls.count()).toBe(2);
        expect(spy).toHaveBeenCalledWith('kkk', 'info', 'aaa');

        logger.error('aaa');
        // expect(spy.calls.count()).toBe(2);
        // expect(testTransport.filter.calls.count()).toBe(3);
        expect(spy).toHaveBeenCalledWith('kkk', 'error', 'aaa');

    });


});
