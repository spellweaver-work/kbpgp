// Generated by IcedCoffeeScript 108.0.11
(function() {
  var BigInteger, bn_from_left_n_bits, buffer_shift_right, buffer_to_ui8a, mpi_byte_length, mpi_from_buffer, mpi_to_padded_octets, nbi, nbits, nbs, nbv, toMPI, _ref;

  _ref = require('bn'), nbv = _ref.nbv, nbi = _ref.nbi, BigInteger = _ref.BigInteger, nbits = _ref.nbits;

  buffer_to_ui8a = require('./util').buffer_to_ui8a;

  nbs = function(s, base) {
    var r;
    if (base == null) {
      base = 10;
    }
    r = nbi();
    return r.fromString(s, base);
  };

  mpi_byte_length = function(bn) {
    return bn.toByteArray().length;
  };

  toMPI = function(bn) {
    var ba, hdr, size;
    ba = bn.toByteArray();
    size = (ba.length - 1) * 8 + nbits(ba[0]);
    hdr = Buffer.alloc(2);
    hdr.writeUInt16BE(size, 0);
    return Buffer.concat([hdr, Buffer.from(ba)]);
  };

  mpi_from_buffer = function(raw) {
    var err, hdr, i, n_bits, n_bytes;
    err = i = null;
    if (raw.length < 2) {
      err = new Error("need at least 2 bytes; got " + raw.length);
    } else {
      hdr = Buffer.from(raw.slice(0, 2));
      raw = raw.slice(2);
      n_bits = hdr.readUInt16BE(0);
      n_bytes = Math.ceil(n_bits / 8);
      if (raw.length < n_bytes) {
        err = new Error("MPI said " + n_bytes + " bytes but only got " + raw.length);
      } else {
        i = nbi().fromBuffer(raw.slice(0, n_bytes));
        raw = raw.slice(n_bytes);
      }
    }
    return [err, i, raw, n_bytes + 2];
  };

  mpi_to_padded_octets = function(bn, base) {
    var ba, diff, n, pad;
    n = base.mpi_byte_length();
    ba = bn.toByteArray();
    diff = n - ba.length;
    pad = Buffer.alloc(diff);
    return Buffer.concat([pad, Buffer.from(ba)]);
  };

  buffer_shift_right = function(buf, nbits) {
    var c, i, l, mask, nbytes, nxt, rem, _i, _ref1;
    nbytes = nbits >> 3;
    rem = nbits % 8;
    buf = buf.slice(0, buf.length - nbytes);
    l = buf.length;
    mask = (1 << rem) - 1;
    for (i = _i = _ref1 = l - 1; _ref1 <= 0 ? _i <= 0 : _i >= 0; i = _ref1 <= 0 ? ++_i : --_i) {
      c = buf.readUInt8(i) >> rem;
      if (i > 0) {
        nxt = buf.readUInt8(i - 1) & mask;
        c |= nxt << (8 - rem);
      }
      buf.writeUInt8(c, i);
    }
    return buf;
  };

  bn_from_left_n_bits = function(raw, bits) {
    var buf, bytes, rem, ret;
    if (raw.length * 8 <= bits) {
      return nbi().fromBuffer(raw);
    } else {
      rem = bits % 8;
      bytes = (bits >> 3) + (rem ? 1 : 0);
      buf = raw.slice(0, bytes);
      ret = nbi().fromBuffer(buf);
      if (rem > 0) {
        ret = ret.shiftRight(8 - rem);
      }
      return ret;
    }
  };

  exports.toMPI = toMPI;

  exports.nbs = nbs;

  exports.mpi_from_buffer = mpi_from_buffer;

  exports.mpi_to_padded_octets = mpi_to_padded_octets;

  exports.buffer_shift_right = buffer_shift_right;

  exports.bn_from_left_n_bits = bn_from_left_n_bits;

  BigInteger.prototype.to_mpi_buffer = function() {
    return toMPI(this);
  };

  BigInteger.prototype.mpi_byte_length = function() {
    return mpi_byte_length(this);
  };

  BigInteger.prototype.to_padded_octets = function(base) {
    return mpi_to_padded_octets(this, base);
  };

  exports.BigInteger = BigInteger;

  exports.nbi = nbi;

  exports.nbv = nbv;

  exports.nbits = nbits;

}).call(this);
