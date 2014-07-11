(** Tools to be used in the project. *)

(** Implementation of maps with integer keys. *)
module IMap : Map.S with type key = int

(** Implementation of sets of integers. *)
module ISet : Set.S with type elt = int

(** Implementation of sets of maps with integer keys. *)
module MSet : Set.S with type elt = int IMap.t

(** Implementation of sets of sets of integers. *)
module ISSet : Set.S with type elt = ISet.t

(** Implementation of map with sets of integers as keys. *)
module ISMap : Map.S with type key = ISet.t

(** Implementation of sets of pairs of a sting and an integer. *)
module SISet : Set.S with type elt = string * int

(** [add_set s i m] will return a map where [s] is associated to a list
    containing all the previous bindings of [s] in [m] with the addition 
    of [i]. All the other bindings of [m] are unchanged. *)
val add_set : ISet.t -> 'a -> 'a list ISMap.t -> 'a list ISMap.t

(** [get_def default f a b] will try and compute [f a b], 
    and will return [default] if the exception [Not_found] is raised. *)
val get_def : 'a -> ('b -> 'c -> 'a) -> 'b -> 'c -> 'a

(** [bind f [a_1;a_2;...;a_n]] returns the list [(f a_1)@(f a_2)@...@(f a_n)].*)
val bind : ('a -> 'b list) -> 'a list -> 'b list

(** [ilst2set l] computes to the set of integers appearing in [l].*)
val ilst2set : int list -> ISet.t

(** Union-find structure, constructed using [UnionFind]. *)
module IUF : sig
  type item = int
  type state
  val initial : state
  val representative : item -> state -> item
  val equivalent : item -> item -> state -> bool
  val union : item -> item -> state -> state
  val domain : state -> item list
end

(** Tests the equality of the restriction to some finite domain of 
    two relations over integers. *)
val eqstates : (int -> int -> bool) -> (int -> int -> bool) -> 
  ISet.t -> bool

(** [img m] computes the set of integers [j] such that there is a string [x]
    and an index [i], such that [(x,j)] is in the binding of [i] in [m]. *)
val img : SISet.t IMap.t -> ISet.t

(** [dom m] computes the set of indexes that are bound to something in [m]. *)
val dom : 'a IMap.t -> ISet.t

(** Alias for ISet.t*)
type marquage = ISet.t

(** Maps from integers to sets of pairs of a string and an integer. *)
type tranche = SISet.t IMap.t

(** Type for equivalence relations. *)
type equiv = IUF.state

(** Type for labeled transition system with states of type ['a] 
    and transitions of type ['b]. *)
type ('a,'b) lts = 
  'a * ('b * marquage) list ISMap.t * ('a -> bool)

(** Alias for maps from integers to integers. *)
type readstate = int IMap.t

(** Alias for [MSet.t]. *)
type readstateset = MSet.t

(** Some type for transitions. *)
type trans = equiv * tranche

