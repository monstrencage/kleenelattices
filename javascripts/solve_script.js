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
(function(){function sk(Fu,Fv,Fw,Fx,Fy,Fz,FA){return Fu.length==6?Fu(Fv,Fw,Fx,Fy,Fz,FA):caml_call_gen(Fu,[Fv,Fw,Fx,Fy,Fz,FA]);}function Ci(Fp,Fq,Fr,Fs,Ft){return Fp.length==4?Fp(Fq,Fr,Fs,Ft):caml_call_gen(Fp,[Fq,Fr,Fs,Ft]);}function j3(Fl,Fm,Fn,Fo){return Fl.length==3?Fl(Fm,Fn,Fo):caml_call_gen(Fl,[Fm,Fn,Fo]);}function cQ(Fi,Fj,Fk){return Fi.length==2?Fi(Fj,Fk):caml_call_gen(Fi,[Fj,Fk]);}function cH(Fg,Fh){return Fg.length==1?Fg(Fh):caml_call_gen(Fg,[Fh]);}var a=[0,new MlString("Failure")],b=[0,new MlString("Invalid_argument")],c=[0,new MlString("Not_found")],d=[0,new MlString("Assert_failure")],e=[0,new MlString(""),0,0,-1],f=[0,new MlString(""),1,0,0],g=new MlString("File \"%s\", line %d, characters %d-%d: %s"),h=new MlString("textarea"),i=[0,new MlString("\0\0\xeb\xff\xec\xff\x02\0\x1e\0L\0\xf5\xff\xf6\xff\xf7\xff\xf8\xff\xf9\xff\xfa\xff\xfb\xffM\0\xfd\xff\x0b\0\xbf\0\xfe\xff\x03\0 \0\xf4\xff\xf3\xff\xef\xff\xf2\xff\xee\xff\x01\0\xfd\xff\xfe\xff\xff\xff"),new MlString("\xff\xff\xff\xff\xff\xff\x0f\0\x0e\0\x12\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x03\0\xff\xff\x14\0\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString("\x01\0\0\0\0\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\xff\xff\xff\xff\0\0\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\x1a\0\0\0\0\0\0\0"),new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\x0e\0\x1c\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\b\0\0\0\x07\0\x06\0\f\0\x0b\0\x10\0\0\0\t\0\x0f\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x11\0\0\0\x04\0\x05\0\x03\0\x18\0\x15\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x17\0\x16\0\x14\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x12\0\n\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\x13\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x10\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x02\0\x1b\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"),new MlString("\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\0\0\x19\0\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x0f\0\xff\xff\0\0\0\0\0\0\x03\0\x12\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x13\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x05\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\x05\0\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x10\0\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\x19\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString("")],j=new MlString(" ");caml_register_global(6,c);caml_register_global(5,[0,new MlString("Division_by_zero")]);caml_register_global(3,b);caml_register_global(2,a);var b4=[0,new MlString("Out_of_memory")],b3=[0,new MlString("Match_failure")],b2=[0,new MlString("Stack_overflow")],b1=[0,new MlString("Undefined_recursive_module")],b0=new MlString("%.12g"),bZ=new MlString("."),bY=new MlString("%d"),bX=new MlString("true"),bW=new MlString("false"),bV=new MlString("Pervasives.do_at_exit"),bU=new MlString("Array.blit"),bT=new MlString("\\b"),bS=new MlString("\\t"),bR=new MlString("\\n"),bQ=new MlString("\\r"),bP=new MlString("\\\\"),bO=new MlString("\\'"),bN=new MlString("String.blit"),bM=new MlString("String.sub"),bL=new MlString(""),bK=new MlString("syntax error"),bJ=new MlString("Parsing.YYexit"),bI=new MlString("Parsing.Parse_error"),bH=new MlString("Set.remove_min_elt"),bG=[0,0,0,0],bF=[0,0,0],bE=new MlString("Set.bal"),bD=new MlString("Set.bal"),bC=new MlString("Set.bal"),bB=new MlString("Set.bal"),bA=new MlString("Map.remove_min_elt"),bz=[0,0,0,0],by=[0,new MlString("map.ml"),270,10],bx=[0,0,0],bw=new MlString("Map.bal"),bv=new MlString("Map.bal"),bu=new MlString("Map.bal"),bt=new MlString("Map.bal"),bs=new MlString("Queue.Empty"),br=new MlString("Buffer.add: cannot grow buffer"),bq=new MlString(""),bp=new MlString(""),bo=new MlString("%.12g"),bn=new MlString("\""),bm=new MlString("\""),bl=new MlString("'"),bk=new MlString("'"),bj=new MlString("nan"),bi=new MlString("neg_infinity"),bh=new MlString("infinity"),bg=new MlString("."),bf=new MlString("printf: bad positional specification (0)."),be=new MlString("%_"),bd=[0,new MlString("printf.ml"),143,8],bc=new MlString("'"),bb=new MlString("Printf: premature end of format string '"),ba=new MlString("'"),a$=new MlString(" in format string '"),a_=new MlString(", at char number "),a9=new MlString("Printf: bad conversion %"),a8=new MlString("Sformat.index_of_int: negative argument "),a7=new MlString(""),a6=new MlString(", %s%s"),a5=[1,1],a4=new MlString("%s\n"),a3=new MlString("(Program not linked with -g, cannot print stack backtrace)\n"),a2=new MlString("Raised at"),a1=new MlString("Re-raised at"),a0=new MlString("Raised by primitive operation at"),aZ=new MlString("Called from"),aY=new MlString("%s file \"%s\", line %d, characters %d-%d"),aX=new MlString("%s unknown location"),aW=new MlString("Out of memory"),aV=new MlString("Stack overflow"),aU=new MlString("Pattern matching failed"),aT=new MlString("Assertion failed"),aS=new MlString("Undefined recursive module"),aR=new MlString("(%s%s)"),aQ=new MlString(""),aP=new MlString(""),aO=new MlString("(%s)"),aN=new MlString("%d"),aM=new MlString("%S"),aL=new MlString("_"),aK=[0,new MlString("src/core/lwt.ml"),648,20],aJ=[0,new MlString("src/core/lwt.ml"),651,8],aI=[0,new MlString("src/core/lwt.ml"),498,8],aH=[0,new MlString("src/core/lwt.ml"),487,9],aG=new MlString("Lwt.wakeup_result"),aF=new MlString("Lwt.Canceled"),aE=new MlString("\""),aD=new MlString(" name=\""),aC=new MlString("\""),aB=new MlString(" type=\""),aA=new MlString("<"),az=new MlString(">"),ay=new MlString(""),ax=new MlString("<input name=\"x\">"),aw=new MlString("input"),av=new MlString("x"),au=new MlString("td"),at=new MlString("tr"),as=new MlString("table"),ar=new MlString("a"),aq=new MlString("br"),ap=new MlString("p"),ao=new MlString("Exception during Lwt.async: "),an=new MlString("parser"),am=new MlString("1"),al=new MlString("0"),ak=[0,0,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,0],aj=new MlString("\xff\xff\x02\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\0\0\0\0"),ai=new MlString("\x02\0\x03\0\x01\0\x02\0\x03\0\x03\0\x03\0\x02\0\x02\0\x03\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x02\0\x02\0"),ah=new MlString("\0\0\0\0\0\0\0\0\x02\0\0\0\0\0\0\0\x12\0\0\0\x03\0\0\0\0\0\b\0\x07\0\0\0\n\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\0\0\t\0\0\0\0\0\0\0\0\0"),ag=new MlString("\x03\0\x06\0\b\0\x17\0"),af=new MlString("\x05\0\x01\xff\x01\xff\0\0\0\0\x01\xff\n\xff\x18\xff\0\0'\xff\0\0\x01\xff\x01\xff\0\0\0\0\x01\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x01\xff\0\x000\xff<\xff4\xff\n\xff"),ae=new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x1d\0\x01\0\x0f\0\b\0"),ad=new MlString("\0\0\xfe\xff\0\0\0\0"),ac=new MlString("\x07\0\x04\0\x04\0\t\0\x11\0\x05\0\x01\0\x02\0\x01\0\x19\0\x1a\0\0\0\n\0\x1b\0\0\0\x05\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x1c\0\0\0\0\0\0\0\0\0\n\0\0\0\0\0\x06\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\x11\0\x12\0\x13\0\x14\0\x15\0\n\0\x16\0\0\0\x18\0\x0b\0\f\0\r\0\x0e\0\x0f\0\n\0\0\0\0\0\0\0\n\0\f\0\r\0\x0e\0\x0f\0\f\0\r\0\x0e\0\n\0\0\0\0\0\0\0\0\0\0\0\r\0\x0e\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x04\0\0\0\0\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\0\0\x04\0\x05\0\x05\0\0\0\0\0\0\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\0\0\x05\0\x06\0\x06\0\0\0\0\0\0\0\0\0\x06\0\x06\0\x06\0\x06\0\x06\0\x06\0\0\0\x06\0"),ab=new MlString("\x02\0\0\0\x01\x01\x05\0\0\0\x04\x01\x01\0\x02\0\0\0\x0b\0\f\0\xff\xff\x02\x01\x0f\0\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x17\0\xff\xff\xff\xff\xff\xff\xff\xff\x02\x01\xff\xff\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\x02\x01\x12\x01\xff\xff\x05\x01\x06\x01\x07\x01\b\x01\t\x01\n\x01\x02\x01\xff\xff\xff\xff\xff\xff\x02\x01\x07\x01\b\x01\t\x01\n\x01\x07\x01\b\x01\t\x01\x02\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\b\x01\t\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x05\x01\x06\x01\x07\x01\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\xff\xff\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01"),aa=new MlString("EOF\0NEWLINE\0LPAR\0RPAR\0PLUS\0DOT\0PSTAR\0STAR\0INTER\0EGAL\0LEQ\0GEQ\0LT\0GT\0IMCOMP\0DUNNO\0DIFF\0"),$=new MlString("VAR\0POWER\0"),_=new MlString("lexing error"),Z=new MlString("\xc3\xb8"),Y=new MlString("\xce\xb5"),X=new MlString("(%s | %s)"),W=new MlString("(%s)+"),V=new MlString("(%s)~"),U=new MlString("%s.%s"),T=new MlString("(%s & %s)"),S=new MlString("=/="),R=new MlString("<="),Q=new MlString(">="),P=new MlString("<"),O=new MlString(">"),N=new MlString("<>"),M=new MlString("="),L=new MlString("Tools.ContreExemple"),K=new MlString("get_expr : empty word"),J=[0,new MlString("word.ml"),134,4],I=new MlString("get_expr : stuck"),H=new MlString("get_expr : stuck"),G=[0,new MlString("word.ml"),84,15],F=new MlString("Petri.trad : unsupported operation"),E=new MlString("OK"),D=new MlString("Incorrect"),C=new MlString("%s %s %s --------- %s\n%s\n\n"),B=new MlString("\n%s <= %s -- false : %s"),A=new MlString("\n%s <= %s -- true"),z=[0,new MlString("wmain.ml"),61,17],y=new MlString("zob"),x=new MlString("1px black dashed"),w=new MlString("5px"),v=new MlString("400px"),u=new MlString(""),t=new MlString(""),s=[0,0,new MlString("")],r=new MlString(""),q=new MlString(""),p=new MlString(""),o=new MlString(""),n=new MlString("(a|b)+.C & d > d & a.b.C & (d|a)\n");function m(k){throw [0,a,k];}function b5(l){throw [0,b,l];}function ce(b6,b8){var b7=b6.getLen(),b9=b8.getLen(),b_=caml_create_string(b7+b9|0);caml_blit_string(b6,0,b_,0,b7);caml_blit_string(b8,0,b_,b7,b9);return b_;}function cf(b$){return caml_format_int(bY,b$);}function cb(ca,cc){if(ca){var cd=ca[1];return [0,cd,cb(ca[2],cc)];}return cc;}var cg=caml_ml_open_descriptor_out(2);function co(ci,ch){return caml_ml_output(ci,ch,0,ch.getLen());}function cn(cm){var cj=caml_ml_out_channels_list(0);for(;;){if(cj){var ck=cj[2];try {}catch(cl){}var cj=ck;continue;}return 0;}}caml_register_named_value(bV,cn);function cs(cq,cp){return caml_ml_output_char(cq,cp);}function cz(cr){return caml_ml_flush(cr);}function cy(cv,cu,cx,cw,ct){if(0<=ct&&0<=cu&&!((cv.length-1-ct|0)<cu)&&0<=cw&&!((cx.length-1-ct|0)<cw))return caml_array_blit(cv,cu,cx,cw,ct);return b5(bU);}function c6(cA){var cB=cA,cC=0;for(;;){if(cB){var cD=cB[2],cE=[0,cB[1],cC],cB=cD,cC=cE;continue;}return cC;}}function cJ(cG,cF){if(cF){var cI=cF[2],cK=cH(cG,cF[1]);return [0,cK,cJ(cG,cI)];}return 0;}function c7(cP,cL,cN){var cM=cL,cO=cN;for(;;){if(cO){var cR=cO[2],cS=cQ(cP,cM,cO[1]),cM=cS,cO=cR;continue;}return cM;}}function c8(cV,cT){var cU=cT;for(;;){if(cU){var cW=cU[2],cX=0===caml_compare(cU[1],cV)?1:0;if(cX)return cX;var cU=cW;continue;}return 0;}}function dk(c4){return cH(function(cY,c0){var cZ=cY,c1=c0;for(;;){if(c1){var c2=c1[2],c3=c1[1];if(cH(c4,c3)){var c5=[0,c3,cZ],cZ=c5,c1=c2;continue;}var c1=c2;continue;}return c6(cZ);}},0);}function dj(c9,c$){var c_=caml_create_string(c9);caml_fill_string(c_,0,c9,c$);return c_;}function dl(dc,da,db){if(0<=da&&0<=db&&!((dc.getLen()-db|0)<da)){var dd=caml_create_string(db);caml_blit_string(dc,da,dd,0,db);return dd;}return b5(bM);}function dm(dg,df,di,dh,de){if(0<=de&&0<=df&&!((dg.getLen()-de|0)<df)&&0<=dh&&!((di.getLen()-de|0)<dh))return caml_blit_string(dg,df,di,dh,de);return b5(bN);}var dn=caml_sys_const_word_size(0),dp=caml_mul(dn/8|0,(1<<(dn-10|0))-1|0)-1|0,dx=252,dw=253;function dv(ds,dr,dq){var dt=caml_lex_engine(ds,dr,dq);if(0<=dt){dq[11]=dq[12];var du=dq[12];dq[12]=[0,du[1],du[2],du[3],dq[4]+dq[6]|0];}return dt;}var dy=[0,bJ],dz=[0,bI],dA=[0,caml_make_vect(100,0),caml_make_vect(100,0),caml_make_vect(100,e),caml_make_vect(100,e),100,0,0,0,e,e,0,0,0,0,0,0];function dJ(dH){var dB=dA[5],dC=dB*2|0,dD=caml_make_vect(dC,0),dE=caml_make_vect(dC,0),dF=caml_make_vect(dC,e),dG=caml_make_vect(dC,e);cy(dA[1],0,dD,0,dB);dA[1]=dD;cy(dA[2],0,dE,0,dB);dA[2]=dE;cy(dA[3],0,dF,0,dB);dA[3]=dF;cy(dA[4],0,dG,0,dB);dA[4]=dG;dA[5]=dC;return 0;}var dO=[0,function(dI){return 0;}];function dN(dK,dL){return caml_array_get(dK[2],dK[11]-dL|0);}function h0(dM){return 0;}function hZ(ek){function d3(dP){return dP?dP[4]:0;}function d5(dQ,dV,dS){var dR=dQ?dQ[4]:0,dT=dS?dS[4]:0,dU=dT<=dR?dR+1|0:dT+1|0;return [0,dQ,dV,dS,dU];}function eo(dW,d6,dY){var dX=dW?dW[4]:0,dZ=dY?dY[4]:0;if((dZ+2|0)<dX){if(dW){var d0=dW[3],d1=dW[2],d2=dW[1],d4=d3(d0);if(d4<=d3(d2))return d5(d2,d1,d5(d0,d6,dY));if(d0){var d8=d0[2],d7=d0[1],d9=d5(d0[3],d6,dY);return d5(d5(d2,d1,d7),d8,d9);}return b5(bE);}return b5(bD);}if((dX+2|0)<dZ){if(dY){var d_=dY[3],d$=dY[2],ea=dY[1],eb=d3(ea);if(eb<=d3(d_))return d5(d5(dW,d6,ea),d$,d_);if(ea){var ed=ea[2],ec=ea[1],ee=d5(ea[3],d$,d_);return d5(d5(dW,d6,ec),ed,ee);}return b5(bC);}return b5(bB);}var ef=dZ<=dX?dX+1|0:dZ+1|0;return [0,dW,d6,dY,ef];}function en(el,eg){if(eg){var eh=eg[3],ei=eg[2],ej=eg[1],em=cQ(ek[1],el,ei);return 0===em?eg:0<=em?eo(ej,ei,en(el,eh)):eo(en(el,ej),ei,eh);}return [0,0,el,0,1];}function ev(ep){return [0,0,ep,0,1];}function er(es,eq){if(eq){var eu=eq[3],et=eq[2];return eo(er(es,eq[1]),et,eu);}return ev(es);}function ex(ey,ew){if(ew){var eA=ew[2],ez=ew[1];return eo(ez,eA,ex(ey,ew[3]));}return ev(ey);}function eF(eB,eG,eC){if(eB){if(eC){var eD=eC[4],eE=eB[4],eL=eC[3],eM=eC[2],eK=eC[1],eH=eB[3],eI=eB[2],eJ=eB[1];return (eD+2|0)<eE?eo(eJ,eI,eF(eH,eG,eC)):(eE+2|0)<eD?eo(eF(eB,eG,eK),eM,eL):d5(eB,eG,eC);}return ex(eG,eB);}return er(eG,eC);}function e1(eN){var eO=eN;for(;;){if(eO){var eP=eO[1];if(eP){var eO=eP;continue;}return eO[2];}throw [0,c];}}function fe(eQ){var eR=eQ;for(;;){if(eR){var eS=eR[3],eT=eR[2];if(eS){var eR=eS;continue;}return eT;}throw [0,c];}}function eW(eU){if(eU){var eV=eU[1];if(eV){var eY=eU[3],eX=eU[2];return eo(eW(eV),eX,eY);}return eU[3];}return b5(bH);}function ff(eZ,e0){if(eZ){if(e0){var e2=eW(e0);return eF(eZ,e1(e0),e2);}return eZ;}return e0;}function e9(e7,e3){if(e3){var e4=e3[3],e5=e3[2],e6=e3[1],e8=cQ(ek[1],e7,e5);if(0===e8)return [0,e6,1,e4];if(0<=e8){var e_=e9(e7,e4),fa=e_[3],e$=e_[2];return [0,eF(e6,e5,e_[1]),e$,fa];}var fb=e9(e7,e6),fd=fb[2],fc=fb[1];return [0,fc,fd,eF(fb[3],e5,e4)];}return bG;}var hU=0;function hV(fg){return fg?0:1;}function hW(fj,fh){var fi=fh;for(;;){if(fi){var fm=fi[3],fl=fi[1],fk=cQ(ek[1],fj,fi[2]),fn=0===fk?1:0;if(fn)return fn;var fo=0<=fk?fm:fl,fi=fo;continue;}return 0;}}function fx(ft,fp){if(fp){var fq=fp[3],fr=fp[2],fs=fp[1],fu=cQ(ek[1],ft,fr);if(0===fu){if(fs)if(fq){var fv=eW(fq),fw=eo(fs,e1(fq),fv);}else var fw=fs;else var fw=fq;return fw;}return 0<=fu?eo(fs,fr,fx(ft,fq)):eo(fx(ft,fs),fr,fq);}return 0;}function fF(fy,fz){if(fy){if(fz){var fA=fz[4],fB=fz[2],fC=fy[4],fD=fy[2],fL=fz[3],fN=fz[1],fG=fy[3],fI=fy[1];if(fA<=fC){if(1===fA)return en(fB,fy);var fE=e9(fD,fz),fH=fE[1],fJ=fF(fG,fE[3]);return eF(fF(fI,fH),fD,fJ);}if(1===fC)return en(fD,fz);var fK=e9(fB,fy),fM=fK[1],fO=fF(fK[3],fL);return eF(fF(fM,fN),fB,fO);}return fy;}return fz;}function fW(fP,fQ){if(fP){if(fQ){var fR=fP[3],fS=fP[2],fT=fP[1],fU=e9(fS,fQ),fV=fU[1];if(0===fU[2]){var fX=fW(fR,fU[3]);return ff(fW(fT,fV),fX);}var fY=fW(fR,fU[3]);return eF(fW(fT,fV),fS,fY);}return 0;}return 0;}function f6(fZ,f0){if(fZ){if(f0){var f1=fZ[3],f2=fZ[2],f3=fZ[1],f4=e9(f2,f0),f5=f4[1];if(0===f4[2]){var f7=f6(f1,f4[3]);return eF(f6(f3,f5),f2,f7);}var f8=f6(f1,f4[3]);return ff(f6(f3,f5),f8);}return fZ;}return 0;}function gd(f9,f$){var f_=f9,ga=f$;for(;;){if(f_){var gb=f_[1],gc=[0,f_[2],f_[3],ga],f_=gb,ga=gc;continue;}return ga;}}function gr(gf,ge){var gg=gd(ge,0),gh=gd(gf,0),gi=gg;for(;;){if(gh)if(gi){var gn=gi[3],gm=gi[2],gl=gh[3],gk=gh[2],gj=cQ(ek[1],gh[1],gi[1]);if(0===gj){var go=gd(gm,gn),gp=gd(gk,gl),gh=gp,gi=go;continue;}var gq=gj;}else var gq=1;else var gq=gi?-1:0;return gq;}}function hX(gt,gs){return 0===gr(gt,gs)?1:0;}function gE(gu,gw){var gv=gu,gx=gw;for(;;){if(gv){if(gx){var gy=gx[3],gz=gx[1],gA=gv[3],gB=gv[2],gC=gv[1],gD=cQ(ek[1],gB,gx[2]);if(0===gD){var gF=gE(gC,gz);if(gF){var gv=gA,gx=gy;continue;}return gF;}if(0<=gD){var gG=gE([0,0,gB,gA,0],gy);if(gG){var gv=gC;continue;}return gG;}var gH=gE([0,gC,gB,0,0],gz);if(gH){var gv=gA;continue;}return gH;}return 0;}return 1;}}function gK(gL,gI){var gJ=gI;for(;;){if(gJ){var gN=gJ[3],gM=gJ[2];gK(gL,gJ[1]);cH(gL,gM);var gJ=gN;continue;}return 0;}}function gS(gT,gO,gQ){var gP=gO,gR=gQ;for(;;){if(gP){var gV=gP[3],gU=gP[2],gW=cQ(gT,gU,gS(gT,gP[1],gR)),gP=gV,gR=gW;continue;}return gR;}}function g3(gZ,gX){var gY=gX;for(;;){if(gY){var g2=gY[3],g1=gY[1],g0=cH(gZ,gY[2]);if(g0){var g4=g3(gZ,g1);if(g4){var gY=g2;continue;}var g5=g4;}else var g5=g0;return g5;}return 1;}}function hb(g8,g6){var g7=g6;for(;;){if(g7){var g$=g7[3],g_=g7[1],g9=cH(g8,g7[2]);if(g9)var ha=g9;else{var hc=hb(g8,g_);if(!hc){var g7=g$;continue;}var ha=hc;}return ha;}return 0;}}function hf(hg,hd){if(hd){var he=hd[2],hi=hd[3],hh=hf(hg,hd[1]),hk=cH(hg,he),hj=hf(hg,hi);return hk?eF(hh,he,hj):ff(hh,hj);}return 0;}function hn(ho,hl){if(hl){var hm=hl[2],hq=hl[3],hp=hn(ho,hl[1]),hr=hp[2],hs=hp[1],hu=cH(ho,hm),ht=hn(ho,hq),hv=ht[2],hw=ht[1];if(hu){var hx=ff(hr,hv);return [0,eF(hs,hm,hw),hx];}var hy=eF(hr,hm,hv);return [0,ff(hs,hw),hy];}return bF;}function hA(hz){if(hz){var hB=hz[1],hC=hA(hz[3]);return (hA(hB)+1|0)+hC|0;}return 0;}function hH(hD,hF){var hE=hD,hG=hF;for(;;){if(hG){var hJ=hG[2],hI=hG[1],hK=[0,hJ,hH(hE,hG[3])],hE=hK,hG=hI;continue;}return hE;}}function hY(hL){return hH(0,hL);}return [0,hU,hV,hW,en,ev,fx,fF,fW,f6,gr,hX,gE,gK,gS,g3,hb,hf,hn,hA,hY,e1,fe,e1,e9,function(hP,hM){var hN=hM;for(;;){if(hN){var hO=hN[2],hS=hN[3],hR=hN[1],hQ=cQ(ek[1],hP,hO);if(0===hQ)return hO;var hT=0<=hQ?hS:hR,hN=hT;continue;}throw [0,c];}}];}function mV(iK){function h2(h1){return h1?h1[5]:0;}function ik(h3,h9,h8,h5){var h4=h2(h3),h6=h2(h5),h7=h6<=h4?h4+1|0:h6+1|0;return [0,h3,h9,h8,h5,h7];}function iC(h$,h_){return [0,0,h$,h_,0,1];}function iD(ia,im,il,ic){var ib=ia?ia[5]:0,id=ic?ic[5]:0;if((id+2|0)<ib){if(ia){var ie=ia[4],ig=ia[3],ih=ia[2],ii=ia[1],ij=h2(ie);if(ij<=h2(ii))return ik(ii,ih,ig,ik(ie,im,il,ic));if(ie){var iq=ie[3],ip=ie[2],io=ie[1],ir=ik(ie[4],im,il,ic);return ik(ik(ii,ih,ig,io),ip,iq,ir);}return b5(bw);}return b5(bv);}if((ib+2|0)<id){if(ic){var is=ic[4],it=ic[3],iu=ic[2],iv=ic[1],iw=h2(iv);if(iw<=h2(is))return ik(ik(ia,im,il,iv),iu,it,is);if(iv){var iz=iv[3],iy=iv[2],ix=iv[1],iA=ik(iv[4],iu,it,is);return ik(ik(ia,im,il,ix),iy,iz,iA);}return b5(bu);}return b5(bt);}var iB=id<=ib?ib+1|0:id+1|0;return [0,ia,im,il,ic,iB];}var mO=0;function mP(iE){return iE?0:1;}function iP(iL,iO,iF){if(iF){var iG=iF[4],iH=iF[3],iI=iF[2],iJ=iF[1],iN=iF[5],iM=cQ(iK[1],iL,iI);return 0===iM?[0,iJ,iL,iO,iG,iN]:0<=iM?iD(iJ,iI,iH,iP(iL,iO,iG)):iD(iP(iL,iO,iJ),iI,iH,iG);}return [0,0,iL,iO,0,1];}function mQ(iS,iQ){var iR=iQ;for(;;){if(iR){var iW=iR[4],iV=iR[3],iU=iR[1],iT=cQ(iK[1],iS,iR[2]);if(0===iT)return iV;var iX=0<=iT?iW:iU,iR=iX;continue;}throw [0,c];}}function mR(i0,iY){var iZ=iY;for(;;){if(iZ){var i3=iZ[4],i2=iZ[1],i1=cQ(iK[1],i0,iZ[2]),i4=0===i1?1:0;if(i4)return i4;var i5=0<=i1?i3:i2,iZ=i5;continue;}return 0;}}function jp(i6){var i7=i6;for(;;){if(i7){var i8=i7[1];if(i8){var i7=i8;continue;}return [0,i7[2],i7[3]];}throw [0,c];}}function mS(i9){var i_=i9;for(;;){if(i_){var i$=i_[4],ja=i_[3],jb=i_[2];if(i$){var i_=i$;continue;}return [0,jb,ja];}throw [0,c];}}function je(jc){if(jc){var jd=jc[1];if(jd){var jh=jc[4],jg=jc[3],jf=jc[2];return iD(je(jd),jf,jg,jh);}return jc[4];}return b5(bA);}function ju(jn,ji){if(ji){var jj=ji[4],jk=ji[3],jl=ji[2],jm=ji[1],jo=cQ(iK[1],jn,jl);if(0===jo){if(jm)if(jj){var jq=jp(jj),js=jq[2],jr=jq[1],jt=iD(jm,jr,js,je(jj));}else var jt=jm;else var jt=jj;return jt;}return 0<=jo?iD(jm,jl,jk,ju(jn,jj)):iD(ju(jn,jm),jl,jk,jj);}return 0;}function jx(jy,jv){var jw=jv;for(;;){if(jw){var jB=jw[4],jA=jw[3],jz=jw[2];jx(jy,jw[1]);cQ(jy,jz,jA);var jw=jB;continue;}return 0;}}function jD(jE,jC){if(jC){var jI=jC[5],jH=jC[4],jG=jC[3],jF=jC[2],jJ=jD(jE,jC[1]),jK=cH(jE,jG);return [0,jJ,jF,jK,jD(jE,jH),jI];}return 0;}function jN(jO,jL){if(jL){var jM=jL[2],jR=jL[5],jQ=jL[4],jP=jL[3],jS=jN(jO,jL[1]),jT=cQ(jO,jM,jP);return [0,jS,jM,jT,jN(jO,jQ),jR];}return 0;}function jY(jZ,jU,jW){var jV=jU,jX=jW;for(;;){if(jV){var j2=jV[4],j1=jV[3],j0=jV[2],j4=j3(jZ,j0,j1,jY(jZ,jV[1],jX)),jV=j2,jX=j4;continue;}return jX;}}function j$(j7,j5){var j6=j5;for(;;){if(j6){var j_=j6[4],j9=j6[1],j8=cQ(j7,j6[2],j6[3]);if(j8){var ka=j$(j7,j9);if(ka){var j6=j_;continue;}var kb=ka;}else var kb=j8;return kb;}return 1;}}function kj(ke,kc){var kd=kc;for(;;){if(kd){var kh=kd[4],kg=kd[1],kf=cQ(ke,kd[2],kd[3]);if(kf)var ki=kf;else{var kk=kj(ke,kg);if(!kk){var kd=kh;continue;}var ki=kk;}return ki;}return 0;}}function km(ko,kn,kl){if(kl){var kr=kl[4],kq=kl[3],kp=kl[2];return iD(km(ko,kn,kl[1]),kp,kq,kr);}return iC(ko,kn);}function kt(kv,ku,ks){if(ks){var ky=ks[3],kx=ks[2],kw=ks[1];return iD(kw,kx,ky,kt(kv,ku,ks[4]));}return iC(kv,ku);}function kD(kz,kF,kE,kA){if(kz){if(kA){var kB=kA[5],kC=kz[5],kL=kA[4],kM=kA[3],kN=kA[2],kK=kA[1],kG=kz[4],kH=kz[3],kI=kz[2],kJ=kz[1];return (kB+2|0)<kC?iD(kJ,kI,kH,kD(kG,kF,kE,kA)):(kC+2|0)<kB?iD(kD(kz,kF,kE,kK),kN,kM,kL):ik(kz,kF,kE,kA);}return kt(kF,kE,kz);}return km(kF,kE,kA);}function kX(kO,kP){if(kO){if(kP){var kQ=jp(kP),kS=kQ[2],kR=kQ[1];return kD(kO,kR,kS,je(kP));}return kO;}return kP;}function lo(kW,kV,kT,kU){return kT?kD(kW,kV,kT[1],kU):kX(kW,kU);}function k5(k3,kY){if(kY){var kZ=kY[4],k0=kY[3],k1=kY[2],k2=kY[1],k4=cQ(iK[1],k3,k1);if(0===k4)return [0,k2,[0,k0],kZ];if(0<=k4){var k6=k5(k3,kZ),k8=k6[3],k7=k6[2];return [0,kD(k2,k1,k0,k6[1]),k7,k8];}var k9=k5(k3,k2),k$=k9[2],k_=k9[1];return [0,k_,k$,kD(k9[3],k1,k0,kZ)];}return bz;}function li(lj,la,lc){if(la){var lb=la[2],lg=la[5],lf=la[4],le=la[3],ld=la[1];if(h2(lc)<=lg){var lh=k5(lb,lc),ll=lh[2],lk=lh[1],lm=li(lj,lf,lh[3]),ln=j3(lj,lb,[0,le],ll);return lo(li(lj,ld,lk),lb,ln,lm);}}else if(!lc)return 0;if(lc){var lp=lc[2],lt=lc[4],ls=lc[3],lr=lc[1],lq=k5(lp,la),lv=lq[2],lu=lq[1],lw=li(lj,lq[3],lt),lx=j3(lj,lp,lv,[0,ls]);return lo(li(lj,lu,lr),lp,lx,lw);}throw [0,d,by];}function lB(lC,ly){if(ly){var lz=ly[3],lA=ly[2],lE=ly[4],lD=lB(lC,ly[1]),lG=cQ(lC,lA,lz),lF=lB(lC,lE);return lG?kD(lD,lA,lz,lF):kX(lD,lF);}return 0;}function lK(lL,lH){if(lH){var lI=lH[3],lJ=lH[2],lN=lH[4],lM=lK(lL,lH[1]),lO=lM[2],lP=lM[1],lR=cQ(lL,lJ,lI),lQ=lK(lL,lN),lS=lQ[2],lT=lQ[1];if(lR){var lU=kX(lO,lS);return [0,kD(lP,lJ,lI,lT),lU];}var lV=kD(lO,lJ,lI,lS);return [0,kX(lP,lT),lV];}return bx;}function l2(lW,lY){var lX=lW,lZ=lY;for(;;){if(lX){var l0=lX[1],l1=[0,lX[2],lX[3],lX[4],lZ],lX=l0,lZ=l1;continue;}return lZ;}}function mT(md,l4,l3){var l5=l2(l3,0),l6=l2(l4,0),l7=l5;for(;;){if(l6)if(l7){var mc=l7[4],mb=l7[3],ma=l7[2],l$=l6[4],l_=l6[3],l9=l6[2],l8=cQ(iK[1],l6[1],l7[1]);if(0===l8){var me=cQ(md,l9,ma);if(0===me){var mf=l2(mb,mc),mg=l2(l_,l$),l6=mg,l7=mf;continue;}var mh=me;}else var mh=l8;}else var mh=1;else var mh=l7?-1:0;return mh;}}function mU(mu,mj,mi){var mk=l2(mi,0),ml=l2(mj,0),mm=mk;for(;;){if(ml)if(mm){var ms=mm[4],mr=mm[3],mq=mm[2],mp=ml[4],mo=ml[3],mn=ml[2],mt=0===cQ(iK[1],ml[1],mm[1])?1:0;if(mt){var mv=cQ(mu,mn,mq);if(mv){var mw=l2(mr,ms),mx=l2(mo,mp),ml=mx,mm=mw;continue;}var my=mv;}else var my=mt;var mz=my;}else var mz=0;else var mz=mm?0:1;return mz;}}function mB(mA){if(mA){var mC=mA[1],mD=mB(mA[4]);return (mB(mC)+1|0)+mD|0;}return 0;}function mI(mE,mG){var mF=mE,mH=mG;for(;;){if(mH){var mL=mH[3],mK=mH[2],mJ=mH[1],mM=[0,[0,mK,mL],mI(mF,mH[4])],mF=mM,mH=mJ;continue;}return mF;}}return [0,mO,mP,mR,iP,iC,ju,li,mT,mU,jx,jY,j$,kj,lB,lK,mB,function(mN){return mI(0,mN);},jp,mS,jp,k5,mQ,jD,jN];}var nc=[0,bs];function nb(mW){var mX=1<=mW?mW:1,mY=dp<mX?dp:mX,mZ=caml_create_string(mY);return [0,mZ,0,mY,mZ];}function nd(m0){return dl(m0[1],0,m0[2]);}function m7(m1,m3){var m2=[0,m1[3]];for(;;){if(m2[1]<(m1[2]+m3|0)){m2[1]=2*m2[1]|0;continue;}if(dp<m2[1])if((m1[2]+m3|0)<=dp)m2[1]=dp;else m(br);var m4=caml_create_string(m2[1]);dm(m1[1],0,m4,0,m1[2]);m1[1]=m4;m1[3]=m2[1];return 0;}}function ne(m5,m8){var m6=m5[2];if(m5[3]<=m6)m7(m5,1);m5[1].safeSet(m6,m8);m5[2]=m6+1|0;return 0;}function nf(m$,m9){var m_=m9.getLen(),na=m$[2]+m_|0;if(m$[3]<na)m7(m$,m_);dm(m9,0,m$[1],m$[2],m_);m$[2]=na;return 0;}function nj(ng){return 0<=ng?ng:m(ce(a8,cf(ng)));}function nk(nh,ni){return nj(nh+ni|0);}var nl=cH(nk,1);function ns(nm){return dl(nm,0,nm.getLen());}function nu(nn,no,nq){var np=ce(a$,ce(nn,ba)),nr=ce(a_,ce(cf(no),np));return b5(ce(a9,ce(dj(1,nq),nr)));}function oi(nt,nw,nv){return nu(ns(nt),nw,nv);}function oj(nx){return b5(ce(bb,ce(ns(nx),bc)));}function nR(ny,nG,nI,nK){function nF(nz){if((ny.safeGet(nz)-48|0)<0||9<(ny.safeGet(nz)-48|0))return nz;var nA=nz+1|0;for(;;){var nB=ny.safeGet(nA);if(48<=nB){if(!(58<=nB)){var nD=nA+1|0,nA=nD;continue;}var nC=0;}else if(36===nB){var nE=nA+1|0,nC=1;}else var nC=0;if(!nC)var nE=nz;return nE;}}var nH=nF(nG+1|0),nJ=nb((nI-nH|0)+10|0);ne(nJ,37);var nL=nH,nM=c6(nK);for(;;){if(nL<=nI){var nN=ny.safeGet(nL);if(42===nN){if(nM){var nO=nM[2];nf(nJ,cf(nM[1]));var nP=nF(nL+1|0),nL=nP,nM=nO;continue;}throw [0,d,bd];}ne(nJ,nN);var nQ=nL+1|0,nL=nQ;continue;}return nd(nJ);}}function pJ(nX,nV,nU,nT,nS){var nW=nR(nV,nU,nT,nS);if(78!==nX&&110!==nX)return nW;nW.safeSet(nW.getLen()-1|0,117);return nW;}function ok(n4,oc,og,nY,of){var nZ=nY.getLen();function od(n0,ob){var n1=40===n0?41:125;function oa(n2){var n3=n2;for(;;){if(nZ<=n3)return cH(n4,nY);if(37===nY.safeGet(n3)){var n5=n3+1|0;if(nZ<=n5)var n6=cH(n4,nY);else{var n7=nY.safeGet(n5),n8=n7-40|0;if(n8<0||1<n8){var n9=n8-83|0;if(n9<0||2<n9)var n_=1;else switch(n9){case 1:var n_=1;break;case 2:var n$=1,n_=0;break;default:var n$=0,n_=0;}if(n_){var n6=oa(n5+1|0),n$=2;}}else var n$=0===n8?0:1;switch(n$){case 1:var n6=n7===n1?n5+1|0:j3(oc,nY,ob,n7);break;case 2:break;default:var n6=oa(od(n7,n5+1|0)+1|0);}}return n6;}var oe=n3+1|0,n3=oe;continue;}}return oa(ob);}return od(og,of);}function oJ(oh){return j3(ok,oj,oi,oh);}function oZ(ol,ow,oG){var om=ol.getLen()-1|0;function oH(on){var oo=on;a:for(;;){if(oo<om){if(37===ol.safeGet(oo)){var op=0,oq=oo+1|0;for(;;){if(om<oq)var or=oj(ol);else{var os=ol.safeGet(oq);if(58<=os){if(95===os){var ou=oq+1|0,ot=1,op=ot,oq=ou;continue;}}else if(32<=os)switch(os-32|0){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 0:case 3:case 11:case 13:var ov=oq+1|0,oq=ov;continue;case 10:var ox=j3(ow,op,oq,105),oq=ox;continue;default:var oy=oq+1|0,oq=oy;continue;}var oz=oq;c:for(;;){if(om<oz)var oA=oj(ol);else{var oB=ol.safeGet(oz);if(126<=oB)var oC=0;else switch(oB){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var oA=j3(ow,op,oz,105),oC=1;break;case 69:case 70:case 71:case 101:case 102:case 103:var oA=j3(ow,op,oz,102),oC=1;break;case 33:case 37:case 44:case 64:var oA=oz+1|0,oC=1;break;case 83:case 91:case 115:var oA=j3(ow,op,oz,115),oC=1;break;case 97:case 114:case 116:var oA=j3(ow,op,oz,oB),oC=1;break;case 76:case 108:case 110:var oD=oz+1|0;if(om<oD){var oA=j3(ow,op,oz,105),oC=1;}else{var oE=ol.safeGet(oD)-88|0;if(oE<0||32<oE)var oF=1;else switch(oE){case 0:case 12:case 17:case 23:case 29:case 32:var oA=cQ(oG,j3(ow,op,oz,oB),105),oC=1,oF=0;break;default:var oF=1;}if(oF){var oA=j3(ow,op,oz,105),oC=1;}}break;case 67:case 99:var oA=j3(ow,op,oz,99),oC=1;break;case 66:case 98:var oA=j3(ow,op,oz,66),oC=1;break;case 41:case 125:var oA=j3(ow,op,oz,oB),oC=1;break;case 40:var oA=oH(j3(ow,op,oz,oB)),oC=1;break;case 123:var oI=j3(ow,op,oz,oB),oK=j3(oJ,oB,ol,oI),oL=oI;for(;;){if(oL<(oK-2|0)){var oM=cQ(oG,oL,ol.safeGet(oL)),oL=oM;continue;}var oN=oK-1|0,oz=oN;continue c;}default:var oC=0;}if(!oC)var oA=oi(ol,oz,oB);}var or=oA;break;}}var oo=or;continue a;}}var oO=oo+1|0,oo=oO;continue;}return oo;}}oH(0);return 0;}function qY(o0){var oP=[0,0,0,0];function oY(oU,oV,oQ){var oR=41!==oQ?1:0,oS=oR?125!==oQ?1:0:oR;if(oS){var oT=97===oQ?2:1;if(114===oQ)oP[3]=oP[3]+1|0;if(oU)oP[2]=oP[2]+oT|0;else oP[1]=oP[1]+oT|0;}return oV+1|0;}oZ(o0,oY,function(oW,oX){return oW+1|0;});return oP[1];}function pF(o1,o4,o2){var o3=o1.safeGet(o2);if((o3-48|0)<0||9<(o3-48|0))return cQ(o4,0,o2);var o5=o3-48|0,o6=o2+1|0;for(;;){var o7=o1.safeGet(o6);if(48<=o7){if(!(58<=o7)){var o_=o6+1|0,o9=(10*o5|0)+(o7-48|0)|0,o5=o9,o6=o_;continue;}var o8=0;}else if(36===o7)if(0===o5){var o$=m(bf),o8=1;}else{var o$=cQ(o4,[0,nj(o5-1|0)],o6+1|0),o8=1;}else var o8=0;if(!o8)var o$=cQ(o4,0,o2);return o$;}}function pA(pa,pb){return pa?pb:cH(nl,pb);}function pp(pc,pd){return pc?pc[1]:pd;}function sj(rh,pf,rt,pi,q3,rz,pe){var pg=cH(pf,pe);function ri(ph){return cQ(pi,pg,ph);}function q2(pn,ry,pj,ps){var pm=pj.getLen();function qZ(rq,pk){var pl=pk;for(;;){if(pm<=pl)return cH(pn,pg);var po=pj.safeGet(pl);if(37===po){var pw=function(pr,pq){return caml_array_get(ps,pp(pr,pq));},pC=function(pE,px,pz,pt){var pu=pt;for(;;){var pv=pj.safeGet(pu)-32|0;if(!(pv<0||25<pv))switch(pv){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 10:return pF(pj,function(py,pD){var pB=[0,pw(py,px),pz];return pC(pE,pA(py,px),pB,pD);},pu+1|0);default:var pG=pu+1|0,pu=pG;continue;}var pH=pj.safeGet(pu);if(124<=pH)var pI=0;else switch(pH){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var pK=pw(pE,px),pL=caml_format_int(pJ(pH,pj,pl,pu,pz),pK),pN=pM(pA(pE,px),pL,pu+1|0),pI=1;break;case 69:case 71:case 101:case 102:case 103:var pO=pw(pE,px),pP=caml_format_float(nR(pj,pl,pu,pz),pO),pN=pM(pA(pE,px),pP,pu+1|0),pI=1;break;case 76:case 108:case 110:var pQ=pj.safeGet(pu+1|0)-88|0;if(pQ<0||32<pQ)var pR=1;else switch(pQ){case 0:case 12:case 17:case 23:case 29:case 32:var pS=pu+1|0,pT=pH-108|0;if(pT<0||2<pT)var pU=0;else{switch(pT){case 1:var pU=0,pV=0;break;case 2:var pW=pw(pE,px),pX=caml_format_int(nR(pj,pl,pS,pz),pW),pV=1;break;default:var pY=pw(pE,px),pX=caml_format_int(nR(pj,pl,pS,pz),pY),pV=1;}if(pV){var pZ=pX,pU=1;}}if(!pU){var p0=pw(pE,px),pZ=caml_int64_format(nR(pj,pl,pS,pz),p0);}var pN=pM(pA(pE,px),pZ,pS+1|0),pI=1,pR=0;break;default:var pR=1;}if(pR){var p1=pw(pE,px),p2=caml_format_int(pJ(110,pj,pl,pu,pz),p1),pN=pM(pA(pE,px),p2,pu+1|0),pI=1;}break;case 37:case 64:var pN=pM(px,dj(1,pH),pu+1|0),pI=1;break;case 83:case 115:var p3=pw(pE,px);if(115===pH)var p4=p3;else{var p5=[0,0],p6=0,p7=p3.getLen()-1|0;if(!(p7<p6)){var p8=p6;for(;;){var p9=p3.safeGet(p8),p_=14<=p9?34===p9?1:92===p9?1:0:11<=p9?13<=p9?1:0:8<=p9?1:0,p$=p_?2:caml_is_printable(p9)?1:4;p5[1]=p5[1]+p$|0;var qa=p8+1|0;if(p7!==p8){var p8=qa;continue;}break;}}if(p5[1]===p3.getLen())var qb=p3;else{var qc=caml_create_string(p5[1]);p5[1]=0;var qd=0,qe=p3.getLen()-1|0;if(!(qe<qd)){var qf=qd;for(;;){var qg=p3.safeGet(qf),qh=qg-34|0;if(qh<0||58<qh)if(-20<=qh)var qi=1;else{switch(qh+34|0){case 8:qc.safeSet(p5[1],92);p5[1]+=1;qc.safeSet(p5[1],98);var qj=1;break;case 9:qc.safeSet(p5[1],92);p5[1]+=1;qc.safeSet(p5[1],116);var qj=1;break;case 10:qc.safeSet(p5[1],92);p5[1]+=1;qc.safeSet(p5[1],110);var qj=1;break;case 13:qc.safeSet(p5[1],92);p5[1]+=1;qc.safeSet(p5[1],114);var qj=1;break;default:var qi=1,qj=0;}if(qj)var qi=0;}else var qi=(qh-1|0)<0||56<(qh-1|0)?(qc.safeSet(p5[1],92),p5[1]+=1,qc.safeSet(p5[1],qg),0):1;if(qi)if(caml_is_printable(qg))qc.safeSet(p5[1],qg);else{qc.safeSet(p5[1],92);p5[1]+=1;qc.safeSet(p5[1],48+(qg/100|0)|0);p5[1]+=1;qc.safeSet(p5[1],48+((qg/10|0)%10|0)|0);p5[1]+=1;qc.safeSet(p5[1],48+(qg%10|0)|0);}p5[1]+=1;var qk=qf+1|0;if(qe!==qf){var qf=qk;continue;}break;}}var qb=qc;}var p4=ce(bm,ce(qb,bn));}if(pu===(pl+1|0))var ql=p4;else{var qm=nR(pj,pl,pu,pz);try {var qn=0,qo=1;for(;;){if(qm.getLen()<=qo)var qp=[0,0,qn];else{var qq=qm.safeGet(qo);if(49<=qq)if(58<=qq)var qr=0;else{var qp=[0,caml_int_of_string(dl(qm,qo,(qm.getLen()-qo|0)-1|0)),qn],qr=1;}else{if(45===qq){var qt=qo+1|0,qs=1,qn=qs,qo=qt;continue;}var qr=0;}if(!qr){var qu=qo+1|0,qo=qu;continue;}}var qv=qp;break;}}catch(qw){if(qw[1]!==a)throw qw;var qv=nu(qm,0,115);}var qx=qv[1],qy=p4.getLen(),qz=0,qD=qv[2],qC=32;if(qx===qy&&0===qz){var qA=p4,qB=1;}else var qB=0;if(!qB)if(qx<=qy)var qA=dl(p4,qz,qy);else{var qE=dj(qx,qC);if(qD)dm(p4,qz,qE,0,qy);else dm(p4,qz,qE,qx-qy|0,qy);var qA=qE;}var ql=qA;}var pN=pM(pA(pE,px),ql,pu+1|0),pI=1;break;case 67:case 99:var qF=pw(pE,px);if(99===pH)var qG=dj(1,qF);else{if(39===qF)var qH=bO;else if(92===qF)var qH=bP;else{if(14<=qF)var qI=0;else switch(qF){case 8:var qH=bT,qI=1;break;case 9:var qH=bS,qI=1;break;case 10:var qH=bR,qI=1;break;case 13:var qH=bQ,qI=1;break;default:var qI=0;}if(!qI)if(caml_is_printable(qF)){var qJ=caml_create_string(1);qJ.safeSet(0,qF);var qH=qJ;}else{var qK=caml_create_string(4);qK.safeSet(0,92);qK.safeSet(1,48+(qF/100|0)|0);qK.safeSet(2,48+((qF/10|0)%10|0)|0);qK.safeSet(3,48+(qF%10|0)|0);var qH=qK;}}var qG=ce(bk,ce(qH,bl));}var pN=pM(pA(pE,px),qG,pu+1|0),pI=1;break;case 66:case 98:var qM=pu+1|0,qL=pw(pE,px)?bX:bW,pN=pM(pA(pE,px),qL,qM),pI=1;break;case 40:case 123:var qN=pw(pE,px),qO=j3(oJ,pH,pj,pu+1|0);if(123===pH){var qP=nb(qN.getLen()),qT=function(qR,qQ){ne(qP,qQ);return qR+1|0;};oZ(qN,function(qS,qV,qU){if(qS)nf(qP,be);else ne(qP,37);return qT(qV,qU);},qT);var qW=nd(qP),pN=pM(pA(pE,px),qW,qO),pI=1;}else{var qX=pA(pE,px),q0=nk(qY(qN),qX),pN=q2(function(q1){return qZ(q0,qO);},qX,qN,ps),pI=1;}break;case 33:cH(q3,pg);var pN=qZ(px,pu+1|0),pI=1;break;case 41:var pN=pM(px,bq,pu+1|0),pI=1;break;case 44:var pN=pM(px,bp,pu+1|0),pI=1;break;case 70:var q4=pw(pE,px);if(0===pz)var q5=bo;else{var q6=nR(pj,pl,pu,pz);if(70===pH)q6.safeSet(q6.getLen()-1|0,103);var q5=q6;}var q7=caml_classify_float(q4);if(3===q7)var q8=q4<0?bi:bh;else if(4<=q7)var q8=bj;else{var q9=caml_format_float(q5,q4),q_=0,q$=q9.getLen();for(;;){if(q$<=q_)var ra=ce(q9,bg);else{var rb=q9.safeGet(q_)-46|0,rc=rb<0||23<rb?55===rb?1:0:(rb-1|0)<0||21<(rb-1|0)?1:0;if(!rc){var rd=q_+1|0,q_=rd;continue;}var ra=q9;}var q8=ra;break;}}var pN=pM(pA(pE,px),q8,pu+1|0),pI=1;break;case 91:var pN=oi(pj,pu,pH),pI=1;break;case 97:var re=pw(pE,px),rf=cH(nl,pp(pE,px)),rg=pw(0,rf),rk=pu+1|0,rj=pA(pE,rf);if(rh)ri(cQ(re,0,rg));else cQ(re,pg,rg);var pN=qZ(rj,rk),pI=1;break;case 114:var pN=oi(pj,pu,pH),pI=1;break;case 116:var rl=pw(pE,px),rn=pu+1|0,rm=pA(pE,px);if(rh)ri(cH(rl,0));else cH(rl,pg);var pN=qZ(rm,rn),pI=1;break;default:var pI=0;}if(!pI)var pN=oi(pj,pu,pH);return pN;}},rs=pl+1|0,rp=0;return pF(pj,function(rr,ro){return pC(rr,rq,rp,ro);},rs);}cQ(rt,pg,po);var ru=pl+1|0,pl=ru;continue;}}function pM(rx,rv,rw){ri(rv);return qZ(rx,rw);}return qZ(ry,0);}var rA=cQ(q2,rz,nj(0)),rB=qY(pe);if(rB<0||6<rB){var rO=function(rC,rI){if(rB<=rC){var rD=caml_make_vect(rB,0),rG=function(rE,rF){return caml_array_set(rD,(rB-rE|0)-1|0,rF);},rH=0,rJ=rI;for(;;){if(rJ){var rK=rJ[2],rL=rJ[1];if(rK){rG(rH,rL);var rM=rH+1|0,rH=rM,rJ=rK;continue;}rG(rH,rL);}return cQ(rA,pe,rD);}}return function(rN){return rO(rC+1|0,[0,rN,rI]);};},rP=rO(0,0);}else switch(rB){case 1:var rP=function(rR){var rQ=caml_make_vect(1,0);caml_array_set(rQ,0,rR);return cQ(rA,pe,rQ);};break;case 2:var rP=function(rT,rU){var rS=caml_make_vect(2,0);caml_array_set(rS,0,rT);caml_array_set(rS,1,rU);return cQ(rA,pe,rS);};break;case 3:var rP=function(rW,rX,rY){var rV=caml_make_vect(3,0);caml_array_set(rV,0,rW);caml_array_set(rV,1,rX);caml_array_set(rV,2,rY);return cQ(rA,pe,rV);};break;case 4:var rP=function(r0,r1,r2,r3){var rZ=caml_make_vect(4,0);caml_array_set(rZ,0,r0);caml_array_set(rZ,1,r1);caml_array_set(rZ,2,r2);caml_array_set(rZ,3,r3);return cQ(rA,pe,rZ);};break;case 5:var rP=function(r5,r6,r7,r8,r9){var r4=caml_make_vect(5,0);caml_array_set(r4,0,r5);caml_array_set(r4,1,r6);caml_array_set(r4,2,r7);caml_array_set(r4,3,r8);caml_array_set(r4,4,r9);return cQ(rA,pe,r4);};break;case 6:var rP=function(r$,sa,sb,sc,sd,se){var r_=caml_make_vect(6,0);caml_array_set(r_,0,r$);caml_array_set(r_,1,sa);caml_array_set(r_,2,sb);caml_array_set(r_,3,sc);caml_array_set(r_,4,sd);caml_array_set(r_,5,se);return cQ(rA,pe,r_);};break;default:var rP=cQ(rA,pe,[0]);}return rP;}function sx(sg){function si(sf){return 0;}return sk(sj,0,function(sh){return sg;},cs,co,cz,si);}function st(sl){return nb(2*sl.getLen()|0);}function sq(so,sm){var sn=nd(sm);sm[2]=0;return cH(so,sn);}function sw(sp){var ss=cH(sq,sp);return sk(sj,1,st,ne,nf,function(sr){return 0;},ss);}function sy(sv){return cQ(sw,function(su){return su;},sv);}var sz=[0,0];function sN(sA,sB){var sC=sA[sB+1];if(caml_obj_is_block(sC)){if(caml_obj_tag(sC)===dx)return cQ(sy,aM,sC);if(caml_obj_tag(sC)===dw){var sD=caml_format_float(b0,sC),sE=0,sF=sD.getLen();for(;;){if(sF<=sE)var sG=ce(sD,bZ);else{var sH=sD.safeGet(sE),sI=48<=sH?58<=sH?0:1:45===sH?1:0;if(sI){var sJ=sE+1|0,sE=sJ;continue;}var sG=sD;}return sG;}}return aL;}return cQ(sy,aN,sC);}function sM(sK,sL){if(sK.length-1<=sL)return a7;var sO=sM(sK,sL+1|0);return j3(sy,a6,sN(sK,sL),sO);}function th(sQ){var sP=sz[1];for(;;){if(sP){var sV=sP[2],sR=sP[1];try {var sS=cH(sR,sQ),sT=sS;}catch(sW){var sT=0;}if(!sT){var sP=sV;continue;}var sU=sT[1];}else if(sQ[1]===b4)var sU=aW;else if(sQ[1]===b2)var sU=aV;else if(sQ[1]===b3){var sX=sQ[2],sY=sX[3],sU=sk(sy,g,sX[1],sX[2],sY,sY+5|0,aU);}else if(sQ[1]===d){var sZ=sQ[2],s0=sZ[3],sU=sk(sy,g,sZ[1],sZ[2],s0,s0+6|0,aT);}else if(sQ[1]===b1){var s1=sQ[2],s2=s1[3],sU=sk(sy,g,s1[1],s1[2],s2,s2+6|0,aS);}else{var s3=sQ.length-1,s6=sQ[0+1][0+1];if(s3<0||2<s3){var s4=sM(sQ,2),s5=j3(sy,aR,sN(sQ,1),s4);}else switch(s3){case 1:var s5=aP;break;case 2:var s5=cQ(sy,aO,sN(sQ,1));break;default:var s5=aQ;}var sU=ce(s6,s5);}return sU;}}function ti(te){var s7=caml_convert_raw_backtrace(caml_get_exception_raw_backtrace(0));if(s7){var s8=s7[1],s9=0,s_=s8.length-1-1|0;if(!(s_<s9)){var s$=s9;for(;;){if(caml_notequal(caml_array_get(s8,s$),a5)){var ta=caml_array_get(s8,s$),tb=0===ta[0]?ta[1]:ta[1],tc=tb?0===s$?a2:a1:0===s$?a0:aZ,td=0===ta[0]?sk(sy,aY,tc,ta[2],ta[3],ta[4],ta[5]):cQ(sy,aX,tc);j3(sx,te,a4,td);}var tf=s$+1|0;if(s_!==s$){var s$=tf;continue;}break;}}var tg=0;}else var tg=cQ(sx,te,a3);return tg;}32===dn;function tl(tk){var tj=[];caml_update_dummy(tj,[0,tj,tj]);return tj;}var tm=[0,aF],tp=42,tq=[0,mV([0,function(to,tn){return caml_compare(to,tn);}])[1]];function tu(tr){var ts=tr[1];{if(3===ts[0]){var tt=ts[1],tv=tu(tt);if(tv!==tt)tr[1]=[3,tv];return tv;}return tr;}}function ty(tw){return tu(tw);}var tz=[0,function(tx){th(tx);caml_ml_output_char(cg,10);ti(cg);cn(0);return caml_sys_exit(2);}];function tZ(tB,tA){try {var tC=cH(tB,tA);}catch(tD){return cH(tz[1],tD);}return tC;}function tO(tI,tE,tG){var tF=tE,tH=tG;for(;;)if(typeof tF==="number")return tJ(tI,tH);else switch(tF[0]){case 1:cH(tF[1],tI);return tJ(tI,tH);case 2:var tK=tF[1],tL=[0,tF[2],tH],tF=tK,tH=tL;continue;default:var tM=tF[1][1];return tM?(cH(tM[1],tI),tJ(tI,tH)):tJ(tI,tH);}}function tJ(tP,tN){return tN?tO(tP,tN[1],tN[2]):0;}function t1(tQ,tS){var tR=tQ,tT=tS;for(;;)if(typeof tR==="number")return tV(tT);else switch(tR[0]){case 1:var tU=tR[1];if(tU[4]){tU[4]=0;tU[1][2]=tU[2];tU[2][1]=tU[1];}return tV(tT);case 2:var tW=tR[1],tX=[0,tR[2],tT],tR=tW,tT=tX;continue;default:var tY=tR[2];tq[1]=tR[1];tZ(tY,0);return tV(tT);}}function tV(t0){return t0?t1(t0[1],t0[2]):0;}function t5(t3,t2){var t4=1===t2[0]?t2[1][1]===tm?(t1(t3[4],0),1):0:0;return tO(t2,t3[2],0);}var t6=[0,0],t7=[0,0,0];function us(t_,t8){var t9=[0,t8],t$=tu(t_),ua=t$[1];switch(ua[0]){case 1:if(ua[1][1]===tm){var ub=0,uc=1;}else var uc=0;break;case 2:var ud=ua[1];t$[1]=t9;var ue=tq[1],uf=t6[1]?1:(t6[1]=1,0);t5(ud,t9);if(uf){tq[1]=ue;var ug=0;}else for(;;){if(0!==t7[1]){if(0===t7[1])throw [0,nc];t7[1]=t7[1]-1|0;var uh=t7[2],ui=uh[2];if(ui===uh)t7[2]=0;else uh[2]=ui[2];var uj=ui[1];t5(uj[1],uj[2]);continue;}t6[1]=0;tq[1]=ue;var ug=0;break;}var ub=ug,uc=1;break;default:var uc=0;}if(!uc)var ub=b5(aG);return ub;}function uq(uk,ul){return typeof uk==="number"?ul:typeof ul==="number"?uk:[2,uk,ul];}function un(um){if(typeof um!=="number")switch(um[0]){case 2:var uo=um[1],up=un(um[2]);return uq(un(uo),up);case 1:break;default:if(!um[1][1])return 0;}return um;}var uu=[0,function(ur){return 0;}],ut=tl(0),ux=[0,0],uC=null,uD=Array;function uH(uB){var uv=1-(ut[2]===ut?1:0);if(uv){var uw=tl(0);uw[1][2]=ut[2];ut[2][1]=uw[1];uw[1]=ut[1];ut[1][2]=uw;ut[1]=ut;ut[2]=ut;ux[1]=0;var uy=uw[2];for(;;){var uz=uy!==uw?1:0;if(uz){if(uy[4])us(uy[3],0);var uA=uy[2],uy=uA;continue;}return uz;}}return uv;}var uG=undefined,uF=false;function uI(uE){return uE instanceof uD?0:[0,new MlWrappedString(uE.toString())];}sz[1]=[0,uI,sz[1]];function uL(uJ,uK){uJ.appendChild(uK);return 0;}var uM=this,uN=uM.document;function uV(uO,uP){return uO?cH(uP,uO[1]):0;}function uS(uR,uQ){return uR.createElement(uQ.toString());}function uW(uU,uT){return uS(uU,uT);}var uX=[0,785140586];function uZ(uY){return uW(uY,au);}this.HTMLElement===uG;var u0=2147483,u2=caml_js_get_console(0);uu[1]=function(u1){return 1===u1?(uM.setTimeout(caml_js_wrap_callback(uH),0),0):0;};function u4(u3){return u2.log(u3.toString());}tz[1]=function(u5){u4(ao);u4(th(u5));return ti(cg);};function u8(u7,u6){return 0===u6?1003109192:1===u6?u7:[0,748545537,[0,u7,u8(u7,u6-1|0)]];}var vz=ak.slice(),vy=[0,257,258,0],vx=303;function vA(u9){throw [0,dy,dN(u9,0)];}function vB(u_){throw [0,dy,dN(u_,0)];}function vC(u$){return 3901498;}function vD(va){return -941236332;}function vE(vb){return 15949;}function vF(vc){return 17064;}function vG(vd){return 3553395;}function vH(ve){return 3802040;}function vI(vf){return 15500;}function vJ(vg){return dN(vg,1);}function vK(vh){return [0,926224370,dN(vh,1)];}function vL(vi){return [0,974443759,[0,19065,[0,926224370,dN(vi,1)]]];}function vM(vj){var vk=dN(vj,2);return [0,974443759,[0,vk,dN(vj,0)]];}function vN(vl){var vm=dN(vl,2);return [0,-783405316,[0,vm,dN(vl,0)]];}function vO(vn){var vo=dN(vn,2);return [0,748545537,[0,vo,dN(vn,0)]];}function vP(vp){var vq=dN(vp,1);return u8(vq,dN(vp,0));}function vQ(vr){var vs=dN(vr,0);return caml_string_equal(vs,am)?19065:caml_string_equal(vs,al)?1003109192:[0,4298439,vs];}function vR(vt){var vu=dN(vt,2),vv=dN(vt,1);return [0,vv,vu,dN(vt,0)];}var vS=[0,[0,function(vw){return m(an);},vR,vQ,vP,vO,vN,vM,vL,vK,vJ,vI,vH,vG,vF,vE,vD,vC,vB,vA],vz,vy,aj,ai,ah,ag,af,ae,ad,vx,ac,ab,h0,aa,$];function v1(vU){var vT=0;for(;;){var vV=dv(i,vT,vU);if(vV<0||20<vV){cH(vU[1],vU);var vT=vV;continue;}switch(vV){case 1:var vX=vW(vU);break;case 2:var vX=1;break;case 3:var vY=vU[5],vZ=vU[6]-vY|0,v0=caml_create_string(vZ);caml_blit_string(vU[2],vY,v0,0,vZ);var vX=[0,v0];break;case 4:var vX=7;break;case 5:var vX=6;break;case 6:var vX=4;break;case 7:var vX=5;break;case 8:var vX=8;break;case 9:var vX=2;break;case 10:var vX=3;break;case 11:var vX=15;break;case 12:var vX=16;break;case 13:var vX=10;break;case 14:var vX=12;break;case 15:var vX=13;break;case 16:var vX=14;break;case 17:var vX=11;break;case 18:var vX=9;break;case 19:var vX=0;break;case 20:var vX=m(ce(_,dj(1,vU[2].safeGet(vU[5]))));break;default:var vX=v1(vU);}return vX;}}function vW(v3){var v2=25;for(;;){var v4=dv(i,v2,v3);if(v4<0||2<v4){cH(v3[1],v3);var v2=v4;continue;}switch(v4){case 1:var v5=0;break;case 2:var v5=vW(v3);break;default:var v5=1;}return v5;}}function v9(v6){if(typeof v6==="number")return 1003109192<=v6?Z:Y;var v7=v6[1];if(748545537<=v7){if(926224370<=v7){if(974443759<=v7){var v8=v6[2],v_=v9(v8[2]);return j3(sy,X,v9(v8[1]),v_);}return cQ(sy,W,v9(v6[2]));}if(748545556<=v7)return cQ(sy,V,v9(v6[2]));var v$=v6[2],wa=v9(v$[2]);return j3(sy,U,v9(v$[1]),wa);}if(4298439<=v7)return v6[2];var wb=v6[2],wc=v9(wb[2]);return j3(sy,T,v9(wb[1]),wc);}var wf=[0,function(we,wd){return caml_compare(we,wd);}],wg=mV(wf),wh=hZ(wf);function wk(wj,wi){return caml_compare(wj,wi);}var wl=hZ([0,cH(wg[8],wk)]),wm=hZ([0,wh[10]]),wp=hZ([0,function(wo,wn){return caml_compare(wo,wn);}]),ws=hZ([0,function(wr,wq){return caml_compare(wr,wq);}]),ww=hZ([0,function(wu,wt){var wv=cQ(wh[10],wu[1],wt[1]);return 0===wv?cQ(wp[10],wu[2],wt[2]):wv;}]);function wL(wA,wB){function wy(wx){if(wx){var wz=wy(wx[2]);return cb(cH(wA,wx[1]),wz);}return wx;}return wy(wB);}function wM(wF){var wD=wh[1];function wE(wC){return cH(wh[7],wC[1]);}return j3(ww[14],wE,wF,wD);}function wN(wK){var wI=wh[1];function wJ(wG,wH){return cH(wh[4],wG);}return j3(wg[11],wJ,wK,wI);}var wO=[0,L];function x8(wP){return [0,-783405316,[0,wP[1],wP[2]]];}function yg(wQ){return [0,748545537,[0,wQ[1],wQ[2]]];}function xc(wS,wR){var wT=wg[22],wX=wh[1];try {var wU=cQ(wT,wS,wR),wV=wU;}catch(wW){if(wW[1]!==c)throw wW;var wV=wX;}return wV;}function ya(wY){var wZ=wY[3],w0=wY[2],w1=wY[1],w5=wh[1];function w6(w2,w3){var w4=cQ(wh[4],w2[3],w3);return cQ(wh[4],w2[1],w4);}var w7=j3(ws[14],w6,w0,w5),w_=wg[1];function w$(w8){var w9=cH(wh[5],w8);return cQ(wg[4],w8,w9);}var xg=j3(wh[14],w$,w7,w_);function xh(xa,xd){var xb=xa[1],xe=xc(xb,xd),xf=cQ(wh[4],xa[3],xe);return j3(wg[4],xb,xf,xd);}var xi=j3(ws[14],xh,w0,xg);for(;;){var xu=wg[1],xv=function(xi){return function(xt,xq,xs){function xp(xj,xo){var xm=xc(xj,xi);function xn(xl,xk){return cQ(wh[4],xl,xk);}return j3(wh[14],xn,xm,xo);}var xr=j3(wh[14],xp,xq,xq);return j3(wg[4],xt,xr,xs);};}(xi),xw=j3(wg[11],xv,xi,xu);if(j3(wg[9],wh[11],xw,xi)){if(w1===wZ)return m(K);var xy=function(xx){return xx[1]===w1?1:0;},xz=cQ(ws[17],xy,w0),xA=cH(ws[20],xz);if(xA){var xB=xA[2],xC=xA[1],xD=xC[3],xE=xC[2];if(xB){var xI=xc(xD,xi),xL=c7(function(xH,xF){var xG=xc(xF[3],xi);return cQ(wh[8],xH,xG);},xI,xB),xM=function(xK){var xJ=xc(wZ,xi);return 1-cQ(wh[3],xK,xJ);},xN=cQ(wh[17],xM,xL);if(cH(wh[2],xN)){var xO=0,xP=0,xQ=[0,[0,w1,xE,xD],xB];for(;;){if(xQ){var xR=xQ[2],xS=xQ[1],xT=xS[3],xU=xc(xT,xi),xV=xc(xD,xi),xW=cQ(wh[8],xV,xU);if(xD===xT&&cH(wh[2],xW))throw [0,d,G];var xZ=function(xY){var xX=xc(wZ,xi);return 1-cQ(wh[3],xY,xX);};if(cQ(wh[16],xZ,xW)){var x0=[0,xS,xO],xO=x0,xQ=xR;continue;}var x1=[0,xS,xP],xP=x1,xQ=xR;continue;}var x2=c6(xP),x3=c6(xO);if(0===x2)throw [0,d,J];if(0===x3){if(x2){var x4=x2[2],x5=x2[1][2];if(x4){var x9=[0,4298439,x5];return c7(function(x7,x6){return x8([0,x7,[0,4298439,x6[2]]]);},x9,x4);}return [0,4298439,x5];}return m(I);}var x$=function(x_){return 1-c8(x_,x2);},yc=ya([0,w1,cQ(ws[17],x$,w0),wZ]),yd=function(yb){return 1-c8(yb,x3);};return x8([0,ya([0,w1,cQ(ws[17],yd,w0),wZ]),yc]);}}var ye=cH(wh[23],xN),yf=ya([0,ye,w0,wZ]);return yg([0,ya([0,w1,w0,ye]),yf]);}return xD===wZ?[0,4298439,xE]:yg([0,[0,4298439,xE],ya([0,xD,w0,wZ])]);}return m(H);}var xi=xw;continue;}}var yh=ww[7],yi=ww[9];function ym(yn,yj){if(typeof yj!=="number"){var yk=yj[1];if(!(748545537<=yk)){if(4298439<=yk){var zg=cH(wh[5],yn),zh=cQ(wh[4],yn+1|0,zg),zi=cH(wp[5],[0,yj[2],yn+1|0]),zj=[0,cH(wh[5],yn),zi],zk=cH(ww[5],zj),zl=cH(wh[5],yn+1|0);return [0,[0,zh,zk,yn,cH(wm[5],zl)],yn+2|0];}var zm=yj[2],zn=ym(yn,zm[1]),zo=ym(zn[2],zm[2]),zp=zo[1],zq=zn[1],zr=zp[3],zs=zp[2],zt=zq[3],zu=zq[2],zw=zo[2],zv=zp[4],zx=cQ(wh[6],zr,zp[1]),zy=cQ(wh[7],zq[1],zx),zE=wm[1],zD=zq[4],zF=function(zA){function zC(zz){var zB=cQ(wh[7],zA,zz);return cH(wm[4],zB);}return cQ(wm[14],zC,zv);},zH=j3(wm[14],zF,zD,zE),zI=function(zG){return cQ(wh[3],zt,zG[1]);},zJ=cQ(ww[17],zI,zu),zL=function(zK){return cQ(wh[3],zr,zK[1]);},zM=cQ(ww[17],zL,zs),zT=ww[1],zU=function(zN){var zP=zN[2];function zS(zO){var zQ=cQ(wp[7],zP,zO[2]),zR=[0,cH(wh[5],zt),zQ];return cH(ww[4],zR);}return cQ(ww[14],zS,zM);},zV=j3(ww[14],zU,zJ,zT);return [0,[0,zy,cQ(yh,cQ(yi,cQ(yi,cQ(yh,zu,zs),zM),zJ),zV),zt,zH],zw];}if(926224370<=yk){if(974443759<=yk){var yl=yj[2],yo=ym(yn,yl[1]),yp=ym(yo[2],yl[2]),yq=yp[1],yr=yo[1],ys=yq[3],yt=yq[2],yu=yr[3],yv=yp[2],yw=cQ(wh[6],ys,yq[1]),yx=cQ(wh[7],yr[1],yw),yz=cQ(wm[7],yr[4],yq[4]),yA=function(yy){return cQ(wh[3],ys,yy[1]);},yB=cQ(ww[17],yA,yt),yF=ww[1],yG=function(yC){var yD=yC[2],yE=[0,cH(wh[5],yu),yD];return cH(ww[4],yE);},yH=j3(ww[14],yG,yB,yF);return [0,[0,yx,cQ(yh,cQ(yi,cQ(yh,yr[2],yt),yB),yH),yu,yz],yv];}var yI=ym(yn,yj[2]),yJ=yI[1],yK=yJ[3],yL=yJ[4],yM=yJ[2],yO=yI[2],yP=function(yN){return cQ(wh[3],yK,yN[1]);},yQ=cQ(ww[17],yP,yM),yU=ww[1],yV=function(yS){function yT(yR){return cH(ww[4],[0,yS,yR[2]]);}return cQ(ww[14],yT,yQ);},yW=cQ(yh,yM,j3(wm[14],yV,yL,yU));return [0,[0,yJ[1],yW,yK,yL],yO];}if(!(748545556<=yk)){var yX=yj[2],yY=ym(yn,yX[1]),yZ=ym(yY[2],yX[2]),y0=yZ[1],y1=yY[1],y2=y0[3],y3=y0[2],y4=yZ[2],y5=cQ(wh[6],y2,y0[1]),y7=cQ(wh[7],y1[1],y5),y8=function(y6){return cQ(wh[3],y2,y6[1]);},y9=cQ(ww[17],y8,y3),zc=ww[1],zb=y1[4],zd=function(y$){function za(y_){return cH(ww[4],[0,y$,y_[2]]);}return cQ(ww[14],za,y9);},ze=j3(wm[14],zd,zb,zc),zf=cQ(yh,cQ(yi,cQ(yh,y1[2],y3),y9),ze);return [0,[0,y7,zf,y1[3],y0[4]],y4];}}return m(F);}function Cb(zW){return ym(0,zW)[1];}function Bl(z0,Bb,zX){var zY=zX[2],zZ=zX[1],z5=z0[2];function Ba(z1,A$){var z3=wN(z1);function z4(z2){return cQ(wh[12],z2[1],z3);}var z6=cQ(ww[17],z4,z5),Ar=[0,ww[1],0];function As(z7,Aq){return wL(function(z9){var z8=z7[1],z_=wM(z9),z$=cQ(wh[8],z8,z_),Aa=cH(wh[2],z$);if(Aa){var Ad=wh[1],Ae=function(Ab){var Ac=cQ(wg[22],Ab,z1);return cH(wh[4],Ac);},Af=j3(wh[14],Ae,z8,Ad),Ag=cQ(wh[12],Af,zZ);if(Ag){var Al=z7[2],Am=function(Ah){var Aj=Ah[1];function Ak(Ai){return caml_string_equal(Aj,Ai[1]);}return cQ(wp[16],Ak,zY);},An=cQ(wp[15],Am,Al),Ao=1;}else{var Ap=Ag,Ao=0;}}else{var Ap=Aa,Ao=0;}if(!Ao)var An=Ap;return An?[0,cQ(ww[4],z7,z9),[0,z9,0]]:[0,z9,0];},Aq);}var Ay=j3(ww[14],As,z6,Ar),A_=cQ(dk,function(At){var Av=wM(At);function Ax(Aw,Au){return cQ(wh[3],Au,zZ)?cQ(wh[3],Aw,Av):1;}return cQ(wg[12],Ax,z1);},Ay);return c7(function(A9,A7){var A5=cH(wl[5],z1);function A6(Az,A4){var A2=wl[1];function A3(AE,A1){var AA=Az[1];function AD(AB,AC){return 1-cQ(wh[3],AB,AA);}var AF=cQ(wg[14],AD,AE),AG=cH(wl[5],AF),AY=Az[2];function AZ(AH,AU){var AM=AH[2],AJ=AH[1],AL=wh[1];function AN(AI){return caml_string_equal(AJ,AI[1])?cH(wh[4],AI[2]):function(AK){return AK;};}var AO=j3(wp[14],AN,zY,AL),AW=wl[1];function AX(AQ){var AS=wl[1];function AT(AP){var AR=j3(wg[4],AM,AQ,AP);return cH(wl[4],AR);}var AV=j3(wl[14],AT,AU,AS);return cH(wl[7],AV);}return j3(wh[14],AX,AO,AW);}var A0=j3(wp[14],AZ,AY,AG);return cQ(wl[7],A0,A1);}return j3(wl[14],A3,A4,A2);}var A8=j3(ww[14],A6,A7,A5);return cQ(wl[7],A8,A9);},A$,A_);}var Bc=j3(wl[14],Ba,Bb[2],wl[1]),Be=cQ(wh[9],Bb[1],zZ);function Bf(Bd){return cH(wh[4],Bd[2]);}return [0,j3(wp[14],Bf,zY,Be),Bc];}function Dp(Bj,Bg){var Bh=Bg[4],Bi=Bg[3],Bk=Bj[3],Bn=Bj[4],Bm=Bj[2],Br=cH(Bl,[0,Bg[1],Bg[2],Bi,Bh]),Bs=hZ([0,function(Bp,Bo){var Bq=cQ(wh[10],Bp[1],Bo[1]);return 0===Bq?cQ(wl[10],Bp[2],Bo[2]):Bq;}]);function BJ(BI,Bw,Bt){var Bu=Bt[2],Bv=Bt[1];if(cQ(Bs[3],[0,Bv,Bu],Bw))return Bw;var By=cQ(Bs[4],[0,Bv,Bu],Bw),Bz=function(Bx){return cQ(wh[12],Bx[1],Bv);},B6=cQ(ww[17],Bz,Bm),B7=function(BA,BK){var BB=cQ(Br,[0,Bv,Bu],BA),BC=BB[2],BD=BB[1];if(cQ(wm[3],BD,Bn)){var BG=function(BE){var BF=wN(BE);return cQ(wm[3],BF,Bh);},BH=cQ(wl[16],BG,BC);}else var BH=1;if(BH)return BJ([0,BA,BI],BK,[0,BD,BC]);var BL=c6([0,BA,BI]),BM=0,BN=BL;for(;;){if(BN){var BP=BN[2],BO=BM+1|0,BM=BO,BN=BP;continue;}var BQ=ws[1],BR=0,BS=BL;for(;;){if(BS){var BT=BS[2],B3=BR+1|0,B2=BS[1][2],B4=function(BR,BT){return function(BU,B1){var BV=BR+1|0,BW=BT,BX=BU[2];for(;;){if(BW){if(!cQ(wh[3],BX,BW[1][1])){var B0=BW[2],BZ=BV+1|0,BV=BZ,BW=B0;continue;}var BY=BV;}else var BY=BM;return cQ(ws[4],[0,BR,BU[1],BY],B1);}};}(BR,BT),B5=j3(wp[14],B4,B2,BQ),BQ=B5,BR=B3,BS=BT;continue;}throw [0,wO,ya([0,0,BQ,BM])];}}};return j3(ww[14],B7,B6,By);}try {var B8=cQ(wg[5],Bi,Bk),B9=cH(wl[5],B8),B_=[0,cH(wh[5],Bk),B9];BJ(0,Bs[1],B_);var B$=0;}catch(Ca){if(Ca[1]===wO)return [0,Ca[2]];throw Ca;}return B$;}function Dq(Ce,Ch,Cg,Cd,Cc){var Cf=cQ(Ce,Cd,Cc);return Cf?[0,0,Ci(sy,B,Ch,Cg,v9(Cf[1]))]:[0,1,j3(sy,A,Ch,Cg)];}function Dr(CZ,C_,Cj){var Ct=[0],Cs=1,Cr=0,Cq=0,Cp=0,Co=0,Cn=0,Cm=Cj.getLen(),Cl=ce(Cj,bL),Cu=[0,function(Ck){Ck[9]=1;return 0;},Cl,Cm,Cn,Co,Cp,Cq,Cr,Cs,Ct,f,f],CB=dA[11],CA=dA[14],Cz=dA[6],Cy=dA[15],Cx=dA[7],Cw=dA[8],Cv=dA[16];dA[6]=dA[14]+1|0;dA[7]=2;dA[10]=Cu[12];try {var CC=0,CD=0;for(;;)switch(caml_parse_engine(vS,dA,CC,CD)){case 1:throw [0,dz];case 2:dJ(0);var CF=0,CE=2,CC=CE,CD=CF;continue;case 3:dJ(0);var CH=0,CG=3,CC=CG,CD=CH;continue;case 4:try {var CI=[0,4,cH(caml_array_get(vS[1],dA[13]),dA)],CJ=CI;}catch(CK){if(CK[1]!==dz)throw CK;var CJ=[0,5,0];}var CM=CJ[2],CL=CJ[1],CC=CL,CD=CM;continue;case 5:cH(vS[14],bK);var CO=0,CN=5,CC=CN,CD=CO;continue;default:var CP=v1(Cu);dA[9]=Cu[11];dA[10]=Cu[12];var CQ=1,CC=CQ,CD=CP;continue;}}catch(CS){var CR=dA[7];dA[11]=CB;dA[14]=CA;dA[6]=Cz;dA[15]=Cy;dA[7]=Cx;dA[8]=Cw;dA[16]=Cv;if(CS[1]===dy){var CT=CS[2],CU=CT[3],CV=CT[2],CW=CT[1],CX=v9(CU),CY=v9(CV),C0=cH(CZ,CU),C1=cH(CZ,CV),C8=function(C2){return [0,1-C2[1],C2[2]];},C9=function(C4,C3){var C6=ce(C4[2],C3[2]),C5=C4[1],C7=C5?C3[1]:C5;return [0,C7,C6];};if(17064<=CW)if(3802040<=CW)if(3901498<=CW){var C$=C8(Ci(C_,CY,CX,C1,C0)),Da=C$[2],Db=C$[1];if(Db)var Dc=[0,Db,Da];else{var Dd=C8(Ci(C_,CX,CY,C0,C1)),De=ce(Da,Dd[2]),Dc=[0,Dd[1],De];}var Df=Dc;}else var Df=Ci(C_,CY,CX,C1,C0);else if(3553395<=CW)var Df=Ci(C_,CX,CY,C0,C1);else{var Dg=C8(Ci(C_,CX,CY,C0,C1)),Df=C9(Ci(C_,CY,CX,C1,C0),Dg);}else if(15500===CW){var Dh=Ci(C_,CX,CY,C0,C1),Df=C9(Ci(C_,CY,CX,C1,C0),Dh);}else if(15949<=CW){var Di=Ci(C_,CX,CY,C0,C1),Df=C9(C8(Ci(C_,CY,CX,C1,C0)),Di);}else{var Dj=C8(Ci(C_,CX,CY,C0,C1)),Df=C9(C8(Ci(C_,CY,CX,C1,C0)),Dj);}var Dk=Df[1],Dm=Df[2],Dl=Dk?E:D,Dn=17064<=CW?3802040<=CW?3901498<=CW?S:R:3553395<=CW?Q:P:15500===CW?M:15949<=CW?O:N;return [0,Dk,sk(sy,C,CY,Dn,CX,Dl,Dm)];}dO[1]=function(Do){return caml_obj_is_block(Do)?caml_array_get(vS[3],caml_obj_tag(Do))===CR?1:0:caml_array_get(vS[2],Do)===CR?1:0;};throw CS;}}var D5=cQ(Dr,Cb,cH(Dq,Dp));function D4(Ds){function Dw(Dv,Dx,Dt){try {var Du=Ds.safeGet(Dt),Dy=10===Du?caml_string_equal(Dv,r)?Dw(q,Dx,Dt+1|0):Dw(p,[0,Dv,Dx],Dt+1|0):(j.safeSet(0,Du),Dw(ce(Dv,j),Dx,Dt+1|0));}catch(Dz){if(Dz[1]===b)return c6([0,Dv,Dx]);throw Dz;}return Dy;}return Dw(o,0,0);}function D6(DB,DA){try {var DC=cH(DB,DA);}catch(DD){if(DD[1]===dz)return s;throw DD;}return DC;}function Fb(Fa){var DE=uN.getElementById(y.toString());if(DE==uC)throw [0,d,z];var DF=uW(uN,as),DG=uW(uN,at),DH=uZ(uN),DI=0,DJ=0;for(;;){if(0===DJ&&0===DI){var DK=uS(uN,h),DL=1;}else var DL=0;if(!DL){var DM=uX[1];if(785140586===DM){try {var DN=uN.createElement(ax.toString()),DO=aw.toString(),DP=DN.tagName.toLowerCase()===DO?1:0,DQ=DP?DN.name===av.toString()?1:0:DP,DR=DQ;}catch(DT){var DR=0;}var DS=DR?982028505:-1003883683;uX[1]=DS;continue;}if(982028505<=DM){var DU=new uD();DU.push(aA.toString(),h.toString());uV(DJ,function(DV){DU.push(aB.toString(),caml_js_html_escape(DV),aC.toString());return 0;});uV(DI,function(DW){DU.push(aD.toString(),caml_js_html_escape(DW),aE.toString());return 0;});DU.push(az.toString());var DK=uN.createElement(DU.join(ay.toString()));}else{var DX=uS(uN,h);uV(DJ,function(DY){return DX.type=DY;});uV(DI,function(DZ){return DX.name=DZ;});var DK=DX;}}DK.rows=20;DK.cols=50;DK.value=n.toString();var D0=uZ(uN);D0.style.border=x.toString();D0.style.padding=w.toString();D0.style.width=v.toString();uL(DE,DF);uL(DF,DG);uL(DG,DH);uL(DH,DK);uL(DG,D0);var En=function(D2,Ej){var D1=new MlWrappedString(DK.value);if(caml_string_notequal(D1,D2)){try {var D3=uW(uN,ap),D7=D4(D1),D$=cJ(cH(D6,D5),D7),Eb=wL(function(D8){var D9=D8[2],D_=caml_string_notequal(D9,t);return D_?D4(D9):D_;},D$),Ec=cJ(function(Ea){return Ea.toString();},Eb);for(;;){if(Ec){var Ef=Ec[2],Ee=Ec[1],Ed=uW(uN,ar);Ed.innerHTML=Ee;uL(D3,Ed);uL(D3,uW(uN,aq));var Ec=Ef;continue;}var Eg=D0.firstChild;if(Eg!=uC)D0.removeChild(Eg);uL(D0,D3);break;}}catch(Ei){}var Eh=20;}else{var Ek=Ej-1|0,El=0,Em=caml_greaterequal(El,Ek)?El:Ek,Eh=Em;}function Ep(Eo){return En(D1,Eh);}var Eq=0===Eh?0.5:0.1,Er=[0,[2,[0,1,0,0,0]]],Es=[0,0];function Ex(Et,Ez){var Eu=u0<Et?[0,u0,Et-u0]:[0,Et,0],Ev=Eu[2],Ey=Eu[1],Ew=Ev==0?cH(us,Er):cH(Ex,Ev);Es[1]=[0,uM.setTimeout(caml_js_wrap_callback(Ew),Ey*1e3)];return 0;}Ex(Eq,0);function EC(EB){var EA=Es[1];return EA?uM.clearTimeout(EA[1]):0;}var ED=ty(Er)[1];switch(ED[0]){case 1:var EE=ED[1][1]===tm?(tZ(EC,0),1):0;break;case 2:var EF=ED[1],EG=[0,tq[1],EC],EH=EF[4],EI=typeof EH==="number"?EG:[2,EG,EH];EF[4]=EI;var EE=1;break;default:var EE=0;}var EJ=ty(Er),EK=EJ[1];switch(EK[0]){case 1:var EL=[0,EK];break;case 2:var EM=EK[1],EN=[0,[2,[0,[0,[0,EJ]],0,0,0]]],EP=tq[1],E9=[1,function(EO){switch(EO[0]){case 0:var EQ=EO[1];tq[1]=EP;try {var ER=Ep(EQ),ES=ER;}catch(ET){var ES=[0,[1,ET]];}var EU=ty(EN),EV=ty(ES),EW=EU[1];{if(2===EW[0]){var EX=EW[1];if(EU===EV)var EY=0;else{var EZ=EV[1];if(2===EZ[0]){var E0=EZ[1];EV[1]=[3,EU];EX[1]=E0[1];var E1=uq(EX[2],E0[2]),E2=EX[3]+E0[3]|0;if(tp<E2){EX[3]=0;EX[2]=un(E1);}else{EX[3]=E2;EX[2]=E1;}var E3=E0[4],E4=EX[4],E5=typeof E4==="number"?E3:typeof E3==="number"?E4:[2,E4,E3];EX[4]=E5;var EY=0;}else{EU[1]=EZ;var EY=t5(EX,EZ);}}return EY;}throw [0,d,aH];}case 1:var E6=ty(EN),E7=E6[1];{if(2===E7[0]){var E8=E7[1];E6[1]=EO;return t5(E8,EO);}throw [0,d,aI];}default:throw [0,d,aK];}}],E_=EM[2],E$=typeof E_==="number"?E9:[2,E9,E_];EM[2]=E$;var EL=EN;break;case 3:throw [0,d,aJ];default:var EL=Ep(EK[1]);}return EL;};En(u,0);return uF;}}uM.onload=caml_js_wrap_callback(function(Fc){if(Fc){var Fd=Fb(Fc);if(!(Fd|0))Fc.preventDefault();return Fd;}var Fe=event,Ff=Fb(Fe);if(!(Ff|0))Fe.returnValue=Ff;return Ff;});cn(0);return;}());
