{ (* Copyright (C) 2014 Paul Brunet
   
   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License along
   with this program; if not, write to the Free Software Foundation, Inc.,
   51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.*)
  open Parser 

}

let letter = [ 'a'-'z' 'A'-'Z' '0'-'9']
let skip = [ ' ' '\r' '\t' ',' ]
let digit = ['0'-'9']

rule token = parse
  | skip+        { token lexbuf }
  | "//"         { comment lexbuf }
  | '\n'         { NEWLINE }
  | letter+ as s { VAR s }
  | "^*"         { STAR }
  | "^+"         { PSTAR }
  | '+'          { PLUS }
  | '.'          { DOT }
  | "^"          { INTER } 
  | '('          { LPAR }
  | ')'          { RPAR }  
  | "=?="        { DUNNO }
  | "=/="        { DIFF }
  | "<="         { LEQ }
  | "<"          { LT }
  | ">"          { GT }
  | "<>"         { IMCOMP }
  | ">="         { GEQ }
  | "="          { EGAL }
  | eof          { EOF }
  | _ as s            { failwith ("lexing error"^(String.make 1 s)) }

and comment = parse
  | '\n' { NEWLINE }
  | eof  { EOF}
  | _    { comment lexbuf }
