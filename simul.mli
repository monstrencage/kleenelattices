(** Computes the simulation of two petri automata. *)

(** Computes a labeled transition system from a petri automaton. *)
val getlts :
  Petri.net ->
  (Tools.marquage,(Tools.equiv * Tools.tranche)) Tools.lts

(** Tries to find a series of transitions of the first net
    such that the associated word is not recognised by the
    second net. In case of success, returns said series of transition.
    Otherwise returns [None]. *)
val simul : Petri.net -> Petri.net -> string Expr.expr option
