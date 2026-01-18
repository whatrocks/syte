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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var ejs_1 = __importDefault(require("ejs"));
var farcaster_feed_1 = require("farcaster-feed");
var marked_1 = __importDefault(require("marked"));
var rss_1 = __importDefault(require("rss"));
var send_1 = __importDefault(require("send"));
var templates_1 = __importDefault(require("./templates"));
var fm_1 = __importDefault(require("./fm"));
var fs_1 = __importDefault(require("./fs"));
var utils_1 = require("./utils");
var server_1 = __importDefault(require("./server"));
function urlPathJoin() {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    var path = paths.join("/");
    // Replace duplicate slashes with one slash
    path = path.replace(/\/+/g, "/");
    // Remove leading and trailing slashes
    path = path.replace(/^\/|\/$/g, "");
    return "/" + path;
}
function getLinkHref(link, appBaseURL) {
    return new URL(link, appBaseURL).href;
}
var URI_RE = new RegExp("^[-a-z]+://|^(?:cid|data):|^//");
var RSS_FILENAME = "rss.xml";
var PODCAST_RSS_FILENAME = "podcast.xml";
function buildPathTo(pathRoot) {
    return function (source) {
        if (utils_1.isString(source)) {
            var strSource = source;
            if (URI_RE.test(strSource)) {
                return strSource;
            }
            else {
                return urlPathJoin(pathRoot, strSource);
            }
        }
        else if (utils_1.isObject(source)) {
            var pageSource = source;
            return urlPathJoin(pathRoot, pageSource.urlPath);
        }
        else {
            throw new TypeError("Expected string or page object, received '" + source + "'");
        }
    };
}
function constructUrlPath(projectPagesPath, filePath) {
    var relativeFilePath = path_1.default.relative(projectPagesPath, filePath);
    var urlPath = relativeFilePath;
    // Remove supported extensions (.ejs and .md), e.g.:
    //
    //     foo/bar.js      => foo/bar.js
    //     foo/bar.ejs     => foo/bar
    //     foo/bar.md      => foo/bar
    //     foo/bar.baz.ejs => foo/bar.baz
    //
    urlPath = urlPath.replace(/\.md$|\.ejs$/, "");
    // urlPath should be the full path of the url, so ensure a '/' prefix
    urlPath = urlPath.startsWith("/") ? urlPath : "/" + urlPath;
    // If the file is an 'index' file, then omit 'index'
    urlPath = path_1.default.basename(urlPath) === "index" ? path_1.default.dirname(urlPath) : urlPath;
    return urlPath;
}
function isMarkdown(page) {
    return path_1.default.extname(page.filePath) === ".md";
}
function isAppYaml(projectPath, filePath) {
    var relativePath = path_1.default.relative(projectPath, filePath);
    return relativePath === "app.yaml";
}
function isLayout(projectPath, filePath) {
    var relativePath = path_1.default.relative(projectPath, filePath);
    return /^layouts\/.+/.test(relativePath);
}
function isPage(projectPath, filePath) {
    var relativePath = path_1.default.relative(projectPath, filePath);
    return /^pages\/.+/.test(relativePath);
}
function constructLayout(projectLayoutsPath, file) {
    var name = path_1.default.relative(projectLayoutsPath, file.filePath).replace(/\.ejs$/, "");
    return Object.freeze({ name: name, filePath: file.filePath, contents: file.contents });
}
function constructPage(projectPagesPath, file) {
    var filePath = file.filePath;
    var urlPath = constructUrlPath(projectPagesPath, file.filePath);
    var _a = fm_1.default.parse(file.contents), context = _a[0], contents = _a[1];
    context.urlPath = urlPath;
    return Object.freeze({ filePath: filePath, urlPath: urlPath, contents: contents, context: context });
}
function readApp(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var appFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.default.read(filePath)];
                case 1:
                    appFile = _a.sent();
                    return [2 /*return*/, utils_1.loadYamlObject(appFile.contents)];
            }
        });
    });
}
function readLayout(projectLayoutsPath, filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var layoutFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.default.read(filePath)];
                case 1:
                    layoutFile = _a.sent();
                    return [2 /*return*/, constructLayout(projectLayoutsPath, layoutFile)];
            }
        });
    });
}
function readPage(projectPagesPath, filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var pageFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.default.read(filePath)];
                case 1:
                    pageFile = _a.sent();
                    return [2 /*return*/, constructPage(projectPagesPath, pageFile)];
            }
        });
    });
}
function readAllLayouts(projectLayoutsPath, layoutPaths) {
    return __awaiter(this, void 0, void 0, function () {
        var promises;
        return __generator(this, function (_a) {
            promises = layoutPaths.map(function (filePath) { return readLayout(projectLayoutsPath, filePath); });
            return [2 /*return*/, Promise.all(promises)];
        });
    });
}
function readAllPages(projectPagesPath, pagesPath) {
    return __awaiter(this, void 0, void 0, function () {
        var promises;
        return __generator(this, function (_a) {
            promises = pagesPath.map(function (filePath) { return readPage(projectPagesPath, filePath); });
            return [2 /*return*/, Promise.all(promises)];
        });
    });
}
function renderPage(page, appContext, layouts, pages, options) {
    var context = utils_1.shallowMerge(appContext, page.context, {
        pathTo: buildPathTo(options.urlPathPrefix),
        pages: pages.map(function (page) { return page.context; }),
    });
    context.body = ejs_1.default.render(page.contents, context);
    if (isMarkdown(page)) {
        context.body = marked_1.default(context.body);
    }
    var layoutName = page.context.layout || appContext.layout;
    var layout = layouts.find(function (layout) { return layout.name === layoutName; });
    if (!layout) {
        throw new Error(layoutName + " layout doesn't exist");
    }
    return ejs_1.default.render(layout.contents, context);
}
function renderPageContentsForRSS(page, appBaseURL) {
    var renderer = new marked_1.default.Renderer();
    renderer.link = function (href, title, text) {
        var absoluteHref = getLinkHref(href, appBaseURL);
        return "<a href=\"" + absoluteHref + "\">" + text + "</a>";
    };
    renderer.image = function (href, title, text) {
        var absoluteHref = getLinkHref(href, appBaseURL);
        return "<img src=\"" + absoluteHref + "\" alt=\"" + text + "\">";
    };
    marked_1.default.setOptions({ renderer: renderer });
    return marked_1.default(page.contents);
}
function cmdNew(argv) {
    return __awaiter(this, void 0, void 0, function () {
        var projectPath, projectName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectPath = path_1.default.resolve(argv.path);
                    projectName = path_1.default.basename(projectPath);
                    return [4 /*yield*/, Promise.all([
                            fs_1.default.mkdirp(path_1.default.join(projectPath, "static")),
                            fs_1.default.mkdirp(path_1.default.join(projectPath, "layouts")),
                            fs_1.default.mkdirp(path_1.default.join(projectPath, "pages")),
                        ])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, templates_1.default.default.create(projectPath, projectName)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function cmdServe(argv) {
    return __awaiter(this, void 0, void 0, function () {
        var chokidar, projectPath, projectAppPath, projectLayoutsPath, projectPagesPath, syte, watcher;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chokidar = require("chokidar");
                    projectPath = path_1.default.resolve(argv.path);
                    projectAppPath = path_1.default.join(projectPath, "app.yaml");
                    return [4 /*yield*/, fs_1.default.exists(projectAppPath)];
                case 1:
                    if (!(_a.sent())) {
                        console.error("Cannot find app.yaml at " + projectAppPath);
                        process.exit(1);
                    }
                    projectLayoutsPath = path_1.default.join(projectPath, "layouts");
                    return [4 /*yield*/, fs_1.default.exists(projectLayoutsPath)];
                case 2:
                    if (!(_a.sent())) {
                        console.error("Cannot find layouts at " + projectLayoutsPath);
                        process.exit(1);
                    }
                    projectPagesPath = path_1.default.join(projectPath, "pages");
                    return [4 /*yield*/, fs_1.default.exists(projectPagesPath)];
                case 3:
                    if (!(_a.sent())) {
                        console.error("Cannot find pages at " + projectPagesPath);
                        process.exit(1);
                    }
                    syte = {
                        app: {},
                        layouts: [],
                        pages: [],
                    };
                    watcher = chokidar.watch([
                        projectPath + "/app.yaml",
                        projectPath + "/layouts/**/*.ejs",
                        projectPath + "/pages/**/*.(ejs|md)",
                    ]);
                    watcher.on("add", function (filePath) { return __awaiter(_this, void 0, void 0, function () {
                        var newApp, newLayout, newPage;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!isAppYaml(projectPath, filePath)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, readApp(filePath)];
                                case 1:
                                    newApp = _a.sent();
                                    syte.app = newApp;
                                    return [3 /*break*/, 6];
                                case 2:
                                    if (!isLayout(projectPath, filePath)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, readLayout(projectLayoutsPath, filePath)];
                                case 3:
                                    newLayout = _a.sent();
                                    syte.layouts.push(newLayout);
                                    return [3 /*break*/, 6];
                                case 4:
                                    if (!isPage(projectPath, filePath)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, readPage(projectPagesPath, filePath)];
                                case 5:
                                    newPage = _a.sent();
                                    syte.pages.push(newPage);
                                    _a.label = 6;
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    watcher.on("change", function (filePath) { return __awaiter(_this, void 0, void 0, function () {
                        var updatedApp, updatedLayout_1, updatedPage_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!isAppYaml(projectPath, filePath)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, readApp(filePath)];
                                case 1:
                                    updatedApp = _a.sent();
                                    syte.app = updatedApp;
                                    return [3 /*break*/, 6];
                                case 2:
                                    if (!isLayout(projectPath, filePath)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, readLayout(projectLayoutsPath, filePath)];
                                case 3:
                                    updatedLayout_1 = _a.sent();
                                    syte.layouts = syte.layouts.map(function (layout) {
                                        return layout.filePath === updatedLayout_1.filePath ? updatedLayout_1 : layout;
                                    });
                                    return [3 /*break*/, 6];
                                case 4:
                                    if (!isPage(projectPath, filePath)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, readPage(projectPagesPath, filePath)];
                                case 5:
                                    updatedPage_1 = _a.sent();
                                    syte.pages = syte.pages.map(function (page) {
                                        return page.filePath === updatedPage_1.filePath ? updatedPage_1 : page;
                                    });
                                    _a.label = 6;
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    watcher.on("unlink", function (filePath) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (isLayout(projectPath, filePath)) {
                                syte.layouts = syte.layouts.filter(function (lf) {
                                    return lf.filePath !== filePath;
                                });
                            }
                            else if (isPage(projectPath, filePath)) {
                                syte.pages = syte.pages.filter(function (p) {
                                    return p.filePath !== filePath;
                                });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    server_1.default.serve(argv.port, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var url, urlPath, page, body, staticFilePath;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    url = new URL(req.url, "http://" + req.headers.host);
                                    urlPath = url.pathname === "/" ? url.pathname : url.pathname.replace(/\/+$/, "");
                                    page = syte.pages.find(function (page) { return page.urlPath === urlPath; });
                                    if (page !== undefined) {
                                        body = renderPage(page, syte.app, syte.layouts, syte.pages, { urlPathPrefix: "/" });
                                        res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
                                        res.end(body);
                                        return [2 /*return*/];
                                    }
                                    staticFilePath = path_1.default.join(projectPath, "static", url.pathname);
                                    return [4 /*yield*/, fs_1.default.exists(staticFilePath)];
                                case 1:
                                    if (_a.sent()) {
                                        send_1.default(req, staticFilePath).pipe(res);
                                        return [2 /*return*/];
                                    }
                                    res.writeHead(404);
                                    res.end("Not Found");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
function cmdBuild(argv) {
    return __awaiter(this, void 0, void 0, function () {
        var projectPath, projectAppPath, appContext, projectLayoutsPath, layoutPaths, layouts, projectPagesPath, pagePaths, pages, outputPath, buildPages, buildRssFeed, castPostsToFarcaster, buildPodcastRssFeed, copyStatic, promises;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectPath = path_1.default.resolve(argv.path);
                    projectAppPath = path_1.default.join(projectPath, "app.yaml");
                    return [4 /*yield*/, fs_1.default.exists(projectAppPath)];
                case 1:
                    if (!(_a.sent())) {
                        console.error("Cannot find app context at " + projectAppPath);
                        process.exit(1);
                    }
                    return [4 /*yield*/, readApp(projectAppPath)];
                case 2:
                    appContext = _a.sent();
                    projectLayoutsPath = path_1.default.join(projectPath, "layouts");
                    return [4 /*yield*/, fs_1.default.glob(projectLayoutsPath + "/**/*.ejs")];
                case 3:
                    layoutPaths = _a.sent();
                    if (layoutPaths.length === 0) {
                        console.error("Cannot find layouts at " + projectLayoutsPath);
                        process.exit(1);
                    }
                    return [4 /*yield*/, readAllLayouts(projectLayoutsPath, layoutPaths)];
                case 4:
                    layouts = _a.sent();
                    projectPagesPath = path_1.default.join(projectPath, "pages");
                    return [4 /*yield*/, fs_1.default.glob(projectPagesPath + "/**/*.(ejs|md)")];
                case 5:
                    pagePaths = _a.sent();
                    if (pagePaths.length === 0) {
                        console.error("Cannot find pages at " + projectPagesPath);
                        process.exit(1);
                    }
                    return [4 /*yield*/, readAllPages(projectPagesPath, pagePaths)];
                case 6:
                    pages = _a.sent();
                    outputPath = path_1.default.resolve(argv.outputPath);
                    return [4 /*yield*/, fs_1.default.mkdirp(outputPath)];
                case 7:
                    _a.sent();
                    buildPages = function () {
                        return pages.map(function (page) { return __awaiter(_this, void 0, void 0, function () {
                            var pageContents, pageOutputDirPath, filePath;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        pageContents = renderPage(page, appContext, layouts, pages, argv);
                                        pageOutputDirPath = path_1.default.join(outputPath, page.urlPath);
                                        return [4 /*yield*/, fs_1.default.mkdirp(pageOutputDirPath)];
                                    case 1:
                                        _a.sent();
                                        filePath = path_1.default.join(pageOutputDirPath, "index.html");
                                        return [4 /*yield*/, fs_1.default.write(filePath, pageContents)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    };
                    buildRssFeed = function () {
                        var rssPath = path_1.default.join(outputPath, RSS_FILENAME);
                        var feed = new rss_1.default({
                            title: appContext.title,
                            description: appContext.title,
                            feed_url: appContext.base_url + "/" + RSS_FILENAME,
                            site_url: appContext.base_url,
                            pubDate: new Date(),
                            ttl: 60,
                        });
                        pages
                            .filter(function (page) { return page.context.date && page.context.title; })
                            .sort(function (a, b) { return new Date(b.context.date).getTime() - new Date(a.context.date).getTime(); })
                            .map(function (page) {
                            var contents = renderPageContentsForRSS(page, appContext.base_url);
                            feed.item({
                                title: page.context.title,
                                description: contents,
                                url: "" + appContext.base_url + page.urlPath,
                                date: page.context.date,
                            });
                        });
                        return fs_1.default.write(rssPath, feed.xml({ indent: true }));
                    };
                    castPostsToFarcaster = function (username, privateKey) {
                        var farcaster = new farcaster_feed_1.FarcasterFeed(username, privateKey);
                        var posts = pages
                            .filter(function (page) { return page.context.title && page.context.date; })
                            .sort(function (a, b) { return new Date(a.context.date).getTime() - new Date(b.context.date).getTime(); })
                            .map(function (page) { return ({ title: page.context.title, url: "" + appContext.base_url + page.urlPath }); });
                        return farcaster.castPosts(posts);
                    };
                    buildPodcastRssFeed = function () {
                        var podcastRssPath = path_1.default.join(outputPath, PODCAST_RSS_FILENAME);
                        var feed = new rss_1.default({
                            title: appContext.title,
                            description: appContext.podcast_subtitle,
                            categories: [appContext.podcast_category],
                            language: appContext.podcast_language || "en-us",
                            feed_url: appContext.base_url + "/" + PODCAST_RSS_FILENAME,
                            site_url: appContext.base_url,
                            pubDate: new Date(),
                            generator: "Syte",
                            ttl: 60,
                            custom_namespaces: {
                                itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
                            },
                            custom_elements: [
                                { "itunes:subtitle": appContext.podcast_subtitle },
                                { "itunes:author": appContext.podcast_author },
                                { "itunes:summary": appContext.podcast_summary },
                                { "itunes:explicit": appContext.podcast_explicit },
                                {
                                    "itunes:owner": [
                                        { "itunes:name": appContext.podcast_author },
                                        { "itunes:email": appContext.podcast_email },
                                    ],
                                },
                                {
                                    "itunes:image": {
                                        _attr: {
                                            href: appContext.podcast_img_url,
                                        },
                                    },
                                },
                                {
                                    "itunes:category": [
                                        {
                                            _attr: {
                                                text: appContext.podcast_category,
                                            },
                                        },
                                    ],
                                },
                            ],
                        });
                        pages
                            .filter(function (page) { return page.context.date && page.context.title && page.context.episode_url; })
                            .sort(function (a, b) { return new Date(b.context.date).getTime() - new Date(a.context.date).getTime(); })
                            .map(function (page) {
                            var contents = renderPageContentsForRSS(page, appContext.base_url);
                            feed.item({
                                title: page.context.title,
                                description: contents,
                                url: "" + appContext.base_url + page.urlPath,
                                date: page.context.date,
                                categories: [appContext.podcast_category],
                                enclosure: { url: page.context.episode_url, size: page.context.episode_length },
                                custom_elements: [
                                    { "itunes:author": appContext.podcast_author },
                                    { "itunes:title": page.context.title },
                                    { "itunes:duration": page.context.episode_duration },
                                    { "itunes:summary": page.context.episode_summary },
                                    { "itunes:subtitle": page.context.episode_summary },
                                    { "itunes:explicit": page.context.episode_explict },
                                    {
                                        "itunes:image": {
                                            _attr: {
                                                href: appContext.podcast_img_url,
                                            },
                                        },
                                    },
                                ],
                            });
                        });
                        return fs_1.default.write(podcastRssPath, feed.xml({ indent: true }));
                    };
                    copyStatic = function () {
                        var source = path_1.default.join(projectPath, "static");
                        var destination = path_1.default.join(outputPath);
                        return fs_1.default.copy(source, destination);
                    };
                    promises = __spreadArray([copyStatic()], buildPages());
                    if (appContext.base_url) {
                        promises.push(buildRssFeed());
                        if (appContext.podcast_author) {
                            promises.push(buildPodcastRssFeed());
                        }
                        if (appContext.farcaster_username && process.env.FARCASTER_MNEMONIC) {
                            promises.push(castPostsToFarcaster(appContext.farcaster_username, process.env.FARCASTER_MNEMONIC));
                        }
                    }
                    return [4 /*yield*/, Promise.all(promises)];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = {
    new: cmdNew,
    serve: cmdServe,
    build: cmdBuild,
};
