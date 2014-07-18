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
(function(){function sA(HX,HY,HZ,H0,H1,H2,H3){return HX.length==6?HX(HY,HZ,H0,H1,H2,H3):caml_call_gen(HX,[HY,HZ,H0,H1,H2,H3]);}function EU(HS,HT,HU,HV,HW){return HS.length==4?HS(HT,HU,HV,HW):caml_call_gen(HS,[HT,HU,HV,HW]);}function kh(HO,HP,HQ,HR){return HO.length==3?HO(HP,HQ,HR):caml_call_gen(HO,[HP,HQ,HR]);}function dc(HL,HM,HN){return HL.length==2?HL(HM,HN):caml_call_gen(HL,[HM,HN]);}function c1(HJ,HK){return HJ.length==1?HJ(HK):caml_call_gen(HJ,[HK]);}var a=[0,new MlString("Failure")],b=[0,new MlString("Invalid_argument")],c=[0,new MlString("Not_found")],d=[0,new MlString("Assert_failure")],e=[0,new MlString(""),0,0,-1],f=[0,new MlString(""),1,0,0],g=new MlString("File \"%s\", line %d, characters %d-%d: %s"),h=new MlString("textarea"),i=[0,new MlString("\0\0\xeb\xff\xec\xff\x02\0\x1e\0L\0\xf5\xff\xf6\xff\xf7\xff\xf8\xff\xf9\xff\xfa\xff\xfb\xffM\0\xfd\xff\x0b\0\xbf\0\xfe\xff\x03\0 \0\xf4\xff\xf3\xff\xef\xff\xf2\xff\xee\xff\x01\0\xfd\xff\xfe\xff\xff\xff"),new MlString("\xff\xff\xff\xff\xff\xff\x0f\0\x0e\0\x12\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x03\0\xff\xff\x14\0\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString("\x01\0\0\0\0\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\xff\xff\xff\xff\0\0\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\x1a\0\0\0\0\0\0\0"),new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\x0e\0\x1c\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\b\0\0\0\x07\0\x06\0\f\0\x0b\0\x10\0\0\0\t\0\x0f\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x11\0\0\0\x04\0\x05\0\x03\0\x18\0\x15\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x17\0\x16\0\x14\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x12\0\n\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\x13\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x10\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x02\0\x1b\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"),new MlString("\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\0\0\x19\0\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x0f\0\xff\xff\0\0\0\0\0\0\x03\0\x12\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x13\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x05\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\x05\0\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x10\0\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\x19\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString("")],j=new MlString(" ");caml_register_global(6,c);caml_register_global(5,[0,new MlString("Division_by_zero")]);caml_register_global(3,b);caml_register_global(2,a);var cl=[0,new MlString("Out_of_memory")],ck=[0,new MlString("Match_failure")],cj=[0,new MlString("Stack_overflow")],ci=[0,new MlString("Undefined_recursive_module")],ch=new MlString("%.12g"),cg=new MlString("."),cf=new MlString("%d"),ce=new MlString("true"),cd=new MlString("false"),cc=new MlString("Pervasives.do_at_exit"),cb=new MlString("Array.blit"),ca=new MlString("\\b"),b$=new MlString("\\t"),b_=new MlString("\\n"),b9=new MlString("\\r"),b8=new MlString("\\\\"),b7=new MlString("\\'"),b6=new MlString("String.blit"),b5=new MlString("String.sub"),b4=new MlString(""),b3=new MlString("syntax error"),b2=new MlString("Parsing.YYexit"),b1=new MlString("Parsing.Parse_error"),b0=new MlString("Set.remove_min_elt"),bZ=[0,0,0,0],bY=[0,0,0],bX=new MlString("Set.bal"),bW=new MlString("Set.bal"),bV=new MlString("Set.bal"),bU=new MlString("Set.bal"),bT=new MlString("Map.remove_min_elt"),bS=[0,0,0,0],bR=[0,new MlString("map.ml"),270,10],bQ=[0,0,0],bP=new MlString("Map.bal"),bO=new MlString("Map.bal"),bN=new MlString("Map.bal"),bM=new MlString("Map.bal"),bL=new MlString("Queue.Empty"),bK=new MlString("Buffer.add: cannot grow buffer"),bJ=new MlString(""),bI=new MlString(""),bH=new MlString("%.12g"),bG=new MlString("\""),bF=new MlString("\""),bE=new MlString("'"),bD=new MlString("'"),bC=new MlString("nan"),bB=new MlString("neg_infinity"),bA=new MlString("infinity"),bz=new MlString("."),by=new MlString("printf: bad positional specification (0)."),bx=new MlString("%_"),bw=[0,new MlString("printf.ml"),143,8],bv=new MlString("'"),bu=new MlString("Printf: premature end of format string '"),bt=new MlString("'"),bs=new MlString(" in format string '"),br=new MlString(", at char number "),bq=new MlString("Printf: bad conversion %"),bp=new MlString("Sformat.index_of_int: negative argument "),bo=new MlString(""),bn=new MlString(", %s%s"),bm=[1,1],bl=new MlString("%s\n"),bk=new MlString("(Program not linked with -g, cannot print stack backtrace)\n"),bj=new MlString("Raised at"),bi=new MlString("Re-raised at"),bh=new MlString("Raised by primitive operation at"),bg=new MlString("Called from"),bf=new MlString("%s file \"%s\", line %d, characters %d-%d"),be=new MlString("%s unknown location"),bd=new MlString("Out of memory"),bc=new MlString("Stack overflow"),bb=new MlString("Pattern matching failed"),ba=new MlString("Assertion failed"),a$=new MlString("Undefined recursive module"),a_=new MlString("(%s%s)"),a9=new MlString(""),a8=new MlString(""),a7=new MlString("(%s)"),a6=new MlString("%d"),a5=new MlString("%S"),a4=new MlString("_"),a3=[0,new MlString("src/core/lwt.ml"),648,20],a2=[0,new MlString("src/core/lwt.ml"),651,8],a1=[0,new MlString("src/core/lwt.ml"),498,8],a0=[0,new MlString("src/core/lwt.ml"),487,9],aZ=new MlString("Lwt.wakeup_result"),aY=new MlString("Lwt.Canceled"),aX=new MlString("\""),aW=new MlString(" name=\""),aV=new MlString("\""),aU=new MlString(" type=\""),aT=new MlString("<"),aS=new MlString(">"),aR=new MlString(""),aQ=new MlString("<input name=\"x\">"),aP=new MlString("input"),aO=new MlString("x"),aN=new MlString("td"),aM=new MlString("tr"),aL=new MlString("table"),aK=new MlString("a"),aJ=new MlString("br"),aI=new MlString("p"),aH=new MlString("Exception during Lwt.async: "),aG=new MlString("parser"),aF=new MlString("1"),aE=new MlString("0"),aD=[0,0,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,0],aC=new MlString("\xff\xff\x02\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\0\0\0\0"),aB=new MlString("\x02\0\x03\0\x01\0\x02\0\x03\0\x03\0\x03\0\x02\0\x02\0\x03\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x02\0\x02\0"),aA=new MlString("\0\0\0\0\0\0\0\0\x02\0\0\0\0\0\0\0\x12\0\0\0\x03\0\0\0\0\0\b\0\x07\0\0\0\n\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\0\0\t\0\0\0\0\0\0\0\0\0"),az=new MlString("\x03\0\x06\0\b\0\x17\0"),ay=new MlString("\x05\0\x01\xff\x01\xff\0\0\0\0\x01\xff\n\xff\x18\xff\0\0'\xff\0\0\x01\xff\x01\xff\0\0\0\0\x01\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x01\xff\0\x000\xff<\xff4\xff\n\xff"),ax=new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x1d\0\x01\0\x0f\0\b\0"),aw=new MlString("\0\0\xfe\xff\0\0\0\0"),av=new MlString("\x07\0\x06\0\x04\0\t\0\x11\0\x05\0\x01\0\x02\0\x01\0\x19\0\x1a\0\0\0\n\0\x1b\0\0\0\x05\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x1c\0\0\0\0\0\0\0\0\0\n\0\0\0\0\0\x04\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\x11\0\x12\0\x13\0\x14\0\x15\0\n\0\x16\0\0\0\x18\0\x0b\0\f\0\r\0\x0e\0\x0f\0\n\0\0\0\0\0\0\0\n\0\f\0\r\0\x0e\0\x0f\0\f\0\r\0\x0e\0\n\0\0\0\0\0\0\0\0\0\0\0\r\0\x0e\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x06\0\x06\0\x06\0\0\0\0\0\x06\0\x06\0\x06\0\x06\0\x06\0\x06\0\x06\0\0\0\x06\0\x05\0\x05\0\0\0\0\0\0\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\0\0\x05\0\x04\0\x04\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\0\0\x04\0"),au=new MlString("\x02\0\0\0\x01\x01\x05\0\0\0\x04\x01\x01\0\x02\0\0\0\x0b\0\f\0\xff\xff\x02\x01\x0f\0\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x17\0\xff\xff\xff\xff\xff\xff\xff\xff\x02\x01\xff\xff\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\x02\x01\x12\x01\xff\xff\x05\x01\x06\x01\x07\x01\b\x01\t\x01\n\x01\x02\x01\xff\xff\xff\xff\xff\xff\x02\x01\x07\x01\b\x01\t\x01\n\x01\x07\x01\b\x01\t\x01\x02\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\b\x01\t\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x05\x01\x06\x01\x07\x01\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\xff\xff\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01"),at=new MlString("EOF\0NEWLINE\0LPAR\0RPAR\0PLUS\0DOT\0PSTAR\0STAR\0INTER\0EGAL\0LEQ\0GEQ\0LT\0GT\0IMCOMP\0DUNNO\0DIFF\0"),as=new MlString("VAR\0POWER\0"),ar=new MlString("lexing error"),aq=new MlString("\xc3\xb8"),ap=new MlString("\xce\xb5"),ao=new MlString("(%s | %s)"),an=new MlString("(%s)+"),am=new MlString("(%s)~"),al=new MlString("%s.%s"),ak=new MlString("(%s & %s)"),aj=new MlString("Tools.ContreExemple"),ai=new MlString("get_expr : empty word"),ah=[0,new MlString("word.ml"),260,4],ag=new MlString("get_expr : stuck"),af=new MlString("get_expr : stuck"),ae=[0,new MlString("word.ml"),210,15],ad=new MlString("Lts.trad : unsupported operation"),ac=[0,new MlString("lts.ml"),130,2],ab=[0,new MlString("lts.ml"),99,2],aa=[0,new MlString("lts.ml"),63,2],$=new MlString("mergeint : conflict"),_=new MlString("e2"),Z=new MlString("e1"),Y=new MlString("e1"),X=new MlString("e2"),W=new MlString("e2"),V=new MlString("e1"),U=new MlString("e1"),T=new MlString("e2"),S=new MlString("e1"),R=new MlString("e2"),Q=new MlString("e2"),P=new MlString("e1"),O=new MlString("e1"),N=new MlString("e2"),M=new MlString("e2"),L=new MlString("e1"),K=new MlString("e1"),J=new MlString("e2"),I=new MlString("e2"),H=new MlString("e1"),G=new MlString("e1"),F=new MlString("e2"),E=new MlString("e2"),D=new MlString("e1"),C=new MlString("OK"),B=new MlString("Incorrect"),A=new MlString("%s --------- %s\n%s\n\n"),z=new MlString("\n%s <= %s : false (%s)"),y=new MlString("\n%s <= %s : true"),x=[0,new MlString("wmain.ml"),50,17],w=new MlString("zob"),v=new MlString("1px black dashed"),u=new MlString("5px"),t=new MlString("400px"),s=new MlString(""),r=[0,0,new MlString("")],q=new MlString(""),p=new MlString("");function o(k){throw [0,a,k];}function cm(l){throw [0,b,l];}function cn(n,m){return caml_greaterequal(n,m)?n:m;}function cy(co,cq){var cp=co.getLen(),cr=cq.getLen(),cs=caml_create_string(cp+cr|0);caml_blit_string(co,0,cs,0,cp);caml_blit_string(cq,0,cs,cp,cr);return cs;}function cz(ct){return caml_format_int(cf,ct);}function cv(cu,cw){if(cu){var cx=cu[1];return [0,cx,cv(cu[2],cw)];}return cw;}var cA=caml_ml_open_descriptor_out(2);function cI(cC,cB){return caml_ml_output(cC,cB,0,cB.getLen());}function cH(cG){var cD=caml_ml_out_channels_list(0);for(;;){if(cD){var cE=cD[2];try {}catch(cF){}var cD=cE;continue;}return 0;}}caml_register_named_value(cc,cH);function cM(cK,cJ){return caml_ml_output_char(cK,cJ);}function cT(cL){return caml_ml_flush(cL);}function cS(cP,cO,cR,cQ,cN){if(0<=cN&&0<=cO&&!((cP.length-1-cN|0)<cO)&&0<=cQ&&!((cR.length-1-cN|0)<cQ))return caml_array_blit(cP,cO,cR,cQ,cN);return cm(cb);}function dk(cU){var cV=cU,cW=0;for(;;){if(cV){var cX=cV[2],cY=[0,cV[1],cW],cV=cX,cW=cY;continue;}return cW;}}function c3(c0,cZ){if(cZ){var c2=cZ[2],c4=c1(c0,cZ[1]);return [0,c4,c3(c0,c2)];}return 0;}function dl(c7,c5){var c6=c5;for(;;){if(c6){var c8=c6[2];c1(c7,c6[1]);var c6=c8;continue;}return 0;}}function dm(db,c9,c$){var c_=c9,da=c$;for(;;){if(da){var dd=da[2],de=dc(db,c_,da[1]),c_=de,da=dd;continue;}return c_;}}function dn(dh,df){var dg=df;for(;;){if(dg){var di=dg[2],dj=0===caml_compare(dg[1],dh)?1:0;if(dj)return dj;var dg=di;continue;}return 0;}}function dB(dp,dr){var dq=caml_create_string(dp);caml_fill_string(dq,0,dp,dr);return dq;}function dC(du,ds,dt){if(0<=ds&&0<=dt&&!((du.getLen()-dt|0)<ds)){var dv=caml_create_string(dt);caml_blit_string(du,ds,dv,0,dt);return dv;}return cm(b5);}function dD(dy,dx,dA,dz,dw){if(0<=dw&&0<=dx&&!((dy.getLen()-dw|0)<dx)&&0<=dz&&!((dA.getLen()-dw|0)<dz))return caml_blit_string(dy,dx,dA,dz,dw);return cm(b6);}var dE=caml_sys_const_word_size(0),dF=caml_mul(dE/8|0,(1<<(dE-10|0))-1|0)-1|0,dN=252,dM=253;function dL(dI,dH,dG){var dJ=caml_lex_engine(dI,dH,dG);if(0<=dJ){dG[11]=dG[12];var dK=dG[12];dG[12]=[0,dK[1],dK[2],dK[3],dG[4]+dG[6]|0];}return dJ;}var dO=[0,b2],dP=[0,b1],dQ=[0,caml_make_vect(100,0),caml_make_vect(100,0),caml_make_vect(100,e),caml_make_vect(100,e),100,0,0,0,e,e,0,0,0,0,0,0];function dZ(dX){var dR=dQ[5],dS=dR*2|0,dT=caml_make_vect(dS,0),dU=caml_make_vect(dS,0),dV=caml_make_vect(dS,e),dW=caml_make_vect(dS,e);cS(dQ[1],0,dT,0,dR);dQ[1]=dT;cS(dQ[2],0,dU,0,dR);dQ[2]=dU;cS(dQ[3],0,dV,0,dR);dQ[3]=dV;cS(dQ[4],0,dW,0,dR);dQ[4]=dW;dQ[5]=dS;return 0;}var d4=[0,function(dY){return 0;}];function d3(d0,d1){return caml_array_get(d0[2],d0[11]-d1|0);}function ie(d2){return 0;}function id(eA){function eh(d5){return d5?d5[4]:0;}function ej(d6,d$,d8){var d7=d6?d6[4]:0,d9=d8?d8[4]:0,d_=d9<=d7?d7+1|0:d9+1|0;return [0,d6,d$,d8,d_];}function eE(ea,ek,ec){var eb=ea?ea[4]:0,ed=ec?ec[4]:0;if((ed+2|0)<eb){if(ea){var ee=ea[3],ef=ea[2],eg=ea[1],ei=eh(ee);if(ei<=eh(eg))return ej(eg,ef,ej(ee,ek,ec));if(ee){var em=ee[2],el=ee[1],en=ej(ee[3],ek,ec);return ej(ej(eg,ef,el),em,en);}return cm(bX);}return cm(bW);}if((eb+2|0)<ed){if(ec){var eo=ec[3],ep=ec[2],eq=ec[1],er=eh(eq);if(er<=eh(eo))return ej(ej(ea,ek,eq),ep,eo);if(eq){var et=eq[2],es=eq[1],eu=ej(eq[3],ep,eo);return ej(ej(ea,ek,es),et,eu);}return cm(bV);}return cm(bU);}var ev=ed<=eb?eb+1|0:ed+1|0;return [0,ea,ek,ec,ev];}function eD(eB,ew){if(ew){var ex=ew[3],ey=ew[2],ez=ew[1],eC=dc(eA[1],eB,ey);return 0===eC?ew:0<=eC?eE(ez,ey,eD(eB,ex)):eE(eD(eB,ez),ey,ex);}return [0,0,eB,0,1];}function eL(eF){return [0,0,eF,0,1];}function eH(eI,eG){if(eG){var eK=eG[3],eJ=eG[2];return eE(eH(eI,eG[1]),eJ,eK);}return eL(eI);}function eN(eO,eM){if(eM){var eQ=eM[2],eP=eM[1];return eE(eP,eQ,eN(eO,eM[3]));}return eL(eO);}function eV(eR,eW,eS){if(eR){if(eS){var eT=eS[4],eU=eR[4],e1=eS[3],e2=eS[2],e0=eS[1],eX=eR[3],eY=eR[2],eZ=eR[1];return (eT+2|0)<eU?eE(eZ,eY,eV(eX,eW,eS)):(eU+2|0)<eT?eE(eV(eR,eW,e0),e2,e1):ej(eR,eW,eS);}return eN(eW,eR);}return eH(eW,eS);}function ff(e3){var e4=e3;for(;;){if(e4){var e5=e4[1];if(e5){var e4=e5;continue;}return e4[2];}throw [0,c];}}function fu(e6){var e7=e6;for(;;){if(e7){var e8=e7[3],e9=e7[2];if(e8){var e7=e8;continue;}return e9;}throw [0,c];}}function fa(e_){if(e_){var e$=e_[1];if(e$){var fc=e_[3],fb=e_[2];return eE(fa(e$),fb,fc);}return e_[3];}return cm(b0);}function fv(fd,fe){if(fd){if(fe){var fg=fa(fe);return eV(fd,ff(fe),fg);}return fd;}return fe;}function fn(fl,fh){if(fh){var fi=fh[3],fj=fh[2],fk=fh[1],fm=dc(eA[1],fl,fj);if(0===fm)return [0,fk,1,fi];if(0<=fm){var fo=fn(fl,fi),fq=fo[3],fp=fo[2];return [0,eV(fk,fj,fo[1]),fp,fq];}var fr=fn(fl,fk),ft=fr[2],fs=fr[1];return [0,fs,ft,eV(fr[3],fj,fi)];}return bZ;}var h_=0;function h$(fw){return fw?0:1;}function ia(fz,fx){var fy=fx;for(;;){if(fy){var fC=fy[3],fB=fy[1],fA=dc(eA[1],fz,fy[2]),fD=0===fA?1:0;if(fD)return fD;var fE=0<=fA?fC:fB,fy=fE;continue;}return 0;}}function fN(fJ,fF){if(fF){var fG=fF[3],fH=fF[2],fI=fF[1],fK=dc(eA[1],fJ,fH);if(0===fK){if(fI)if(fG){var fL=fa(fG),fM=eE(fI,ff(fG),fL);}else var fM=fI;else var fM=fG;return fM;}return 0<=fK?eE(fI,fH,fN(fJ,fG)):eE(fN(fJ,fI),fH,fG);}return 0;}function fV(fO,fP){if(fO){if(fP){var fQ=fP[4],fR=fP[2],fS=fO[4],fT=fO[2],f1=fP[3],f3=fP[1],fW=fO[3],fY=fO[1];if(fQ<=fS){if(1===fQ)return eD(fR,fO);var fU=fn(fT,fP),fX=fU[1],fZ=fV(fW,fU[3]);return eV(fV(fY,fX),fT,fZ);}if(1===fS)return eD(fT,fP);var f0=fn(fR,fO),f2=f0[1],f4=fV(f0[3],f1);return eV(fV(f2,f3),fR,f4);}return fO;}return fP;}function ga(f5,f6){if(f5){if(f6){var f7=f5[3],f8=f5[2],f9=f5[1],f_=fn(f8,f6),f$=f_[1];if(0===f_[2]){var gb=ga(f7,f_[3]);return fv(ga(f9,f$),gb);}var gc=ga(f7,f_[3]);return eV(ga(f9,f$),f8,gc);}return 0;}return 0;}function gk(gd,ge){if(gd){if(ge){var gf=gd[3],gg=gd[2],gh=gd[1],gi=fn(gg,ge),gj=gi[1];if(0===gi[2]){var gl=gk(gf,gi[3]);return eV(gk(gh,gj),gg,gl);}var gm=gk(gf,gi[3]);return fv(gk(gh,gj),gm);}return gd;}return 0;}function gt(gn,gp){var go=gn,gq=gp;for(;;){if(go){var gr=go[1],gs=[0,go[2],go[3],gq],go=gr,gq=gs;continue;}return gq;}}function gH(gv,gu){var gw=gt(gu,0),gx=gt(gv,0),gy=gw;for(;;){if(gx)if(gy){var gD=gy[3],gC=gy[2],gB=gx[3],gA=gx[2],gz=dc(eA[1],gx[1],gy[1]);if(0===gz){var gE=gt(gC,gD),gF=gt(gA,gB),gx=gF,gy=gE;continue;}var gG=gz;}else var gG=1;else var gG=gy?-1:0;return gG;}}function ib(gJ,gI){return 0===gH(gJ,gI)?1:0;}function gU(gK,gM){var gL=gK,gN=gM;for(;;){if(gL){if(gN){var gO=gN[3],gP=gN[1],gQ=gL[3],gR=gL[2],gS=gL[1],gT=dc(eA[1],gR,gN[2]);if(0===gT){var gV=gU(gS,gP);if(gV){var gL=gQ,gN=gO;continue;}return gV;}if(0<=gT){var gW=gU([0,0,gR,gQ,0],gO);if(gW){var gL=gS;continue;}return gW;}var gX=gU([0,gS,gR,0,0],gP);if(gX){var gL=gQ;continue;}return gX;}return 0;}return 1;}}function g0(g1,gY){var gZ=gY;for(;;){if(gZ){var g3=gZ[3],g2=gZ[2];g0(g1,gZ[1]);c1(g1,g2);var gZ=g3;continue;}return 0;}}function g8(g9,g4,g6){var g5=g4,g7=g6;for(;;){if(g5){var g$=g5[3],g_=g5[2],ha=dc(g9,g_,g8(g9,g5[1],g7)),g5=g$,g7=ha;continue;}return g7;}}function hh(hd,hb){var hc=hb;for(;;){if(hc){var hg=hc[3],hf=hc[1],he=c1(hd,hc[2]);if(he){var hi=hh(hd,hf);if(hi){var hc=hg;continue;}var hj=hi;}else var hj=he;return hj;}return 1;}}function hr(hm,hk){var hl=hk;for(;;){if(hl){var hp=hl[3],ho=hl[1],hn=c1(hm,hl[2]);if(hn)var hq=hn;else{var hs=hr(hm,ho);if(!hs){var hl=hp;continue;}var hq=hs;}return hq;}return 0;}}function hv(hw,ht){if(ht){var hu=ht[2],hy=ht[3],hx=hv(hw,ht[1]),hA=c1(hw,hu),hz=hv(hw,hy);return hA?eV(hx,hu,hz):fv(hx,hz);}return 0;}function hD(hE,hB){if(hB){var hC=hB[2],hG=hB[3],hF=hD(hE,hB[1]),hH=hF[2],hI=hF[1],hK=c1(hE,hC),hJ=hD(hE,hG),hL=hJ[2],hM=hJ[1];if(hK){var hN=fv(hH,hL);return [0,eV(hI,hC,hM),hN];}var hO=eV(hH,hC,hL);return [0,fv(hI,hM),hO];}return bY;}function hQ(hP){if(hP){var hR=hP[1],hS=hQ(hP[3]);return (hQ(hR)+1|0)+hS|0;}return 0;}function hX(hT,hV){var hU=hT,hW=hV;for(;;){if(hW){var hZ=hW[2],hY=hW[1],h0=[0,hZ,hX(hU,hW[3])],hU=h0,hW=hY;continue;}return hU;}}function ic(h1){return hX(0,h1);}return [0,h_,h$,ia,eD,eL,fN,fV,ga,gk,gH,ib,gU,g0,g8,hh,hr,hv,hD,hQ,ic,ff,fu,ff,fn,function(h5,h2){var h3=h2;for(;;){if(h3){var h4=h3[2],h8=h3[3],h7=h3[1],h6=dc(eA[1],h5,h4);if(0===h6)return h4;var h9=0<=h6?h8:h7,h3=h9;continue;}throw [0,c];}}];}function m$(i0){function ih(ig){return ig?ig[5]:0;}function iB(ii,ip,io,ik){var ij=ih(ii),il=ih(ik),im=il<=ij?ij+1|0:il+1|0;return [0,ii,ip,io,ik,im];}function iS(ir,iq){return [0,0,ir,iq,0,1];}function iT(is,iD,iC,iu){var it=is?is[5]:0,iv=iu?iu[5]:0;if((iv+2|0)<it){if(is){var iw=is[4],ix=is[3],iy=is[2],iz=is[1],iA=ih(iw);if(iA<=ih(iz))return iB(iz,iy,ix,iB(iw,iD,iC,iu));if(iw){var iG=iw[3],iF=iw[2],iE=iw[1],iH=iB(iw[4],iD,iC,iu);return iB(iB(iz,iy,ix,iE),iF,iG,iH);}return cm(bP);}return cm(bO);}if((it+2|0)<iv){if(iu){var iI=iu[4],iJ=iu[3],iK=iu[2],iL=iu[1],iM=ih(iL);if(iM<=ih(iI))return iB(iB(is,iD,iC,iL),iK,iJ,iI);if(iL){var iP=iL[3],iO=iL[2],iN=iL[1],iQ=iB(iL[4],iK,iJ,iI);return iB(iB(is,iD,iC,iN),iO,iP,iQ);}return cm(bN);}return cm(bM);}var iR=iv<=it?it+1|0:iv+1|0;return [0,is,iD,iC,iu,iR];}var m4=0;function m5(iU){return iU?0:1;}function i5(i1,i4,iV){if(iV){var iW=iV[4],iX=iV[3],iY=iV[2],iZ=iV[1],i3=iV[5],i2=dc(i0[1],i1,iY);return 0===i2?[0,iZ,i1,i4,iW,i3]:0<=i2?iT(iZ,iY,iX,i5(i1,i4,iW)):iT(i5(i1,i4,iZ),iY,iX,iW);}return [0,0,i1,i4,0,1];}function m6(i8,i6){var i7=i6;for(;;){if(i7){var ja=i7[4],i$=i7[3],i_=i7[1],i9=dc(i0[1],i8,i7[2]);if(0===i9)return i$;var jb=0<=i9?ja:i_,i7=jb;continue;}throw [0,c];}}function m7(je,jc){var jd=jc;for(;;){if(jd){var jh=jd[4],jg=jd[1],jf=dc(i0[1],je,jd[2]),ji=0===jf?1:0;if(ji)return ji;var jj=0<=jf?jh:jg,jd=jj;continue;}return 0;}}function jF(jk){var jl=jk;for(;;){if(jl){var jm=jl[1];if(jm){var jl=jm;continue;}return [0,jl[2],jl[3]];}throw [0,c];}}function m8(jn){var jo=jn;for(;;){if(jo){var jp=jo[4],jq=jo[3],jr=jo[2];if(jp){var jo=jp;continue;}return [0,jr,jq];}throw [0,c];}}function ju(js){if(js){var jt=js[1];if(jt){var jx=js[4],jw=js[3],jv=js[2];return iT(ju(jt),jv,jw,jx);}return js[4];}return cm(bT);}function jK(jD,jy){if(jy){var jz=jy[4],jA=jy[3],jB=jy[2],jC=jy[1],jE=dc(i0[1],jD,jB);if(0===jE){if(jC)if(jz){var jG=jF(jz),jI=jG[2],jH=jG[1],jJ=iT(jC,jH,jI,ju(jz));}else var jJ=jC;else var jJ=jz;return jJ;}return 0<=jE?iT(jC,jB,jA,jK(jD,jz)):iT(jK(jD,jC),jB,jA,jz);}return 0;}function jN(jO,jL){var jM=jL;for(;;){if(jM){var jR=jM[4],jQ=jM[3],jP=jM[2];jN(jO,jM[1]);dc(jO,jP,jQ);var jM=jR;continue;}return 0;}}function jT(jU,jS){if(jS){var jY=jS[5],jX=jS[4],jW=jS[3],jV=jS[2],jZ=jT(jU,jS[1]),j0=c1(jU,jW);return [0,jZ,jV,j0,jT(jU,jX),jY];}return 0;}function j3(j4,j1){if(j1){var j2=j1[2],j7=j1[5],j6=j1[4],j5=j1[3],j8=j3(j4,j1[1]),j9=dc(j4,j2,j5);return [0,j8,j2,j9,j3(j4,j6),j7];}return 0;}function kc(kd,j_,ka){var j$=j_,kb=ka;for(;;){if(j$){var kg=j$[4],kf=j$[3],ke=j$[2],ki=kh(kd,ke,kf,kc(kd,j$[1],kb)),j$=kg,kb=ki;continue;}return kb;}}function kp(kl,kj){var kk=kj;for(;;){if(kk){var ko=kk[4],kn=kk[1],km=dc(kl,kk[2],kk[3]);if(km){var kq=kp(kl,kn);if(kq){var kk=ko;continue;}var kr=kq;}else var kr=km;return kr;}return 1;}}function kz(ku,ks){var kt=ks;for(;;){if(kt){var kx=kt[4],kw=kt[1],kv=dc(ku,kt[2],kt[3]);if(kv)var ky=kv;else{var kA=kz(ku,kw);if(!kA){var kt=kx;continue;}var ky=kA;}return ky;}return 0;}}function kC(kE,kD,kB){if(kB){var kH=kB[4],kG=kB[3],kF=kB[2];return iT(kC(kE,kD,kB[1]),kF,kG,kH);}return iS(kE,kD);}function kJ(kL,kK,kI){if(kI){var kO=kI[3],kN=kI[2],kM=kI[1];return iT(kM,kN,kO,kJ(kL,kK,kI[4]));}return iS(kL,kK);}function kT(kP,kV,kU,kQ){if(kP){if(kQ){var kR=kQ[5],kS=kP[5],k1=kQ[4],k2=kQ[3],k3=kQ[2],k0=kQ[1],kW=kP[4],kX=kP[3],kY=kP[2],kZ=kP[1];return (kR+2|0)<kS?iT(kZ,kY,kX,kT(kW,kV,kU,kQ)):(kS+2|0)<kR?iT(kT(kP,kV,kU,k0),k3,k2,k1):iB(kP,kV,kU,kQ);}return kJ(kV,kU,kP);}return kC(kV,kU,kQ);}function lb(k4,k5){if(k4){if(k5){var k6=jF(k5),k8=k6[2],k7=k6[1];return kT(k4,k7,k8,ju(k5));}return k4;}return k5;}function lE(la,k$,k9,k_){return k9?kT(la,k$,k9[1],k_):lb(la,k_);}function lj(lh,lc){if(lc){var ld=lc[4],le=lc[3],lf=lc[2],lg=lc[1],li=dc(i0[1],lh,lf);if(0===li)return [0,lg,[0,le],ld];if(0<=li){var lk=lj(lh,ld),lm=lk[3],ll=lk[2];return [0,kT(lg,lf,le,lk[1]),ll,lm];}var ln=lj(lh,lg),lp=ln[2],lo=ln[1];return [0,lo,lp,kT(ln[3],lf,le,ld)];}return bS;}function ly(lz,lq,ls){if(lq){var lr=lq[2],lw=lq[5],lv=lq[4],lu=lq[3],lt=lq[1];if(ih(ls)<=lw){var lx=lj(lr,ls),lB=lx[2],lA=lx[1],lC=ly(lz,lv,lx[3]),lD=kh(lz,lr,[0,lu],lB);return lE(ly(lz,lt,lA),lr,lD,lC);}}else if(!ls)return 0;if(ls){var lF=ls[2],lJ=ls[4],lI=ls[3],lH=ls[1],lG=lj(lF,lq),lL=lG[2],lK=lG[1],lM=ly(lz,lG[3],lJ),lN=kh(lz,lF,lL,[0,lI]);return lE(ly(lz,lK,lH),lF,lN,lM);}throw [0,d,bR];}function lR(lS,lO){if(lO){var lP=lO[3],lQ=lO[2],lU=lO[4],lT=lR(lS,lO[1]),lW=dc(lS,lQ,lP),lV=lR(lS,lU);return lW?kT(lT,lQ,lP,lV):lb(lT,lV);}return 0;}function l0(l1,lX){if(lX){var lY=lX[3],lZ=lX[2],l3=lX[4],l2=l0(l1,lX[1]),l4=l2[2],l5=l2[1],l7=dc(l1,lZ,lY),l6=l0(l1,l3),l8=l6[2],l9=l6[1];if(l7){var l_=lb(l4,l8);return [0,kT(l5,lZ,lY,l9),l_];}var l$=kT(l4,lZ,lY,l8);return [0,lb(l5,l9),l$];}return bQ;}function mg(ma,mc){var mb=ma,md=mc;for(;;){if(mb){var me=mb[1],mf=[0,mb[2],mb[3],mb[4],md],mb=me,md=mf;continue;}return md;}}function m9(mt,mi,mh){var mj=mg(mh,0),mk=mg(mi,0),ml=mj;for(;;){if(mk)if(ml){var ms=ml[4],mr=ml[3],mq=ml[2],mp=mk[4],mo=mk[3],mn=mk[2],mm=dc(i0[1],mk[1],ml[1]);if(0===mm){var mu=dc(mt,mn,mq);if(0===mu){var mv=mg(mr,ms),mw=mg(mo,mp),mk=mw,ml=mv;continue;}var mx=mu;}else var mx=mm;}else var mx=1;else var mx=ml?-1:0;return mx;}}function m_(mK,mz,my){var mA=mg(my,0),mB=mg(mz,0),mC=mA;for(;;){if(mB)if(mC){var mI=mC[4],mH=mC[3],mG=mC[2],mF=mB[4],mE=mB[3],mD=mB[2],mJ=0===dc(i0[1],mB[1],mC[1])?1:0;if(mJ){var mL=dc(mK,mD,mG);if(mL){var mM=mg(mH,mI),mN=mg(mE,mF),mB=mN,mC=mM;continue;}var mO=mL;}else var mO=mJ;var mP=mO;}else var mP=0;else var mP=mC?0:1;return mP;}}function mR(mQ){if(mQ){var mS=mQ[1],mT=mR(mQ[4]);return (mR(mS)+1|0)+mT|0;}return 0;}function mY(mU,mW){var mV=mU,mX=mW;for(;;){if(mX){var m1=mX[3],m0=mX[2],mZ=mX[1],m2=[0,[0,m0,m1],mY(mV,mX[4])],mV=m2,mX=mZ;continue;}return mV;}}return [0,m4,m5,m7,i5,iS,jK,ly,m9,m_,jN,kc,kp,kz,lR,l0,mR,function(m3){return mY(0,m3);},jF,m8,jF,lj,m6,jT,j3];}var ns=[0,bL];function nr(na){var nb=1<=na?na:1,nc=dF<nb?dF:nb,nd=caml_create_string(nc);return [0,nd,0,nc,nd];}function nt(ne){return dC(ne[1],0,ne[2]);}function nl(nf,nh){var ng=[0,nf[3]];for(;;){if(ng[1]<(nf[2]+nh|0)){ng[1]=2*ng[1]|0;continue;}if(dF<ng[1])if((nf[2]+nh|0)<=dF)ng[1]=dF;else o(bK);var ni=caml_create_string(ng[1]);dD(nf[1],0,ni,0,nf[2]);nf[1]=ni;nf[3]=ng[1];return 0;}}function nu(nj,nm){var nk=nj[2];if(nj[3]<=nk)nl(nj,1);nj[1].safeSet(nk,nm);nj[2]=nk+1|0;return 0;}function nv(np,nn){var no=nn.getLen(),nq=np[2]+no|0;if(np[3]<nq)nl(np,no);dD(nn,0,np[1],np[2],no);np[2]=nq;return 0;}function nz(nw){return 0<=nw?nw:o(cy(bp,cz(nw)));}function nA(nx,ny){return nz(nx+ny|0);}var nB=c1(nA,1);function nI(nC){return dC(nC,0,nC.getLen());}function nK(nD,nE,nG){var nF=cy(bs,cy(nD,bt)),nH=cy(br,cy(cz(nE),nF));return cm(cy(bq,cy(dB(1,nG),nH)));}function oy(nJ,nM,nL){return nK(nI(nJ),nM,nL);}function oz(nN){return cm(cy(bu,cy(nI(nN),bv)));}function n7(nO,nW,nY,n0){function nV(nP){if((nO.safeGet(nP)-48|0)<0||9<(nO.safeGet(nP)-48|0))return nP;var nQ=nP+1|0;for(;;){var nR=nO.safeGet(nQ);if(48<=nR){if(!(58<=nR)){var nT=nQ+1|0,nQ=nT;continue;}var nS=0;}else if(36===nR){var nU=nQ+1|0,nS=1;}else var nS=0;if(!nS)var nU=nP;return nU;}}var nX=nV(nW+1|0),nZ=nr((nY-nX|0)+10|0);nu(nZ,37);var n1=nX,n2=dk(n0);for(;;){if(n1<=nY){var n3=nO.safeGet(n1);if(42===n3){if(n2){var n4=n2[2];nv(nZ,cz(n2[1]));var n5=nV(n1+1|0),n1=n5,n2=n4;continue;}throw [0,d,bw];}nu(nZ,n3);var n6=n1+1|0,n1=n6;continue;}return nt(nZ);}}function pZ(ob,n$,n_,n9,n8){var oa=n7(n$,n_,n9,n8);if(78!==ob&&110!==ob)return oa;oa.safeSet(oa.getLen()-1|0,117);return oa;}function oA(oi,os,ow,oc,ov){var od=oc.getLen();function ot(oe,or){var of=40===oe?41:125;function oq(og){var oh=og;for(;;){if(od<=oh)return c1(oi,oc);if(37===oc.safeGet(oh)){var oj=oh+1|0;if(od<=oj)var ok=c1(oi,oc);else{var ol=oc.safeGet(oj),om=ol-40|0;if(om<0||1<om){var on=om-83|0;if(on<0||2<on)var oo=1;else switch(on){case 1:var oo=1;break;case 2:var op=1,oo=0;break;default:var op=0,oo=0;}if(oo){var ok=oq(oj+1|0),op=2;}}else var op=0===om?0:1;switch(op){case 1:var ok=ol===of?oj+1|0:kh(os,oc,or,ol);break;case 2:break;default:var ok=oq(ot(ol,oj+1|0)+1|0);}}return ok;}var ou=oh+1|0,oh=ou;continue;}}return oq(or);}return ot(ow,ov);}function oZ(ox){return kh(oA,oz,oy,ox);}function pd(oB,oM,oW){var oC=oB.getLen()-1|0;function oX(oD){var oE=oD;a:for(;;){if(oE<oC){if(37===oB.safeGet(oE)){var oF=0,oG=oE+1|0;for(;;){if(oC<oG)var oH=oz(oB);else{var oI=oB.safeGet(oG);if(58<=oI){if(95===oI){var oK=oG+1|0,oJ=1,oF=oJ,oG=oK;continue;}}else if(32<=oI)switch(oI-32|0){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 0:case 3:case 11:case 13:var oL=oG+1|0,oG=oL;continue;case 10:var oN=kh(oM,oF,oG,105),oG=oN;continue;default:var oO=oG+1|0,oG=oO;continue;}var oP=oG;c:for(;;){if(oC<oP)var oQ=oz(oB);else{var oR=oB.safeGet(oP);if(126<=oR)var oS=0;else switch(oR){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var oQ=kh(oM,oF,oP,105),oS=1;break;case 69:case 70:case 71:case 101:case 102:case 103:var oQ=kh(oM,oF,oP,102),oS=1;break;case 33:case 37:case 44:case 64:var oQ=oP+1|0,oS=1;break;case 83:case 91:case 115:var oQ=kh(oM,oF,oP,115),oS=1;break;case 97:case 114:case 116:var oQ=kh(oM,oF,oP,oR),oS=1;break;case 76:case 108:case 110:var oT=oP+1|0;if(oC<oT){var oQ=kh(oM,oF,oP,105),oS=1;}else{var oU=oB.safeGet(oT)-88|0;if(oU<0||32<oU)var oV=1;else switch(oU){case 0:case 12:case 17:case 23:case 29:case 32:var oQ=dc(oW,kh(oM,oF,oP,oR),105),oS=1,oV=0;break;default:var oV=1;}if(oV){var oQ=kh(oM,oF,oP,105),oS=1;}}break;case 67:case 99:var oQ=kh(oM,oF,oP,99),oS=1;break;case 66:case 98:var oQ=kh(oM,oF,oP,66),oS=1;break;case 41:case 125:var oQ=kh(oM,oF,oP,oR),oS=1;break;case 40:var oQ=oX(kh(oM,oF,oP,oR)),oS=1;break;case 123:var oY=kh(oM,oF,oP,oR),o0=kh(oZ,oR,oB,oY),o1=oY;for(;;){if(o1<(o0-2|0)){var o2=dc(oW,o1,oB.safeGet(o1)),o1=o2;continue;}var o3=o0-1|0,oP=o3;continue c;}default:var oS=0;}if(!oS)var oQ=oy(oB,oP,oR);}var oH=oQ;break;}}var oE=oH;continue a;}}var o4=oE+1|0,oE=o4;continue;}return oE;}}oX(0);return 0;}function rc(pe){var o5=[0,0,0,0];function pc(o_,o$,o6){var o7=41!==o6?1:0,o8=o7?125!==o6?1:0:o7;if(o8){var o9=97===o6?2:1;if(114===o6)o5[3]=o5[3]+1|0;if(o_)o5[2]=o5[2]+o9|0;else o5[1]=o5[1]+o9|0;}return o$+1|0;}pd(pe,pc,function(pa,pb){return pa+1|0;});return o5[1];}function pV(pf,pi,pg){var ph=pf.safeGet(pg);if((ph-48|0)<0||9<(ph-48|0))return dc(pi,0,pg);var pj=ph-48|0,pk=pg+1|0;for(;;){var pl=pf.safeGet(pk);if(48<=pl){if(!(58<=pl)){var po=pk+1|0,pn=(10*pj|0)+(pl-48|0)|0,pj=pn,pk=po;continue;}var pm=0;}else if(36===pl)if(0===pj){var pp=o(by),pm=1;}else{var pp=dc(pi,[0,nz(pj-1|0)],pk+1|0),pm=1;}else var pm=0;if(!pm)var pp=dc(pi,0,pg);return pp;}}function pQ(pq,pr){return pq?pr:c1(nB,pr);}function pF(ps,pt){return ps?ps[1]:pt;}function sz(rx,pv,rJ,py,rh,rP,pu){var pw=c1(pv,pu);function ry(px){return dc(py,pw,px);}function rg(pD,rO,pz,pI){var pC=pz.getLen();function rd(rG,pA){var pB=pA;for(;;){if(pC<=pB)return c1(pD,pw);var pE=pz.safeGet(pB);if(37===pE){var pM=function(pH,pG){return caml_array_get(pI,pF(pH,pG));},pS=function(pU,pN,pP,pJ){var pK=pJ;for(;;){var pL=pz.safeGet(pK)-32|0;if(!(pL<0||25<pL))switch(pL){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 10:return pV(pz,function(pO,pT){var pR=[0,pM(pO,pN),pP];return pS(pU,pQ(pO,pN),pR,pT);},pK+1|0);default:var pW=pK+1|0,pK=pW;continue;}var pX=pz.safeGet(pK);if(124<=pX)var pY=0;else switch(pX){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var p0=pM(pU,pN),p1=caml_format_int(pZ(pX,pz,pB,pK,pP),p0),p3=p2(pQ(pU,pN),p1,pK+1|0),pY=1;break;case 69:case 71:case 101:case 102:case 103:var p4=pM(pU,pN),p5=caml_format_float(n7(pz,pB,pK,pP),p4),p3=p2(pQ(pU,pN),p5,pK+1|0),pY=1;break;case 76:case 108:case 110:var p6=pz.safeGet(pK+1|0)-88|0;if(p6<0||32<p6)var p7=1;else switch(p6){case 0:case 12:case 17:case 23:case 29:case 32:var p8=pK+1|0,p9=pX-108|0;if(p9<0||2<p9)var p_=0;else{switch(p9){case 1:var p_=0,p$=0;break;case 2:var qa=pM(pU,pN),qb=caml_format_int(n7(pz,pB,p8,pP),qa),p$=1;break;default:var qc=pM(pU,pN),qb=caml_format_int(n7(pz,pB,p8,pP),qc),p$=1;}if(p$){var qd=qb,p_=1;}}if(!p_){var qe=pM(pU,pN),qd=caml_int64_format(n7(pz,pB,p8,pP),qe);}var p3=p2(pQ(pU,pN),qd,p8+1|0),pY=1,p7=0;break;default:var p7=1;}if(p7){var qf=pM(pU,pN),qg=caml_format_int(pZ(110,pz,pB,pK,pP),qf),p3=p2(pQ(pU,pN),qg,pK+1|0),pY=1;}break;case 37:case 64:var p3=p2(pN,dB(1,pX),pK+1|0),pY=1;break;case 83:case 115:var qh=pM(pU,pN);if(115===pX)var qi=qh;else{var qj=[0,0],qk=0,ql=qh.getLen()-1|0;if(!(ql<qk)){var qm=qk;for(;;){var qn=qh.safeGet(qm),qo=14<=qn?34===qn?1:92===qn?1:0:11<=qn?13<=qn?1:0:8<=qn?1:0,qp=qo?2:caml_is_printable(qn)?1:4;qj[1]=qj[1]+qp|0;var qq=qm+1|0;if(ql!==qm){var qm=qq;continue;}break;}}if(qj[1]===qh.getLen())var qr=qh;else{var qs=caml_create_string(qj[1]);qj[1]=0;var qt=0,qu=qh.getLen()-1|0;if(!(qu<qt)){var qv=qt;for(;;){var qw=qh.safeGet(qv),qx=qw-34|0;if(qx<0||58<qx)if(-20<=qx)var qy=1;else{switch(qx+34|0){case 8:qs.safeSet(qj[1],92);qj[1]+=1;qs.safeSet(qj[1],98);var qz=1;break;case 9:qs.safeSet(qj[1],92);qj[1]+=1;qs.safeSet(qj[1],116);var qz=1;break;case 10:qs.safeSet(qj[1],92);qj[1]+=1;qs.safeSet(qj[1],110);var qz=1;break;case 13:qs.safeSet(qj[1],92);qj[1]+=1;qs.safeSet(qj[1],114);var qz=1;break;default:var qy=1,qz=0;}if(qz)var qy=0;}else var qy=(qx-1|0)<0||56<(qx-1|0)?(qs.safeSet(qj[1],92),qj[1]+=1,qs.safeSet(qj[1],qw),0):1;if(qy)if(caml_is_printable(qw))qs.safeSet(qj[1],qw);else{qs.safeSet(qj[1],92);qj[1]+=1;qs.safeSet(qj[1],48+(qw/100|0)|0);qj[1]+=1;qs.safeSet(qj[1],48+((qw/10|0)%10|0)|0);qj[1]+=1;qs.safeSet(qj[1],48+(qw%10|0)|0);}qj[1]+=1;var qA=qv+1|0;if(qu!==qv){var qv=qA;continue;}break;}}var qr=qs;}var qi=cy(bF,cy(qr,bG));}if(pK===(pB+1|0))var qB=qi;else{var qC=n7(pz,pB,pK,pP);try {var qD=0,qE=1;for(;;){if(qC.getLen()<=qE)var qF=[0,0,qD];else{var qG=qC.safeGet(qE);if(49<=qG)if(58<=qG)var qH=0;else{var qF=[0,caml_int_of_string(dC(qC,qE,(qC.getLen()-qE|0)-1|0)),qD],qH=1;}else{if(45===qG){var qJ=qE+1|0,qI=1,qD=qI,qE=qJ;continue;}var qH=0;}if(!qH){var qK=qE+1|0,qE=qK;continue;}}var qL=qF;break;}}catch(qM){if(qM[1]!==a)throw qM;var qL=nK(qC,0,115);}var qN=qL[1],qO=qi.getLen(),qP=0,qT=qL[2],qS=32;if(qN===qO&&0===qP){var qQ=qi,qR=1;}else var qR=0;if(!qR)if(qN<=qO)var qQ=dC(qi,qP,qO);else{var qU=dB(qN,qS);if(qT)dD(qi,qP,qU,0,qO);else dD(qi,qP,qU,qN-qO|0,qO);var qQ=qU;}var qB=qQ;}var p3=p2(pQ(pU,pN),qB,pK+1|0),pY=1;break;case 67:case 99:var qV=pM(pU,pN);if(99===pX)var qW=dB(1,qV);else{if(39===qV)var qX=b7;else if(92===qV)var qX=b8;else{if(14<=qV)var qY=0;else switch(qV){case 8:var qX=ca,qY=1;break;case 9:var qX=b$,qY=1;break;case 10:var qX=b_,qY=1;break;case 13:var qX=b9,qY=1;break;default:var qY=0;}if(!qY)if(caml_is_printable(qV)){var qZ=caml_create_string(1);qZ.safeSet(0,qV);var qX=qZ;}else{var q0=caml_create_string(4);q0.safeSet(0,92);q0.safeSet(1,48+(qV/100|0)|0);q0.safeSet(2,48+((qV/10|0)%10|0)|0);q0.safeSet(3,48+(qV%10|0)|0);var qX=q0;}}var qW=cy(bD,cy(qX,bE));}var p3=p2(pQ(pU,pN),qW,pK+1|0),pY=1;break;case 66:case 98:var q2=pK+1|0,q1=pM(pU,pN)?ce:cd,p3=p2(pQ(pU,pN),q1,q2),pY=1;break;case 40:case 123:var q3=pM(pU,pN),q4=kh(oZ,pX,pz,pK+1|0);if(123===pX){var q5=nr(q3.getLen()),q9=function(q7,q6){nu(q5,q6);return q7+1|0;};pd(q3,function(q8,q$,q_){if(q8)nv(q5,bx);else nu(q5,37);return q9(q$,q_);},q9);var ra=nt(q5),p3=p2(pQ(pU,pN),ra,q4),pY=1;}else{var rb=pQ(pU,pN),re=nA(rc(q3),rb),p3=rg(function(rf){return rd(re,q4);},rb,q3,pI),pY=1;}break;case 33:c1(rh,pw);var p3=rd(pN,pK+1|0),pY=1;break;case 41:var p3=p2(pN,bJ,pK+1|0),pY=1;break;case 44:var p3=p2(pN,bI,pK+1|0),pY=1;break;case 70:var ri=pM(pU,pN);if(0===pP)var rj=bH;else{var rk=n7(pz,pB,pK,pP);if(70===pX)rk.safeSet(rk.getLen()-1|0,103);var rj=rk;}var rl=caml_classify_float(ri);if(3===rl)var rm=ri<0?bB:bA;else if(4<=rl)var rm=bC;else{var rn=caml_format_float(rj,ri),ro=0,rp=rn.getLen();for(;;){if(rp<=ro)var rq=cy(rn,bz);else{var rr=rn.safeGet(ro)-46|0,rs=rr<0||23<rr?55===rr?1:0:(rr-1|0)<0||21<(rr-1|0)?1:0;if(!rs){var rt=ro+1|0,ro=rt;continue;}var rq=rn;}var rm=rq;break;}}var p3=p2(pQ(pU,pN),rm,pK+1|0),pY=1;break;case 91:var p3=oy(pz,pK,pX),pY=1;break;case 97:var ru=pM(pU,pN),rv=c1(nB,pF(pU,pN)),rw=pM(0,rv),rA=pK+1|0,rz=pQ(pU,rv);if(rx)ry(dc(ru,0,rw));else dc(ru,pw,rw);var p3=rd(rz,rA),pY=1;break;case 114:var p3=oy(pz,pK,pX),pY=1;break;case 116:var rB=pM(pU,pN),rD=pK+1|0,rC=pQ(pU,pN);if(rx)ry(c1(rB,0));else c1(rB,pw);var p3=rd(rC,rD),pY=1;break;default:var pY=0;}if(!pY)var p3=oy(pz,pK,pX);return p3;}},rI=pB+1|0,rF=0;return pV(pz,function(rH,rE){return pS(rH,rG,rF,rE);},rI);}dc(rJ,pw,pE);var rK=pB+1|0,pB=rK;continue;}}function p2(rN,rL,rM){ry(rL);return rd(rN,rM);}return rd(rO,0);}var rQ=dc(rg,rP,nz(0)),rR=rc(pu);if(rR<0||6<rR){var r4=function(rS,rY){if(rR<=rS){var rT=caml_make_vect(rR,0),rW=function(rU,rV){return caml_array_set(rT,(rR-rU|0)-1|0,rV);},rX=0,rZ=rY;for(;;){if(rZ){var r0=rZ[2],r1=rZ[1];if(r0){rW(rX,r1);var r2=rX+1|0,rX=r2,rZ=r0;continue;}rW(rX,r1);}return dc(rQ,pu,rT);}}return function(r3){return r4(rS+1|0,[0,r3,rY]);};},r5=r4(0,0);}else switch(rR){case 1:var r5=function(r7){var r6=caml_make_vect(1,0);caml_array_set(r6,0,r7);return dc(rQ,pu,r6);};break;case 2:var r5=function(r9,r_){var r8=caml_make_vect(2,0);caml_array_set(r8,0,r9);caml_array_set(r8,1,r_);return dc(rQ,pu,r8);};break;case 3:var r5=function(sa,sb,sc){var r$=caml_make_vect(3,0);caml_array_set(r$,0,sa);caml_array_set(r$,1,sb);caml_array_set(r$,2,sc);return dc(rQ,pu,r$);};break;case 4:var r5=function(se,sf,sg,sh){var sd=caml_make_vect(4,0);caml_array_set(sd,0,se);caml_array_set(sd,1,sf);caml_array_set(sd,2,sg);caml_array_set(sd,3,sh);return dc(rQ,pu,sd);};break;case 5:var r5=function(sj,sk,sl,sm,sn){var si=caml_make_vect(5,0);caml_array_set(si,0,sj);caml_array_set(si,1,sk);caml_array_set(si,2,sl);caml_array_set(si,3,sm);caml_array_set(si,4,sn);return dc(rQ,pu,si);};break;case 6:var r5=function(sp,sq,sr,ss,st,su){var so=caml_make_vect(6,0);caml_array_set(so,0,sp);caml_array_set(so,1,sq);caml_array_set(so,2,sr);caml_array_set(so,3,ss);caml_array_set(so,4,st);caml_array_set(so,5,su);return dc(rQ,pu,so);};break;default:var r5=dc(rQ,pu,[0]);}return r5;}function sN(sw){function sy(sv){return 0;}return sA(sz,0,function(sx){return sw;},cM,cI,cT,sy);}function sJ(sB){return nr(2*sB.getLen()|0);}function sG(sE,sC){var sD=nt(sC);sC[2]=0;return c1(sE,sD);}function sM(sF){var sI=c1(sG,sF);return sA(sz,1,sJ,nu,nv,function(sH){return 0;},sI);}function sO(sL){return dc(sM,function(sK){return sK;},sL);}var sP=[0,0];function s3(sQ,sR){var sS=sQ[sR+1];if(caml_obj_is_block(sS)){if(caml_obj_tag(sS)===dN)return dc(sO,a5,sS);if(caml_obj_tag(sS)===dM){var sT=caml_format_float(ch,sS),sU=0,sV=sT.getLen();for(;;){if(sV<=sU)var sW=cy(sT,cg);else{var sX=sT.safeGet(sU),sY=48<=sX?58<=sX?0:1:45===sX?1:0;if(sY){var sZ=sU+1|0,sU=sZ;continue;}var sW=sT;}return sW;}}return a4;}return dc(sO,a6,sS);}function s2(s0,s1){if(s0.length-1<=s1)return bo;var s4=s2(s0,s1+1|0);return kh(sO,bn,s3(s0,s1),s4);}function tx(s6){var s5=sP[1];for(;;){if(s5){var s$=s5[2],s7=s5[1];try {var s8=c1(s7,s6),s9=s8;}catch(ta){var s9=0;}if(!s9){var s5=s$;continue;}var s_=s9[1];}else if(s6[1]===cl)var s_=bd;else if(s6[1]===cj)var s_=bc;else if(s6[1]===ck){var tb=s6[2],tc=tb[3],s_=sA(sO,g,tb[1],tb[2],tc,tc+5|0,bb);}else if(s6[1]===d){var td=s6[2],te=td[3],s_=sA(sO,g,td[1],td[2],te,te+6|0,ba);}else if(s6[1]===ci){var tf=s6[2],tg=tf[3],s_=sA(sO,g,tf[1],tf[2],tg,tg+6|0,a$);}else{var th=s6.length-1,tk=s6[0+1][0+1];if(th<0||2<th){var ti=s2(s6,2),tj=kh(sO,a_,s3(s6,1),ti);}else switch(th){case 1:var tj=a8;break;case 2:var tj=dc(sO,a7,s3(s6,1));break;default:var tj=a9;}var s_=cy(tk,tj);}return s_;}}function ty(tu){var tl=caml_convert_raw_backtrace(caml_get_exception_raw_backtrace(0));if(tl){var tm=tl[1],tn=0,to=tm.length-1-1|0;if(!(to<tn)){var tp=tn;for(;;){if(caml_notequal(caml_array_get(tm,tp),bm)){var tq=caml_array_get(tm,tp),tr=0===tq[0]?tq[1]:tq[1],ts=tr?0===tp?bj:bi:0===tp?bh:bg,tt=0===tq[0]?sA(sO,bf,ts,tq[2],tq[3],tq[4],tq[5]):dc(sO,be,ts);kh(sN,tu,bl,tt);}var tv=tp+1|0;if(to!==tp){var tp=tv;continue;}break;}}var tw=0;}else var tw=dc(sN,tu,bk);return tw;}32===dE;function tB(tA){var tz=[];caml_update_dummy(tz,[0,tz,tz]);return tz;}var tC=[0,aY],tF=42,tG=[0,m$([0,function(tE,tD){return caml_compare(tE,tD);}])[1]];function tK(tH){var tI=tH[1];{if(3===tI[0]){var tJ=tI[1],tL=tK(tJ);if(tL!==tJ)tH[1]=[3,tL];return tL;}return tH;}}function tO(tM){return tK(tM);}var tP=[0,function(tN){tx(tN);caml_ml_output_char(cA,10);ty(cA);cH(0);return caml_sys_exit(2);}];function ud(tR,tQ){try {var tS=c1(tR,tQ);}catch(tT){return c1(tP[1],tT);}return tS;}function t4(tY,tU,tW){var tV=tU,tX=tW;for(;;)if(typeof tV==="number")return tZ(tY,tX);else switch(tV[0]){case 1:c1(tV[1],tY);return tZ(tY,tX);case 2:var t0=tV[1],t1=[0,tV[2],tX],tV=t0,tX=t1;continue;default:var t2=tV[1][1];return t2?(c1(t2[1],tY),tZ(tY,tX)):tZ(tY,tX);}}function tZ(t5,t3){return t3?t4(t5,t3[1],t3[2]):0;}function uf(t6,t8){var t7=t6,t9=t8;for(;;)if(typeof t7==="number")return t$(t9);else switch(t7[0]){case 1:var t_=t7[1];if(t_[4]){t_[4]=0;t_[1][2]=t_[2];t_[2][1]=t_[1];}return t$(t9);case 2:var ua=t7[1],ub=[0,t7[2],t9],t7=ua,t9=ub;continue;default:var uc=t7[2];tG[1]=t7[1];ud(uc,0);return t$(t9);}}function t$(ue){return ue?uf(ue[1],ue[2]):0;}function uj(uh,ug){var ui=1===ug[0]?ug[1][1]===tC?(uf(uh[4],0),1):0:0;return t4(ug,uh[2],0);}var uk=[0,0],ul=[0,0,0];function uI(uo,um){var un=[0,um],up=tK(uo),uq=up[1];switch(uq[0]){case 1:if(uq[1][1]===tC){var ur=0,us=1;}else var us=0;break;case 2:var ut=uq[1];up[1]=un;var uu=tG[1],uv=uk[1]?1:(uk[1]=1,0);uj(ut,un);if(uv){tG[1]=uu;var uw=0;}else for(;;){if(0!==ul[1]){if(0===ul[1])throw [0,ns];ul[1]=ul[1]-1|0;var ux=ul[2],uy=ux[2];if(uy===ux)ul[2]=0;else ux[2]=uy[2];var uz=uy[1];uj(uz[1],uz[2]);continue;}uk[1]=0;tG[1]=uu;var uw=0;break;}var ur=uw,us=1;break;default:var us=0;}if(!us)var ur=cm(aZ);return ur;}function uG(uA,uB){return typeof uA==="number"?uB:typeof uB==="number"?uA:[2,uA,uB];}function uD(uC){if(typeof uC!=="number")switch(uC[0]){case 2:var uE=uC[1],uF=uD(uC[2]);return uG(uD(uE),uF);case 1:break;default:if(!uC[1][1])return 0;}return uC;}var uK=[0,function(uH){return 0;}],uJ=tB(0),uN=[0,0],uS=null,uT=Array;function uX(uR){var uL=1-(uJ[2]===uJ?1:0);if(uL){var uM=tB(0);uM[1][2]=uJ[2];uJ[2][1]=uM[1];uM[1]=uJ[1];uJ[1][2]=uM;uJ[1]=uJ;uJ[2]=uJ;uN[1]=0;var uO=uM[2];for(;;){var uP=uO!==uM?1:0;if(uP){if(uO[4])uI(uO[3],0);var uQ=uO[2],uO=uQ;continue;}return uP;}}return uL;}var uW=undefined,uV=false;function uY(uU){return uU instanceof uT?0:[0,new MlWrappedString(uU.toString())];}sP[1]=[0,uY,sP[1]];function u1(uZ,u0){uZ.appendChild(u0);return 0;}var u2=this,u3=u2.document;function u$(u4,u5){return u4?c1(u5,u4[1]):0;}function u8(u7,u6){return u7.createElement(u6.toString());}function va(u_,u9){return u8(u_,u9);}var vb=[0,785140586];function vd(vc){return va(vc,aN);}this.HTMLElement===uW;var ve=2147483,vg=caml_js_get_console(0);uK[1]=function(vf){return 1===vf?(u2.setTimeout(caml_js_wrap_callback(uX),0),0):0;};function vi(vh){return vg.log(vh.toString());}tP[1]=function(vj){vi(aH);vi(tx(vj));return ty(cA);};function vm(vl,vk){return 0===vk?1003109192:1===vk?vl:[0,748545537,[0,vl,vm(vl,vk-1|0)]];}var vP=aD.slice(),vO=[0,257,258,0],vN=303;function vQ(vn){throw [0,dO,d3(vn,0)];}function vR(vo){throw [0,dO,d3(vo,0)];}function vS(vp){return 3901498;}function vT(vq){return -941236332;}function vU(vr){return 15949;}function vV(vs){return 17064;}function vW(vt){return 3553395;}function vX(vu){return 3802040;}function vY(vv){return 15500;}function vZ(vw){return d3(vw,1);}function v0(vx){return [0,926224370,d3(vx,1)];}function v1(vy){return [0,974443759,[0,19065,[0,926224370,d3(vy,1)]]];}function v2(vz){var vA=d3(vz,2);return [0,748545537,[0,vA,d3(vz,0)]];}function v3(vB){var vC=d3(vB,2);return [0,-783405316,[0,vC,d3(vB,0)]];}function v4(vD){var vE=d3(vD,2);return [0,974443759,[0,vE,d3(vD,0)]];}function v5(vF){var vG=d3(vF,1);return vm(vG,d3(vF,0));}function v6(vH){var vI=d3(vH,0);return caml_string_equal(vI,aF)?19065:caml_string_equal(vI,aE)?1003109192:[0,4298439,vI];}function v7(vJ){var vK=d3(vJ,2),vL=d3(vJ,1);return [0,vL,vK,d3(vJ,0)];}var v8=[0,[0,function(vM){return o(aG);},v7,v6,v5,v4,v3,v2,v1,v0,vZ,vY,vX,vW,vV,vU,vT,vS,vR,vQ],vP,vO,aC,aB,aA,az,ay,ax,aw,vN,av,au,ie,at,as];function wf(v_){var v9=0;for(;;){var v$=dL(i,v9,v_);if(v$<0||20<v$){c1(v_[1],v_);var v9=v$;continue;}switch(v$){case 1:var wb=wa(v_);break;case 2:var wb=1;break;case 3:var wc=v_[5],wd=v_[6]-wc|0,we=caml_create_string(wd);caml_blit_string(v_[2],wc,we,0,wd);var wb=[0,we];break;case 4:var wb=7;break;case 5:var wb=6;break;case 6:var wb=4;break;case 7:var wb=5;break;case 8:var wb=8;break;case 9:var wb=2;break;case 10:var wb=3;break;case 11:var wb=15;break;case 12:var wb=16;break;case 13:var wb=10;break;case 14:var wb=12;break;case 15:var wb=13;break;case 16:var wb=14;break;case 17:var wb=11;break;case 18:var wb=9;break;case 19:var wb=0;break;case 20:var wb=o(cy(ar,dB(1,v_[2].safeGet(v_[5]))));break;default:var wb=wf(v_);}return wb;}}function wa(wh){var wg=25;for(;;){var wi=dL(i,wg,wh);if(wi<0||2<wi){c1(wh[1],wh);var wg=wi;continue;}switch(wi){case 1:var wj=0;break;case 2:var wj=wa(wh);break;default:var wj=1;}return wj;}}function wn(wk){if(typeof wk==="number")return 1003109192<=wk?aq:ap;var wl=wk[1];if(748545537<=wl){if(926224370<=wl){if(974443759<=wl){var wm=wk[2],wo=wn(wm[2]);return kh(sO,ao,wn(wm[1]),wo);}return dc(sO,an,wn(wk[2]));}if(748545556<=wl)return dc(sO,am,wn(wk[2]));var wp=wk[2],wq=wn(wp[2]);return kh(sO,al,wn(wp[1]),wq);}if(4298439<=wl)return wk[2];var wr=wk[2],ws=wn(wr[2]);return kh(sO,ak,wn(wr[1]),ws);}var wv=[0,function(wu,wt){return caml_compare(wu,wt);}],ww=m$(wv),wx=id(wv);function wA(wz,wy){return caml_compare(wz,wy);}var wB=id([0,c1(ww[8],wA)]),wC=id([0,wx[10]]),wD=m$([0,wx[10]]);function wM(wJ,wG,wF,wE){try {var wH=dc(wG,wF,wE);}catch(wI){if(wI[1]===c)return wJ;throw wI;}return wH;}var wN=id([0,function(wL,wK){return caml_compare(wL,wK);}]),wQ=id([0,function(wP,wO){return caml_compare(wP,wO);}]);function w2(wV){var wT=wx[1];function wU(wR,wS){return c1(wx[4],wR);}return kh(ww[11],wU,wV,wT);}function w3(w1,wW){function w0(wX){try {var wY=dc(ww[22],wX,wW);}catch(wZ){if(wZ[1]===c)return wX;throw wZ;}return wY;}return dc(ww[23],w0,w1);}var w4=[0,aj];function yM(w5,w6){try {var w7=dc(ww[22],w6,w5);}catch(w8){if(w8[1]===c)return w6;throw w8;}return w7;}function yN(xc,xb,xf){var xd=wQ[1];function xe(w9){var w_=w9[3],w$=w9[2],xa=w9[1];return dc(wx[3],w_,xb)?c1(wQ[4],[0,xa,w$,xc]):c1(wQ[4],[0,xa,w$,w_]);}return kh(wQ[14],xe,xf,xd);}function yO(xg){var xl=xg[1],xk=xg[2];function xm(xh,xi){var xj=cn(xh[3],xi);return cn(xh[1],xj);}return 1+kh(wQ[14],xm,xk,xl)|0;}function yB(xn){return [0,-783405316,[0,xn[1],xn[2]]];}function yL(xo){return [0,748545537,[0,xo[1],xo[2]]];}function xH(xq,xp){return wM(wx[1],ww[22],xq,xp);}function yF(xr){var xs=xr[3],xt=xr[2],xu=xr[1],xy=wx[1];function xz(xv,xw){var xx=dc(wx[4],xv[3],xw);return dc(wx[4],xv[1],xx);}var xA=kh(wQ[14],xz,xt,xy),xD=ww[1];function xE(xB){var xC=c1(wx[5],xB);return dc(ww[4],xB,xC);}var xL=kh(wx[14],xE,xA,xD);function xM(xF,xI){var xG=xF[1],xJ=xH(xG,xI),xK=dc(wx[4],xF[3],xJ);return kh(ww[4],xG,xK,xI);}var xN=kh(wQ[14],xM,xt,xL);for(;;){var xZ=ww[1],x0=function(xN){return function(xY,xV,xX){function xU(xO,xT){var xR=xH(xO,xN);function xS(xQ,xP){return dc(wx[4],xQ,xP);}return kh(wx[14],xS,xR,xT);}var xW=kh(wx[14],xU,xV,xV);return kh(ww[4],xY,xW,xX);};}(xN),x1=kh(ww[11],x0,xN,xZ);if(kh(ww[9],wx[11],x1,xN)){if(xu===xs)return o(ai);var x3=function(x2){return x2[1]===xu?1:0;},x4=dc(wQ[17],x3,xt),x5=c1(wQ[20],x4);if(x5){var x6=x5[2],x7=x5[1],x8=x7[3],x9=x7[2];if(x6){var yb=xH(x8,xN),ye=dm(function(ya,x_){var x$=xH(x_[3],xN);return dc(wx[8],ya,x$);},yb,x6),yf=function(yd){var yc=xH(xs,xN);return 1-dc(wx[3],yd,yc);},yg=dc(wx[17],yf,ye);if(c1(wx[2],yg)){var yh=0,yi=0,yj=[0,[0,xu,x9,x8],x6];for(;;){if(yj){var yk=yj[2],yl=yj[1],ym=yl[3],yn=xH(ym,xN),yo=xH(x8,xN),yp=dc(wx[8],yo,yn);if(x8===ym&&c1(wx[2],yp))throw [0,d,ae];var ys=function(yr){var yq=xH(xs,xN);return 1-dc(wx[3],yr,yq);};if(dc(wx[16],ys,yp)){var yt=[0,yl,yh],yh=yt,yj=yk;continue;}var yu=[0,yl,yi],yi=yu,yj=yk;continue;}var yv=dk(yi),yw=dk(yh);if(0===yv)throw [0,d,ah];if(0===yw){if(yv){var yx=yv[2],yy=yv[1][2];if(yx){var yC=[0,4298439,yy];return dm(function(yA,yz){return yB([0,yA,[0,4298439,yz[2]]]);},yC,yx);}return [0,4298439,yy];}return o(ag);}var yE=function(yD){return 1-dn(yD,yv);},yH=yF([0,xu,dc(wQ[17],yE,xt),xs]),yI=function(yG){return 1-dn(yG,yw);};return yB([0,yF([0,xu,dc(wQ[17],yI,xt),xs]),yH]);}}var yJ=c1(wx[23],yg),yK=yF([0,yJ,xt,xs]);return yL([0,yF([0,xu,xt,yJ]),yK]);}return x8===xs?[0,4298439,x9]:yL([0,[0,4298439,x9],yF([0,x8,xt,xs])]);}return o(af);}var xN=x1;continue;}}function BY(yS,yP,yQ){if(yP){if(yQ)return o($);var yR=yP[1];}else{if(!yQ)return yQ;var yR=yQ[1];}return [0,yR];}function y5(yX,yT,yV){if(yT){var yU=yT[1];if(yV)return [0,cv(yU,yV[1])];var yW=yU;}else{if(!yV)return yV;var yW=yV[1];}return [0,yW];}function B1(y2,yY,y0){if(yY){var yZ=yY[1];if(y0)return [0,dc(wN[7],yZ,y0[1])];var y1=yZ;}else{if(!y0)return y0;var y1=y0[1];}return [0,y1];}function Am(y4,y3){return kh(wD[7],y5,y4,y3);}function zB(zq){var zp=wx[1],zr=dc(dm,function(y8,y6){var y7=y6[1],y_=dc(wx[7],y8,y6[2]),y9=y7[2],ze=y7[1],zd=wx[1];function zf(zc,zb){function za(y$){return c1(wx[4],y$[2]);}return dc(wN[14],za,zb);}var zg=kh(ww[11],zf,y9,zd),zh=w2(y9),zm=dc(wx[7],zh,zg);function zn(zl,zj,zi){var zk=dc(wx[4],zj,zi);return dc(wx[4],zl,zk);}var zo=kh(ww[11],zn,ze,zm);return dc(wx[7],zo,y_);},zp),zs=c1(wx[5],zq[1]),zt=kh(wC[14],wx[7],zq[3],zs),zz=zq[2];function zA(zv,zw,zu){var zx=dc(wx[7],zv,zu),zy=c1(zr,zw);return dc(wx[7],zy,zx);}return kh(wD[11],zA,zz,zt);}function Ab(zD,zC){var zE=zB(zC),zF=zB(zD),zG=dc(wx[8],zF,zE);return c1(wx[2],zG);}function Av(z0,zH,zJ){var zI=c1(wx[5],zH),zM=dc(wD[22],zI,zJ),zN=c3(function(zK){var zL=zK[2];return [0,dc(ww[22],zH,zK[1][2]),zL];},zM),zY=wD[1];function zZ(zO,zX){var zP=c1(wx[23],zO),zR=ww[1];function zS(zQ){return dc(ww[4],zQ,zP);}var zV=kh(wx[14],zS,zO,zR),zW=c3(function(zT){var zU=zT[2];return [0,[0,zV,dc(ww[5],zP,zT[1])],zU];},zN);return kh(wD[4],zO,zW,zX);}return kh(wC[14],zZ,z0,zY);}function z4(z5,z1){if(typeof z1!=="number"){var z2=z1[1];if(!(748545537<=z2)){if(4298439<=z2){var AJ=c1(wx[5],z5),AK=c1(wx[5],z5+1|0),AL=dc(ww[5],z5,z5),AM=c1(wN[5],[0,z1[2],z5+1|0]),AN=[0,[0,[0,AL,dc(ww[5],z5,AM)],AK],0],AO=dc(wD[5],AJ,AN);return [0,[0,z5,AO,c1(wC[5],AK)],z5+2|0];}var AP=z1[2],AQ=z4(z5,AP[1]),AR=z4(AQ[2],AP[2]),AS=AR[1],AT=AQ[1],AU=AS[3],AV=AS[2],AW=AS[1],AX=AT[3],AY=AT[2],AZ=AT[1],A0=AR[2];if(Ab(AT,AS)){var A5=wC[1],A6=function(A2){function A4(A1){var A3=dc(wx[7],A2,A1);return c1(wC[4],A3);}return dc(wC[14],A4,AU);},A7=kh(wC[14],A6,AX,A5),A8=dc(ww[5],AZ,AZ),A9=c1(wx[5],AZ),A_=dc(wD[22],A9,AY),A$=c1(wx[5],AW),Bi=dc(wD[22],A$,AV),Bk=0,Bl=dm(function(Bj,Ba){var Bb=Ba[2],Bf=dc(ww[22],AZ,Ba[1][2]);return dm(function(Bh,Bc){var Bd=dc(ww[22],AW,Bc[1][2]),Be=dc(wx[7],Bb,Bc[2]),Bg=dc(wN[7],Bf,Bd);return [0,[0,[0,A8,dc(ww[5],AZ,Bg)],Be],Bh];},Bj,Bi);},Bk,A_),Bm=c1(wx[5],AZ),Bn=dc(wD[5],Bm,Bl),Bo=c1(wx[5],AZ),Bp=dc(wD[6],Bo,AY),Bq=c1(wx[5],AW),Br=dc(wD[6],Bq,AV),BD=wD[1],BE=function(Bu){function BC(BA,By){var Bx=0,Bz=dm(function(Bw,Bs){var Bt=Bs[1],Bv=dc(wx[7],Bu,Bs[2]);return [0,[0,[0,Bt[1],Bt[2]],Bv],Bw];},Bx,By),BB=dc(wx[7],Bu,BA);return dc(wD[4],BB,Bz);}return dc(wD[11],BC,Br);},BF=kh(wC[14],BE,AX,BD),BR=wD[1],BS=function(BI){function BQ(BO,BM){var BL=0,BN=dm(function(BK,BG){var BH=BG[1],BJ=dc(wx[7],BI,BG[2]);return [0,[0,[0,BH[1],BH[2]],BJ],BK];},BL,BM),BP=dc(wx[7],BI,BO);return dc(wD[4],BP,BN);}return dc(wD[11],BQ,Bp);},BT=kh(wC[14],BS,AU,BR),Cc=wD[1],Cd=function(B9,B6,Cb){function Ca(B8,B3,B$){var B5=0,B7=dm(function(B4,BW){return dm(function(B2,BU){var BV=BU[1],BX=BW[1],BZ=kh(ww[7],BY,BX[1],BV[1]),B0=dc(wx[7],BW[2],BU[2]);return [0,[0,[0,BZ,kh(ww[7],B1,BX[2],BV[2])],B0],B2];},B4,B3);},B5,B6),B_=dc(wx[7],B9,B8);return kh(wD[4],B_,B7,B$);}return kh(wD[11],Ca,Br,Cb);},Ce=Am(Bn,kh(wD[11],Cd,Bp,Cc));return [0,[0,AZ,Am(Am(BF,BT),Ce),A7],A0];}throw [0,d,ac];}if(926224370<=z2){if(974443759<=z2){var z3=z1[2],z6=z4(z5,z3[1]),z7=z4(z6[2],z3[2]),z8=z7[1],z9=z6[1],z_=z8[2],z$=z8[1],Aa=z9[1],Ac=z7[2];if(Ab(z9,z8)){var Ad=c1(wx[5],z$),Ai=dc(wD[22],Ad,z_),Aj=c3(function(Ae){var Af=dc(ww[5],Aa,Aa),Ag=dc(ww[22],z$,Ae[1][2]),Ah=dc(ww[5],Aa,Ag);return [0,[0,Af,Ah],Ae[2]];},Ai),Ak=c1(wx[5],z$),Al=dc(wD[6],Ak,z_),An=Am(z9[2],Al),Ao=c1(wx[5],Aa),Ap=Am(dc(wD[5],Ao,Aj),An);return [0,[0,Aa,Ap,dc(wC[7],z9[3],z8[3])],Ac];}throw [0,d,aa];}var Aq=z4(z5,z1[2]),Ar=Aq[1],As=Ar[3],At=Ar[2],Au=Ar[1],Aw=Aq[2];return [0,[0,Au,Am(At,Av(As,Au,At)),As],Aw];}if(!(748545556<=z2)){var Ax=z1[2],Ay=z4(z5,Ax[1]),Az=z4(Ay[2],Ax[2]),AA=Az[1],AB=Ay[1],AC=AA[2],AD=AA[1],AE=Az[2];if(Ab(AB,AA)){var AF=Av(AB[3],AD,AC),AG=c1(wx[5],AD),AH=dc(wD[6],AG,AC),AI=Am(AF,Am(AB[2],AH));return [0,[0,AB[1],AI,AA[3]],AE];}throw [0,d,ab];}}return o(ad);}function EN(Cf){return z4(0,Cf)[1];}function FW(Ch,Cg){var Ci=Ch[1],Cp=Cg[3],Co=Cg[2],Cn=Ch[3],Cm=Ch[2],Cq=id([0,function(Ck,Cj){var Cl=dc(wx[10],Ck[1],Cj[1]);return 0===Cl?dc(wB[10],Ck[2],Cj[2]):Cl;}]);function Ey(Cu,Cv,Cr){var Cs=Cr[2],Ct=Cr[1],Cw=Cu[3];if(dc(Cq[3],[0,Ct,Cs],Cv))return 0;var Cx=dc(Cq[4],[0,Ct,Cs],Cv);if(dc(wC[3],Ct,Cn)){var CA=function(Cy){var Cz=w2(Cy);return dc(wC[3],Cz,Cp);},CB=dc(wB[16],CA,Cs);}else var CB=1;if(CB){var CC=wM(0,wD[22],Ct,Cm);return 0===CC?0:dl(function(CD){var CE=CD[1],CF=CE[1],CG=Cu[3],CH=Cu[2],CI=Cu[1],CJ=CE[2],CL=yO([0,CI,CH,CG]),CK=c1(yM,CF),CT=ww[1];function CU(CM,CQ,CO){var CN=c1(CK,CM),CP=wM(wx[1],ww[22],CN,CO),CR=dc(wx[4],CQ,CP),CS=c1(CK,CM);return kh(ww[4],CS,CR,CO);}var CX=kh(ww[11],CU,CG,CT);function CY(CW,CV){return 1<c1(wx[19],CV)?1:0;}var CZ=dc(ww[14],CY,CX),C0=w2(CF);function C3(C1,C2){return 1-dc(wx[3],C1,C0);}var C9=dc(ww[14],C3,CG);function C_(C4,C8){try {var C5=c1(CK,C4),C6=dc(ww[22],C5,CG);}catch(C7){if(C7[1]===c)return C8;throw C7;}return C6;}var C$=dc(ww[24],C_,CG);function Dd(Da,Dc,Db){return yN(dc(ww[22],Da,C$),Dc,Db);}var Dw=[0,kh(ww[11],Dd,CZ,CH),C9,CL];function Dx(De,Dv,Dg){var Df=c1(CK,De),Dh=dc(ww[22],Df,C$),Dt=[0,Dg[1],Dg[2],Dg[3]];function Du(Dl,Di){var Dj=Di[3],Dk=Di[2],Dm=Dl[2];try {var Dn=[0,dc(ww[22],Dm,Dk),Dj],Do=Dn;}catch(Dp){if(Dp[1]!==c)throw Dp;var Do=[0,Dj,Dj+1|0];}var Dq=Do[1],Dr=Do[2],Ds=kh(ww[4],Dm,Dq,Dk);return [0,dc(wQ[4],[0,Dh,Dl[1],Dq],Di[1]),Ds,Dr];}return kh(wN[14],Du,Dv,Dt);}var Dy=kh(ww[11],Dx,CJ,Dw),Dz=[0,CI,Dy[1],Dy[2]],DC=wB[1];function DD(DA){var DB=w3(w3(DA,CF),Cw);return c1(wB[4],DB);}var DE=kh(wB[14],DD,Cs,DC),Ek=wB[1];function El(DF,Ej){var DG=w2(DF),Ei=wM(0,wD[22],DG,Co);return dm(function(Eh,DH){var DI=DH[1],DJ=DI[1],DK=Dz[2],DM=c1(yM,DJ);function DP(DL,DO){var DN=c1(DM,DL);return dc(ww[22],DN,DF)!==DO?1:0;}if(dc(ww[13],DP,DF))var DQ=wB[1];else{var DT=function(DR,DS){return 1-dc(ww[3],DR,DJ);},DU=dc(ww[14],DT,DF),DV=c1(wB[5],DU),Ef=DI[2],Eg=function(DX,Ee){function Ed(DW,Ec){var D7=DW[2],D1=DW[1],Ea=wB[1];function Eb(D6){var DY=dc(ww[22],DX,DF),D3=wB[1];function D4(DZ){var D0=DZ[1]===DY?1:0,D2=D0?caml_string_equal(D1,DZ[2]):D0;return D2;}var D9=dc(wQ[17],D4,DK);function D_(D5){var D8=kh(ww[4],D7,D5[3],D6);return c1(wB[4],D8);}var D$=kh(wQ[14],D_,D9,D3);return c1(wB[7],D$);}return kh(wB[14],Eb,Ec,Ea);}return dc(wN[14],Ed,Ee);},DQ=kh(ww[11],Eg,Ef,DV);}return dc(wB[7],Eh,DQ);},Ej,Ei);}var Em=kh(wB[14],El,DE,Ek),Eq=Dz[3],Ep=ww[1];function Er(En,Eo){return dc(ww[4],Eo,En);}var Es=kh(ww[11],Er,Eq,Ep),Ev=wB[1];function Ew(Et){var Eu=w3(Et,Es);return c1(wB[4],Eu);}var Ex=kh(wB[14],Ew,Em,Ev);return Ey(Dz,Cx,[0,CD[2],Ex]);},CC);}var Ez=Cu[3],EA=Cu[2],EB=Cu[1],EC=yO([0,EB,EA,Ez]),EE=wx[1],EF=function(ED){return wx[4];};throw [0,w4,yF([0,EB,yN(EC,kh(ww[11],EF,Ez,EE),EA),EC])];}try {var EG=dc(ww[5],Cg[1],Ci),EH=c1(wB[5],EG),EI=[0,c1(wx[5],Ci),EH],EJ=Cq[1],EK=dc(ww[5],Ci,0);Ey([0,0,wQ[1],EK],EJ,EI);var EL=0;}catch(EM){if(EM[1]===w4)return [0,EM[2]];throw EM;}return EL;}function FX(EQ,ET,ES,EP,EO){var ER=dc(EQ,EP,EO);return ER?[0,0,EU(sO,z,ET,ES,wn(ER[1]))]:[0,1,kh(sO,y,ET,ES)];}function FY(Fv,FG,EV){var E5=[0],E4=1,E3=0,E2=0,E1=0,E0=0,EZ=0,EY=EV.getLen(),EX=cy(EV,b4),E6=[0,function(EW){EW[9]=1;return 0;},EX,EY,EZ,E0,E1,E2,E3,E4,E5,f,f],Fb=dQ[11],Fa=dQ[14],E$=dQ[6],E_=dQ[15],E9=dQ[7],E8=dQ[8],E7=dQ[16];dQ[6]=dQ[14]+1|0;dQ[7]=2;dQ[10]=E6[12];try {var Fc=0,Fd=0;for(;;)switch(caml_parse_engine(v8,dQ,Fc,Fd)){case 1:throw [0,dP];case 2:dZ(0);var Ff=0,Fe=2,Fc=Fe,Fd=Ff;continue;case 3:dZ(0);var Fh=0,Fg=3,Fc=Fg,Fd=Fh;continue;case 4:try {var Fi=[0,4,c1(caml_array_get(v8[1],dQ[13]),dQ)],Fj=Fi;}catch(Fk){if(Fk[1]!==dP)throw Fk;var Fj=[0,5,0];}var Fm=Fj[2],Fl=Fj[1],Fc=Fl,Fd=Fm;continue;case 5:c1(v8[14],b3);var Fo=0,Fn=5,Fc=Fn,Fd=Fo;continue;default:var Fp=wf(E6);dQ[9]=E6[11];dQ[10]=E6[12];var Fq=1,Fc=Fq,Fd=Fp;continue;}}catch(Fs){var Fr=dQ[7];dQ[11]=Fb;dQ[14]=Fa;dQ[6]=E$;dQ[15]=E_;dQ[7]=E9;dQ[8]=E8;dQ[16]=E7;if(Fs[1]===dO){var Ft=Fs[2],Fu=Ft[1],Fw=c1(Fv,Ft[3]),Fx=c1(Fv,Ft[2]),FE=function(Fy){return [0,1-Fy[1],Fy[2]];},FF=function(FA,Fz){var FC=cy(FA[2],Fz[2]),FB=FA[1],FD=FB?Fz[1]:FB;return [0,FD,FC];};if(17064<=Fu)if(3802040<=Fu)if(3901498<=Fu){var FH=FE(EU(FG,Z,_,Fx,Fw)),FI=FH[2],FJ=FH[1];if(FJ)var FK=[0,FJ,FI];else{var FL=FE(EU(FG,X,Y,Fw,Fx)),FM=cy(FI,FL[2]),FK=[0,FL[1],FM];}var FN=FK;}else var FN=EU(FG,V,W,Fx,Fw);else if(3553395<=Fu)var FN=EU(FG,T,U,Fw,Fx);else{var FO=FE(EU(FG,R,S,Fw,Fx)),FN=FF(EU(FG,P,Q,Fx,Fw),FO);}else if(15500===Fu){var FP=EU(FG,F,G,Fw,Fx),FN=FF(EU(FG,D,E,Fx,Fw),FP);}else if(15949<=Fu){var FQ=EU(FG,N,O,Fw,Fx),FN=FF(FE(EU(FG,L,M,Fx,Fw)),FQ);}else{var FR=FE(EU(FG,J,K,Fw,Fx)),FN=FF(FE(EU(FG,H,I,Fx,Fw)),FR);}var FS=FN[1],FU=FN[2],FT=FS?C:B;return [0,FS,EU(sO,A,EV,FT,FU)];}d4[1]=function(FV){return caml_obj_is_block(FV)?caml_array_get(v8[3],caml_obj_tag(FV))===Fr?1:0:caml_array_get(v8[2],FV)===Fr?1:0;};throw Fs;}}var GA=dc(FY,EN,c1(FX,FW));function Gz(FZ){function F4(F3,F2,F0){try {var F1=FZ.safeGet(F0),F5=10===F1?F4(q,[0,F3,F2],F0+1|0):(j.safeSet(0,F1),F4(cy(F3,j),F2,F0+1|0));}catch(F6){if(F6[1]===b)return dk([0,F3,F2]);throw F6;}return F5;}return F4(p,0,0);}function GB(F8,F7){try {var F9=c1(F8,F7);}catch(F_){if(F_[1]===dP)return r;throw F_;}return F9;}function HE(HD){var F$=u3.getElementById(w.toString());if(F$==uS)throw [0,d,x];var Ga=va(u3,aL),Gb=va(u3,aM),Gc=vd(u3),Gd=0,Ge=0;for(;;){if(0===Ge&&0===Gd){var Gf=u8(u3,h),Gg=1;}else var Gg=0;if(!Gg){var Gh=vb[1];if(785140586===Gh){try {var Gi=u3.createElement(aQ.toString()),Gj=aP.toString(),Gk=Gi.tagName.toLowerCase()===Gj?1:0,Gl=Gk?Gi.name===aO.toString()?1:0:Gk,Gm=Gl;}catch(Go){var Gm=0;}var Gn=Gm?982028505:-1003883683;vb[1]=Gn;continue;}if(982028505<=Gh){var Gp=new uT();Gp.push(aT.toString(),h.toString());u$(Ge,function(Gq){Gp.push(aU.toString(),caml_js_html_escape(Gq),aV.toString());return 0;});u$(Gd,function(Gr){Gp.push(aW.toString(),caml_js_html_escape(Gr),aX.toString());return 0;});Gp.push(aS.toString());var Gf=u3.createElement(Gp.join(aR.toString()));}else{var Gs=u8(u3,h);u$(Ge,function(Gt){return Gs.type=Gt;});u$(Gd,function(Gu){return Gs.name=Gu;});var Gf=Gs;}}Gf.rows=20;Gf.cols=50;var Gv=vd(u3);Gv.style.border=v.toString();Gv.style.padding=u.toString();Gv.style.width=t.toString();u1(F$,Ga);u1(Ga,Gb);u1(Gb,Gc);u1(Gc,Gf);u1(Gb,Gv);var GQ=function(Gx,GP){var Gw=new MlWrappedString(Gf.value);if(caml_string_notequal(Gw,Gx)){try {var Gy=va(u3,aI),GC=Gz(Gw),GG=c3(c1(GB,GA),GC),GE=function(GD){if(GD){var GF=GE(GD[2]);return cv(Gz(GD[1][2]),GF);}return GD;},GI=GE(GG),GL=c3(function(GH){return GH.toString();},GI);dl(function(GK){var GJ=va(u3,aK);GJ.innerHTML=GK;u1(Gy,GJ);return u1(Gy,va(u3,aJ));},GL);var GM=Gv.firstChild;if(GM!=uS)Gv.removeChild(GM);u1(Gv,Gy);}catch(GO){}var GN=20;}else var GN=cn(0,GP-1|0);function GS(GR){return GQ(Gw,GN);}var GT=0===GN?0.5:0.1,GU=[0,[2,[0,1,0,0,0]]],GV=[0,0];function G0(GW,G2){var GX=ve<GW?[0,ve,GW-ve]:[0,GW,0],GY=GX[2],G1=GX[1],GZ=GY==0?c1(uI,GU):c1(G0,GY);GV[1]=[0,u2.setTimeout(caml_js_wrap_callback(GZ),G1*1e3)];return 0;}G0(GT,0);function G5(G4){var G3=GV[1];return G3?u2.clearTimeout(G3[1]):0;}var G6=tO(GU)[1];switch(G6[0]){case 1:var G7=G6[1][1]===tC?(ud(G5,0),1):0;break;case 2:var G8=G6[1],G9=[0,tG[1],G5],G_=G8[4],G$=typeof G_==="number"?G9:[2,G9,G_];G8[4]=G$;var G7=1;break;default:var G7=0;}var Ha=tO(GU),Hb=Ha[1];switch(Hb[0]){case 1:var Hc=[0,Hb];break;case 2:var Hd=Hb[1],He=[0,[2,[0,[0,[0,Ha]],0,0,0]]],Hg=tG[1],HA=[1,function(Hf){switch(Hf[0]){case 0:var Hh=Hf[1];tG[1]=Hg;try {var Hi=GS(Hh),Hj=Hi;}catch(Hk){var Hj=[0,[1,Hk]];}var Hl=tO(He),Hm=tO(Hj),Hn=Hl[1];{if(2===Hn[0]){var Ho=Hn[1];if(Hl===Hm)var Hp=0;else{var Hq=Hm[1];if(2===Hq[0]){var Hr=Hq[1];Hm[1]=[3,Hl];Ho[1]=Hr[1];var Hs=uG(Ho[2],Hr[2]),Ht=Ho[3]+Hr[3]|0;if(tF<Ht){Ho[3]=0;Ho[2]=uD(Hs);}else{Ho[3]=Ht;Ho[2]=Hs;}var Hu=Hr[4],Hv=Ho[4],Hw=typeof Hv==="number"?Hu:typeof Hu==="number"?Hv:[2,Hv,Hu];Ho[4]=Hw;var Hp=0;}else{Hl[1]=Hq;var Hp=uj(Ho,Hq);}}return Hp;}throw [0,d,a0];}case 1:var Hx=tO(He),Hy=Hx[1];{if(2===Hy[0]){var Hz=Hy[1];Hx[1]=Hf;return uj(Hz,Hf);}throw [0,d,a1];}default:throw [0,d,a3];}}],HB=Hd[2],HC=typeof HB==="number"?HA:[2,HA,HB];Hd[2]=HC;var Hc=He;break;case 3:throw [0,d,a2];default:var Hc=GS(Hb[1]);}return Hc;};GQ(s,0);return uV;}}u2.onload=caml_js_wrap_callback(function(HF){if(HF){var HG=HE(HF);if(!(HG|0))HF.preventDefault();return HG;}var HH=event,HI=HE(HH);if(!(HI|0))HH.returnValue=HI;return HI;});cH(0);return;}());
