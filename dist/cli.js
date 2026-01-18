#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = __importDefault(require("yargs"));
var cmd_1 = __importDefault(require("./cmd"));
yargs_1.default(process.argv.slice(2))
    .command({
    command: "new [path]",
    describe: "Generate new syte project",
    builder: function (yargs) {
        return yargs.positional("path", {
            describe: "Where to create syte project",
            default: ".",
        });
    },
    handler: cmd_1.default.new,
})
    .command({
    command: "serve [path]",
    describe: "Serve the given syte project",
    builder: function (yargs) {
        return yargs
            .positional("path", {
            describe: "Path to the root directory of syte project",
            default: ".",
        })
            .options({
            port: {
                alias: "p",
                describe: "Port to serve on",
                default: 3500,
            },
        });
    },
    handler: cmd_1.default.serve,
})
    .command({
    command: "build [path]",
    describe: "Compile syte project into a static site",
    builder: function (yargs) {
        return yargs
            .positional("path", {
            describe: "Path to the root directory of syte project",
            default: ".",
        })
            .options({
            outputPath: {
                alias: "o",
                describe: "Path where syte site will be written",
                default: "build",
            },
            urlPathPrefix: {
                describe: "Specify a path to prefix the url path",
                default: "/",
            },
        });
    },
    handler: cmd_1.default.build,
})
    .help().argv;
