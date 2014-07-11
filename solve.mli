(** Functions for processing equations. *)

(** Given an equation, returns a boolean corresponding to
    the truth of the equation and a string containg a message
    to display, with for instance the witnesses, if some
    were computed.*)
val solve :
  string Expr.eqs -> bool * string

(** [solve_file filename] will process all equations in [filename],
    and write an output in [filename.res]. *)
val solve_file : string -> unit
