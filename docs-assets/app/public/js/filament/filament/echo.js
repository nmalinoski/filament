;(() => {
    var __create = Object.create,
        __defProp = Object.defineProperty,
        __getProtoOf = Object.getPrototypeOf,
        __hasOwnProp = Object.prototype.hasOwnProperty,
        __getOwnPropNames = Object.getOwnPropertyNames,
        __getOwnPropDesc = Object.getOwnPropertyDescriptor
    var __markAsModule = (target) =>
        __defProp(target, '__esModule', { value: !0 })
    var __commonJS = (callback, module) => () => (
        module ||
            ((module = { exports: {} }), callback(module.exports, module)),
        module.exports
    )
    var __exportStar = (target, module, desc) => {
            if (
                (module && typeof module == 'object') ||
                typeof module == 'function'
            )
                for (let key of __getOwnPropNames(module))
                    !__hasOwnProp.call(target, key) &&
                        key !== 'default' &&
                        __defProp(target, key, {
                            get: () => module[key],
                            enumerable:
                                !(desc = __getOwnPropDesc(module, key)) ||
                                desc.enumerable,
                        })
            return target
        },
        __toModule = (module) =>
            __exportStar(
                __markAsModule(
                    __defProp(
                        module != null ? __create(__getProtoOf(module)) : {},
                        'default',
                        module && module.__esModule && 'default' in module
                            ? { get: () => module.default, enumerable: !0 }
                            : { value: module, enumerable: !0 },
                    ),
                ),
                module,
            )
    var require_pusher = __commonJS((exports, module) => {
        ;(function (root, factory) {
            typeof exports == 'object' && typeof module == 'object'
                ? (module.exports = factory())
                : typeof define == 'function' && define.amd
                ? define([], factory)
                : typeof exports == 'object'
                ? (exports.Pusher = factory())
                : (root.Pusher = factory())
        })(window, function () {
            return (function (modules) {
                var installedModules = {}
                function __webpack_require__(moduleId) {
                    if (installedModules[moduleId])
                        return installedModules[moduleId].exports
                    var module2 = (installedModules[moduleId] = {
                        i: moduleId,
                        l: !1,
                        exports: {},
                    })
                    return (
                        modules[moduleId].call(
                            module2.exports,
                            module2,
                            module2.exports,
                            __webpack_require__,
                        ),
                        (module2.l = !0),
                        module2.exports
                    )
                }
                return (
                    (__webpack_require__.m = modules),
                    (__webpack_require__.c = installedModules),
                    (__webpack_require__.d = function (exports2, name, getter) {
                        __webpack_require__.o(exports2, name) ||
                            Object.defineProperty(exports2, name, {
                                enumerable: !0,
                                get: getter,
                            })
                    }),
                    (__webpack_require__.r = function (exports2) {
                        typeof Symbol != 'undefined' &&
                            Symbol.toStringTag &&
                            Object.defineProperty(
                                exports2,
                                Symbol.toStringTag,
                                { value: 'Module' },
                            ),
                            Object.defineProperty(exports2, '__esModule', {
                                value: !0,
                            })
                    }),
                    (__webpack_require__.t = function (value, mode) {
                        if (
                            (mode & 1 && (value = __webpack_require__(value)),
                            mode & 8 ||
                                (mode & 4 &&
                                    typeof value == 'object' &&
                                    value &&
                                    value.__esModule))
                        )
                            return value
                        var ns = Object.create(null)
                        if (
                            (__webpack_require__.r(ns),
                            Object.defineProperty(ns, 'default', {
                                enumerable: !0,
                                value,
                            }),
                            mode & 2 && typeof value != 'string')
                        )
                            for (var key in value)
                                __webpack_require__.d(
                                    ns,
                                    key,
                                    function (key2) {
                                        return value[key2]
                                    }.bind(null, key),
                                )
                        return ns
                    }),
                    (__webpack_require__.n = function (module2) {
                        var getter =
                            module2 && module2.__esModule
                                ? function () {
                                      return module2.default
                                  }
                                : function () {
                                      return module2
                                  }
                        return (
                            __webpack_require__.d(getter, 'a', getter), getter
                        )
                    }),
                    (__webpack_require__.o = function (object, property) {
                        return Object.prototype.hasOwnProperty.call(
                            object,
                            property,
                        )
                    }),
                    (__webpack_require__.p = ''),
                    __webpack_require__((__webpack_require__.s = 2))
                )
            })([
                function (module2, exports2, __webpack_require__) {
                    'use strict'
                    var __extends =
                        (this && this.__extends) ||
                        (function () {
                            var extendStatics = function (d, b) {
                                return (
                                    (extendStatics =
                                        Object.setPrototypeOf ||
                                        ({ __proto__: [] } instanceof Array &&
                                            function (d2, b2) {
                                                d2.__proto__ = b2
                                            }) ||
                                        function (d2, b2) {
                                            for (var p in b2)
                                                b2.hasOwnProperty(p) &&
                                                    (d2[p] = b2[p])
                                        }),
                                    extendStatics(d, b)
                                )
                            }
                            return function (d, b) {
                                extendStatics(d, b)
                                function __() {
                                    this.constructor = d
                                }
                                d.prototype =
                                    b === null
                                        ? Object.create(b)
                                        : ((__.prototype = b.prototype),
                                          new __())
                            }
                        })()
                    Object.defineProperty(exports2, '__esModule', { value: !0 })
                    var INVALID_BYTE = 256,
                        Coder = (function () {
                            function Coder2(_paddingCharacter) {
                                _paddingCharacter === void 0 &&
                                    (_paddingCharacter = '='),
                                    (this._paddingCharacter = _paddingCharacter)
                            }
                            return (
                                (Coder2.prototype.encodedLength = function (
                                    length,
                                ) {
                                    return this._paddingCharacter
                                        ? (((length + 2) / 3) * 4) | 0
                                        : ((length * 8 + 5) / 6) | 0
                                }),
                                (Coder2.prototype.encode = function (data) {
                                    for (
                                        var out = '', i = 0;
                                        i < data.length - 2;
                                        i += 3
                                    ) {
                                        var c =
                                            (data[i] << 16) |
                                            (data[i + 1] << 8) |
                                            data[i + 2]
                                        ;(out += this._encodeByte(
                                            (c >>> (3 * 6)) & 63,
                                        )),
                                            (out += this._encodeByte(
                                                (c >>> (2 * 6)) & 63,
                                            )),
                                            (out += this._encodeByte(
                                                (c >>> (1 * 6)) & 63,
                                            )),
                                            (out += this._encodeByte(
                                                (c >>> (0 * 6)) & 63,
                                            ))
                                    }
                                    var left = data.length - i
                                    if (left > 0) {
                                        var c =
                                            (data[i] << 16) |
                                            (left === 2 ? data[i + 1] << 8 : 0)
                                        ;(out += this._encodeByte(
                                            (c >>> (3 * 6)) & 63,
                                        )),
                                            (out += this._encodeByte(
                                                (c >>> (2 * 6)) & 63,
                                            )),
                                            left === 2
                                                ? (out += this._encodeByte(
                                                      (c >>> (1 * 6)) & 63,
                                                  ))
                                                : (out +=
                                                      this._paddingCharacter ||
                                                      ''),
                                            (out +=
                                                this._paddingCharacter || '')
                                    }
                                    return out
                                }),
                                (Coder2.prototype.maxDecodedLength = function (
                                    length,
                                ) {
                                    return this._paddingCharacter
                                        ? ((length / 4) * 3) | 0
                                        : ((length * 6 + 7) / 8) | 0
                                }),
                                (Coder2.prototype.decodedLength = function (s) {
                                    return this.maxDecodedLength(
                                        s.length - this._getPaddingLength(s),
                                    )
                                }),
                                (Coder2.prototype.decode = function (s) {
                                    if (s.length === 0) return new Uint8Array(0)
                                    for (
                                        var paddingLength =
                                                this._getPaddingLength(s),
                                            length = s.length - paddingLength,
                                            out = new Uint8Array(
                                                this.maxDecodedLength(length),
                                            ),
                                            op = 0,
                                            i = 0,
                                            haveBad = 0,
                                            v0 = 0,
                                            v1 = 0,
                                            v2 = 0,
                                            v3 = 0;
                                        i < length - 4;
                                        i += 4
                                    )
                                        (v0 = this._decodeChar(
                                            s.charCodeAt(i + 0),
                                        )),
                                            (v1 = this._decodeChar(
                                                s.charCodeAt(i + 1),
                                            )),
                                            (v2 = this._decodeChar(
                                                s.charCodeAt(i + 2),
                                            )),
                                            (v3 = this._decodeChar(
                                                s.charCodeAt(i + 3),
                                            )),
                                            (out[op++] =
                                                (v0 << 2) | (v1 >>> 4)),
                                            (out[op++] =
                                                (v1 << 4) | (v2 >>> 2)),
                                            (out[op++] = (v2 << 6) | v3),
                                            (haveBad |= v0 & INVALID_BYTE),
                                            (haveBad |= v1 & INVALID_BYTE),
                                            (haveBad |= v2 & INVALID_BYTE),
                                            (haveBad |= v3 & INVALID_BYTE)
                                    if (
                                        (i < length - 1 &&
                                            ((v0 = this._decodeChar(
                                                s.charCodeAt(i),
                                            )),
                                            (v1 = this._decodeChar(
                                                s.charCodeAt(i + 1),
                                            )),
                                            (out[op++] =
                                                (v0 << 2) | (v1 >>> 4)),
                                            (haveBad |= v0 & INVALID_BYTE),
                                            (haveBad |= v1 & INVALID_BYTE)),
                                        i < length - 2 &&
                                            ((v2 = this._decodeChar(
                                                s.charCodeAt(i + 2),
                                            )),
                                            (out[op++] =
                                                (v1 << 4) | (v2 >>> 2)),
                                            (haveBad |= v2 & INVALID_BYTE)),
                                        i < length - 3 &&
                                            ((v3 = this._decodeChar(
                                                s.charCodeAt(i + 3),
                                            )),
                                            (out[op++] = (v2 << 6) | v3),
                                            (haveBad |= v3 & INVALID_BYTE)),
                                        haveBad !== 0)
                                    )
                                        throw new Error(
                                            'Base64Coder: incorrect characters for decoding',
                                        )
                                    return out
                                }),
                                (Coder2.prototype._encodeByte = function (b) {
                                    var result = b
                                    return (
                                        (result += 65),
                                        (result +=
                                            ((25 - b) >>> 8) &
                                            (0 - 65 - 26 + 97)),
                                        (result +=
                                            ((51 - b) >>> 8) &
                                            (26 - 97 - 52 + 48)),
                                        (result +=
                                            ((61 - b) >>> 8) &
                                            (52 - 48 - 62 + 43)),
                                        (result +=
                                            ((62 - b) >>> 8) &
                                            (62 - 43 - 63 + 47)),
                                        String.fromCharCode(result)
                                    )
                                }),
                                (Coder2.prototype._decodeChar = function (c) {
                                    var result = INVALID_BYTE
                                    return (
                                        (result +=
                                            (((42 - c) & (c - 44)) >>> 8) &
                                            (-INVALID_BYTE + c - 43 + 62)),
                                        (result +=
                                            (((46 - c) & (c - 48)) >>> 8) &
                                            (-INVALID_BYTE + c - 47 + 63)),
                                        (result +=
                                            (((47 - c) & (c - 58)) >>> 8) &
                                            (-INVALID_BYTE + c - 48 + 52)),
                                        (result +=
                                            (((64 - c) & (c - 91)) >>> 8) &
                                            (-INVALID_BYTE + c - 65 + 0)),
                                        (result +=
                                            (((96 - c) & (c - 123)) >>> 8) &
                                            (-INVALID_BYTE + c - 97 + 26)),
                                        result
                                    )
                                }),
                                (Coder2.prototype._getPaddingLength = function (
                                    s,
                                ) {
                                    var paddingLength = 0
                                    if (this._paddingCharacter) {
                                        for (
                                            var i = s.length - 1;
                                            i >= 0 &&
                                            s[i] === this._paddingCharacter;
                                            i--
                                        )
                                            paddingLength++
                                        if (s.length < 4 || paddingLength > 2)
                                            throw new Error(
                                                'Base64Coder: incorrect padding',
                                            )
                                    }
                                    return paddingLength
                                }),
                                Coder2
                            )
                        })()
                    exports2.Coder = Coder
                    var stdCoder = new Coder()
                    function encode(data) {
                        return stdCoder.encode(data)
                    }
                    exports2.encode = encode
                    function decode(s) {
                        return stdCoder.decode(s)
                    }
                    exports2.decode = decode
                    var URLSafeCoder = (function (_super) {
                        __extends(URLSafeCoder2, _super)
                        function URLSafeCoder2() {
                            return (
                                (_super !== null &&
                                    _super.apply(this, arguments)) ||
                                this
                            )
                        }
                        return (
                            (URLSafeCoder2.prototype._encodeByte = function (
                                b,
                            ) {
                                var result = b
                                return (
                                    (result += 65),
                                    (result +=
                                        ((25 - b) >>> 8) & (0 - 65 - 26 + 97)),
                                    (result +=
                                        ((51 - b) >>> 8) & (26 - 97 - 52 + 48)),
                                    (result +=
                                        ((61 - b) >>> 8) & (52 - 48 - 62 + 45)),
                                    (result +=
                                        ((62 - b) >>> 8) & (62 - 45 - 63 + 95)),
                                    String.fromCharCode(result)
                                )
                            }),
                            (URLSafeCoder2.prototype._decodeChar = function (
                                c,
                            ) {
                                var result = INVALID_BYTE
                                return (
                                    (result +=
                                        (((44 - c) & (c - 46)) >>> 8) &
                                        (-INVALID_BYTE + c - 45 + 62)),
                                    (result +=
                                        (((94 - c) & (c - 96)) >>> 8) &
                                        (-INVALID_BYTE + c - 95 + 63)),
                                    (result +=
                                        (((47 - c) & (c - 58)) >>> 8) &
                                        (-INVALID_BYTE + c - 48 + 52)),
                                    (result +=
                                        (((64 - c) & (c - 91)) >>> 8) &
                                        (-INVALID_BYTE + c - 65 + 0)),
                                    (result +=
                                        (((96 - c) & (c - 123)) >>> 8) &
                                        (-INVALID_BYTE + c - 97 + 26)),
                                    result
                                )
                            }),
                            URLSafeCoder2
                        )
                    })(Coder)
                    exports2.URLSafeCoder = URLSafeCoder
                    var urlSafeCoder = new URLSafeCoder()
                    function encodeURLSafe(data) {
                        return urlSafeCoder.encode(data)
                    }
                    exports2.encodeURLSafe = encodeURLSafe
                    function decodeURLSafe(s) {
                        return urlSafeCoder.decode(s)
                    }
                    ;(exports2.decodeURLSafe = decodeURLSafe),
                        (exports2.encodedLength = function (length) {
                            return stdCoder.encodedLength(length)
                        }),
                        (exports2.maxDecodedLength = function (length) {
                            return stdCoder.maxDecodedLength(length)
                        }),
                        (exports2.decodedLength = function (s) {
                            return stdCoder.decodedLength(s)
                        })
                },
                function (module2, exports2, __webpack_require__) {
                    'use strict'
                    Object.defineProperty(exports2, '__esModule', { value: !0 })
                    var INVALID_UTF16 = 'utf8: invalid string',
                        INVALID_UTF8 = 'utf8: invalid source encoding'
                    function encode(s) {
                        for (
                            var arr = new Uint8Array(encodedLength(s)),
                                pos = 0,
                                i = 0;
                            i < s.length;
                            i++
                        ) {
                            var c = s.charCodeAt(i)
                            c < 128
                                ? (arr[pos++] = c)
                                : c < 2048
                                ? ((arr[pos++] = 192 | (c >> 6)),
                                  (arr[pos++] = 128 | (c & 63)))
                                : c < 55296
                                ? ((arr[pos++] = 224 | (c >> 12)),
                                  (arr[pos++] = 128 | ((c >> 6) & 63)),
                                  (arr[pos++] = 128 | (c & 63)))
                                : (i++,
                                  (c = (c & 1023) << 10),
                                  (c |= s.charCodeAt(i) & 1023),
                                  (c += 65536),
                                  (arr[pos++] = 240 | (c >> 18)),
                                  (arr[pos++] = 128 | ((c >> 12) & 63)),
                                  (arr[pos++] = 128 | ((c >> 6) & 63)),
                                  (arr[pos++] = 128 | (c & 63)))
                        }
                        return arr
                    }
                    exports2.encode = encode
                    function encodedLength(s) {
                        for (var result = 0, i = 0; i < s.length; i++) {
                            var c = s.charCodeAt(i)
                            if (c < 128) result += 1
                            else if (c < 2048) result += 2
                            else if (c < 55296) result += 3
                            else if (c <= 57343) {
                                if (i >= s.length - 1)
                                    throw new Error(INVALID_UTF16)
                                i++, (result += 4)
                            } else throw new Error(INVALID_UTF16)
                        }
                        return result
                    }
                    exports2.encodedLength = encodedLength
                    function decode(arr) {
                        for (var chars = [], i = 0; i < arr.length; i++) {
                            var b = arr[i]
                            if (b & 128) {
                                var min = void 0
                                if (b < 224) {
                                    if (i >= arr.length)
                                        throw new Error(INVALID_UTF8)
                                    var n1 = arr[++i]
                                    if ((n1 & 192) != 128)
                                        throw new Error(INVALID_UTF8)
                                    ;(b = ((b & 31) << 6) | (n1 & 63)),
                                        (min = 128)
                                } else if (b < 240) {
                                    if (i >= arr.length - 1)
                                        throw new Error(INVALID_UTF8)
                                    var n1 = arr[++i],
                                        n2 = arr[++i]
                                    if ((n1 & 192) != 128 || (n2 & 192) != 128)
                                        throw new Error(INVALID_UTF8)
                                    ;(b =
                                        ((b & 15) << 12) |
                                        ((n1 & 63) << 6) |
                                        (n2 & 63)),
                                        (min = 2048)
                                } else if (b < 248) {
                                    if (i >= arr.length - 2)
                                        throw new Error(INVALID_UTF8)
                                    var n1 = arr[++i],
                                        n2 = arr[++i],
                                        n3 = arr[++i]
                                    if (
                                        (n1 & 192) != 128 ||
                                        (n2 & 192) != 128 ||
                                        (n3 & 192) != 128
                                    )
                                        throw new Error(INVALID_UTF8)
                                    ;(b =
                                        ((b & 15) << 18) |
                                        ((n1 & 63) << 12) |
                                        ((n2 & 63) << 6) |
                                        (n3 & 63)),
                                        (min = 65536)
                                } else throw new Error(INVALID_UTF8)
                                if (b < min || (b >= 55296 && b <= 57343))
                                    throw new Error(INVALID_UTF8)
                                if (b >= 65536) {
                                    if (b > 1114111)
                                        throw new Error(INVALID_UTF8)
                                    ;(b -= 65536),
                                        chars.push(
                                            String.fromCharCode(
                                                55296 | (b >> 10),
                                            ),
                                        ),
                                        (b = 56320 | (b & 1023))
                                }
                            }
                            chars.push(String.fromCharCode(b))
                        }
                        return chars.join('')
                    }
                    exports2.decode = decode
                },
                function (module2, exports2, __webpack_require__) {
                    module2.exports = __webpack_require__(3).default
                },
                function (module2, __webpack_exports__, __webpack_require__) {
                    'use strict'
                    __webpack_require__.r(__webpack_exports__)
                    var ScriptReceiverFactory = (function () {
                            function ScriptReceiverFactory2(prefix2, name) {
                                ;(this.lastId = 0),
                                    (this.prefix = prefix2),
                                    (this.name = name)
                            }
                            return (
                                (ScriptReceiverFactory2.prototype.create =
                                    function (callback) {
                                        this.lastId++
                                        var number = this.lastId,
                                            id = this.prefix + number,
                                            name =
                                                this.name + '[' + number + ']',
                                            called = !1,
                                            callbackWrapper = function () {
                                                called ||
                                                    (callback.apply(
                                                        null,
                                                        arguments,
                                                    ),
                                                    (called = !0))
                                            }
                                        return (
                                            (this[number] = callbackWrapper),
                                            {
                                                number,
                                                id,
                                                name,
                                                callback: callbackWrapper,
                                            }
                                        )
                                    }),
                                (ScriptReceiverFactory2.prototype.remove =
                                    function (receiver) {
                                        delete this[receiver.number]
                                    }),
                                ScriptReceiverFactory2
                            )
                        })(),
                        ScriptReceivers = new ScriptReceiverFactory(
                            '_pusher_script_',
                            'Pusher.ScriptReceivers',
                        ),
                        Defaults = {
                            VERSION: '7.6.0',
                            PROTOCOL: 7,
                            wsPort: 80,
                            wssPort: 443,
                            wsPath: '',
                            httpHost: 'sockjs.pusher.com',
                            httpPort: 80,
                            httpsPort: 443,
                            httpPath: '/pusher',
                            stats_host: 'stats.pusher.com',
                            authEndpoint: '/pusher/auth',
                            authTransport: 'ajax',
                            activityTimeout: 12e4,
                            pongTimeout: 3e4,
                            unavailableTimeout: 1e4,
                            cluster: 'mt1',
                            userAuthentication: {
                                endpoint: '/pusher/user-auth',
                                transport: 'ajax',
                            },
                            channelAuthorization: {
                                endpoint: '/pusher/auth',
                                transport: 'ajax',
                            },
                            cdn_http: 'http://js.pusher.com',
                            cdn_https: 'https://js.pusher.com',
                            dependency_suffix: '',
                        },
                        defaults = Defaults,
                        dependency_loader_DependencyLoader = (function () {
                            function DependencyLoader(options) {
                                ;(this.options = options),
                                    (this.receivers =
                                        options.receivers || ScriptReceivers),
                                    (this.loading = {})
                            }
                            return (
                                (DependencyLoader.prototype.load = function (
                                    name,
                                    options,
                                    callback,
                                ) {
                                    var self = this
                                    if (
                                        self.loading[name] &&
                                        self.loading[name].length > 0
                                    )
                                        self.loading[name].push(callback)
                                    else {
                                        self.loading[name] = [callback]
                                        var request =
                                                runtime.createScriptRequest(
                                                    self.getPath(name, options),
                                                ),
                                            receiver = self.receivers.create(
                                                function (error) {
                                                    if (
                                                        (self.receivers.remove(
                                                            receiver,
                                                        ),
                                                        self.loading[name])
                                                    ) {
                                                        var callbacks =
                                                            self.loading[name]
                                                        delete self.loading[
                                                            name
                                                        ]
                                                        for (
                                                            var successCallback =
                                                                    function (
                                                                        wasSuccessful,
                                                                    ) {
                                                                        wasSuccessful ||
                                                                            request.cleanup()
                                                                    },
                                                                i = 0;
                                                            i <
                                                            callbacks.length;
                                                            i++
                                                        )
                                                            callbacks[i](
                                                                error,
                                                                successCallback,
                                                            )
                                                    }
                                                },
                                            )
                                        request.send(receiver)
                                    }
                                }),
                                (DependencyLoader.prototype.getRoot = function (
                                    options,
                                ) {
                                    var cdn,
                                        protocol =
                                            runtime.getDocument().location
                                                .protocol
                                    return (
                                        (options && options.useTLS) ||
                                        protocol === 'https:'
                                            ? (cdn = this.options.cdn_https)
                                            : (cdn = this.options.cdn_http),
                                        cdn.replace(/\/*$/, '') +
                                            '/' +
                                            this.options.version
                                    )
                                }),
                                (DependencyLoader.prototype.getPath = function (
                                    name,
                                    options,
                                ) {
                                    return (
                                        this.getRoot(options) +
                                        '/' +
                                        name +
                                        this.options.suffix +
                                        '.js'
                                    )
                                }),
                                DependencyLoader
                            )
                        })(),
                        dependency_loader = dependency_loader_DependencyLoader,
                        DependenciesReceivers = new ScriptReceiverFactory(
                            '_pusher_dependencies',
                            'Pusher.DependenciesReceivers',
                        ),
                        Dependencies = new dependency_loader({
                            cdn_http: defaults.cdn_http,
                            cdn_https: defaults.cdn_https,
                            version: defaults.VERSION,
                            suffix: defaults.dependency_suffix,
                            receivers: DependenciesReceivers,
                        }),
                        urlStore = {
                            baseUrl: 'https://pusher.com',
                            urls: {
                                authenticationEndpoint: {
                                    path: '/docs/channels/server_api/authenticating_users',
                                },
                                authorizationEndpoint: {
                                    path: '/docs/channels/server_api/authorizing-users/',
                                },
                                javascriptQuickStart: {
                                    path: '/docs/javascript_quick_start',
                                },
                                triggeringClientEvents: {
                                    path: '/docs/client_api_guide/client_events#trigger-events',
                                },
                                encryptedChannelSupport: {
                                    fullUrl:
                                        'https://github.com/pusher/pusher-js/tree/cc491015371a4bde5743d1c87a0fbac0feb53195#encrypted-channel-support',
                                },
                            },
                        },
                        buildLogSuffix = function (key) {
                            var urlPrefix = 'See:',
                                urlObj = urlStore.urls[key]
                            if (!urlObj) return ''
                            var url
                            return (
                                urlObj.fullUrl
                                    ? (url = urlObj.fullUrl)
                                    : urlObj.path &&
                                      (url = urlStore.baseUrl + urlObj.path),
                                url ? urlPrefix + ' ' + url : ''
                            )
                        },
                        url_store = { buildLogSuffix },
                        AuthRequestType
                    ;(function (AuthRequestType2) {
                        ;(AuthRequestType2.UserAuthentication =
                            'user-authentication'),
                            (AuthRequestType2.ChannelAuthorization =
                                'channel-authorization')
                    })(AuthRequestType || (AuthRequestType = {}))
                    var __extends = (function () {
                            var extendStatics = function (d, b) {
                                return (
                                    (extendStatics =
                                        Object.setPrototypeOf ||
                                        ({ __proto__: [] } instanceof Array &&
                                            function (d2, b2) {
                                                d2.__proto__ = b2
                                            }) ||
                                        function (d2, b2) {
                                            for (var p in b2)
                                                b2.hasOwnProperty(p) &&
                                                    (d2[p] = b2[p])
                                        }),
                                    extendStatics(d, b)
                                )
                            }
                            return function (d, b) {
                                extendStatics(d, b)
                                function __() {
                                    this.constructor = d
                                }
                                d.prototype =
                                    b === null
                                        ? Object.create(b)
                                        : ((__.prototype = b.prototype),
                                          new __())
                            }
                        })(),
                        BadEventName = (function (_super) {
                            __extends(BadEventName2, _super)
                            function BadEventName2(msg) {
                                var _newTarget = this.constructor,
                                    _this = _super.call(this, msg) || this
                                return (
                                    Object.setPrototypeOf(
                                        _this,
                                        _newTarget.prototype,
                                    ),
                                    _this
                                )
                            }
                            return BadEventName2
                        })(Error),
                        BadChannelName = (function (_super) {
                            __extends(BadChannelName2, _super)
                            function BadChannelName2(msg) {
                                var _newTarget = this.constructor,
                                    _this = _super.call(this, msg) || this
                                return (
                                    Object.setPrototypeOf(
                                        _this,
                                        _newTarget.prototype,
                                    ),
                                    _this
                                )
                            }
                            return BadChannelName2
                        })(Error),
                        RequestTimedOut = (function (_super) {
                            __extends(RequestTimedOut2, _super)
                            function RequestTimedOut2(msg) {
                                var _newTarget = this.constructor,
                                    _this = _super.call(this, msg) || this
                                return (
                                    Object.setPrototypeOf(
                                        _this,
                                        _newTarget.prototype,
                                    ),
                                    _this
                                )
                            }
                            return RequestTimedOut2
                        })(Error),
                        TransportPriorityTooLow = (function (_super) {
                            __extends(TransportPriorityTooLow2, _super)
                            function TransportPriorityTooLow2(msg) {
                                var _newTarget = this.constructor,
                                    _this = _super.call(this, msg) || this
                                return (
                                    Object.setPrototypeOf(
                                        _this,
                                        _newTarget.prototype,
                                    ),
                                    _this
                                )
                            }
                            return TransportPriorityTooLow2
                        })(Error),
                        TransportClosed = (function (_super) {
                            __extends(TransportClosed2, _super)
                            function TransportClosed2(msg) {
                                var _newTarget = this.constructor,
                                    _this = _super.call(this, msg) || this
                                return (
                                    Object.setPrototypeOf(
                                        _this,
                                        _newTarget.prototype,
                                    ),
                                    _this
                                )
                            }
                            return TransportClosed2
                        })(Error),
                        UnsupportedFeature = (function (_super) {
                            __extends(UnsupportedFeature2, _super)
                            function UnsupportedFeature2(msg) {
                                var _newTarget = this.constructor,
                                    _this = _super.call(this, msg) || this
                                return (
                                    Object.setPrototypeOf(
                                        _this,
                                        _newTarget.prototype,
                                    ),
                                    _this
                                )
                            }
                            return UnsupportedFeature2
                        })(Error),
                        UnsupportedTransport = (function (_super) {
                            __extends(UnsupportedTransport2, _super)
                            function UnsupportedTransport2(msg) {
                                var _newTarget = this.constructor,
                                    _this = _super.call(this, msg) || this
                                return (
                                    Object.setPrototypeOf(
                                        _this,
                                        _newTarget.prototype,
                                    ),
                                    _this
                                )
                            }
                            return UnsupportedTransport2
                        })(Error),
                        UnsupportedStrategy = (function (_super) {
                            __extends(UnsupportedStrategy2, _super)
                            function UnsupportedStrategy2(msg) {
                                var _newTarget = this.constructor,
                                    _this = _super.call(this, msg) || this
                                return (
                                    Object.setPrototypeOf(
                                        _this,
                                        _newTarget.prototype,
                                    ),
                                    _this
                                )
                            }
                            return UnsupportedStrategy2
                        })(Error),
                        HTTPAuthError = (function (_super) {
                            __extends(HTTPAuthError2, _super)
                            function HTTPAuthError2(status, msg) {
                                var _newTarget = this.constructor,
                                    _this = _super.call(this, msg) || this
                                return (
                                    (_this.status = status),
                                    Object.setPrototypeOf(
                                        _this,
                                        _newTarget.prototype,
                                    ),
                                    _this
                                )
                            }
                            return HTTPAuthError2
                        })(Error),
                        ajax = function (
                            context,
                            query,
                            authOptions,
                            authRequestType,
                            callback,
                        ) {
                            var xhr = runtime.createXHR()
                            xhr.open('POST', authOptions.endpoint, !0),
                                xhr.setRequestHeader(
                                    'Content-Type',
                                    'application/x-www-form-urlencoded',
                                )
                            for (var headerName in authOptions.headers)
                                xhr.setRequestHeader(
                                    headerName,
                                    authOptions.headers[headerName],
                                )
                            if (authOptions.headersProvider != null) {
                                var dynamicHeaders =
                                    authOptions.headersProvider()
                                for (var headerName in dynamicHeaders)
                                    xhr.setRequestHeader(
                                        headerName,
                                        dynamicHeaders[headerName],
                                    )
                            }
                            return (
                                (xhr.onreadystatechange = function () {
                                    if (xhr.readyState === 4)
                                        if (xhr.status === 200) {
                                            var data = void 0,
                                                parsed = !1
                                            try {
                                                ;(data = JSON.parse(
                                                    xhr.responseText,
                                                )),
                                                    (parsed = !0)
                                            } catch (e) {
                                                callback(
                                                    new HTTPAuthError(
                                                        200,
                                                        'JSON returned from ' +
                                                            authRequestType.toString() +
                                                            ' endpoint was invalid, yet status code was 200. Data was: ' +
                                                            xhr.responseText,
                                                    ),
                                                    null,
                                                )
                                            }
                                            parsed && callback(null, data)
                                        } else {
                                            var suffix = ''
                                            switch (authRequestType) {
                                                case AuthRequestType.UserAuthentication:
                                                    suffix =
                                                        url_store.buildLogSuffix(
                                                            'authenticationEndpoint',
                                                        )
                                                    break
                                                case AuthRequestType.ChannelAuthorization:
                                                    suffix =
                                                        'Clients must be authorized to join private or presence channels. ' +
                                                        url_store.buildLogSuffix(
                                                            'authorizationEndpoint',
                                                        )
                                                    break
                                            }
                                            callback(
                                                new HTTPAuthError(
                                                    xhr.status,
                                                    'Unable to retrieve auth string from ' +
                                                        authRequestType.toString() +
                                                        ' endpoint - ' +
                                                        ('received status: ' +
                                                            xhr.status +
                                                            ' from ' +
                                                            authOptions.endpoint +
                                                            '. ' +
                                                            suffix),
                                                ),
                                                null,
                                            )
                                        }
                                }),
                                xhr.send(query),
                                xhr
                            )
                        },
                        xhr_auth = ajax
                    function encode(s) {
                        return btoa(utob(s))
                    }
                    for (
                        var fromCharCode = String.fromCharCode,
                            b64chars =
                                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
                            b64tab = {},
                            base64_i = 0,
                            l = b64chars.length;
                        base64_i < l;
                        base64_i++
                    )
                        b64tab[b64chars.charAt(base64_i)] = base64_i
                    var cb_utob = function (c) {
                            var cc = c.charCodeAt(0)
                            return cc < 128
                                ? c
                                : cc < 2048
                                ? fromCharCode(192 | (cc >>> 6)) +
                                  fromCharCode(128 | (cc & 63))
                                : fromCharCode(224 | ((cc >>> 12) & 15)) +
                                  fromCharCode(128 | ((cc >>> 6) & 63)) +
                                  fromCharCode(128 | (cc & 63))
                        },
                        utob = function (u) {
                            return u.replace(/[^\x00-\x7F]/g, cb_utob)
                        },
                        cb_encode = function (ccc) {
                            var padlen = [0, 2, 1][ccc.length % 3],
                                ord =
                                    (ccc.charCodeAt(0) << 16) |
                                    ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) <<
                                        8) |
                                    (ccc.length > 2 ? ccc.charCodeAt(2) : 0),
                                chars = [
                                    b64chars.charAt(ord >>> 18),
                                    b64chars.charAt((ord >>> 12) & 63),
                                    padlen >= 2
                                        ? '='
                                        : b64chars.charAt((ord >>> 6) & 63),
                                    padlen >= 1
                                        ? '='
                                        : b64chars.charAt(ord & 63),
                                ]
                            return chars.join('')
                        },
                        btoa =
                            window.btoa ||
                            function (b) {
                                return b.replace(/[\s\S]{1,3}/g, cb_encode)
                            },
                        Timer = (function () {
                            function Timer2(set, clear, delay, callback) {
                                var _this = this
                                ;(this.clear = clear),
                                    (this.timer = set(function () {
                                        _this.timer &&
                                            (_this.timer = callback(
                                                _this.timer,
                                            ))
                                    }, delay))
                            }
                            return (
                                (Timer2.prototype.isRunning = function () {
                                    return this.timer !== null
                                }),
                                (Timer2.prototype.ensureAborted = function () {
                                    this.timer &&
                                        (this.clear(this.timer),
                                        (this.timer = null))
                                }),
                                Timer2
                            )
                        })(),
                        abstract_timer = Timer,
                        timers_extends = (function () {
                            var extendStatics = function (d, b) {
                                return (
                                    (extendStatics =
                                        Object.setPrototypeOf ||
                                        ({ __proto__: [] } instanceof Array &&
                                            function (d2, b2) {
                                                d2.__proto__ = b2
                                            }) ||
                                        function (d2, b2) {
                                            for (var p in b2)
                                                b2.hasOwnProperty(p) &&
                                                    (d2[p] = b2[p])
                                        }),
                                    extendStatics(d, b)
                                )
                            }
                            return function (d, b) {
                                extendStatics(d, b)
                                function __() {
                                    this.constructor = d
                                }
                                d.prototype =
                                    b === null
                                        ? Object.create(b)
                                        : ((__.prototype = b.prototype),
                                          new __())
                            }
                        })()
                    function timers_clearTimeout(timer) {
                        window.clearTimeout(timer)
                    }
                    function timers_clearInterval(timer) {
                        window.clearInterval(timer)
                    }
                    var OneOffTimer = (function (_super) {
                            timers_extends(OneOffTimer2, _super)
                            function OneOffTimer2(delay, callback) {
                                return (
                                    _super.call(
                                        this,
                                        setTimeout,
                                        timers_clearTimeout,
                                        delay,
                                        function (timer) {
                                            return callback(), null
                                        },
                                    ) || this
                                )
                            }
                            return OneOffTimer2
                        })(abstract_timer),
                        PeriodicTimer = (function (_super) {
                            timers_extends(PeriodicTimer2, _super)
                            function PeriodicTimer2(delay, callback) {
                                return (
                                    _super.call(
                                        this,
                                        setInterval,
                                        timers_clearInterval,
                                        delay,
                                        function (timer) {
                                            return callback(), timer
                                        },
                                    ) || this
                                )
                            }
                            return PeriodicTimer2
                        })(abstract_timer),
                        Util = {
                            now: function () {
                                return Date.now
                                    ? Date.now()
                                    : new Date().valueOf()
                            },
                            defer: function (callback) {
                                return new OneOffTimer(0, callback)
                            },
                            method: function (name) {
                                for (
                                    var args = [], _i = 1;
                                    _i < arguments.length;
                                    _i++
                                )
                                    args[_i - 1] = arguments[_i]
                                var boundArguments = Array.prototype.slice.call(
                                    arguments,
                                    1,
                                )
                                return function (object) {
                                    return object[name].apply(
                                        object,
                                        boundArguments.concat(arguments),
                                    )
                                }
                            },
                        },
                        util = Util
                    function extend(target) {
                        for (
                            var sources = [], _i = 1;
                            _i < arguments.length;
                            _i++
                        )
                            sources[_i - 1] = arguments[_i]
                        for (var i = 0; i < sources.length; i++) {
                            var extensions = sources[i]
                            for (var property in extensions)
                                extensions[property] &&
                                extensions[property].constructor &&
                                extensions[property].constructor === Object
                                    ? (target[property] = extend(
                                          target[property] || {},
                                          extensions[property],
                                      ))
                                    : (target[property] = extensions[property])
                        }
                        return target
                    }
                    function stringify() {
                        for (
                            var m = ['Pusher'], i = 0;
                            i < arguments.length;
                            i++
                        )
                            typeof arguments[i] == 'string'
                                ? m.push(arguments[i])
                                : m.push(safeJSONStringify(arguments[i]))
                        return m.join(' : ')
                    }
                    function arrayIndexOf(array, item) {
                        var nativeIndexOf = Array.prototype.indexOf
                        if (array === null) return -1
                        if (nativeIndexOf && array.indexOf === nativeIndexOf)
                            return array.indexOf(item)
                        for (var i = 0, l2 = array.length; i < l2; i++)
                            if (array[i] === item) return i
                        return -1
                    }
                    function objectApply(object, f) {
                        for (var key in object)
                            Object.prototype.hasOwnProperty.call(object, key) &&
                                f(object[key], key, object)
                    }
                    function keys(object) {
                        var keys2 = []
                        return (
                            objectApply(object, function (_, key) {
                                keys2.push(key)
                            }),
                            keys2
                        )
                    }
                    function values(object) {
                        var values2 = []
                        return (
                            objectApply(object, function (value) {
                                values2.push(value)
                            }),
                            values2
                        )
                    }
                    function apply(array, f, context) {
                        for (var i = 0; i < array.length; i++)
                            f.call(context || window, array[i], i, array)
                    }
                    function map(array, f) {
                        for (var result = [], i = 0; i < array.length; i++)
                            result.push(f(array[i], i, array, result))
                        return result
                    }
                    function mapObject(object, f) {
                        var result = {}
                        return (
                            objectApply(object, function (value, key) {
                                result[key] = f(value)
                            }),
                            result
                        )
                    }
                    function filter(array, test) {
                        test =
                            test ||
                            function (value) {
                                return !!value
                            }
                        for (var result = [], i = 0; i < array.length; i++)
                            test(array[i], i, array, result) &&
                                result.push(array[i])
                        return result
                    }
                    function filterObject(object, test) {
                        var result = {}
                        return (
                            objectApply(object, function (value, key) {
                                ;((test && test(value, key, object, result)) ||
                                    Boolean(value)) &&
                                    (result[key] = value)
                            }),
                            result
                        )
                    }
                    function flatten(object) {
                        var result = []
                        return (
                            objectApply(object, function (value, key) {
                                result.push([key, value])
                            }),
                            result
                        )
                    }
                    function any(array, test) {
                        for (var i = 0; i < array.length; i++)
                            if (test(array[i], i, array)) return !0
                        return !1
                    }
                    function collections_all(array, test) {
                        for (var i = 0; i < array.length; i++)
                            if (!test(array[i], i, array)) return !1
                        return !0
                    }
                    function encodeParamsObject(data) {
                        return mapObject(data, function (value) {
                            return (
                                typeof value == 'object' &&
                                    (value = safeJSONStringify(value)),
                                encodeURIComponent(encode(value.toString()))
                            )
                        })
                    }
                    function buildQueryString(data) {
                        var params = filterObject(data, function (value) {
                                return value !== void 0
                            }),
                            query = map(
                                flatten(encodeParamsObject(params)),
                                util.method('join', '='),
                            ).join('&')
                        return query
                    }
                    function decycleObject(object) {
                        var objects = [],
                            paths = []
                        return (function derez(value, path) {
                            var i, name, nu
                            switch (typeof value) {
                                case 'object':
                                    if (!value) return null
                                    for (i = 0; i < objects.length; i += 1)
                                        if (objects[i] === value)
                                            return { $ref: paths[i] }
                                    if (
                                        (objects.push(value),
                                        paths.push(path),
                                        Object.prototype.toString.apply(
                                            value,
                                        ) === '[object Array]')
                                    )
                                        for (
                                            nu = [], i = 0;
                                            i < value.length;
                                            i += 1
                                        )
                                            nu[i] = derez(
                                                value[i],
                                                path + '[' + i + ']',
                                            )
                                    else {
                                        nu = {}
                                        for (name in value)
                                            Object.prototype.hasOwnProperty.call(
                                                value,
                                                name,
                                            ) &&
                                                (nu[name] = derez(
                                                    value[name],
                                                    path +
                                                        '[' +
                                                        JSON.stringify(name) +
                                                        ']',
                                                ))
                                    }
                                    return nu
                                case 'number':
                                case 'string':
                                case 'boolean':
                                    return value
                            }
                        })(object, '$')
                    }
                    function safeJSONStringify(source) {
                        try {
                            return JSON.stringify(source)
                        } catch (e) {
                            return JSON.stringify(decycleObject(source))
                        }
                    }
                    var logger_Logger = (function () {
                            function Logger() {
                                this.globalLog = function (message) {
                                    window.console &&
                                        window.console.log &&
                                        window.console.log(message)
                                }
                            }
                            return (
                                (Logger.prototype.debug = function () {
                                    for (
                                        var args = [], _i = 0;
                                        _i < arguments.length;
                                        _i++
                                    )
                                        args[_i] = arguments[_i]
                                    this.log(this.globalLog, args)
                                }),
                                (Logger.prototype.warn = function () {
                                    for (
                                        var args = [], _i = 0;
                                        _i < arguments.length;
                                        _i++
                                    )
                                        args[_i] = arguments[_i]
                                    this.log(this.globalLogWarn, args)
                                }),
                                (Logger.prototype.error = function () {
                                    for (
                                        var args = [], _i = 0;
                                        _i < arguments.length;
                                        _i++
                                    )
                                        args[_i] = arguments[_i]
                                    this.log(this.globalLogError, args)
                                }),
                                (Logger.prototype.globalLogWarn = function (
                                    message,
                                ) {
                                    window.console && window.console.warn
                                        ? window.console.warn(message)
                                        : this.globalLog(message)
                                }),
                                (Logger.prototype.globalLogError = function (
                                    message,
                                ) {
                                    window.console && window.console.error
                                        ? window.console.error(message)
                                        : this.globalLogWarn(message)
                                }),
                                (Logger.prototype.log = function (
                                    defaultLoggingFunction,
                                ) {
                                    for (
                                        var args = [], _i = 1;
                                        _i < arguments.length;
                                        _i++
                                    )
                                        args[_i - 1] = arguments[_i]
                                    var message = stringify.apply(
                                        this,
                                        arguments,
                                    )
                                    if (core_pusher.log)
                                        core_pusher.log(message)
                                    else if (core_pusher.logToConsole) {
                                        var log =
                                            defaultLoggingFunction.bind(this)
                                        log(message)
                                    }
                                }),
                                Logger
                            )
                        })(),
                        logger = new logger_Logger(),
                        jsonp = function (
                            context,
                            query,
                            authOptions,
                            authRequestType,
                            callback,
                        ) {
                            ;(authOptions.headers !== void 0 ||
                                authOptions.headersProvider != null) &&
                                logger.warn(
                                    'To send headers with the ' +
                                        authRequestType.toString() +
                                        ' request, you must use AJAX, rather than JSONP.',
                                )
                            var callbackName =
                                context.nextAuthCallbackID.toString()
                            context.nextAuthCallbackID++
                            var document2 = context.getDocument(),
                                script = document2.createElement('script')
                            context.auth_callbacks[callbackName] = function (
                                data,
                            ) {
                                callback(null, data)
                            }
                            var callback_name =
                                "Pusher.auth_callbacks['" + callbackName + "']"
                            script.src =
                                authOptions.endpoint +
                                '?callback=' +
                                encodeURIComponent(callback_name) +
                                '&' +
                                query
                            var head =
                                document2.getElementsByTagName('head')[0] ||
                                document2.documentElement
                            head.insertBefore(script, head.firstChild)
                        },
                        jsonp_auth = jsonp,
                        ScriptRequest = (function () {
                            function ScriptRequest2(src) {
                                this.src = src
                            }
                            return (
                                (ScriptRequest2.prototype.send = function (
                                    receiver,
                                ) {
                                    var self = this,
                                        errorString =
                                            'Error loading ' + self.src
                                    ;(self.script =
                                        document.createElement('script')),
                                        (self.script.id = receiver.id),
                                        (self.script.src = self.src),
                                        (self.script.type = 'text/javascript'),
                                        (self.script.charset = 'UTF-8'),
                                        self.script.addEventListener
                                            ? ((self.script.onerror =
                                                  function () {
                                                      receiver.callback(
                                                          errorString,
                                                      )
                                                  }),
                                              (self.script.onload =
                                                  function () {
                                                      receiver.callback(null)
                                                  }))
                                            : (self.script.onreadystatechange =
                                                  function () {
                                                      ;(self.script
                                                          .readyState ===
                                                          'loaded' ||
                                                          self.script
                                                              .readyState ===
                                                              'complete') &&
                                                          receiver.callback(
                                                              null,
                                                          )
                                                  }),
                                        self.script.async === void 0 &&
                                        document.attachEvent &&
                                        /opera/i.test(navigator.userAgent)
                                            ? ((self.errorScript =
                                                  document.createElement(
                                                      'script',
                                                  )),
                                              (self.errorScript.id =
                                                  receiver.id + '_error'),
                                              (self.errorScript.text =
                                                  receiver.name +
                                                  "('" +
                                                  errorString +
                                                  "');"),
                                              (self.script.async =
                                                  self.errorScript.async =
                                                      !1))
                                            : (self.script.async = !0)
                                    var head =
                                        document.getElementsByTagName('head')[0]
                                    head.insertBefore(
                                        self.script,
                                        head.firstChild,
                                    ),
                                        self.errorScript &&
                                            head.insertBefore(
                                                self.errorScript,
                                                self.script.nextSibling,
                                            )
                                }),
                                (ScriptRequest2.prototype.cleanup =
                                    function () {
                                        this.script &&
                                            ((this.script.onload =
                                                this.script.onerror =
                                                    null),
                                            (this.script.onreadystatechange =
                                                null)),
                                            this.script &&
                                                this.script.parentNode &&
                                                this.script.parentNode.removeChild(
                                                    this.script,
                                                ),
                                            this.errorScript &&
                                                this.errorScript.parentNode &&
                                                this.errorScript.parentNode.removeChild(
                                                    this.errorScript,
                                                ),
                                            (this.script = null),
                                            (this.errorScript = null)
                                    }),
                                ScriptRequest2
                            )
                        })(),
                        script_request = ScriptRequest,
                        jsonp_request_JSONPRequest = (function () {
                            function JSONPRequest(url, data) {
                                ;(this.url = url), (this.data = data)
                            }
                            return (
                                (JSONPRequest.prototype.send = function (
                                    receiver,
                                ) {
                                    if (!this.request) {
                                        var query = buildQueryString(this.data),
                                            url =
                                                this.url +
                                                '/' +
                                                receiver.number +
                                                '?' +
                                                query
                                        ;(this.request =
                                            runtime.createScriptRequest(url)),
                                            this.request.send(receiver)
                                    }
                                }),
                                (JSONPRequest.prototype.cleanup = function () {
                                    this.request && this.request.cleanup()
                                }),
                                JSONPRequest
                            )
                        })(),
                        jsonp_request = jsonp_request_JSONPRequest,
                        getAgent = function (sender, useTLS) {
                            return function (data, callback) {
                                var scheme =
                                        'http' + (useTLS ? 's' : '') + '://',
                                    url =
                                        scheme +
                                        (sender.host || sender.options.host) +
                                        sender.options.path,
                                    request = runtime.createJSONPRequest(
                                        url,
                                        data,
                                    ),
                                    receiver = runtime.ScriptReceivers.create(
                                        function (error, result) {
                                            ScriptReceivers.remove(receiver),
                                                request.cleanup(),
                                                result &&
                                                    result.host &&
                                                    (sender.host = result.host),
                                                callback &&
                                                    callback(error, result)
                                        },
                                    )
                                request.send(receiver)
                            }
                        },
                        jsonp_timeline_jsonp = { name: 'jsonp', getAgent },
                        jsonp_timeline = jsonp_timeline_jsonp
                    function getGenericURL(baseScheme, params, path) {
                        var scheme = baseScheme + (params.useTLS ? 's' : ''),
                            host = params.useTLS
                                ? params.hostTLS
                                : params.hostNonTLS
                        return scheme + '://' + host + path
                    }
                    function getGenericPath(key, queryString) {
                        var path = '/app/' + key,
                            query =
                                '?protocol=' +
                                defaults.PROTOCOL +
                                '&client=js&version=' +
                                defaults.VERSION +
                                (queryString ? '&' + queryString : '')
                        return path + query
                    }
                    var ws = {
                            getInitial: function (key, params) {
                                var path =
                                    (params.httpPath || '') +
                                    getGenericPath(key, 'flash=false')
                                return getGenericURL('ws', params, path)
                            },
                        },
                        http = {
                            getInitial: function (key, params) {
                                var path =
                                    (params.httpPath || '/pusher') +
                                    getGenericPath(key)
                                return getGenericURL('http', params, path)
                            },
                        },
                        sockjs = {
                            getInitial: function (key, params) {
                                return getGenericURL(
                                    'http',
                                    params,
                                    params.httpPath || '/pusher',
                                )
                            },
                            getPath: function (key, params) {
                                return getGenericPath(key)
                            },
                        },
                        callback_registry_CallbackRegistry = (function () {
                            function CallbackRegistry() {
                                this._callbacks = {}
                            }
                            return (
                                (CallbackRegistry.prototype.get = function (
                                    name,
                                ) {
                                    return this._callbacks[prefix(name)]
                                }),
                                (CallbackRegistry.prototype.add = function (
                                    name,
                                    callback,
                                    context,
                                ) {
                                    var prefixedEventName = prefix(name)
                                    ;(this._callbacks[prefixedEventName] =
                                        this._callbacks[prefixedEventName] ||
                                        []),
                                        this._callbacks[prefixedEventName].push(
                                            { fn: callback, context },
                                        )
                                }),
                                (CallbackRegistry.prototype.remove = function (
                                    name,
                                    callback,
                                    context,
                                ) {
                                    if (!name && !callback && !context) {
                                        this._callbacks = {}
                                        return
                                    }
                                    var names = name
                                        ? [prefix(name)]
                                        : keys(this._callbacks)
                                    callback || context
                                        ? this.removeCallback(
                                              names,
                                              callback,
                                              context,
                                          )
                                        : this.removeAllCallbacks(names)
                                }),
                                (CallbackRegistry.prototype.removeCallback =
                                    function (names, callback, context) {
                                        apply(
                                            names,
                                            function (name) {
                                                ;(this._callbacks[name] =
                                                    filter(
                                                        this._callbacks[name] ||
                                                            [],
                                                        function (binding) {
                                                            return (
                                                                (callback &&
                                                                    callback !==
                                                                        binding.fn) ||
                                                                (context &&
                                                                    context !==
                                                                        binding.context)
                                                            )
                                                        },
                                                    )),
                                                    this._callbacks[name]
                                                        .length === 0 &&
                                                        delete this._callbacks[
                                                            name
                                                        ]
                                            },
                                            this,
                                        )
                                    }),
                                (CallbackRegistry.prototype.removeAllCallbacks =
                                    function (names) {
                                        apply(
                                            names,
                                            function (name) {
                                                delete this._callbacks[name]
                                            },
                                            this,
                                        )
                                    }),
                                CallbackRegistry
                            )
                        })(),
                        callback_registry = callback_registry_CallbackRegistry
                    function prefix(name) {
                        return '_' + name
                    }
                    var dispatcher_Dispatcher = (function () {
                            function Dispatcher(failThrough) {
                                ;(this.callbacks = new callback_registry()),
                                    (this.global_callbacks = []),
                                    (this.failThrough = failThrough)
                            }
                            return (
                                (Dispatcher.prototype.bind = function (
                                    eventName,
                                    callback,
                                    context,
                                ) {
                                    return (
                                        this.callbacks.add(
                                            eventName,
                                            callback,
                                            context,
                                        ),
                                        this
                                    )
                                }),
                                (Dispatcher.prototype.bind_global = function (
                                    callback,
                                ) {
                                    return (
                                        this.global_callbacks.push(callback),
                                        this
                                    )
                                }),
                                (Dispatcher.prototype.unbind = function (
                                    eventName,
                                    callback,
                                    context,
                                ) {
                                    return (
                                        this.callbacks.remove(
                                            eventName,
                                            callback,
                                            context,
                                        ),
                                        this
                                    )
                                }),
                                (Dispatcher.prototype.unbind_global = function (
                                    callback,
                                ) {
                                    return callback
                                        ? ((this.global_callbacks = filter(
                                              this.global_callbacks || [],
                                              function (c) {
                                                  return c !== callback
                                              },
                                          )),
                                          this)
                                        : ((this.global_callbacks = []), this)
                                }),
                                (Dispatcher.prototype.unbind_all = function () {
                                    return (
                                        this.unbind(),
                                        this.unbind_global(),
                                        this
                                    )
                                }),
                                (Dispatcher.prototype.emit = function (
                                    eventName,
                                    data,
                                    metadata,
                                ) {
                                    for (
                                        var i = 0;
                                        i < this.global_callbacks.length;
                                        i++
                                    )
                                        this.global_callbacks[i](
                                            eventName,
                                            data,
                                        )
                                    var callbacks =
                                            this.callbacks.get(eventName),
                                        args = []
                                    if (
                                        (metadata
                                            ? args.push(data, metadata)
                                            : data && args.push(data),
                                        callbacks && callbacks.length > 0)
                                    )
                                        for (
                                            var i = 0;
                                            i < callbacks.length;
                                            i++
                                        )
                                            callbacks[i].fn.apply(
                                                callbacks[i].context || window,
                                                args,
                                            )
                                    else
                                        this.failThrough &&
                                            this.failThrough(eventName, data)
                                    return this
                                }),
                                Dispatcher
                            )
                        })(),
                        dispatcher = dispatcher_Dispatcher,
                        transport_connection_extends = (function () {
                            var extendStatics = function (d, b) {
                                return (
                                    (extendStatics =
                                        Object.setPrototypeOf ||
                                        ({ __proto__: [] } instanceof Array &&
                                            function (d2, b2) {
                                                d2.__proto__ = b2
                                            }) ||
                                        function (d2, b2) {
                                            for (var p in b2)
                                                b2.hasOwnProperty(p) &&
                                                    (d2[p] = b2[p])
                                        }),
                                    extendStatics(d, b)
                                )
                            }
                            return function (d, b) {
                                extendStatics(d, b)
                                function __() {
                                    this.constructor = d
                                }
                                d.prototype =
                                    b === null
                                        ? Object.create(b)
                                        : ((__.prototype = b.prototype),
                                          new __())
                            }
                        })(),
                        transport_connection_TransportConnection = (function (
                            _super,
                        ) {
                            transport_connection_extends(
                                TransportConnection,
                                _super,
                            )
                            function TransportConnection(
                                hooks,
                                name,
                                priority,
                                key,
                                options,
                            ) {
                                var _this = _super.call(this) || this
                                return (
                                    (_this.initialize =
                                        runtime.transportConnectionInitializer),
                                    (_this.hooks = hooks),
                                    (_this.name = name),
                                    (_this.priority = priority),
                                    (_this.key = key),
                                    (_this.options = options),
                                    (_this.state = 'new'),
                                    (_this.timeline = options.timeline),
                                    (_this.activityTimeout =
                                        options.activityTimeout),
                                    (_this.id =
                                        _this.timeline.generateUniqueID()),
                                    _this
                                )
                            }
                            return (
                                (TransportConnection.prototype.handlesActivityChecks =
                                    function () {
                                        return Boolean(
                                            this.hooks.handlesActivityChecks,
                                        )
                                    }),
                                (TransportConnection.prototype.supportsPing =
                                    function () {
                                        return Boolean(this.hooks.supportsPing)
                                    }),
                                (TransportConnection.prototype.connect =
                                    function () {
                                        var _this = this
                                        if (
                                            this.socket ||
                                            this.state !== 'initialized'
                                        )
                                            return !1
                                        var url = this.hooks.urls.getInitial(
                                            this.key,
                                            this.options,
                                        )
                                        try {
                                            this.socket = this.hooks.getSocket(
                                                url,
                                                this.options,
                                            )
                                        } catch (e) {
                                            return (
                                                util.defer(function () {
                                                    _this.onError(e),
                                                        _this.changeState(
                                                            'closed',
                                                        )
                                                }),
                                                !1
                                            )
                                        }
                                        return (
                                            this.bindListeners(),
                                            logger.debug('Connecting', {
                                                transport: this.name,
                                                url,
                                            }),
                                            this.changeState('connecting'),
                                            !0
                                        )
                                    }),
                                (TransportConnection.prototype.close =
                                    function () {
                                        return this.socket
                                            ? (this.socket.close(), !0)
                                            : !1
                                    }),
                                (TransportConnection.prototype.send = function (
                                    data,
                                ) {
                                    var _this = this
                                    return this.state === 'open'
                                        ? (util.defer(function () {
                                              _this.socket &&
                                                  _this.socket.send(data)
                                          }),
                                          !0)
                                        : !1
                                }),
                                (TransportConnection.prototype.ping =
                                    function () {
                                        this.state === 'open' &&
                                            this.supportsPing() &&
                                            this.socket.ping()
                                    }),
                                (TransportConnection.prototype.onOpen =
                                    function () {
                                        this.hooks.beforeOpen &&
                                            this.hooks.beforeOpen(
                                                this.socket,
                                                this.hooks.urls.getPath(
                                                    this.key,
                                                    this.options,
                                                ),
                                            ),
                                            this.changeState('open'),
                                            (this.socket.onopen = void 0)
                                    }),
                                (TransportConnection.prototype.onError =
                                    function (error) {
                                        this.emit('error', {
                                            type: 'WebSocketError',
                                            error,
                                        }),
                                            this.timeline.error(
                                                this.buildTimelineMessage({
                                                    error: error.toString(),
                                                }),
                                            )
                                    }),
                                (TransportConnection.prototype.onClose =
                                    function (closeEvent) {
                                        closeEvent
                                            ? this.changeState('closed', {
                                                  code: closeEvent.code,
                                                  reason: closeEvent.reason,
                                                  wasClean: closeEvent.wasClean,
                                              })
                                            : this.changeState('closed'),
                                            this.unbindListeners(),
                                            (this.socket = void 0)
                                    }),
                                (TransportConnection.prototype.onMessage =
                                    function (message) {
                                        this.emit('message', message)
                                    }),
                                (TransportConnection.prototype.onActivity =
                                    function () {
                                        this.emit('activity')
                                    }),
                                (TransportConnection.prototype.bindListeners =
                                    function () {
                                        var _this = this
                                        ;(this.socket.onopen = function () {
                                            _this.onOpen()
                                        }),
                                            (this.socket.onerror = function (
                                                error,
                                            ) {
                                                _this.onError(error)
                                            }),
                                            (this.socket.onclose = function (
                                                closeEvent,
                                            ) {
                                                _this.onClose(closeEvent)
                                            }),
                                            (this.socket.onmessage = function (
                                                message,
                                            ) {
                                                _this.onMessage(message)
                                            }),
                                            this.supportsPing() &&
                                                (this.socket.onactivity =
                                                    function () {
                                                        _this.onActivity()
                                                    })
                                    }),
                                (TransportConnection.prototype.unbindListeners =
                                    function () {
                                        this.socket &&
                                            ((this.socket.onopen = void 0),
                                            (this.socket.onerror = void 0),
                                            (this.socket.onclose = void 0),
                                            (this.socket.onmessage = void 0),
                                            this.supportsPing() &&
                                                (this.socket.onactivity =
                                                    void 0))
                                    }),
                                (TransportConnection.prototype.changeState =
                                    function (state2, params) {
                                        ;(this.state = state2),
                                            this.timeline.info(
                                                this.buildTimelineMessage({
                                                    state: state2,
                                                    params,
                                                }),
                                            ),
                                            this.emit(state2, params)
                                    }),
                                (TransportConnection.prototype.buildTimelineMessage =
                                    function (message) {
                                        return extend({ cid: this.id }, message)
                                    }),
                                TransportConnection
                            )
                        })(dispatcher),
                        transport_connection =
                            transport_connection_TransportConnection,
                        transport_Transport = (function () {
                            function Transport(hooks) {
                                this.hooks = hooks
                            }
                            return (
                                (Transport.prototype.isSupported = function (
                                    environment,
                                ) {
                                    return this.hooks.isSupported(environment)
                                }),
                                (Transport.prototype.createConnection =
                                    function (name, priority, key, options) {
                                        return new transport_connection(
                                            this.hooks,
                                            name,
                                            priority,
                                            key,
                                            options,
                                        )
                                    }),
                                Transport
                            )
                        })(),
                        transports_transport = transport_Transport,
                        WSTransport = new transports_transport({
                            urls: ws,
                            handlesActivityChecks: !1,
                            supportsPing: !1,
                            isInitialized: function () {
                                return Boolean(runtime.getWebSocketAPI())
                            },
                            isSupported: function () {
                                return Boolean(runtime.getWebSocketAPI())
                            },
                            getSocket: function (url) {
                                return runtime.createWebSocket(url)
                            },
                        }),
                        httpConfiguration = {
                            urls: http,
                            handlesActivityChecks: !1,
                            supportsPing: !0,
                            isInitialized: function () {
                                return !0
                            },
                        },
                        streamingConfiguration = extend(
                            {
                                getSocket: function (url) {
                                    return runtime.HTTPFactory.createStreamingSocket(
                                        url,
                                    )
                                },
                            },
                            httpConfiguration,
                        ),
                        pollingConfiguration = extend(
                            {
                                getSocket: function (url) {
                                    return runtime.HTTPFactory.createPollingSocket(
                                        url,
                                    )
                                },
                            },
                            httpConfiguration,
                        ),
                        xhrConfiguration = {
                            isSupported: function () {
                                return runtime.isXHRSupported()
                            },
                        },
                        XHRStreamingTransport = new transports_transport(
                            extend(
                                {},
                                streamingConfiguration,
                                xhrConfiguration,
                            ),
                        ),
                        XHRPollingTransport = new transports_transport(
                            extend({}, pollingConfiguration, xhrConfiguration),
                        ),
                        Transports = {
                            ws: WSTransport,
                            xhr_streaming: XHRStreamingTransport,
                            xhr_polling: XHRPollingTransport,
                        },
                        transports = Transports,
                        SockJSTransport = new transports_transport({
                            file: 'sockjs',
                            urls: sockjs,
                            handlesActivityChecks: !0,
                            supportsPing: !1,
                            isSupported: function () {
                                return !0
                            },
                            isInitialized: function () {
                                return window.SockJS !== void 0
                            },
                            getSocket: function (url, options) {
                                return new window.SockJS(url, null, {
                                    js_path: Dependencies.getPath('sockjs', {
                                        useTLS: options.useTLS,
                                    }),
                                    ignore_null_origin:
                                        options.ignoreNullOrigin,
                                })
                            },
                            beforeOpen: function (socket, path) {
                                socket.send(JSON.stringify({ path }))
                            },
                        }),
                        xdrConfiguration = {
                            isSupported: function (environment) {
                                var yes = runtime.isXDRSupported(
                                    environment.useTLS,
                                )
                                return yes
                            },
                        },
                        XDRStreamingTransport = new transports_transport(
                            extend(
                                {},
                                streamingConfiguration,
                                xdrConfiguration,
                            ),
                        ),
                        XDRPollingTransport = new transports_transport(
                            extend({}, pollingConfiguration, xdrConfiguration),
                        )
                    ;(transports.xdr_streaming = XDRStreamingTransport),
                        (transports.xdr_polling = XDRPollingTransport),
                        (transports.sockjs = SockJSTransport)
                    var transports_transports = transports,
                        net_info_extends = (function () {
                            var extendStatics = function (d, b) {
                                return (
                                    (extendStatics =
                                        Object.setPrototypeOf ||
                                        ({ __proto__: [] } instanceof Array &&
                                            function (d2, b2) {
                                                d2.__proto__ = b2
                                            }) ||
                                        function (d2, b2) {
                                            for (var p in b2)
                                                b2.hasOwnProperty(p) &&
                                                    (d2[p] = b2[p])
                                        }),
                                    extendStatics(d, b)
                                )
                            }
                            return function (d, b) {
                                extendStatics(d, b)
                                function __() {
                                    this.constructor = d
                                }
                                d.prototype =
                                    b === null
                                        ? Object.create(b)
                                        : ((__.prototype = b.prototype),
                                          new __())
                            }
                        })(),
                        NetInfo = (function (_super) {
                            net_info_extends(NetInfo2, _super)
                            function NetInfo2() {
                                var _this = _super.call(this) || this,
                                    self = _this
                                return (
                                    window.addEventListener !== void 0 &&
                                        (window.addEventListener(
                                            'online',
                                            function () {
                                                self.emit('online')
                                            },
                                            !1,
                                        ),
                                        window.addEventListener(
                                            'offline',
                                            function () {
                                                self.emit('offline')
                                            },
                                            !1,
                                        )),
                                    _this
                                )
                            }
                            return (
                                (NetInfo2.prototype.isOnline = function () {
                                    return window.navigator.onLine === void 0
                                        ? !0
                                        : window.navigator.onLine
                                }),
                                NetInfo2
                            )
                        })(dispatcher),
                        net_info_Network = new NetInfo(),
                        assistant_to_the_transport_manager_AssistantToTheTransportManager =
                            (function () {
                                function AssistantToTheTransportManager(
                                    manager,
                                    transport,
                                    options,
                                ) {
                                    ;(this.manager = manager),
                                        (this.transport = transport),
                                        (this.minPingDelay =
                                            options.minPingDelay),
                                        (this.maxPingDelay =
                                            options.maxPingDelay),
                                        (this.pingDelay = void 0)
                                }
                                return (
                                    (AssistantToTheTransportManager.prototype.createConnection =
                                        function (
                                            name,
                                            priority,
                                            key,
                                            options,
                                        ) {
                                            var _this = this
                                            options = extend({}, options, {
                                                activityTimeout: this.pingDelay,
                                            })
                                            var connection =
                                                    this.transport.createConnection(
                                                        name,
                                                        priority,
                                                        key,
                                                        options,
                                                    ),
                                                openTimestamp = null,
                                                onOpen = function () {
                                                    connection.unbind(
                                                        'open',
                                                        onOpen,
                                                    ),
                                                        connection.bind(
                                                            'closed',
                                                            onClosed,
                                                        ),
                                                        (openTimestamp =
                                                            util.now())
                                                },
                                                onClosed = function (
                                                    closeEvent,
                                                ) {
                                                    if (
                                                        (connection.unbind(
                                                            'closed',
                                                            onClosed,
                                                        ),
                                                        closeEvent.code ===
                                                            1002 ||
                                                            closeEvent.code ===
                                                                1003)
                                                    )
                                                        _this.manager.reportDeath()
                                                    else if (
                                                        !closeEvent.wasClean &&
                                                        openTimestamp
                                                    ) {
                                                        var lifespan =
                                                            util.now() -
                                                            openTimestamp
                                                        lifespan <
                                                            2 *
                                                                _this.maxPingDelay &&
                                                            (_this.manager.reportDeath(),
                                                            (_this.pingDelay =
                                                                Math.max(
                                                                    lifespan /
                                                                        2,
                                                                    _this.minPingDelay,
                                                                )))
                                                    }
                                                }
                                            return (
                                                connection.bind('open', onOpen),
                                                connection
                                            )
                                        }),
                                    (AssistantToTheTransportManager.prototype.isSupported =
                                        function (environment) {
                                            return (
                                                this.manager.isAlive() &&
                                                this.transport.isSupported(
                                                    environment,
                                                )
                                            )
                                        }),
                                    AssistantToTheTransportManager
                                )
                            })(),
                        assistant_to_the_transport_manager =
                            assistant_to_the_transport_manager_AssistantToTheTransportManager,
                        Protocol = {
                            decodeMessage: function (messageEvent) {
                                try {
                                    var messageData = JSON.parse(
                                            messageEvent.data,
                                        ),
                                        pusherEventData = messageData.data
                                    if (typeof pusherEventData == 'string')
                                        try {
                                            pusherEventData = JSON.parse(
                                                messageData.data,
                                            )
                                        } catch (e) {}
                                    var pusherEvent = {
                                        event: messageData.event,
                                        channel: messageData.channel,
                                        data: pusherEventData,
                                    }
                                    return (
                                        messageData.user_id &&
                                            (pusherEvent.user_id =
                                                messageData.user_id),
                                        pusherEvent
                                    )
                                } catch (e) {
                                    throw {
                                        type: 'MessageParseError',
                                        error: e,
                                        data: messageEvent.data,
                                    }
                                }
                            },
                            encodeMessage: function (event) {
                                return JSON.stringify(event)
                            },
                            processHandshake: function (messageEvent) {
                                var message =
                                    Protocol.decodeMessage(messageEvent)
                                if (
                                    message.event ===
                                    'pusher:connection_established'
                                ) {
                                    if (!message.data.activity_timeout)
                                        throw 'No activity timeout specified in handshake'
                                    return {
                                        action: 'connected',
                                        id: message.data.socket_id,
                                        activityTimeout:
                                            message.data.activity_timeout * 1e3,
                                    }
                                } else {
                                    if (message.event === 'pusher:error')
                                        return {
                                            action: this.getCloseAction(
                                                message.data,
                                            ),
                                            error: this.getCloseError(
                                                message.data,
                                            ),
                                        }
                                    throw 'Invalid handshake'
                                }
                            },
                            getCloseAction: function (closeEvent) {
                                return closeEvent.code < 4e3
                                    ? closeEvent.code >= 1002 &&
                                      closeEvent.code <= 1004
                                        ? 'backoff'
                                        : null
                                    : closeEvent.code === 4e3
                                    ? 'tls_only'
                                    : closeEvent.code < 4100
                                    ? 'refused'
                                    : closeEvent.code < 4200
                                    ? 'backoff'
                                    : closeEvent.code < 4300
                                    ? 'retry'
                                    : 'refused'
                            },
                            getCloseError: function (closeEvent) {
                                return closeEvent.code !== 1e3 &&
                                    closeEvent.code !== 1001
                                    ? {
                                          type: 'PusherError',
                                          data: {
                                              code: closeEvent.code,
                                              message:
                                                  closeEvent.reason ||
                                                  closeEvent.message,
                                          },
                                      }
                                    : null
                            },
                        },
                        protocol_protocol = Protocol,
                        connection_extends = (function () {
                            var extendStatics = function (d, b) {
                                return (
                                    (extendStatics =
                                        Object.setPrototypeOf ||
                                        ({ __proto__: [] } instanceof Array &&
                                            function (d2, b2) {
                                                d2.__proto__ = b2
                                            }) ||
                                        function (d2, b2) {
                                            for (var p in b2)
                                                b2.hasOwnProperty(p) &&
                                                    (d2[p] = b2[p])
                                        }),
                                    extendStatics(d, b)
                                )
                            }
                            return function (d, b) {
                                extendStatics(d, b)
                                function __() {
                                    this.constructor = d
                                }
                                d.prototype =
                                    b === null
                                        ? Object.create(b)
                                        : ((__.prototype = b.prototype),
                                          new __())
                            }
                        })(),
                        connection_Connection = (function (_super) {
                            connection_extends(Connection, _super)
                            function Connection(id, transport) {
                                var _this = _super.call(this) || this
                                return (
                                    (_this.id = id),
                                    (_this.transport = transport),
                                    (_this.activityTimeout =
                                        transport.activityTimeout),
                                    _this.bindListeners(),
                                    _this
                                )
                            }
                            return (
                                (Connection.prototype.handlesActivityChecks =
                                    function () {
                                        return this.transport.handlesActivityChecks()
                                    }),
                                (Connection.prototype.send = function (data) {
                                    return this.transport.send(data)
                                }),
                                (Connection.prototype.send_event = function (
                                    name,
                                    data,
                                    channel,
                                ) {
                                    var event = { event: name, data }
                                    return (
                                        channel && (event.channel = channel),
                                        logger.debug('Event sent', event),
                                        this.send(
                                            protocol_protocol.encodeMessage(
                                                event,
                                            ),
                                        )
                                    )
                                }),
                                (Connection.prototype.ping = function () {
                                    this.transport.supportsPing()
                                        ? this.transport.ping()
                                        : this.send_event('pusher:ping', {})
                                }),
                                (Connection.prototype.close = function () {
                                    this.transport.close()
                                }),
                                (Connection.prototype.bindListeners =
                                    function () {
                                        var _this = this,
                                            listeners = {
                                                message: function (
                                                    messageEvent,
                                                ) {
                                                    var pusherEvent
                                                    try {
                                                        pusherEvent =
                                                            protocol_protocol.decodeMessage(
                                                                messageEvent,
                                                            )
                                                    } catch (e) {
                                                        _this.emit('error', {
                                                            type: 'MessageParseError',
                                                            error: e,
                                                            data: messageEvent.data,
                                                        })
                                                    }
                                                    if (
                                                        pusherEvent !== void 0
                                                    ) {
                                                        switch (
                                                            (logger.debug(
                                                                'Event recd',
                                                                pusherEvent,
                                                            ),
                                                            pusherEvent.event)
                                                        ) {
                                                            case 'pusher:error':
                                                                _this.emit(
                                                                    'error',
                                                                    {
                                                                        type: 'PusherError',
                                                                        data: pusherEvent.data,
                                                                    },
                                                                )
                                                                break
                                                            case 'pusher:ping':
                                                                _this.emit(
                                                                    'ping',
                                                                )
                                                                break
                                                            case 'pusher:pong':
                                                                _this.emit(
                                                                    'pong',
                                                                )
                                                                break
                                                        }
                                                        _this.emit(
                                                            'message',
                                                            pusherEvent,
                                                        )
                                                    }
                                                },
                                                activity: function () {
                                                    _this.emit('activity')
                                                },
                                                error: function (error) {
                                                    _this.emit('error', error)
                                                },
                                                closed: function (closeEvent) {
                                                    unbindListeners(),
                                                        closeEvent &&
                                                            closeEvent.code &&
                                                            _this.handleCloseEvent(
                                                                closeEvent,
                                                            ),
                                                        (_this.transport =
                                                            null),
                                                        _this.emit('closed')
                                                },
                                            },
                                            unbindListeners = function () {
                                                objectApply(
                                                    listeners,
                                                    function (listener, event) {
                                                        _this.transport.unbind(
                                                            event,
                                                            listener,
                                                        )
                                                    },
                                                )
                                            }
                                        objectApply(
                                            listeners,
                                            function (listener, event) {
                                                _this.transport.bind(
                                                    event,
                                                    listener,
                                                )
                                            },
                                        )
                                    }),
                                (Connection.prototype.handleCloseEvent =
                                    function (closeEvent) {
                                        var action =
                                                protocol_protocol.getCloseAction(
                                                    closeEvent,
                                                ),
                                            error =
                                                protocol_protocol.getCloseError(
                                                    closeEvent,
                                                )
                                        error && this.emit('error', error),
                                            action &&
                                                this.emit(action, {
                                                    action,
                                                    error,
                                                })
                                    }),
                                Connection
                            )
                        })(dispatcher),
                        connection_connection = connection_Connection,
                        handshake_Handshake = (function () {
                            function Handshake(transport, callback) {
                                ;(this.transport = transport),
                                    (this.callback = callback),
                                    this.bindListeners()
                            }
                            return (
                                (Handshake.prototype.close = function () {
                                    this.unbindListeners(),
                                        this.transport.close()
                                }),
                                (Handshake.prototype.bindListeners =
                                    function () {
                                        var _this = this
                                        ;(this.onMessage = function (m) {
                                            _this.unbindListeners()
                                            var result
                                            try {
                                                result =
                                                    protocol_protocol.processHandshake(
                                                        m,
                                                    )
                                            } catch (e) {
                                                _this.finish('error', {
                                                    error: e,
                                                }),
                                                    _this.transport.close()
                                                return
                                            }
                                            result.action === 'connected'
                                                ? _this.finish('connected', {
                                                      connection:
                                                          new connection_connection(
                                                              result.id,
                                                              _this.transport,
                                                          ),
                                                      activityTimeout:
                                                          result.activityTimeout,
                                                  })
                                                : (_this.finish(result.action, {
                                                      error: result.error,
                                                  }),
                                                  _this.transport.close())
                                        }),
                                            (this.onClosed = function (
                                                closeEvent,
                                            ) {
                                                _this.unbindListeners()
                                                var action =
                                                        protocol_protocol.getCloseAction(
                                                            closeEvent,
                                                        ) || 'backoff',
                                                    error =
                                                        protocol_protocol.getCloseError(
                                                            closeEvent,
                                                        )
                                                _this.finish(action, { error })
                                            }),
                                            this.transport.bind(
                                                'message',
                                                this.onMessage,
                                            ),
                                            this.transport.bind(
                                                'closed',
                                                this.onClosed,
                                            )
                                    }),
                                (Handshake.prototype.unbindListeners =
                                    function () {
                                        this.transport.unbind(
                                            'message',
                                            this.onMessage,
                                        ),
                                            this.transport.unbind(
                                                'closed',
                                                this.onClosed,
                                            )
                                    }),
                                (Handshake.prototype.finish = function (
                                    action,
                                    params,
                                ) {
                                    this.callback(
                                        extend(
                                            {
                                                transport: this.transport,
                                                action,
                                            },
                                            params,
                                        ),
                                    )
                                }),
                                Handshake
                            )
                        })(),
                        connection_handshake = handshake_Handshake,
                        timeline_sender_TimelineSender = (function () {
                            function TimelineSender(timeline, options) {
                                ;(this.timeline = timeline),
                                    (this.options = options || {})
                            }
                            return (
                                (TimelineSender.prototype.send = function (
                                    useTLS,
                                    callback,
                                ) {
                                    this.timeline.isEmpty() ||
                                        this.timeline.send(
                                            runtime.TimelineTransport.getAgent(
                                                this,
                                                useTLS,
                                            ),
                                            callback,
                                        )
                                }),
                                TimelineSender
                            )
                        })(),
                        timeline_sender = timeline_sender_TimelineSender,
                        channel_extends = (function () {
                            var extendStatics = function (d, b) {
                                return (
                                    (extendStatics =
                                        Object.setPrototypeOf ||
                                        ({ __proto__: [] } instanceof Array &&
                                            function (d2, b2) {
                                                d2.__proto__ = b2
                                            }) ||
                                        function (d2, b2) {
                                            for (var p in b2)
                                                b2.hasOwnProperty(p) &&
                                                    (d2[p] = b2[p])
                                        }),
                                    extendStatics(d, b)
                                )
                            }
                            return function (d, b) {
                                extendStatics(d, b)
                                function __() {
                                    this.constructor = d
                                }
                                d.prototype =
                                    b === null
                                        ? Object.create(b)
                                        : ((__.prototype = b.prototype),
                                          new __())
                            }
                        })(),
                        channel_Channel = (function (_super) {
                            channel_extends(Channel2, _super)
                            function Channel2(name, pusher) {
                                var _this =
                                    _super.call(this, function (event, data) {
                                        logger.debug(
                                            'No callbacks on ' +
                                                name +
                                                ' for ' +
                                                event,
                                        )
                                    }) || this
                                return (
                                    (_this.name = name),
                                    (_this.pusher = pusher),
                                    (_this.subscribed = !1),
                                    (_this.subscriptionPending = !1),
                                    (_this.subscriptionCancelled = !1),
                                    _this
                                )
                            }
                            return (
                                (Channel2.prototype.authorize = function (
                                    socketId,
                                    callback,
                                ) {
                                    return callback(null, { auth: '' })
                                }),
                                (Channel2.prototype.trigger = function (
                                    event,
                                    data,
                                ) {
                                    if (event.indexOf('client-') !== 0)
                                        throw new BadEventName(
                                            "Event '" +
                                                event +
                                                "' does not start with 'client-'",
                                        )
                                    if (!this.subscribed) {
                                        var suffix = url_store.buildLogSuffix(
                                            'triggeringClientEvents',
                                        )
                                        logger.warn(
                                            "Client event triggered before channel 'subscription_succeeded' event . " +
                                                suffix,
                                        )
                                    }
                                    return this.pusher.send_event(
                                        event,
                                        data,
                                        this.name,
                                    )
                                }),
                                (Channel2.prototype.disconnect = function () {
                                    ;(this.subscribed = !1),
                                        (this.subscriptionPending = !1)
                                }),
                                (Channel2.prototype.handleEvent = function (
                                    event,
                                ) {
                                    var eventName = event.event,
                                        data = event.data
                                    if (
                                        eventName ===
                                        'pusher_internal:subscription_succeeded'
                                    )
                                        this.handleSubscriptionSucceededEvent(
                                            event,
                                        )
                                    else if (
                                        eventName ===
                                        'pusher_internal:subscription_count'
                                    )
                                        this.handleSubscriptionCountEvent(event)
                                    else if (
                                        eventName.indexOf(
                                            'pusher_internal:',
                                        ) !== 0
                                    ) {
                                        var metadata = {}
                                        this.emit(eventName, data, metadata)
                                    }
                                }),
                                (Channel2.prototype.handleSubscriptionSucceededEvent =
                                    function (event) {
                                        ;(this.subscriptionPending = !1),
                                            (this.subscribed = !0),
                                            this.subscriptionCancelled
                                                ? this.pusher.unsubscribe(
                                                      this.name,
                                                  )
                                                : this.emit(
                                                      'pusher:subscription_succeeded',
                                                      event.data,
                                                  )
                                    }),
                                (Channel2.prototype.handleSubscriptionCountEvent =
                                    function (event) {
                                        event.data.subscription_count &&
                                            (this.subscriptionCount =
                                                event.data.subscription_count),
                                            this.emit(
                                                'pusher:subscription_count',
                                                event.data,
                                            )
                                    }),
                                (Channel2.prototype.subscribe = function () {
                                    var _this = this
                                    this.subscribed ||
                                        ((this.subscriptionPending = !0),
                                        (this.subscriptionCancelled = !1),
                                        this.authorize(
                                            this.pusher.connection.socket_id,
                                            function (error, data) {
                                                error
                                                    ? ((_this.subscriptionPending =
                                                          !1),
                                                      logger.error(
                                                          error.toString(),
                                                      ),
                                                      _this.emit(
                                                          'pusher:subscription_error',
                                                          Object.assign(
                                                              {},
                                                              {
                                                                  type: 'AuthError',
                                                                  error: error.message,
                                                              },
                                                              error instanceof
                                                                  HTTPAuthError
                                                                  ? {
                                                                        status: error.status,
                                                                    }
                                                                  : {},
                                                          ),
                                                      ))
                                                    : _this.pusher.send_event(
                                                          'pusher:subscribe',
                                                          {
                                                              auth: data.auth,
                                                              channel_data:
                                                                  data.channel_data,
                                                              channel:
                                                                  _this.name,
                                                          },
                                                      )
                                            },
                                        ))
                                }),
                                (Channel2.prototype.unsubscribe = function () {
                                    ;(this.subscribed = !1),
                                        this.pusher.send_event(
                                            'pusher:unsubscribe',
                                            { channel: this.name },
                                        )
                                }),
                                (Channel2.prototype.cancelSubscription =
                                    function () {
                                        this.subscriptionCancelled = !0
                                    }),
                                (Channel2.prototype.reinstateSubscription =
                                    function () {
                                        this.subscriptionCancelled = !1
                                    }),
                                Channel2
                            )
                        })(dispatcher),
                        channels_channel = channel_Channel,
                        private_channel_extends = (function () {
                            var extendStatics = function (d, b) {
                                return (
                                    (extendStatics =
                                        Object.setPrototypeOf ||
                                        ({ __proto__: [] } instanceof Array &&
                                            function (d2, b2) {
                                                d2.__proto__ = b2
                                            }) ||
                                        function (d2, b2) {
                                            for (var p in b2)
                                                b2.hasOwnProperty(p) &&
                                                    (d2[p] = b2[p])
                                        }),
                                    extendStatics(d, b)
                                )
                            }
                            return function (d, b) {
                                extendStatics(d, b)
                                function __() {
                                    this.constructor = d
                                }
                                d.prototype =
                                    b === null
                                        ? Object.create(b)
                                        : ((__.prototype = b.prototype),
                                          new __())
                            }
                        })(),
                        PrivateChannel = (function (_super) {
                            private_channel_extends(PrivateChannel2, _super)
                            function PrivateChannel2() {
                                return (
                                    (_super !== null &&
                                        _super.apply(this, arguments)) ||
                                    this
                                )
                            }
                            return (
                                (PrivateChannel2.prototype.authorize =
                                    function (socketId, callback) {
                                        return this.pusher.config.channelAuthorizer(
                                            {
                                                channelName: this.name,
                                                socketId,
                                            },
                                            callback,
                                        )
                                    }),
                                PrivateChannel2
                            )
                        })(channels_channel),
                        private_channel = PrivateChannel,
                        members_Members = (function () {
                            function Members() {
                                this.reset()
                            }
                            return (
                                (Members.prototype.get = function (id) {
                                    return Object.prototype.hasOwnProperty.call(
                                        this.members,
                                        id,
                                    )
                                        ? { id, info: this.members[id] }
                                        : null
                                }),
                                (Members.prototype.each = function (callback) {
                                    var _this = this
                                    objectApply(
                                        this.members,
                                        function (member, id) {
                                            callback(_this.get(id))
                                        },
                                    )
                                }),
                                (Members.prototype.setMyID = function (id) {
                                    this.myID = id
                                }),
                                (Members.prototype.onSubscription = function (
                                    subscriptionData,
                                ) {
                                    ;(this.members =
                                        subscriptionData.presence.hash),
                                        (this.count =
                                            subscriptionData.presence.count),
                                        (this.me = this.get(this.myID))
                                }),
                                (Members.prototype.addMember = function (
                                    memberData,
                                ) {
                                    return (
                                        this.get(memberData.user_id) === null &&
                                            this.count++,
                                        (this.members[memberData.user_id] =
                                            memberData.user_info),
                                        this.get(memberData.user_id)
                                    )
                                }),
                                (Members.prototype.removeMember = function (
                                    memberData,
                                ) {
                                    var member = this.get(memberData.user_id)
                                    return (
                                        member &&
                                            (delete this.members[
                                                memberData.user_id
                                            ],
                                            this.count--),
                                        member
                                    )
                                }),
                                (Members.prototype.reset = function () {
                                    ;(this.members = {}),
                                        (this.count = 0),
                                        (this.myID = null),
                                        (this.me = null)
                                }),
                                Members
                            )
                        })(),
                        members = members_Members,
                        presence_channel_extends = (function () {
                            var extendStatics = function (d, b) {
                                return (
                                    (extendStatics =
                                        Object.setPrototypeOf ||
                                        ({ __proto__: [] } instanceof Array &&
                                            function (d2, b2) {
                                                d2.__proto__ = b2
                                            }) ||
                                        function (d2, b2) {
                                            for (var p in b2)
                                                b2.hasOwnProperty(p) &&
                                                    (d2[p] = b2[p])
                                        }),
                                    extendStatics(d, b)
                                )
                            }
                            return function (d, b) {
                                extendStatics(d, b)
                                function __() {
                                    this.constructor = d
                                }
                                d.prototype =
                                    b === null
                                        ? Object.create(b)
                                        : ((__.prototype = b.prototype),
                                          new __())
                            }
                        })(),
                        __awaiter = function (
                            thisArg,
                            _arguments,
                            P,
                            generator,
                        ) {
                            function adopt(value) {
                                return value instanceof P
                                    ? value
                                    : new P(function (resolve) {
                                          resolve(value)
                                      })
                            }
                            return new (P || (P = Promise))(function (
                                resolve,
                                reject,
                            ) {
                                function fulfilled(value) {
                                    try {
                                        step(generator.next(value))
                                    } catch (e) {
                                        reject(e)
                                    }
                                }
                                function rejected(value) {
                                    try {
                                        step(generator.throw(value))
                                    } catch (e) {
                                        reject(e)
                                    }
                                }
                                function step(result) {
                                    result.done
                                        ? resolve(result.value)
                                        : adopt(result.value).then(
                                              fulfilled,
                                              rejected,
                                          )
                                }
                                step(
                                    (generator = generator.apply(
                                        thisArg,
                                        _arguments || [],
                                    )).next(),
                                )
                            })
                        },
                        __generator = function (thisArg, body) {
                            var _ = {
                                    label: 0,
                                    sent: function () {
                                        if (t[0] & 1) throw t[1]
                                        return t[1]
                                    },
                                    trys: [],
                                    ops: [],
                                },
                                f,
                                y,
                                t,
                                g
                            return (
                                (g = {
                                    next: verb(0),
                                    throw: verb(1),
                                    return: verb(2),
                                }),
                                typeof Symbol == 'function' &&
                                    (g[Symbol.iterator] = function () {
                                        return this
                                    }),
                                g
                            )
                            function verb(n) {
                                return function (v) {
                                    return step([n, v])
                                }
                            }
                            function step(op) {
                                if (f)
                                    throw new TypeError(
                                        'Generator is already executing.',
                                    )
                                for (; _; )
                                    try {
                                        if (
                                            ((f = 1),
                                            y &&
                                                (t =
                                                    op[0] & 2
                                                        ? y.return
                                                        : op[0]
                                                        ? y.throw ||
                                                          ((t = y.return) &&
                                                              t.call(y),
                                                          0)
                                                        : y.next) &&
                                                !(t = t.call(y, op[1])).done)
                                        )
                                            return t
                                        switch (
                                            ((y = 0),
                                            t && (op = [op[0] & 2, t.value]),
                                            op[0])
                                        ) {
                                            case 0:
                                            case 1:
                                                t = op
                                                break
                                            case 4:
                                                return (
                                                    _.label++,
                                                    { value: op[1], done: !1 }
                                                )
                                            case 5:
                                                _.label++,
                                                    (y = op[1]),
                                                    (op = [0])
                                                continue
                                            case 7:
                                                ;(op = _.ops.pop()),
                                                    _.trys.pop()
                                                continue
                                            default:
                                                if (
                                                    ((t = _.trys),
                                                    !(t =
                                                        t.length > 0 &&
                                                        t[t.length - 1]) &&
                                                        (op[0] === 6 ||
                                                            op[0] === 2))
                                                ) {
                                                    _ = 0
                                                    continue
                                                }
                                                if (
                                                    op[0] === 3 &&
                                                    (!t ||
                                                        (op[1] > t[0] &&
                                                            op[1] < t[3]))
                                                ) {
                                                    _.label = op[1]
                                                    break
                                                }
                                                if (
                                                    op[0] === 6 &&
                                                    _.label < t[1]
                                                ) {
                                                    ;(_.label = t[1]), (t = op)
                                                    break
                                                }
                                                if (t && _.label < t[2]) {
                                                    ;(_.label = t[2]),
                                                        _.ops.push(op)
                                                    break
                                                }
                                                t[2] && _.ops.pop(),
                                                    _.trys.pop()
                                                continue
                                        }
                                        op = body.call(thisArg, _)
                                    } catch (e) {
                                        ;(op = [6, e]), (y = 0)
                                    } finally {
                                        f = t = 0
                                    }
                                if (op[0] & 5) throw op[1]
                                return {
                                    value: op[0] ? op[1] : void 0,
                                    done: !0,
                                }
                            }
                        },
                        presence_channel_PresenceChannel = (function (_super) {
                            presence_channel_extends(PresenceChannel, _super)
                            function PresenceChannel(name, pusher) {
                                var _this =
                                    _super.call(this, name, pusher) || this
                                return (_this.members = new members()), _this
                            }
                            return (
                                (PresenceChannel.prototype.authorize =
                                    function (socketId, callback) {
                                        var _this = this
                                        _super.prototype.authorize.call(
                                            this,
                                            socketId,
                                            function (error, authData) {
                                                return __awaiter(
                                                    _this,
                                                    void 0,
                                                    void 0,
                                                    function () {
                                                        var channelData, suffix
                                                        return __generator(
                                                            this,
                                                            function (_a) {
                                                                switch (
                                                                    _a.label
                                                                ) {
                                                                    case 0:
                                                                        return error
                                                                            ? [
                                                                                  3,
                                                                                  3,
                                                                              ]
                                                                            : ((authData =
                                                                                  authData),
                                                                              authData.channel_data ==
                                                                              null
                                                                                  ? [
                                                                                        3,
                                                                                        1,
                                                                                    ]
                                                                                  : ((channelData =
                                                                                        JSON.parse(
                                                                                            authData.channel_data,
                                                                                        )),
                                                                                    this.members.setMyID(
                                                                                        channelData.user_id,
                                                                                    ),
                                                                                    [
                                                                                        3,
                                                                                        3,
                                                                                    ]))
                                                                    case 1:
                                                                        return [
                                                                            4,
                                                                            this
                                                                                .pusher
                                                                                .user
                                                                                .signinDonePromise,
                                                                        ]
                                                                    case 2:
                                                                        if (
                                                                            (_a.sent(),
                                                                            this
                                                                                .pusher
                                                                                .user
                                                                                .user_data !=
                                                                                null)
                                                                        )
                                                                            this.members.setMyID(
                                                                                this
                                                                                    .pusher
                                                                                    .user
                                                                                    .user_data
                                                                                    .id,
                                                                            )
                                                                        else
                                                                            return (
                                                                                (suffix =
                                                                                    url_store.buildLogSuffix(
                                                                                        'authorizationEndpoint',
                                                                                    )),
                                                                                logger.error(
                                                                                    "Invalid auth response for channel '" +
                                                                                        this
                                                                                            .name +
                                                                                        "', " +
                                                                                        ("expected 'channel_data' field. " +
                                                                                            suffix +
                                                                                            ', ') +
                                                                                        'or the user should be signed in.',
                                                                                ),
                                                                                callback(
                                                                                    'Invalid auth response',
                                                                                ),
                                                                                [
                                                                                    2,
                                                                                ]
                                                                            )
                                                                        _a.label = 3
                                                                    case 3:
                                                                        return (
                                                                            callback(
                                                                                error,
                                                                                authData,
                                                                            ),
                                                                            [2]
                                                                        )
                                                                }
                                                            },
                                                        )
                                                    },
                                                )
                                            },
                                        )
                                    }),
                                (PresenceChannel.prototype.handleEvent =
                                    function (event) {
                                        var eventName = event.event
                                        if (
                                            eventName.indexOf(
                                                'pusher_internal:',
                                            ) === 0
                                        )
                                            this.handleInternalEvent(event)
                                        else {
                                            var data = event.data,
                                                metadata = {}
                                            event.user_id &&
                                                (metadata.user_id =
                                                    event.user_id),
                                                this.emit(
                                                    eventName,
                                                    data,
                                                    metadata,
                                                )
                                        }
                                    }),
                                (PresenceChannel.prototype.handleInternalEvent =
                                    function (event) {
                                        var eventName = event.event,
                                            data = event.data
                                        switch (eventName) {
                                            case 'pusher_internal:subscription_succeeded':
                                                this.handleSubscriptionSucceededEvent(
                                                    event,
                                                )
                                                break
                                            case 'pusher_internal:subscription_count':
                                                this.handleSubscriptionCountEvent(
                                                    event,
                                                )
                                                break
                                            case 'pusher_internal:member_added':
                                                var addedMember =
                                                    this.members.addMember(data)
                                                this.emit(
                                                    'pusher:member_added',
                                                    addedMember,
                                                )
                                                break
                                            case 'pusher_internal:member_removed':
                                                var removedMember =
                                                    this.members.removeMember(
                                                        data,
                                                    )
                                                removedMember &&
                                                    this.emit(
                                                        'pusher:member_removed',
                                                        removedMember,
                                                    )
                                                break
                                        }
                                    }),
                                (PresenceChannel.prototype.handleSubscriptionSucceededEvent =
                                    function (event) {
                                        ;(this.subscriptionPending = !1),
                                            (this.subscribed = !0),
                                            this.subscriptionCancelled
                                                ? this.pusher.unsubscribe(
                                                      this.name,
                                                  )
                                                : (this.members.onSubscription(
                                                      event.data,
                                                  ),
                                                  this.emit(
                                                      'pusher:subscription_succeeded',
                                                      this.members,
                                                  ))
                                    }),
                                (PresenceChannel.prototype.disconnect =
                                    function () {
                                        this.members.reset(),
                                            _super.prototype.disconnect.call(
                                                this,
                                            )
                                    }),
                                PresenceChannel
                            )
                        })(private_channel),
                        presence_channel = presence_channel_PresenceChannel,
                        utf8 = __webpack_require__(1),
                        base64 = __webpack_require__(0),
                        encrypted_channel_extends = (function () {
                            var extendStatics = function (d, b) {
                                return (
                                    (extendStatics =
                                        Object.setPrototypeOf ||
                                        ({ __proto__: [] } instanceof Array &&
                                            function (d2, b2) {
                                                d2.__proto__ = b2
                                            }) ||
                                        function (d2, b2) {
                                            for (var p in b2)
                                                b2.hasOwnProperty(p) &&
                                                    (d2[p] = b2[p])
                                        }),
                                    extendStatics(d, b)
                                )
                            }
                            return function (d, b) {
                                extendStatics(d, b)
                                function __() {
                                    this.constructor = d
                                }
                                d.prototype =
                                    b === null
                                        ? Object.create(b)
                                        : ((__.prototype = b.prototype),
                                          new __())
                            }
                        })(),
                        encrypted_channel_EncryptedChannel = (function (
                            _super,
                        ) {
                            encrypted_channel_extends(EncryptedChannel, _super)
                            function EncryptedChannel(name, pusher, nacl) {
                                var _this =
                                    _super.call(this, name, pusher) || this
                                return (
                                    (_this.key = null),
                                    (_this.nacl = nacl),
                                    _this
                                )
                            }
                            return (
                                (EncryptedChannel.prototype.authorize =
                                    function (socketId, callback) {
                                        var _this = this
                                        _super.prototype.authorize.call(
                                            this,
                                            socketId,
                                            function (error, authData) {
                                                if (error) {
                                                    callback(error, authData)
                                                    return
                                                }
                                                var sharedSecret =
                                                    authData.shared_secret
                                                if (!sharedSecret) {
                                                    callback(
                                                        new Error(
                                                            'No shared_secret key in auth payload for encrypted channel: ' +
                                                                _this.name,
                                                        ),
                                                        null,
                                                    )
                                                    return
                                                }
                                                ;(_this.key = Object(
                                                    base64.decode,
                                                )(sharedSecret)),
                                                    delete authData.shared_secret,
                                                    callback(null, authData)
                                            },
                                        )
                                    }),
                                (EncryptedChannel.prototype.trigger = function (
                                    event,
                                    data,
                                ) {
                                    throw new UnsupportedFeature(
                                        'Client events are not currently supported for encrypted channels',
                                    )
                                }),
                                (EncryptedChannel.prototype.handleEvent =
                                    function (event) {
                                        var eventName = event.event,
                                            data = event.data
                                        if (
                                            eventName.indexOf(
                                                'pusher_internal:',
                                            ) === 0 ||
                                            eventName.indexOf('pusher:') === 0
                                        ) {
                                            _super.prototype.handleEvent.call(
                                                this,
                                                event,
                                            )
                                            return
                                        }
                                        this.handleEncryptedEvent(
                                            eventName,
                                            data,
                                        )
                                    }),
                                (EncryptedChannel.prototype.handleEncryptedEvent =
                                    function (event, data) {
                                        var _this = this
                                        if (!this.key) {
                                            logger.debug(
                                                'Received encrypted event before key has been retrieved from the authEndpoint',
                                            )
                                            return
                                        }
                                        if (!data.ciphertext || !data.nonce) {
                                            logger.error(
                                                'Unexpected format for encrypted event, expected object with `ciphertext` and `nonce` fields, got: ' +
                                                    data,
                                            )
                                            return
                                        }
                                        var cipherText = Object(base64.decode)(
                                            data.ciphertext,
                                        )
                                        if (
                                            cipherText.length <
                                            this.nacl.secretbox.overheadLength
                                        ) {
                                            logger.error(
                                                'Expected encrypted event ciphertext length to be ' +
                                                    this.nacl.secretbox
                                                        .overheadLength +
                                                    ', got: ' +
                                                    cipherText.length,
                                            )
                                            return
                                        }
                                        var nonce = Object(base64.decode)(
                                            data.nonce,
                                        )
                                        if (
                                            nonce.length <
                                            this.nacl.secretbox.nonceLength
                                        ) {
                                            logger.error(
                                                'Expected encrypted event nonce length to be ' +
                                                    this.nacl.secretbox
                                                        .nonceLength +
                                                    ', got: ' +
                                                    nonce.length,
                                            )
                                            return
                                        }
                                        var bytes = this.nacl.secretbox.open(
                                            cipherText,
                                            nonce,
                                            this.key,
                                        )
                                        if (bytes === null) {
                                            logger.debug(
                                                'Failed to decrypt an event, probably because it was encrypted with a different key. Fetching a new key from the authEndpoint...',
                                            ),
                                                this.authorize(
                                                    this.pusher.connection
                                                        .socket_id,
                                                    function (error, authData) {
                                                        if (error) {
                                                            logger.error(
                                                                'Failed to make a request to the authEndpoint: ' +
                                                                    authData +
                                                                    '. Unable to fetch new key, so dropping encrypted event',
                                                            )
                                                            return
                                                        }
                                                        if (
                                                            ((bytes =
                                                                _this.nacl.secretbox.open(
                                                                    cipherText,
                                                                    nonce,
                                                                    _this.key,
                                                                )),
                                                            bytes === null)
                                                        ) {
                                                            logger.error(
                                                                'Failed to decrypt event with new key. Dropping encrypted event',
                                                            )
                                                            return
                                                        }
                                                        _this.emit(
                                                            event,
                                                            _this.getDataToEmit(
                                                                bytes,
                                                            ),
                                                        )
                                                    },
                                                )
                                            return
                                        }
                                        this.emit(
                                            event,
                                            this.getDataToEmit(bytes),
                                        )
                                    }),
                                (EncryptedChannel.prototype.getDataToEmit =
                                    function (bytes) {
                                        var raw = Object(utf8.decode)(bytes)
                                        try {
                                            return JSON.parse(raw)
                                        } catch (_a) {
                                            return raw
                                        }
                                    }),
                                EncryptedChannel
                            )
                        })(private_channel),
                        encrypted_channel = encrypted_channel_EncryptedChannel,
                        connection_manager_extends = (function () {
                            var extendStatics = function (d, b) {
                                return (
                                    (extendStatics =
                                        Object.setPrototypeOf ||
                                        ({ __proto__: [] } instanceof Array &&
                                            function (d2, b2) {
                                                d2.__proto__ = b2
                                            }) ||
                                        function (d2, b2) {
                                            for (var p in b2)
                                                b2.hasOwnProperty(p) &&
                                                    (d2[p] = b2[p])
                                        }),
                                    extendStatics(d, b)
                                )
                            }
                            return function (d, b) {
                                extendStatics(d, b)
                                function __() {
                                    this.constructor = d
                                }
                                d.prototype =
                                    b === null
                                        ? Object.create(b)
                                        : ((__.prototype = b.prototype),
                                          new __())
                            }
                        })(),
                        connection_manager_ConnectionManager = (function (
                            _super,
                        ) {
                            connection_manager_extends(
                                ConnectionManager,
                                _super,
                            )
                            function ConnectionManager(key, options) {
                                var _this = _super.call(this) || this
                                ;(_this.state = 'initialized'),
                                    (_this.connection = null),
                                    (_this.key = key),
                                    (_this.options = options),
                                    (_this.timeline = _this.options.timeline),
                                    (_this.usingTLS = _this.options.useTLS),
                                    (_this.errorCallbacks =
                                        _this.buildErrorCallbacks()),
                                    (_this.connectionCallbacks =
                                        _this.buildConnectionCallbacks(
                                            _this.errorCallbacks,
                                        )),
                                    (_this.handshakeCallbacks =
                                        _this.buildHandshakeCallbacks(
                                            _this.errorCallbacks,
                                        ))
                                var Network = runtime.getNetwork()
                                return (
                                    Network.bind('online', function () {
                                        _this.timeline.info({
                                            netinfo: 'online',
                                        }),
                                            (_this.state === 'connecting' ||
                                                _this.state ===
                                                    'unavailable') &&
                                                _this.retryIn(0)
                                    }),
                                    Network.bind('offline', function () {
                                        _this.timeline.info({
                                            netinfo: 'offline',
                                        }),
                                            _this.connection &&
                                                _this.sendActivityCheck()
                                    }),
                                    _this.updateStrategy(),
                                    _this
                                )
                            }
                            return (
                                (ConnectionManager.prototype.connect =
                                    function () {
                                        if (!(this.connection || this.runner)) {
                                            if (!this.strategy.isSupported()) {
                                                this.updateState('failed')
                                                return
                                            }
                                            this.updateState('connecting'),
                                                this.startConnecting(),
                                                this.setUnavailableTimer()
                                        }
                                    }),
                                (ConnectionManager.prototype.send = function (
                                    data,
                                ) {
                                    return this.connection
                                        ? this.connection.send(data)
                                        : !1
                                }),
                                (ConnectionManager.prototype.send_event =
                                    function (name, data, channel) {
                                        return this.connection
                                            ? this.connection.send_event(
                                                  name,
                                                  data,
                                                  channel,
                                              )
                                            : !1
                                    }),
                                (ConnectionManager.prototype.disconnect =
                                    function () {
                                        this.disconnectInternally(),
                                            this.updateState('disconnected')
                                    }),
                                (ConnectionManager.prototype.isUsingTLS =
                                    function () {
                                        return this.usingTLS
                                    }),
                                (ConnectionManager.prototype.startConnecting =
                                    function () {
                                        var _this = this,
                                            callback = function (
                                                error,
                                                handshake,
                                            ) {
                                                error
                                                    ? (_this.runner =
                                                          _this.strategy.connect(
                                                              0,
                                                              callback,
                                                          ))
                                                    : handshake.action ===
                                                      'error'
                                                    ? (_this.emit('error', {
                                                          type: 'HandshakeError',
                                                          error: handshake.error,
                                                      }),
                                                      _this.timeline.error({
                                                          handshakeError:
                                                              handshake.error,
                                                      }))
                                                    : (_this.abortConnecting(),
                                                      _this.handshakeCallbacks[
                                                          handshake.action
                                                      ](handshake))
                                            }
                                        this.runner = this.strategy.connect(
                                            0,
                                            callback,
                                        )
                                    }),
                                (ConnectionManager.prototype.abortConnecting =
                                    function () {
                                        this.runner &&
                                            (this.runner.abort(),
                                            (this.runner = null))
                                    }),
                                (ConnectionManager.prototype.disconnectInternally =
                                    function () {
                                        if (
                                            (this.abortConnecting(),
                                            this.clearRetryTimer(),
                                            this.clearUnavailableTimer(),
                                            this.connection)
                                        ) {
                                            var connection =
                                                this.abandonConnection()
                                            connection.close()
                                        }
                                    }),
                                (ConnectionManager.prototype.updateStrategy =
                                    function () {
                                        this.strategy =
                                            this.options.getStrategy({
                                                key: this.key,
                                                timeline: this.timeline,
                                                useTLS: this.usingTLS,
                                            })
                                    }),
                                (ConnectionManager.prototype.retryIn =
                                    function (delay) {
                                        var _this = this
                                        this.timeline.info({
                                            action: 'retry',
                                            delay,
                                        }),
                                            delay > 0 &&
                                                this.emit(
                                                    'connecting_in',
                                                    Math.round(delay / 1e3),
                                                ),
                                            (this.retryTimer = new OneOffTimer(
                                                delay || 0,
                                                function () {
                                                    _this.disconnectInternally(),
                                                        _this.connect()
                                                },
                                            ))
                                    }),
                                (ConnectionManager.prototype.clearRetryTimer =
                                    function () {
                                        this.retryTimer &&
                                            (this.retryTimer.ensureAborted(),
                                            (this.retryTimer = null))
                                    }),
                                (ConnectionManager.prototype.setUnavailableTimer =
                                    function () {
                                        var _this = this
                                        this.unavailableTimer = new OneOffTimer(
                                            this.options.unavailableTimeout,
                                            function () {
                                                _this.updateState('unavailable')
                                            },
                                        )
                                    }),
                                (ConnectionManager.prototype.clearUnavailableTimer =
                                    function () {
                                        this.unavailableTimer &&
                                            this.unavailableTimer.ensureAborted()
                                    }),
                                (ConnectionManager.prototype.sendActivityCheck =
                                    function () {
                                        var _this = this
                                        this.stopActivityCheck(),
                                            this.connection.ping(),
                                            (this.activityTimer =
                                                new OneOffTimer(
                                                    this.options.pongTimeout,
                                                    function () {
                                                        _this.timeline.error({
                                                            pong_timed_out:
                                                                _this.options
                                                                    .pongTimeout,
                                                        }),
                                                            _this.retryIn(0)
                                                    },
                                                ))
                                    }),
                                (ConnectionManager.prototype.resetActivityCheck =
                                    function () {
                                        var _this = this
                                        this.stopActivityCheck(),
                                            this.connection &&
                                                !this.connection.handlesActivityChecks() &&
                                                (this.activityTimer =
                                                    new OneOffTimer(
                                                        this.activityTimeout,
                                                        function () {
                                                            _this.sendActivityCheck()
                                                        },
                                                    ))
                                    }),
                                (ConnectionManager.prototype.stopActivityCheck =
                                    function () {
                                        this.activityTimer &&
                                            this.activityTimer.ensureAborted()
                                    }),
                                (ConnectionManager.prototype.buildConnectionCallbacks =
                                    function (errorCallbacks) {
                                        var _this = this
                                        return extend({}, errorCallbacks, {
                                            message: function (message) {
                                                _this.resetActivityCheck(),
                                                    _this.emit(
                                                        'message',
                                                        message,
                                                    )
                                            },
                                            ping: function () {
                                                _this.send_event(
                                                    'pusher:pong',
                                                    {},
                                                )
                                            },
                                            activity: function () {
                                                _this.resetActivityCheck()
                                            },
                                            error: function (error) {
                                                _this.emit('error', error)
                                            },
                                            closed: function () {
                                                _this.abandonConnection(),
                                                    _this.shouldRetry() &&
                                                        _this.retryIn(1e3)
                                            },
                                        })
                                    }),
                                (ConnectionManager.prototype.buildHandshakeCallbacks =
                                    function (errorCallbacks) {
                                        var _this = this
                                        return extend({}, errorCallbacks, {
                                            connected: function (handshake) {
                                                ;(_this.activityTimeout =
                                                    Math.min(
                                                        _this.options
                                                            .activityTimeout,
                                                        handshake.activityTimeout,
                                                        handshake.connection
                                                            .activityTimeout ||
                                                            Infinity,
                                                    )),
                                                    _this.clearUnavailableTimer(),
                                                    _this.setConnection(
                                                        handshake.connection,
                                                    ),
                                                    (_this.socket_id =
                                                        _this.connection.id),
                                                    _this.updateState(
                                                        'connected',
                                                        {
                                                            socket_id:
                                                                _this.socket_id,
                                                        },
                                                    )
                                            },
                                        })
                                    }),
                                (ConnectionManager.prototype.buildErrorCallbacks =
                                    function () {
                                        var _this = this,
                                            withErrorEmitted = function (
                                                callback,
                                            ) {
                                                return function (result) {
                                                    result.error &&
                                                        _this.emit('error', {
                                                            type: 'WebSocketError',
                                                            error: result.error,
                                                        }),
                                                        callback(result)
                                                }
                                            }
                                        return {
                                            tls_only: withErrorEmitted(
                                                function () {
                                                    ;(_this.usingTLS = !0),
                                                        _this.updateStrategy(),
                                                        _this.retryIn(0)
                                                },
                                            ),
                                            refused: withErrorEmitted(
                                                function () {
                                                    _this.disconnect()
                                                },
                                            ),
                                            backoff: withErrorEmitted(
                                                function () {
                                                    _this.retryIn(1e3)
                                                },
                                            ),
                                            retry: withErrorEmitted(
                                                function () {
                                                    _this.retryIn(0)
                                                },
                                            ),
                                        }
                                    }),
                                (ConnectionManager.prototype.setConnection =
                                    function (connection) {
                                        this.connection = connection
                                        for (var event in this
                                            .connectionCallbacks)
                                            this.connection.bind(
                                                event,
                                                this.connectionCallbacks[event],
                                            )
                                        this.resetActivityCheck()
                                    }),
                                (ConnectionManager.prototype.abandonConnection =
                                    function () {
                                        if (!!this.connection) {
                                            this.stopActivityCheck()
                                            for (var event in this
                                                .connectionCallbacks)
                                                this.connection.unbind(
                                                    event,
                                                    this.connectionCallbacks[
                                                        event
                                                    ],
                                                )
                                            var connection = this.connection
                                            return (
                                                (this.connection = null),
                                                connection
                                            )
                                        }
                                    }),
                                (ConnectionManager.prototype.updateState =
                                    function (newState, data) {
                                        var previousState = this.state
                                        if (
                                            ((this.state = newState),
                                            previousState !== newState)
                                        ) {
                                            var newStateDescription = newState
                                            newStateDescription ===
                                                'connected' &&
                                                (newStateDescription +=
                                                    ' with new socket ID ' +
                                                    data.socket_id),
                                                logger.debug(
                                                    'State changed',
                                                    previousState +
                                                        ' -> ' +
                                                        newStateDescription,
                                                ),
                                                this.timeline.info({
                                                    state: newState,
                                                    params: data,
                                                }),
                                                this.emit('state_change', {
                                                    previous: previousState,
                                                    current: newState,
                                                }),
                                                this.emit(newState, data)
                                        }
                                    }),
                                (ConnectionManager.prototype.shouldRetry =
                                    function () {
                                        return (
                                            this.state === 'connecting' ||
                                            this.state === 'connected'
                                        )
                                    }),
                                ConnectionManager
                            )
                        })(dispatcher),
                        connection_manager =
                            connection_manager_ConnectionManager,
                        channels_Channels = (function () {
                            function Channels() {
                                this.channels = {}
                            }
                            return (
                                (Channels.prototype.add = function (
                                    name,
                                    pusher,
                                ) {
                                    return (
                                        this.channels[name] ||
                                            (this.channels[name] =
                                                createChannel(name, pusher)),
                                        this.channels[name]
                                    )
                                }),
                                (Channels.prototype.all = function () {
                                    return values(this.channels)
                                }),
                                (Channels.prototype.find = function (name) {
                                    return this.channels[name]
                                }),
                                (Channels.prototype.remove = function (name) {
                                    var channel = this.channels[name]
                                    return delete this.channels[name], channel
                                }),
                                (Channels.prototype.disconnect = function () {
                                    objectApply(
                                        this.channels,
                                        function (channel) {
                                            channel.disconnect()
                                        },
                                    )
                                }),
                                Channels
                            )
                        })(),
                        channels = channels_Channels
                    function createChannel(name, pusher) {
                        if (name.indexOf('private-encrypted-') === 0) {
                            if (pusher.config.nacl)
                                return factory.createEncryptedChannel(
                                    name,
                                    pusher,
                                    pusher.config.nacl,
                                )
                            var errMsg =
                                    'Tried to subscribe to a private-encrypted- channel but no nacl implementation available',
                                suffix = url_store.buildLogSuffix(
                                    'encryptedChannelSupport',
                                )
                            throw new UnsupportedFeature(errMsg + '. ' + suffix)
                        } else {
                            if (name.indexOf('private-') === 0)
                                return factory.createPrivateChannel(
                                    name,
                                    pusher,
                                )
                            if (name.indexOf('presence-') === 0)
                                return factory.createPresenceChannel(
                                    name,
                                    pusher,
                                )
                            if (name.indexOf('#') === 0)
                                throw new BadChannelName(
                                    'Cannot create a channel with name "' +
                                        name +
                                        '".',
                                )
                            return factory.createChannel(name, pusher)
                        }
                    }
                    var Factory = {
                            createChannels: function () {
                                return new channels()
                            },
                            createConnectionManager: function (key, options) {
                                return new connection_manager(key, options)
                            },
                            createChannel: function (name, pusher) {
                                return new channels_channel(name, pusher)
                            },
                            createPrivateChannel: function (name, pusher) {
                                return new private_channel(name, pusher)
                            },
                            createPresenceChannel: function (name, pusher) {
                                return new presence_channel(name, pusher)
                            },
                            createEncryptedChannel: function (
                                name,
                                pusher,
                                nacl,
                            ) {
                                return new encrypted_channel(name, pusher, nacl)
                            },
                            createTimelineSender: function (timeline, options) {
                                return new timeline_sender(timeline, options)
                            },
                            createHandshake: function (transport, callback) {
                                return new connection_handshake(
                                    transport,
                                    callback,
                                )
                            },
                            createAssistantToTheTransportManager: function (
                                manager,
                                transport,
                                options,
                            ) {
                                return new assistant_to_the_transport_manager(
                                    manager,
                                    transport,
                                    options,
                                )
                            },
                        },
                        factory = Factory,
                        transport_manager_TransportManager = (function () {
                            function TransportManager(options) {
                                ;(this.options = options || {}),
                                    (this.livesLeft =
                                        this.options.lives || Infinity)
                            }
                            return (
                                (TransportManager.prototype.getAssistant =
                                    function (transport) {
                                        return factory.createAssistantToTheTransportManager(
                                            this,
                                            transport,
                                            {
                                                minPingDelay:
                                                    this.options.minPingDelay,
                                                maxPingDelay:
                                                    this.options.maxPingDelay,
                                            },
                                        )
                                    }),
                                (TransportManager.prototype.isAlive =
                                    function () {
                                        return this.livesLeft > 0
                                    }),
                                (TransportManager.prototype.reportDeath =
                                    function () {
                                        this.livesLeft -= 1
                                    }),
                                TransportManager
                            )
                        })(),
                        transport_manager = transport_manager_TransportManager,
                        sequential_strategy_SequentialStrategy = (function () {
                            function SequentialStrategy(strategies, options) {
                                ;(this.strategies = strategies),
                                    (this.loop = Boolean(options.loop)),
                                    (this.failFast = Boolean(options.failFast)),
                                    (this.timeout = options.timeout),
                                    (this.timeoutLimit = options.timeoutLimit)
                            }
                            return (
                                (SequentialStrategy.prototype.isSupported =
                                    function () {
                                        return any(
                                            this.strategies,
                                            util.method('isSupported'),
                                        )
                                    }),
                                (SequentialStrategy.prototype.connect =
                                    function (minPriority, callback) {
                                        var _this = this,
                                            strategies = this.strategies,
                                            current = 0,
                                            timeout = this.timeout,
                                            runner = null,
                                            tryNextStrategy = function (
                                                error,
                                                handshake,
                                            ) {
                                                handshake
                                                    ? callback(null, handshake)
                                                    : ((current = current + 1),
                                                      _this.loop &&
                                                          (current =
                                                              current %
                                                              strategies.length),
                                                      current <
                                                      strategies.length
                                                          ? (timeout &&
                                                                ((timeout =
                                                                    timeout *
                                                                    2),
                                                                _this.timeoutLimit &&
                                                                    (timeout =
                                                                        Math.min(
                                                                            timeout,
                                                                            _this.timeoutLimit,
                                                                        ))),
                                                            (runner =
                                                                _this.tryStrategy(
                                                                    strategies[
                                                                        current
                                                                    ],
                                                                    minPriority,
                                                                    {
                                                                        timeout,
                                                                        failFast:
                                                                            _this.failFast,
                                                                    },
                                                                    tryNextStrategy,
                                                                )))
                                                          : callback(!0))
                                            }
                                        return (
                                            (runner = this.tryStrategy(
                                                strategies[current],
                                                minPriority,
                                                {
                                                    timeout,
                                                    failFast: this.failFast,
                                                },
                                                tryNextStrategy,
                                            )),
                                            {
                                                abort: function () {
                                                    runner.abort()
                                                },
                                                forceMinPriority: function (p) {
                                                    ;(minPriority = p),
                                                        runner &&
                                                            runner.forceMinPriority(
                                                                p,
                                                            )
                                                },
                                            }
                                        )
                                    }),
                                (SequentialStrategy.prototype.tryStrategy =
                                    function (
                                        strategy,
                                        minPriority,
                                        options,
                                        callback,
                                    ) {
                                        var timer = null,
                                            runner = null
                                        return (
                                            options.timeout > 0 &&
                                                (timer = new OneOffTimer(
                                                    options.timeout,
                                                    function () {
                                                        runner.abort(),
                                                            callback(!0)
                                                    },
                                                )),
                                            (runner = strategy.connect(
                                                minPriority,
                                                function (error, handshake) {
                                                    ;(error &&
                                                        timer &&
                                                        timer.isRunning() &&
                                                        !options.failFast) ||
                                                        (timer &&
                                                            timer.ensureAborted(),
                                                        callback(
                                                            error,
                                                            handshake,
                                                        ))
                                                },
                                            )),
                                            {
                                                abort: function () {
                                                    timer &&
                                                        timer.ensureAborted(),
                                                        runner.abort()
                                                },
                                                forceMinPriority: function (p) {
                                                    runner.forceMinPriority(p)
                                                },
                                            }
                                        )
                                    }),
                                SequentialStrategy
                            )
                        })(),
                        sequential_strategy =
                            sequential_strategy_SequentialStrategy,
                        best_connected_ever_strategy_BestConnectedEverStrategy =
                            (function () {
                                function BestConnectedEverStrategy(strategies) {
                                    this.strategies = strategies
                                }
                                return (
                                    (BestConnectedEverStrategy.prototype.isSupported =
                                        function () {
                                            return any(
                                                this.strategies,
                                                util.method('isSupported'),
                                            )
                                        }),
                                    (BestConnectedEverStrategy.prototype.connect =
                                        function (minPriority, callback) {
                                            return connect(
                                                this.strategies,
                                                minPriority,
                                                function (i, runners) {
                                                    return function (
                                                        error,
                                                        handshake,
                                                    ) {
                                                        if (
                                                            ((runners[i].error =
                                                                error),
                                                            error)
                                                        ) {
                                                            allRunnersFailed(
                                                                runners,
                                                            ) && callback(!0)
                                                            return
                                                        }
                                                        apply(
                                                            runners,
                                                            function (runner) {
                                                                runner.forceMinPriority(
                                                                    handshake
                                                                        .transport
                                                                        .priority,
                                                                )
                                                            },
                                                        ),
                                                            callback(
                                                                null,
                                                                handshake,
                                                            )
                                                    }
                                                },
                                            )
                                        }),
                                    BestConnectedEverStrategy
                                )
                            })(),
                        best_connected_ever_strategy =
                            best_connected_ever_strategy_BestConnectedEverStrategy
                    function connect(strategies, minPriority, callbackBuilder) {
                        var runners = map(
                            strategies,
                            function (strategy, i, _, rs) {
                                return strategy.connect(
                                    minPriority,
                                    callbackBuilder(i, rs),
                                )
                            },
                        )
                        return {
                            abort: function () {
                                apply(runners, abortRunner)
                            },
                            forceMinPriority: function (p) {
                                apply(runners, function (runner) {
                                    runner.forceMinPriority(p)
                                })
                            },
                        }
                    }
                    function allRunnersFailed(runners) {
                        return collections_all(runners, function (runner) {
                            return Boolean(runner.error)
                        })
                    }
                    function abortRunner(runner) {
                        !runner.error &&
                            !runner.aborted &&
                            (runner.abort(), (runner.aborted = !0))
                    }
                    var cached_strategy_CachedStrategy = (function () {
                            function CachedStrategy(
                                strategy,
                                transports2,
                                options,
                            ) {
                                ;(this.strategy = strategy),
                                    (this.transports = transports2),
                                    (this.ttl = options.ttl || 1800 * 1e3),
                                    (this.usingTLS = options.useTLS),
                                    (this.timeline = options.timeline)
                            }
                            return (
                                (CachedStrategy.prototype.isSupported =
                                    function () {
                                        return this.strategy.isSupported()
                                    }),
                                (CachedStrategy.prototype.connect = function (
                                    minPriority,
                                    callback,
                                ) {
                                    var usingTLS = this.usingTLS,
                                        info = fetchTransportCache(usingTLS),
                                        strategies = [this.strategy]
                                    if (
                                        info &&
                                        info.timestamp + this.ttl >= util.now()
                                    ) {
                                        var transport =
                                            this.transports[info.transport]
                                        transport &&
                                            (this.timeline.info({
                                                cached: !0,
                                                transport: info.transport,
                                                latency: info.latency,
                                            }),
                                            strategies.push(
                                                new sequential_strategy(
                                                    [transport],
                                                    {
                                                        timeout:
                                                            info.latency * 2 +
                                                            1e3,
                                                        failFast: !0,
                                                    },
                                                ),
                                            ))
                                    }
                                    var startTimestamp = util.now(),
                                        runner = strategies
                                            .pop()
                                            .connect(
                                                minPriority,
                                                function cb(error, handshake) {
                                                    error
                                                        ? (flushTransportCache(
                                                              usingTLS,
                                                          ),
                                                          strategies.length > 0
                                                              ? ((startTimestamp =
                                                                    util.now()),
                                                                (runner =
                                                                    strategies
                                                                        .pop()
                                                                        .connect(
                                                                            minPriority,
                                                                            cb,
                                                                        )))
                                                              : callback(error))
                                                        : (storeTransportCache(
                                                              usingTLS,
                                                              handshake
                                                                  .transport
                                                                  .name,
                                                              util.now() -
                                                                  startTimestamp,
                                                          ),
                                                          callback(
                                                              null,
                                                              handshake,
                                                          ))
                                                },
                                            )
                                    return {
                                        abort: function () {
                                            runner.abort()
                                        },
                                        forceMinPriority: function (p) {
                                            ;(minPriority = p),
                                                runner &&
                                                    runner.forceMinPriority(p)
                                        },
                                    }
                                }),
                                CachedStrategy
                            )
                        })(),
                        cached_strategy = cached_strategy_CachedStrategy
                    function getTransportCacheKey(usingTLS) {
                        return 'pusherTransport' + (usingTLS ? 'TLS' : 'NonTLS')
                    }
                    function fetchTransportCache(usingTLS) {
                        var storage = runtime.getLocalStorage()
                        if (storage)
                            try {
                                var serializedCache =
                                    storage[getTransportCacheKey(usingTLS)]
                                if (serializedCache)
                                    return JSON.parse(serializedCache)
                            } catch (e) {
                                flushTransportCache(usingTLS)
                            }
                        return null
                    }
                    function storeTransportCache(usingTLS, transport, latency) {
                        var storage = runtime.getLocalStorage()
                        if (storage)
                            try {
                                storage[getTransportCacheKey(usingTLS)] =
                                    safeJSONStringify({
                                        timestamp: util.now(),
                                        transport,
                                        latency,
                                    })
                            } catch (e) {}
                    }
                    function flushTransportCache(usingTLS) {
                        var storage = runtime.getLocalStorage()
                        if (storage)
                            try {
                                delete storage[getTransportCacheKey(usingTLS)]
                            } catch (e) {}
                    }
                    var delayed_strategy_DelayedStrategy = (function () {
                            function DelayedStrategy(strategy, _a) {
                                var number = _a.delay
                                ;(this.strategy = strategy),
                                    (this.options = { delay: number })
                            }
                            return (
                                (DelayedStrategy.prototype.isSupported =
                                    function () {
                                        return this.strategy.isSupported()
                                    }),
                                (DelayedStrategy.prototype.connect = function (
                                    minPriority,
                                    callback,
                                ) {
                                    var strategy = this.strategy,
                                        runner,
                                        timer = new OneOffTimer(
                                            this.options.delay,
                                            function () {
                                                runner = strategy.connect(
                                                    minPriority,
                                                    callback,
                                                )
                                            },
                                        )
                                    return {
                                        abort: function () {
                                            timer.ensureAborted(),
                                                runner && runner.abort()
                                        },
                                        forceMinPriority: function (p) {
                                            ;(minPriority = p),
                                                runner &&
                                                    runner.forceMinPriority(p)
                                        },
                                    }
                                }),
                                DelayedStrategy
                            )
                        })(),
                        delayed_strategy = delayed_strategy_DelayedStrategy,
                        IfStrategy = (function () {
                            function IfStrategy2(
                                test,
                                trueBranch,
                                falseBranch,
                            ) {
                                ;(this.test = test),
                                    (this.trueBranch = trueBranch),
                                    (this.falseBranch = falseBranch)
                            }
                            return (
                                (IfStrategy2.prototype.isSupported =
                                    function () {
                                        var branch = this.test()
                                            ? this.trueBranch
                                            : this.falseBranch
                                        return branch.isSupported()
                                    }),
                                (IfStrategy2.prototype.connect = function (
                                    minPriority,
                                    callback,
                                ) {
                                    var branch = this.test()
                                        ? this.trueBranch
                                        : this.falseBranch
                                    return branch.connect(minPriority, callback)
                                }),
                                IfStrategy2
                            )
                        })(),
                        if_strategy = IfStrategy,
                        FirstConnectedStrategy = (function () {
                            function FirstConnectedStrategy2(strategy) {
                                this.strategy = strategy
                            }
                            return (
                                (FirstConnectedStrategy2.prototype.isSupported =
                                    function () {
                                        return this.strategy.isSupported()
                                    }),
                                (FirstConnectedStrategy2.prototype.connect =
                                    function (minPriority, callback) {
                                        var runner = this.strategy.connect(
                                            minPriority,
                                            function (error, handshake) {
                                                handshake && runner.abort(),
                                                    callback(error, handshake)
                                            },
                                        )
                                        return runner
                                    }),
                                FirstConnectedStrategy2
                            )
                        })(),
                        first_connected_strategy = FirstConnectedStrategy
                    function testSupportsStrategy(strategy) {
                        return function () {
                            return strategy.isSupported()
                        }
                    }
                    var getDefaultStrategy = function (
                            config,
                            baseOptions,
                            defineTransport,
                        ) {
                            var definedTransports = {}
                            function defineTransportStrategy(
                                name,
                                type,
                                priority,
                                options,
                                manager,
                            ) {
                                var transport = defineTransport(
                                    config,
                                    name,
                                    type,
                                    priority,
                                    options,
                                    manager,
                                )
                                return (
                                    (definedTransports[name] = transport),
                                    transport
                                )
                            }
                            var ws_options = Object.assign({}, baseOptions, {
                                    hostNonTLS:
                                        config.wsHost + ':' + config.wsPort,
                                    hostTLS:
                                        config.wsHost + ':' + config.wssPort,
                                    httpPath: config.wsPath,
                                }),
                                wss_options = Object.assign({}, ws_options, {
                                    useTLS: !0,
                                }),
                                sockjs_options = Object.assign(
                                    {},
                                    baseOptions,
                                    {
                                        hostNonTLS:
                                            config.httpHost +
                                            ':' +
                                            config.httpPort,
                                        hostTLS:
                                            config.httpHost +
                                            ':' +
                                            config.httpsPort,
                                        httpPath: config.httpPath,
                                    },
                                ),
                                timeouts = {
                                    loop: !0,
                                    timeout: 15e3,
                                    timeoutLimit: 6e4,
                                },
                                ws_manager = new transport_manager({
                                    lives: 2,
                                    minPingDelay: 1e4,
                                    maxPingDelay: config.activityTimeout,
                                }),
                                streaming_manager = new transport_manager({
                                    lives: 2,
                                    minPingDelay: 1e4,
                                    maxPingDelay: config.activityTimeout,
                                }),
                                ws_transport = defineTransportStrategy(
                                    'ws',
                                    'ws',
                                    3,
                                    ws_options,
                                    ws_manager,
                                ),
                                wss_transport = defineTransportStrategy(
                                    'wss',
                                    'ws',
                                    3,
                                    wss_options,
                                    ws_manager,
                                ),
                                sockjs_transport = defineTransportStrategy(
                                    'sockjs',
                                    'sockjs',
                                    1,
                                    sockjs_options,
                                ),
                                xhr_streaming_transport =
                                    defineTransportStrategy(
                                        'xhr_streaming',
                                        'xhr_streaming',
                                        1,
                                        sockjs_options,
                                        streaming_manager,
                                    ),
                                xdr_streaming_transport =
                                    defineTransportStrategy(
                                        'xdr_streaming',
                                        'xdr_streaming',
                                        1,
                                        sockjs_options,
                                        streaming_manager,
                                    ),
                                xhr_polling_transport = defineTransportStrategy(
                                    'xhr_polling',
                                    'xhr_polling',
                                    1,
                                    sockjs_options,
                                ),
                                xdr_polling_transport = defineTransportStrategy(
                                    'xdr_polling',
                                    'xdr_polling',
                                    1,
                                    sockjs_options,
                                ),
                                ws_loop = new sequential_strategy(
                                    [ws_transport],
                                    timeouts,
                                ),
                                wss_loop = new sequential_strategy(
                                    [wss_transport],
                                    timeouts,
                                ),
                                sockjs_loop = new sequential_strategy(
                                    [sockjs_transport],
                                    timeouts,
                                ),
                                streaming_loop = new sequential_strategy(
                                    [
                                        new if_strategy(
                                            testSupportsStrategy(
                                                xhr_streaming_transport,
                                            ),
                                            xhr_streaming_transport,
                                            xdr_streaming_transport,
                                        ),
                                    ],
                                    timeouts,
                                ),
                                polling_loop = new sequential_strategy(
                                    [
                                        new if_strategy(
                                            testSupportsStrategy(
                                                xhr_polling_transport,
                                            ),
                                            xhr_polling_transport,
                                            xdr_polling_transport,
                                        ),
                                    ],
                                    timeouts,
                                ),
                                http_loop = new sequential_strategy(
                                    [
                                        new if_strategy(
                                            testSupportsStrategy(
                                                streaming_loop,
                                            ),
                                            new best_connected_ever_strategy([
                                                streaming_loop,
                                                new delayed_strategy(
                                                    polling_loop,
                                                    { delay: 4e3 },
                                                ),
                                            ]),
                                            polling_loop,
                                        ),
                                    ],
                                    timeouts,
                                ),
                                http_fallback_loop = new if_strategy(
                                    testSupportsStrategy(http_loop),
                                    http_loop,
                                    sockjs_loop,
                                ),
                                wsStrategy
                            return (
                                baseOptions.useTLS
                                    ? (wsStrategy =
                                          new best_connected_ever_strategy([
                                              ws_loop,
                                              new delayed_strategy(
                                                  http_fallback_loop,
                                                  { delay: 2e3 },
                                              ),
                                          ]))
                                    : (wsStrategy =
                                          new best_connected_ever_strategy([
                                              ws_loop,
                                              new delayed_strategy(wss_loop, {
                                                  delay: 2e3,
                                              }),
                                              new delayed_strategy(
                                                  http_fallback_loop,
                                                  { delay: 5e3 },
                                              ),
                                          ])),
                                new cached_strategy(
                                    new first_connected_strategy(
                                        new if_strategy(
                                            testSupportsStrategy(ws_transport),
                                            wsStrategy,
                                            http_fallback_loop,
                                        ),
                                    ),
                                    definedTransports,
                                    {
                                        ttl: 18e5,
                                        timeline: baseOptions.timeline,
                                        useTLS: baseOptions.useTLS,
                                    },
                                )
                            )
                        },
                        default_strategy = getDefaultStrategy,
                        transport_connection_initializer = function () {
                            var self = this
                            self.timeline.info(
                                self.buildTimelineMessage({
                                    transport:
                                        self.name +
                                        (self.options.useTLS ? 's' : ''),
                                }),
                            ),
                                self.hooks.isInitialized()
                                    ? self.changeState('initialized')
                                    : self.hooks.file
                                    ? (self.changeState('initializing'),
                                      Dependencies.load(
                                          self.hooks.file,
                                          { useTLS: self.options.useTLS },
                                          function (error, callback) {
                                              self.hooks.isInitialized()
                                                  ? (self.changeState(
                                                        'initialized',
                                                    ),
                                                    callback(!0))
                                                  : (error &&
                                                        self.onError(error),
                                                    self.onClose(),
                                                    callback(!1))
                                          },
                                      ))
                                    : self.onClose()
                        },
                        http_xdomain_request_hooks = {
                            getRequest: function (socket) {
                                var xdr = new window.XDomainRequest()
                                return (
                                    (xdr.ontimeout = function () {
                                        socket.emit(
                                            'error',
                                            new RequestTimedOut(),
                                        ),
                                            socket.close()
                                    }),
                                    (xdr.onerror = function (e) {
                                        socket.emit('error', e), socket.close()
                                    }),
                                    (xdr.onprogress = function () {
                                        xdr.responseText &&
                                            xdr.responseText.length > 0 &&
                                            socket.onChunk(
                                                200,
                                                xdr.responseText,
                                            )
                                    }),
                                    (xdr.onload = function () {
                                        xdr.responseText &&
                                            xdr.responseText.length > 0 &&
                                            socket.onChunk(
                                                200,
                                                xdr.responseText,
                                            ),
                                            socket.emit('finished', 200),
                                            socket.close()
                                    }),
                                    xdr
                                )
                            },
                            abortRequest: function (xdr) {
                                ;(xdr.ontimeout =
                                    xdr.onerror =
                                    xdr.onprogress =
                                    xdr.onload =
                                        null),
                                    xdr.abort()
                            },
                        },
                        http_xdomain_request = http_xdomain_request_hooks,
                        http_request_extends = (function () {
                            var extendStatics = function (d, b) {
                                return (
                                    (extendStatics =
                                        Object.setPrototypeOf ||
                                        ({ __proto__: [] } instanceof Array &&
                                            function (d2, b2) {
                                                d2.__proto__ = b2
                                            }) ||
                                        function (d2, b2) {
                                            for (var p in b2)
                                                b2.hasOwnProperty(p) &&
                                                    (d2[p] = b2[p])
                                        }),
                                    extendStatics(d, b)
                                )
                            }
                            return function (d, b) {
                                extendStatics(d, b)
                                function __() {
                                    this.constructor = d
                                }
                                d.prototype =
                                    b === null
                                        ? Object.create(b)
                                        : ((__.prototype = b.prototype),
                                          new __())
                            }
                        })(),
                        MAX_BUFFER_LENGTH = 256 * 1024,
                        http_request_HTTPRequest = (function (_super) {
                            http_request_extends(HTTPRequest, _super)
                            function HTTPRequest(hooks, method, url) {
                                var _this = _super.call(this) || this
                                return (
                                    (_this.hooks = hooks),
                                    (_this.method = method),
                                    (_this.url = url),
                                    _this
                                )
                            }
                            return (
                                (HTTPRequest.prototype.start = function (
                                    payload,
                                ) {
                                    var _this = this
                                    ;(this.position = 0),
                                        (this.xhr =
                                            this.hooks.getRequest(this)),
                                        (this.unloader = function () {
                                            _this.close()
                                        }),
                                        runtime.addUnloadListener(
                                            this.unloader,
                                        ),
                                        this.xhr.open(
                                            this.method,
                                            this.url,
                                            !0,
                                        ),
                                        this.xhr.setRequestHeader &&
                                            this.xhr.setRequestHeader(
                                                'Content-Type',
                                                'application/json',
                                            ),
                                        this.xhr.send(payload)
                                }),
                                (HTTPRequest.prototype.close = function () {
                                    this.unloader &&
                                        (runtime.removeUnloadListener(
                                            this.unloader,
                                        ),
                                        (this.unloader = null)),
                                        this.xhr &&
                                            (this.hooks.abortRequest(this.xhr),
                                            (this.xhr = null))
                                }),
                                (HTTPRequest.prototype.onChunk = function (
                                    status,
                                    data,
                                ) {
                                    for (;;) {
                                        var chunk = this.advanceBuffer(data)
                                        if (chunk)
                                            this.emit('chunk', {
                                                status,
                                                data: chunk,
                                            })
                                        else break
                                    }
                                    this.isBufferTooLong(data) &&
                                        this.emit('buffer_too_long')
                                }),
                                (HTTPRequest.prototype.advanceBuffer =
                                    function (buffer) {
                                        var unreadData = buffer.slice(
                                                this.position,
                                            ),
                                            endOfLinePosition =
                                                unreadData.indexOf(`
`)
                                        return endOfLinePosition !== -1
                                            ? ((this.position +=
                                                  endOfLinePosition + 1),
                                              unreadData.slice(
                                                  0,
                                                  endOfLinePosition,
                                              ))
                                            : null
                                    }),
                                (HTTPRequest.prototype.isBufferTooLong =
                                    function (buffer) {
                                        return (
                                            this.position === buffer.length &&
                                            buffer.length > MAX_BUFFER_LENGTH
                                        )
                                    }),
                                HTTPRequest
                            )
                        })(dispatcher),
                        http_request = http_request_HTTPRequest,
                        State
                    ;(function (State2) {
                        ;(State2[(State2.CONNECTING = 0)] = 'CONNECTING'),
                            (State2[(State2.OPEN = 1)] = 'OPEN'),
                            (State2[(State2.CLOSED = 3)] = 'CLOSED')
                    })(State || (State = {}))
                    var state = State,
                        autoIncrement = 1,
                        http_socket_HTTPSocket = (function () {
                            function HTTPSocket(hooks, url) {
                                ;(this.hooks = hooks),
                                    (this.session =
                                        randomNumber(1e3) +
                                        '/' +
                                        randomString(8)),
                                    (this.location = getLocation(url)),
                                    (this.readyState = state.CONNECTING),
                                    this.openStream()
                            }
                            return (
                                (HTTPSocket.prototype.send = function (
                                    payload,
                                ) {
                                    return this.sendRaw(
                                        JSON.stringify([payload]),
                                    )
                                }),
                                (HTTPSocket.prototype.ping = function () {
                                    this.hooks.sendHeartbeat(this)
                                }),
                                (HTTPSocket.prototype.close = function (
                                    code,
                                    reason,
                                ) {
                                    this.onClose(code, reason, !0)
                                }),
                                (HTTPSocket.prototype.sendRaw = function (
                                    payload,
                                ) {
                                    if (this.readyState === state.OPEN)
                                        try {
                                            return (
                                                runtime
                                                    .createSocketRequest(
                                                        'POST',
                                                        getUniqueURL(
                                                            getSendURL(
                                                                this.location,
                                                                this.session,
                                                            ),
                                                        ),
                                                    )
                                                    .start(payload),
                                                !0
                                            )
                                        } catch (e) {
                                            return !1
                                        }
                                    else return !1
                                }),
                                (HTTPSocket.prototype.reconnect = function () {
                                    this.closeStream(), this.openStream()
                                }),
                                (HTTPSocket.prototype.onClose = function (
                                    code,
                                    reason,
                                    wasClean,
                                ) {
                                    this.closeStream(),
                                        (this.readyState = state.CLOSED),
                                        this.onclose &&
                                            this.onclose({
                                                code,
                                                reason,
                                                wasClean,
                                            })
                                }),
                                (HTTPSocket.prototype.onChunk = function (
                                    chunk,
                                ) {
                                    if (chunk.status === 200) {
                                        this.readyState === state.OPEN &&
                                            this.onActivity()
                                        var payload,
                                            type = chunk.data.slice(0, 1)
                                        switch (type) {
                                            case 'o':
                                                ;(payload = JSON.parse(
                                                    chunk.data.slice(1) || '{}',
                                                )),
                                                    this.onOpen(payload)
                                                break
                                            case 'a':
                                                payload = JSON.parse(
                                                    chunk.data.slice(1) || '[]',
                                                )
                                                for (
                                                    var i = 0;
                                                    i < payload.length;
                                                    i++
                                                )
                                                    this.onEvent(payload[i])
                                                break
                                            case 'm':
                                                ;(payload = JSON.parse(
                                                    chunk.data.slice(1) ||
                                                        'null',
                                                )),
                                                    this.onEvent(payload)
                                                break
                                            case 'h':
                                                this.hooks.onHeartbeat(this)
                                                break
                                            case 'c':
                                                ;(payload = JSON.parse(
                                                    chunk.data.slice(1) || '[]',
                                                )),
                                                    this.onClose(
                                                        payload[0],
                                                        payload[1],
                                                        !0,
                                                    )
                                                break
                                        }
                                    }
                                }),
                                (HTTPSocket.prototype.onOpen = function (
                                    options,
                                ) {
                                    this.readyState === state.CONNECTING
                                        ? (options &&
                                              options.hostname &&
                                              (this.location.base = replaceHost(
                                                  this.location.base,
                                                  options.hostname,
                                              )),
                                          (this.readyState = state.OPEN),
                                          this.onopen && this.onopen())
                                        : this.onClose(
                                              1006,
                                              'Server lost session',
                                              !0,
                                          )
                                }),
                                (HTTPSocket.prototype.onEvent = function (
                                    event,
                                ) {
                                    this.readyState === state.OPEN &&
                                        this.onmessage &&
                                        this.onmessage({ data: event })
                                }),
                                (HTTPSocket.prototype.onActivity = function () {
                                    this.onactivity && this.onactivity()
                                }),
                                (HTTPSocket.prototype.onError = function (
                                    error,
                                ) {
                                    this.onerror && this.onerror(error)
                                }),
                                (HTTPSocket.prototype.openStream = function () {
                                    var _this = this
                                    ;(this.stream = runtime.createSocketRequest(
                                        'POST',
                                        getUniqueURL(
                                            this.hooks.getReceiveURL(
                                                this.location,
                                                this.session,
                                            ),
                                        ),
                                    )),
                                        this.stream.bind(
                                            'chunk',
                                            function (chunk) {
                                                _this.onChunk(chunk)
                                            },
                                        ),
                                        this.stream.bind(
                                            'finished',
                                            function (status) {
                                                _this.hooks.onFinished(
                                                    _this,
                                                    status,
                                                )
                                            },
                                        ),
                                        this.stream.bind(
                                            'buffer_too_long',
                                            function () {
                                                _this.reconnect()
                                            },
                                        )
                                    try {
                                        this.stream.start()
                                    } catch (error) {
                                        util.defer(function () {
                                            _this.onError(error),
                                                _this.onClose(
                                                    1006,
                                                    'Could not start streaming',
                                                    !1,
                                                )
                                        })
                                    }
                                }),
                                (HTTPSocket.prototype.closeStream =
                                    function () {
                                        this.stream &&
                                            (this.stream.unbind_all(),
                                            this.stream.close(),
                                            (this.stream = null))
                                    }),
                                HTTPSocket
                            )
                        })()
                    function getLocation(url) {
                        var parts = /([^\?]*)\/*(\??.*)/.exec(url)
                        return { base: parts[1], queryString: parts[2] }
                    }
                    function getSendURL(url, session) {
                        return url.base + '/' + session + '/xhr_send'
                    }
                    function getUniqueURL(url) {
                        var separator = url.indexOf('?') === -1 ? '?' : '&'
                        return (
                            url +
                            separator +
                            't=' +
                            +new Date() +
                            '&n=' +
                            autoIncrement++
                        )
                    }
                    function replaceHost(url, hostname) {
                        var urlParts = /(https?:\/\/)([^\/:]+)((\/|:)?.*)/.exec(
                            url,
                        )
                        return urlParts[1] + hostname + urlParts[3]
                    }
                    function randomNumber(max) {
                        return runtime.randomInt(max)
                    }
                    function randomString(length) {
                        for (var result = [], i = 0; i < length; i++)
                            result.push(randomNumber(32).toString(32))
                        return result.join('')
                    }
                    var http_socket = http_socket_HTTPSocket,
                        http_streaming_socket_hooks = {
                            getReceiveURL: function (url, session) {
                                return (
                                    url.base +
                                    '/' +
                                    session +
                                    '/xhr_streaming' +
                                    url.queryString
                                )
                            },
                            onHeartbeat: function (socket) {
                                socket.sendRaw('[]')
                            },
                            sendHeartbeat: function (socket) {
                                socket.sendRaw('[]')
                            },
                            onFinished: function (socket, status) {
                                socket.onClose(
                                    1006,
                                    'Connection interrupted (' + status + ')',
                                    !1,
                                )
                            },
                        },
                        http_streaming_socket = http_streaming_socket_hooks,
                        http_polling_socket_hooks = {
                            getReceiveURL: function (url, session) {
                                return (
                                    url.base +
                                    '/' +
                                    session +
                                    '/xhr' +
                                    url.queryString
                                )
                            },
                            onHeartbeat: function () {},
                            sendHeartbeat: function (socket) {
                                socket.sendRaw('[]')
                            },
                            onFinished: function (socket, status) {
                                status === 200
                                    ? socket.reconnect()
                                    : socket.onClose(
                                          1006,
                                          'Connection interrupted (' +
                                              status +
                                              ')',
                                          !1,
                                      )
                            },
                        },
                        http_polling_socket = http_polling_socket_hooks,
                        http_xhr_request_hooks = {
                            getRequest: function (socket) {
                                var Constructor = runtime.getXHRAPI(),
                                    xhr = new Constructor()
                                return (
                                    (xhr.onreadystatechange = xhr.onprogress =
                                        function () {
                                            switch (xhr.readyState) {
                                                case 3:
                                                    xhr.responseText &&
                                                        xhr.responseText
                                                            .length > 0 &&
                                                        socket.onChunk(
                                                            xhr.status,
                                                            xhr.responseText,
                                                        )
                                                    break
                                                case 4:
                                                    xhr.responseText &&
                                                        xhr.responseText
                                                            .length > 0 &&
                                                        socket.onChunk(
                                                            xhr.status,
                                                            xhr.responseText,
                                                        ),
                                                        socket.emit(
                                                            'finished',
                                                            xhr.status,
                                                        ),
                                                        socket.close()
                                                    break
                                            }
                                        }),
                                    xhr
                                )
                            },
                            abortRequest: function (xhr) {
                                ;(xhr.onreadystatechange = null), xhr.abort()
                            },
                        },
                        http_xhr_request = http_xhr_request_hooks,
                        HTTP = {
                            createStreamingSocket: function (url) {
                                return this.createSocket(
                                    http_streaming_socket,
                                    url,
                                )
                            },
                            createPollingSocket: function (url) {
                                return this.createSocket(
                                    http_polling_socket,
                                    url,
                                )
                            },
                            createSocket: function (hooks, url) {
                                return new http_socket(hooks, url)
                            },
                            createXHR: function (method, url) {
                                return this.createRequest(
                                    http_xhr_request,
                                    method,
                                    url,
                                )
                            },
                            createRequest: function (hooks, method, url) {
                                return new http_request(hooks, method, url)
                            },
                        },
                        http_http = HTTP
                    http_http.createXDR = function (method, url) {
                        return this.createRequest(
                            http_xdomain_request,
                            method,
                            url,
                        )
                    }
                    var web_http_http = http_http,
                        Runtime = {
                            nextAuthCallbackID: 1,
                            auth_callbacks: {},
                            ScriptReceivers,
                            DependenciesReceivers,
                            getDefaultStrategy: default_strategy,
                            Transports: transports_transports,
                            transportConnectionInitializer:
                                transport_connection_initializer,
                            HTTPFactory: web_http_http,
                            TimelineTransport: jsonp_timeline,
                            getXHRAPI: function () {
                                return window.XMLHttpRequest
                            },
                            getWebSocketAPI: function () {
                                return window.WebSocket || window.MozWebSocket
                            },
                            setup: function (PusherClass) {
                                var _this = this
                                window.Pusher = PusherClass
                                var initializeOnDocumentBody = function () {
                                    _this.onDocumentBody(PusherClass.ready)
                                }
                                window.JSON
                                    ? initializeOnDocumentBody()
                                    : Dependencies.load(
                                          'json2',
                                          {},
                                          initializeOnDocumentBody,
                                      )
                            },
                            getDocument: function () {
                                return document
                            },
                            getProtocol: function () {
                                return this.getDocument().location.protocol
                            },
                            getAuthorizers: function () {
                                return { ajax: xhr_auth, jsonp: jsonp_auth }
                            },
                            onDocumentBody: function (callback) {
                                var _this = this
                                document.body
                                    ? callback()
                                    : setTimeout(function () {
                                          _this.onDocumentBody(callback)
                                      }, 0)
                            },
                            createJSONPRequest: function (url, data) {
                                return new jsonp_request(url, data)
                            },
                            createScriptRequest: function (src) {
                                return new script_request(src)
                            },
                            getLocalStorage: function () {
                                try {
                                    return window.localStorage
                                } catch (e) {
                                    return
                                }
                            },
                            createXHR: function () {
                                return this.getXHRAPI()
                                    ? this.createXMLHttpRequest()
                                    : this.createMicrosoftXHR()
                            },
                            createXMLHttpRequest: function () {
                                var Constructor = this.getXHRAPI()
                                return new Constructor()
                            },
                            createMicrosoftXHR: function () {
                                return new ActiveXObject('Microsoft.XMLHTTP')
                            },
                            getNetwork: function () {
                                return net_info_Network
                            },
                            createWebSocket: function (url) {
                                var Constructor = this.getWebSocketAPI()
                                return new Constructor(url)
                            },
                            createSocketRequest: function (method, url) {
                                if (this.isXHRSupported())
                                    return this.HTTPFactory.createXHR(
                                        method,
                                        url,
                                    )
                                if (
                                    this.isXDRSupported(
                                        url.indexOf('https:') === 0,
                                    )
                                )
                                    return this.HTTPFactory.createXDR(
                                        method,
                                        url,
                                    )
                                throw 'Cross-origin HTTP requests are not supported'
                            },
                            isXHRSupported: function () {
                                var Constructor = this.getXHRAPI()
                                return (
                                    Boolean(Constructor) &&
                                    new Constructor().withCredentials !== void 0
                                )
                            },
                            isXDRSupported: function (useTLS) {
                                var protocol = useTLS ? 'https:' : 'http:',
                                    documentProtocol = this.getProtocol()
                                return (
                                    Boolean(window.XDomainRequest) &&
                                    documentProtocol === protocol
                                )
                            },
                            addUnloadListener: function (listener) {
                                window.addEventListener !== void 0
                                    ? window.addEventListener(
                                          'unload',
                                          listener,
                                          !1,
                                      )
                                    : window.attachEvent !== void 0 &&
                                      window.attachEvent('onunload', listener)
                            },
                            removeUnloadListener: function (listener) {
                                window.addEventListener !== void 0
                                    ? window.removeEventListener(
                                          'unload',
                                          listener,
                                          !1,
                                      )
                                    : window.detachEvent !== void 0 &&
                                      window.detachEvent('onunload', listener)
                            },
                            randomInt: function (max) {
                                var random = function () {
                                    var crypto =
                                            window.crypto || window.msCrypto,
                                        random2 = crypto.getRandomValues(
                                            new Uint32Array(1),
                                        )[0]
                                    return random2 / Math.pow(2, 32)
                                }
                                return Math.floor(random() * max)
                            },
                        },
                        runtime = Runtime,
                        TimelineLevel
                    ;(function (TimelineLevel2) {
                        ;(TimelineLevel2[(TimelineLevel2.ERROR = 3)] = 'ERROR'),
                            (TimelineLevel2[(TimelineLevel2.INFO = 6)] =
                                'INFO'),
                            (TimelineLevel2[(TimelineLevel2.DEBUG = 7)] =
                                'DEBUG')
                    })(TimelineLevel || (TimelineLevel = {}))
                    var timeline_level = TimelineLevel,
                        timeline_Timeline = (function () {
                            function Timeline(key, session, options) {
                                ;(this.key = key),
                                    (this.session = session),
                                    (this.events = []),
                                    (this.options = options || {}),
                                    (this.sent = 0),
                                    (this.uniqueID = 0)
                            }
                            return (
                                (Timeline.prototype.log = function (
                                    level,
                                    event,
                                ) {
                                    level <= this.options.level &&
                                        (this.events.push(
                                            extend({}, event, {
                                                timestamp: util.now(),
                                            }),
                                        ),
                                        this.options.limit &&
                                            this.events.length >
                                                this.options.limit &&
                                            this.events.shift())
                                }),
                                (Timeline.prototype.error = function (event) {
                                    this.log(timeline_level.ERROR, event)
                                }),
                                (Timeline.prototype.info = function (event) {
                                    this.log(timeline_level.INFO, event)
                                }),
                                (Timeline.prototype.debug = function (event) {
                                    this.log(timeline_level.DEBUG, event)
                                }),
                                (Timeline.prototype.isEmpty = function () {
                                    return this.events.length === 0
                                }),
                                (Timeline.prototype.send = function (
                                    sendfn,
                                    callback,
                                ) {
                                    var _this = this,
                                        data = extend(
                                            {
                                                session: this.session,
                                                bundle: this.sent + 1,
                                                key: this.key,
                                                lib: 'js',
                                                version: this.options.version,
                                                cluster: this.options.cluster,
                                                features: this.options.features,
                                                timeline: this.events,
                                            },
                                            this.options.params,
                                        )
                                    return (
                                        (this.events = []),
                                        sendfn(data, function (error, result) {
                                            error || _this.sent++,
                                                callback &&
                                                    callback(error, result)
                                        }),
                                        !0
                                    )
                                }),
                                (Timeline.prototype.generateUniqueID =
                                    function () {
                                        return this.uniqueID++, this.uniqueID
                                    }),
                                Timeline
                            )
                        })(),
                        timeline_timeline = timeline_Timeline,
                        transport_strategy_TransportStrategy = (function () {
                            function TransportStrategy(
                                name,
                                priority,
                                transport,
                                options,
                            ) {
                                ;(this.name = name),
                                    (this.priority = priority),
                                    (this.transport = transport),
                                    (this.options = options || {})
                            }
                            return (
                                (TransportStrategy.prototype.isSupported =
                                    function () {
                                        return this.transport.isSupported({
                                            useTLS: this.options.useTLS,
                                        })
                                    }),
                                (TransportStrategy.prototype.connect =
                                    function (minPriority, callback) {
                                        var _this = this
                                        if (this.isSupported()) {
                                            if (this.priority < minPriority)
                                                return failAttempt(
                                                    new TransportPriorityTooLow(),
                                                    callback,
                                                )
                                        } else
                                            return failAttempt(
                                                new UnsupportedStrategy(),
                                                callback,
                                            )
                                        var connected = !1,
                                            transport =
                                                this.transport.createConnection(
                                                    this.name,
                                                    this.priority,
                                                    this.options.key,
                                                    this.options,
                                                ),
                                            handshake = null,
                                            onInitialized = function () {
                                                transport.unbind(
                                                    'initialized',
                                                    onInitialized,
                                                ),
                                                    transport.connect()
                                            },
                                            onOpen = function () {
                                                handshake =
                                                    factory.createHandshake(
                                                        transport,
                                                        function (result) {
                                                            ;(connected = !0),
                                                                unbindListeners(),
                                                                callback(
                                                                    null,
                                                                    result,
                                                                )
                                                        },
                                                    )
                                            },
                                            onError = function (error) {
                                                unbindListeners(),
                                                    callback(error)
                                            },
                                            onClosed = function () {
                                                unbindListeners()
                                                var serializedTransport
                                                ;(serializedTransport =
                                                    safeJSONStringify(
                                                        transport,
                                                    )),
                                                    callback(
                                                        new TransportClosed(
                                                            serializedTransport,
                                                        ),
                                                    )
                                            },
                                            unbindListeners = function () {
                                                transport.unbind(
                                                    'initialized',
                                                    onInitialized,
                                                ),
                                                    transport.unbind(
                                                        'open',
                                                        onOpen,
                                                    ),
                                                    transport.unbind(
                                                        'error',
                                                        onError,
                                                    ),
                                                    transport.unbind(
                                                        'closed',
                                                        onClosed,
                                                    )
                                            }
                                        return (
                                            transport.bind(
                                                'initialized',
                                                onInitialized,
                                            ),
                                            transport.bind('open', onOpen),
                                            transport.bind('error', onError),
                                            transport.bind('closed', onClosed),
                                            transport.initialize(),
                                            {
                                                abort: function () {
                                                    connected ||
                                                        (unbindListeners(),
                                                        handshake
                                                            ? handshake.close()
                                                            : transport.close())
                                                },
                                                forceMinPriority: function (p) {
                                                    connected ||
                                                        (_this.priority < p &&
                                                            (handshake
                                                                ? handshake.close()
                                                                : transport.close()))
                                                },
                                            }
                                        )
                                    }),
                                TransportStrategy
                            )
                        })(),
                        transport_strategy =
                            transport_strategy_TransportStrategy
                    function failAttempt(error, callback) {
                        return (
                            util.defer(function () {
                                callback(error)
                            }),
                            {
                                abort: function () {},
                                forceMinPriority: function () {},
                            }
                        )
                    }
                    var strategy_builder_Transports = runtime.Transports,
                        strategy_builder_defineTransport = function (
                            config,
                            name,
                            type,
                            priority,
                            options,
                            manager,
                        ) {
                            var transportClass =
                                strategy_builder_Transports[type]
                            if (!transportClass)
                                throw new UnsupportedTransport(type)
                            var enabled =
                                    (!config.enabledTransports ||
                                        arrayIndexOf(
                                            config.enabledTransports,
                                            name,
                                        ) !== -1) &&
                                    (!config.disabledTransports ||
                                        arrayIndexOf(
                                            config.disabledTransports,
                                            name,
                                        ) === -1),
                                transport
                            return (
                                enabled
                                    ? ((options = Object.assign(
                                          {
                                              ignoreNullOrigin:
                                                  config.ignoreNullOrigin,
                                          },
                                          options,
                                      )),
                                      (transport = new transport_strategy(
                                          name,
                                          priority,
                                          manager
                                              ? manager.getAssistant(
                                                    transportClass,
                                                )
                                              : transportClass,
                                          options,
                                      )))
                                    : (transport =
                                          strategy_builder_UnsupportedStrategy),
                                transport
                            )
                        },
                        strategy_builder_UnsupportedStrategy = {
                            isSupported: function () {
                                return !1
                            },
                            connect: function (_, callback) {
                                var deferred = util.defer(function () {
                                    callback(new UnsupportedStrategy())
                                })
                                return {
                                    abort: function () {
                                        deferred.ensureAborted()
                                    },
                                    forceMinPriority: function () {},
                                }
                            },
                        },
                        composeChannelQuery = function (params, authOptions) {
                            var query =
                                'socket_id=' +
                                encodeURIComponent(params.socketId)
                            for (var key in authOptions.params)
                                query +=
                                    '&' +
                                    encodeURIComponent(key) +
                                    '=' +
                                    encodeURIComponent(authOptions.params[key])
                            if (authOptions.paramsProvider != null) {
                                var dynamicParams = authOptions.paramsProvider()
                                for (var key in dynamicParams)
                                    query +=
                                        '&' +
                                        encodeURIComponent(key) +
                                        '=' +
                                        encodeURIComponent(dynamicParams[key])
                            }
                            return query
                        },
                        UserAuthenticator = function (authOptions) {
                            if (
                                typeof runtime.getAuthorizers()[
                                    authOptions.transport
                                ] == 'undefined'
                            )
                                throw (
                                    "'" +
                                    authOptions.transport +
                                    "' is not a recognized auth transport"
                                )
                            return function (params, callback) {
                                var query = composeChannelQuery(
                                    params,
                                    authOptions,
                                )
                                runtime
                                    .getAuthorizers()
                                    [authOptions.transport](
                                        runtime,
                                        query,
                                        authOptions,
                                        AuthRequestType.UserAuthentication,
                                        callback,
                                    )
                            }
                        },
                        user_authenticator = UserAuthenticator,
                        channel_authorizer_composeChannelQuery = function (
                            params,
                            authOptions,
                        ) {
                            var query =
                                'socket_id=' +
                                encodeURIComponent(params.socketId)
                            query +=
                                '&channel_name=' +
                                encodeURIComponent(params.channelName)
                            for (var key in authOptions.params)
                                query +=
                                    '&' +
                                    encodeURIComponent(key) +
                                    '=' +
                                    encodeURIComponent(authOptions.params[key])
                            if (authOptions.paramsProvider != null) {
                                var dynamicParams = authOptions.paramsProvider()
                                for (var key in dynamicParams)
                                    query +=
                                        '&' +
                                        encodeURIComponent(key) +
                                        '=' +
                                        encodeURIComponent(dynamicParams[key])
                            }
                            return query
                        },
                        ChannelAuthorizer = function (authOptions) {
                            if (
                                typeof runtime.getAuthorizers()[
                                    authOptions.transport
                                ] == 'undefined'
                            )
                                throw (
                                    "'" +
                                    authOptions.transport +
                                    "' is not a recognized auth transport"
                                )
                            return function (params, callback) {
                                var query =
                                    channel_authorizer_composeChannelQuery(
                                        params,
                                        authOptions,
                                    )
                                runtime
                                    .getAuthorizers()
                                    [authOptions.transport](
                                        runtime,
                                        query,
                                        authOptions,
                                        AuthRequestType.ChannelAuthorization,
                                        callback,
                                    )
                            }
                        },
                        channel_authorizer = ChannelAuthorizer,
                        ChannelAuthorizerProxy = function (
                            pusher,
                            authOptions,
                            channelAuthorizerGenerator,
                        ) {
                            var deprecatedAuthorizerOptions = {
                                authTransport: authOptions.transport,
                                authEndpoint: authOptions.endpoint,
                                auth: {
                                    params: authOptions.params,
                                    headers: authOptions.headers,
                                },
                            }
                            return function (params, callback) {
                                var channel = pusher.channel(
                                        params.channelName,
                                    ),
                                    channelAuthorizer =
                                        channelAuthorizerGenerator(
                                            channel,
                                            deprecatedAuthorizerOptions,
                                        )
                                channelAuthorizer.authorize(
                                    params.socketId,
                                    callback,
                                )
                            }
                        },
                        __assign = function () {
                            return (
                                (__assign =
                                    Object.assign ||
                                    function (t) {
                                        for (
                                            var s, i = 1, n = arguments.length;
                                            i < n;
                                            i++
                                        ) {
                                            s = arguments[i]
                                            for (var p in s)
                                                Object.prototype.hasOwnProperty.call(
                                                    s,
                                                    p,
                                                ) && (t[p] = s[p])
                                        }
                                        return t
                                    }),
                                __assign.apply(this, arguments)
                            )
                        }
                    function getConfig(opts, pusher) {
                        var config = {
                            activityTimeout:
                                opts.activityTimeout ||
                                defaults.activityTimeout,
                            cluster: opts.cluster || defaults.cluster,
                            httpPath: opts.httpPath || defaults.httpPath,
                            httpPort: opts.httpPort || defaults.httpPort,
                            httpsPort: opts.httpsPort || defaults.httpsPort,
                            pongTimeout:
                                opts.pongTimeout || defaults.pongTimeout,
                            statsHost: opts.statsHost || defaults.stats_host,
                            unavailableTimeout:
                                opts.unavailableTimeout ||
                                defaults.unavailableTimeout,
                            wsPath: opts.wsPath || defaults.wsPath,
                            wsPort: opts.wsPort || defaults.wsPort,
                            wssPort: opts.wssPort || defaults.wssPort,
                            enableStats: getEnableStatsConfig(opts),
                            httpHost: getHttpHost(opts),
                            useTLS: shouldUseTLS(opts),
                            wsHost: getWebsocketHost(opts),
                            userAuthenticator: buildUserAuthenticator(opts),
                            channelAuthorizer: buildChannelAuthorizer(
                                opts,
                                pusher,
                            ),
                        }
                        return (
                            'disabledTransports' in opts &&
                                (config.disabledTransports =
                                    opts.disabledTransports),
                            'enabledTransports' in opts &&
                                (config.enabledTransports =
                                    opts.enabledTransports),
                            'ignoreNullOrigin' in opts &&
                                (config.ignoreNullOrigin =
                                    opts.ignoreNullOrigin),
                            'timelineParams' in opts &&
                                (config.timelineParams = opts.timelineParams),
                            'nacl' in opts && (config.nacl = opts.nacl),
                            config
                        )
                    }
                    function getHttpHost(opts) {
                        return opts.httpHost
                            ? opts.httpHost
                            : opts.cluster
                            ? 'sockjs-' + opts.cluster + '.pusher.com'
                            : defaults.httpHost
                    }
                    function getWebsocketHost(opts) {
                        return opts.wsHost
                            ? opts.wsHost
                            : opts.cluster
                            ? getWebsocketHostFromCluster(opts.cluster)
                            : getWebsocketHostFromCluster(defaults.cluster)
                    }
                    function getWebsocketHostFromCluster(cluster) {
                        return 'ws-' + cluster + '.pusher.com'
                    }
                    function shouldUseTLS(opts) {
                        return runtime.getProtocol() === 'https:'
                            ? !0
                            : opts.forceTLS !== !1
                    }
                    function getEnableStatsConfig(opts) {
                        return 'enableStats' in opts
                            ? opts.enableStats
                            : 'disableStats' in opts
                            ? !opts.disableStats
                            : !1
                    }
                    function buildUserAuthenticator(opts) {
                        var userAuthentication = __assign(
                            __assign({}, defaults.userAuthentication),
                            opts.userAuthentication,
                        )
                        return 'customHandler' in userAuthentication &&
                            userAuthentication.customHandler != null
                            ? userAuthentication.customHandler
                            : user_authenticator(userAuthentication)
                    }
                    function buildChannelAuth(opts, pusher) {
                        var channelAuthorization
                        return (
                            'channelAuthorization' in opts
                                ? (channelAuthorization = __assign(
                                      __assign(
                                          {},
                                          defaults.channelAuthorization,
                                      ),
                                      opts.channelAuthorization,
                                  ))
                                : ((channelAuthorization = {
                                      transport:
                                          opts.authTransport ||
                                          defaults.authTransport,
                                      endpoint:
                                          opts.authEndpoint ||
                                          defaults.authEndpoint,
                                  }),
                                  'auth' in opts &&
                                      ('params' in opts.auth &&
                                          (channelAuthorization.params =
                                              opts.auth.params),
                                      'headers' in opts.auth &&
                                          (channelAuthorization.headers =
                                              opts.auth.headers)),
                                  'authorizer' in opts &&
                                      (channelAuthorization.customHandler =
                                          ChannelAuthorizerProxy(
                                              pusher,
                                              channelAuthorization,
                                              opts.authorizer,
                                          ))),
                            channelAuthorization
                        )
                    }
                    function buildChannelAuthorizer(opts, pusher) {
                        var channelAuthorization = buildChannelAuth(
                            opts,
                            pusher,
                        )
                        return 'customHandler' in channelAuthorization &&
                            channelAuthorization.customHandler != null
                            ? channelAuthorization.customHandler
                            : channel_authorizer(channelAuthorization)
                    }
                    var watchlist_extends = (function () {
                            var extendStatics = function (d, b) {
                                return (
                                    (extendStatics =
                                        Object.setPrototypeOf ||
                                        ({ __proto__: [] } instanceof Array &&
                                            function (d2, b2) {
                                                d2.__proto__ = b2
                                            }) ||
                                        function (d2, b2) {
                                            for (var p in b2)
                                                b2.hasOwnProperty(p) &&
                                                    (d2[p] = b2[p])
                                        }),
                                    extendStatics(d, b)
                                )
                            }
                            return function (d, b) {
                                extendStatics(d, b)
                                function __() {
                                    this.constructor = d
                                }
                                d.prototype =
                                    b === null
                                        ? Object.create(b)
                                        : ((__.prototype = b.prototype),
                                          new __())
                            }
                        })(),
                        watchlist_WatchlistFacade = (function (_super) {
                            watchlist_extends(WatchlistFacade, _super)
                            function WatchlistFacade(pusher) {
                                var _this =
                                    _super.call(
                                        this,
                                        function (eventName, data) {
                                            logger.debug(
                                                'No callbacks on watchlist events for ' +
                                                    eventName,
                                            )
                                        },
                                    ) || this
                                return (
                                    (_this.pusher = pusher),
                                    _this.bindWatchlistInternalEvent(),
                                    _this
                                )
                            }
                            return (
                                (WatchlistFacade.prototype.handleEvent =
                                    function (pusherEvent) {
                                        var _this = this
                                        pusherEvent.data.events.forEach(
                                            function (watchlistEvent) {
                                                _this.emit(
                                                    watchlistEvent.name,
                                                    watchlistEvent,
                                                )
                                            },
                                        )
                                    }),
                                (WatchlistFacade.prototype.bindWatchlistInternalEvent =
                                    function () {
                                        var _this = this
                                        this.pusher.connection.bind(
                                            'message',
                                            function (pusherEvent) {
                                                var eventName =
                                                    pusherEvent.event
                                                eventName ===
                                                    'pusher_internal:watchlist_events' &&
                                                    _this.handleEvent(
                                                        pusherEvent,
                                                    )
                                            },
                                        )
                                    }),
                                WatchlistFacade
                            )
                        })(dispatcher),
                        watchlist = watchlist_WatchlistFacade
                    function flatPromise() {
                        var resolve,
                            reject,
                            promise = new Promise(function (res, rej) {
                                ;(resolve = res), (reject = rej)
                            })
                        return { promise, resolve, reject }
                    }
                    var flat_promise = flatPromise,
                        user_extends = (function () {
                            var extendStatics = function (d, b) {
                                return (
                                    (extendStatics =
                                        Object.setPrototypeOf ||
                                        ({ __proto__: [] } instanceof Array &&
                                            function (d2, b2) {
                                                d2.__proto__ = b2
                                            }) ||
                                        function (d2, b2) {
                                            for (var p in b2)
                                                b2.hasOwnProperty(p) &&
                                                    (d2[p] = b2[p])
                                        }),
                                    extendStatics(d, b)
                                )
                            }
                            return function (d, b) {
                                extendStatics(d, b)
                                function __() {
                                    this.constructor = d
                                }
                                d.prototype =
                                    b === null
                                        ? Object.create(b)
                                        : ((__.prototype = b.prototype),
                                          new __())
                            }
                        })(),
                        user_UserFacade = (function (_super) {
                            user_extends(UserFacade, _super)
                            function UserFacade(pusher) {
                                var _this =
                                    _super.call(
                                        this,
                                        function (eventName, data) {
                                            logger.debug(
                                                'No callbacks on user for ' +
                                                    eventName,
                                            )
                                        },
                                    ) || this
                                return (
                                    (_this.signin_requested = !1),
                                    (_this.user_data = null),
                                    (_this.serverToUserChannel = null),
                                    (_this.signinDonePromise = null),
                                    (_this._signinDoneResolve = null),
                                    (_this._onAuthorize = function (
                                        err,
                                        authData,
                                    ) {
                                        if (err) {
                                            logger.warn(
                                                'Error during signin: ' + err,
                                            ),
                                                _this._cleanup()
                                            return
                                        }
                                        _this.pusher.send_event(
                                            'pusher:signin',
                                            {
                                                auth: authData.auth,
                                                user_data: authData.user_data,
                                            },
                                        )
                                    }),
                                    (_this.pusher = pusher),
                                    _this.pusher.connection.bind(
                                        'state_change',
                                        function (_a) {
                                            var previous = _a.previous,
                                                current = _a.current
                                            previous !== 'connected' &&
                                                current === 'connected' &&
                                                _this._signin(),
                                                previous === 'connected' &&
                                                    current !== 'connected' &&
                                                    (_this._cleanup(),
                                                    _this._newSigninPromiseIfNeeded())
                                        },
                                    ),
                                    (_this.watchlist = new watchlist(pusher)),
                                    _this.pusher.connection.bind(
                                        'message',
                                        function (event) {
                                            var eventName = event.event
                                            eventName ===
                                                'pusher:signin_success' &&
                                                _this._onSigninSuccess(
                                                    event.data,
                                                ),
                                                _this.serverToUserChannel &&
                                                    _this.serverToUserChannel
                                                        .name ===
                                                        event.channel &&
                                                    _this.serverToUserChannel.handleEvent(
                                                        event,
                                                    )
                                        },
                                    ),
                                    _this
                                )
                            }
                            return (
                                (UserFacade.prototype.signin = function () {
                                    this.signin_requested ||
                                        ((this.signin_requested = !0),
                                        this._signin())
                                }),
                                (UserFacade.prototype._signin = function () {
                                    !this.signin_requested ||
                                        (this._newSigninPromiseIfNeeded(),
                                        this.pusher.connection.state ===
                                            'connected' &&
                                            this.pusher.config.userAuthenticator(
                                                {
                                                    socketId:
                                                        this.pusher.connection
                                                            .socket_id,
                                                },
                                                this._onAuthorize,
                                            ))
                                }),
                                (UserFacade.prototype._onSigninSuccess =
                                    function (data) {
                                        try {
                                            this.user_data = JSON.parse(
                                                data.user_data,
                                            )
                                        } catch (e) {
                                            logger.error(
                                                'Failed parsing user data after signin: ' +
                                                    data.user_data,
                                            ),
                                                this._cleanup()
                                            return
                                        }
                                        if (
                                            typeof this.user_data.id !=
                                                'string' ||
                                            this.user_data.id === ''
                                        ) {
                                            logger.error(
                                                "user_data doesn't contain an id. user_data: " +
                                                    this.user_data,
                                            ),
                                                this._cleanup()
                                            return
                                        }
                                        this._signinDoneResolve(),
                                            this._subscribeChannels()
                                    }),
                                (UserFacade.prototype._subscribeChannels =
                                    function () {
                                        var _this = this,
                                            ensure_subscribed = function (
                                                channel,
                                            ) {
                                                channel.subscriptionPending &&
                                                channel.subscriptionCancelled
                                                    ? channel.reinstateSubscription()
                                                    : !channel.subscriptionPending &&
                                                      _this.pusher.connection
                                                          .state ===
                                                          'connected' &&
                                                      channel.subscribe()
                                            }
                                        ;(this.serverToUserChannel =
                                            new channels_channel(
                                                '#server-to-user-' +
                                                    this.user_data.id,
                                                this.pusher,
                                            )),
                                            this.serverToUserChannel.bind_global(
                                                function (eventName, data) {
                                                    eventName.indexOf(
                                                        'pusher_internal:',
                                                    ) === 0 ||
                                                        eventName.indexOf(
                                                            'pusher:',
                                                        ) === 0 ||
                                                        _this.emit(
                                                            eventName,
                                                            data,
                                                        )
                                                },
                                            ),
                                            ensure_subscribed(
                                                this.serverToUserChannel,
                                            )
                                    }),
                                (UserFacade.prototype._cleanup = function () {
                                    ;(this.user_data = null),
                                        this.serverToUserChannel &&
                                            (this.serverToUserChannel.unbind_all(),
                                            this.serverToUserChannel.disconnect(),
                                            (this.serverToUserChannel = null)),
                                        this.signin_requested &&
                                            this._signinDoneResolve()
                                }),
                                (UserFacade.prototype._newSigninPromiseIfNeeded =
                                    function () {
                                        if (
                                            !!this.signin_requested &&
                                            !(
                                                this.signinDonePromise &&
                                                !this.signinDonePromise.done
                                            )
                                        ) {
                                            var _a = flat_promise(),
                                                promise = _a.promise,
                                                resolve = _a.resolve,
                                                _ = _a.reject
                                            promise.done = !1
                                            var setDone = function () {
                                                promise.done = !0
                                            }
                                            promise
                                                .then(setDone)
                                                .catch(setDone),
                                                (this.signinDonePromise =
                                                    promise),
                                                (this._signinDoneResolve =
                                                    resolve)
                                        }
                                    }),
                                UserFacade
                            )
                        })(dispatcher),
                        user = user_UserFacade,
                        pusher_Pusher = (function () {
                            function Pusher3(app_key, options) {
                                var _this = this
                                if (
                                    (checkAppKey(app_key),
                                    (options = options || {}),
                                    !options.cluster &&
                                        !(options.wsHost || options.httpHost))
                                ) {
                                    var suffix = url_store.buildLogSuffix(
                                        'javascriptQuickStart',
                                    )
                                    logger.warn(
                                        'You should always specify a cluster when connecting. ' +
                                            suffix,
                                    )
                                }
                                'disableStats' in options &&
                                    logger.warn(
                                        'The disableStats option is deprecated in favor of enableStats',
                                    ),
                                    (this.key = app_key),
                                    (this.config = getConfig(options, this)),
                                    (this.channels = factory.createChannels()),
                                    (this.global_emitter = new dispatcher()),
                                    (this.sessionID = runtime.randomInt(1e9)),
                                    (this.timeline = new timeline_timeline(
                                        this.key,
                                        this.sessionID,
                                        {
                                            cluster: this.config.cluster,
                                            features:
                                                Pusher3.getClientFeatures(),
                                            params:
                                                this.config.timelineParams ||
                                                {},
                                            limit: 50,
                                            level: timeline_level.INFO,
                                            version: defaults.VERSION,
                                        },
                                    )),
                                    this.config.enableStats &&
                                        (this.timelineSender =
                                            factory.createTimelineSender(
                                                this.timeline,
                                                {
                                                    host: this.config.statsHost,
                                                    path:
                                                        '/timeline/v2/' +
                                                        runtime
                                                            .TimelineTransport
                                                            .name,
                                                },
                                            ))
                                var getStrategy = function (options2) {
                                    return runtime.getDefaultStrategy(
                                        _this.config,
                                        options2,
                                        strategy_builder_defineTransport,
                                    )
                                }
                                ;(this.connection =
                                    factory.createConnectionManager(this.key, {
                                        getStrategy,
                                        timeline: this.timeline,
                                        activityTimeout:
                                            this.config.activityTimeout,
                                        pongTimeout: this.config.pongTimeout,
                                        unavailableTimeout:
                                            this.config.unavailableTimeout,
                                        useTLS: Boolean(this.config.useTLS),
                                    })),
                                    this.connection.bind(
                                        'connected',
                                        function () {
                                            _this.subscribeAll(),
                                                _this.timelineSender &&
                                                    _this.timelineSender.send(
                                                        _this.connection.isUsingTLS(),
                                                    )
                                        },
                                    ),
                                    this.connection.bind(
                                        'message',
                                        function (event) {
                                            var eventName = event.event,
                                                internal =
                                                    eventName.indexOf(
                                                        'pusher_internal:',
                                                    ) === 0
                                            if (event.channel) {
                                                var channel = _this.channel(
                                                    event.channel,
                                                )
                                                channel &&
                                                    channel.handleEvent(event)
                                            }
                                            internal ||
                                                _this.global_emitter.emit(
                                                    event.event,
                                                    event.data,
                                                )
                                        },
                                    ),
                                    this.connection.bind(
                                        'connecting',
                                        function () {
                                            _this.channels.disconnect()
                                        },
                                    ),
                                    this.connection.bind(
                                        'disconnected',
                                        function () {
                                            _this.channels.disconnect()
                                        },
                                    ),
                                    this.connection.bind(
                                        'error',
                                        function (err) {
                                            logger.warn(err)
                                        },
                                    ),
                                    Pusher3.instances.push(this),
                                    this.timeline.info({
                                        instances: Pusher3.instances.length,
                                    }),
                                    (this.user = new user(this)),
                                    Pusher3.isReady && this.connect()
                            }
                            return (
                                (Pusher3.ready = function () {
                                    Pusher3.isReady = !0
                                    for (
                                        var i = 0,
                                            l2 = Pusher3.instances.length;
                                        i < l2;
                                        i++
                                    )
                                        Pusher3.instances[i].connect()
                                }),
                                (Pusher3.getClientFeatures = function () {
                                    return keys(
                                        filterObject(
                                            { ws: runtime.Transports.ws },
                                            function (t) {
                                                return t.isSupported({})
                                            },
                                        ),
                                    )
                                }),
                                (Pusher3.prototype.channel = function (name) {
                                    return this.channels.find(name)
                                }),
                                (Pusher3.prototype.allChannels = function () {
                                    return this.channels.all()
                                }),
                                (Pusher3.prototype.connect = function () {
                                    if (
                                        (this.connection.connect(),
                                        this.timelineSender &&
                                            !this.timelineSenderTimer)
                                    ) {
                                        var usingTLS =
                                                this.connection.isUsingTLS(),
                                            timelineSender = this.timelineSender
                                        this.timelineSenderTimer =
                                            new PeriodicTimer(6e4, function () {
                                                timelineSender.send(usingTLS)
                                            })
                                    }
                                }),
                                (Pusher3.prototype.disconnect = function () {
                                    this.connection.disconnect(),
                                        this.timelineSenderTimer &&
                                            (this.timelineSenderTimer.ensureAborted(),
                                            (this.timelineSenderTimer = null))
                                }),
                                (Pusher3.prototype.bind = function (
                                    event_name,
                                    callback,
                                    context,
                                ) {
                                    return (
                                        this.global_emitter.bind(
                                            event_name,
                                            callback,
                                            context,
                                        ),
                                        this
                                    )
                                }),
                                (Pusher3.prototype.unbind = function (
                                    event_name,
                                    callback,
                                    context,
                                ) {
                                    return (
                                        this.global_emitter.unbind(
                                            event_name,
                                            callback,
                                            context,
                                        ),
                                        this
                                    )
                                }),
                                (Pusher3.prototype.bind_global = function (
                                    callback,
                                ) {
                                    return (
                                        this.global_emitter.bind_global(
                                            callback,
                                        ),
                                        this
                                    )
                                }),
                                (Pusher3.prototype.unbind_global = function (
                                    callback,
                                ) {
                                    return (
                                        this.global_emitter.unbind_global(
                                            callback,
                                        ),
                                        this
                                    )
                                }),
                                (Pusher3.prototype.unbind_all = function (
                                    callback,
                                ) {
                                    return (
                                        this.global_emitter.unbind_all(), this
                                    )
                                }),
                                (Pusher3.prototype.subscribeAll = function () {
                                    var channelName
                                    for (channelName in this.channels.channels)
                                        this.channels.channels.hasOwnProperty(
                                            channelName,
                                        ) && this.subscribe(channelName)
                                }),
                                (Pusher3.prototype.subscribe = function (
                                    channel_name,
                                ) {
                                    var channel = this.channels.add(
                                        channel_name,
                                        this,
                                    )
                                    return (
                                        channel.subscriptionPending &&
                                        channel.subscriptionCancelled
                                            ? channel.reinstateSubscription()
                                            : !channel.subscriptionPending &&
                                              this.connection.state ===
                                                  'connected' &&
                                              channel.subscribe(),
                                        channel
                                    )
                                }),
                                (Pusher3.prototype.unsubscribe = function (
                                    channel_name,
                                ) {
                                    var channel =
                                        this.channels.find(channel_name)
                                    channel && channel.subscriptionPending
                                        ? channel.cancelSubscription()
                                        : ((channel =
                                              this.channels.remove(
                                                  channel_name,
                                              )),
                                          channel &&
                                              channel.subscribed &&
                                              channel.unsubscribe())
                                }),
                                (Pusher3.prototype.send_event = function (
                                    event_name,
                                    data,
                                    channel,
                                ) {
                                    return this.connection.send_event(
                                        event_name,
                                        data,
                                        channel,
                                    )
                                }),
                                (Pusher3.prototype.shouldUseTLS = function () {
                                    return this.config.useTLS
                                }),
                                (Pusher3.prototype.signin = function () {
                                    this.user.signin()
                                }),
                                (Pusher3.instances = []),
                                (Pusher3.isReady = !1),
                                (Pusher3.logToConsole = !1),
                                (Pusher3.Runtime = runtime),
                                (Pusher3.ScriptReceivers =
                                    runtime.ScriptReceivers),
                                (Pusher3.DependenciesReceivers =
                                    runtime.DependenciesReceivers),
                                (Pusher3.auth_callbacks =
                                    runtime.auth_callbacks),
                                Pusher3
                            )
                        })(),
                        core_pusher = (__webpack_exports__.default =
                            pusher_Pusher)
                    function checkAppKey(key) {
                        if (key == null)
                            throw 'You must pass your app key when you instantiate Pusher.'
                    }
                    runtime.setup(pusher_Pusher)
                },
            ])
        })
    })
    function _typeof(obj) {
        return (
            (_typeof =
                typeof Symbol == 'function' &&
                typeof Symbol.iterator == 'symbol'
                    ? function (obj2) {
                          return typeof obj2
                      }
                    : function (obj2) {
                          return obj2 &&
                              typeof Symbol == 'function' &&
                              obj2.constructor === Symbol &&
                              obj2 !== Symbol.prototype
                              ? 'symbol'
                              : typeof obj2
                      }),
            _typeof(obj)
        )
    }
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor))
            throw new TypeError('Cannot call a class as a function')
    }
    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]
            ;(descriptor.enumerable = descriptor.enumerable || !1),
                (descriptor.configurable = !0),
                'value' in descriptor && (descriptor.writable = !0),
                Object.defineProperty(target, descriptor.key, descriptor)
        }
    }
    function _createClass(Constructor, protoProps, staticProps) {
        return (
            protoProps && _defineProperties(Constructor.prototype, protoProps),
            staticProps && _defineProperties(Constructor, staticProps),
            Object.defineProperty(Constructor, 'prototype', { writable: !1 }),
            Constructor
        )
    }
    function _extends() {
        return (
            (_extends =
                Object.assign ||
                function (target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i]
                        for (var key in source)
                            Object.prototype.hasOwnProperty.call(source, key) &&
                                (target[key] = source[key])
                    }
                    return target
                }),
            _extends.apply(this, arguments)
        )
    }
    function _inherits(subClass, superClass) {
        if (typeof superClass != 'function' && superClass !== null)
            throw new TypeError(
                'Super expression must either be null or a function',
            )
        ;(subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
                constructor: {
                    value: subClass,
                    writable: !0,
                    configurable: !0,
                },
            },
        )),
            Object.defineProperty(subClass, 'prototype', { writable: !1 }),
            superClass && _setPrototypeOf(subClass, superClass)
    }
    function _getPrototypeOf(o) {
        return (
            (_getPrototypeOf = Object.setPrototypeOf
                ? Object.getPrototypeOf
                : function (o2) {
                      return o2.__proto__ || Object.getPrototypeOf(o2)
                  }),
            _getPrototypeOf(o)
        )
    }
    function _setPrototypeOf(o, p) {
        return (
            (_setPrototypeOf =
                Object.setPrototypeOf ||
                function (o2, p2) {
                    return (o2.__proto__ = p2), o2
                }),
            _setPrototypeOf(o, p)
        )
    }
    function _isNativeReflectConstruct() {
        if (
            typeof Reflect == 'undefined' ||
            !Reflect.construct ||
            Reflect.construct.sham
        )
            return !1
        if (typeof Proxy == 'function') return !0
        try {
            return (
                Boolean.prototype.valueOf.call(
                    Reflect.construct(Boolean, [], function () {}),
                ),
                !0
            )
        } catch (e) {
            return !1
        }
    }
    function _assertThisInitialized(self) {
        if (self === void 0)
            throw new ReferenceError(
                "this hasn't been initialised - super() hasn't been called",
            )
        return self
    }
    function _possibleConstructorReturn(self, call) {
        if (call && (typeof call == 'object' || typeof call == 'function'))
            return call
        if (call !== void 0)
            throw new TypeError(
                'Derived constructors may only return object or undefined',
            )
        return _assertThisInitialized(self)
    }
    function _createSuper(Derived) {
        var hasNativeReflectConstruct = _isNativeReflectConstruct()
        return function () {
            var Super = _getPrototypeOf(Derived),
                result
            if (hasNativeReflectConstruct) {
                var NewTarget = _getPrototypeOf(this).constructor
                result = Reflect.construct(Super, arguments, NewTarget)
            } else result = Super.apply(this, arguments)
            return _possibleConstructorReturn(this, result)
        }
    }
    var Channel = (function () {
            function Channel2() {
                _classCallCheck(this, Channel2)
            }
            return (
                _createClass(Channel2, [
                    {
                        key: 'listenForWhisper',
                        value: function (event, callback) {
                            return this.listen('.client-' + event, callback)
                        },
                    },
                    {
                        key: 'notification',
                        value: function (callback) {
                            return this.listen(
                                '.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated',
                                callback,
                            )
                        },
                    },
                    {
                        key: 'stopListeningForWhisper',
                        value: function (event, callback) {
                            return this.stopListening(
                                '.client-' + event,
                                callback,
                            )
                        },
                    },
                ]),
                Channel2
            )
        })(),
        EventFormatter = (function () {
            function EventFormatter2(namespace) {
                _classCallCheck(this, EventFormatter2),
                    this.setNamespace(namespace)
            }
            return (
                _createClass(EventFormatter2, [
                    {
                        key: 'format',
                        value: function (event) {
                            return event.charAt(0) === '.' ||
                                event.charAt(0) === '\\'
                                ? event.substr(1)
                                : (this.namespace &&
                                      (event = this.namespace + '.' + event),
                                  event.replace(/\./g, '\\'))
                        },
                    },
                    {
                        key: 'setNamespace',
                        value: function (value) {
                            this.namespace = value
                        },
                    },
                ]),
                EventFormatter2
            )
        })(),
        PusherChannel = (function (_Channel) {
            _inherits(PusherChannel2, _Channel)
            var _super = _createSuper(PusherChannel2)
            function PusherChannel2(pusher, name, options) {
                var _this
                return (
                    _classCallCheck(this, PusherChannel2),
                    (_this = _super.call(this)),
                    (_this.name = name),
                    (_this.pusher = pusher),
                    (_this.options = options),
                    (_this.eventFormatter = new EventFormatter(
                        _this.options.namespace,
                    )),
                    _this.subscribe(),
                    _this
                )
            }
            return (
                _createClass(PusherChannel2, [
                    {
                        key: 'subscribe',
                        value: function () {
                            this.subscription = this.pusher.subscribe(this.name)
                        },
                    },
                    {
                        key: 'unsubscribe',
                        value: function () {
                            this.pusher.unsubscribe(this.name)
                        },
                    },
                    {
                        key: 'listen',
                        value: function (event, callback) {
                            return (
                                this.on(
                                    this.eventFormatter.format(event),
                                    callback,
                                ),
                                this
                            )
                        },
                    },
                    {
                        key: 'listenToAll',
                        value: function (callback) {
                            var _this2 = this
                            return (
                                this.subscription.bind_global(function (
                                    event,
                                    data,
                                ) {
                                    if (!event.startsWith('pusher:')) {
                                        var namespace =
                                                _this2.options.namespace.replace(
                                                    /\./g,
                                                    '\\',
                                                ),
                                            formattedEvent = event.startsWith(
                                                namespace,
                                            )
                                                ? event.substring(
                                                      namespace.length + 1,
                                                  )
                                                : '.' + event
                                        callback(formattedEvent, data)
                                    }
                                }),
                                this
                            )
                        },
                    },
                    {
                        key: 'stopListening',
                        value: function (event, callback) {
                            return (
                                callback
                                    ? this.subscription.unbind(
                                          this.eventFormatter.format(event),
                                          callback,
                                      )
                                    : this.subscription.unbind(
                                          this.eventFormatter.format(event),
                                      ),
                                this
                            )
                        },
                    },
                    {
                        key: 'stopListeningToAll',
                        value: function (callback) {
                            return (
                                callback
                                    ? this.subscription.unbind_global(callback)
                                    : this.subscription.unbind_global(),
                                this
                            )
                        },
                    },
                    {
                        key: 'subscribed',
                        value: function (callback) {
                            return (
                                this.on(
                                    'pusher:subscription_succeeded',
                                    function () {
                                        callback()
                                    },
                                ),
                                this
                            )
                        },
                    },
                    {
                        key: 'error',
                        value: function (callback) {
                            return (
                                this.on(
                                    'pusher:subscription_error',
                                    function (status) {
                                        callback(status)
                                    },
                                ),
                                this
                            )
                        },
                    },
                    {
                        key: 'on',
                        value: function (event, callback) {
                            return this.subscription.bind(event, callback), this
                        },
                    },
                ]),
                PusherChannel2
            )
        })(Channel),
        PusherPrivateChannel = (function (_PusherChannel) {
            _inherits(PusherPrivateChannel2, _PusherChannel)
            var _super = _createSuper(PusherPrivateChannel2)
            function PusherPrivateChannel2() {
                return (
                    _classCallCheck(this, PusherPrivateChannel2),
                    _super.apply(this, arguments)
                )
            }
            return (
                _createClass(PusherPrivateChannel2, [
                    {
                        key: 'whisper',
                        value: function (eventName, data) {
                            return (
                                this.pusher.channels.channels[
                                    this.name
                                ].trigger('client-'.concat(eventName), data),
                                this
                            )
                        },
                    },
                ]),
                PusherPrivateChannel2
            )
        })(PusherChannel),
        PusherEncryptedPrivateChannel = (function (_PusherChannel) {
            _inherits(PusherEncryptedPrivateChannel2, _PusherChannel)
            var _super = _createSuper(PusherEncryptedPrivateChannel2)
            function PusherEncryptedPrivateChannel2() {
                return (
                    _classCallCheck(this, PusherEncryptedPrivateChannel2),
                    _super.apply(this, arguments)
                )
            }
            return (
                _createClass(PusherEncryptedPrivateChannel2, [
                    {
                        key: 'whisper',
                        value: function (eventName, data) {
                            return (
                                this.pusher.channels.channels[
                                    this.name
                                ].trigger('client-'.concat(eventName), data),
                                this
                            )
                        },
                    },
                ]),
                PusherEncryptedPrivateChannel2
            )
        })(PusherChannel),
        PusherPresenceChannel = (function (_PusherChannel) {
            _inherits(PusherPresenceChannel2, _PusherChannel)
            var _super = _createSuper(PusherPresenceChannel2)
            function PusherPresenceChannel2() {
                return (
                    _classCallCheck(this, PusherPresenceChannel2),
                    _super.apply(this, arguments)
                )
            }
            return (
                _createClass(PusherPresenceChannel2, [
                    {
                        key: 'here',
                        value: function (callback) {
                            return (
                                this.on(
                                    'pusher:subscription_succeeded',
                                    function (data) {
                                        callback(
                                            Object.keys(data.members).map(
                                                function (k) {
                                                    return data.members[k]
                                                },
                                            ),
                                        )
                                    },
                                ),
                                this
                            )
                        },
                    },
                    {
                        key: 'joining',
                        value: function (callback) {
                            return (
                                this.on(
                                    'pusher:member_added',
                                    function (member) {
                                        callback(member.info)
                                    },
                                ),
                                this
                            )
                        },
                    },
                    {
                        key: 'leaving',
                        value: function (callback) {
                            return (
                                this.on(
                                    'pusher:member_removed',
                                    function (member) {
                                        callback(member.info)
                                    },
                                ),
                                this
                            )
                        },
                    },
                    {
                        key: 'whisper',
                        value: function (eventName, data) {
                            return (
                                this.pusher.channels.channels[
                                    this.name
                                ].trigger('client-'.concat(eventName), data),
                                this
                            )
                        },
                    },
                ]),
                PusherPresenceChannel2
            )
        })(PusherChannel),
        SocketIoChannel = (function (_Channel) {
            _inherits(SocketIoChannel2, _Channel)
            var _super = _createSuper(SocketIoChannel2)
            function SocketIoChannel2(socket, name, options) {
                var _this
                return (
                    _classCallCheck(this, SocketIoChannel2),
                    (_this = _super.call(this)),
                    (_this.events = {}),
                    (_this.listeners = {}),
                    (_this.name = name),
                    (_this.socket = socket),
                    (_this.options = options),
                    (_this.eventFormatter = new EventFormatter(
                        _this.options.namespace,
                    )),
                    _this.subscribe(),
                    _this
                )
            }
            return (
                _createClass(SocketIoChannel2, [
                    {
                        key: 'subscribe',
                        value: function () {
                            this.socket.emit('subscribe', {
                                channel: this.name,
                                auth: this.options.auth || {},
                            })
                        },
                    },
                    {
                        key: 'unsubscribe',
                        value: function () {
                            this.unbind(),
                                this.socket.emit('unsubscribe', {
                                    channel: this.name,
                                    auth: this.options.auth || {},
                                })
                        },
                    },
                    {
                        key: 'listen',
                        value: function (event, callback) {
                            return (
                                this.on(
                                    this.eventFormatter.format(event),
                                    callback,
                                ),
                                this
                            )
                        },
                    },
                    {
                        key: 'stopListening',
                        value: function (event, callback) {
                            return (
                                this.unbindEvent(
                                    this.eventFormatter.format(event),
                                    callback,
                                ),
                                this
                            )
                        },
                    },
                    {
                        key: 'subscribed',
                        value: function (callback) {
                            return (
                                this.on('connect', function (socket) {
                                    callback(socket)
                                }),
                                this
                            )
                        },
                    },
                    {
                        key: 'error',
                        value: function (callback) {
                            return this
                        },
                    },
                    {
                        key: 'on',
                        value: function (event, callback) {
                            var _this2 = this
                            return (
                                (this.listeners[event] =
                                    this.listeners[event] || []),
                                this.events[event] ||
                                    ((this.events[event] = function (
                                        channel,
                                        data,
                                    ) {
                                        _this2.name === channel &&
                                            _this2.listeners[event] &&
                                            _this2.listeners[event].forEach(
                                                function (cb) {
                                                    return cb(data)
                                                },
                                            )
                                    }),
                                    this.socket.on(event, this.events[event])),
                                this.listeners[event].push(callback),
                                this
                            )
                        },
                    },
                    {
                        key: 'unbind',
                        value: function () {
                            var _this3 = this
                            Object.keys(this.events).forEach(function (event) {
                                _this3.unbindEvent(event)
                            })
                        },
                    },
                    {
                        key: 'unbindEvent',
                        value: function (event, callback) {
                            ;(this.listeners[event] =
                                this.listeners[event] || []),
                                callback &&
                                    (this.listeners[event] = this.listeners[
                                        event
                                    ].filter(function (cb) {
                                        return cb !== callback
                                    })),
                                (!callback ||
                                    this.listeners[event].length === 0) &&
                                    (this.events[event] &&
                                        (this.socket.removeListener(
                                            event,
                                            this.events[event],
                                        ),
                                        delete this.events[event]),
                                    delete this.listeners[event])
                        },
                    },
                ]),
                SocketIoChannel2
            )
        })(Channel),
        SocketIoPrivateChannel = (function (_SocketIoChannel) {
            _inherits(SocketIoPrivateChannel2, _SocketIoChannel)
            var _super = _createSuper(SocketIoPrivateChannel2)
            function SocketIoPrivateChannel2() {
                return (
                    _classCallCheck(this, SocketIoPrivateChannel2),
                    _super.apply(this, arguments)
                )
            }
            return (
                _createClass(SocketIoPrivateChannel2, [
                    {
                        key: 'whisper',
                        value: function (eventName, data) {
                            return (
                                this.socket.emit('client event', {
                                    channel: this.name,
                                    event: 'client-'.concat(eventName),
                                    data,
                                }),
                                this
                            )
                        },
                    },
                ]),
                SocketIoPrivateChannel2
            )
        })(SocketIoChannel),
        SocketIoPresenceChannel = (function (_SocketIoPrivateChann) {
            _inherits(SocketIoPresenceChannel2, _SocketIoPrivateChann)
            var _super = _createSuper(SocketIoPresenceChannel2)
            function SocketIoPresenceChannel2() {
                return (
                    _classCallCheck(this, SocketIoPresenceChannel2),
                    _super.apply(this, arguments)
                )
            }
            return (
                _createClass(SocketIoPresenceChannel2, [
                    {
                        key: 'here',
                        value: function (callback) {
                            return (
                                this.on(
                                    'presence:subscribed',
                                    function (members) {
                                        callback(
                                            members.map(function (m) {
                                                return m.user_info
                                            }),
                                        )
                                    },
                                ),
                                this
                            )
                        },
                    },
                    {
                        key: 'joining',
                        value: function (callback) {
                            return (
                                this.on('presence:joining', function (member) {
                                    return callback(member.user_info)
                                }),
                                this
                            )
                        },
                    },
                    {
                        key: 'leaving',
                        value: function (callback) {
                            return (
                                this.on('presence:leaving', function (member) {
                                    return callback(member.user_info)
                                }),
                                this
                            )
                        },
                    },
                ]),
                SocketIoPresenceChannel2
            )
        })(SocketIoPrivateChannel),
        NullChannel = (function (_Channel) {
            _inherits(NullChannel2, _Channel)
            var _super = _createSuper(NullChannel2)
            function NullChannel2() {
                return (
                    _classCallCheck(this, NullChannel2),
                    _super.apply(this, arguments)
                )
            }
            return (
                _createClass(NullChannel2, [
                    { key: 'subscribe', value: function () {} },
                    { key: 'unsubscribe', value: function () {} },
                    {
                        key: 'listen',
                        value: function (event, callback) {
                            return this
                        },
                    },
                    {
                        key: 'listenToAll',
                        value: function (callback) {
                            return this
                        },
                    },
                    {
                        key: 'stopListening',
                        value: function (event, callback) {
                            return this
                        },
                    },
                    {
                        key: 'subscribed',
                        value: function (callback) {
                            return this
                        },
                    },
                    {
                        key: 'error',
                        value: function (callback) {
                            return this
                        },
                    },
                    {
                        key: 'on',
                        value: function (event, callback) {
                            return this
                        },
                    },
                ]),
                NullChannel2
            )
        })(Channel),
        NullPrivateChannel = (function (_NullChannel) {
            _inherits(NullPrivateChannel2, _NullChannel)
            var _super = _createSuper(NullPrivateChannel2)
            function NullPrivateChannel2() {
                return (
                    _classCallCheck(this, NullPrivateChannel2),
                    _super.apply(this, arguments)
                )
            }
            return (
                _createClass(NullPrivateChannel2, [
                    {
                        key: 'whisper',
                        value: function (eventName, data) {
                            return this
                        },
                    },
                ]),
                NullPrivateChannel2
            )
        })(NullChannel),
        NullPresenceChannel = (function (_NullChannel) {
            _inherits(NullPresenceChannel2, _NullChannel)
            var _super = _createSuper(NullPresenceChannel2)
            function NullPresenceChannel2() {
                return (
                    _classCallCheck(this, NullPresenceChannel2),
                    _super.apply(this, arguments)
                )
            }
            return (
                _createClass(NullPresenceChannel2, [
                    {
                        key: 'here',
                        value: function (callback) {
                            return this
                        },
                    },
                    {
                        key: 'joining',
                        value: function (callback) {
                            return this
                        },
                    },
                    {
                        key: 'leaving',
                        value: function (callback) {
                            return this
                        },
                    },
                    {
                        key: 'whisper',
                        value: function (eventName, data) {
                            return this
                        },
                    },
                ]),
                NullPresenceChannel2
            )
        })(NullChannel),
        Connector = (function () {
            function Connector2(options) {
                _classCallCheck(this, Connector2),
                    (this._defaultOptions = {
                        auth: { headers: {} },
                        authEndpoint: '/broadcasting/auth',
                        userAuthentication: {
                            endpoint: '/broadcasting/user-auth',
                            headers: {},
                        },
                        broadcaster: 'pusher',
                        csrfToken: null,
                        bearerToken: null,
                        host: null,
                        key: null,
                        namespace: 'App.Events',
                    }),
                    this.setOptions(options),
                    this.connect()
            }
            return (
                _createClass(Connector2, [
                    {
                        key: 'setOptions',
                        value: function (options) {
                            this.options = _extends(
                                this._defaultOptions,
                                options,
                            )
                            var token = this.csrfToken()
                            return (
                                token &&
                                    ((this.options.auth.headers[
                                        'X-CSRF-TOKEN'
                                    ] = token),
                                    (this.options.userAuthentication.headers[
                                        'X-CSRF-TOKEN'
                                    ] = token)),
                                (token = this.options.bearerToken),
                                token &&
                                    ((this.options.auth.headers.Authorization =
                                        'Bearer ' + token),
                                    (this.options.userAuthentication.headers.Authorization =
                                        'Bearer ' + token)),
                                options
                            )
                        },
                    },
                    {
                        key: 'csrfToken',
                        value: function () {
                            var selector
                            return typeof window != 'undefined' &&
                                window.Laravel &&
                                window.Laravel.csrfToken
                                ? window.Laravel.csrfToken
                                : this.options.csrfToken
                                ? this.options.csrfToken
                                : typeof document != 'undefined' &&
                                  typeof document.querySelector == 'function' &&
                                  (selector = document.querySelector(
                                      'meta[name="csrf-token"]',
                                  ))
                                ? selector.getAttribute('content')
                                : null
                        },
                    },
                ]),
                Connector2
            )
        })(),
        PusherConnector = (function (_Connector) {
            _inherits(PusherConnector2, _Connector)
            var _super = _createSuper(PusherConnector2)
            function PusherConnector2() {
                var _this
                return (
                    _classCallCheck(this, PusherConnector2),
                    (_this = _super.apply(this, arguments)),
                    (_this.channels = {}),
                    _this
                )
            }
            return (
                _createClass(PusherConnector2, [
                    {
                        key: 'connect',
                        value: function () {
                            typeof this.options.client != 'undefined'
                                ? (this.pusher = this.options.client)
                                : this.options.Pusher
                                ? (this.pusher = new this.options.Pusher(
                                      this.options.key,
                                      this.options,
                                  ))
                                : (this.pusher = new Pusher(
                                      this.options.key,
                                      this.options,
                                  ))
                        },
                    },
                    {
                        key: 'signin',
                        value: function () {
                            this.pusher.signin()
                        },
                    },
                    {
                        key: 'listen',
                        value: function (name, event, callback) {
                            return this.channel(name).listen(event, callback)
                        },
                    },
                    {
                        key: 'channel',
                        value: function (name) {
                            return (
                                this.channels[name] ||
                                    (this.channels[name] = new PusherChannel(
                                        this.pusher,
                                        name,
                                        this.options,
                                    )),
                                this.channels[name]
                            )
                        },
                    },
                    {
                        key: 'privateChannel',
                        value: function (name) {
                            return (
                                this.channels['private-' + name] ||
                                    (this.channels['private-' + name] =
                                        new PusherPrivateChannel(
                                            this.pusher,
                                            'private-' + name,
                                            this.options,
                                        )),
                                this.channels['private-' + name]
                            )
                        },
                    },
                    {
                        key: 'encryptedPrivateChannel',
                        value: function (name) {
                            return (
                                this.channels['private-encrypted-' + name] ||
                                    (this.channels[
                                        'private-encrypted-' + name
                                    ] = new PusherEncryptedPrivateChannel(
                                        this.pusher,
                                        'private-encrypted-' + name,
                                        this.options,
                                    )),
                                this.channels['private-encrypted-' + name]
                            )
                        },
                    },
                    {
                        key: 'presenceChannel',
                        value: function (name) {
                            return (
                                this.channels['presence-' + name] ||
                                    (this.channels['presence-' + name] =
                                        new PusherPresenceChannel(
                                            this.pusher,
                                            'presence-' + name,
                                            this.options,
                                        )),
                                this.channels['presence-' + name]
                            )
                        },
                    },
                    {
                        key: 'leave',
                        value: function (name) {
                            var _this2 = this,
                                channels = [
                                    name,
                                    'private-' + name,
                                    'private-encrypted-' + name,
                                    'presence-' + name,
                                ]
                            channels.forEach(function (name2, index) {
                                _this2.leaveChannel(name2)
                            })
                        },
                    },
                    {
                        key: 'leaveChannel',
                        value: function (name) {
                            this.channels[name] &&
                                (this.channels[name].unsubscribe(),
                                delete this.channels[name])
                        },
                    },
                    {
                        key: 'socketId',
                        value: function () {
                            return this.pusher.connection.socket_id
                        },
                    },
                    {
                        key: 'disconnect',
                        value: function () {
                            this.pusher.disconnect()
                        },
                    },
                ]),
                PusherConnector2
            )
        })(Connector),
        SocketIoConnector = (function (_Connector) {
            _inherits(SocketIoConnector2, _Connector)
            var _super = _createSuper(SocketIoConnector2)
            function SocketIoConnector2() {
                var _this
                return (
                    _classCallCheck(this, SocketIoConnector2),
                    (_this = _super.apply(this, arguments)),
                    (_this.channels = {}),
                    _this
                )
            }
            return (
                _createClass(SocketIoConnector2, [
                    {
                        key: 'connect',
                        value: function () {
                            var _this2 = this,
                                io2 = this.getSocketIO()
                            return (
                                (this.socket = io2(
                                    this.options.host,
                                    this.options,
                                )),
                                this.socket.on('reconnect', function () {
                                    Object.values(_this2.channels).forEach(
                                        function (channel) {
                                            channel.subscribe()
                                        },
                                    )
                                }),
                                this.socket
                            )
                        },
                    },
                    {
                        key: 'getSocketIO',
                        value: function () {
                            if (typeof this.options.client != 'undefined')
                                return this.options.client
                            if (typeof io != 'undefined') return io
                            throw new Error(
                                'Socket.io client not found. Should be globally available or passed via options.client',
                            )
                        },
                    },
                    {
                        key: 'listen',
                        value: function (name, event, callback) {
                            return this.channel(name).listen(event, callback)
                        },
                    },
                    {
                        key: 'channel',
                        value: function (name) {
                            return (
                                this.channels[name] ||
                                    (this.channels[name] = new SocketIoChannel(
                                        this.socket,
                                        name,
                                        this.options,
                                    )),
                                this.channels[name]
                            )
                        },
                    },
                    {
                        key: 'privateChannel',
                        value: function (name) {
                            return (
                                this.channels['private-' + name] ||
                                    (this.channels['private-' + name] =
                                        new SocketIoPrivateChannel(
                                            this.socket,
                                            'private-' + name,
                                            this.options,
                                        )),
                                this.channels['private-' + name]
                            )
                        },
                    },
                    {
                        key: 'presenceChannel',
                        value: function (name) {
                            return (
                                this.channels['presence-' + name] ||
                                    (this.channels['presence-' + name] =
                                        new SocketIoPresenceChannel(
                                            this.socket,
                                            'presence-' + name,
                                            this.options,
                                        )),
                                this.channels['presence-' + name]
                            )
                        },
                    },
                    {
                        key: 'leave',
                        value: function (name) {
                            var _this3 = this,
                                channels = [
                                    name,
                                    'private-' + name,
                                    'presence-' + name,
                                ]
                            channels.forEach(function (name2) {
                                _this3.leaveChannel(name2)
                            })
                        },
                    },
                    {
                        key: 'leaveChannel',
                        value: function (name) {
                            this.channels[name] &&
                                (this.channels[name].unsubscribe(),
                                delete this.channels[name])
                        },
                    },
                    {
                        key: 'socketId',
                        value: function () {
                            return this.socket.id
                        },
                    },
                    {
                        key: 'disconnect',
                        value: function () {
                            this.socket.disconnect()
                        },
                    },
                ]),
                SocketIoConnector2
            )
        })(Connector),
        NullConnector = (function (_Connector) {
            _inherits(NullConnector2, _Connector)
            var _super = _createSuper(NullConnector2)
            function NullConnector2() {
                var _this
                return (
                    _classCallCheck(this, NullConnector2),
                    (_this = _super.apply(this, arguments)),
                    (_this.channels = {}),
                    _this
                )
            }
            return (
                _createClass(NullConnector2, [
                    { key: 'connect', value: function () {} },
                    {
                        key: 'listen',
                        value: function (name, event, callback) {
                            return new NullChannel()
                        },
                    },
                    {
                        key: 'channel',
                        value: function (name) {
                            return new NullChannel()
                        },
                    },
                    {
                        key: 'privateChannel',
                        value: function (name) {
                            return new NullPrivateChannel()
                        },
                    },
                    {
                        key: 'encryptedPrivateChannel',
                        value: function (name) {
                            return new NullPrivateChannel()
                        },
                    },
                    {
                        key: 'presenceChannel',
                        value: function (name) {
                            return new NullPresenceChannel()
                        },
                    },
                    { key: 'leave', value: function (name) {} },
                    { key: 'leaveChannel', value: function (name) {} },
                    {
                        key: 'socketId',
                        value: function () {
                            return 'fake-socket-id'
                        },
                    },
                    { key: 'disconnect', value: function () {} },
                ]),
                NullConnector2
            )
        })(Connector),
        Echo = (function () {
            function Echo2(options) {
                _classCallCheck(this, Echo2),
                    (this.options = options),
                    this.connect(),
                    this.options.withoutInterceptors ||
                        this.registerInterceptors()
            }
            return (
                _createClass(Echo2, [
                    {
                        key: 'channel',
                        value: function (_channel) {
                            return this.connector.channel(_channel)
                        },
                    },
                    {
                        key: 'connect',
                        value: function () {
                            this.options.broadcaster == 'pusher'
                                ? (this.connector = new PusherConnector(
                                      this.options,
                                  ))
                                : this.options.broadcaster == 'socket.io'
                                ? (this.connector = new SocketIoConnector(
                                      this.options,
                                  ))
                                : this.options.broadcaster == 'null'
                                ? (this.connector = new NullConnector(
                                      this.options,
                                  ))
                                : typeof this.options.broadcaster ==
                                      'function' &&
                                  (this.connector =
                                      new this.options.broadcaster(
                                          this.options,
                                      ))
                        },
                    },
                    {
                        key: 'disconnect',
                        value: function () {
                            this.connector.disconnect()
                        },
                    },
                    {
                        key: 'join',
                        value: function (channel) {
                            return this.connector.presenceChannel(channel)
                        },
                    },
                    {
                        key: 'leave',
                        value: function (channel) {
                            this.connector.leave(channel)
                        },
                    },
                    {
                        key: 'leaveChannel',
                        value: function (channel) {
                            this.connector.leaveChannel(channel)
                        },
                    },
                    {
                        key: 'leaveAllChannels',
                        value: function () {
                            for (var channel in this.connector.channels)
                                this.leaveChannel(channel)
                        },
                    },
                    {
                        key: 'listen',
                        value: function (channel, event, callback) {
                            return this.connector.listen(
                                channel,
                                event,
                                callback,
                            )
                        },
                    },
                    {
                        key: 'private',
                        value: function (channel) {
                            return this.connector.privateChannel(channel)
                        },
                    },
                    {
                        key: 'encryptedPrivate',
                        value: function (channel) {
                            return this.connector.encryptedPrivateChannel(
                                channel,
                            )
                        },
                    },
                    {
                        key: 'socketId',
                        value: function () {
                            return this.connector.socketId()
                        },
                    },
                    {
                        key: 'registerInterceptors',
                        value: function () {
                            typeof Vue == 'function' &&
                                Vue.http &&
                                this.registerVueRequestInterceptor(),
                                typeof axios == 'function' &&
                                    this.registerAxiosRequestInterceptor(),
                                typeof jQuery == 'function' &&
                                    this.registerjQueryAjaxSetup(),
                                (typeof Turbo == 'undefined'
                                    ? 'undefined'
                                    : _typeof(Turbo)) === 'object' &&
                                    this.registerTurboRequestInterceptor()
                        },
                    },
                    {
                        key: 'registerVueRequestInterceptor',
                        value: function () {
                            var _this = this
                            Vue.http.interceptors.push(function (
                                request,
                                next,
                            ) {
                                _this.socketId() &&
                                    request.headers.set(
                                        'X-Socket-ID',
                                        _this.socketId(),
                                    ),
                                    next()
                            })
                        },
                    },
                    {
                        key: 'registerAxiosRequestInterceptor',
                        value: function () {
                            var _this2 = this
                            axios.interceptors.request.use(function (config) {
                                return (
                                    _this2.socketId() &&
                                        (config.headers['X-Socket-Id'] =
                                            _this2.socketId()),
                                    config
                                )
                            })
                        },
                    },
                    {
                        key: 'registerjQueryAjaxSetup',
                        value: function () {
                            var _this3 = this
                            typeof jQuery.ajax != 'undefined' &&
                                jQuery.ajaxPrefilter(function (
                                    options,
                                    originalOptions,
                                    xhr,
                                ) {
                                    _this3.socketId() &&
                                        xhr.setRequestHeader(
                                            'X-Socket-Id',
                                            _this3.socketId(),
                                        )
                                })
                        },
                    },
                    {
                        key: 'registerTurboRequestInterceptor',
                        value: function () {
                            var _this4 = this
                            document.addEventListener(
                                'turbo:before-fetch-request',
                                function (event) {
                                    event.detail.fetchOptions.headers[
                                        'X-Socket-Id'
                                    ] = _this4.socketId()
                                },
                            )
                        },
                    },
                ]),
                Echo2
            )
        })()
    var import_pusher = __toModule(require_pusher())
    window.EchoFactory = Echo
    window.Pusher = import_pusher.default
})()
/*!
 * Pusher JavaScript Library v7.6.0
 * https://pusher.com/
 *
 * Copyright 2020, Pusher
 * Released under the MIT licence.
 */
