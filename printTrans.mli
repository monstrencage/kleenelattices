
module TrSet : Set.S with
  type elt = int * string * int

type word = int * TrSet.t * int

val build_word :  Simul.trans list -> word

val print_word : word -> string

val get_expression : word -> string Expr.expr

val print_trace : Simul.trans list -> string
