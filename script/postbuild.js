"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cpx = require("cpx");
cpx.copySync("../src/{*.js,*.css,*.ico,*.html,*.htm}", '../gh-pages', { clean: true });
cpx.copySync("../src/lib/**/*", '../gh-pages/lib', { clean: true });
['colorBuilder', 'regexTester', 'uriBuilder'].forEach((n) => {
    cpx.copySync("../src/" + n + '/**/{*.js,*.htm}', '../gh-pages/' + n, { clean: true });
});
cpx.copySync('../src/images/**/*', '../gh-pages/images', { clean: true });
//# sourceMappingURL=postbuild.js.map