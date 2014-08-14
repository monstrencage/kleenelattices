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
function caml_js_eval_string () {return eval(arguments[0].toString());}
function caml_js_from_array(a) { return a.slice(1); }
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
(function(){function uj(Kf,Kg,Kh,Ki,Kj,Kk,Kl){return Kf.length==6?Kf(Kg,Kh,Ki,Kj,Kk,Kl):caml_call_gen(Kf,[Kg,Kh,Ki,Kj,Kk,Kl]);}function Ff(J$,Ka,Kb,Kc,Kd,Ke){return J$.length==5?J$(Ka,Kb,Kc,Kd,Ke):caml_call_gen(J$,[Ka,Kb,Kc,Kd,Ke]);}function Fg(J6,J7,J8,J9,J_){return J6.length==4?J6(J7,J8,J9,J_):caml_call_gen(J6,[J7,J8,J9,J_]);}function l2(J2,J3,J4,J5){return J2.length==3?J2(J3,J4,J5):caml_call_gen(J2,[J3,J4,J5]);}function d0(JZ,J0,J1){return JZ.length==2?JZ(J0,J1):caml_call_gen(JZ,[J0,J1]);}function dN(JX,JY){return JX.length==1?JX(JY):caml_call_gen(JX,[JY]);}var a=[0,new MlString("Failure")],b=[0,new MlString("Invalid_argument")],c=[0,new MlString("Not_found")],d=[0,new MlString("Assert_failure")],e=[0,new MlString(""),0,0,-1],f=[0,new MlString(""),1,0,0],g=new MlString("File \"%s\", line %d, characters %d-%d: %s"),h=[0,new MlString("\0\0\xeb\xff\xec\xff\x02\0\x1e\0L\0\xf5\xff\xf6\xff\xf7\xff\xf8\xff\xf9\xff\xfa\xff\xfb\xffM\0\xfd\xff\x0b\0\xbf\0\xfe\xff\x03\0 \0\xf4\xff\xf3\xff\xef\xff\xf2\xff\xee\xff\x01\0\xfd\xff\xfe\xff\xff\xff"),new MlString("\xff\xff\xff\xff\xff\xff\x0f\0\x0e\0\x12\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x03\0\xff\xff\x14\0\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString("\x01\0\0\0\0\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\xff\xff\xff\xff\0\0\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\x1a\0\0\0\0\0\0\0"),new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\x0e\0\x1c\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\b\0\0\0\x07\0\x06\0\f\0\x0b\0\x10\0\0\0\t\0\x0f\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x11\0\0\0\x04\0\x05\0\x03\0\x18\0\x15\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x17\0\x16\0\x14\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x12\0\n\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\x13\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x10\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x02\0\x1b\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"),new MlString("\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\0\0\x19\0\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x0f\0\xff\xff\0\0\0\0\0\0\x03\0\x12\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x13\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x05\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\x05\0\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x10\0\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\x19\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString("")],i=new MlString("draw"),j=new MlString("details"),k=new MlString(" "),l=new MlString("(a|b)+.C & d > d & a.b.C & (d|a)\n");caml_register_global(6,c);caml_register_global(5,[0,new MlString("Division_by_zero")]);caml_register_global(3,b);caml_register_global(2,a);var c8=[0,new MlString("Out_of_memory")],c7=[0,new MlString("Match_failure")],c6=[0,new MlString("Stack_overflow")],c5=[0,new MlString("Undefined_recursive_module")],c4=new MlString("%.12g"),c3=new MlString("."),c2=new MlString("%d"),c1=new MlString("true"),c0=new MlString("false"),cZ=new MlString("Pervasives.do_at_exit"),cY=new MlString("Array.blit"),cX=new MlString("\\b"),cW=new MlString("\\t"),cV=new MlString("\\n"),cU=new MlString("\\r"),cT=new MlString("\\\\"),cS=new MlString("\\'"),cR=new MlString(""),cQ=new MlString("String.blit"),cP=new MlString("String.sub"),cO=new MlString(""),cN=new MlString("syntax error"),cM=new MlString("Parsing.YYexit"),cL=new MlString("Parsing.Parse_error"),cK=new MlString("Set.remove_min_elt"),cJ=[0,0,0,0],cI=[0,0,0],cH=new MlString("Set.bal"),cG=new MlString("Set.bal"),cF=new MlString("Set.bal"),cE=new MlString("Set.bal"),cD=new MlString("Map.remove_min_elt"),cC=[0,0,0,0],cB=[0,new MlString("map.ml"),270,10],cA=[0,0,0],cz=new MlString("Map.bal"),cy=new MlString("Map.bal"),cx=new MlString("Map.bal"),cw=new MlString("Map.bal"),cv=new MlString("Queue.Empty"),cu=new MlString("Buffer.add: cannot grow buffer"),ct=new MlString(""),cs=new MlString(""),cr=new MlString("%.12g"),cq=new MlString("\""),cp=new MlString("\""),co=new MlString("'"),cn=new MlString("'"),cm=new MlString("nan"),cl=new MlString("neg_infinity"),ck=new MlString("infinity"),cj=new MlString("."),ci=new MlString("printf: bad positional specification (0)."),ch=new MlString("%_"),cg=[0,new MlString("printf.ml"),143,8],cf=new MlString("'"),ce=new MlString("Printf: premature end of format string '"),cd=new MlString("'"),cc=new MlString(" in format string '"),cb=new MlString(", at char number "),ca=new MlString("Printf: bad conversion %"),b$=new MlString("Sformat.index_of_int: negative argument "),b_=new MlString(""),b9=new MlString(", %s%s"),b8=[1,1],b7=new MlString("%s\n"),b6=new MlString("(Program not linked with -g, cannot print stack backtrace)\n"),b5=new MlString("Raised at"),b4=new MlString("Re-raised at"),b3=new MlString("Raised by primitive operation at"),b2=new MlString("Called from"),b1=new MlString("%s file \"%s\", line %d, characters %d-%d"),b0=new MlString("%s unknown location"),bZ=new MlString("Out of memory"),bY=new MlString("Stack overflow"),bX=new MlString("Pattern matching failed"),bW=new MlString("Assertion failed"),bV=new MlString("Undefined recursive module"),bU=new MlString("(%s%s)"),bT=new MlString(""),bS=new MlString(""),bR=new MlString("(%s)"),bQ=new MlString("%d"),bP=new MlString("%S"),bO=new MlString("_"),bN=[0,new MlString("src/core/lwt.ml"),648,20],bM=[0,new MlString("src/core/lwt.ml"),651,8],bL=[0,new MlString("src/core/lwt.ml"),498,8],bK=[0,new MlString("src/core/lwt.ml"),487,9],bJ=new MlString("Lwt.wakeup_result"),bI=new MlString("Lwt.Canceled"),bH=new MlString("\""),bG=new MlString(" name=\""),bF=new MlString("\""),bE=new MlString(" type=\""),bD=new MlString("<"),bC=new MlString(">"),bB=new MlString(""),bA=new MlString("<input name=\"x\">"),bz=new MlString("input"),by=new MlString("x"),bx=new MlString("code"),bw=new MlString("td"),bv=new MlString("tr"),bu=new MlString("table"),bt=new MlString("a"),bs=new MlString("br"),br=new MlString("pre"),bq=new MlString("p"),bp=new MlString("div"),bo=new MlString("textarea"),bn=new MlString("input"),bm=new MlString("Exception during Lwt.async: "),bl=new MlString("parser"),bk=new MlString("1"),bj=new MlString("0"),bi=[0,0,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,0],bh=new MlString("\xff\xff\x02\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\0\0\0\0"),bg=new MlString("\x02\0\x03\0\x01\0\x02\0\x03\0\x03\0\x03\0\x02\0\x02\0\x03\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x02\0\x02\0"),bf=new MlString("\0\0\0\0\0\0\0\0\x02\0\0\0\0\0\0\0\x12\0\0\0\x03\0\0\0\0\0\b\0\x07\0\0\0\n\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\0\0\t\0\0\0\0\0\0\0\0\0"),be=new MlString("\x03\0\x06\0\b\0\x17\0"),bd=new MlString("\x05\0\x01\xff\x01\xff\0\0\0\0\x01\xff\n\xff\x18\xff\0\0'\xff\0\0\x01\xff\x01\xff\0\0\0\0\x01\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x01\xff\0\x000\xff<\xff4\xff\n\xff"),bc=new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x1d\0\x01\0\x0f\0\b\0"),bb=new MlString("\0\0\xfe\xff\0\0\0\0"),ba=new MlString("\x07\0\x04\0\x04\0\t\0\x11\0\x05\0\x01\0\x02\0\x01\0\x19\0\x1a\0\0\0\n\0\x1b\0\0\0\x05\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x1c\0\0\0\0\0\0\0\0\0\n\0\0\0\0\0\x06\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\x11\0\x12\0\x13\0\x14\0\x15\0\n\0\x16\0\0\0\x18\0\x0b\0\f\0\r\0\x0e\0\x0f\0\n\0\0\0\0\0\0\0\n\0\f\0\r\0\x0e\0\x0f\0\f\0\r\0\x0e\0\n\0\0\0\0\0\0\0\0\0\0\0\r\0\x0e\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x04\0\0\0\0\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\0\0\x04\0\x05\0\x05\0\0\0\0\0\0\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\0\0\x05\0\x06\0\x06\0\0\0\0\0\0\0\0\0\x06\0\x06\0\x06\0\x06\0\x06\0\x06\0\0\0\x06\0"),a$=new MlString("\x02\0\0\0\x01\x01\x05\0\0\0\x04\x01\x01\0\x02\0\0\0\x0b\0\f\0\xff\xff\x02\x01\x0f\0\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x17\0\xff\xff\xff\xff\xff\xff\xff\xff\x02\x01\xff\xff\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\x02\x01\x12\x01\xff\xff\x05\x01\x06\x01\x07\x01\b\x01\t\x01\n\x01\x02\x01\xff\xff\xff\xff\xff\xff\x02\x01\x07\x01\b\x01\t\x01\n\x01\x07\x01\b\x01\t\x01\x02\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\b\x01\t\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x05\x01\x06\x01\x07\x01\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\xff\xff\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01"),a_=new MlString("EOF\0NEWLINE\0LPAR\0RPAR\0PLUS\0DOT\0PSTAR\0STAR\0INTER\0EGAL\0LEQ\0GEQ\0LT\0GT\0IMCOMP\0DUNNO\0DIFF\0"),a9=new MlString("VAR\0POWER\0"),a8=new MlString("lexing error"),a7=new MlString("\xc3\xb8"),a6=new MlString("\xce\xb5"),a5=new MlString("(%s | %s)"),a4=new MlString("(%s)+"),a3=new MlString("(%s)~"),a2=new MlString("%s.%s"),a1=new MlString("(%s & %s)"),a0=new MlString("=/="),aZ=new MlString("<="),aY=new MlString(">="),aX=new MlString("<"),aW=new MlString(">"),aV=new MlString("<>"),aU=new MlString("="),aT=new MlString(","),aS=new MlString("{%s}"),aR=new MlString(","),aQ=new MlString("{%s}"),aP=new MlString(","),aO=new MlString("{%s}"),aN=new MlString("%d -> %s"),aM=new MlString(","),aL=new MlString("(%s)"),aK=new MlString("Tools.ContreExemple"),aJ=new MlString("get_expr : empty word"),aI=[0,new MlString("word.ml"),134,4],aH=new MlString("get_expr : stuck"),aG=new MlString("get_expr : stuck"),aF=[0,new MlString("word.ml"),84,15],aE=new MlString("(%s,%s)"),aD=new MlString(",\n"),aC=new MlString("{%s}"),aB=new MlString("Petri.trad : unsupported operation"),aA=new MlString("OK"),az=new MlString("Incorrect"),ay=new MlString("%s %s %s --------- %s"),ax=new MlString("\n%s <= %s -- false (%d pairs)\nWitness: %s"),aw=new MlString("\n%s <= %s -- true (%d pairs)"),av=new MlString("solve"),au=new MlString(""),at=new MlString(""),as=new MlString(""),ar=new MlString("Automaton for : "),aq=new MlString("Automaton for : "),ap=new MlString("new vis.Network(document.getElementById('%s_auto%d'),data, {})"),ao=new MlString("drawin"),an=new MlString("_auto1"),am=new MlString("auto"),al=new MlString("_auto2"),ak=new MlString("auto"),aj=new MlString("output"),ai=new MlString("_auto"),ah=new MlString("auto"),ag=new MlString("center"),af=new MlString("drawin"),ae=new MlString("new vis.Network(document.getElementById('%s_auto'),data, {})"),ad=new MlString("Final states : %s"),ac=new MlString("arrow"),ab=new MlString("25"),aa=new MlString("arrow-center"),$=new MlString("circle"),_=new MlString("%d"),Z=new MlString("%d"),Y=new MlString("circle"),X=new MlString("%d"),W=new MlString("%d"),V=new MlString("box"),U=new MlString("   %d   "),T=new MlString("%d"),S=new MlString("output"),R=new MlString("solvein"),Q=new MlString(""),P=new MlString(""),O=new MlString("Result:"),N=new MlString("\n%s"),M=new MlString(""),L=new MlString("\n%s"),K=new MlString(""),J=new MlString(""),I=new MlString("%s\n%s\n"),H=[0,0,new MlString(""),0],G=new MlString(""),F=new MlString(""),E=new MlString("Wmain.NotDefined"),D=new MlString("(a|b)+.C & d | e.(a|b)"),C=new MlString("#D2E5FF"),B=new MlString("#2B7CE9"),A=new MlString("#97C2FC"),z=new MlString("#2B7CE9"),y=new MlString("#A1EC76"),x=new MlString("#41A906"),w=new MlString("#7BE141"),v=new MlString("#41A906"),u=new MlString("#D3BDF0"),t=new MlString("#7C29F0"),s=new MlString("#AD85E4"),r=new MlString("#7C29F0");function q(m){throw [0,a,m];}function c9(n){throw [0,b,n];}function c_(p,o){return caml_greaterequal(p,o)?p:o;}function dj(c$,db){var da=c$.getLen(),dc=db.getLen(),dd=caml_create_string(da+dc|0);caml_blit_string(c$,0,dd,0,da);caml_blit_string(db,0,dd,da,dc);return dd;}function dk(de){return caml_format_int(c2,de);}function dg(df,dh){if(df){var di=df[1];return [0,di,dg(df[2],dh)];}return dh;}var dl=caml_ml_open_descriptor_out(2);function du(dn,dm){return caml_ml_output(dn,dm,0,dm.getLen());}function dt(ds){var dp=caml_ml_out_channels_list(0);for(;;){if(dp){var dq=dp[2];try {}catch(dr){}var dp=dq;continue;}return 0;}}caml_register_named_value(cZ,dt);function dy(dw,dv){return caml_ml_output_char(dw,dv);}function dF(dx){return caml_ml_flush(dx);}function dE(dB,dA,dD,dC,dz){if(0<=dz&&0<=dA&&!((dB.length-1-dz|0)<dA)&&0<=dC&&!((dD.length-1-dz|0)<dC))return caml_array_blit(dB,dA,dD,dC,dz);return c9(cY);}function ee(dG){var dH=dG,dI=0;for(;;){if(dH){var dJ=dH[2],dK=[0,dH[1],dI],dH=dJ,dI=dK;continue;}return dI;}}function dP(dM,dL){if(dL){var dO=dL[2],dQ=dN(dM,dL[1]);return [0,dQ,dP(dM,dO)];}return 0;}function ef(dT,dR){var dS=dR;for(;;){if(dS){var dU=dS[2];dN(dT,dS[1]);var dS=dU;continue;}return 0;}}function eg(dZ,dV,dX){var dW=dV,dY=dX;for(;;){if(dY){var d1=dY[2],d2=d0(dZ,dW,dY[1]),dW=d2,dY=d1;continue;}return dW;}}function eh(d5,d3){var d4=d3;for(;;){if(d4){var d6=d4[2],d7=0===caml_compare(d4[1],d5)?1:0;if(d7)return d7;var d4=d6;continue;}return 0;}}function eF(ec){return dN(function(d8,d_){var d9=d8,d$=d_;for(;;){if(d$){var ea=d$[2],eb=d$[1];if(dN(ec,eb)){var ed=[0,eb,d9],d9=ed,d$=ea;continue;}var d$=ea;continue;}return ee(d9);}},0);}function eE(ei,ek){var ej=caml_create_string(ei);caml_fill_string(ej,0,ei,ek);return ej;}function eG(en,el,em){if(0<=el&&0<=em&&!((en.getLen()-em|0)<el)){var eo=caml_create_string(em);caml_blit_string(en,el,eo,0,em);return eo;}return c9(cP);}function eH(er,eq,et,es,ep){if(0<=ep&&0<=eq&&!((er.getLen()-ep|0)<eq)&&0<=es&&!((et.getLen()-ep|0)<es))return caml_blit_string(er,eq,et,es,ep);return c9(cQ);}function eI(eA,eu){if(eu){var ev=eu[1],ew=[0,0],ex=[0,0],ez=eu[2];ef(function(ey){ew[1]+=1;ex[1]=ex[1]+ey.getLen()|0;return 0;},eu);var eB=caml_create_string(ex[1]+caml_mul(eA.getLen(),ew[1]-1|0)|0);caml_blit_string(ev,0,eB,0,ev.getLen());var eC=[0,ev.getLen()];ef(function(eD){caml_blit_string(eA,0,eB,eC[1],eA.getLen());eC[1]=eC[1]+eA.getLen()|0;caml_blit_string(eD,0,eB,eC[1],eD.getLen());eC[1]=eC[1]+eD.getLen()|0;return 0;},ez);return eB;}return cR;}var eJ=caml_sys_const_word_size(0),eK=caml_mul(eJ/8|0,(1<<(eJ-10|0))-1|0)-1|0,e3=252,e2=253;function e1(eN,eM,eL){var eO=caml_lex_engine(eN,eM,eL);if(0<=eO){eL[11]=eL[12];var eP=eL[12];eL[12]=[0,eP[1],eP[2],eP[3],eL[4]+eL[6]|0];}return eO;}function e4(eQ){var e0=[0],eZ=1,eY=0,eX=0,eW=0,eV=0,eU=0,eT=eQ.getLen(),eS=dj(eQ,cO);return [0,function(eR){eR[9]=1;return 0;},eS,eT,eU,eV,eW,eX,eY,eZ,e0,f,f];}var e5=[0,cM],e6=[0,cL],e7=[0,caml_make_vect(100,0),caml_make_vect(100,0),caml_make_vect(100,e),caml_make_vect(100,e),100,0,0,0,e,e,0,0,0,0,0,0];function fe(fc){var e8=e7[5],e9=e8*2|0,e_=caml_make_vect(e9,0),e$=caml_make_vect(e9,0),fa=caml_make_vect(e9,e),fb=caml_make_vect(e9,e);dE(e7[1],0,e_,0,e8);e7[1]=e_;dE(e7[2],0,e$,0,e8);e7[2]=e$;dE(e7[3],0,fa,0,e8);e7[3]=fa;dE(e7[4],0,fb,0,e8);e7[4]=fb;e7[5]=e9;return 0;}var fI=[0,function(fd){return 0;}];function fM(fq,fm,fC,fn){var fl=e7[11],fk=e7[14],fj=e7[6],fi=e7[15],fh=e7[7],fg=e7[8],ff=e7[16];e7[6]=e7[14]+1|0;e7[7]=fm;e7[10]=fn[12];try {var fo=0,fp=0;for(;;)switch(caml_parse_engine(fq,e7,fo,fp)){case 1:throw [0,e6];case 2:fe(0);var fs=0,fr=2,fo=fr,fp=fs;continue;case 3:fe(0);var fu=0,ft=3,fo=ft,fp=fu;continue;case 4:try {var fv=[0,4,dN(caml_array_get(fq[1],e7[13]),e7)],fw=fv;}catch(fx){if(fx[1]!==e6)throw fx;var fw=[0,5,0];}var fz=fw[2],fy=fw[1],fo=fy,fp=fz;continue;case 5:dN(fq[14],cN);var fB=0,fA=5,fo=fA,fp=fB;continue;default:var fD=dN(fC,fn);e7[9]=fn[11];e7[10]=fn[12];var fE=1,fo=fE,fp=fD;continue;}}catch(fG){var fF=e7[7];e7[11]=fl;e7[14]=fk;e7[6]=fj;e7[15]=fi;e7[7]=fh;e7[8]=fg;e7[16]=ff;if(fG[1]===e5)return fG[2];fI[1]=function(fH){return caml_obj_is_block(fH)?caml_array_get(fq[3],caml_obj_tag(fH))===fF?1:0:caml_array_get(fq[2],fH)===fF?1:0;};throw fG;}}function fN(fJ,fK){return caml_array_get(fJ[2],fJ[11]-fK|0);}function j1(fL){return 0;}function j0(gj){function f2(fO){return fO?fO[4]:0;}function f4(fP,fU,fR){var fQ=fP?fP[4]:0,fS=fR?fR[4]:0,fT=fS<=fQ?fQ+1|0:fS+1|0;return [0,fP,fU,fR,fT];}function gn(fV,f5,fX){var fW=fV?fV[4]:0,fY=fX?fX[4]:0;if((fY+2|0)<fW){if(fV){var fZ=fV[3],f0=fV[2],f1=fV[1],f3=f2(fZ);if(f3<=f2(f1))return f4(f1,f0,f4(fZ,f5,fX));if(fZ){var f7=fZ[2],f6=fZ[1],f8=f4(fZ[3],f5,fX);return f4(f4(f1,f0,f6),f7,f8);}return c9(cH);}return c9(cG);}if((fW+2|0)<fY){if(fX){var f9=fX[3],f_=fX[2],f$=fX[1],ga=f2(f$);if(ga<=f2(f9))return f4(f4(fV,f5,f$),f_,f9);if(f$){var gc=f$[2],gb=f$[1],gd=f4(f$[3],f_,f9);return f4(f4(fV,f5,gb),gc,gd);}return c9(cF);}return c9(cE);}var ge=fY<=fW?fW+1|0:fY+1|0;return [0,fV,f5,fX,ge];}function gm(gk,gf){if(gf){var gg=gf[3],gh=gf[2],gi=gf[1],gl=d0(gj[1],gk,gh);return 0===gl?gf:0<=gl?gn(gi,gh,gm(gk,gg)):gn(gm(gk,gi),gh,gg);}return [0,0,gk,0,1];}function gu(go){return [0,0,go,0,1];}function gq(gr,gp){if(gp){var gt=gp[3],gs=gp[2];return gn(gq(gr,gp[1]),gs,gt);}return gu(gr);}function gw(gx,gv){if(gv){var gz=gv[2],gy=gv[1];return gn(gy,gz,gw(gx,gv[3]));}return gu(gx);}function gE(gA,gF,gB){if(gA){if(gB){var gC=gB[4],gD=gA[4],gK=gB[3],gL=gB[2],gJ=gB[1],gG=gA[3],gH=gA[2],gI=gA[1];return (gC+2|0)<gD?gn(gI,gH,gE(gG,gF,gB)):(gD+2|0)<gC?gn(gE(gA,gF,gJ),gL,gK):f4(gA,gF,gB);}return gw(gF,gA);}return gq(gF,gB);}function g0(gM){var gN=gM;for(;;){if(gN){var gO=gN[1];if(gO){var gN=gO;continue;}return gN[2];}throw [0,c];}}function hd(gP){var gQ=gP;for(;;){if(gQ){var gR=gQ[3],gS=gQ[2];if(gR){var gQ=gR;continue;}return gS;}throw [0,c];}}function gV(gT){if(gT){var gU=gT[1];if(gU){var gX=gT[3],gW=gT[2];return gn(gV(gU),gW,gX);}return gT[3];}return c9(cK);}function he(gY,gZ){if(gY){if(gZ){var g1=gV(gZ);return gE(gY,g0(gZ),g1);}return gY;}return gZ;}function g8(g6,g2){if(g2){var g3=g2[3],g4=g2[2],g5=g2[1],g7=d0(gj[1],g6,g4);if(0===g7)return [0,g5,1,g3];if(0<=g7){var g9=g8(g6,g3),g$=g9[3],g_=g9[2];return [0,gE(g5,g4,g9[1]),g_,g$];}var ha=g8(g6,g5),hc=ha[2],hb=ha[1];return [0,hb,hc,gE(ha[3],g4,g3)];}return cJ;}var jV=0;function jW(hf){return hf?0:1;}function jX(hi,hg){var hh=hg;for(;;){if(hh){var hl=hh[3],hk=hh[1],hj=d0(gj[1],hi,hh[2]),hm=0===hj?1:0;if(hm)return hm;var hn=0<=hj?hl:hk,hh=hn;continue;}return 0;}}function hw(hs,ho){if(ho){var hp=ho[3],hq=ho[2],hr=ho[1],ht=d0(gj[1],hs,hq);if(0===ht){if(hr)if(hp){var hu=gV(hp),hv=gn(hr,g0(hp),hu);}else var hv=hr;else var hv=hp;return hv;}return 0<=ht?gn(hr,hq,hw(hs,hp)):gn(hw(hs,hr),hq,hp);}return 0;}function hE(hx,hy){if(hx){if(hy){var hz=hy[4],hA=hy[2],hB=hx[4],hC=hx[2],hK=hy[3],hM=hy[1],hF=hx[3],hH=hx[1];if(hz<=hB){if(1===hz)return gm(hA,hx);var hD=g8(hC,hy),hG=hD[1],hI=hE(hF,hD[3]);return gE(hE(hH,hG),hC,hI);}if(1===hB)return gm(hC,hy);var hJ=g8(hA,hx),hL=hJ[1],hN=hE(hJ[3],hK);return gE(hE(hL,hM),hA,hN);}return hx;}return hy;}function hV(hO,hP){if(hO){if(hP){var hQ=hO[3],hR=hO[2],hS=hO[1],hT=g8(hR,hP),hU=hT[1];if(0===hT[2]){var hW=hV(hQ,hT[3]);return he(hV(hS,hU),hW);}var hX=hV(hQ,hT[3]);return gE(hV(hS,hU),hR,hX);}return 0;}return 0;}function h5(hY,hZ){if(hY){if(hZ){var h0=hY[3],h1=hY[2],h2=hY[1],h3=g8(h1,hZ),h4=h3[1];if(0===h3[2]){var h6=h5(h0,h3[3]);return gE(h5(h2,h4),h1,h6);}var h7=h5(h0,h3[3]);return he(h5(h2,h4),h7);}return hY;}return 0;}function ic(h8,h_){var h9=h8,h$=h_;for(;;){if(h9){var ia=h9[1],ib=[0,h9[2],h9[3],h$],h9=ia,h$=ib;continue;}return h$;}}function is(ie,id){var ig=ic(id,0),ih=ic(ie,0),ii=ig;for(;;){if(ih)if(ii){var io=ii[3],im=ii[2],il=ih[3],ik=ih[2],ij=d0(gj[1],ih[1],ii[1]);if(0===ij){var ip=ic(im,io),iq=ic(ik,il),ih=iq,ii=ip;continue;}var ir=ij;}else var ir=1;else var ir=ii?-1:0;return ir;}}function jY(iu,it){return 0===is(iu,it)?1:0;}function iF(iv,ix){var iw=iv,iy=ix;for(;;){if(iw){if(iy){var iz=iy[3],iA=iy[1],iB=iw[3],iC=iw[2],iD=iw[1],iE=d0(gj[1],iC,iy[2]);if(0===iE){var iG=iF(iD,iA);if(iG){var iw=iB,iy=iz;continue;}return iG;}if(0<=iE){var iH=iF([0,0,iC,iB,0],iz);if(iH){var iw=iD;continue;}return iH;}var iI=iF([0,iD,iC,0,0],iA);if(iI){var iw=iB;continue;}return iI;}return 0;}return 1;}}function iL(iM,iJ){var iK=iJ;for(;;){if(iK){var iO=iK[3],iN=iK[2];iL(iM,iK[1]);dN(iM,iN);var iK=iO;continue;}return 0;}}function iT(iU,iP,iR){var iQ=iP,iS=iR;for(;;){if(iQ){var iW=iQ[3],iV=iQ[2],iX=d0(iU,iV,iT(iU,iQ[1],iS)),iQ=iW,iS=iX;continue;}return iS;}}function i4(i0,iY){var iZ=iY;for(;;){if(iZ){var i3=iZ[3],i2=iZ[1],i1=dN(i0,iZ[2]);if(i1){var i5=i4(i0,i2);if(i5){var iZ=i3;continue;}var i6=i5;}else var i6=i1;return i6;}return 1;}}function jc(i9,i7){var i8=i7;for(;;){if(i8){var ja=i8[3],i$=i8[1],i_=dN(i9,i8[2]);if(i_)var jb=i_;else{var jd=jc(i9,i$);if(!jd){var i8=ja;continue;}var jb=jd;}return jb;}return 0;}}function jg(jh,je){if(je){var jf=je[2],jj=je[3],ji=jg(jh,je[1]),jl=dN(jh,jf),jk=jg(jh,jj);return jl?gE(ji,jf,jk):he(ji,jk);}return 0;}function jo(jp,jm){if(jm){var jn=jm[2],jr=jm[3],jq=jo(jp,jm[1]),js=jq[2],jt=jq[1],jv=dN(jp,jn),ju=jo(jp,jr),jw=ju[2],jx=ju[1];if(jv){var jy=he(js,jw);return [0,gE(jt,jn,jx),jy];}var jz=gE(js,jn,jw);return [0,he(jt,jx),jz];}return cI;}function jB(jA){if(jA){var jC=jA[1],jD=jB(jA[3]);return (jB(jC)+1|0)+jD|0;}return 0;}function jI(jE,jG){var jF=jE,jH=jG;for(;;){if(jH){var jK=jH[2],jJ=jH[1],jL=[0,jK,jI(jF,jH[3])],jF=jL,jH=jJ;continue;}return jF;}}function jZ(jM){return jI(0,jM);}return [0,jV,jW,jX,gm,gu,hw,hE,hV,h5,is,jY,iF,iL,iT,i4,jc,jg,jo,jB,jZ,g0,hd,g0,g8,function(jQ,jN){var jO=jN;for(;;){if(jO){var jP=jO[2],jT=jO[3],jS=jO[1],jR=d0(gj[1],jQ,jP);if(0===jR)return jP;var jU=0<=jR?jT:jS,jO=jU;continue;}throw [0,c];}}];}function oU(kJ){function j3(j2){return j2?j2[5]:0;}function kk(j4,j_,j9,j6){var j5=j3(j4),j7=j3(j6),j8=j7<=j5?j5+1|0:j7+1|0;return [0,j4,j_,j9,j6,j8];}function kB(ka,j$){return [0,0,ka,j$,0,1];}function kC(kb,km,kl,kd){var kc=kb?kb[5]:0,ke=kd?kd[5]:0;if((ke+2|0)<kc){if(kb){var kf=kb[4],kg=kb[3],kh=kb[2],ki=kb[1],kj=j3(kf);if(kj<=j3(ki))return kk(ki,kh,kg,kk(kf,km,kl,kd));if(kf){var kp=kf[3],ko=kf[2],kn=kf[1],kq=kk(kf[4],km,kl,kd);return kk(kk(ki,kh,kg,kn),ko,kp,kq);}return c9(cz);}return c9(cy);}if((kc+2|0)<ke){if(kd){var kr=kd[4],ks=kd[3],kt=kd[2],ku=kd[1],kv=j3(ku);if(kv<=j3(kr))return kk(kk(kb,km,kl,ku),kt,ks,kr);if(ku){var ky=ku[3],kx=ku[2],kw=ku[1],kz=kk(ku[4],kt,ks,kr);return kk(kk(kb,km,kl,kw),kx,ky,kz);}return c9(cx);}return c9(cw);}var kA=ke<=kc?kc+1|0:ke+1|0;return [0,kb,km,kl,kd,kA];}var oN=0;function oO(kD){return kD?0:1;}function kO(kK,kN,kE){if(kE){var kF=kE[4],kG=kE[3],kH=kE[2],kI=kE[1],kM=kE[5],kL=d0(kJ[1],kK,kH);return 0===kL?[0,kI,kK,kN,kF,kM]:0<=kL?kC(kI,kH,kG,kO(kK,kN,kF)):kC(kO(kK,kN,kI),kH,kG,kF);}return [0,0,kK,kN,0,1];}function oP(kR,kP){var kQ=kP;for(;;){if(kQ){var kV=kQ[4],kU=kQ[3],kT=kQ[1],kS=d0(kJ[1],kR,kQ[2]);if(0===kS)return kU;var kW=0<=kS?kV:kT,kQ=kW;continue;}throw [0,c];}}function oQ(kZ,kX){var kY=kX;for(;;){if(kY){var k2=kY[4],k1=kY[1],k0=d0(kJ[1],kZ,kY[2]),k3=0===k0?1:0;if(k3)return k3;var k4=0<=k0?k2:k1,kY=k4;continue;}return 0;}}function lo(k5){var k6=k5;for(;;){if(k6){var k7=k6[1];if(k7){var k6=k7;continue;}return [0,k6[2],k6[3]];}throw [0,c];}}function oR(k8){var k9=k8;for(;;){if(k9){var k_=k9[4],k$=k9[3],la=k9[2];if(k_){var k9=k_;continue;}return [0,la,k$];}throw [0,c];}}function ld(lb){if(lb){var lc=lb[1];if(lc){var lg=lb[4],lf=lb[3],le=lb[2];return kC(ld(lc),le,lf,lg);}return lb[4];}return c9(cD);}function lt(lm,lh){if(lh){var li=lh[4],lj=lh[3],lk=lh[2],ll=lh[1],ln=d0(kJ[1],lm,lk);if(0===ln){if(ll)if(li){var lp=lo(li),lr=lp[2],lq=lp[1],ls=kC(ll,lq,lr,ld(li));}else var ls=ll;else var ls=li;return ls;}return 0<=ln?kC(ll,lk,lj,lt(lm,li)):kC(lt(lm,ll),lk,lj,li);}return 0;}function lw(lx,lu){var lv=lu;for(;;){if(lv){var lA=lv[4],lz=lv[3],ly=lv[2];lw(lx,lv[1]);d0(lx,ly,lz);var lv=lA;continue;}return 0;}}function lC(lD,lB){if(lB){var lH=lB[5],lG=lB[4],lF=lB[3],lE=lB[2],lI=lC(lD,lB[1]),lJ=dN(lD,lF);return [0,lI,lE,lJ,lC(lD,lG),lH];}return 0;}function lM(lN,lK){if(lK){var lL=lK[2],lQ=lK[5],lP=lK[4],lO=lK[3],lR=lM(lN,lK[1]),lS=d0(lN,lL,lO);return [0,lR,lL,lS,lM(lN,lP),lQ];}return 0;}function lX(lY,lT,lV){var lU=lT,lW=lV;for(;;){if(lU){var l1=lU[4],l0=lU[3],lZ=lU[2],l3=l2(lY,lZ,l0,lX(lY,lU[1],lW)),lU=l1,lW=l3;continue;}return lW;}}function l_(l6,l4){var l5=l4;for(;;){if(l5){var l9=l5[4],l8=l5[1],l7=d0(l6,l5[2],l5[3]);if(l7){var l$=l_(l6,l8);if(l$){var l5=l9;continue;}var ma=l$;}else var ma=l7;return ma;}return 1;}}function mi(md,mb){var mc=mb;for(;;){if(mc){var mg=mc[4],mf=mc[1],me=d0(md,mc[2],mc[3]);if(me)var mh=me;else{var mj=mi(md,mf);if(!mj){var mc=mg;continue;}var mh=mj;}return mh;}return 0;}}function ml(mn,mm,mk){if(mk){var mq=mk[4],mp=mk[3],mo=mk[2];return kC(ml(mn,mm,mk[1]),mo,mp,mq);}return kB(mn,mm);}function ms(mu,mt,mr){if(mr){var mx=mr[3],mw=mr[2],mv=mr[1];return kC(mv,mw,mx,ms(mu,mt,mr[4]));}return kB(mu,mt);}function mC(my,mE,mD,mz){if(my){if(mz){var mA=mz[5],mB=my[5],mK=mz[4],mL=mz[3],mM=mz[2],mJ=mz[1],mF=my[4],mG=my[3],mH=my[2],mI=my[1];return (mA+2|0)<mB?kC(mI,mH,mG,mC(mF,mE,mD,mz)):(mB+2|0)<mA?kC(mC(my,mE,mD,mJ),mM,mL,mK):kk(my,mE,mD,mz);}return ms(mE,mD,my);}return ml(mE,mD,mz);}function mW(mN,mO){if(mN){if(mO){var mP=lo(mO),mR=mP[2],mQ=mP[1];return mC(mN,mQ,mR,ld(mO));}return mN;}return mO;}function nn(mV,mU,mS,mT){return mS?mC(mV,mU,mS[1],mT):mW(mV,mT);}function m4(m2,mX){if(mX){var mY=mX[4],mZ=mX[3],m0=mX[2],m1=mX[1],m3=d0(kJ[1],m2,m0);if(0===m3)return [0,m1,[0,mZ],mY];if(0<=m3){var m5=m4(m2,mY),m7=m5[3],m6=m5[2];return [0,mC(m1,m0,mZ,m5[1]),m6,m7];}var m8=m4(m2,m1),m_=m8[2],m9=m8[1];return [0,m9,m_,mC(m8[3],m0,mZ,mY)];}return cC;}function nh(ni,m$,nb){if(m$){var na=m$[2],nf=m$[5],ne=m$[4],nd=m$[3],nc=m$[1];if(j3(nb)<=nf){var ng=m4(na,nb),nk=ng[2],nj=ng[1],nl=nh(ni,ne,ng[3]),nm=l2(ni,na,[0,nd],nk);return nn(nh(ni,nc,nj),na,nm,nl);}}else if(!nb)return 0;if(nb){var no=nb[2],ns=nb[4],nr=nb[3],nq=nb[1],np=m4(no,m$),nu=np[2],nt=np[1],nv=nh(ni,np[3],ns),nw=l2(ni,no,nu,[0,nr]);return nn(nh(ni,nt,nq),no,nw,nv);}throw [0,d,cB];}function nA(nB,nx){if(nx){var ny=nx[3],nz=nx[2],nD=nx[4],nC=nA(nB,nx[1]),nF=d0(nB,nz,ny),nE=nA(nB,nD);return nF?mC(nC,nz,ny,nE):mW(nC,nE);}return 0;}function nJ(nK,nG){if(nG){var nH=nG[3],nI=nG[2],nM=nG[4],nL=nJ(nK,nG[1]),nN=nL[2],nO=nL[1],nQ=d0(nK,nI,nH),nP=nJ(nK,nM),nR=nP[2],nS=nP[1];if(nQ){var nT=mW(nN,nR);return [0,mC(nO,nI,nH,nS),nT];}var nU=mC(nN,nI,nH,nR);return [0,mW(nO,nS),nU];}return cA;}function n1(nV,nX){var nW=nV,nY=nX;for(;;){if(nW){var nZ=nW[1],n0=[0,nW[2],nW[3],nW[4],nY],nW=nZ,nY=n0;continue;}return nY;}}function oS(oc,n3,n2){var n4=n1(n2,0),n5=n1(n3,0),n6=n4;for(;;){if(n5)if(n6){var ob=n6[4],oa=n6[3],n$=n6[2],n_=n5[4],n9=n5[3],n8=n5[2],n7=d0(kJ[1],n5[1],n6[1]);if(0===n7){var od=d0(oc,n8,n$);if(0===od){var oe=n1(oa,ob),of=n1(n9,n_),n5=of,n6=oe;continue;}var og=od;}else var og=n7;}else var og=1;else var og=n6?-1:0;return og;}}function oT(ot,oi,oh){var oj=n1(oh,0),ok=n1(oi,0),ol=oj;for(;;){if(ok)if(ol){var or=ol[4],oq=ol[3],op=ol[2],oo=ok[4],on=ok[3],om=ok[2],os=0===d0(kJ[1],ok[1],ol[1])?1:0;if(os){var ou=d0(ot,om,op);if(ou){var ov=n1(oq,or),ow=n1(on,oo),ok=ow,ol=ov;continue;}var ox=ou;}else var ox=os;var oy=ox;}else var oy=0;else var oy=ol?0:1;return oy;}}function oA(oz){if(oz){var oB=oz[1],oC=oA(oz[4]);return (oA(oB)+1|0)+oC|0;}return 0;}function oH(oD,oF){var oE=oD,oG=oF;for(;;){if(oG){var oK=oG[3],oJ=oG[2],oI=oG[1],oL=[0,[0,oJ,oK],oH(oE,oG[4])],oE=oL,oG=oI;continue;}return oE;}}return [0,oN,oO,oQ,kO,kB,lt,nh,oS,oT,lw,lX,l_,mi,nA,nJ,oA,function(oM){return oH(0,oM);},lo,oR,lo,m4,oP,lC,lM];}var pb=[0,cv];function pa(oV){var oW=1<=oV?oV:1,oX=eK<oW?eK:oW,oY=caml_create_string(oX);return [0,oY,0,oX,oY];}function pc(oZ){return eG(oZ[1],0,oZ[2]);}function o6(o0,o2){var o1=[0,o0[3]];for(;;){if(o1[1]<(o0[2]+o2|0)){o1[1]=2*o1[1]|0;continue;}if(eK<o1[1])if((o0[2]+o2|0)<=eK)o1[1]=eK;else q(cu);var o3=caml_create_string(o1[1]);eH(o0[1],0,o3,0,o0[2]);o0[1]=o3;o0[3]=o1[1];return 0;}}function pd(o4,o7){var o5=o4[2];if(o4[3]<=o5)o6(o4,1);o4[1].safeSet(o5,o7);o4[2]=o5+1|0;return 0;}function pe(o_,o8){var o9=o8.getLen(),o$=o_[2]+o9|0;if(o_[3]<o$)o6(o_,o9);eH(o8,0,o_[1],o_[2],o9);o_[2]=o$;return 0;}function pi(pf){return 0<=pf?pf:q(dj(b$,dk(pf)));}function pj(pg,ph){return pi(pg+ph|0);}var pk=dN(pj,1);function pr(pl){return eG(pl,0,pl.getLen());}function pt(pm,pn,pp){var po=dj(cc,dj(pm,cd)),pq=dj(cb,dj(dk(pn),po));return c9(dj(ca,dj(eE(1,pp),pq)));}function qh(ps,pv,pu){return pt(pr(ps),pv,pu);}function qi(pw){return c9(dj(ce,dj(pr(pw),cf)));}function pQ(px,pF,pH,pJ){function pE(py){if((px.safeGet(py)-48|0)<0||9<(px.safeGet(py)-48|0))return py;var pz=py+1|0;for(;;){var pA=px.safeGet(pz);if(48<=pA){if(!(58<=pA)){var pC=pz+1|0,pz=pC;continue;}var pB=0;}else if(36===pA){var pD=pz+1|0,pB=1;}else var pB=0;if(!pB)var pD=py;return pD;}}var pG=pE(pF+1|0),pI=pa((pH-pG|0)+10|0);pd(pI,37);var pK=pG,pL=ee(pJ);for(;;){if(pK<=pH){var pM=px.safeGet(pK);if(42===pM){if(pL){var pN=pL[2];pe(pI,dk(pL[1]));var pO=pE(pK+1|0),pK=pO,pL=pN;continue;}throw [0,d,cg];}pd(pI,pM);var pP=pK+1|0,pK=pP;continue;}return pc(pI);}}function rI(pW,pU,pT,pS,pR){var pV=pQ(pU,pT,pS,pR);if(78!==pW&&110!==pW)return pV;pV.safeSet(pV.getLen()-1|0,117);return pV;}function qj(p3,qb,qf,pX,qe){var pY=pX.getLen();function qc(pZ,qa){var p0=40===pZ?41:125;function p$(p1){var p2=p1;for(;;){if(pY<=p2)return dN(p3,pX);if(37===pX.safeGet(p2)){var p4=p2+1|0;if(pY<=p4)var p5=dN(p3,pX);else{var p6=pX.safeGet(p4),p7=p6-40|0;if(p7<0||1<p7){var p8=p7-83|0;if(p8<0||2<p8)var p9=1;else switch(p8){case 1:var p9=1;break;case 2:var p_=1,p9=0;break;default:var p_=0,p9=0;}if(p9){var p5=p$(p4+1|0),p_=2;}}else var p_=0===p7?0:1;switch(p_){case 1:var p5=p6===p0?p4+1|0:l2(qb,pX,qa,p6);break;case 2:break;default:var p5=p$(qc(p6,p4+1|0)+1|0);}}return p5;}var qd=p2+1|0,p2=qd;continue;}}return p$(qa);}return qc(qf,qe);}function qI(qg){return l2(qj,qi,qh,qg);}function qY(qk,qv,qF){var ql=qk.getLen()-1|0;function qG(qm){var qn=qm;a:for(;;){if(qn<ql){if(37===qk.safeGet(qn)){var qo=0,qp=qn+1|0;for(;;){if(ql<qp)var qq=qi(qk);else{var qr=qk.safeGet(qp);if(58<=qr){if(95===qr){var qt=qp+1|0,qs=1,qo=qs,qp=qt;continue;}}else if(32<=qr)switch(qr-32|0){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 0:case 3:case 11:case 13:var qu=qp+1|0,qp=qu;continue;case 10:var qw=l2(qv,qo,qp,105),qp=qw;continue;default:var qx=qp+1|0,qp=qx;continue;}var qy=qp;c:for(;;){if(ql<qy)var qz=qi(qk);else{var qA=qk.safeGet(qy);if(126<=qA)var qB=0;else switch(qA){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var qz=l2(qv,qo,qy,105),qB=1;break;case 69:case 70:case 71:case 101:case 102:case 103:var qz=l2(qv,qo,qy,102),qB=1;break;case 33:case 37:case 44:case 64:var qz=qy+1|0,qB=1;break;case 83:case 91:case 115:var qz=l2(qv,qo,qy,115),qB=1;break;case 97:case 114:case 116:var qz=l2(qv,qo,qy,qA),qB=1;break;case 76:case 108:case 110:var qC=qy+1|0;if(ql<qC){var qz=l2(qv,qo,qy,105),qB=1;}else{var qD=qk.safeGet(qC)-88|0;if(qD<0||32<qD)var qE=1;else switch(qD){case 0:case 12:case 17:case 23:case 29:case 32:var qz=d0(qF,l2(qv,qo,qy,qA),105),qB=1,qE=0;break;default:var qE=1;}if(qE){var qz=l2(qv,qo,qy,105),qB=1;}}break;case 67:case 99:var qz=l2(qv,qo,qy,99),qB=1;break;case 66:case 98:var qz=l2(qv,qo,qy,66),qB=1;break;case 41:case 125:var qz=l2(qv,qo,qy,qA),qB=1;break;case 40:var qz=qG(l2(qv,qo,qy,qA)),qB=1;break;case 123:var qH=l2(qv,qo,qy,qA),qJ=l2(qI,qA,qk,qH),qK=qH;for(;;){if(qK<(qJ-2|0)){var qL=d0(qF,qK,qk.safeGet(qK)),qK=qL;continue;}var qM=qJ-1|0,qy=qM;continue c;}default:var qB=0;}if(!qB)var qz=qh(qk,qy,qA);}var qq=qz;break;}}var qn=qq;continue a;}}var qN=qn+1|0,qn=qN;continue;}return qn;}}qG(0);return 0;}function sX(qZ){var qO=[0,0,0,0];function qX(qT,qU,qP){var qQ=41!==qP?1:0,qR=qQ?125!==qP?1:0:qQ;if(qR){var qS=97===qP?2:1;if(114===qP)qO[3]=qO[3]+1|0;if(qT)qO[2]=qO[2]+qS|0;else qO[1]=qO[1]+qS|0;}return qU+1|0;}qY(qZ,qX,function(qV,qW){return qV+1|0;});return qO[1];}function rE(q0,q3,q1){var q2=q0.safeGet(q1);if((q2-48|0)<0||9<(q2-48|0))return d0(q3,0,q1);var q4=q2-48|0,q5=q1+1|0;for(;;){var q6=q0.safeGet(q5);if(48<=q6){if(!(58<=q6)){var q9=q5+1|0,q8=(10*q4|0)+(q6-48|0)|0,q4=q8,q5=q9;continue;}var q7=0;}else if(36===q6)if(0===q4){var q_=q(ci),q7=1;}else{var q_=d0(q3,[0,pi(q4-1|0)],q5+1|0),q7=1;}else var q7=0;if(!q7)var q_=d0(q3,0,q1);return q_;}}function rz(q$,ra){return q$?ra:dN(pk,ra);}function ro(rb,rc){return rb?rb[1]:rc;}function ui(tg,re,ts,rh,s2,ty,rd){var rf=dN(re,rd);function th(rg){return d0(rh,rf,rg);}function s1(rm,tx,ri,rr){var rl=ri.getLen();function sY(tp,rj){var rk=rj;for(;;){if(rl<=rk)return dN(rm,rf);var rn=ri.safeGet(rk);if(37===rn){var rv=function(rq,rp){return caml_array_get(rr,ro(rq,rp));},rB=function(rD,rw,ry,rs){var rt=rs;for(;;){var ru=ri.safeGet(rt)-32|0;if(!(ru<0||25<ru))switch(ru){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 10:return rE(ri,function(rx,rC){var rA=[0,rv(rx,rw),ry];return rB(rD,rz(rx,rw),rA,rC);},rt+1|0);default:var rF=rt+1|0,rt=rF;continue;}var rG=ri.safeGet(rt);if(124<=rG)var rH=0;else switch(rG){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var rJ=rv(rD,rw),rK=caml_format_int(rI(rG,ri,rk,rt,ry),rJ),rM=rL(rz(rD,rw),rK,rt+1|0),rH=1;break;case 69:case 71:case 101:case 102:case 103:var rN=rv(rD,rw),rO=caml_format_float(pQ(ri,rk,rt,ry),rN),rM=rL(rz(rD,rw),rO,rt+1|0),rH=1;break;case 76:case 108:case 110:var rP=ri.safeGet(rt+1|0)-88|0;if(rP<0||32<rP)var rQ=1;else switch(rP){case 0:case 12:case 17:case 23:case 29:case 32:var rR=rt+1|0,rS=rG-108|0;if(rS<0||2<rS)var rT=0;else{switch(rS){case 1:var rT=0,rU=0;break;case 2:var rV=rv(rD,rw),rW=caml_format_int(pQ(ri,rk,rR,ry),rV),rU=1;break;default:var rX=rv(rD,rw),rW=caml_format_int(pQ(ri,rk,rR,ry),rX),rU=1;}if(rU){var rY=rW,rT=1;}}if(!rT){var rZ=rv(rD,rw),rY=caml_int64_format(pQ(ri,rk,rR,ry),rZ);}var rM=rL(rz(rD,rw),rY,rR+1|0),rH=1,rQ=0;break;default:var rQ=1;}if(rQ){var r0=rv(rD,rw),r1=caml_format_int(rI(110,ri,rk,rt,ry),r0),rM=rL(rz(rD,rw),r1,rt+1|0),rH=1;}break;case 37:case 64:var rM=rL(rw,eE(1,rG),rt+1|0),rH=1;break;case 83:case 115:var r2=rv(rD,rw);if(115===rG)var r3=r2;else{var r4=[0,0],r5=0,r6=r2.getLen()-1|0;if(!(r6<r5)){var r7=r5;for(;;){var r8=r2.safeGet(r7),r9=14<=r8?34===r8?1:92===r8?1:0:11<=r8?13<=r8?1:0:8<=r8?1:0,r_=r9?2:caml_is_printable(r8)?1:4;r4[1]=r4[1]+r_|0;var r$=r7+1|0;if(r6!==r7){var r7=r$;continue;}break;}}if(r4[1]===r2.getLen())var sa=r2;else{var sb=caml_create_string(r4[1]);r4[1]=0;var sc=0,sd=r2.getLen()-1|0;if(!(sd<sc)){var se=sc;for(;;){var sf=r2.safeGet(se),sg=sf-34|0;if(sg<0||58<sg)if(-20<=sg)var sh=1;else{switch(sg+34|0){case 8:sb.safeSet(r4[1],92);r4[1]+=1;sb.safeSet(r4[1],98);var si=1;break;case 9:sb.safeSet(r4[1],92);r4[1]+=1;sb.safeSet(r4[1],116);var si=1;break;case 10:sb.safeSet(r4[1],92);r4[1]+=1;sb.safeSet(r4[1],110);var si=1;break;case 13:sb.safeSet(r4[1],92);r4[1]+=1;sb.safeSet(r4[1],114);var si=1;break;default:var sh=1,si=0;}if(si)var sh=0;}else var sh=(sg-1|0)<0||56<(sg-1|0)?(sb.safeSet(r4[1],92),r4[1]+=1,sb.safeSet(r4[1],sf),0):1;if(sh)if(caml_is_printable(sf))sb.safeSet(r4[1],sf);else{sb.safeSet(r4[1],92);r4[1]+=1;sb.safeSet(r4[1],48+(sf/100|0)|0);r4[1]+=1;sb.safeSet(r4[1],48+((sf/10|0)%10|0)|0);r4[1]+=1;sb.safeSet(r4[1],48+(sf%10|0)|0);}r4[1]+=1;var sj=se+1|0;if(sd!==se){var se=sj;continue;}break;}}var sa=sb;}var r3=dj(cp,dj(sa,cq));}if(rt===(rk+1|0))var sk=r3;else{var sl=pQ(ri,rk,rt,ry);try {var sm=0,sn=1;for(;;){if(sl.getLen()<=sn)var so=[0,0,sm];else{var sp=sl.safeGet(sn);if(49<=sp)if(58<=sp)var sq=0;else{var so=[0,caml_int_of_string(eG(sl,sn,(sl.getLen()-sn|0)-1|0)),sm],sq=1;}else{if(45===sp){var ss=sn+1|0,sr=1,sm=sr,sn=ss;continue;}var sq=0;}if(!sq){var st=sn+1|0,sn=st;continue;}}var su=so;break;}}catch(sv){if(sv[1]!==a)throw sv;var su=pt(sl,0,115);}var sw=su[1],sx=r3.getLen(),sy=0,sC=su[2],sB=32;if(sw===sx&&0===sy){var sz=r3,sA=1;}else var sA=0;if(!sA)if(sw<=sx)var sz=eG(r3,sy,sx);else{var sD=eE(sw,sB);if(sC)eH(r3,sy,sD,0,sx);else eH(r3,sy,sD,sw-sx|0,sx);var sz=sD;}var sk=sz;}var rM=rL(rz(rD,rw),sk,rt+1|0),rH=1;break;case 67:case 99:var sE=rv(rD,rw);if(99===rG)var sF=eE(1,sE);else{if(39===sE)var sG=cS;else if(92===sE)var sG=cT;else{if(14<=sE)var sH=0;else switch(sE){case 8:var sG=cX,sH=1;break;case 9:var sG=cW,sH=1;break;case 10:var sG=cV,sH=1;break;case 13:var sG=cU,sH=1;break;default:var sH=0;}if(!sH)if(caml_is_printable(sE)){var sI=caml_create_string(1);sI.safeSet(0,sE);var sG=sI;}else{var sJ=caml_create_string(4);sJ.safeSet(0,92);sJ.safeSet(1,48+(sE/100|0)|0);sJ.safeSet(2,48+((sE/10|0)%10|0)|0);sJ.safeSet(3,48+(sE%10|0)|0);var sG=sJ;}}var sF=dj(cn,dj(sG,co));}var rM=rL(rz(rD,rw),sF,rt+1|0),rH=1;break;case 66:case 98:var sL=rt+1|0,sK=rv(rD,rw)?c1:c0,rM=rL(rz(rD,rw),sK,sL),rH=1;break;case 40:case 123:var sM=rv(rD,rw),sN=l2(qI,rG,ri,rt+1|0);if(123===rG){var sO=pa(sM.getLen()),sS=function(sQ,sP){pd(sO,sP);return sQ+1|0;};qY(sM,function(sR,sU,sT){if(sR)pe(sO,ch);else pd(sO,37);return sS(sU,sT);},sS);var sV=pc(sO),rM=rL(rz(rD,rw),sV,sN),rH=1;}else{var sW=rz(rD,rw),sZ=pj(sX(sM),sW),rM=s1(function(s0){return sY(sZ,sN);},sW,sM,rr),rH=1;}break;case 33:dN(s2,rf);var rM=sY(rw,rt+1|0),rH=1;break;case 41:var rM=rL(rw,ct,rt+1|0),rH=1;break;case 44:var rM=rL(rw,cs,rt+1|0),rH=1;break;case 70:var s3=rv(rD,rw);if(0===ry)var s4=cr;else{var s5=pQ(ri,rk,rt,ry);if(70===rG)s5.safeSet(s5.getLen()-1|0,103);var s4=s5;}var s6=caml_classify_float(s3);if(3===s6)var s7=s3<0?cl:ck;else if(4<=s6)var s7=cm;else{var s8=caml_format_float(s4,s3),s9=0,s_=s8.getLen();for(;;){if(s_<=s9)var s$=dj(s8,cj);else{var ta=s8.safeGet(s9)-46|0,tb=ta<0||23<ta?55===ta?1:0:(ta-1|0)<0||21<(ta-1|0)?1:0;if(!tb){var tc=s9+1|0,s9=tc;continue;}var s$=s8;}var s7=s$;break;}}var rM=rL(rz(rD,rw),s7,rt+1|0),rH=1;break;case 91:var rM=qh(ri,rt,rG),rH=1;break;case 97:var td=rv(rD,rw),te=dN(pk,ro(rD,rw)),tf=rv(0,te),tj=rt+1|0,ti=rz(rD,te);if(tg)th(d0(td,0,tf));else d0(td,rf,tf);var rM=sY(ti,tj),rH=1;break;case 114:var rM=qh(ri,rt,rG),rH=1;break;case 116:var tk=rv(rD,rw),tm=rt+1|0,tl=rz(rD,rw);if(tg)th(dN(tk,0));else dN(tk,rf);var rM=sY(tl,tm),rH=1;break;default:var rH=0;}if(!rH)var rM=qh(ri,rt,rG);return rM;}},tr=rk+1|0,to=0;return rE(ri,function(tq,tn){return rB(tq,tp,to,tn);},tr);}d0(ts,rf,rn);var tt=rk+1|0,rk=tt;continue;}}function rL(tw,tu,tv){th(tu);return sY(tw,tv);}return sY(tx,0);}var tz=d0(s1,ty,pi(0)),tA=sX(rd);if(tA<0||6<tA){var tN=function(tB,tH){if(tA<=tB){var tC=caml_make_vect(tA,0),tF=function(tD,tE){return caml_array_set(tC,(tA-tD|0)-1|0,tE);},tG=0,tI=tH;for(;;){if(tI){var tJ=tI[2],tK=tI[1];if(tJ){tF(tG,tK);var tL=tG+1|0,tG=tL,tI=tJ;continue;}tF(tG,tK);}return d0(tz,rd,tC);}}return function(tM){return tN(tB+1|0,[0,tM,tH]);};},tO=tN(0,0);}else switch(tA){case 1:var tO=function(tQ){var tP=caml_make_vect(1,0);caml_array_set(tP,0,tQ);return d0(tz,rd,tP);};break;case 2:var tO=function(tS,tT){var tR=caml_make_vect(2,0);caml_array_set(tR,0,tS);caml_array_set(tR,1,tT);return d0(tz,rd,tR);};break;case 3:var tO=function(tV,tW,tX){var tU=caml_make_vect(3,0);caml_array_set(tU,0,tV);caml_array_set(tU,1,tW);caml_array_set(tU,2,tX);return d0(tz,rd,tU);};break;case 4:var tO=function(tZ,t0,t1,t2){var tY=caml_make_vect(4,0);caml_array_set(tY,0,tZ);caml_array_set(tY,1,t0);caml_array_set(tY,2,t1);caml_array_set(tY,3,t2);return d0(tz,rd,tY);};break;case 5:var tO=function(t4,t5,t6,t7,t8){var t3=caml_make_vect(5,0);caml_array_set(t3,0,t4);caml_array_set(t3,1,t5);caml_array_set(t3,2,t6);caml_array_set(t3,3,t7);caml_array_set(t3,4,t8);return d0(tz,rd,t3);};break;case 6:var tO=function(t_,t$,ua,ub,uc,ud){var t9=caml_make_vect(6,0);caml_array_set(t9,0,t_);caml_array_set(t9,1,t$);caml_array_set(t9,2,ua);caml_array_set(t9,3,ub);caml_array_set(t9,4,uc);caml_array_set(t9,5,ud);return d0(tz,rd,t9);};break;default:var tO=d0(tz,rd,[0]);}return tO;}function uw(uf){function uh(ue){return 0;}return uj(ui,0,function(ug){return uf;},dy,du,dF,uh);}function us(uk){return pa(2*uk.getLen()|0);}function up(un,ul){var um=pc(ul);ul[2]=0;return dN(un,um);}function uv(uo){var ur=dN(up,uo);return uj(ui,1,us,pd,pe,function(uq){return 0;},ur);}function ux(uu){return d0(uv,function(ut){return ut;},uu);}var uy=[0,0];function uM(uz,uA){var uB=uz[uA+1];if(caml_obj_is_block(uB)){if(caml_obj_tag(uB)===e3)return d0(ux,bP,uB);if(caml_obj_tag(uB)===e2){var uC=caml_format_float(c4,uB),uD=0,uE=uC.getLen();for(;;){if(uE<=uD)var uF=dj(uC,c3);else{var uG=uC.safeGet(uD),uH=48<=uG?58<=uG?0:1:45===uG?1:0;if(uH){var uI=uD+1|0,uD=uI;continue;}var uF=uC;}return uF;}}return bO;}return d0(ux,bQ,uB);}function uL(uJ,uK){if(uJ.length-1<=uK)return b_;var uN=uL(uJ,uK+1|0);return l2(ux,b9,uM(uJ,uK),uN);}function vg(uP){var uO=uy[1];for(;;){if(uO){var uU=uO[2],uQ=uO[1];try {var uR=dN(uQ,uP),uS=uR;}catch(uV){var uS=0;}if(!uS){var uO=uU;continue;}var uT=uS[1];}else if(uP[1]===c8)var uT=bZ;else if(uP[1]===c6)var uT=bY;else if(uP[1]===c7){var uW=uP[2],uX=uW[3],uT=uj(ux,g,uW[1],uW[2],uX,uX+5|0,bX);}else if(uP[1]===d){var uY=uP[2],uZ=uY[3],uT=uj(ux,g,uY[1],uY[2],uZ,uZ+6|0,bW);}else if(uP[1]===c5){var u0=uP[2],u1=u0[3],uT=uj(ux,g,u0[1],u0[2],u1,u1+6|0,bV);}else{var u2=uP.length-1,u5=uP[0+1][0+1];if(u2<0||2<u2){var u3=uL(uP,2),u4=l2(ux,bU,uM(uP,1),u3);}else switch(u2){case 1:var u4=bS;break;case 2:var u4=d0(ux,bR,uM(uP,1));break;default:var u4=bT;}var uT=dj(u5,u4);}return uT;}}function vh(vd){var u6=caml_convert_raw_backtrace(caml_get_exception_raw_backtrace(0));if(u6){var u7=u6[1],u8=0,u9=u7.length-1-1|0;if(!(u9<u8)){var u_=u8;for(;;){if(caml_notequal(caml_array_get(u7,u_),b8)){var u$=caml_array_get(u7,u_),va=0===u$[0]?u$[1]:u$[1],vb=va?0===u_?b5:b4:0===u_?b3:b2,vc=0===u$[0]?uj(ux,b1,vb,u$[2],u$[3],u$[4],u$[5]):d0(ux,b0,vb);l2(uw,vd,b7,vc);}var ve=u_+1|0;if(u9!==u_){var u_=ve;continue;}break;}}var vf=0;}else var vf=d0(uw,vd,b6);return vf;}32===eJ;function vk(vj){var vi=[];caml_update_dummy(vi,[0,vi,vi]);return vi;}var vl=[0,bI],vo=42,vp=[0,oU([0,function(vn,vm){return caml_compare(vn,vm);}])[1]];function vt(vq){var vr=vq[1];{if(3===vr[0]){var vs=vr[1],vu=vt(vs);if(vu!==vs)vq[1]=[3,vu];return vu;}return vq;}}function vx(vv){return vt(vv);}var vy=[0,function(vw){vg(vw);caml_ml_output_char(dl,10);vh(dl);dt(0);return caml_sys_exit(2);}];function vY(vA,vz){try {var vB=dN(vA,vz);}catch(vC){return dN(vy[1],vC);}return vB;}function vN(vH,vD,vF){var vE=vD,vG=vF;for(;;)if(typeof vE==="number")return vI(vH,vG);else switch(vE[0]){case 1:dN(vE[1],vH);return vI(vH,vG);case 2:var vJ=vE[1],vK=[0,vE[2],vG],vE=vJ,vG=vK;continue;default:var vL=vE[1][1];return vL?(dN(vL[1],vH),vI(vH,vG)):vI(vH,vG);}}function vI(vO,vM){return vM?vN(vO,vM[1],vM[2]):0;}function v0(vP,vR){var vQ=vP,vS=vR;for(;;)if(typeof vQ==="number")return vU(vS);else switch(vQ[0]){case 1:var vT=vQ[1];if(vT[4]){vT[4]=0;vT[1][2]=vT[2];vT[2][1]=vT[1];}return vU(vS);case 2:var vV=vQ[1],vW=[0,vQ[2],vS],vQ=vV,vS=vW;continue;default:var vX=vQ[2];vp[1]=vQ[1];vY(vX,0);return vU(vS);}}function vU(vZ){return vZ?v0(vZ[1],vZ[2]):0;}function v4(v2,v1){var v3=1===v1[0]?v1[1][1]===vl?(v0(v2[4],0),1):0:0;return vN(v1,v2[2],0);}var v5=[0,0],v6=[0,0,0];function wr(v9,v7){var v8=[0,v7],v_=vt(v9),v$=v_[1];switch(v$[0]){case 1:if(v$[1][1]===vl){var wa=0,wb=1;}else var wb=0;break;case 2:var wc=v$[1];v_[1]=v8;var wd=vp[1],we=v5[1]?1:(v5[1]=1,0);v4(wc,v8);if(we){vp[1]=wd;var wf=0;}else for(;;){if(0!==v6[1]){if(0===v6[1])throw [0,pb];v6[1]=v6[1]-1|0;var wg=v6[2],wh=wg[2];if(wh===wg)v6[2]=0;else wg[2]=wh[2];var wi=wh[1];v4(wi[1],wi[2]);continue;}v5[1]=0;vp[1]=wd;var wf=0;break;}var wa=wf,wb=1;break;default:var wb=0;}if(!wb)var wa=c9(bJ);return wa;}function wp(wj,wk){return typeof wj==="number"?wk:typeof wk==="number"?wj:[2,wj,wk];}function wm(wl){if(typeof wl!=="number")switch(wl[0]){case 2:var wn=wl[1],wo=wm(wl[2]);return wp(wm(wn),wo);case 1:break;default:if(!wl[1][1])return 0;}return wl;}var wt=[0,function(wq){return 0;}],ws=vk(0),ww=[0,0],wB=null;function wG(wA){var wu=1-(ws[2]===ws?1:0);if(wu){var wv=vk(0);wv[1][2]=ws[2];ws[2][1]=wv[1];wv[1]=ws[1];ws[1][2]=wv;ws[1]=ws;ws[2]=ws;ww[1]=0;var wx=wv[2];for(;;){var wy=wx!==wv?1:0;if(wy){if(wx[4])wr(wx[3],0);var wz=wx[2],wx=wz;continue;}return wy;}}return wu;}var wF=undefined;function wE(wC,wD){return wC==wB?dN(wD,0):wC;}var wH=Array,wJ=false;function wK(wI){return wI instanceof wH?0:[0,new MlWrappedString(wI.toString())];}uy[1]=[0,wK,uy[1]];function wN(wL,wM){wL.appendChild(wM);return 0;}var wO=this,wP=wO.document;function wX(wQ,wR){return wQ?dN(wR,wQ[1]):0;}function wU(wT,wS){return wT.createElement(wS.toString());}function wY(wW,wV){return wU(wW,wV);}var wZ=[0,785140586];function xg(w0,w1,w3,w2){for(;;){if(0===w0&&0===w1)return wU(w3,w2);var w4=wZ[1];if(785140586===w4){try {var w5=wP.createElement(bA.toString()),w6=bz.toString(),w7=w5.tagName.toLowerCase()===w6?1:0,w8=w7?w5.name===by.toString()?1:0:w7,w9=w8;}catch(w$){var w9=0;}var w_=w9?982028505:-1003883683;wZ[1]=w_;continue;}if(982028505<=w4){var xa=new wH();xa.push(bD.toString(),w2.toString());wX(w0,function(xb){xa.push(bE.toString(),caml_js_html_escape(xb),bF.toString());return 0;});wX(w1,function(xc){xa.push(bG.toString(),caml_js_html_escape(xc),bH.toString());return 0;});xa.push(bC.toString());return w3.createElement(xa.join(bB.toString()));}var xd=wU(w3,w2);wX(w0,function(xe){return xd.type=xe;});wX(w1,function(xf){return xd.name=xf;});return xd;}}function xr(xj,xi,xh){return xg(xj,xi,xh,bn);}function xs(xk){return wY(xk,bp);}function xt(xl){return wY(xl,bq);}function xu(xm){return wY(xm,br);}function xv(xn){return wY(xn,bu);}function xw(xo){return wY(xo,bv);}function xx(xp){return wY(xp,bw);}function xy(xq){return wU(xq,bx);}this.HTMLElement===wF;var xz=2147483,xB=caml_js_get_console(0);wt[1]=function(xA){return 1===xA?(wO.setTimeout(caml_js_wrap_callback(wG),0),0):0;};function xD(xC){return xB.log(xC.toString());}vy[1]=function(xE){xD(bm);xD(vg(xE));return vh(dl);};function xH(xG,xF){return 0===xF?1003109192:1===xF?xG:[0,748545537,[0,xG,xH(xG,xF-1|0)]];}var x_=bi.slice(),x9=[0,257,258,0],x8=303;function x$(xI){throw [0,e5,fN(xI,0)];}function ya(xJ){throw [0,e5,fN(xJ,0)];}function yb(xK){return 3901498;}function yc(xL){return -941236332;}function yd(xM){return 15949;}function ye(xN){return 17064;}function yf(xO){return 3553395;}function yg(xP){return 3802040;}function yh(xQ){return 15500;}function yi(xR){return fN(xR,1);}function yj(xS){return [0,926224370,fN(xS,1)];}function yk(xT){return [0,974443759,[0,19065,[0,926224370,fN(xT,1)]]];}function yl(xU){var xV=fN(xU,2);return [0,974443759,[0,xV,fN(xU,0)]];}function ym(xW){var xX=fN(xW,2);return [0,-783405316,[0,xX,fN(xW,0)]];}function yn(xY){var xZ=fN(xY,2);return [0,748545537,[0,xZ,fN(xY,0)]];}function yo(x0){var x1=fN(x0,1);return xH(x1,fN(x0,0));}function yp(x2){var x3=fN(x2,0);return caml_string_equal(x3,bk)?19065:caml_string_equal(x3,bj)?1003109192:[0,4298439,x3];}function yq(x4){var x5=fN(x4,2),x6=fN(x4,1);return [0,x6,x5,fN(x4,0)];}var yr=[0,[0,function(x7){return q(bl);},yq,yp,yo,yn,ym,yl,yk,yj,yi,yh,yg,yf,ye,yd,yc,yb,ya,x$],x_,x9,bh,bg,bf,be,bd,bc,bb,x8,ba,a$,j1,a_,a9];function yA(yt){var ys=0;for(;;){var yu=e1(h,ys,yt);if(yu<0||20<yu){dN(yt[1],yt);var ys=yu;continue;}switch(yu){case 1:var yw=yv(yt);break;case 2:var yw=1;break;case 3:var yx=yt[5],yy=yt[6]-yx|0,yz=caml_create_string(yy);caml_blit_string(yt[2],yx,yz,0,yy);var yw=[0,yz];break;case 4:var yw=7;break;case 5:var yw=6;break;case 6:var yw=4;break;case 7:var yw=5;break;case 8:var yw=8;break;case 9:var yw=2;break;case 10:var yw=3;break;case 11:var yw=15;break;case 12:var yw=16;break;case 13:var yw=10;break;case 14:var yw=12;break;case 15:var yw=13;break;case 16:var yw=14;break;case 17:var yw=11;break;case 18:var yw=9;break;case 19:var yw=0;break;case 20:var yw=q(dj(a8,eE(1,yt[2].safeGet(yt[5]))));break;default:var yw=yA(yt);}return yw;}}function yv(yC){var yB=25;for(;;){var yD=e1(h,yB,yC);if(yD<0||2<yD){dN(yC[1],yC);var yB=yD;continue;}switch(yD){case 1:var yE=0;break;case 2:var yE=yv(yC);break;default:var yE=1;}return yE;}}function yP(yF){return fM(yr,2,yA,e4(yF));}function yJ(yG){if(typeof yG==="number")return 1003109192<=yG?a7:a6;var yH=yG[1];if(748545537<=yH){if(926224370<=yH){if(974443759<=yH){var yI=yG[2],yK=yJ(yI[2]);return l2(ux,a5,yJ(yI[1]),yK);}return d0(ux,a4,yJ(yG[2]));}if(748545556<=yH)return d0(ux,a3,yJ(yG[2]));var yL=yG[2],yM=yJ(yL[2]);return l2(ux,a2,yJ(yL[1]),yM);}if(4298439<=yH)return yG[2];var yN=yG[2],yO=yJ(yN[2]);return l2(ux,a1,yJ(yN[1]),yO);}var yS=[0,function(yR,yQ){return caml_compare(yR,yQ);}],yT=oU(yS),yU=j0(yS);function yX(yW,yV){return caml_compare(yW,yV);}var yY=j0([0,dN(yT[8],yX)]),yZ=j0([0,yU[10]]),y2=j0([0,function(y1,y0){return caml_compare(y1,y0);}]),y5=j0([0,function(y4,y3){return caml_compare(y4,y3);}]),y9=j0([0,function(y7,y6){var y8=d0(yU[10],y7[1],y6[1]);return 0===y8?d0(y2[10],y7[2],y6[2]):y8;}]);function zs(zb,zc){function y$(y_){if(y_){var za=y$(y_[2]);return dg(dN(zb,y_[1]),za);}return y_;}return y$(zc);}function zt(zg){var ze=yU[1];function zf(zd){return dN(yU[7],zd[1]);}return l2(y9[14],zf,zg,ze);}function zu(zl){var zj=yU[1];function zk(zh,zi){return dN(yU[4],zh);}return l2(yT[11],zk,zl,zj);}function zw(zo,zm){var zq=dN(yT[17],zm);return d0(ux,aL,eI(aM,dP(function(zn){var zp=dN(zo,zn[2]);return l2(ux,aN,zn[1],zp);},zq)));}function zv(zr){return d0(ux,aO,eI(aP,dP(dk,dN(yU[20],zr))));}var zx=[0,aK];function AR(zy){return [0,-783405316,[0,zy[1],zy[2]]];}function A1(zz){return [0,748545537,[0,zz[1],zz[2]]];}function zX(zB,zA){var zC=yT[22],zG=yU[1];try {var zD=d0(zC,zB,zA),zE=zD;}catch(zF){if(zF[1]!==c)throw zF;var zE=zG;}return zE;}function AV(zH){var zI=zH[3],zJ=zH[2],zK=zH[1],zO=yU[1];function zP(zL,zM){var zN=d0(yU[4],zL[3],zM);return d0(yU[4],zL[1],zN);}var zQ=l2(y5[14],zP,zJ,zO),zT=yT[1];function zU(zR){var zS=dN(yU[5],zR);return d0(yT[4],zR,zS);}var z1=l2(yU[14],zU,zQ,zT);function z2(zV,zY){var zW=zV[1],zZ=zX(zW,zY),z0=d0(yU[4],zV[3],zZ);return l2(yT[4],zW,z0,zY);}var z3=l2(y5[14],z2,zJ,z1);for(;;){var Ad=yT[1],Ae=function(z3){return function(Ac,z$,Ab){function z_(z4,z9){var z7=zX(z4,z3);function z8(z6,z5){return d0(yU[4],z6,z5);}return l2(yU[14],z8,z7,z9);}var Aa=l2(yU[14],z_,z$,z$);return l2(yT[4],Ac,Aa,Ab);};}(z3),Af=l2(yT[11],Ae,z3,Ad);if(l2(yT[9],yU[11],Af,z3)){if(zK===zI)return q(aJ);var Ah=function(Ag){return Ag[1]===zK?1:0;},Ai=d0(y5[17],Ah,zJ),Aj=dN(y5[20],Ai);if(Aj){var Ak=Aj[2],Al=Aj[1],Am=Al[3],An=Al[2];if(Ak){var Ar=zX(Am,z3),Au=eg(function(Aq,Ao){var Ap=zX(Ao[3],z3);return d0(yU[8],Aq,Ap);},Ar,Ak),Av=function(At){var As=zX(zI,z3);return 1-d0(yU[3],At,As);},Aw=d0(yU[17],Av,Au);if(dN(yU[2],Aw)){var Ax=0,Ay=0,Az=[0,[0,zK,An,Am],Ak];for(;;){if(Az){var AA=Az[2],AB=Az[1],AC=AB[3],AD=zX(AC,z3),AE=zX(Am,z3),AF=d0(yU[8],AE,AD);if(Am===AC&&dN(yU[2],AF))throw [0,d,aF];var AI=function(AH){var AG=zX(zI,z3);return 1-d0(yU[3],AH,AG);};if(d0(yU[16],AI,AF)){var AJ=[0,AB,Ax],Ax=AJ,Az=AA;continue;}var AK=[0,AB,Ay],Ay=AK,Az=AA;continue;}var AL=ee(Ay),AM=ee(Ax);if(0===AL)throw [0,d,aI];if(0===AM){if(AL){var AN=AL[2],AO=AL[1][2];if(AN){var AS=[0,4298439,AO];return eg(function(AQ,AP){return AR([0,AQ,[0,4298439,AP[2]]]);},AS,AN);}return [0,4298439,AO];}return q(aH);}var AU=function(AT){return 1-eh(AT,AL);},AX=AV([0,zK,d0(y5[17],AU,zJ),zI]),AY=function(AW){return 1-eh(AW,AM);};return AR([0,AV([0,zK,d0(y5[17],AY,zJ),zI]),AX]);}}var AZ=dN(yU[23],Aw),A0=AV([0,AZ,zJ,zI]);return A1([0,AV([0,zK,zJ,AZ]),A0]);}return Am===zI?[0,4298439,An]:A1([0,[0,4298439,An],AV([0,Am,zJ,zI])]);}return q(aG);}var z3=Af;continue;}}var A2=y9[7],A3=y9[9];function A7(A8,A4){if(typeof A4!=="number"){var A5=A4[1];if(!(748545537<=A5)){if(4298439<=A5){var B1=dN(yU[5],A8),B2=d0(yU[4],A8+1|0,B1),B3=dN(y2[5],[0,A4[2],A8+1|0]),B4=[0,dN(yU[5],A8),B3],B5=dN(y9[5],B4),B6=dN(yU[5],A8+1|0);return [0,[0,B2,B5,A8,dN(yZ[5],B6)],A8+2|0];}var B7=A4[2],B8=A7(A8,B7[1]),B9=A7(B8[2],B7[2]),B_=B9[1],B$=B8[1],Ca=B_[3],Cb=B_[2],Cc=B$[3],Cd=B$[2],Cf=B9[2],Ce=B_[4],Cg=d0(yU[6],Ca,B_[1]),Ch=d0(yU[7],B$[1],Cg),Cn=yZ[1],Cm=B$[4],Co=function(Cj){function Cl(Ci){var Ck=d0(yU[7],Cj,Ci);return dN(yZ[4],Ck);}return d0(yZ[14],Cl,Ce);},Cq=l2(yZ[14],Co,Cm,Cn),Cr=function(Cp){return d0(yU[3],Cc,Cp[1]);},Cs=d0(y9[17],Cr,Cd),Cu=function(Ct){return d0(yU[3],Ca,Ct[1]);},Cv=d0(y9[17],Cu,Cb),CC=y9[1],CD=function(Cw){var Cy=Cw[2];function CB(Cx){var Cz=d0(y2[7],Cy,Cx[2]),CA=[0,dN(yU[5],Cc),Cz];return dN(y9[4],CA);}return d0(y9[14],CB,Cv);},CE=l2(y9[14],CD,Cs,CC);return [0,[0,Ch,d0(A2,d0(A3,d0(A3,d0(A2,Cd,Cb),Cv),Cs),CE),Cc,Cq],Cf];}if(926224370<=A5){if(974443759<=A5){var A6=A4[2],A9=A7(A8,A6[1]),A_=A7(A9[2],A6[2]),A$=A_[1],Ba=A9[1],Bb=A$[3],Bc=A$[2],Bd=Ba[3],Be=A_[2],Bf=d0(yU[6],Bb,A$[1]),Bg=d0(yU[7],Ba[1],Bf),Bi=d0(yZ[7],Ba[4],A$[4]),Bj=function(Bh){return d0(yU[3],Bb,Bh[1]);},Bk=d0(y9[17],Bj,Bc),Bo=y9[1],Bp=function(Bl){var Bm=Bl[2],Bn=[0,dN(yU[5],Bd),Bm];return dN(y9[4],Bn);},Bq=l2(y9[14],Bp,Bk,Bo);return [0,[0,Bg,d0(A2,d0(A3,d0(A2,Ba[2],Bc),Bk),Bq),Bd,Bi],Be];}var Br=A7(A8,A4[2]),Bs=Br[1],Bt=Bs[3],Bu=Bs[4],Bv=Bs[2],Bx=Br[2],By=function(Bw){return d0(yU[3],Bt,Bw[1]);},Bz=d0(y9[17],By,Bv),BD=y9[1],BE=function(BB){function BC(BA){return dN(y9[4],[0,BB,BA[2]]);}return d0(y9[14],BC,Bz);},BF=d0(A2,Bv,l2(yZ[14],BE,Bu,BD));return [0,[0,Bs[1],BF,Bt,Bu],Bx];}if(!(748545556<=A5)){var BG=A4[2],BH=A7(A8,BG[1]),BI=A7(BH[2],BG[2]),BJ=BI[1],BK=BH[1],BL=BJ[3],BM=BJ[2],BN=BI[2],BO=d0(yU[6],BL,BJ[1]),BQ=d0(yU[7],BK[1],BO),BR=function(BP){return d0(yU[3],BL,BP[1]);},BS=d0(y9[17],BR,BM),BX=y9[1],BW=BK[4],BY=function(BU){function BV(BT){return dN(y9[4],[0,BU,BT[2]]);}return d0(y9[14],BV,BS);},BZ=l2(yZ[14],BY,BW,BX),B0=d0(A2,d0(A3,d0(A2,BK[2],BM),BS),BZ);return [0,[0,BQ,B0,BK[3],BJ[4]],BN];}}return q(aB);}function E7(CF){return A7(0,CF)[1];}function D6(CJ,DW,CG){var CH=CG[2],CI=CG[1],CO=CJ[2];function DV(CK,DU){var CM=zu(CK);function CN(CL){return d0(yU[12],CL[1],CM);}var CP=d0(y9[17],CN,CO),Da=[0,y9[1],0];function Db(CQ,C$){return zs(function(CS){var CR=CQ[1],CT=zt(CS),CU=d0(yU[8],CR,CT),CV=dN(yU[2],CU);if(CV){var CY=yU[1],CZ=function(CW){var CX=d0(yT[22],CW,CK);return dN(yU[4],CX);},C0=l2(yU[14],CZ,CR,CY),C1=d0(yU[12],C0,CI);if(C1){var C6=CQ[2],C7=function(C2){var C4=C2[1];function C5(C3){return caml_string_equal(C4,C3[1]);}return d0(y2[16],C5,CH);},C8=d0(y2[15],C7,C6),C9=1;}else{var C_=C1,C9=0;}}else{var C_=CV,C9=0;}if(!C9)var C8=C_;return C8?[0,d0(y9[4],CQ,CS),[0,CS,0]]:[0,CS,0];},C$);}var Dh=l2(y9[14],Db,CP,Da),DT=d0(eF,function(Dc){var De=zt(Dc);function Dg(Df,Dd){return d0(yU[3],Dd,CI)?d0(yU[3],Df,De):1;}return d0(yT[12],Dg,CK);},Dh);return eg(function(DS,DQ){var DO=dN(yY[5],CK);function DP(Di,DN){var DL=yY[1];function DM(Dn,DK){var Dj=Di[1];function Dm(Dk,Dl){return 1-d0(yU[3],Dk,Dj);}var Do=d0(yT[14],Dm,Dn),Dp=dN(yY[5],Do),DH=Di[2];function DI(Dq,DD){var Dv=Dq[2],Ds=Dq[1],Du=yU[1];function Dw(Dr){return caml_string_equal(Ds,Dr[1])?dN(yU[4],Dr[2]):function(Dt){return Dt;};}var Dx=l2(y2[14],Dw,CH,Du),DF=yY[1];function DG(Dz){var DB=yY[1];function DC(Dy){var DA=l2(yT[4],Dv,Dz,Dy);return dN(yY[4],DA);}var DE=l2(yY[14],DC,DD,DB);return dN(yY[7],DE);}return l2(yU[14],DG,Dx,DF);}var DJ=l2(y2[14],DI,DH,Dp);return d0(yY[7],DJ,DK);}return l2(yY[14],DM,DN,DL);}var DR=l2(y9[14],DP,DQ,DO);return d0(yY[7],DR,DS);},DU,DT);}var DX=l2(yY[14],DV,DW[2],yY[1]),DZ=d0(yU[9],DW[1],CI);function D0(DY){return dN(yU[4],DY[2]);}return [0,l2(y2[14],D0,CH,DZ),DX];}function FP(D4,D1){var D2=D1[4],D3=D1[3],D5=D4[3],D8=D4[4],D7=D4[2],Ea=dN(D6,[0,D1[1],D1[2],D3,D2]),Eb=j0([0,function(D_,D9){var D$=d0(yU[10],D_[1],D9[1]);return 0===D$?d0(yY[10],D_[2],D9[2]):D$;}]);function EV(Ec){var Eg=dN(Eb[20],Ec);return d0(ux,aC,eI(aD,dP(function(Ed){var Ee=dN(yY[20],Ed[2]),Ef=d0(ux,aS,eI(aT,dP(dN(zw,dk),Ee)));return l2(ux,aE,zv(Ed[1]),Ef);},Eg)));}function Ex(Ew,Ek,Eh){var Ei=Eh[2],Ej=Eh[1];if(d0(Eb[3],[0,Ej,Ei],Ek))return Ek;var Em=d0(Eb[4],[0,Ej,Ei],Ek),En=function(El){return d0(yU[12],El[1],Ej);},EY=d0(y9[17],En,D7),EZ=function(Eo,Ey){var Ep=d0(Ea,[0,Ej,Ei],Eo),Eq=Ep[2],Er=Ep[1];if(d0(yZ[3],Er,D8)){var Eu=function(Es){var Et=zu(Es);return d0(yZ[3],Et,D2);},Ev=d0(yY[16],Eu,Eq);}else var Ev=1;if(Ev)return Ex([0,Eo,Ew],Ey,[0,Er,Eq]);var Ez=d0(Eb[4],[0,Er,Eq],Ey),EA=ee([0,Eo,Ew]),EB=0,EC=EA;for(;;){if(EC){var EE=EC[2],ED=EB+1|0,EB=ED,EC=EE;continue;}var EF=y5[1],EG=0,EH=EA;for(;;){if(EH){var EI=EH[2],ES=EG+1|0,ER=EH[1][2],ET=function(EG,EI){return function(EJ,EQ){var EK=EG+1|0,EL=EI,EM=EJ[2];for(;;){if(EL){if(!d0(yU[3],EM,EL[1][1])){var EP=EL[2],EO=EK+1|0,EK=EO,EL=EP;continue;}var EN=EK;}else var EN=EB;return d0(y5[4],[0,EG,EJ[1],EN],EQ);}};}(EG,EI),EU=l2(y2[14],ET,ER,EF),EF=EU,EG=ES,EH=EI;continue;}var EW=AV([0,0,EF,EB]),EX=EV(Ez);throw [0,zx,dN(Eb[19],Ez),EX,EW];}}};return l2(y9[14],EZ,EY,Em);}try {var E0=d0(yT[5],D3,D5),E1=dN(yY[5],E0),E2=[0,dN(yU[5],D5),E1],E3=Ex(0,Eb[1],E2),E4=EV(E3),E5=[0,dN(Eb[19],E3),E4,0];}catch(E6){if(E6[1]===zx)return [0,E6[2],E6[3],[0,E6[4]]];throw E6;}return E5;}function FQ(E_,Fe,Fd,E9,E8){var E$=d0(E_,E9,E8),Fa=E$[3],Fb=E$[2],Fc=E$[1];return Fa?[0,0,[0,[0,Fb,Ff(ux,ax,Fe,Fd,Fc,yJ(Fa[1]))],0]]:[0,1,[0,[0,Fb,Fg(ux,aw,Fe,Fd,Fc)],0]];}function FR(Fo,Fz,Fh){var Fi=yP(Fh),Fj=Fi[3],Fk=Fi[2],Fl=Fi[1],Fm=yJ(Fj),Fn=yJ(Fk),Fp=dN(Fo,Fj),Fq=dN(Fo,Fk);function Fx(Fr){return [0,1-Fr[1],Fr[2]];}function Fy(Ft,Fs){var Fv=dg(Ft[2],Fs[2]),Fu=Ft[1],Fw=Fu?Fs[1]:Fu;return [0,Fw,Fv];}if(17064<=Fl)if(3802040<=Fl)if(3901498<=Fl){var FA=Fx(Fg(Fz,Fn,Fm,Fq,Fp)),FB=FA[2],FC=FA[1];if(FC)var FD=[0,FC,FB];else{var FE=Fx(Fg(Fz,Fm,Fn,Fp,Fq)),FF=dg(FB,FE[2]),FD=[0,FE[1],FF];}var FG=FD;}else var FG=Fg(Fz,Fn,Fm,Fq,Fp);else if(3553395<=Fl)var FG=Fg(Fz,Fm,Fn,Fp,Fq);else{var FH=Fx(Fg(Fz,Fm,Fn,Fp,Fq)),FG=Fy(Fg(Fz,Fn,Fm,Fq,Fp),FH);}else if(15500===Fl){var FI=Fg(Fz,Fm,Fn,Fp,Fq),FG=Fy(Fg(Fz,Fn,Fm,Fq,Fp),FI);}else if(15949<=Fl){var FJ=Fg(Fz,Fm,Fn,Fp,Fq),FG=Fy(Fx(Fg(Fz,Fn,Fm,Fq,Fp)),FJ);}else{var FK=Fx(Fg(Fz,Fm,Fn,Fp,Fq)),FG=Fy(Fx(Fg(Fz,Fn,Fm,Fq,Fp)),FK);}var FL=FG[1],FN=FG[2],FM=FL?aA:az,FO=17064<=Fl?3802040<=Fl?3901498<=Fl?a0:aZ:3553395<=Fl?aY:aX:15500===Fl?aU:15949<=Fl?aW:aV;return [0,FL,Ff(ux,ay,Fn,FO,Fm,FM),FN];}var FS=[0,E],F9=d0(FR,E7,dN(FQ,FP));function F7(FT){function FY(FX,FW,FU){try {var FV=FT.safeGet(FU),FZ=10===FV?FY(G,[0,FX,FW],FU+1|0):(k.safeSet(0,FV),FY(dj(FX,k),FW,FU+1|0));}catch(F0){if(F0[1]===b)return ee([0,FX,FW]);throw F0;}return FZ;}return FY(F,0,0);}function F_(F2,F1){try {var F3=dN(F2,F1);}catch(F4){if(F4[1]===e6)return H;throw F4;}return F3;}function Gu(F5,Gf,Gc,F8){var F6=xy(F5),F$=F7(F8),Gk=dP(dN(F_,F9),F$),Gm=zs(function(Ga){var Gb=caml_string_notequal(Ga[2],Q);if(Gb){var Gi=Ga[3],Gj=eg(function(Gh,Gd){var Ge=Gc?d0(ux,N,Gd[1]):M,Gg=Gf?d0(ux,L,Gd[2]):K;return dj(Gh,dj(Gg,Ge));},J,Gi);return F7(l2(ux,I,Ga[2],Gj));}return Gb;},Gk),Gn=dP(function(Gl){return Gl.toString();},Gm),Gq=[0,O.toString(),[0,P.toString(),Gn]];ef(function(Gp){var Go=wY(F5,bt);Go.innerHTML=Gp;wN(F6,Go);return wN(F6,wY(F5,bs));},Gq);return F6;}function Gv(Gr,Gt){var Gs=Gr.firstChild;if(Gs!=wB)Gr.removeChild(Gs);return wN(Gr,Gt);}var JR=C.toString(),JQ={"border":B.toString(),"background":C.toString()},JP=A.toString(),GH={"border":z.toString(),"background":A.toString(),"highlight":{"border":B.toString(),"background":C.toString()}},JO=y.toString(),JN={"border":x.toString(),"background":y.toString()},JM=w.toString(),Hq={"border":v.toString(),"background":w.toString(),"highlight":{"border":x.toString(),"background":y.toString()}},JL=u.toString(),JK={"border":t.toString(),"background":u.toString()},JJ=s.toString(),GC={"border":r.toString(),"background":s.toString(),"highlight":{"border":t.toString(),"background":u.toString()}};function HK(Gw){var Gx=E7(fM(yr,1,yA,e4(Gw))),Gy=Gx[3],Gz=Gx[1],GA=$.toString(),GB=d0(ux,_,Gy).toString(),GD=[0,{"id":d0(ux,Z,Gy).toString(),"label":GB,"shape":GA,"color":GC,"fontSize":27},0],GL=27,GK=d0(yU[6],Gy,Gz);function GM(GE,GI){var GF=Y.toString(),GG=d0(ux,X,GE).toString(),GJ=27;return [0,{"id":d0(ux,W,GE).toString(),"label":GG,"shape":GF,"color":GH,"fontSize":27},GI];}var GN=l2(yU[14],GM,GK,GD),GO=dN(yU[22],Gz)+1|0;function G4(GQ){var GR=dP(function(GP){return GP;},GQ);if(GR){var GS=0,GT=GR,GZ=GR[2],GW=GR[1];for(;;){if(GT){var GV=GT[2],GU=GS+1|0,GS=GU,GT=GV;continue;}var GX=caml_make_vect(GS,GW),GY=1,G0=GZ;for(;;){if(G0){var G1=G0[2];GX[GY+1]=G0[1];var G2=GY+1|0,GY=G2,G0=G1;continue;}var G3=GX;break;}break;}}else var G3=[0];return caml_js_from_array(G3);}var Ht=[0,GO,GN,0],Hs=Gx[2];function Hu(G7,G5){var G6=G5[1],Hb=G5[3],Ha=G7[1];function Hc(G9,G$){var G8=aa.toString(),G_=dk(G6).toString();return [0,{"from":dk(G9).toString(),"to":G_,"style":G8},G$];}var Hd=l2(yU[14],Hc,Ha,Hb),Hk=G7[2];function Hl(He,Hj){var Hh=ac.toString(),Hg=He[1].toString(),Hf=ab.toString(),Hi=dk(He[2]).toString();return [0,{"from":dk(G6).toString(),"to":Hi,"fontSize":Hf,"label":Hg,"style":Hh},Hj];}var Hm=l2(y2[14],Hl,Hk,Hd),Ho=G5[2],Hn=V.toString(),Hp=d0(ux,U,G6-GO|0).toString(),Hr=25;return [0,G6+1|0,[0,{"id":d0(ux,T,G6).toString(),"label":Hp,"shape":Hn,"color":Hq,"fontSize":25},Ho],Hm];}var Hv=l2(y9[14],Hu,Hs,Ht),Hw=d0(ux,ad,d0(ux,aQ,eI(aR,dP(zv,dN(yZ[20],Gx[4]))))).toString(),Hx=G4(Hv[3]);return [0,{"nodes":G4(Hv[2]),"edges":Hx},Hw];}function JS(JI){try {var Hz=function(Hy){throw [0,FS];},HB=wE(wP.getElementById(i.toString()),Hz),HA=xr(0,0,wP),HC=xs(wP),HD=xt(wP);HA.size=20;HA.value=D.toString();HC.id=dj(i,ai).toString();HC.className=ah.toString();HD.className=ag.toString();HA.className=af.toString();var HE=xv(wP),HF=xw(wP),HG=xx(wP),HH=xx(wP);wN(HB,HE);wN(HE,HF);wN(HF,HG);wN(HG,HA);wN(HF,HH);wN(HH,HC);wN(HH,HD);var HM=d0(ux,ae,i),HP=function(HJ,HO){var HI=new MlWrappedString(HA.value);if(caml_string_notequal(HI,HJ)){try {var HL=HK(HI);window.data=HL[1];caml_js_eval_string(HM);HD.innerHTML=HL[2];}catch(HN){}return [0,20,HI];}return [0,c_(0,HO-1|0),HI];},HQ=HP;}catch(HR){if(HR[1]!==FS)throw HR;var HQ=function(HS,HT){return [0,HT,HS];};}try {var HV=function(HU){throw [0,FS];},HX=wE(wP.getElementById(av.toString()),HV),HW=xg(0,0,wP,bo),HY=xx(wP),HZ=xu(wP);HW.rows=20;HW.cols=50;HW.value=l.toString();HZ.className=S.toString();HW.className=R.toString();var H0=xv(wP),H1=xw(wP),H2=xx(wP);wN(HX,H0);wN(H0,H1);wN(H1,H2);wN(H2,HW);wN(H1,HY);wN(HY,HZ);var H7=function(H4,H6){var H3=new MlWrappedString(HW.value);if(caml_string_notequal(H3,H4)){try {Gv(HZ,Gu(wP,1,0,H3));}catch(H5){}return [0,20,H3];}return [0,c_(0,H6-1|0),H3];},H8=H7;}catch(H9){if(H9[1]!==FS)throw H9;var H8=function(H_,H$){return [0,H$,H_];};}try {var Ib=function(Ia){throw [0,FS];},Id=wE(wP.getElementById(j.toString()),Ib),Ic=xr(0,0,wP),Ie=xy(wP),If=xs(wP),Ig=xt(wP),Ih=xy(wP),Ii=xs(wP),Ij=xt(wP),Ik=xy(wP);Ic.size=50;Ic.value=l.toString();Ic.className=ao.toString();If.id=dj(j,an).toString();If.className=am.toString();Ii.id=dj(j,al).toString();Ii.className=ak.toString();var Il=xv(wP),Im=xw(wP),In=xw(wP),Io=xw(wP),Ip=xx(wP),Iq=xx(wP),Ir=xx(wP),Is=xx(wP),It=xu(wP);It.className=aj.toString();wN(Id,Il);wN(Il,Im);wN(Il,In);wN(Il,Io);wN(Im,Ip);wN(Ip,Ic);wN(In,Iq);wN(In,Ir);wN(Iq,Ie);wN(Iq,If);wN(Iq,Ig);wN(Ir,Ih);wN(Ir,Ii);wN(Ir,Ij);wN(Io,Is);wN(Is,It);wN(It,Ik);var IC=function(Iy,Iu){var Iv=yJ(Iu),Iw=HK(Iv),Ix=Iw[2];window.data=Iw[1];caml_js_eval_string(l2(ux,ap,j,Iy));return 1===Iy?(Ie.innerHTML=dj(ar,Iv).toString(),Ig.innerHTML=Ix):(Ih.innerHTML=dj(aq,Iv).toString(),Ij.innerHTML=Ix);},IF=function(IA,IE){var Iz=new MlWrappedString(Ic.value);if(caml_string_notequal(Iz,IA)){try {var IB=yP(Iz);IC(1,IB[2]);IC(2,IB[3]);Gv(Ik,Gu(wP,1,1,Iz));}catch(ID){}return [0,20,Iz];}return [0,c_(0,IE-1|0),Iz];},IG=IF;}catch(IH){if(IH[1]!==FS)throw IH;var IG=function(II,IJ){return [0,IJ,II];};}function IU(IL,IN,IQ,IK){var IM=HQ(IL,IK),IP=IM[2],IO=H8(IN,IM[1]),IS=IO[2],IR=IG(IQ,IO[1]),IT=IR[1],IV=IR[2];function IX(IW){return IU(IP,IS,IV,IT);}var IY=0===IT?0.5:0.1,IZ=[0,[2,[0,1,0,0,0]]],I0=[0,0];function I5(I1,I7){var I2=xz<I1?[0,xz,I1-xz]:[0,I1,0],I3=I2[2],I6=I2[1],I4=I3==0?dN(wr,IZ):dN(I5,I3);I0[1]=[0,wO.setTimeout(caml_js_wrap_callback(I4),I6*1e3)];return 0;}I5(IY,0);function I_(I9){var I8=I0[1];return I8?wO.clearTimeout(I8[1]):0;}var I$=vx(IZ)[1];switch(I$[0]){case 1:var Ja=I$[1][1]===vl?(vY(I_,0),1):0;break;case 2:var Jb=I$[1],Jc=[0,vp[1],I_],Jd=Jb[4],Je=typeof Jd==="number"?Jc:[2,Jc,Jd];Jb[4]=Je;var Ja=1;break;default:var Ja=0;}var Jf=vx(IZ),Jg=Jf[1];switch(Jg[0]){case 1:var Jh=[0,Jg];break;case 2:var Ji=Jg[1],Jj=[0,[2,[0,[0,[0,Jf]],0,0,0]]],Jl=vp[1],JF=[1,function(Jk){switch(Jk[0]){case 0:var Jm=Jk[1];vp[1]=Jl;try {var Jn=IX(Jm),Jo=Jn;}catch(Jp){var Jo=[0,[1,Jp]];}var Jq=vx(Jj),Jr=vx(Jo),Js=Jq[1];{if(2===Js[0]){var Jt=Js[1];if(Jq===Jr)var Ju=0;else{var Jv=Jr[1];if(2===Jv[0]){var Jw=Jv[1];Jr[1]=[3,Jq];Jt[1]=Jw[1];var Jx=wp(Jt[2],Jw[2]),Jy=Jt[3]+Jw[3]|0;if(vo<Jy){Jt[3]=0;Jt[2]=wm(Jx);}else{Jt[3]=Jy;Jt[2]=Jx;}var Jz=Jw[4],JA=Jt[4],JB=typeof JA==="number"?Jz:typeof Jz==="number"?JA:[2,JA,Jz];Jt[4]=JB;var Ju=0;}else{Jq[1]=Jv;var Ju=v4(Jt,Jv);}}return Ju;}throw [0,d,bK];}case 1:var JC=vx(Jj),JD=JC[1];{if(2===JD[0]){var JE=JD[1];JC[1]=Jk;return v4(JE,Jk);}throw [0,d,bL];}default:throw [0,d,bN];}}],JG=Ji[2],JH=typeof JG==="number"?JF:[2,JF,JG];Ji[2]=JH;var Jh=Jj;break;case 3:throw [0,d,bM];default:var Jh=IX(Jg[1]);}return Jh;}IU(as,at,au,0);return wJ;}wO.onload=caml_js_wrap_callback(function(JT){if(JT){var JU=JS(JT);if(!(JU|0))JT.preventDefault();return JU;}var JV=event,JW=JS(JV);if(!(JW|0))JV.returnValue=JW;return JW;});dt(0);return;}());
