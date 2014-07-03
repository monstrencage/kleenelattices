val get_eq : string -> Expr.comp * string Expr.expr * string Expr.expr
val inf : string Expr.expr -> string Expr.expr -> bool
val solve :
  Expr.comp * string Expr.expr * string Expr.expr -> bool
val solve_file : string -> unit
