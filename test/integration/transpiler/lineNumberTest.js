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
    phpToJS = require('../../..');

describe('Transpiler line numbers test', function () {
    it('should correctly transpile a simple return statement in default (async) mode', function () {
        var ast = {
                name: 'N_PROGRAM',
                statements: [{
                    name: 'N_RETURN_STATEMENT',
                    expression: {
                        name: 'N_INTEGER',
                        number: '4',
                        offset: {
                            line: 8,
                            column: 20
                        }
                    },
                    offset: {
                        line: 6,
                        column: 10
                    }
                }],
                offset: {
                    line: 1,
                    column: 6
                }
            },
            options = {
                path: 'my_module.php',
                lineNumbers: true
            };

        expect(phpToJS.transpile(ast, options)).to.equal(
            'require(\'phpruntime\').compile(function (stdin, stdout, stderr, tools, namespace) {' +
            'var namespaceScope = tools.topLevelNamespaceScope, namespaceResult, scope = tools.topLevelScope, currentClass = null;' +
            'var line;tools.instrument(function () {return line;});' +
            'return (line = 8, tools.valueFactory.createInteger(4));' +
            'return tools.valueFactory.createNull();' +
            '});'
        );
    });

    it('should correctly transpile a root namespace statement in default (async) mode', function () {
        var ast = {
                name: 'N_PROGRAM',
                statements: [{
                    name: 'N_NAMESPACE_STATEMENT',
                    namespace: '',
                    statements: [{
                        name: 'N_RETURN_STATEMENT',
                        expression: {
                            name: 'N_INTEGER',
                            number: '101',
                            offset: {
                                line: 8,
                                column: 20
                            }
                        },
                        offset: {
                            line: 6,
                            column: 10
                        }
                    }],
                    offset: {
                        line: 4,
                        column: 15
                    }
                }],
                offset: {
                    line: 1,
                    column: 6
                }
            },
            options = {
                path: 'my_module.php',
                lineNumbers: true
            };

        expect(phpToJS.transpile(ast, options)).to.equal(
            'require(\'phpruntime\').compile(function (stdin, stdout, stderr, tools, namespace) {' +
            'var namespaceScope = tools.topLevelNamespaceScope, namespaceResult, scope = tools.topLevelScope, currentClass = null;' +
            'var line;tools.instrument(function () {return line;});' +
            'line = 4;return (line = 8, tools.valueFactory.createInteger(101));' +
            'return tools.valueFactory.createNull();' +
            '});'
        );
    });

    it('should correctly transpile global code, functions, methods and closures in default (async) mode', function () {
        var ast = {
                name: 'N_PROGRAM',
                statements: [{
                    name: 'N_RETURN_STATEMENT',
                    expression: {
                        name: 'N_VARIABLE',
                        variable: 'myGlobalCodeVar',
                        offset: {
                            line: 1,
                            column: 20
                        }
                    },
                    offset: {
                        line: 8,
                        column: 10
                    }
                }, {
                    name: 'N_FUNCTION_STATEMENT',
                    func: {
                        name: 'N_STRING',
                        string: 'myFunc',
                        offset: {
                            line: 3,
                            column: 6
                        }
                    },
                    args: [],
                    body: {
                        name: 'N_COMPOUND_STATEMENT',
                        statements: [{
                            name: 'N_RETURN_STATEMENT',
                            expression: {
                                name: 'N_VARIABLE',
                                variable: 'myFunctionVar',
                                offset: {
                                    line: 8,
                                    column: 20
                                }
                            },
                            offset: {
                                line: 8,
                                column: 10
                            }
                        }],
                        offset: {
                            line: 12,
                            column: 17
                        }
                    },
                    offset: {
                        line: 3,
                        column: 6
                    }
                }, {
                    name: 'N_CLASS_STATEMENT',
                    className: 'MyClass',
                    members: [{
                        name: 'N_METHOD_DEFINITION',
                        visibility: 'public',
                        func: {
                            name: 'N_STRING',
                            string: 'myMethod',
                            offset: {
                                line: 6,
                                column: 8
                            }
                        },
                        args: [],
                        body: {
                            name: 'N_COMPOUND_STATEMENT',
                            statements: [{
                                name: 'N_RETURN_STATEMENT',
                                expression: {
                                    name: 'N_VARIABLE',
                                    variable: 'myMethodVar',
                                    offset: {
                                        line: 10,
                                        column: 20
                                    }
                                },
                                offset: {
                                    line: 8,
                                    column: 20
                                }
                            }],
                            offset: {
                                line: 4,
                                column: 5
                            }
                        },
                        offset: {
                            line: 11,
                            column: 14
                        }
                    }],
                    offset: {
                        line: 2,
                        column: 10
                    }
                }, {
                    name: 'N_INTERFACE_STATEMENT',
                    interfaceName: 'MyThingInterface',
                    extend: [
                        'First\\SuperClass',
                        'Second\\SuperClass'
                    ],
                    members: [{
                        name: 'N_INTERFACE_METHOD_DEFINITION',
                        func: {
                            name: 'N_STRING',
                            string: 'doSomethingElse',
                            offset: {
                                line: 3,
                                column: 2
                            }
                        },
                        visibility: 'public',
                        args: [{
                            name: 'N_ARGUMENT',
                            type: 'array',
                            variable: {
                                name: 'N_VARIABLE',
                                variable: 'myBodyArgs',
                                offset: {
                                    line: 2,
                                    column: 5
                                }
                            },
                            offset: {
                                line: 2,
                                column: 4
                            }
                        }],
                        offset: {
                            line: 2,
                            column: 1
                        }
                    }],
                    offset: {
                        line: 3,
                        column: 10
                    }
                }, {
                    name: 'N_RETURN_STATEMENT',
                    expression: {
                        name: 'N_CLOSURE',
                        args: [{
                            name: 'N_ARGUMENT',
                            variable: {
                                name: 'N_VARIABLE',
                                variable: 'myArgVar',
                                offset: {
                                    line: 8,
                                    column: 20
                                }
                            },
                            offset: {
                                line: 8,
                                column: 20
                            }
                        }],
                        bindings: [{
                            name: 'N_VARIABLE',
                            variable: 'myBoundVar',
                            offset: {
                                line: 8,
                                column: 20
                            }
                        }],
                        body: {
                            name: 'N_COMPOUND_STATEMENT',
                            statements: [{
                                name: 'N_RETURN_STATEMENT',
                                expression: {
                                    name: 'N_VARIABLE',
                                    variable: 'myClosureVar',
                                    offset: {
                                        line: 11,
                                        column: 20
                                    }
                                },
                                offset: {
                                    line: 8,
                                    column: 20
                                }
                            }],
                            offset: {
                                line: 8,
                                column: 20
                            }
                        },
                        offset: {
                            line: 12,
                            column: 20
                        }
                    },
                    offset: {
                        line: 8,
                        column: 20
                    }
                }],
                offset: {
                    line: 4,
                    column: 6
                }
            },
            options = {
                path: 'my_module.php',
                lineNumbers: true
            };

        expect(phpToJS.transpile(ast, options)).to.equal(
            'require(\'phpruntime\').compile(function (stdin, stdout, stderr, tools, namespace) {' +
            'var namespaceScope = tools.topLevelNamespaceScope, namespaceResult, scope = tools.topLevelScope, currentClass = null;' +
            'var line;tools.instrument(function () {return line;});' +
            'line = 3;namespace.defineFunction("myFunc", function _myFunc() {' +
            'var scope = this;' +
            'var line;tools.instrument(function () {return line;});' +
            'return (line = 8, scope.getVariable("myFunctionVar").getValue());' +
            '}, namespaceScope);' +
            'line = 2;(function () {var currentClass = namespace.defineClass("MyClass", {' +
            'superClass: null, interfaces: [], staticProperties: {}, properties: {}, methods: {' +
            '"myMethod": {' +
            'isStatic: false, method: function _myMethod() {' +
            'var scope = this;' +
            'var line;tools.instrument(function () {return line;});' +
            'return (line = 10, scope.getVariable("myMethodVar").getValue());' +
            '}' +
            '}}, constants: {}}, namespaceScope);}());' +
            'return (line = 1, scope.getVariable("myGlobalCodeVar").getValue());' +
            'line = 3;(function () {var currentClass = namespace.defineClass("MyThingInterface", {' +
            'superClass: null, ' +
            'interfaces: ["First\\\\SuperClass","Second\\\\SuperClass"], ' +
            'staticProperties: {}, ' +
            'properties: {}, ' +
            'methods: {' +
            '"doSomethingElse": {isStatic: false, abstract: true}' +
            '}, ' +
            'constants: {}' +
            '}, namespaceScope);' +
            '}());' +
            'return (line = 12, tools.createClosure((function (parentScope) { return function ($myArgVar) {' +
            'var scope = this;' +
            'var line;tools.instrument(function () {return line;});' +
            'scope.getVariable("myArgVar").setValue($myArgVar.getValue());' +
            'scope.getVariable("myBoundVar").setValue(parentScope.getVariable("myBoundVar").getValue());' +
            'return (line = 11, scope.getVariable("myClosureVar").getValue());' +
            '}; }(scope)), scope));' +
            'return tools.valueFactory.createNull();' +
            '});'
        );
    });

    it('should throw an exception when line numbers enabled but AST has no node offsets', function () {
        var ast = {
                name: 'N_PROGRAM',
                statements: [{
                    name: 'N_RETURN_STATEMENT',
                    expression: {
                        name: 'N_VARIABLE',
                        variable: 'myGlobalCodeVar'
                    }
                }]
            },
            options = {
                path: 'my_module.php',
                lineNumbers: true
            };

        expect(function () {
            phpToJS.transpile(ast, options);
        }).to.throw('Line number tracking enabled, but AST contains no node offsets');
    });
});
