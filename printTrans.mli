(** Converting a series of transitions into a word, and printing it. *)

(** Type of words. *)
type word

(** Converts a list of transitions into a word. *)
val build_word :  Tools.trans list -> word

(** Prints a word. *)
val print_word : word -> string

(** Converts a word into an expression. *)
val get_expr : word -> string Expr.expr
