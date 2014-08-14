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
(function(){function ul(Kh,Ki,Kj,Kk,Kl,Km,Kn){return Kh.length==6?Kh(Ki,Kj,Kk,Kl,Km,Kn):caml_call_gen(Kh,[Ki,Kj,Kk,Kl,Km,Kn]);}function Fh(Kb,Kc,Kd,Ke,Kf,Kg){return Kb.length==5?Kb(Kc,Kd,Ke,Kf,Kg):caml_call_gen(Kb,[Kc,Kd,Ke,Kf,Kg]);}function Fi(J8,J9,J_,J$,Ka){return J8.length==4?J8(J9,J_,J$,Ka):caml_call_gen(J8,[J9,J_,J$,Ka]);}function l4(J4,J5,J6,J7){return J4.length==3?J4(J5,J6,J7):caml_call_gen(J4,[J5,J6,J7]);}function d2(J1,J2,J3){return J1.length==2?J1(J2,J3):caml_call_gen(J1,[J2,J3]);}function dP(JZ,J0){return JZ.length==1?JZ(J0):caml_call_gen(JZ,[J0]);}var a=[0,new MlString("Failure")],b=[0,new MlString("Invalid_argument")],c=[0,new MlString("Not_found")],d=[0,new MlString("Assert_failure")],e=[0,new MlString(""),0,0,-1],f=[0,new MlString(""),1,0,0],g=new MlString("File \"%s\", line %d, characters %d-%d: %s"),h=[0,new MlString("\0\0\xeb\xff\xec\xff\x02\0\x1e\0L\0\xf5\xff\xf6\xff\xf7\xff\xf8\xff\xf9\xff\xfa\xff\xfb\xffM\0\xfd\xff\x0b\0\xbf\0\xfe\xff\x03\0 \0\xf4\xff\xf3\xff\xef\xff\xf2\xff\xee\xff\x01\0\xfd\xff\xfe\xff\xff\xff"),new MlString("\xff\xff\xff\xff\xff\xff\x0f\0\x0e\0\x12\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x03\0\xff\xff\x14\0\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString("\x01\0\0\0\0\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\xff\xff\xff\xff\0\0\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\x1a\0\0\0\0\0\0\0"),new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\x0e\0\x1c\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\b\0\0\0\x07\0\x06\0\f\0\x0b\0\x10\0\0\0\t\0\x0f\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x11\0\0\0\x04\0\x05\0\x03\0\x18\0\x15\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x17\0\x16\0\x14\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x12\0\n\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\x13\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x10\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x02\0\x1b\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"),new MlString("\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\0\0\x19\0\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x0f\0\xff\xff\0\0\0\0\0\0\x03\0\x12\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x13\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x05\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\x05\0\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x10\0\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\x19\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString("")],i=new MlString("draw"),j=new MlString("details"),k=new MlString(" "),l=new MlString("(a|b)+.C & d > d & a.b.C & (d|a)\n");caml_register_global(6,c);caml_register_global(5,[0,new MlString("Division_by_zero")]);caml_register_global(3,b);caml_register_global(2,a);var c_=[0,new MlString("Out_of_memory")],c9=[0,new MlString("Match_failure")],c8=[0,new MlString("Stack_overflow")],c7=[0,new MlString("Undefined_recursive_module")],c6=new MlString("%.12g"),c5=new MlString("."),c4=new MlString("%d"),c3=new MlString("true"),c2=new MlString("false"),c1=new MlString("Pervasives.do_at_exit"),c0=new MlString("Array.blit"),cZ=new MlString("\\b"),cY=new MlString("\\t"),cX=new MlString("\\n"),cW=new MlString("\\r"),cV=new MlString("\\\\"),cU=new MlString("\\'"),cT=new MlString(""),cS=new MlString("String.blit"),cR=new MlString("String.sub"),cQ=new MlString(""),cP=new MlString("syntax error"),cO=new MlString("Parsing.YYexit"),cN=new MlString("Parsing.Parse_error"),cM=new MlString("Set.remove_min_elt"),cL=[0,0,0,0],cK=[0,0,0],cJ=new MlString("Set.bal"),cI=new MlString("Set.bal"),cH=new MlString("Set.bal"),cG=new MlString("Set.bal"),cF=new MlString("Map.remove_min_elt"),cE=[0,0,0,0],cD=[0,new MlString("map.ml"),270,10],cC=[0,0,0],cB=new MlString("Map.bal"),cA=new MlString("Map.bal"),cz=new MlString("Map.bal"),cy=new MlString("Map.bal"),cx=new MlString("Queue.Empty"),cw=new MlString("Buffer.add: cannot grow buffer"),cv=new MlString(""),cu=new MlString(""),ct=new MlString("%.12g"),cs=new MlString("\""),cr=new MlString("\""),cq=new MlString("'"),cp=new MlString("'"),co=new MlString("nan"),cn=new MlString("neg_infinity"),cm=new MlString("infinity"),cl=new MlString("."),ck=new MlString("printf: bad positional specification (0)."),cj=new MlString("%_"),ci=[0,new MlString("printf.ml"),143,8],ch=new MlString("'"),cg=new MlString("Printf: premature end of format string '"),cf=new MlString("'"),ce=new MlString(" in format string '"),cd=new MlString(", at char number "),cc=new MlString("Printf: bad conversion %"),cb=new MlString("Sformat.index_of_int: negative argument "),ca=new MlString(""),b$=new MlString(", %s%s"),b_=[1,1],b9=new MlString("%s\n"),b8=new MlString("(Program not linked with -g, cannot print stack backtrace)\n"),b7=new MlString("Raised at"),b6=new MlString("Re-raised at"),b5=new MlString("Raised by primitive operation at"),b4=new MlString("Called from"),b3=new MlString("%s file \"%s\", line %d, characters %d-%d"),b2=new MlString("%s unknown location"),b1=new MlString("Out of memory"),b0=new MlString("Stack overflow"),bZ=new MlString("Pattern matching failed"),bY=new MlString("Assertion failed"),bX=new MlString("Undefined recursive module"),bW=new MlString("(%s%s)"),bV=new MlString(""),bU=new MlString(""),bT=new MlString("(%s)"),bS=new MlString("%d"),bR=new MlString("%S"),bQ=new MlString("_"),bP=[0,new MlString("src/core/lwt.ml"),648,20],bO=[0,new MlString("src/core/lwt.ml"),651,8],bN=[0,new MlString("src/core/lwt.ml"),498,8],bM=[0,new MlString("src/core/lwt.ml"),487,9],bL=new MlString("Lwt.wakeup_result"),bK=new MlString("Lwt.Canceled"),bJ=new MlString("\""),bI=new MlString(" name=\""),bH=new MlString("\""),bG=new MlString(" type=\""),bF=new MlString("<"),bE=new MlString(">"),bD=new MlString(""),bC=new MlString("<input name=\"x\">"),bB=new MlString("input"),bA=new MlString("x"),bz=new MlString("code"),by=new MlString("td"),bx=new MlString("tr"),bw=new MlString("table"),bv=new MlString("a"),bu=new MlString("br"),bt=new MlString("pre"),bs=new MlString("p"),br=new MlString("div"),bq=new MlString("textarea"),bp=new MlString("input"),bo=new MlString("Exception during Lwt.async: "),bn=new MlString("parser"),bm=new MlString("1"),bl=new MlString("0"),bk=[0,0,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,0],bj=new MlString("\xff\xff\x02\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\0\0\0\0"),bi=new MlString("\x02\0\x03\0\x01\0\x02\0\x03\0\x03\0\x03\0\x02\0\x02\0\x03\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x02\0\x02\0"),bh=new MlString("\0\0\0\0\0\0\0\0\x02\0\0\0\0\0\0\0\x12\0\0\0\x03\0\0\0\0\0\b\0\x07\0\0\0\n\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\0\0\t\0\0\0\0\0\0\0\0\0"),bg=new MlString("\x03\0\x06\0\b\0\x17\0"),bf=new MlString("\x05\0\x01\xff\x01\xff\0\0\0\0\x01\xff\n\xff\x18\xff\0\0'\xff\0\0\x01\xff\x01\xff\0\0\0\0\x01\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x01\xff\0\x000\xff<\xff4\xff\n\xff"),be=new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x1d\0\x01\0\x0f\0\b\0"),bd=new MlString("\0\0\xfe\xff\0\0\0\0"),bc=new MlString("\x07\0\x04\0\x04\0\t\0\x11\0\x05\0\x01\0\x02\0\x01\0\x19\0\x1a\0\0\0\n\0\x1b\0\0\0\x05\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x1c\0\0\0\0\0\0\0\0\0\n\0\0\0\0\0\x06\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\x11\0\x12\0\x13\0\x14\0\x15\0\n\0\x16\0\0\0\x18\0\x0b\0\f\0\r\0\x0e\0\x0f\0\n\0\0\0\0\0\0\0\n\0\f\0\r\0\x0e\0\x0f\0\f\0\r\0\x0e\0\n\0\0\0\0\0\0\0\0\0\0\0\r\0\x0e\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x04\0\0\0\0\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\0\0\x04\0\x05\0\x05\0\0\0\0\0\0\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\0\0\x05\0\x06\0\x06\0\0\0\0\0\0\0\0\0\x06\0\x06\0\x06\0\x06\0\x06\0\x06\0\0\0\x06\0"),bb=new MlString("\x02\0\0\0\x01\x01\x05\0\0\0\x04\x01\x01\0\x02\0\0\0\x0b\0\f\0\xff\xff\x02\x01\x0f\0\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x17\0\xff\xff\xff\xff\xff\xff\xff\xff\x02\x01\xff\xff\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\x02\x01\x12\x01\xff\xff\x05\x01\x06\x01\x07\x01\b\x01\t\x01\n\x01\x02\x01\xff\xff\xff\xff\xff\xff\x02\x01\x07\x01\b\x01\t\x01\n\x01\x07\x01\b\x01\t\x01\x02\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\b\x01\t\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x05\x01\x06\x01\x07\x01\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\xff\xff\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01"),ba=new MlString("EOF\0NEWLINE\0LPAR\0RPAR\0PLUS\0DOT\0PSTAR\0STAR\0INTER\0EGAL\0LEQ\0GEQ\0LT\0GT\0IMCOMP\0DUNNO\0DIFF\0"),a$=new MlString("VAR\0POWER\0"),a_=new MlString("lexing error"),a9=new MlString("\xc3\xb8"),a8=new MlString("\xce\xb5"),a7=new MlString("(%s | %s)"),a6=new MlString("(%s)+"),a5=new MlString("(%s)~"),a4=new MlString("%s.%s"),a3=new MlString("(%s & %s)"),a2=new MlString("=/="),a1=new MlString("<="),a0=new MlString(">="),aZ=new MlString("<"),aY=new MlString(">"),aX=new MlString("<>"),aW=new MlString("="),aV=new MlString(","),aU=new MlString("{%s}"),aT=new MlString(","),aS=new MlString("{%s}"),aR=new MlString(","),aQ=new MlString("{%s}"),aP=new MlString("%d -> %s"),aO=new MlString(","),aN=new MlString("(%s)"),aM=new MlString("Tools.ContreExemple"),aL=new MlString("get_expr : empty word"),aK=[0,new MlString("word.ml"),134,4],aJ=new MlString("get_expr : stuck"),aI=new MlString("get_expr : stuck"),aH=[0,new MlString("word.ml"),84,15],aG=new MlString("(%s,%s)"),aF=new MlString(",\n"),aE=new MlString("{%s}"),aD=new MlString("Petri.trad : unsupported operation"),aC=new MlString("OK"),aB=new MlString("Incorrect"),aA=new MlString("%s %s %s --------- %s"),az=new MlString("\n%s <= %s -- false (%d pairs)\nWitness: %s"),ay=new MlString("\n%s <= %s -- true (%d pairs)"),ax=new MlString("solve"),aw=new MlString(""),av=new MlString(""),au=new MlString(""),at=new MlString("Automaton for : "),as=new MlString("Automaton for : "),ar=new MlString("new vis.Network(document.getElementById('%s_auto%d'),data, {})"),aq=new MlString("drawin"),ap=new MlString("_auto1"),ao=new MlString("auto"),an=new MlString("_auto2"),am=new MlString("auto"),al=new MlString("1px black dashed"),ak=new MlString("_auto"),aj=new MlString("auto"),ai=new MlString("center"),ah=new MlString("drawin"),ag=new MlString("new vis.Network(document.getElementById('%s_auto'),data, {})"),af=new MlString("Final states : %s"),ae=new MlString("arrow"),ad=new MlString("25"),ac=new MlString("arrow-center"),ab=new MlString("circle"),aa=new MlString("%d"),$=new MlString("%d"),_=new MlString("circle"),Z=new MlString("%d"),Y=new MlString("%d"),X=new MlString("box"),W=new MlString("   %d   "),V=new MlString("%d"),U=new MlString("1px black dashed"),T=new MlString("5px"),S=new MlString("output"),R=new MlString("solvein"),Q=new MlString(""),P=new MlString(""),O=new MlString("Result:"),N=new MlString("\n%s"),M=new MlString(""),L=new MlString("\n%s"),K=new MlString(""),J=new MlString(""),I=new MlString("%s\n%s\n"),H=[0,0,new MlString(""),0],G=new MlString(""),F=new MlString(""),E=new MlString("Wmain.NotDefined"),D=new MlString("(a|b)+.C & d | e.(a|b)"),C=new MlString("#D2E5FF"),B=new MlString("#2B7CE9"),A=new MlString("#97C2FC"),z=new MlString("#2B7CE9"),y=new MlString("#A1EC76"),x=new MlString("#41A906"),w=new MlString("#7BE141"),v=new MlString("#41A906"),u=new MlString("#D3BDF0"),t=new MlString("#7C29F0"),s=new MlString("#AD85E4"),r=new MlString("#7C29F0");function q(m){throw [0,a,m];}function c$(n){throw [0,b,n];}function da(p,o){return caml_greaterequal(p,o)?p:o;}function dl(db,dd){var dc=db.getLen(),de=dd.getLen(),df=caml_create_string(dc+de|0);caml_blit_string(db,0,df,0,dc);caml_blit_string(dd,0,df,dc,de);return df;}function dm(dg){return caml_format_int(c4,dg);}function di(dh,dj){if(dh){var dk=dh[1];return [0,dk,di(dh[2],dj)];}return dj;}var dn=caml_ml_open_descriptor_out(2);function dw(dq,dp){return caml_ml_output(dq,dp,0,dp.getLen());}function dv(du){var dr=caml_ml_out_channels_list(0);for(;;){if(dr){var ds=dr[2];try {}catch(dt){}var dr=ds;continue;}return 0;}}caml_register_named_value(c1,dv);function dA(dy,dx){return caml_ml_output_char(dy,dx);}function dH(dz){return caml_ml_flush(dz);}function dG(dD,dC,dF,dE,dB){if(0<=dB&&0<=dC&&!((dD.length-1-dB|0)<dC)&&0<=dE&&!((dF.length-1-dB|0)<dE))return caml_array_blit(dD,dC,dF,dE,dB);return c$(c0);}function eg(dI){var dJ=dI,dK=0;for(;;){if(dJ){var dL=dJ[2],dM=[0,dJ[1],dK],dJ=dL,dK=dM;continue;}return dK;}}function dR(dO,dN){if(dN){var dQ=dN[2],dS=dP(dO,dN[1]);return [0,dS,dR(dO,dQ)];}return 0;}function eh(dV,dT){var dU=dT;for(;;){if(dU){var dW=dU[2];dP(dV,dU[1]);var dU=dW;continue;}return 0;}}function ei(d1,dX,dZ){var dY=dX,d0=dZ;for(;;){if(d0){var d3=d0[2],d4=d2(d1,dY,d0[1]),dY=d4,d0=d3;continue;}return dY;}}function ej(d7,d5){var d6=d5;for(;;){if(d6){var d8=d6[2],d9=0===caml_compare(d6[1],d7)?1:0;if(d9)return d9;var d6=d8;continue;}return 0;}}function eH(ee){return dP(function(d_,ea){var d$=d_,eb=ea;for(;;){if(eb){var ec=eb[2],ed=eb[1];if(dP(ee,ed)){var ef=[0,ed,d$],d$=ef,eb=ec;continue;}var eb=ec;continue;}return eg(d$);}},0);}function eG(ek,em){var el=caml_create_string(ek);caml_fill_string(el,0,ek,em);return el;}function eI(ep,en,eo){if(0<=en&&0<=eo&&!((ep.getLen()-eo|0)<en)){var eq=caml_create_string(eo);caml_blit_string(ep,en,eq,0,eo);return eq;}return c$(cR);}function eJ(et,es,ev,eu,er){if(0<=er&&0<=es&&!((et.getLen()-er|0)<es)&&0<=eu&&!((ev.getLen()-er|0)<eu))return caml_blit_string(et,es,ev,eu,er);return c$(cS);}function eK(eC,ew){if(ew){var ex=ew[1],ey=[0,0],ez=[0,0],eB=ew[2];eh(function(eA){ey[1]+=1;ez[1]=ez[1]+eA.getLen()|0;return 0;},ew);var eD=caml_create_string(ez[1]+caml_mul(eC.getLen(),ey[1]-1|0)|0);caml_blit_string(ex,0,eD,0,ex.getLen());var eE=[0,ex.getLen()];eh(function(eF){caml_blit_string(eC,0,eD,eE[1],eC.getLen());eE[1]=eE[1]+eC.getLen()|0;caml_blit_string(eF,0,eD,eE[1],eF.getLen());eE[1]=eE[1]+eF.getLen()|0;return 0;},eB);return eD;}return cT;}var eL=caml_sys_const_word_size(0),eM=caml_mul(eL/8|0,(1<<(eL-10|0))-1|0)-1|0,e5=252,e4=253;function e3(eP,eO,eN){var eQ=caml_lex_engine(eP,eO,eN);if(0<=eQ){eN[11]=eN[12];var eR=eN[12];eN[12]=[0,eR[1],eR[2],eR[3],eN[4]+eN[6]|0];}return eQ;}function e6(eS){var e2=[0],e1=1,e0=0,eZ=0,eY=0,eX=0,eW=0,eV=eS.getLen(),eU=dl(eS,cQ);return [0,function(eT){eT[9]=1;return 0;},eU,eV,eW,eX,eY,eZ,e0,e1,e2,f,f];}var e7=[0,cO],e8=[0,cN],e9=[0,caml_make_vect(100,0),caml_make_vect(100,0),caml_make_vect(100,e),caml_make_vect(100,e),100,0,0,0,e,e,0,0,0,0,0,0];function fg(fe){var e_=e9[5],e$=e_*2|0,fa=caml_make_vect(e$,0),fb=caml_make_vect(e$,0),fc=caml_make_vect(e$,e),fd=caml_make_vect(e$,e);dG(e9[1],0,fa,0,e_);e9[1]=fa;dG(e9[2],0,fb,0,e_);e9[2]=fb;dG(e9[3],0,fc,0,e_);e9[3]=fc;dG(e9[4],0,fd,0,e_);e9[4]=fd;e9[5]=e$;return 0;}var fK=[0,function(ff){return 0;}];function fO(fs,fo,fE,fp){var fn=e9[11],fm=e9[14],fl=e9[6],fk=e9[15],fj=e9[7],fi=e9[8],fh=e9[16];e9[6]=e9[14]+1|0;e9[7]=fo;e9[10]=fp[12];try {var fq=0,fr=0;for(;;)switch(caml_parse_engine(fs,e9,fq,fr)){case 1:throw [0,e8];case 2:fg(0);var fu=0,ft=2,fq=ft,fr=fu;continue;case 3:fg(0);var fw=0,fv=3,fq=fv,fr=fw;continue;case 4:try {var fx=[0,4,dP(caml_array_get(fs[1],e9[13]),e9)],fy=fx;}catch(fz){if(fz[1]!==e8)throw fz;var fy=[0,5,0];}var fB=fy[2],fA=fy[1],fq=fA,fr=fB;continue;case 5:dP(fs[14],cP);var fD=0,fC=5,fq=fC,fr=fD;continue;default:var fF=dP(fE,fp);e9[9]=fp[11];e9[10]=fp[12];var fG=1,fq=fG,fr=fF;continue;}}catch(fI){var fH=e9[7];e9[11]=fn;e9[14]=fm;e9[6]=fl;e9[15]=fk;e9[7]=fj;e9[8]=fi;e9[16]=fh;if(fI[1]===e7)return fI[2];fK[1]=function(fJ){return caml_obj_is_block(fJ)?caml_array_get(fs[3],caml_obj_tag(fJ))===fH?1:0:caml_array_get(fs[2],fJ)===fH?1:0;};throw fI;}}function fP(fL,fM){return caml_array_get(fL[2],fL[11]-fM|0);}function j3(fN){return 0;}function j2(gl){function f4(fQ){return fQ?fQ[4]:0;}function f6(fR,fW,fT){var fS=fR?fR[4]:0,fU=fT?fT[4]:0,fV=fU<=fS?fS+1|0:fU+1|0;return [0,fR,fW,fT,fV];}function gp(fX,f7,fZ){var fY=fX?fX[4]:0,f0=fZ?fZ[4]:0;if((f0+2|0)<fY){if(fX){var f1=fX[3],f2=fX[2],f3=fX[1],f5=f4(f1);if(f5<=f4(f3))return f6(f3,f2,f6(f1,f7,fZ));if(f1){var f9=f1[2],f8=f1[1],f_=f6(f1[3],f7,fZ);return f6(f6(f3,f2,f8),f9,f_);}return c$(cJ);}return c$(cI);}if((fY+2|0)<f0){if(fZ){var f$=fZ[3],ga=fZ[2],gb=fZ[1],gc=f4(gb);if(gc<=f4(f$))return f6(f6(fX,f7,gb),ga,f$);if(gb){var ge=gb[2],gd=gb[1],gf=f6(gb[3],ga,f$);return f6(f6(fX,f7,gd),ge,gf);}return c$(cH);}return c$(cG);}var gg=f0<=fY?fY+1|0:f0+1|0;return [0,fX,f7,fZ,gg];}function go(gm,gh){if(gh){var gi=gh[3],gj=gh[2],gk=gh[1],gn=d2(gl[1],gm,gj);return 0===gn?gh:0<=gn?gp(gk,gj,go(gm,gi)):gp(go(gm,gk),gj,gi);}return [0,0,gm,0,1];}function gw(gq){return [0,0,gq,0,1];}function gs(gt,gr){if(gr){var gv=gr[3],gu=gr[2];return gp(gs(gt,gr[1]),gu,gv);}return gw(gt);}function gy(gz,gx){if(gx){var gB=gx[2],gA=gx[1];return gp(gA,gB,gy(gz,gx[3]));}return gw(gz);}function gG(gC,gH,gD){if(gC){if(gD){var gE=gD[4],gF=gC[4],gM=gD[3],gN=gD[2],gL=gD[1],gI=gC[3],gJ=gC[2],gK=gC[1];return (gE+2|0)<gF?gp(gK,gJ,gG(gI,gH,gD)):(gF+2|0)<gE?gp(gG(gC,gH,gL),gN,gM):f6(gC,gH,gD);}return gy(gH,gC);}return gs(gH,gD);}function g2(gO){var gP=gO;for(;;){if(gP){var gQ=gP[1];if(gQ){var gP=gQ;continue;}return gP[2];}throw [0,c];}}function hf(gR){var gS=gR;for(;;){if(gS){var gT=gS[3],gU=gS[2];if(gT){var gS=gT;continue;}return gU;}throw [0,c];}}function gX(gV){if(gV){var gW=gV[1];if(gW){var gZ=gV[3],gY=gV[2];return gp(gX(gW),gY,gZ);}return gV[3];}return c$(cM);}function hg(g0,g1){if(g0){if(g1){var g3=gX(g1);return gG(g0,g2(g1),g3);}return g0;}return g1;}function g_(g8,g4){if(g4){var g5=g4[3],g6=g4[2],g7=g4[1],g9=d2(gl[1],g8,g6);if(0===g9)return [0,g7,1,g5];if(0<=g9){var g$=g_(g8,g5),hb=g$[3],ha=g$[2];return [0,gG(g7,g6,g$[1]),ha,hb];}var hc=g_(g8,g7),he=hc[2],hd=hc[1];return [0,hd,he,gG(hc[3],g6,g5)];}return cL;}var jX=0;function jY(hh){return hh?0:1;}function jZ(hk,hi){var hj=hi;for(;;){if(hj){var hn=hj[3],hm=hj[1],hl=d2(gl[1],hk,hj[2]),ho=0===hl?1:0;if(ho)return ho;var hp=0<=hl?hn:hm,hj=hp;continue;}return 0;}}function hy(hu,hq){if(hq){var hr=hq[3],hs=hq[2],ht=hq[1],hv=d2(gl[1],hu,hs);if(0===hv){if(ht)if(hr){var hw=gX(hr),hx=gp(ht,g2(hr),hw);}else var hx=ht;else var hx=hr;return hx;}return 0<=hv?gp(ht,hs,hy(hu,hr)):gp(hy(hu,ht),hs,hr);}return 0;}function hG(hz,hA){if(hz){if(hA){var hB=hA[4],hC=hA[2],hD=hz[4],hE=hz[2],hM=hA[3],hO=hA[1],hH=hz[3],hJ=hz[1];if(hB<=hD){if(1===hB)return go(hC,hz);var hF=g_(hE,hA),hI=hF[1],hK=hG(hH,hF[3]);return gG(hG(hJ,hI),hE,hK);}if(1===hD)return go(hE,hA);var hL=g_(hC,hz),hN=hL[1],hP=hG(hL[3],hM);return gG(hG(hN,hO),hC,hP);}return hz;}return hA;}function hX(hQ,hR){if(hQ){if(hR){var hS=hQ[3],hT=hQ[2],hU=hQ[1],hV=g_(hT,hR),hW=hV[1];if(0===hV[2]){var hY=hX(hS,hV[3]);return hg(hX(hU,hW),hY);}var hZ=hX(hS,hV[3]);return gG(hX(hU,hW),hT,hZ);}return 0;}return 0;}function h7(h0,h1){if(h0){if(h1){var h2=h0[3],h3=h0[2],h4=h0[1],h5=g_(h3,h1),h6=h5[1];if(0===h5[2]){var h8=h7(h2,h5[3]);return gG(h7(h4,h6),h3,h8);}var h9=h7(h2,h5[3]);return hg(h7(h4,h6),h9);}return h0;}return 0;}function ie(h_,ia){var h$=h_,ib=ia;for(;;){if(h$){var ic=h$[1],id=[0,h$[2],h$[3],ib],h$=ic,ib=id;continue;}return ib;}}function iu(ih,ig){var ii=ie(ig,0),ij=ie(ih,0),ik=ii;for(;;){if(ij)if(ik){var iq=ik[3],ip=ik[2],io=ij[3],im=ij[2],il=d2(gl[1],ij[1],ik[1]);if(0===il){var ir=ie(ip,iq),is=ie(im,io),ij=is,ik=ir;continue;}var it=il;}else var it=1;else var it=ik?-1:0;return it;}}function j0(iw,iv){return 0===iu(iw,iv)?1:0;}function iH(ix,iz){var iy=ix,iA=iz;for(;;){if(iy){if(iA){var iB=iA[3],iC=iA[1],iD=iy[3],iE=iy[2],iF=iy[1],iG=d2(gl[1],iE,iA[2]);if(0===iG){var iI=iH(iF,iC);if(iI){var iy=iD,iA=iB;continue;}return iI;}if(0<=iG){var iJ=iH([0,0,iE,iD,0],iB);if(iJ){var iy=iF;continue;}return iJ;}var iK=iH([0,iF,iE,0,0],iC);if(iK){var iy=iD;continue;}return iK;}return 0;}return 1;}}function iN(iO,iL){var iM=iL;for(;;){if(iM){var iQ=iM[3],iP=iM[2];iN(iO,iM[1]);dP(iO,iP);var iM=iQ;continue;}return 0;}}function iV(iW,iR,iT){var iS=iR,iU=iT;for(;;){if(iS){var iY=iS[3],iX=iS[2],iZ=d2(iW,iX,iV(iW,iS[1],iU)),iS=iY,iU=iZ;continue;}return iU;}}function i6(i2,i0){var i1=i0;for(;;){if(i1){var i5=i1[3],i4=i1[1],i3=dP(i2,i1[2]);if(i3){var i7=i6(i2,i4);if(i7){var i1=i5;continue;}var i8=i7;}else var i8=i3;return i8;}return 1;}}function je(i$,i9){var i_=i9;for(;;){if(i_){var jc=i_[3],jb=i_[1],ja=dP(i$,i_[2]);if(ja)var jd=ja;else{var jf=je(i$,jb);if(!jf){var i_=jc;continue;}var jd=jf;}return jd;}return 0;}}function ji(jj,jg){if(jg){var jh=jg[2],jl=jg[3],jk=ji(jj,jg[1]),jn=dP(jj,jh),jm=ji(jj,jl);return jn?gG(jk,jh,jm):hg(jk,jm);}return 0;}function jq(jr,jo){if(jo){var jp=jo[2],jt=jo[3],js=jq(jr,jo[1]),ju=js[2],jv=js[1],jx=dP(jr,jp),jw=jq(jr,jt),jy=jw[2],jz=jw[1];if(jx){var jA=hg(ju,jy);return [0,gG(jv,jp,jz),jA];}var jB=gG(ju,jp,jy);return [0,hg(jv,jz),jB];}return cK;}function jD(jC){if(jC){var jE=jC[1],jF=jD(jC[3]);return (jD(jE)+1|0)+jF|0;}return 0;}function jK(jG,jI){var jH=jG,jJ=jI;for(;;){if(jJ){var jM=jJ[2],jL=jJ[1],jN=[0,jM,jK(jH,jJ[3])],jH=jN,jJ=jL;continue;}return jH;}}function j1(jO){return jK(0,jO);}return [0,jX,jY,jZ,go,gw,hy,hG,hX,h7,iu,j0,iH,iN,iV,i6,je,ji,jq,jD,j1,g2,hf,g2,g_,function(jS,jP){var jQ=jP;for(;;){if(jQ){var jR=jQ[2],jV=jQ[3],jU=jQ[1],jT=d2(gl[1],jS,jR);if(0===jT)return jR;var jW=0<=jT?jV:jU,jQ=jW;continue;}throw [0,c];}}];}function oW(kL){function j5(j4){return j4?j4[5]:0;}function km(j6,ka,j$,j8){var j7=j5(j6),j9=j5(j8),j_=j9<=j7?j7+1|0:j9+1|0;return [0,j6,ka,j$,j8,j_];}function kD(kc,kb){return [0,0,kc,kb,0,1];}function kE(kd,ko,kn,kf){var ke=kd?kd[5]:0,kg=kf?kf[5]:0;if((kg+2|0)<ke){if(kd){var kh=kd[4],ki=kd[3],kj=kd[2],kk=kd[1],kl=j5(kh);if(kl<=j5(kk))return km(kk,kj,ki,km(kh,ko,kn,kf));if(kh){var kr=kh[3],kq=kh[2],kp=kh[1],ks=km(kh[4],ko,kn,kf);return km(km(kk,kj,ki,kp),kq,kr,ks);}return c$(cB);}return c$(cA);}if((ke+2|0)<kg){if(kf){var kt=kf[4],ku=kf[3],kv=kf[2],kw=kf[1],kx=j5(kw);if(kx<=j5(kt))return km(km(kd,ko,kn,kw),kv,ku,kt);if(kw){var kA=kw[3],kz=kw[2],ky=kw[1],kB=km(kw[4],kv,ku,kt);return km(km(kd,ko,kn,ky),kz,kA,kB);}return c$(cz);}return c$(cy);}var kC=kg<=ke?ke+1|0:kg+1|0;return [0,kd,ko,kn,kf,kC];}var oP=0;function oQ(kF){return kF?0:1;}function kQ(kM,kP,kG){if(kG){var kH=kG[4],kI=kG[3],kJ=kG[2],kK=kG[1],kO=kG[5],kN=d2(kL[1],kM,kJ);return 0===kN?[0,kK,kM,kP,kH,kO]:0<=kN?kE(kK,kJ,kI,kQ(kM,kP,kH)):kE(kQ(kM,kP,kK),kJ,kI,kH);}return [0,0,kM,kP,0,1];}function oR(kT,kR){var kS=kR;for(;;){if(kS){var kX=kS[4],kW=kS[3],kV=kS[1],kU=d2(kL[1],kT,kS[2]);if(0===kU)return kW;var kY=0<=kU?kX:kV,kS=kY;continue;}throw [0,c];}}function oS(k1,kZ){var k0=kZ;for(;;){if(k0){var k4=k0[4],k3=k0[1],k2=d2(kL[1],k1,k0[2]),k5=0===k2?1:0;if(k5)return k5;var k6=0<=k2?k4:k3,k0=k6;continue;}return 0;}}function lq(k7){var k8=k7;for(;;){if(k8){var k9=k8[1];if(k9){var k8=k9;continue;}return [0,k8[2],k8[3]];}throw [0,c];}}function oT(k_){var k$=k_;for(;;){if(k$){var la=k$[4],lb=k$[3],lc=k$[2];if(la){var k$=la;continue;}return [0,lc,lb];}throw [0,c];}}function lf(ld){if(ld){var le=ld[1];if(le){var li=ld[4],lh=ld[3],lg=ld[2];return kE(lf(le),lg,lh,li);}return ld[4];}return c$(cF);}function lv(lo,lj){if(lj){var lk=lj[4],ll=lj[3],lm=lj[2],ln=lj[1],lp=d2(kL[1],lo,lm);if(0===lp){if(ln)if(lk){var lr=lq(lk),lt=lr[2],ls=lr[1],lu=kE(ln,ls,lt,lf(lk));}else var lu=ln;else var lu=lk;return lu;}return 0<=lp?kE(ln,lm,ll,lv(lo,lk)):kE(lv(lo,ln),lm,ll,lk);}return 0;}function ly(lz,lw){var lx=lw;for(;;){if(lx){var lC=lx[4],lB=lx[3],lA=lx[2];ly(lz,lx[1]);d2(lz,lA,lB);var lx=lC;continue;}return 0;}}function lE(lF,lD){if(lD){var lJ=lD[5],lI=lD[4],lH=lD[3],lG=lD[2],lK=lE(lF,lD[1]),lL=dP(lF,lH);return [0,lK,lG,lL,lE(lF,lI),lJ];}return 0;}function lO(lP,lM){if(lM){var lN=lM[2],lS=lM[5],lR=lM[4],lQ=lM[3],lT=lO(lP,lM[1]),lU=d2(lP,lN,lQ);return [0,lT,lN,lU,lO(lP,lR),lS];}return 0;}function lZ(l0,lV,lX){var lW=lV,lY=lX;for(;;){if(lW){var l3=lW[4],l2=lW[3],l1=lW[2],l5=l4(l0,l1,l2,lZ(l0,lW[1],lY)),lW=l3,lY=l5;continue;}return lY;}}function ma(l8,l6){var l7=l6;for(;;){if(l7){var l$=l7[4],l_=l7[1],l9=d2(l8,l7[2],l7[3]);if(l9){var mb=ma(l8,l_);if(mb){var l7=l$;continue;}var mc=mb;}else var mc=l9;return mc;}return 1;}}function mk(mf,md){var me=md;for(;;){if(me){var mi=me[4],mh=me[1],mg=d2(mf,me[2],me[3]);if(mg)var mj=mg;else{var ml=mk(mf,mh);if(!ml){var me=mi;continue;}var mj=ml;}return mj;}return 0;}}function mn(mp,mo,mm){if(mm){var ms=mm[4],mr=mm[3],mq=mm[2];return kE(mn(mp,mo,mm[1]),mq,mr,ms);}return kD(mp,mo);}function mu(mw,mv,mt){if(mt){var mz=mt[3],my=mt[2],mx=mt[1];return kE(mx,my,mz,mu(mw,mv,mt[4]));}return kD(mw,mv);}function mE(mA,mG,mF,mB){if(mA){if(mB){var mC=mB[5],mD=mA[5],mM=mB[4],mN=mB[3],mO=mB[2],mL=mB[1],mH=mA[4],mI=mA[3],mJ=mA[2],mK=mA[1];return (mC+2|0)<mD?kE(mK,mJ,mI,mE(mH,mG,mF,mB)):(mD+2|0)<mC?kE(mE(mA,mG,mF,mL),mO,mN,mM):km(mA,mG,mF,mB);}return mu(mG,mF,mA);}return mn(mG,mF,mB);}function mY(mP,mQ){if(mP){if(mQ){var mR=lq(mQ),mT=mR[2],mS=mR[1];return mE(mP,mS,mT,lf(mQ));}return mP;}return mQ;}function np(mX,mW,mU,mV){return mU?mE(mX,mW,mU[1],mV):mY(mX,mV);}function m6(m4,mZ){if(mZ){var m0=mZ[4],m1=mZ[3],m2=mZ[2],m3=mZ[1],m5=d2(kL[1],m4,m2);if(0===m5)return [0,m3,[0,m1],m0];if(0<=m5){var m7=m6(m4,m0),m9=m7[3],m8=m7[2];return [0,mE(m3,m2,m1,m7[1]),m8,m9];}var m_=m6(m4,m3),na=m_[2],m$=m_[1];return [0,m$,na,mE(m_[3],m2,m1,m0)];}return cE;}function nj(nk,nb,nd){if(nb){var nc=nb[2],nh=nb[5],ng=nb[4],nf=nb[3],ne=nb[1];if(j5(nd)<=nh){var ni=m6(nc,nd),nm=ni[2],nl=ni[1],nn=nj(nk,ng,ni[3]),no=l4(nk,nc,[0,nf],nm);return np(nj(nk,ne,nl),nc,no,nn);}}else if(!nd)return 0;if(nd){var nq=nd[2],nu=nd[4],nt=nd[3],ns=nd[1],nr=m6(nq,nb),nw=nr[2],nv=nr[1],nx=nj(nk,nr[3],nu),ny=l4(nk,nq,nw,[0,nt]);return np(nj(nk,nv,ns),nq,ny,nx);}throw [0,d,cD];}function nC(nD,nz){if(nz){var nA=nz[3],nB=nz[2],nF=nz[4],nE=nC(nD,nz[1]),nH=d2(nD,nB,nA),nG=nC(nD,nF);return nH?mE(nE,nB,nA,nG):mY(nE,nG);}return 0;}function nL(nM,nI){if(nI){var nJ=nI[3],nK=nI[2],nO=nI[4],nN=nL(nM,nI[1]),nP=nN[2],nQ=nN[1],nS=d2(nM,nK,nJ),nR=nL(nM,nO),nT=nR[2],nU=nR[1];if(nS){var nV=mY(nP,nT);return [0,mE(nQ,nK,nJ,nU),nV];}var nW=mE(nP,nK,nJ,nT);return [0,mY(nQ,nU),nW];}return cC;}function n3(nX,nZ){var nY=nX,n0=nZ;for(;;){if(nY){var n1=nY[1],n2=[0,nY[2],nY[3],nY[4],n0],nY=n1,n0=n2;continue;}return n0;}}function oU(oe,n5,n4){var n6=n3(n4,0),n7=n3(n5,0),n8=n6;for(;;){if(n7)if(n8){var od=n8[4],oc=n8[3],ob=n8[2],oa=n7[4],n$=n7[3],n_=n7[2],n9=d2(kL[1],n7[1],n8[1]);if(0===n9){var of=d2(oe,n_,ob);if(0===of){var og=n3(oc,od),oh=n3(n$,oa),n7=oh,n8=og;continue;}var oi=of;}else var oi=n9;}else var oi=1;else var oi=n8?-1:0;return oi;}}function oV(ov,ok,oj){var ol=n3(oj,0),om=n3(ok,0),on=ol;for(;;){if(om)if(on){var ot=on[4],os=on[3],or=on[2],oq=om[4],op=om[3],oo=om[2],ou=0===d2(kL[1],om[1],on[1])?1:0;if(ou){var ow=d2(ov,oo,or);if(ow){var ox=n3(os,ot),oy=n3(op,oq),om=oy,on=ox;continue;}var oz=ow;}else var oz=ou;var oA=oz;}else var oA=0;else var oA=on?0:1;return oA;}}function oC(oB){if(oB){var oD=oB[1],oE=oC(oB[4]);return (oC(oD)+1|0)+oE|0;}return 0;}function oJ(oF,oH){var oG=oF,oI=oH;for(;;){if(oI){var oM=oI[3],oL=oI[2],oK=oI[1],oN=[0,[0,oL,oM],oJ(oG,oI[4])],oG=oN,oI=oK;continue;}return oG;}}return [0,oP,oQ,oS,kQ,kD,lv,nj,oU,oV,ly,lZ,ma,mk,nC,nL,oC,function(oO){return oJ(0,oO);},lq,oT,lq,m6,oR,lE,lO];}var pd=[0,cx];function pc(oX){var oY=1<=oX?oX:1,oZ=eM<oY?eM:oY,o0=caml_create_string(oZ);return [0,o0,0,oZ,o0];}function pe(o1){return eI(o1[1],0,o1[2]);}function o8(o2,o4){var o3=[0,o2[3]];for(;;){if(o3[1]<(o2[2]+o4|0)){o3[1]=2*o3[1]|0;continue;}if(eM<o3[1])if((o2[2]+o4|0)<=eM)o3[1]=eM;else q(cw);var o5=caml_create_string(o3[1]);eJ(o2[1],0,o5,0,o2[2]);o2[1]=o5;o2[3]=o3[1];return 0;}}function pf(o6,o9){var o7=o6[2];if(o6[3]<=o7)o8(o6,1);o6[1].safeSet(o7,o9);o6[2]=o7+1|0;return 0;}function pg(pa,o_){var o$=o_.getLen(),pb=pa[2]+o$|0;if(pa[3]<pb)o8(pa,o$);eJ(o_,0,pa[1],pa[2],o$);pa[2]=pb;return 0;}function pk(ph){return 0<=ph?ph:q(dl(cb,dm(ph)));}function pl(pi,pj){return pk(pi+pj|0);}var pm=dP(pl,1);function pt(pn){return eI(pn,0,pn.getLen());}function pv(po,pp,pr){var pq=dl(ce,dl(po,cf)),ps=dl(cd,dl(dm(pp),pq));return c$(dl(cc,dl(eG(1,pr),ps)));}function qj(pu,px,pw){return pv(pt(pu),px,pw);}function qk(py){return c$(dl(cg,dl(pt(py),ch)));}function pS(pz,pH,pJ,pL){function pG(pA){if((pz.safeGet(pA)-48|0)<0||9<(pz.safeGet(pA)-48|0))return pA;var pB=pA+1|0;for(;;){var pC=pz.safeGet(pB);if(48<=pC){if(!(58<=pC)){var pE=pB+1|0,pB=pE;continue;}var pD=0;}else if(36===pC){var pF=pB+1|0,pD=1;}else var pD=0;if(!pD)var pF=pA;return pF;}}var pI=pG(pH+1|0),pK=pc((pJ-pI|0)+10|0);pf(pK,37);var pM=pI,pN=eg(pL);for(;;){if(pM<=pJ){var pO=pz.safeGet(pM);if(42===pO){if(pN){var pP=pN[2];pg(pK,dm(pN[1]));var pQ=pG(pM+1|0),pM=pQ,pN=pP;continue;}throw [0,d,ci];}pf(pK,pO);var pR=pM+1|0,pM=pR;continue;}return pe(pK);}}function rK(pY,pW,pV,pU,pT){var pX=pS(pW,pV,pU,pT);if(78!==pY&&110!==pY)return pX;pX.safeSet(pX.getLen()-1|0,117);return pX;}function ql(p5,qd,qh,pZ,qg){var p0=pZ.getLen();function qe(p1,qc){var p2=40===p1?41:125;function qb(p3){var p4=p3;for(;;){if(p0<=p4)return dP(p5,pZ);if(37===pZ.safeGet(p4)){var p6=p4+1|0;if(p0<=p6)var p7=dP(p5,pZ);else{var p8=pZ.safeGet(p6),p9=p8-40|0;if(p9<0||1<p9){var p_=p9-83|0;if(p_<0||2<p_)var p$=1;else switch(p_){case 1:var p$=1;break;case 2:var qa=1,p$=0;break;default:var qa=0,p$=0;}if(p$){var p7=qb(p6+1|0),qa=2;}}else var qa=0===p9?0:1;switch(qa){case 1:var p7=p8===p2?p6+1|0:l4(qd,pZ,qc,p8);break;case 2:break;default:var p7=qb(qe(p8,p6+1|0)+1|0);}}return p7;}var qf=p4+1|0,p4=qf;continue;}}return qb(qc);}return qe(qh,qg);}function qK(qi){return l4(ql,qk,qj,qi);}function q0(qm,qx,qH){var qn=qm.getLen()-1|0;function qI(qo){var qp=qo;a:for(;;){if(qp<qn){if(37===qm.safeGet(qp)){var qq=0,qr=qp+1|0;for(;;){if(qn<qr)var qs=qk(qm);else{var qt=qm.safeGet(qr);if(58<=qt){if(95===qt){var qv=qr+1|0,qu=1,qq=qu,qr=qv;continue;}}else if(32<=qt)switch(qt-32|0){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 0:case 3:case 11:case 13:var qw=qr+1|0,qr=qw;continue;case 10:var qy=l4(qx,qq,qr,105),qr=qy;continue;default:var qz=qr+1|0,qr=qz;continue;}var qA=qr;c:for(;;){if(qn<qA)var qB=qk(qm);else{var qC=qm.safeGet(qA);if(126<=qC)var qD=0;else switch(qC){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var qB=l4(qx,qq,qA,105),qD=1;break;case 69:case 70:case 71:case 101:case 102:case 103:var qB=l4(qx,qq,qA,102),qD=1;break;case 33:case 37:case 44:case 64:var qB=qA+1|0,qD=1;break;case 83:case 91:case 115:var qB=l4(qx,qq,qA,115),qD=1;break;case 97:case 114:case 116:var qB=l4(qx,qq,qA,qC),qD=1;break;case 76:case 108:case 110:var qE=qA+1|0;if(qn<qE){var qB=l4(qx,qq,qA,105),qD=1;}else{var qF=qm.safeGet(qE)-88|0;if(qF<0||32<qF)var qG=1;else switch(qF){case 0:case 12:case 17:case 23:case 29:case 32:var qB=d2(qH,l4(qx,qq,qA,qC),105),qD=1,qG=0;break;default:var qG=1;}if(qG){var qB=l4(qx,qq,qA,105),qD=1;}}break;case 67:case 99:var qB=l4(qx,qq,qA,99),qD=1;break;case 66:case 98:var qB=l4(qx,qq,qA,66),qD=1;break;case 41:case 125:var qB=l4(qx,qq,qA,qC),qD=1;break;case 40:var qB=qI(l4(qx,qq,qA,qC)),qD=1;break;case 123:var qJ=l4(qx,qq,qA,qC),qL=l4(qK,qC,qm,qJ),qM=qJ;for(;;){if(qM<(qL-2|0)){var qN=d2(qH,qM,qm.safeGet(qM)),qM=qN;continue;}var qO=qL-1|0,qA=qO;continue c;}default:var qD=0;}if(!qD)var qB=qj(qm,qA,qC);}var qs=qB;break;}}var qp=qs;continue a;}}var qP=qp+1|0,qp=qP;continue;}return qp;}}qI(0);return 0;}function sZ(q1){var qQ=[0,0,0,0];function qZ(qV,qW,qR){var qS=41!==qR?1:0,qT=qS?125!==qR?1:0:qS;if(qT){var qU=97===qR?2:1;if(114===qR)qQ[3]=qQ[3]+1|0;if(qV)qQ[2]=qQ[2]+qU|0;else qQ[1]=qQ[1]+qU|0;}return qW+1|0;}q0(q1,qZ,function(qX,qY){return qX+1|0;});return qQ[1];}function rG(q2,q5,q3){var q4=q2.safeGet(q3);if((q4-48|0)<0||9<(q4-48|0))return d2(q5,0,q3);var q6=q4-48|0,q7=q3+1|0;for(;;){var q8=q2.safeGet(q7);if(48<=q8){if(!(58<=q8)){var q$=q7+1|0,q_=(10*q6|0)+(q8-48|0)|0,q6=q_,q7=q$;continue;}var q9=0;}else if(36===q8)if(0===q6){var ra=q(ck),q9=1;}else{var ra=d2(q5,[0,pk(q6-1|0)],q7+1|0),q9=1;}else var q9=0;if(!q9)var ra=d2(q5,0,q3);return ra;}}function rB(rb,rc){return rb?rc:dP(pm,rc);}function rq(rd,re){return rd?rd[1]:re;}function uk(ti,rg,tu,rj,s4,tA,rf){var rh=dP(rg,rf);function tj(ri){return d2(rj,rh,ri);}function s3(ro,tz,rk,rt){var rn=rk.getLen();function s0(tr,rl){var rm=rl;for(;;){if(rn<=rm)return dP(ro,rh);var rp=rk.safeGet(rm);if(37===rp){var rx=function(rs,rr){return caml_array_get(rt,rq(rs,rr));},rD=function(rF,ry,rA,ru){var rv=ru;for(;;){var rw=rk.safeGet(rv)-32|0;if(!(rw<0||25<rw))switch(rw){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 10:return rG(rk,function(rz,rE){var rC=[0,rx(rz,ry),rA];return rD(rF,rB(rz,ry),rC,rE);},rv+1|0);default:var rH=rv+1|0,rv=rH;continue;}var rI=rk.safeGet(rv);if(124<=rI)var rJ=0;else switch(rI){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var rL=rx(rF,ry),rM=caml_format_int(rK(rI,rk,rm,rv,rA),rL),rO=rN(rB(rF,ry),rM,rv+1|0),rJ=1;break;case 69:case 71:case 101:case 102:case 103:var rP=rx(rF,ry),rQ=caml_format_float(pS(rk,rm,rv,rA),rP),rO=rN(rB(rF,ry),rQ,rv+1|0),rJ=1;break;case 76:case 108:case 110:var rR=rk.safeGet(rv+1|0)-88|0;if(rR<0||32<rR)var rS=1;else switch(rR){case 0:case 12:case 17:case 23:case 29:case 32:var rT=rv+1|0,rU=rI-108|0;if(rU<0||2<rU)var rV=0;else{switch(rU){case 1:var rV=0,rW=0;break;case 2:var rX=rx(rF,ry),rY=caml_format_int(pS(rk,rm,rT,rA),rX),rW=1;break;default:var rZ=rx(rF,ry),rY=caml_format_int(pS(rk,rm,rT,rA),rZ),rW=1;}if(rW){var r0=rY,rV=1;}}if(!rV){var r1=rx(rF,ry),r0=caml_int64_format(pS(rk,rm,rT,rA),r1);}var rO=rN(rB(rF,ry),r0,rT+1|0),rJ=1,rS=0;break;default:var rS=1;}if(rS){var r2=rx(rF,ry),r3=caml_format_int(rK(110,rk,rm,rv,rA),r2),rO=rN(rB(rF,ry),r3,rv+1|0),rJ=1;}break;case 37:case 64:var rO=rN(ry,eG(1,rI),rv+1|0),rJ=1;break;case 83:case 115:var r4=rx(rF,ry);if(115===rI)var r5=r4;else{var r6=[0,0],r7=0,r8=r4.getLen()-1|0;if(!(r8<r7)){var r9=r7;for(;;){var r_=r4.safeGet(r9),r$=14<=r_?34===r_?1:92===r_?1:0:11<=r_?13<=r_?1:0:8<=r_?1:0,sa=r$?2:caml_is_printable(r_)?1:4;r6[1]=r6[1]+sa|0;var sb=r9+1|0;if(r8!==r9){var r9=sb;continue;}break;}}if(r6[1]===r4.getLen())var sc=r4;else{var sd=caml_create_string(r6[1]);r6[1]=0;var se=0,sf=r4.getLen()-1|0;if(!(sf<se)){var sg=se;for(;;){var sh=r4.safeGet(sg),si=sh-34|0;if(si<0||58<si)if(-20<=si)var sj=1;else{switch(si+34|0){case 8:sd.safeSet(r6[1],92);r6[1]+=1;sd.safeSet(r6[1],98);var sk=1;break;case 9:sd.safeSet(r6[1],92);r6[1]+=1;sd.safeSet(r6[1],116);var sk=1;break;case 10:sd.safeSet(r6[1],92);r6[1]+=1;sd.safeSet(r6[1],110);var sk=1;break;case 13:sd.safeSet(r6[1],92);r6[1]+=1;sd.safeSet(r6[1],114);var sk=1;break;default:var sj=1,sk=0;}if(sk)var sj=0;}else var sj=(si-1|0)<0||56<(si-1|0)?(sd.safeSet(r6[1],92),r6[1]+=1,sd.safeSet(r6[1],sh),0):1;if(sj)if(caml_is_printable(sh))sd.safeSet(r6[1],sh);else{sd.safeSet(r6[1],92);r6[1]+=1;sd.safeSet(r6[1],48+(sh/100|0)|0);r6[1]+=1;sd.safeSet(r6[1],48+((sh/10|0)%10|0)|0);r6[1]+=1;sd.safeSet(r6[1],48+(sh%10|0)|0);}r6[1]+=1;var sl=sg+1|0;if(sf!==sg){var sg=sl;continue;}break;}}var sc=sd;}var r5=dl(cr,dl(sc,cs));}if(rv===(rm+1|0))var sm=r5;else{var sn=pS(rk,rm,rv,rA);try {var so=0,sp=1;for(;;){if(sn.getLen()<=sp)var sq=[0,0,so];else{var sr=sn.safeGet(sp);if(49<=sr)if(58<=sr)var ss=0;else{var sq=[0,caml_int_of_string(eI(sn,sp,(sn.getLen()-sp|0)-1|0)),so],ss=1;}else{if(45===sr){var su=sp+1|0,st=1,so=st,sp=su;continue;}var ss=0;}if(!ss){var sv=sp+1|0,sp=sv;continue;}}var sw=sq;break;}}catch(sx){if(sx[1]!==a)throw sx;var sw=pv(sn,0,115);}var sy=sw[1],sz=r5.getLen(),sA=0,sE=sw[2],sD=32;if(sy===sz&&0===sA){var sB=r5,sC=1;}else var sC=0;if(!sC)if(sy<=sz)var sB=eI(r5,sA,sz);else{var sF=eG(sy,sD);if(sE)eJ(r5,sA,sF,0,sz);else eJ(r5,sA,sF,sy-sz|0,sz);var sB=sF;}var sm=sB;}var rO=rN(rB(rF,ry),sm,rv+1|0),rJ=1;break;case 67:case 99:var sG=rx(rF,ry);if(99===rI)var sH=eG(1,sG);else{if(39===sG)var sI=cU;else if(92===sG)var sI=cV;else{if(14<=sG)var sJ=0;else switch(sG){case 8:var sI=cZ,sJ=1;break;case 9:var sI=cY,sJ=1;break;case 10:var sI=cX,sJ=1;break;case 13:var sI=cW,sJ=1;break;default:var sJ=0;}if(!sJ)if(caml_is_printable(sG)){var sK=caml_create_string(1);sK.safeSet(0,sG);var sI=sK;}else{var sL=caml_create_string(4);sL.safeSet(0,92);sL.safeSet(1,48+(sG/100|0)|0);sL.safeSet(2,48+((sG/10|0)%10|0)|0);sL.safeSet(3,48+(sG%10|0)|0);var sI=sL;}}var sH=dl(cp,dl(sI,cq));}var rO=rN(rB(rF,ry),sH,rv+1|0),rJ=1;break;case 66:case 98:var sN=rv+1|0,sM=rx(rF,ry)?c3:c2,rO=rN(rB(rF,ry),sM,sN),rJ=1;break;case 40:case 123:var sO=rx(rF,ry),sP=l4(qK,rI,rk,rv+1|0);if(123===rI){var sQ=pc(sO.getLen()),sU=function(sS,sR){pf(sQ,sR);return sS+1|0;};q0(sO,function(sT,sW,sV){if(sT)pg(sQ,cj);else pf(sQ,37);return sU(sW,sV);},sU);var sX=pe(sQ),rO=rN(rB(rF,ry),sX,sP),rJ=1;}else{var sY=rB(rF,ry),s1=pl(sZ(sO),sY),rO=s3(function(s2){return s0(s1,sP);},sY,sO,rt),rJ=1;}break;case 33:dP(s4,rh);var rO=s0(ry,rv+1|0),rJ=1;break;case 41:var rO=rN(ry,cv,rv+1|0),rJ=1;break;case 44:var rO=rN(ry,cu,rv+1|0),rJ=1;break;case 70:var s5=rx(rF,ry);if(0===rA)var s6=ct;else{var s7=pS(rk,rm,rv,rA);if(70===rI)s7.safeSet(s7.getLen()-1|0,103);var s6=s7;}var s8=caml_classify_float(s5);if(3===s8)var s9=s5<0?cn:cm;else if(4<=s8)var s9=co;else{var s_=caml_format_float(s6,s5),s$=0,ta=s_.getLen();for(;;){if(ta<=s$)var tb=dl(s_,cl);else{var tc=s_.safeGet(s$)-46|0,td=tc<0||23<tc?55===tc?1:0:(tc-1|0)<0||21<(tc-1|0)?1:0;if(!td){var te=s$+1|0,s$=te;continue;}var tb=s_;}var s9=tb;break;}}var rO=rN(rB(rF,ry),s9,rv+1|0),rJ=1;break;case 91:var rO=qj(rk,rv,rI),rJ=1;break;case 97:var tf=rx(rF,ry),tg=dP(pm,rq(rF,ry)),th=rx(0,tg),tl=rv+1|0,tk=rB(rF,tg);if(ti)tj(d2(tf,0,th));else d2(tf,rh,th);var rO=s0(tk,tl),rJ=1;break;case 114:var rO=qj(rk,rv,rI),rJ=1;break;case 116:var tm=rx(rF,ry),to=rv+1|0,tn=rB(rF,ry);if(ti)tj(dP(tm,0));else dP(tm,rh);var rO=s0(tn,to),rJ=1;break;default:var rJ=0;}if(!rJ)var rO=qj(rk,rv,rI);return rO;}},tt=rm+1|0,tq=0;return rG(rk,function(ts,tp){return rD(ts,tr,tq,tp);},tt);}d2(tu,rh,rp);var tv=rm+1|0,rm=tv;continue;}}function rN(ty,tw,tx){tj(tw);return s0(ty,tx);}return s0(tz,0);}var tB=d2(s3,tA,pk(0)),tC=sZ(rf);if(tC<0||6<tC){var tP=function(tD,tJ){if(tC<=tD){var tE=caml_make_vect(tC,0),tH=function(tF,tG){return caml_array_set(tE,(tC-tF|0)-1|0,tG);},tI=0,tK=tJ;for(;;){if(tK){var tL=tK[2],tM=tK[1];if(tL){tH(tI,tM);var tN=tI+1|0,tI=tN,tK=tL;continue;}tH(tI,tM);}return d2(tB,rf,tE);}}return function(tO){return tP(tD+1|0,[0,tO,tJ]);};},tQ=tP(0,0);}else switch(tC){case 1:var tQ=function(tS){var tR=caml_make_vect(1,0);caml_array_set(tR,0,tS);return d2(tB,rf,tR);};break;case 2:var tQ=function(tU,tV){var tT=caml_make_vect(2,0);caml_array_set(tT,0,tU);caml_array_set(tT,1,tV);return d2(tB,rf,tT);};break;case 3:var tQ=function(tX,tY,tZ){var tW=caml_make_vect(3,0);caml_array_set(tW,0,tX);caml_array_set(tW,1,tY);caml_array_set(tW,2,tZ);return d2(tB,rf,tW);};break;case 4:var tQ=function(t1,t2,t3,t4){var t0=caml_make_vect(4,0);caml_array_set(t0,0,t1);caml_array_set(t0,1,t2);caml_array_set(t0,2,t3);caml_array_set(t0,3,t4);return d2(tB,rf,t0);};break;case 5:var tQ=function(t6,t7,t8,t9,t_){var t5=caml_make_vect(5,0);caml_array_set(t5,0,t6);caml_array_set(t5,1,t7);caml_array_set(t5,2,t8);caml_array_set(t5,3,t9);caml_array_set(t5,4,t_);return d2(tB,rf,t5);};break;case 6:var tQ=function(ua,ub,uc,ud,ue,uf){var t$=caml_make_vect(6,0);caml_array_set(t$,0,ua);caml_array_set(t$,1,ub);caml_array_set(t$,2,uc);caml_array_set(t$,3,ud);caml_array_set(t$,4,ue);caml_array_set(t$,5,uf);return d2(tB,rf,t$);};break;default:var tQ=d2(tB,rf,[0]);}return tQ;}function uy(uh){function uj(ug){return 0;}return ul(uk,0,function(ui){return uh;},dA,dw,dH,uj);}function uu(um){return pc(2*um.getLen()|0);}function ur(up,un){var uo=pe(un);un[2]=0;return dP(up,uo);}function ux(uq){var ut=dP(ur,uq);return ul(uk,1,uu,pf,pg,function(us){return 0;},ut);}function uz(uw){return d2(ux,function(uv){return uv;},uw);}var uA=[0,0];function uO(uB,uC){var uD=uB[uC+1];if(caml_obj_is_block(uD)){if(caml_obj_tag(uD)===e5)return d2(uz,bR,uD);if(caml_obj_tag(uD)===e4){var uE=caml_format_float(c6,uD),uF=0,uG=uE.getLen();for(;;){if(uG<=uF)var uH=dl(uE,c5);else{var uI=uE.safeGet(uF),uJ=48<=uI?58<=uI?0:1:45===uI?1:0;if(uJ){var uK=uF+1|0,uF=uK;continue;}var uH=uE;}return uH;}}return bQ;}return d2(uz,bS,uD);}function uN(uL,uM){if(uL.length-1<=uM)return ca;var uP=uN(uL,uM+1|0);return l4(uz,b$,uO(uL,uM),uP);}function vi(uR){var uQ=uA[1];for(;;){if(uQ){var uW=uQ[2],uS=uQ[1];try {var uT=dP(uS,uR),uU=uT;}catch(uX){var uU=0;}if(!uU){var uQ=uW;continue;}var uV=uU[1];}else if(uR[1]===c_)var uV=b1;else if(uR[1]===c8)var uV=b0;else if(uR[1]===c9){var uY=uR[2],uZ=uY[3],uV=ul(uz,g,uY[1],uY[2],uZ,uZ+5|0,bZ);}else if(uR[1]===d){var u0=uR[2],u1=u0[3],uV=ul(uz,g,u0[1],u0[2],u1,u1+6|0,bY);}else if(uR[1]===c7){var u2=uR[2],u3=u2[3],uV=ul(uz,g,u2[1],u2[2],u3,u3+6|0,bX);}else{var u4=uR.length-1,u7=uR[0+1][0+1];if(u4<0||2<u4){var u5=uN(uR,2),u6=l4(uz,bW,uO(uR,1),u5);}else switch(u4){case 1:var u6=bU;break;case 2:var u6=d2(uz,bT,uO(uR,1));break;default:var u6=bV;}var uV=dl(u7,u6);}return uV;}}function vj(vf){var u8=caml_convert_raw_backtrace(caml_get_exception_raw_backtrace(0));if(u8){var u9=u8[1],u_=0,u$=u9.length-1-1|0;if(!(u$<u_)){var va=u_;for(;;){if(caml_notequal(caml_array_get(u9,va),b_)){var vb=caml_array_get(u9,va),vc=0===vb[0]?vb[1]:vb[1],vd=vc?0===va?b7:b6:0===va?b5:b4,ve=0===vb[0]?ul(uz,b3,vd,vb[2],vb[3],vb[4],vb[5]):d2(uz,b2,vd);l4(uy,vf,b9,ve);}var vg=va+1|0;if(u$!==va){var va=vg;continue;}break;}}var vh=0;}else var vh=d2(uy,vf,b8);return vh;}32===eL;function vm(vl){var vk=[];caml_update_dummy(vk,[0,vk,vk]);return vk;}var vn=[0,bK],vq=42,vr=[0,oW([0,function(vp,vo){return caml_compare(vp,vo);}])[1]];function vv(vs){var vt=vs[1];{if(3===vt[0]){var vu=vt[1],vw=vv(vu);if(vw!==vu)vs[1]=[3,vw];return vw;}return vs;}}function vz(vx){return vv(vx);}var vA=[0,function(vy){vi(vy);caml_ml_output_char(dn,10);vj(dn);dv(0);return caml_sys_exit(2);}];function v0(vC,vB){try {var vD=dP(vC,vB);}catch(vE){return dP(vA[1],vE);}return vD;}function vP(vJ,vF,vH){var vG=vF,vI=vH;for(;;)if(typeof vG==="number")return vK(vJ,vI);else switch(vG[0]){case 1:dP(vG[1],vJ);return vK(vJ,vI);case 2:var vL=vG[1],vM=[0,vG[2],vI],vG=vL,vI=vM;continue;default:var vN=vG[1][1];return vN?(dP(vN[1],vJ),vK(vJ,vI)):vK(vJ,vI);}}function vK(vQ,vO){return vO?vP(vQ,vO[1],vO[2]):0;}function v2(vR,vT){var vS=vR,vU=vT;for(;;)if(typeof vS==="number")return vW(vU);else switch(vS[0]){case 1:var vV=vS[1];if(vV[4]){vV[4]=0;vV[1][2]=vV[2];vV[2][1]=vV[1];}return vW(vU);case 2:var vX=vS[1],vY=[0,vS[2],vU],vS=vX,vU=vY;continue;default:var vZ=vS[2];vr[1]=vS[1];v0(vZ,0);return vW(vU);}}function vW(v1){return v1?v2(v1[1],v1[2]):0;}function v6(v4,v3){var v5=1===v3[0]?v3[1][1]===vn?(v2(v4[4],0),1):0:0;return vP(v3,v4[2],0);}var v7=[0,0],v8=[0,0,0];function wt(v$,v9){var v_=[0,v9],wa=vv(v$),wb=wa[1];switch(wb[0]){case 1:if(wb[1][1]===vn){var wc=0,wd=1;}else var wd=0;break;case 2:var we=wb[1];wa[1]=v_;var wf=vr[1],wg=v7[1]?1:(v7[1]=1,0);v6(we,v_);if(wg){vr[1]=wf;var wh=0;}else for(;;){if(0!==v8[1]){if(0===v8[1])throw [0,pd];v8[1]=v8[1]-1|0;var wi=v8[2],wj=wi[2];if(wj===wi)v8[2]=0;else wi[2]=wj[2];var wk=wj[1];v6(wk[1],wk[2]);continue;}v7[1]=0;vr[1]=wf;var wh=0;break;}var wc=wh,wd=1;break;default:var wd=0;}if(!wd)var wc=c$(bL);return wc;}function wr(wl,wm){return typeof wl==="number"?wm:typeof wm==="number"?wl:[2,wl,wm];}function wo(wn){if(typeof wn!=="number")switch(wn[0]){case 2:var wp=wn[1],wq=wo(wn[2]);return wr(wo(wp),wq);case 1:break;default:if(!wn[1][1])return 0;}return wn;}var wv=[0,function(ws){return 0;}],wu=vm(0),wy=[0,0],wD=null;function wI(wC){var ww=1-(wu[2]===wu?1:0);if(ww){var wx=vm(0);wx[1][2]=wu[2];wu[2][1]=wx[1];wx[1]=wu[1];wu[1][2]=wx;wu[1]=wu;wu[2]=wu;wy[1]=0;var wz=wx[2];for(;;){var wA=wz!==wx?1:0;if(wA){if(wz[4])wt(wz[3],0);var wB=wz[2],wz=wB;continue;}return wA;}}return ww;}var wH=undefined;function wG(wE,wF){return wE==wD?dP(wF,0):wE;}var wJ=Array,wL=false;function wM(wK){return wK instanceof wJ?0:[0,new MlWrappedString(wK.toString())];}uA[1]=[0,wM,uA[1]];function wP(wN,wO){wN.appendChild(wO);return 0;}var wQ=this,wR=wQ.document;function wZ(wS,wT){return wS?dP(wT,wS[1]):0;}function wW(wV,wU){return wV.createElement(wU.toString());}function w0(wY,wX){return wW(wY,wX);}var w1=[0,785140586];function xi(w2,w3,w5,w4){for(;;){if(0===w2&&0===w3)return wW(w5,w4);var w6=w1[1];if(785140586===w6){try {var w7=wR.createElement(bC.toString()),w8=bB.toString(),w9=w7.tagName.toLowerCase()===w8?1:0,w_=w9?w7.name===bA.toString()?1:0:w9,w$=w_;}catch(xb){var w$=0;}var xa=w$?982028505:-1003883683;w1[1]=xa;continue;}if(982028505<=w6){var xc=new wJ();xc.push(bF.toString(),w4.toString());wZ(w2,function(xd){xc.push(bG.toString(),caml_js_html_escape(xd),bH.toString());return 0;});wZ(w3,function(xe){xc.push(bI.toString(),caml_js_html_escape(xe),bJ.toString());return 0;});xc.push(bE.toString());return w5.createElement(xc.join(bD.toString()));}var xf=wW(w5,w4);wZ(w2,function(xg){return xf.type=xg;});wZ(w3,function(xh){return xf.name=xh;});return xf;}}function xt(xl,xk,xj){return xi(xl,xk,xj,bp);}function xu(xm){return w0(xm,br);}function xv(xn){return w0(xn,bs);}function xw(xo){return w0(xo,bt);}function xx(xp){return w0(xp,bw);}function xy(xq){return w0(xq,bx);}function xz(xr){return w0(xr,by);}function xA(xs){return wW(xs,bz);}this.HTMLElement===wH;var xB=2147483,xD=caml_js_get_console(0);wv[1]=function(xC){return 1===xC?(wQ.setTimeout(caml_js_wrap_callback(wI),0),0):0;};function xF(xE){return xD.log(xE.toString());}vA[1]=function(xG){xF(bo);xF(vi(xG));return vj(dn);};function xJ(xI,xH){return 0===xH?1003109192:1===xH?xI:[0,748545537,[0,xI,xJ(xI,xH-1|0)]];}var ya=bk.slice(),x$=[0,257,258,0],x_=303;function yb(xK){throw [0,e7,fP(xK,0)];}function yc(xL){throw [0,e7,fP(xL,0)];}function yd(xM){return 3901498;}function ye(xN){return -941236332;}function yf(xO){return 15949;}function yg(xP){return 17064;}function yh(xQ){return 3553395;}function yi(xR){return 3802040;}function yj(xS){return 15500;}function yk(xT){return fP(xT,1);}function yl(xU){return [0,926224370,fP(xU,1)];}function ym(xV){return [0,974443759,[0,19065,[0,926224370,fP(xV,1)]]];}function yn(xW){var xX=fP(xW,2);return [0,974443759,[0,xX,fP(xW,0)]];}function yo(xY){var xZ=fP(xY,2);return [0,-783405316,[0,xZ,fP(xY,0)]];}function yp(x0){var x1=fP(x0,2);return [0,748545537,[0,x1,fP(x0,0)]];}function yq(x2){var x3=fP(x2,1);return xJ(x3,fP(x2,0));}function yr(x4){var x5=fP(x4,0);return caml_string_equal(x5,bm)?19065:caml_string_equal(x5,bl)?1003109192:[0,4298439,x5];}function ys(x6){var x7=fP(x6,2),x8=fP(x6,1);return [0,x8,x7,fP(x6,0)];}var yt=[0,[0,function(x9){return q(bn);},ys,yr,yq,yp,yo,yn,ym,yl,yk,yj,yi,yh,yg,yf,ye,yd,yc,yb],ya,x$,bj,bi,bh,bg,bf,be,bd,x_,bc,bb,j3,ba,a$];function yC(yv){var yu=0;for(;;){var yw=e3(h,yu,yv);if(yw<0||20<yw){dP(yv[1],yv);var yu=yw;continue;}switch(yw){case 1:var yy=yx(yv);break;case 2:var yy=1;break;case 3:var yz=yv[5],yA=yv[6]-yz|0,yB=caml_create_string(yA);caml_blit_string(yv[2],yz,yB,0,yA);var yy=[0,yB];break;case 4:var yy=7;break;case 5:var yy=6;break;case 6:var yy=4;break;case 7:var yy=5;break;case 8:var yy=8;break;case 9:var yy=2;break;case 10:var yy=3;break;case 11:var yy=15;break;case 12:var yy=16;break;case 13:var yy=10;break;case 14:var yy=12;break;case 15:var yy=13;break;case 16:var yy=14;break;case 17:var yy=11;break;case 18:var yy=9;break;case 19:var yy=0;break;case 20:var yy=q(dl(a_,eG(1,yv[2].safeGet(yv[5]))));break;default:var yy=yC(yv);}return yy;}}function yx(yE){var yD=25;for(;;){var yF=e3(h,yD,yE);if(yF<0||2<yF){dP(yE[1],yE);var yD=yF;continue;}switch(yF){case 1:var yG=0;break;case 2:var yG=yx(yE);break;default:var yG=1;}return yG;}}function yR(yH){return fO(yt,2,yC,e6(yH));}function yL(yI){if(typeof yI==="number")return 1003109192<=yI?a9:a8;var yJ=yI[1];if(748545537<=yJ){if(926224370<=yJ){if(974443759<=yJ){var yK=yI[2],yM=yL(yK[2]);return l4(uz,a7,yL(yK[1]),yM);}return d2(uz,a6,yL(yI[2]));}if(748545556<=yJ)return d2(uz,a5,yL(yI[2]));var yN=yI[2],yO=yL(yN[2]);return l4(uz,a4,yL(yN[1]),yO);}if(4298439<=yJ)return yI[2];var yP=yI[2],yQ=yL(yP[2]);return l4(uz,a3,yL(yP[1]),yQ);}var yU=[0,function(yT,yS){return caml_compare(yT,yS);}],yV=oW(yU),yW=j2(yU);function yZ(yY,yX){return caml_compare(yY,yX);}var y0=j2([0,dP(yV[8],yZ)]),y1=j2([0,yW[10]]),y4=j2([0,function(y3,y2){return caml_compare(y3,y2);}]),y7=j2([0,function(y6,y5){return caml_compare(y6,y5);}]),y$=j2([0,function(y9,y8){var y_=d2(yW[10],y9[1],y8[1]);return 0===y_?d2(y4[10],y9[2],y8[2]):y_;}]);function zu(zd,ze){function zb(za){if(za){var zc=zb(za[2]);return di(dP(zd,za[1]),zc);}return za;}return zb(ze);}function zv(zi){var zg=yW[1];function zh(zf){return dP(yW[7],zf[1]);}return l4(y$[14],zh,zi,zg);}function zw(zn){var zl=yW[1];function zm(zj,zk){return dP(yW[4],zj);}return l4(yV[11],zm,zn,zl);}function zy(zq,zo){var zs=dP(yV[17],zo);return d2(uz,aN,eK(aO,dR(function(zp){var zr=dP(zq,zp[2]);return l4(uz,aP,zp[1],zr);},zs)));}function zx(zt){return d2(uz,aQ,eK(aR,dR(dm,dP(yW[20],zt))));}var zz=[0,aM];function AT(zA){return [0,-783405316,[0,zA[1],zA[2]]];}function A3(zB){return [0,748545537,[0,zB[1],zB[2]]];}function zZ(zD,zC){var zE=yV[22],zI=yW[1];try {var zF=d2(zE,zD,zC),zG=zF;}catch(zH){if(zH[1]!==c)throw zH;var zG=zI;}return zG;}function AX(zJ){var zK=zJ[3],zL=zJ[2],zM=zJ[1],zQ=yW[1];function zR(zN,zO){var zP=d2(yW[4],zN[3],zO);return d2(yW[4],zN[1],zP);}var zS=l4(y7[14],zR,zL,zQ),zV=yV[1];function zW(zT){var zU=dP(yW[5],zT);return d2(yV[4],zT,zU);}var z3=l4(yW[14],zW,zS,zV);function z4(zX,z0){var zY=zX[1],z1=zZ(zY,z0),z2=d2(yW[4],zX[3],z1);return l4(yV[4],zY,z2,z0);}var z5=l4(y7[14],z4,zL,z3);for(;;){var Af=yV[1],Ag=function(z5){return function(Ae,Ab,Ad){function Aa(z6,z$){var z9=zZ(z6,z5);function z_(z8,z7){return d2(yW[4],z8,z7);}return l4(yW[14],z_,z9,z$);}var Ac=l4(yW[14],Aa,Ab,Ab);return l4(yV[4],Ae,Ac,Ad);};}(z5),Ah=l4(yV[11],Ag,z5,Af);if(l4(yV[9],yW[11],Ah,z5)){if(zM===zK)return q(aL);var Aj=function(Ai){return Ai[1]===zM?1:0;},Ak=d2(y7[17],Aj,zL),Al=dP(y7[20],Ak);if(Al){var Am=Al[2],An=Al[1],Ao=An[3],Ap=An[2];if(Am){var At=zZ(Ao,z5),Aw=ei(function(As,Aq){var Ar=zZ(Aq[3],z5);return d2(yW[8],As,Ar);},At,Am),Ax=function(Av){var Au=zZ(zK,z5);return 1-d2(yW[3],Av,Au);},Ay=d2(yW[17],Ax,Aw);if(dP(yW[2],Ay)){var Az=0,AA=0,AB=[0,[0,zM,Ap,Ao],Am];for(;;){if(AB){var AC=AB[2],AD=AB[1],AE=AD[3],AF=zZ(AE,z5),AG=zZ(Ao,z5),AH=d2(yW[8],AG,AF);if(Ao===AE&&dP(yW[2],AH))throw [0,d,aH];var AK=function(AJ){var AI=zZ(zK,z5);return 1-d2(yW[3],AJ,AI);};if(d2(yW[16],AK,AH)){var AL=[0,AD,Az],Az=AL,AB=AC;continue;}var AM=[0,AD,AA],AA=AM,AB=AC;continue;}var AN=eg(AA),AO=eg(Az);if(0===AN)throw [0,d,aK];if(0===AO){if(AN){var AP=AN[2],AQ=AN[1][2];if(AP){var AU=[0,4298439,AQ];return ei(function(AS,AR){return AT([0,AS,[0,4298439,AR[2]]]);},AU,AP);}return [0,4298439,AQ];}return q(aJ);}var AW=function(AV){return 1-ej(AV,AN);},AZ=AX([0,zM,d2(y7[17],AW,zL),zK]),A0=function(AY){return 1-ej(AY,AO);};return AT([0,AX([0,zM,d2(y7[17],A0,zL),zK]),AZ]);}}var A1=dP(yW[23],Ay),A2=AX([0,A1,zL,zK]);return A3([0,AX([0,zM,zL,A1]),A2]);}return Ao===zK?[0,4298439,Ap]:A3([0,[0,4298439,Ap],AX([0,Ao,zL,zK])]);}return q(aI);}var z5=Ah;continue;}}var A4=y$[7],A5=y$[9];function A9(A_,A6){if(typeof A6!=="number"){var A7=A6[1];if(!(748545537<=A7)){if(4298439<=A7){var B3=dP(yW[5],A_),B4=d2(yW[4],A_+1|0,B3),B5=dP(y4[5],[0,A6[2],A_+1|0]),B6=[0,dP(yW[5],A_),B5],B7=dP(y$[5],B6),B8=dP(yW[5],A_+1|0);return [0,[0,B4,B7,A_,dP(y1[5],B8)],A_+2|0];}var B9=A6[2],B_=A9(A_,B9[1]),B$=A9(B_[2],B9[2]),Ca=B$[1],Cb=B_[1],Cc=Ca[3],Cd=Ca[2],Ce=Cb[3],Cf=Cb[2],Ch=B$[2],Cg=Ca[4],Ci=d2(yW[6],Cc,Ca[1]),Cj=d2(yW[7],Cb[1],Ci),Cp=y1[1],Co=Cb[4],Cq=function(Cl){function Cn(Ck){var Cm=d2(yW[7],Cl,Ck);return dP(y1[4],Cm);}return d2(y1[14],Cn,Cg);},Cs=l4(y1[14],Cq,Co,Cp),Ct=function(Cr){return d2(yW[3],Ce,Cr[1]);},Cu=d2(y$[17],Ct,Cf),Cw=function(Cv){return d2(yW[3],Cc,Cv[1]);},Cx=d2(y$[17],Cw,Cd),CE=y$[1],CF=function(Cy){var CA=Cy[2];function CD(Cz){var CB=d2(y4[7],CA,Cz[2]),CC=[0,dP(yW[5],Ce),CB];return dP(y$[4],CC);}return d2(y$[14],CD,Cx);},CG=l4(y$[14],CF,Cu,CE);return [0,[0,Cj,d2(A4,d2(A5,d2(A5,d2(A4,Cf,Cd),Cx),Cu),CG),Ce,Cs],Ch];}if(926224370<=A7){if(974443759<=A7){var A8=A6[2],A$=A9(A_,A8[1]),Ba=A9(A$[2],A8[2]),Bb=Ba[1],Bc=A$[1],Bd=Bb[3],Be=Bb[2],Bf=Bc[3],Bg=Ba[2],Bh=d2(yW[6],Bd,Bb[1]),Bi=d2(yW[7],Bc[1],Bh),Bk=d2(y1[7],Bc[4],Bb[4]),Bl=function(Bj){return d2(yW[3],Bd,Bj[1]);},Bm=d2(y$[17],Bl,Be),Bq=y$[1],Br=function(Bn){var Bo=Bn[2],Bp=[0,dP(yW[5],Bf),Bo];return dP(y$[4],Bp);},Bs=l4(y$[14],Br,Bm,Bq);return [0,[0,Bi,d2(A4,d2(A5,d2(A4,Bc[2],Be),Bm),Bs),Bf,Bk],Bg];}var Bt=A9(A_,A6[2]),Bu=Bt[1],Bv=Bu[3],Bw=Bu[4],Bx=Bu[2],Bz=Bt[2],BA=function(By){return d2(yW[3],Bv,By[1]);},BB=d2(y$[17],BA,Bx),BF=y$[1],BG=function(BD){function BE(BC){return dP(y$[4],[0,BD,BC[2]]);}return d2(y$[14],BE,BB);},BH=d2(A4,Bx,l4(y1[14],BG,Bw,BF));return [0,[0,Bu[1],BH,Bv,Bw],Bz];}if(!(748545556<=A7)){var BI=A6[2],BJ=A9(A_,BI[1]),BK=A9(BJ[2],BI[2]),BL=BK[1],BM=BJ[1],BN=BL[3],BO=BL[2],BP=BK[2],BQ=d2(yW[6],BN,BL[1]),BS=d2(yW[7],BM[1],BQ),BT=function(BR){return d2(yW[3],BN,BR[1]);},BU=d2(y$[17],BT,BO),BZ=y$[1],BY=BM[4],B0=function(BW){function BX(BV){return dP(y$[4],[0,BW,BV[2]]);}return d2(y$[14],BX,BU);},B1=l4(y1[14],B0,BY,BZ),B2=d2(A4,d2(A5,d2(A4,BM[2],BO),BU),B1);return [0,[0,BS,B2,BM[3],BL[4]],BP];}}return q(aD);}function E9(CH){return A9(0,CH)[1];}function D8(CL,DY,CI){var CJ=CI[2],CK=CI[1],CQ=CL[2];function DX(CM,DW){var CO=zw(CM);function CP(CN){return d2(yW[12],CN[1],CO);}var CR=d2(y$[17],CP,CQ),Dc=[0,y$[1],0];function Dd(CS,Db){return zu(function(CU){var CT=CS[1],CV=zv(CU),CW=d2(yW[8],CT,CV),CX=dP(yW[2],CW);if(CX){var C0=yW[1],C1=function(CY){var CZ=d2(yV[22],CY,CM);return dP(yW[4],CZ);},C2=l4(yW[14],C1,CT,C0),C3=d2(yW[12],C2,CK);if(C3){var C8=CS[2],C9=function(C4){var C6=C4[1];function C7(C5){return caml_string_equal(C6,C5[1]);}return d2(y4[16],C7,CJ);},C_=d2(y4[15],C9,C8),C$=1;}else{var Da=C3,C$=0;}}else{var Da=CX,C$=0;}if(!C$)var C_=Da;return C_?[0,d2(y$[4],CS,CU),[0,CU,0]]:[0,CU,0];},Db);}var Dj=l4(y$[14],Dd,CR,Dc),DV=d2(eH,function(De){var Dg=zv(De);function Di(Dh,Df){return d2(yW[3],Df,CK)?d2(yW[3],Dh,Dg):1;}return d2(yV[12],Di,CM);},Dj);return ei(function(DU,DS){var DQ=dP(y0[5],CM);function DR(Dk,DP){var DN=y0[1];function DO(Dp,DM){var Dl=Dk[1];function Do(Dm,Dn){return 1-d2(yW[3],Dm,Dl);}var Dq=d2(yV[14],Do,Dp),Dr=dP(y0[5],Dq),DJ=Dk[2];function DK(Ds,DF){var Dx=Ds[2],Du=Ds[1],Dw=yW[1];function Dy(Dt){return caml_string_equal(Du,Dt[1])?dP(yW[4],Dt[2]):function(Dv){return Dv;};}var Dz=l4(y4[14],Dy,CJ,Dw),DH=y0[1];function DI(DB){var DD=y0[1];function DE(DA){var DC=l4(yV[4],Dx,DB,DA);return dP(y0[4],DC);}var DG=l4(y0[14],DE,DF,DD);return dP(y0[7],DG);}return l4(yW[14],DI,Dz,DH);}var DL=l4(y4[14],DK,DJ,Dr);return d2(y0[7],DL,DM);}return l4(y0[14],DO,DP,DN);}var DT=l4(y$[14],DR,DS,DQ);return d2(y0[7],DT,DU);},DW,DV);}var DZ=l4(y0[14],DX,DY[2],y0[1]),D1=d2(yW[9],DY[1],CK);function D2(D0){return dP(yW[4],D0[2]);}return [0,l4(y4[14],D2,CJ,D1),DZ];}function FR(D6,D3){var D4=D3[4],D5=D3[3],D7=D6[3],D_=D6[4],D9=D6[2],Ec=dP(D8,[0,D3[1],D3[2],D5,D4]),Ed=j2([0,function(Ea,D$){var Eb=d2(yW[10],Ea[1],D$[1]);return 0===Eb?d2(y0[10],Ea[2],D$[2]):Eb;}]);function EX(Ee){var Ei=dP(Ed[20],Ee);return d2(uz,aE,eK(aF,dR(function(Ef){var Eg=dP(y0[20],Ef[2]),Eh=d2(uz,aU,eK(aV,dR(dP(zy,dm),Eg)));return l4(uz,aG,zx(Ef[1]),Eh);},Ei)));}function Ez(Ey,Em,Ej){var Ek=Ej[2],El=Ej[1];if(d2(Ed[3],[0,El,Ek],Em))return Em;var Eo=d2(Ed[4],[0,El,Ek],Em),Ep=function(En){return d2(yW[12],En[1],El);},E0=d2(y$[17],Ep,D9),E1=function(Eq,EA){var Er=d2(Ec,[0,El,Ek],Eq),Es=Er[2],Et=Er[1];if(d2(y1[3],Et,D_)){var Ew=function(Eu){var Ev=zw(Eu);return d2(y1[3],Ev,D4);},Ex=d2(y0[16],Ew,Es);}else var Ex=1;if(Ex)return Ez([0,Eq,Ey],EA,[0,Et,Es]);var EB=d2(Ed[4],[0,Et,Es],EA),EC=eg([0,Eq,Ey]),ED=0,EE=EC;for(;;){if(EE){var EG=EE[2],EF=ED+1|0,ED=EF,EE=EG;continue;}var EH=y7[1],EI=0,EJ=EC;for(;;){if(EJ){var EK=EJ[2],EU=EI+1|0,ET=EJ[1][2],EV=function(EI,EK){return function(EL,ES){var EM=EI+1|0,EN=EK,EO=EL[2];for(;;){if(EN){if(!d2(yW[3],EO,EN[1][1])){var ER=EN[2],EQ=EM+1|0,EM=EQ,EN=ER;continue;}var EP=EM;}else var EP=ED;return d2(y7[4],[0,EI,EL[1],EP],ES);}};}(EI,EK),EW=l4(y4[14],EV,ET,EH),EH=EW,EI=EU,EJ=EK;continue;}var EY=AX([0,0,EH,ED]),EZ=EX(EB);throw [0,zz,dP(Ed[19],EB),EZ,EY];}}};return l4(y$[14],E1,E0,Eo);}try {var E2=d2(yV[5],D5,D7),E3=dP(y0[5],E2),E4=[0,dP(yW[5],D7),E3],E5=Ez(0,Ed[1],E4),E6=EX(E5),E7=[0,dP(Ed[19],E5),E6,0];}catch(E8){if(E8[1]===zz)return [0,E8[2],E8[3],[0,E8[4]]];throw E8;}return E7;}function FS(Fa,Fg,Ff,E$,E_){var Fb=d2(Fa,E$,E_),Fc=Fb[3],Fd=Fb[2],Fe=Fb[1];return Fc?[0,0,[0,[0,Fd,Fh(uz,az,Fg,Ff,Fe,yL(Fc[1]))],0]]:[0,1,[0,[0,Fd,Fi(uz,ay,Fg,Ff,Fe)],0]];}function FT(Fq,FB,Fj){var Fk=yR(Fj),Fl=Fk[3],Fm=Fk[2],Fn=Fk[1],Fo=yL(Fl),Fp=yL(Fm),Fr=dP(Fq,Fl),Fs=dP(Fq,Fm);function Fz(Ft){return [0,1-Ft[1],Ft[2]];}function FA(Fv,Fu){var Fx=di(Fv[2],Fu[2]),Fw=Fv[1],Fy=Fw?Fu[1]:Fw;return [0,Fy,Fx];}if(17064<=Fn)if(3802040<=Fn)if(3901498<=Fn){var FC=Fz(Fi(FB,Fp,Fo,Fs,Fr)),FD=FC[2],FE=FC[1];if(FE)var FF=[0,FE,FD];else{var FG=Fz(Fi(FB,Fo,Fp,Fr,Fs)),FH=di(FD,FG[2]),FF=[0,FG[1],FH];}var FI=FF;}else var FI=Fi(FB,Fp,Fo,Fs,Fr);else if(3553395<=Fn)var FI=Fi(FB,Fo,Fp,Fr,Fs);else{var FJ=Fz(Fi(FB,Fo,Fp,Fr,Fs)),FI=FA(Fi(FB,Fp,Fo,Fs,Fr),FJ);}else if(15500===Fn){var FK=Fi(FB,Fo,Fp,Fr,Fs),FI=FA(Fi(FB,Fp,Fo,Fs,Fr),FK);}else if(15949<=Fn){var FL=Fi(FB,Fo,Fp,Fr,Fs),FI=FA(Fz(Fi(FB,Fp,Fo,Fs,Fr)),FL);}else{var FM=Fz(Fi(FB,Fo,Fp,Fr,Fs)),FI=FA(Fz(Fi(FB,Fp,Fo,Fs,Fr)),FM);}var FN=FI[1],FP=FI[2],FO=FN?aC:aB,FQ=17064<=Fn?3802040<=Fn?3901498<=Fn?a2:a1:3553395<=Fn?a0:aZ:15500===Fn?aW:15949<=Fn?aY:aX;return [0,FN,Fh(uz,aA,Fp,FQ,Fo,FO),FP];}var FU=[0,E],F$=d2(FT,E9,dP(FS,FR));function F9(FV){function F0(FZ,FY,FW){try {var FX=FV.safeGet(FW),F1=10===FX?F0(G,[0,FZ,FY],FW+1|0):(k.safeSet(0,FX),F0(dl(FZ,k),FY,FW+1|0));}catch(F2){if(F2[1]===b)return eg([0,FZ,FY]);throw F2;}return F1;}return F0(F,0,0);}function Ga(F4,F3){try {var F5=dP(F4,F3);}catch(F6){if(F6[1]===e8)return H;throw F6;}return F5;}function Gw(F7,Gh,Ge,F_){var F8=xA(F7),Gb=F9(F_),Gm=dR(dP(Ga,F$),Gb),Go=zu(function(Gc){var Gd=caml_string_notequal(Gc[2],Q);if(Gd){var Gk=Gc[3],Gl=ei(function(Gj,Gf){var Gg=Ge?d2(uz,N,Gf[1]):M,Gi=Gh?d2(uz,L,Gf[2]):K;return dl(Gj,dl(Gi,Gg));},J,Gk);return F9(l4(uz,I,Gc[2],Gl));}return Gd;},Gm),Gp=dR(function(Gn){return Gn.toString();},Go),Gs=[0,O.toString(),[0,P.toString(),Gp]];eh(function(Gr){var Gq=w0(F7,bv);Gq.innerHTML=Gr;wP(F8,Gq);return wP(F8,w0(F7,bu));},Gs);return F8;}function Gx(Gt,Gv){var Gu=Gt.firstChild;if(Gu!=wD)Gt.removeChild(Gu);return wP(Gt,Gv);}var JT=C.toString(),JS={"border":B.toString(),"background":C.toString()},JR=A.toString(),GJ={"border":z.toString(),"background":A.toString(),"highlight":{"border":B.toString(),"background":C.toString()}},JQ=y.toString(),JP={"border":x.toString(),"background":y.toString()},JO=w.toString(),Hs={"border":v.toString(),"background":w.toString(),"highlight":{"border":x.toString(),"background":y.toString()}},JN=u.toString(),JM={"border":t.toString(),"background":u.toString()},JL=s.toString(),GE={"border":r.toString(),"background":s.toString(),"highlight":{"border":t.toString(),"background":u.toString()}};function HM(Gy){var Gz=E9(fO(yt,1,yC,e6(Gy))),GA=Gz[3],GB=Gz[1],GC=ab.toString(),GD=d2(uz,aa,GA).toString(),GF=[0,{"id":d2(uz,$,GA).toString(),"label":GD,"shape":GC,"color":GE,"fontSize":27},0],GN=27,GM=d2(yW[6],GA,GB);function GO(GG,GK){var GH=_.toString(),GI=d2(uz,Z,GG).toString(),GL=27;return [0,{"id":d2(uz,Y,GG).toString(),"label":GI,"shape":GH,"color":GJ,"fontSize":27},GK];}var GP=l4(yW[14],GO,GM,GF),GQ=dP(yW[22],GB)+1|0;function G6(GS){var GT=dR(function(GR){return GR;},GS);if(GT){var GU=0,GV=GT,G1=GT[2],GY=GT[1];for(;;){if(GV){var GX=GV[2],GW=GU+1|0,GU=GW,GV=GX;continue;}var GZ=caml_make_vect(GU,GY),G0=1,G2=G1;for(;;){if(G2){var G3=G2[2];GZ[G0+1]=G2[1];var G4=G0+1|0,G0=G4,G2=G3;continue;}var G5=GZ;break;}break;}}else var G5=[0];return caml_js_from_array(G5);}var Hv=[0,GQ,GP,0],Hu=Gz[2];function Hw(G9,G7){var G8=G7[1],Hd=G7[3],Hc=G9[1];function He(G$,Hb){var G_=ac.toString(),Ha=dm(G8).toString();return [0,{"from":dm(G$).toString(),"to":Ha,"style":G_},Hb];}var Hf=l4(yW[14],He,Hc,Hd),Hm=G9[2];function Hn(Hg,Hl){var Hj=ae.toString(),Hi=Hg[1].toString(),Hh=ad.toString(),Hk=dm(Hg[2]).toString();return [0,{"from":dm(G8).toString(),"to":Hk,"fontSize":Hh,"label":Hi,"style":Hj},Hl];}var Ho=l4(y4[14],Hn,Hm,Hf),Hq=G7[2],Hp=X.toString(),Hr=d2(uz,W,G8-GQ|0).toString(),Ht=25;return [0,G8+1|0,[0,{"id":d2(uz,V,G8).toString(),"label":Hr,"shape":Hp,"color":Hs,"fontSize":25},Hq],Ho];}var Hx=l4(y$[14],Hw,Hu,Hv),Hy=d2(uz,af,d2(uz,aS,eK(aT,dR(zx,dP(y1[20],Gz[4]))))).toString(),Hz=G6(Hx[3]);return [0,{"nodes":G6(Hx[2]),"edges":Hz},Hy];}function JU(JK){try {var HB=function(HA){throw [0,FU];},HD=wG(wR.getElementById(i.toString()),HB),HC=xt(0,0,wR),HE=xu(wR),HF=xv(wR);HC.size=20;HC.value=D.toString();HE.id=dl(i,ak).toString();HE.className=aj.toString();HF.className=ai.toString();HC.className=ah.toString();var HG=xx(wR),HH=xy(wR),HI=xz(wR),HJ=xz(wR);wP(HD,HG);wP(HG,HH);wP(HH,HI);wP(HI,HC);wP(HH,HJ);wP(HJ,HE);wP(HJ,HF);var HO=d2(uz,ag,i),HR=function(HL,HQ){var HK=new MlWrappedString(HC.value);if(caml_string_notequal(HK,HL)){try {var HN=HM(HK);window.data=HN[1];caml_js_eval_string(HO);HF.innerHTML=HN[2];}catch(HP){}return [0,20,HK];}return [0,da(0,HQ-1|0),HK];},HS=HR;}catch(HT){if(HT[1]!==FU)throw HT;var HS=function(HU,HV){return [0,HV,HU];};}try {var HX=function(HW){throw [0,FU];},HZ=wG(wR.getElementById(ax.toString()),HX),HY=xi(0,0,wR,bq),H0=xz(wR),H1=xw(wR);HY.rows=20;HY.cols=50;HY.value=l.toString();H1.style.border=U.toString();H1.style.padding=T.toString();H1.className=S.toString();HY.className=R.toString();var H2=xx(wR),H3=xy(wR),H4=xz(wR);wP(HZ,H2);wP(H2,H3);wP(H3,H4);wP(H4,HY);wP(H3,H0);wP(H0,H1);var H9=function(H6,H8){var H5=new MlWrappedString(HY.value);if(caml_string_notequal(H5,H6)){try {Gx(H1,Gw(wR,1,0,H5));}catch(H7){}return [0,20,H5];}return [0,da(0,H8-1|0),H5];},H_=H9;}catch(H$){if(H$[1]!==FU)throw H$;var H_=function(Ia,Ib){return [0,Ib,Ia];};}try {var Id=function(Ic){throw [0,FU];},If=wG(wR.getElementById(j.toString()),Id),Ie=xt(0,0,wR),Ig=xA(wR),Ih=xu(wR),Ii=xv(wR),Ij=xA(wR),Ik=xu(wR),Il=xv(wR),Im=xA(wR);Ie.size=50;Ie.value=l.toString();Ie.className=aq.toString();Ih.id=dl(j,ap).toString();Ih.className=ao.toString();Ik.id=dl(j,an).toString();Ik.className=am.toString();var In=xx(wR),Io=xy(wR),Ip=xy(wR),Iq=xy(wR),Ir=xz(wR),Is=xz(wR),It=xz(wR),Iu=xz(wR),Iv=xw(wR);Iv.style.border=al.toString();wP(If,In);wP(In,Io);wP(In,Ip);wP(In,Iq);wP(Io,Ir);wP(Ir,Ie);wP(Ip,Is);wP(Ip,It);wP(Is,Ig);wP(Is,Ih);wP(Is,Ii);wP(It,Ij);wP(It,Ik);wP(It,Il);wP(Iq,Iu);wP(Iu,Iv);wP(Iv,Im);var IE=function(IA,Iw){var Ix=yL(Iw),Iy=HM(Ix),Iz=Iy[2];window.data=Iy[1];caml_js_eval_string(l4(uz,ar,j,IA));return 1===IA?(Ig.innerHTML=dl(at,Ix).toString(),Ii.innerHTML=Iz):(Ij.innerHTML=dl(as,Ix).toString(),Il.innerHTML=Iz);},IH=function(IC,IG){var IB=new MlWrappedString(Ie.value);if(caml_string_notequal(IB,IC)){try {var ID=yR(IB);IE(1,ID[2]);IE(2,ID[3]);Gx(Im,Gw(wR,1,1,IB));}catch(IF){}return [0,20,IB];}return [0,da(0,IG-1|0),IB];},II=IH;}catch(IJ){if(IJ[1]!==FU)throw IJ;var II=function(IK,IL){return [0,IL,IK];};}function IW(IN,IP,IS,IM){var IO=HS(IN,IM),IR=IO[2],IQ=H_(IP,IO[1]),IU=IQ[2],IT=II(IS,IQ[1]),IV=IT[1],IX=IT[2];function IZ(IY){return IW(IR,IU,IX,IV);}var I0=0===IV?0.5:0.1,I1=[0,[2,[0,1,0,0,0]]],I2=[0,0];function I7(I3,I9){var I4=xB<I3?[0,xB,I3-xB]:[0,I3,0],I5=I4[2],I8=I4[1],I6=I5==0?dP(wt,I1):dP(I7,I5);I2[1]=[0,wQ.setTimeout(caml_js_wrap_callback(I6),I8*1e3)];return 0;}I7(I0,0);function Ja(I$){var I_=I2[1];return I_?wQ.clearTimeout(I_[1]):0;}var Jb=vz(I1)[1];switch(Jb[0]){case 1:var Jc=Jb[1][1]===vn?(v0(Ja,0),1):0;break;case 2:var Jd=Jb[1],Je=[0,vr[1],Ja],Jf=Jd[4],Jg=typeof Jf==="number"?Je:[2,Je,Jf];Jd[4]=Jg;var Jc=1;break;default:var Jc=0;}var Jh=vz(I1),Ji=Jh[1];switch(Ji[0]){case 1:var Jj=[0,Ji];break;case 2:var Jk=Ji[1],Jl=[0,[2,[0,[0,[0,Jh]],0,0,0]]],Jn=vr[1],JH=[1,function(Jm){switch(Jm[0]){case 0:var Jo=Jm[1];vr[1]=Jn;try {var Jp=IZ(Jo),Jq=Jp;}catch(Jr){var Jq=[0,[1,Jr]];}var Js=vz(Jl),Jt=vz(Jq),Ju=Js[1];{if(2===Ju[0]){var Jv=Ju[1];if(Js===Jt)var Jw=0;else{var Jx=Jt[1];if(2===Jx[0]){var Jy=Jx[1];Jt[1]=[3,Js];Jv[1]=Jy[1];var Jz=wr(Jv[2],Jy[2]),JA=Jv[3]+Jy[3]|0;if(vq<JA){Jv[3]=0;Jv[2]=wo(Jz);}else{Jv[3]=JA;Jv[2]=Jz;}var JB=Jy[4],JC=Jv[4],JD=typeof JC==="number"?JB:typeof JB==="number"?JC:[2,JC,JB];Jv[4]=JD;var Jw=0;}else{Js[1]=Jx;var Jw=v6(Jv,Jx);}}return Jw;}throw [0,d,bM];}case 1:var JE=vz(Jl),JF=JE[1];{if(2===JF[0]){var JG=JF[1];JE[1]=Jm;return v6(JG,Jm);}throw [0,d,bN];}default:throw [0,d,bP];}}],JI=Jk[2],JJ=typeof JI==="number"?JH:[2,JH,JI];Jk[2]=JJ;var Jj=Jl;break;case 3:throw [0,d,bO];default:var Jj=IZ(Ji[1]);}return Jj;}IW(au,av,aw,0);return wL;}wQ.onload=caml_js_wrap_callback(function(JV){if(JV){var JW=JU(JV);if(!(JW|0))JV.preventDefault();return JW;}var JX=event,JY=JU(JX);if(!(JY|0))JX.returnValue=JY;return JY;});dv(0);return;}());
