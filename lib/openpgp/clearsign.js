// Generated by IcedCoffeeScript 1.7.0-a
(function() {
  var C, ClearSigner, CreationTime, Issuer, Literal, SHA512, SRF, Signature, Verifier, WordArray, bufferify, clearsign_header, clearsign_to_sign, dash_escape, dash_unescape_line, dash_unescape_lines, encode, export_key_pgp, get_cipher, hashmod, iced, input_to_cleartext, input_to_cleartext_display, input_to_cleartext_sign, konst, make_esc, scrub_buffer, triplesec, unix_time, whitespace_strip, __iced_k, __iced_k_noop, _ref, _ref1, _ref2;

  iced = require('iced-coffee-script/lib/coffee-script/iced').runtime;
  __iced_k = __iced_k_noop = function() {};

  make_esc = require('iced-error').make_esc;

  _ref = require('./packet/signature'), Signature = _ref.Signature, CreationTime = _ref.CreationTime, Issuer = _ref.Issuer;

  _ref1 = require('../util'), bufferify = _ref1.bufferify, unix_time = _ref1.unix_time;

  SRF = require('../rand').SRF;

  triplesec = require('triplesec');

  _ref2 = require('../symmetric'), export_key_pgp = _ref2.export_key_pgp, get_cipher = _ref2.get_cipher;

  scrub_buffer = triplesec.util.scrub_buffer;

  WordArray = triplesec.WordArray;

  konst = require('../const');

  C = konst.openpgp;

  hashmod = require('../hash');

  SHA512 = hashmod.SHA512;

  encode = require('./armor').encode;

  clearsign_header = require('pgp-utils').armor.clearsign_header;

  Literal = require("./packet/literal").Literal;

  exports.input_to_cleartext = input_to_cleartext = function(raw) {
    var lines, ret;
    lines = raw.split(/\n/);
    ret = {
      show: bufferify(input_to_cleartext_display(lines)),
      sign: bufferify(input_to_cleartext_sign(lines))
    };
    return ret;
  };

  exports.dash_escape = dash_escape = function(line) {
    if (line.length >= 1 && line[0] === '-') {
      return "- " + line.slice(1);
    } else {
      return line;
    }
  };

  exports.dash_unescape_line = dash_unescape_line = function(line) {
    var m, out, warn;
    warn = false;
    out = (m = line.match(/^-( )?(.*?)$/)) != null ? (warn = true, m[2]) : line;
    return [out, warn];
  };

  exports.dash_unescape_lines = dash_unescape_lines = function(lines, warnings) {
    var i, l, line, ret, warn;
    if (warnings == null) {
      warnings = null;
    }
    ret = (function() {
      var _i, _len, _ref3, _results;
      _results = [];
      for (i = _i = 0, _len = lines.length; _i < _len; i = ++_i) {
        line = lines[i];
        _ref3 = dash_unescape_line(line), l = _ref3[0], warn = _ref3[1];
        if (warn) {
          if (warnings != null) {
            warnings.push("Bad dash-encoding on line " + (i + 1));
          }
        }
        _results.push(l);
      }
      return _results;
    })();
    return ret;
  };

  exports.input_to_cleartext_display = input_to_cleartext_display = function(lines) {
    var line, out;
    out = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        _results.push(dash_escape(line));
      }
      return _results;
    })();
    if (lines.length === 0 || lines.slice(-1)[0] !== '') {
      out.push('');
    }
    return out.join("\n");
  };

  exports.clearsign_to_sign = clearsign_to_sign = function(lines, warnings) {
    lines = dash_unescape_lines(lines, warnings);
    return input_to_cleartext_sign(lines);
  };

  exports.input_to_cleartext_sign = input_to_cleartext_sign = function(lines) {
    var line, num_trailing_newlines, t, tmp, _i;
    tmp = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        _results.push(whitespace_strip(line));
      }
      return _results;
    })();
    num_trailing_newlines = 0;
    for (_i = tmp.length - 1; _i >= 0; _i += -1) {
      t = tmp[_i];
      if (t === '') {
        num_trailing_newlines++;
      } else {
        break;
      }
    }
    if (num_trailing_newlines > 0) {
      tmp.pop();
    }
    return tmp.join("\r\n");
  };

  exports.whitespace_strip = whitespace_strip = function(line) {
    var m;
    line = line.replace(/\r/g, '');
    if ((m = line.match(/^(.*?)([ \t]*)$/))) {
      return m[1];
    } else {
      return line;
    }
  };

  ClearSigner = (function() {
    function ClearSigner(_arg) {
      this.msg = _arg.msg, this.signing_key = _arg.signing_key;
    }

    ClearSigner.prototype._fix_msg = function(cb) {
      this._cleartext = input_to_cleartext(this.msg.toString('utf8'));
      return cb(null);
    };

    ClearSigner.prototype._sign_msg = function(cb) {
      var err, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      this.sig = new Signature({
        sig_type: C.sig_types.canonical_text,
        key: this.signing_key.key,
        hashed_subpackets: [new CreationTime(unix_time())],
        unhashed_subpackets: [new Issuer(this.signing_key.get_key_id())]
      });
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/home/max/src/kbpgp/src/openpgp/clearsign.iced",
            funcname: "ClearSigner._sign_msg"
          });
          _this.sig.write(_this._cleartext.sign, __iced_deferrals.defer({
            assign_fn: (function(__slot_1) {
              return function() {
                err = arguments[0];
                return __slot_1._sig_output = arguments[1];
              };
            })(_this),
            lineno: 115
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          return cb(err, _this._sig_output);
        };
      })(this));
    };

    ClearSigner.prototype.scrub = function() {};

    ClearSigner.prototype.hasher_name = function() {
      return this.sig.hasher.algname;
    };

    ClearSigner.prototype._encode = function(cb) {
      var body, hdr;
      hdr = clearsign_header(C, this._cleartext.show, this.hasher_name());
      body = encode(C.message_types.signature, this._sig_output);
      return cb(null, hdr + body);
    };

    ClearSigner.prototype.run = function(cb) {
      var encoded, esc, signature, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      esc = make_esc(cb, "ClearSigner::run");
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/home/max/src/kbpgp/src/openpgp/clearsign.iced",
            funcname: "ClearSigner.run"
          });
          _this._fix_msg(esc(__iced_deferrals.defer({
            lineno: 137
          })));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/home/max/src/kbpgp/src/openpgp/clearsign.iced",
              funcname: "ClearSigner.run"
            });
            _this._sign_msg(esc(__iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  return signature = arguments[0];
                };
              })(),
              lineno: 138
            })));
            __iced_deferrals._fulfill();
          })(function() {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/home/max/src/kbpgp/src/openpgp/clearsign.iced",
                funcname: "ClearSigner.run"
              });
              _this._encode(esc(__iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    return encoded = arguments[0];
                  };
                })(),
                lineno: 139
              })));
              __iced_deferrals._fulfill();
            })(function() {
              return cb(null, encoded, signature);
            });
          });
        };
      })(this));
    };

    return ClearSigner;

  })();

  Verifier = (function() {
    function Verifier(_arg) {
      this.packets = _arg.packets, this.clearsign = _arg.clearsign, this.key_fetch = _arg.key_fetch;
    }

    Verifier.prototype._find_signature = function(cb) {
      var err, n;
      err = (n = this.packets.length) !== 1 ? new Error("Expected one signature packet; got " + n) : (this._sig = this.packets[0]).tag !== C.packet_tags.signature ? new Error("Expected a signature packet; but got type=" + this.packets[0].tag) : null;
      return cb(null);
    };

    Verifier.prototype._reformat_text = function(cb) {
      var data;
      data = bufferify(clearsign_to_sign(this.clearsign.lines));
      this._literal = new Literal({
        data: data,
        format: C.literal_formats.utf8,
        date: unix_time()
      });
      return cb(null);
    };

    Verifier.prototype._fetch_key = function(cb) {
      var err, obj, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/home/max/src/kbpgp/src/openpgp/clearsign.iced",
            funcname: "Verifier._fetch_key"
          });
          _this.key_fetch.fetch([_this._sig.get_key_id()], konst.ops.verify, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return obj = arguments[1];
              };
            })(),
            lineno: 180
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          if (typeof err === "undefined" || err === null) {
            _this._sig.key = obj.key;
            _this._sig.hasher = hashmod[_this.clearsign.headers.hash];
            _this._sig.keyfetch_obj = obj;
          }
          return cb(err);
        };
      })(this));
    };

    Verifier.prototype._verify = function(cb) {
      var err, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/home/max/src/kbpgp/src/openpgp/clearsign.iced",
            funcname: "Verifier._verify"
          });
          _this._sig.verify([_this._literal], __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return err = arguments[0];
              };
            })(),
            lineno: 190
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          return cb(err);
        };
      })(this));
    };

    Verifier.prototype.run = function(cb) {
      var esc, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      esc = make_esc(cb, "Verifier::run");
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/home/max/src/kbpgp/src/openpgp/clearsign.iced",
            funcname: "Verifier.run"
          });
          _this._find_signature(esc(__iced_deferrals.defer({
            lineno: 197
          })));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/home/max/src/kbpgp/src/openpgp/clearsign.iced",
              funcname: "Verifier.run"
            });
            _this._reformat_text(esc(__iced_deferrals.defer({
              lineno: 198
            })));
            __iced_deferrals._fulfill();
          })(function() {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/home/max/src/kbpgp/src/openpgp/clearsign.iced",
                funcname: "Verifier.run"
              });
              _this._fetch_key(esc(__iced_deferrals.defer({
                lineno: 199
              })));
              __iced_deferrals._fulfill();
            })(function() {
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "/home/max/src/kbpgp/src/openpgp/clearsign.iced",
                  funcname: "Verifier.run"
                });
                _this._verify(esc(__iced_deferrals.defer({
                  lineno: 200
                })));
                __iced_deferrals._fulfill();
              })(function() {
                return cb(null, _this._literal);
              });
            });
          });
        };
      })(this));
    };

    return Verifier;

  })();

  exports.sign = function(_arg, cb) {
    var b, encoded, err, msg, signature, signing_key, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    msg = _arg.msg, signing_key = _arg.signing_key;
    b = new ClearSigner({
      msg: msg,
      signing_key: signing_key
    });
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/home/max/src/kbpgp/src/openpgp/clearsign.iced",
          funcname: "sign"
        });
        b.run(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              encoded = arguments[1];
              return signature = arguments[2];
            };
          })(),
          lineno: 211
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        b.scrub();
        return cb(err, encoded, signature);
      };
    })(this));
  };

  exports.verify = function(_arg, cb) {
    var clearsign, err, key_fetch, literal, packets, v, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    packets = _arg.packets, clearsign = _arg.clearsign, key_fetch = _arg.key_fetch;
    v = new Verifier({
      packets: packets,
      clearsign: clearsign,
      key_fetch: key_fetch
    });
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/home/max/src/kbpgp/src/openpgp/clearsign.iced",
          funcname: "verify"
        });
        v.run(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return literal = arguments[1];
            };
          })(),
          lineno: 219
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        return cb(err, literal);
      };
    })(this));
  };

}).call(this);