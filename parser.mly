%{(* Copyright (C) 2014 Paul Brunet
   
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

  open Expr

  let to_int n = n

  let rec expand e = function
    | 0 -> `Zero
    | 1 -> e
    | n -> `Conc(e,expand e (n-1))
%}

%token <string> VAR 
%token <int> POWER
%token EOF NEWLINE LPAR RPAR PLUS DOT PSTAR STAR INTER
%token EGAL LEQ GEQ LT GT IMCOMP DUNNO DIFF  
%left PLUS 
%left INTER
%left DOT
%nonassoc STAR PSTAR POWER


%type <string Expr.expr> exp
%type <string Expr.eqs> equation
%start exp
%start equation

%%
equation:
| exp comp exp {$2,$1,$3}

exp:
| VAR                         
    { if $1="1" 
      then `Un 
      else 
	if $1="0" 
	then `Zero 
	else `Var $1 }
| exp POWER                 { expand $1 $2 }
| exp PLUS exp            { `Union($1,$3)}
| exp INTER exp            { `Inter($1,$3)}
| exp DOT exp             { `Conc($1,$3)}
| exp STAR                  { `Union (`Un,`Star $1)}
| exp PSTAR                  { `Star $1}
| LPAR exp RPAR             { $2 }

comp:
| EGAL {`Eq}
| LEQ {`Leq}
| GEQ {`Geq}
| LT {`Lt}
| GT {`Gt}
| IMCOMP {`Incomp}
| DIFF {`Neq}
