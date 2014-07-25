// This program was compiled from OCaml by js_of_ocaml 1.4
function caml_raise_with_arg (tag, arg) { throw [0, tag, arg]; }
function caml_raise_with_string (tag, msg) {
  caml_raise_with_arg (tag, new MlWrappedString (msg));
}
function caml_invalid_argument (msg) {
  caml_raise_with_string(caml_global_data[4], msg);
}
function caml_array_bound_error () {
  caml_invalid_argument("index out of bounds");
}
function caml_str_repeat(n, s) {
  if (!n) { return ""; }
  if (n & 1) { return caml_str_repeat(n - 1, s) + s; }
  var r = caml_str_repeat(n >> 1, s);
  return r + r;
}
function MlString(param) {
  if (param != null) {
    this.bytes = this.fullBytes = param;
    this.last = this.len = param.length;
  }
}
MlString.prototype = {
  string:null,
  bytes:null,
  fullBytes:null,
  array:null,
  len:null,
  last:0,
  toJsString:function() {
    return this.string = decodeURIComponent (escape(this.getFullBytes()));
  },
  toBytes:function() {
    if (this.string != null)
      var b = unescape (encodeURIComponent (this.string));
    else {
      var b = "", a = this.array, l = a.length;
      for (var i = 0; i < l; i ++) b += String.fromCharCode (a[i]);
    }
    this.bytes = this.fullBytes = b;
    this.last = this.len = b.length;
    return b;
  },
  getBytes:function() {
    var b = this.bytes;
    if (b == null) b = this.toBytes();
    return b;
  },
  getFullBytes:function() {
    var b = this.fullBytes;
    if (b !== null) return b;
    b = this.bytes;
    if (b == null) b = this.toBytes ();
    if (this.last < this.len) {
      this.bytes = (b += caml_str_repeat(this.len - this.last, '\0'));
      this.last = this.len;
    }
    this.fullBytes = b;
    return b;
  },
  toArray:function() {
    var b = this.bytes;
    if (b == null) b = this.toBytes ();
    var a = [], l = this.last;
    for (var i = 0; i < l; i++) a[i] = b.charCodeAt(i);
    for (l = this.len; i < l; i++) a[i] = 0;
    this.string = this.bytes = this.fullBytes = null;
    this.last = this.len;
    this.array = a;
    return a;
  },
  getArray:function() {
    var a = this.array;
    if (!a) a = this.toArray();
    return a;
  },
  getLen:function() {
    var len = this.len;
    if (len !== null) return len;
    this.toBytes();
    return this.len;
  },
  toString:function() { var s = this.string; return s?s:this.toJsString(); },
  valueOf:function() { var s = this.string; return s?s:this.toJsString(); },
  blitToArray:function(i1, a2, i2, l) {
    var a1 = this.array;
    if (a1) {
      if (i2 <= i1) {
        for (var i = 0; i < l; i++) a2[i2 + i] = a1[i1 + i];
      } else {
        for (var i = l - 1; i >= 0; i--) a2[i2 + i] = a1[i1 + i];
      }
    } else {
      var b = this.bytes;
      if (b == null) b = this.toBytes();
      var l1 = this.last - i1;
      if (l <= l1)
        for (var i = 0; i < l; i++) a2 [i2 + i] = b.charCodeAt(i1 + i);
      else {
        for (var i = 0; i < l1; i++) a2 [i2 + i] = b.charCodeAt(i1 + i);
        for (; i < l; i++) a2 [i2 + i] = 0;
      }
    }
  },
  get:function (i) {
    var a = this.array;
    if (a) return a[i];
    var b = this.bytes;
    if (b == null) b = this.toBytes();
    return (i<this.last)?b.charCodeAt(i):0;
  },
  safeGet:function (i) {
    if (this.len == null) this.toBytes();
    if ((i < 0) || (i >= this.len)) caml_array_bound_error ();
    return this.get(i);
  },
  set:function (i, c) {
    var a = this.array;
    if (!a) {
      if (this.last == i) {
        this.bytes += String.fromCharCode (c & 0xff);
        this.last ++;
        return 0;
      }
      a = this.toArray();
    } else if (this.bytes != null) {
      this.bytes = this.fullBytes = this.string = null;
    }
    a[i] = c & 0xff;
    return 0;
  },
  safeSet:function (i, c) {
    if (this.len == null) this.toBytes ();
    if ((i < 0) || (i >= this.len)) caml_array_bound_error ();
    this.set(i, c);
  },
  fill:function (ofs, len, c) {
    if (ofs >= this.last && this.last && c == 0) return;
    var a = this.array;
    if (!a) a = this.toArray();
    else if (this.bytes != null) {
      this.bytes = this.fullBytes = this.string = null;
    }
    var l = ofs + len;
    for (var i = ofs; i < l; i++) a[i] = c;
  },
  compare:function (s2) {
    if (this.string != null && s2.string != null) {
      if (this.string < s2.string) return -1;
      if (this.string > s2.string) return 1;
      return 0;
    }
    var b1 = this.getFullBytes ();
    var b2 = s2.getFullBytes ();
    if (b1 < b2) return -1;
    if (b1 > b2) return 1;
    return 0;
  },
  equal:function (s2) {
    if (this.string != null && s2.string != null)
      return this.string == s2.string;
    return this.getFullBytes () == s2.getFullBytes ();
  },
  lessThan:function (s2) {
    if (this.string != null && s2.string != null)
      return this.string < s2.string;
    return this.getFullBytes () < s2.getFullBytes ();
  },
  lessEqual:function (s2) {
    if (this.string != null && s2.string != null)
      return this.string <= s2.string;
    return this.getFullBytes () <= s2.getFullBytes ();
  }
}
function MlWrappedString (s) { this.string = s; }
MlWrappedString.prototype = new MlString();
function MlMakeString (l) { this.bytes = ""; this.len = l; }
MlMakeString.prototype = new MlString ();
function caml_array_blit(a1, i1, a2, i2, len) {
  if (i2 <= i1) {
    for (var j = 1; j <= len; j++) a2[i2 + j] = a1[i1 + j];
  } else {
    for (var j = len; j >= 1; j--) a2[i2 + j] = a1[i1 + j];
  }
}
function caml_array_get (array, index) {
  if ((index < 0) || (index >= array.length - 1)) caml_array_bound_error();
  return array[index+1];
}
function caml_array_set (array, index, newval) {
  if ((index < 0) || (index >= array.length - 1)) caml_array_bound_error();
  array[index+1]=newval; return 0;
}
function caml_blit_string(s1, i1, s2, i2, len) {
  if (len === 0) return;
  if (i2 === s2.last && s2.bytes != null) {
    var b = s1.bytes;
    if (b == null) b = s1.toBytes ();
    if (i1 > 0 || s1.last > len) b = b.slice(i1, i1 + len);
    s2.bytes += b;
    s2.last += b.length;
    return;
  }
  var a = s2.array;
  if (!a) a = s2.toArray(); else { s2.bytes = s2.string = null; }
  s1.blitToArray (i1, a, i2, len);
}
function caml_call_gen(f, args) {
  if(f.fun)
    return caml_call_gen(f.fun, args);
  var n = f.length;
  var d = n - args.length;
  if (d == 0)
    return f.apply(null, args);
  else if (d < 0)
    return caml_call_gen(f.apply(null, args.slice(0,n)), args.slice(n));
  else
    return function (x){ return caml_call_gen(f, args.concat([x])); };
}
function caml_classify_float (x) {
  if (isFinite (x)) {
    if (Math.abs(x) >= 2.2250738585072014e-308) return 0;
    if (x != 0) return 1;
    return 2;
  }
  return isNaN(x)?4:3;
}
function caml_int64_compare(x,y) {
  var x3 = x[3] << 16;
  var y3 = y[3] << 16;
  if (x3 > y3) return 1;
  if (x3 < y3) return -1;
  if (x[2] > y[2]) return 1;
  if (x[2] < y[2]) return -1;
  if (x[1] > y[1]) return 1;
  if (x[1] < y[1]) return -1;
  return 0;
}
function caml_int_compare (a, b) {
  if (a < b) return (-1); if (a == b) return 0; return 1;
}
function caml_compare_val (a, b, total) {
  var stack = [];
  for(;;) {
    if (!(total && a === b)) {
      if (a instanceof MlString) {
        if (b instanceof MlString) {
            if (a != b) {
		var x = a.compare(b);
		if (x != 0) return x;
	    }
        } else
          return 1;
      } else if (a instanceof Array && a[0] === (a[0]|0)) {
        var ta = a[0];
        if (ta === 250) {
          a = a[1];
          continue;
        } else if (b instanceof Array && b[0] === (b[0]|0)) {
          var tb = b[0];
          if (tb === 250) {
            b = b[1];
            continue;
          } else if (ta != tb) {
            return (ta < tb)?-1:1;
          } else {
            switch (ta) {
            case 248: {
		var x = caml_int_compare(a[2], b[2]);
		if (x != 0) return x;
		break;
	    }
            case 255: {
		var x = caml_int64_compare(a, b);
		if (x != 0) return x;
		break;
	    }
            default:
              if (a.length != b.length) return (a.length < b.length)?-1:1;
              if (a.length > 1) stack.push(a, b, 1);
            }
          }
        } else
          return 1;
      } else if (b instanceof MlString ||
                 (b instanceof Array && b[0] === (b[0]|0))) {
        return -1;
      } else {
        if (a < b) return -1;
        if (a > b) return 1;
        if (total && a != b) {
          if (a == a) return 1;
          if (b == b) return -1;
        }
      }
    }
    if (stack.length == 0) return 0;
    var i = stack.pop();
    b = stack.pop();
    a = stack.pop();
    if (i + 1 < a.length) stack.push(a, b, i + 1);
    a = a[i];
    b = b[i];
  }
}
function caml_compare (a, b) { return caml_compare_val (a, b, true); }
function caml_convert_raw_backtrace () {
  caml_invalid_argument
    ("Primitive 'caml_convert_raw_backtrace' not implemented");
}
function caml_create_string(len) {
  if (len < 0) caml_invalid_argument("String.create");
  return new MlMakeString(len);
}
function caml_fill_string(s, i, l, c) { s.fill (i, l, c); }
function caml_parse_format (fmt) {
  fmt = fmt.toString ();
  var len = fmt.length;
  if (len > 31) caml_invalid_argument("format_int: format too long");
  var f =
    { justify:'+', signstyle:'-', filler:' ', alternate:false,
      base:0, signedconv:false, width:0, uppercase:false,
      sign:1, prec:-1, conv:'f' };
  for (var i = 0; i < len; i++) {
    var c = fmt.charAt(i);
    switch (c) {
    case '-':
      f.justify = '-'; break;
    case '+': case ' ':
      f.signstyle = c; break;
    case '0':
      f.filler = '0'; break;
    case '#':
      f.alternate = true; break;
    case '1': case '2': case '3': case '4': case '5':
    case '6': case '7': case '8': case '9':
      f.width = 0;
      while (c=fmt.charCodeAt(i) - 48, c >= 0 && c <= 9) {
        f.width = f.width * 10 + c; i++
      }
      i--;
     break;
    case '.':
      f.prec = 0;
      i++;
      while (c=fmt.charCodeAt(i) - 48, c >= 0 && c <= 9) {
        f.prec = f.prec * 10 + c; i++
      }
      i--;
    case 'd': case 'i':
      f.signedconv = true; /* fallthrough */
    case 'u':
      f.base = 10; break;
    case 'x':
      f.base = 16; break;
    case 'X':
      f.base = 16; f.uppercase = true; break;
    case 'o':
      f.base = 8; break;
    case 'e': case 'f': case 'g':
      f.signedconv = true; f.conv = c; break;
    case 'E': case 'F': case 'G':
      f.signedconv = true; f.uppercase = true;
      f.conv = c.toLowerCase (); break;
    }
  }
  return f;
}
function caml_finish_formatting(f, rawbuffer) {
  if (f.uppercase) rawbuffer = rawbuffer.toUpperCase();
  var len = rawbuffer.length;
  if (f.signedconv && (f.sign < 0 || f.signstyle != '-')) len++;
  if (f.alternate) {
    if (f.base == 8) len += 1;
    if (f.base == 16) len += 2;
  }
  var buffer = "";
  if (f.justify == '+' && f.filler == ' ')
    for (var i = len; i < f.width; i++) buffer += ' ';
  if (f.signedconv) {
    if (f.sign < 0) buffer += '-';
    else if (f.signstyle != '-') buffer += f.signstyle;
  }
  if (f.alternate && f.base == 8) buffer += '0';
  if (f.alternate && f.base == 16) buffer += "0x";
  if (f.justify == '+' && f.filler == '0')
    for (var i = len; i < f.width; i++) buffer += '0';
  buffer += rawbuffer;
  if (f.justify == '-')
    for (var i = len; i < f.width; i++) buffer += ' ';
  return new MlWrappedString (buffer);
}
function caml_format_float (fmt, x) {
  var s, f = caml_parse_format(fmt);
  var prec = (f.prec < 0)?6:f.prec;
  if (x < 0) { f.sign = -1; x = -x; }
  if (isNaN(x)) { s = "nan"; f.filler = ' '; }
  else if (!isFinite(x)) { s = "inf"; f.filler = ' '; }
  else
    switch (f.conv) {
    case 'e':
      var s = x.toExponential(prec);
      var i = s.length;
      if (s.charAt(i - 3) == 'e')
        s = s.slice (0, i - 1) + '0' + s.slice (i - 1);
      break;
    case 'f':
      s = x.toFixed(prec); break;
    case 'g':
      prec = prec?prec:1;
      s = x.toExponential(prec - 1);
      var j = s.indexOf('e');
      var exp = +s.slice(j + 1);
      if (exp < -4 || x.toFixed(0).length > prec) {
        var i = j - 1; while (s.charAt(i) == '0') i--;
        if (s.charAt(i) == '.') i--;
        s = s.slice(0, i + 1) + s.slice(j);
        i = s.length;
        if (s.charAt(i - 3) == 'e')
          s = s.slice (0, i - 1) + '0' + s.slice (i - 1);
        break;
      } else {
        var p = prec;
        if (exp < 0) { p -= exp + 1; s = x.toFixed(p); }
        else while (s = x.toFixed(p), s.length > prec + 1) p--;
        if (p) {
          var i = s.length - 1; while (s.charAt(i) == '0') i--;
          if (s.charAt(i) == '.') i--;
          s = s.slice(0, i + 1);
        }
      }
      break;
    }
  return caml_finish_formatting(f, s);
}
function caml_format_int(fmt, i) {
  if (fmt.toString() == "%d") return new MlWrappedString(""+i);
  var f = caml_parse_format(fmt);
  if (i < 0) { if (f.signedconv) { f.sign = -1; i = -i; } else i >>>= 0; }
  var s = i.toString(f.base);
  if (f.prec >= 0) {
    f.filler = ' ';
    var n = f.prec - s.length;
    if (n > 0) s = caml_str_repeat (n, '0') + s;
  }
  return caml_finish_formatting(f, s);
}
function caml_get_exception_raw_backtrace () {
  caml_invalid_argument
    ("Primitive 'caml_get_exception_raw_backtrace' not implemented");
}
function caml_greaterequal (x, y) { return +(caml_compare(x,y,false) >= 0); }
function caml_int64_is_negative(x) {
  return (x[3] << 16) < 0;
}
function caml_int64_neg (x) {
  var y1 = - x[1];
  var y2 = - x[2] + (y1 >> 24);
  var y3 = - x[3] + (y2 >> 24);
  return [255, y1 & 0xffffff, y2 & 0xffffff, y3 & 0xffff];
}
function caml_int64_of_int32 (x) {
  return [255, x & 0xffffff, (x >> 24) & 0xffffff, (x >> 31) & 0xffff]
}
function caml_int64_ucompare(x,y) {
  if (x[3] > y[3]) return 1;
  if (x[3] < y[3]) return -1;
  if (x[2] > y[2]) return 1;
  if (x[2] < y[2]) return -1;
  if (x[1] > y[1]) return 1;
  if (x[1] < y[1]) return -1;
  return 0;
}
function caml_int64_lsl1 (x) {
  x[3] = (x[3] << 1) | (x[2] >> 23);
  x[2] = ((x[2] << 1) | (x[1] >> 23)) & 0xffffff;
  x[1] = (x[1] << 1) & 0xffffff;
}
function caml_int64_lsr1 (x) {
  x[1] = ((x[1] >>> 1) | (x[2] << 23)) & 0xffffff;
  x[2] = ((x[2] >>> 1) | (x[3] << 23)) & 0xffffff;
  x[3] = x[3] >>> 1;
}
function caml_int64_sub (x, y) {
  var z1 = x[1] - y[1];
  var z2 = x[2] - y[2] + (z1 >> 24);
  var z3 = x[3] - y[3] + (z2 >> 24);
  return [255, z1 & 0xffffff, z2 & 0xffffff, z3 & 0xffff];
}
function caml_int64_udivmod (x, y) {
  var offset = 0;
  var modulus = x.slice ();
  var divisor = y.slice ();
  var quotient = [255, 0, 0, 0];
  while (caml_int64_ucompare (modulus, divisor) > 0) {
    offset++;
    caml_int64_lsl1 (divisor);
  }
  while (offset >= 0) {
    offset --;
    caml_int64_lsl1 (quotient);
    if (caml_int64_ucompare (modulus, divisor) >= 0) {
      quotient[1] ++;
      modulus = caml_int64_sub (modulus, divisor);
    }
    caml_int64_lsr1 (divisor);
  }
  return [0,quotient, modulus];
}
function caml_int64_to_int32 (x) {
  return x[1] | (x[2] << 24);
}
function caml_int64_is_zero(x) {
  return (x[3]|x[2]|x[1]) == 0;
}
function caml_int64_format (fmt, x) {
  var f = caml_parse_format(fmt);
  if (f.signedconv && caml_int64_is_negative(x)) {
    f.sign = -1; x = caml_int64_neg(x);
  }
  var buffer = "";
  var wbase = caml_int64_of_int32(f.base);
  var cvtbl = "0123456789abcdef";
  do {
    var p = caml_int64_udivmod(x, wbase);
    x = p[1];
    buffer = cvtbl.charAt(caml_int64_to_int32(p[2])) + buffer;
  } while (! caml_int64_is_zero(x));
  if (f.prec >= 0) {
    f.filler = ' ';
    var n = f.prec - buffer.length;
    if (n > 0) buffer = caml_str_repeat (n, '0') + buffer;
  }
  return caml_finish_formatting(f, buffer);
}
function caml_parse_sign_and_base (s) {
  var i = 0, base = 10, sign = s.get(0) == 45?(i++,-1):1;
  if (s.get(i) == 48)
    switch (s.get(i + 1)) {
    case 120: case 88: base = 16; i += 2; break;
    case 111: case 79: base =  8; i += 2; break;
    case  98: case 66: base =  2; i += 2; break;
    }
  return [i, sign, base];
}
function caml_parse_digit(c) {
  if (c >= 48 && c <= 57)  return c - 48;
  if (c >= 65 && c <= 90)  return c - 55;
  if (c >= 97 && c <= 122) return c - 87;
  return -1;
}
var caml_global_data = [0];
function caml_failwith (msg) {
  caml_raise_with_string(caml_global_data[3], msg);
}
function caml_int_of_string (s) {
  var r = caml_parse_sign_and_base (s);
  var i = r[0], sign = r[1], base = r[2];
  var threshold = -1 >>> 0;
  var c = s.get(i);
  var d = caml_parse_digit(c);
  if (d < 0 || d >= base) caml_failwith("int_of_string");
  var res = d;
  for (;;) {
    i++;
    c = s.get(i);
    if (c == 95) continue;
    d = caml_parse_digit(c);
    if (d < 0 || d >= base) break;
    res = base * res + d;
    if (res > threshold) caml_failwith("int_of_string");
  }
  if (i != s.getLen()) caml_failwith("int_of_string");
  res = sign * res;
  if ((res | 0) != res) caml_failwith("int_of_string");
  return res;
}
function caml_is_printable(c) { return +(c > 31 && c < 127); }
function caml_js_get_console () {
  var c = this.console?this.console:{};
  var m = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
           "trace", "group", "groupCollapsed", "groupEnd", "time", "timeEnd"];
  function f () {}
  for (var i = 0; i < m.length; i++) if (!c[m[i]]) c[m[i]]=f;
  return c;
}
var caml_js_regexps = { amp:/&/g, lt:/</g, quot:/\"/g, all:/[&<\"]/ };
function caml_js_html_escape (s) {
  if (!caml_js_regexps.all.test(s)) return s;
  return s.replace(caml_js_regexps.amp, "&amp;")
          .replace(caml_js_regexps.lt, "&lt;")
          .replace(caml_js_regexps.quot, "&quot;");
}
function caml_js_wrap_callback(f) {
  var toArray = Array.prototype.slice;
  return function () {
    var args = (arguments.length > 0)?toArray.call (arguments):[undefined];
    return caml_call_gen(f, args);
  }
}
function caml_lex_array(s) {
  s = s.getFullBytes();
  var a = [], l = s.length / 2;
  for (var i = 0; i < l; i++)
    a[i] = (s.charCodeAt(2 * i) | (s.charCodeAt(2 * i + 1) << 8)) << 16 >> 16;
  return a;
}
function caml_lex_engine(tbl, start_state, lexbuf) {
  var lex_buffer = 2;
  var lex_buffer_len = 3;
  var lex_start_pos = 5;
  var lex_curr_pos = 6;
  var lex_last_pos = 7;
  var lex_last_action = 8;
  var lex_eof_reached = 9;
  var lex_base = 1;
  var lex_backtrk = 2;
  var lex_default = 3;
  var lex_trans = 4;
  var lex_check = 5;
  if (!tbl.lex_default) {
    tbl.lex_base =    caml_lex_array (tbl[lex_base]);
    tbl.lex_backtrk = caml_lex_array (tbl[lex_backtrk]);
    tbl.lex_check =   caml_lex_array (tbl[lex_check]);
    tbl.lex_trans =   caml_lex_array (tbl[lex_trans]);
    tbl.lex_default = caml_lex_array (tbl[lex_default]);
  }
  var c, state = start_state;
  var buffer = lexbuf[lex_buffer].getArray();
  if (state >= 0) {
    lexbuf[lex_last_pos] = lexbuf[lex_start_pos] = lexbuf[lex_curr_pos];
    lexbuf[lex_last_action] = -1;
  } else {
    state = -state - 1;
  }
  for(;;) {
    var base = tbl.lex_base[state];
    if (base < 0) return -base-1;
    var backtrk = tbl.lex_backtrk[state];
    if (backtrk >= 0) {
      lexbuf[lex_last_pos] = lexbuf[lex_curr_pos];
      lexbuf[lex_last_action] = backtrk;
    }
    if (lexbuf[lex_curr_pos] >= lexbuf[lex_buffer_len]){
      if (lexbuf[lex_eof_reached] == 0)
        return -state - 1;
      else
        c = 256;
    }else{
      c = buffer[lexbuf[lex_curr_pos]];
      lexbuf[lex_curr_pos] ++;
    }
    if (tbl.lex_check[base + c] == state)
      state = tbl.lex_trans[base + c];
    else
      state = tbl.lex_default[state];
    if (state < 0) {
      lexbuf[lex_curr_pos] = lexbuf[lex_last_pos];
      if (lexbuf[lex_last_action] == -1)
        caml_failwith("lexing: empty token");
      else
        return lexbuf[lex_last_action];
    }else{
      /* Erase the EOF condition only if the EOF pseudo-character was
         consumed by the automaton (i.e. there was no backtrack above)
       */
      if (c == 256) lexbuf[lex_eof_reached] = 0;
    }
  }
}
function caml_make_vect (len, init) {
  var b = [0]; for (var i = 1; i <= len; i++) b[i] = init; return b;
}
function caml_ml_flush () { return 0; }
function caml_ml_open_descriptor_out () { return 0; }
function caml_ml_out_channels_list () { return 0; }
function caml_ml_output () { return 0; }
function caml_mul(x,y) {
  return ((((x >> 16) * y) << 16) + (x & 0xffff) * y)|0;
}
function caml_notequal (x, y) { return +(caml_compare_val(x,y,false) != 0); }
function caml_obj_is_block (x) { return +(x instanceof Array); }
function caml_obj_tag (x) { return (x instanceof Array)?x[0]:1000; }
function caml_parse_engine(tables, env, cmd, arg)
{
  var ERRCODE = 256;
  var START = 0;
  var TOKEN_READ = 1;
  var STACKS_GROWN_1 = 2;
  var STACKS_GROWN_2 = 3;
  var SEMANTIC_ACTION_COMPUTED = 4;
  var ERROR_DETECTED = 5;
  var loop = 6;
  var testshift = 7;
  var shift = 8;
  var shift_recover = 9;
  var reduce = 10;
  var READ_TOKEN = 0;
  var RAISE_PARSE_ERROR = 1;
  var GROW_STACKS_1 = 2;
  var GROW_STACKS_2 = 3;
  var COMPUTE_SEMANTIC_ACTION = 4;
  var CALL_ERROR_FUNCTION = 5;
  var env_s_stack = 1;
  var env_v_stack = 2;
  var env_symb_start_stack = 3;
  var env_symb_end_stack = 4;
  var env_stacksize = 5;
  var env_stackbase = 6;
  var env_curr_char = 7;
  var env_lval = 8;
  var env_symb_start = 9;
  var env_symb_end = 10;
  var env_asp = 11;
  var env_rule_len = 12;
  var env_rule_number = 13;
  var env_sp = 14;
  var env_state = 15;
  var env_errflag = 16;
  var tbl_actions = 1;
  var tbl_transl_const = 2;
  var tbl_transl_block = 3;
  var tbl_lhs = 4;
  var tbl_len = 5;
  var tbl_defred = 6;
  var tbl_dgoto = 7;
  var tbl_sindex = 8;
  var tbl_rindex = 9;
  var tbl_gindex = 10;
  var tbl_tablesize = 11;
  var tbl_table = 12;
  var tbl_check = 13;
  var tbl_error_function = 14;
  var tbl_names_const = 15;
  var tbl_names_block = 16;
  if (!tables.dgoto) {
    tables.defred = caml_lex_array (tables[tbl_defred]);
    tables.sindex = caml_lex_array (tables[tbl_sindex]);
    tables.check  = caml_lex_array (tables[tbl_check]);
    tables.rindex = caml_lex_array (tables[tbl_rindex]);
    tables.table  = caml_lex_array (tables[tbl_table]);
    tables.len    = caml_lex_array (tables[tbl_len]);
    tables.lhs    = caml_lex_array (tables[tbl_lhs]);
    tables.gindex = caml_lex_array (tables[tbl_gindex]);
    tables.dgoto  = caml_lex_array (tables[tbl_dgoto]);
  }
  var res = 0, n, n1, n2, state1;
  var sp = env[env_sp];
  var state = env[env_state];
  var errflag = env[env_errflag];
  exit:for (;;) {
    switch(cmd) {
    case START:
      state = 0;
      errflag = 0;
    case loop:
      n = tables.defred[state];
      if (n != 0) { cmd = reduce; break; }
      if (env[env_curr_char] >= 0) { cmd = testshift; break; }
      res = READ_TOKEN;
      break exit;
    case TOKEN_READ:
      if (arg instanceof Array) {
        env[env_curr_char] = tables[tbl_transl_block][arg[0] + 1];
        env[env_lval] = arg[1];
      } else {
        env[env_curr_char] = tables[tbl_transl_const][arg + 1];
        env[env_lval] = 0;
      }
    case testshift:
      n1 = tables.sindex[state];
      n2 = n1 + env[env_curr_char];
      if (n1 != 0 && n2 >= 0 && n2 <= tables[tbl_tablesize] &&
          tables.check[n2] == env[env_curr_char]) {
        cmd = shift; break;
      }
      n1 = tables.rindex[state];
      n2 = n1 + env[env_curr_char];
      if (n1 != 0 && n2 >= 0 && n2 <= tables[tbl_tablesize] &&
          tables.check[n2] == env[env_curr_char]) {
        n = tables.table[n2];
        cmd = reduce; break;
      }
      if (errflag <= 0) {
        res = CALL_ERROR_FUNCTION;
        break exit;
      }
    case ERROR_DETECTED:
      if (errflag < 3) {
        errflag = 3;
        for (;;) {
          state1 = env[env_s_stack][sp + 1];
          n1 = tables.sindex[state1];
          n2 = n1 + ERRCODE;
          if (n1 != 0 && n2 >= 0 && n2 <= tables[tbl_tablesize] &&
              tables.check[n2] == ERRCODE) {
            cmd = shift_recover; break;
          } else {
            if (sp <= env[env_stackbase]) return RAISE_PARSE_ERROR;
            sp--;
          }
        }
      } else {
        if (env[env_curr_char] == 0) return RAISE_PARSE_ERROR;
        env[env_curr_char] = -1;
        cmd = loop; break;
      }
    case shift:
      env[env_curr_char] = -1;
      if (errflag > 0) errflag--;
    case shift_recover:
      state = tables.table[n2];
      sp++;
      if (sp >= env[env_stacksize]) {
        res = GROW_STACKS_1;
        break exit;
      }
    case STACKS_GROWN_1:
      env[env_s_stack][sp + 1] = state;
      env[env_v_stack][sp + 1] = env[env_lval];
      env[env_symb_start_stack][sp + 1] = env[env_symb_start];
      env[env_symb_end_stack][sp + 1] = env[env_symb_end];
      cmd = loop;
      break;
    case reduce:
      var m = tables.len[n];
      env[env_asp] = sp;
      env[env_rule_number] = n;
      env[env_rule_len] = m;
      sp = sp - m + 1;
      m = tables.lhs[n];
      state1 = env[env_s_stack][sp];
      n1 = tables.gindex[m];
      n2 = n1 + state1;
      if (n1 != 0 && n2 >= 0 && n2 <= tables[tbl_tablesize] &&
          tables.check[n2] == state1)
        state = tables.table[n2];
      else
        state = tables.dgoto[m];
      if (sp >= env[env_stacksize]) {
        res = GROW_STACKS_2;
        break exit;
      }
    case STACKS_GROWN_2:
      res = COMPUTE_SEMANTIC_ACTION;
      break exit;
    case SEMANTIC_ACTION_COMPUTED:
      env[env_s_stack][sp + 1] = state;
      env[env_v_stack][sp + 1] = arg;
      var asp = env[env_asp];
      env[env_symb_end_stack][sp + 1] = env[env_symb_end_stack][asp + 1];
      if (sp > asp) {
        env[env_symb_start_stack][sp + 1] = env[env_symb_end_stack][asp + 1];
      }
      cmd = loop; break;
    default:
      return RAISE_PARSE_ERROR;
    }
  }
  env[env_sp] = sp;
  env[env_state] = state;
  env[env_errflag] = errflag;
  return res;
}
function caml_register_global (n, v) { caml_global_data[n + 1] = v; }
var caml_named_values = {};
function caml_register_named_value(nm,v) {
  caml_named_values[nm] = v; return 0;
}
function caml_string_equal(s1, s2) {
  var b1 = s1.fullBytes;
  var b2 = s2.fullBytes;
  if (b1 != null && b2 != null) return (b1 == b2)?1:0;
  return (s1.getFullBytes () == s2.getFullBytes ())?1:0;
}
function caml_string_notequal(s1, s2) { return 1-caml_string_equal(s1, s2); }
function caml_sys_const_word_size () { return 32; }
function caml_update_dummy (x, y) {
  if( typeof y==="function" ) { x.fun = y; return 0; }
  if( y.fun ) { x.fun = y.fun; return 0; }
  var i = y.length; while (i--) x[i] = y[i]; return 0;
}
(function(){function sh(HT,HU,HV,HW,HX,HY,HZ){return HT.length==6?HT(HU,HV,HW,HX,HY,HZ):caml_call_gen(HT,[HU,HV,HW,HX,HY,HZ]);}function EK(HO,HP,HQ,HR,HS){return HO.length==4?HO(HP,HQ,HR,HS):caml_call_gen(HO,[HP,HQ,HR,HS]);}function j0(HK,HL,HM,HN){return HK.length==3?HK(HL,HM,HN):caml_call_gen(HK,[HL,HM,HN]);}function cW(HH,HI,HJ){return HH.length==2?HH(HI,HJ):caml_call_gen(HH,[HI,HJ]);}function cN(HF,HG){return HF.length==1?HF(HG):caml_call_gen(HF,[HG]);}var a=[0,new MlString("Failure")],b=[0,new MlString("Invalid_argument")],c=[0,new MlString("Not_found")],d=[0,new MlString("Assert_failure")],e=[0,new MlString(""),0,0,-1],f=[0,new MlString(""),1,0,0],g=new MlString("File \"%s\", line %d, characters %d-%d: %s"),h=new MlString("textarea"),i=[0,new MlString("\0\0\xeb\xff\xec\xff\x02\0\x1e\0L\0\xf5\xff\xf6\xff\xf7\xff\xf8\xff\xf9\xff\xfa\xff\xfb\xffM\0\xfd\xff\x0b\0\xbf\0\xfe\xff\x03\0 \0\xf4\xff\xf3\xff\xef\xff\xf2\xff\xee\xff\x01\0\xfd\xff\xfe\xff\xff\xff"),new MlString("\xff\xff\xff\xff\xff\xff\x0f\0\x0e\0\x12\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x03\0\xff\xff\x14\0\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString("\x01\0\0\0\0\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\xff\xff\xff\xff\0\0\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\x1a\0\0\0\0\0\0\0"),new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\x0e\0\x1c\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\b\0\0\0\x07\0\x06\0\f\0\x0b\0\x10\0\0\0\t\0\x0f\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x11\0\0\0\x04\0\x05\0\x03\0\x18\0\x15\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x17\0\x16\0\x14\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x12\0\n\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\x13\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x10\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x02\0\x1b\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"),new MlString("\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\0\0\x19\0\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x0f\0\xff\xff\0\0\0\0\0\0\x03\0\x12\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x13\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x05\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\x05\0\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x10\0\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\x19\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString("")],j=new MlString(" ");caml_register_global(6,c);caml_register_global(5,[0,new MlString("Division_by_zero")]);caml_register_global(3,b);caml_register_global(2,a);var b9=[0,new MlString("Out_of_memory")],b8=[0,new MlString("Match_failure")],b7=[0,new MlString("Stack_overflow")],b6=[0,new MlString("Undefined_recursive_module")],b5=new MlString("%.12g"),b4=new MlString("."),b3=new MlString("%d"),b2=new MlString("true"),b1=new MlString("false"),b0=new MlString("Pervasives.do_at_exit"),bZ=new MlString("Array.blit"),bY=new MlString("\\b"),bX=new MlString("\\t"),bW=new MlString("\\n"),bV=new MlString("\\r"),bU=new MlString("\\\\"),bT=new MlString("\\'"),bS=new MlString("String.blit"),bR=new MlString("String.sub"),bQ=new MlString(""),bP=new MlString("syntax error"),bO=new MlString("Parsing.YYexit"),bN=new MlString("Parsing.Parse_error"),bM=new MlString("Set.remove_min_elt"),bL=[0,0,0,0],bK=[0,0,0],bJ=new MlString("Set.bal"),bI=new MlString("Set.bal"),bH=new MlString("Set.bal"),bG=new MlString("Set.bal"),bF=new MlString("Map.remove_min_elt"),bE=[0,0,0,0],bD=[0,new MlString("map.ml"),270,10],bC=[0,0,0],bB=new MlString("Map.bal"),bA=new MlString("Map.bal"),bz=new MlString("Map.bal"),by=new MlString("Map.bal"),bx=new MlString("Queue.Empty"),bw=new MlString("Buffer.add: cannot grow buffer"),bv=new MlString(""),bu=new MlString(""),bt=new MlString("%.12g"),bs=new MlString("\""),br=new MlString("\""),bq=new MlString("'"),bp=new MlString("'"),bo=new MlString("nan"),bn=new MlString("neg_infinity"),bm=new MlString("infinity"),bl=new MlString("."),bk=new MlString("printf: bad positional specification (0)."),bj=new MlString("%_"),bi=[0,new MlString("printf.ml"),143,8],bh=new MlString("'"),bg=new MlString("Printf: premature end of format string '"),bf=new MlString("'"),be=new MlString(" in format string '"),bd=new MlString(", at char number "),bc=new MlString("Printf: bad conversion %"),bb=new MlString("Sformat.index_of_int: negative argument "),ba=new MlString(""),a$=new MlString(", %s%s"),a_=[1,1],a9=new MlString("%s\n"),a8=new MlString("(Program not linked with -g, cannot print stack backtrace)\n"),a7=new MlString("Raised at"),a6=new MlString("Re-raised at"),a5=new MlString("Raised by primitive operation at"),a4=new MlString("Called from"),a3=new MlString("%s file \"%s\", line %d, characters %d-%d"),a2=new MlString("%s unknown location"),a1=new MlString("Out of memory"),a0=new MlString("Stack overflow"),aZ=new MlString("Pattern matching failed"),aY=new MlString("Assertion failed"),aX=new MlString("Undefined recursive module"),aW=new MlString("(%s%s)"),aV=new MlString(""),aU=new MlString(""),aT=new MlString("(%s)"),aS=new MlString("%d"),aR=new MlString("%S"),aQ=new MlString("_"),aP=[0,new MlString("src/core/lwt.ml"),648,20],aO=[0,new MlString("src/core/lwt.ml"),651,8],aN=[0,new MlString("src/core/lwt.ml"),498,8],aM=[0,new MlString("src/core/lwt.ml"),487,9],aL=new MlString("Lwt.wakeup_result"),aK=new MlString("Lwt.Canceled"),aJ=new MlString("\""),aI=new MlString(" name=\""),aH=new MlString("\""),aG=new MlString(" type=\""),aF=new MlString("<"),aE=new MlString(">"),aD=new MlString(""),aC=new MlString("<input name=\"x\">"),aB=new MlString("input"),aA=new MlString("x"),az=new MlString("td"),ay=new MlString("tr"),ax=new MlString("table"),aw=new MlString("a"),av=new MlString("br"),au=new MlString("p"),at=new MlString("Exception during Lwt.async: "),as=new MlString("parser"),ar=new MlString("1"),aq=new MlString("0"),ap=[0,0,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,0],ao=new MlString("\xff\xff\x02\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\0\0\0\0"),an=new MlString("\x02\0\x03\0\x01\0\x02\0\x03\0\x03\0\x03\0\x02\0\x02\0\x03\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x02\0\x02\0"),am=new MlString("\0\0\0\0\0\0\0\0\x02\0\0\0\0\0\0\0\x12\0\0\0\x03\0\0\0\0\0\b\0\x07\0\0\0\n\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\0\0\t\0\0\0\0\0\0\0\0\0"),al=new MlString("\x03\0\x06\0\b\0\x17\0"),ak=new MlString("\x05\0\x01\xff\x01\xff\0\0\0\0\x01\xff\n\xff\x18\xff\0\0'\xff\0\0\x01\xff\x01\xff\0\0\0\0\x01\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x01\xff\0\x000\xff<\xff4\xff\n\xff"),aj=new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x1d\0\x01\0\x0f\0\b\0"),ai=new MlString("\0\0\xfe\xff\0\0\0\0"),ah=new MlString("\x07\0\x04\0\x04\0\t\0\x11\0\x05\0\x01\0\x02\0\x01\0\x19\0\x1a\0\0\0\n\0\x1b\0\0\0\x05\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x1c\0\0\0\0\0\0\0\0\0\n\0\0\0\0\0\x06\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\x11\0\x12\0\x13\0\x14\0\x15\0\n\0\x16\0\0\0\x18\0\x0b\0\f\0\r\0\x0e\0\x0f\0\n\0\0\0\0\0\0\0\n\0\f\0\r\0\x0e\0\x0f\0\f\0\r\0\x0e\0\n\0\0\0\0\0\0\0\0\0\0\0\r\0\x0e\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x04\0\0\0\0\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\0\0\x04\0\x05\0\x05\0\0\0\0\0\0\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\0\0\x05\0\x06\0\x06\0\0\0\0\0\0\0\0\0\x06\0\x06\0\x06\0\x06\0\x06\0\x06\0\0\0\x06\0"),ag=new MlString("\x02\0\0\0\x01\x01\x05\0\0\0\x04\x01\x01\0\x02\0\0\0\x0b\0\f\0\xff\xff\x02\x01\x0f\0\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x17\0\xff\xff\xff\xff\xff\xff\xff\xff\x02\x01\xff\xff\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\x02\x01\x12\x01\xff\xff\x05\x01\x06\x01\x07\x01\b\x01\t\x01\n\x01\x02\x01\xff\xff\xff\xff\xff\xff\x02\x01\x07\x01\b\x01\t\x01\n\x01\x07\x01\b\x01\t\x01\x02\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\b\x01\t\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x05\x01\x06\x01\x07\x01\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\xff\xff\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01"),af=new MlString("EOF\0NEWLINE\0LPAR\0RPAR\0PLUS\0DOT\0PSTAR\0STAR\0INTER\0EGAL\0LEQ\0GEQ\0LT\0GT\0IMCOMP\0DUNNO\0DIFF\0"),ae=new MlString("VAR\0POWER\0"),ad=new MlString("lexing error"),ac=new MlString("\xc3\xb8"),ab=new MlString("\xce\xb5"),aa=new MlString("(%s | %s)"),$=new MlString("(%s)+"),_=new MlString("(%s)~"),Z=new MlString("%s.%s"),Y=new MlString("(%s & %s)"),X=new MlString("=/="),W=new MlString("<="),V=new MlString(">="),U=new MlString("<"),T=new MlString(">"),S=new MlString("<>"),R=new MlString("="),Q=new MlString("Tools.ContreExemple"),P=new MlString("get_expr : empty word"),O=[0,new MlString("word.ml"),260,4],N=new MlString("get_expr : stuck"),M=new MlString("get_expr : stuck"),L=[0,new MlString("word.ml"),210,15],K=new MlString("Lts.trad : unsupported operation"),J=[0,new MlString("lts.ml"),130,2],I=[0,new MlString("lts.ml"),99,2],H=[0,new MlString("lts.ml"),63,2],G=new MlString("mergeint : conflict"),F=new MlString("OK"),E=new MlString("Incorrect"),D=new MlString("%s %s %s --------- %s\n%s\n\n"),C=new MlString("\n%s <= %s -- false : %s"),B=new MlString("\n%s <= %s -- true"),A=[0,new MlString("wmain.ml"),60,17],z=new MlString("zob"),y=new MlString("1px black dashed"),x=new MlString("5px"),w=new MlString("400px"),v=new MlString(""),u=new MlString(""),t=[0,0,new MlString("")],s=new MlString(""),r=new MlString(""),q=new MlString(""),p=new MlString("");function o(k){throw [0,a,k];}function b_(l){throw [0,b,l];}function b$(n,m){return caml_greaterequal(n,m)?n:m;}function ck(ca,cc){var cb=ca.getLen(),cd=cc.getLen(),ce=caml_create_string(cb+cd|0);caml_blit_string(ca,0,ce,0,cb);caml_blit_string(cc,0,ce,cb,cd);return ce;}function cl(cf){return caml_format_int(b3,cf);}function ch(cg,ci){if(cg){var cj=cg[1];return [0,cj,ch(cg[2],ci)];}return ci;}var cm=caml_ml_open_descriptor_out(2);function cu(co,cn){return caml_ml_output(co,cn,0,cn.getLen());}function ct(cs){var cp=caml_ml_out_channels_list(0);for(;;){if(cp){var cq=cp[2];try {}catch(cr){}var cp=cq;continue;}return 0;}}caml_register_named_value(b0,ct);function cy(cw,cv){return caml_ml_output_char(cw,cv);}function cF(cx){return caml_ml_flush(cx);}function cE(cB,cA,cD,cC,cz){if(0<=cz&&0<=cA&&!((cB.length-1-cz|0)<cA)&&0<=cC&&!((cD.length-1-cz|0)<cC))return caml_array_blit(cB,cA,cD,cC,cz);return b_(bZ);}function c4(cG){var cH=cG,cI=0;for(;;){if(cH){var cJ=cH[2],cK=[0,cH[1],cI],cH=cJ,cI=cK;continue;}return cI;}}function cP(cM,cL){if(cL){var cO=cL[2],cQ=cN(cM,cL[1]);return [0,cQ,cP(cM,cO)];}return 0;}function c5(cV,cR,cT){var cS=cR,cU=cT;for(;;){if(cU){var cX=cU[2],cY=cW(cV,cS,cU[1]),cS=cY,cU=cX;continue;}return cS;}}function c6(c1,cZ){var c0=cZ;for(;;){if(c0){var c2=c0[2],c3=0===caml_compare(c0[1],c1)?1:0;if(c3)return c3;var c0=c2;continue;}return 0;}}function dh(c7,c9){var c8=caml_create_string(c7);caml_fill_string(c8,0,c7,c9);return c8;}function di(da,c_,c$){if(0<=c_&&0<=c$&&!((da.getLen()-c$|0)<c_)){var db=caml_create_string(c$);caml_blit_string(da,c_,db,0,c$);return db;}return b_(bR);}function dj(de,dd,dg,df,dc){if(0<=dc&&0<=dd&&!((de.getLen()-dc|0)<dd)&&0<=df&&!((dg.getLen()-dc|0)<df))return caml_blit_string(de,dd,dg,df,dc);return b_(bS);}var dk=caml_sys_const_word_size(0),dl=caml_mul(dk/8|0,(1<<(dk-10|0))-1|0)-1|0,du=252,dt=253;function ds(dp,dn,dm){var dq=caml_lex_engine(dp,dn,dm);if(0<=dq){dm[11]=dm[12];var dr=dm[12];dm[12]=[0,dr[1],dr[2],dr[3],dm[4]+dm[6]|0];}return dq;}var dv=[0,bO],dw=[0,bN],dx=[0,caml_make_vect(100,0),caml_make_vect(100,0),caml_make_vect(100,e),caml_make_vect(100,e),100,0,0,0,e,e,0,0,0,0,0,0];function dG(dE){var dy=dx[5],dz=dy*2|0,dA=caml_make_vect(dz,0),dB=caml_make_vect(dz,0),dC=caml_make_vect(dz,e),dD=caml_make_vect(dz,e);cE(dx[1],0,dA,0,dy);dx[1]=dA;cE(dx[2],0,dB,0,dy);dx[2]=dB;cE(dx[3],0,dC,0,dy);dx[3]=dC;cE(dx[4],0,dD,0,dy);dx[4]=dD;dx[5]=dz;return 0;}var dL=[0,function(dF){return 0;}];function dK(dH,dI){return caml_array_get(dH[2],dH[11]-dI|0);}function hX(dJ){return 0;}function hW(eh){function d0(dM){return dM?dM[4]:0;}function d2(dN,dS,dP){var dO=dN?dN[4]:0,dQ=dP?dP[4]:0,dR=dQ<=dO?dO+1|0:dQ+1|0;return [0,dN,dS,dP,dR];}function el(dT,d3,dV){var dU=dT?dT[4]:0,dW=dV?dV[4]:0;if((dW+2|0)<dU){if(dT){var dX=dT[3],dY=dT[2],dZ=dT[1],d1=d0(dX);if(d1<=d0(dZ))return d2(dZ,dY,d2(dX,d3,dV));if(dX){var d5=dX[2],d4=dX[1],d6=d2(dX[3],d3,dV);return d2(d2(dZ,dY,d4),d5,d6);}return b_(bJ);}return b_(bI);}if((dU+2|0)<dW){if(dV){var d7=dV[3],d8=dV[2],d9=dV[1],d_=d0(d9);if(d_<=d0(d7))return d2(d2(dT,d3,d9),d8,d7);if(d9){var ea=d9[2],d$=d9[1],eb=d2(d9[3],d8,d7);return d2(d2(dT,d3,d$),ea,eb);}return b_(bH);}return b_(bG);}var ec=dW<=dU?dU+1|0:dW+1|0;return [0,dT,d3,dV,ec];}function ek(ei,ed){if(ed){var ee=ed[3],ef=ed[2],eg=ed[1],ej=cW(eh[1],ei,ef);return 0===ej?ed:0<=ej?el(eg,ef,ek(ei,ee)):el(ek(ei,eg),ef,ee);}return [0,0,ei,0,1];}function es(em){return [0,0,em,0,1];}function eo(ep,en){if(en){var er=en[3],eq=en[2];return el(eo(ep,en[1]),eq,er);}return es(ep);}function eu(ev,et){if(et){var ex=et[2],ew=et[1];return el(ew,ex,eu(ev,et[3]));}return es(ev);}function eC(ey,eD,ez){if(ey){if(ez){var eA=ez[4],eB=ey[4],eI=ez[3],eJ=ez[2],eH=ez[1],eE=ey[3],eF=ey[2],eG=ey[1];return (eA+2|0)<eB?el(eG,eF,eC(eE,eD,ez)):(eB+2|0)<eA?el(eC(ey,eD,eH),eJ,eI):d2(ey,eD,ez);}return eu(eD,ey);}return eo(eD,ez);}function eY(eK){var eL=eK;for(;;){if(eL){var eM=eL[1];if(eM){var eL=eM;continue;}return eL[2];}throw [0,c];}}function fb(eN){var eO=eN;for(;;){if(eO){var eP=eO[3],eQ=eO[2];if(eP){var eO=eP;continue;}return eQ;}throw [0,c];}}function eT(eR){if(eR){var eS=eR[1];if(eS){var eV=eR[3],eU=eR[2];return el(eT(eS),eU,eV);}return eR[3];}return b_(bM);}function fc(eW,eX){if(eW){if(eX){var eZ=eT(eX);return eC(eW,eY(eX),eZ);}return eW;}return eX;}function e6(e4,e0){if(e0){var e1=e0[3],e2=e0[2],e3=e0[1],e5=cW(eh[1],e4,e2);if(0===e5)return [0,e3,1,e1];if(0<=e5){var e7=e6(e4,e1),e9=e7[3],e8=e7[2];return [0,eC(e3,e2,e7[1]),e8,e9];}var e_=e6(e4,e3),fa=e_[2],e$=e_[1];return [0,e$,fa,eC(e_[3],e2,e1)];}return bL;}var hR=0;function hS(fd){return fd?0:1;}function hT(fg,fe){var ff=fe;for(;;){if(ff){var fj=ff[3],fi=ff[1],fh=cW(eh[1],fg,ff[2]),fk=0===fh?1:0;if(fk)return fk;var fl=0<=fh?fj:fi,ff=fl;continue;}return 0;}}function fu(fq,fm){if(fm){var fn=fm[3],fo=fm[2],fp=fm[1],fr=cW(eh[1],fq,fo);if(0===fr){if(fp)if(fn){var fs=eT(fn),ft=el(fp,eY(fn),fs);}else var ft=fp;else var ft=fn;return ft;}return 0<=fr?el(fp,fo,fu(fq,fn)):el(fu(fq,fp),fo,fn);}return 0;}function fC(fv,fw){if(fv){if(fw){var fx=fw[4],fy=fw[2],fz=fv[4],fA=fv[2],fI=fw[3],fK=fw[1],fD=fv[3],fF=fv[1];if(fx<=fz){if(1===fx)return ek(fy,fv);var fB=e6(fA,fw),fE=fB[1],fG=fC(fD,fB[3]);return eC(fC(fF,fE),fA,fG);}if(1===fz)return ek(fA,fw);var fH=e6(fy,fv),fJ=fH[1],fL=fC(fH[3],fI);return eC(fC(fJ,fK),fy,fL);}return fv;}return fw;}function fT(fM,fN){if(fM){if(fN){var fO=fM[3],fP=fM[2],fQ=fM[1],fR=e6(fP,fN),fS=fR[1];if(0===fR[2]){var fU=fT(fO,fR[3]);return fc(fT(fQ,fS),fU);}var fV=fT(fO,fR[3]);return eC(fT(fQ,fS),fP,fV);}return 0;}return 0;}function f3(fW,fX){if(fW){if(fX){var fY=fW[3],fZ=fW[2],f0=fW[1],f1=e6(fZ,fX),f2=f1[1];if(0===f1[2]){var f4=f3(fY,f1[3]);return eC(f3(f0,f2),fZ,f4);}var f5=f3(fY,f1[3]);return fc(f3(f0,f2),f5);}return fW;}return 0;}function ga(f6,f8){var f7=f6,f9=f8;for(;;){if(f7){var f_=f7[1],f$=[0,f7[2],f7[3],f9],f7=f_,f9=f$;continue;}return f9;}}function go(gc,gb){var gd=ga(gb,0),ge=ga(gc,0),gf=gd;for(;;){if(ge)if(gf){var gk=gf[3],gj=gf[2],gi=ge[3],gh=ge[2],gg=cW(eh[1],ge[1],gf[1]);if(0===gg){var gl=ga(gj,gk),gm=ga(gh,gi),ge=gm,gf=gl;continue;}var gn=gg;}else var gn=1;else var gn=gf?-1:0;return gn;}}function hU(gq,gp){return 0===go(gq,gp)?1:0;}function gB(gr,gt){var gs=gr,gu=gt;for(;;){if(gs){if(gu){var gv=gu[3],gw=gu[1],gx=gs[3],gy=gs[2],gz=gs[1],gA=cW(eh[1],gy,gu[2]);if(0===gA){var gC=gB(gz,gw);if(gC){var gs=gx,gu=gv;continue;}return gC;}if(0<=gA){var gD=gB([0,0,gy,gx,0],gv);if(gD){var gs=gz;continue;}return gD;}var gE=gB([0,gz,gy,0,0],gw);if(gE){var gs=gx;continue;}return gE;}return 0;}return 1;}}function gH(gI,gF){var gG=gF;for(;;){if(gG){var gK=gG[3],gJ=gG[2];gH(gI,gG[1]);cN(gI,gJ);var gG=gK;continue;}return 0;}}function gP(gQ,gL,gN){var gM=gL,gO=gN;for(;;){if(gM){var gS=gM[3],gR=gM[2],gT=cW(gQ,gR,gP(gQ,gM[1],gO)),gM=gS,gO=gT;continue;}return gO;}}function g0(gW,gU){var gV=gU;for(;;){if(gV){var gZ=gV[3],gY=gV[1],gX=cN(gW,gV[2]);if(gX){var g1=g0(gW,gY);if(g1){var gV=gZ;continue;}var g2=g1;}else var g2=gX;return g2;}return 1;}}function g_(g5,g3){var g4=g3;for(;;){if(g4){var g8=g4[3],g7=g4[1],g6=cN(g5,g4[2]);if(g6)var g9=g6;else{var g$=g_(g5,g7);if(!g$){var g4=g8;continue;}var g9=g$;}return g9;}return 0;}}function hc(hd,ha){if(ha){var hb=ha[2],hf=ha[3],he=hc(hd,ha[1]),hh=cN(hd,hb),hg=hc(hd,hf);return hh?eC(he,hb,hg):fc(he,hg);}return 0;}function hk(hl,hi){if(hi){var hj=hi[2],hn=hi[3],hm=hk(hl,hi[1]),ho=hm[2],hp=hm[1],hr=cN(hl,hj),hq=hk(hl,hn),hs=hq[2],ht=hq[1];if(hr){var hu=fc(ho,hs);return [0,eC(hp,hj,ht),hu];}var hv=eC(ho,hj,hs);return [0,fc(hp,ht),hv];}return bK;}function hx(hw){if(hw){var hy=hw[1],hz=hx(hw[3]);return (hx(hy)+1|0)+hz|0;}return 0;}function hE(hA,hC){var hB=hA,hD=hC;for(;;){if(hD){var hG=hD[2],hF=hD[1],hH=[0,hG,hE(hB,hD[3])],hB=hH,hD=hF;continue;}return hB;}}function hV(hI){return hE(0,hI);}return [0,hR,hS,hT,ek,es,fu,fC,fT,f3,go,hU,gB,gH,gP,g0,g_,hc,hk,hx,hV,eY,fb,eY,e6,function(hM,hJ){var hK=hJ;for(;;){if(hK){var hL=hK[2],hP=hK[3],hO=hK[1],hN=cW(eh[1],hM,hL);if(0===hN)return hL;var hQ=0<=hN?hP:hO,hK=hQ;continue;}throw [0,c];}}];}function mS(iH){function hZ(hY){return hY?hY[5]:0;}function ih(h0,h6,h5,h2){var h1=hZ(h0),h3=hZ(h2),h4=h3<=h1?h1+1|0:h3+1|0;return [0,h0,h6,h5,h2,h4];}function iz(h8,h7){return [0,0,h8,h7,0,1];}function iA(h9,ij,ii,h$){var h_=h9?h9[5]:0,ia=h$?h$[5]:0;if((ia+2|0)<h_){if(h9){var ib=h9[4],ic=h9[3],id=h9[2],ie=h9[1],ig=hZ(ib);if(ig<=hZ(ie))return ih(ie,id,ic,ih(ib,ij,ii,h$));if(ib){var im=ib[3],il=ib[2],ik=ib[1],io=ih(ib[4],ij,ii,h$);return ih(ih(ie,id,ic,ik),il,im,io);}return b_(bB);}return b_(bA);}if((h_+2|0)<ia){if(h$){var ip=h$[4],iq=h$[3],ir=h$[2],is=h$[1],it=hZ(is);if(it<=hZ(ip))return ih(ih(h9,ij,ii,is),ir,iq,ip);if(is){var iw=is[3],iv=is[2],iu=is[1],ix=ih(is[4],ir,iq,ip);return ih(ih(h9,ij,ii,iu),iv,iw,ix);}return b_(bz);}return b_(by);}var iy=ia<=h_?h_+1|0:ia+1|0;return [0,h9,ij,ii,h$,iy];}var mL=0;function mM(iB){return iB?0:1;}function iM(iI,iL,iC){if(iC){var iD=iC[4],iE=iC[3],iF=iC[2],iG=iC[1],iK=iC[5],iJ=cW(iH[1],iI,iF);return 0===iJ?[0,iG,iI,iL,iD,iK]:0<=iJ?iA(iG,iF,iE,iM(iI,iL,iD)):iA(iM(iI,iL,iG),iF,iE,iD);}return [0,0,iI,iL,0,1];}function mN(iP,iN){var iO=iN;for(;;){if(iO){var iT=iO[4],iS=iO[3],iR=iO[1],iQ=cW(iH[1],iP,iO[2]);if(0===iQ)return iS;var iU=0<=iQ?iT:iR,iO=iU;continue;}throw [0,c];}}function mO(iX,iV){var iW=iV;for(;;){if(iW){var i0=iW[4],iZ=iW[1],iY=cW(iH[1],iX,iW[2]),i1=0===iY?1:0;if(i1)return i1;var i2=0<=iY?i0:iZ,iW=i2;continue;}return 0;}}function jm(i3){var i4=i3;for(;;){if(i4){var i5=i4[1];if(i5){var i4=i5;continue;}return [0,i4[2],i4[3]];}throw [0,c];}}function mP(i6){var i7=i6;for(;;){if(i7){var i8=i7[4],i9=i7[3],i_=i7[2];if(i8){var i7=i8;continue;}return [0,i_,i9];}throw [0,c];}}function jb(i$){if(i$){var ja=i$[1];if(ja){var je=i$[4],jd=i$[3],jc=i$[2];return iA(jb(ja),jc,jd,je);}return i$[4];}return b_(bF);}function jr(jk,jf){if(jf){var jg=jf[4],jh=jf[3],ji=jf[2],jj=jf[1],jl=cW(iH[1],jk,ji);if(0===jl){if(jj)if(jg){var jn=jm(jg),jp=jn[2],jo=jn[1],jq=iA(jj,jo,jp,jb(jg));}else var jq=jj;else var jq=jg;return jq;}return 0<=jl?iA(jj,ji,jh,jr(jk,jg)):iA(jr(jk,jj),ji,jh,jg);}return 0;}function ju(jv,js){var jt=js;for(;;){if(jt){var jy=jt[4],jx=jt[3],jw=jt[2];ju(jv,jt[1]);cW(jv,jw,jx);var jt=jy;continue;}return 0;}}function jA(jB,jz){if(jz){var jF=jz[5],jE=jz[4],jD=jz[3],jC=jz[2],jG=jA(jB,jz[1]),jH=cN(jB,jD);return [0,jG,jC,jH,jA(jB,jE),jF];}return 0;}function jK(jL,jI){if(jI){var jJ=jI[2],jO=jI[5],jN=jI[4],jM=jI[3],jP=jK(jL,jI[1]),jQ=cW(jL,jJ,jM);return [0,jP,jJ,jQ,jK(jL,jN),jO];}return 0;}function jV(jW,jR,jT){var jS=jR,jU=jT;for(;;){if(jS){var jZ=jS[4],jY=jS[3],jX=jS[2],j1=j0(jW,jX,jY,jV(jW,jS[1],jU)),jS=jZ,jU=j1;continue;}return jU;}}function j8(j4,j2){var j3=j2;for(;;){if(j3){var j7=j3[4],j6=j3[1],j5=cW(j4,j3[2],j3[3]);if(j5){var j9=j8(j4,j6);if(j9){var j3=j7;continue;}var j_=j9;}else var j_=j5;return j_;}return 1;}}function kg(kb,j$){var ka=j$;for(;;){if(ka){var ke=ka[4],kd=ka[1],kc=cW(kb,ka[2],ka[3]);if(kc)var kf=kc;else{var kh=kg(kb,kd);if(!kh){var ka=ke;continue;}var kf=kh;}return kf;}return 0;}}function kj(kl,kk,ki){if(ki){var ko=ki[4],kn=ki[3],km=ki[2];return iA(kj(kl,kk,ki[1]),km,kn,ko);}return iz(kl,kk);}function kq(ks,kr,kp){if(kp){var kv=kp[3],ku=kp[2],kt=kp[1];return iA(kt,ku,kv,kq(ks,kr,kp[4]));}return iz(ks,kr);}function kA(kw,kC,kB,kx){if(kw){if(kx){var ky=kx[5],kz=kw[5],kI=kx[4],kJ=kx[3],kK=kx[2],kH=kx[1],kD=kw[4],kE=kw[3],kF=kw[2],kG=kw[1];return (ky+2|0)<kz?iA(kG,kF,kE,kA(kD,kC,kB,kx)):(kz+2|0)<ky?iA(kA(kw,kC,kB,kH),kK,kJ,kI):ih(kw,kC,kB,kx);}return kq(kC,kB,kw);}return kj(kC,kB,kx);}function kU(kL,kM){if(kL){if(kM){var kN=jm(kM),kP=kN[2],kO=kN[1];return kA(kL,kO,kP,jb(kM));}return kL;}return kM;}function ll(kT,kS,kQ,kR){return kQ?kA(kT,kS,kQ[1],kR):kU(kT,kR);}function k2(k0,kV){if(kV){var kW=kV[4],kX=kV[3],kY=kV[2],kZ=kV[1],k1=cW(iH[1],k0,kY);if(0===k1)return [0,kZ,[0,kX],kW];if(0<=k1){var k3=k2(k0,kW),k5=k3[3],k4=k3[2];return [0,kA(kZ,kY,kX,k3[1]),k4,k5];}var k6=k2(k0,kZ),k8=k6[2],k7=k6[1];return [0,k7,k8,kA(k6[3],kY,kX,kW)];}return bE;}function lf(lg,k9,k$){if(k9){var k_=k9[2],ld=k9[5],lc=k9[4],lb=k9[3],la=k9[1];if(hZ(k$)<=ld){var le=k2(k_,k$),li=le[2],lh=le[1],lj=lf(lg,lc,le[3]),lk=j0(lg,k_,[0,lb],li);return ll(lf(lg,la,lh),k_,lk,lj);}}else if(!k$)return 0;if(k$){var lm=k$[2],lq=k$[4],lp=k$[3],lo=k$[1],ln=k2(lm,k9),ls=ln[2],lr=ln[1],lt=lf(lg,ln[3],lq),lu=j0(lg,lm,ls,[0,lp]);return ll(lf(lg,lr,lo),lm,lu,lt);}throw [0,d,bD];}function ly(lz,lv){if(lv){var lw=lv[3],lx=lv[2],lB=lv[4],lA=ly(lz,lv[1]),lD=cW(lz,lx,lw),lC=ly(lz,lB);return lD?kA(lA,lx,lw,lC):kU(lA,lC);}return 0;}function lH(lI,lE){if(lE){var lF=lE[3],lG=lE[2],lK=lE[4],lJ=lH(lI,lE[1]),lL=lJ[2],lM=lJ[1],lO=cW(lI,lG,lF),lN=lH(lI,lK),lP=lN[2],lQ=lN[1];if(lO){var lR=kU(lL,lP);return [0,kA(lM,lG,lF,lQ),lR];}var lS=kA(lL,lG,lF,lP);return [0,kU(lM,lQ),lS];}return bC;}function lZ(lT,lV){var lU=lT,lW=lV;for(;;){if(lU){var lX=lU[1],lY=[0,lU[2],lU[3],lU[4],lW],lU=lX,lW=lY;continue;}return lW;}}function mQ(ma,l1,l0){var l2=lZ(l0,0),l3=lZ(l1,0),l4=l2;for(;;){if(l3)if(l4){var l$=l4[4],l_=l4[3],l9=l4[2],l8=l3[4],l7=l3[3],l6=l3[2],l5=cW(iH[1],l3[1],l4[1]);if(0===l5){var mb=cW(ma,l6,l9);if(0===mb){var mc=lZ(l_,l$),md=lZ(l7,l8),l3=md,l4=mc;continue;}var me=mb;}else var me=l5;}else var me=1;else var me=l4?-1:0;return me;}}function mR(mr,mg,mf){var mh=lZ(mf,0),mi=lZ(mg,0),mj=mh;for(;;){if(mi)if(mj){var mp=mj[4],mo=mj[3],mn=mj[2],mm=mi[4],ml=mi[3],mk=mi[2],mq=0===cW(iH[1],mi[1],mj[1])?1:0;if(mq){var ms=cW(mr,mk,mn);if(ms){var mt=lZ(mo,mp),mu=lZ(ml,mm),mi=mu,mj=mt;continue;}var mv=ms;}else var mv=mq;var mw=mv;}else var mw=0;else var mw=mj?0:1;return mw;}}function my(mx){if(mx){var mz=mx[1],mA=my(mx[4]);return (my(mz)+1|0)+mA|0;}return 0;}function mF(mB,mD){var mC=mB,mE=mD;for(;;){if(mE){var mI=mE[3],mH=mE[2],mG=mE[1],mJ=[0,[0,mH,mI],mF(mC,mE[4])],mC=mJ,mE=mG;continue;}return mC;}}return [0,mL,mM,mO,iM,iz,jr,lf,mQ,mR,ju,jV,j8,kg,ly,lH,my,function(mK){return mF(0,mK);},jm,mP,jm,k2,mN,jA,jK];}var m$=[0,bx];function m_(mT){var mU=1<=mT?mT:1,mV=dl<mU?dl:mU,mW=caml_create_string(mV);return [0,mW,0,mV,mW];}function na(mX){return di(mX[1],0,mX[2]);}function m4(mY,m0){var mZ=[0,mY[3]];for(;;){if(mZ[1]<(mY[2]+m0|0)){mZ[1]=2*mZ[1]|0;continue;}if(dl<mZ[1])if((mY[2]+m0|0)<=dl)mZ[1]=dl;else o(bw);var m1=caml_create_string(mZ[1]);dj(mY[1],0,m1,0,mY[2]);mY[1]=m1;mY[3]=mZ[1];return 0;}}function nb(m2,m5){var m3=m2[2];if(m2[3]<=m3)m4(m2,1);m2[1].safeSet(m3,m5);m2[2]=m3+1|0;return 0;}function nc(m8,m6){var m7=m6.getLen(),m9=m8[2]+m7|0;if(m8[3]<m9)m4(m8,m7);dj(m6,0,m8[1],m8[2],m7);m8[2]=m9;return 0;}function ng(nd){return 0<=nd?nd:o(ck(bb,cl(nd)));}function nh(ne,nf){return ng(ne+nf|0);}var ni=cN(nh,1);function np(nj){return di(nj,0,nj.getLen());}function nr(nk,nl,nn){var nm=ck(be,ck(nk,bf)),no=ck(bd,ck(cl(nl),nm));return b_(ck(bc,ck(dh(1,nn),no)));}function of(nq,nt,ns){return nr(np(nq),nt,ns);}function og(nu){return b_(ck(bg,ck(np(nu),bh)));}function nO(nv,nD,nF,nH){function nC(nw){if((nv.safeGet(nw)-48|0)<0||9<(nv.safeGet(nw)-48|0))return nw;var nx=nw+1|0;for(;;){var ny=nv.safeGet(nx);if(48<=ny){if(!(58<=ny)){var nA=nx+1|0,nx=nA;continue;}var nz=0;}else if(36===ny){var nB=nx+1|0,nz=1;}else var nz=0;if(!nz)var nB=nw;return nB;}}var nE=nC(nD+1|0),nG=m_((nF-nE|0)+10|0);nb(nG,37);var nI=nE,nJ=c4(nH);for(;;){if(nI<=nF){var nK=nv.safeGet(nI);if(42===nK){if(nJ){var nL=nJ[2];nc(nG,cl(nJ[1]));var nM=nC(nI+1|0),nI=nM,nJ=nL;continue;}throw [0,d,bi];}nb(nG,nK);var nN=nI+1|0,nI=nN;continue;}return na(nG);}}function pG(nU,nS,nR,nQ,nP){var nT=nO(nS,nR,nQ,nP);if(78!==nU&&110!==nU)return nT;nT.safeSet(nT.getLen()-1|0,117);return nT;}function oh(n1,n$,od,nV,oc){var nW=nV.getLen();function oa(nX,n_){var nY=40===nX?41:125;function n9(nZ){var n0=nZ;for(;;){if(nW<=n0)return cN(n1,nV);if(37===nV.safeGet(n0)){var n2=n0+1|0;if(nW<=n2)var n3=cN(n1,nV);else{var n4=nV.safeGet(n2),n5=n4-40|0;if(n5<0||1<n5){var n6=n5-83|0;if(n6<0||2<n6)var n7=1;else switch(n6){case 1:var n7=1;break;case 2:var n8=1,n7=0;break;default:var n8=0,n7=0;}if(n7){var n3=n9(n2+1|0),n8=2;}}else var n8=0===n5?0:1;switch(n8){case 1:var n3=n4===nY?n2+1|0:j0(n$,nV,n_,n4);break;case 2:break;default:var n3=n9(oa(n4,n2+1|0)+1|0);}}return n3;}var ob=n0+1|0,n0=ob;continue;}}return n9(n_);}return oa(od,oc);}function oG(oe){return j0(oh,og,of,oe);}function oW(oi,ot,oD){var oj=oi.getLen()-1|0;function oE(ok){var ol=ok;a:for(;;){if(ol<oj){if(37===oi.safeGet(ol)){var om=0,on=ol+1|0;for(;;){if(oj<on)var oo=og(oi);else{var op=oi.safeGet(on);if(58<=op){if(95===op){var or=on+1|0,oq=1,om=oq,on=or;continue;}}else if(32<=op)switch(op-32|0){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 0:case 3:case 11:case 13:var os=on+1|0,on=os;continue;case 10:var ou=j0(ot,om,on,105),on=ou;continue;default:var ov=on+1|0,on=ov;continue;}var ow=on;c:for(;;){if(oj<ow)var ox=og(oi);else{var oy=oi.safeGet(ow);if(126<=oy)var oz=0;else switch(oy){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var ox=j0(ot,om,ow,105),oz=1;break;case 69:case 70:case 71:case 101:case 102:case 103:var ox=j0(ot,om,ow,102),oz=1;break;case 33:case 37:case 44:case 64:var ox=ow+1|0,oz=1;break;case 83:case 91:case 115:var ox=j0(ot,om,ow,115),oz=1;break;case 97:case 114:case 116:var ox=j0(ot,om,ow,oy),oz=1;break;case 76:case 108:case 110:var oA=ow+1|0;if(oj<oA){var ox=j0(ot,om,ow,105),oz=1;}else{var oB=oi.safeGet(oA)-88|0;if(oB<0||32<oB)var oC=1;else switch(oB){case 0:case 12:case 17:case 23:case 29:case 32:var ox=cW(oD,j0(ot,om,ow,oy),105),oz=1,oC=0;break;default:var oC=1;}if(oC){var ox=j0(ot,om,ow,105),oz=1;}}break;case 67:case 99:var ox=j0(ot,om,ow,99),oz=1;break;case 66:case 98:var ox=j0(ot,om,ow,66),oz=1;break;case 41:case 125:var ox=j0(ot,om,ow,oy),oz=1;break;case 40:var ox=oE(j0(ot,om,ow,oy)),oz=1;break;case 123:var oF=j0(ot,om,ow,oy),oH=j0(oG,oy,oi,oF),oI=oF;for(;;){if(oI<(oH-2|0)){var oJ=cW(oD,oI,oi.safeGet(oI)),oI=oJ;continue;}var oK=oH-1|0,ow=oK;continue c;}default:var oz=0;}if(!oz)var ox=of(oi,ow,oy);}var oo=ox;break;}}var ol=oo;continue a;}}var oL=ol+1|0,ol=oL;continue;}return ol;}}oE(0);return 0;}function qV(oX){var oM=[0,0,0,0];function oV(oR,oS,oN){var oO=41!==oN?1:0,oP=oO?125!==oN?1:0:oO;if(oP){var oQ=97===oN?2:1;if(114===oN)oM[3]=oM[3]+1|0;if(oR)oM[2]=oM[2]+oQ|0;else oM[1]=oM[1]+oQ|0;}return oS+1|0;}oW(oX,oV,function(oT,oU){return oT+1|0;});return oM[1];}function pC(oY,o1,oZ){var o0=oY.safeGet(oZ);if((o0-48|0)<0||9<(o0-48|0))return cW(o1,0,oZ);var o2=o0-48|0,o3=oZ+1|0;for(;;){var o4=oY.safeGet(o3);if(48<=o4){if(!(58<=o4)){var o7=o3+1|0,o6=(10*o2|0)+(o4-48|0)|0,o2=o6,o3=o7;continue;}var o5=0;}else if(36===o4)if(0===o2){var o8=o(bk),o5=1;}else{var o8=cW(o1,[0,ng(o2-1|0)],o3+1|0),o5=1;}else var o5=0;if(!o5)var o8=cW(o1,0,oZ);return o8;}}function px(o9,o_){return o9?o_:cN(ni,o_);}function pm(o$,pa){return o$?o$[1]:pa;}function sg(re,pc,rq,pf,q0,rw,pb){var pd=cN(pc,pb);function rf(pe){return cW(pf,pd,pe);}function qZ(pk,rv,pg,pp){var pj=pg.getLen();function qW(rn,ph){var pi=ph;for(;;){if(pj<=pi)return cN(pk,pd);var pl=pg.safeGet(pi);if(37===pl){var pt=function(po,pn){return caml_array_get(pp,pm(po,pn));},pz=function(pB,pu,pw,pq){var pr=pq;for(;;){var ps=pg.safeGet(pr)-32|0;if(!(ps<0||25<ps))switch(ps){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 10:return pC(pg,function(pv,pA){var py=[0,pt(pv,pu),pw];return pz(pB,px(pv,pu),py,pA);},pr+1|0);default:var pD=pr+1|0,pr=pD;continue;}var pE=pg.safeGet(pr);if(124<=pE)var pF=0;else switch(pE){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var pH=pt(pB,pu),pI=caml_format_int(pG(pE,pg,pi,pr,pw),pH),pK=pJ(px(pB,pu),pI,pr+1|0),pF=1;break;case 69:case 71:case 101:case 102:case 103:var pL=pt(pB,pu),pM=caml_format_float(nO(pg,pi,pr,pw),pL),pK=pJ(px(pB,pu),pM,pr+1|0),pF=1;break;case 76:case 108:case 110:var pN=pg.safeGet(pr+1|0)-88|0;if(pN<0||32<pN)var pO=1;else switch(pN){case 0:case 12:case 17:case 23:case 29:case 32:var pP=pr+1|0,pQ=pE-108|0;if(pQ<0||2<pQ)var pR=0;else{switch(pQ){case 1:var pR=0,pS=0;break;case 2:var pT=pt(pB,pu),pU=caml_format_int(nO(pg,pi,pP,pw),pT),pS=1;break;default:var pV=pt(pB,pu),pU=caml_format_int(nO(pg,pi,pP,pw),pV),pS=1;}if(pS){var pW=pU,pR=1;}}if(!pR){var pX=pt(pB,pu),pW=caml_int64_format(nO(pg,pi,pP,pw),pX);}var pK=pJ(px(pB,pu),pW,pP+1|0),pF=1,pO=0;break;default:var pO=1;}if(pO){var pY=pt(pB,pu),pZ=caml_format_int(pG(110,pg,pi,pr,pw),pY),pK=pJ(px(pB,pu),pZ,pr+1|0),pF=1;}break;case 37:case 64:var pK=pJ(pu,dh(1,pE),pr+1|0),pF=1;break;case 83:case 115:var p0=pt(pB,pu);if(115===pE)var p1=p0;else{var p2=[0,0],p3=0,p4=p0.getLen()-1|0;if(!(p4<p3)){var p5=p3;for(;;){var p6=p0.safeGet(p5),p7=14<=p6?34===p6?1:92===p6?1:0:11<=p6?13<=p6?1:0:8<=p6?1:0,p8=p7?2:caml_is_printable(p6)?1:4;p2[1]=p2[1]+p8|0;var p9=p5+1|0;if(p4!==p5){var p5=p9;continue;}break;}}if(p2[1]===p0.getLen())var p_=p0;else{var p$=caml_create_string(p2[1]);p2[1]=0;var qa=0,qb=p0.getLen()-1|0;if(!(qb<qa)){var qc=qa;for(;;){var qd=p0.safeGet(qc),qe=qd-34|0;if(qe<0||58<qe)if(-20<=qe)var qf=1;else{switch(qe+34|0){case 8:p$.safeSet(p2[1],92);p2[1]+=1;p$.safeSet(p2[1],98);var qg=1;break;case 9:p$.safeSet(p2[1],92);p2[1]+=1;p$.safeSet(p2[1],116);var qg=1;break;case 10:p$.safeSet(p2[1],92);p2[1]+=1;p$.safeSet(p2[1],110);var qg=1;break;case 13:p$.safeSet(p2[1],92);p2[1]+=1;p$.safeSet(p2[1],114);var qg=1;break;default:var qf=1,qg=0;}if(qg)var qf=0;}else var qf=(qe-1|0)<0||56<(qe-1|0)?(p$.safeSet(p2[1],92),p2[1]+=1,p$.safeSet(p2[1],qd),0):1;if(qf)if(caml_is_printable(qd))p$.safeSet(p2[1],qd);else{p$.safeSet(p2[1],92);p2[1]+=1;p$.safeSet(p2[1],48+(qd/100|0)|0);p2[1]+=1;p$.safeSet(p2[1],48+((qd/10|0)%10|0)|0);p2[1]+=1;p$.safeSet(p2[1],48+(qd%10|0)|0);}p2[1]+=1;var qh=qc+1|0;if(qb!==qc){var qc=qh;continue;}break;}}var p_=p$;}var p1=ck(br,ck(p_,bs));}if(pr===(pi+1|0))var qi=p1;else{var qj=nO(pg,pi,pr,pw);try {var qk=0,ql=1;for(;;){if(qj.getLen()<=ql)var qm=[0,0,qk];else{var qn=qj.safeGet(ql);if(49<=qn)if(58<=qn)var qo=0;else{var qm=[0,caml_int_of_string(di(qj,ql,(qj.getLen()-ql|0)-1|0)),qk],qo=1;}else{if(45===qn){var qq=ql+1|0,qp=1,qk=qp,ql=qq;continue;}var qo=0;}if(!qo){var qr=ql+1|0,ql=qr;continue;}}var qs=qm;break;}}catch(qt){if(qt[1]!==a)throw qt;var qs=nr(qj,0,115);}var qu=qs[1],qv=p1.getLen(),qw=0,qA=qs[2],qz=32;if(qu===qv&&0===qw){var qx=p1,qy=1;}else var qy=0;if(!qy)if(qu<=qv)var qx=di(p1,qw,qv);else{var qB=dh(qu,qz);if(qA)dj(p1,qw,qB,0,qv);else dj(p1,qw,qB,qu-qv|0,qv);var qx=qB;}var qi=qx;}var pK=pJ(px(pB,pu),qi,pr+1|0),pF=1;break;case 67:case 99:var qC=pt(pB,pu);if(99===pE)var qD=dh(1,qC);else{if(39===qC)var qE=bT;else if(92===qC)var qE=bU;else{if(14<=qC)var qF=0;else switch(qC){case 8:var qE=bY,qF=1;break;case 9:var qE=bX,qF=1;break;case 10:var qE=bW,qF=1;break;case 13:var qE=bV,qF=1;break;default:var qF=0;}if(!qF)if(caml_is_printable(qC)){var qG=caml_create_string(1);qG.safeSet(0,qC);var qE=qG;}else{var qH=caml_create_string(4);qH.safeSet(0,92);qH.safeSet(1,48+(qC/100|0)|0);qH.safeSet(2,48+((qC/10|0)%10|0)|0);qH.safeSet(3,48+(qC%10|0)|0);var qE=qH;}}var qD=ck(bp,ck(qE,bq));}var pK=pJ(px(pB,pu),qD,pr+1|0),pF=1;break;case 66:case 98:var qJ=pr+1|0,qI=pt(pB,pu)?b2:b1,pK=pJ(px(pB,pu),qI,qJ),pF=1;break;case 40:case 123:var qK=pt(pB,pu),qL=j0(oG,pE,pg,pr+1|0);if(123===pE){var qM=m_(qK.getLen()),qQ=function(qO,qN){nb(qM,qN);return qO+1|0;};oW(qK,function(qP,qS,qR){if(qP)nc(qM,bj);else nb(qM,37);return qQ(qS,qR);},qQ);var qT=na(qM),pK=pJ(px(pB,pu),qT,qL),pF=1;}else{var qU=px(pB,pu),qX=nh(qV(qK),qU),pK=qZ(function(qY){return qW(qX,qL);},qU,qK,pp),pF=1;}break;case 33:cN(q0,pd);var pK=qW(pu,pr+1|0),pF=1;break;case 41:var pK=pJ(pu,bv,pr+1|0),pF=1;break;case 44:var pK=pJ(pu,bu,pr+1|0),pF=1;break;case 70:var q1=pt(pB,pu);if(0===pw)var q2=bt;else{var q3=nO(pg,pi,pr,pw);if(70===pE)q3.safeSet(q3.getLen()-1|0,103);var q2=q3;}var q4=caml_classify_float(q1);if(3===q4)var q5=q1<0?bn:bm;else if(4<=q4)var q5=bo;else{var q6=caml_format_float(q2,q1),q7=0,q8=q6.getLen();for(;;){if(q8<=q7)var q9=ck(q6,bl);else{var q_=q6.safeGet(q7)-46|0,q$=q_<0||23<q_?55===q_?1:0:(q_-1|0)<0||21<(q_-1|0)?1:0;if(!q$){var ra=q7+1|0,q7=ra;continue;}var q9=q6;}var q5=q9;break;}}var pK=pJ(px(pB,pu),q5,pr+1|0),pF=1;break;case 91:var pK=of(pg,pr,pE),pF=1;break;case 97:var rb=pt(pB,pu),rc=cN(ni,pm(pB,pu)),rd=pt(0,rc),rh=pr+1|0,rg=px(pB,rc);if(re)rf(cW(rb,0,rd));else cW(rb,pd,rd);var pK=qW(rg,rh),pF=1;break;case 114:var pK=of(pg,pr,pE),pF=1;break;case 116:var ri=pt(pB,pu),rk=pr+1|0,rj=px(pB,pu);if(re)rf(cN(ri,0));else cN(ri,pd);var pK=qW(rj,rk),pF=1;break;default:var pF=0;}if(!pF)var pK=of(pg,pr,pE);return pK;}},rp=pi+1|0,rm=0;return pC(pg,function(ro,rl){return pz(ro,rn,rm,rl);},rp);}cW(rq,pd,pl);var rr=pi+1|0,pi=rr;continue;}}function pJ(ru,rs,rt){rf(rs);return qW(ru,rt);}return qW(rv,0);}var rx=cW(qZ,rw,ng(0)),ry=qV(pb);if(ry<0||6<ry){var rL=function(rz,rF){if(ry<=rz){var rA=caml_make_vect(ry,0),rD=function(rB,rC){return caml_array_set(rA,(ry-rB|0)-1|0,rC);},rE=0,rG=rF;for(;;){if(rG){var rH=rG[2],rI=rG[1];if(rH){rD(rE,rI);var rJ=rE+1|0,rE=rJ,rG=rH;continue;}rD(rE,rI);}return cW(rx,pb,rA);}}return function(rK){return rL(rz+1|0,[0,rK,rF]);};},rM=rL(0,0);}else switch(ry){case 1:var rM=function(rO){var rN=caml_make_vect(1,0);caml_array_set(rN,0,rO);return cW(rx,pb,rN);};break;case 2:var rM=function(rQ,rR){var rP=caml_make_vect(2,0);caml_array_set(rP,0,rQ);caml_array_set(rP,1,rR);return cW(rx,pb,rP);};break;case 3:var rM=function(rT,rU,rV){var rS=caml_make_vect(3,0);caml_array_set(rS,0,rT);caml_array_set(rS,1,rU);caml_array_set(rS,2,rV);return cW(rx,pb,rS);};break;case 4:var rM=function(rX,rY,rZ,r0){var rW=caml_make_vect(4,0);caml_array_set(rW,0,rX);caml_array_set(rW,1,rY);caml_array_set(rW,2,rZ);caml_array_set(rW,3,r0);return cW(rx,pb,rW);};break;case 5:var rM=function(r2,r3,r4,r5,r6){var r1=caml_make_vect(5,0);caml_array_set(r1,0,r2);caml_array_set(r1,1,r3);caml_array_set(r1,2,r4);caml_array_set(r1,3,r5);caml_array_set(r1,4,r6);return cW(rx,pb,r1);};break;case 6:var rM=function(r8,r9,r_,r$,sa,sb){var r7=caml_make_vect(6,0);caml_array_set(r7,0,r8);caml_array_set(r7,1,r9);caml_array_set(r7,2,r_);caml_array_set(r7,3,r$);caml_array_set(r7,4,sa);caml_array_set(r7,5,sb);return cW(rx,pb,r7);};break;default:var rM=cW(rx,pb,[0]);}return rM;}function su(sd){function sf(sc){return 0;}return sh(sg,0,function(se){return sd;},cy,cu,cF,sf);}function sq(si){return m_(2*si.getLen()|0);}function sn(sl,sj){var sk=na(sj);sj[2]=0;return cN(sl,sk);}function st(sm){var sp=cN(sn,sm);return sh(sg,1,sq,nb,nc,function(so){return 0;},sp);}function sv(ss){return cW(st,function(sr){return sr;},ss);}var sw=[0,0];function sK(sx,sy){var sz=sx[sy+1];if(caml_obj_is_block(sz)){if(caml_obj_tag(sz)===du)return cW(sv,aR,sz);if(caml_obj_tag(sz)===dt){var sA=caml_format_float(b5,sz),sB=0,sC=sA.getLen();for(;;){if(sC<=sB)var sD=ck(sA,b4);else{var sE=sA.safeGet(sB),sF=48<=sE?58<=sE?0:1:45===sE?1:0;if(sF){var sG=sB+1|0,sB=sG;continue;}var sD=sA;}return sD;}}return aQ;}return cW(sv,aS,sz);}function sJ(sH,sI){if(sH.length-1<=sI)return ba;var sL=sJ(sH,sI+1|0);return j0(sv,a$,sK(sH,sI),sL);}function te(sN){var sM=sw[1];for(;;){if(sM){var sS=sM[2],sO=sM[1];try {var sP=cN(sO,sN),sQ=sP;}catch(sT){var sQ=0;}if(!sQ){var sM=sS;continue;}var sR=sQ[1];}else if(sN[1]===b9)var sR=a1;else if(sN[1]===b7)var sR=a0;else if(sN[1]===b8){var sU=sN[2],sV=sU[3],sR=sh(sv,g,sU[1],sU[2],sV,sV+5|0,aZ);}else if(sN[1]===d){var sW=sN[2],sX=sW[3],sR=sh(sv,g,sW[1],sW[2],sX,sX+6|0,aY);}else if(sN[1]===b6){var sY=sN[2],sZ=sY[3],sR=sh(sv,g,sY[1],sY[2],sZ,sZ+6|0,aX);}else{var s0=sN.length-1,s3=sN[0+1][0+1];if(s0<0||2<s0){var s1=sJ(sN,2),s2=j0(sv,aW,sK(sN,1),s1);}else switch(s0){case 1:var s2=aU;break;case 2:var s2=cW(sv,aT,sK(sN,1));break;default:var s2=aV;}var sR=ck(s3,s2);}return sR;}}function tf(tb){var s4=caml_convert_raw_backtrace(caml_get_exception_raw_backtrace(0));if(s4){var s5=s4[1],s6=0,s7=s5.length-1-1|0;if(!(s7<s6)){var s8=s6;for(;;){if(caml_notequal(caml_array_get(s5,s8),a_)){var s9=caml_array_get(s5,s8),s_=0===s9[0]?s9[1]:s9[1],s$=s_?0===s8?a7:a6:0===s8?a5:a4,ta=0===s9[0]?sh(sv,a3,s$,s9[2],s9[3],s9[4],s9[5]):cW(sv,a2,s$);j0(su,tb,a9,ta);}var tc=s8+1|0;if(s7!==s8){var s8=tc;continue;}break;}}var td=0;}else var td=cW(su,tb,a8);return td;}32===dk;function ti(th){var tg=[];caml_update_dummy(tg,[0,tg,tg]);return tg;}var tj=[0,aK],tm=42,tn=[0,mS([0,function(tl,tk){return caml_compare(tl,tk);}])[1]];function tr(to){var tp=to[1];{if(3===tp[0]){var tq=tp[1],ts=tr(tq);if(ts!==tq)to[1]=[3,ts];return ts;}return to;}}function tv(tt){return tr(tt);}var tw=[0,function(tu){te(tu);caml_ml_output_char(cm,10);tf(cm);ct(0);return caml_sys_exit(2);}];function tW(ty,tx){try {var tz=cN(ty,tx);}catch(tA){return cN(tw[1],tA);}return tz;}function tL(tF,tB,tD){var tC=tB,tE=tD;for(;;)if(typeof tC==="number")return tG(tF,tE);else switch(tC[0]){case 1:cN(tC[1],tF);return tG(tF,tE);case 2:var tH=tC[1],tI=[0,tC[2],tE],tC=tH,tE=tI;continue;default:var tJ=tC[1][1];return tJ?(cN(tJ[1],tF),tG(tF,tE)):tG(tF,tE);}}function tG(tM,tK){return tK?tL(tM,tK[1],tK[2]):0;}function tY(tN,tP){var tO=tN,tQ=tP;for(;;)if(typeof tO==="number")return tS(tQ);else switch(tO[0]){case 1:var tR=tO[1];if(tR[4]){tR[4]=0;tR[1][2]=tR[2];tR[2][1]=tR[1];}return tS(tQ);case 2:var tT=tO[1],tU=[0,tO[2],tQ],tO=tT,tQ=tU;continue;default:var tV=tO[2];tn[1]=tO[1];tW(tV,0);return tS(tQ);}}function tS(tX){return tX?tY(tX[1],tX[2]):0;}function t2(t0,tZ){var t1=1===tZ[0]?tZ[1][1]===tj?(tY(t0[4],0),1):0:0;return tL(tZ,t0[2],0);}var t3=[0,0],t4=[0,0,0];function up(t7,t5){var t6=[0,t5],t8=tr(t7),t9=t8[1];switch(t9[0]){case 1:if(t9[1][1]===tj){var t_=0,t$=1;}else var t$=0;break;case 2:var ua=t9[1];t8[1]=t6;var ub=tn[1],uc=t3[1]?1:(t3[1]=1,0);t2(ua,t6);if(uc){tn[1]=ub;var ud=0;}else for(;;){if(0!==t4[1]){if(0===t4[1])throw [0,m$];t4[1]=t4[1]-1|0;var ue=t4[2],uf=ue[2];if(uf===ue)t4[2]=0;else ue[2]=uf[2];var ug=uf[1];t2(ug[1],ug[2]);continue;}t3[1]=0;tn[1]=ub;var ud=0;break;}var t_=ud,t$=1;break;default:var t$=0;}if(!t$)var t_=b_(aL);return t_;}function un(uh,ui){return typeof uh==="number"?ui:typeof ui==="number"?uh:[2,uh,ui];}function uk(uj){if(typeof uj!=="number")switch(uj[0]){case 2:var ul=uj[1],um=uk(uj[2]);return un(uk(ul),um);case 1:break;default:if(!uj[1][1])return 0;}return uj;}var ur=[0,function(uo){return 0;}],uq=ti(0),uu=[0,0],uz=null,uA=Array;function uE(uy){var us=1-(uq[2]===uq?1:0);if(us){var ut=ti(0);ut[1][2]=uq[2];uq[2][1]=ut[1];ut[1]=uq[1];uq[1][2]=ut;uq[1]=uq;uq[2]=uq;uu[1]=0;var uv=ut[2];for(;;){var uw=uv!==ut?1:0;if(uw){if(uv[4])up(uv[3],0);var ux=uv[2],uv=ux;continue;}return uw;}}return us;}var uD=undefined,uC=false;function uF(uB){return uB instanceof uA?0:[0,new MlWrappedString(uB.toString())];}sw[1]=[0,uF,sw[1]];function uI(uG,uH){uG.appendChild(uH);return 0;}var uJ=this,uK=uJ.document;function uS(uL,uM){return uL?cN(uM,uL[1]):0;}function uP(uO,uN){return uO.createElement(uN.toString());}function uT(uR,uQ){return uP(uR,uQ);}var uU=[0,785140586];function uW(uV){return uT(uV,az);}this.HTMLElement===uD;var uX=2147483,uZ=caml_js_get_console(0);ur[1]=function(uY){return 1===uY?(uJ.setTimeout(caml_js_wrap_callback(uE),0),0):0;};function u1(u0){return uZ.log(u0.toString());}tw[1]=function(u2){u1(at);u1(te(u2));return tf(cm);};function u5(u4,u3){return 0===u3?1003109192:1===u3?u4:[0,748545537,[0,u4,u5(u4,u3-1|0)]];}var vw=ap.slice(),vv=[0,257,258,0],vu=303;function vx(u6){throw [0,dv,dK(u6,0)];}function vy(u7){throw [0,dv,dK(u7,0)];}function vz(u8){return 3901498;}function vA(u9){return -941236332;}function vB(u_){return 15949;}function vC(u$){return 17064;}function vD(va){return 3553395;}function vE(vb){return 3802040;}function vF(vc){return 15500;}function vG(vd){return dK(vd,1);}function vH(ve){return [0,926224370,dK(ve,1)];}function vI(vf){return [0,974443759,[0,19065,[0,926224370,dK(vf,1)]]];}function vJ(vg){var vh=dK(vg,2);return [0,974443759,[0,vh,dK(vg,0)]];}function vK(vi){var vj=dK(vi,2);return [0,-783405316,[0,vj,dK(vi,0)]];}function vL(vk){var vl=dK(vk,2);return [0,748545537,[0,vl,dK(vk,0)]];}function vM(vm){var vn=dK(vm,1);return u5(vn,dK(vm,0));}function vN(vo){var vp=dK(vo,0);return caml_string_equal(vp,ar)?19065:caml_string_equal(vp,aq)?1003109192:[0,4298439,vp];}function vO(vq){var vr=dK(vq,2),vs=dK(vq,1);return [0,vs,vr,dK(vq,0)];}var vP=[0,[0,function(vt){return o(as);},vO,vN,vM,vL,vK,vJ,vI,vH,vG,vF,vE,vD,vC,vB,vA,vz,vy,vx],vw,vv,ao,an,am,al,ak,aj,ai,vu,ah,ag,hX,af,ae];function vY(vR){var vQ=0;for(;;){var vS=ds(i,vQ,vR);if(vS<0||20<vS){cN(vR[1],vR);var vQ=vS;continue;}switch(vS){case 1:var vU=vT(vR);break;case 2:var vU=1;break;case 3:var vV=vR[5],vW=vR[6]-vV|0,vX=caml_create_string(vW);caml_blit_string(vR[2],vV,vX,0,vW);var vU=[0,vX];break;case 4:var vU=7;break;case 5:var vU=6;break;case 6:var vU=4;break;case 7:var vU=5;break;case 8:var vU=8;break;case 9:var vU=2;break;case 10:var vU=3;break;case 11:var vU=15;break;case 12:var vU=16;break;case 13:var vU=10;break;case 14:var vU=12;break;case 15:var vU=13;break;case 16:var vU=14;break;case 17:var vU=11;break;case 18:var vU=9;break;case 19:var vU=0;break;case 20:var vU=o(ck(ad,dh(1,vR[2].safeGet(vR[5]))));break;default:var vU=vY(vR);}return vU;}}function vT(v0){var vZ=25;for(;;){var v1=ds(i,vZ,v0);if(v1<0||2<v1){cN(v0[1],v0);var vZ=v1;continue;}switch(v1){case 1:var v2=0;break;case 2:var v2=vT(v0);break;default:var v2=1;}return v2;}}function v6(v3){if(typeof v3==="number")return 1003109192<=v3?ac:ab;var v4=v3[1];if(748545537<=v4){if(926224370<=v4){if(974443759<=v4){var v5=v3[2],v7=v6(v5[2]);return j0(sv,aa,v6(v5[1]),v7);}return cW(sv,$,v6(v3[2]));}if(748545556<=v4)return cW(sv,_,v6(v3[2]));var v8=v3[2],v9=v6(v8[2]);return j0(sv,Z,v6(v8[1]),v9);}if(4298439<=v4)return v3[2];var v_=v3[2],v$=v6(v_[2]);return j0(sv,Y,v6(v_[1]),v$);}var wc=[0,function(wb,wa){return caml_compare(wb,wa);}],wd=mS(wc),we=hW(wc);function wh(wg,wf){return caml_compare(wg,wf);}var wi=hW([0,cN(wd[8],wh)]),wj=hW([0,we[10]]),wk=mS([0,we[10]]);function wy(wq,wn,wm,wl){try {var wo=cW(wn,wm,wl);}catch(wp){if(wp[1]===c)return wq;throw wp;}return wo;}function wz(wu,wv){function ws(wr){if(wr){var wt=ws(wr[2]);return ch(cN(wu,wr[1]),wt);}return wr;}return ws(wv);}var wA=hW([0,function(wx,ww){return caml_compare(wx,ww);}]),wD=hW([0,function(wC,wB){return caml_compare(wC,wB);}]);function wP(wI){var wG=we[1];function wH(wE,wF){return cN(we[4],wE);}return j0(wd[11],wH,wI,wG);}function wQ(wO,wJ){function wN(wK){try {var wL=cW(wd[22],wK,wJ);}catch(wM){if(wM[1]===c)return wK;throw wM;}return wL;}return cW(wd[23],wN,wO);}var wR=[0,Q];function yz(wS,wT){try {var wU=cW(wd[22],wT,wS);}catch(wV){if(wV[1]===c)return wT;throw wV;}return wU;}function yA(w1,w0,w4){var w2=wD[1];function w3(wW){var wX=wW[3],wY=wW[2],wZ=wW[1];return cW(we[3],wX,w0)?cN(wD[4],[0,wZ,wY,w1]):cN(wD[4],[0,wZ,wY,wX]);}return j0(wD[14],w3,w4,w2);}function yB(w5){var w_=w5[1],w9=w5[2];function w$(w6,w7){var w8=b$(w6[3],w7);return b$(w6[1],w8);}return 1+j0(wD[14],w$,w9,w_)|0;}function yo(xa){return [0,-783405316,[0,xa[1],xa[2]]];}function yy(xb){return [0,748545537,[0,xb[1],xb[2]]];}function xu(xd,xc){return wy(we[1],wd[22],xd,xc);}function ys(xe){var xf=xe[3],xg=xe[2],xh=xe[1],xl=we[1];function xm(xi,xj){var xk=cW(we[4],xi[3],xj);return cW(we[4],xi[1],xk);}var xn=j0(wD[14],xm,xg,xl),xq=wd[1];function xr(xo){var xp=cN(we[5],xo);return cW(wd[4],xo,xp);}var xy=j0(we[14],xr,xn,xq);function xz(xs,xv){var xt=xs[1],xw=xu(xt,xv),xx=cW(we[4],xs[3],xw);return j0(wd[4],xt,xx,xv);}var xA=j0(wD[14],xz,xg,xy);for(;;){var xM=wd[1],xN=function(xA){return function(xL,xI,xK){function xH(xB,xG){var xE=xu(xB,xA);function xF(xD,xC){return cW(we[4],xD,xC);}return j0(we[14],xF,xE,xG);}var xJ=j0(we[14],xH,xI,xI);return j0(wd[4],xL,xJ,xK);};}(xA),xO=j0(wd[11],xN,xA,xM);if(j0(wd[9],we[11],xO,xA)){if(xh===xf)return o(P);var xQ=function(xP){return xP[1]===xh?1:0;},xR=cW(wD[17],xQ,xg),xS=cN(wD[20],xR);if(xS){var xT=xS[2],xU=xS[1],xV=xU[3],xW=xU[2];if(xT){var x0=xu(xV,xA),x3=c5(function(xZ,xX){var xY=xu(xX[3],xA);return cW(we[8],xZ,xY);},x0,xT),x4=function(x2){var x1=xu(xf,xA);return 1-cW(we[3],x2,x1);},x5=cW(we[17],x4,x3);if(cN(we[2],x5)){var x6=0,x7=0,x8=[0,[0,xh,xW,xV],xT];for(;;){if(x8){var x9=x8[2],x_=x8[1],x$=x_[3],ya=xu(x$,xA),yb=xu(xV,xA),yc=cW(we[8],yb,ya);if(xV===x$&&cN(we[2],yc))throw [0,d,L];var yf=function(ye){var yd=xu(xf,xA);return 1-cW(we[3],ye,yd);};if(cW(we[16],yf,yc)){var yg=[0,x_,x6],x6=yg,x8=x9;continue;}var yh=[0,x_,x7],x7=yh,x8=x9;continue;}var yi=c4(x7),yj=c4(x6);if(0===yi)throw [0,d,O];if(0===yj){if(yi){var yk=yi[2],yl=yi[1][2];if(yk){var yp=[0,4298439,yl];return c5(function(yn,ym){return yo([0,yn,[0,4298439,ym[2]]]);},yp,yk);}return [0,4298439,yl];}return o(N);}var yr=function(yq){return 1-c6(yq,yi);},yu=ys([0,xh,cW(wD[17],yr,xg),xf]),yv=function(yt){return 1-c6(yt,yj);};return yo([0,ys([0,xh,cW(wD[17],yv,xg),xf]),yu]);}}var yw=cN(we[23],x5),yx=ys([0,yw,xg,xf]);return yy([0,ys([0,xh,xg,yw]),yx]);}return xV===xf?[0,4298439,xW]:yy([0,[0,4298439,xW],ys([0,xV,xg,xf])]);}return o(M);}var xA=xO;continue;}}function BL(yF,yC,yD){if(yC){if(yD)return o(G);var yE=yC[1];}else{if(!yD)return yD;var yE=yD[1];}return [0,yE];}function yS(yK,yG,yI){if(yG){var yH=yG[1];if(yI)return [0,ch(yH,yI[1])];var yJ=yH;}else{if(!yI)return yI;var yJ=yI[1];}return [0,yJ];}function BO(yP,yL,yN){if(yL){var yM=yL[1];if(yN)return [0,cW(wA[7],yM,yN[1])];var yO=yM;}else{if(!yN)return yN;var yO=yN[1];}return [0,yO];}function z$(yR,yQ){return j0(wk[7],yS,yR,yQ);}function zo(zd){var zc=we[1],ze=cW(c5,function(yV,yT){var yU=yT[1],yX=cW(we[7],yV,yT[2]),yW=yU[2],y3=yU[1],y2=we[1];function y4(y1,y0){function yZ(yY){return cN(we[4],yY[2]);}return cW(wA[14],yZ,y0);}var y5=j0(wd[11],y4,yW,y2),y6=wP(yW),y$=cW(we[7],y6,y5);function za(y_,y8,y7){var y9=cW(we[4],y8,y7);return cW(we[4],y_,y9);}var zb=j0(wd[11],za,y3,y$);return cW(we[7],zb,yX);},zc),zf=cN(we[5],zd[1]),zg=j0(wj[14],we[7],zd[3],zf),zm=zd[2];function zn(zi,zj,zh){var zk=cW(we[7],zi,zh),zl=cN(ze,zj);return cW(we[7],zl,zk);}return j0(wk[11],zn,zm,zg);}function z0(zq,zp){var zr=zo(zp),zs=zo(zq),zt=cW(we[8],zs,zr);return cN(we[2],zt);}function Ai(zN,zu,zw){var zv=cN(we[5],zu),zz=cW(wk[22],zv,zw),zA=cP(function(zx){var zy=zx[2];return [0,cW(wd[22],zu,zx[1][2]),zy];},zz),zL=wk[1];function zM(zB,zK){var zC=cN(we[23],zB),zE=wd[1];function zF(zD){return cW(wd[4],zD,zC);}var zI=j0(we[14],zF,zB,zE),zJ=cP(function(zG){var zH=zG[2];return [0,[0,zI,cW(wd[5],zC,zG[1])],zH];},zA);return j0(wk[4],zB,zJ,zK);}return j0(wj[14],zM,zN,zL);}function zR(zS,zO){if(typeof zO!=="number"){var zP=zO[1];if(!(748545537<=zP)){if(4298439<=zP){var Aw=cN(we[5],zS),Ax=cN(we[5],zS+1|0),Ay=cW(wd[5],zS,zS),Az=cN(wA[5],[0,zO[2],zS+1|0]),AA=[0,[0,[0,Ay,cW(wd[5],zS,Az)],Ax],0],AB=cW(wk[5],Aw,AA);return [0,[0,zS,AB,cN(wj[5],Ax)],zS+2|0];}var AC=zO[2],AD=zR(zS,AC[1]),AE=zR(AD[2],AC[2]),AF=AE[1],AG=AD[1],AH=AF[3],AI=AF[2],AJ=AF[1],AK=AG[3],AL=AG[2],AM=AG[1],AN=AE[2];if(z0(AG,AF)){var AS=wj[1],AT=function(AP){function AR(AO){var AQ=cW(we[7],AP,AO);return cN(wj[4],AQ);}return cW(wj[14],AR,AH);},AU=j0(wj[14],AT,AK,AS),AV=cW(wd[5],AM,AM),AW=cN(we[5],AM),AX=cW(wk[22],AW,AL),AY=cN(we[5],AJ),A7=cW(wk[22],AY,AI),A9=0,A_=c5(function(A8,AZ){var A0=AZ[2],A4=cW(wd[22],AM,AZ[1][2]);return c5(function(A6,A1){var A2=cW(wd[22],AJ,A1[1][2]),A3=cW(we[7],A0,A1[2]),A5=cW(wA[7],A4,A2);return [0,[0,[0,AV,cW(wd[5],AM,A5)],A3],A6];},A8,A7);},A9,AX),A$=cN(we[5],AM),Ba=cW(wk[5],A$,A_),Bb=cN(we[5],AM),Bc=cW(wk[6],Bb,AL),Bd=cN(we[5],AJ),Be=cW(wk[6],Bd,AI),Bq=wk[1],Br=function(Bh){function Bp(Bn,Bl){var Bk=0,Bm=c5(function(Bj,Bf){var Bg=Bf[1],Bi=cW(we[7],Bh,Bf[2]);return [0,[0,[0,Bg[1],Bg[2]],Bi],Bj];},Bk,Bl),Bo=cW(we[7],Bh,Bn);return cW(wk[4],Bo,Bm);}return cW(wk[11],Bp,Be);},Bs=j0(wj[14],Br,AK,Bq),BE=wk[1],BF=function(Bv){function BD(BB,Bz){var By=0,BA=c5(function(Bx,Bt){var Bu=Bt[1],Bw=cW(we[7],Bv,Bt[2]);return [0,[0,[0,Bu[1],Bu[2]],Bw],Bx];},By,Bz),BC=cW(we[7],Bv,BB);return cW(wk[4],BC,BA);}return cW(wk[11],BD,Bc);},BG=j0(wj[14],BF,AH,BE),B1=wk[1],B2=function(BW,BT,B0){function BZ(BV,BQ,BY){var BS=0,BU=c5(function(BR,BJ){return c5(function(BP,BH){var BI=BH[1],BK=BJ[1],BM=j0(wd[7],BL,BK[1],BI[1]),BN=cW(we[7],BJ[2],BH[2]);return [0,[0,[0,BM,j0(wd[7],BO,BK[2],BI[2])],BN],BP];},BR,BQ);},BS,BT),BX=cW(we[7],BW,BV);return j0(wk[4],BX,BU,BY);}return j0(wk[11],BZ,Be,B0);},B3=z$(Ba,j0(wk[11],B2,Bc,B1));return [0,[0,AM,z$(z$(Bs,BG),B3),AU],AN];}throw [0,d,J];}if(926224370<=zP){if(974443759<=zP){var zQ=zO[2],zT=zR(zS,zQ[1]),zU=zR(zT[2],zQ[2]),zV=zU[1],zW=zT[1],zX=zV[2],zY=zV[1],zZ=zW[1],z1=zU[2];if(z0(zW,zV)){var z2=cN(we[5],zY),z7=cW(wk[22],z2,zX),z8=cP(function(z3){var z4=cW(wd[5],zZ,zZ),z5=cW(wd[22],zY,z3[1][2]),z6=cW(wd[5],zZ,z5);return [0,[0,z4,z6],z3[2]];},z7),z9=cN(we[5],zY),z_=cW(wk[6],z9,zX),Aa=z$(zW[2],z_),Ab=cN(we[5],zZ),Ac=z$(cW(wk[5],Ab,z8),Aa);return [0,[0,zZ,Ac,cW(wj[7],zW[3],zV[3])],z1];}throw [0,d,H];}var Ad=zR(zS,zO[2]),Ae=Ad[1],Af=Ae[3],Ag=Ae[2],Ah=Ae[1],Aj=Ad[2];return [0,[0,Ah,z$(Ag,Ai(Af,Ah,Ag)),Af],Aj];}if(!(748545556<=zP)){var Ak=zO[2],Al=zR(zS,Ak[1]),Am=zR(Al[2],Ak[2]),An=Am[1],Ao=Al[1],Ap=An[2],Aq=An[1],Ar=Am[2];if(z0(Ao,An)){var As=Ai(Ao[3],Aq,Ap),At=cN(we[5],Aq),Au=cW(wk[6],At,Ap),Av=z$(As,z$(Ao[2],Au));return [0,[0,Ao[1],Av,An[3]],Ar];}throw [0,d,I];}}return o(K);}function ED(B4){return zR(0,B4)[1];}function FR(B6,B5){var B7=B6[1],Cc=B5[3],Cb=B5[2],Ca=B6[3],B$=B6[2],Cd=hW([0,function(B9,B8){var B_=cW(we[10],B9[1],B8[1]);return 0===B_?cW(wi[10],B9[2],B8[2]):B_;}]);function Ez(Ce){var Cf=Ce[3],Cg=Cf[2],Ch=Cf[1],Ci=Ce[2],Cj=Ce[1],Ck=Cj[3];if(cW(Cd[3],[0,Ch,Cg],Ci))return 0;var Cl=cW(Cd[4],[0,Ch,Cg],Ci);if(cW(wj[3],Ch,Ca)){var Co=function(Cm){var Cn=wP(Cm);return cW(wj[3],Cn,Cc);},Cp=cW(wi[16],Co,Cg);}else var Cp=1;if(Cp){var Cq=wy(0,wk[22],Ch,B$);return 0===Cq?0:cP(function(Cr){var Cs=Cr[1],Ct=Cs[1],Cu=Cj[3],Cv=Cj[2],Cw=Cj[1],Cx=Cs[2],Cz=yB([0,Cw,Cv,Cu]),Cy=cN(yz,Ct),CH=wd[1];function CI(CA,CE,CC){var CB=cN(Cy,CA),CD=wy(we[1],wd[22],CB,CC),CF=cW(we[4],CE,CD),CG=cN(Cy,CA);return j0(wd[4],CG,CF,CC);}var CL=j0(wd[11],CI,Cu,CH);function CM(CK,CJ){return 1<cN(we[19],CJ)?1:0;}var CN=cW(wd[14],CM,CL),CO=wP(Ct);function CR(CP,CQ){return 1-cW(we[3],CP,CO);}var CX=cW(wd[14],CR,Cu);function CY(CS,CW){try {var CT=cN(Cy,CS),CU=cW(wd[22],CT,Cu);}catch(CV){if(CV[1]===c)return CW;throw CV;}return CU;}var CZ=cW(wd[24],CY,Cu);function C3(C0,C2,C1){return yA(cW(wd[22],C0,CZ),C2,C1);}var Dk=[0,j0(wd[11],C3,CN,Cv),CX,Cz];function Dl(C4,Dj,C6){var C5=cN(Cy,C4),C7=cW(wd[22],C5,CZ),Dh=[0,C6[1],C6[2],C6[3]];function Di(C$,C8){var C9=C8[3],C_=C8[2],Da=C$[2];try {var Db=[0,cW(wd[22],Da,C_),C9],Dc=Db;}catch(Dd){if(Dd[1]!==c)throw Dd;var Dc=[0,C9,C9+1|0];}var De=Dc[1],Df=Dc[2],Dg=j0(wd[4],Da,De,C_);return [0,cW(wD[4],[0,C7,C$[1],De],C8[1]),Dg,Df];}return j0(wA[14],Di,Dj,Dh);}var Dm=j0(wd[11],Dl,Cx,Dk),Dn=[0,Cw,Dm[1],Dm[2]],Dq=wi[1];function Dr(Do){var Dp=wQ(wQ(Do,Ct),Ck);return cN(wi[4],Dp);}var Ds=j0(wi[14],Dr,Cg,Dq),D_=wi[1];function D$(Dt,D9){var Du=wP(Dt),D8=wy(0,wk[22],Du,Cb);return c5(function(D7,Dv){var Dw=Dv[1],Dx=Dw[1],Dy=Dn[2],DA=cN(yz,Dx);function DD(Dz,DC){var DB=cN(DA,Dz);return cW(wd[22],DB,Dt)!==DC?1:0;}if(cW(wd[13],DD,Dt))var DE=wi[1];else{var DH=function(DF,DG){return 1-cW(wd[3],DF,Dx);},DI=cW(wd[14],DH,Dt),DJ=cN(wi[5],DI),D5=Dw[2],D6=function(DL,D4){function D3(DK,D2){var DV=DK[2],DP=DK[1],D0=wi[1];function D1(DU){var DM=cW(wd[22],DL,Dt),DR=wi[1];function DS(DN){var DO=DN[1]===DM?1:0,DQ=DO?caml_string_equal(DP,DN[2]):DO;return DQ;}var DX=cW(wD[17],DS,Dy);function DY(DT){var DW=j0(wd[4],DV,DT[3],DU);return cN(wi[4],DW);}var DZ=j0(wD[14],DY,DX,DR);return cN(wi[7],DZ);}return j0(wi[14],D1,D2,D0);}return cW(wA[14],D3,D4);},DE=j0(wd[11],D6,D5,DJ);}return cW(wi[7],D7,DE);},D9,D8);}var Ea=j0(wi[14],D$,Ds,D_),Ee=Dn[3],Ed=wd[1];function Ef(Eb,Ec){return cW(wd[4],Ec,Eb);}var Eg=j0(wd[11],Ef,Ee,Ed),Ej=wi[1];function Ek(Eh){var Ei=wQ(Eh,Eg);return cN(wi[4],Ei);}var El=j0(wi[14],Ek,Ea,Ej);return [0,Dn,Cl,[0,Cr[2],El]];},Cq);}var Em=Cj[3],En=Cj[2],Eo=Cj[1],Ep=yB([0,Eo,En,Em]),Er=we[1],Es=function(Eq){return we[4];};throw [0,wR,ys([0,Eo,yA(Ep,j0(wd[11],Es,Em,Er),En),Ep])];}try {var Et=cW(wd[5],B5[1],B7),Eu=cN(wi[5],Et),Ev=[0,cN(we[5],B7),Eu],Ew=Cd[1],Ex=cW(wd[5],B7,0),Ey=[0,[0,[0,0,wD[1],Ex],Ew,Ev],0];for(;;){var EA=wz(Ez,Ey);if(EA){var Ey=EA;continue;}var EB=0;break;}}catch(EC){if(EC[1]===wR)return [0,EC[2]];throw EC;}return EB;}function FS(EG,EJ,EI,EF,EE){var EH=cW(EG,EF,EE);return EH?[0,0,EK(sv,C,EJ,EI,v6(EH[1]))]:[0,1,j0(sv,B,EJ,EI)];}function FT(Fp,FA,EL){var EV=[0],EU=1,ET=0,ES=0,ER=0,EQ=0,EP=0,EO=EL.getLen(),EN=ck(EL,bQ),EW=[0,function(EM){EM[9]=1;return 0;},EN,EO,EP,EQ,ER,ES,ET,EU,EV,f,f],E3=dx[11],E2=dx[14],E1=dx[6],E0=dx[15],EZ=dx[7],EY=dx[8],EX=dx[16];dx[6]=dx[14]+1|0;dx[7]=2;dx[10]=EW[12];try {var E4=0,E5=0;for(;;)switch(caml_parse_engine(vP,dx,E4,E5)){case 1:throw [0,dw];case 2:dG(0);var E7=0,E6=2,E4=E6,E5=E7;continue;case 3:dG(0);var E9=0,E8=3,E4=E8,E5=E9;continue;case 4:try {var E_=[0,4,cN(caml_array_get(vP[1],dx[13]),dx)],E$=E_;}catch(Fa){if(Fa[1]!==dw)throw Fa;var E$=[0,5,0];}var Fc=E$[2],Fb=E$[1],E4=Fb,E5=Fc;continue;case 5:cN(vP[14],bP);var Fe=0,Fd=5,E4=Fd,E5=Fe;continue;default:var Ff=vY(EW);dx[9]=EW[11];dx[10]=EW[12];var Fg=1,E4=Fg,E5=Ff;continue;}}catch(Fi){var Fh=dx[7];dx[11]=E3;dx[14]=E2;dx[6]=E1;dx[15]=E0;dx[7]=EZ;dx[8]=EY;dx[16]=EX;if(Fi[1]===dv){var Fj=Fi[2],Fk=Fj[3],Fl=Fj[2],Fm=Fj[1],Fn=v6(Fk),Fo=v6(Fl),Fq=cN(Fp,Fk),Fr=cN(Fp,Fl),Fy=function(Fs){return [0,1-Fs[1],Fs[2]];},Fz=function(Fu,Ft){var Fw=ck(Fu[2],Ft[2]),Fv=Fu[1],Fx=Fv?Ft[1]:Fv;return [0,Fx,Fw];};if(17064<=Fm)if(3802040<=Fm)if(3901498<=Fm){var FB=Fy(EK(FA,Fo,Fn,Fr,Fq)),FC=FB[2],FD=FB[1];if(FD)var FE=[0,FD,FC];else{var FF=Fy(EK(FA,Fn,Fo,Fq,Fr)),FG=ck(FC,FF[2]),FE=[0,FF[1],FG];}var FH=FE;}else var FH=EK(FA,Fo,Fn,Fr,Fq);else if(3553395<=Fm)var FH=EK(FA,Fn,Fo,Fq,Fr);else{var FI=Fy(EK(FA,Fn,Fo,Fq,Fr)),FH=Fz(EK(FA,Fo,Fn,Fr,Fq),FI);}else if(15500===Fm){var FJ=EK(FA,Fn,Fo,Fq,Fr),FH=Fz(EK(FA,Fo,Fn,Fr,Fq),FJ);}else if(15949<=Fm){var FK=EK(FA,Fn,Fo,Fq,Fr),FH=Fz(Fy(EK(FA,Fo,Fn,Fr,Fq)),FK);}else{var FL=Fy(EK(FA,Fn,Fo,Fq,Fr)),FH=Fz(Fy(EK(FA,Fo,Fn,Fr,Fq)),FL);}var FM=FH[1],FO=FH[2],FN=FM?F:E,FP=17064<=Fm?3802040<=Fm?3901498<=Fm?X:W:3553395<=Fm?V:U:15500===Fm?R:15949<=Fm?T:S;return [0,FM,sh(sv,D,Fo,FP,Fn,FN,FO)];}dL[1]=function(FQ){return caml_obj_is_block(FQ)?caml_array_get(vP[3],caml_obj_tag(FQ))===Fh?1:0:caml_array_get(vP[2],FQ)===Fh?1:0;};throw Fi;}}var Gv=cW(FT,ED,cN(FS,FR));function Gu(FU){function FY(FX,FZ,FV){try {var FW=FU.safeGet(FV),F0=10===FW?caml_string_equal(FX,s)?FY(r,FZ,FV+1|0):FY(q,[0,FX,FZ],FV+1|0):(j.safeSet(0,FW),FY(ck(FX,j),FZ,FV+1|0));}catch(F1){if(F1[1]===b)return c4([0,FX,FZ]);throw F1;}return F0;}return FY(p,0,0);}function Gw(F3,F2){try {var F4=cN(F3,F2);}catch(F5){if(F5[1]===dw)return t;throw F5;}return F4;}function HA(Hz){var F6=uK.getElementById(z.toString());if(F6==uz)throw [0,d,A];var F7=uT(uK,ax),F8=uT(uK,ay),F9=uW(uK),F_=0,F$=0;for(;;){if(0===F$&&0===F_){var Ga=uP(uK,h),Gb=1;}else var Gb=0;if(!Gb){var Gc=uU[1];if(785140586===Gc){try {var Gd=uK.createElement(aC.toString()),Ge=aB.toString(),Gf=Gd.tagName.toLowerCase()===Ge?1:0,Gg=Gf?Gd.name===aA.toString()?1:0:Gf,Gh=Gg;}catch(Gj){var Gh=0;}var Gi=Gh?982028505:-1003883683;uU[1]=Gi;continue;}if(982028505<=Gc){var Gk=new uA();Gk.push(aF.toString(),h.toString());uS(F$,function(Gl){Gk.push(aG.toString(),caml_js_html_escape(Gl),aH.toString());return 0;});uS(F_,function(Gm){Gk.push(aI.toString(),caml_js_html_escape(Gm),aJ.toString());return 0;});Gk.push(aE.toString());var Ga=uK.createElement(Gk.join(aD.toString()));}else{var Gn=uP(uK,h);uS(F$,function(Go){return Gn.type=Go;});uS(F_,function(Gp){return Gn.name=Gp;});var Ga=Gn;}}Ga.rows=20;Ga.cols=50;var Gq=uW(uK);Gq.style.border=y.toString();Gq.style.padding=x.toString();Gq.style.width=w.toString();uI(F6,F7);uI(F7,F8);uI(F8,F9);uI(F9,Ga);uI(F8,Gq);var GM=function(Gs,GL){var Gr=new MlWrappedString(Ga.value);if(caml_string_notequal(Gr,Gs)){try {var Gt=uT(uK,au),Gx=Gu(Gr),GB=cP(cN(Gw,Gv),Gx),GD=wz(function(Gy){var Gz=Gy[2],GA=caml_string_notequal(Gz,u);return GA?Gu(Gz):GA;},GB),GE=cP(function(GC){return GC.toString();},GD);for(;;){if(GE){var GH=GE[2],GG=GE[1],GF=uT(uK,aw);GF.innerHTML=GG;uI(Gt,GF);uI(Gt,uT(uK,av));var GE=GH;continue;}var GI=Gq.firstChild;if(GI!=uz)Gq.removeChild(GI);uI(Gq,Gt);break;}}catch(GK){}var GJ=20;}else var GJ=b$(0,GL-1|0);function GO(GN){return GM(Gr,GJ);}var GP=0===GJ?0.5:0.1,GQ=[0,[2,[0,1,0,0,0]]],GR=[0,0];function GW(GS,GY){var GT=uX<GS?[0,uX,GS-uX]:[0,GS,0],GU=GT[2],GX=GT[1],GV=GU==0?cN(up,GQ):cN(GW,GU);GR[1]=[0,uJ.setTimeout(caml_js_wrap_callback(GV),GX*1e3)];return 0;}GW(GP,0);function G1(G0){var GZ=GR[1];return GZ?uJ.clearTimeout(GZ[1]):0;}var G2=tv(GQ)[1];switch(G2[0]){case 1:var G3=G2[1][1]===tj?(tW(G1,0),1):0;break;case 2:var G4=G2[1],G5=[0,tn[1],G1],G6=G4[4],G7=typeof G6==="number"?G5:[2,G5,G6];G4[4]=G7;var G3=1;break;default:var G3=0;}var G8=tv(GQ),G9=G8[1];switch(G9[0]){case 1:var G_=[0,G9];break;case 2:var G$=G9[1],Ha=[0,[2,[0,[0,[0,G8]],0,0,0]]],Hc=tn[1],Hw=[1,function(Hb){switch(Hb[0]){case 0:var Hd=Hb[1];tn[1]=Hc;try {var He=GO(Hd),Hf=He;}catch(Hg){var Hf=[0,[1,Hg]];}var Hh=tv(Ha),Hi=tv(Hf),Hj=Hh[1];{if(2===Hj[0]){var Hk=Hj[1];if(Hh===Hi)var Hl=0;else{var Hm=Hi[1];if(2===Hm[0]){var Hn=Hm[1];Hi[1]=[3,Hh];Hk[1]=Hn[1];var Ho=un(Hk[2],Hn[2]),Hp=Hk[3]+Hn[3]|0;if(tm<Hp){Hk[3]=0;Hk[2]=uk(Ho);}else{Hk[3]=Hp;Hk[2]=Ho;}var Hq=Hn[4],Hr=Hk[4],Hs=typeof Hr==="number"?Hq:typeof Hq==="number"?Hr:[2,Hr,Hq];Hk[4]=Hs;var Hl=0;}else{Hh[1]=Hm;var Hl=t2(Hk,Hm);}}return Hl;}throw [0,d,aM];}case 1:var Ht=tv(Ha),Hu=Ht[1];{if(2===Hu[0]){var Hv=Hu[1];Ht[1]=Hb;return t2(Hv,Hb);}throw [0,d,aN];}default:throw [0,d,aP];}}],Hx=G$[2],Hy=typeof Hx==="number"?Hw:[2,Hw,Hx];G$[2]=Hy;var G_=Ha;break;case 3:throw [0,d,aO];default:var G_=GO(G9[1]);}return G_;};GM(v,0);return uC;}}uJ.onload=caml_js_wrap_callback(function(HB){if(HB){var HC=HA(HB);if(!(HC|0))HB.preventDefault();return HC;}var HD=event,HE=HA(HD);if(!(HE|0))HD.returnValue=HE;return HE;});ct(0);return;}());
