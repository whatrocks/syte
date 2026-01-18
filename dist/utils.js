"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadYamlObject = exports.isObject = exports.isString = exports.shallowMerge = exports.isBlank = void 0;
var js_yaml_1 = __importDefault(require("js-yaml"));
var NON_WHITESPACE_RE = /\S/;
function isBlank(s) {
    return !NON_WHITESPACE_RE.test(s);
}
exports.isBlank = isBlank;
function shallowMerge() {
    var o = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        o[_i] = arguments[_i];
    }
    return Object.assign.apply(Object, __spreadArray([{}], o));
}
exports.shallowMerge = shallowMerge;
function isString(o) {
    return Object.prototype.toString.call(o) === "[object String]";
}
exports.isString = isString;
function isObject(o) {
    if (o === undefined || o === null) {
        return false;
    }
    return o.constructor === Object;
}
exports.isObject = isObject;
function loadYamlObject(contents) {
    var value = isBlank(contents) ? {} : js_yaml_1.default.load(contents);
    if (!isObject(value)) {
        throw new Error("Expected yaml object but got " + contents);
    }
    return value;
}
exports.loadYamlObject = loadYamlObject;
