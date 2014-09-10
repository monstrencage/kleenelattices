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
(function(){function o4(EO,EP,EQ,ER,ES,ET,EU){return EO.length==6?EO(EP,EQ,ER,ES,ET,EU):caml_call_gen(EO,[EP,EQ,ER,ES,ET,EU]);}function Ao(EI,EJ,EK,EL,EM,EN){return EI.length==5?EI(EJ,EK,EL,EM,EN):caml_call_gen(EI,[EJ,EK,EL,EM,EN]);}function Ap(ED,EE,EF,EG,EH){return ED.length==4?ED(EE,EF,EG,EH):caml_call_gen(ED,[EE,EF,EG,EH]);}function kR(Ez,EA,EB,EC){return Ez.length==3?Ez(EA,EB,EC):caml_call_gen(Ez,[EA,EB,EC]);}function dt(Ew,Ex,Ey){return Ew.length==2?Ew(Ex,Ey):caml_call_gen(Ew,[Ex,Ey]);}function df(Eu,Ev){return Eu.length==1?Eu(Ev):caml_call_gen(Eu,[Ev]);}var a=[0,new MlString("Failure")],b=[0,new MlString("Invalid_argument")],c=[0,new MlString("Not_found")],d=[0,new MlString("Assert_failure")],e=[0,new MlString(""),0,0,-1],f=[0,new MlString(""),1,0,0],g=[0,new MlString("\0\0\xea\xff\xeb\xff\x02\0\x1e\0N\0\xf4\xff\xf5\xff\xf6\xff\xf7\xff\xf8\xff\xf9\xff\xfa\xffN\0\x99\0\xfd\xff\x0b\0\xca\0\xfe\xff\xa8\0\xfc\xff\x03\0 \0\xf3\xff\xf2\xff\xee\xff\xf1\xff\xed\xff\x01\0\xfd\xff\xfe\xff\xff\xff"),new MlString("\xff\xff\xff\xff\xff\xff\x10\0\x0f\0\x13\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x04\0\x15\0\xff\xff\x15\0\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString("\x01\0\0\0\0\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xff\xff\xff\xff\0\0\xff\xff\xff\xff\0\0\xff\xff\0\0\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\x1d\0\0\0\0\0\0\0"),new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x11\0\x0f\0\x1f\0\0\0\x11\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x11\0\0\0\0\0\0\0\0\0\0\0\b\0\0\0\x07\0\x06\0\f\0\x0b\0\x11\0\0\0\t\0\x10\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x12\0\0\0\x04\0\x05\0\x03\0\x1b\0\x18\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x1a\0\x19\0\x17\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x0e\0\n\0\x15\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\0\0\x16\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\0\0\0\0\0\0\0\0\0\0\0\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x11\0\0\0\0\0\0\0\x11\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x11\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x11\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x02\0\x1e\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x14\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"),new MlString("\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\0\0\x1c\0\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x10\0\xff\xff\0\0\0\0\0\0\x03\0\x15\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x16\0\xff\xff\xff\xff\xff\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x05\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x05\0\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\r\0\x0e\0\x0e\0\x0e\0\x0e\0\x0e\0\x0e\0\x0e\0\x0e\0\x0e\0\x0e\0\x11\0\xff\xff\xff\xff\xff\xff\x11\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\x13\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x11\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x11\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\0\0\x1c\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x13\0\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString(""),new MlString("")],h=new MlString(" ");caml_register_global(6,c);caml_register_global(5,[0,new MlString("Division_by_zero")]);caml_register_global(3,b);caml_register_global(2,a);var cL=new MlString("%d"),cK=new MlString("true"),cJ=new MlString("false"),cI=new MlString("Pervasives.do_at_exit"),cH=new MlString("Array.blit"),cG=new MlString("\\b"),cF=new MlString("\\t"),cE=new MlString("\\n"),cD=new MlString("\\r"),cC=new MlString("\\\\"),cB=new MlString("\\'"),cA=new MlString(""),cz=new MlString("String.blit"),cy=new MlString("String.sub"),cx=new MlString(""),cw=new MlString("syntax error"),cv=new MlString("Parsing.YYexit"),cu=new MlString("Parsing.Parse_error"),ct=new MlString("Set.remove_min_elt"),cs=[0,0,0,0],cr=[0,0,0],cq=new MlString("Set.bal"),cp=new MlString("Set.bal"),co=new MlString("Set.bal"),cn=new MlString("Set.bal"),cm=new MlString("Map.remove_min_elt"),cl=new MlString("Map.bal"),ck=new MlString("Map.bal"),cj=new MlString("Map.bal"),ci=new MlString("Map.bal"),ch=new MlString("Buffer.add: cannot grow buffer"),cg=new MlString(""),cf=new MlString(""),ce=new MlString("%.12g"),cd=new MlString("\""),cc=new MlString("\""),cb=new MlString("'"),ca=new MlString("'"),b$=new MlString("nan"),b_=new MlString("neg_infinity"),b9=new MlString("infinity"),b8=new MlString("."),b7=new MlString("printf: bad positional specification (0)."),b6=new MlString("%_"),b5=[0,new MlString("printf.ml"),143,8],b4=new MlString("'"),b3=new MlString("Printf: premature end of format string '"),b2=new MlString("'"),b1=new MlString(" in format string '"),b0=new MlString(", at char number "),bZ=new MlString("Printf: bad conversion %"),bY=new MlString("Sformat.index_of_int: negative argument "),bX=new MlString("\""),bW=new MlString(" name=\""),bV=new MlString("\""),bU=new MlString(" type=\""),bT=new MlString("<"),bS=new MlString(">"),bR=new MlString(""),bQ=new MlString("<input name=\"x\">"),bP=new MlString("input"),bO=new MlString("x"),bN=new MlString("code"),bM=new MlString("td"),bL=new MlString("tr"),bK=new MlString("table"),bJ=new MlString("img"),bI=new MlString("a"),bH=new MlString("br"),bG=new MlString("pre"),bF=new MlString("p"),bE=new MlString("div"),bD=new MlString("button"),bC=new MlString("input"),bB=new MlString("unsupported operation"),bA=new MlString("parser"),bz=new MlString("unsupported operation"),by=[0,0,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,0],bx=new MlString("\xff\xff\x02\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\x03\0\0\0\0\0"),bw=new MlString("\x02\0\x03\0\x01\0\x02\0\x03\0\x03\0\x03\0\x02\0\x02\0\x03\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x01\0\x02\0\x02\0"),bv=new MlString("\0\0\0\0\0\0\0\0\x02\0\0\0\0\0\0\0\x12\0\0\0\x03\0\0\0\0\0\b\0\x07\0\0\0\n\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\0\0\t\0\0\0\0\0\0\0\0\0"),bu=new MlString("\x03\0\x06\0\b\0\x17\0"),bt=new MlString("\x05\0\x01\xff\x01\xff\0\0\0\0\x01\xff\n\xff\x18\xff\0\0'\xff\0\0\x01\xff\x01\xff\0\0\0\0\x01\xff\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x01\xff\0\x000\xff<\xff4\xff\n\xff"),bs=new MlString("\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x1d\0\x01\0\x0f\0\b\0"),br=new MlString("\0\0\xfe\xff\0\0\0\0"),bq=new MlString("\x07\0\x04\0\x04\0\t\0\x11\0\x05\0\x01\0\x02\0\x01\0\x19\0\x1a\0\0\0\n\0\x1b\0\0\0\x05\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x1c\0\0\0\0\0\0\0\0\0\n\0\0\0\0\0\x06\0\x0b\0\f\0\r\0\x0e\0\x0f\0\x10\0\x11\0\x12\0\x13\0\x14\0\x15\0\n\0\x16\0\0\0\x18\0\x0b\0\f\0\r\0\x0e\0\x0f\0\n\0\0\0\0\0\0\0\n\0\f\0\r\0\x0e\0\x0f\0\f\0\r\0\x0e\0\n\0\0\0\0\0\0\0\0\0\0\0\r\0\x0e\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x04\0\x04\0\x04\0\0\0\0\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\x04\0\0\0\x04\0\x05\0\x05\0\0\0\0\0\0\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\x05\0\0\0\x05\0\x06\0\x06\0\0\0\0\0\0\0\0\0\x06\0\x06\0\x06\0\x06\0\x06\0\x06\0\0\0\x06\0"),bp=new MlString("\x02\0\0\0\x01\x01\x05\0\0\0\x04\x01\x01\0\x02\0\0\0\x0b\0\f\0\xff\xff\x02\x01\x0f\0\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x17\0\xff\xff\xff\xff\xff\xff\xff\xff\x02\x01\xff\xff\xff\xff\0\0\x06\x01\x07\x01\b\x01\t\x01\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\x02\x01\x12\x01\xff\xff\x05\x01\x06\x01\x07\x01\b\x01\t\x01\n\x01\x02\x01\xff\xff\xff\xff\xff\xff\x02\x01\x07\x01\b\x01\t\x01\n\x01\x07\x01\b\x01\t\x01\x02\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\b\x01\t\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\x05\x01\x06\x01\x07\x01\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\n\x01\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01\x05\x01\x06\x01\xff\xff\xff\xff\xff\xff\xff\xff\x0b\x01\f\x01\r\x01\x0e\x01\x0f\x01\x10\x01\xff\xff\x12\x01"),bo=new MlString("EOF\0NEWLINE\0LPAR\0RPAR\0PLUS\0DOT\0PSTAR\0STAR\0INTER\0EGAL\0LEQ\0GEQ\0LT\0GT\0IMCOMP\0DUNNO\0DIFF\0"),bn=new MlString("VAR\0POWER\0"),bm=new MlString("lexing error"),bl=new MlString("\xc3\xb8"),bk=new MlString("\xce\xb5"),bj=new MlString("(%s | %s)"),bi=new MlString("(%s)+"),bh=new MlString("(%s)~"),bg=new MlString("%s.%s"),bf=new MlString("(%s & %s)"),be=new MlString("=/="),bd=new MlString("<="),bc=new MlString(">="),bb=new MlString("<"),ba=new MlString(">"),a$=new MlString("<>"),a_=new MlString("="),a9=new MlString(","),a8=new MlString("{%s}"),a7=new MlString(","),a6=new MlString("{%s}"),a5=new MlString(","),a4=new MlString("{%s}"),a3=new MlString("%d -> %s"),a2=new MlString(","),a1=new MlString("(%s)"),a0=new MlString("Tools.ContreExemple"),aZ=new MlString("Tools.NotDefined"),aY=new MlString("get_expr : empty word"),aX=[0,new MlString("word.ml"),134,4],aW=new MlString("get_expr : stuck"),aV=new MlString("get_expr : stuck"),aU=[0,new MlString("word.ml"),84,15],aT=new MlString("(%s,%s)"),aS=new MlString(",\n"),aR=new MlString("{%s}"),aQ=new MlString("Petri.trad : unsupported operation"),aP=new MlString("OK"),aO=new MlString("Incorrect"),aN=new MlString("%s %s %s --------- %s"),aM=new MlString("Error : Failure(%s)"),aL=new MlString("No result."),aK=new MlString("%s --------- Failed"),aJ=new MlString("Error : parsing error"),aI=new MlString("No result."),aH=new MlString("%s --------- Failed"),aG=new MlString("%s <= %s -- false (%d pairs)\nWitness: %s"),aF=new MlString("%s <= %s -- true (%d pairs)"),aE=new MlString("_auto"),aD=new MlString("auto"),aC=new MlString("center"),aB=new MlString("drawin"),aA=new MlString("new vis.Network(document.getElementById('%s_auto'),data, {})"),az=new MlString("Final states : %s"),ay=new MlString("arrow"),ax=new MlString("25"),aw=new MlString("arrow-center"),av=new MlString("circle"),au=new MlString("%d"),at=new MlString("%d"),as=new MlString("circle"),ar=new MlString("%d"),aq=new MlString("%d"),ap=new MlString("box"),ao=new MlString("   %d   "),an=new MlString("%d"),am=new MlString("(a|b)+.C & d | e.(a|b)"),al=new MlString("#D2E5FF"),ak=new MlString("#2B7CE9"),aj=new MlString("#97C2FC"),ai=new MlString("#2B7CE9"),ah=new MlString("#A1EC76"),ag=new MlString("#41A906"),af=new MlString("#7BE141"),ae=new MlString("#41A906"),ad=new MlString("#D3BDF0"),ac=new MlString("#7C29F0"),ab=new MlString("#AD85E4"),aa=new MlString("#7C29F0"),$=new MlString("Show Details"),_=new MlString(""),Z=new MlString("Hide Details"),Y=new MlString(""),X=new MlString(""),W=[0,0,new MlString(""),0],V=new MlString("top"),U=new MlString("top"),T=new MlString("top"),S=new MlString("top"),R=new MlString("solvein"),Q=new MlString("enter equation here"),P=new MlString("100px"),O=new MlString("Show Details"),N=new MlString("Details:"),M=new MlString("output"),L=new MlString("0px"),K=new MlString(""),J=new MlString("0px"),I=new MlString("%s"),H=new MlString(""),G=new MlString("\n"),F=new MlString(""),E=new MlString("%s"),D=new MlString(""),C=new MlString("\n\n"),B=[0,0,new MlString(""),0],A=new MlString(""),z=new MlString(""),y=new MlString("Results:"),x=new MlString("Automaton for : "),w=new MlString("Automaton for : "),v=new MlString("new vis.Network(document.getElementById('%s_auto%d'),data, {})"),u=new MlString("drawin"),t=new MlString("_auto1"),s=new MlString("auto"),r=new MlString("_auto2"),q=new MlString("auto"),p=[0,0,new MlString(""),0],o=new MlString("(a|b)+.C & d > d & a.b.C & (d|a)\n"),n=new MlString("draw"),m=new MlString("details"),l=new MlString("solve");function k(i){throw [0,a,i];}function cM(j){throw [0,b,j];}function c1(cN,cP){var cO=cN.getLen(),cQ=cP.getLen(),cR=caml_create_string(cO+cQ|0);caml_blit_string(cN,0,cR,0,cO);caml_blit_string(cP,0,cR,cO,cQ);return cR;}function c2(cS){return caml_format_int(cL,cS);}function cU(cT,cV){if(cT){var cW=cT[1];return [0,cW,cU(cT[2],cV)];}return cV;}function c3(c0){var cX=caml_ml_out_channels_list(0);for(;;){if(cX){var cY=cX[2];try {}catch(cZ){}var cX=cY;continue;}return 0;}}caml_register_named_value(cI,c3);function c9(c6,c5,c8,c7,c4){if(0<=c4&&0<=c5&&!((c6.length-1-c4|0)<c5)&&0<=c7&&!((c8.length-1-c4|0)<c7))return caml_array_blit(c6,c5,c8,c7,c4);return cM(cH);}function dJ(c_){var c$=c_,da=0;for(;;){if(c$){var db=c$[2],dc=[0,c$[1],da],c$=db,da=dc;continue;}return da;}}function dh(de,dd){if(dd){var dg=dd[2],di=df(de,dd[1]);return [0,di,dh(de,dg)];}return 0;}function dK(dl,dj){var dk=dj;for(;;){if(dk){var dm=dk[2];df(dl,dk[1]);var dk=dm;continue;}return 0;}}function dL(ds,dn,dq){var dp=dn,dr=dq;for(;;){if(dr){var du=dr[2],dv=dt(ds,dp,dr[1]),dp=dv,dr=du;continue;}return dp;}}function dM(dy,dw){var dx=dw;for(;;){if(dx){var dz=dx[2],dA=0===caml_compare(dx[1],dy)?1:0;if(dA)return dA;var dx=dz;continue;}return 0;}}function d_(dH){return df(function(dB,dD){var dC=dB,dE=dD;for(;;){if(dE){var dF=dE[2],dG=dE[1];if(df(dH,dG)){var dI=[0,dG,dC],dC=dI,dE=dF;continue;}var dE=dF;continue;}return dJ(dC);}},0);}function d9(dN,dP){var dO=caml_create_string(dN);caml_fill_string(dO,0,dN,dP);return dO;}function d$(dS,dQ,dR){if(0<=dQ&&0<=dR&&!((dS.getLen()-dR|0)<dQ)){var dT=caml_create_string(dR);caml_blit_string(dS,dQ,dT,0,dR);return dT;}return cM(cy);}function ea(dW,dV,dY,dX,dU){if(0<=dU&&0<=dV&&!((dW.getLen()-dU|0)<dV)&&0<=dX&&!((dY.getLen()-dU|0)<dX))return caml_blit_string(dW,dV,dY,dX,dU);return cM(cz);}function eb(d5,dZ){if(dZ){var d0=dZ[1],d1=[0,0],d2=[0,0],d4=dZ[2];dK(function(d3){d1[1]+=1;d2[1]=d2[1]+d3.getLen()|0;return 0;},dZ);var d6=caml_create_string(d2[1]+caml_mul(d5.getLen(),d1[1]-1|0)|0);caml_blit_string(d0,0,d6,0,d0.getLen());var d7=[0,d0.getLen()];dK(function(d8){caml_blit_string(d5,0,d6,d7[1],d5.getLen());d7[1]=d7[1]+d5.getLen()|0;caml_blit_string(d8,0,d6,d7[1],d8.getLen());d7[1]=d7[1]+d8.getLen()|0;return 0;},d4);return d6;}return cA;}var ec=caml_sys_const_word_size(0),ed=caml_mul(ec/8|0,(1<<(ec-10|0))-1|0)-1|0;function ez(eg,ef,ee){var eh=caml_lex_engine(eg,ef,ee);if(0<=eh){ee[11]=ee[12];var ei=ee[12];ee[12]=[0,ei[1],ei[2],ei[3],ee[4]+ee[6]|0];}return eh;}function eA(ej){var et=[0],es=1,er=0,eq=0,ep=0,eo=0,en=0,em=ej.getLen(),el=c1(ej,cx);return [0,function(ek){ek[9]=1;return 0;},el,em,en,eo,ep,eq,er,es,et,f,f];}function eB(ey,ev,eu){var ew=eu-ev|0,ex=caml_create_string(ew);caml_blit_string(ey[2],ev,ex,0,ew);return ex;}var eC=[0,cv],eD=[0,cu],eE=[0,caml_make_vect(100,0),caml_make_vect(100,0),caml_make_vect(100,e),caml_make_vect(100,e),100,0,0,0,e,e,0,0,0,0,0,0];function eN(eL){var eF=eE[5],eG=eF*2|0,eH=caml_make_vect(eG,0),eI=caml_make_vect(eG,0),eJ=caml_make_vect(eG,e),eK=caml_make_vect(eG,e);c9(eE[1],0,eH,0,eF);eE[1]=eH;c9(eE[2],0,eI,0,eF);eE[2]=eI;c9(eE[3],0,eJ,0,eF);eE[3]=eJ;c9(eE[4],0,eK,0,eF);eE[4]=eK;eE[5]=eG;return 0;}var ff=[0,function(eM){return 0;}];function fj(eZ,eV,e$,eW){var eU=eE[11],eT=eE[14],eS=eE[6],eR=eE[15],eQ=eE[7],eP=eE[8],eO=eE[16];eE[6]=eE[14]+1|0;eE[7]=eV;eE[10]=eW[12];try {var eX=0,eY=0;for(;;)switch(caml_parse_engine(eZ,eE,eX,eY)){case 1:throw [0,eD];case 2:eN(0);var e1=0,e0=2,eX=e0,eY=e1;continue;case 3:eN(0);var e3=0,e2=3,eX=e2,eY=e3;continue;case 4:try {var e4=[0,4,df(caml_array_get(eZ[1],eE[13]),eE)],e5=e4;}catch(e6){if(e6[1]!==eD)throw e6;var e5=[0,5,0];}var e8=e5[2],e7=e5[1],eX=e7,eY=e8;continue;case 5:df(eZ[14],cw);var e_=0,e9=5,eX=e9,eY=e_;continue;default:var fa=df(e$,eW);eE[9]=eW[11];eE[10]=eW[12];var fb=1,eX=fb,eY=fa;continue;}}catch(fd){var fc=eE[7];eE[11]=eU;eE[14]=eT;eE[6]=eS;eE[15]=eR;eE[7]=eQ;eE[8]=eP;eE[16]=eO;if(fd[1]===eC)return fd[2];ff[1]=function(fe){return caml_obj_is_block(fe)?caml_array_get(eZ[3],caml_obj_tag(fe))===fc?1:0:caml_array_get(eZ[2],fe)===fc?1:0;};throw fd;}}function fk(fg,fh){return caml_array_get(fg[2],fg[11]-fh|0);}function jy(fi){return 0;}function jx(fS){function fz(fl){return fl?fl[4]:0;}function fB(fm,fr,fo){var fn=fm?fm[4]:0,fp=fo?fo[4]:0,fq=fp<=fn?fn+1|0:fp+1|0;return [0,fm,fr,fo,fq];}function fW(fs,fC,fu){var ft=fs?fs[4]:0,fv=fu?fu[4]:0;if((fv+2|0)<ft){if(fs){var fw=fs[3],fx=fs[2],fy=fs[1],fA=fz(fw);if(fA<=fz(fy))return fB(fy,fx,fB(fw,fC,fu));if(fw){var fE=fw[2],fD=fw[1],fF=fB(fw[3],fC,fu);return fB(fB(fy,fx,fD),fE,fF);}return cM(cq);}return cM(cp);}if((ft+2|0)<fv){if(fu){var fG=fu[3],fH=fu[2],fI=fu[1],fJ=fz(fI);if(fJ<=fz(fG))return fB(fB(fs,fC,fI),fH,fG);if(fI){var fL=fI[2],fK=fI[1],fM=fB(fI[3],fH,fG);return fB(fB(fs,fC,fK),fL,fM);}return cM(co);}return cM(cn);}var fN=fv<=ft?ft+1|0:fv+1|0;return [0,fs,fC,fu,fN];}function fV(fT,fO){if(fO){var fP=fO[3],fQ=fO[2],fR=fO[1],fU=dt(fS[1],fT,fQ);return 0===fU?fO:0<=fU?fW(fR,fQ,fV(fT,fP)):fW(fV(fT,fR),fQ,fP);}return [0,0,fT,0,1];}function f3(fX){return [0,0,fX,0,1];}function fZ(f0,fY){if(fY){var f2=fY[3],f1=fY[2];return fW(fZ(f0,fY[1]),f1,f2);}return f3(f0);}function f5(f6,f4){if(f4){var f8=f4[2],f7=f4[1];return fW(f7,f8,f5(f6,f4[3]));}return f3(f6);}function gb(f9,gc,f_){if(f9){if(f_){var f$=f_[4],ga=f9[4],gh=f_[3],gi=f_[2],gg=f_[1],gd=f9[3],ge=f9[2],gf=f9[1];return (f$+2|0)<ga?fW(gf,ge,gb(gd,gc,f_)):(ga+2|0)<f$?fW(gb(f9,gc,gg),gi,gh):fB(f9,gc,f_);}return f5(gc,f9);}return fZ(gc,f_);}function gx(gj){var gk=gj;for(;;){if(gk){var gl=gk[1];if(gl){var gk=gl;continue;}return gk[2];}throw [0,c];}}function gM(gm){var gn=gm;for(;;){if(gn){var go=gn[3],gp=gn[2];if(go){var gn=go;continue;}return gp;}throw [0,c];}}function gs(gq){if(gq){var gr=gq[1];if(gr){var gu=gq[3],gt=gq[2];return fW(gs(gr),gt,gu);}return gq[3];}return cM(ct);}function gN(gv,gw){if(gv){if(gw){var gy=gs(gw);return gb(gv,gx(gw),gy);}return gv;}return gw;}function gF(gD,gz){if(gz){var gA=gz[3],gB=gz[2],gC=gz[1],gE=dt(fS[1],gD,gB);if(0===gE)return [0,gC,1,gA];if(0<=gE){var gG=gF(gD,gA),gI=gG[3],gH=gG[2];return [0,gb(gC,gB,gG[1]),gH,gI];}var gJ=gF(gD,gC),gL=gJ[2],gK=gJ[1];return [0,gK,gL,gb(gJ[3],gB,gA)];}return cs;}var js=0;function jt(gO){return gO?0:1;}function ju(gR,gP){var gQ=gP;for(;;){if(gQ){var gU=gQ[3],gT=gQ[1],gS=dt(fS[1],gR,gQ[2]),gV=0===gS?1:0;if(gV)return gV;var gW=0<=gS?gU:gT,gQ=gW;continue;}return 0;}}function g5(g1,gX){if(gX){var gY=gX[3],gZ=gX[2],g0=gX[1],g2=dt(fS[1],g1,gZ);if(0===g2){if(g0)if(gY){var g3=gs(gY),g4=fW(g0,gx(gY),g3);}else var g4=g0;else var g4=gY;return g4;}return 0<=g2?fW(g0,gZ,g5(g1,gY)):fW(g5(g1,g0),gZ,gY);}return 0;}function hb(g6,g7){if(g6){if(g7){var g8=g7[4],g9=g7[2],g_=g6[4],g$=g6[2],hh=g7[3],hj=g7[1],hc=g6[3],he=g6[1];if(g8<=g_){if(1===g8)return fV(g9,g6);var ha=gF(g$,g7),hd=ha[1],hf=hb(hc,ha[3]);return gb(hb(he,hd),g$,hf);}if(1===g_)return fV(g$,g7);var hg=gF(g9,g6),hi=hg[1],hk=hb(hg[3],hh);return gb(hb(hi,hj),g9,hk);}return g6;}return g7;}function hs(hl,hm){if(hl){if(hm){var hn=hl[3],ho=hl[2],hp=hl[1],hq=gF(ho,hm),hr=hq[1];if(0===hq[2]){var ht=hs(hn,hq[3]);return gN(hs(hp,hr),ht);}var hu=hs(hn,hq[3]);return gb(hs(hp,hr),ho,hu);}return 0;}return 0;}function hC(hv,hw){if(hv){if(hw){var hx=hv[3],hy=hv[2],hz=hv[1],hA=gF(hy,hw),hB=hA[1];if(0===hA[2]){var hD=hC(hx,hA[3]);return gb(hC(hz,hB),hy,hD);}var hE=hC(hx,hA[3]);return gN(hC(hz,hB),hE);}return hv;}return 0;}function hL(hF,hH){var hG=hF,hI=hH;for(;;){if(hG){var hJ=hG[1],hK=[0,hG[2],hG[3],hI],hG=hJ,hI=hK;continue;}return hI;}}function hZ(hN,hM){var hO=hL(hM,0),hP=hL(hN,0),hQ=hO;for(;;){if(hP)if(hQ){var hV=hQ[3],hU=hQ[2],hT=hP[3],hS=hP[2],hR=dt(fS[1],hP[1],hQ[1]);if(0===hR){var hW=hL(hU,hV),hX=hL(hS,hT),hP=hX,hQ=hW;continue;}var hY=hR;}else var hY=1;else var hY=hQ?-1:0;return hY;}}function jv(h1,h0){return 0===hZ(h1,h0)?1:0;}function ia(h2,h4){var h3=h2,h5=h4;for(;;){if(h3){if(h5){var h6=h5[3],h7=h5[1],h8=h3[3],h9=h3[2],h_=h3[1],h$=dt(fS[1],h9,h5[2]);if(0===h$){var ib=ia(h_,h7);if(ib){var h3=h8,h5=h6;continue;}return ib;}if(0<=h$){var ic=ia([0,0,h9,h8,0],h6);if(ic){var h3=h_;continue;}return ic;}var id=ia([0,h_,h9,0,0],h7);if(id){var h3=h8;continue;}return id;}return 0;}return 1;}}function ih(ii,ie){var ig=ie;for(;;){if(ig){var ik=ig[3],ij=ig[2];ih(ii,ig[1]);df(ii,ij);var ig=ik;continue;}return 0;}}function iq(ir,il,io){var im=il,ip=io;for(;;){if(im){var it=im[3],is=im[2],iu=dt(ir,is,iq(ir,im[1],ip)),im=it,ip=iu;continue;}return ip;}}function iB(ix,iv){var iw=iv;for(;;){if(iw){var iA=iw[3],iz=iw[1],iy=df(ix,iw[2]);if(iy){var iC=iB(ix,iz);if(iC){var iw=iA;continue;}var iD=iC;}else var iD=iy;return iD;}return 1;}}function iL(iG,iE){var iF=iE;for(;;){if(iF){var iJ=iF[3],iI=iF[1],iH=df(iG,iF[2]);if(iH)var iK=iH;else{var iM=iL(iG,iI);if(!iM){var iF=iJ;continue;}var iK=iM;}return iK;}return 0;}}function iP(iQ,iN){if(iN){var iO=iN[2],iS=iN[3],iR=iP(iQ,iN[1]),iU=df(iQ,iO),iT=iP(iQ,iS);return iU?gb(iR,iO,iT):gN(iR,iT);}return 0;}function iX(iY,iV){if(iV){var iW=iV[2],i0=iV[3],iZ=iX(iY,iV[1]),i1=iZ[2],i2=iZ[1],i4=df(iY,iW),i3=iX(iY,i0),i5=i3[2],i6=i3[1];if(i4){var i7=gN(i1,i5);return [0,gb(i2,iW,i6),i7];}var i8=gb(i1,iW,i5);return [0,gN(i2,i6),i8];}return cr;}function i_(i9){if(i9){var i$=i9[1],ja=i_(i9[3]);return (i_(i$)+1|0)+ja|0;}return 0;}function jf(jb,jd){var jc=jb,je=jd;for(;;){if(je){var jh=je[2],jg=je[1],ji=[0,jh,jf(jc,je[3])],jc=ji,je=jg;continue;}return jc;}}function jw(jj){return jf(0,jj);}return [0,js,jt,ju,fV,f3,g5,hb,hs,hC,hZ,jv,ia,ih,iq,iB,iL,iP,iX,i_,jw,gx,gM,gx,gF,function(jn,jk){var jl=jk;for(;;){if(jl){var jm=jl[2],jq=jl[3],jp=jl[1],jo=dt(fS[1],jn,jm);if(0===jo)return jm;var jr=0<=jo?jq:jp,jl=jr;continue;}throw [0,c];}}];}function jQ(jz){var jA=1<=jz?jz:1,jB=ed<jA?ed:jA,jC=caml_create_string(jB);return [0,jC,0,jB,jC];}function jR(jD){return d$(jD[1],0,jD[2]);}function jK(jE,jG){var jF=[0,jE[3]];for(;;){if(jF[1]<(jE[2]+jG|0)){jF[1]=2*jF[1]|0;continue;}if(ed<jF[1])if((jE[2]+jG|0)<=ed)jF[1]=ed;else k(ch);var jH=caml_create_string(jF[1]);ea(jE[1],0,jH,0,jE[2]);jE[1]=jH;jE[3]=jF[1];return 0;}}function jS(jI,jL){var jJ=jI[2];if(jI[3]<=jJ)jK(jI,1);jI[1].safeSet(jJ,jL);jI[2]=jJ+1|0;return 0;}function jT(jO,jM){var jN=jM.getLen(),jP=jO[2]+jN|0;if(jO[3]<jP)jK(jO,jN);ea(jM,0,jO[1],jO[2],jN);jO[2]=jP;return 0;}function jX(jU){return 0<=jU?jU:k(c1(bY,c2(jU)));}function jY(jV,jW){return jX(jV+jW|0);}var jZ=df(jY,1);function j6(j0){return d$(j0,0,j0.getLen());}function j8(j1,j2,j4){var j3=c1(b1,c1(j1,b2)),j5=c1(b0,c1(c2(j2),j3));return cM(c1(bZ,c1(d9(1,j4),j5)));}function kX(j7,j_,j9){return j8(j6(j7),j_,j9);}function kY(j$){return cM(c1(b3,c1(j6(j$),b4)));}function kt(ka,ki,kk,km){function kh(kb){if((ka.safeGet(kb)-48|0)<0||9<(ka.safeGet(kb)-48|0))return kb;var kc=kb+1|0;for(;;){var kd=ka.safeGet(kc);if(48<=kd){if(!(58<=kd)){var kf=kc+1|0,kc=kf;continue;}var ke=0;}else if(36===kd){var kg=kc+1|0,ke=1;}else var ke=0;if(!ke)var kg=kb;return kg;}}var kj=kh(ki+1|0),kl=jQ((kk-kj|0)+10|0);jS(kl,37);var kn=kj,ko=dJ(km);for(;;){if(kn<=kk){var kp=ka.safeGet(kn);if(42===kp){if(ko){var kq=ko[2];jT(kl,c2(ko[1]));var kr=kh(kn+1|0),kn=kr,ko=kq;continue;}throw [0,d,b5];}jS(kl,kp);var ks=kn+1|0,kn=ks;continue;}return jR(kl);}}function mm(kz,kx,kw,kv,ku){var ky=kt(kx,kw,kv,ku);if(78!==kz&&110!==kz)return ky;ky.safeSet(ky.getLen()-1|0,117);return ky;}function kZ(kG,kQ,kV,kA,kU){var kB=kA.getLen();function kS(kC,kP){var kD=40===kC?41:125;function kO(kE){var kF=kE;for(;;){if(kB<=kF)return df(kG,kA);if(37===kA.safeGet(kF)){var kH=kF+1|0;if(kB<=kH)var kI=df(kG,kA);else{var kJ=kA.safeGet(kH),kK=kJ-40|0;if(kK<0||1<kK){var kL=kK-83|0;if(kL<0||2<kL)var kM=1;else switch(kL){case 1:var kM=1;break;case 2:var kN=1,kM=0;break;default:var kN=0,kM=0;}if(kM){var kI=kO(kH+1|0),kN=2;}}else var kN=0===kK?0:1;switch(kN){case 1:var kI=kJ===kD?kH+1|0:kR(kQ,kA,kP,kJ);break;case 2:break;default:var kI=kO(kS(kJ,kH+1|0)+1|0);}}return kI;}var kT=kF+1|0,kF=kT;continue;}}return kO(kP);}return kS(kV,kU);}function lm(kW){return kR(kZ,kY,kX,kW);}function lC(k0,k$,lj){var k1=k0.getLen()-1|0;function lk(k2){var k3=k2;a:for(;;){if(k3<k1){if(37===k0.safeGet(k3)){var k4=0,k5=k3+1|0;for(;;){if(k1<k5)var k6=kY(k0);else{var k7=k0.safeGet(k5);if(58<=k7){if(95===k7){var k9=k5+1|0,k8=1,k4=k8,k5=k9;continue;}}else if(32<=k7)switch(k7-32|0){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 0:case 3:case 11:case 13:var k_=k5+1|0,k5=k_;continue;case 10:var la=kR(k$,k4,k5,105),k5=la;continue;default:var lb=k5+1|0,k5=lb;continue;}var lc=k5;c:for(;;){if(k1<lc)var ld=kY(k0);else{var le=k0.safeGet(lc);if(126<=le)var lf=0;else switch(le){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var ld=kR(k$,k4,lc,105),lf=1;break;case 69:case 70:case 71:case 101:case 102:case 103:var ld=kR(k$,k4,lc,102),lf=1;break;case 33:case 37:case 44:case 64:var ld=lc+1|0,lf=1;break;case 83:case 91:case 115:var ld=kR(k$,k4,lc,115),lf=1;break;case 97:case 114:case 116:var ld=kR(k$,k4,lc,le),lf=1;break;case 76:case 108:case 110:var lg=lc+1|0;if(k1<lg){var ld=kR(k$,k4,lc,105),lf=1;}else{var lh=k0.safeGet(lg)-88|0;if(lh<0||32<lh)var li=1;else switch(lh){case 0:case 12:case 17:case 23:case 29:case 32:var ld=dt(lj,kR(k$,k4,lc,le),105),lf=1,li=0;break;default:var li=1;}if(li){var ld=kR(k$,k4,lc,105),lf=1;}}break;case 67:case 99:var ld=kR(k$,k4,lc,99),lf=1;break;case 66:case 98:var ld=kR(k$,k4,lc,66),lf=1;break;case 41:case 125:var ld=kR(k$,k4,lc,le),lf=1;break;case 40:var ld=lk(kR(k$,k4,lc,le)),lf=1;break;case 123:var ll=kR(k$,k4,lc,le),ln=kR(lm,le,k0,ll),lo=ll;for(;;){if(lo<(ln-2|0)){var lp=dt(lj,lo,k0.safeGet(lo)),lo=lp;continue;}var lq=ln-1|0,lc=lq;continue c;}default:var lf=0;}if(!lf)var ld=kX(k0,lc,le);}var k6=ld;break;}}var k3=k6;continue a;}}var lr=k3+1|0,k3=lr;continue;}return k3;}}lk(0);return 0;}function nB(lD){var ls=[0,0,0,0];function lB(lx,ly,lt){var lu=41!==lt?1:0,lv=lu?125!==lt?1:0:lu;if(lv){var lw=97===lt?2:1;if(114===lt)ls[3]=ls[3]+1|0;if(lx)ls[2]=ls[2]+lw|0;else ls[1]=ls[1]+lw|0;}return ly+1|0;}lC(lD,lB,function(lz,lA){return lz+1|0;});return ls[1];}function mi(lE,lH,lF){var lG=lE.safeGet(lF);if((lG-48|0)<0||9<(lG-48|0))return dt(lH,0,lF);var lI=lG-48|0,lJ=lF+1|0;for(;;){var lK=lE.safeGet(lJ);if(48<=lK){if(!(58<=lK)){var lN=lJ+1|0,lM=(10*lI|0)+(lK-48|0)|0,lI=lM,lJ=lN;continue;}var lL=0;}else if(36===lK)if(0===lI){var lO=k(b7),lL=1;}else{var lO=dt(lH,[0,jX(lI-1|0)],lJ+1|0),lL=1;}else var lL=0;if(!lL)var lO=dt(lH,0,lF);return lO;}}function md(lP,lQ){return lP?lQ:df(jZ,lQ);}function l4(lR,lS){return lR?lR[1]:lS;}function o3(nW,lU,n8,lX,nG,oc,lT){var lV=df(lU,lT);function nX(lW){return dt(lX,lV,lW);}function nF(l2,ob,lY,l7){var l1=lY.getLen();function nC(n5,lZ){var l0=lZ;for(;;){if(l1<=l0)return df(l2,lV);var l3=lY.safeGet(l0);if(37===l3){var l$=function(l6,l5){return caml_array_get(l7,l4(l6,l5));},mf=function(mh,ma,mc,l8){var l9=l8;for(;;){var l_=lY.safeGet(l9)-32|0;if(!(l_<0||25<l_))switch(l_){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 10:return mi(lY,function(mb,mg){var me=[0,l$(mb,ma),mc];return mf(mh,md(mb,ma),me,mg);},l9+1|0);default:var mj=l9+1|0,l9=mj;continue;}var mk=lY.safeGet(l9);if(124<=mk)var ml=0;else switch(mk){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var mn=l$(mh,ma),mo=caml_format_int(mm(mk,lY,l0,l9,mc),mn),mq=mp(md(mh,ma),mo,l9+1|0),ml=1;break;case 69:case 71:case 101:case 102:case 103:var mr=l$(mh,ma),ms=caml_format_float(kt(lY,l0,l9,mc),mr),mq=mp(md(mh,ma),ms,l9+1|0),ml=1;break;case 76:case 108:case 110:var mt=lY.safeGet(l9+1|0)-88|0;if(mt<0||32<mt)var mu=1;else switch(mt){case 0:case 12:case 17:case 23:case 29:case 32:var mv=l9+1|0,mw=mk-108|0;if(mw<0||2<mw)var mx=0;else{switch(mw){case 1:var mx=0,my=0;break;case 2:var mz=l$(mh,ma),mA=caml_format_int(kt(lY,l0,mv,mc),mz),my=1;break;default:var mB=l$(mh,ma),mA=caml_format_int(kt(lY,l0,mv,mc),mB),my=1;}if(my){var mC=mA,mx=1;}}if(!mx){var mD=l$(mh,ma),mC=caml_int64_format(kt(lY,l0,mv,mc),mD);}var mq=mp(md(mh,ma),mC,mv+1|0),ml=1,mu=0;break;default:var mu=1;}if(mu){var mE=l$(mh,ma),mF=caml_format_int(mm(110,lY,l0,l9,mc),mE),mq=mp(md(mh,ma),mF,l9+1|0),ml=1;}break;case 37:case 64:var mq=mp(ma,d9(1,mk),l9+1|0),ml=1;break;case 83:case 115:var mG=l$(mh,ma);if(115===mk)var mH=mG;else{var mI=[0,0],mJ=0,mK=mG.getLen()-1|0;if(!(mK<mJ)){var mL=mJ;for(;;){var mM=mG.safeGet(mL),mN=14<=mM?34===mM?1:92===mM?1:0:11<=mM?13<=mM?1:0:8<=mM?1:0,mO=mN?2:caml_is_printable(mM)?1:4;mI[1]=mI[1]+mO|0;var mP=mL+1|0;if(mK!==mL){var mL=mP;continue;}break;}}if(mI[1]===mG.getLen())var mQ=mG;else{var mR=caml_create_string(mI[1]);mI[1]=0;var mS=0,mT=mG.getLen()-1|0;if(!(mT<mS)){var mU=mS;for(;;){var mV=mG.safeGet(mU),mW=mV-34|0;if(mW<0||58<mW)if(-20<=mW)var mX=1;else{switch(mW+34|0){case 8:mR.safeSet(mI[1],92);mI[1]+=1;mR.safeSet(mI[1],98);var mY=1;break;case 9:mR.safeSet(mI[1],92);mI[1]+=1;mR.safeSet(mI[1],116);var mY=1;break;case 10:mR.safeSet(mI[1],92);mI[1]+=1;mR.safeSet(mI[1],110);var mY=1;break;case 13:mR.safeSet(mI[1],92);mI[1]+=1;mR.safeSet(mI[1],114);var mY=1;break;default:var mX=1,mY=0;}if(mY)var mX=0;}else var mX=(mW-1|0)<0||56<(mW-1|0)?(mR.safeSet(mI[1],92),mI[1]+=1,mR.safeSet(mI[1],mV),0):1;if(mX)if(caml_is_printable(mV))mR.safeSet(mI[1],mV);else{mR.safeSet(mI[1],92);mI[1]+=1;mR.safeSet(mI[1],48+(mV/100|0)|0);mI[1]+=1;mR.safeSet(mI[1],48+((mV/10|0)%10|0)|0);mI[1]+=1;mR.safeSet(mI[1],48+(mV%10|0)|0);}mI[1]+=1;var mZ=mU+1|0;if(mT!==mU){var mU=mZ;continue;}break;}}var mQ=mR;}var mH=c1(cc,c1(mQ,cd));}if(l9===(l0+1|0))var m0=mH;else{var m1=kt(lY,l0,l9,mc);try {var m2=0,m3=1;for(;;){if(m1.getLen()<=m3)var m4=[0,0,m2];else{var m5=m1.safeGet(m3);if(49<=m5)if(58<=m5)var m6=0;else{var m4=[0,caml_int_of_string(d$(m1,m3,(m1.getLen()-m3|0)-1|0)),m2],m6=1;}else{if(45===m5){var m8=m3+1|0,m7=1,m2=m7,m3=m8;continue;}var m6=0;}if(!m6){var m9=m3+1|0,m3=m9;continue;}}var m_=m4;break;}}catch(m$){if(m$[1]!==a)throw m$;var m_=j8(m1,0,115);}var na=m_[1],nb=mH.getLen(),nc=0,ng=m_[2],nf=32;if(na===nb&&0===nc){var nd=mH,ne=1;}else var ne=0;if(!ne)if(na<=nb)var nd=d$(mH,nc,nb);else{var nh=d9(na,nf);if(ng)ea(mH,nc,nh,0,nb);else ea(mH,nc,nh,na-nb|0,nb);var nd=nh;}var m0=nd;}var mq=mp(md(mh,ma),m0,l9+1|0),ml=1;break;case 67:case 99:var ni=l$(mh,ma);if(99===mk)var nj=d9(1,ni);else{if(39===ni)var nk=cB;else if(92===ni)var nk=cC;else{if(14<=ni)var nl=0;else switch(ni){case 8:var nk=cG,nl=1;break;case 9:var nk=cF,nl=1;break;case 10:var nk=cE,nl=1;break;case 13:var nk=cD,nl=1;break;default:var nl=0;}if(!nl)if(caml_is_printable(ni)){var nm=caml_create_string(1);nm.safeSet(0,ni);var nk=nm;}else{var nn=caml_create_string(4);nn.safeSet(0,92);nn.safeSet(1,48+(ni/100|0)|0);nn.safeSet(2,48+((ni/10|0)%10|0)|0);nn.safeSet(3,48+(ni%10|0)|0);var nk=nn;}}var nj=c1(ca,c1(nk,cb));}var mq=mp(md(mh,ma),nj,l9+1|0),ml=1;break;case 66:case 98:var np=l9+1|0,no=l$(mh,ma)?cK:cJ,mq=mp(md(mh,ma),no,np),ml=1;break;case 40:case 123:var nq=l$(mh,ma),nr=kR(lm,mk,lY,l9+1|0);if(123===mk){var ns=jQ(nq.getLen()),nw=function(nu,nt){jS(ns,nt);return nu+1|0;};lC(nq,function(nv,ny,nx){if(nv)jT(ns,b6);else jS(ns,37);return nw(ny,nx);},nw);var nz=jR(ns),mq=mp(md(mh,ma),nz,nr),ml=1;}else{var nA=md(mh,ma),nD=jY(nB(nq),nA),mq=nF(function(nE){return nC(nD,nr);},nA,nq,l7),ml=1;}break;case 33:df(nG,lV);var mq=nC(ma,l9+1|0),ml=1;break;case 41:var mq=mp(ma,cg,l9+1|0),ml=1;break;case 44:var mq=mp(ma,cf,l9+1|0),ml=1;break;case 70:var nH=l$(mh,ma);if(0===mc)var nI=ce;else{var nJ=kt(lY,l0,l9,mc);if(70===mk)nJ.safeSet(nJ.getLen()-1|0,103);var nI=nJ;}var nK=caml_classify_float(nH);if(3===nK)var nL=nH<0?b_:b9;else if(4<=nK)var nL=b$;else{var nM=caml_format_float(nI,nH),nN=0,nO=nM.getLen();for(;;){if(nO<=nN)var nP=c1(nM,b8);else{var nQ=nM.safeGet(nN)-46|0,nR=nQ<0||23<nQ?55===nQ?1:0:(nQ-1|0)<0||21<(nQ-1|0)?1:0;if(!nR){var nS=nN+1|0,nN=nS;continue;}var nP=nM;}var nL=nP;break;}}var mq=mp(md(mh,ma),nL,l9+1|0),ml=1;break;case 91:var mq=kX(lY,l9,mk),ml=1;break;case 97:var nT=l$(mh,ma),nU=df(jZ,l4(mh,ma)),nV=l$(0,nU),nZ=l9+1|0,nY=md(mh,nU);if(nW)nX(dt(nT,0,nV));else dt(nT,lV,nV);var mq=nC(nY,nZ),ml=1;break;case 114:var mq=kX(lY,l9,mk),ml=1;break;case 116:var n0=l$(mh,ma),n2=l9+1|0,n1=md(mh,ma);if(nW)nX(df(n0,0));else df(n0,lV);var mq=nC(n1,n2),ml=1;break;default:var ml=0;}if(!ml)var mq=kX(lY,l9,mk);return mq;}},n7=l0+1|0,n4=0;return mi(lY,function(n6,n3){return mf(n6,n5,n4,n3);},n7);}dt(n8,lV,l3);var n9=l0+1|0,l0=n9;continue;}}function mp(oa,n_,n$){nX(n_);return nC(oa,n$);}return nC(ob,0);}var od=dt(nF,oc,jX(0)),oe=nB(lT);if(oe<0||6<oe){var or=function(of,ol){if(oe<=of){var og=caml_make_vect(oe,0),oj=function(oh,oi){return caml_array_set(og,(oe-oh|0)-1|0,oi);},ok=0,om=ol;for(;;){if(om){var on=om[2],oo=om[1];if(on){oj(ok,oo);var op=ok+1|0,ok=op,om=on;continue;}oj(ok,oo);}return dt(od,lT,og);}}return function(oq){return or(of+1|0,[0,oq,ol]);};},os=or(0,0);}else switch(oe){case 1:var os=function(ou){var ot=caml_make_vect(1,0);caml_array_set(ot,0,ou);return dt(od,lT,ot);};break;case 2:var os=function(ow,ox){var ov=caml_make_vect(2,0);caml_array_set(ov,0,ow);caml_array_set(ov,1,ox);return dt(od,lT,ov);};break;case 3:var os=function(oz,oA,oB){var oy=caml_make_vect(3,0);caml_array_set(oy,0,oz);caml_array_set(oy,1,oA);caml_array_set(oy,2,oB);return dt(od,lT,oy);};break;case 4:var os=function(oD,oE,oF,oG){var oC=caml_make_vect(4,0);caml_array_set(oC,0,oD);caml_array_set(oC,1,oE);caml_array_set(oC,2,oF);caml_array_set(oC,3,oG);return dt(od,lT,oC);};break;case 5:var os=function(oI,oJ,oK,oL,oM){var oH=caml_make_vect(5,0);caml_array_set(oH,0,oI);caml_array_set(oH,1,oJ);caml_array_set(oH,2,oK);caml_array_set(oH,3,oL);caml_array_set(oH,4,oM);return dt(od,lT,oH);};break;case 6:var os=function(oO,oP,oQ,oR,oS,oT){var oN=caml_make_vect(6,0);caml_array_set(oN,0,oO);caml_array_set(oN,1,oP);caml_array_set(oN,2,oQ);caml_array_set(oN,3,oR);caml_array_set(oN,4,oS);caml_array_set(oN,5,oT);return dt(od,lT,oN);};break;default:var os=dt(od,lT,[0]);}return os;}function o2(oU){return jQ(2*oU.getLen()|0);}function oZ(oX,oV){var oW=jR(oV);oV[2]=0;return df(oX,oW);}function o7(oY){var o1=df(oZ,oY);return o4(o3,1,o2,jS,jT,function(o0){return 0;},o1);}function o8(o6){return dt(o7,function(o5){return o5;},o6);}var o9=[0,0];32===ec;var o_=[];caml_update_dummy(o_,[0,o_,o_]);var o$=null,pf=undefined;function pe(pa,pb){return pa==o$?0:df(pb,pa);}function pg(pc,pd){return pc==o$?df(pd,0):pc;}var ph=false,pi=Array;function pk(pj){return pj instanceof pi?0:[0,new MlWrappedString(pj.toString())];}o9[1]=[0,pk,o9[1]];function pu(pl,pm){pl.appendChild(pm);return 0;}function pv(pn,po){pn.removeChild(po);return 0;}function pw(pq){return caml_js_wrap_callback(function(pp){if(pp){var pr=df(pq,pp);if(!(pr|0))pp.preventDefault();return pr;}var ps=event,pt=df(pq,ps);if(!(pt|0))ps.returnValue=pt;return pt;});}var px=this,py=px.document;function pG(pz,pA){return pz?df(pA,pz[1]):0;}function pD(pC,pB){return pC.createElement(pB.toString());}function pH(pF,pE){return pD(pF,pE);}var pI=[0,785140586];function p1(pJ,pK,pM,pL){for(;;){if(0===pJ&&0===pK)return pD(pM,pL);var pN=pI[1];if(785140586===pN){try {var pO=py.createElement(bQ.toString()),pP=bP.toString(),pQ=pO.tagName.toLowerCase()===pP?1:0,pR=pQ?pO.name===bO.toString()?1:0:pQ,pS=pR;}catch(pU){var pS=0;}var pT=pS?982028505:-1003883683;pI[1]=pT;continue;}if(982028505<=pN){var pV=new pi();pV.push(bT.toString(),pL.toString());pG(pJ,function(pW){pV.push(bU.toString(),caml_js_html_escape(pW),bV.toString());return 0;});pG(pK,function(pX){pV.push(bW.toString(),caml_js_html_escape(pX),bX.toString());return 0;});pV.push(bS.toString());return pM.createElement(pV.join(bR.toString()));}var pY=pD(pM,pL);pG(pJ,function(pZ){return pY.type=pZ;});pG(pK,function(p0){return pY.name=p0;});return pY;}}function qa(p4,p3,p2){return p1(p4,p3,p2,bC);}function qb(p5){return pH(p5,bE);}function qc(p6){return pH(p6,bF);}function qd(p7){return pH(p7,bI);}function qe(p8){return pH(p8,bK);}function qf(p9){return pH(p9,bL);}function qg(p_){return pH(p_,bM);}function qh(p$){return pD(p$,bN);}this.HTMLElement===pf;function qk(qj,qi){return 0===qi?k(bB):1===qi?qj:[0,748545537,[0,qj,qk(qj,qi-1|0)]];}var qM=by.slice(),qL=[0,257,258,0],qK=303;function qN(ql){throw [0,eC,fk(ql,0)];}function qO(qm){throw [0,eC,fk(qm,0)];}function qP(qn){return 3901498;}function qQ(qo){return -941236332;}function qR(qp){return 15949;}function qS(qq){return 17064;}function qT(qr){return 3553395;}function qU(qs){return 3802040;}function qV(qt){return 15500;}function qW(qu){return fk(qu,1);}function qX(qv){return [0,926224370,fk(qv,1)];}function qY(qw){return k(bz);}function qZ(qx){var qy=fk(qx,2);return [0,974443759,[0,qy,fk(qx,0)]];}function q0(qz){var qA=fk(qz,2);return [0,-783405316,[0,qA,fk(qz,0)]];}function q1(qB){var qC=fk(qB,2);return [0,748545537,[0,qC,fk(qB,0)]];}function q2(qD){var qE=fk(qD,1);return qk(qE,fk(qD,0));}function q3(qF){return [0,4298439,fk(qF,0)];}function q4(qG){var qH=fk(qG,2),qI=fk(qG,1);return [0,qI,qH,fk(qG,0)];}var q5=[0,[0,function(qJ){return k(bA);},q4,q3,q2,q1,q0,qZ,qY,qX,qW,qV,qU,qT,qS,qR,qQ,qP,qO,qN],qM,qL,bx,bw,bv,bu,bt,bs,br,qK,bq,bp,jy,bo,bn];function q$(q7){var q6=0;for(;;){var q8=ez(g,q6,q7);if(q8<0||21<q8){df(q7[1],q7);var q6=q8;continue;}switch(q8){case 1:var q_=q9(q7);break;case 2:var q_=1;break;case 3:var q_=[1,caml_int_of_string(eB(q7,q7[5]+1|0,q7[6]-1|0))];break;case 4:var q_=[0,eB(q7,q7[5],q7[6])];break;case 5:var q_=7;break;case 6:var q_=6;break;case 7:var q_=4;break;case 8:var q_=5;break;case 9:var q_=8;break;case 10:var q_=2;break;case 11:var q_=3;break;case 12:var q_=15;break;case 13:var q_=16;break;case 14:var q_=10;break;case 15:var q_=12;break;case 16:var q_=13;break;case 17:var q_=14;break;case 18:var q_=11;break;case 19:var q_=9;break;case 20:var q_=0;break;case 21:var q_=k(c1(bm,d9(1,q7[2].safeGet(q7[5]))));break;default:var q_=q$(q7);}return q_;}}function q9(rb){var ra=28;for(;;){var rc=ez(g,ra,rb);if(rc<0||2<rc){df(rb[1],rb);var ra=rc;continue;}switch(rc){case 1:var rd=0;break;case 2:var rd=q9(rb);break;default:var rd=1;}return rd;}}function ro(re){return fj(q5,2,q$,eA(re));}function ri(rf){if(typeof rf==="number")return 1003109192<=rf?bl:bk;var rg=rf[1];if(748545537<=rg){if(926224370<=rg){if(974443759<=rg){var rh=rf[2],rj=ri(rh[2]);return kR(o8,bj,ri(rh[1]),rj);}return dt(o8,bi,ri(rf[2]));}if(748545556<=rg)return dt(o8,bh,ri(rf[2]));var rk=rf[2],rl=ri(rk[2]);return kR(o8,bg,ri(rk[1]),rl);}if(4298439<=rg)return rf[2];var rm=rf[2],rn=ri(rm[2]);return kR(o8,bf,ri(rm[1]),rn);}var rr=[0,function(rq,rp){return caml_compare(rq,rp);}];function rt(rs){return rs?rs[5]:0;}function rM(ru,rA,rz,rw){var rv=rt(ru),rx=rt(rw),ry=rx<=rv?rv+1|0:rx+1|0;return [0,ru,rA,rz,rw,ry];}function r3(rC,rB){return [0,0,rC,rB,0,1];}function r4(rD,rO,rN,rF){var rE=rD?rD[5]:0,rG=rF?rF[5]:0;if((rG+2|0)<rE){if(rD){var rH=rD[4],rI=rD[3],rJ=rD[2],rK=rD[1],rL=rt(rH);if(rL<=rt(rK))return rM(rK,rJ,rI,rM(rH,rO,rN,rF));if(rH){var rR=rH[3],rQ=rH[2],rP=rH[1],rS=rM(rH[4],rO,rN,rF);return rM(rM(rK,rJ,rI,rP),rQ,rR,rS);}return cM(cl);}return cM(ck);}if((rE+2|0)<rG){if(rF){var rT=rF[4],rU=rF[3],rV=rF[2],rW=rF[1],rX=rt(rW);if(rX<=rt(rT))return rM(rM(rD,rO,rN,rW),rV,rU,rT);if(rW){var r0=rW[3],rZ=rW[2],rY=rW[1],r1=rM(rW[4],rV,rU,rT);return rM(rM(rD,rO,rN,rY),rZ,r0,r1);}return cM(cj);}return cM(ci);}var r2=rG<=rE?rE+1|0:rG+1|0;return [0,rD,rO,rN,rF,r2];}var r5=0;function sd(r$,sc,r6){if(r6){var r7=r6[4],r8=r6[3],r9=r6[2],r_=r6[1],sb=r6[5],sa=dt(rr[1],r$,r9);return 0===sa?[0,r_,r$,sc,r7,sb]:0<=sa?r4(r_,r9,r8,sd(r$,sc,r7)):r4(sd(r$,sc,r_),r9,r8,r7);}return [0,0,r$,sc,0,1];}function tX(sg,se){var sf=se;for(;;){if(sf){var sk=sf[4],sj=sf[3],si=sf[1],sh=dt(rr[1],sg,sf[2]);if(0===sh)return sj;var sl=0<=sh?sk:si,sf=sl;continue;}throw [0,c];}}function so(sm){if(sm){var sn=sm[1];if(sn){var sr=sm[4],sq=sm[3],sp=sm[2];return r4(so(sn),sp,sq,sr);}return sm[4];}return cM(cm);}function sw(sx,ss,su){var st=ss,sv=su;for(;;){if(st){var sA=st[4],sz=st[3],sy=st[2],sB=kR(sx,sy,sz,sw(sx,st[1],sv)),st=sA,sv=sB;continue;}return sv;}}function sI(sE,sC){var sD=sC;for(;;){if(sD){var sH=sD[4],sG=sD[1],sF=dt(sE,sD[2],sD[3]);if(sF){var sJ=sI(sE,sG);if(sJ){var sD=sH;continue;}var sK=sJ;}else var sK=sF;return sK;}return 1;}}function sM(sO,sN,sL){if(sL){var sR=sL[4],sQ=sL[3],sP=sL[2];return r4(sM(sO,sN,sL[1]),sP,sQ,sR);}return r3(sO,sN);}function sT(sV,sU,sS){if(sS){var sY=sS[3],sX=sS[2],sW=sS[1];return r4(sW,sX,sY,sT(sV,sU,sS[4]));}return r3(sV,sU);}function s3(sZ,s5,s4,s0){if(sZ){if(s0){var s1=s0[5],s2=sZ[5],s$=s0[4],ta=s0[3],tb=s0[2],s_=s0[1],s6=sZ[4],s7=sZ[3],s8=sZ[2],s9=sZ[1];return (s1+2|0)<s2?r4(s9,s8,s7,s3(s6,s5,s4,s0)):(s2+2|0)<s1?r4(s3(sZ,s5,s4,s_),tb,ta,s$):rM(sZ,s5,s4,s0);}return sT(s5,s4,sZ);}return sM(s5,s4,s0);}function tf(tg,tc){if(tc){var td=tc[3],te=tc[2],ti=tc[4],th=tf(tg,tc[1]),tk=dt(tg,te,td),tj=tf(tg,ti);if(tk)return s3(th,te,td,tj);if(th)if(tj){var tl=tj;for(;;){if(!tl)throw [0,c];var tm=tl[1];if(tm){var tl=tm;continue;}var to=tl[3],tn=tl[2],tp=s3(th,tn,to,so(tj));break;}}else var tp=th;else var tp=tj;return tp;}return 0;}function tw(tq,ts){var tr=tq,tt=ts;for(;;){if(tr){var tu=tr[1],tv=[0,tr[2],tr[3],tr[4],tt],tr=tu,tt=tv;continue;}return tt;}}function tY(tJ,ty,tx){var tz=tw(tx,0),tA=tw(ty,0),tB=tz;for(;;){if(tA)if(tB){var tI=tB[4],tH=tB[3],tG=tB[2],tF=tA[4],tE=tA[3],tD=tA[2],tC=dt(rr[1],tA[1],tB[1]);if(0===tC){var tK=dt(tJ,tD,tG);if(0===tK){var tL=tw(tH,tI),tM=tw(tE,tF),tA=tM,tB=tL;continue;}var tN=tK;}else var tN=tC;}else var tN=1;else var tN=tB?-1:0;return tN;}}function tS(tO,tQ){var tP=tO,tR=tQ;for(;;){if(tR){var tV=tR[3],tU=tR[2],tT=tR[1],tW=[0,[0,tU,tV],tS(tP,tR[4])],tP=tW,tR=tT;continue;}return tP;}}var tZ=jx(rr),t2=jx([0,df(tY,function(t1,t0){return caml_compare(t1,t0);})]),t3=jx([0,tZ[10]]),t6=jx([0,function(t5,t4){return caml_compare(t5,t4);}]),t9=jx([0,function(t8,t7){return caml_compare(t8,t7);}]),ub=jx([0,function(t$,t_){var ua=dt(tZ[10],t$[1],t_[1]);return 0===ua?dt(t6[10],t$[2],t_[2]):ua;}]);function uq(uf){var ud=tZ[1];function ue(uc){return df(tZ[7],uc[1]);}return kR(ub[14],ue,uf,ud);}function ur(uj){var ui=tZ[1];return sw(function(ug,uh){return df(tZ[4],ug);},uj,ui);}function ut(um,uk){var uo=tS(0,uk);return dt(o8,a1,eb(a2,dh(function(ul){var un=df(um,ul[2]);return kR(o8,a3,ul[1],un);},uo)));}function us(up){return dt(o8,a4,eb(a5,dh(c2,df(tZ[20],up))));}var uu=[0,a0],uv=[0,aZ];function vY(uw){return [0,-783405316,[0,uw[1],uw[2]]];}function v8(ux){return [0,748545537,[0,ux[1],ux[2]]];}function uS(uz,uy){var uD=tZ[1];try {var uA=tX(uz,uy),uB=uA;}catch(uC){if(uC[1]!==c)throw uC;var uB=uD;}return uB;}function v2(uE){var uF=uE[3],uG=uE[2],uH=uE[1],uL=tZ[1];function uM(uI,uJ){var uK=dt(tZ[4],uI[3],uJ);return dt(tZ[4],uI[1],uK);}var uO=kR(t9[14],uM,uG,uL);function uP(uN){return dt(sd,uN,df(tZ[5],uN));}var uV=kR(tZ[14],uP,uO,r5);function uW(uQ,uT){var uR=uQ[1],uU=uS(uR,uT);return sd(uR,dt(tZ[4],uQ[3],uU),uT);}var uX=kR(t9[14],uW,uG,uV);a:for(;;){var u8=sw(function(uX){return function(u7,u5,u6){function u4(uY,u3){var u1=uS(uY,uX);function u2(u0,uZ){return dt(tZ[4],u0,uZ);}return kR(tZ[14],u2,u1,u3);}return sd(u7,kR(tZ[14],u4,u5,u5),u6);};}(uX),uX,r5),u9=tZ[11],u_=tw(uX,0),u$=tw(u8,0),va=u_;for(;;){if(u$)if(va){var vg=va[4],vf=va[3],ve=va[2],vd=u$[4],vc=u$[3],vb=u$[2],vh=0===dt(rr[1],u$[1],va[1])?1:0;if(vh){var vi=dt(u9,vb,ve);if(vi){var vj=tw(vf,vg),vk=tw(vc,vd),u$=vk,va=vj;continue;}var vl=vi;}else var vl=vh;var vm=vl;}else var vm=0;else var vm=va?0:1;if(vm){if(uH===uF)return k(aY);var vo=function(vn){return vn[1]===uH?1:0;},vp=dt(t9[17],vo,uG),vq=df(t9[20],vp);if(vq){var vr=vq[2],vs=vq[1],vt=vs[3],vu=vs[2];if(vr){var vy=uS(vt,uX),vB=dL(function(vx,vv){var vw=uS(vv[3],uX);return dt(tZ[8],vx,vw);},vy,vr),vC=function(vA){var vz=uS(uF,uX);return 1-dt(tZ[3],vA,vz);},vD=dt(tZ[17],vC,vB);if(df(tZ[2],vD)){var vE=0,vF=0,vG=[0,[0,uH,vu,vt],vr];for(;;){if(vG){var vH=vG[2],vI=vG[1],vJ=vI[3],vK=uS(vJ,uX),vL=uS(vt,uX),vM=dt(tZ[8],vL,vK);if(vt===vJ&&df(tZ[2],vM))throw [0,d,aU];var vP=function(vO){var vN=uS(uF,uX);return 1-dt(tZ[3],vO,vN);};if(dt(tZ[16],vP,vM)){var vQ=[0,vI,vE],vE=vQ,vG=vH;continue;}var vR=[0,vI,vF],vF=vR,vG=vH;continue;}var vS=dJ(vF),vT=dJ(vE);if(0===vS)throw [0,d,aX];if(0===vT){if(vS){var vU=vS[2],vV=vS[1][2];if(vU){var vZ=[0,4298439,vV];return dL(function(vX,vW){return vY([0,vX,[0,4298439,vW[2]]]);},vZ,vU);}return [0,4298439,vV];}return k(aW);}var v1=function(v0){return 1-dM(v0,vS);},v4=v2([0,uH,dt(t9[17],v1,uG),uF]),v5=function(v3){return 1-dM(v3,vT);};return vY([0,v2([0,uH,dt(t9[17],v5,uG),uF]),v4]);}}var v6=df(tZ[23],vD),v7=v2([0,v6,uG,uF]);return v8([0,v2([0,uH,uG,v6]),v7]);}return vt===uF?[0,4298439,vu]:v8([0,[0,4298439,vu],v2([0,vt,uG,uF])]);}return k(aV);}var uX=u8;continue a;}}}var v9=ub[7],v_=ub[9];function wc(wd,v$){if(typeof v$!=="number"){var wa=v$[1];if(!(748545537<=wa)){if(4298439<=wa){var w8=df(tZ[5],wd),w9=dt(tZ[4],wd+1|0,w8),w_=df(t6[5],[0,v$[2],wd+1|0]),w$=[0,df(tZ[5],wd),w_],xa=df(ub[5],w$),xb=df(tZ[5],wd+1|0);return [0,[0,w9,xa,wd,df(t3[5],xb)],wd+2|0];}var xc=v$[2],xd=wc(wd,xc[1]),xe=wc(xd[2],xc[2]),xf=xe[1],xg=xd[1],xh=xf[3],xi=xf[2],xj=xg[3],xk=xg[2],xm=xe[2],xl=xf[4],xn=dt(tZ[6],xh,xf[1]),xo=dt(tZ[7],xg[1],xn),xu=t3[1],xt=xg[4],xv=function(xq){function xs(xp){var xr=dt(tZ[7],xq,xp);return df(t3[4],xr);}return dt(t3[14],xs,xl);},xx=kR(t3[14],xv,xt,xu),xy=function(xw){return dt(tZ[3],xj,xw[1]);},xz=dt(ub[17],xy,xk),xB=function(xA){return dt(tZ[3],xh,xA[1]);},xC=dt(ub[17],xB,xi),xJ=ub[1],xK=function(xD){var xF=xD[2];function xI(xE){var xG=dt(t6[7],xF,xE[2]),xH=[0,df(tZ[5],xj),xG];return df(ub[4],xH);}return dt(ub[14],xI,xC);},xL=kR(ub[14],xK,xz,xJ);return [0,[0,xo,dt(v9,dt(v_,dt(v_,dt(v9,xk,xi),xC),xz),xL),xj,xx],xm];}if(926224370<=wa){if(974443759<=wa){var wb=v$[2],we=wc(wd,wb[1]),wf=wc(we[2],wb[2]),wg=wf[1],wh=we[1],wi=wg[3],wj=wg[2],wk=wh[3],wl=wf[2],wm=dt(tZ[6],wi,wg[1]),wn=dt(tZ[7],wh[1],wm),wp=dt(t3[7],wh[4],wg[4]),wq=function(wo){return dt(tZ[3],wi,wo[1]);},wr=dt(ub[17],wq,wj),wv=ub[1],ww=function(ws){var wt=ws[2],wu=[0,df(tZ[5],wk),wt];return df(ub[4],wu);},wx=kR(ub[14],ww,wr,wv);return [0,[0,wn,dt(v9,dt(v_,dt(v9,wh[2],wj),wr),wx),wk,wp],wl];}var wy=wc(wd,v$[2]),wz=wy[1],wA=wz[3],wB=wz[4],wC=wz[2],wE=wy[2],wF=function(wD){return dt(tZ[3],wA,wD[1]);},wG=dt(ub[17],wF,wC),wK=ub[1],wL=function(wI){function wJ(wH){return df(ub[4],[0,wI,wH[2]]);}return dt(ub[14],wJ,wG);},wM=dt(v9,wC,kR(t3[14],wL,wB,wK));return [0,[0,wz[1],wM,wA,wB],wE];}if(!(748545556<=wa)){var wN=v$[2],wO=wc(wd,wN[1]),wP=wc(wO[2],wN[2]),wQ=wP[1],wR=wO[1],wS=wQ[3],wT=wQ[2],wU=wP[2],wV=dt(tZ[6],wS,wQ[1]),wX=dt(tZ[7],wR[1],wV),wY=function(wW){return dt(tZ[3],wS,wW[1]);},wZ=dt(ub[17],wY,wT),w4=ub[1],w3=wR[4],w5=function(w1){function w2(w0){return df(ub[4],[0,w1,w0[2]]);}return dt(ub[14],w2,wZ);},w6=kR(t3[14],w5,w3,w4),w7=dt(v9,dt(v_,dt(v9,wR[2],wT),wZ),w6);return [0,[0,wX,w7,wR[3],wQ[4]],wU];}}return k(aQ);}function Ae(xM){return wc(0,xM)[1];}function zd(xQ,y5,xN){var xO=xN[2],xP=xN[1],xV=xQ[2];function y4(xR,y3){var xT=ur(xR);function xU(xS){return dt(tZ[12],xS[1],xT);}var xW=dt(ub[17],xU,xV),yl=[0,ub[1],0];function ym(x1,yk){function xY(xX){if(xX){var x0=xY(xX[2]),xZ=xX[1],x2=x1[1],x3=uq(xZ),x4=dt(tZ[8],x2,x3),x5=df(tZ[2],x4);if(x5){var x8=tZ[1],x9=function(x6){var x7=tX(x6,xR);return df(tZ[4],x7);},x_=kR(tZ[14],x9,x2,x8),x$=dt(tZ[12],x_,xP);if(x$){var ye=x1[2],yf=function(ya){var yc=ya[1];function yd(yb){return caml_string_equal(yc,yb[1]);}return dt(t6[16],yd,xO);},yg=dt(t6[15],yf,ye),yh=1;}else{var yi=x$,yh=0;}}else{var yi=x5,yh=0;}if(!yh)var yg=yi;var yj=yg?[0,dt(ub[4],x1,xZ),[0,xZ,0]]:[0,xZ,0];return cU(yj,x0);}return xX;}return xY(yk);}var yr=kR(ub[14],ym,xW,yl),y2=dt(d_,function(yn){var yp=uq(yn);return sI(function(yq,yo){return dt(tZ[3],yo,xP)?dt(tZ[3],yq,yp):1;},xR);},yr);return dL(function(y1,yZ){var yX=df(t2[5],xR);function yY(ys,yW){var yU=t2[1];function yV(yw,yT){var yt=ys[1],yx=tf(function(yu,yv){return 1-dt(tZ[3],yu,yt);},yw),yy=df(t2[5],yx),yQ=ys[2];function yR(yz,yM){var yE=yz[2],yB=yz[1],yD=tZ[1];function yF(yA){return caml_string_equal(yB,yA[1])?df(tZ[4],yA[2]):function(yC){return yC;};}var yG=kR(t6[14],yF,xO,yD),yO=t2[1];function yP(yI){var yK=t2[1];function yL(yH){var yJ=sd(yE,yI,yH);return df(t2[4],yJ);}var yN=kR(t2[14],yL,yM,yK);return df(t2[7],yN);}return kR(tZ[14],yP,yG,yO);}var yS=kR(t6[14],yR,yQ,yy);return dt(t2[7],yS,yT);}return kR(t2[14],yV,yW,yU);}var y0=kR(ub[14],yY,yZ,yX);return dt(t2[7],y0,y1);},y3,y2);}var y6=kR(t2[14],y4,y5[2],t2[1]),y8=dt(tZ[9],y5[1],xP);function y9(y7){return df(tZ[4],y7[2]);}return [0,kR(t6[14],y9,xO,y8),y6];}function A2(zb,y_){var y$=y_[4],za=y_[3],zc=zb[3],zf=zb[4],ze=zb[2],zj=df(zd,[0,y_[1],y_[2],za,y$]),zk=jx([0,function(zh,zg){var zi=dt(tZ[10],zh[1],zg[1]);return 0===zi?dt(t2[10],zh[2],zg[2]):zi;}]);function z4(zl){var zp=df(zk[20],zl);return dt(o8,aR,eb(aS,dh(function(zm){var zn=df(t2[20],zm[2]),zo=dt(o8,a8,eb(a9,dh(df(ut,c2),zn)));return kR(o8,aT,us(zm[1]),zo);},zp)));}function zG(zF,zt,zq){var zr=zq[2],zs=zq[1];if(dt(zk[3],[0,zs,zr],zt))return zt;var zv=dt(zk[4],[0,zs,zr],zt),zw=function(zu){return dt(tZ[12],zu[1],zs);},z7=dt(ub[17],zw,ze),z8=function(zx,zH){var zy=dt(zj,[0,zs,zr],zx),zz=zy[2],zA=zy[1];if(dt(t3[3],zA,zf)){var zD=function(zB){var zC=ur(zB);return dt(t3[3],zC,y$);},zE=dt(t2[16],zD,zz);}else var zE=1;if(zE)return zG([0,zx,zF],zH,[0,zA,zz]);var zI=dt(zk[4],[0,zA,zz],zH),zJ=dJ([0,zx,zF]),zK=0,zL=zJ;for(;;){if(zL){var zN=zL[2],zM=zK+1|0,zK=zM,zL=zN;continue;}var zO=t9[1],zP=0,zQ=zJ;for(;;){if(zQ){var zR=zQ[2],z1=zP+1|0,z0=zQ[1][2],z2=function(zP,zR){return function(zS,zZ){var zT=zP+1|0,zU=zR,zV=zS[2];for(;;){if(zU){if(!dt(tZ[3],zV,zU[1][1])){var zY=zU[2],zX=zT+1|0,zT=zX,zU=zY;continue;}var zW=zT;}else var zW=zK;return dt(t9[4],[0,zP,zS[1],zW],zZ);}};}(zP,zR),z3=kR(t6[14],z2,z0,zO),zO=z3,zP=z1,zQ=zR;continue;}var z5=v2([0,0,zO,zK]),z6=z4(zI);throw [0,uu,df(zk[19],zI),z6,z5];}}};return kR(ub[14],z8,z7,zv);}try {var z9=r3(za,zc),z_=df(t2[5],z9),z$=[0,df(tZ[5],zc),z_],Aa=zG(0,zk[1],z$),Ab=z4(Aa),Ac=[0,df(zk[19],Aa),Ab,0];}catch(Ad){if(Ad[1]===uu)return [0,Ad[2],Ad[3],[0,Ad[4]]];throw Ad;}return Ac;}function A3(Ah,An,Am,Ag,Af){var Ai=dt(Ah,Ag,Af),Aj=Ai[3],Ak=Ai[2],Al=Ai[1];return Aj?[0,0,[0,[0,Ak,Ao(o8,aG,An,Am,Al,ri(Aj[1]))],0]]:[0,1,[0,[0,Ak,Ap(o8,aF,An,Am,Al)],0]];}function A4(Ax,AI,Aq){try {var Ar=ro(Aq),As=Ar[3],At=Ar[2],Au=Ar[1],Av=ri(As),Aw=ri(At),Ay=df(Ax,As),Az=df(Ax,At),AG=function(AA){return [0,1-AA[1],AA[2]];},AH=function(AC,AB){var AE=cU(AC[2],AB[2]),AD=AC[1],AF=AD?AB[1]:AD;return [0,AF,AE];};if(17064<=Au)if(3802040<=Au)if(3901498<=Au){var AJ=AG(Ap(AI,Aw,Av,Az,Ay)),AK=AJ[2],AL=AJ[1];if(AL)var AM=[0,AL,AK];else{var AN=AG(Ap(AI,Av,Aw,Ay,Az)),AO=cU(AK,AN[2]),AM=[0,AN[1],AO];}var AP=AM;}else var AP=Ap(AI,Aw,Av,Az,Ay);else if(3553395<=Au)var AP=Ap(AI,Av,Aw,Ay,Az);else{var AQ=AG(Ap(AI,Av,Aw,Ay,Az)),AP=AH(Ap(AI,Aw,Av,Az,Ay),AQ);}else if(15500===Au){var AR=Ap(AI,Av,Aw,Ay,Az),AP=AH(Ap(AI,Aw,Av,Az,Ay),AR);}else if(15949<=Au){var AS=Ap(AI,Av,Aw,Ay,Az),AP=AH(AG(Ap(AI,Aw,Av,Az,Ay)),AS);}else{var AT=AG(Ap(AI,Av,Aw,Ay,Az)),AP=AH(AG(Ap(AI,Aw,Av,Az,Ay)),AT);}var AU=AP[1],AW=AP[2],AV=AU?aP:aO,AX=17064<=Au?3802040<=Au?3901498<=Au?be:bd:3553395<=Au?bc:bb:15500===Au?a_:15949<=Au?ba:a$,AY=[0,AU,Ao(o8,aN,Aw,AX,Av,AV),AW];}catch(AZ){if(AZ[1]===a){var A0=[0,[0,aL,dt(o8,aM,AZ[2])],0];return [0,0,dt(o8,aK,Aq),A0];}if(AZ[1]===eD){var A1=[0,[0,aI,o8(aJ)],0];return [0,0,dt(o8,aH,Aq),A1];}throw AZ;}return AY;}var A5=dt(A4,Ae,df(A3,A2)),CA=al.toString(),Cz={"border":ak.toString(),"background":al.toString()},Cy=aj.toString(),Bf={"border":ai.toString(),"background":aj.toString(),"highlight":{"border":ak.toString(),"background":al.toString()}},Cx=ah.toString(),Cw={"border":ag.toString(),"background":ah.toString()},Cv=af.toString(),B0={"border":ae.toString(),"background":af.toString(),"highlight":{"border":ag.toString(),"background":ah.toString()}},Cu=ad.toString(),Ct={"border":ac.toString(),"background":ad.toString()},Cs=ab.toString(),Ba={"border":aa.toString(),"background":ab.toString(),"highlight":{"border":ac.toString(),"background":ad.toString()}};function Cj(A6){var A7=Ae(fj(q5,1,q$,eA(A6))),A8=A7[3],A9=A7[1],A_=av.toString(),A$=dt(o8,au,A8).toString(),Bb=[0,{"id":dt(o8,at,A8).toString(),"label":A$,"shape":A_,"color":Ba,"fontSize":27},0],Bj=27,Bi=dt(tZ[6],A8,A9);function Bk(Bc,Bg){var Bd=as.toString(),Be=dt(o8,ar,Bc).toString(),Bh=27;return [0,{"id":dt(o8,aq,Bc).toString(),"label":Be,"shape":Bd,"color":Bf,"fontSize":27},Bg];}var Bl=kR(tZ[14],Bk,Bi,Bb),Bm=df(tZ[22],A9)+1|0;function BC(Bo){var Bp=dh(function(Bn){return Bn;},Bo);if(Bp){var Bq=0,Br=Bp,Bx=Bp[2],Bu=Bp[1];for(;;){if(Br){var Bt=Br[2],Bs=Bq+1|0,Bq=Bs,Br=Bt;continue;}var Bv=caml_make_vect(Bq,Bu),Bw=1,By=Bx;for(;;){if(By){var Bz=By[2];Bv[Bw+1]=By[1];var BA=Bw+1|0,Bw=BA,By=Bz;continue;}var BB=Bv;break;}break;}}else var BB=[0];return caml_js_from_array(BB);}var B3=[0,Bm,Bl,0],B2=A7[2];function B4(BF,BD){var BE=BD[1],BL=BD[3],BK=BF[1];function BM(BH,BJ){var BG=aw.toString(),BI=c2(BE).toString();return [0,{"from":c2(BH).toString(),"to":BI,"style":BG},BJ];}var BN=kR(tZ[14],BM,BK,BL),BU=BF[2];function BV(BO,BT){var BR=ay.toString(),BQ=BO[1].toString(),BP=ax.toString(),BS=c2(BO[2]).toString();return [0,{"from":c2(BE).toString(),"to":BS,"fontSize":BP,"label":BQ,"style":BR},BT];}var BW=kR(t6[14],BV,BU,BN),BY=BD[2],BX=ap.toString(),BZ=dt(o8,ao,BE-Bm|0).toString(),B1=25;return [0,BE+1|0,[0,{"id":dt(o8,an,BE).toString(),"label":BZ,"shape":BX,"color":B0,"fontSize":25},BY],BW];}var B5=kR(ub[14],B4,B2,B3),B6=dt(o8,az,dt(o8,a6,eb(a7,dh(us,df(t3[20],A7[4]))))).toString(),B7=BC(B5[3]);return [0,{"nodes":BC(B5[2]),"edges":B7},B6];}function DK(B9){function B_(B8){throw [0,uv];}var B$=pg(py.getElementById(B9.toString()),B_),Ca=qa(0,0,py),Cb=qb(py),Cc=qc(py);Ca.size=20;Ca.value=am.toString();Cb.id=c1(B9,aE).toString();Cb.className=aD.toString();Cc.className=aC.toString();Ca.className=aB.toString();var Cd=qe(py);function Cf(Ce){return pv(B$,Ce);}pe(B$.firstChild,Cf);pu(B$,Cd);var Cg=qf(py),Ch=qg(py),Ci=qg(py);pu(B$,Cd);pu(Cd,Cg);pu(Cg,Ch);pu(Ch,Ca);pu(Cg,Ci);pu(Ci,Cb);pu(Ci,Cc);var Cm=dt(o8,aA,B9);function Cq(Cp){var Ck=new MlWrappedString(Ca.value);try {var Cl=Cj(Ck);window.data=Cl[1];caml_js_eval_string(Cm);var Cn=Cc.innerHTML=Cl[2];}catch(Co){return 0;}return Cn;}Cq(0);return Ca.onchange=pw(function(Cr){Cq(0);return ph;});}function CK(CC,CE){function CD(CB){return pv(CC,CB);}pe(CC.firstChild,CD);return pu(CC,CE);}function DA(CF,CJ,CH){var CG=pH(CF,bJ),CI=0===CH[1]?(CG.width=15,window.nope):(CG.width=20,window.ok);CJ.style.margin=J.toString();CG.src=CI;return CK(CJ,CG);}function DB(CL,CQ,CV,CS,CP,CR){var CM=qc(CL),CN=pH(CL,bG),CO=qh(CL);CM.innerHTML=CP.toString();CN.className=M.toString();CM.style.margin=L.toString();CK(CQ,CN);pu(CN,CM);pu(CN,CO);var C0=CR[3],C1=eb(C,dh(function(CT){var CU=CS?dt(o8,I,CT[1]):H;if(CV&&CS){var CW=G,CX=1;}else var CX=0;if(!CX)var CW=F;var CZ=c1(CW,CU),CY=CV?dt(o8,E,CT[2]):D;return c1(CY,CZ);},C0));function C6(C5,C4,C2){try {var C3=C1.safeGet(C2),C7=10===C3?C6(A,[0,C5,C4],C2+1|0):(h.safeSet(0,C3),C6(c1(C5,h),C4,C2+1|0));}catch(C8){if(C8[1]===b)return dJ([0,C5,C4]);throw C8;}return C7;}var C$=[0,K,C6(z,0,0)];return dK(function(C_){var C9=qd(CL);C9.innerHTML=C_.toString();pu(CO,C9);return pu(CO,pH(CL,bH));},C$);}function Em(Db){function Dc(Da){throw [0,uv];}var Dd=[0,0],De=[0,0],Dg=pg(py.getElementById(Db.toString()),Dc),Df=qe(py);pu(Dg,Df);function DC(Dh){var Di=De[1]<Dh?1:0;if(Di){Dd[1]=Dd[1]+1|0;De[1]=De[1]+1|0;var Dj=[0,0],Dk=[0,W],Dl=qa(0,0,py),Dm=qf(py),Dn=qg(py),Do=qg(py),Dp=qg(py),Dq=qg(py),Dr=p1(0,0,py,bD);pu(Df,Dm);pu(Dm,Dn);pu(Dm,Do);pu(Dm,Dp);pu(Dm,Dq);pu(Dn,Dr);pu(Do,Dl);Dn.style.verticalAlign=V.toString();Do.style.verticalAlign=U.toString();Dp.style.verticalAlign=T.toString();Dq.style.verticalAlign=S.toString();Dl.size=50;Dl.className=R.toString();Dl.value=Q.toString();Dl.onfocus=pw(function(Dt){Dl.value=X.toString();Dl.onfocus=pw(function(Ds){return ph;});return ph;});var DG=function(DF){var Du=new MlWrappedString(Dl.value);if(!caml_string_notequal(Du,Y)&&1<Dd[1]){pv(Df,Dm);Dd[1]=Dd[1]-1|0;var Dv=Dh===De[1]?1:0,Dw=Dv?(De[1]=De[1]-1|0,0):Dv;return Dw;}try {try {var Dx=df(A5,Du),Dy=Dx;}catch(Dz){if(Dz[1]!==eD)throw Dz;var Dy=B;}Dk[1]=Dy;DA(py,Dp,Dk[1]);if(0<Dj[1])DB(py,Dq,1,0,N,Dk[1]);var DD=DC(Dh+1|0);}catch(DE){return 0;}return DD;};Dl.onchange=pw(function(DH){DG(0);return ph;});Dr.style.width=P.toString();Dr.innerHTML=O.toString();var DJ=Dr.onclick=pw(function(DI){if(0===Dj[1]){Dr.innerHTML=Z.toString();Dj[1]=1;}else{Dr.innerHTML=$.toString();Dq.innerHTML=_.toString();Dj[1]=0;}DG(0);return ph;});}else var DJ=Di;return DJ;}return DC(1);}function Es(DM){function DN(DL){throw [0,uv];}var DO=pg(py.getElementById(DM.toString()),DN),DP=qa(0,0,py),DQ=qh(py),DR=qb(py),DS=qc(py),DT=qh(py),DU=qb(py),DV=qc(py),DW=qc(py);DP.size=50;DP.value=o.toString();DP.className=u.toString();DR.id=c1(DM,t).toString();DR.className=s.toString();DU.id=c1(DM,r).toString();DU.className=q.toString();var DX=qe(py);function DZ(DY){return pv(DO,DY);}pe(DO.firstChild,DZ);pu(DO,DX);var D0=qf(py),D1=qf(py),D2=qf(py),D3=qg(py),D4=qd(py),D5=qg(py),D6=qg(py),D7=qg(py);pu(DO,DX);pu(DX,D0);pu(DX,D1);pu(DX,D2);pu(D0,D3);pu(D3,DP);pu(D3,D4);pu(D1,D5);pu(D1,D6);pu(D5,DQ);pu(D5,DR);pu(D5,DS);pu(D6,DT);pu(D6,DU);pu(D6,DV);pu(D2,D7);pu(D7,DW);function Ed(Ea,D8){var D9=ri(D8),D_=Cj(D9),D$=D_[2];window.data=D_[1];caml_js_eval_string(kR(o8,v,DM,Ea));return 1===Ea?(DQ.innerHTML=c1(x,D9).toString(),DS.innerHTML=D$):(DT.innerHTML=c1(w,D9).toString(),DV.innerHTML=D$);}function Ek(Ej){var Eb=new MlWrappedString(DP.value);try {var Ec=ro(Eb);Ed(1,Ec[2]);Ed(2,Ec[3]);try {var Ee=df(A5,Eb),Ef=Ee;}catch(Eg){if(Eg[1]!==eD)throw Eg;var Ef=p;}DA(py,D4,Ef);var Eh=DB(py,DW,1,1,y,Ef);}catch(Ei){return 0;}return Eh;}Ek(0);return DP.onchange=pw(function(El){Ek(0);return ph;});}function Er(Eo,En){try {var Ep=df(Eo,En);}catch(Eq){if(Eq[1]===uv)return 0;throw Eq;}return Ep;}px.onload=pw(function(Et){Er(DK,n);Er(Es,m);Er(Em,l);return ph;});c3(0);return;}());
