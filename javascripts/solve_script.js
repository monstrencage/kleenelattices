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
(function(){function si(If,Ig,Ih,Ii,Ij,Ik,Il){return If.length==6?If(Ig,Ih,Ii,Ij,Ik,Il):caml_call_gen(If,[Ig,Ih,Ii,Ij,Ik,Il]);}function E8(Ia,Ib,Ic,Id,Ie){return Ia.length==4?Ia(Ib,Ic,Id,Ie):caml_call_gen(Ia,[Ib,Ic,Id,Ie]);}function j1(H8,H9,H_,H$){return H8.length==3?H8(H9,H_,H$):caml_call_gen(H8,[H9,H_,H$]);}function cX(H5,H6,H7){return H5.length==2?H5(H6,H7):caml_call_gen(H5,[H6,H7]);}function cO(H3,H4){return H3.length==1?H3(H4):caml_call_gen(H3,[H4]);}var a=[0,new MlString("Failure")],b=[0,new MlString("Invalid_argument")],c=[0,new MlString("Not_found")],d=[0,new MlString("Assert_failure")],e=[0,new MlString(""),0,0,-1],f=[0,new MlString(""),1,0,0],g=new MlString("File \"%s\", line %d, characters %d-%d: %s"),h=new MlString("textarea"),i=[0,new MlString("\0\0\xeb\xff\xec\xff\x02\0\x1e\0L\0\xf5\xff\xf6\xff\xf7\xff\xf8\xff\xf9\xff\xfa\xff\xfb\xffM\0\xfd\xff\x0b\0\xbf\0\xfe\xff\x03\0 \0\xf4\xff\xf3\xff\xef\xff\xf2\xff\xee\xff\x01\0\xfd\xff\xfe\xff\xff\xff"),new MlString("\xff\xff\xff\xff\xff\xff\x0f\0\x0e\0\x12\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x03\0\xff\xff\x14\0\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString("\x01\0\0\0\0\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\xff\xff\xff\xff\0\0\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\x1a\0\0\0\0\0\0\0"),new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\x0e\0\x1c\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\b\0\0\0\x07\0\x06\0\f\0\x0b\0\x10\0\0\0\t\0\x0f\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x11\0\0\0\x04\0\x05\0\x03\0\x18\0\x15\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x17\0\x16\0\x14\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x12\0\n\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\x13\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x10\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x02\0\x1b\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"),new MlString("\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\0\0\x19\0\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x0f\0\xff\xff\0\0\0\0\0\0\x03\0\x12\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x13\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x05\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\x05\0\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x10\0\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\x19\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString("")],j=new MlString(" ");caml_register_global(6,c);caml_register_global(5,[0,new MlString("Division_by_zero")]);caml_register_global(3,b);caml_register_global(2,a);var b_=[0,new MlString("Out_of_memory")],b9=[0,new MlString("Match_failure")],b8=[0,new MlString("Stack_overflow")],b7=[0,new MlString("Undefined_recursive_module")],b6=new MlString("%.12g"),b5=new MlString("."),b4=new MlString("%d"),b3=new MlString("true"),b2=new MlString("false"),b1=new MlString("Pervasives.do_at_exit"),b0=new MlString("Array.blit"),bZ=new MlString("\\b"),bY=new MlString("\\t"),bX=new MlString("\\n"),bW=new MlString("\\r"),bV=new MlString("\\\\"),bU=new MlString("\\'"),bT=new MlString("String.blit"),bS=new MlString("String.sub"),bR=new MlString(""),bQ=new MlString("syntax error"),bP=new MlString("Parsing.YYexit"),bO=new MlString("Parsing.Parse_error"),bN=new MlString("Set.remove_min_elt"),bM=[0,0,0,0],bL=[0,0,0],bK=new MlString("Set.bal"),bJ=new MlString("Set.bal"),bI=new MlString("Set.bal"),bH=new MlString("Set.bal"),bG=new MlString("Map.remove_min_elt"),bF=[0,0,0,0],bE=[0,new MlString("map.ml"),270,10],bD=[0,0,0],bC=new MlString("Map.bal"),bB=new MlString("Map.bal"),bA=new MlString("Map.bal"),bz=new MlString("Map.bal"),by=new MlString("Queue.Empty"),bx=new MlString("Buffer.add: cannot grow buffer"),bw=new MlString(""),bv=new MlString(""),bu=new MlString("%.12g"),bt=new MlString("\""),bs=new MlString("\""),br=new MlString("'"),bq=new MlString("'"),bp=new MlString("nan"),bo=new MlString("neg_infinity"),bn=new MlString("infinity"),bm=new MlString("."),bl=new MlString("printf: bad positional specification (0)."),bk=new MlString("%_"),bj=[0,new MlString("printf.ml"),143,8],bi=new MlString("'"),bh=new MlString("Printf: premature end of format string '"),bg=new MlString("'"),bf=new MlString(" in format string '"),be=new MlString(", at char number "),bd=new MlString("Printf: bad conversion %"),bc=new MlString("Sformat.index_of_int: negative argument "),bb=new MlString(""),ba=new MlString(", %s%s"),a$=[1,1],a_=new MlString("%s\n"),a9=new MlString("(Program not linked with -g, cannot print stack backtrace)\n"),a8=new MlString("Raised at"),a7=new MlString("Re-raised at"),a6=new MlString("Raised by primitive operation at"),a5=new MlString("Called from"),a4=new MlString("%s file \"%s\", line %d, characters %d-%d"),a3=new MlString("%s unknown location"),a2=new MlString("Out of memory"),a1=new MlString("Stack overflow"),a0=new MlString("Pattern matching failed"),aZ=new MlString("Assertion failed"),aY=new MlString("Undefined recursive module"),aX=new MlString("(%s%s)"),aW=new MlString(""),aV=new MlString(""),aU=new MlString("(%s)"),aT=new MlString("%d"),aS=new MlString("%S"),aR=new MlString("_"),aQ=[0,new MlString("src/core/lwt.ml"),648,20],aP=[0,new MlString("src/core/lwt.ml"),651,8],aO=[0,new MlString("src/core/lwt.ml"),498,8],aN=[0,new MlString("src/core/lwt.ml"),487,9],aM=new MlString("Lwt.wakeup_result"),aL=new MlString("Lwt.Canceled"),aK=new MlString("\""),aJ=new MlString(" name=\""),aI=new MlString("\""),aH=new MlString(" type=\""),aG=new MlString("<"),aF=new MlString(">"),aE=new MlString(""),aD=new MlString("<input name=\"x\">"),aC=new MlString("input"),aB=new MlString("x"),aA=new MlString("td"),az=new MlString("tr"),ay=new MlString("table"),ax=new MlString("a"),aw=new MlString("br"),av=new MlString("p"),au=new MlString("Exception during Lwt.async: "),at=new MlString("parser"),as=new MlString("1"),ar=new MlString("0"),aq=[0,0,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,0],ap=new MlString("\xff\xff\x02\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\0\0\0\0"),ao=new MlString("\x02\0\x03\0\x01\0\x02\0\x03\0\x03\0\x03\0\x02\0\x02\0\x03\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x02\0\x02\0"),an=new MlString("\0\0\0\0\0\0\0\0\x02\0\0\0\0\0\0\0\x12\0\0\0\x03\0\0\0\0\0\b\0\x07\0\0\0\n\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\0\0\t\0\0\0\0\0\0\0\0\0"),am=new MlString("\x03\0\x06\0\b\0\x17\0"),al=new MlString("\x05\0\x01\xff\x01\xff\0\0\0\0\x01\xff\n\xff\x18\xff\0\0'\xff\0\0\x01\xff\x01\xff\0\0\0\0\x01\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x01\xff\0\x000\xff<\xff4\xff\n\xff"),ak=new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x1d\0\x01\0\x0f\0\b\0"),aj=new MlString("\0\0\xfe\xff\0\0\0\0"),ai=new MlString("\x07\0\x04\0\x04\0\t\0\x11\0\x05\0\x01\0\x02\0\x01\0\x19\0\x1a\0\0\0\n\0\x1b\0\0\0\x05\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x1c\0\0\0\0\0\0\0\0\0\n\0\0\0\0\0\x06\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\x11\0\x12\0\x13\0\x14\0\x15\0\n\0\x16\0\0\0\x18\0\x0b\0\f\0\r\0\x0e\0\x0f\0\n\0\0\0\0\0\0\0\n\0\f\0\r\0\x0e\0\x0f\0\f\0\r\0\x0e\0\n\0\0\0\0\0\0\0\0\0\0\0\r\0\x0e\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x04\0\0\0\0\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\0\0\x04\0\x05\0\x05\0\0\0\0\0\0\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\0\0\x05\0\x06\0\x06\0\0\0\0\0\0\0\0\0\x06\0\x06\0\x06\0\x06\0\x06\0\x06\0\0\0\x06\0"),ah=new MlString("\x02\0\0\0\x01\x01\x05\0\0\0\x04\x01\x01\0\x02\0\0\0\x0b\0\f\0\xff\xff\x02\x01\x0f\0\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x17\0\xff\xff\xff\xff\xff\xff\xff\xff\x02\x01\xff\xff\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\x02\x01\x12\x01\xff\xff\x05\x01\x06\x01\x07\x01\b\x01\t\x01\n\x01\x02\x01\xff\xff\xff\xff\xff\xff\x02\x01\x07\x01\b\x01\t\x01\n\x01\x07\x01\b\x01\t\x01\x02\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\b\x01\t\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x05\x01\x06\x01\x07\x01\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\xff\xff\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01"),ag=new MlString("EOF\0NEWLINE\0LPAR\0RPAR\0PLUS\0DOT\0PSTAR\0STAR\0INTER\0EGAL\0LEQ\0GEQ\0LT\0GT\0IMCOMP\0DUNNO\0DIFF\0"),af=new MlString("VAR\0POWER\0"),ae=new MlString("lexing error"),ad=new MlString("\xc3\xb8"),ac=new MlString("\xce\xb5"),ab=new MlString("(%s | %s)"),aa=new MlString("(%s)+"),$=new MlString("(%s)~"),_=new MlString("%s.%s"),Z=new MlString("(%s & %s)"),Y=new MlString("=/="),X=new MlString("<="),W=new MlString(">="),V=new MlString("<"),U=new MlString(">"),T=new MlString("<>"),S=new MlString("="),R=new MlString("Tools.ContreExemple"),Q=new MlString("get_expr : empty word"),P=[0,new MlString("word.ml"),260,4],O=new MlString("get_expr : stuck"),N=new MlString("get_expr : stuck"),M=[0,new MlString("word.ml"),210,15],L=new MlString("Lts.trad : unsupported operation"),K=[0,new MlString("lts.ml"),143,2],J=[0,new MlString("lts.ml"),99,2],I=[0,new MlString("lts.ml"),63,2],H=new MlString("mergeint : conflict"),G=new MlString("OK"),F=new MlString("Incorrect"),E=new MlString("%s %s %s --------- %s\n%s\n\n"),D=new MlString("\n%s <= %s -- false : %s"),C=new MlString("\n%s <= %s -- true"),B=[0,new MlString("wmain.ml"),61,17],A=new MlString("zob"),z=new MlString("1px black dashed"),y=new MlString("5px"),x=new MlString("400px"),w=new MlString(""),v=new MlString(""),u=[0,0,new MlString("")],t=new MlString(""),s=new MlString(""),r=new MlString(""),q=new MlString(""),p=new MlString("(a|b)+.C & d > d & a.b.C & (d|a)\n");function o(k){throw [0,a,k];}function b$(l){throw [0,b,l];}function ca(n,m){return caml_greaterequal(n,m)?n:m;}function cl(cb,cd){var cc=cb.getLen(),ce=cd.getLen(),cf=caml_create_string(cc+ce|0);caml_blit_string(cb,0,cf,0,cc);caml_blit_string(cd,0,cf,cc,ce);return cf;}function cm(cg){return caml_format_int(b4,cg);}function ci(ch,cj){if(ch){var ck=ch[1];return [0,ck,ci(ch[2],cj)];}return cj;}var cn=caml_ml_open_descriptor_out(2);function cv(cp,co){return caml_ml_output(cp,co,0,co.getLen());}function cu(ct){var cq=caml_ml_out_channels_list(0);for(;;){if(cq){var cr=cq[2];try {}catch(cs){}var cq=cr;continue;}return 0;}}caml_register_named_value(b1,cu);function cz(cx,cw){return caml_ml_output_char(cx,cw);}function cG(cy){return caml_ml_flush(cy);}function cF(cC,cB,cE,cD,cA){if(0<=cA&&0<=cB&&!((cC.length-1-cA|0)<cB)&&0<=cD&&!((cE.length-1-cA|0)<cD))return caml_array_blit(cC,cB,cE,cD,cA);return b$(b0);}function c5(cH){var cI=cH,cJ=0;for(;;){if(cI){var cK=cI[2],cL=[0,cI[1],cJ],cI=cK,cJ=cL;continue;}return cJ;}}function cQ(cN,cM){if(cM){var cP=cM[2],cR=cO(cN,cM[1]);return [0,cR,cQ(cN,cP)];}return 0;}function c6(cW,cS,cU){var cT=cS,cV=cU;for(;;){if(cV){var cY=cV[2],cZ=cX(cW,cT,cV[1]),cT=cZ,cV=cY;continue;}return cT;}}function c7(c2,c0){var c1=c0;for(;;){if(c1){var c3=c1[2],c4=0===caml_compare(c1[1],c2)?1:0;if(c4)return c4;var c1=c3;continue;}return 0;}}function di(c8,c_){var c9=caml_create_string(c8);caml_fill_string(c9,0,c8,c_);return c9;}function dj(db,c$,da){if(0<=c$&&0<=da&&!((db.getLen()-da|0)<c$)){var dc=caml_create_string(da);caml_blit_string(db,c$,dc,0,da);return dc;}return b$(bS);}function dk(df,de,dh,dg,dd){if(0<=dd&&0<=de&&!((df.getLen()-dd|0)<de)&&0<=dg&&!((dh.getLen()-dd|0)<dg))return caml_blit_string(df,de,dh,dg,dd);return b$(bT);}var dl=caml_sys_const_word_size(0),dm=caml_mul(dl/8|0,(1<<(dl-10|0))-1|0)-1|0,dv=252,du=253;function dt(dq,dp,dn){var dr=caml_lex_engine(dq,dp,dn);if(0<=dr){dn[11]=dn[12];var ds=dn[12];dn[12]=[0,ds[1],ds[2],ds[3],dn[4]+dn[6]|0];}return dr;}var dw=[0,bP],dx=[0,bO],dy=[0,caml_make_vect(100,0),caml_make_vect(100,0),caml_make_vect(100,e),caml_make_vect(100,e),100,0,0,0,e,e,0,0,0,0,0,0];function dH(dF){var dz=dy[5],dA=dz*2|0,dB=caml_make_vect(dA,0),dC=caml_make_vect(dA,0),dD=caml_make_vect(dA,e),dE=caml_make_vect(dA,e);cF(dy[1],0,dB,0,dz);dy[1]=dB;cF(dy[2],0,dC,0,dz);dy[2]=dC;cF(dy[3],0,dD,0,dz);dy[3]=dD;cF(dy[4],0,dE,0,dz);dy[4]=dE;dy[5]=dA;return 0;}var dM=[0,function(dG){return 0;}];function dL(dI,dJ){return caml_array_get(dI[2],dI[11]-dJ|0);}function hY(dK){return 0;}function hX(ei){function d1(dN){return dN?dN[4]:0;}function d3(dO,dT,dQ){var dP=dO?dO[4]:0,dR=dQ?dQ[4]:0,dS=dR<=dP?dP+1|0:dR+1|0;return [0,dO,dT,dQ,dS];}function em(dU,d4,dW){var dV=dU?dU[4]:0,dX=dW?dW[4]:0;if((dX+2|0)<dV){if(dU){var dY=dU[3],dZ=dU[2],d0=dU[1],d2=d1(dY);if(d2<=d1(d0))return d3(d0,dZ,d3(dY,d4,dW));if(dY){var d6=dY[2],d5=dY[1],d7=d3(dY[3],d4,dW);return d3(d3(d0,dZ,d5),d6,d7);}return b$(bK);}return b$(bJ);}if((dV+2|0)<dX){if(dW){var d8=dW[3],d9=dW[2],d_=dW[1],d$=d1(d_);if(d$<=d1(d8))return d3(d3(dU,d4,d_),d9,d8);if(d_){var eb=d_[2],ea=d_[1],ec=d3(d_[3],d9,d8);return d3(d3(dU,d4,ea),eb,ec);}return b$(bI);}return b$(bH);}var ed=dX<=dV?dV+1|0:dX+1|0;return [0,dU,d4,dW,ed];}function el(ej,ee){if(ee){var ef=ee[3],eg=ee[2],eh=ee[1],ek=cX(ei[1],ej,eg);return 0===ek?ee:0<=ek?em(eh,eg,el(ej,ef)):em(el(ej,eh),eg,ef);}return [0,0,ej,0,1];}function et(en){return [0,0,en,0,1];}function ep(eq,eo){if(eo){var es=eo[3],er=eo[2];return em(ep(eq,eo[1]),er,es);}return et(eq);}function ev(ew,eu){if(eu){var ey=eu[2],ex=eu[1];return em(ex,ey,ev(ew,eu[3]));}return et(ew);}function eD(ez,eE,eA){if(ez){if(eA){var eB=eA[4],eC=ez[4],eJ=eA[3],eK=eA[2],eI=eA[1],eF=ez[3],eG=ez[2],eH=ez[1];return (eB+2|0)<eC?em(eH,eG,eD(eF,eE,eA)):(eC+2|0)<eB?em(eD(ez,eE,eI),eK,eJ):d3(ez,eE,eA);}return ev(eE,ez);}return ep(eE,eA);}function eZ(eL){var eM=eL;for(;;){if(eM){var eN=eM[1];if(eN){var eM=eN;continue;}return eM[2];}throw [0,c];}}function fc(eO){var eP=eO;for(;;){if(eP){var eQ=eP[3],eR=eP[2];if(eQ){var eP=eQ;continue;}return eR;}throw [0,c];}}function eU(eS){if(eS){var eT=eS[1];if(eT){var eW=eS[3],eV=eS[2];return em(eU(eT),eV,eW);}return eS[3];}return b$(bN);}function fd(eX,eY){if(eX){if(eY){var e0=eU(eY);return eD(eX,eZ(eY),e0);}return eX;}return eY;}function e7(e5,e1){if(e1){var e2=e1[3],e3=e1[2],e4=e1[1],e6=cX(ei[1],e5,e3);if(0===e6)return [0,e4,1,e2];if(0<=e6){var e8=e7(e5,e2),e_=e8[3],e9=e8[2];return [0,eD(e4,e3,e8[1]),e9,e_];}var e$=e7(e5,e4),fb=e$[2],fa=e$[1];return [0,fa,fb,eD(e$[3],e3,e2)];}return bM;}var hS=0;function hT(fe){return fe?0:1;}function hU(fh,ff){var fg=ff;for(;;){if(fg){var fk=fg[3],fj=fg[1],fi=cX(ei[1],fh,fg[2]),fl=0===fi?1:0;if(fl)return fl;var fm=0<=fi?fk:fj,fg=fm;continue;}return 0;}}function fv(fr,fn){if(fn){var fo=fn[3],fp=fn[2],fq=fn[1],fs=cX(ei[1],fr,fp);if(0===fs){if(fq)if(fo){var ft=eU(fo),fu=em(fq,eZ(fo),ft);}else var fu=fq;else var fu=fo;return fu;}return 0<=fs?em(fq,fp,fv(fr,fo)):em(fv(fr,fq),fp,fo);}return 0;}function fD(fw,fx){if(fw){if(fx){var fy=fx[4],fz=fx[2],fA=fw[4],fB=fw[2],fJ=fx[3],fL=fx[1],fE=fw[3],fG=fw[1];if(fy<=fA){if(1===fy)return el(fz,fw);var fC=e7(fB,fx),fF=fC[1],fH=fD(fE,fC[3]);return eD(fD(fG,fF),fB,fH);}if(1===fA)return el(fB,fx);var fI=e7(fz,fw),fK=fI[1],fM=fD(fI[3],fJ);return eD(fD(fK,fL),fz,fM);}return fw;}return fx;}function fU(fN,fO){if(fN){if(fO){var fP=fN[3],fQ=fN[2],fR=fN[1],fS=e7(fQ,fO),fT=fS[1];if(0===fS[2]){var fV=fU(fP,fS[3]);return fd(fU(fR,fT),fV);}var fW=fU(fP,fS[3]);return eD(fU(fR,fT),fQ,fW);}return 0;}return 0;}function f4(fX,fY){if(fX){if(fY){var fZ=fX[3],f0=fX[2],f1=fX[1],f2=e7(f0,fY),f3=f2[1];if(0===f2[2]){var f5=f4(fZ,f2[3]);return eD(f4(f1,f3),f0,f5);}var f6=f4(fZ,f2[3]);return fd(f4(f1,f3),f6);}return fX;}return 0;}function gb(f7,f9){var f8=f7,f_=f9;for(;;){if(f8){var f$=f8[1],ga=[0,f8[2],f8[3],f_],f8=f$,f_=ga;continue;}return f_;}}function gp(gd,gc){var ge=gb(gc,0),gf=gb(gd,0),gg=ge;for(;;){if(gf)if(gg){var gl=gg[3],gk=gg[2],gj=gf[3],gi=gf[2],gh=cX(ei[1],gf[1],gg[1]);if(0===gh){var gm=gb(gk,gl),gn=gb(gi,gj),gf=gn,gg=gm;continue;}var go=gh;}else var go=1;else var go=gg?-1:0;return go;}}function hV(gr,gq){return 0===gp(gr,gq)?1:0;}function gC(gs,gu){var gt=gs,gv=gu;for(;;){if(gt){if(gv){var gw=gv[3],gx=gv[1],gy=gt[3],gz=gt[2],gA=gt[1],gB=cX(ei[1],gz,gv[2]);if(0===gB){var gD=gC(gA,gx);if(gD){var gt=gy,gv=gw;continue;}return gD;}if(0<=gB){var gE=gC([0,0,gz,gy,0],gw);if(gE){var gt=gA;continue;}return gE;}var gF=gC([0,gA,gz,0,0],gx);if(gF){var gt=gy;continue;}return gF;}return 0;}return 1;}}function gI(gJ,gG){var gH=gG;for(;;){if(gH){var gL=gH[3],gK=gH[2];gI(gJ,gH[1]);cO(gJ,gK);var gH=gL;continue;}return 0;}}function gQ(gR,gM,gO){var gN=gM,gP=gO;for(;;){if(gN){var gT=gN[3],gS=gN[2],gU=cX(gR,gS,gQ(gR,gN[1],gP)),gN=gT,gP=gU;continue;}return gP;}}function g1(gX,gV){var gW=gV;for(;;){if(gW){var g0=gW[3],gZ=gW[1],gY=cO(gX,gW[2]);if(gY){var g2=g1(gX,gZ);if(g2){var gW=g0;continue;}var g3=g2;}else var g3=gY;return g3;}return 1;}}function g$(g6,g4){var g5=g4;for(;;){if(g5){var g9=g5[3],g8=g5[1],g7=cO(g6,g5[2]);if(g7)var g_=g7;else{var ha=g$(g6,g8);if(!ha){var g5=g9;continue;}var g_=ha;}return g_;}return 0;}}function hd(he,hb){if(hb){var hc=hb[2],hg=hb[3],hf=hd(he,hb[1]),hi=cO(he,hc),hh=hd(he,hg);return hi?eD(hf,hc,hh):fd(hf,hh);}return 0;}function hl(hm,hj){if(hj){var hk=hj[2],ho=hj[3],hn=hl(hm,hj[1]),hp=hn[2],hq=hn[1],hs=cO(hm,hk),hr=hl(hm,ho),ht=hr[2],hu=hr[1];if(hs){var hv=fd(hp,ht);return [0,eD(hq,hk,hu),hv];}var hw=eD(hp,hk,ht);return [0,fd(hq,hu),hw];}return bL;}function hy(hx){if(hx){var hz=hx[1],hA=hy(hx[3]);return (hy(hz)+1|0)+hA|0;}return 0;}function hF(hB,hD){var hC=hB,hE=hD;for(;;){if(hE){var hH=hE[2],hG=hE[1],hI=[0,hH,hF(hC,hE[3])],hC=hI,hE=hG;continue;}return hC;}}function hW(hJ){return hF(0,hJ);}return [0,hS,hT,hU,el,et,fv,fD,fU,f4,gp,hV,gC,gI,gQ,g1,g$,hd,hl,hy,hW,eZ,fc,eZ,e7,function(hN,hK){var hL=hK;for(;;){if(hL){var hM=hL[2],hQ=hL[3],hP=hL[1],hO=cX(ei[1],hN,hM);if(0===hO)return hM;var hR=0<=hO?hQ:hP,hL=hR;continue;}throw [0,c];}}];}function mT(iI){function h0(hZ){return hZ?hZ[5]:0;}function ii(h1,h7,h6,h3){var h2=h0(h1),h4=h0(h3),h5=h4<=h2?h2+1|0:h4+1|0;return [0,h1,h7,h6,h3,h5];}function iA(h9,h8){return [0,0,h9,h8,0,1];}function iB(h_,ik,ij,ia){var h$=h_?h_[5]:0,ib=ia?ia[5]:0;if((ib+2|0)<h$){if(h_){var ic=h_[4],id=h_[3],ie=h_[2],ig=h_[1],ih=h0(ic);if(ih<=h0(ig))return ii(ig,ie,id,ii(ic,ik,ij,ia));if(ic){var io=ic[3],im=ic[2],il=ic[1],ip=ii(ic[4],ik,ij,ia);return ii(ii(ig,ie,id,il),im,io,ip);}return b$(bC);}return b$(bB);}if((h$+2|0)<ib){if(ia){var iq=ia[4],ir=ia[3],is=ia[2],it=ia[1],iu=h0(it);if(iu<=h0(iq))return ii(ii(h_,ik,ij,it),is,ir,iq);if(it){var ix=it[3],iw=it[2],iv=it[1],iy=ii(it[4],is,ir,iq);return ii(ii(h_,ik,ij,iv),iw,ix,iy);}return b$(bA);}return b$(bz);}var iz=ib<=h$?h$+1|0:ib+1|0;return [0,h_,ik,ij,ia,iz];}var mM=0;function mN(iC){return iC?0:1;}function iN(iJ,iM,iD){if(iD){var iE=iD[4],iF=iD[3],iG=iD[2],iH=iD[1],iL=iD[5],iK=cX(iI[1],iJ,iG);return 0===iK?[0,iH,iJ,iM,iE,iL]:0<=iK?iB(iH,iG,iF,iN(iJ,iM,iE)):iB(iN(iJ,iM,iH),iG,iF,iE);}return [0,0,iJ,iM,0,1];}function mO(iQ,iO){var iP=iO;for(;;){if(iP){var iU=iP[4],iT=iP[3],iS=iP[1],iR=cX(iI[1],iQ,iP[2]);if(0===iR)return iT;var iV=0<=iR?iU:iS,iP=iV;continue;}throw [0,c];}}function mP(iY,iW){var iX=iW;for(;;){if(iX){var i1=iX[4],i0=iX[1],iZ=cX(iI[1],iY,iX[2]),i2=0===iZ?1:0;if(i2)return i2;var i3=0<=iZ?i1:i0,iX=i3;continue;}return 0;}}function jn(i4){var i5=i4;for(;;){if(i5){var i6=i5[1];if(i6){var i5=i6;continue;}return [0,i5[2],i5[3]];}throw [0,c];}}function mQ(i7){var i8=i7;for(;;){if(i8){var i9=i8[4],i_=i8[3],i$=i8[2];if(i9){var i8=i9;continue;}return [0,i$,i_];}throw [0,c];}}function jc(ja){if(ja){var jb=ja[1];if(jb){var jf=ja[4],je=ja[3],jd=ja[2];return iB(jc(jb),jd,je,jf);}return ja[4];}return b$(bG);}function js(jl,jg){if(jg){var jh=jg[4],ji=jg[3],jj=jg[2],jk=jg[1],jm=cX(iI[1],jl,jj);if(0===jm){if(jk)if(jh){var jo=jn(jh),jq=jo[2],jp=jo[1],jr=iB(jk,jp,jq,jc(jh));}else var jr=jk;else var jr=jh;return jr;}return 0<=jm?iB(jk,jj,ji,js(jl,jh)):iB(js(jl,jk),jj,ji,jh);}return 0;}function jv(jw,jt){var ju=jt;for(;;){if(ju){var jz=ju[4],jy=ju[3],jx=ju[2];jv(jw,ju[1]);cX(jw,jx,jy);var ju=jz;continue;}return 0;}}function jB(jC,jA){if(jA){var jG=jA[5],jF=jA[4],jE=jA[3],jD=jA[2],jH=jB(jC,jA[1]),jI=cO(jC,jE);return [0,jH,jD,jI,jB(jC,jF),jG];}return 0;}function jL(jM,jJ){if(jJ){var jK=jJ[2],jP=jJ[5],jO=jJ[4],jN=jJ[3],jQ=jL(jM,jJ[1]),jR=cX(jM,jK,jN);return [0,jQ,jK,jR,jL(jM,jO),jP];}return 0;}function jW(jX,jS,jU){var jT=jS,jV=jU;for(;;){if(jT){var j0=jT[4],jZ=jT[3],jY=jT[2],j2=j1(jX,jY,jZ,jW(jX,jT[1],jV)),jT=j0,jV=j2;continue;}return jV;}}function j9(j5,j3){var j4=j3;for(;;){if(j4){var j8=j4[4],j7=j4[1],j6=cX(j5,j4[2],j4[3]);if(j6){var j_=j9(j5,j7);if(j_){var j4=j8;continue;}var j$=j_;}else var j$=j6;return j$;}return 1;}}function kh(kc,ka){var kb=ka;for(;;){if(kb){var kf=kb[4],ke=kb[1],kd=cX(kc,kb[2],kb[3]);if(kd)var kg=kd;else{var ki=kh(kc,ke);if(!ki){var kb=kf;continue;}var kg=ki;}return kg;}return 0;}}function kk(km,kl,kj){if(kj){var kp=kj[4],ko=kj[3],kn=kj[2];return iB(kk(km,kl,kj[1]),kn,ko,kp);}return iA(km,kl);}function kr(kt,ks,kq){if(kq){var kw=kq[3],kv=kq[2],ku=kq[1];return iB(ku,kv,kw,kr(kt,ks,kq[4]));}return iA(kt,ks);}function kB(kx,kD,kC,ky){if(kx){if(ky){var kz=ky[5],kA=kx[5],kJ=ky[4],kK=ky[3],kL=ky[2],kI=ky[1],kE=kx[4],kF=kx[3],kG=kx[2],kH=kx[1];return (kz+2|0)<kA?iB(kH,kG,kF,kB(kE,kD,kC,ky)):(kA+2|0)<kz?iB(kB(kx,kD,kC,kI),kL,kK,kJ):ii(kx,kD,kC,ky);}return kr(kD,kC,kx);}return kk(kD,kC,ky);}function kV(kM,kN){if(kM){if(kN){var kO=jn(kN),kQ=kO[2],kP=kO[1];return kB(kM,kP,kQ,jc(kN));}return kM;}return kN;}function lm(kU,kT,kR,kS){return kR?kB(kU,kT,kR[1],kS):kV(kU,kS);}function k3(k1,kW){if(kW){var kX=kW[4],kY=kW[3],kZ=kW[2],k0=kW[1],k2=cX(iI[1],k1,kZ);if(0===k2)return [0,k0,[0,kY],kX];if(0<=k2){var k4=k3(k1,kX),k6=k4[3],k5=k4[2];return [0,kB(k0,kZ,kY,k4[1]),k5,k6];}var k7=k3(k1,k0),k9=k7[2],k8=k7[1];return [0,k8,k9,kB(k7[3],kZ,kY,kX)];}return bF;}function lg(lh,k_,la){if(k_){var k$=k_[2],le=k_[5],ld=k_[4],lc=k_[3],lb=k_[1];if(h0(la)<=le){var lf=k3(k$,la),lj=lf[2],li=lf[1],lk=lg(lh,ld,lf[3]),ll=j1(lh,k$,[0,lc],lj);return lm(lg(lh,lb,li),k$,ll,lk);}}else if(!la)return 0;if(la){var ln=la[2],lr=la[4],lq=la[3],lp=la[1],lo=k3(ln,k_),lt=lo[2],ls=lo[1],lu=lg(lh,lo[3],lr),lv=j1(lh,ln,lt,[0,lq]);return lm(lg(lh,ls,lp),ln,lv,lu);}throw [0,d,bE];}function lz(lA,lw){if(lw){var lx=lw[3],ly=lw[2],lC=lw[4],lB=lz(lA,lw[1]),lE=cX(lA,ly,lx),lD=lz(lA,lC);return lE?kB(lB,ly,lx,lD):kV(lB,lD);}return 0;}function lI(lJ,lF){if(lF){var lG=lF[3],lH=lF[2],lL=lF[4],lK=lI(lJ,lF[1]),lM=lK[2],lN=lK[1],lP=cX(lJ,lH,lG),lO=lI(lJ,lL),lQ=lO[2],lR=lO[1];if(lP){var lS=kV(lM,lQ);return [0,kB(lN,lH,lG,lR),lS];}var lT=kB(lM,lH,lG,lQ);return [0,kV(lN,lR),lT];}return bD;}function l0(lU,lW){var lV=lU,lX=lW;for(;;){if(lV){var lY=lV[1],lZ=[0,lV[2],lV[3],lV[4],lX],lV=lY,lX=lZ;continue;}return lX;}}function mR(mb,l2,l1){var l3=l0(l1,0),l4=l0(l2,0),l5=l3;for(;;){if(l4)if(l5){var ma=l5[4],l$=l5[3],l_=l5[2],l9=l4[4],l8=l4[3],l7=l4[2],l6=cX(iI[1],l4[1],l5[1]);if(0===l6){var mc=cX(mb,l7,l_);if(0===mc){var md=l0(l$,ma),me=l0(l8,l9),l4=me,l5=md;continue;}var mf=mc;}else var mf=l6;}else var mf=1;else var mf=l5?-1:0;return mf;}}function mS(ms,mh,mg){var mi=l0(mg,0),mj=l0(mh,0),mk=mi;for(;;){if(mj)if(mk){var mq=mk[4],mp=mk[3],mo=mk[2],mn=mj[4],mm=mj[3],ml=mj[2],mr=0===cX(iI[1],mj[1],mk[1])?1:0;if(mr){var mt=cX(ms,ml,mo);if(mt){var mu=l0(mp,mq),mv=l0(mm,mn),mj=mv,mk=mu;continue;}var mw=mt;}else var mw=mr;var mx=mw;}else var mx=0;else var mx=mk?0:1;return mx;}}function mz(my){if(my){var mA=my[1],mB=mz(my[4]);return (mz(mA)+1|0)+mB|0;}return 0;}function mG(mC,mE){var mD=mC,mF=mE;for(;;){if(mF){var mJ=mF[3],mI=mF[2],mH=mF[1],mK=[0,[0,mI,mJ],mG(mD,mF[4])],mD=mK,mF=mH;continue;}return mD;}}return [0,mM,mN,mP,iN,iA,js,lg,mR,mS,jv,jW,j9,kh,lz,lI,mz,function(mL){return mG(0,mL);},jn,mQ,jn,k3,mO,jB,jL];}var na=[0,by];function m$(mU){var mV=1<=mU?mU:1,mW=dm<mV?dm:mV,mX=caml_create_string(mW);return [0,mX,0,mW,mX];}function nb(mY){return dj(mY[1],0,mY[2]);}function m5(mZ,m1){var m0=[0,mZ[3]];for(;;){if(m0[1]<(mZ[2]+m1|0)){m0[1]=2*m0[1]|0;continue;}if(dm<m0[1])if((mZ[2]+m1|0)<=dm)m0[1]=dm;else o(bx);var m2=caml_create_string(m0[1]);dk(mZ[1],0,m2,0,mZ[2]);mZ[1]=m2;mZ[3]=m0[1];return 0;}}function nc(m3,m6){var m4=m3[2];if(m3[3]<=m4)m5(m3,1);m3[1].safeSet(m4,m6);m3[2]=m4+1|0;return 0;}function nd(m9,m7){var m8=m7.getLen(),m_=m9[2]+m8|0;if(m9[3]<m_)m5(m9,m8);dk(m7,0,m9[1],m9[2],m8);m9[2]=m_;return 0;}function nh(ne){return 0<=ne?ne:o(cl(bc,cm(ne)));}function ni(nf,ng){return nh(nf+ng|0);}var nj=cO(ni,1);function nq(nk){return dj(nk,0,nk.getLen());}function ns(nl,nm,no){var nn=cl(bf,cl(nl,bg)),np=cl(be,cl(cm(nm),nn));return b$(cl(bd,cl(di(1,no),np)));}function og(nr,nu,nt){return ns(nq(nr),nu,nt);}function oh(nv){return b$(cl(bh,cl(nq(nv),bi)));}function nP(nw,nE,nG,nI){function nD(nx){if((nw.safeGet(nx)-48|0)<0||9<(nw.safeGet(nx)-48|0))return nx;var ny=nx+1|0;for(;;){var nz=nw.safeGet(ny);if(48<=nz){if(!(58<=nz)){var nB=ny+1|0,ny=nB;continue;}var nA=0;}else if(36===nz){var nC=ny+1|0,nA=1;}else var nA=0;if(!nA)var nC=nx;return nC;}}var nF=nD(nE+1|0),nH=m$((nG-nF|0)+10|0);nc(nH,37);var nJ=nF,nK=c5(nI);for(;;){if(nJ<=nG){var nL=nw.safeGet(nJ);if(42===nL){if(nK){var nM=nK[2];nd(nH,cm(nK[1]));var nN=nD(nJ+1|0),nJ=nN,nK=nM;continue;}throw [0,d,bj];}nc(nH,nL);var nO=nJ+1|0,nJ=nO;continue;}return nb(nH);}}function pH(nV,nT,nS,nR,nQ){var nU=nP(nT,nS,nR,nQ);if(78!==nV&&110!==nV)return nU;nU.safeSet(nU.getLen()-1|0,117);return nU;}function oi(n2,oa,oe,nW,od){var nX=nW.getLen();function ob(nY,n$){var nZ=40===nY?41:125;function n_(n0){var n1=n0;for(;;){if(nX<=n1)return cO(n2,nW);if(37===nW.safeGet(n1)){var n3=n1+1|0;if(nX<=n3)var n4=cO(n2,nW);else{var n5=nW.safeGet(n3),n6=n5-40|0;if(n6<0||1<n6){var n7=n6-83|0;if(n7<0||2<n7)var n8=1;else switch(n7){case 1:var n8=1;break;case 2:var n9=1,n8=0;break;default:var n9=0,n8=0;}if(n8){var n4=n_(n3+1|0),n9=2;}}else var n9=0===n6?0:1;switch(n9){case 1:var n4=n5===nZ?n3+1|0:j1(oa,nW,n$,n5);break;case 2:break;default:var n4=n_(ob(n5,n3+1|0)+1|0);}}return n4;}var oc=n1+1|0,n1=oc;continue;}}return n_(n$);}return ob(oe,od);}function oH(of){return j1(oi,oh,og,of);}function oX(oj,ou,oE){var ok=oj.getLen()-1|0;function oF(ol){var om=ol;a:for(;;){if(om<ok){if(37===oj.safeGet(om)){var on=0,oo=om+1|0;for(;;){if(ok<oo)var op=oh(oj);else{var oq=oj.safeGet(oo);if(58<=oq){if(95===oq){var os=oo+1|0,or=1,on=or,oo=os;continue;}}else if(32<=oq)switch(oq-32|0){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 0:case 3:case 11:case 13:var ot=oo+1|0,oo=ot;continue;case 10:var ov=j1(ou,on,oo,105),oo=ov;continue;default:var ow=oo+1|0,oo=ow;continue;}var ox=oo;c:for(;;){if(ok<ox)var oy=oh(oj);else{var oz=oj.safeGet(ox);if(126<=oz)var oA=0;else switch(oz){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var oy=j1(ou,on,ox,105),oA=1;break;case 69:case 70:case 71:case 101:case 102:case 103:var oy=j1(ou,on,ox,102),oA=1;break;case 33:case 37:case 44:case 64:var oy=ox+1|0,oA=1;break;case 83:case 91:case 115:var oy=j1(ou,on,ox,115),oA=1;break;case 97:case 114:case 116:var oy=j1(ou,on,ox,oz),oA=1;break;case 76:case 108:case 110:var oB=ox+1|0;if(ok<oB){var oy=j1(ou,on,ox,105),oA=1;}else{var oC=oj.safeGet(oB)-88|0;if(oC<0||32<oC)var oD=1;else switch(oC){case 0:case 12:case 17:case 23:case 29:case 32:var oy=cX(oE,j1(ou,on,ox,oz),105),oA=1,oD=0;break;default:var oD=1;}if(oD){var oy=j1(ou,on,ox,105),oA=1;}}break;case 67:case 99:var oy=j1(ou,on,ox,99),oA=1;break;case 66:case 98:var oy=j1(ou,on,ox,66),oA=1;break;case 41:case 125:var oy=j1(ou,on,ox,oz),oA=1;break;case 40:var oy=oF(j1(ou,on,ox,oz)),oA=1;break;case 123:var oG=j1(ou,on,ox,oz),oI=j1(oH,oz,oj,oG),oJ=oG;for(;;){if(oJ<(oI-2|0)){var oK=cX(oE,oJ,oj.safeGet(oJ)),oJ=oK;continue;}var oL=oI-1|0,ox=oL;continue c;}default:var oA=0;}if(!oA)var oy=og(oj,ox,oz);}var op=oy;break;}}var om=op;continue a;}}var oM=om+1|0,om=oM;continue;}return om;}}oF(0);return 0;}function qW(oY){var oN=[0,0,0,0];function oW(oS,oT,oO){var oP=41!==oO?1:0,oQ=oP?125!==oO?1:0:oP;if(oQ){var oR=97===oO?2:1;if(114===oO)oN[3]=oN[3]+1|0;if(oS)oN[2]=oN[2]+oR|0;else oN[1]=oN[1]+oR|0;}return oT+1|0;}oX(oY,oW,function(oU,oV){return oU+1|0;});return oN[1];}function pD(oZ,o2,o0){var o1=oZ.safeGet(o0);if((o1-48|0)<0||9<(o1-48|0))return cX(o2,0,o0);var o3=o1-48|0,o4=o0+1|0;for(;;){var o5=oZ.safeGet(o4);if(48<=o5){if(!(58<=o5)){var o8=o4+1|0,o7=(10*o3|0)+(o5-48|0)|0,o3=o7,o4=o8;continue;}var o6=0;}else if(36===o5)if(0===o3){var o9=o(bl),o6=1;}else{var o9=cX(o2,[0,nh(o3-1|0)],o4+1|0),o6=1;}else var o6=0;if(!o6)var o9=cX(o2,0,o0);return o9;}}function py(o_,o$){return o_?o$:cO(nj,o$);}function pn(pa,pb){return pa?pa[1]:pb;}function sh(rf,pd,rr,pg,q1,rx,pc){var pe=cO(pd,pc);function rg(pf){return cX(pg,pe,pf);}function q0(pl,rw,ph,pq){var pk=ph.getLen();function qX(ro,pi){var pj=pi;for(;;){if(pk<=pj)return cO(pl,pe);var pm=ph.safeGet(pj);if(37===pm){var pu=function(pp,po){return caml_array_get(pq,pn(pp,po));},pA=function(pC,pv,px,pr){var ps=pr;for(;;){var pt=ph.safeGet(ps)-32|0;if(!(pt<0||25<pt))switch(pt){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 10:return pD(ph,function(pw,pB){var pz=[0,pu(pw,pv),px];return pA(pC,py(pw,pv),pz,pB);},ps+1|0);default:var pE=ps+1|0,ps=pE;continue;}var pF=ph.safeGet(ps);if(124<=pF)var pG=0;else switch(pF){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var pI=pu(pC,pv),pJ=caml_format_int(pH(pF,ph,pj,ps,px),pI),pL=pK(py(pC,pv),pJ,ps+1|0),pG=1;break;case 69:case 71:case 101:case 102:case 103:var pM=pu(pC,pv),pN=caml_format_float(nP(ph,pj,ps,px),pM),pL=pK(py(pC,pv),pN,ps+1|0),pG=1;break;case 76:case 108:case 110:var pO=ph.safeGet(ps+1|0)-88|0;if(pO<0||32<pO)var pP=1;else switch(pO){case 0:case 12:case 17:case 23:case 29:case 32:var pQ=ps+1|0,pR=pF-108|0;if(pR<0||2<pR)var pS=0;else{switch(pR){case 1:var pS=0,pT=0;break;case 2:var pU=pu(pC,pv),pV=caml_format_int(nP(ph,pj,pQ,px),pU),pT=1;break;default:var pW=pu(pC,pv),pV=caml_format_int(nP(ph,pj,pQ,px),pW),pT=1;}if(pT){var pX=pV,pS=1;}}if(!pS){var pY=pu(pC,pv),pX=caml_int64_format(nP(ph,pj,pQ,px),pY);}var pL=pK(py(pC,pv),pX,pQ+1|0),pG=1,pP=0;break;default:var pP=1;}if(pP){var pZ=pu(pC,pv),p0=caml_format_int(pH(110,ph,pj,ps,px),pZ),pL=pK(py(pC,pv),p0,ps+1|0),pG=1;}break;case 37:case 64:var pL=pK(pv,di(1,pF),ps+1|0),pG=1;break;case 83:case 115:var p1=pu(pC,pv);if(115===pF)var p2=p1;else{var p3=[0,0],p4=0,p5=p1.getLen()-1|0;if(!(p5<p4)){var p6=p4;for(;;){var p7=p1.safeGet(p6),p8=14<=p7?34===p7?1:92===p7?1:0:11<=p7?13<=p7?1:0:8<=p7?1:0,p9=p8?2:caml_is_printable(p7)?1:4;p3[1]=p3[1]+p9|0;var p_=p6+1|0;if(p5!==p6){var p6=p_;continue;}break;}}if(p3[1]===p1.getLen())var p$=p1;else{var qa=caml_create_string(p3[1]);p3[1]=0;var qb=0,qc=p1.getLen()-1|0;if(!(qc<qb)){var qd=qb;for(;;){var qe=p1.safeGet(qd),qf=qe-34|0;if(qf<0||58<qf)if(-20<=qf)var qg=1;else{switch(qf+34|0){case 8:qa.safeSet(p3[1],92);p3[1]+=1;qa.safeSet(p3[1],98);var qh=1;break;case 9:qa.safeSet(p3[1],92);p3[1]+=1;qa.safeSet(p3[1],116);var qh=1;break;case 10:qa.safeSet(p3[1],92);p3[1]+=1;qa.safeSet(p3[1],110);var qh=1;break;case 13:qa.safeSet(p3[1],92);p3[1]+=1;qa.safeSet(p3[1],114);var qh=1;break;default:var qg=1,qh=0;}if(qh)var qg=0;}else var qg=(qf-1|0)<0||56<(qf-1|0)?(qa.safeSet(p3[1],92),p3[1]+=1,qa.safeSet(p3[1],qe),0):1;if(qg)if(caml_is_printable(qe))qa.safeSet(p3[1],qe);else{qa.safeSet(p3[1],92);p3[1]+=1;qa.safeSet(p3[1],48+(qe/100|0)|0);p3[1]+=1;qa.safeSet(p3[1],48+((qe/10|0)%10|0)|0);p3[1]+=1;qa.safeSet(p3[1],48+(qe%10|0)|0);}p3[1]+=1;var qi=qd+1|0;if(qc!==qd){var qd=qi;continue;}break;}}var p$=qa;}var p2=cl(bs,cl(p$,bt));}if(ps===(pj+1|0))var qj=p2;else{var qk=nP(ph,pj,ps,px);try {var ql=0,qm=1;for(;;){if(qk.getLen()<=qm)var qn=[0,0,ql];else{var qo=qk.safeGet(qm);if(49<=qo)if(58<=qo)var qp=0;else{var qn=[0,caml_int_of_string(dj(qk,qm,(qk.getLen()-qm|0)-1|0)),ql],qp=1;}else{if(45===qo){var qr=qm+1|0,qq=1,ql=qq,qm=qr;continue;}var qp=0;}if(!qp){var qs=qm+1|0,qm=qs;continue;}}var qt=qn;break;}}catch(qu){if(qu[1]!==a)throw qu;var qt=ns(qk,0,115);}var qv=qt[1],qw=p2.getLen(),qx=0,qB=qt[2],qA=32;if(qv===qw&&0===qx){var qy=p2,qz=1;}else var qz=0;if(!qz)if(qv<=qw)var qy=dj(p2,qx,qw);else{var qC=di(qv,qA);if(qB)dk(p2,qx,qC,0,qw);else dk(p2,qx,qC,qv-qw|0,qw);var qy=qC;}var qj=qy;}var pL=pK(py(pC,pv),qj,ps+1|0),pG=1;break;case 67:case 99:var qD=pu(pC,pv);if(99===pF)var qE=di(1,qD);else{if(39===qD)var qF=bU;else if(92===qD)var qF=bV;else{if(14<=qD)var qG=0;else switch(qD){case 8:var qF=bZ,qG=1;break;case 9:var qF=bY,qG=1;break;case 10:var qF=bX,qG=1;break;case 13:var qF=bW,qG=1;break;default:var qG=0;}if(!qG)if(caml_is_printable(qD)){var qH=caml_create_string(1);qH.safeSet(0,qD);var qF=qH;}else{var qI=caml_create_string(4);qI.safeSet(0,92);qI.safeSet(1,48+(qD/100|0)|0);qI.safeSet(2,48+((qD/10|0)%10|0)|0);qI.safeSet(3,48+(qD%10|0)|0);var qF=qI;}}var qE=cl(bq,cl(qF,br));}var pL=pK(py(pC,pv),qE,ps+1|0),pG=1;break;case 66:case 98:var qK=ps+1|0,qJ=pu(pC,pv)?b3:b2,pL=pK(py(pC,pv),qJ,qK),pG=1;break;case 40:case 123:var qL=pu(pC,pv),qM=j1(oH,pF,ph,ps+1|0);if(123===pF){var qN=m$(qL.getLen()),qR=function(qP,qO){nc(qN,qO);return qP+1|0;};oX(qL,function(qQ,qT,qS){if(qQ)nd(qN,bk);else nc(qN,37);return qR(qT,qS);},qR);var qU=nb(qN),pL=pK(py(pC,pv),qU,qM),pG=1;}else{var qV=py(pC,pv),qY=ni(qW(qL),qV),pL=q0(function(qZ){return qX(qY,qM);},qV,qL,pq),pG=1;}break;case 33:cO(q1,pe);var pL=qX(pv,ps+1|0),pG=1;break;case 41:var pL=pK(pv,bw,ps+1|0),pG=1;break;case 44:var pL=pK(pv,bv,ps+1|0),pG=1;break;case 70:var q2=pu(pC,pv);if(0===px)var q3=bu;else{var q4=nP(ph,pj,ps,px);if(70===pF)q4.safeSet(q4.getLen()-1|0,103);var q3=q4;}var q5=caml_classify_float(q2);if(3===q5)var q6=q2<0?bo:bn;else if(4<=q5)var q6=bp;else{var q7=caml_format_float(q3,q2),q8=0,q9=q7.getLen();for(;;){if(q9<=q8)var q_=cl(q7,bm);else{var q$=q7.safeGet(q8)-46|0,ra=q$<0||23<q$?55===q$?1:0:(q$-1|0)<0||21<(q$-1|0)?1:0;if(!ra){var rb=q8+1|0,q8=rb;continue;}var q_=q7;}var q6=q_;break;}}var pL=pK(py(pC,pv),q6,ps+1|0),pG=1;break;case 91:var pL=og(ph,ps,pF),pG=1;break;case 97:var rc=pu(pC,pv),rd=cO(nj,pn(pC,pv)),re=pu(0,rd),ri=ps+1|0,rh=py(pC,rd);if(rf)rg(cX(rc,0,re));else cX(rc,pe,re);var pL=qX(rh,ri),pG=1;break;case 114:var pL=og(ph,ps,pF),pG=1;break;case 116:var rj=pu(pC,pv),rl=ps+1|0,rk=py(pC,pv);if(rf)rg(cO(rj,0));else cO(rj,pe);var pL=qX(rk,rl),pG=1;break;default:var pG=0;}if(!pG)var pL=og(ph,ps,pF);return pL;}},rq=pj+1|0,rn=0;return pD(ph,function(rp,rm){return pA(rp,ro,rn,rm);},rq);}cX(rr,pe,pm);var rs=pj+1|0,pj=rs;continue;}}function pK(rv,rt,ru){rg(rt);return qX(rv,ru);}return qX(rw,0);}var ry=cX(q0,rx,nh(0)),rz=qW(pc);if(rz<0||6<rz){var rM=function(rA,rG){if(rz<=rA){var rB=caml_make_vect(rz,0),rE=function(rC,rD){return caml_array_set(rB,(rz-rC|0)-1|0,rD);},rF=0,rH=rG;for(;;){if(rH){var rI=rH[2],rJ=rH[1];if(rI){rE(rF,rJ);var rK=rF+1|0,rF=rK,rH=rI;continue;}rE(rF,rJ);}return cX(ry,pc,rB);}}return function(rL){return rM(rA+1|0,[0,rL,rG]);};},rN=rM(0,0);}else switch(rz){case 1:var rN=function(rP){var rO=caml_make_vect(1,0);caml_array_set(rO,0,rP);return cX(ry,pc,rO);};break;case 2:var rN=function(rR,rS){var rQ=caml_make_vect(2,0);caml_array_set(rQ,0,rR);caml_array_set(rQ,1,rS);return cX(ry,pc,rQ);};break;case 3:var rN=function(rU,rV,rW){var rT=caml_make_vect(3,0);caml_array_set(rT,0,rU);caml_array_set(rT,1,rV);caml_array_set(rT,2,rW);return cX(ry,pc,rT);};break;case 4:var rN=function(rY,rZ,r0,r1){var rX=caml_make_vect(4,0);caml_array_set(rX,0,rY);caml_array_set(rX,1,rZ);caml_array_set(rX,2,r0);caml_array_set(rX,3,r1);return cX(ry,pc,rX);};break;case 5:var rN=function(r3,r4,r5,r6,r7){var r2=caml_make_vect(5,0);caml_array_set(r2,0,r3);caml_array_set(r2,1,r4);caml_array_set(r2,2,r5);caml_array_set(r2,3,r6);caml_array_set(r2,4,r7);return cX(ry,pc,r2);};break;case 6:var rN=function(r9,r_,r$,sa,sb,sc){var r8=caml_make_vect(6,0);caml_array_set(r8,0,r9);caml_array_set(r8,1,r_);caml_array_set(r8,2,r$);caml_array_set(r8,3,sa);caml_array_set(r8,4,sb);caml_array_set(r8,5,sc);return cX(ry,pc,r8);};break;default:var rN=cX(ry,pc,[0]);}return rN;}function sv(se){function sg(sd){return 0;}return si(sh,0,function(sf){return se;},cz,cv,cG,sg);}function sr(sj){return m$(2*sj.getLen()|0);}function so(sm,sk){var sl=nb(sk);sk[2]=0;return cO(sm,sl);}function su(sn){var sq=cO(so,sn);return si(sh,1,sr,nc,nd,function(sp){return 0;},sq);}function sw(st){return cX(su,function(ss){return ss;},st);}var sx=[0,0];function sL(sy,sz){var sA=sy[sz+1];if(caml_obj_is_block(sA)){if(caml_obj_tag(sA)===dv)return cX(sw,aS,sA);if(caml_obj_tag(sA)===du){var sB=caml_format_float(b6,sA),sC=0,sD=sB.getLen();for(;;){if(sD<=sC)var sE=cl(sB,b5);else{var sF=sB.safeGet(sC),sG=48<=sF?58<=sF?0:1:45===sF?1:0;if(sG){var sH=sC+1|0,sC=sH;continue;}var sE=sB;}return sE;}}return aR;}return cX(sw,aT,sA);}function sK(sI,sJ){if(sI.length-1<=sJ)return bb;var sM=sK(sI,sJ+1|0);return j1(sw,ba,sL(sI,sJ),sM);}function tf(sO){var sN=sx[1];for(;;){if(sN){var sT=sN[2],sP=sN[1];try {var sQ=cO(sP,sO),sR=sQ;}catch(sU){var sR=0;}if(!sR){var sN=sT;continue;}var sS=sR[1];}else if(sO[1]===b_)var sS=a2;else if(sO[1]===b8)var sS=a1;else if(sO[1]===b9){var sV=sO[2],sW=sV[3],sS=si(sw,g,sV[1],sV[2],sW,sW+5|0,a0);}else if(sO[1]===d){var sX=sO[2],sY=sX[3],sS=si(sw,g,sX[1],sX[2],sY,sY+6|0,aZ);}else if(sO[1]===b7){var sZ=sO[2],s0=sZ[3],sS=si(sw,g,sZ[1],sZ[2],s0,s0+6|0,aY);}else{var s1=sO.length-1,s4=sO[0+1][0+1];if(s1<0||2<s1){var s2=sK(sO,2),s3=j1(sw,aX,sL(sO,1),s2);}else switch(s1){case 1:var s3=aV;break;case 2:var s3=cX(sw,aU,sL(sO,1));break;default:var s3=aW;}var sS=cl(s4,s3);}return sS;}}function tg(tc){var s5=caml_convert_raw_backtrace(caml_get_exception_raw_backtrace(0));if(s5){var s6=s5[1],s7=0,s8=s6.length-1-1|0;if(!(s8<s7)){var s9=s7;for(;;){if(caml_notequal(caml_array_get(s6,s9),a$)){var s_=caml_array_get(s6,s9),s$=0===s_[0]?s_[1]:s_[1],ta=s$?0===s9?a8:a7:0===s9?a6:a5,tb=0===s_[0]?si(sw,a4,ta,s_[2],s_[3],s_[4],s_[5]):cX(sw,a3,ta);j1(sv,tc,a_,tb);}var td=s9+1|0;if(s8!==s9){var s9=td;continue;}break;}}var te=0;}else var te=cX(sv,tc,a9);return te;}32===dl;function tj(ti){var th=[];caml_update_dummy(th,[0,th,th]);return th;}var tk=[0,aL],tn=42,to=[0,mT([0,function(tm,tl){return caml_compare(tm,tl);}])[1]];function ts(tp){var tq=tp[1];{if(3===tq[0]){var tr=tq[1],tt=ts(tr);if(tt!==tr)tp[1]=[3,tt];return tt;}return tp;}}function tw(tu){return ts(tu);}var tx=[0,function(tv){tf(tv);caml_ml_output_char(cn,10);tg(cn);cu(0);return caml_sys_exit(2);}];function tX(tz,ty){try {var tA=cO(tz,ty);}catch(tB){return cO(tx[1],tB);}return tA;}function tM(tG,tC,tE){var tD=tC,tF=tE;for(;;)if(typeof tD==="number")return tH(tG,tF);else switch(tD[0]){case 1:cO(tD[1],tG);return tH(tG,tF);case 2:var tI=tD[1],tJ=[0,tD[2],tF],tD=tI,tF=tJ;continue;default:var tK=tD[1][1];return tK?(cO(tK[1],tG),tH(tG,tF)):tH(tG,tF);}}function tH(tN,tL){return tL?tM(tN,tL[1],tL[2]):0;}function tZ(tO,tQ){var tP=tO,tR=tQ;for(;;)if(typeof tP==="number")return tT(tR);else switch(tP[0]){case 1:var tS=tP[1];if(tS[4]){tS[4]=0;tS[1][2]=tS[2];tS[2][1]=tS[1];}return tT(tR);case 2:var tU=tP[1],tV=[0,tP[2],tR],tP=tU,tR=tV;continue;default:var tW=tP[2];to[1]=tP[1];tX(tW,0);return tT(tR);}}function tT(tY){return tY?tZ(tY[1],tY[2]):0;}function t3(t1,t0){var t2=1===t0[0]?t0[1][1]===tk?(tZ(t1[4],0),1):0:0;return tM(t0,t1[2],0);}var t4=[0,0],t5=[0,0,0];function uq(t8,t6){var t7=[0,t6],t9=ts(t8),t_=t9[1];switch(t_[0]){case 1:if(t_[1][1]===tk){var t$=0,ua=1;}else var ua=0;break;case 2:var ub=t_[1];t9[1]=t7;var uc=to[1],ud=t4[1]?1:(t4[1]=1,0);t3(ub,t7);if(ud){to[1]=uc;var ue=0;}else for(;;){if(0!==t5[1]){if(0===t5[1])throw [0,na];t5[1]=t5[1]-1|0;var uf=t5[2],ug=uf[2];if(ug===uf)t5[2]=0;else uf[2]=ug[2];var uh=ug[1];t3(uh[1],uh[2]);continue;}t4[1]=0;to[1]=uc;var ue=0;break;}var t$=ue,ua=1;break;default:var ua=0;}if(!ua)var t$=b$(aM);return t$;}function uo(ui,uj){return typeof ui==="number"?uj:typeof uj==="number"?ui:[2,ui,uj];}function ul(uk){if(typeof uk!=="number")switch(uk[0]){case 2:var um=uk[1],un=ul(uk[2]);return uo(ul(um),un);case 1:break;default:if(!uk[1][1])return 0;}return uk;}var us=[0,function(up){return 0;}],ur=tj(0),uv=[0,0],uA=null,uB=Array;function uF(uz){var ut=1-(ur[2]===ur?1:0);if(ut){var uu=tj(0);uu[1][2]=ur[2];ur[2][1]=uu[1];uu[1]=ur[1];ur[1][2]=uu;ur[1]=ur;ur[2]=ur;uv[1]=0;var uw=uu[2];for(;;){var ux=uw!==uu?1:0;if(ux){if(uw[4])uq(uw[3],0);var uy=uw[2],uw=uy;continue;}return ux;}}return ut;}var uE=undefined,uD=false;function uG(uC){return uC instanceof uB?0:[0,new MlWrappedString(uC.toString())];}sx[1]=[0,uG,sx[1]];function uJ(uH,uI){uH.appendChild(uI);return 0;}var uK=this,uL=uK.document;function uT(uM,uN){return uM?cO(uN,uM[1]):0;}function uQ(uP,uO){return uP.createElement(uO.toString());}function uU(uS,uR){return uQ(uS,uR);}var uV=[0,785140586];function uX(uW){return uU(uW,aA);}this.HTMLElement===uE;var uY=2147483,u0=caml_js_get_console(0);us[1]=function(uZ){return 1===uZ?(uK.setTimeout(caml_js_wrap_callback(uF),0),0):0;};function u2(u1){return u0.log(u1.toString());}tx[1]=function(u3){u2(au);u2(tf(u3));return tg(cn);};function u6(u5,u4){return 0===u4?1003109192:1===u4?u5:[0,748545537,[0,u5,u6(u5,u4-1|0)]];}var vx=aq.slice(),vw=[0,257,258,0],vv=303;function vy(u7){throw [0,dw,dL(u7,0)];}function vz(u8){throw [0,dw,dL(u8,0)];}function vA(u9){return 3901498;}function vB(u_){return -941236332;}function vC(u$){return 15949;}function vD(va){return 17064;}function vE(vb){return 3553395;}function vF(vc){return 3802040;}function vG(vd){return 15500;}function vH(ve){return dL(ve,1);}function vI(vf){return [0,926224370,dL(vf,1)];}function vJ(vg){return [0,974443759,[0,19065,[0,926224370,dL(vg,1)]]];}function vK(vh){var vi=dL(vh,2);return [0,974443759,[0,vi,dL(vh,0)]];}function vL(vj){var vk=dL(vj,2);return [0,-783405316,[0,vk,dL(vj,0)]];}function vM(vl){var vm=dL(vl,2);return [0,748545537,[0,vm,dL(vl,0)]];}function vN(vn){var vo=dL(vn,1);return u6(vo,dL(vn,0));}function vO(vp){var vq=dL(vp,0);return caml_string_equal(vq,as)?19065:caml_string_equal(vq,ar)?1003109192:[0,4298439,vq];}function vP(vr){var vs=dL(vr,2),vt=dL(vr,1);return [0,vt,vs,dL(vr,0)];}var vQ=[0,[0,function(vu){return o(at);},vP,vO,vN,vM,vL,vK,vJ,vI,vH,vG,vF,vE,vD,vC,vB,vA,vz,vy],vx,vw,ap,ao,an,am,al,ak,aj,vv,ai,ah,hY,ag,af];function vZ(vS){var vR=0;for(;;){var vT=dt(i,vR,vS);if(vT<0||20<vT){cO(vS[1],vS);var vR=vT;continue;}switch(vT){case 1:var vV=vU(vS);break;case 2:var vV=1;break;case 3:var vW=vS[5],vX=vS[6]-vW|0,vY=caml_create_string(vX);caml_blit_string(vS[2],vW,vY,0,vX);var vV=[0,vY];break;case 4:var vV=7;break;case 5:var vV=6;break;case 6:var vV=4;break;case 7:var vV=5;break;case 8:var vV=8;break;case 9:var vV=2;break;case 10:var vV=3;break;case 11:var vV=15;break;case 12:var vV=16;break;case 13:var vV=10;break;case 14:var vV=12;break;case 15:var vV=13;break;case 16:var vV=14;break;case 17:var vV=11;break;case 18:var vV=9;break;case 19:var vV=0;break;case 20:var vV=o(cl(ae,di(1,vS[2].safeGet(vS[5]))));break;default:var vV=vZ(vS);}return vV;}}function vU(v1){var v0=25;for(;;){var v2=dt(i,v0,v1);if(v2<0||2<v2){cO(v1[1],v1);var v0=v2;continue;}switch(v2){case 1:var v3=0;break;case 2:var v3=vU(v1);break;default:var v3=1;}return v3;}}function v7(v4){if(typeof v4==="number")return 1003109192<=v4?ad:ac;var v5=v4[1];if(748545537<=v5){if(926224370<=v5){if(974443759<=v5){var v6=v4[2],v8=v7(v6[2]);return j1(sw,ab,v7(v6[1]),v8);}return cX(sw,aa,v7(v4[2]));}if(748545556<=v5)return cX(sw,$,v7(v4[2]));var v9=v4[2],v_=v7(v9[2]);return j1(sw,_,v7(v9[1]),v_);}if(4298439<=v5)return v4[2];var v$=v4[2],wa=v7(v$[2]);return j1(sw,Z,v7(v$[1]),wa);}var wd=[0,function(wc,wb){return caml_compare(wc,wb);}],we=mT(wd),wf=hX(wd);function wi(wh,wg){return caml_compare(wh,wg);}var wj=hX([0,cO(we[8],wi)]),wk=hX([0,wf[10]]),wl=mT([0,wf[10]]);function wz(wr,wo,wn,wm){try {var wp=cX(wo,wn,wm);}catch(wq){if(wq[1]===c)return wr;throw wq;}return wp;}function wA(wv,ww){function wt(ws){if(ws){var wu=wt(ws[2]);return ci(cO(wv,ws[1]),wu);}return ws;}return wt(ww);}var wB=hX([0,function(wy,wx){return caml_compare(wy,wx);}]),wE=hX([0,function(wD,wC){return caml_compare(wD,wC);}]);function wQ(wJ){var wH=wf[1];function wI(wF,wG){return cO(wf[4],wF);}return j1(we[11],wI,wJ,wH);}function wR(wP,wK){function wO(wL){try {var wM=cX(we[22],wL,wK);}catch(wN){if(wN[1]===c)return wL;throw wN;}return wM;}return cX(we[23],wO,wP);}var wS=[0,R];function yA(wT,wU){try {var wV=cX(we[22],wU,wT);}catch(wW){if(wW[1]===c)return wU;throw wW;}return wV;}function yB(w2,w1,w5){var w3=wE[1];function w4(wX){var wY=wX[3],wZ=wX[2],w0=wX[1];return cX(wf[3],wY,w1)?cO(wE[4],[0,w0,wZ,w2]):cO(wE[4],[0,w0,wZ,wY]);}return j1(wE[14],w4,w5,w3);}function yC(w6){var w$=w6[1],w_=w6[2];function xa(w7,w8){var w9=ca(w7[3],w8);return ca(w7[1],w9);}return 1+j1(wE[14],xa,w_,w$)|0;}function yp(xb){return [0,-783405316,[0,xb[1],xb[2]]];}function yz(xc){return [0,748545537,[0,xc[1],xc[2]]];}function xv(xe,xd){return wz(wf[1],we[22],xe,xd);}function yt(xf){var xg=xf[3],xh=xf[2],xi=xf[1],xm=wf[1];function xn(xj,xk){var xl=cX(wf[4],xj[3],xk);return cX(wf[4],xj[1],xl);}var xo=j1(wE[14],xn,xh,xm),xr=we[1];function xs(xp){var xq=cO(wf[5],xp);return cX(we[4],xp,xq);}var xz=j1(wf[14],xs,xo,xr);function xA(xt,xw){var xu=xt[1],xx=xv(xu,xw),xy=cX(wf[4],xt[3],xx);return j1(we[4],xu,xy,xw);}var xB=j1(wE[14],xA,xh,xz);for(;;){var xN=we[1],xO=function(xB){return function(xM,xJ,xL){function xI(xC,xH){var xF=xv(xC,xB);function xG(xE,xD){return cX(wf[4],xE,xD);}return j1(wf[14],xG,xF,xH);}var xK=j1(wf[14],xI,xJ,xJ);return j1(we[4],xM,xK,xL);};}(xB),xP=j1(we[11],xO,xB,xN);if(j1(we[9],wf[11],xP,xB)){if(xi===xg)return o(Q);var xR=function(xQ){return xQ[1]===xi?1:0;},xS=cX(wE[17],xR,xh),xT=cO(wE[20],xS);if(xT){var xU=xT[2],xV=xT[1],xW=xV[3],xX=xV[2];if(xU){var x1=xv(xW,xB),x4=c6(function(x0,xY){var xZ=xv(xY[3],xB);return cX(wf[8],x0,xZ);},x1,xU),x5=function(x3){var x2=xv(xg,xB);return 1-cX(wf[3],x3,x2);},x6=cX(wf[17],x5,x4);if(cO(wf[2],x6)){var x7=0,x8=0,x9=[0,[0,xi,xX,xW],xU];for(;;){if(x9){var x_=x9[2],x$=x9[1],ya=x$[3],yb=xv(ya,xB),yc=xv(xW,xB),yd=cX(wf[8],yc,yb);if(xW===ya&&cO(wf[2],yd))throw [0,d,M];var yg=function(yf){var ye=xv(xg,xB);return 1-cX(wf[3],yf,ye);};if(cX(wf[16],yg,yd)){var yh=[0,x$,x7],x7=yh,x9=x_;continue;}var yi=[0,x$,x8],x8=yi,x9=x_;continue;}var yj=c5(x8),yk=c5(x7);if(0===yj)throw [0,d,P];if(0===yk){if(yj){var yl=yj[2],ym=yj[1][2];if(yl){var yq=[0,4298439,ym];return c6(function(yo,yn){return yp([0,yo,[0,4298439,yn[2]]]);},yq,yl);}return [0,4298439,ym];}return o(O);}var ys=function(yr){return 1-c7(yr,yj);},yv=yt([0,xi,cX(wE[17],ys,xh),xg]),yw=function(yu){return 1-c7(yu,yk);};return yp([0,yt([0,xi,cX(wE[17],yw,xh),xg]),yv]);}}var yx=cO(wf[23],x6),yy=yt([0,yx,xh,xg]);return yz([0,yt([0,xi,xh,yx]),yy]);}return xW===xg?[0,4298439,xX]:yz([0,[0,4298439,xX],yt([0,xW,xh,xg])]);}return o(N);}var xB=xP;continue;}}function B0(yG,yD,yE){if(yD){if(yE)return o(H);var yF=yD[1];}else{if(!yE)return yE;var yF=yE[1];}return [0,yF];}function yT(yL,yH,yJ){if(yH){var yI=yH[1];if(yJ)return [0,ci(yI,yJ[1])];var yK=yI;}else{if(!yJ)return yJ;var yK=yJ[1];}return [0,yK];}function B3(yQ,yM,yO){if(yM){var yN=yM[1];if(yO)return [0,cX(wB[7],yN,yO[1])];var yP=yN;}else{if(!yO)return yO;var yP=yO[1];}return [0,yP];}function Al(yS,yR){return j1(wl[7],yT,yS,yR);}function zp(ze){var zd=wf[1],zf=cX(c6,function(yW,yU){var yV=yU[1],yY=cX(wf[7],yW,yU[2]),yX=yV[2],y4=yV[1],y3=wf[1];function y5(y2,y1){function y0(yZ){return cO(wf[4],yZ[2]);}return cX(wB[14],y0,y1);}var y6=j1(we[11],y5,yX,y3),y7=wQ(yX),za=cX(wf[7],y7,y6);function zb(y$,y9,y8){var y_=cX(wf[4],y9,y8);return cX(wf[4],y$,y_);}var zc=j1(we[11],zb,y4,za);return cX(wf[7],zc,yY);},zd),zg=cO(wf[5],ze[1]),zh=j1(wk[14],wf[7],ze[3],zg),zn=ze[2];function zo(zj,zk,zi){var zl=cX(wf[7],zj,zi),zm=cO(zf,zk);return cX(wf[7],zm,zl);}return j1(wl[11],zo,zn,zh);}function Aa(zr,zq){var zs=zp(zq),zt=zp(zr),zu=cX(wf[8],zt,zs);return cO(wf[2],zu);}function Au(zO,zv,zx){var zw=cO(wf[5],zv),zA=cX(wl[22],zw,zx),zB=cQ(function(zy){var zz=zy[2];return [0,cX(we[22],zv,zy[1][2]),zz];},zA),zM=wl[1];function zN(zC,zL){var zD=cO(wf[23],zC),zF=we[1];function zG(zE){return cX(we[4],zE,zD);}var zJ=j1(wf[14],zG,zC,zF),zK=cQ(function(zH){var zI=zH[2];return [0,[0,zJ,cX(we[5],zD,zH[1])],zI];},zB);return j1(wl[4],zC,zK,zL);}return j1(wk[14],zN,zO,zM);}function Br(zP){var zY=wk[1],zX=zP[2];function zZ(zV,zT){var zS=wk[1],zU=c6(function(zR,zQ){return cX(wk[4],zQ[2],zR);},zS,zT),zW=cX(wk[4],zV,zU);return cO(wk[7],zW);}return j1(wl[11],zZ,zX,zY);}function z3(z4,z0){if(typeof z0!=="number"){var z1=z0[1];if(!(748545537<=z1)){if(4298439<=z1){var AI=cO(wf[5],z4),AJ=cO(wf[5],z4+1|0),AK=cX(we[5],z4,z4),AL=cO(wB[5],[0,z0[2],z4+1|0]),AM=[0,[0,[0,AK,cX(we[5],z4,AL)],AJ],0],AN=cX(wl[5],AI,AM);return [0,[0,z4,AN,cO(wk[5],AJ)],z4+2|0];}var AO=z0[2],AP=z3(z4,AO[1]),AQ=z3(AP[2],AO[2]),AR=AQ[1],AS=AP[1],AT=AR[2],AU=AR[1],AV=AS[2],AW=AS[1],AY=AQ[2],AX=AR[3];if(Aa(AS,AR)){var A4=wk[1],A3=AS[3],A5=function(A0){function A2(AZ){var A1=cX(wf[7],A0,AZ);return cO(wk[4],A1);}return cX(wk[14],A2,AX);},A6=j1(wk[14],A5,A3,A4),A7=cX(we[5],AW,AW),A8=cO(wf[5],AW),A9=cX(wl[22],A8,AV),A_=cO(wf[5],AU),Bh=cX(wl[22],A_,AT),Bj=0,Bk=c6(function(Bi,A$){var Ba=A$[2],Be=cX(we[22],AW,A$[1][2]);return c6(function(Bg,Bb){var Bc=cX(we[22],AU,Bb[1][2]),Bd=cX(wf[7],Ba,Bb[2]),Bf=cX(wB[7],Be,Bc);return [0,[0,[0,A7,cX(we[5],AW,Bf)],Bd],Bg];},Bi,Bh);},Bj,A9),Bl=cO(wf[5],AW),Bm=cX(wl[5],Bl,Bk),Bn=cO(wf[5],AW),Bo=cX(wl[6],Bn,AV),Bp=cO(wf[5],AU),Bq=cX(wl[6],Bp,AT),Bs=wl[1],BE=Br(AS),BF=function(Bv){function BD(BB,Bz){var By=0,BA=c6(function(Bx,Bt){var Bu=Bt[1],Bw=cX(wf[7],Bv,Bt[2]);return [0,[0,[0,Bu[1],Bu[2]],Bw],Bx];},By,Bz),BC=cX(wf[7],Bv,BB);return cX(wl[4],BC,BA);}return cX(wl[11],BD,Bq);},BG=j1(wk[14],BF,BE,Bs),BH=wl[1],BT=Br(AR),BU=function(BK){function BS(BQ,BO){var BN=0,BP=c6(function(BM,BI){var BJ=BI[1],BL=cX(wf[7],BK,BI[2]);return [0,[0,[0,BJ[1],BJ[2]],BL],BM];},BN,BO),BR=cX(wf[7],BK,BQ);return cX(wl[4],BR,BP);}return cX(wl[11],BS,Bo);},BV=j1(wk[14],BU,BT,BH),Ce=wl[1],Cf=function(B$,B8,Cd){function Cc(B_,B5,Cb){var B7=0,B9=c6(function(B6,BY){return c6(function(B4,BW){var BX=BW[1],BZ=BY[1],B1=j1(we[7],B0,BZ[1],BX[1]),B2=cX(wf[7],BY[2],BW[2]);return [0,[0,[0,B1,j1(we[7],B3,BZ[2],BX[2])],B2],B4];},B6,B5);},B7,B8),Ca=cX(wf[7],B$,B_);return j1(wl[4],Ca,B9,Cb);}return j1(wl[11],Cc,Bq,Cd);},Cg=Al(Bm,j1(wl[11],Cf,Bo,Ce));return [0,[0,AW,Al(Al(BG,BV),Cg),A6],AY];}throw [0,d,K];}if(926224370<=z1){if(974443759<=z1){var z2=z0[2],z5=z3(z4,z2[1]),z6=z3(z5[2],z2[2]),z7=z6[1],z8=z5[1],z9=z7[2],z_=z7[1],z$=z8[1],Ab=z6[2];if(Aa(z8,z7)){var Ac=cO(wf[5],z_),Ah=cX(wl[22],Ac,z9),Ai=cQ(function(Ad){var Ae=cX(we[5],z$,z$),Af=cX(we[22],z_,Ad[1][2]),Ag=cX(we[5],z$,Af);return [0,[0,Ae,Ag],Ad[2]];},Ah),Aj=cO(wf[5],z_),Ak=cX(wl[6],Aj,z9),Am=Al(z8[2],Ak),An=cO(wf[5],z$),Ao=Al(cX(wl[5],An,Ai),Am);return [0,[0,z$,Ao,cX(wk[7],z8[3],z7[3])],Ab];}throw [0,d,I];}var Ap=z3(z4,z0[2]),Aq=Ap[1],Ar=Aq[3],As=Aq[2],At=Aq[1],Av=Ap[2];return [0,[0,At,Al(As,Au(Ar,At,As)),Ar],Av];}if(!(748545556<=z1)){var Aw=z0[2],Ax=z3(z4,Aw[1]),Ay=z3(Ax[2],Aw[2]),Az=Ay[1],AA=Ax[1],AB=Az[2],AC=Az[1],AD=Ay[2];if(Aa(AA,Az)){var AE=Au(AA[3],AC,AB),AF=cO(wf[5],AC),AG=cX(wl[6],AF,AB),AH=Al(AE,Al(AA[2],AG));return [0,[0,AA[1],AH,Az[3]],AD];}throw [0,d,J];}}return o(L);}function E1(Ch){return z3(0,Ch)[1];}function Gd(Cj,Ci){var Ck=Cj[1],Cr=Ci[3],Cq=Ci[2],Cp=Cj[3],Co=Cj[2],Cs=hX([0,function(Cm,Cl){var Cn=cX(wf[10],Cm[1],Cl[1]);return 0===Cn?cX(wj[10],Cm[2],Cl[2]):Cn;}]);function EX(Ct){var Cu=Ct[3],Cv=Cu[2],Cw=Cu[1],Cx=Ct[2],Cy=Ct[1],Cz=Cy[3];if(cX(Cs[3],[0,Cw,Cv],Cx))return 0;var CA=cX(Cs[4],[0,Cw,Cv],Cx);if(cX(wk[3],Cw,Cp)){var CD=function(CB){var CC=wQ(CB);return cX(wk[3],CC,Cr);},CE=cX(wj[16],CD,Cv);}else var CE=1;if(CE){var CF=wz(0,wl[22],Cw,Co);return 0===CF?0:cQ(function(CG){var CH=CG[1],CI=CH[1],CJ=Cy[3],CK=Cy[2],CL=Cy[1],CM=CH[2],CO=yC([0,CL,CK,CJ]),CN=cO(yA,CI),CW=we[1];function CX(CP,CT,CR){var CQ=cO(CN,CP),CS=wz(wf[1],we[22],CQ,CR),CU=cX(wf[4],CT,CS),CV=cO(CN,CP);return j1(we[4],CV,CU,CR);}var C0=j1(we[11],CX,CJ,CW);function C1(CZ,CY){return 1<cO(wf[19],CY)?1:0;}var C2=cX(we[14],C1,C0),C3=wQ(CI);function C6(C4,C5){return 1-cX(wf[3],C4,C3);}var Da=cX(we[14],C6,CJ);function Db(C7,C$){try {var C8=cO(CN,C7),C9=cX(we[22],C8,CJ);}catch(C_){if(C_[1]===c)return C$;throw C_;}return C9;}var Dc=cX(we[24],Db,CJ);function Dg(Dd,Df,De){return yB(cX(we[22],Dd,Dc),Df,De);}var Dz=[0,j1(we[11],Dg,C2,CK),Da,CO];function DA(Dh,Dy,Dj){var Di=cO(CN,Dh),Dk=cX(we[22],Di,Dc),Dw=[0,Dj[1],Dj[2],Dj[3]];function Dx(Do,Dl){var Dm=Dl[3],Dn=Dl[2],Dp=Do[2];try {var Dq=[0,cX(we[22],Dp,Dn),Dm],Dr=Dq;}catch(Ds){if(Ds[1]!==c)throw Ds;var Dr=[0,Dm,Dm+1|0];}var Dt=Dr[1],Du=Dr[2],Dv=j1(we[4],Dp,Dt,Dn);return [0,cX(wE[4],[0,Dk,Do[1],Dt],Dl[1]),Dv,Du];}return j1(wB[14],Dx,Dy,Dw);}var DB=j1(we[11],DA,CM,Dz),DC=[0,CL,DB[1],DB[2]],DF=wj[1];function DG(DD){var DE=wR(wR(DD,CI),Cz);return cO(wj[4],DE);}var DH=j1(wj[14],DG,Cv,DF),DM=DC[3];function DQ(DP){function DO(DN,DI){function DL(DK,DJ){return DI===DJ?1:0;}return cX(we[13],DL,DM);}return cX(we[12],DO,DP);}var Ew=cX(wj[17],DQ,DH);function Ex(DR,Ev){var DS=wQ(DR),Eu=wz(0,wl[22],DS,Cq);return c6(function(Et,DT){var DU=DT[1],DV=DU[1],DW=DC[2],DY=cO(yA,DV);function D1(DX,D0){var DZ=cO(DY,DX);return cX(we[22],DZ,DR)!==D0?1:0;}if(cX(we[13],D1,DR))var D2=wj[1];else{var D5=function(D3,D4){return 1-cX(we[3],D3,DV);},D6=cX(we[14],D5,DR),D7=cO(wj[5],D6),Er=DU[2],Es=function(D9,Eq){function Ep(D8,Eo){var Eh=D8[2],Eb=D8[1],Em=wj[1];function En(Eg){var D_=cX(we[22],D9,DR),Ed=wj[1];function Ee(D$){var Ea=D$[1]===D_?1:0,Ec=Ea?caml_string_equal(Eb,D$[2]):Ea;return Ec;}var Ej=cX(wE[17],Ee,DW);function Ek(Ef){var Ei=j1(we[4],Eh,Ef[3],Eg);return cO(wj[4],Ei);}var El=j1(wE[14],Ek,Ej,Ed);return cO(wj[7],El);}return j1(wj[14],En,Eo,Em);}return cX(wB[14],Ep,Eq);},D2=j1(we[11],Es,Er,D7);}return cX(wj[7],Et,D2);},Ev,Eu);}var Ey=j1(wj[14],Ex,DH,Ew),EC=DC[3],EB=we[1];function ED(Ez,EA){return cX(we[4],EA,Ez);}var EE=j1(we[11],ED,EC,EB),EH=wj[1];function EI(EF){var EG=wR(EF,EE);return cO(wj[4],EG);}var EJ=j1(wj[14],EI,Ey,EH);return [0,DC,CA,[0,CG[2],EJ]];},CF);}var EK=Cy[3],EL=Cy[2],EM=Cy[1],EN=yC([0,EM,EL,EK]),EP=wf[1],EQ=function(EO){return wf[4];};throw [0,wS,yt([0,EM,yB(EN,j1(we[11],EQ,EK,EP),EL),EN])];}try {var ER=cX(we[5],Ci[1],Ck),ES=cO(wj[5],ER),ET=[0,cO(wf[5],Ck),ES],EU=Cs[1],EV=cX(we[5],Ck,0),EW=[0,[0,[0,0,wE[1],EV],EU,ET],0];for(;;){var EY=wA(EX,EW);if(EY){var EW=EY;continue;}var EZ=0;break;}}catch(E0){if(E0[1]===wS)return [0,E0[2]];throw E0;}return EZ;}function Ge(E4,E7,E6,E3,E2){var E5=cX(E4,E3,E2);return E5?[0,0,E8(sw,D,E7,E6,v7(E5[1]))]:[0,1,j1(sw,C,E7,E6)];}function Gf(FN,FY,E9){var Fh=[0],Fg=1,Ff=0,Fe=0,Fd=0,Fc=0,Fb=0,Fa=E9.getLen(),E$=cl(E9,bR),Fi=[0,function(E_){E_[9]=1;return 0;},E$,Fa,Fb,Fc,Fd,Fe,Ff,Fg,Fh,f,f],Fp=dy[11],Fo=dy[14],Fn=dy[6],Fm=dy[15],Fl=dy[7],Fk=dy[8],Fj=dy[16];dy[6]=dy[14]+1|0;dy[7]=2;dy[10]=Fi[12];try {var Fq=0,Fr=0;for(;;)switch(caml_parse_engine(vQ,dy,Fq,Fr)){case 1:throw [0,dx];case 2:dH(0);var Ft=0,Fs=2,Fq=Fs,Fr=Ft;continue;case 3:dH(0);var Fv=0,Fu=3,Fq=Fu,Fr=Fv;continue;case 4:try {var Fw=[0,4,cO(caml_array_get(vQ[1],dy[13]),dy)],Fx=Fw;}catch(Fy){if(Fy[1]!==dx)throw Fy;var Fx=[0,5,0];}var FA=Fx[2],Fz=Fx[1],Fq=Fz,Fr=FA;continue;case 5:cO(vQ[14],bQ);var FC=0,FB=5,Fq=FB,Fr=FC;continue;default:var FD=vZ(Fi);dy[9]=Fi[11];dy[10]=Fi[12];var FE=1,Fq=FE,Fr=FD;continue;}}catch(FG){var FF=dy[7];dy[11]=Fp;dy[14]=Fo;dy[6]=Fn;dy[15]=Fm;dy[7]=Fl;dy[8]=Fk;dy[16]=Fj;if(FG[1]===dw){var FH=FG[2],FI=FH[3],FJ=FH[2],FK=FH[1],FL=v7(FI),FM=v7(FJ),FO=cO(FN,FI),FP=cO(FN,FJ),FW=function(FQ){return [0,1-FQ[1],FQ[2]];},FX=function(FS,FR){var FU=cl(FS[2],FR[2]),FT=FS[1],FV=FT?FR[1]:FT;return [0,FV,FU];};if(17064<=FK)if(3802040<=FK)if(3901498<=FK){var FZ=FW(E8(FY,FM,FL,FP,FO)),F0=FZ[2],F1=FZ[1];if(F1)var F2=[0,F1,F0];else{var F3=FW(E8(FY,FL,FM,FO,FP)),F4=cl(F0,F3[2]),F2=[0,F3[1],F4];}var F5=F2;}else var F5=E8(FY,FM,FL,FP,FO);else if(3553395<=FK)var F5=E8(FY,FL,FM,FO,FP);else{var F6=FW(E8(FY,FL,FM,FO,FP)),F5=FX(E8(FY,FM,FL,FP,FO),F6);}else if(15500===FK){var F7=E8(FY,FL,FM,FO,FP),F5=FX(E8(FY,FM,FL,FP,FO),F7);}else if(15949<=FK){var F8=E8(FY,FL,FM,FO,FP),F5=FX(FW(E8(FY,FM,FL,FP,FO)),F8);}else{var F9=FW(E8(FY,FL,FM,FO,FP)),F5=FX(FW(E8(FY,FM,FL,FP,FO)),F9);}var F_=F5[1],Ga=F5[2],F$=F_?G:F,Gb=17064<=FK?3802040<=FK?3901498<=FK?Y:X:3553395<=FK?W:V:15500===FK?S:15949<=FK?U:T;return [0,F_,si(sw,E,FM,Gb,FL,F$,Ga)];}dM[1]=function(Gc){return caml_obj_is_block(Gc)?caml_array_get(vQ[3],caml_obj_tag(Gc))===FF?1:0:caml_array_get(vQ[2],Gc)===FF?1:0;};throw FG;}}var GT=cX(Gf,E1,cO(Ge,Gd));function GS(Gg){function Gk(Gj,Gl,Gh){try {var Gi=Gg.safeGet(Gh),Gm=10===Gi?caml_string_equal(Gj,t)?Gk(s,Gl,Gh+1|0):Gk(r,[0,Gj,Gl],Gh+1|0):(j.safeSet(0,Gi),Gk(cl(Gj,j),Gl,Gh+1|0));}catch(Gn){if(Gn[1]===b)return c5([0,Gj,Gl]);throw Gn;}return Gm;}return Gk(q,0,0);}function GU(Gp,Go){try {var Gq=cO(Gp,Go);}catch(Gr){if(Gr[1]===dx)return u;throw Gr;}return Gq;}function HY(HX){var Gs=uL.getElementById(A.toString());if(Gs==uA)throw [0,d,B];var Gt=uU(uL,ay),Gu=uU(uL,az),Gv=uX(uL),Gw=0,Gx=0;for(;;){if(0===Gx&&0===Gw){var Gy=uQ(uL,h),Gz=1;}else var Gz=0;if(!Gz){var GA=uV[1];if(785140586===GA){try {var GB=uL.createElement(aD.toString()),GC=aC.toString(),GD=GB.tagName.toLowerCase()===GC?1:0,GE=GD?GB.name===aB.toString()?1:0:GD,GF=GE;}catch(GH){var GF=0;}var GG=GF?982028505:-1003883683;uV[1]=GG;continue;}if(982028505<=GA){var GI=new uB();GI.push(aG.toString(),h.toString());uT(Gx,function(GJ){GI.push(aH.toString(),caml_js_html_escape(GJ),aI.toString());return 0;});uT(Gw,function(GK){GI.push(aJ.toString(),caml_js_html_escape(GK),aK.toString());return 0;});GI.push(aF.toString());var Gy=uL.createElement(GI.join(aE.toString()));}else{var GL=uQ(uL,h);uT(Gx,function(GM){return GL.type=GM;});uT(Gw,function(GN){return GL.name=GN;});var Gy=GL;}}Gy.rows=20;Gy.cols=50;Gy.value=p.toString();var GO=uX(uL);GO.style.border=z.toString();GO.style.padding=y.toString();GO.style.width=x.toString();uJ(Gs,Gt);uJ(Gt,Gu);uJ(Gu,Gv);uJ(Gv,Gy);uJ(Gu,GO);var G_=function(GQ,G9){var GP=new MlWrappedString(Gy.value);if(caml_string_notequal(GP,GQ)){try {var GR=uU(uL,av),GV=GS(GP),GZ=cQ(cO(GU,GT),GV),G1=wA(function(GW){var GX=GW[2],GY=caml_string_notequal(GX,v);return GY?GS(GX):GY;},GZ),G2=cQ(function(G0){return G0.toString();},G1);for(;;){if(G2){var G5=G2[2],G4=G2[1],G3=uU(uL,ax);G3.innerHTML=G4;uJ(GR,G3);uJ(GR,uU(uL,aw));var G2=G5;continue;}var G6=GO.firstChild;if(G6!=uA)GO.removeChild(G6);uJ(GO,GR);break;}}catch(G8){}var G7=20;}else var G7=ca(0,G9-1|0);function Ha(G$){return G_(GP,G7);}var Hb=0===G7?0.5:0.1,Hc=[0,[2,[0,1,0,0,0]]],Hd=[0,0];function Hi(He,Hk){var Hf=uY<He?[0,uY,He-uY]:[0,He,0],Hg=Hf[2],Hj=Hf[1],Hh=Hg==0?cO(uq,Hc):cO(Hi,Hg);Hd[1]=[0,uK.setTimeout(caml_js_wrap_callback(Hh),Hj*1e3)];return 0;}Hi(Hb,0);function Hn(Hm){var Hl=Hd[1];return Hl?uK.clearTimeout(Hl[1]):0;}var Ho=tw(Hc)[1];switch(Ho[0]){case 1:var Hp=Ho[1][1]===tk?(tX(Hn,0),1):0;break;case 2:var Hq=Ho[1],Hr=[0,to[1],Hn],Hs=Hq[4],Ht=typeof Hs==="number"?Hr:[2,Hr,Hs];Hq[4]=Ht;var Hp=1;break;default:var Hp=0;}var Hu=tw(Hc),Hv=Hu[1];switch(Hv[0]){case 1:var Hw=[0,Hv];break;case 2:var Hx=Hv[1],Hy=[0,[2,[0,[0,[0,Hu]],0,0,0]]],HA=to[1],HU=[1,function(Hz){switch(Hz[0]){case 0:var HB=Hz[1];to[1]=HA;try {var HC=Ha(HB),HD=HC;}catch(HE){var HD=[0,[1,HE]];}var HF=tw(Hy),HG=tw(HD),HH=HF[1];{if(2===HH[0]){var HI=HH[1];if(HF===HG)var HJ=0;else{var HK=HG[1];if(2===HK[0]){var HL=HK[1];HG[1]=[3,HF];HI[1]=HL[1];var HM=uo(HI[2],HL[2]),HN=HI[3]+HL[3]|0;if(tn<HN){HI[3]=0;HI[2]=ul(HM);}else{HI[3]=HN;HI[2]=HM;}var HO=HL[4],HP=HI[4],HQ=typeof HP==="number"?HO:typeof HO==="number"?HP:[2,HP,HO];HI[4]=HQ;var HJ=0;}else{HF[1]=HK;var HJ=t3(HI,HK);}}return HJ;}throw [0,d,aN];}case 1:var HR=tw(Hy),HS=HR[1];{if(2===HS[0]){var HT=HS[1];HR[1]=Hz;return t3(HT,Hz);}throw [0,d,aO];}default:throw [0,d,aQ];}}],HV=Hx[2],HW=typeof HV==="number"?HU:[2,HU,HV];Hx[2]=HW;var Hw=Hy;break;case 3:throw [0,d,aP];default:var Hw=Ha(Hv[1]);}return Hw;};G_(w,0);return uD;}}uK.onload=caml_js_wrap_callback(function(HZ){if(HZ){var H0=HY(HZ);if(!(H0|0))HZ.preventDefault();return H0;}var H1=event,H2=HY(H1);if(!(H2|0))H1.returnValue=H2;return H2;});cu(0);return;}());
