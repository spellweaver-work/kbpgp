// Generated by IcedCoffeeScript 1.7.1-c
(function() {
  var IV, WordArray, split64, wrap;

  WordArray = require('triplesec').WordArray;

  IV = WordArray.from_hex("A6A6A6A6A6A6A6A6");

  split64 = function(wa) {
    return wa.split(wa.words.length >> 1);
  };

  exports.wrap = wrap = function(_arg) {
    var A, AES, B, C, K, P, R, a, b, cipher, i, j, key, klass, n, plaintext, r, t, _i, _j, _k, _len, _len1;
    plaintext = _arg.plaintext, key = _arg.key, cipher = _arg.cipher;
    P = split64(WordArray.from_buffer(plaintext));
    K = WordArray.from_buffer(key);
    klass = cipher.klass;
    AES = new klass(K);
    if ((a = cipher.key_size) !== (b = key.length)) {
      throw new Error("Bad key, needed " + a + " bytes, but got " + b);
    }
    n = P.length;
    A = IV;
    R = P;
    t = new WordArray([0, 0]);
    for (j = _i = 0; _i < 6; j = ++_i) {
      for (i = _j = 0, _len = R.length; _j < _len; i = ++_j) {
        r = R[i];
        t.words[1]++;
        B = A.clone().concat(r);
        AES.encryptBlock(B.words);
        A = B.slice(0, 2);
        R[i] = B.slice(2, 4);
        A.xor(t, {});
      }
    }
    C = A;
    for (_k = 0, _len1 = R.length; _k < _len1; _k++) {
      r = R[_k];
      C.concat(r);
    }
    return C.to_buffer();
  };

}).call(this);