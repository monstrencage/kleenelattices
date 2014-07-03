val get_string : string -> string Expr.expr
type lettre = string option
type place = int
type transition =
    Smpl of place * lettre * place
  | Open of place * (place * place)
  | Close of (place * place) * place
type net = int * transition list
val trad : string Expr.expr -> net
type marquage = Tools.ISet.t
val one_step : marquage -> net -> transition list
val go : marquage -> transition -> marquage
val fn : net -> marquage -> bool
