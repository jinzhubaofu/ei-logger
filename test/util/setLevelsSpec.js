// /**
//  * @file ei-logger/util/setLevels
//  * @author Leon(leon@outlook.com)
//  */

// /*eslint-env node*/

// var u = require('underscore');

// var setLevels = require('../../lib/util/setLevels');

// describe('util/setLevels', function () {

//     it('should be a function', function () {
//         expect(u.isFunction(setLevels)).toBe(true);
//     });

//     it('should attach convience method', function () {

//         var spy = jasmine.createSpy();

//         var target = {
//             log: spy
//         };

//         var levels = {
//             hehe: 1
//         };

//         setLevels(target, levels);

//         expect(u.isFunction(target.hehe)).toBe(true);

//         target.hehe(1);

//         expect(spy).toHaveBeenCalledWith('hehe', 1);

//         var levels2 = {
//             haha: 2
//         };

//         setLevels(target, levels2, levels);

//         expect(target.hehe).not.toBeDefined();
//         expect(u.isFunction(target.haha)).toBe(true);

//         target.haha(2);

//         expect(spy).toHaveBeenCalledWith('haha', 2);

//     });


// });
