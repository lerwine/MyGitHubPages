var specHelper;
(function (specHelper) {
    function isSuccessResult(value) { return typeof value.reason === "undefined"; }
    let dataCreationCache = {};
    function initializeTestData(id, createTestData, onFail, onPending, onSuccess) {
        let lastResult = dataCreationCache[id];
        if (typeof lastResult === "undefined" || isSuccessResult(lastResult)) {
            let value;
            try {
                value = createTestData();
            }
            catch (e) {
                let reason = (typeof onFail === "function") ? onFail(e) : onFail + ": " + e;
                dataCreationCache[id] = { reason: reason };
                if (typeof onPending === "function")
                    onPending(reason);
                else if (onPending)
                    pending(reason);
                return;
            }
            dataCreationCache[id] = { value: value };
            if (typeof onSuccess === "function")
                onSuccess(value);
        }
        else if (typeof onPending === "function")
            onPending(lastResult.reason);
        else if (onPending)
            pending(lastResult.reason);
    }
    specHelper.initializeTestData = initializeTestData;
    function withTestData(id, onSuccess, onPending) {
        let lastResult = dataCreationCache[id];
        if (typeof lastResult === "undefined")
            throw new Error("No test data initialized.");
        if (isSuccessResult(lastResult))
            onSuccess(lastResult.value);
        else if (typeof onPending === "function")
            onPending(lastResult.reason);
        else if (onPending)
            pending(lastResult.reason);
    }
    specHelper.withTestData = withTestData;
    function invokeInitialization(id, setupCallback, onFail, onSuccess, onPending) {
        let lastResult = dataCreationCache[id];
        if (typeof lastResult === "undefined" || isSuccessResult(lastResult)) {
            try {
                setupCallback();
                dataCreationCache[id] = { value: null };
            }
            catch (e) {
                let reason = (typeof onFail === "function") ? onFail(e) : onFail + ": " + e;
                dataCreationCache[id] = { reason: reason };
                if (typeof onPending === "function")
                    onPending(reason);
                else if (onPending)
                    pending(reason);
                return;
            }
            if (typeof onSuccess === "function")
                onSuccess();
        }
        else if (typeof onPending === "function")
            onPending(lastResult.reason);
        else if (onPending)
            pending(lastResult.reason);
    }
    specHelper.invokeInitialization = invokeInitialization;
    function withInitialized(id, onSuccess, onPending) {
        let lastResult = dataCreationCache[id];
        if (typeof lastResult === "undefined")
            throw new Error("No test data initialized.");
        if (isSuccessResult(lastResult))
            onSuccess();
        else if (typeof onPending === "function")
            onPending(lastResult.reason);
        else if (onPending)
            pending(lastResult.reason);
    }
    specHelper.withInitialized = withInitialized;
    let pendingCreateMock = Symbol();
    let pendingNewPageTitleService = Symbol();
    let pendingConfigurePageTitleService = Symbol();
    let pendingMainContentControllerScope = Symbol();
    let pendingMainContentController = Symbol();
    let pendingRegexFlags = Symbol();
    function createPageTitleService() {
        return new app.PageTitleService();
    }
    specHelper.createPageTitleService = createPageTitleService;
    function initializeNewAngularMockModule(name, onSuccess, onPending) {
        invokeInitialization(pendingCreateMock, function () { angular.mock.module((typeof name === "string" && name.trim().length > 0) ? name : 'MyGitHubPages'); }, "Failed to create angular mock module", onSuccess, onPending);
    }
    specHelper.initializeNewAngularMockModule = initializeNewAngularMockModule;
    function withAngularMockModule(onSuccess, onPending) { withInitialized(pendingCreateMock, onSuccess, onPending); }
    specHelper.withAngularMockModule = withAngularMockModule;
    function initializeNewPageTitleService(onSuccess, onPending) {
        initializeTestData(pendingNewPageTitleService, createPageTitleService, "Failed to create new PageTitleService object", onPending, onSuccess);
    }
    specHelper.initializeNewPageTitleService = initializeNewPageTitleService;
    function withPageTitleService(onSuccess, onPending) {
        withTestData(pendingNewPageTitleService, onSuccess, onPending);
    }
    specHelper.withPageTitleService = withPageTitleService;
    function configurePageTitleService(pageTitleService, scope, pageTitle, subTitle, regexHref, onSuccess, onPending) {
        initializeTestData(pendingConfigurePageTitleService, function () {
            pageTitleService.setScope(scope);
            if (pageTitleService.pageTitle(pageTitle) !== pageTitle || scope.pageTitle !== pageTitle)
                throw new Error("Failed to set page title");
            if (pageTitleService.pageSubTitle(subTitle) !== subTitle || scope.subTitle !== subTitle)
                throw new Error("Failed to set page sub-title");
            if (pageTitleService.regexHref(regexHref) !== regexHref || scope.regexHref !== regexHref)
                throw new Error("Failed to set regexHref");
            return pageTitleService;
        }, "Failed to initialize PageTitleService object", onPending, onSuccess);
    }
    specHelper.configurePageTitleService = configurePageTitleService;
    function withConfiguredPageTitleService(onSuccess, onPending) {
        withTestData(pendingConfigurePageTitleService, onSuccess, onPending);
    }
    specHelper.withConfiguredPageTitleService = withConfiguredPageTitleService;
    function initializeNewMainContentControllerScope(rootScope, onSuccess, onPending) {
        initializeTestData(pendingMainContentControllerScope, function () { return rootScope.$new(); }, 'Failed to create app.IMainContentControllerScope object', onPending, onSuccess);
    }
    specHelper.initializeNewMainContentControllerScope = initializeNewMainContentControllerScope;
    function withMainContentControllerScope(onSuccess, onPending) {
        withTestData(pendingMainContentControllerScope, onSuccess, onPending);
    }
    specHelper.withMainContentControllerScope = withMainContentControllerScope;
    function createMainContentController(controller, scope, pageTitleService) {
        return controller('mainContentController', { $scope: scope, pageTitleService: pageTitleService });
    }
    specHelper.createMainContentController = createMainContentController;
    function initializeMainContentController(controller, scope, pageTitleService, onSuccess, onPending) {
        initializeTestData(pendingMainContentController, function () { return createMainContentController(controller, scope, pageTitleService); }, 'Failed to create app.MainContentController object', onPending, onSuccess);
    }
    specHelper.initializeMainContentController = initializeMainContentController;
    function withMainContentController(onSuccess, onPending) {
        withTestData(pendingMainContentController, onSuccess, onPending);
    }
    specHelper.withMainContentController = withMainContentController;
    function initializeRegexFlags(flags, onSuccess, onPending) {
        initializeTestData(pendingRegexFlags, function () { return (typeof flags === "string") ? new regexTester.RegexFlags(flags) : new regexTester.RegexFlags(); }, 'Failed to create regexTester.RegexFlags object', onPending, onSuccess);
    }
    specHelper.initializeRegexFlags = initializeRegexFlags;
    function withRegexFlags(onSuccess, onPending) {
        withTestData(pendingRegexFlags, onSuccess, onPending);
    }
    specHelper.withRegexFlags = withRegexFlags;
})(specHelper || (specHelper = {}));
var specHelperOld;
(function (specHelperOld) {
    let pendingErrors;
    let pendingCreateMock = Symbol();
    let pendingNewPageTitleService = Symbol();
    let pendingMainContentControllerScope = Symbol();
    let pendingMainContentController = Symbol();
    function withInitialize(id, initializeCallback, onFail, onSuccess, onPending) {
        if (typeof pendingErrors[id] === "undefined") {
            try {
                initializeCallback();
            }
            catch (e) {
                pendingErrors[id] = (typeof onFail === "function") ? onFail(e) : onFail + ": " + e;
                if (typeof onPending === "function")
                    onPending(pendingErrors[id]);
                else if (onPending)
                    pending(pendingErrors[id]);
                return;
            }
            onSuccess();
        }
        else if (typeof onPending === "function")
            onPending(pendingErrors[id]);
        else if (onPending)
            pending(pendingErrors[id]);
    }
    specHelperOld.withInitialize = withInitialize;
    function withTestData(id, createTestData, onFail, onSuccess, onPending) {
        let result;
        withInitialize(id, function () { result = createTestData(); }, onFail, function () { onSuccess(result); }, onPending);
    }
    specHelperOld.withTestData = withTestData;
    function createMock(name, onPending, onSuccess) {
        withInitialize(pendingCreateMock, function () { angular.mock.module('MyGitHubPages'); }, "Failed to create angular mock module", onSuccess, onPending);
    }
    specHelperOld.createMock = createMock;
    function createPageTitleService() { return new app.PageTitleService(); }
    specHelperOld.createPageTitleService = createPageTitleService;
    function withNewPageTitleService(onSuccess, onPending) {
        withTestData(pendingNewPageTitleService, function () { return createPageTitleService(); }, "Failed to create new PageTitleService object", onSuccess, onPending);
    }
    specHelperOld.withNewPageTitleService = withNewPageTitleService;
    function withMainContentControllerScope(rootScope, onSuccess, onPending) {
        withTestData(pendingMainContentControllerScope, function () { return rootScope.$new(); }, 'Failed to create app.IMainContentControllerScope object', onSuccess, onPending);
    }
    specHelperOld.withMainContentControllerScope = withMainContentControllerScope;
    function withMainContentController(controller, scope, pageTitleService, onSuccess, onPending) {
        withTestData(pendingMainContentController, function () { return controller('mainContentController', { $scope: scope, pageTitleService: pageTitleService }); }, 'Failed to create app.MainContentController object', onSuccess, onPending);
    }
    specHelperOld.withMainContentController = withMainContentController;
})(specHelperOld || (specHelperOld = {}));
//# sourceMappingURL=SpecHelper.js.map