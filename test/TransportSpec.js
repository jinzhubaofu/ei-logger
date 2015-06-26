/**
 * @file TransportSpec
 * @author Leon(leon@outlook.com)
 */

/*eslint-env node*/

var u = require('underscore');
var Transport = require('../lib/Transport');
var dispatcher = require('../lib/dispatcher');

describe('Transport', function () {

    describe('createClass', function () {

        it('createClass', function () {
            expect(typeof Transport.createClass).toBe('function');
        });


        it('必须实现`log`方法', function () {

            expect(function () {
                Transport.createClass();
            }).toThrow();

            expect(function () {
                Transport.createClass({
                    log: null
                });
            }).toThrow();

        });
    });

    it('transport实例必须有`log`方法', function () {

        var a = u.noop;

        var TestTransport = Transport.createClass({
            log: a
        });

        var test = new TestTransport();

        expect(test.log).toBe(a);

    });

    it('transport实例必须有`filter`方法', function () {

        var TestTransport = Transport.createClass({
            log: u.noop
        });

        var test = new TestTransport();

        expect(u.isFunction(test.filter)).toBe(true);

    });

    it('默认Transport有info级别', function () {

        var DefaultLevelTransport = Transport.createClass({
            log: function () {
            }
        });

        var a = new DefaultLevelTransport();

        expect(a.level).toBe('info');

    });

    it('设定level级别', function () {

        var CustomLevelTransport = Transport.createClass({
            log: function () {
            }
        });

        var a = new CustomLevelTransport({
            level: 'warn'
        });

        expect(a.level).toBe('warn');

    });

    it('会接收到所有的日志事件，并进行过滤', function () {

        var spy = jasmine.createSpy();

        var ConsoleTransport = Transport.createClass({
            log: spy
        });

        dispatcher.addListener(new ConsoleTransport());

        dispatcher.dispatch('test', 'debug', 'aaa');
        expect(spy).not.toHaveBeenCalledWith('test', 'debug', 'aaa');

        dispatcher.dispatch('test', 'info', 'aaa');
        expect(spy).toHaveBeenCalledWith('test', 'info', 'aaa');

    });


});
