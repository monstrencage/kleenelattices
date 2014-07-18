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
(function(){function sz(HQ,HR,HS,HT,HU,HV,HW){return HQ.length==6?HQ(HR,HS,HT,HU,HV,HW):caml_call_gen(HQ,[HR,HS,HT,HU,HV,HW]);}function ET(HL,HM,HN,HO,HP){return HL.length==4?HL(HM,HN,HO,HP):caml_call_gen(HL,[HM,HN,HO,HP]);}function kg(HH,HI,HJ,HK){return HH.length==3?HH(HI,HJ,HK):caml_call_gen(HH,[HI,HJ,HK]);}function db(HE,HF,HG){return HE.length==2?HE(HF,HG):caml_call_gen(HE,[HF,HG]);}function c0(HC,HD){return HC.length==1?HC(HD):caml_call_gen(HC,[HD]);}var a=[0,new MlString("Failure")],b=[0,new MlString("Invalid_argument")],c=[0,new MlString("Not_found")],d=[0,new MlString("Assert_failure")],e=[0,new MlString(""),0,0,-1],f=[0,new MlString(""),1,0,0],g=new MlString("File \"%s\", line %d, characters %d-%d: %s"),h=new MlString("textarea"),i=[0,new MlString("\0\0\xeb\xff\xec\xff\x02\0\x1e\0L\0\xf5\xff\xf6\xff\xf7\xff\xf8\xff\xf9\xff\xfa\xff\xfb\xffM\0\xfd\xff\x0b\0\xbf\0\xfe\xff\x03\0 \0\xf4\xff\xf3\xff\xef\xff\xf2\xff\xee\xff\x01\0\xfd\xff\xfe\xff\xff\xff"),new MlString("\xff\xff\xff\xff\xff\xff\x0f\0\x0e\0\x12\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x03\0\xff\xff\x14\0\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString("\x01\0\0\0\0\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\xff\xff\xff\xff\0\0\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\x1a\0\0\0\0\0\0\0"),new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\x0e\0\x1c\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\b\0\0\0\x07\0\x06\0\f\0\x0b\0\x10\0\0\0\t\0\x0f\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x11\0\0\0\x04\0\x05\0\x03\0\x18\0\x15\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x17\0\x16\0\x14\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x12\0\n\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\x13\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x10\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x02\0\x1b\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"),new MlString("\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\0\0\x19\0\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x0f\0\xff\xff\0\0\0\0\0\0\x03\0\x12\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x13\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x05\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\x05\0\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x10\0\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\x19\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString("")],j=new MlString(" ");caml_register_global(6,c);caml_register_global(5,[0,new MlString("Division_by_zero")]);caml_register_global(3,b);caml_register_global(2,a);var ck=[0,new MlString("Out_of_memory")],cj=[0,new MlString("Match_failure")],ci=[0,new MlString("Stack_overflow")],ch=[0,new MlString("Undefined_recursive_module")],cg=new MlString("%.12g"),cf=new MlString("."),ce=new MlString("%d"),cd=new MlString("true"),cc=new MlString("false"),cb=new MlString("Pervasives.do_at_exit"),ca=new MlString("Array.blit"),b$=new MlString("\\b"),b_=new MlString("\\t"),b9=new MlString("\\n"),b8=new MlString("\\r"),b7=new MlString("\\\\"),b6=new MlString("\\'"),b5=new MlString("String.blit"),b4=new MlString("String.sub"),b3=new MlString(""),b2=new MlString("syntax error"),b1=new MlString("Parsing.YYexit"),b0=new MlString("Parsing.Parse_error"),bZ=new MlString("Set.remove_min_elt"),bY=[0,0,0,0],bX=[0,0,0],bW=new MlString("Set.bal"),bV=new MlString("Set.bal"),bU=new MlString("Set.bal"),bT=new MlString("Set.bal"),bS=new MlString("Map.remove_min_elt"),bR=[0,0,0,0],bQ=[0,new MlString("map.ml"),270,10],bP=[0,0,0],bO=new MlString("Map.bal"),bN=new MlString("Map.bal"),bM=new MlString("Map.bal"),bL=new MlString("Map.bal"),bK=new MlString("Queue.Empty"),bJ=new MlString("Buffer.add: cannot grow buffer"),bI=new MlString(""),bH=new MlString(""),bG=new MlString("%.12g"),bF=new MlString("\""),bE=new MlString("\""),bD=new MlString("'"),bC=new MlString("'"),bB=new MlString("nan"),bA=new MlString("neg_infinity"),bz=new MlString("infinity"),by=new MlString("."),bx=new MlString("printf: bad positional specification (0)."),bw=new MlString("%_"),bv=[0,new MlString("printf.ml"),143,8],bu=new MlString("'"),bt=new MlString("Printf: premature end of format string '"),bs=new MlString("'"),br=new MlString(" in format string '"),bq=new MlString(", at char number "),bp=new MlString("Printf: bad conversion %"),bo=new MlString("Sformat.index_of_int: negative argument "),bn=new MlString(""),bm=new MlString(", %s%s"),bl=[1,1],bk=new MlString("%s\n"),bj=new MlString("(Program not linked with -g, cannot print stack backtrace)\n"),bi=new MlString("Raised at"),bh=new MlString("Re-raised at"),bg=new MlString("Raised by primitive operation at"),bf=new MlString("Called from"),be=new MlString("%s file \"%s\", line %d, characters %d-%d"),bd=new MlString("%s unknown location"),bc=new MlString("Out of memory"),bb=new MlString("Stack overflow"),ba=new MlString("Pattern matching failed"),a$=new MlString("Assertion failed"),a_=new MlString("Undefined recursive module"),a9=new MlString("(%s%s)"),a8=new MlString(""),a7=new MlString(""),a6=new MlString("(%s)"),a5=new MlString("%d"),a4=new MlString("%S"),a3=new MlString("_"),a2=[0,new MlString("src/core/lwt.ml"),648,20],a1=[0,new MlString("src/core/lwt.ml"),651,8],a0=[0,new MlString("src/core/lwt.ml"),498,8],aZ=[0,new MlString("src/core/lwt.ml"),487,9],aY=new MlString("Lwt.wakeup_result"),aX=new MlString("Lwt.Canceled"),aW=new MlString("\""),aV=new MlString(" name=\""),aU=new MlString("\""),aT=new MlString(" type=\""),aS=new MlString("<"),aR=new MlString(">"),aQ=new MlString(""),aP=new MlString("<input name=\"x\">"),aO=new MlString("input"),aN=new MlString("x"),aM=new MlString("td"),aL=new MlString("tr"),aK=new MlString("table"),aJ=new MlString("a"),aI=new MlString("br"),aH=new MlString("p"),aG=new MlString("Exception during Lwt.async: "),aF=new MlString("parser"),aE=new MlString("1"),aD=new MlString("0"),aC=[0,0,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,0],aB=new MlString("\xff\xff\x02\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\0\0\0\0"),aA=new MlString("\x02\0\x03\0\x01\0\x02\0\x03\0\x03\0\x03\0\x02\0\x02\0\x03\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x02\0\x02\0"),az=new MlString("\0\0\0\0\0\0\0\0\x02\0\0\0\0\0\0\0\x12\0\0\0\x03\0\0\0\0\0\b\0\x07\0\0\0\n\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\0\0\t\0\0\0\0\0\0\0\0\0"),ay=new MlString("\x03\0\x06\0\b\0\x17\0"),ax=new MlString("\x05\0\x01\xff\x01\xff\0\0\0\0\x01\xff\n\xff\x18\xff\0\0'\xff\0\0\x01\xff\x01\xff\0\0\0\0\x01\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x01\xff\0\x000\xff<\xff4\xff\n\xff"),aw=new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x1d\0\x01\0\x0f\0\b\0"),av=new MlString("\0\0\xfe\xff\0\0\0\0"),au=new MlString("\x07\0\x06\0\x04\0\t\0\x11\0\x05\0\x01\0\x02\0\x01\0\x19\0\x1a\0\0\0\n\0\x1b\0\0\0\x05\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x1c\0\0\0\0\0\0\0\0\0\n\0\0\0\0\0\x04\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\x11\0\x12\0\x13\0\x14\0\x15\0\n\0\x16\0\0\0\x18\0\x0b\0\f\0\r\0\x0e\0\x0f\0\n\0\0\0\0\0\0\0\n\0\f\0\r\0\x0e\0\x0f\0\f\0\r\0\x0e\0\n\0\0\0\0\0\0\0\0\0\0\0\r\0\x0e\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x06\0\x06\0\x06\0\0\0\0\0\x06\0\x06\0\x06\0\x06\0\x06\0\x06\0\x06\0\0\0\x06\0\x05\0\x05\0\0\0\0\0\0\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\0\0\x05\0\x04\0\x04\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\0\0\x04\0"),at=new MlString("\x02\0\0\0\x01\x01\x05\0\0\0\x04\x01\x01\0\x02\0\0\0\x0b\0\f\0\xff\xff\x02\x01\x0f\0\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x17\0\xff\xff\xff\xff\xff\xff\xff\xff\x02\x01\xff\xff\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\x02\x01\x12\x01\xff\xff\x05\x01\x06\x01\x07\x01\b\x01\t\x01\n\x01\x02\x01\xff\xff\xff\xff\xff\xff\x02\x01\x07\x01\b\x01\t\x01\n\x01\x07\x01\b\x01\t\x01\x02\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\b\x01\t\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x05\x01\x06\x01\x07\x01\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\xff\xff\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01"),as=new MlString("EOF\0NEWLINE\0LPAR\0RPAR\0PLUS\0DOT\0PSTAR\0STAR\0INTER\0EGAL\0LEQ\0GEQ\0LT\0GT\0IMCOMP\0DUNNO\0DIFF\0"),ar=new MlString("VAR\0POWER\0"),aq=new MlString("lexing error"),ap=new MlString("\xc3\xb8"),ao=new MlString("\xce\xb5"),an=new MlString("(%s | %s)"),am=new MlString("(%s)+"),al=new MlString("(%s)~"),ak=new MlString("%s.%s"),aj=new MlString("(%s & %s)"),ai=new MlString("Tools.ContreExemple"),ah=new MlString("get_expr : empty word"),ag=[0,new MlString("word.ml"),260,4],af=new MlString("get_expr : stuck"),ae=new MlString("get_expr : stuck"),ad=[0,new MlString("word.ml"),210,15],ac=new MlString("Lts.trad : unsupported operation"),ab=[0,new MlString("lts.ml"),130,2],aa=[0,new MlString("lts.ml"),99,2],$=[0,new MlString("lts.ml"),63,2],_=new MlString("mergeint : conflict"),Z=new MlString("e2"),Y=new MlString("e1"),X=new MlString("e1"),W=new MlString("e2"),V=new MlString("e2"),U=new MlString("e1"),T=new MlString("e1"),S=new MlString("e2"),R=new MlString("e1"),Q=new MlString("e2"),P=new MlString("e2"),O=new MlString("e1"),N=new MlString("e1"),M=new MlString("e2"),L=new MlString("e2"),K=new MlString("e1"),J=new MlString("e1"),I=new MlString("e2"),H=new MlString("e2"),G=new MlString("e1"),F=new MlString("e1"),E=new MlString("e2"),D=new MlString("e2"),C=new MlString("e1"),B=new MlString("OK"),A=new MlString("Incorrect"),z=new MlString("%s --------- %s\n%s\n\n"),y=new MlString("\n%s <= %s : false (%s)"),x=new MlString("\n%s <= %s : true"),w=[0,new MlString("wmain.ml"),44,17],v=new MlString("zob"),u=new MlString("1px black dashed"),t=new MlString("5px"),s=new MlString("400px"),r=new MlString(""),q=new MlString(""),p=new MlString("");function o(k){throw [0,a,k];}function cl(l){throw [0,b,l];}function cm(n,m){return caml_greaterequal(n,m)?n:m;}function cx(cn,cp){var co=cn.getLen(),cq=cp.getLen(),cr=caml_create_string(co+cq|0);caml_blit_string(cn,0,cr,0,co);caml_blit_string(cp,0,cr,co,cq);return cr;}function cy(cs){return caml_format_int(ce,cs);}function cu(ct,cv){if(ct){var cw=ct[1];return [0,cw,cu(ct[2],cv)];}return cv;}var cz=caml_ml_open_descriptor_out(2);function cH(cB,cA){return caml_ml_output(cB,cA,0,cA.getLen());}function cG(cF){var cC=caml_ml_out_channels_list(0);for(;;){if(cC){var cD=cC[2];try {}catch(cE){}var cC=cD;continue;}return 0;}}caml_register_named_value(cb,cG);function cL(cJ,cI){return caml_ml_output_char(cJ,cI);}function cS(cK){return caml_ml_flush(cK);}function cR(cO,cN,cQ,cP,cM){if(0<=cM&&0<=cN&&!((cO.length-1-cM|0)<cN)&&0<=cP&&!((cQ.length-1-cM|0)<cP))return caml_array_blit(cO,cN,cQ,cP,cM);return cl(ca);}function dj(cT){var cU=cT,cV=0;for(;;){if(cU){var cW=cU[2],cX=[0,cU[1],cV],cU=cW,cV=cX;continue;}return cV;}}function c2(cZ,cY){if(cY){var c1=cY[2],c3=c0(cZ,cY[1]);return [0,c3,c2(cZ,c1)];}return 0;}function dk(c6,c4){var c5=c4;for(;;){if(c5){var c7=c5[2];c0(c6,c5[1]);var c5=c7;continue;}return 0;}}function dl(da,c8,c_){var c9=c8,c$=c_;for(;;){if(c$){var dc=c$[2],dd=db(da,c9,c$[1]),c9=dd,c$=dc;continue;}return c9;}}function dm(dg,de){var df=de;for(;;){if(df){var dh=df[2],di=0===caml_compare(df[1],dg)?1:0;if(di)return di;var df=dh;continue;}return 0;}}function dA(dn,dq){var dp=caml_create_string(dn);caml_fill_string(dp,0,dn,dq);return dp;}function dB(dt,dr,ds){if(0<=dr&&0<=ds&&!((dt.getLen()-ds|0)<dr)){var du=caml_create_string(ds);caml_blit_string(dt,dr,du,0,ds);return du;}return cl(b4);}function dC(dx,dw,dz,dy,dv){if(0<=dv&&0<=dw&&!((dx.getLen()-dv|0)<dw)&&0<=dy&&!((dz.getLen()-dv|0)<dy))return caml_blit_string(dx,dw,dz,dy,dv);return cl(b5);}var dD=caml_sys_const_word_size(0),dE=caml_mul(dD/8|0,(1<<(dD-10|0))-1|0)-1|0,dM=252,dL=253;function dK(dH,dG,dF){var dI=caml_lex_engine(dH,dG,dF);if(0<=dI){dF[11]=dF[12];var dJ=dF[12];dF[12]=[0,dJ[1],dJ[2],dJ[3],dF[4]+dF[6]|0];}return dI;}var dN=[0,b1],dO=[0,b0],dP=[0,caml_make_vect(100,0),caml_make_vect(100,0),caml_make_vect(100,e),caml_make_vect(100,e),100,0,0,0,e,e,0,0,0,0,0,0];function dY(dW){var dQ=dP[5],dR=dQ*2|0,dS=caml_make_vect(dR,0),dT=caml_make_vect(dR,0),dU=caml_make_vect(dR,e),dV=caml_make_vect(dR,e);cR(dP[1],0,dS,0,dQ);dP[1]=dS;cR(dP[2],0,dT,0,dQ);dP[2]=dT;cR(dP[3],0,dU,0,dQ);dP[3]=dU;cR(dP[4],0,dV,0,dQ);dP[4]=dV;dP[5]=dR;return 0;}var d3=[0,function(dX){return 0;}];function d2(dZ,d0){return caml_array_get(dZ[2],dZ[11]-d0|0);}function id(d1){return 0;}function ic(ez){function eg(d4){return d4?d4[4]:0;}function ei(d5,d_,d7){var d6=d5?d5[4]:0,d8=d7?d7[4]:0,d9=d8<=d6?d6+1|0:d8+1|0;return [0,d5,d_,d7,d9];}function eD(d$,ej,eb){var ea=d$?d$[4]:0,ec=eb?eb[4]:0;if((ec+2|0)<ea){if(d$){var ed=d$[3],ee=d$[2],ef=d$[1],eh=eg(ed);if(eh<=eg(ef))return ei(ef,ee,ei(ed,ej,eb));if(ed){var el=ed[2],ek=ed[1],em=ei(ed[3],ej,eb);return ei(ei(ef,ee,ek),el,em);}return cl(bW);}return cl(bV);}if((ea+2|0)<ec){if(eb){var en=eb[3],eo=eb[2],ep=eb[1],eq=eg(ep);if(eq<=eg(en))return ei(ei(d$,ej,ep),eo,en);if(ep){var es=ep[2],er=ep[1],et=ei(ep[3],eo,en);return ei(ei(d$,ej,er),es,et);}return cl(bU);}return cl(bT);}var eu=ec<=ea?ea+1|0:ec+1|0;return [0,d$,ej,eb,eu];}function eC(eA,ev){if(ev){var ew=ev[3],ex=ev[2],ey=ev[1],eB=db(ez[1],eA,ex);return 0===eB?ev:0<=eB?eD(ey,ex,eC(eA,ew)):eD(eC(eA,ey),ex,ew);}return [0,0,eA,0,1];}function eK(eE){return [0,0,eE,0,1];}function eG(eH,eF){if(eF){var eJ=eF[3],eI=eF[2];return eD(eG(eH,eF[1]),eI,eJ);}return eK(eH);}function eM(eN,eL){if(eL){var eP=eL[2],eO=eL[1];return eD(eO,eP,eM(eN,eL[3]));}return eK(eN);}function eU(eQ,eV,eR){if(eQ){if(eR){var eS=eR[4],eT=eQ[4],e0=eR[3],e1=eR[2],eZ=eR[1],eW=eQ[3],eX=eQ[2],eY=eQ[1];return (eS+2|0)<eT?eD(eY,eX,eU(eW,eV,eR)):(eT+2|0)<eS?eD(eU(eQ,eV,eZ),e1,e0):ei(eQ,eV,eR);}return eM(eV,eQ);}return eG(eV,eR);}function fe(e2){var e3=e2;for(;;){if(e3){var e4=e3[1];if(e4){var e3=e4;continue;}return e3[2];}throw [0,c];}}function ft(e5){var e6=e5;for(;;){if(e6){var e7=e6[3],e8=e6[2];if(e7){var e6=e7;continue;}return e8;}throw [0,c];}}function e$(e9){if(e9){var e_=e9[1];if(e_){var fb=e9[3],fa=e9[2];return eD(e$(e_),fa,fb);}return e9[3];}return cl(bZ);}function fu(fc,fd){if(fc){if(fd){var ff=e$(fd);return eU(fc,fe(fd),ff);}return fc;}return fd;}function fm(fk,fg){if(fg){var fh=fg[3],fi=fg[2],fj=fg[1],fl=db(ez[1],fk,fi);if(0===fl)return [0,fj,1,fh];if(0<=fl){var fn=fm(fk,fh),fp=fn[3],fo=fn[2];return [0,eU(fj,fi,fn[1]),fo,fp];}var fq=fm(fk,fj),fs=fq[2],fr=fq[1];return [0,fr,fs,eU(fq[3],fi,fh)];}return bY;}var h9=0;function h_(fv){return fv?0:1;}function h$(fy,fw){var fx=fw;for(;;){if(fx){var fB=fx[3],fA=fx[1],fz=db(ez[1],fy,fx[2]),fC=0===fz?1:0;if(fC)return fC;var fD=0<=fz?fB:fA,fx=fD;continue;}return 0;}}function fM(fI,fE){if(fE){var fF=fE[3],fG=fE[2],fH=fE[1],fJ=db(ez[1],fI,fG);if(0===fJ){if(fH)if(fF){var fK=e$(fF),fL=eD(fH,fe(fF),fK);}else var fL=fH;else var fL=fF;return fL;}return 0<=fJ?eD(fH,fG,fM(fI,fF)):eD(fM(fI,fH),fG,fF);}return 0;}function fU(fN,fO){if(fN){if(fO){var fP=fO[4],fQ=fO[2],fR=fN[4],fS=fN[2],f0=fO[3],f2=fO[1],fV=fN[3],fX=fN[1];if(fP<=fR){if(1===fP)return eC(fQ,fN);var fT=fm(fS,fO),fW=fT[1],fY=fU(fV,fT[3]);return eU(fU(fX,fW),fS,fY);}if(1===fR)return eC(fS,fO);var fZ=fm(fQ,fN),f1=fZ[1],f3=fU(fZ[3],f0);return eU(fU(f1,f2),fQ,f3);}return fN;}return fO;}function f$(f4,f5){if(f4){if(f5){var f6=f4[3],f7=f4[2],f8=f4[1],f9=fm(f7,f5),f_=f9[1];if(0===f9[2]){var ga=f$(f6,f9[3]);return fu(f$(f8,f_),ga);}var gb=f$(f6,f9[3]);return eU(f$(f8,f_),f7,gb);}return 0;}return 0;}function gj(gc,gd){if(gc){if(gd){var ge=gc[3],gf=gc[2],gg=gc[1],gh=fm(gf,gd),gi=gh[1];if(0===gh[2]){var gk=gj(ge,gh[3]);return eU(gj(gg,gi),gf,gk);}var gl=gj(ge,gh[3]);return fu(gj(gg,gi),gl);}return gc;}return 0;}function gs(gm,go){var gn=gm,gp=go;for(;;){if(gn){var gq=gn[1],gr=[0,gn[2],gn[3],gp],gn=gq,gp=gr;continue;}return gp;}}function gG(gu,gt){var gv=gs(gt,0),gw=gs(gu,0),gx=gv;for(;;){if(gw)if(gx){var gC=gx[3],gB=gx[2],gA=gw[3],gz=gw[2],gy=db(ez[1],gw[1],gx[1]);if(0===gy){var gD=gs(gB,gC),gE=gs(gz,gA),gw=gE,gx=gD;continue;}var gF=gy;}else var gF=1;else var gF=gx?-1:0;return gF;}}function ia(gI,gH){return 0===gG(gI,gH)?1:0;}function gT(gJ,gL){var gK=gJ,gM=gL;for(;;){if(gK){if(gM){var gN=gM[3],gO=gM[1],gP=gK[3],gQ=gK[2],gR=gK[1],gS=db(ez[1],gQ,gM[2]);if(0===gS){var gU=gT(gR,gO);if(gU){var gK=gP,gM=gN;continue;}return gU;}if(0<=gS){var gV=gT([0,0,gQ,gP,0],gN);if(gV){var gK=gR;continue;}return gV;}var gW=gT([0,gR,gQ,0,0],gO);if(gW){var gK=gP;continue;}return gW;}return 0;}return 1;}}function gZ(g0,gX){var gY=gX;for(;;){if(gY){var g2=gY[3],g1=gY[2];gZ(g0,gY[1]);c0(g0,g1);var gY=g2;continue;}return 0;}}function g7(g8,g3,g5){var g4=g3,g6=g5;for(;;){if(g4){var g_=g4[3],g9=g4[2],g$=db(g8,g9,g7(g8,g4[1],g6)),g4=g_,g6=g$;continue;}return g6;}}function hg(hc,ha){var hb=ha;for(;;){if(hb){var hf=hb[3],he=hb[1],hd=c0(hc,hb[2]);if(hd){var hh=hg(hc,he);if(hh){var hb=hf;continue;}var hi=hh;}else var hi=hd;return hi;}return 1;}}function hq(hl,hj){var hk=hj;for(;;){if(hk){var ho=hk[3],hn=hk[1],hm=c0(hl,hk[2]);if(hm)var hp=hm;else{var hr=hq(hl,hn);if(!hr){var hk=ho;continue;}var hp=hr;}return hp;}return 0;}}function hu(hv,hs){if(hs){var ht=hs[2],hx=hs[3],hw=hu(hv,hs[1]),hz=c0(hv,ht),hy=hu(hv,hx);return hz?eU(hw,ht,hy):fu(hw,hy);}return 0;}function hC(hD,hA){if(hA){var hB=hA[2],hF=hA[3],hE=hC(hD,hA[1]),hG=hE[2],hH=hE[1],hJ=c0(hD,hB),hI=hC(hD,hF),hK=hI[2],hL=hI[1];if(hJ){var hM=fu(hG,hK);return [0,eU(hH,hB,hL),hM];}var hN=eU(hG,hB,hK);return [0,fu(hH,hL),hN];}return bX;}function hP(hO){if(hO){var hQ=hO[1],hR=hP(hO[3]);return (hP(hQ)+1|0)+hR|0;}return 0;}function hW(hS,hU){var hT=hS,hV=hU;for(;;){if(hV){var hY=hV[2],hX=hV[1],hZ=[0,hY,hW(hT,hV[3])],hT=hZ,hV=hX;continue;}return hT;}}function ib(h0){return hW(0,h0);}return [0,h9,h_,h$,eC,eK,fM,fU,f$,gj,gG,ia,gT,gZ,g7,hg,hq,hu,hC,hP,ib,fe,ft,fe,fm,function(h4,h1){var h2=h1;for(;;){if(h2){var h3=h2[2],h7=h2[3],h6=h2[1],h5=db(ez[1],h4,h3);if(0===h5)return h3;var h8=0<=h5?h7:h6,h2=h8;continue;}throw [0,c];}}];}function m_(iZ){function ig(ie){return ie?ie[5]:0;}function iA(ih,io,im,ij){var ii=ig(ih),ik=ig(ij),il=ik<=ii?ii+1|0:ik+1|0;return [0,ih,io,im,ij,il];}function iR(iq,ip){return [0,0,iq,ip,0,1];}function iS(ir,iC,iB,it){var is=ir?ir[5]:0,iu=it?it[5]:0;if((iu+2|0)<is){if(ir){var iv=ir[4],iw=ir[3],ix=ir[2],iy=ir[1],iz=ig(iv);if(iz<=ig(iy))return iA(iy,ix,iw,iA(iv,iC,iB,it));if(iv){var iF=iv[3],iE=iv[2],iD=iv[1],iG=iA(iv[4],iC,iB,it);return iA(iA(iy,ix,iw,iD),iE,iF,iG);}return cl(bO);}return cl(bN);}if((is+2|0)<iu){if(it){var iH=it[4],iI=it[3],iJ=it[2],iK=it[1],iL=ig(iK);if(iL<=ig(iH))return iA(iA(ir,iC,iB,iK),iJ,iI,iH);if(iK){var iO=iK[3],iN=iK[2],iM=iK[1],iP=iA(iK[4],iJ,iI,iH);return iA(iA(ir,iC,iB,iM),iN,iO,iP);}return cl(bM);}return cl(bL);}var iQ=iu<=is?is+1|0:iu+1|0;return [0,ir,iC,iB,it,iQ];}var m3=0;function m4(iT){return iT?0:1;}function i4(i0,i3,iU){if(iU){var iV=iU[4],iW=iU[3],iX=iU[2],iY=iU[1],i2=iU[5],i1=db(iZ[1],i0,iX);return 0===i1?[0,iY,i0,i3,iV,i2]:0<=i1?iS(iY,iX,iW,i4(i0,i3,iV)):iS(i4(i0,i3,iY),iX,iW,iV);}return [0,0,i0,i3,0,1];}function m5(i7,i5){var i6=i5;for(;;){if(i6){var i$=i6[4],i_=i6[3],i9=i6[1],i8=db(iZ[1],i7,i6[2]);if(0===i8)return i_;var ja=0<=i8?i$:i9,i6=ja;continue;}throw [0,c];}}function m6(jd,jb){var jc=jb;for(;;){if(jc){var jg=jc[4],jf=jc[1],je=db(iZ[1],jd,jc[2]),jh=0===je?1:0;if(jh)return jh;var ji=0<=je?jg:jf,jc=ji;continue;}return 0;}}function jE(jj){var jk=jj;for(;;){if(jk){var jl=jk[1];if(jl){var jk=jl;continue;}return [0,jk[2],jk[3]];}throw [0,c];}}function m7(jm){var jn=jm;for(;;){if(jn){var jo=jn[4],jp=jn[3],jq=jn[2];if(jo){var jn=jo;continue;}return [0,jq,jp];}throw [0,c];}}function jt(jr){if(jr){var js=jr[1];if(js){var jw=jr[4],jv=jr[3],ju=jr[2];return iS(jt(js),ju,jv,jw);}return jr[4];}return cl(bS);}function jJ(jC,jx){if(jx){var jy=jx[4],jz=jx[3],jA=jx[2],jB=jx[1],jD=db(iZ[1],jC,jA);if(0===jD){if(jB)if(jy){var jF=jE(jy),jH=jF[2],jG=jF[1],jI=iS(jB,jG,jH,jt(jy));}else var jI=jB;else var jI=jy;return jI;}return 0<=jD?iS(jB,jA,jz,jJ(jC,jy)):iS(jJ(jC,jB),jA,jz,jy);}return 0;}function jM(jN,jK){var jL=jK;for(;;){if(jL){var jQ=jL[4],jP=jL[3],jO=jL[2];jM(jN,jL[1]);db(jN,jO,jP);var jL=jQ;continue;}return 0;}}function jS(jT,jR){if(jR){var jX=jR[5],jW=jR[4],jV=jR[3],jU=jR[2],jY=jS(jT,jR[1]),jZ=c0(jT,jV);return [0,jY,jU,jZ,jS(jT,jW),jX];}return 0;}function j2(j3,j0){if(j0){var j1=j0[2],j6=j0[5],j5=j0[4],j4=j0[3],j7=j2(j3,j0[1]),j8=db(j3,j1,j4);return [0,j7,j1,j8,j2(j3,j5),j6];}return 0;}function kb(kc,j9,j$){var j_=j9,ka=j$;for(;;){if(j_){var kf=j_[4],ke=j_[3],kd=j_[2],kh=kg(kc,kd,ke,kb(kc,j_[1],ka)),j_=kf,ka=kh;continue;}return ka;}}function ko(kk,ki){var kj=ki;for(;;){if(kj){var kn=kj[4],km=kj[1],kl=db(kk,kj[2],kj[3]);if(kl){var kp=ko(kk,km);if(kp){var kj=kn;continue;}var kq=kp;}else var kq=kl;return kq;}return 1;}}function ky(kt,kr){var ks=kr;for(;;){if(ks){var kw=ks[4],kv=ks[1],ku=db(kt,ks[2],ks[3]);if(ku)var kx=ku;else{var kz=ky(kt,kv);if(!kz){var ks=kw;continue;}var kx=kz;}return kx;}return 0;}}function kB(kD,kC,kA){if(kA){var kG=kA[4],kF=kA[3],kE=kA[2];return iS(kB(kD,kC,kA[1]),kE,kF,kG);}return iR(kD,kC);}function kI(kK,kJ,kH){if(kH){var kN=kH[3],kM=kH[2],kL=kH[1];return iS(kL,kM,kN,kI(kK,kJ,kH[4]));}return iR(kK,kJ);}function kS(kO,kU,kT,kP){if(kO){if(kP){var kQ=kP[5],kR=kO[5],k0=kP[4],k1=kP[3],k2=kP[2],kZ=kP[1],kV=kO[4],kW=kO[3],kX=kO[2],kY=kO[1];return (kQ+2|0)<kR?iS(kY,kX,kW,kS(kV,kU,kT,kP)):(kR+2|0)<kQ?iS(kS(kO,kU,kT,kZ),k2,k1,k0):iA(kO,kU,kT,kP);}return kI(kU,kT,kO);}return kB(kU,kT,kP);}function la(k3,k4){if(k3){if(k4){var k5=jE(k4),k7=k5[2],k6=k5[1];return kS(k3,k6,k7,jt(k4));}return k3;}return k4;}function lD(k$,k_,k8,k9){return k8?kS(k$,k_,k8[1],k9):la(k$,k9);}function li(lg,lb){if(lb){var lc=lb[4],ld=lb[3],le=lb[2],lf=lb[1],lh=db(iZ[1],lg,le);if(0===lh)return [0,lf,[0,ld],lc];if(0<=lh){var lj=li(lg,lc),ll=lj[3],lk=lj[2];return [0,kS(lf,le,ld,lj[1]),lk,ll];}var lm=li(lg,lf),lo=lm[2],ln=lm[1];return [0,ln,lo,kS(lm[3],le,ld,lc)];}return bR;}function lx(ly,lp,lr){if(lp){var lq=lp[2],lv=lp[5],lu=lp[4],lt=lp[3],ls=lp[1];if(ig(lr)<=lv){var lw=li(lq,lr),lA=lw[2],lz=lw[1],lB=lx(ly,lu,lw[3]),lC=kg(ly,lq,[0,lt],lA);return lD(lx(ly,ls,lz),lq,lC,lB);}}else if(!lr)return 0;if(lr){var lE=lr[2],lI=lr[4],lH=lr[3],lG=lr[1],lF=li(lE,lp),lK=lF[2],lJ=lF[1],lL=lx(ly,lF[3],lI),lM=kg(ly,lE,lK,[0,lH]);return lD(lx(ly,lJ,lG),lE,lM,lL);}throw [0,d,bQ];}function lQ(lR,lN){if(lN){var lO=lN[3],lP=lN[2],lT=lN[4],lS=lQ(lR,lN[1]),lV=db(lR,lP,lO),lU=lQ(lR,lT);return lV?kS(lS,lP,lO,lU):la(lS,lU);}return 0;}function lZ(l0,lW){if(lW){var lX=lW[3],lY=lW[2],l2=lW[4],l1=lZ(l0,lW[1]),l3=l1[2],l4=l1[1],l6=db(l0,lY,lX),l5=lZ(l0,l2),l7=l5[2],l8=l5[1];if(l6){var l9=la(l3,l7);return [0,kS(l4,lY,lX,l8),l9];}var l_=kS(l3,lY,lX,l7);return [0,la(l4,l8),l_];}return bP;}function mf(l$,mb){var ma=l$,mc=mb;for(;;){if(ma){var md=ma[1],me=[0,ma[2],ma[3],ma[4],mc],ma=md,mc=me;continue;}return mc;}}function m8(ms,mh,mg){var mi=mf(mg,0),mj=mf(mh,0),mk=mi;for(;;){if(mj)if(mk){var mr=mk[4],mq=mk[3],mp=mk[2],mo=mj[4],mn=mj[3],mm=mj[2],ml=db(iZ[1],mj[1],mk[1]);if(0===ml){var mt=db(ms,mm,mp);if(0===mt){var mu=mf(mq,mr),mv=mf(mn,mo),mj=mv,mk=mu;continue;}var mw=mt;}else var mw=ml;}else var mw=1;else var mw=mk?-1:0;return mw;}}function m9(mJ,my,mx){var mz=mf(mx,0),mA=mf(my,0),mB=mz;for(;;){if(mA)if(mB){var mH=mB[4],mG=mB[3],mF=mB[2],mE=mA[4],mD=mA[3],mC=mA[2],mI=0===db(iZ[1],mA[1],mB[1])?1:0;if(mI){var mK=db(mJ,mC,mF);if(mK){var mL=mf(mG,mH),mM=mf(mD,mE),mA=mM,mB=mL;continue;}var mN=mK;}else var mN=mI;var mO=mN;}else var mO=0;else var mO=mB?0:1;return mO;}}function mQ(mP){if(mP){var mR=mP[1],mS=mQ(mP[4]);return (mQ(mR)+1|0)+mS|0;}return 0;}function mX(mT,mV){var mU=mT,mW=mV;for(;;){if(mW){var m0=mW[3],mZ=mW[2],mY=mW[1],m1=[0,[0,mZ,m0],mX(mU,mW[4])],mU=m1,mW=mY;continue;}return mU;}}return [0,m3,m4,m6,i4,iR,jJ,lx,m8,m9,jM,kb,ko,ky,lQ,lZ,mQ,function(m2){return mX(0,m2);},jE,m7,jE,li,m5,jS,j2];}var nr=[0,bK];function nq(m$){var na=1<=m$?m$:1,nb=dE<na?dE:na,nc=caml_create_string(nb);return [0,nc,0,nb,nc];}function ns(nd){return dB(nd[1],0,nd[2]);}function nk(ne,ng){var nf=[0,ne[3]];for(;;){if(nf[1]<(ne[2]+ng|0)){nf[1]=2*nf[1]|0;continue;}if(dE<nf[1])if((ne[2]+ng|0)<=dE)nf[1]=dE;else o(bJ);var nh=caml_create_string(nf[1]);dC(ne[1],0,nh,0,ne[2]);ne[1]=nh;ne[3]=nf[1];return 0;}}function nt(ni,nl){var nj=ni[2];if(ni[3]<=nj)nk(ni,1);ni[1].safeSet(nj,nl);ni[2]=nj+1|0;return 0;}function nu(no,nm){var nn=nm.getLen(),np=no[2]+nn|0;if(no[3]<np)nk(no,nn);dC(nm,0,no[1],no[2],nn);no[2]=np;return 0;}function ny(nv){return 0<=nv?nv:o(cx(bo,cy(nv)));}function nz(nw,nx){return ny(nw+nx|0);}var nA=c0(nz,1);function nH(nB){return dB(nB,0,nB.getLen());}function nJ(nC,nD,nF){var nE=cx(br,cx(nC,bs)),nG=cx(bq,cx(cy(nD),nE));return cl(cx(bp,cx(dA(1,nF),nG)));}function ox(nI,nL,nK){return nJ(nH(nI),nL,nK);}function oy(nM){return cl(cx(bt,cx(nH(nM),bu)));}function n6(nN,nV,nX,nZ){function nU(nO){if((nN.safeGet(nO)-48|0)<0||9<(nN.safeGet(nO)-48|0))return nO;var nP=nO+1|0;for(;;){var nQ=nN.safeGet(nP);if(48<=nQ){if(!(58<=nQ)){var nS=nP+1|0,nP=nS;continue;}var nR=0;}else if(36===nQ){var nT=nP+1|0,nR=1;}else var nR=0;if(!nR)var nT=nO;return nT;}}var nW=nU(nV+1|0),nY=nq((nX-nW|0)+10|0);nt(nY,37);var n0=nW,n1=dj(nZ);for(;;){if(n0<=nX){var n2=nN.safeGet(n0);if(42===n2){if(n1){var n3=n1[2];nu(nY,cy(n1[1]));var n4=nU(n0+1|0),n0=n4,n1=n3;continue;}throw [0,d,bv];}nt(nY,n2);var n5=n0+1|0,n0=n5;continue;}return ns(nY);}}function pY(oa,n_,n9,n8,n7){var n$=n6(n_,n9,n8,n7);if(78!==oa&&110!==oa)return n$;n$.safeSet(n$.getLen()-1|0,117);return n$;}function oz(oh,or,ov,ob,ou){var oc=ob.getLen();function os(od,oq){var oe=40===od?41:125;function op(of){var og=of;for(;;){if(oc<=og)return c0(oh,ob);if(37===ob.safeGet(og)){var oi=og+1|0;if(oc<=oi)var oj=c0(oh,ob);else{var ok=ob.safeGet(oi),ol=ok-40|0;if(ol<0||1<ol){var om=ol-83|0;if(om<0||2<om)var on=1;else switch(om){case 1:var on=1;break;case 2:var oo=1,on=0;break;default:var oo=0,on=0;}if(on){var oj=op(oi+1|0),oo=2;}}else var oo=0===ol?0:1;switch(oo){case 1:var oj=ok===oe?oi+1|0:kg(or,ob,oq,ok);break;case 2:break;default:var oj=op(os(ok,oi+1|0)+1|0);}}return oj;}var ot=og+1|0,og=ot;continue;}}return op(oq);}return os(ov,ou);}function oY(ow){return kg(oz,oy,ox,ow);}function pc(oA,oL,oV){var oB=oA.getLen()-1|0;function oW(oC){var oD=oC;a:for(;;){if(oD<oB){if(37===oA.safeGet(oD)){var oE=0,oF=oD+1|0;for(;;){if(oB<oF)var oG=oy(oA);else{var oH=oA.safeGet(oF);if(58<=oH){if(95===oH){var oJ=oF+1|0,oI=1,oE=oI,oF=oJ;continue;}}else if(32<=oH)switch(oH-32|0){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 0:case 3:case 11:case 13:var oK=oF+1|0,oF=oK;continue;case 10:var oM=kg(oL,oE,oF,105),oF=oM;continue;default:var oN=oF+1|0,oF=oN;continue;}var oO=oF;c:for(;;){if(oB<oO)var oP=oy(oA);else{var oQ=oA.safeGet(oO);if(126<=oQ)var oR=0;else switch(oQ){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var oP=kg(oL,oE,oO,105),oR=1;break;case 69:case 70:case 71:case 101:case 102:case 103:var oP=kg(oL,oE,oO,102),oR=1;break;case 33:case 37:case 44:case 64:var oP=oO+1|0,oR=1;break;case 83:case 91:case 115:var oP=kg(oL,oE,oO,115),oR=1;break;case 97:case 114:case 116:var oP=kg(oL,oE,oO,oQ),oR=1;break;case 76:case 108:case 110:var oS=oO+1|0;if(oB<oS){var oP=kg(oL,oE,oO,105),oR=1;}else{var oT=oA.safeGet(oS)-88|0;if(oT<0||32<oT)var oU=1;else switch(oT){case 0:case 12:case 17:case 23:case 29:case 32:var oP=db(oV,kg(oL,oE,oO,oQ),105),oR=1,oU=0;break;default:var oU=1;}if(oU){var oP=kg(oL,oE,oO,105),oR=1;}}break;case 67:case 99:var oP=kg(oL,oE,oO,99),oR=1;break;case 66:case 98:var oP=kg(oL,oE,oO,66),oR=1;break;case 41:case 125:var oP=kg(oL,oE,oO,oQ),oR=1;break;case 40:var oP=oW(kg(oL,oE,oO,oQ)),oR=1;break;case 123:var oX=kg(oL,oE,oO,oQ),oZ=kg(oY,oQ,oA,oX),o0=oX;for(;;){if(o0<(oZ-2|0)){var o1=db(oV,o0,oA.safeGet(o0)),o0=o1;continue;}var o2=oZ-1|0,oO=o2;continue c;}default:var oR=0;}if(!oR)var oP=ox(oA,oO,oQ);}var oG=oP;break;}}var oD=oG;continue a;}}var o3=oD+1|0,oD=o3;continue;}return oD;}}oW(0);return 0;}function rb(pd){var o4=[0,0,0,0];function pb(o9,o_,o5){var o6=41!==o5?1:0,o7=o6?125!==o5?1:0:o6;if(o7){var o8=97===o5?2:1;if(114===o5)o4[3]=o4[3]+1|0;if(o9)o4[2]=o4[2]+o8|0;else o4[1]=o4[1]+o8|0;}return o_+1|0;}pc(pd,pb,function(o$,pa){return o$+1|0;});return o4[1];}function pU(pe,ph,pf){var pg=pe.safeGet(pf);if((pg-48|0)<0||9<(pg-48|0))return db(ph,0,pf);var pi=pg-48|0,pj=pf+1|0;for(;;){var pk=pe.safeGet(pj);if(48<=pk){if(!(58<=pk)){var pn=pj+1|0,pm=(10*pi|0)+(pk-48|0)|0,pi=pm,pj=pn;continue;}var pl=0;}else if(36===pk)if(0===pi){var po=o(bx),pl=1;}else{var po=db(ph,[0,ny(pi-1|0)],pj+1|0),pl=1;}else var pl=0;if(!pl)var po=db(ph,0,pf);return po;}}function pP(pp,pq){return pp?pq:c0(nA,pq);}function pE(pr,ps){return pr?pr[1]:ps;}function sy(rw,pu,rI,px,rg,rO,pt){var pv=c0(pu,pt);function rx(pw){return db(px,pv,pw);}function rf(pC,rN,py,pH){var pB=py.getLen();function rc(rF,pz){var pA=pz;for(;;){if(pB<=pA)return c0(pC,pv);var pD=py.safeGet(pA);if(37===pD){var pL=function(pG,pF){return caml_array_get(pH,pE(pG,pF));},pR=function(pT,pM,pO,pI){var pJ=pI;for(;;){var pK=py.safeGet(pJ)-32|0;if(!(pK<0||25<pK))switch(pK){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 10:return pU(py,function(pN,pS){var pQ=[0,pL(pN,pM),pO];return pR(pT,pP(pN,pM),pQ,pS);},pJ+1|0);default:var pV=pJ+1|0,pJ=pV;continue;}var pW=py.safeGet(pJ);if(124<=pW)var pX=0;else switch(pW){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var pZ=pL(pT,pM),p0=caml_format_int(pY(pW,py,pA,pJ,pO),pZ),p2=p1(pP(pT,pM),p0,pJ+1|0),pX=1;break;case 69:case 71:case 101:case 102:case 103:var p3=pL(pT,pM),p4=caml_format_float(n6(py,pA,pJ,pO),p3),p2=p1(pP(pT,pM),p4,pJ+1|0),pX=1;break;case 76:case 108:case 110:var p5=py.safeGet(pJ+1|0)-88|0;if(p5<0||32<p5)var p6=1;else switch(p5){case 0:case 12:case 17:case 23:case 29:case 32:var p7=pJ+1|0,p8=pW-108|0;if(p8<0||2<p8)var p9=0;else{switch(p8){case 1:var p9=0,p_=0;break;case 2:var p$=pL(pT,pM),qa=caml_format_int(n6(py,pA,p7,pO),p$),p_=1;break;default:var qb=pL(pT,pM),qa=caml_format_int(n6(py,pA,p7,pO),qb),p_=1;}if(p_){var qc=qa,p9=1;}}if(!p9){var qd=pL(pT,pM),qc=caml_int64_format(n6(py,pA,p7,pO),qd);}var p2=p1(pP(pT,pM),qc,p7+1|0),pX=1,p6=0;break;default:var p6=1;}if(p6){var qe=pL(pT,pM),qf=caml_format_int(pY(110,py,pA,pJ,pO),qe),p2=p1(pP(pT,pM),qf,pJ+1|0),pX=1;}break;case 37:case 64:var p2=p1(pM,dA(1,pW),pJ+1|0),pX=1;break;case 83:case 115:var qg=pL(pT,pM);if(115===pW)var qh=qg;else{var qi=[0,0],qj=0,qk=qg.getLen()-1|0;if(!(qk<qj)){var ql=qj;for(;;){var qm=qg.safeGet(ql),qn=14<=qm?34===qm?1:92===qm?1:0:11<=qm?13<=qm?1:0:8<=qm?1:0,qo=qn?2:caml_is_printable(qm)?1:4;qi[1]=qi[1]+qo|0;var qp=ql+1|0;if(qk!==ql){var ql=qp;continue;}break;}}if(qi[1]===qg.getLen())var qq=qg;else{var qr=caml_create_string(qi[1]);qi[1]=0;var qs=0,qt=qg.getLen()-1|0;if(!(qt<qs)){var qu=qs;for(;;){var qv=qg.safeGet(qu),qw=qv-34|0;if(qw<0||58<qw)if(-20<=qw)var qx=1;else{switch(qw+34|0){case 8:qr.safeSet(qi[1],92);qi[1]+=1;qr.safeSet(qi[1],98);var qy=1;break;case 9:qr.safeSet(qi[1],92);qi[1]+=1;qr.safeSet(qi[1],116);var qy=1;break;case 10:qr.safeSet(qi[1],92);qi[1]+=1;qr.safeSet(qi[1],110);var qy=1;break;case 13:qr.safeSet(qi[1],92);qi[1]+=1;qr.safeSet(qi[1],114);var qy=1;break;default:var qx=1,qy=0;}if(qy)var qx=0;}else var qx=(qw-1|0)<0||56<(qw-1|0)?(qr.safeSet(qi[1],92),qi[1]+=1,qr.safeSet(qi[1],qv),0):1;if(qx)if(caml_is_printable(qv))qr.safeSet(qi[1],qv);else{qr.safeSet(qi[1],92);qi[1]+=1;qr.safeSet(qi[1],48+(qv/100|0)|0);qi[1]+=1;qr.safeSet(qi[1],48+((qv/10|0)%10|0)|0);qi[1]+=1;qr.safeSet(qi[1],48+(qv%10|0)|0);}qi[1]+=1;var qz=qu+1|0;if(qt!==qu){var qu=qz;continue;}break;}}var qq=qr;}var qh=cx(bE,cx(qq,bF));}if(pJ===(pA+1|0))var qA=qh;else{var qB=n6(py,pA,pJ,pO);try {var qC=0,qD=1;for(;;){if(qB.getLen()<=qD)var qE=[0,0,qC];else{var qF=qB.safeGet(qD);if(49<=qF)if(58<=qF)var qG=0;else{var qE=[0,caml_int_of_string(dB(qB,qD,(qB.getLen()-qD|0)-1|0)),qC],qG=1;}else{if(45===qF){var qI=qD+1|0,qH=1,qC=qH,qD=qI;continue;}var qG=0;}if(!qG){var qJ=qD+1|0,qD=qJ;continue;}}var qK=qE;break;}}catch(qL){if(qL[1]!==a)throw qL;var qK=nJ(qB,0,115);}var qM=qK[1],qN=qh.getLen(),qO=0,qS=qK[2],qR=32;if(qM===qN&&0===qO){var qP=qh,qQ=1;}else var qQ=0;if(!qQ)if(qM<=qN)var qP=dB(qh,qO,qN);else{var qT=dA(qM,qR);if(qS)dC(qh,qO,qT,0,qN);else dC(qh,qO,qT,qM-qN|0,qN);var qP=qT;}var qA=qP;}var p2=p1(pP(pT,pM),qA,pJ+1|0),pX=1;break;case 67:case 99:var qU=pL(pT,pM);if(99===pW)var qV=dA(1,qU);else{if(39===qU)var qW=b6;else if(92===qU)var qW=b7;else{if(14<=qU)var qX=0;else switch(qU){case 8:var qW=b$,qX=1;break;case 9:var qW=b_,qX=1;break;case 10:var qW=b9,qX=1;break;case 13:var qW=b8,qX=1;break;default:var qX=0;}if(!qX)if(caml_is_printable(qU)){var qY=caml_create_string(1);qY.safeSet(0,qU);var qW=qY;}else{var qZ=caml_create_string(4);qZ.safeSet(0,92);qZ.safeSet(1,48+(qU/100|0)|0);qZ.safeSet(2,48+((qU/10|0)%10|0)|0);qZ.safeSet(3,48+(qU%10|0)|0);var qW=qZ;}}var qV=cx(bC,cx(qW,bD));}var p2=p1(pP(pT,pM),qV,pJ+1|0),pX=1;break;case 66:case 98:var q1=pJ+1|0,q0=pL(pT,pM)?cd:cc,p2=p1(pP(pT,pM),q0,q1),pX=1;break;case 40:case 123:var q2=pL(pT,pM),q3=kg(oY,pW,py,pJ+1|0);if(123===pW){var q4=nq(q2.getLen()),q8=function(q6,q5){nt(q4,q5);return q6+1|0;};pc(q2,function(q7,q_,q9){if(q7)nu(q4,bw);else nt(q4,37);return q8(q_,q9);},q8);var q$=ns(q4),p2=p1(pP(pT,pM),q$,q3),pX=1;}else{var ra=pP(pT,pM),rd=nz(rb(q2),ra),p2=rf(function(re){return rc(rd,q3);},ra,q2,pH),pX=1;}break;case 33:c0(rg,pv);var p2=rc(pM,pJ+1|0),pX=1;break;case 41:var p2=p1(pM,bI,pJ+1|0),pX=1;break;case 44:var p2=p1(pM,bH,pJ+1|0),pX=1;break;case 70:var rh=pL(pT,pM);if(0===pO)var ri=bG;else{var rj=n6(py,pA,pJ,pO);if(70===pW)rj.safeSet(rj.getLen()-1|0,103);var ri=rj;}var rk=caml_classify_float(rh);if(3===rk)var rl=rh<0?bA:bz;else if(4<=rk)var rl=bB;else{var rm=caml_format_float(ri,rh),rn=0,ro=rm.getLen();for(;;){if(ro<=rn)var rp=cx(rm,by);else{var rq=rm.safeGet(rn)-46|0,rr=rq<0||23<rq?55===rq?1:0:(rq-1|0)<0||21<(rq-1|0)?1:0;if(!rr){var rs=rn+1|0,rn=rs;continue;}var rp=rm;}var rl=rp;break;}}var p2=p1(pP(pT,pM),rl,pJ+1|0),pX=1;break;case 91:var p2=ox(py,pJ,pW),pX=1;break;case 97:var rt=pL(pT,pM),ru=c0(nA,pE(pT,pM)),rv=pL(0,ru),rz=pJ+1|0,ry=pP(pT,ru);if(rw)rx(db(rt,0,rv));else db(rt,pv,rv);var p2=rc(ry,rz),pX=1;break;case 114:var p2=ox(py,pJ,pW),pX=1;break;case 116:var rA=pL(pT,pM),rC=pJ+1|0,rB=pP(pT,pM);if(rw)rx(c0(rA,0));else c0(rA,pv);var p2=rc(rB,rC),pX=1;break;default:var pX=0;}if(!pX)var p2=ox(py,pJ,pW);return p2;}},rH=pA+1|0,rE=0;return pU(py,function(rG,rD){return pR(rG,rF,rE,rD);},rH);}db(rI,pv,pD);var rJ=pA+1|0,pA=rJ;continue;}}function p1(rM,rK,rL){rx(rK);return rc(rM,rL);}return rc(rN,0);}var rP=db(rf,rO,ny(0)),rQ=rb(pt);if(rQ<0||6<rQ){var r3=function(rR,rX){if(rQ<=rR){var rS=caml_make_vect(rQ,0),rV=function(rT,rU){return caml_array_set(rS,(rQ-rT|0)-1|0,rU);},rW=0,rY=rX;for(;;){if(rY){var rZ=rY[2],r0=rY[1];if(rZ){rV(rW,r0);var r1=rW+1|0,rW=r1,rY=rZ;continue;}rV(rW,r0);}return db(rP,pt,rS);}}return function(r2){return r3(rR+1|0,[0,r2,rX]);};},r4=r3(0,0);}else switch(rQ){case 1:var r4=function(r6){var r5=caml_make_vect(1,0);caml_array_set(r5,0,r6);return db(rP,pt,r5);};break;case 2:var r4=function(r8,r9){var r7=caml_make_vect(2,0);caml_array_set(r7,0,r8);caml_array_set(r7,1,r9);return db(rP,pt,r7);};break;case 3:var r4=function(r$,sa,sb){var r_=caml_make_vect(3,0);caml_array_set(r_,0,r$);caml_array_set(r_,1,sa);caml_array_set(r_,2,sb);return db(rP,pt,r_);};break;case 4:var r4=function(sd,se,sf,sg){var sc=caml_make_vect(4,0);caml_array_set(sc,0,sd);caml_array_set(sc,1,se);caml_array_set(sc,2,sf);caml_array_set(sc,3,sg);return db(rP,pt,sc);};break;case 5:var r4=function(si,sj,sk,sl,sm){var sh=caml_make_vect(5,0);caml_array_set(sh,0,si);caml_array_set(sh,1,sj);caml_array_set(sh,2,sk);caml_array_set(sh,3,sl);caml_array_set(sh,4,sm);return db(rP,pt,sh);};break;case 6:var r4=function(so,sp,sq,sr,ss,st){var sn=caml_make_vect(6,0);caml_array_set(sn,0,so);caml_array_set(sn,1,sp);caml_array_set(sn,2,sq);caml_array_set(sn,3,sr);caml_array_set(sn,4,ss);caml_array_set(sn,5,st);return db(rP,pt,sn);};break;default:var r4=db(rP,pt,[0]);}return r4;}function sM(sv){function sx(su){return 0;}return sz(sy,0,function(sw){return sv;},cL,cH,cS,sx);}function sI(sA){return nq(2*sA.getLen()|0);}function sF(sD,sB){var sC=ns(sB);sB[2]=0;return c0(sD,sC);}function sL(sE){var sH=c0(sF,sE);return sz(sy,1,sI,nt,nu,function(sG){return 0;},sH);}function sN(sK){return db(sL,function(sJ){return sJ;},sK);}var sO=[0,0];function s2(sP,sQ){var sR=sP[sQ+1];if(caml_obj_is_block(sR)){if(caml_obj_tag(sR)===dM)return db(sN,a4,sR);if(caml_obj_tag(sR)===dL){var sS=caml_format_float(cg,sR),sT=0,sU=sS.getLen();for(;;){if(sU<=sT)var sV=cx(sS,cf);else{var sW=sS.safeGet(sT),sX=48<=sW?58<=sW?0:1:45===sW?1:0;if(sX){var sY=sT+1|0,sT=sY;continue;}var sV=sS;}return sV;}}return a3;}return db(sN,a5,sR);}function s1(sZ,s0){if(sZ.length-1<=s0)return bn;var s3=s1(sZ,s0+1|0);return kg(sN,bm,s2(sZ,s0),s3);}function tw(s5){var s4=sO[1];for(;;){if(s4){var s_=s4[2],s6=s4[1];try {var s7=c0(s6,s5),s8=s7;}catch(s$){var s8=0;}if(!s8){var s4=s_;continue;}var s9=s8[1];}else if(s5[1]===ck)var s9=bc;else if(s5[1]===ci)var s9=bb;else if(s5[1]===cj){var ta=s5[2],tb=ta[3],s9=sz(sN,g,ta[1],ta[2],tb,tb+5|0,ba);}else if(s5[1]===d){var tc=s5[2],td=tc[3],s9=sz(sN,g,tc[1],tc[2],td,td+6|0,a$);}else if(s5[1]===ch){var te=s5[2],tf=te[3],s9=sz(sN,g,te[1],te[2],tf,tf+6|0,a_);}else{var tg=s5.length-1,tj=s5[0+1][0+1];if(tg<0||2<tg){var th=s1(s5,2),ti=kg(sN,a9,s2(s5,1),th);}else switch(tg){case 1:var ti=a7;break;case 2:var ti=db(sN,a6,s2(s5,1));break;default:var ti=a8;}var s9=cx(tj,ti);}return s9;}}function tx(tt){var tk=caml_convert_raw_backtrace(caml_get_exception_raw_backtrace(0));if(tk){var tl=tk[1],tm=0,tn=tl.length-1-1|0;if(!(tn<tm)){var to=tm;for(;;){if(caml_notequal(caml_array_get(tl,to),bl)){var tp=caml_array_get(tl,to),tq=0===tp[0]?tp[1]:tp[1],tr=tq?0===to?bi:bh:0===to?bg:bf,ts=0===tp[0]?sz(sN,be,tr,tp[2],tp[3],tp[4],tp[5]):db(sN,bd,tr);kg(sM,tt,bk,ts);}var tu=to+1|0;if(tn!==to){var to=tu;continue;}break;}}var tv=0;}else var tv=db(sM,tt,bj);return tv;}32===dD;function tA(tz){var ty=[];caml_update_dummy(ty,[0,ty,ty]);return ty;}var tB=[0,aX],tE=42,tF=[0,m_([0,function(tD,tC){return caml_compare(tD,tC);}])[1]];function tJ(tG){var tH=tG[1];{if(3===tH[0]){var tI=tH[1],tK=tJ(tI);if(tK!==tI)tG[1]=[3,tK];return tK;}return tG;}}function tN(tL){return tJ(tL);}var tO=[0,function(tM){tw(tM);caml_ml_output_char(cz,10);tx(cz);cG(0);return caml_sys_exit(2);}];function uc(tQ,tP){try {var tR=c0(tQ,tP);}catch(tS){return c0(tO[1],tS);}return tR;}function t3(tX,tT,tV){var tU=tT,tW=tV;for(;;)if(typeof tU==="number")return tY(tX,tW);else switch(tU[0]){case 1:c0(tU[1],tX);return tY(tX,tW);case 2:var tZ=tU[1],t0=[0,tU[2],tW],tU=tZ,tW=t0;continue;default:var t1=tU[1][1];return t1?(c0(t1[1],tX),tY(tX,tW)):tY(tX,tW);}}function tY(t4,t2){return t2?t3(t4,t2[1],t2[2]):0;}function ue(t5,t7){var t6=t5,t8=t7;for(;;)if(typeof t6==="number")return t_(t8);else switch(t6[0]){case 1:var t9=t6[1];if(t9[4]){t9[4]=0;t9[1][2]=t9[2];t9[2][1]=t9[1];}return t_(t8);case 2:var t$=t6[1],ua=[0,t6[2],t8],t6=t$,t8=ua;continue;default:var ub=t6[2];tF[1]=t6[1];uc(ub,0);return t_(t8);}}function t_(ud){return ud?ue(ud[1],ud[2]):0;}function ui(ug,uf){var uh=1===uf[0]?uf[1][1]===tB?(ue(ug[4],0),1):0:0;return t3(uf,ug[2],0);}var uj=[0,0],uk=[0,0,0];function uH(un,ul){var um=[0,ul],uo=tJ(un),up=uo[1];switch(up[0]){case 1:if(up[1][1]===tB){var uq=0,ur=1;}else var ur=0;break;case 2:var us=up[1];uo[1]=um;var ut=tF[1],uu=uj[1]?1:(uj[1]=1,0);ui(us,um);if(uu){tF[1]=ut;var uv=0;}else for(;;){if(0!==uk[1]){if(0===uk[1])throw [0,nr];uk[1]=uk[1]-1|0;var uw=uk[2],ux=uw[2];if(ux===uw)uk[2]=0;else uw[2]=ux[2];var uy=ux[1];ui(uy[1],uy[2]);continue;}uj[1]=0;tF[1]=ut;var uv=0;break;}var uq=uv,ur=1;break;default:var ur=0;}if(!ur)var uq=cl(aY);return uq;}function uF(uz,uA){return typeof uz==="number"?uA:typeof uA==="number"?uz:[2,uz,uA];}function uC(uB){if(typeof uB!=="number")switch(uB[0]){case 2:var uD=uB[1],uE=uC(uB[2]);return uF(uC(uD),uE);case 1:break;default:if(!uB[1][1])return 0;}return uB;}var uJ=[0,function(uG){return 0;}],uI=tA(0),uM=[0,0],uR=null,uS=Array;function uW(uQ){var uK=1-(uI[2]===uI?1:0);if(uK){var uL=tA(0);uL[1][2]=uI[2];uI[2][1]=uL[1];uL[1]=uI[1];uI[1][2]=uL;uI[1]=uI;uI[2]=uI;uM[1]=0;var uN=uL[2];for(;;){var uO=uN!==uL?1:0;if(uO){if(uN[4])uH(uN[3],0);var uP=uN[2],uN=uP;continue;}return uO;}}return uK;}var uV=undefined,uU=false;function uX(uT){return uT instanceof uS?0:[0,new MlWrappedString(uT.toString())];}sO[1]=[0,uX,sO[1]];function u0(uY,uZ){uY.appendChild(uZ);return 0;}var u1=this,u2=u1.document;function u_(u3,u4){return u3?c0(u4,u3[1]):0;}function u7(u6,u5){return u6.createElement(u5.toString());}function u$(u9,u8){return u7(u9,u8);}var va=[0,785140586];function vc(vb){return u$(vb,aM);}this.HTMLElement===uV;var vd=2147483,vf=caml_js_get_console(0);uJ[1]=function(ve){return 1===ve?(u1.setTimeout(caml_js_wrap_callback(uW),0),0):0;};function vh(vg){return vf.log(vg.toString());}tO[1]=function(vi){vh(aG);vh(tw(vi));return tx(cz);};function vl(vk,vj){return 0===vj?1003109192:1===vj?vk:[0,748545537,[0,vk,vl(vk,vj-1|0)]];}var vO=aC.slice(),vN=[0,257,258,0],vM=303;function vP(vm){throw [0,dN,d2(vm,0)];}function vQ(vn){throw [0,dN,d2(vn,0)];}function vR(vo){return 3901498;}function vS(vp){return -941236332;}function vT(vq){return 15949;}function vU(vr){return 17064;}function vV(vs){return 3553395;}function vW(vt){return 3802040;}function vX(vu){return 15500;}function vY(vv){return d2(vv,1);}function vZ(vw){return [0,926224370,d2(vw,1)];}function v0(vx){return [0,974443759,[0,19065,[0,926224370,d2(vx,1)]]];}function v1(vy){var vz=d2(vy,2);return [0,748545537,[0,vz,d2(vy,0)]];}function v2(vA){var vB=d2(vA,2);return [0,-783405316,[0,vB,d2(vA,0)]];}function v3(vC){var vD=d2(vC,2);return [0,974443759,[0,vD,d2(vC,0)]];}function v4(vE){var vF=d2(vE,1);return vl(vF,d2(vE,0));}function v5(vG){var vH=d2(vG,0);return caml_string_equal(vH,aE)?19065:caml_string_equal(vH,aD)?1003109192:[0,4298439,vH];}function v6(vI){var vJ=d2(vI,2),vK=d2(vI,1);return [0,vK,vJ,d2(vI,0)];}var v7=[0,[0,function(vL){return o(aF);},v6,v5,v4,v3,v2,v1,v0,vZ,vY,vX,vW,vV,vU,vT,vS,vR,vQ,vP],vO,vN,aB,aA,az,ay,ax,aw,av,vM,au,at,id,as,ar];function we(v9){var v8=0;for(;;){var v_=dK(i,v8,v9);if(v_<0||20<v_){c0(v9[1],v9);var v8=v_;continue;}switch(v_){case 1:var wa=v$(v9);break;case 2:var wa=1;break;case 3:var wb=v9[5],wc=v9[6]-wb|0,wd=caml_create_string(wc);caml_blit_string(v9[2],wb,wd,0,wc);var wa=[0,wd];break;case 4:var wa=7;break;case 5:var wa=6;break;case 6:var wa=4;break;case 7:var wa=5;break;case 8:var wa=8;break;case 9:var wa=2;break;case 10:var wa=3;break;case 11:var wa=15;break;case 12:var wa=16;break;case 13:var wa=10;break;case 14:var wa=12;break;case 15:var wa=13;break;case 16:var wa=14;break;case 17:var wa=11;break;case 18:var wa=9;break;case 19:var wa=0;break;case 20:var wa=o(cx(aq,dA(1,v9[2].safeGet(v9[5]))));break;default:var wa=we(v9);}return wa;}}function v$(wg){var wf=25;for(;;){var wh=dK(i,wf,wg);if(wh<0||2<wh){c0(wg[1],wg);var wf=wh;continue;}switch(wh){case 1:var wi=0;break;case 2:var wi=v$(wg);break;default:var wi=1;}return wi;}}function wm(wj){if(typeof wj==="number")return 1003109192<=wj?ap:ao;var wk=wj[1];if(748545537<=wk){if(926224370<=wk){if(974443759<=wk){var wl=wj[2],wn=wm(wl[2]);return kg(sN,an,wm(wl[1]),wn);}return db(sN,am,wm(wj[2]));}if(748545556<=wk)return db(sN,al,wm(wj[2]));var wo=wj[2],wp=wm(wo[2]);return kg(sN,ak,wm(wo[1]),wp);}if(4298439<=wk)return wj[2];var wq=wj[2],wr=wm(wq[2]);return kg(sN,aj,wm(wq[1]),wr);}var wu=[0,function(wt,ws){return caml_compare(wt,ws);}],wv=m_(wu),ww=ic(wu);function wz(wy,wx){return caml_compare(wy,wx);}var wA=ic([0,c0(wv[8],wz)]),wB=ic([0,ww[10]]),wC=m_([0,ww[10]]);function wL(wI,wF,wE,wD){try {var wG=db(wF,wE,wD);}catch(wH){if(wH[1]===c)return wI;throw wH;}return wG;}var wM=ic([0,function(wK,wJ){return caml_compare(wK,wJ);}]),wP=ic([0,function(wO,wN){return caml_compare(wO,wN);}]);function w1(wU){var wS=ww[1];function wT(wQ,wR){return c0(ww[4],wQ);}return kg(wv[11],wT,wU,wS);}function w2(w0,wV){function wZ(wW){try {var wX=db(wv[22],wW,wV);}catch(wY){if(wY[1]===c)return wW;throw wY;}return wX;}return db(wv[23],wZ,w0);}var w3=[0,ai];function yL(w4,w5){try {var w6=db(wv[22],w5,w4);}catch(w7){if(w7[1]===c)return w5;throw w7;}return w6;}function yM(xb,xa,xe){var xc=wP[1];function xd(w8){var w9=w8[3],w_=w8[2],w$=w8[1];return db(ww[3],w9,xa)?c0(wP[4],[0,w$,w_,xb]):c0(wP[4],[0,w$,w_,w9]);}return kg(wP[14],xd,xe,xc);}function yN(xf){var xk=xf[1],xj=xf[2];function xl(xg,xh){var xi=cm(xg[3],xh);return cm(xg[1],xi);}return 1+kg(wP[14],xl,xj,xk)|0;}function yA(xm){return [0,-783405316,[0,xm[1],xm[2]]];}function yK(xn){return [0,748545537,[0,xn[1],xn[2]]];}function xG(xp,xo){return wL(ww[1],wv[22],xp,xo);}function yE(xq){var xr=xq[3],xs=xq[2],xt=xq[1],xx=ww[1];function xy(xu,xv){var xw=db(ww[4],xu[3],xv);return db(ww[4],xu[1],xw);}var xz=kg(wP[14],xy,xs,xx),xC=wv[1];function xD(xA){var xB=c0(ww[5],xA);return db(wv[4],xA,xB);}var xK=kg(ww[14],xD,xz,xC);function xL(xE,xH){var xF=xE[1],xI=xG(xF,xH),xJ=db(ww[4],xE[3],xI);return kg(wv[4],xF,xJ,xH);}var xM=kg(wP[14],xL,xs,xK);for(;;){var xY=wv[1],xZ=function(xM){return function(xX,xU,xW){function xT(xN,xS){var xQ=xG(xN,xM);function xR(xP,xO){return db(ww[4],xP,xO);}return kg(ww[14],xR,xQ,xS);}var xV=kg(ww[14],xT,xU,xU);return kg(wv[4],xX,xV,xW);};}(xM),x0=kg(wv[11],xZ,xM,xY);if(kg(wv[9],ww[11],x0,xM)){if(xt===xr)return o(ah);var x2=function(x1){return x1[1]===xt?1:0;},x3=db(wP[17],x2,xs),x4=c0(wP[20],x3);if(x4){var x5=x4[2],x6=x4[1],x7=x6[3],x8=x6[2];if(x5){var ya=xG(x7,xM),yd=dl(function(x$,x9){var x_=xG(x9[3],xM);return db(ww[8],x$,x_);},ya,x5),ye=function(yc){var yb=xG(xr,xM);return 1-db(ww[3],yc,yb);},yf=db(ww[17],ye,yd);if(c0(ww[2],yf)){var yg=0,yh=0,yi=[0,[0,xt,x8,x7],x5];for(;;){if(yi){var yj=yi[2],yk=yi[1],yl=yk[3],ym=xG(yl,xM),yn=xG(x7,xM),yo=db(ww[8],yn,ym);if(x7===yl&&c0(ww[2],yo))throw [0,d,ad];var yr=function(yq){var yp=xG(xr,xM);return 1-db(ww[3],yq,yp);};if(db(ww[16],yr,yo)){var ys=[0,yk,yg],yg=ys,yi=yj;continue;}var yt=[0,yk,yh],yh=yt,yi=yj;continue;}var yu=dj(yh),yv=dj(yg);if(0===yu)throw [0,d,ag];if(0===yv){if(yu){var yw=yu[2],yx=yu[1][2];if(yw){var yB=[0,4298439,yx];return dl(function(yz,yy){return yA([0,yz,[0,4298439,yy[2]]]);},yB,yw);}return [0,4298439,yx];}return o(af);}var yD=function(yC){return 1-dm(yC,yu);},yG=yE([0,xt,db(wP[17],yD,xs),xr]),yH=function(yF){return 1-dm(yF,yv);};return yA([0,yE([0,xt,db(wP[17],yH,xs),xr]),yG]);}}var yI=c0(ww[23],yf),yJ=yE([0,yI,xs,xr]);return yK([0,yE([0,xt,xs,yI]),yJ]);}return x7===xr?[0,4298439,x8]:yK([0,[0,4298439,x8],yE([0,x7,xs,xr])]);}return o(ae);}var xM=x0;continue;}}function BX(yR,yO,yP){if(yO){if(yP)return o(_);var yQ=yO[1];}else{if(!yP)return yP;var yQ=yP[1];}return [0,yQ];}function y4(yW,yS,yU){if(yS){var yT=yS[1];if(yU)return [0,cu(yT,yU[1])];var yV=yT;}else{if(!yU)return yU;var yV=yU[1];}return [0,yV];}function B0(y1,yX,yZ){if(yX){var yY=yX[1];if(yZ)return [0,db(wM[7],yY,yZ[1])];var y0=yY;}else{if(!yZ)return yZ;var y0=yZ[1];}return [0,y0];}function Al(y3,y2){return kg(wC[7],y4,y3,y2);}function zA(zp){var zo=ww[1],zq=db(dl,function(y7,y5){var y6=y5[1],y9=db(ww[7],y7,y5[2]),y8=y6[2],zd=y6[1],zc=ww[1];function ze(zb,za){function y$(y_){return c0(ww[4],y_[2]);}return db(wM[14],y$,za);}var zf=kg(wv[11],ze,y8,zc),zg=w1(y8),zl=db(ww[7],zg,zf);function zm(zk,zi,zh){var zj=db(ww[4],zi,zh);return db(ww[4],zk,zj);}var zn=kg(wv[11],zm,zd,zl);return db(ww[7],zn,y9);},zo),zr=c0(ww[5],zp[1]),zs=kg(wB[14],ww[7],zp[3],zr),zy=zp[2];function zz(zu,zv,zt){var zw=db(ww[7],zu,zt),zx=c0(zq,zv);return db(ww[7],zx,zw);}return kg(wC[11],zz,zy,zs);}function Aa(zC,zB){var zD=zA(zB),zE=zA(zC),zF=db(ww[8],zE,zD);return c0(ww[2],zF);}function Au(zZ,zG,zI){var zH=c0(ww[5],zG),zL=db(wC[22],zH,zI),zM=c2(function(zJ){var zK=zJ[2];return [0,db(wv[22],zG,zJ[1][2]),zK];},zL),zX=wC[1];function zY(zN,zW){var zO=c0(ww[23],zN),zQ=wv[1];function zR(zP){return db(wv[4],zP,zO);}var zU=kg(ww[14],zR,zN,zQ),zV=c2(function(zS){var zT=zS[2];return [0,[0,zU,db(wv[5],zO,zS[1])],zT];},zM);return kg(wC[4],zN,zV,zW);}return kg(wB[14],zY,zZ,zX);}function z3(z4,z0){if(typeof z0!=="number"){var z1=z0[1];if(!(748545537<=z1)){if(4298439<=z1){var AI=c0(ww[5],z4),AJ=c0(ww[5],z4+1|0),AK=db(wv[5],z4,z4),AL=c0(wM[5],[0,z0[2],z4+1|0]),AM=[0,[0,[0,AK,db(wv[5],z4,AL)],AJ],0],AN=db(wC[5],AI,AM);return [0,[0,z4,AN,c0(wB[5],AJ)],z4+2|0];}var AO=z0[2],AP=z3(z4,AO[1]),AQ=z3(AP[2],AO[2]),AR=AQ[1],AS=AP[1],AT=AR[3],AU=AR[2],AV=AR[1],AW=AS[3],AX=AS[2],AY=AS[1],AZ=AQ[2];if(Aa(AS,AR)){var A4=wB[1],A5=function(A1){function A3(A0){var A2=db(ww[7],A1,A0);return c0(wB[4],A2);}return db(wB[14],A3,AT);},A6=kg(wB[14],A5,AW,A4),A7=db(wv[5],AY,AY),A8=c0(ww[5],AY),A9=db(wC[22],A8,AX),A_=c0(ww[5],AV),Bh=db(wC[22],A_,AU),Bj=0,Bk=dl(function(Bi,A$){var Ba=A$[2],Be=db(wv[22],AY,A$[1][2]);return dl(function(Bg,Bb){var Bc=db(wv[22],AV,Bb[1][2]),Bd=db(ww[7],Ba,Bb[2]),Bf=db(wM[7],Be,Bc);return [0,[0,[0,A7,db(wv[5],AY,Bf)],Bd],Bg];},Bi,Bh);},Bj,A9),Bl=c0(ww[5],AY),Bm=db(wC[5],Bl,Bk),Bn=c0(ww[5],AY),Bo=db(wC[6],Bn,AX),Bp=c0(ww[5],AV),Bq=db(wC[6],Bp,AU),BC=wC[1],BD=function(Bt){function BB(Bz,Bx){var Bw=0,By=dl(function(Bv,Br){var Bs=Br[1],Bu=db(ww[7],Bt,Br[2]);return [0,[0,[0,Bs[1],Bs[2]],Bu],Bv];},Bw,Bx),BA=db(ww[7],Bt,Bz);return db(wC[4],BA,By);}return db(wC[11],BB,Bq);},BE=kg(wB[14],BD,AW,BC),BQ=wC[1],BR=function(BH){function BP(BN,BL){var BK=0,BM=dl(function(BJ,BF){var BG=BF[1],BI=db(ww[7],BH,BF[2]);return [0,[0,[0,BG[1],BG[2]],BI],BJ];},BK,BL),BO=db(ww[7],BH,BN);return db(wC[4],BO,BM);}return db(wC[11],BP,Bo);},BS=kg(wB[14],BR,AT,BQ),Cb=wC[1],Cc=function(B8,B5,Ca){function B$(B7,B2,B_){var B4=0,B6=dl(function(B3,BV){return dl(function(B1,BT){var BU=BT[1],BW=BV[1],BY=kg(wv[7],BX,BW[1],BU[1]),BZ=db(ww[7],BV[2],BT[2]);return [0,[0,[0,BY,kg(wv[7],B0,BW[2],BU[2])],BZ],B1];},B3,B2);},B4,B5),B9=db(ww[7],B8,B7);return kg(wC[4],B9,B6,B_);}return kg(wC[11],B$,Bq,Ca);},Cd=Al(Bm,kg(wC[11],Cc,Bo,Cb));return [0,[0,AY,Al(Al(BE,BS),Cd),A6],AZ];}throw [0,d,ab];}if(926224370<=z1){if(974443759<=z1){var z2=z0[2],z5=z3(z4,z2[1]),z6=z3(z5[2],z2[2]),z7=z6[1],z8=z5[1],z9=z7[2],z_=z7[1],z$=z8[1],Ab=z6[2];if(Aa(z8,z7)){var Ac=c0(ww[5],z_),Ah=db(wC[22],Ac,z9),Ai=c2(function(Ad){var Ae=db(wv[5],z$,z$),Af=db(wv[22],z_,Ad[1][2]),Ag=db(wv[5],z$,Af);return [0,[0,Ae,Ag],Ad[2]];},Ah),Aj=c0(ww[5],z_),Ak=db(wC[6],Aj,z9),Am=Al(z8[2],Ak),An=c0(ww[5],z$),Ao=Al(db(wC[5],An,Ai),Am);return [0,[0,z$,Ao,db(wB[7],z8[3],z7[3])],Ab];}throw [0,d,$];}var Ap=z3(z4,z0[2]),Aq=Ap[1],Ar=Aq[3],As=Aq[2],At=Aq[1],Av=Ap[2];return [0,[0,At,Al(As,Au(Ar,At,As)),Ar],Av];}if(!(748545556<=z1)){var Aw=z0[2],Ax=z3(z4,Aw[1]),Ay=z3(Ax[2],Aw[2]),Az=Ay[1],AA=Ax[1],AB=Az[2],AC=Az[1],AD=Ay[2];if(Aa(AA,Az)){var AE=Au(AA[3],AC,AB),AF=c0(ww[5],AC),AG=db(wC[6],AF,AB),AH=Al(AE,Al(AA[2],AG));return [0,[0,AA[1],AH,Az[3]],AD];}throw [0,d,aa];}}return o(ac);}function EM(Ce){return z3(0,Ce)[1];}function FV(Cg,Cf){var Ch=Cg[1],Co=Cf[3],Cn=Cf[2],Cm=Cg[3],Cl=Cg[2],Cp=ic([0,function(Cj,Ci){var Ck=db(ww[10],Cj[1],Ci[1]);return 0===Ck?db(wA[10],Cj[2],Ci[2]):Ck;}]);function Ex(Ct,Cu,Cq){var Cr=Cq[2],Cs=Cq[1],Cv=Ct[3];if(db(Cp[3],[0,Cs,Cr],Cu))return 0;var Cw=db(Cp[4],[0,Cs,Cr],Cu);if(db(wB[3],Cs,Cm)){var Cz=function(Cx){var Cy=w1(Cx);return db(wB[3],Cy,Co);},CA=db(wA[16],Cz,Cr);}else var CA=1;if(CA){var CB=wL(0,wC[22],Cs,Cl);return 0===CB?0:dk(function(CC){var CD=CC[1],CE=CD[1],CF=Ct[3],CG=Ct[2],CH=Ct[1],CI=CD[2],CK=yN([0,CH,CG,CF]),CJ=c0(yL,CE),CS=wv[1];function CT(CL,CP,CN){var CM=c0(CJ,CL),CO=wL(ww[1],wv[22],CM,CN),CQ=db(ww[4],CP,CO),CR=c0(CJ,CL);return kg(wv[4],CR,CQ,CN);}var CW=kg(wv[11],CT,CF,CS);function CX(CV,CU){return 1<c0(ww[19],CU)?1:0;}var CY=db(wv[14],CX,CW),CZ=w1(CE);function C2(C0,C1){return 1-db(ww[3],C0,CZ);}var C8=db(wv[14],C2,CF);function C9(C3,C7){try {var C4=c0(CJ,C3),C5=db(wv[22],C4,CF);}catch(C6){if(C6[1]===c)return C7;throw C6;}return C5;}var C_=db(wv[24],C9,CF);function Dc(C$,Db,Da){return yM(db(wv[22],C$,C_),Db,Da);}var Dv=[0,kg(wv[11],Dc,CY,CG),C8,CK];function Dw(Dd,Du,Df){var De=c0(CJ,Dd),Dg=db(wv[22],De,C_),Ds=[0,Df[1],Df[2],Df[3]];function Dt(Dk,Dh){var Di=Dh[3],Dj=Dh[2],Dl=Dk[2];try {var Dm=[0,db(wv[22],Dl,Dj),Di],Dn=Dm;}catch(Do){if(Do[1]!==c)throw Do;var Dn=[0,Di,Di+1|0];}var Dp=Dn[1],Dq=Dn[2],Dr=kg(wv[4],Dl,Dp,Dj);return [0,db(wP[4],[0,Dg,Dk[1],Dp],Dh[1]),Dr,Dq];}return kg(wM[14],Dt,Du,Ds);}var Dx=kg(wv[11],Dw,CI,Dv),Dy=[0,CH,Dx[1],Dx[2]],DB=wA[1];function DC(Dz){var DA=w2(w2(Dz,CE),Cv);return c0(wA[4],DA);}var DD=kg(wA[14],DC,Cr,DB),Ej=wA[1];function Ek(DE,Ei){var DF=w1(DE),Eh=wL(0,wC[22],DF,Cn);return dl(function(Eg,DG){var DH=DG[1],DI=DH[1],DJ=Dy[2],DL=c0(yL,DI);function DO(DK,DN){var DM=c0(DL,DK);return db(wv[22],DM,DE)!==DN?1:0;}if(db(wv[13],DO,DE))var DP=wA[1];else{var DS=function(DQ,DR){return 1-db(wv[3],DQ,DI);},DT=db(wv[14],DS,DE),DU=c0(wA[5],DT),Ee=DH[2],Ef=function(DW,Ed){function Ec(DV,Eb){var D6=DV[2],D0=DV[1],D$=wA[1];function Ea(D5){var DX=db(wv[22],DW,DE),D2=wA[1];function D3(DY){var DZ=DY[1]===DX?1:0,D1=DZ?caml_string_equal(D0,DY[2]):DZ;return D1;}var D8=db(wP[17],D3,DJ);function D9(D4){var D7=kg(wv[4],D6,D4[3],D5);return c0(wA[4],D7);}var D_=kg(wP[14],D9,D8,D2);return c0(wA[7],D_);}return kg(wA[14],Ea,Eb,D$);}return db(wM[14],Ec,Ed);},DP=kg(wv[11],Ef,Ee,DU);}return db(wA[7],Eg,DP);},Ei,Eh);}var El=kg(wA[14],Ek,DD,Ej),Ep=Dy[3],Eo=wv[1];function Eq(Em,En){return db(wv[4],En,Em);}var Er=kg(wv[11],Eq,Ep,Eo),Eu=wA[1];function Ev(Es){var Et=w2(Es,Er);return c0(wA[4],Et);}var Ew=kg(wA[14],Ev,El,Eu);return Ex(Dy,Cw,[0,CC[2],Ew]);},CB);}var Ey=Ct[3],Ez=Ct[2],EA=Ct[1],EB=yN([0,EA,Ez,Ey]),ED=ww[1],EE=function(EC){return ww[4];};throw [0,w3,yE([0,EA,yM(EB,kg(wv[11],EE,Ey,ED),Ez),EB])];}try {var EF=db(wv[5],Cf[1],Ch),EG=c0(wA[5],EF),EH=[0,c0(ww[5],Ch),EG],EI=Cp[1],EJ=db(wv[5],Ch,0);Ex([0,0,wP[1],EJ],EI,EH);var EK=0;}catch(EL){if(EL[1]===w3)return [0,EL[2]];throw EL;}return EK;}function FW(EP,ES,ER,EO,EN){var EQ=db(EP,EO,EN);return EQ?[0,0,ET(sN,y,ES,ER,wm(EQ[1]))]:[0,1,kg(sN,x,ES,ER)];}function FX(Fu,FF,EU){var E4=[0],E3=1,E2=0,E1=0,E0=0,EZ=0,EY=0,EX=EU.getLen(),EW=cx(EU,b3),E5=[0,function(EV){EV[9]=1;return 0;},EW,EX,EY,EZ,E0,E1,E2,E3,E4,f,f],Fa=dP[11],E$=dP[14],E_=dP[6],E9=dP[15],E8=dP[7],E7=dP[8],E6=dP[16];dP[6]=dP[14]+1|0;dP[7]=2;dP[10]=E5[12];try {var Fb=0,Fc=0;for(;;)switch(caml_parse_engine(v7,dP,Fb,Fc)){case 1:throw [0,dO];case 2:dY(0);var Fe=0,Fd=2,Fb=Fd,Fc=Fe;continue;case 3:dY(0);var Fg=0,Ff=3,Fb=Ff,Fc=Fg;continue;case 4:try {var Fh=[0,4,c0(caml_array_get(v7[1],dP[13]),dP)],Fi=Fh;}catch(Fj){if(Fj[1]!==dO)throw Fj;var Fi=[0,5,0];}var Fl=Fi[2],Fk=Fi[1],Fb=Fk,Fc=Fl;continue;case 5:c0(v7[14],b2);var Fn=0,Fm=5,Fb=Fm,Fc=Fn;continue;default:var Fo=we(E5);dP[9]=E5[11];dP[10]=E5[12];var Fp=1,Fb=Fp,Fc=Fo;continue;}}catch(Fr){var Fq=dP[7];dP[11]=Fa;dP[14]=E$;dP[6]=E_;dP[15]=E9;dP[7]=E8;dP[8]=E7;dP[16]=E6;if(Fr[1]===dN){var Fs=Fr[2],Ft=Fs[1],Fv=c0(Fu,Fs[3]),Fw=c0(Fu,Fs[2]),FD=function(Fx){return [0,1-Fx[1],Fx[2]];},FE=function(Fz,Fy){var FB=cx(Fz[2],Fy[2]),FA=Fz[1],FC=FA?Fy[1]:FA;return [0,FC,FB];};if(17064<=Ft)if(3802040<=Ft)if(3901498<=Ft){var FG=FD(ET(FF,Y,Z,Fw,Fv)),FH=FG[2],FI=FG[1];if(FI)var FJ=[0,FI,FH];else{var FK=FD(ET(FF,W,X,Fv,Fw)),FL=cx(FH,FK[2]),FJ=[0,FK[1],FL];}var FM=FJ;}else var FM=ET(FF,U,V,Fw,Fv);else if(3553395<=Ft)var FM=ET(FF,S,T,Fv,Fw);else{var FN=FD(ET(FF,Q,R,Fv,Fw)),FM=FE(ET(FF,O,P,Fw,Fv),FN);}else if(15500===Ft){var FO=ET(FF,E,F,Fv,Fw),FM=FE(ET(FF,C,D,Fw,Fv),FO);}else if(15949<=Ft){var FP=ET(FF,M,N,Fv,Fw),FM=FE(FD(ET(FF,K,L,Fw,Fv)),FP);}else{var FQ=FD(ET(FF,I,J,Fv,Fw)),FM=FE(FD(ET(FF,G,H,Fw,Fv)),FQ);}var FR=FM[1],FT=FM[2],FS=FR?B:A;return [0,FR,ET(sN,z,EU,FS,FT)];}d3[1]=function(FU){return caml_obj_is_block(FU)?caml_array_get(v7[3],caml_obj_tag(FU))===Fq?1:0:caml_array_get(v7[2],FU)===Fq?1:0;};throw Fr;}}var Gv=db(FX,EM,c0(FW,FV));function Gu(FY){function F3(F2,F1,FZ){try {var F0=FY.safeGet(FZ),F4=10===F0?F3(q,[0,F2,F1],FZ+1|0):(j.safeSet(0,F0),F3(cx(F2,j),F1,FZ+1|0));}catch(F5){if(F5[1]===b)return dj([0,F2,F1]);throw F5;}return F4;}return F3(p,0,0);}function Hx(Hw){var F6=u2.getElementById(v.toString());if(F6==uR)throw [0,d,w];var F7=u$(u2,aK),F8=u$(u2,aL),F9=vc(u2),F_=0,F$=0;for(;;){if(0===F$&&0===F_){var Ga=u7(u2,h),Gb=1;}else var Gb=0;if(!Gb){var Gc=va[1];if(785140586===Gc){try {var Gd=u2.createElement(aP.toString()),Ge=aO.toString(),Gf=Gd.tagName.toLowerCase()===Ge?1:0,Gg=Gf?Gd.name===aN.toString()?1:0:Gf,Gh=Gg;}catch(Gj){var Gh=0;}var Gi=Gh?982028505:-1003883683;va[1]=Gi;continue;}if(982028505<=Gc){var Gk=new uS();Gk.push(aS.toString(),h.toString());u_(F$,function(Gl){Gk.push(aT.toString(),caml_js_html_escape(Gl),aU.toString());return 0;});u_(F_,function(Gm){Gk.push(aV.toString(),caml_js_html_escape(Gm),aW.toString());return 0;});Gk.push(aR.toString());var Ga=u2.createElement(Gk.join(aQ.toString()));}else{var Gn=u7(u2,h);u_(F$,function(Go){return Gn.type=Go;});u_(F_,function(Gp){return Gn.name=Gp;});var Ga=Gn;}}Ga.rows=20;Ga.cols=50;var Gq=vc(u2);Gq.style.border=u.toString();Gq.style.padding=t.toString();Gq.style.width=s.toString();u0(F6,F7);u0(F7,F8);u0(F8,F9);u0(F9,Ga);u0(F8,Gq);var GJ=function(Gs,GI){var Gr=new MlWrappedString(Ga.value);if(caml_string_notequal(Gr,Gs)){try {var Gt=u$(u2,aH),Gz=c2(Gv,Gu(Gr)),Gx=function(Gw){if(Gw){var Gy=Gx(Gw[2]);return cu(Gu(Gw[1][2]),Gy);}return Gw;},GB=Gx(Gz),GE=c2(function(GA){return GA.toString();},GB);dk(function(GD){var GC=u$(u2,aJ);GC.innerHTML=GD;u0(Gt,GC);return u0(Gt,u$(u2,aI));},GE);var GF=Gq.firstChild;if(GF!=uR)Gq.removeChild(GF);u0(Gq,Gt);}catch(GH){}var GG=20;}else var GG=cm(0,GI-1|0);function GL(GK){return GJ(Gr,GG);}var GM=0===GG?0.5:0.1,GN=[0,[2,[0,1,0,0,0]]],GO=[0,0];function GT(GP,GV){var GQ=vd<GP?[0,vd,GP-vd]:[0,GP,0],GR=GQ[2],GU=GQ[1],GS=GR==0?c0(uH,GN):c0(GT,GR);GO[1]=[0,u1.setTimeout(caml_js_wrap_callback(GS),GU*1e3)];return 0;}GT(GM,0);function GY(GX){var GW=GO[1];return GW?u1.clearTimeout(GW[1]):0;}var GZ=tN(GN)[1];switch(GZ[0]){case 1:var G0=GZ[1][1]===tB?(uc(GY,0),1):0;break;case 2:var G1=GZ[1],G2=[0,tF[1],GY],G3=G1[4],G4=typeof G3==="number"?G2:[2,G2,G3];G1[4]=G4;var G0=1;break;default:var G0=0;}var G5=tN(GN),G6=G5[1];switch(G6[0]){case 1:var G7=[0,G6];break;case 2:var G8=G6[1],G9=[0,[2,[0,[0,[0,G5]],0,0,0]]],G$=tF[1],Ht=[1,function(G_){switch(G_[0]){case 0:var Ha=G_[1];tF[1]=G$;try {var Hb=GL(Ha),Hc=Hb;}catch(Hd){var Hc=[0,[1,Hd]];}var He=tN(G9),Hf=tN(Hc),Hg=He[1];{if(2===Hg[0]){var Hh=Hg[1];if(He===Hf)var Hi=0;else{var Hj=Hf[1];if(2===Hj[0]){var Hk=Hj[1];Hf[1]=[3,He];Hh[1]=Hk[1];var Hl=uF(Hh[2],Hk[2]),Hm=Hh[3]+Hk[3]|0;if(tE<Hm){Hh[3]=0;Hh[2]=uC(Hl);}else{Hh[3]=Hm;Hh[2]=Hl;}var Hn=Hk[4],Ho=Hh[4],Hp=typeof Ho==="number"?Hn:typeof Hn==="number"?Ho:[2,Ho,Hn];Hh[4]=Hp;var Hi=0;}else{He[1]=Hj;var Hi=ui(Hh,Hj);}}return Hi;}throw [0,d,aZ];}case 1:var Hq=tN(G9),Hr=Hq[1];{if(2===Hr[0]){var Hs=Hr[1];Hq[1]=G_;return ui(Hs,G_);}throw [0,d,a0];}default:throw [0,d,a2];}}],Hu=G8[2],Hv=typeof Hu==="number"?Ht:[2,Ht,Hu];G8[2]=Hv;var G7=G9;break;case 3:throw [0,d,a1];default:var G7=GL(G6[1]);}return G7;};GJ(r,0);return uU;}}u1.onload=caml_js_wrap_callback(function(Hy){if(Hy){var Hz=Hx(Hy);if(!(Hz|0))Hy.preventDefault();return Hz;}var HA=event,HB=Hx(HA);if(!(HB|0))HA.returnValue=HB;return HB;});cG(0);return;}());
