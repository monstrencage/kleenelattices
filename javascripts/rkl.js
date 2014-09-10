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
(function(){function o_(ET,EU,EV,EW,EX,EY,EZ){return ET.length==6?ET(EU,EV,EW,EX,EY,EZ):caml_call_gen(ET,[EU,EV,EW,EX,EY,EZ]);}function Au(EN,EO,EP,EQ,ER,ES){return EN.length==5?EN(EO,EP,EQ,ER,ES):caml_call_gen(EN,[EO,EP,EQ,ER,ES]);}function Av(EI,EJ,EK,EL,EM){return EI.length==4?EI(EJ,EK,EL,EM):caml_call_gen(EI,[EJ,EK,EL,EM]);}function kX(EE,EF,EG,EH){return EE.length==3?EE(EF,EG,EH):caml_call_gen(EE,[EF,EG,EH]);}function dz(EB,EC,ED){return EB.length==2?EB(EC,ED):caml_call_gen(EB,[EC,ED]);}function dl(Ez,EA){return Ez.length==1?Ez(EA):caml_call_gen(Ez,[EA]);}var a=[0,new MlString("Failure")],b=[0,new MlString("Invalid_argument")],c=[0,new MlString("Not_found")],d=[0,new MlString("Assert_failure")],e=[0,new MlString(""),0,0,-1],f=[0,new MlString(""),1,0,0],g=[0,new MlString("\0\0\xea\xff\xeb\xff\x02\0\x1e\0N\0\xf4\xff\xf5\xff\xf6\xff\xf7\xff\xf8\xff\xf9\xff\xfa\xffN\0\x99\0\xfd\xff\x0b\0\xca\0\xfe\xff\xa8\0\xfc\xff\x03\0 \0\xf3\xff\xf2\xff\xee\xff\xf1\xff\xed\xff\x01\0\xfd\xff\xfe\xff\xff\xff"),new MlString("\xff\xff\xff\xff\xff\xff\x10\0\x0f\0\x13\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x04\0\x15\0\xff\xff\x15\0\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString("\x01\0\0\0\0\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xff\xff\xff\xff\0\0\xff\xff\xff\xff\0\0\xff\xff\0\0\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\x1d\0\0\0\0\0\0\0"),new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x11\0\x0f\0\x1f\0\0\0\x11\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x11\0\0\0\0\0\0\0\0\0\0\0\b\0\0\0\x07\0\x06\0\f\0\x0b\0\x11\0\0\0\t\0\x10\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x12\0\0\0\x04\0\x05\0\x03\0\x1b\0\x18\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x1a\0\x19\0\x17\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x0e\0\n\0\x15\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\0\0\x16\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x11\0\0\0\0\0\0\0\x11\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x11\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x11\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x02\0\x1e\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x14\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"),new MlString("\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\0\0\x1c\0\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\xff\xff\0\0\0\0\0\0\x03\0\x15\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x16\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x05\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x05\0\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x0e\0\x0e\0\x0e\0\x0e\0\x0e\0\x0e\0\x0e\0\x0e\0\x0e\0\x0e\0\x11\0\xff\xff\xff\xff\xff\xff\x11\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x11\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x11\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\x1c\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x13\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString("")],h=new MlString(" ");caml_register_global(6,c);caml_register_global(5,[0,new MlString("Division_by_zero")]);caml_register_global(3,b);caml_register_global(2,a);var cR=new MlString("%d"),cQ=new MlString("true"),cP=new MlString("false"),cO=new MlString("Pervasives.do_at_exit"),cN=new MlString("Array.blit"),cM=new MlString("\\b"),cL=new MlString("\\t"),cK=new MlString("\\n"),cJ=new MlString("\\r"),cI=new MlString("\\\\"),cH=new MlString("\\'"),cG=new MlString(""),cF=new MlString("String.blit"),cE=new MlString("String.sub"),cD=new MlString(""),cC=new MlString("syntax error"),cB=new MlString("Parsing.YYexit"),cA=new MlString("Parsing.Parse_error"),cz=new MlString("Set.remove_min_elt"),cy=[0,0,0,0],cx=[0,0,0],cw=new MlString("Set.bal"),cv=new MlString("Set.bal"),cu=new MlString("Set.bal"),ct=new MlString("Set.bal"),cs=new MlString("Map.remove_min_elt"),cr=new MlString("Map.bal"),cq=new MlString("Map.bal"),cp=new MlString("Map.bal"),co=new MlString("Map.bal"),cn=new MlString("Buffer.add: cannot grow buffer"),cm=new MlString(""),cl=new MlString(""),ck=new MlString("%.12g"),cj=new MlString("\""),ci=new MlString("\""),ch=new MlString("'"),cg=new MlString("'"),cf=new MlString("nan"),ce=new MlString("neg_infinity"),cd=new MlString("infinity"),cc=new MlString("."),cb=new MlString("printf: bad positional specification (0)."),ca=new MlString("%_"),b$=[0,new MlString("printf.ml"),143,8],b_=new MlString("'"),b9=new MlString("Printf: premature end of format string '"),b8=new MlString("'"),b7=new MlString(" in format string '"),b6=new MlString(", at char number "),b5=new MlString("Printf: bad conversion %"),b4=new MlString("Sformat.index_of_int: negative argument "),b3=new MlString("\""),b2=new MlString(" name=\""),b1=new MlString("\""),b0=new MlString(" type=\""),bZ=new MlString("<"),bY=new MlString(">"),bX=new MlString(""),bW=new MlString("<input name=\"x\">"),bV=new MlString("input"),bU=new MlString("x"),bT=new MlString("code"),bS=new MlString("td"),bR=new MlString("tr"),bQ=new MlString("table"),bP=new MlString("img"),bO=new MlString("a"),bN=new MlString("br"),bM=new MlString("pre"),bL=new MlString("p"),bK=new MlString("div"),bJ=new MlString("button"),bI=new MlString("input"),bH=new MlString("unsupported operation"),bG=new MlString("parser"),bF=new MlString("unsupported operation"),bE=[0,0,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,0],bD=new MlString("\xff\xff\x02\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\0\0\0\0"),bC=new MlString("\x02\0\x03\0\x01\0\x02\0\x03\0\x03\0\x03\0\x02\0\x02\0\x03\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x02\0\x02\0"),bB=new MlString("\0\0\0\0\0\0\0\0\x02\0\0\0\0\0\0\0\x12\0\0\0\x03\0\0\0\0\0\b\0\x07\0\0\0\n\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\0\0\t\0\0\0\0\0\0\0\0\0"),bA=new MlString("\x03\0\x06\0\b\0\x17\0"),bz=new MlString("\x05\0\x01\xff\x01\xff\0\0\0\0\x01\xff\n\xff\x18\xff\0\0'\xff\0\0\x01\xff\x01\xff\0\0\0\0\x01\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x01\xff\0\x000\xff<\xff4\xff\n\xff"),by=new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x1d\0\x01\0\x0f\0\b\0"),bx=new MlString("\0\0\xfe\xff\0\0\0\0"),bw=new MlString("\x07\0\x04\0\x04\0\t\0\x11\0\x05\0\x01\0\x02\0\x01\0\x19\0\x1a\0\0\0\n\0\x1b\0\0\0\x05\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x1c\0\0\0\0\0\0\0\0\0\n\0\0\0\0\0\x06\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\x11\0\x12\0\x13\0\x14\0\x15\0\n\0\x16\0\0\0\x18\0\x0b\0\f\0\r\0\x0e\0\x0f\0\n\0\0\0\0\0\0\0\n\0\f\0\r\0\x0e\0\x0f\0\f\0\r\0\x0e\0\n\0\0\0\0\0\0\0\0\0\0\0\r\0\x0e\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x04\0\0\0\0\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\0\0\x04\0\x05\0\x05\0\0\0\0\0\0\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\0\0\x05\0\x06\0\x06\0\0\0\0\0\0\0\0\0\x06\0\x06\0\x06\0\x06\0\x06\0\x06\0\0\0\x06\0"),bv=new MlString("\x02\0\0\0\x01\x01\x05\0\0\0\x04\x01\x01\0\x02\0\0\0\x0b\0\f\0\xff\xff\x02\x01\x0f\0\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x17\0\xff\xff\xff\xff\xff\xff\xff\xff\x02\x01\xff\xff\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\x02\x01\x12\x01\xff\xff\x05\x01\x06\x01\x07\x01\b\x01\t\x01\n\x01\x02\x01\xff\xff\xff\xff\xff\xff\x02\x01\x07\x01\b\x01\t\x01\n\x01\x07\x01\b\x01\t\x01\x02\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\b\x01\t\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x05\x01\x06\x01\x07\x01\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\xff\xff\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01"),bu=new MlString("EOF\0NEWLINE\0LPAR\0RPAR\0PLUS\0DOT\0PSTAR\0STAR\0INTER\0EGAL\0LEQ\0GEQ\0LT\0GT\0IMCOMP\0DUNNO\0DIFF\0"),bt=new MlString("VAR\0POWER\0"),bs=new MlString("lexing error"),br=new MlString("\xc3\xb8"),bq=new MlString("\xce\xb5"),bp=new MlString("(%s | %s)"),bo=new MlString("(%s)+"),bn=new MlString("(%s)~"),bm=new MlString("%s.%s"),bl=new MlString("(%s & %s)"),bk=new MlString("=/="),bj=new MlString("<="),bi=new MlString(">="),bh=new MlString("<"),bg=new MlString(">"),bf=new MlString("<>"),be=new MlString("="),bd=new MlString(","),bc=new MlString("{%s}"),bb=new MlString(","),ba=new MlString("{%s}"),a$=new MlString(","),a_=new MlString("{%s}"),a9=new MlString("%d -> %s"),a8=new MlString(","),a7=new MlString("(%s)"),a6=new MlString("Tools.ContreExemple"),a5=new MlString("Tools.NotDefined"),a4=new MlString("get_expr : empty word"),a3=[0,new MlString("word.ml"),134,4],a2=new MlString("get_expr : stuck"),a1=new MlString("get_expr : stuck"),a0=[0,new MlString("word.ml"),84,15],aZ=new MlString("(%s,%s)"),aY=new MlString(",\n"),aX=new MlString("{%s}"),aW=new MlString("Petri.trad : unsupported operation"),aV=new MlString("OK"),aU=new MlString("Incorrect"),aT=new MlString("%s %s %s --------- %s"),aS=new MlString("Error : Failure(%s)"),aR=new MlString("No result."),aQ=new MlString("%s --------- Failed"),aP=new MlString("Error : parsing error"),aO=new MlString("No result."),aN=new MlString("%s --------- Failed"),aM=new MlString("%s <= %s -- false (%d pairs)\nWitness: %s"),aL=new MlString("%s <= %s -- true (%d pairs)"),aK=new MlString("_auto"),aJ=new MlString("auto"),aI=new MlString("center"),aH=new MlString("drawin"),aG=new MlString("new vis.Network(document.getElementById('%s_auto'),data, {})"),aF=new MlString("Final states : %s"),aE=new MlString("arrow"),aD=new MlString("25"),aC=new MlString("arrow-center"),aB=new MlString("circle"),aA=new MlString("%d"),az=new MlString("%d"),ay=new MlString("circle"),ax=new MlString("%d"),aw=new MlString("%d"),av=new MlString("box"),au=new MlString("   %d   "),at=new MlString("%d"),as=new MlString("(a|b)+.C & d | e.(a|b)"),ar=new MlString("#D2E5FF"),aq=new MlString("#2B7CE9"),ap=new MlString("#97C2FC"),ao=new MlString("#2B7CE9"),an=new MlString("#A1EC76"),am=new MlString("#41A906"),al=new MlString("#7BE141"),ak=new MlString("#41A906"),aj=new MlString("#D3BDF0"),ai=new MlString("#7C29F0"),ah=new MlString("#AD85E4"),ag=new MlString("#7C29F0"),af=new MlString("Show Details"),ae=new MlString(""),ad=new MlString("Hide Details"),ac=new MlString(""),ab=new MlString(""),aa=[0,0,new MlString(""),0],$=new MlString("top"),_=new MlString("top"),Z=new MlString("top"),Y=new MlString("top"),X=new MlString("solvein"),W=new MlString("enter equation here"),V=new MlString("100px"),U=new MlString("Show Details"),T=new MlString("Details:"),S=new MlString("output"),R=new MlString("0px"),Q=new MlString(""),P=new MlString("0px"),O=new MlString("%s"),N=new MlString(""),M=new MlString("\n"),L=new MlString(""),K=new MlString("%s"),J=new MlString(""),I=new MlString("\n\n"),H=[0,0,new MlString(""),0],G=new MlString(""),F=new MlString(""),E=new MlString("Error"),D=new MlString("Error"),C=new MlString("Error"),B=new MlString("Error"),A=new MlString("Error"),z=new MlString("Error"),y=new MlString("Results:"),x=new MlString("Automaton for : "),w=new MlString("Automaton for : "),v=new MlString("new vis.Network(document.getElementById('%s_auto%d'),data, {})"),u=new MlString("drawin"),t=new MlString("_auto1"),s=new MlString("auto"),r=new MlString("_auto2"),q=new MlString("auto"),p=[0,0,new MlString(""),0],o=new MlString("(a|b)+.C & d > d & a.b.C & (d|a)\n"),n=new MlString("draw"),m=new MlString("details"),l=new MlString("solve");function k(i){throw [0,a,i];}function cS(j){throw [0,b,j];}function c7(cT,cV){var cU=cT.getLen(),cW=cV.getLen(),cX=caml_create_string(cU+cW|0);caml_blit_string(cT,0,cX,0,cU);caml_blit_string(cV,0,cX,cU,cW);return cX;}function c8(cY){return caml_format_int(cR,cY);}function c0(cZ,c1){if(cZ){var c2=cZ[1];return [0,c2,c0(cZ[2],c1)];}return c1;}function c9(c6){var c3=caml_ml_out_channels_list(0);for(;;){if(c3){var c4=c3[2];try {}catch(c5){}var c3=c4;continue;}return 0;}}caml_register_named_value(cO,c9);function dd(da,c$,dc,db,c_){if(0<=c_&&0<=c$&&!((da.length-1-c_|0)<c$)&&0<=db&&!((dc.length-1-c_|0)<db))return caml_array_blit(da,c$,dc,db,c_);return cS(cN);}function dP(de){var df=de,dg=0;for(;;){if(df){var dh=df[2],di=[0,df[1],dg],df=dh,dg=di;continue;}return dg;}}function dn(dk,dj){if(dj){var dm=dj[2],dp=dl(dk,dj[1]);return [0,dp,dn(dk,dm)];}return 0;}function dQ(ds,dq){var dr=dq;for(;;){if(dr){var dt=dr[2];dl(ds,dr[1]);var dr=dt;continue;}return 0;}}function dR(dy,du,dw){var dv=du,dx=dw;for(;;){if(dx){var dA=dx[2],dB=dz(dy,dv,dx[1]),dv=dB,dx=dA;continue;}return dv;}}function dS(dE,dC){var dD=dC;for(;;){if(dD){var dF=dD[2],dG=0===caml_compare(dD[1],dE)?1:0;if(dG)return dG;var dD=dF;continue;}return 0;}}function ee(dN){return dl(function(dH,dJ){var dI=dH,dK=dJ;for(;;){if(dK){var dL=dK[2],dM=dK[1];if(dl(dN,dM)){var dO=[0,dM,dI],dI=dO,dK=dL;continue;}var dK=dL;continue;}return dP(dI);}},0);}function ed(dT,dV){var dU=caml_create_string(dT);caml_fill_string(dU,0,dT,dV);return dU;}function ef(dY,dW,dX){if(0<=dW&&0<=dX&&!((dY.getLen()-dX|0)<dW)){var dZ=caml_create_string(dX);caml_blit_string(dY,dW,dZ,0,dX);return dZ;}return cS(cE);}function eg(d2,d1,d4,d3,d0){if(0<=d0&&0<=d1&&!((d2.getLen()-d0|0)<d1)&&0<=d3&&!((d4.getLen()-d0|0)<d3))return caml_blit_string(d2,d1,d4,d3,d0);return cS(cF);}function eh(d$,d5){if(d5){var d6=d5[1],d7=[0,0],d8=[0,0],d_=d5[2];dQ(function(d9){d7[1]+=1;d8[1]=d8[1]+d9.getLen()|0;return 0;},d5);var ea=caml_create_string(d8[1]+caml_mul(d$.getLen(),d7[1]-1|0)|0);caml_blit_string(d6,0,ea,0,d6.getLen());var eb=[0,d6.getLen()];dQ(function(ec){caml_blit_string(d$,0,ea,eb[1],d$.getLen());eb[1]=eb[1]+d$.getLen()|0;caml_blit_string(ec,0,ea,eb[1],ec.getLen());eb[1]=eb[1]+ec.getLen()|0;return 0;},d_);return ea;}return cG;}var ei=caml_sys_const_word_size(0),ej=caml_mul(ei/8|0,(1<<(ei-10|0))-1|0)-1|0;function eF(em,el,ek){var en=caml_lex_engine(em,el,ek);if(0<=en){ek[11]=ek[12];var eo=ek[12];ek[12]=[0,eo[1],eo[2],eo[3],ek[4]+ek[6]|0];}return en;}function eG(ep){var ez=[0],ey=1,ex=0,ew=0,ev=0,eu=0,et=0,es=ep.getLen(),er=c7(ep,cD);return [0,function(eq){eq[9]=1;return 0;},er,es,et,eu,ev,ew,ex,ey,ez,f,f];}function eH(eE,eB,eA){var eC=eA-eB|0,eD=caml_create_string(eC);caml_blit_string(eE[2],eB,eD,0,eC);return eD;}var eI=[0,cB],eJ=[0,cA],eK=[0,caml_make_vect(100,0),caml_make_vect(100,0),caml_make_vect(100,e),caml_make_vect(100,e),100,0,0,0,e,e,0,0,0,0,0,0];function eT(eR){var eL=eK[5],eM=eL*2|0,eN=caml_make_vect(eM,0),eO=caml_make_vect(eM,0),eP=caml_make_vect(eM,e),eQ=caml_make_vect(eM,e);dd(eK[1],0,eN,0,eL);eK[1]=eN;dd(eK[2],0,eO,0,eL);eK[2]=eO;dd(eK[3],0,eP,0,eL);eK[3]=eP;dd(eK[4],0,eQ,0,eL);eK[4]=eQ;eK[5]=eM;return 0;}var fl=[0,function(eS){return 0;}];function fp(e5,e1,ff,e2){var e0=eK[11],eZ=eK[14],eY=eK[6],eX=eK[15],eW=eK[7],eV=eK[8],eU=eK[16];eK[6]=eK[14]+1|0;eK[7]=e1;eK[10]=e2[12];try {var e3=0,e4=0;for(;;)switch(caml_parse_engine(e5,eK,e3,e4)){case 1:throw [0,eJ];case 2:eT(0);var e7=0,e6=2,e3=e6,e4=e7;continue;case 3:eT(0);var e9=0,e8=3,e3=e8,e4=e9;continue;case 4:try {var e_=[0,4,dl(caml_array_get(e5[1],eK[13]),eK)],e$=e_;}catch(fa){if(fa[1]!==eJ)throw fa;var e$=[0,5,0];}var fc=e$[2],fb=e$[1],e3=fb,e4=fc;continue;case 5:dl(e5[14],cC);var fe=0,fd=5,e3=fd,e4=fe;continue;default:var fg=dl(ff,e2);eK[9]=e2[11];eK[10]=e2[12];var fh=1,e3=fh,e4=fg;continue;}}catch(fj){var fi=eK[7];eK[11]=e0;eK[14]=eZ;eK[6]=eY;eK[15]=eX;eK[7]=eW;eK[8]=eV;eK[16]=eU;if(fj[1]===eI)return fj[2];fl[1]=function(fk){return caml_obj_is_block(fk)?caml_array_get(e5[3],caml_obj_tag(fk))===fi?1:0:caml_array_get(e5[2],fk)===fi?1:0;};throw fj;}}function fq(fm,fn){return caml_array_get(fm[2],fm[11]-fn|0);}function jE(fo){return 0;}function jD(fY){function fF(fr){return fr?fr[4]:0;}function fH(fs,fx,fu){var ft=fs?fs[4]:0,fv=fu?fu[4]:0,fw=fv<=ft?ft+1|0:fv+1|0;return [0,fs,fx,fu,fw];}function f2(fy,fI,fA){var fz=fy?fy[4]:0,fB=fA?fA[4]:0;if((fB+2|0)<fz){if(fy){var fC=fy[3],fD=fy[2],fE=fy[1],fG=fF(fC);if(fG<=fF(fE))return fH(fE,fD,fH(fC,fI,fA));if(fC){var fK=fC[2],fJ=fC[1],fL=fH(fC[3],fI,fA);return fH(fH(fE,fD,fJ),fK,fL);}return cS(cw);}return cS(cv);}if((fz+2|0)<fB){if(fA){var fM=fA[3],fN=fA[2],fO=fA[1],fP=fF(fO);if(fP<=fF(fM))return fH(fH(fy,fI,fO),fN,fM);if(fO){var fR=fO[2],fQ=fO[1],fS=fH(fO[3],fN,fM);return fH(fH(fy,fI,fQ),fR,fS);}return cS(cu);}return cS(ct);}var fT=fB<=fz?fz+1|0:fB+1|0;return [0,fy,fI,fA,fT];}function f1(fZ,fU){if(fU){var fV=fU[3],fW=fU[2],fX=fU[1],f0=dz(fY[1],fZ,fW);return 0===f0?fU:0<=f0?f2(fX,fW,f1(fZ,fV)):f2(f1(fZ,fX),fW,fV);}return [0,0,fZ,0,1];}function f9(f3){return [0,0,f3,0,1];}function f5(f6,f4){if(f4){var f8=f4[3],f7=f4[2];return f2(f5(f6,f4[1]),f7,f8);}return f9(f6);}function f$(ga,f_){if(f_){var gc=f_[2],gb=f_[1];return f2(gb,gc,f$(ga,f_[3]));}return f9(ga);}function gh(gd,gi,ge){if(gd){if(ge){var gf=ge[4],gg=gd[4],gn=ge[3],go=ge[2],gm=ge[1],gj=gd[3],gk=gd[2],gl=gd[1];return (gf+2|0)<gg?f2(gl,gk,gh(gj,gi,ge)):(gg+2|0)<gf?f2(gh(gd,gi,gm),go,gn):fH(gd,gi,ge);}return f$(gi,gd);}return f5(gi,ge);}function gD(gp){var gq=gp;for(;;){if(gq){var gr=gq[1];if(gr){var gq=gr;continue;}return gq[2];}throw [0,c];}}function gS(gs){var gt=gs;for(;;){if(gt){var gu=gt[3],gv=gt[2];if(gu){var gt=gu;continue;}return gv;}throw [0,c];}}function gy(gw){if(gw){var gx=gw[1];if(gx){var gA=gw[3],gz=gw[2];return f2(gy(gx),gz,gA);}return gw[3];}return cS(cz);}function gT(gB,gC){if(gB){if(gC){var gE=gy(gC);return gh(gB,gD(gC),gE);}return gB;}return gC;}function gL(gJ,gF){if(gF){var gG=gF[3],gH=gF[2],gI=gF[1],gK=dz(fY[1],gJ,gH);if(0===gK)return [0,gI,1,gG];if(0<=gK){var gM=gL(gJ,gG),gO=gM[3],gN=gM[2];return [0,gh(gI,gH,gM[1]),gN,gO];}var gP=gL(gJ,gI),gR=gP[2],gQ=gP[1];return [0,gQ,gR,gh(gP[3],gH,gG)];}return cy;}var jy=0;function jz(gU){return gU?0:1;}function jA(gX,gV){var gW=gV;for(;;){if(gW){var g0=gW[3],gZ=gW[1],gY=dz(fY[1],gX,gW[2]),g1=0===gY?1:0;if(g1)return g1;var g2=0<=gY?g0:gZ,gW=g2;continue;}return 0;}}function g$(g7,g3){if(g3){var g4=g3[3],g5=g3[2],g6=g3[1],g8=dz(fY[1],g7,g5);if(0===g8){if(g6)if(g4){var g9=gy(g4),g_=f2(g6,gD(g4),g9);}else var g_=g6;else var g_=g4;return g_;}return 0<=g8?f2(g6,g5,g$(g7,g4)):f2(g$(g7,g6),g5,g4);}return 0;}function hh(ha,hb){if(ha){if(hb){var hc=hb[4],hd=hb[2],he=ha[4],hf=ha[2],hn=hb[3],hp=hb[1],hi=ha[3],hk=ha[1];if(hc<=he){if(1===hc)return f1(hd,ha);var hg=gL(hf,hb),hj=hg[1],hl=hh(hi,hg[3]);return gh(hh(hk,hj),hf,hl);}if(1===he)return f1(hf,hb);var hm=gL(hd,ha),ho=hm[1],hq=hh(hm[3],hn);return gh(hh(ho,hp),hd,hq);}return ha;}return hb;}function hy(hr,hs){if(hr){if(hs){var ht=hr[3],hu=hr[2],hv=hr[1],hw=gL(hu,hs),hx=hw[1];if(0===hw[2]){var hz=hy(ht,hw[3]);return gT(hy(hv,hx),hz);}var hA=hy(ht,hw[3]);return gh(hy(hv,hx),hu,hA);}return 0;}return 0;}function hI(hB,hC){if(hB){if(hC){var hD=hB[3],hE=hB[2],hF=hB[1],hG=gL(hE,hC),hH=hG[1];if(0===hG[2]){var hJ=hI(hD,hG[3]);return gh(hI(hF,hH),hE,hJ);}var hK=hI(hD,hG[3]);return gT(hI(hF,hH),hK);}return hB;}return 0;}function hR(hL,hN){var hM=hL,hO=hN;for(;;){if(hM){var hP=hM[1],hQ=[0,hM[2],hM[3],hO],hM=hP,hO=hQ;continue;}return hO;}}function h5(hT,hS){var hU=hR(hS,0),hV=hR(hT,0),hW=hU;for(;;){if(hV)if(hW){var h1=hW[3],h0=hW[2],hZ=hV[3],hY=hV[2],hX=dz(fY[1],hV[1],hW[1]);if(0===hX){var h2=hR(h0,h1),h3=hR(hY,hZ),hV=h3,hW=h2;continue;}var h4=hX;}else var h4=1;else var h4=hW?-1:0;return h4;}}function jB(h7,h6){return 0===h5(h7,h6)?1:0;}function ih(h8,h_){var h9=h8,h$=h_;for(;;){if(h9){if(h$){var ia=h$[3],ib=h$[1],ic=h9[3],id=h9[2],ie=h9[1],ig=dz(fY[1],id,h$[2]);if(0===ig){var ii=ih(ie,ib);if(ii){var h9=ic,h$=ia;continue;}return ii;}if(0<=ig){var ij=ih([0,0,id,ic,0],ia);if(ij){var h9=ie;continue;}return ij;}var ik=ih([0,ie,id,0,0],ib);if(ik){var h9=ic;continue;}return ik;}return 0;}return 1;}}function io(ip,il){var im=il;for(;;){if(im){var ir=im[3],iq=im[2];io(ip,im[1]);dl(ip,iq);var im=ir;continue;}return 0;}}function iw(ix,is,iu){var it=is,iv=iu;for(;;){if(it){var iz=it[3],iy=it[2],iA=dz(ix,iy,iw(ix,it[1],iv)),it=iz,iv=iA;continue;}return iv;}}function iH(iD,iB){var iC=iB;for(;;){if(iC){var iG=iC[3],iF=iC[1],iE=dl(iD,iC[2]);if(iE){var iI=iH(iD,iF);if(iI){var iC=iG;continue;}var iJ=iI;}else var iJ=iE;return iJ;}return 1;}}function iR(iM,iK){var iL=iK;for(;;){if(iL){var iP=iL[3],iO=iL[1],iN=dl(iM,iL[2]);if(iN)var iQ=iN;else{var iS=iR(iM,iO);if(!iS){var iL=iP;continue;}var iQ=iS;}return iQ;}return 0;}}function iV(iW,iT){if(iT){var iU=iT[2],iY=iT[3],iX=iV(iW,iT[1]),i0=dl(iW,iU),iZ=iV(iW,iY);return i0?gh(iX,iU,iZ):gT(iX,iZ);}return 0;}function i3(i4,i1){if(i1){var i2=i1[2],i6=i1[3],i5=i3(i4,i1[1]),i7=i5[2],i8=i5[1],i_=dl(i4,i2),i9=i3(i4,i6),i$=i9[2],ja=i9[1];if(i_){var jb=gT(i7,i$);return [0,gh(i8,i2,ja),jb];}var jc=gh(i7,i2,i$);return [0,gT(i8,ja),jc];}return cx;}function je(jd){if(jd){var jf=jd[1],jg=je(jd[3]);return (je(jf)+1|0)+jg|0;}return 0;}function jl(jh,jj){var ji=jh,jk=jj;for(;;){if(jk){var jn=jk[2],jm=jk[1],jo=[0,jn,jl(ji,jk[3])],ji=jo,jk=jm;continue;}return ji;}}function jC(jp){return jl(0,jp);}return [0,jy,jz,jA,f1,f9,g$,hh,hy,hI,h5,jB,ih,io,iw,iH,iR,iV,i3,je,jC,gD,gS,gD,gL,function(jt,jq){var jr=jq;for(;;){if(jr){var js=jr[2],jw=jr[3],jv=jr[1],ju=dz(fY[1],jt,js);if(0===ju)return js;var jx=0<=ju?jw:jv,jr=jx;continue;}throw [0,c];}}];}function jW(jF){var jG=1<=jF?jF:1,jH=ej<jG?ej:jG,jI=caml_create_string(jH);return [0,jI,0,jH,jI];}function jX(jJ){return ef(jJ[1],0,jJ[2]);}function jQ(jK,jM){var jL=[0,jK[3]];for(;;){if(jL[1]<(jK[2]+jM|0)){jL[1]=2*jL[1]|0;continue;}if(ej<jL[1])if((jK[2]+jM|0)<=ej)jL[1]=ej;else k(cn);var jN=caml_create_string(jL[1]);eg(jK[1],0,jN,0,jK[2]);jK[1]=jN;jK[3]=jL[1];return 0;}}function jY(jO,jR){var jP=jO[2];if(jO[3]<=jP)jQ(jO,1);jO[1].safeSet(jP,jR);jO[2]=jP+1|0;return 0;}function jZ(jU,jS){var jT=jS.getLen(),jV=jU[2]+jT|0;if(jU[3]<jV)jQ(jU,jT);eg(jS,0,jU[1],jU[2],jT);jU[2]=jV;return 0;}function j3(j0){return 0<=j0?j0:k(c7(b4,c8(j0)));}function j4(j1,j2){return j3(j1+j2|0);}var j5=dl(j4,1);function ka(j6){return ef(j6,0,j6.getLen());}function kc(j7,j8,j_){var j9=c7(b7,c7(j7,b8)),j$=c7(b6,c7(c8(j8),j9));return cS(c7(b5,c7(ed(1,j_),j$)));}function k3(kb,ke,kd){return kc(ka(kb),ke,kd);}function k4(kf){return cS(c7(b9,c7(ka(kf),b_)));}function kz(kg,ko,kq,ks){function kn(kh){if((kg.safeGet(kh)-48|0)<0||9<(kg.safeGet(kh)-48|0))return kh;var ki=kh+1|0;for(;;){var kj=kg.safeGet(ki);if(48<=kj){if(!(58<=kj)){var kl=ki+1|0,ki=kl;continue;}var kk=0;}else if(36===kj){var km=ki+1|0,kk=1;}else var kk=0;if(!kk)var km=kh;return km;}}var kp=kn(ko+1|0),kr=jW((kq-kp|0)+10|0);jY(kr,37);var kt=kp,ku=dP(ks);for(;;){if(kt<=kq){var kv=kg.safeGet(kt);if(42===kv){if(ku){var kw=ku[2];jZ(kr,c8(ku[1]));var kx=kn(kt+1|0),kt=kx,ku=kw;continue;}throw [0,d,b$];}jY(kr,kv);var ky=kt+1|0,kt=ky;continue;}return jX(kr);}}function ms(kF,kD,kC,kB,kA){var kE=kz(kD,kC,kB,kA);if(78!==kF&&110!==kF)return kE;kE.safeSet(kE.getLen()-1|0,117);return kE;}function k5(kM,kW,k1,kG,k0){var kH=kG.getLen();function kY(kI,kV){var kJ=40===kI?41:125;function kU(kK){var kL=kK;for(;;){if(kH<=kL)return dl(kM,kG);if(37===kG.safeGet(kL)){var kN=kL+1|0;if(kH<=kN)var kO=dl(kM,kG);else{var kP=kG.safeGet(kN),kQ=kP-40|0;if(kQ<0||1<kQ){var kR=kQ-83|0;if(kR<0||2<kR)var kS=1;else switch(kR){case 1:var kS=1;break;case 2:var kT=1,kS=0;break;default:var kT=0,kS=0;}if(kS){var kO=kU(kN+1|0),kT=2;}}else var kT=0===kQ?0:1;switch(kT){case 1:var kO=kP===kJ?kN+1|0:kX(kW,kG,kV,kP);break;case 2:break;default:var kO=kU(kY(kP,kN+1|0)+1|0);}}return kO;}var kZ=kL+1|0,kL=kZ;continue;}}return kU(kV);}return kY(k1,k0);}function ls(k2){return kX(k5,k4,k3,k2);}function lI(k6,lf,lp){var k7=k6.getLen()-1|0;function lq(k8){var k9=k8;a:for(;;){if(k9<k7){if(37===k6.safeGet(k9)){var k_=0,k$=k9+1|0;for(;;){if(k7<k$)var la=k4(k6);else{var lb=k6.safeGet(k$);if(58<=lb){if(95===lb){var ld=k$+1|0,lc=1,k_=lc,k$=ld;continue;}}else if(32<=lb)switch(lb-32|0){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 0:case 3:case 11:case 13:var le=k$+1|0,k$=le;continue;case 10:var lg=kX(lf,k_,k$,105),k$=lg;continue;default:var lh=k$+1|0,k$=lh;continue;}var li=k$;c:for(;;){if(k7<li)var lj=k4(k6);else{var lk=k6.safeGet(li);if(126<=lk)var ll=0;else switch(lk){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var lj=kX(lf,k_,li,105),ll=1;break;case 69:case 70:case 71:case 101:case 102:case 103:var lj=kX(lf,k_,li,102),ll=1;break;case 33:case 37:case 44:case 64:var lj=li+1|0,ll=1;break;case 83:case 91:case 115:var lj=kX(lf,k_,li,115),ll=1;break;case 97:case 114:case 116:var lj=kX(lf,k_,li,lk),ll=1;break;case 76:case 108:case 110:var lm=li+1|0;if(k7<lm){var lj=kX(lf,k_,li,105),ll=1;}else{var ln=k6.safeGet(lm)-88|0;if(ln<0||32<ln)var lo=1;else switch(ln){case 0:case 12:case 17:case 23:case 29:case 32:var lj=dz(lp,kX(lf,k_,li,lk),105),ll=1,lo=0;break;default:var lo=1;}if(lo){var lj=kX(lf,k_,li,105),ll=1;}}break;case 67:case 99:var lj=kX(lf,k_,li,99),ll=1;break;case 66:case 98:var lj=kX(lf,k_,li,66),ll=1;break;case 41:case 125:var lj=kX(lf,k_,li,lk),ll=1;break;case 40:var lj=lq(kX(lf,k_,li,lk)),ll=1;break;case 123:var lr=kX(lf,k_,li,lk),lt=kX(ls,lk,k6,lr),lu=lr;for(;;){if(lu<(lt-2|0)){var lv=dz(lp,lu,k6.safeGet(lu)),lu=lv;continue;}var lw=lt-1|0,li=lw;continue c;}default:var ll=0;}if(!ll)var lj=k3(k6,li,lk);}var la=lj;break;}}var k9=la;continue a;}}var lx=k9+1|0,k9=lx;continue;}return k9;}}lq(0);return 0;}function nH(lJ){var ly=[0,0,0,0];function lH(lD,lE,lz){var lA=41!==lz?1:0,lB=lA?125!==lz?1:0:lA;if(lB){var lC=97===lz?2:1;if(114===lz)ly[3]=ly[3]+1|0;if(lD)ly[2]=ly[2]+lC|0;else ly[1]=ly[1]+lC|0;}return lE+1|0;}lI(lJ,lH,function(lF,lG){return lF+1|0;});return ly[1];}function mo(lK,lN,lL){var lM=lK.safeGet(lL);if((lM-48|0)<0||9<(lM-48|0))return dz(lN,0,lL);var lO=lM-48|0,lP=lL+1|0;for(;;){var lQ=lK.safeGet(lP);if(48<=lQ){if(!(58<=lQ)){var lT=lP+1|0,lS=(10*lO|0)+(lQ-48|0)|0,lO=lS,lP=lT;continue;}var lR=0;}else if(36===lQ)if(0===lO){var lU=k(cb),lR=1;}else{var lU=dz(lN,[0,j3(lO-1|0)],lP+1|0),lR=1;}else var lR=0;if(!lR)var lU=dz(lN,0,lL);return lU;}}function mj(lV,lW){return lV?lW:dl(j5,lW);}function l_(lX,lY){return lX?lX[1]:lY;}function o9(n2,l0,oc,l3,nM,oi,lZ){var l1=dl(l0,lZ);function n3(l2){return dz(l3,l1,l2);}function nL(l8,oh,l4,mb){var l7=l4.getLen();function nI(n$,l5){var l6=l5;for(;;){if(l7<=l6)return dl(l8,l1);var l9=l4.safeGet(l6);if(37===l9){var mf=function(ma,l$){return caml_array_get(mb,l_(ma,l$));},ml=function(mn,mg,mi,mc){var md=mc;for(;;){var me=l4.safeGet(md)-32|0;if(!(me<0||25<me))switch(me){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 10:return mo(l4,function(mh,mm){var mk=[0,mf(mh,mg),mi];return ml(mn,mj(mh,mg),mk,mm);},md+1|0);default:var mp=md+1|0,md=mp;continue;}var mq=l4.safeGet(md);if(124<=mq)var mr=0;else switch(mq){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var mt=mf(mn,mg),mu=caml_format_int(ms(mq,l4,l6,md,mi),mt),mw=mv(mj(mn,mg),mu,md+1|0),mr=1;break;case 69:case 71:case 101:case 102:case 103:var mx=mf(mn,mg),my=caml_format_float(kz(l4,l6,md,mi),mx),mw=mv(mj(mn,mg),my,md+1|0),mr=1;break;case 76:case 108:case 110:var mz=l4.safeGet(md+1|0)-88|0;if(mz<0||32<mz)var mA=1;else switch(mz){case 0:case 12:case 17:case 23:case 29:case 32:var mB=md+1|0,mC=mq-108|0;if(mC<0||2<mC)var mD=0;else{switch(mC){case 1:var mD=0,mE=0;break;case 2:var mF=mf(mn,mg),mG=caml_format_int(kz(l4,l6,mB,mi),mF),mE=1;break;default:var mH=mf(mn,mg),mG=caml_format_int(kz(l4,l6,mB,mi),mH),mE=1;}if(mE){var mI=mG,mD=1;}}if(!mD){var mJ=mf(mn,mg),mI=caml_int64_format(kz(l4,l6,mB,mi),mJ);}var mw=mv(mj(mn,mg),mI,mB+1|0),mr=1,mA=0;break;default:var mA=1;}if(mA){var mK=mf(mn,mg),mL=caml_format_int(ms(110,l4,l6,md,mi),mK),mw=mv(mj(mn,mg),mL,md+1|0),mr=1;}break;case 37:case 64:var mw=mv(mg,ed(1,mq),md+1|0),mr=1;break;case 83:case 115:var mM=mf(mn,mg);if(115===mq)var mN=mM;else{var mO=[0,0],mP=0,mQ=mM.getLen()-1|0;if(!(mQ<mP)){var mR=mP;for(;;){var mS=mM.safeGet(mR),mT=14<=mS?34===mS?1:92===mS?1:0:11<=mS?13<=mS?1:0:8<=mS?1:0,mU=mT?2:caml_is_printable(mS)?1:4;mO[1]=mO[1]+mU|0;var mV=mR+1|0;if(mQ!==mR){var mR=mV;continue;}break;}}if(mO[1]===mM.getLen())var mW=mM;else{var mX=caml_create_string(mO[1]);mO[1]=0;var mY=0,mZ=mM.getLen()-1|0;if(!(mZ<mY)){var m0=mY;for(;;){var m1=mM.safeGet(m0),m2=m1-34|0;if(m2<0||58<m2)if(-20<=m2)var m3=1;else{switch(m2+34|0){case 8:mX.safeSet(mO[1],92);mO[1]+=1;mX.safeSet(mO[1],98);var m4=1;break;case 9:mX.safeSet(mO[1],92);mO[1]+=1;mX.safeSet(mO[1],116);var m4=1;break;case 10:mX.safeSet(mO[1],92);mO[1]+=1;mX.safeSet(mO[1],110);var m4=1;break;case 13:mX.safeSet(mO[1],92);mO[1]+=1;mX.safeSet(mO[1],114);var m4=1;break;default:var m3=1,m4=0;}if(m4)var m3=0;}else var m3=(m2-1|0)<0||56<(m2-1|0)?(mX.safeSet(mO[1],92),mO[1]+=1,mX.safeSet(mO[1],m1),0):1;if(m3)if(caml_is_printable(m1))mX.safeSet(mO[1],m1);else{mX.safeSet(mO[1],92);mO[1]+=1;mX.safeSet(mO[1],48+(m1/100|0)|0);mO[1]+=1;mX.safeSet(mO[1],48+((m1/10|0)%10|0)|0);mO[1]+=1;mX.safeSet(mO[1],48+(m1%10|0)|0);}mO[1]+=1;var m5=m0+1|0;if(mZ!==m0){var m0=m5;continue;}break;}}var mW=mX;}var mN=c7(ci,c7(mW,cj));}if(md===(l6+1|0))var m6=mN;else{var m7=kz(l4,l6,md,mi);try {var m8=0,m9=1;for(;;){if(m7.getLen()<=m9)var m_=[0,0,m8];else{var m$=m7.safeGet(m9);if(49<=m$)if(58<=m$)var na=0;else{var m_=[0,caml_int_of_string(ef(m7,m9,(m7.getLen()-m9|0)-1|0)),m8],na=1;}else{if(45===m$){var nc=m9+1|0,nb=1,m8=nb,m9=nc;continue;}var na=0;}if(!na){var nd=m9+1|0,m9=nd;continue;}}var ne=m_;break;}}catch(nf){if(nf[1]!==a)throw nf;var ne=kc(m7,0,115);}var ng=ne[1],nh=mN.getLen(),ni=0,nm=ne[2],nl=32;if(ng===nh&&0===ni){var nj=mN,nk=1;}else var nk=0;if(!nk)if(ng<=nh)var nj=ef(mN,ni,nh);else{var nn=ed(ng,nl);if(nm)eg(mN,ni,nn,0,nh);else eg(mN,ni,nn,ng-nh|0,nh);var nj=nn;}var m6=nj;}var mw=mv(mj(mn,mg),m6,md+1|0),mr=1;break;case 67:case 99:var no=mf(mn,mg);if(99===mq)var np=ed(1,no);else{if(39===no)var nq=cH;else if(92===no)var nq=cI;else{if(14<=no)var nr=0;else switch(no){case 8:var nq=cM,nr=1;break;case 9:var nq=cL,nr=1;break;case 10:var nq=cK,nr=1;break;case 13:var nq=cJ,nr=1;break;default:var nr=0;}if(!nr)if(caml_is_printable(no)){var ns=caml_create_string(1);ns.safeSet(0,no);var nq=ns;}else{var nt=caml_create_string(4);nt.safeSet(0,92);nt.safeSet(1,48+(no/100|0)|0);nt.safeSet(2,48+((no/10|0)%10|0)|0);nt.safeSet(3,48+(no%10|0)|0);var nq=nt;}}var np=c7(cg,c7(nq,ch));}var mw=mv(mj(mn,mg),np,md+1|0),mr=1;break;case 66:case 98:var nv=md+1|0,nu=mf(mn,mg)?cQ:cP,mw=mv(mj(mn,mg),nu,nv),mr=1;break;case 40:case 123:var nw=mf(mn,mg),nx=kX(ls,mq,l4,md+1|0);if(123===mq){var ny=jW(nw.getLen()),nC=function(nA,nz){jY(ny,nz);return nA+1|0;};lI(nw,function(nB,nE,nD){if(nB)jZ(ny,ca);else jY(ny,37);return nC(nE,nD);},nC);var nF=jX(ny),mw=mv(mj(mn,mg),nF,nx),mr=1;}else{var nG=mj(mn,mg),nJ=j4(nH(nw),nG),mw=nL(function(nK){return nI(nJ,nx);},nG,nw,mb),mr=1;}break;case 33:dl(nM,l1);var mw=nI(mg,md+1|0),mr=1;break;case 41:var mw=mv(mg,cm,md+1|0),mr=1;break;case 44:var mw=mv(mg,cl,md+1|0),mr=1;break;case 70:var nN=mf(mn,mg);if(0===mi)var nO=ck;else{var nP=kz(l4,l6,md,mi);if(70===mq)nP.safeSet(nP.getLen()-1|0,103);var nO=nP;}var nQ=caml_classify_float(nN);if(3===nQ)var nR=nN<0?ce:cd;else if(4<=nQ)var nR=cf;else{var nS=caml_format_float(nO,nN),nT=0,nU=nS.getLen();for(;;){if(nU<=nT)var nV=c7(nS,cc);else{var nW=nS.safeGet(nT)-46|0,nX=nW<0||23<nW?55===nW?1:0:(nW-1|0)<0||21<(nW-1|0)?1:0;if(!nX){var nY=nT+1|0,nT=nY;continue;}var nV=nS;}var nR=nV;break;}}var mw=mv(mj(mn,mg),nR,md+1|0),mr=1;break;case 91:var mw=k3(l4,md,mq),mr=1;break;case 97:var nZ=mf(mn,mg),n0=dl(j5,l_(mn,mg)),n1=mf(0,n0),n5=md+1|0,n4=mj(mn,n0);if(n2)n3(dz(nZ,0,n1));else dz(nZ,l1,n1);var mw=nI(n4,n5),mr=1;break;case 114:var mw=k3(l4,md,mq),mr=1;break;case 116:var n6=mf(mn,mg),n8=md+1|0,n7=mj(mn,mg);if(n2)n3(dl(n6,0));else dl(n6,l1);var mw=nI(n7,n8),mr=1;break;default:var mr=0;}if(!mr)var mw=k3(l4,md,mq);return mw;}},ob=l6+1|0,n_=0;return mo(l4,function(oa,n9){return ml(oa,n$,n_,n9);},ob);}dz(oc,l1,l9);var od=l6+1|0,l6=od;continue;}}function mv(og,oe,of){n3(oe);return nI(og,of);}return nI(oh,0);}var oj=dz(nL,oi,j3(0)),ok=nH(lZ);if(ok<0||6<ok){var ox=function(ol,or){if(ok<=ol){var om=caml_make_vect(ok,0),op=function(on,oo){return caml_array_set(om,(ok-on|0)-1|0,oo);},oq=0,os=or;for(;;){if(os){var ot=os[2],ou=os[1];if(ot){op(oq,ou);var ov=oq+1|0,oq=ov,os=ot;continue;}op(oq,ou);}return dz(oj,lZ,om);}}return function(ow){return ox(ol+1|0,[0,ow,or]);};},oy=ox(0,0);}else switch(ok){case 1:var oy=function(oA){var oz=caml_make_vect(1,0);caml_array_set(oz,0,oA);return dz(oj,lZ,oz);};break;case 2:var oy=function(oC,oD){var oB=caml_make_vect(2,0);caml_array_set(oB,0,oC);caml_array_set(oB,1,oD);return dz(oj,lZ,oB);};break;case 3:var oy=function(oF,oG,oH){var oE=caml_make_vect(3,0);caml_array_set(oE,0,oF);caml_array_set(oE,1,oG);caml_array_set(oE,2,oH);return dz(oj,lZ,oE);};break;case 4:var oy=function(oJ,oK,oL,oM){var oI=caml_make_vect(4,0);caml_array_set(oI,0,oJ);caml_array_set(oI,1,oK);caml_array_set(oI,2,oL);caml_array_set(oI,3,oM);return dz(oj,lZ,oI);};break;case 5:var oy=function(oO,oP,oQ,oR,oS){var oN=caml_make_vect(5,0);caml_array_set(oN,0,oO);caml_array_set(oN,1,oP);caml_array_set(oN,2,oQ);caml_array_set(oN,3,oR);caml_array_set(oN,4,oS);return dz(oj,lZ,oN);};break;case 6:var oy=function(oU,oV,oW,oX,oY,oZ){var oT=caml_make_vect(6,0);caml_array_set(oT,0,oU);caml_array_set(oT,1,oV);caml_array_set(oT,2,oW);caml_array_set(oT,3,oX);caml_array_set(oT,4,oY);caml_array_set(oT,5,oZ);return dz(oj,lZ,oT);};break;default:var oy=dz(oj,lZ,[0]);}return oy;}function o8(o0){return jW(2*o0.getLen()|0);}function o5(o3,o1){var o2=jX(o1);o1[2]=0;return dl(o3,o2);}function pb(o4){var o7=dl(o5,o4);return o_(o9,1,o8,jY,jZ,function(o6){return 0;},o7);}function pc(pa){return dz(pb,function(o$){return o$;},pa);}var pd=[0,0];32===ei;var pe=[];caml_update_dummy(pe,[0,pe,pe]);var pf=null,pl=undefined;function pk(pg,ph){return pg==pf?0:dl(ph,pg);}function pm(pi,pj){return pi==pf?dl(pj,0):pi;}var pn=false,po=Array;function pq(pp){return pp instanceof po?0:[0,new MlWrappedString(pp.toString())];}pd[1]=[0,pq,pd[1]];function pA(pr,ps){pr.appendChild(ps);return 0;}function pB(pt,pu){pt.removeChild(pu);return 0;}function pC(pw){return caml_js_wrap_callback(function(pv){if(pv){var px=dl(pw,pv);if(!(px|0))pv.preventDefault();return px;}var py=event,pz=dl(pw,py);if(!(pz|0))py.returnValue=pz;return pz;});}var pD=this,pE=pD.document;function pM(pF,pG){return pF?dl(pG,pF[1]):0;}function pJ(pI,pH){return pI.createElement(pH.toString());}function pN(pL,pK){return pJ(pL,pK);}var pO=[0,785140586];function p7(pP,pQ,pS,pR){for(;;){if(0===pP&&0===pQ)return pJ(pS,pR);var pT=pO[1];if(785140586===pT){try {var pU=pE.createElement(bW.toString()),pV=bV.toString(),pW=pU.tagName.toLowerCase()===pV?1:0,pX=pW?pU.name===bU.toString()?1:0:pW,pY=pX;}catch(p0){var pY=0;}var pZ=pY?982028505:-1003883683;pO[1]=pZ;continue;}if(982028505<=pT){var p1=new po();p1.push(bZ.toString(),pR.toString());pM(pP,function(p2){p1.push(b0.toString(),caml_js_html_escape(p2),b1.toString());return 0;});pM(pQ,function(p3){p1.push(b2.toString(),caml_js_html_escape(p3),b3.toString());return 0;});p1.push(bY.toString());return pS.createElement(p1.join(bX.toString()));}var p4=pJ(pS,pR);pM(pP,function(p5){return p4.type=p5;});pM(pQ,function(p6){return p4.name=p6;});return p4;}}function qg(p_,p9,p8){return p7(p_,p9,p8,bI);}function qh(p$){return pN(p$,bK);}function qi(qa){return pN(qa,bL);}function qj(qb){return pN(qb,bO);}function qk(qc){return pN(qc,bQ);}function ql(qd){return pN(qd,bR);}function qm(qe){return pN(qe,bS);}function qn(qf){return pJ(qf,bT);}this.HTMLElement===pl;function qq(qp,qo){return 0===qo?k(bH):1===qo?qp:[0,748545537,[0,qp,qq(qp,qo-1|0)]];}var qS=bE.slice(),qR=[0,257,258,0],qQ=303;function qT(qr){throw [0,eI,fq(qr,0)];}function qU(qs){throw [0,eI,fq(qs,0)];}function qV(qt){return 3901498;}function qW(qu){return -941236332;}function qX(qv){return 15949;}function qY(qw){return 17064;}function qZ(qx){return 3553395;}function q0(qy){return 3802040;}function q1(qz){return 15500;}function q2(qA){return fq(qA,1);}function q3(qB){return [0,926224370,fq(qB,1)];}function q4(qC){return k(bF);}function q5(qD){var qE=fq(qD,2);return [0,974443759,[0,qE,fq(qD,0)]];}function q6(qF){var qG=fq(qF,2);return [0,-783405316,[0,qG,fq(qF,0)]];}function q7(qH){var qI=fq(qH,2);return [0,748545537,[0,qI,fq(qH,0)]];}function q8(qJ){var qK=fq(qJ,1);return qq(qK,fq(qJ,0));}function q9(qL){return [0,4298439,fq(qL,0)];}function q_(qM){var qN=fq(qM,2),qO=fq(qM,1);return [0,qO,qN,fq(qM,0)];}var q$=[0,[0,function(qP){return k(bG);},q_,q9,q8,q7,q6,q5,q4,q3,q2,q1,q0,qZ,qY,qX,qW,qV,qU,qT],qS,qR,bD,bC,bB,bA,bz,by,bx,qQ,bw,bv,jE,bu,bt];function rf(rb){var ra=0;for(;;){var rc=eF(g,ra,rb);if(rc<0||21<rc){dl(rb[1],rb);var ra=rc;continue;}switch(rc){case 1:var re=rd(rb);break;case 2:var re=1;break;case 3:var re=[1,caml_int_of_string(eH(rb,rb[5]+1|0,rb[6]-1|0))];break;case 4:var re=[0,eH(rb,rb[5],rb[6])];break;case 5:var re=7;break;case 6:var re=6;break;case 7:var re=4;break;case 8:var re=5;break;case 9:var re=8;break;case 10:var re=2;break;case 11:var re=3;break;case 12:var re=15;break;case 13:var re=16;break;case 14:var re=10;break;case 15:var re=12;break;case 16:var re=13;break;case 17:var re=14;break;case 18:var re=11;break;case 19:var re=9;break;case 20:var re=0;break;case 21:var re=k(c7(bs,ed(1,rb[2].safeGet(rb[5]))));break;default:var re=rf(rb);}return re;}}function rd(rh){var rg=28;for(;;){var ri=eF(g,rg,rh);if(ri<0||2<ri){dl(rh[1],rh);var rg=ri;continue;}switch(ri){case 1:var rj=0;break;case 2:var rj=rd(rh);break;default:var rj=1;}return rj;}}function ru(rk){return fp(q$,2,rf,eG(rk));}function ro(rl){if(typeof rl==="number")return 1003109192<=rl?br:bq;var rm=rl[1];if(748545537<=rm){if(926224370<=rm){if(974443759<=rm){var rn=rl[2],rp=ro(rn[2]);return kX(pc,bp,ro(rn[1]),rp);}return dz(pc,bo,ro(rl[2]));}if(748545556<=rm)return dz(pc,bn,ro(rl[2]));var rq=rl[2],rr=ro(rq[2]);return kX(pc,bm,ro(rq[1]),rr);}if(4298439<=rm)return rl[2];var rs=rl[2],rt=ro(rs[2]);return kX(pc,bl,ro(rs[1]),rt);}var rx=[0,function(rw,rv){return caml_compare(rw,rv);}];function rz(ry){return ry?ry[5]:0;}function rS(rA,rG,rF,rC){var rB=rz(rA),rD=rz(rC),rE=rD<=rB?rB+1|0:rD+1|0;return [0,rA,rG,rF,rC,rE];}function r9(rI,rH){return [0,0,rI,rH,0,1];}function r_(rJ,rU,rT,rL){var rK=rJ?rJ[5]:0,rM=rL?rL[5]:0;if((rM+2|0)<rK){if(rJ){var rN=rJ[4],rO=rJ[3],rP=rJ[2],rQ=rJ[1],rR=rz(rN);if(rR<=rz(rQ))return rS(rQ,rP,rO,rS(rN,rU,rT,rL));if(rN){var rX=rN[3],rW=rN[2],rV=rN[1],rY=rS(rN[4],rU,rT,rL);return rS(rS(rQ,rP,rO,rV),rW,rX,rY);}return cS(cr);}return cS(cq);}if((rK+2|0)<rM){if(rL){var rZ=rL[4],r0=rL[3],r1=rL[2],r2=rL[1],r3=rz(r2);if(r3<=rz(rZ))return rS(rS(rJ,rU,rT,r2),r1,r0,rZ);if(r2){var r6=r2[3],r5=r2[2],r4=r2[1],r7=rS(r2[4],r1,r0,rZ);return rS(rS(rJ,rU,rT,r4),r5,r6,r7);}return cS(cp);}return cS(co);}var r8=rM<=rK?rK+1|0:rM+1|0;return [0,rJ,rU,rT,rL,r8];}var r$=0;function sj(sf,si,sa){if(sa){var sb=sa[4],sc=sa[3],sd=sa[2],se=sa[1],sh=sa[5],sg=dz(rx[1],sf,sd);return 0===sg?[0,se,sf,si,sb,sh]:0<=sg?r_(se,sd,sc,sj(sf,si,sb)):r_(sj(sf,si,se),sd,sc,sb);}return [0,0,sf,si,0,1];}function t3(sm,sk){var sl=sk;for(;;){if(sl){var sq=sl[4],sp=sl[3],so=sl[1],sn=dz(rx[1],sm,sl[2]);if(0===sn)return sp;var sr=0<=sn?sq:so,sl=sr;continue;}throw [0,c];}}function su(ss){if(ss){var st=ss[1];if(st){var sx=ss[4],sw=ss[3],sv=ss[2];return r_(su(st),sv,sw,sx);}return ss[4];}return cS(cs);}function sC(sD,sy,sA){var sz=sy,sB=sA;for(;;){if(sz){var sG=sz[4],sF=sz[3],sE=sz[2],sH=kX(sD,sE,sF,sC(sD,sz[1],sB)),sz=sG,sB=sH;continue;}return sB;}}function sO(sK,sI){var sJ=sI;for(;;){if(sJ){var sN=sJ[4],sM=sJ[1],sL=dz(sK,sJ[2],sJ[3]);if(sL){var sP=sO(sK,sM);if(sP){var sJ=sN;continue;}var sQ=sP;}else var sQ=sL;return sQ;}return 1;}}function sS(sU,sT,sR){if(sR){var sX=sR[4],sW=sR[3],sV=sR[2];return r_(sS(sU,sT,sR[1]),sV,sW,sX);}return r9(sU,sT);}function sZ(s1,s0,sY){if(sY){var s4=sY[3],s3=sY[2],s2=sY[1];return r_(s2,s3,s4,sZ(s1,s0,sY[4]));}return r9(s1,s0);}function s9(s5,s$,s_,s6){if(s5){if(s6){var s7=s6[5],s8=s5[5],tf=s6[4],tg=s6[3],th=s6[2],te=s6[1],ta=s5[4],tb=s5[3],tc=s5[2],td=s5[1];return (s7+2|0)<s8?r_(td,tc,tb,s9(ta,s$,s_,s6)):(s8+2|0)<s7?r_(s9(s5,s$,s_,te),th,tg,tf):rS(s5,s$,s_,s6);}return sZ(s$,s_,s5);}return sS(s$,s_,s6);}function tl(tm,ti){if(ti){var tj=ti[3],tk=ti[2],to=ti[4],tn=tl(tm,ti[1]),tq=dz(tm,tk,tj),tp=tl(tm,to);if(tq)return s9(tn,tk,tj,tp);if(tn)if(tp){var tr=tp;for(;;){if(!tr)throw [0,c];var ts=tr[1];if(ts){var tr=ts;continue;}var tu=tr[3],tt=tr[2],tv=s9(tn,tt,tu,su(tp));break;}}else var tv=tn;else var tv=tp;return tv;}return 0;}function tC(tw,ty){var tx=tw,tz=ty;for(;;){if(tx){var tA=tx[1],tB=[0,tx[2],tx[3],tx[4],tz],tx=tA,tz=tB;continue;}return tz;}}function t4(tP,tE,tD){var tF=tC(tD,0),tG=tC(tE,0),tH=tF;for(;;){if(tG)if(tH){var tO=tH[4],tN=tH[3],tM=tH[2],tL=tG[4],tK=tG[3],tJ=tG[2],tI=dz(rx[1],tG[1],tH[1]);if(0===tI){var tQ=dz(tP,tJ,tM);if(0===tQ){var tR=tC(tN,tO),tS=tC(tK,tL),tG=tS,tH=tR;continue;}var tT=tQ;}else var tT=tI;}else var tT=1;else var tT=tH?-1:0;return tT;}}function tY(tU,tW){var tV=tU,tX=tW;for(;;){if(tX){var t1=tX[3],t0=tX[2],tZ=tX[1],t2=[0,[0,t0,t1],tY(tV,tX[4])],tV=t2,tX=tZ;continue;}return tV;}}var t5=jD(rx),t8=jD([0,dl(t4,function(t7,t6){return caml_compare(t7,t6);})]),t9=jD([0,t5[10]]),ua=jD([0,function(t$,t_){return caml_compare(t$,t_);}]),ud=jD([0,function(uc,ub){return caml_compare(uc,ub);}]),uh=jD([0,function(uf,ue){var ug=dz(t5[10],uf[1],ue[1]);return 0===ug?dz(ua[10],uf[2],ue[2]):ug;}]);function uw(ul){var uj=t5[1];function uk(ui){return dl(t5[7],ui[1]);}return kX(uh[14],uk,ul,uj);}function ux(up){var uo=t5[1];return sC(function(um,un){return dl(t5[4],um);},up,uo);}function uz(us,uq){var uu=tY(0,uq);return dz(pc,a7,eh(a8,dn(function(ur){var ut=dl(us,ur[2]);return kX(pc,a9,ur[1],ut);},uu)));}function uy(uv){return dz(pc,a_,eh(a$,dn(c8,dl(t5[20],uv))));}var uA=[0,a6],uB=[0,a5];function v4(uC){return [0,-783405316,[0,uC[1],uC[2]]];}function wc(uD){return [0,748545537,[0,uD[1],uD[2]]];}function uY(uF,uE){var uJ=t5[1];try {var uG=t3(uF,uE),uH=uG;}catch(uI){if(uI[1]!==c)throw uI;var uH=uJ;}return uH;}function v8(uK){var uL=uK[3],uM=uK[2],uN=uK[1],uR=t5[1];function uS(uO,uP){var uQ=dz(t5[4],uO[3],uP);return dz(t5[4],uO[1],uQ);}var uU=kX(ud[14],uS,uM,uR);function uV(uT){return dz(sj,uT,dl(t5[5],uT));}var u1=kX(t5[14],uV,uU,r$);function u2(uW,uZ){var uX=uW[1],u0=uY(uX,uZ);return sj(uX,dz(t5[4],uW[3],u0),uZ);}var u3=kX(ud[14],u2,uM,u1);a:for(;;){var vc=sC(function(u3){return function(vb,u$,va){function u_(u4,u9){var u7=uY(u4,u3);function u8(u6,u5){return dz(t5[4],u6,u5);}return kX(t5[14],u8,u7,u9);}return sj(vb,kX(t5[14],u_,u$,u$),va);};}(u3),u3,r$),vd=t5[11],ve=tC(u3,0),vf=tC(vc,0),vg=ve;for(;;){if(vf)if(vg){var vm=vg[4],vl=vg[3],vk=vg[2],vj=vf[4],vi=vf[3],vh=vf[2],vn=0===dz(rx[1],vf[1],vg[1])?1:0;if(vn){var vo=dz(vd,vh,vk);if(vo){var vp=tC(vl,vm),vq=tC(vi,vj),vf=vq,vg=vp;continue;}var vr=vo;}else var vr=vn;var vs=vr;}else var vs=0;else var vs=vg?0:1;if(vs){if(uN===uL)return k(a4);var vu=function(vt){return vt[1]===uN?1:0;},vv=dz(ud[17],vu,uM),vw=dl(ud[20],vv);if(vw){var vx=vw[2],vy=vw[1],vz=vy[3],vA=vy[2];if(vx){var vE=uY(vz,u3),vH=dR(function(vD,vB){var vC=uY(vB[3],u3);return dz(t5[8],vD,vC);},vE,vx),vI=function(vG){var vF=uY(uL,u3);return 1-dz(t5[3],vG,vF);},vJ=dz(t5[17],vI,vH);if(dl(t5[2],vJ)){var vK=0,vL=0,vM=[0,[0,uN,vA,vz],vx];for(;;){if(vM){var vN=vM[2],vO=vM[1],vP=vO[3],vQ=uY(vP,u3),vR=uY(vz,u3),vS=dz(t5[8],vR,vQ);if(vz===vP&&dl(t5[2],vS))throw [0,d,a0];var vV=function(vU){var vT=uY(uL,u3);return 1-dz(t5[3],vU,vT);};if(dz(t5[16],vV,vS)){var vW=[0,vO,vK],vK=vW,vM=vN;continue;}var vX=[0,vO,vL],vL=vX,vM=vN;continue;}var vY=dP(vL),vZ=dP(vK);if(0===vY)throw [0,d,a3];if(0===vZ){if(vY){var v0=vY[2],v1=vY[1][2];if(v0){var v5=[0,4298439,v1];return dR(function(v3,v2){return v4([0,v3,[0,4298439,v2[2]]]);},v5,v0);}return [0,4298439,v1];}return k(a2);}var v7=function(v6){return 1-dS(v6,vY);},v_=v8([0,uN,dz(ud[17],v7,uM),uL]),v$=function(v9){return 1-dS(v9,vZ);};return v4([0,v8([0,uN,dz(ud[17],v$,uM),uL]),v_]);}}var wa=dl(t5[23],vJ),wb=v8([0,wa,uM,uL]);return wc([0,v8([0,uN,uM,wa]),wb]);}return vz===uL?[0,4298439,vA]:wc([0,[0,4298439,vA],v8([0,vz,uM,uL])]);}return k(a1);}var u3=vc;continue a;}}}var wd=uh[7],we=uh[9];function wi(wj,wf){if(typeof wf!=="number"){var wg=wf[1];if(!(748545537<=wg)){if(4298439<=wg){var xc=dl(t5[5],wj),xd=dz(t5[4],wj+1|0,xc),xe=dl(ua[5],[0,wf[2],wj+1|0]),xf=[0,dl(t5[5],wj),xe],xg=dl(uh[5],xf),xh=dl(t5[5],wj+1|0);return [0,[0,xd,xg,wj,dl(t9[5],xh)],wj+2|0];}var xi=wf[2],xj=wi(wj,xi[1]),xk=wi(xj[2],xi[2]),xl=xk[1],xm=xj[1],xn=xl[3],xo=xl[2],xp=xm[3],xq=xm[2],xs=xk[2],xr=xl[4],xt=dz(t5[6],xn,xl[1]),xu=dz(t5[7],xm[1],xt),xA=t9[1],xz=xm[4],xB=function(xw){function xy(xv){var xx=dz(t5[7],xw,xv);return dl(t9[4],xx);}return dz(t9[14],xy,xr);},xD=kX(t9[14],xB,xz,xA),xE=function(xC){return dz(t5[3],xp,xC[1]);},xF=dz(uh[17],xE,xq),xH=function(xG){return dz(t5[3],xn,xG[1]);},xI=dz(uh[17],xH,xo),xP=uh[1],xQ=function(xJ){var xL=xJ[2];function xO(xK){var xM=dz(ua[7],xL,xK[2]),xN=[0,dl(t5[5],xp),xM];return dl(uh[4],xN);}return dz(uh[14],xO,xI);},xR=kX(uh[14],xQ,xF,xP);return [0,[0,xu,dz(wd,dz(we,dz(we,dz(wd,xq,xo),xI),xF),xR),xp,xD],xs];}if(926224370<=wg){if(974443759<=wg){var wh=wf[2],wk=wi(wj,wh[1]),wl=wi(wk[2],wh[2]),wm=wl[1],wn=wk[1],wo=wm[3],wp=wm[2],wq=wn[3],wr=wl[2],ws=dz(t5[6],wo,wm[1]),wt=dz(t5[7],wn[1],ws),wv=dz(t9[7],wn[4],wm[4]),ww=function(wu){return dz(t5[3],wo,wu[1]);},wx=dz(uh[17],ww,wp),wB=uh[1],wC=function(wy){var wz=wy[2],wA=[0,dl(t5[5],wq),wz];return dl(uh[4],wA);},wD=kX(uh[14],wC,wx,wB);return [0,[0,wt,dz(wd,dz(we,dz(wd,wn[2],wp),wx),wD),wq,wv],wr];}var wE=wi(wj,wf[2]),wF=wE[1],wG=wF[3],wH=wF[4],wI=wF[2],wK=wE[2],wL=function(wJ){return dz(t5[3],wG,wJ[1]);},wM=dz(uh[17],wL,wI),wQ=uh[1],wR=function(wO){function wP(wN){return dl(uh[4],[0,wO,wN[2]]);}return dz(uh[14],wP,wM);},wS=dz(wd,wI,kX(t9[14],wR,wH,wQ));return [0,[0,wF[1],wS,wG,wH],wK];}if(!(748545556<=wg)){var wT=wf[2],wU=wi(wj,wT[1]),wV=wi(wU[2],wT[2]),wW=wV[1],wX=wU[1],wY=wW[3],wZ=wW[2],w0=wV[2],w1=dz(t5[6],wY,wW[1]),w3=dz(t5[7],wX[1],w1),w4=function(w2){return dz(t5[3],wY,w2[1]);},w5=dz(uh[17],w4,wZ),w_=uh[1],w9=wX[4],w$=function(w7){function w8(w6){return dl(uh[4],[0,w7,w6[2]]);}return dz(uh[14],w8,w5);},xa=kX(t9[14],w$,w9,w_),xb=dz(wd,dz(we,dz(wd,wX[2],wZ),w5),xa);return [0,[0,w3,xb,wX[3],wW[4]],w0];}}return k(aW);}function Ak(xS){return wi(0,xS)[1];}function zj(xW,y$,xT){var xU=xT[2],xV=xT[1],x1=xW[2];function y_(xX,y9){var xZ=ux(xX);function x0(xY){return dz(t5[12],xY[1],xZ);}var x2=dz(uh[17],x0,x1),yr=[0,uh[1],0];function ys(x7,yq){function x4(x3){if(x3){var x6=x4(x3[2]),x5=x3[1],x8=x7[1],x9=uw(x5),x_=dz(t5[8],x8,x9),x$=dl(t5[2],x_);if(x$){var yc=t5[1],yd=function(ya){var yb=t3(ya,xX);return dl(t5[4],yb);},ye=kX(t5[14],yd,x8,yc),yf=dz(t5[12],ye,xV);if(yf){var yk=x7[2],yl=function(yg){var yi=yg[1];function yj(yh){return caml_string_equal(yi,yh[1]);}return dz(ua[16],yj,xU);},ym=dz(ua[15],yl,yk),yn=1;}else{var yo=yf,yn=0;}}else{var yo=x$,yn=0;}if(!yn)var ym=yo;var yp=ym?[0,dz(uh[4],x7,x5),[0,x5,0]]:[0,x5,0];return c0(yp,x6);}return x3;}return x4(yq);}var yx=kX(uh[14],ys,x2,yr),y8=dz(ee,function(yt){var yv=uw(yt);return sO(function(yw,yu){return dz(t5[3],yu,xV)?dz(t5[3],yw,yv):1;},xX);},yx);return dR(function(y7,y5){var y3=dl(t8[5],xX);function y4(yy,y2){var y0=t8[1];function y1(yC,yZ){var yz=yy[1],yD=tl(function(yA,yB){return 1-dz(t5[3],yA,yz);},yC),yE=dl(t8[5],yD),yW=yy[2];function yX(yF,yS){var yK=yF[2],yH=yF[1],yJ=t5[1];function yL(yG){return caml_string_equal(yH,yG[1])?dl(t5[4],yG[2]):function(yI){return yI;};}var yM=kX(ua[14],yL,xU,yJ),yU=t8[1];function yV(yO){var yQ=t8[1];function yR(yN){var yP=sj(yK,yO,yN);return dl(t8[4],yP);}var yT=kX(t8[14],yR,yS,yQ);return dl(t8[7],yT);}return kX(t5[14],yV,yM,yU);}var yY=kX(ua[14],yX,yW,yE);return dz(t8[7],yY,yZ);}return kX(t8[14],y1,y2,y0);}var y6=kX(uh[14],y4,y5,y3);return dz(t8[7],y6,y7);},y9,y8);}var za=kX(t8[14],y_,y$[2],t8[1]),zc=dz(t5[9],y$[1],xV);function zd(zb){return dl(t5[4],zb[2]);}return [0,kX(ua[14],zd,xU,zc),za];}function A8(zh,ze){var zf=ze[4],zg=ze[3],zi=zh[3],zl=zh[4],zk=zh[2],zp=dl(zj,[0,ze[1],ze[2],zg,zf]),zq=jD([0,function(zn,zm){var zo=dz(t5[10],zn[1],zm[1]);return 0===zo?dz(t8[10],zn[2],zm[2]):zo;}]);function z_(zr){var zv=dl(zq[20],zr);return dz(pc,aX,eh(aY,dn(function(zs){var zt=dl(t8[20],zs[2]),zu=dz(pc,bc,eh(bd,dn(dl(uz,c8),zt)));return kX(pc,aZ,uy(zs[1]),zu);},zv)));}function zM(zL,zz,zw){var zx=zw[2],zy=zw[1];if(dz(zq[3],[0,zy,zx],zz))return zz;var zB=dz(zq[4],[0,zy,zx],zz),zC=function(zA){return dz(t5[12],zA[1],zy);},Ab=dz(uh[17],zC,zk),Ac=function(zD,zN){var zE=dz(zp,[0,zy,zx],zD),zF=zE[2],zG=zE[1];if(dz(t9[3],zG,zl)){var zJ=function(zH){var zI=ux(zH);return dz(t9[3],zI,zf);},zK=dz(t8[16],zJ,zF);}else var zK=1;if(zK)return zM([0,zD,zL],zN,[0,zG,zF]);var zO=dz(zq[4],[0,zG,zF],zN),zP=dP([0,zD,zL]),zQ=0,zR=zP;for(;;){if(zR){var zT=zR[2],zS=zQ+1|0,zQ=zS,zR=zT;continue;}var zU=ud[1],zV=0,zW=zP;for(;;){if(zW){var zX=zW[2],z7=zV+1|0,z6=zW[1][2],z8=function(zV,zX){return function(zY,z5){var zZ=zV+1|0,z0=zX,z1=zY[2];for(;;){if(z0){if(!dz(t5[3],z1,z0[1][1])){var z4=z0[2],z3=zZ+1|0,zZ=z3,z0=z4;continue;}var z2=zZ;}else var z2=zQ;return dz(ud[4],[0,zV,zY[1],z2],z5);}};}(zV,zX),z9=kX(ua[14],z8,z6,zU),zU=z9,zV=z7,zW=zX;continue;}var z$=v8([0,0,zU,zQ]),Aa=z_(zO);throw [0,uA,dl(zq[19],zO),Aa,z$];}}};return kX(uh[14],Ac,Ab,zB);}try {var Ad=r9(zg,zi),Ae=dl(t8[5],Ad),Af=[0,dl(t5[5],zi),Ae],Ag=zM(0,zq[1],Af),Ah=z_(Ag),Ai=[0,dl(zq[19],Ag),Ah,0];}catch(Aj){if(Aj[1]===uA)return [0,Aj[2],Aj[3],[0,Aj[4]]];throw Aj;}return Ai;}function A9(An,At,As,Am,Al){var Ao=dz(An,Am,Al),Ap=Ao[3],Aq=Ao[2],Ar=Ao[1];return Ap?[0,0,[0,[0,Aq,Au(pc,aM,At,As,Ar,ro(Ap[1]))],0]]:[0,1,[0,[0,Aq,Av(pc,aL,At,As,Ar)],0]];}function A_(AD,AO,Aw){try {var Ax=ru(Aw),Ay=Ax[3],Az=Ax[2],AA=Ax[1],AB=ro(Ay),AC=ro(Az),AE=dl(AD,Ay),AF=dl(AD,Az),AM=function(AG){return [0,1-AG[1],AG[2]];},AN=function(AI,AH){var AK=c0(AI[2],AH[2]),AJ=AI[1],AL=AJ?AH[1]:AJ;return [0,AL,AK];};if(17064<=AA)if(3802040<=AA)if(3901498<=AA){var AP=AM(Av(AO,AC,AB,AF,AE)),AQ=AP[2],AR=AP[1];if(AR)var AS=[0,AR,AQ];else{var AT=AM(Av(AO,AB,AC,AE,AF)),AU=c0(AQ,AT[2]),AS=[0,AT[1],AU];}var AV=AS;}else var AV=Av(AO,AC,AB,AF,AE);else if(3553395<=AA)var AV=Av(AO,AB,AC,AE,AF);else{var AW=AM(Av(AO,AB,AC,AE,AF)),AV=AN(Av(AO,AC,AB,AF,AE),AW);}else if(15500===AA){var AX=Av(AO,AB,AC,AE,AF),AV=AN(Av(AO,AC,AB,AF,AE),AX);}else if(15949<=AA){var AY=Av(AO,AB,AC,AE,AF),AV=AN(AM(Av(AO,AC,AB,AF,AE)),AY);}else{var AZ=AM(Av(AO,AB,AC,AE,AF)),AV=AN(AM(Av(AO,AC,AB,AF,AE)),AZ);}var A0=AV[1],A2=AV[2],A1=A0?aV:aU,A3=17064<=AA?3802040<=AA?3901498<=AA?bk:bj:3553395<=AA?bi:bh:15500===AA?be:15949<=AA?bg:bf,A4=[0,A0,Au(pc,aT,AC,A3,AB,A1),A2];}catch(A5){if(A5[1]===a){var A6=[0,[0,aR,dz(pc,aS,A5[2])],0];return [0,0,dz(pc,aQ,Aw),A6];}if(A5[1]===eJ){var A7=[0,[0,aO,pc(aP)],0];return [0,0,dz(pc,aN,Aw),A7];}throw A5;}return A4;}var A$=dz(A_,Ak,dl(A9,A8)),CG=ar.toString(),CF={"border":aq.toString(),"background":ar.toString()},CE=ap.toString(),Bl={"border":ao.toString(),"background":ap.toString(),"highlight":{"border":aq.toString(),"background":ar.toString()}},CD=an.toString(),CC={"border":am.toString(),"background":an.toString()},CB=al.toString(),B6={"border":ak.toString(),"background":al.toString(),"highlight":{"border":am.toString(),"background":an.toString()}},CA=aj.toString(),Cz={"border":ai.toString(),"background":aj.toString()},Cy=ah.toString(),Bg={"border":ag.toString(),"background":ah.toString(),"highlight":{"border":ai.toString(),"background":aj.toString()}};function Cp(Ba){var Bb=Ak(fp(q$,1,rf,eG(Ba))),Bc=Bb[3],Bd=Bb[1],Be=aB.toString(),Bf=dz(pc,aA,Bc).toString(),Bh=[0,{"id":dz(pc,az,Bc).toString(),"label":Bf,"shape":Be,"color":Bg,"fontSize":27},0],Bp=27,Bo=dz(t5[6],Bc,Bd);function Bq(Bi,Bm){var Bj=ay.toString(),Bk=dz(pc,ax,Bi).toString(),Bn=27;return [0,{"id":dz(pc,aw,Bi).toString(),"label":Bk,"shape":Bj,"color":Bl,"fontSize":27},Bm];}var Br=kX(t5[14],Bq,Bo,Bh),Bs=dl(t5[22],Bd)+1|0;function BI(Bu){var Bv=dn(function(Bt){return Bt;},Bu);if(Bv){var Bw=0,Bx=Bv,BD=Bv[2],BA=Bv[1];for(;;){if(Bx){var Bz=Bx[2],By=Bw+1|0,Bw=By,Bx=Bz;continue;}var BB=caml_make_vect(Bw,BA),BC=1,BE=BD;for(;;){if(BE){var BF=BE[2];BB[BC+1]=BE[1];var BG=BC+1|0,BC=BG,BE=BF;continue;}var BH=BB;break;}break;}}else var BH=[0];return caml_js_from_array(BH);}var B9=[0,Bs,Br,0],B8=Bb[2];function B_(BL,BJ){var BK=BJ[1],BR=BJ[3],BQ=BL[1];function BS(BN,BP){var BM=aC.toString(),BO=c8(BK).toString();return [0,{"from":c8(BN).toString(),"to":BO,"style":BM},BP];}var BT=kX(t5[14],BS,BQ,BR),B0=BL[2];function B1(BU,BZ){var BX=aE.toString(),BW=BU[1].toString(),BV=aD.toString(),BY=c8(BU[2]).toString();return [0,{"from":c8(BK).toString(),"to":BY,"fontSize":BV,"label":BW,"style":BX},BZ];}var B2=kX(ua[14],B1,B0,BT),B4=BJ[2],B3=av.toString(),B5=dz(pc,au,BK-Bs|0).toString(),B7=25;return [0,BK+1|0,[0,{"id":dz(pc,at,BK).toString(),"label":B5,"shape":B3,"color":B6,"fontSize":25},B4],B2];}var B$=kX(uh[14],B_,B8,B9),Ca=dz(pc,aF,dz(pc,ba,eh(bb,dn(uy,dl(t9[20],Bb[4]))))).toString(),Cb=BI(B$[3]);return [0,{"nodes":BI(B$[2]),"edges":Cb},Ca];}function DQ(Cd){function Ce(Cc){throw [0,uB];}var Cf=pm(pE.getElementById(Cd.toString()),Ce),Cg=qg(0,0,pE),Ch=qh(pE),Ci=qi(pE);Cg.size=20;Cg.value=as.toString();Ch.id=c7(Cd,aK).toString();Ch.className=aJ.toString();Ci.className=aI.toString();Cg.className=aH.toString();var Cj=qk(pE);function Cl(Ck){return pB(Cf,Ck);}pk(Cf.firstChild,Cl);pA(Cf,Cj);var Cm=ql(pE),Cn=qm(pE),Co=qm(pE);pA(Cf,Cj);pA(Cj,Cm);pA(Cm,Cn);pA(Cn,Cg);pA(Cm,Co);pA(Co,Ch);pA(Co,Ci);var Cs=dz(pc,aG,Cd);function Cw(Cv){var Cq=new MlWrappedString(Cg.value);try {var Cr=Cp(Cq);window.data=Cr[1];caml_js_eval_string(Cs);var Ct=Ci.innerHTML=Cr[2];}catch(Cu){return 0;}return Ct;}Cw(0);return Cg.onchange=pC(function(Cx){Cw(0);return pn;});}function CQ(CI,CK){function CJ(CH){return pB(CI,CH);}pk(CI.firstChild,CJ);return pA(CI,CK);}function DG(CL,CP,CN){var CM=pN(CL,bP),CO=0===CN[1]?(CM.width=15,window.nope):(CM.width=20,window.ok);CP.style.margin=P.toString();CM.src=CO;return CQ(CP,CM);}function DH(CR,CW,C1,CY,CV,CX){var CS=qi(CR),CT=pN(CR,bM),CU=qn(CR);CS.innerHTML=CV.toString();CT.className=S.toString();CS.style.margin=R.toString();CQ(CW,CT);pA(CT,CS);pA(CT,CU);var C6=CX[3],C7=eh(I,dn(function(CZ){var C0=CY?dz(pc,O,CZ[1]):N;if(C1&&CY){var C2=M,C3=1;}else var C3=0;if(!C3)var C2=L;var C5=c7(C2,C0),C4=C1?dz(pc,K,CZ[2]):J;return c7(C4,C5);},C6));function Da(C$,C_,C8){try {var C9=C7.safeGet(C8),Db=10===C9?Da(G,[0,C$,C_],C8+1|0):(h.safeSet(0,C9),Da(c7(C$,h),C_,C8+1|0));}catch(Dc){if(Dc[1]===b)return dP([0,C$,C_]);throw Dc;}return Db;}var Df=[0,Q,Da(F,0,0)];return dQ(function(De){var Dd=qj(CR);Dd.innerHTML=De.toString();pA(CU,Dd);return pA(CU,pN(CR,bN));},Df);}function Er(Dh){function Di(Dg){throw [0,uB];}var Dj=[0,0],Dk=[0,0],Dm=pm(pE.getElementById(Dh.toString()),Di),Dl=qk(pE);pA(Dm,Dl);function DI(Dn){var Do=Dk[1]<Dn?1:0;if(Do){Dj[1]=Dj[1]+1|0;Dk[1]=Dk[1]+1|0;var Dp=[0,0],Dq=[0,aa],Dr=qg(0,0,pE),Ds=ql(pE),Dt=qm(pE),Du=qm(pE),Dv=qm(pE),Dw=qm(pE),Dx=p7(0,0,pE,bJ);pA(Dl,Ds);pA(Ds,Dt);pA(Ds,Du);pA(Ds,Dv);pA(Ds,Dw);pA(Dt,Dx);pA(Du,Dr);Dt.style.verticalAlign=$.toString();Du.style.verticalAlign=_.toString();Dv.style.verticalAlign=Z.toString();Dw.style.verticalAlign=Y.toString();Dr.size=50;Dr.className=X.toString();Dr.value=W.toString();Dr.onfocus=pC(function(Dz){Dr.value=ab.toString();Dr.onfocus=pC(function(Dy){return pn;});return pn;});var DM=function(DL){var DA=new MlWrappedString(Dr.value);if(!caml_string_notequal(DA,ac)&&1<Dj[1]){pB(Dl,Ds);Dj[1]=Dj[1]-1|0;var DB=Dn===Dk[1]?1:0,DC=DB?(Dk[1]=Dk[1]-1|0,0):DB;return DC;}try {try {var DD=dl(A$,DA),DE=DD;}catch(DF){if(DF[1]!==eJ)throw DF;var DE=H;}Dq[1]=DE;DG(pE,Dv,Dq[1]);if(0<Dp[1])DH(pE,Dw,1,0,T,Dq[1]);var DJ=DI(Dn+1|0);}catch(DK){return 0;}return DJ;};Dr.onchange=pC(function(DN){DM(0);return pn;});Dx.style.width=V.toString();Dx.innerHTML=U.toString();var DP=Dx.onclick=pC(function(DO){if(0===Dp[1]){Dx.innerHTML=ad.toString();Dp[1]=1;}else{Dx.innerHTML=af.toString();Dw.innerHTML=ae.toString();Dp[1]=0;}DM(0);return pn;});}else var DP=Do;return DP;}return DI(1);}function Ex(DS){function DT(DR){throw [0,uB];}var DU=pm(pE.getElementById(DS.toString()),DT),DV=qg(0,0,pE),DW=qn(pE),DX=qh(pE),DY=qi(pE),DZ=qn(pE),D0=qh(pE),D1=qi(pE),D2=qi(pE);DV.size=50;DV.value=o.toString();DV.className=u.toString();DX.id=c7(DS,t).toString();DX.className=s.toString();D0.id=c7(DS,r).toString();D0.className=q.toString();var D3=qk(pE);function D5(D4){return pB(DU,D4);}pk(DU.firstChild,D5);pA(DU,D3);var D6=ql(pE),D7=ql(pE),D8=ql(pE),D9=qm(pE),D_=qj(pE),D$=qm(pE),Ea=qm(pE),Eb=qm(pE);pA(DU,D3);pA(D3,D6);pA(D3,D7);pA(D3,D8);pA(D6,D9);pA(D9,DV);pA(D9,D_);pA(D7,D$);pA(D7,Ea);pA(D$,DW);pA(D$,DX);pA(D$,DY);pA(Ea,DZ);pA(Ea,D0);pA(Ea,D1);pA(D8,Eb);pA(Eb,D2);function Ej(Eg,Ec){var Ed=ro(Ec),Ee=Cp(Ed),Ef=Ee[2];window.data=Ee[1];caml_js_eval_string(kX(pc,v,DS,Eg));return 1===Eg?(DW.innerHTML=c7(x,Ed).toString(),DY.innerHTML=Ef):(DZ.innerHTML=c7(w,Ed).toString(),D1.innerHTML=Ef);}function Ep(Eo){var Eh=new MlWrappedString(DV.value);try {var Ei=ru(Eh);Ej(1,Ei[2]);Ej(2,Ei[3]);}catch(En){DW.innerHTML=E.toString();DY.innerHTML=D.toString();DZ.innerHTML=C.toString();D1.innerHTML=B.toString();D0.innerHTML=A.toString();DX.innerHTML=z.toString();}try {var Ek=dl(A$,Eh),El=Ek;}catch(Em){if(Em[1]!==eJ)throw Em;var El=p;}DG(pE,D_,El);return DH(pE,D2,1,1,y,El);}Ep(0);return DV.onchange=pC(function(Eq){Ep(0);return pn;});}function Ew(Et,Es){try {var Eu=dl(Et,Es);}catch(Ev){if(Ev[1]===uB)return 0;throw Ev;}return Eu;}pD.onload=pC(function(Ey){Ew(DQ,n);Ew(Ex,m);Ew(Er,l);return pn;});c9(0);return;}());
