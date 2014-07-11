(** Implementation of Petri Automata *)

(** A letter is either a true letter ([string]) or ε. *)
type lettre = string option

(** A place is a node of the petri net. *)
type place = int

(** Transitions in the petri net. Notice that an
    ε-transition between [p] and [q] can be encoded 
    as [Smpl (p,None,q)]. *)
type transition =
    Smpl of place * lettre * place
  | Open of place * (place * place)
  | Close of (place * place) * place

(** A net is given by its number of places together 
    with a list of transitions. *)
type net = int * transition list

(** Computes the petri automaton recognising a given
    expression. *)
val trad : string Expr.expr -> net

(** [one_step m (n,tr)] returns the list of transitions in [tr]
    such that all their inputs are within [m]. *)
val one_step : Tools.marquage -> net -> transition list

(** Makes a set of places move along a given transition. *)
val go : Tools.marquage -> transition -> Tools.marquage

(** Tests wether a set of places if final in the petri automaton,
    meaning that the final place can be reached from this set
    without using any transition of the form [Smpl (p,Some x,q)]. *)
val fn : net -> Tools.marquage -> bool
