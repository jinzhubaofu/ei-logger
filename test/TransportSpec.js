/**
 * @file TransportSpec
 * @author Leon(leon@outlook.com)
 */

/*eslint-env node*/

var u = require('underscore');
var Transport = require('../lib/Transport');
var dispatcher = require('../lib/dispatcher');

describe('Transport', function () {

    it('getClass', function () {
        expect(typeof Transport.getClass).toBe('function');

        expect(Transport.getClass('aaa')).toBeFalsy();

        var a = Transport.extend({
            type: 'TransportSpecGetClassTest',
            log: u.noop
        });

        expect(a).toBe(Transport.getClass('TransportSpecGetClassTest'));

    });

    it('extend', function () {

        expect(typeof Transport.extend).toBe('function');

        expect(function () {
            Transport.extend();
        }).toThrow();

        expect(function () {
            Transport.extend({
                type: 'aaaaa'
            });
        }).toThrow();


        expect(function () {
            Transport.extend({
                type: 'aaaaa',
                log: null
            });
        }).toThrow();


        var logSpy = jasmine.createSpy('TransportLog');

        var AAA = Transport.extend({
            type: 'aaa',
            log: logSpy
        });

        expect(AAA.type).toBe('aaa');

        var aaa = new AAA();

        expect(u.isFunction(aaa.log)).toBe(true);

    });

    it('Transport的类型全局唯一', function () {

        Transport.extend({
            type: 'a',
            log: u.noop
        });

        expect(function () {
            Transport.extend({
                type: 'a',
                log: u.noop
            });
        }).toThrow();

    });

    it('默认Transport有info级别', function () {

        var DefaultLevelTransport = Transport.extend({
            type: 'DefaultLevelTransport',
            log: function () {
            }
        });

        var a = new DefaultLevelTransport();

        expect(a.level).toBe('info');

    });

    it('设定level级别', function () {

        var CustomLevelTransport = Transport.extend({
            type: 'CustomLevelTransport',
            log: function () {
            }
        });

        var a = new CustomLevelTransport({
            level: 'warn'
        });

        expect(a.level).toBe('warn');

    });

    it('会接收到所有的日志事件', function () {

        var spy = jasmine.createSpy();

        var ConsoleTransport = Transport.extend({
            type: 'ConsoleTransport',
            log: spy
        });

        new ConsoleTransport();

        dispatcher.dispatch('debug', 'aaa');
        expect(spy).not.toHaveBeenCalledWith('debug', 'aaa');

        dispatcher.dispatch('info', 'aaa');
        expect(spy).toHaveBeenCalledWith('info', 'aaa');


    });


});
