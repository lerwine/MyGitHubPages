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
                let flags: regexTester.RegexFlags = new regexTester.RegexFlags();
                expect(flags.flags).toEqual("", "#flags");
                expect(flags.global).toEqual(false, "#global");
                expect(flags.ignoreCase).toEqual(false, "#ignoreCase");
                expect(flags.multiline).toEqual(false, "#multiline");
                expect(flags.sticky).toEqual(false, "#sticky");
                expect(flags.unicode).toEqual(false, "#unicode");
            });
            it('new regexTester.RegexFlags(undefined)', function () {
                let flags: regexTester.RegexFlags = new regexTester.RegexFlags(undefined);
                expect(flags.flags).toEqual("", "#flags");
                expect(flags.global).toEqual(false, "#global");
                expect(flags.ignoreCase).toEqual(false, "#ignoreCase");
                expect(flags.multiline).toEqual(false, "#multiline");
                expect(flags.sticky).toEqual(false, "#sticky");
                expect(flags.unicode).toEqual(false, "#unicode");
            });
            it('new regexTester.RegexFlags(null)', function () {
                let flags: regexTester.RegexFlags = new regexTester.RegexFlags(null);
                expect(flags.flags).toEqual("", "#flags");
                expect(flags.global).toEqual(false, "#global");
                expect(flags.ignoreCase).toEqual(false, "#ignoreCase");
                expect(flags.multiline).toEqual(false, "#multiline");
                expect(flags.sticky).toEqual(false, "#sticky");
                expect(flags.unicode).toEqual(false, "#unicode");
            });
            [
                <IRegexFlagsConstructorTestData>{ arg0: '', flags: '', global: false, ignoreCase: false, multiline: false, sticky: false, unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: ' ', flags: '', global: false, ignoreCase: false, multiline: false, sticky: false, unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'a', flags: '', global: false, ignoreCase: false, multiline: false, sticky: false, unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'g', flags: 'g', global: true, ignoreCase: false, multiline: false, sticky: false, unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'i', flags: 'i', global: false, ignoreCase: true, multiline: false, sticky: false, unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'm', flags: 'm', global: false, ignoreCase: false, multiline: true, sticky: false, unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'u', flags: 'u', global: false, ignoreCase: false, multiline: false, sticky: false, unicode: true },
                <IRegexFlagsConstructorTestData>{ arg0: 'y', flags: 'y', global: false, ignoreCase: false, multiline: false, sticky: true, unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: ' g', flags: 'g', global: true, ignoreCase: false, multiline: false, sticky: false, unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'i ', flags: 'i', global: false, ignoreCase: true, multiline: false, sticky: false, unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'am', flags: 'm', global: false, ignoreCase: false, multiline: true, sticky: false, unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'ua', flags: 'u', global: false, ignoreCase: false, multiline: false, sticky: false, unicode: true },
                <IRegexFlagsConstructorTestData>{ arg0: 'yy', flags: 'y', global: false, ignoreCase: false, multiline: false, sticky: true, unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'gi', flags: 'gi', global: true, ignoreCase: true, multiline: false, sticky: false, unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'mi', flags: 'mi', global: false, ignoreCase: true, multiline: true, sticky: false, unicode: false },
                <IRegexFlagsConstructorTestData>{ arg0: 'mgiyu', flags: 'mgiyu', global: true, ignoreCase: true, multiline: true, sticky: true, unicode: true },
                <IRegexFlagsConstructorTestData>{ arg0: 'gimuy', flags: 'gimuy', global: true, ignoreCase: true, multiline: true, sticky: true, unicode: true },
                <IRegexFlagsConstructorTestData>{ arg0: ' uyixgmz', flags: 'uyigm', global: true, ignoreCase: true, multiline: true, sticky: true, unicode: true }
            ].forEach(function (testData: IRegexFlagsConstructorTestData) {
                it('new regexTester.RegexFlags(' + JSON.stringify(testData.arg0) + ')', function () {
                    let flags: regexTester.RegexFlags = new regexTester.RegexFlags(testData.arg0);
                    expect(flags.flags).toEqual(testData.flags, "#flags");
                    expect(flags.global).toEqual(testData.global, "#global");
                    expect(flags.ignoreCase).toEqual(testData.ignoreCase, "#ignoreCase");
                    expect(flags.multiline).toEqual(testData.multiline, "#multiline");
                    expect(flags.sticky).toEqual(testData.sticky, "#sticky");
                    expect(flags.unicode).toEqual(testData.unicode, "#unicode");
                });
            });
        });
        
        describe('Modifiers', function () {
            ['', 'g', 'i', 'm', 'u', 'y'].forEach(function (f: string) {
                describe('(' + JSON.stringify(f) + ")", function () {
                    describe('setGlobal', function () {
                        describe('true', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); }
                                catch (err) {
                                    source = err;
                                    pending("Constructor failed: " + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setGlobal(true);
                                        if (typeof target !== "object" || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error("setGlobal failed");
                                    }
                                    else
                                        target = "Constructor failed: " + source;
                                }
                                catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    let obj: regexTester.RegexFlags = source.setGlobal(true);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () { if (source instanceof regexTester.RegexFlags) { expect(source.global).toEqual(f == 'g') } else { pending(source); } });
                            it('target.global', function () { if (target instanceof regexTester.RegexFlags) { expect(target.global).toEqual(true) } else { pending(target); } });
                            it('source.ignoreCase', function () { if (source instanceof regexTester.RegexFlags) { expect(source.ignoreCase).toEqual(f == 'i') } else { pending(source); } });
                            it('target.ignoreCase', function () { if (target instanceof regexTester.RegexFlags) { expect(target.ignoreCase).toEqual(f == 'i') } else { pending(target); } });
                            it('source.multiline', function () { if (source instanceof regexTester.RegexFlags) { expect(source.multiline).toEqual(f == 'm') } else { pending(source); } });
                            it('target.multiline', function () { if (target instanceof regexTester.RegexFlags) { expect(target.multiline).toEqual(f == 'm') } else { pending(target); } });
                            it('source.unicode', function () { if (source instanceof regexTester.RegexFlags) { expect(source.unicode).toEqual(f == 'u') } else { pending(source); } });
                            it('target.unicode', function () { if (target instanceof regexTester.RegexFlags) { expect(target.unicode).toEqual(f == 'u') } else { pending(target); } });
                            it('source.sticky', function () { if (source instanceof regexTester.RegexFlags) { expect(source.sticky).toEqual(f == 'y') } else { pending(source); } });
                            it('target.sticky', function () { if (target instanceof regexTester.RegexFlags) { expect(target.sticky).toEqual(f == 'y') } else { pending(target); } });
                            it('source.flags', function () { if (source instanceof regexTester.RegexFlags) { expect(source.flags).toEqual(f) } else { pending(source); } });
                            it('target.flags', function () { if (target instanceof regexTester.RegexFlags) { expect(target.flags).toEqual((f == 'g') ? f : f + 'g') } else { pending(target); } });
                        });
                        describe('false', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); }
                                catch (err) {
                                    source = err;
                                    pending("Constructor failed: " + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setGlobal(false);
                                        if (typeof target !== "object" || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error("setGlobal failed");
                                    }
                                    else
                                        target = "Constructor failed: " + source;
                                }
                                catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    let obj: regexTester.RegexFlags = source.setGlobal(false);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () { if (source instanceof regexTester.RegexFlags) { expect(source.global).toEqual(f == 'g') } else { pending(source); } });
                            it('target.global', function () { if (target instanceof regexTester.RegexFlags) { expect(target.global).toEqual(false) } else { pending(target); } });
                            it('source.ignoreCase', function () { if (source instanceof regexTester.RegexFlags) { expect(source.ignoreCase).toEqual(f == 'i') } else { pending(source); } });
                            it('target.ignoreCase', function () { if (target instanceof regexTester.RegexFlags) { expect(target.ignoreCase).toEqual(f == 'i') } else { pending(target); } });
                            it('source.multiline', function () { if (source instanceof regexTester.RegexFlags) { expect(source.multiline).toEqual(f == 'm') } else { pending(source); } });
                            it('target.multiline', function () { if (target instanceof regexTester.RegexFlags) { expect(target.multiline).toEqual(f == 'm') } else { pending(target); } });
                            it('source.unicode', function () { if (source instanceof regexTester.RegexFlags) { expect(source.unicode).toEqual(f == 'u') } else { pending(source); } });
                            it('target.unicode', function () { if (target instanceof regexTester.RegexFlags) { expect(target.unicode).toEqual(f == 'u') } else { pending(target); } });
                            it('source.sticky', function () { if (source instanceof regexTester.RegexFlags) { expect(source.sticky).toEqual(f == 'y') } else { pending(source); } });
                            it('target.sticky', function () { if (target instanceof regexTester.RegexFlags) { expect(target.sticky).toEqual(f == 'y') } else { pending(target); } });
                            it('source.flags', function () { if (source instanceof regexTester.RegexFlags) { expect(source.flags).toEqual(f) } else { pending(source); } });
                            it('target.flags', function () { if (target instanceof regexTester.RegexFlags) { expect(target.flags).toEqual((f == 'g') ? '' : f) } else { pending(target); } });
                        });
                    });

                    describe('setIgnoreCase', function () {
                        describe('true', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); }
                                catch (err) {
                                    source = err;
                                    pending("Constructor failed: " + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setIgnoreCase(true);
                                        if (typeof target !== "object" || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error("setIgnoreCase failed");
                                    }
                                    else
                                        target = "Constructor failed: " + source;
                                }
                                catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    let obj: regexTester.RegexFlags = source.setIgnoreCase(true);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () { if (source instanceof regexTester.RegexFlags) { expect(source.global).toEqual(f == 'g') } else { pending(source); } });
                            it('target.global', function () { if (target instanceof regexTester.RegexFlags) { expect(target.global).toEqual(f == 'g') } else { pending(target); } });
                            it('source.ignoreCase', function () { if (source instanceof regexTester.RegexFlags) { expect(source.ignoreCase).toEqual(f == 'i') } else { pending(source); } });
                            it('target.ignoreCase', function () { if (target instanceof regexTester.RegexFlags) { expect(target.ignoreCase).toEqual(true) } else { pending(target); } });
                            it('source.multiline', function () { if (source instanceof regexTester.RegexFlags) { expect(source.multiline).toEqual(f == 'm') } else { pending(source); } });
                            it('target.multiline', function () { if (target instanceof regexTester.RegexFlags) { expect(target.multiline).toEqual(f == 'm') } else { pending(target); } });
                            it('source.unicode', function () { if (source instanceof regexTester.RegexFlags) { expect(source.unicode).toEqual(f == 'u') } else { pending(source); } });
                            it('target.unicode', function () { if (target instanceof regexTester.RegexFlags) { expect(target.unicode).toEqual(f == 'u') } else { pending(target); } });
                            it('source.sticky', function () { if (source instanceof regexTester.RegexFlags) { expect(source.sticky).toEqual(f == 'y') } else { pending(source); } });
                            it('target.sticky', function () { if (target instanceof regexTester.RegexFlags) { expect(target.sticky).toEqual(f == 'y') } else { pending(target); } });
                            it('source.flags', function () { if (source instanceof regexTester.RegexFlags) { expect(source.flags).toEqual(f) } else { pending(source); } });
                            it('target.flags', function () { if (target instanceof regexTester.RegexFlags) { expect(target.flags).toEqual((f == 'i') ? f : f + 'i') } else { pending(target); } });
                        });
                        describe('false', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); }
                                catch (err) {
                                    source = err;
                                    pending("Constructor failed: " + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setIgnoreCase(false);
                                        if (typeof target !== "object" || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error("setIgnoreCase failed");
                                    }
                                    else
                                        target = "Constructor failed: " + source;
                                }
                                catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    let obj: regexTester.RegexFlags = source.setIgnoreCase(false);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () { if (source instanceof regexTester.RegexFlags) { expect(source.global).toEqual(f == 'g') } else { pending(source); } });
                            it('target.global', function () { if (target instanceof regexTester.RegexFlags) { expect(target.global).toEqual(f == 'g') } else { pending(target); } });
                            it('source.ignoreCase', function () { if (source instanceof regexTester.RegexFlags) { expect(source.ignoreCase).toEqual(f == 'i') } else { pending(source); } });
                            it('target.ignoreCase', function () { if (target instanceof regexTester.RegexFlags) { expect(target.ignoreCase).toEqual(false) } else { pending(target); } });
                            it('source.multiline', function () { if (source instanceof regexTester.RegexFlags) { expect(source.multiline).toEqual(f == 'm') } else { pending(source); } });
                            it('target.multiline', function () { if (target instanceof regexTester.RegexFlags) { expect(target.multiline).toEqual(f == 'm') } else { pending(target); } });
                            it('source.unicode', function () { if (source instanceof regexTester.RegexFlags) { expect(source.unicode).toEqual(f == 'u') } else { pending(source); } });
                            it('target.unicode', function () { if (target instanceof regexTester.RegexFlags) { expect(target.unicode).toEqual(f == 'u') } else { pending(target); } });
                            it('source.sticky', function () { if (source instanceof regexTester.RegexFlags) { expect(source.sticky).toEqual(f == 'y') } else { pending(source); } });
                            it('target.sticky', function () { if (target instanceof regexTester.RegexFlags) { expect(target.sticky).toEqual(f == 'y') } else { pending(target); } });
                            it('source.flags', function () { if (source instanceof regexTester.RegexFlags) { expect(source.flags).toEqual(f) } else { pending(source); } });
                            it('target.flags', function () { if (target instanceof regexTester.RegexFlags) { expect(target.flags).toEqual((f == 'i') ? '' : f) } else { pending(target); } });
                        });
                    });

                    describe('setMultiline', function () {
                        describe('true', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); }
                                catch (err) {
                                    source = err;
                                    pending("Constructor failed: " + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setMultiline(true);
                                        if (typeof target !== "object" || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error("setMultiline failed");
                                    }
                                    else
                                        target = "Constructor failed: " + source;
                                }
                                catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    let obj: regexTester.RegexFlags = source.setMultiline(true);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () { if (source instanceof regexTester.RegexFlags) { expect(source.global).toEqual(f == 'g') } else { pending(source); } });
                            it('target.global', function () { if (target instanceof regexTester.RegexFlags) { expect(target.global).toEqual(f == 'g') } else { pending(target); } });
                            it('source.ignoreCase', function () { if (source instanceof regexTester.RegexFlags) { expect(source.ignoreCase).toEqual(f == 'i') } else { pending(source); } });
                            it('target.ignoreCase', function () { if (target instanceof regexTester.RegexFlags) { expect(target.ignoreCase).toEqual(f == 'i') } else { pending(target); } });
                            it('source.multiline', function () { if (source instanceof regexTester.RegexFlags) { expect(source.multiline).toEqual(f == 'm') } else { pending(source); } });
                            it('target.multiline', function () { if (target instanceof regexTester.RegexFlags) { expect(target.multiline).toEqual(true) } else { pending(target); } });
                            it('source.unicode', function () { if (source instanceof regexTester.RegexFlags) { expect(source.unicode).toEqual(f == 'u') } else { pending(source); } });
                            it('target.unicode', function () { if (target instanceof regexTester.RegexFlags) { expect(target.unicode).toEqual(f == 'u') } else { pending(target); } });
                            it('source.sticky', function () { if (source instanceof regexTester.RegexFlags) { expect(source.sticky).toEqual(f == 'y') } else { pending(source); } });
                            it('target.sticky', function () { if (target instanceof regexTester.RegexFlags) { expect(target.sticky).toEqual(f == 'y') } else { pending(target); } });
                            it('source.flags', function () { if (source instanceof regexTester.RegexFlags) { expect(source.flags).toEqual(f) } else { pending(source); } });
                            it('target.flags', function () { if (target instanceof regexTester.RegexFlags) { expect(target.flags).toEqual((f == 'm') ? f : f + 'm') } else { pending(target); } });
                        });
                        describe('false', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); }
                                catch (err) {
                                    source = err;
                                    pending("Constructor failed: " + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setMultiline(false);
                                        if (typeof target !== "object" || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error("setMultiline failed");
                                    }
                                    else
                                        target = "Constructor failed: " + source;
                                }
                                catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    let obj: regexTester.RegexFlags = source.setMultiline(false);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () { if (source instanceof regexTester.RegexFlags) { expect(source.global).toEqual(f == 'g') } else { pending(source); } });
                            it('target.global', function () { if (target instanceof regexTester.RegexFlags) { expect(target.global).toEqual(f == 'g') } else { pending(target); } });
                            it('source.ignoreCase', function () { if (source instanceof regexTester.RegexFlags) { expect(source.ignoreCase).toEqual(f == 'i') } else { pending(source); } });
                            it('target.ignoreCase', function () { if (target instanceof regexTester.RegexFlags) { expect(target.ignoreCase).toEqual(f == 'i') } else { pending(target); } });
                            it('source.multiline', function () { if (source instanceof regexTester.RegexFlags) { expect(source.multiline).toEqual(f == 'm') } else { pending(source); } });
                            it('target.multiline', function () { if (target instanceof regexTester.RegexFlags) { expect(target.multiline).toEqual(false) } else { pending(target); } });
                            it('source.unicode', function () { if (source instanceof regexTester.RegexFlags) { expect(source.unicode).toEqual(f == 'u') } else { pending(source); } });
                            it('target.unicode', function () { if (target instanceof regexTester.RegexFlags) { expect(target.unicode).toEqual(f == 'u') } else { pending(target); } });
                            it('source.sticky', function () { if (source instanceof regexTester.RegexFlags) { expect(source.sticky).toEqual(f == 'y') } else { pending(source); } });
                            it('target.sticky', function () { if (target instanceof regexTester.RegexFlags) { expect(target.sticky).toEqual(f == 'y') } else { pending(target); } });
                            it('source.flags', function () { if (source instanceof regexTester.RegexFlags) { expect(source.flags).toEqual(f) } else { pending(source); } });
                            it('target.flags', function () { if (target instanceof regexTester.RegexFlags) { expect(target.flags).toEqual((f == 'm') ? '' : f) } else { pending(target); } });
                        });
                    });

                    describe('setUnicode', function () {
                        describe('true', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); }
                                catch (err) {
                                    source = err;
                                    pending("Constructor failed: " + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setUnicode(true);
                                        if (typeof target !== "object" || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error("setUnicode failed");
                                    }
                                    else
                                        target = "Constructor failed: " + source;
                                }
                                catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    let obj: regexTester.RegexFlags = source.setUnicode(true);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () { if (source instanceof regexTester.RegexFlags) { expect(source.global).toEqual(f == 'g') } else { pending(source); } });
                            it('target.global', function () { if (target instanceof regexTester.RegexFlags) { expect(target.global).toEqual(f == 'g') } else { pending(target); } });
                            it('source.ignoreCase', function () { if (source instanceof regexTester.RegexFlags) { expect(source.ignoreCase).toEqual(f == 'i') } else { pending(source); } });
                            it('target.ignoreCase', function () { if (target instanceof regexTester.RegexFlags) { expect(target.ignoreCase).toEqual(f == 'i') } else { pending(target); } });
                            it('source.multiline', function () { if (source instanceof regexTester.RegexFlags) { expect(source.multiline).toEqual(f == 'm') } else { pending(source); } });
                            it('target.multiline', function () { if (target instanceof regexTester.RegexFlags) { expect(target.multiline).toEqual(f == 'm') } else { pending(target); } });
                            it('source.unicode', function () { if (source instanceof regexTester.RegexFlags) { expect(source.unicode).toEqual(f == 'u') } else { pending(source); } });
                            it('target.unicode', function () { if (target instanceof regexTester.RegexFlags) { expect(target.unicode).toEqual(true) } else { pending(target); } });
                            it('source.sticky', function () { if (source instanceof regexTester.RegexFlags) { expect(source.sticky).toEqual(f == 'y') } else { pending(source); } });
                            it('target.sticky', function () { if (target instanceof regexTester.RegexFlags) { expect(target.sticky).toEqual(f == 'y') } else { pending(target); } });
                            it('source.flags', function () { if (source instanceof regexTester.RegexFlags) { expect(source.flags).toEqual(f) } else { pending(source); } });
                            it('target.flags', function () { if (target instanceof regexTester.RegexFlags) { expect(target.flags).toEqual((f == 'u') ? f : f + 'u') } else { pending(target); } });
                        });
                        describe('false', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); }
                                catch (err) {
                                    source = err;
                                    pending("Constructor failed: " + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setUnicode(false);
                                        if (typeof target !== "object" || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error("setUnicode failed");
                                    }
                                    else
                                        target = "Constructor failed: " + source;
                                }
                                catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    let obj: regexTester.RegexFlags = source.setUnicode(false);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () { if (source instanceof regexTester.RegexFlags) { expect(source.global).toEqual(f == 'g') } else { pending(source); } });
                            it('target.global', function () { if (target instanceof regexTester.RegexFlags) { expect(target.global).toEqual(f == 'g') } else { pending(target); } });
                            it('source.ignoreCase', function () { if (source instanceof regexTester.RegexFlags) { expect(source.ignoreCase).toEqual(f == 'i') } else { pending(source); } });
                            it('target.ignoreCase', function () { if (target instanceof regexTester.RegexFlags) { expect(target.ignoreCase).toEqual(f == 'i') } else { pending(target); } });
                            it('source.multiline', function () { if (source instanceof regexTester.RegexFlags) { expect(source.multiline).toEqual(f == 'm') } else { pending(source); } });
                            it('target.multiline', function () { if (target instanceof regexTester.RegexFlags) { expect(target.multiline).toEqual(f == 'm') } else { pending(target); } });
                            it('source.unicode', function () { if (source instanceof regexTester.RegexFlags) { expect(source.unicode).toEqual(f == 'u') } else { pending(source); } });
                            it('target.unicode', function () { if (target instanceof regexTester.RegexFlags) { expect(target.unicode).toEqual(false) } else { pending(target); } });
                            it('source.sticky', function () { if (source instanceof regexTester.RegexFlags) { expect(source.sticky).toEqual(f == 'y') } else { pending(source); } });
                            it('target.sticky', function () { if (target instanceof regexTester.RegexFlags) { expect(target.sticky).toEqual(f == 'y') } else { pending(target); } });
                            it('source.flags', function () { if (source instanceof regexTester.RegexFlags) { expect(source.flags).toEqual(f) } else { pending(source); } });
                            it('target.flags', function () { if (target instanceof regexTester.RegexFlags) { expect(target.flags).toEqual((f == 'u') ? '' : f) } else { pending(target); } });
                        });
                    });

                    describe('setSticky', function () {
                        describe('true', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); }
                                catch (err) {
                                    source = err;
                                    pending("Constructor failed: " + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setSticky(true);
                                        if (typeof target !== "object" || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error("setSticky failed");
                                    }
                                    else
                                        target = "Constructor failed: " + source;
                                }
                                catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    let obj: regexTester.RegexFlags = source.setSticky(true);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () { if (source instanceof regexTester.RegexFlags) { expect(source.global).toEqual(f == 'g') } else { pending(source); } });
                            it('target.global', function () { if (target instanceof regexTester.RegexFlags) { expect(target.global).toEqual(f == 'g') } else { pending(target); } });
                            it('source.ignoreCase', function () { if (source instanceof regexTester.RegexFlags) { expect(source.ignoreCase).toEqual(f == 'i') } else { pending(source); } });
                            it('target.ignoreCase', function () { if (target instanceof regexTester.RegexFlags) { expect(target.ignoreCase).toEqual(f == 'i') } else { pending(target); } });
                            it('source.multiline', function () { if (source instanceof regexTester.RegexFlags) { expect(source.multiline).toEqual(f == 'm') } else { pending(source); } });
                            it('target.multiline', function () { if (target instanceof regexTester.RegexFlags) { expect(target.multiline).toEqual(f == 'm') } else { pending(target); } });
                            it('source.unicode', function () { if (source instanceof regexTester.RegexFlags) { expect(source.unicode).toEqual(f == 'u') } else { pending(source); } });
                            it('target.unicode', function () { if (target instanceof regexTester.RegexFlags) { expect(target.unicode).toEqual(f == 'u') } else { pending(target); } });
                            it('source.sticky', function () { if (source instanceof regexTester.RegexFlags) { expect(source.sticky).toEqual(f == 'y') } else { pending(source); } });
                            it('target.sticky', function () { if (target instanceof regexTester.RegexFlags) { expect(target.sticky).toEqual(true) } else { pending(target); } });
                            it('source.flags', function () { if (source instanceof regexTester.RegexFlags) { expect(source.flags).toEqual(f) } else { pending(source); } });
                            it('target.flags', function () { if (target instanceof regexTester.RegexFlags) { expect(target.flags).toEqual((f == 'y') ? f : f + 'y') } else { pending(target); } });
                        });
                        describe('false', function () {
                            let source: any, target: any;
                            beforeAll(function () {
                                try { source = new regexTester.RegexFlags(f); }
                                catch (err) {
                                    source = err;
                                    pending("Constructor failed: " + target);
                                    return;
                                }
                                try {
                                    if (source instanceof regexTester.RegexFlags) {
                                        target = source.setSticky(false);
                                        if (typeof target !== "object" || target === null || !(target instanceof regexTester.RegexFlags))
                                            throw new Error("setSticky failed");
                                    }
                                    else
                                        target = "Constructor failed: " + source;
                                }
                                catch (err) { target = err; }
                            });
                            it('invoke', function () {
                                if (source instanceof regexTester.RegexFlags) {
                                    let obj: regexTester.RegexFlags = source.setSticky(false);
                                    expect(obj).toBeDefined();
                                    expect(obj).not.toBeNull();
                                    expect(obj instanceof regexTester.RegexFlags).toEqual(true);
                                } else
                                    pending(target);
                            });
                            it('source.global', function () { if (source instanceof regexTester.RegexFlags) { expect(source.global).toEqual(f == 'g') } else { pending(source); } });
                            it('target.global', function () { if (target instanceof regexTester.RegexFlags) { expect(target.global).toEqual(f == 'g') } else { pending(target); } });
                            it('source.ignoreCase', function () { if (source instanceof regexTester.RegexFlags) { expect(source.ignoreCase).toEqual(f == 'i') } else { pending(source); } });
                            it('target.ignoreCase', function () { if (target instanceof regexTester.RegexFlags) { expect(target.ignoreCase).toEqual(f == 'i') } else { pending(target); } });
                            it('source.multiline', function () { if (source instanceof regexTester.RegexFlags) { expect(source.multiline).toEqual(f == 'm') } else { pending(source); } });
                            it('target.multiline', function () { if (target instanceof regexTester.RegexFlags) { expect(target.multiline).toEqual(f == 'm') } else { pending(target); } });
                            it('source.unicode', function () { if (source instanceof regexTester.RegexFlags) { expect(source.unicode).toEqual(f == 'u') } else { pending(source); } });
                            it('target.unicode', function () { if (target instanceof regexTester.RegexFlags) { expect(target.unicode).toEqual(f == 'u') } else { pending(target); } });
                            it('source.sticky', function () { if (source instanceof regexTester.RegexFlags) { expect(source.sticky).toEqual(f == 'y') } else { pending(source); } });
                            it('target.sticky', function () { if (target instanceof regexTester.RegexFlags) { expect(target.sticky).toEqual(false) } else { pending(target); } });
                            it('source.flags', function () { if (source instanceof regexTester.RegexFlags) { expect(source.flags).toEqual(  f) } else { pending(source); } });
                            it('target.flags', function () { if (target instanceof regexTester.RegexFlags) { expect(target.flags).toEqual((f == 'y') ? '' : f) } else { pending(target); } });
                        });
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
            let flags: regexTester.RegexFlags = regexParser.flags();
            expect(flags).toBeDefined('flags');
            expect(flags).not.toBeNull('flags');
            expect(flags.flags).toEqual('', 'flags');
            expect(regexParser.pattern()).toEqual('(?:)', 'pattern');
            let regexp: RegExp = regexParser.regex();
            expect(regexp).toBeDefined('regex');
            expect(regexp).not.toBeNull('regex');
            expect(regexp.source).toEqual('(?:)', 'regex.source');
            expect(regexp.global).toEqual(false, 'regex.global');
            expect(regexp.ignoreCase).toEqual(false, 'regex.ignoreCase');
            expect(regexp.multiline).toEqual(false, 'regexp.multiline');
            expect(regexp.sticky).toEqual(false, 'regex.sticky');
            expect(regexp.unicode).toEqual(false, 'regex.unicode');
        }));

        describe("Callbacks", function () {
            let regexParser: regexTester.RegexParserService;
            let scope: ng.IScope;

            beforeEach(inject(function ($rootScope: ng.IRootScopeService, _regexParser_: regexTester.RegexParserService) {
                regexParser = _regexParser_;
                scope = $rootScope.$new();
            }));

            describe('onRegexPatternChanged', function (): void {
                it('oldValue', function (done: DoneFn): void {
                    regexParser.onRegexPatternChanged(scope, function (event: ng.IAngularEvent, oldValue: string, newValue: string): void {
                        expect(oldValue).toEqual('(?:)');
                        done();
                    });
                    regexParser.pattern('^\\s+');
                });
                it('newValue', function (done: DoneFn): void {
                    regexParser.onRegexPatternChanged(scope, function (event: ng.IAngularEvent, oldValue: string, newValue: string): void {
                        expect(newValue).toEqual('^\\s+');
                        done();
                    });
                    regexParser.pattern('^\\s+');
                });
                it('regexParser.pattern()', function (done: DoneFn): void {
                    regexParser.onRegexPatternChanged(scope, function (event: ng.IAngularEvent, oldValue: string, newValue: string): void {
                        let pattern: string = regexParser.pattern();
                        expect(pattern).toBeDefined();
                        expect(pattern).not.toBeNull();
                        expect(pattern).toEqual('^\\s+');
                        done();
                    });
                    regexParser.pattern('^\\s+');
                });
            });

            describe('onRegexFlagsChanged', function () {
                it('oldValue', function (done: DoneFn): void {
                    regexParser.onRegexFlagsChanged(scope, function (event: ng.IAngularEvent, oldValue: regexTester.RegexFlags, newValue: regexTester.RegexFlags): void {
                        let flags: regexTester.RegexFlags = regexParser.flags();
                        expect(oldValue).toBeDefined();
                        expect(oldValue).not.toBeNull();
                        expect(oldValue.flags).toEqual('');
                        done();
                    });
                    regexParser.multiline(true);
                });
                it('newValue', function (done: DoneFn): void {
                    regexParser.onRegexFlagsChanged(scope, function (event: ng.IAngularEvent, oldValue: regexTester.RegexFlags, newValue: regexTester.RegexFlags): void {
                        let flags: regexTester.RegexFlags = regexParser.flags();
                        expect(newValue).toBeDefined();
                        expect(newValue).not.toBeNull();
                        expect(newValue.flags).toEqual('m');
                        done();
                    });
                    regexParser.multiline(true);
                });
                it('regexParser.flags()', function (done: DoneFn): void {
                    regexParser.onRegexFlagsChanged(scope, function (event: ng.IAngularEvent, oldValue: regexTester.RegexFlags, newValue: regexTester.RegexFlags): void {
                        let flags: regexTester.RegexFlags = regexParser.flags();
                        expect(flags).toBeDefined();
                        expect(flags).not.toBeNull();
                        expect(flags.flags).toEqual('m');
                        done();
                    });
                    regexParser.multiline(true);
                });
            });

            describe('onRegexObjectChanged', function () {
                it('oldValue', function (done: DoneFn): void {
                    regexParser.onRegexObjectChanged(scope, function (event: ng.IAngularEvent, oldValue: RegExp, newValue: RegExp): void {
                        expect(oldValue).toBeDefined();
                        expect(oldValue).not.toBeNull();
                        let actual = { source: oldValue.source, global: oldValue.global, ignoreCase: oldValue.ignoreCase, multiline: oldValue.multiline, unicode: oldValue.unicode, sticky: oldValue.sticky };
                        expect(JSON.stringify(actual)).toEqual(JSON.stringify({ source: '(?:)', global: false, ignoreCase: false, multiline: false, unicode: false, sticky: false }));
                        done();
                    });
                    regexParser.pattern('\\s+0');
                });
                it('newValue', function (done: DoneFn): void {
                    regexParser.onRegexObjectChanged(scope, function (event: ng.IAngularEvent, oldValue: RegExp, newValue: RegExp): void {
                        expect(newValue).toBeDefined();
                        expect(newValue).not.toBeNull();
                        let actual = { source: newValue.source, global: newValue.global, ignoreCase: newValue.ignoreCase, multiline: newValue.multiline, unicode: newValue.unicode, sticky: newValue.sticky };
                        expect(JSON.stringify(actual)).toEqual(JSON.stringify({ source: '\\s+2', global: false, ignoreCase: false, multiline: false, unicode: false, sticky: false }));
                        done();
                    });
                    regexParser.pattern('\\s+2');
                });
                it('regexParser.flags()', function (done: DoneFn): void {
                    regexParser.onRegexObjectChanged(scope, function (event: ng.IAngularEvent, oldValue: RegExp, newValue: RegExp): void {
                        let flags: regexTester.RegexFlags = regexParser.flags();
                        expect(flags).toBeDefined();
                        expect(flags).not.toBeNull();
                        expect(flags.flags).toEqual('');
                        done();
                    });
                    regexParser.pattern('\\s+3');
                });
                it('regexParser.pattern()', function (done: DoneFn): void {
                    regexParser.onRegexObjectChanged(scope, function (event: ng.IAngularEvent, oldValue: RegExp, newValue: RegExp): void {
                        expect(regexParser.pattern()).toEqual('\\s+4');
                        done();
                    });
                    regexParser.pattern('\\s+4');
                });
                it('regexParser.regex()', function (done: DoneFn): void {
                    regexParser.onRegexObjectChanged(scope, function (event: ng.IAngularEvent, oldValue: RegExp, newValue: RegExp): void {
                        let regexp: RegExp = regexParser.regex();
                        expect(regexp).toBeDefined();
                        expect(regexp).not.toBeNull();
                        let actual = { source: regexp.source, global: regexp.global, ignoreCase: regexp.ignoreCase, multiline: regexp.multiline, unicode: regexp.unicode, sticky: regexp.sticky };
                        expect(JSON.stringify(actual)).toEqual(JSON.stringify({ source: '\\s+5', global: false, ignoreCase: false, multiline: false, unicode: false, sticky: false }));
                        done();
                    });
                    regexParser.pattern('\\s+5');
                });
            });
        });
    });
});
