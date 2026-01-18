"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("../../fs"));
var js_yaml_1 = __importDefault(require("js-yaml"));
function appContext(projectName, layoutName) {
    return js_yaml_1.default.dump({
        layout: layoutName,
        title: projectName,
    });
}
function appCss() {
    return "* {\n  box-sizing: border-box;\n}\n";
}
function appLayout() {
    return "<!DOCTYPE html>\n<html lang=\"en-us\">\n  <head>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <title><%= title %></title>\n    <link href=\"<%= pathTo(\"app.css\") %>\" rel=\"stylesheet\">\n  </head>\n  <body>\n    <%- body %>\n  </body>\n</html>\n";
}
function indexPage() {
    return "---\ntitle: Index Page\n---\n# Index page\n\nThis is your syte. It has <%= pages.length %> page(s).\n\nNavigation:\n<% for (const page of pages) { _%>\n* [<%= page.title || pathTo(page) %>](<%= pathTo(page) %>)\n<% } _%>\n\n## TODO\n\n- [X] Generate syte project\n- [ ] Customize generated templates\n- [ ] Deploy!\n";
}
function create(projectPath, projectName) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, Promise.all([
                    function () { return __awaiter(_this, void 0, void 0, function () {
                        var appContextPath;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    appContextPath = path_1.default.join(projectPath, "app.yaml");
                                    return [4 /*yield*/, fs_1.default.exists(appContextPath)];
                                case 1:
                                    if (!!(_a.sent())) return [3 /*break*/, 3];
                                    return [4 /*yield*/, fs_1.default.write(appContextPath, appContext(projectName, "app"))];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); },
                    function () { return __awaiter(_this, void 0, void 0, function () {
                        var appCssPath;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    appCssPath = path_1.default.join(projectPath, "static", "app.css");
                                    return [4 /*yield*/, fs_1.default.exists(appCssPath)];
                                case 1:
                                    if (!!(_a.sent())) return [3 /*break*/, 3];
                                    return [4 /*yield*/, fs_1.default.write(appCssPath, appCss())];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); },
                    function () { return __awaiter(_this, void 0, void 0, function () {
                        var appLayoutPath;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    appLayoutPath = path_1.default.join(projectPath, "layouts", "app.ejs");
                                    return [4 /*yield*/, fs_1.default.exists(appLayoutPath)];
                                case 1:
                                    if (!!(_a.sent())) return [3 /*break*/, 3];
                                    return [4 /*yield*/, fs_1.default.write(appLayoutPath, appLayout())];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); },
                    function () { return __awaiter(_this, void 0, void 0, function () {
                        var indexPagePath;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    indexPagePath = path_1.default.join(projectPath, "pages", "index.md");
                                    return [4 /*yield*/, fs_1.default.exists(indexPagePath)];
                                case 1:
                                    if (!!(_a.sent())) return [3 /*break*/, 3];
                                    return [4 /*yield*/, fs_1.default.write(indexPagePath, indexPage())];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); },
                ].map(function (f) { return f(); }))];
        });
    });
}
exports.default = { create: create };
