(** For drawing petri automata as image files.*)

(** [draws_petri opts format p filename] draws the
    automata [p] in the file [filename.format], with
    [opts] being some options passed to [dot]. *)
val draw_petri : string -> string -> Petri.net -> string -> unit
