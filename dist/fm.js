"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var FM_OPEN_TAG_RE = /^---\s*$/;
var FM_CLOSE_TAG_RE = /^---\s*$/;
function parse(text) {
    var lines = text.split("\n");
    var linesLength = lines.length;
    var fmLines = [];
    var contentLines = [];
    var hasSeenFMOpenTag = false;
    var hasSeenFMCloseTag = false;
    for (var i = 0; i < linesLength; ++i) {
        var line = lines[i];
        if (!hasSeenFMOpenTag) {
            var lineIsFMOpenTag = FM_OPEN_TAG_RE.test(line);
            if (lineIsFMOpenTag) {
                hasSeenFMOpenTag = true;
            }
            else {
                return [{}, text];
            }
        }
        else if (hasSeenFMOpenTag && !hasSeenFMCloseTag) {
            var lineIsFMCloseTag = FM_CLOSE_TAG_RE.test(line);
            if (lineIsFMCloseTag) {
                hasSeenFMCloseTag = true;
            }
            else {
                fmLines.push(line);
            }
        }
        else {
            contentLines.push(line);
        }
    }
    if (hasSeenFMOpenTag && !hasSeenFMCloseTag) {
        throw new Error("EOF reached without closing front matter tag");
    }
    var contents = contentLines.join("\n");
    var contextStr = fmLines.join("\n");
    try {
        var context = utils_1.loadYamlObject(contextStr);
        return [context, contents];
    }
    catch (e) {
        throw new Error("Front matter must be a yaml object but found: " + contextStr);
    }
}
exports.default = { parse: parse };
