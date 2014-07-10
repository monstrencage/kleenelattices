val equiv : Tools.IUF.item -> Tools.IUF.item -> Tools.IUF.state -> bool
val canon :
  Simul.trans list ->
  Tools.SISet.t Tools.IMap.t list
val img : Tools.SISet.t Tools.IMap.t -> Tools.ISet.t
val dom : 'a Tools.IMap.t -> Tools.ISet.t
val ok_lst : Tools.SISet.t Tools.IMap.t list -> bool
val test : (Tools.IUF.state * Tools.SISet.t Tools.IMap.t) list -> bool
val add : 'a -> 'a list -> int -> 'a list
val aux :
  Tools.SISet.t Tools.IMap.t ->
  (Tools.IMap.key list *
   string Expr.expr)
  Tools.IMap.t * Tools.ISet.t ->
  (Tools.IMap.key list * string Expr.expr) Tools.IMap.t * Tools.ISet.t
val trad :
  Tools.SISet.t Tools.IMap.t list ->
  string Expr.expr
val print_expr : string Expr.expr -> string
