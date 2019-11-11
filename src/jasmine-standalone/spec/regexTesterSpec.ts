/// <reference path="../../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../../Scripts/typings/angularjs/angular-mocks.d.ts"/>
/// <reference path="../../Scripts/typings/bootstrap/index.d.ts"/>
/// <reference path="../../Scripts/typings/jasmine/jasmine.d.ts"/>
/// <reference path="../../app.ts"/>
/// <reference path="../../regexTester/regexTester.ts"/>

interface IRegexFlagsTestData {
    flags: string;
    global: boolean;
    ignoreCase: boolean;
    multiline: boolean;
    sticky: boolean;
    unicode: boolean;
}
interface IRegexFlagsConstructorTestData extends IRegexFlagsTestData {
    arg0: string | null | undefined;
}
describe('MyGitHubPages regexTester', function () {
    describe('RegexFlags', function () {
        describe('Constructor', function () {
            it('new regexTester.RegexFlags()', function () {
                const flags: regexTester.RegexFlags = new regexTester.RegexFlags();
                expect(flags.flags).toEqual('', '#flags');
                expect(flags.global).toEqual(false, '#global');
                expect(flags.ignoreCase).toEqual(false, '#ignoreCase');
                expect(flags.multiline).toEqual(false, '#multiline');
                expect(flags.sticky).toEqual(false, '#sticky');
                expect(flags.unicode).toEqual(false, '#unicode');
            });
            it('new regexTester.RegexFlags(undefined)', function () {
                const flags: regexTester.RegexFlags = new regexTester.RegexFlags(undefined);
                expect(flags.flags).toEqual('', '#flags');
                expect(flags.global).toEqual(false, '#global');
                expect(flags.ignoreCase).toEqual(false, '#ignoreCase');
                expect(flags.multiline).toEqual(false, '#multiline');
                expect(flags.sticky).toEqual(false, '#sticky');
                expect(flags.unicode).toEqual(false, '#unicode');
            });
            it('new regexTester.RegexFlags(null)', function () {
                const flags: regexTester.RegexFlags = new regexTester.RegexFlags(null);
                expect(flags.flags).toEqual('', '#flags');
                expect(flags.global).toEqual(false, '#global');
                expect(flags.ignoreCase).toEqual(false, '#ignoreCase');
                expect(flags.multiline).toEqual(false, '#multiline');
                expect(flags.sticky).toEqual(false, '#sticky');
                expect(flags.unicode).toEqual(false, '#unicode');
            });
            [
                <IRegexFlagsConstructorTestData>{ arg0: '', flags: '', global: false, ignoreCase: false, multiline: false, sticky: false,
                    unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: ' ', flags: '', global: false, ignoreCase: false, multiline: false, sticky: false,
                    unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'a', flags: '', global: false, ignoreCase: false, multiline: false, sticky: false,
                    unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'g', flags: 'g', global: true, ignoreCase: false, multiline: false, sticky: false,
                unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'i', flags: 'i', global: false, ignoreCase: true, multiline: false, sticky: false,
                    unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'm', flags: 'm', global: false, ignoreCase: false, multiline: true, sticky: false,
                    unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'u', flags: 'u', global: false, ignoreCase: false, multiline: false, sticky: false,
                    unicode: true },
                <IRegexFlagsConstructorTestData>{ arg0: 'y', flags: 'y', global: false, ignoreCase: false, multiline: false, sticky: true,
                    unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: ' g', flags: 'g', global: true, ignoreCase: false, multiline: false, sticky: false,
                    unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'i ', flags: 'i', global: false, ignoreCase: true, multiline: false, sticky: false,
                    unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'am', flags: 'm', global: false, ignoreCase: false, multiline: true, sticky: false,
                    unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'ua', flags: 'u', global: false, ignoreCase: false, multiline: false, sticky: false,
                    unicode: true },
                <IRegexFlagsConstructorTestData>{ arg0: 'yy', flags: 'y', global: false, ignoreCase: false, multiline: false, sticky: true,
                    unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'gi', flags: 'gi', global: true, ignoreCase: true, multiline: false, sticky: false,
                    unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'mi', flags: 'mi', global: false, ignoreCase: true, multiline: true, sticky: false,
                    unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'mgiyu', flags: 'mgiyu', global: true, ignoreCase: true, multiline: true,
                    sticky: true, unicode: true },
                <IRegexFlagsConstructorTestData>{ arg0: 'gimuy', flags: 'gimuy', global: true, ignoreCase: true, multiline: true,
                    sticky: true, unicode: true },
                <IRegexFlagsConstructorTestData>{ arg0: ' uyixgmz', flags: 'uyigm', global: true, ignoreCase: true, multiline: true,
                    sticky: true, unicode: true }
            ].forEach(function (testData: IRegexFlagsConstructorTestData) {
                it('new regexTester.RegexFlags(' + JSON.stringify(testData.arg0) + ')', function () {
                    const flags: regexTester.RegexFlags = new regexTester.RegexFlags(testData.arg0);
                    expect(flags.flags).toEqual(testData.flags, '#flags');
                    expect(flags.global).toEqual(testData.global, '#global');
                    expect(flags.ignoreCase).toEqual(testData.ignoreCase, '#ignoreCase');
                    expect(flags.multiline).toEqual(testData.multiline, '#multiline');
                    expect(flags.sticky).toEqual(testData.sticky, '#sticky');
                    expect(flags.unicode).toEqual(testData.unicode, '#unicode');
                });
            });
        });

        describe('Modifiers', function () {
            ['', 'g', 'i', 'm', 'u', 'y'].forEach(function (f: string) {
                describe('(' + JSON.stringify(f) + ')', function () {
                    describe('setGlobal', function () {
                        describe('true', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); } catch (err) {
                                    source = err;
                                    pending('Constructor failed: ' + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setGlobal(true);
                                        if (typeof target !== 'object' || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error('setGlobal failed');
                                    } else
                                        target = 'Constructor failed: ' + source;
                                } catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    const obj: regexTester.RegexFlags = source.setGlobal(true);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.global).toEqual(f == 'g');
                                else
                                    pending(source);
                            });
                            it('target.global', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.global).toEqual(true);
                                else
                                    pending(target);
                            });
                            it('source.ignoreCase', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.ignoreCase).toEqual(f == 'i');
                                else
                                    pending(source);
                            });
                            it('target.ignoreCase', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.ignoreCase).toEqual(f == 'i');
                                else
                                    pending(target);
                            });
                            it('source.multiline', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.multiline).toEqual(f == 'm');
                                else
                                    pending(source);
                            });
                            it('target.multiline', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.multiline).toEqual(f == 'm');
                                else
                                    pending(target);
                            });
                            it('source.unicode', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.unicode).toEqual(f == 'u');
                                else
                                    pending(source);
                            });
                            it('target.unicode', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.unicode).toEqual(f == 'u');
                                else
                                    pending(target);
                            });
                            it('source.sticky', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.sticky).toEqual(f == 'y');
                                else
                                    pending(source);
                            });
                            it('target.sticky', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.sticky).toEqual(f == 'y');
                                else
                                    pending(target);
                            });
                            it('source.flags', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.flags).toEqual(f);
                                else
                                    pending(source);
                            });
                            it('target.flags', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.flags).toEqual((f == 'g') ? f : f + 'g');
                                else
                                    pending(target);
                            });
                        });
                        describe('false', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); } catch (err) {
                                    source = err;
                                    pending('Constructor failed: ' + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setGlobal(false);
                                        if (typeof target !== 'object' || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error('setGlobal failed');
                                    } else
                                        target = 'Constructor failed: ' + source;
                                } catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    const obj: regexTester.RegexFlags = source.setGlobal(false);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.global).toEqual(f == 'g');
                                else
                                    pending(source);
                            });
                            it('target.global', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.global).toEqual(false);
                                else
                                    pending(target);
                            });
                            it('source.ignoreCase', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.ignoreCase).toEqual(f == 'i');
                                else
                                    pending(source);
                            });
                            it('target.ignoreCase', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.ignoreCase).toEqual(f == 'i');
                                else
                                    pending(target);
                            });
                            it('source.multiline', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.multiline).toEqual(f == 'm');
                                else
                                    pending(source);
                            });
                            it('target.multiline', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.multiline).toEqual(f == 'm');
                                else
                                    pending(target);
                            });
                            it('source.unicode', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.unicode).toEqual(f == 'u');
                                else
                                    pending(source);
                            });
                            it('target.unicode', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.unicode).toEqual(f == 'u');
                                else
                                    pending(target);
                            });
                            it('source.sticky', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.sticky).toEqual(f == 'y');
                                else
                                    pending(source);
                            });
                            it('target.sticky', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.sticky).toEqual(f == 'y');
                                else
                                    pending(target);
                            });
                            it('source.flags', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.flags).toEqual(f);
                                else
                                    pending(source);
                            });
                            it('target.flags', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.flags).toEqual((f == 'g') ? '' : f);
                                else
                                    pending(target);
                            });
                        });
                    });

                    describe('setIgnoreCase', function () {
                        describe('true', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); } catch (err) {
                                    source = err;
                                    pending('Constructor failed: ' + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setIgnoreCase(true);
                                        if (typeof target !== 'object' || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error('setIgnoreCase failed');
                                    } else
                                        target = 'Constructor failed: ' + source;
                                } catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    const obj: regexTester.RegexFlags = source.setIgnoreCase(true);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.global).toEqual(f == 'g');
                                else
                                    pending(source);
                            });
                            it('target.global', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.global).toEqual(f == 'g');
                                else
                                    pending(target);
                            });
                            it('source.ignoreCase', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.ignoreCase).toEqual(f == 'i');
                                    else
                                        pending(source);
                                });
                            it('target.ignoreCase', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.ignoreCase).toEqual(true);
                                else
                                    pending(target);
                            });
                            it('source.multiline', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.multiline).toEqual(f == 'm');
                                    else
                                        pending(source);
                                });
                            it('target.multiline', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.multiline).toEqual(f == 'm');
                                else
                                    pending(target);
                            });
                            it('source.unicode', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.unicode).toEqual(f == 'u');
                                else
                                    pending(source);
                            });
                            it('target.unicode', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.unicode).toEqual(f == 'u');
                                else
                                    pending(target);
                            });
                            it('source.sticky', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.sticky).toEqual(f == 'y');
                                else
                                    pending(source);
                            });
                            it('target.sticky', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.sticky).toEqual(f == 'y');
                                else
                                    pending(target);
                            });
                            it('source.flags', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.flags).toEqual(f);
                                else
                                    pending(source);
                            });
                            it('target.flags', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.flags).toEqual((f == 'i') ? f : f + 'i');
                                else
                                    pending(target);
                            });
                        });
                        describe('false', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); } catch (err) {
                                    source = err;
                                    pending('Constructor failed: ' + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setIgnoreCase(false);
                                        if (typeof target !== 'object' || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error('setIgnoreCase failed');
                                    } else
                                        target = 'Constructor failed: ' + source;
                                } catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    const obj: regexTester.RegexFlags = source.setIgnoreCase(false);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.global).toEqual(f == 'g');
                                else
                                    pending(source);
                            });
                            it('target.global', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.global).toEqual(f == 'g');
                                else
                                    pending(target);
                            });
                            it('source.ignoreCase', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.ignoreCase).toEqual(f == 'i');
                                else
                                    pending(source);
                            });
                            it('target.ignoreCase', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.ignoreCase).toEqual(false);
                                else
                                    pending(target);
                            });
                            it('source.multiline', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.multiline).toEqual(f == 'm');
                                else
                                    pending(source);
                            });
                            it('target.multiline', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.multiline).toEqual(f == 'm');
                                else
                                    pending(target);
                            });
                            it('source.unicode', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.unicode).toEqual(f == 'u');
                                else
                                    pending(source);
                            });
                            it('target.unicode', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.unicode).toEqual(f == 'u');
                                else
                                    pending(target);
                            });
                            it('source.sticky', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.sticky).toEqual(f == 'y');
                                else
                                    pending(source);
                            });
                            it('target.sticky', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.sticky).toEqual(f == 'y');
                                else
                                    pending(target);
                            });
                            it('source.flags', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.flags).toEqual(f);
                                else
                                    pending(source);
                            });
                            it('target.flags', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.flags).toEqual((f == 'i') ? '' : f);
                                else
                                    pending(target);
                            });
                        });
                    });

                    describe('setMultiline', function () {
                        describe('true', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); } catch (err) {
                                    source = err;
                                    pending('Constructor failed: ' + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setMultiline(true);
                                        if (typeof target !== 'object' || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error('setMultiline failed');
                                    } else
                                        target = 'Constructor failed: ' + source;
                                } catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    const obj: regexTester.RegexFlags = source.setMultiline(true);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.global).toEqual(f == 'g');
                                else
                                    pending(source);
                            });
                            it('target.global', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.global).toEqual(f == 'g');
                                else
                                    pending(target);
                            });
                            it('source.ignoreCase', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.ignoreCase).toEqual(f == 'i');
                                else
                                    pending(source);
                            });
                            it('target.ignoreCase', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.ignoreCase).toEqual(f == 'i');
                                else
                                    pending(target);
                            });
                            it('source.multiline', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.multiline).toEqual(f == 'm');
                                else
                                    pending(source);
                            });
                            it('target.multiline', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.multiline).toEqual(true);
                                else
                                    pending(target);
                            });
                            it('source.unicode', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.unicode).toEqual(f == 'u');
                                else
                                    pending(source);
                            });
                            it('target.unicode', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.unicode).toEqual(f == 'u');
                                else
                                    pending(target);
                            });
                            it('source.sticky', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.sticky).toEqual(f == 'y');
                                else
                                    pending(source);
                            });
                            it('target.sticky', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.sticky).toEqual(f == 'y');
                                else
                                    pending(target);
                            });
                            it('source.flags', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.flags).toEqual(f);
                                else
                                    pending(source);
                            });
                            it('target.flags', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.flags).toEqual((f == 'm') ? f : f + 'm');
                                else
                                    pending(target);
                            });
                        });
                        describe('false', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); } catch (err) {
                                    source = err;
                                    pending('Constructor failed: ' + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setMultiline(false);
                                        if (typeof target !== 'object' || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error('setMultiline failed');
                                    } else
                                        target = 'Constructor failed: ' + source;
                                } catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    const obj: regexTester.RegexFlags = source.setMultiline(false);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.global).toEqual(f == 'g');
                                else
                                    pending(source);
                            });
                            it('target.global', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.global).toEqual(f == 'g');
                                else
                                    pending(target);
                            });
                            it('source.ignoreCase', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.ignoreCase).toEqual(f == 'i');
                                else
                                    pending(source);
                            });
                            it('target.ignoreCase', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.ignoreCase).toEqual(f == 'i');
                                else
                                    pending(target);
                            });
                            it('source.multiline', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.multiline).toEqual(f == 'm');
                                else
                                    pending(source);
                            });
                            it('target.multiline', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.multiline).toEqual(false);
                                else
                                    pending(target);
                            });
                            it('source.unicode', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.unicode).toEqual(f == 'u');
                                else
                                    pending(source);
                            });
                            it('target.unicode', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.unicode).toEqual(f == 'u');
                                else
                                    pending(target);
                            });
                            it('source.sticky', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.sticky).toEqual(f == 'y');
                                else
                                    pending(source);
                            });
                            it('target.sticky', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.sticky).toEqual(f == 'y');
                                else
                                    pending(target);
                            });
                            it('source.flags', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.flags).toEqual(f);
                                else
                                    pending(source);
                            });
                            it('target.flags', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.flags).toEqual((f == 'm') ? '' : f);
                                else
                                    pending(target);
                            });
                        });
                    });

                    describe('setUnicode', function () {
                        describe('true', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); } catch (err) {
                                    source = err;
                                    pending('Constructor failed: ' + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setUnicode(true);
                                        if (typeof target !== 'object' || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error('setUnicode failed');
                                    } else
                                        target = 'Constructor failed: ' + source;
                                } catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    const obj: regexTester.RegexFlags = source.setUnicode(true);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.global).toEqual(f == 'g');
                                else
                                    pending(source);
                            });
                            it('target.global', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.global).toEqual(f == 'g');
                                else
                                    pending(target);
                            });
                            it('source.ignoreCase', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.ignoreCase).toEqual(f == 'i');
                                else
                                    pending(source);
                            });
                            it('target.ignoreCase', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.ignoreCase).toEqual(f == 'i');
                                else
                                    pending(target);
                            });
                            it('source.multiline', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.multiline).toEqual(f == 'm');
                                else
                                    pending(source);
                            });
                            it('target.multiline', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.multiline).toEqual(f == 'm');
                                else
                                    pending(target);
                            });
                            it('source.unicode', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.unicode).toEqual(f == 'u');
                                else
                                    pending(source);
                            });
                            it('target.unicode', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.unicode).toEqual(true);
                                else
                                    pending(target);
                            });
                            it('source.sticky', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.sticky).toEqual(f == 'y');
                                else
                                    pending(source);
                            });
                            it('target.sticky', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.sticky).toEqual(f == 'y');
                                else
                                    pending(target);
                            });
                            it('source.flags', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.flags).toEqual(f);
                                else
                                    pending(source);
                            });
                            it('target.flags', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.flags).toEqual((f == 'u') ? f : f + 'u');
                                else
                                    pending(target);
                            });
                        });
                        describe('false', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); } catch (err) {
                                    source = err;
                                    pending('Constructor failed: ' + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setUnicode(false);
                                        if (typeof target !== 'object' || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error('setUnicode failed');
                                    } else
                                        target = 'Constructor failed: ' + source;
                                } catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    const obj: regexTester.RegexFlags = source.setUnicode(false);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.global).toEqual(f == 'g');
                                else
                                    pending(source);
                            });
                            it('target.global', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.global).toEqual(f == 'g');
                                else
                                    pending(target);
                            });
                            it('source.ignoreCase', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.ignoreCase).toEqual(f == 'i');
                                else
                                    pending(source);
                            });
                            it('target.ignoreCase', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.ignoreCase).toEqual(f == 'i');
                                else
                                    pending(target);
                            });
                            it('source.multiline', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.multiline).toEqual(f == 'm');
                                else
                                    pending(source);
                            });
                            it('target.multiline', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.multiline).toEqual(f == 'm');
                                else
                                    pending(target);
                            });
                            it('source.unicode', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.unicode).toEqual(f == 'u');
                                else
                                    pending(source);
                            });
                            it('target.unicode', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.unicode).toEqual(false);
                                else
                                    pending(target);
                            });
                            it('source.sticky', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.sticky).toEqual(f == 'y');
                                else
                                    pending(source);
                            });
                            it('target.sticky', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.sticky).toEqual(f == 'y');
                                else
                                    pending(target);
                            });
                            it('source.flags', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.flags).toEqual(f);
                                else
                                    pending(source);
                            });
                            it('target.flags', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.flags).toEqual((f == 'u') ? '' : f);
                                else
                                    pending(target);
                            });
                        });
                    });

                    describe('setSticky', function () {
                        describe('true', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); } catch (err) {
                                    source = err;
                                    pending('Constructor failed: ' + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setSticky(true);
                                        if (typeof target !== 'object' || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error('setSticky failed');
                                    } else
                                        target = 'Constructor failed: ' + source;
                                } catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    const obj: regexTester.RegexFlags = source.setSticky(true);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.global).toEqual(f == 'g');
                                else
                                    pending(source);
                            });
                            it('target.global', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.global).toEqual(f == 'g');
                                else
                                    pending(target);
                            });
                            it('source.ignoreCase', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.ignoreCase).toEqual(f == 'i');
                                else
                                    pending(source);
                            });
                            it('target.ignoreCase', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.ignoreCase).toEqual(f == 'i');
                                else
                                    pending(target);
                            });
                            it('source.multiline', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.multiline).toEqual(f == 'm');
                                else
                                    pending(source);
                            });
                            it('target.multiline', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.multiline).toEqual(f == 'm');
                                else
                                    pending(target);
                            });
                            it('source.unicode', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.unicode).toEqual(f == 'u');
                                else
                                    pending(source);
                            });
                            it('target.unicode', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.unicode).toEqual(f == 'u');
                                else
                                    pending(target);
                            });
                            it('source.sticky', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.sticky).toEqual(f == 'y');
                                else
                                    pending(source);
                            });
                            it('target.sticky', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.sticky).toEqual(true);
                                else
                                    pending(target);
                            });
                            it('source.flags', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.flags).toEqual(f);
                                else
                                    pending(source);
                            });
                            it('target.flags', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.flags).toEqual((f == 'y') ? f : f + 'y');
                                else
                                    pending(target);
                            });
                        });
                        describe('false', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); } catch (err) {
                                    source = err;
                                    pending('Constructor failed: ' + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setSticky(false);
                                        if (typeof target !== 'object' || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error('setSticky failed');
                                    } else
                                        target = 'Constructor failed: ' + source;
                                } catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    const obj: regexTester.RegexFlags = source.setSticky(false);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.global).toEqual(f == 'g');
                                else
                                    pending(source);
                            });
                            it('target.global', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.global).toEqual(f == 'g');
                                else
                                    pending(target);
                            });
                            it('source.ignoreCase', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.ignoreCase).toEqual(f == 'i');
                                else
                                    pending(source);
                            });
                            it('target.ignoreCase', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.ignoreCase).toEqual(f == 'i');
                                else
                                    pending(target);
                            });
                            it('source.multiline', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.multiline).toEqual(f == 'm');
                                else
                                    pending(source);
                            });
                            it('target.multiline', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.multiline).toEqual(f == 'm');
                                else
                                    pending(target);
                            });
                            it('source.unicode', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.unicode).toEqual(f == 'u');
                                else
                                    pending(source);
                            });
                            it('target.unicode', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.unicode).toEqual(f == 'u');
                                else
                                    pending(target);
                            });
                            it('source.sticky', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.sticky).toEqual(f == 'y');
                                else
                                    pending(source);
                            });
                            it('target.sticky', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.sticky).toEqual(false);
                                else
                                    pending(target);
                            });
                            it('source.flags', function () {
                                if (source instanceof regexTester.RegexFlags)
                                    expect(source.flags).toEqual(  f);
                                else
                                    pending(source);
                            });
                            it('target.flags', function () {
                                if (target instanceof regexTester.RegexFlags)
                                    expect(target.flags).toEqual((f == 'y') ? '' : f);
                                else
                                    pending(target);
                            });
                        });
                    });
                });
            });

        });
    });

    describe('ValueVersion', function() {
        let q: ng.IQService;

        beforeAll(inject(function($q: ng.IQService) {
            q = $q;
        }));

        describe('constructor', function() {
            describe('<string>("test")', function() {
                let target: regexTester.ValueVersion<string>;
                beforeAll(function() {
                    target = new regexTester.ValueVersion<string>('test');
                });
                it('name equals "test"', function() {
                    expect(target.name).toEqual('test');
                });
                it('isResolved equals false', function() {
                    expect(target.isResolved).toEqual(false);
                });
                it('getValueAsync to be rejected', function(done: DoneFn) {
                    target.getValueAsync(q).then(function(promiseValue: { value: string; token: symbol; }): void {
                        fail('Did not expect to resolve');
                        done();
                    }, function(reason: any): void {
                        expect(reason).toBeDefined();
                        expect(reason).not.toBeNull();
                        done();
                    });
                });
            });
            describe('<string>("test", "text")', function() {
                let target: regexTester.ValueVersion<string>;
                beforeAll(function() {
                    target = new regexTester.ValueVersion<string>('test', 'text');
                });
                it('name equals "test"', function() {
                    expect(target.name).toEqual('test');
                });
                it('isResolved equals true', function() {
                    expect(target.isResolved).toEqual(true);
                });
                it('value equals "text"', function() {
                    expect(target.value).toEqual('text');
                });
                it('getValueAsync to be resolved', function(done: DoneFn) {
                    target.getValueAsync(q).then(function(promiseValue: { value: string; token: symbol; }): void {
                        expect(promiseValue.value).toEqual('text');
                        done();
                    }, function(reason: any): void {
                        fail(reason);
                        done();
                    });
                });
            });
            describe('<number>("test", 45)', function() {
                let target: regexTester.ValueVersion<number>;
                beforeAll(function() {
                    target = new regexTester.ValueVersion<number>('test', 45);
                });
                it('name equals "test"', function() {
                    expect(target.name).toEqual('test');
                });
                it('isResolved equals true', function() {
                    expect(target.isResolved).toEqual(true);
                });
                it('value equals "text"', function() {
                    expect(target.value).toEqual(45);
                });
                it('getValueAsync to be resolved', function(done: DoneFn) {
                    target.getValueAsync(q).then(function(promiseValue: { value: number; token: symbol; }): void {
                        expect(promiseValue.value).toEqual(45);
                        done();
                    }, function(reason: any): void {
                        fail(reason);
                        done();
                    });
                });
            });
        });

        describe('resolve', function() {
            describe('<string>("test")', function() {
                it('resolves as "TEXT"', function() {
                    const target: regexTester.ValueVersion<string> = new regexTester.ValueVersion<string>('test');
                    const token: symbol = target.versionToken;
                    target.resolve('TEXT');
                    expect(target.name).toEqual('test');
                    expect(target.isResolved).toEqual(true);
                    expect(target.value).toEqual('TEXT');
                    expect(token).not.toEqual(target.versionToken);
                });
                it('getValueAsync to be resolved as "TEXT"', function(done: DoneFn) {
                    const target: regexTester.ValueVersion<string> = new regexTester.ValueVersion<string>('test');
                    const token: symbol = target.versionToken;
                    target.resolve('TEXT');
                    target.getValueAsync(q).then(function(promiseValue: { value: string; token: symbol; }): void {
                        expect(promiseValue.value).toEqual('TEXT');
                        expect(token).not.toEqual(promiseValue.token);
                        done();
                    }, function(reason: any): void {
                        fail(reason);
                        done();
                    });
                });
            });
            describe('<string>("test", "text")', function() {
                it('resolves as "TEXT"', function() {
                    const target: regexTester.ValueVersion<string> = new regexTester.ValueVersion<string>('test', 'text');
                    const token: symbol = target.versionToken;
                    target.resolve('TEXT');
                    expect(target.name).toEqual('test');
                    expect(target.isResolved).toEqual(true);
                    expect(target.value).toEqual('TEXT');
                    expect(token).not.toEqual(target.versionToken);
                });
                it('getValueAsync to be resolved as "TEXT"', function(done: DoneFn) {
                    const target: regexTester.ValueVersion<string> = new regexTester.ValueVersion<string>('test', 'text');
                    const token: symbol = target.versionToken;
                    target.resolve('TEXT');
                    target.getValueAsync(q).then(function(promiseValue: { value: string; token: symbol; }): void {
                        expect(promiseValue.value).toEqual('TEXT');
                        expect(token).not.toEqual(promiseValue.token);
                        done();
                    }, function(reason: any): void {
                        fail(reason);
                        done();
                    });
                });
            });
            describe('<string>("test", "text", [insensitive comparer])', function() {
                it('resolves as "TEXT"', function() {
                    const target: regexTester.ValueVersion<string> = new regexTester.ValueVersion<string>('test', 'text',
                        function(x: string, y: string): boolean {
                            return (typeof x === 'string') ? (typeof y === 'string' && x.toLowerCase() === y.toLowerCase()) :
                                typeof y !== 'string';
                        });
                    const token: symbol = target.versionToken;
                    target.resolve('TEXT');
                    expect(target.name).toEqual('test');
                    expect(target.isResolved).toEqual(true);
                    expect(target.value).toEqual('TEXT');
                    expect(token).toEqual(target.versionToken);
                });
                it('getValueAsync to be resolved as "TEXT"', function(done: DoneFn) {
                    const target: regexTester.ValueVersion<string> = new regexTester.ValueVersion<string>('test', 'text',
                    function(x: string, y: string): boolean {
                        return (typeof x === 'string') ? (typeof y === 'string' && x.toLowerCase() === y.toLowerCase()) :
                            typeof y !== 'string';
                    });
                    const token: symbol = target.versionToken;
                    target.resolve('TEXT');
                    target.getValueAsync(q).then(function(promiseValue: { value: string; token: symbol; }): void {
                        expect(promiseValue.value).toEqual('TEXT');
                        expect(token).toEqual(promiseValue.token);
                        done();
                    }, function(reason: any): void {
                        fail(reason);
                        done();
                    });
                });
            });
            describe('<number>("test", 45)', function() {
                it('resolves as 12', function() {
                    const target: regexTester.ValueVersion<number> = new regexTester.ValueVersion<number>('test', 45);
                    const token: symbol = target.versionToken;
                    target.resolve(12);
                    expect(target.name).toEqual('test');
                    expect(target.isResolved).toEqual(true);
                    expect(target.value).toEqual(12);
                    expect(token).not.toEqual(target.versionToken);
                });
                it('getValueAsync to be resolved as 12', function(done: DoneFn) {
                    const target: regexTester.ValueVersion<number> = new regexTester.ValueVersion<number>('test', 45);
                    const token: symbol = target.versionToken;
                    target.resolve(12);
                    target.getValueAsync(q).then(function(promiseValue: { value: number; token: symbol; }): void {
                        expect(promiseValue.value).toEqual(12);
                        expect(token).not.toEqual(promiseValue.token);
                        done();
                    }, function(reason: any): void {
                        fail(reason);
                        done();
                    });
                });
            });
        });
    });

    describe('ValueProducer', function() {
        let q: ng.IQService;

        beforeAll(inject(function($q: ng.IQService) {
            q = $q;
        }));

        describe('constructor', function() {
            describe('before getValueAsync', function() {
                let target: regexTester.ValueProducer<number>;
                let component: regexTester.ValueVersion<string>;
                beforeAll(function() {
                    component = new regexTester.ValueVersion<string>('number', '12');
                    target = regexTester.ValueProducer.create<string,  number>('test',
                        function(resolve: ng.IQResolveReject<number>, reject: ng.IQResolveReject<any>, value: string) {
                            const n = parseFloat(value);
                            if (isNaN(n))
                                reject('not a number');
                            else
                                resolve(n);
                        }, component);
                });
                it('name equals "test"', function() {
                    expect(target.name).toEqual('test');
                });
                it('isResolved equals false', function() {
                    expect(target.isResolved).toEqual(false);
                });
            });
            describe('with getValueAsync', function() {
                it('getValueAsync to be resolved', function(done: DoneFn) {
                    const component: regexTester.ValueVersion<string> = new regexTester.ValueVersion<string>('number', '12');
                    const target: regexTester.ValueProducer<number> = regexTester.ValueProducer.create<string,  number>('test',
                        function(resolve: ng.IQResolveReject<number>, reject: ng.IQResolveReject<any>, value: string) {
                            const n = parseFloat(value);
                            if (isNaN(n))
                                reject('not a number');
                            else
                                resolve(n);
                        }, component);
                    target.getValueAsync(q).then(function(promiseValue: { value: number; token: symbol; }): void {
                        expect(promiseValue.value).toEqual(12);
                        done();
                    }, function(reason: any): void {
                        fail(reason);
                        done();
                    });
                });
            });
            describe('Multiple', function() {
                it('getValueAsync to be resolved', function(done: DoneFn) {
                    const cA: regexTester.ValueVersion<number> = new regexTester.ValueVersion<number>('first', 1);
                    const cB: regexTester.ValueVersion<number> = new regexTester.ValueVersion<number>('second', 2);
                    const target: regexTester.ValueProducer<number> = regexTester.ValueProducer.create<number,  number,  number>('test',
                        function(resolve: ng.IQResolveReject<number>, reject: ng.IQResolveReject<any>, v0: number, v1: number) {
                            resolve(v0 / v1);
                        }, cA, cB);
                    target.getValueAsync(q).then(function(promiseValue: { value: number; token: symbol; }): void {
                        expect(promiseValue.value).toEqual(0.5);
                        done();
                    }, function(reason: any): void {
                        fail(reason);
                        done();
                    });
                });
                it('getValueAsync to be rejected', function(done: DoneFn) {
                    const cA: regexTester.ValueVersion<number> = new regexTester.ValueVersion<number>('first', 1);
                    const cB: regexTester.ValueVersion<number> = new regexTester.ValueVersion<number>('second', 0);
                    const target: regexTester.ValueProducer<number> = regexTester.ValueProducer.create<number,  number,  number>('test',
                        function(resolve: ng.IQResolveReject<number>, reject: ng.IQResolveReject<any>, v0: number, v1: number) {
                            resolve(v0 / v1);
                        }, cA, cB);
                    target.getValueAsync(q).then(function(promiseValue: { value: number; token: symbol; }): void {
                        fail('expected divide by zero');
                        done();
                    }, function(reason: any): void {
                        expect(reason).toBeDefined();
                        expect(reason).not.toBeNull();
                        done();
                    });
                });
            });
        });

        describe('resolve', function() {
            describe('resolve different number', function() {
                it('getValueAsync to be resolved', function(done: DoneFn) {
                    const component: regexTester.ValueVersion<string> = new regexTester.ValueVersion<string>('number', '12');
                    const target: regexTester.ValueProducer<number> = regexTester.ValueProducer.create<string,  number>('test',
                        function(resolve: ng.IQResolveReject<number>, reject: ng.IQResolveReject<any>, value: string) {
                            const n = parseFloat(value);
                            if (isNaN(n))
                                reject('not a number');
                            else
                                resolve(n);
                        }, component);
                    component.resolve('88');
                    const token: symbol = target.versionToken;
                    target.getValueAsync(q).then(function(promiseValue: { value: number; token: symbol; }): void {
                        expect(promiseValue.value).toEqual(88);
                        expect(token).not.toEqual(promiseValue.token);
                        done();
                    }, function(reason: any): void {
                        fail(reason);
                        done();
                    });
                });
            });
            describe('resolve same number', function() {
                it('getValueAsync to be resolved', function(done: DoneFn) {
                    const component: regexTester.ValueVersion<string> = new regexTester.ValueVersion<string>('number', '12');
                    const target: regexTester.ValueProducer<number> = regexTester.ValueProducer.create<string,  number>('test',
                        function(resolve: ng.IQResolveReject<number>, reject: ng.IQResolveReject<any>, value: string) {
                            const n = parseFloat(value);
                            if (isNaN(n))
                                reject('not a number');
                            else
                                resolve(n);
                        }, component);
                    component.resolve('12');
                    const token: symbol = target.versionToken;
                    target.getValueAsync(q).then(function(promiseValue: { value: number; token: symbol; }): void {
                        expect(promiseValue.value).toEqual(12);
                        expect(token).toEqual(promiseValue.token);
                        done();
                    }, function(reason: any): void {
                        fail(reason);
                        done();
                    });
                });
            });
            describe('resolve same result', function() {
                it('getValueAsync to be resolved', function(done: DoneFn) {
                    const component: regexTester.ValueVersion<string> = new regexTester.ValueVersion<string>('number', '12');
                    const target: regexTester.ValueProducer<number> = regexTester.ValueProducer.create<string,  number>('test',
                        function(resolve: ng.IQResolveReject<number>, reject: ng.IQResolveReject<any>, value: string) {
                            const n = parseFloat(value);
                            if (isNaN(n))
                                reject('not a number');
                            else
                                resolve(n);
                        }, component);
                    component.resolve('012');
                    const token: symbol = target.versionToken;
                    target.getValueAsync(q).then(function(promiseValue: { value: number; token: symbol; }): void {
                        expect(promiseValue.value).toEqual(12);
                        expect(token).toEqual(promiseValue.token);
                        done();
                    }, function(reason: any): void {
                        fail(reason);
                        done();
                    });
                });
            });
            describe('resolve invalid number', function() {
                it('getValueAsync to be rejected', function(done: DoneFn) {
                    const component: regexTester.ValueVersion<string> = new regexTester.ValueVersion<string>('number', '12');
                    const target: regexTester.ValueProducer<number> = regexTester.ValueProducer.create<string,  number>('test',
                        function(resolve: ng.IQResolveReject<number>, reject: ng.IQResolveReject<any>, value: string) {
                            const n = parseFloat(value);
                            if (isNaN(n))
                                reject('not a number');
                            else
                                resolve(n);
                        }, component);
                    component.resolve('x');
                    const token: symbol = target.versionToken;
                    target.getValueAsync(q).then(function(promiseValue: { value: number; token: symbol; }): void {
                        fail('Expected NaN');
                        done();
                    }, function(reason: any): void {
                        expect(reason).toBeDefined();
                        expect(reason).not.toBeNull();
                        done();
                    });
                });
            });
            describe('Multiple', function() {
                it('getValueAsync to be resolved', function(done: DoneFn) {
                    const cA: regexTester.ValueVersion<number> = new regexTester.ValueVersion<number>('first', 1);
                    const cB: regexTester.ValueVersion<number> = new regexTester.ValueVersion<number>('second', 2);
                    const target: regexTester.ValueProducer<number> = regexTester.ValueProducer.create<number,  number,  number>('test',
                        function(resolve: ng.IQResolveReject<number>, reject: ng.IQResolveReject<any>, v0: number, v1: number) {
                            resolve(v0 / v1);
                        }, cA, cB);
                    cA.resolve(10);
                    const token: symbol = target.versionToken;
                    target.getValueAsync(q).then(function(promiseValue: { value: number; token: symbol; }): void {
                        expect(promiseValue.value).toEqual(5);
                        expect(token).not.toEqual(promiseValue.token);
                        done();
                    }, function(reason: any): void {
                        fail(reason);
                        done();
                    });
                });
                it('getValueAsync to be resolved from same result', function(done: DoneFn) {
                    const cA: regexTester.ValueVersion<number> = new regexTester.ValueVersion<number>('first', 1);
                    const cB: regexTester.ValueVersion<number> = new regexTester.ValueVersion<number>('second', 2);
                    const target: regexTester.ValueProducer<number> = regexTester.ValueProducer.create<number,  number,  number>('test',
                        function(resolve: ng.IQResolveReject<number>, reject: ng.IQResolveReject<any>, v0: number, v1: number) {
                            resolve(v0 + v1);
                        }, cA, cB);
                    cA.resolve(2);
                    cB.resolve(1);
                    const token: symbol = target.versionToken;
                    target.getValueAsync(q).then(function(promiseValue: { value: number; token: symbol; }): void {
                        expect(promiseValue.value).toEqual(3);
                        expect(token).toEqual(promiseValue.token);
                        done();
                    }, function(reason: any): void {
                        fail(reason);
                        done();
                    });
                });
                it('getValueAsync to be rejected', function(done: DoneFn) {
                    const cA: regexTester.ValueVersion<number> = new regexTester.ValueVersion<number>('first', 1);
                    const cB: regexTester.ValueVersion<number> = new regexTester.ValueVersion<number>('second', 2);
                    const target: regexTester.ValueProducer<number> = regexTester.ValueProducer.create<number,  number,  number>('test',
                        function(resolve: ng.IQResolveReject<number>, reject: ng.IQResolveReject<any>, v0: number, v1: number) {
                            resolve(v0 / v1);
                        }, cA, cB);
                    cB.resolve(0);
                    target.getValueAsync(q).then(function(promiseValue: { value: number; token: symbol; }): void {
                        fail('expected divide by zero');
                        done();
                    }, function(reason: any): void {
                        expect(reason).toBeDefined();
                        expect(reason).not.toBeNull();
                        done();
                    });
                });
            });
        });
    });

    describe('RegexParserService', function () {
        beforeEach(function () {
            angular.mock.module('MyGitHubPages');
        });

        it('Injectable', inject(function ($rootScope: ng.IRootScopeService, regexParser: regexTester.RegexParserService) {
            expect(regexParser).toBeDefined();
            expect(regexParser).not.toBeNull();
            expect(regexParser[Symbol.toStringTag]).toEqual('regexParser');
            const flags: regexTester.RegexFlags = regexParser.flags();
            expect(flags).toBeDefined('flags');
            expect(flags).not.toBeNull('flags');
            expect(flags.flags).toEqual('', 'flags');
            expect(regexParser.pattern()).toEqual('(?:)', 'pattern');
            const regexp: regexTester.ValueProducer<RegExp> = regexParser.regex();
            expect(regexp).toBeDefined('regex');
            expect(regexp).not.toBeNull('regex');
        }));
    });
});
