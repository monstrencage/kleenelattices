val get_eq : string -> Expr.comp * string Expr.expr * string Expr.expr
val inf : string -> string -> string Expr.expr -> string Expr.expr -> bool * string
val solve :
  Expr.comp * string Expr.expr * string Expr.expr -> bool * string
val solve_file : string -> unit
