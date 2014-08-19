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
function caml_ml_out_channels_list () { return 0; }
function caml_mul(x,y) {
  return ((((x >> 16) * y) << 16) + (x & 0xffff) * y)|0;
}
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
(function(){function oS(EC,ED,EE,EF,EG,EH,EI){return EC.length==6?EC(ED,EE,EF,EG,EH,EI):caml_call_gen(EC,[ED,EE,EF,EG,EH,EI]);}function Ag(Ew,Ex,Ey,Ez,EA,EB){return Ew.length==5?Ew(Ex,Ey,Ez,EA,EB):caml_call_gen(Ew,[Ex,Ey,Ez,EA,EB]);}function Ah(Er,Es,Et,Eu,Ev){return Er.length==4?Er(Es,Et,Eu,Ev):caml_call_gen(Er,[Es,Et,Eu,Ev]);}function kF(En,Eo,Ep,Eq){return En.length==3?En(Eo,Ep,Eq):caml_call_gen(En,[Eo,Ep,Eq]);}function dm(Ek,El,Em){return Ek.length==2?Ek(El,Em):caml_call_gen(Ek,[El,Em]);}function c$(Ei,Ej){return Ei.length==1?Ei(Ej):caml_call_gen(Ei,[Ej]);}var a=[0,new MlString("Failure")],b=[0,new MlString("Invalid_argument")],c=[0,new MlString("Not_found")],d=[0,new MlString("Assert_failure")],e=[0,new MlString(""),0,0,-1],f=[0,new MlString(""),1,0,0],g=[0,new MlString("\0\0\xeb\xff\xec\xff\x02\0\x1e\0L\0\xf5\xff\xf6\xff\xf7\xff\xf8\xff\xf9\xff\xfa\xff\xfb\xffM\0\xfd\xff\x0b\0\xbf\0\xfe\xff\x03\0 \0\xf4\xff\xf3\xff\xef\xff\xf2\xff\xee\xff\x01\0\xfd\xff\xfe\xff\xff\xff"),new MlString("\xff\xff\xff\xff\xff\xff\x0f\0\x0e\0\x12\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x03\0\xff\xff\x14\0\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString("\x01\0\0\0\0\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\xff\xff\xff\xff\0\0\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\x1a\0\0\0\0\0\0\0"),new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\x0e\0\x1c\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\b\0\0\0\x07\0\x06\0\f\0\x0b\0\x10\0\0\0\t\0\x0f\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x11\0\0\0\x04\0\x05\0\x03\0\x18\0\x15\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x17\0\x16\0\x14\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x12\0\n\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\x13\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x10\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x02\0\x1b\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"),new MlString("\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\0\0\x19\0\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x0f\0\xff\xff\0\0\0\0\0\0\x03\0\x12\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x13\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x05\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\x05\0\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x10\0\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x10\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\x19\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString("")],h=new MlString(" ");caml_register_global(6,c);caml_register_global(5,[0,new MlString("Division_by_zero")]);caml_register_global(3,b);caml_register_global(2,a);var cF=new MlString("%d"),cE=new MlString("true"),cD=new MlString("false"),cC=new MlString("Pervasives.do_at_exit"),cB=new MlString("Array.blit"),cA=new MlString("\\b"),cz=new MlString("\\t"),cy=new MlString("\\n"),cx=new MlString("\\r"),cw=new MlString("\\\\"),cv=new MlString("\\'"),cu=new MlString(""),ct=new MlString("String.blit"),cs=new MlString("String.sub"),cr=new MlString(""),cq=new MlString("syntax error"),cp=new MlString("Parsing.YYexit"),co=new MlString("Parsing.Parse_error"),cn=new MlString("Set.remove_min_elt"),cm=[0,0,0,0],cl=[0,0,0],ck=new MlString("Set.bal"),cj=new MlString("Set.bal"),ci=new MlString("Set.bal"),ch=new MlString("Set.bal"),cg=new MlString("Map.remove_min_elt"),cf=new MlString("Map.bal"),ce=new MlString("Map.bal"),cd=new MlString("Map.bal"),cc=new MlString("Map.bal"),cb=new MlString("Buffer.add: cannot grow buffer"),ca=new MlString(""),b$=new MlString(""),b_=new MlString("%.12g"),b9=new MlString("\""),b8=new MlString("\""),b7=new MlString("'"),b6=new MlString("'"),b5=new MlString("nan"),b4=new MlString("neg_infinity"),b3=new MlString("infinity"),b2=new MlString("."),b1=new MlString("printf: bad positional specification (0)."),b0=new MlString("%_"),bZ=[0,new MlString("printf.ml"),143,8],bY=new MlString("'"),bX=new MlString("Printf: premature end of format string '"),bW=new MlString("'"),bV=new MlString(" in format string '"),bU=new MlString(", at char number "),bT=new MlString("Printf: bad conversion %"),bS=new MlString("Sformat.index_of_int: negative argument "),bR=new MlString("\""),bQ=new MlString(" name=\""),bP=new MlString("\""),bO=new MlString(" type=\""),bN=new MlString("<"),bM=new MlString(">"),bL=new MlString(""),bK=new MlString("<input name=\"x\">"),bJ=new MlString("input"),bI=new MlString("x"),bH=new MlString("code"),bG=new MlString("td"),bF=new MlString("tr"),bE=new MlString("table"),bD=new MlString("img"),bC=new MlString("a"),bB=new MlString("br"),bA=new MlString("pre"),bz=new MlString("p"),by=new MlString("div"),bx=new MlString("button"),bw=new MlString("input"),bv=new MlString("parser"),bu=new MlString("1"),bt=new MlString("0"),bs=[0,0,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,0],br=new MlString("\xff\xff\x02\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\0\0\0\0"),bq=new MlString("\x02\0\x03\0\x01\0\x02\0\x03\0\x03\0\x03\0\x02\0\x02\0\x03\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x02\0\x02\0"),bp=new MlString("\0\0\0\0\0\0\0\0\x02\0\0\0\0\0\0\0\x12\0\0\0\x03\0\0\0\0\0\b\0\x07\0\0\0\n\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\0\0\t\0\0\0\0\0\0\0\0\0"),bo=new MlString("\x03\0\x06\0\b\0\x17\0"),bn=new MlString("\x05\0\x01\xff\x01\xff\0\0\0\0\x01\xff\n\xff\x18\xff\0\0'\xff\0\0\x01\xff\x01\xff\0\0\0\0\x01\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x01\xff\0\x000\xff<\xff4\xff\n\xff"),bm=new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x1d\0\x01\0\x0f\0\b\0"),bl=new MlString("\0\0\xfe\xff\0\0\0\0"),bk=new MlString("\x07\0\x04\0\x04\0\t\0\x11\0\x05\0\x01\0\x02\0\x01\0\x19\0\x1a\0\0\0\n\0\x1b\0\0\0\x05\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x1c\0\0\0\0\0\0\0\0\0\n\0\0\0\0\0\x06\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\x11\0\x12\0\x13\0\x14\0\x15\0\n\0\x16\0\0\0\x18\0\x0b\0\f\0\r\0\x0e\0\x0f\0\n\0\0\0\0\0\0\0\n\0\f\0\r\0\x0e\0\x0f\0\f\0\r\0\x0e\0\n\0\0\0\0\0\0\0\0\0\0\0\r\0\x0e\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x04\0\0\0\0\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\0\0\x04\0\x05\0\x05\0\0\0\0\0\0\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\0\0\x05\0\x06\0\x06\0\0\0\0\0\0\0\0\0\x06\0\x06\0\x06\0\x06\0\x06\0\x06\0\0\0\x06\0"),bj=new MlString("\x02\0\0\0\x01\x01\x05\0\0\0\x04\x01\x01\0\x02\0\0\0\x0b\0\f\0\xff\xff\x02\x01\x0f\0\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x17\0\xff\xff\xff\xff\xff\xff\xff\xff\x02\x01\xff\xff\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\x02\x01\x12\x01\xff\xff\x05\x01\x06\x01\x07\x01\b\x01\t\x01\n\x01\x02\x01\xff\xff\xff\xff\xff\xff\x02\x01\x07\x01\b\x01\t\x01\n\x01\x07\x01\b\x01\t\x01\x02\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\b\x01\t\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x05\x01\x06\x01\x07\x01\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\xff\xff\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01"),bi=new MlString("EOF\0NEWLINE\0LPAR\0RPAR\0PLUS\0DOT\0PSTAR\0STAR\0INTER\0EGAL\0LEQ\0GEQ\0LT\0GT\0IMCOMP\0DUNNO\0DIFF\0"),bh=new MlString("VAR\0POWER\0"),bg=new MlString("lexing error"),bf=new MlString("\xc3\xb8"),be=new MlString("\xce\xb5"),bd=new MlString("(%s | %s)"),bc=new MlString("(%s)+"),bb=new MlString("(%s)~"),ba=new MlString("%s.%s"),a$=new MlString("(%s & %s)"),a_=new MlString("=/="),a9=new MlString("<="),a8=new MlString(">="),a7=new MlString("<"),a6=new MlString(">"),a5=new MlString("<>"),a4=new MlString("="),a3=new MlString(","),a2=new MlString("{%s}"),a1=new MlString(","),a0=new MlString("{%s}"),aZ=new MlString(","),aY=new MlString("{%s}"),aX=new MlString("%d -> %s"),aW=new MlString(","),aV=new MlString("(%s)"),aU=new MlString("Tools.ContreExemple"),aT=new MlString("Tools.NotDefined"),aS=new MlString("get_expr : empty word"),aR=[0,new MlString("word.ml"),134,4],aQ=new MlString("get_expr : stuck"),aP=new MlString("get_expr : stuck"),aO=[0,new MlString("word.ml"),84,15],aN=new MlString("(%s,%s)"),aM=new MlString(",\n"),aL=new MlString("{%s}"),aK=new MlString("Petri.trad : unsupported operation"),aJ=new MlString("OK"),aI=new MlString("Incorrect"),aH=new MlString("%s %s %s --------- %s"),aG=new MlString("%s <= %s -- false (%d pairs)\nWitness: %s"),aF=new MlString("%s <= %s -- true (%d pairs)"),aE=new MlString("_auto"),aD=new MlString("auto"),aC=new MlString("center"),aB=new MlString("drawin"),aA=new MlString("new vis.Network(document.getElementById('%s_auto'),data, {})"),az=new MlString("Final states : %s"),ay=new MlString("arrow"),ax=new MlString("25"),aw=new MlString("arrow-center"),av=new MlString("circle"),au=new MlString("%d"),at=new MlString("%d"),as=new MlString("circle"),ar=new MlString("%d"),aq=new MlString("%d"),ap=new MlString("box"),ao=new MlString("   %d   "),an=new MlString("%d"),am=new MlString("(a|b)+.C & d | e.(a|b)"),al=new MlString("#D2E5FF"),ak=new MlString("#2B7CE9"),aj=new MlString("#97C2FC"),ai=new MlString("#2B7CE9"),ah=new MlString("#A1EC76"),ag=new MlString("#41A906"),af=new MlString("#7BE141"),ae=new MlString("#41A906"),ad=new MlString("#D3BDF0"),ac=new MlString("#7C29F0"),ab=new MlString("#AD85E4"),aa=new MlString("#7C29F0"),$=new MlString("Show Details"),_=new MlString(""),Z=new MlString("Hide Details"),Y=new MlString(""),X=new MlString(""),W=[0,0,new MlString(""),0],V=new MlString("top"),U=new MlString("top"),T=new MlString("top"),S=new MlString("top"),R=new MlString("solvein"),Q=new MlString("enter equation here"),P=new MlString("100px"),O=new MlString("Show Details"),N=new MlString("Details:"),M=new MlString("output"),L=new MlString("0px"),K=new MlString(""),J=new MlString("0px"),I=new MlString("%s"),H=new MlString(""),G=new MlString("\n"),F=new MlString(""),E=new MlString("%s"),D=new MlString(""),C=new MlString("\n\n"),B=[0,0,new MlString(""),0],A=new MlString(""),z=new MlString(""),y=new MlString("Results:"),x=new MlString("Automaton for : "),w=new MlString("Automaton for : "),v=new MlString("new vis.Network(document.getElementById('%s_auto%d'),data, {})"),u=new MlString("drawin"),t=new MlString("_auto1"),s=new MlString("auto"),r=new MlString("_auto2"),q=new MlString("auto"),p=[0,0,new MlString(""),0],o=new MlString("(a|b)+.C & d > d & a.b.C & (d|a)\n"),n=new MlString("draw"),m=new MlString("details"),l=new MlString("solve");function k(i){throw [0,a,i];}function cG(j){throw [0,b,j];}function cV(cH,cJ){var cI=cH.getLen(),cK=cJ.getLen(),cL=caml_create_string(cI+cK|0);caml_blit_string(cH,0,cL,0,cI);caml_blit_string(cJ,0,cL,cI,cK);return cL;}function cW(cM){return caml_format_int(cF,cM);}function cO(cN,cP){if(cN){var cQ=cN[1];return [0,cQ,cO(cN[2],cP)];}return cP;}function cX(cU){var cR=caml_ml_out_channels_list(0);for(;;){if(cR){var cS=cR[2];try {}catch(cT){}var cR=cS;continue;}return 0;}}caml_register_named_value(cC,cX);function c3(c0,cZ,c2,c1,cY){if(0<=cY&&0<=cZ&&!((c0.length-1-cY|0)<cZ)&&0<=c1&&!((c2.length-1-cY|0)<c1))return caml_array_blit(c0,cZ,c2,c1,cY);return cG(cB);}function dD(c4){var c5=c4,c6=0;for(;;){if(c5){var c7=c5[2],c8=[0,c5[1],c6],c5=c7,c6=c8;continue;}return c6;}}function db(c_,c9){if(c9){var da=c9[2],dc=c$(c_,c9[1]);return [0,dc,db(c_,da)];}return 0;}function dE(df,dd){var de=dd;for(;;){if(de){var dg=de[2];c$(df,de[1]);var de=dg;continue;}return 0;}}function dF(dl,dh,dj){var di=dh,dk=dj;for(;;){if(dk){var dn=dk[2],dp=dm(dl,di,dk[1]),di=dp,dk=dn;continue;}return di;}}function dG(ds,dq){var dr=dq;for(;;){if(dr){var dt=dr[2],du=0===caml_compare(dr[1],ds)?1:0;if(du)return du;var dr=dt;continue;}return 0;}}function d4(dB){return c$(function(dv,dx){var dw=dv,dy=dx;for(;;){if(dy){var dz=dy[2],dA=dy[1];if(c$(dB,dA)){var dC=[0,dA,dw],dw=dC,dy=dz;continue;}var dy=dz;continue;}return dD(dw);}},0);}function d3(dH,dJ){var dI=caml_create_string(dH);caml_fill_string(dI,0,dH,dJ);return dI;}function d5(dM,dK,dL){if(0<=dK&&0<=dL&&!((dM.getLen()-dL|0)<dK)){var dN=caml_create_string(dL);caml_blit_string(dM,dK,dN,0,dL);return dN;}return cG(cs);}function d6(dQ,dP,dS,dR,dO){if(0<=dO&&0<=dP&&!((dQ.getLen()-dO|0)<dP)&&0<=dR&&!((dS.getLen()-dO|0)<dR))return caml_blit_string(dQ,dP,dS,dR,dO);return cG(ct);}function d7(dZ,dT){if(dT){var dU=dT[1],dV=[0,0],dW=[0,0],dY=dT[2];dE(function(dX){dV[1]+=1;dW[1]=dW[1]+dX.getLen()|0;return 0;},dT);var d0=caml_create_string(dW[1]+caml_mul(dZ.getLen(),dV[1]-1|0)|0);caml_blit_string(dU,0,d0,0,dU.getLen());var d1=[0,dU.getLen()];dE(function(d2){caml_blit_string(dZ,0,d0,d1[1],dZ.getLen());d1[1]=d1[1]+dZ.getLen()|0;caml_blit_string(d2,0,d0,d1[1],d2.getLen());d1[1]=d1[1]+d2.getLen()|0;return 0;},dY);return d0;}return cu;}var d8=caml_sys_const_word_size(0),d9=caml_mul(d8/8|0,(1<<(d8-10|0))-1|0)-1|0;function eo(ea,d$,d_){var eb=caml_lex_engine(ea,d$,d_);if(0<=eb){d_[11]=d_[12];var ec=d_[12];d_[12]=[0,ec[1],ec[2],ec[3],d_[4]+d_[6]|0];}return eb;}function ep(ed){var en=[0],em=1,el=0,ek=0,ej=0,ei=0,eh=0,eg=ed.getLen(),ef=cV(ed,cr);return [0,function(ee){ee[9]=1;return 0;},ef,eg,eh,ei,ej,ek,el,em,en,f,f];}var eq=[0,cp],er=[0,co],es=[0,caml_make_vect(100,0),caml_make_vect(100,0),caml_make_vect(100,e),caml_make_vect(100,e),100,0,0,0,e,e,0,0,0,0,0,0];function eB(ez){var et=es[5],eu=et*2|0,ev=caml_make_vect(eu,0),ew=caml_make_vect(eu,0),ex=caml_make_vect(eu,e),ey=caml_make_vect(eu,e);c3(es[1],0,ev,0,et);es[1]=ev;c3(es[2],0,ew,0,et);es[2]=ew;c3(es[3],0,ex,0,et);es[3]=ex;c3(es[4],0,ey,0,et);es[4]=ey;es[5]=eu;return 0;}var e5=[0,function(eA){return 0;}];function e9(eN,eJ,eZ,eK){var eI=es[11],eH=es[14],eG=es[6],eF=es[15],eE=es[7],eD=es[8],eC=es[16];es[6]=es[14]+1|0;es[7]=eJ;es[10]=eK[12];try {var eL=0,eM=0;for(;;)switch(caml_parse_engine(eN,es,eL,eM)){case 1:throw [0,er];case 2:eB(0);var eP=0,eO=2,eL=eO,eM=eP;continue;case 3:eB(0);var eR=0,eQ=3,eL=eQ,eM=eR;continue;case 4:try {var eS=[0,4,c$(caml_array_get(eN[1],es[13]),es)],eT=eS;}catch(eU){if(eU[1]!==er)throw eU;var eT=[0,5,0];}var eW=eT[2],eV=eT[1],eL=eV,eM=eW;continue;case 5:c$(eN[14],cq);var eY=0,eX=5,eL=eX,eM=eY;continue;default:var e0=c$(eZ,eK);es[9]=eK[11];es[10]=eK[12];var e1=1,eL=e1,eM=e0;continue;}}catch(e3){var e2=es[7];es[11]=eI;es[14]=eH;es[6]=eG;es[15]=eF;es[7]=eE;es[8]=eD;es[16]=eC;if(e3[1]===eq)return e3[2];e5[1]=function(e4){return caml_obj_is_block(e4)?caml_array_get(eN[3],caml_obj_tag(e4))===e2?1:0:caml_array_get(eN[2],e4)===e2?1:0;};throw e3;}}function e_(e6,e7){return caml_array_get(e6[2],e6[11]-e7|0);}function jm(e8){return 0;}function jl(fG){function fn(e$){return e$?e$[4]:0;}function fp(fa,ff,fc){var fb=fa?fa[4]:0,fd=fc?fc[4]:0,fe=fd<=fb?fb+1|0:fd+1|0;return [0,fa,ff,fc,fe];}function fK(fg,fq,fi){var fh=fg?fg[4]:0,fj=fi?fi[4]:0;if((fj+2|0)<fh){if(fg){var fk=fg[3],fl=fg[2],fm=fg[1],fo=fn(fk);if(fo<=fn(fm))return fp(fm,fl,fp(fk,fq,fi));if(fk){var fs=fk[2],fr=fk[1],ft=fp(fk[3],fq,fi);return fp(fp(fm,fl,fr),fs,ft);}return cG(ck);}return cG(cj);}if((fh+2|0)<fj){if(fi){var fu=fi[3],fv=fi[2],fw=fi[1],fx=fn(fw);if(fx<=fn(fu))return fp(fp(fg,fq,fw),fv,fu);if(fw){var fz=fw[2],fy=fw[1],fA=fp(fw[3],fv,fu);return fp(fp(fg,fq,fy),fz,fA);}return cG(ci);}return cG(ch);}var fB=fj<=fh?fh+1|0:fj+1|0;return [0,fg,fq,fi,fB];}function fJ(fH,fC){if(fC){var fD=fC[3],fE=fC[2],fF=fC[1],fI=dm(fG[1],fH,fE);return 0===fI?fC:0<=fI?fK(fF,fE,fJ(fH,fD)):fK(fJ(fH,fF),fE,fD);}return [0,0,fH,0,1];}function fR(fL){return [0,0,fL,0,1];}function fN(fO,fM){if(fM){var fQ=fM[3],fP=fM[2];return fK(fN(fO,fM[1]),fP,fQ);}return fR(fO);}function fT(fU,fS){if(fS){var fW=fS[2],fV=fS[1];return fK(fV,fW,fT(fU,fS[3]));}return fR(fU);}function f1(fX,f2,fY){if(fX){if(fY){var fZ=fY[4],f0=fX[4],f7=fY[3],f8=fY[2],f6=fY[1],f3=fX[3],f4=fX[2],f5=fX[1];return (fZ+2|0)<f0?fK(f5,f4,f1(f3,f2,fY)):(f0+2|0)<fZ?fK(f1(fX,f2,f6),f8,f7):fp(fX,f2,fY);}return fT(f2,fX);}return fN(f2,fY);}function gl(f9){var f_=f9;for(;;){if(f_){var f$=f_[1];if(f$){var f_=f$;continue;}return f_[2];}throw [0,c];}}function gA(ga){var gb=ga;for(;;){if(gb){var gc=gb[3],gd=gb[2];if(gc){var gb=gc;continue;}return gd;}throw [0,c];}}function gg(ge){if(ge){var gf=ge[1];if(gf){var gi=ge[3],gh=ge[2];return fK(gg(gf),gh,gi);}return ge[3];}return cG(cn);}function gB(gj,gk){if(gj){if(gk){var gm=gg(gk);return f1(gj,gl(gk),gm);}return gj;}return gk;}function gt(gr,gn){if(gn){var go=gn[3],gp=gn[2],gq=gn[1],gs=dm(fG[1],gr,gp);if(0===gs)return [0,gq,1,go];if(0<=gs){var gu=gt(gr,go),gw=gu[3],gv=gu[2];return [0,f1(gq,gp,gu[1]),gv,gw];}var gx=gt(gr,gq),gz=gx[2],gy=gx[1];return [0,gy,gz,f1(gx[3],gp,go)];}return cm;}var jg=0;function jh(gC){return gC?0:1;}function ji(gF,gD){var gE=gD;for(;;){if(gE){var gI=gE[3],gH=gE[1],gG=dm(fG[1],gF,gE[2]),gJ=0===gG?1:0;if(gJ)return gJ;var gK=0<=gG?gI:gH,gE=gK;continue;}return 0;}}function gT(gP,gL){if(gL){var gM=gL[3],gN=gL[2],gO=gL[1],gQ=dm(fG[1],gP,gN);if(0===gQ){if(gO)if(gM){var gR=gg(gM),gS=fK(gO,gl(gM),gR);}else var gS=gO;else var gS=gM;return gS;}return 0<=gQ?fK(gO,gN,gT(gP,gM)):fK(gT(gP,gO),gN,gM);}return 0;}function g1(gU,gV){if(gU){if(gV){var gW=gV[4],gX=gV[2],gY=gU[4],gZ=gU[2],g7=gV[3],g9=gV[1],g2=gU[3],g4=gU[1];if(gW<=gY){if(1===gW)return fJ(gX,gU);var g0=gt(gZ,gV),g3=g0[1],g5=g1(g2,g0[3]);return f1(g1(g4,g3),gZ,g5);}if(1===gY)return fJ(gZ,gV);var g6=gt(gX,gU),g8=g6[1],g_=g1(g6[3],g7);return f1(g1(g8,g9),gX,g_);}return gU;}return gV;}function hg(g$,ha){if(g$){if(ha){var hb=g$[3],hc=g$[2],hd=g$[1],he=gt(hc,ha),hf=he[1];if(0===he[2]){var hh=hg(hb,he[3]);return gB(hg(hd,hf),hh);}var hi=hg(hb,he[3]);return f1(hg(hd,hf),hc,hi);}return 0;}return 0;}function hq(hj,hk){if(hj){if(hk){var hl=hj[3],hm=hj[2],hn=hj[1],ho=gt(hm,hk),hp=ho[1];if(0===ho[2]){var hr=hq(hl,ho[3]);return f1(hq(hn,hp),hm,hr);}var hs=hq(hl,ho[3]);return gB(hq(hn,hp),hs);}return hj;}return 0;}function hz(ht,hv){var hu=ht,hw=hv;for(;;){if(hu){var hx=hu[1],hy=[0,hu[2],hu[3],hw],hu=hx,hw=hy;continue;}return hw;}}function hN(hB,hA){var hC=hz(hA,0),hD=hz(hB,0),hE=hC;for(;;){if(hD)if(hE){var hJ=hE[3],hI=hE[2],hH=hD[3],hG=hD[2],hF=dm(fG[1],hD[1],hE[1]);if(0===hF){var hK=hz(hI,hJ),hL=hz(hG,hH),hD=hL,hE=hK;continue;}var hM=hF;}else var hM=1;else var hM=hE?-1:0;return hM;}}function jj(hP,hO){return 0===hN(hP,hO)?1:0;}function h0(hQ,hS){var hR=hQ,hT=hS;for(;;){if(hR){if(hT){var hU=hT[3],hV=hT[1],hW=hR[3],hX=hR[2],hY=hR[1],hZ=dm(fG[1],hX,hT[2]);if(0===hZ){var h1=h0(hY,hV);if(h1){var hR=hW,hT=hU;continue;}return h1;}if(0<=hZ){var h2=h0([0,0,hX,hW,0],hU);if(h2){var hR=hY;continue;}return h2;}var h3=h0([0,hY,hX,0,0],hV);if(h3){var hR=hW;continue;}return h3;}return 0;}return 1;}}function h6(h7,h4){var h5=h4;for(;;){if(h5){var h9=h5[3],h8=h5[2];h6(h7,h5[1]);c$(h7,h8);var h5=h9;continue;}return 0;}}function ic(id,h_,ia){var h$=h_,ib=ia;for(;;){if(h$){var ig=h$[3],ie=h$[2],ih=dm(id,ie,ic(id,h$[1],ib)),h$=ig,ib=ih;continue;}return ib;}}function ip(ik,ii){var ij=ii;for(;;){if(ij){var io=ij[3],im=ij[1],il=c$(ik,ij[2]);if(il){var iq=ip(ik,im);if(iq){var ij=io;continue;}var ir=iq;}else var ir=il;return ir;}return 1;}}function iz(iu,is){var it=is;for(;;){if(it){var ix=it[3],iw=it[1],iv=c$(iu,it[2]);if(iv)var iy=iv;else{var iA=iz(iu,iw);if(!iA){var it=ix;continue;}var iy=iA;}return iy;}return 0;}}function iD(iE,iB){if(iB){var iC=iB[2],iG=iB[3],iF=iD(iE,iB[1]),iI=c$(iE,iC),iH=iD(iE,iG);return iI?f1(iF,iC,iH):gB(iF,iH);}return 0;}function iL(iM,iJ){if(iJ){var iK=iJ[2],iO=iJ[3],iN=iL(iM,iJ[1]),iP=iN[2],iQ=iN[1],iS=c$(iM,iK),iR=iL(iM,iO),iT=iR[2],iU=iR[1];if(iS){var iV=gB(iP,iT);return [0,f1(iQ,iK,iU),iV];}var iW=f1(iP,iK,iT);return [0,gB(iQ,iU),iW];}return cl;}function iY(iX){if(iX){var iZ=iX[1],i0=iY(iX[3]);return (iY(iZ)+1|0)+i0|0;}return 0;}function i5(i1,i3){var i2=i1,i4=i3;for(;;){if(i4){var i7=i4[2],i6=i4[1],i8=[0,i7,i5(i2,i4[3])],i2=i8,i4=i6;continue;}return i2;}}function jk(i9){return i5(0,i9);}return [0,jg,jh,ji,fJ,fR,gT,g1,hg,hq,hN,jj,h0,h6,ic,ip,iz,iD,iL,iY,jk,gl,gA,gl,gt,function(jb,i_){var i$=i_;for(;;){if(i$){var ja=i$[2],je=i$[3],jd=i$[1],jc=dm(fG[1],jb,ja);if(0===jc)return ja;var jf=0<=jc?je:jd,i$=jf;continue;}throw [0,c];}}];}function jE(jn){var jo=1<=jn?jn:1,jp=d9<jo?d9:jo,jq=caml_create_string(jp);return [0,jq,0,jp,jq];}function jF(jr){return d5(jr[1],0,jr[2]);}function jy(js,ju){var jt=[0,js[3]];for(;;){if(jt[1]<(js[2]+ju|0)){jt[1]=2*jt[1]|0;continue;}if(d9<jt[1])if((js[2]+ju|0)<=d9)jt[1]=d9;else k(cb);var jv=caml_create_string(jt[1]);d6(js[1],0,jv,0,js[2]);js[1]=jv;js[3]=jt[1];return 0;}}function jG(jw,jz){var jx=jw[2];if(jw[3]<=jx)jy(jw,1);jw[1].safeSet(jx,jz);jw[2]=jx+1|0;return 0;}function jH(jC,jA){var jB=jA.getLen(),jD=jC[2]+jB|0;if(jC[3]<jD)jy(jC,jB);d6(jA,0,jC[1],jC[2],jB);jC[2]=jD;return 0;}function jL(jI){return 0<=jI?jI:k(cV(bS,cW(jI)));}function jM(jJ,jK){return jL(jJ+jK|0);}var jN=c$(jM,1);function jU(jO){return d5(jO,0,jO.getLen());}function jW(jP,jQ,jS){var jR=cV(bV,cV(jP,bW)),jT=cV(bU,cV(cW(jQ),jR));return cG(cV(bT,cV(d3(1,jS),jT)));}function kL(jV,jY,jX){return jW(jU(jV),jY,jX);}function kM(jZ){return cG(cV(bX,cV(jU(jZ),bY)));}function kh(j0,j8,j_,ka){function j7(j1){if((j0.safeGet(j1)-48|0)<0||9<(j0.safeGet(j1)-48|0))return j1;var j2=j1+1|0;for(;;){var j3=j0.safeGet(j2);if(48<=j3){if(!(58<=j3)){var j5=j2+1|0,j2=j5;continue;}var j4=0;}else if(36===j3){var j6=j2+1|0,j4=1;}else var j4=0;if(!j4)var j6=j1;return j6;}}var j9=j7(j8+1|0),j$=jE((j_-j9|0)+10|0);jG(j$,37);var kb=j9,kc=dD(ka);for(;;){if(kb<=j_){var kd=j0.safeGet(kb);if(42===kd){if(kc){var ke=kc[2];jH(j$,cW(kc[1]));var kf=j7(kb+1|0),kb=kf,kc=ke;continue;}throw [0,d,bZ];}jG(j$,kd);var kg=kb+1|0,kb=kg;continue;}return jF(j$);}}function ma(kn,kl,kk,kj,ki){var km=kh(kl,kk,kj,ki);if(78!==kn&&110!==kn)return km;km.safeSet(km.getLen()-1|0,117);return km;}function kN(ku,kE,kJ,ko,kI){var kp=ko.getLen();function kG(kq,kD){var kr=40===kq?41:125;function kC(ks){var kt=ks;for(;;){if(kp<=kt)return c$(ku,ko);if(37===ko.safeGet(kt)){var kv=kt+1|0;if(kp<=kv)var kw=c$(ku,ko);else{var kx=ko.safeGet(kv),ky=kx-40|0;if(ky<0||1<ky){var kz=ky-83|0;if(kz<0||2<kz)var kA=1;else switch(kz){case 1:var kA=1;break;case 2:var kB=1,kA=0;break;default:var kB=0,kA=0;}if(kA){var kw=kC(kv+1|0),kB=2;}}else var kB=0===ky?0:1;switch(kB){case 1:var kw=kx===kr?kv+1|0:kF(kE,ko,kD,kx);break;case 2:break;default:var kw=kC(kG(kx,kv+1|0)+1|0);}}return kw;}var kH=kt+1|0,kt=kH;continue;}}return kC(kD);}return kG(kJ,kI);}function la(kK){return kF(kN,kM,kL,kK);}function lq(kO,kZ,k9){var kP=kO.getLen()-1|0;function k_(kQ){var kR=kQ;a:for(;;){if(kR<kP){if(37===kO.safeGet(kR)){var kS=0,kT=kR+1|0;for(;;){if(kP<kT)var kU=kM(kO);else{var kV=kO.safeGet(kT);if(58<=kV){if(95===kV){var kX=kT+1|0,kW=1,kS=kW,kT=kX;continue;}}else if(32<=kV)switch(kV-32|0){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 0:case 3:case 11:case 13:var kY=kT+1|0,kT=kY;continue;case 10:var k0=kF(kZ,kS,kT,105),kT=k0;continue;default:var k1=kT+1|0,kT=k1;continue;}var k2=kT;c:for(;;){if(kP<k2)var k3=kM(kO);else{var k4=kO.safeGet(k2);if(126<=k4)var k5=0;else switch(k4){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var k3=kF(kZ,kS,k2,105),k5=1;break;case 69:case 70:case 71:case 101:case 102:case 103:var k3=kF(kZ,kS,k2,102),k5=1;break;case 33:case 37:case 44:case 64:var k3=k2+1|0,k5=1;break;case 83:case 91:case 115:var k3=kF(kZ,kS,k2,115),k5=1;break;case 97:case 114:case 116:var k3=kF(kZ,kS,k2,k4),k5=1;break;case 76:case 108:case 110:var k6=k2+1|0;if(kP<k6){var k3=kF(kZ,kS,k2,105),k5=1;}else{var k7=kO.safeGet(k6)-88|0;if(k7<0||32<k7)var k8=1;else switch(k7){case 0:case 12:case 17:case 23:case 29:case 32:var k3=dm(k9,kF(kZ,kS,k2,k4),105),k5=1,k8=0;break;default:var k8=1;}if(k8){var k3=kF(kZ,kS,k2,105),k5=1;}}break;case 67:case 99:var k3=kF(kZ,kS,k2,99),k5=1;break;case 66:case 98:var k3=kF(kZ,kS,k2,66),k5=1;break;case 41:case 125:var k3=kF(kZ,kS,k2,k4),k5=1;break;case 40:var k3=k_(kF(kZ,kS,k2,k4)),k5=1;break;case 123:var k$=kF(kZ,kS,k2,k4),lb=kF(la,k4,kO,k$),lc=k$;for(;;){if(lc<(lb-2|0)){var ld=dm(k9,lc,kO.safeGet(lc)),lc=ld;continue;}var le=lb-1|0,k2=le;continue c;}default:var k5=0;}if(!k5)var k3=kL(kO,k2,k4);}var kU=k3;break;}}var kR=kU;continue a;}}var lf=kR+1|0,kR=lf;continue;}return kR;}}k_(0);return 0;}function np(lr){var lg=[0,0,0,0];function lp(ll,lm,lh){var li=41!==lh?1:0,lj=li?125!==lh?1:0:li;if(lj){var lk=97===lh?2:1;if(114===lh)lg[3]=lg[3]+1|0;if(ll)lg[2]=lg[2]+lk|0;else lg[1]=lg[1]+lk|0;}return lm+1|0;}lq(lr,lp,function(ln,lo){return ln+1|0;});return lg[1];}function l8(ls,lv,lt){var lu=ls.safeGet(lt);if((lu-48|0)<0||9<(lu-48|0))return dm(lv,0,lt);var lw=lu-48|0,lx=lt+1|0;for(;;){var ly=ls.safeGet(lx);if(48<=ly){if(!(58<=ly)){var lB=lx+1|0,lA=(10*lw|0)+(ly-48|0)|0,lw=lA,lx=lB;continue;}var lz=0;}else if(36===ly)if(0===lw){var lC=k(b1),lz=1;}else{var lC=dm(lv,[0,jL(lw-1|0)],lx+1|0),lz=1;}else var lz=0;if(!lz)var lC=dm(lv,0,lt);return lC;}}function l3(lD,lE){return lD?lE:c$(jN,lE);}function lS(lF,lG){return lF?lF[1]:lG;}function oR(nK,lI,nW,lL,nu,n2,lH){var lJ=c$(lI,lH);function nL(lK){return dm(lL,lJ,lK);}function nt(lQ,n1,lM,lV){var lP=lM.getLen();function nq(nT,lN){var lO=lN;for(;;){if(lP<=lO)return c$(lQ,lJ);var lR=lM.safeGet(lO);if(37===lR){var lZ=function(lU,lT){return caml_array_get(lV,lS(lU,lT));},l5=function(l7,l0,l2,lW){var lX=lW;for(;;){var lY=lM.safeGet(lX)-32|0;if(!(lY<0||25<lY))switch(lY){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 10:return l8(lM,function(l1,l6){var l4=[0,lZ(l1,l0),l2];return l5(l7,l3(l1,l0),l4,l6);},lX+1|0);default:var l9=lX+1|0,lX=l9;continue;}var l_=lM.safeGet(lX);if(124<=l_)var l$=0;else switch(l_){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var mb=lZ(l7,l0),mc=caml_format_int(ma(l_,lM,lO,lX,l2),mb),me=md(l3(l7,l0),mc,lX+1|0),l$=1;break;case 69:case 71:case 101:case 102:case 103:var mf=lZ(l7,l0),mg=caml_format_float(kh(lM,lO,lX,l2),mf),me=md(l3(l7,l0),mg,lX+1|0),l$=1;break;case 76:case 108:case 110:var mh=lM.safeGet(lX+1|0)-88|0;if(mh<0||32<mh)var mi=1;else switch(mh){case 0:case 12:case 17:case 23:case 29:case 32:var mj=lX+1|0,mk=l_-108|0;if(mk<0||2<mk)var ml=0;else{switch(mk){case 1:var ml=0,mm=0;break;case 2:var mn=lZ(l7,l0),mo=caml_format_int(kh(lM,lO,mj,l2),mn),mm=1;break;default:var mp=lZ(l7,l0),mo=caml_format_int(kh(lM,lO,mj,l2),mp),mm=1;}if(mm){var mq=mo,ml=1;}}if(!ml){var mr=lZ(l7,l0),mq=caml_int64_format(kh(lM,lO,mj,l2),mr);}var me=md(l3(l7,l0),mq,mj+1|0),l$=1,mi=0;break;default:var mi=1;}if(mi){var ms=lZ(l7,l0),mt=caml_format_int(ma(110,lM,lO,lX,l2),ms),me=md(l3(l7,l0),mt,lX+1|0),l$=1;}break;case 37:case 64:var me=md(l0,d3(1,l_),lX+1|0),l$=1;break;case 83:case 115:var mu=lZ(l7,l0);if(115===l_)var mv=mu;else{var mw=[0,0],mx=0,my=mu.getLen()-1|0;if(!(my<mx)){var mz=mx;for(;;){var mA=mu.safeGet(mz),mB=14<=mA?34===mA?1:92===mA?1:0:11<=mA?13<=mA?1:0:8<=mA?1:0,mC=mB?2:caml_is_printable(mA)?1:4;mw[1]=mw[1]+mC|0;var mD=mz+1|0;if(my!==mz){var mz=mD;continue;}break;}}if(mw[1]===mu.getLen())var mE=mu;else{var mF=caml_create_string(mw[1]);mw[1]=0;var mG=0,mH=mu.getLen()-1|0;if(!(mH<mG)){var mI=mG;for(;;){var mJ=mu.safeGet(mI),mK=mJ-34|0;if(mK<0||58<mK)if(-20<=mK)var mL=1;else{switch(mK+34|0){case 8:mF.safeSet(mw[1],92);mw[1]+=1;mF.safeSet(mw[1],98);var mM=1;break;case 9:mF.safeSet(mw[1],92);mw[1]+=1;mF.safeSet(mw[1],116);var mM=1;break;case 10:mF.safeSet(mw[1],92);mw[1]+=1;mF.safeSet(mw[1],110);var mM=1;break;case 13:mF.safeSet(mw[1],92);mw[1]+=1;mF.safeSet(mw[1],114);var mM=1;break;default:var mL=1,mM=0;}if(mM)var mL=0;}else var mL=(mK-1|0)<0||56<(mK-1|0)?(mF.safeSet(mw[1],92),mw[1]+=1,mF.safeSet(mw[1],mJ),0):1;if(mL)if(caml_is_printable(mJ))mF.safeSet(mw[1],mJ);else{mF.safeSet(mw[1],92);mw[1]+=1;mF.safeSet(mw[1],48+(mJ/100|0)|0);mw[1]+=1;mF.safeSet(mw[1],48+((mJ/10|0)%10|0)|0);mw[1]+=1;mF.safeSet(mw[1],48+(mJ%10|0)|0);}mw[1]+=1;var mN=mI+1|0;if(mH!==mI){var mI=mN;continue;}break;}}var mE=mF;}var mv=cV(b8,cV(mE,b9));}if(lX===(lO+1|0))var mO=mv;else{var mP=kh(lM,lO,lX,l2);try {var mQ=0,mR=1;for(;;){if(mP.getLen()<=mR)var mS=[0,0,mQ];else{var mT=mP.safeGet(mR);if(49<=mT)if(58<=mT)var mU=0;else{var mS=[0,caml_int_of_string(d5(mP,mR,(mP.getLen()-mR|0)-1|0)),mQ],mU=1;}else{if(45===mT){var mW=mR+1|0,mV=1,mQ=mV,mR=mW;continue;}var mU=0;}if(!mU){var mX=mR+1|0,mR=mX;continue;}}var mY=mS;break;}}catch(mZ){if(mZ[1]!==a)throw mZ;var mY=jW(mP,0,115);}var m0=mY[1],m1=mv.getLen(),m2=0,m6=mY[2],m5=32;if(m0===m1&&0===m2){var m3=mv,m4=1;}else var m4=0;if(!m4)if(m0<=m1)var m3=d5(mv,m2,m1);else{var m7=d3(m0,m5);if(m6)d6(mv,m2,m7,0,m1);else d6(mv,m2,m7,m0-m1|0,m1);var m3=m7;}var mO=m3;}var me=md(l3(l7,l0),mO,lX+1|0),l$=1;break;case 67:case 99:var m8=lZ(l7,l0);if(99===l_)var m9=d3(1,m8);else{if(39===m8)var m_=cv;else if(92===m8)var m_=cw;else{if(14<=m8)var m$=0;else switch(m8){case 8:var m_=cA,m$=1;break;case 9:var m_=cz,m$=1;break;case 10:var m_=cy,m$=1;break;case 13:var m_=cx,m$=1;break;default:var m$=0;}if(!m$)if(caml_is_printable(m8)){var na=caml_create_string(1);na.safeSet(0,m8);var m_=na;}else{var nb=caml_create_string(4);nb.safeSet(0,92);nb.safeSet(1,48+(m8/100|0)|0);nb.safeSet(2,48+((m8/10|0)%10|0)|0);nb.safeSet(3,48+(m8%10|0)|0);var m_=nb;}}var m9=cV(b6,cV(m_,b7));}var me=md(l3(l7,l0),m9,lX+1|0),l$=1;break;case 66:case 98:var nd=lX+1|0,nc=lZ(l7,l0)?cE:cD,me=md(l3(l7,l0),nc,nd),l$=1;break;case 40:case 123:var ne=lZ(l7,l0),nf=kF(la,l_,lM,lX+1|0);if(123===l_){var ng=jE(ne.getLen()),nk=function(ni,nh){jG(ng,nh);return ni+1|0;};lq(ne,function(nj,nm,nl){if(nj)jH(ng,b0);else jG(ng,37);return nk(nm,nl);},nk);var nn=jF(ng),me=md(l3(l7,l0),nn,nf),l$=1;}else{var no=l3(l7,l0),nr=jM(np(ne),no),me=nt(function(ns){return nq(nr,nf);},no,ne,lV),l$=1;}break;case 33:c$(nu,lJ);var me=nq(l0,lX+1|0),l$=1;break;case 41:var me=md(l0,ca,lX+1|0),l$=1;break;case 44:var me=md(l0,b$,lX+1|0),l$=1;break;case 70:var nv=lZ(l7,l0);if(0===l2)var nw=b_;else{var nx=kh(lM,lO,lX,l2);if(70===l_)nx.safeSet(nx.getLen()-1|0,103);var nw=nx;}var ny=caml_classify_float(nv);if(3===ny)var nz=nv<0?b4:b3;else if(4<=ny)var nz=b5;else{var nA=caml_format_float(nw,nv),nB=0,nC=nA.getLen();for(;;){if(nC<=nB)var nD=cV(nA,b2);else{var nE=nA.safeGet(nB)-46|0,nF=nE<0||23<nE?55===nE?1:0:(nE-1|0)<0||21<(nE-1|0)?1:0;if(!nF){var nG=nB+1|0,nB=nG;continue;}var nD=nA;}var nz=nD;break;}}var me=md(l3(l7,l0),nz,lX+1|0),l$=1;break;case 91:var me=kL(lM,lX,l_),l$=1;break;case 97:var nH=lZ(l7,l0),nI=c$(jN,lS(l7,l0)),nJ=lZ(0,nI),nN=lX+1|0,nM=l3(l7,nI);if(nK)nL(dm(nH,0,nJ));else dm(nH,lJ,nJ);var me=nq(nM,nN),l$=1;break;case 114:var me=kL(lM,lX,l_),l$=1;break;case 116:var nO=lZ(l7,l0),nQ=lX+1|0,nP=l3(l7,l0);if(nK)nL(c$(nO,0));else c$(nO,lJ);var me=nq(nP,nQ),l$=1;break;default:var l$=0;}if(!l$)var me=kL(lM,lX,l_);return me;}},nV=lO+1|0,nS=0;return l8(lM,function(nU,nR){return l5(nU,nT,nS,nR);},nV);}dm(nW,lJ,lR);var nX=lO+1|0,lO=nX;continue;}}function md(n0,nY,nZ){nL(nY);return nq(n0,nZ);}return nq(n1,0);}var n3=dm(nt,n2,jL(0)),n4=np(lH);if(n4<0||6<n4){var of=function(n5,n$){if(n4<=n5){var n6=caml_make_vect(n4,0),n9=function(n7,n8){return caml_array_set(n6,(n4-n7|0)-1|0,n8);},n_=0,oa=n$;for(;;){if(oa){var ob=oa[2],oc=oa[1];if(ob){n9(n_,oc);var od=n_+1|0,n_=od,oa=ob;continue;}n9(n_,oc);}return dm(n3,lH,n6);}}return function(oe){return of(n5+1|0,[0,oe,n$]);};},og=of(0,0);}else switch(n4){case 1:var og=function(oi){var oh=caml_make_vect(1,0);caml_array_set(oh,0,oi);return dm(n3,lH,oh);};break;case 2:var og=function(ok,ol){var oj=caml_make_vect(2,0);caml_array_set(oj,0,ok);caml_array_set(oj,1,ol);return dm(n3,lH,oj);};break;case 3:var og=function(on,oo,op){var om=caml_make_vect(3,0);caml_array_set(om,0,on);caml_array_set(om,1,oo);caml_array_set(om,2,op);return dm(n3,lH,om);};break;case 4:var og=function(or,os,ot,ou){var oq=caml_make_vect(4,0);caml_array_set(oq,0,or);caml_array_set(oq,1,os);caml_array_set(oq,2,ot);caml_array_set(oq,3,ou);return dm(n3,lH,oq);};break;case 5:var og=function(ow,ox,oy,oz,oA){var ov=caml_make_vect(5,0);caml_array_set(ov,0,ow);caml_array_set(ov,1,ox);caml_array_set(ov,2,oy);caml_array_set(ov,3,oz);caml_array_set(ov,4,oA);return dm(n3,lH,ov);};break;case 6:var og=function(oC,oD,oE,oF,oG,oH){var oB=caml_make_vect(6,0);caml_array_set(oB,0,oC);caml_array_set(oB,1,oD);caml_array_set(oB,2,oE);caml_array_set(oB,3,oF);caml_array_set(oB,4,oG);caml_array_set(oB,5,oH);return dm(n3,lH,oB);};break;default:var og=dm(n3,lH,[0]);}return og;}function oQ(oI){return jE(2*oI.getLen()|0);}function oN(oL,oJ){var oK=jF(oJ);oJ[2]=0;return c$(oL,oK);}function oV(oM){var oP=c$(oN,oM);return oS(oR,1,oQ,jG,jH,function(oO){return 0;},oP);}function oW(oU){return dm(oV,function(oT){return oT;},oU);}var oX=[0,0];32===d8;var oY=[];caml_update_dummy(oY,[0,oY,oY]);var oZ=null,o5=undefined;function o4(o0,o1){return o0==oZ?0:c$(o1,o0);}function o6(o2,o3){return o2==oZ?c$(o3,0):o2;}var o7=false,o8=Array;function o_(o9){return o9 instanceof o8?0:[0,new MlWrappedString(o9.toString())];}oX[1]=[0,o_,oX[1]];function pi(o$,pa){o$.appendChild(pa);return 0;}function pj(pb,pc){pb.removeChild(pc);return 0;}function pk(pe){return caml_js_wrap_callback(function(pd){if(pd){var pf=c$(pe,pd);if(!(pf|0))pd.preventDefault();return pf;}var pg=event,ph=c$(pe,pg);if(!(ph|0))pg.returnValue=ph;return ph;});}var pl=this,pm=pl.document;function pu(pn,po){return pn?c$(po,pn[1]):0;}function pr(pq,pp){return pq.createElement(pp.toString());}function pv(pt,ps){return pr(pt,ps);}var pw=[0,785140586];function pP(px,py,pA,pz){for(;;){if(0===px&&0===py)return pr(pA,pz);var pB=pw[1];if(785140586===pB){try {var pC=pm.createElement(bK.toString()),pD=bJ.toString(),pE=pC.tagName.toLowerCase()===pD?1:0,pF=pE?pC.name===bI.toString()?1:0:pE,pG=pF;}catch(pI){var pG=0;}var pH=pG?982028505:-1003883683;pw[1]=pH;continue;}if(982028505<=pB){var pJ=new o8();pJ.push(bN.toString(),pz.toString());pu(px,function(pK){pJ.push(bO.toString(),caml_js_html_escape(pK),bP.toString());return 0;});pu(py,function(pL){pJ.push(bQ.toString(),caml_js_html_escape(pL),bR.toString());return 0;});pJ.push(bM.toString());return pA.createElement(pJ.join(bL.toString()));}var pM=pr(pA,pz);pu(px,function(pN){return pM.type=pN;});pu(py,function(pO){return pM.name=pO;});return pM;}}function p0(pS,pR,pQ){return pP(pS,pR,pQ,bw);}function p1(pT){return pv(pT,by);}function p2(pU){return pv(pU,bz);}function p3(pV){return pv(pV,bC);}function p4(pW){return pv(pW,bE);}function p5(pX){return pv(pX,bF);}function p6(pY){return pv(pY,bG);}function p7(pZ){return pr(pZ,bH);}this.HTMLElement===o5;function p_(p9,p8){return 0===p8?1003109192:1===p8?p9:[0,748545537,[0,p9,p_(p9,p8-1|0)]];}var qB=bs.slice(),qA=[0,257,258,0],qz=303;function qC(p$){throw [0,eq,e_(p$,0)];}function qD(qa){throw [0,eq,e_(qa,0)];}function qE(qb){return 3901498;}function qF(qc){return -941236332;}function qG(qd){return 15949;}function qH(qe){return 17064;}function qI(qf){return 3553395;}function qJ(qg){return 3802040;}function qK(qh){return 15500;}function qL(qi){return e_(qi,1);}function qM(qj){return [0,926224370,e_(qj,1)];}function qN(qk){return [0,974443759,[0,19065,[0,926224370,e_(qk,1)]]];}function qO(ql){var qm=e_(ql,2);return [0,974443759,[0,qm,e_(ql,0)]];}function qP(qn){var qo=e_(qn,2);return [0,-783405316,[0,qo,e_(qn,0)]];}function qQ(qp){var qq=e_(qp,2);return [0,748545537,[0,qq,e_(qp,0)]];}function qR(qr){var qs=e_(qr,1);return p_(qs,e_(qr,0));}function qS(qt){var qu=e_(qt,0);return caml_string_equal(qu,bu)?19065:caml_string_equal(qu,bt)?1003109192:[0,4298439,qu];}function qT(qv){var qw=e_(qv,2),qx=e_(qv,1);return [0,qx,qw,e_(qv,0)];}var qU=[0,[0,function(qy){return k(bv);},qT,qS,qR,qQ,qP,qO,qN,qM,qL,qK,qJ,qI,qH,qG,qF,qE,qD,qC],qB,qA,br,bq,bp,bo,bn,bm,bl,qz,bk,bj,jm,bi,bh];function q3(qW){var qV=0;for(;;){var qX=eo(g,qV,qW);if(qX<0||20<qX){c$(qW[1],qW);var qV=qX;continue;}switch(qX){case 1:var qZ=qY(qW);break;case 2:var qZ=1;break;case 3:var q0=qW[5],q1=qW[6]-q0|0,q2=caml_create_string(q1);caml_blit_string(qW[2],q0,q2,0,q1);var qZ=[0,q2];break;case 4:var qZ=7;break;case 5:var qZ=6;break;case 6:var qZ=4;break;case 7:var qZ=5;break;case 8:var qZ=8;break;case 9:var qZ=2;break;case 10:var qZ=3;break;case 11:var qZ=15;break;case 12:var qZ=16;break;case 13:var qZ=10;break;case 14:var qZ=12;break;case 15:var qZ=13;break;case 16:var qZ=14;break;case 17:var qZ=11;break;case 18:var qZ=9;break;case 19:var qZ=0;break;case 20:var qZ=k(cV(bg,d3(1,qW[2].safeGet(qW[5]))));break;default:var qZ=q3(qW);}return qZ;}}function qY(q5){var q4=25;for(;;){var q6=eo(g,q4,q5);if(q6<0||2<q6){c$(q5[1],q5);var q4=q6;continue;}switch(q6){case 1:var q7=0;break;case 2:var q7=qY(q5);break;default:var q7=1;}return q7;}}function rg(q8){return e9(qU,2,q3,ep(q8));}function ra(q9){if(typeof q9==="number")return 1003109192<=q9?bf:be;var q_=q9[1];if(748545537<=q_){if(926224370<=q_){if(974443759<=q_){var q$=q9[2],rb=ra(q$[2]);return kF(oW,bd,ra(q$[1]),rb);}return dm(oW,bc,ra(q9[2]));}if(748545556<=q_)return dm(oW,bb,ra(q9[2]));var rc=q9[2],rd=ra(rc[2]);return kF(oW,ba,ra(rc[1]),rd);}if(4298439<=q_)return q9[2];var re=q9[2],rf=ra(re[2]);return kF(oW,a$,ra(re[1]),rf);}var rj=[0,function(ri,rh){return caml_compare(ri,rh);}];function rl(rk){return rk?rk[5]:0;}function rE(rm,rs,rr,ro){var rn=rl(rm),rp=rl(ro),rq=rp<=rn?rn+1|0:rp+1|0;return [0,rm,rs,rr,ro,rq];}function rV(ru,rt){return [0,0,ru,rt,0,1];}function rW(rv,rG,rF,rx){var rw=rv?rv[5]:0,ry=rx?rx[5]:0;if((ry+2|0)<rw){if(rv){var rz=rv[4],rA=rv[3],rB=rv[2],rC=rv[1],rD=rl(rz);if(rD<=rl(rC))return rE(rC,rB,rA,rE(rz,rG,rF,rx));if(rz){var rJ=rz[3],rI=rz[2],rH=rz[1],rK=rE(rz[4],rG,rF,rx);return rE(rE(rC,rB,rA,rH),rI,rJ,rK);}return cG(cf);}return cG(ce);}if((rw+2|0)<ry){if(rx){var rL=rx[4],rM=rx[3],rN=rx[2],rO=rx[1],rP=rl(rO);if(rP<=rl(rL))return rE(rE(rv,rG,rF,rO),rN,rM,rL);if(rO){var rS=rO[3],rR=rO[2],rQ=rO[1],rT=rE(rO[4],rN,rM,rL);return rE(rE(rv,rG,rF,rQ),rR,rS,rT);}return cG(cd);}return cG(cc);}var rU=ry<=rw?rw+1|0:ry+1|0;return [0,rv,rG,rF,rx,rU];}var rX=0;function r7(r3,r6,rY){if(rY){var rZ=rY[4],r0=rY[3],r1=rY[2],r2=rY[1],r5=rY[5],r4=dm(rj[1],r3,r1);return 0===r4?[0,r2,r3,r6,rZ,r5]:0<=r4?rW(r2,r1,r0,r7(r3,r6,rZ)):rW(r7(r3,r6,r2),r1,r0,rZ);}return [0,0,r3,r6,0,1];}function tP(r_,r8){var r9=r8;for(;;){if(r9){var sc=r9[4],sb=r9[3],sa=r9[1],r$=dm(rj[1],r_,r9[2]);if(0===r$)return sb;var sd=0<=r$?sc:sa,r9=sd;continue;}throw [0,c];}}function sg(se){if(se){var sf=se[1];if(sf){var sj=se[4],si=se[3],sh=se[2];return rW(sg(sf),sh,si,sj);}return se[4];}return cG(cg);}function so(sp,sk,sm){var sl=sk,sn=sm;for(;;){if(sl){var ss=sl[4],sr=sl[3],sq=sl[2],st=kF(sp,sq,sr,so(sp,sl[1],sn)),sl=ss,sn=st;continue;}return sn;}}function sA(sw,su){var sv=su;for(;;){if(sv){var sz=sv[4],sy=sv[1],sx=dm(sw,sv[2],sv[3]);if(sx){var sB=sA(sw,sy);if(sB){var sv=sz;continue;}var sC=sB;}else var sC=sx;return sC;}return 1;}}function sE(sG,sF,sD){if(sD){var sJ=sD[4],sI=sD[3],sH=sD[2];return rW(sE(sG,sF,sD[1]),sH,sI,sJ);}return rV(sG,sF);}function sL(sN,sM,sK){if(sK){var sQ=sK[3],sP=sK[2],sO=sK[1];return rW(sO,sP,sQ,sL(sN,sM,sK[4]));}return rV(sN,sM);}function sV(sR,sX,sW,sS){if(sR){if(sS){var sT=sS[5],sU=sR[5],s3=sS[4],s4=sS[3],s5=sS[2],s2=sS[1],sY=sR[4],sZ=sR[3],s0=sR[2],s1=sR[1];return (sT+2|0)<sU?rW(s1,s0,sZ,sV(sY,sX,sW,sS)):(sU+2|0)<sT?rW(sV(sR,sX,sW,s2),s5,s4,s3):rE(sR,sX,sW,sS);}return sL(sX,sW,sR);}return sE(sX,sW,sS);}function s9(s_,s6){if(s6){var s7=s6[3],s8=s6[2],ta=s6[4],s$=s9(s_,s6[1]),tc=dm(s_,s8,s7),tb=s9(s_,ta);if(tc)return sV(s$,s8,s7,tb);if(s$)if(tb){var td=tb;for(;;){if(!td)throw [0,c];var te=td[1];if(te){var td=te;continue;}var tg=td[3],tf=td[2],th=sV(s$,tf,tg,sg(tb));break;}}else var th=s$;else var th=tb;return th;}return 0;}function to(ti,tk){var tj=ti,tl=tk;for(;;){if(tj){var tm=tj[1],tn=[0,tj[2],tj[3],tj[4],tl],tj=tm,tl=tn;continue;}return tl;}}function tQ(tB,tq,tp){var tr=to(tp,0),ts=to(tq,0),tt=tr;for(;;){if(ts)if(tt){var tA=tt[4],tz=tt[3],ty=tt[2],tx=ts[4],tw=ts[3],tv=ts[2],tu=dm(rj[1],ts[1],tt[1]);if(0===tu){var tC=dm(tB,tv,ty);if(0===tC){var tD=to(tz,tA),tE=to(tw,tx),ts=tE,tt=tD;continue;}var tF=tC;}else var tF=tu;}else var tF=1;else var tF=tt?-1:0;return tF;}}function tK(tG,tI){var tH=tG,tJ=tI;for(;;){if(tJ){var tN=tJ[3],tM=tJ[2],tL=tJ[1],tO=[0,[0,tM,tN],tK(tH,tJ[4])],tH=tO,tJ=tL;continue;}return tH;}}var tR=jl(rj),tU=jl([0,c$(tQ,function(tT,tS){return caml_compare(tT,tS);})]),tV=jl([0,tR[10]]),tY=jl([0,function(tX,tW){return caml_compare(tX,tW);}]),t1=jl([0,function(t0,tZ){return caml_compare(t0,tZ);}]),t5=jl([0,function(t3,t2){var t4=dm(tR[10],t3[1],t2[1]);return 0===t4?dm(tY[10],t3[2],t2[2]):t4;}]);function ui(t9){var t7=tR[1];function t8(t6){return c$(tR[7],t6[1]);}return kF(t5[14],t8,t9,t7);}function uj(ub){var ua=tR[1];return so(function(t_,t$){return c$(tR[4],t_);},ub,ua);}function ul(ue,uc){var ug=tK(0,uc);return dm(oW,aV,d7(aW,db(function(ud){var uf=c$(ue,ud[2]);return kF(oW,aX,ud[1],uf);},ug)));}function uk(uh){return dm(oW,aY,d7(aZ,db(cW,c$(tR[20],uh))));}var um=[0,aU],un=[0,aT];function vQ(uo){return [0,-783405316,[0,uo[1],uo[2]]];}function v0(up){return [0,748545537,[0,up[1],up[2]]];}function uK(ur,uq){var uv=tR[1];try {var us=tP(ur,uq),ut=us;}catch(uu){if(uu[1]!==c)throw uu;var ut=uv;}return ut;}function vU(uw){var ux=uw[3],uy=uw[2],uz=uw[1],uD=tR[1];function uE(uA,uB){var uC=dm(tR[4],uA[3],uB);return dm(tR[4],uA[1],uC);}var uG=kF(t1[14],uE,uy,uD);function uH(uF){return dm(r7,uF,c$(tR[5],uF));}var uN=kF(tR[14],uH,uG,rX);function uO(uI,uL){var uJ=uI[1],uM=uK(uJ,uL);return r7(uJ,dm(tR[4],uI[3],uM),uL);}var uP=kF(t1[14],uO,uy,uN);a:for(;;){var u0=so(function(uP){return function(uZ,uX,uY){function uW(uQ,uV){var uT=uK(uQ,uP);function uU(uS,uR){return dm(tR[4],uS,uR);}return kF(tR[14],uU,uT,uV);}return r7(uZ,kF(tR[14],uW,uX,uX),uY);};}(uP),uP,rX),u1=tR[11],u2=to(uP,0),u3=to(u0,0),u4=u2;for(;;){if(u3)if(u4){var u_=u4[4],u9=u4[3],u8=u4[2],u7=u3[4],u6=u3[3],u5=u3[2],u$=0===dm(rj[1],u3[1],u4[1])?1:0;if(u$){var va=dm(u1,u5,u8);if(va){var vb=to(u9,u_),vc=to(u6,u7),u3=vc,u4=vb;continue;}var vd=va;}else var vd=u$;var ve=vd;}else var ve=0;else var ve=u4?0:1;if(ve){if(uz===ux)return k(aS);var vg=function(vf){return vf[1]===uz?1:0;},vh=dm(t1[17],vg,uy),vi=c$(t1[20],vh);if(vi){var vj=vi[2],vk=vi[1],vl=vk[3],vm=vk[2];if(vj){var vq=uK(vl,uP),vt=dF(function(vp,vn){var vo=uK(vn[3],uP);return dm(tR[8],vp,vo);},vq,vj),vu=function(vs){var vr=uK(ux,uP);return 1-dm(tR[3],vs,vr);},vv=dm(tR[17],vu,vt);if(c$(tR[2],vv)){var vw=0,vx=0,vy=[0,[0,uz,vm,vl],vj];for(;;){if(vy){var vz=vy[2],vA=vy[1],vB=vA[3],vC=uK(vB,uP),vD=uK(vl,uP),vE=dm(tR[8],vD,vC);if(vl===vB&&c$(tR[2],vE))throw [0,d,aO];var vH=function(vG){var vF=uK(ux,uP);return 1-dm(tR[3],vG,vF);};if(dm(tR[16],vH,vE)){var vI=[0,vA,vw],vw=vI,vy=vz;continue;}var vJ=[0,vA,vx],vx=vJ,vy=vz;continue;}var vK=dD(vx),vL=dD(vw);if(0===vK)throw [0,d,aR];if(0===vL){if(vK){var vM=vK[2],vN=vK[1][2];if(vM){var vR=[0,4298439,vN];return dF(function(vP,vO){return vQ([0,vP,[0,4298439,vO[2]]]);},vR,vM);}return [0,4298439,vN];}return k(aQ);}var vT=function(vS){return 1-dG(vS,vK);},vW=vU([0,uz,dm(t1[17],vT,uy),ux]),vX=function(vV){return 1-dG(vV,vL);};return vQ([0,vU([0,uz,dm(t1[17],vX,uy),ux]),vW]);}}var vY=c$(tR[23],vv),vZ=vU([0,vY,uy,ux]);return v0([0,vU([0,uz,uy,vY]),vZ]);}return vl===ux?[0,4298439,vm]:v0([0,[0,4298439,vm],vU([0,vl,uy,ux])]);}return k(aP);}var uP=u0;continue a;}}}var v1=t5[7],v2=t5[9];function v6(v7,v3){if(typeof v3!=="number"){var v4=v3[1];if(!(748545537<=v4)){if(4298439<=v4){var w0=c$(tR[5],v7),w1=dm(tR[4],v7+1|0,w0),w2=c$(tY[5],[0,v3[2],v7+1|0]),w3=[0,c$(tR[5],v7),w2],w4=c$(t5[5],w3),w5=c$(tR[5],v7+1|0);return [0,[0,w1,w4,v7,c$(tV[5],w5)],v7+2|0];}var w6=v3[2],w7=v6(v7,w6[1]),w8=v6(w7[2],w6[2]),w9=w8[1],w_=w7[1],w$=w9[3],xa=w9[2],xb=w_[3],xc=w_[2],xe=w8[2],xd=w9[4],xf=dm(tR[6],w$,w9[1]),xg=dm(tR[7],w_[1],xf),xm=tV[1],xl=w_[4],xn=function(xi){function xk(xh){var xj=dm(tR[7],xi,xh);return c$(tV[4],xj);}return dm(tV[14],xk,xd);},xp=kF(tV[14],xn,xl,xm),xq=function(xo){return dm(tR[3],xb,xo[1]);},xr=dm(t5[17],xq,xc),xt=function(xs){return dm(tR[3],w$,xs[1]);},xu=dm(t5[17],xt,xa),xB=t5[1],xC=function(xv){var xx=xv[2];function xA(xw){var xy=dm(tY[7],xx,xw[2]),xz=[0,c$(tR[5],xb),xy];return c$(t5[4],xz);}return dm(t5[14],xA,xu);},xD=kF(t5[14],xC,xr,xB);return [0,[0,xg,dm(v1,dm(v2,dm(v2,dm(v1,xc,xa),xu),xr),xD),xb,xp],xe];}if(926224370<=v4){if(974443759<=v4){var v5=v3[2],v8=v6(v7,v5[1]),v9=v6(v8[2],v5[2]),v_=v9[1],v$=v8[1],wa=v_[3],wb=v_[2],wc=v$[3],wd=v9[2],we=dm(tR[6],wa,v_[1]),wf=dm(tR[7],v$[1],we),wh=dm(tV[7],v$[4],v_[4]),wi=function(wg){return dm(tR[3],wa,wg[1]);},wj=dm(t5[17],wi,wb),wn=t5[1],wo=function(wk){var wl=wk[2],wm=[0,c$(tR[5],wc),wl];return c$(t5[4],wm);},wp=kF(t5[14],wo,wj,wn);return [0,[0,wf,dm(v1,dm(v2,dm(v1,v$[2],wb),wj),wp),wc,wh],wd];}var wq=v6(v7,v3[2]),wr=wq[1],ws=wr[3],wt=wr[4],wu=wr[2],ww=wq[2],wx=function(wv){return dm(tR[3],ws,wv[1]);},wy=dm(t5[17],wx,wu),wC=t5[1],wD=function(wA){function wB(wz){return c$(t5[4],[0,wA,wz[2]]);}return dm(t5[14],wB,wy);},wE=dm(v1,wu,kF(tV[14],wD,wt,wC));return [0,[0,wr[1],wE,ws,wt],ww];}if(!(748545556<=v4)){var wF=v3[2],wG=v6(v7,wF[1]),wH=v6(wG[2],wF[2]),wI=wH[1],wJ=wG[1],wK=wI[3],wL=wI[2],wM=wH[2],wN=dm(tR[6],wK,wI[1]),wP=dm(tR[7],wJ[1],wN),wQ=function(wO){return dm(tR[3],wK,wO[1]);},wR=dm(t5[17],wQ,wL),wW=t5[1],wV=wJ[4],wX=function(wT){function wU(wS){return c$(t5[4],[0,wT,wS[2]]);}return dm(t5[14],wU,wR);},wY=kF(tV[14],wX,wV,wW),wZ=dm(v1,dm(v2,dm(v1,wJ[2],wL),wR),wY);return [0,[0,wP,wZ,wJ[3],wI[4]],wM];}}return k(aK);}function z8(xE){return v6(0,xE)[1];}function y7(xI,yX,xF){var xG=xF[2],xH=xF[1],xN=xI[2];function yW(xJ,yV){var xL=uj(xJ);function xM(xK){return dm(tR[12],xK[1],xL);}var xO=dm(t5[17],xM,xN),yd=[0,t5[1],0];function ye(xT,yc){function xQ(xP){if(xP){var xS=xQ(xP[2]),xR=xP[1],xU=xT[1],xV=ui(xR),xW=dm(tR[8],xU,xV),xX=c$(tR[2],xW);if(xX){var x0=tR[1],x1=function(xY){var xZ=tP(xY,xJ);return c$(tR[4],xZ);},x2=kF(tR[14],x1,xU,x0),x3=dm(tR[12],x2,xH);if(x3){var x8=xT[2],x9=function(x4){var x6=x4[1];function x7(x5){return caml_string_equal(x6,x5[1]);}return dm(tY[16],x7,xG);},x_=dm(tY[15],x9,x8),x$=1;}else{var ya=x3,x$=0;}}else{var ya=xX,x$=0;}if(!x$)var x_=ya;var yb=x_?[0,dm(t5[4],xT,xR),[0,xR,0]]:[0,xR,0];return cO(yb,xS);}return xP;}return xQ(yc);}var yj=kF(t5[14],ye,xO,yd),yU=dm(d4,function(yf){var yh=ui(yf);return sA(function(yi,yg){return dm(tR[3],yg,xH)?dm(tR[3],yi,yh):1;},xJ);},yj);return dF(function(yT,yR){var yP=c$(tU[5],xJ);function yQ(yk,yO){var yM=tU[1];function yN(yo,yL){var yl=yk[1],yp=s9(function(ym,yn){return 1-dm(tR[3],ym,yl);},yo),yq=c$(tU[5],yp),yI=yk[2];function yJ(yr,yE){var yw=yr[2],yt=yr[1],yv=tR[1];function yx(ys){return caml_string_equal(yt,ys[1])?c$(tR[4],ys[2]):function(yu){return yu;};}var yy=kF(tY[14],yx,xG,yv),yG=tU[1];function yH(yA){var yC=tU[1];function yD(yz){var yB=r7(yw,yA,yz);return c$(tU[4],yB);}var yF=kF(tU[14],yD,yE,yC);return c$(tU[7],yF);}return kF(tR[14],yH,yy,yG);}var yK=kF(tY[14],yJ,yI,yq);return dm(tU[7],yK,yL);}return kF(tU[14],yN,yO,yM);}var yS=kF(t5[14],yQ,yR,yP);return dm(tU[7],yS,yT);},yV,yU);}var yY=kF(tU[14],yW,yX[2],tU[1]),y0=dm(tR[9],yX[1],xH);function y1(yZ){return c$(tR[4],yZ[2]);}return [0,kF(tY[14],y1,xG,y0),yY];}function AQ(y5,y2){var y3=y2[4],y4=y2[3],y6=y5[3],y9=y5[4],y8=y5[2],zb=c$(y7,[0,y2[1],y2[2],y4,y3]),zc=jl([0,function(y$,y_){var za=dm(tR[10],y$[1],y_[1]);return 0===za?dm(tU[10],y$[2],y_[2]):za;}]);function zW(zd){var zh=c$(zc[20],zd);return dm(oW,aL,d7(aM,db(function(ze){var zf=c$(tU[20],ze[2]),zg=dm(oW,a2,d7(a3,db(c$(ul,cW),zf)));return kF(oW,aN,uk(ze[1]),zg);},zh)));}function zy(zx,zl,zi){var zj=zi[2],zk=zi[1];if(dm(zc[3],[0,zk,zj],zl))return zl;var zn=dm(zc[4],[0,zk,zj],zl),zo=function(zm){return dm(tR[12],zm[1],zk);},zZ=dm(t5[17],zo,y8),z0=function(zp,zz){var zq=dm(zb,[0,zk,zj],zp),zr=zq[2],zs=zq[1];if(dm(tV[3],zs,y9)){var zv=function(zt){var zu=uj(zt);return dm(tV[3],zu,y3);},zw=dm(tU[16],zv,zr);}else var zw=1;if(zw)return zy([0,zp,zx],zz,[0,zs,zr]);var zA=dm(zc[4],[0,zs,zr],zz),zB=dD([0,zp,zx]),zC=0,zD=zB;for(;;){if(zD){var zF=zD[2],zE=zC+1|0,zC=zE,zD=zF;continue;}var zG=t1[1],zH=0,zI=zB;for(;;){if(zI){var zJ=zI[2],zT=zH+1|0,zS=zI[1][2],zU=function(zH,zJ){return function(zK,zR){var zL=zH+1|0,zM=zJ,zN=zK[2];for(;;){if(zM){if(!dm(tR[3],zN,zM[1][1])){var zQ=zM[2],zP=zL+1|0,zL=zP,zM=zQ;continue;}var zO=zL;}else var zO=zC;return dm(t1[4],[0,zH,zK[1],zO],zR);}};}(zH,zJ),zV=kF(tY[14],zU,zS,zG),zG=zV,zH=zT,zI=zJ;continue;}var zX=vU([0,0,zG,zC]),zY=zW(zA);throw [0,um,c$(zc[19],zA),zY,zX];}}};return kF(t5[14],z0,zZ,zn);}try {var z1=rV(y4,y6),z2=c$(tU[5],z1),z3=[0,c$(tR[5],y6),z2],z4=zy(0,zc[1],z3),z5=zW(z4),z6=[0,c$(zc[19],z4),z5,0];}catch(z7){if(z7[1]===um)return [0,z7[2],z7[3],[0,z7[4]]];throw z7;}return z6;}function AR(z$,Af,Ae,z_,z9){var Aa=dm(z$,z_,z9),Ab=Aa[3],Ac=Aa[2],Ad=Aa[1];return Ab?[0,0,[0,[0,Ac,Ag(oW,aG,Af,Ae,Ad,ra(Ab[1]))],0]]:[0,1,[0,[0,Ac,Ah(oW,aF,Af,Ae,Ad)],0]];}function AS(Ap,AA,Ai){var Aj=rg(Ai),Ak=Aj[3],Al=Aj[2],Am=Aj[1],An=ra(Ak),Ao=ra(Al),Aq=c$(Ap,Ak),Ar=c$(Ap,Al);function Ay(As){return [0,1-As[1],As[2]];}function Az(Au,At){var Aw=cO(Au[2],At[2]),Av=Au[1],Ax=Av?At[1]:Av;return [0,Ax,Aw];}if(17064<=Am)if(3802040<=Am)if(3901498<=Am){var AB=Ay(Ah(AA,Ao,An,Ar,Aq)),AC=AB[2],AD=AB[1];if(AD)var AE=[0,AD,AC];else{var AF=Ay(Ah(AA,An,Ao,Aq,Ar)),AG=cO(AC,AF[2]),AE=[0,AF[1],AG];}var AH=AE;}else var AH=Ah(AA,Ao,An,Ar,Aq);else if(3553395<=Am)var AH=Ah(AA,An,Ao,Aq,Ar);else{var AI=Ay(Ah(AA,An,Ao,Aq,Ar)),AH=Az(Ah(AA,Ao,An,Ar,Aq),AI);}else if(15500===Am){var AJ=Ah(AA,An,Ao,Aq,Ar),AH=Az(Ah(AA,Ao,An,Ar,Aq),AJ);}else if(15949<=Am){var AK=Ah(AA,An,Ao,Aq,Ar),AH=Az(Ay(Ah(AA,Ao,An,Ar,Aq)),AK);}else{var AL=Ay(Ah(AA,An,Ao,Aq,Ar)),AH=Az(Ay(Ah(AA,Ao,An,Ar,Aq)),AL);}var AM=AH[1],AO=AH[2],AN=AM?aJ:aI,AP=17064<=Am?3802040<=Am?3901498<=Am?a_:a9:3553395<=Am?a8:a7:15500===Am?a4:15949<=Am?a6:a5;return [0,AM,Ag(oW,aH,Ao,AP,An,AN),AO];}var AT=dm(AS,z8,c$(AR,AQ)),Co=al.toString(),Cn={"border":ak.toString(),"background":al.toString()},Cm=aj.toString(),A5={"border":ai.toString(),"background":aj.toString(),"highlight":{"border":ak.toString(),"background":al.toString()}},Cl=ah.toString(),Ck={"border":ag.toString(),"background":ah.toString()},Cj=af.toString(),BO={"border":ae.toString(),"background":af.toString(),"highlight":{"border":ag.toString(),"background":ah.toString()}},Ci=ad.toString(),Ch={"border":ac.toString(),"background":ad.toString()},Cg=ab.toString(),A0={"border":aa.toString(),"background":ab.toString(),"highlight":{"border":ac.toString(),"background":ad.toString()}};function B9(AU){var AV=z8(e9(qU,1,q3,ep(AU))),AW=AV[3],AX=AV[1],AY=av.toString(),AZ=dm(oW,au,AW).toString(),A1=[0,{"id":dm(oW,at,AW).toString(),"label":AZ,"shape":AY,"color":A0,"fontSize":27},0],A9=27,A8=dm(tR[6],AW,AX);function A_(A2,A6){var A3=as.toString(),A4=dm(oW,ar,A2).toString(),A7=27;return [0,{"id":dm(oW,aq,A2).toString(),"label":A4,"shape":A3,"color":A5,"fontSize":27},A6];}var A$=kF(tR[14],A_,A8,A1),Ba=c$(tR[22],AX)+1|0;function Bq(Bc){var Bd=db(function(Bb){return Bb;},Bc);if(Bd){var Be=0,Bf=Bd,Bl=Bd[2],Bi=Bd[1];for(;;){if(Bf){var Bh=Bf[2],Bg=Be+1|0,Be=Bg,Bf=Bh;continue;}var Bj=caml_make_vect(Be,Bi),Bk=1,Bm=Bl;for(;;){if(Bm){var Bn=Bm[2];Bj[Bk+1]=Bm[1];var Bo=Bk+1|0,Bk=Bo,Bm=Bn;continue;}var Bp=Bj;break;}break;}}else var Bp=[0];return caml_js_from_array(Bp);}var BR=[0,Ba,A$,0],BQ=AV[2];function BS(Bt,Br){var Bs=Br[1],Bz=Br[3],By=Bt[1];function BA(Bv,Bx){var Bu=aw.toString(),Bw=cW(Bs).toString();return [0,{"from":cW(Bv).toString(),"to":Bw,"style":Bu},Bx];}var BB=kF(tR[14],BA,By,Bz),BI=Bt[2];function BJ(BC,BH){var BF=ay.toString(),BE=BC[1].toString(),BD=ax.toString(),BG=cW(BC[2]).toString();return [0,{"from":cW(Bs).toString(),"to":BG,"fontSize":BD,"label":BE,"style":BF},BH];}var BK=kF(tY[14],BJ,BI,BB),BM=Br[2],BL=ap.toString(),BN=dm(oW,ao,Bs-Ba|0).toString(),BP=25;return [0,Bs+1|0,[0,{"id":dm(oW,an,Bs).toString(),"label":BN,"shape":BL,"color":BO,"fontSize":25},BM],BK];}var BT=kF(t5[14],BS,BQ,BR),BU=dm(oW,az,dm(oW,a0,d7(a1,db(uk,c$(tV[20],AV[4]))))).toString(),BV=Bq(BT[3]);return [0,{"nodes":Bq(BT[2]),"edges":BV},BU];}function Dy(BX){function BY(BW){throw [0,un];}var BZ=o6(pm.getElementById(BX.toString()),BY),B0=p0(0,0,pm),B1=p1(pm),B2=p2(pm);B0.size=20;B0.value=am.toString();B1.id=cV(BX,aE).toString();B1.className=aD.toString();B2.className=aC.toString();B0.className=aB.toString();var B3=p4(pm);function B5(B4){return pj(BZ,B4);}o4(BZ.firstChild,B5);pi(BZ,B3);var B6=p5(pm),B7=p6(pm),B8=p6(pm);pi(BZ,B3);pi(B3,B6);pi(B6,B7);pi(B7,B0);pi(B6,B8);pi(B8,B1);pi(B8,B2);var Ca=dm(oW,aA,BX);function Ce(Cd){var B_=new MlWrappedString(B0.value);try {var B$=B9(B_);window.data=B$[1];caml_js_eval_string(Ca);var Cb=B2.innerHTML=B$[2];}catch(Cc){return 0;}return Cb;}Ce(0);return B0.onchange=pk(function(Cf){Ce(0);return o7;});}function Cy(Cq,Cs){function Cr(Cp){return pj(Cq,Cp);}o4(Cq.firstChild,Cr);return pi(Cq,Cs);}function Do(Ct,Cx,Cv){var Cu=pv(Ct,bD),Cw=0===Cv[1]?(Cu.width=15,window.nope):(Cu.width=20,window.ok);Cx.style.margin=J.toString();Cu.src=Cw;return Cy(Cx,Cu);}function Dp(Cz,CE,CJ,CG,CD,CF){var CA=p2(Cz),CB=pv(Cz,bA),CC=p7(Cz);CA.innerHTML=CD.toString();CB.className=M.toString();CA.style.margin=L.toString();Cy(CE,CB);pi(CB,CA);pi(CB,CC);var CO=CF[3],CP=d7(C,db(function(CH){var CI=CG?dm(oW,I,CH[1]):H;if(CJ&&CG){var CK=G,CL=1;}else var CL=0;if(!CL)var CK=F;var CN=cV(CK,CI),CM=CJ?dm(oW,E,CH[2]):D;return cV(CM,CN);},CO));function CU(CT,CS,CQ){try {var CR=CP.safeGet(CQ),CV=10===CR?CU(A,[0,CT,CS],CQ+1|0):(h.safeSet(0,CR),CU(cV(CT,h),CS,CQ+1|0));}catch(CW){if(CW[1]===b)return dD([0,CT,CS]);throw CW;}return CV;}var CZ=[0,K,CU(z,0,0)];return dE(function(CY){var CX=p3(Cz);CX.innerHTML=CY.toString();pi(CC,CX);return pi(CC,pv(Cz,bB));},CZ);}function Ea(C1){function C2(C0){throw [0,un];}var C3=[0,0],C4=[0,0],C6=o6(pm.getElementById(C1.toString()),C2),C5=p4(pm);pi(C6,C5);function Dq(C7){var C8=C4[1]<C7?1:0;if(C8){C3[1]=C3[1]+1|0;C4[1]=C4[1]+1|0;var C9=[0,0],C_=[0,W],C$=p0(0,0,pm),Da=p5(pm),Db=p6(pm),Dc=p6(pm),Dd=p6(pm),De=p6(pm),Df=pP(0,0,pm,bx);pi(C5,Da);pi(Da,Db);pi(Da,Dc);pi(Da,Dd);pi(Da,De);pi(Db,Df);pi(Dc,C$);Db.style.verticalAlign=V.toString();Dc.style.verticalAlign=U.toString();Dd.style.verticalAlign=T.toString();De.style.verticalAlign=S.toString();C$.size=50;C$.className=R.toString();C$.value=Q.toString();C$.onfocus=pk(function(Dh){C$.value=X.toString();C$.onfocus=pk(function(Dg){return o7;});return o7;});var Du=function(Dt){var Di=new MlWrappedString(C$.value);if(!caml_string_notequal(Di,Y)&&1<C3[1]){pj(C5,Da);C3[1]=C3[1]-1|0;var Dj=C7===C4[1]?1:0,Dk=Dj?(C4[1]=C4[1]-1|0,0):Dj;return Dk;}try {try {var Dl=c$(AT,Di),Dm=Dl;}catch(Dn){if(Dn[1]!==er)throw Dn;var Dm=B;}C_[1]=Dm;Do(pm,Dd,C_[1]);if(0<C9[1])Dp(pm,De,1,0,N,C_[1]);var Dr=Dq(C7+1|0);}catch(Ds){return 0;}return Dr;};C$.onchange=pk(function(Dv){Du(0);return o7;});Df.style.width=P.toString();Df.innerHTML=O.toString();var Dx=Df.onclick=pk(function(Dw){if(0===C9[1]){Df.innerHTML=Z.toString();C9[1]=1;}else{Df.innerHTML=$.toString();De.innerHTML=_.toString();C9[1]=0;}Du(0);return o7;});}else var Dx=C8;return Dx;}return Dq(1);}function Eg(DA){function DB(Dz){throw [0,un];}var DC=o6(pm.getElementById(DA.toString()),DB),DD=p0(0,0,pm),DE=p7(pm),DF=p1(pm),DG=p2(pm),DH=p7(pm),DI=p1(pm),DJ=p2(pm),DK=p2(pm);DD.size=50;DD.value=o.toString();DD.className=u.toString();DF.id=cV(DA,t).toString();DF.className=s.toString();DI.id=cV(DA,r).toString();DI.className=q.toString();var DL=p4(pm);function DN(DM){return pj(DC,DM);}o4(DC.firstChild,DN);pi(DC,DL);var DO=p5(pm),DP=p5(pm),DQ=p5(pm),DR=p6(pm),DS=p3(pm),DT=p6(pm),DU=p6(pm),DV=p6(pm);pi(DC,DL);pi(DL,DO);pi(DL,DP);pi(DL,DQ);pi(DO,DR);pi(DR,DD);pi(DR,DS);pi(DP,DT);pi(DP,DU);pi(DT,DE);pi(DT,DF);pi(DT,DG);pi(DU,DH);pi(DU,DI);pi(DU,DJ);pi(DQ,DV);pi(DV,DK);function D3(D0,DW){var DX=ra(DW),DY=B9(DX),DZ=DY[2];window.data=DY[1];caml_js_eval_string(kF(oW,v,DA,D0));return 1===D0?(DE.innerHTML=cV(x,DX).toString(),DG.innerHTML=DZ):(DH.innerHTML=cV(w,DX).toString(),DJ.innerHTML=DZ);}function D_(D9){var D1=new MlWrappedString(DD.value);try {var D2=rg(D1);D3(1,D2[2]);D3(2,D2[3]);try {var D4=c$(AT,D1),D5=D4;}catch(D6){if(D6[1]!==er)throw D6;var D5=p;}Do(pm,DS,D5);var D7=Dp(pm,DK,1,1,y,D5);}catch(D8){return 0;}return D7;}D_(0);return DD.onchange=pk(function(D$){D_(0);return o7;});}function Ef(Ec,Eb){try {var Ed=c$(Ec,Eb);}catch(Ee){if(Ee[1]===un)return 0;throw Ee;}return Ed;}pl.onload=pk(function(Eh){Ef(Dy,n);Ef(Eg,m);Ef(Ea,l);return o7;});cX(0);return;}());
