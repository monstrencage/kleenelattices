%{
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
