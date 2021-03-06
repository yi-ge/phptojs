/*
 * PHPToJS - PHP-to-JavaScript transpiler
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/uniter/phptojs
 *
 * Released under the MIT license
 * https://github.com/uniter/phptojs/raw/master/MIT-LICENSE.txt
 */

'use strict';

var expect = require('chai').expect,
    phpToJS = require('../../../..');

describe('Transpiler function statement test', function () {
    it('should correctly transpile an empty function in default (async) mode', function () {
        var ast = {
            name: 'N_PROGRAM',
            statements: [{
                name: 'N_FUNCTION_STATEMENT',
                func: {
                    name: 'N_STRING',
                    string: 'gogo'
                },
                args: [],
                body: {
                    name: 'N_COMPOUND_STATEMENT',
                    statements: []
                }
            }]
        };

        expect(phpToJS.transpile(ast)).to.equal(
            'require(\'phpruntime\').compile(function (stdin, stdout, stderr, tools, namespace) {' +
            'var namespaceScope = tools.topLevelNamespaceScope, namespaceResult, scope = tools.topLevelScope, currentClass = null;' +
            'namespace.defineFunction("gogo", function _gogo() {var scope = this;}, namespaceScope);' +
            'return tools.valueFactory.createNull();' +
            '});'
        );
    });

    it('should correctly transpile a function with a by-reference parameter in default (async) mode', function () {
        var ast = {
            name: 'N_PROGRAM',
            statements: [{
                name: 'N_FUNCTION_STATEMENT',
                func: {
                    name: 'N_STRING',
                    string: 'gogo'
                },
                args: [{
                    name: 'N_ARGUMENT',
                    type: 'array',
                    variable: {
                        name: 'N_REFERENCE',
                        operand: {
                            name: 'N_VARIABLE',
                            variable: 'myByRefArg'
                        }
                    }
                }],
                body: {
                    name: 'N_COMPOUND_STATEMENT',
                    statements: []
                }
            }]
        };

        expect(phpToJS.transpile(ast)).to.equal(
            'require(\'phpruntime\').compile(function (stdin, stdout, stderr, tools, namespace) {' +
            'var namespaceScope = tools.topLevelNamespaceScope, namespaceResult, scope = tools.topLevelScope, currentClass = null;' +
            'namespace.defineFunction("gogo", function _gogo($myByRefArg) {' +
            'var scope = this;' +
            'scope.getVariable("myByRefArg").setReference($myByRefArg.getReference());' +
            '}, namespaceScope);' +
            'return tools.valueFactory.createNull();' +
            '});'
        );
    });
});
