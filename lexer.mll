{ open Parser 

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
