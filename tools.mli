(* Copyright (C) 2014 Paul Brunet
   
   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License along
   with this program; if not, write to the Free Software Foundation, Inc.,
   51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.*)
(** Tools to be used in the project. *)

(** {3 Usefull modules.} *)
(** Implementation of maps with integer keys. *)
module IMap : Map.S with type key = int

(** Implementation of sets of integers. *)
module ISet : Set.S with type elt = int

(** Implementation of sets of maps with integer keys. *)
module MSet : Set.S with type elt = int IMap.t

(** Implementation of sets of sets of integers. *)
module ISSet : Set.S with type elt = ISet.t

(** Implementation of sets of pairs of a sting and an integer. *)
module SISet : Set.S with type elt = string * int

(** Sets of transitions, as triples. *)
module TrSet : Set.S with type elt = int * string * int

(** Sets of petri transitions. *)
module Trans : Set.S with type elt = ISet.t * SISet.t

(** {3 Types and exceptions.}*)

(** Petri transitions *)
type ptrans = ISet.t * SISet.t

(** Alias for ISet.t*)
type marquage = ISet.t

(** Alias for maps from integers to integers. *)
type readstate = int IMap.t

(** Exception to be raised when a ground term proving 
    non-inclusion has been found. *)
exception ContreExemple of int * string * string Expr.ground

(** Exception to be raised when a HTML [id] tag can't be found. *)
exception NotDefined

(** {3 Some basic functions.} *)

(** [get_def default f a b] will try and compute [f a b], 
    and will return [default] if the exception [Not_found] is raised. *)
val get_def : 'a -> ('b -> 'c -> 'a) -> 'b -> 'c -> 'a

(** [bind f [a_1;a_2;...;a_n]] returns the list [(f a_1)@(f a_2)@...@(f a_n)].*)
val bind : ('a -> 'b list) -> 'a list -> 'b list

(** [dom m] computes the set of indexes that are bound to something in [m]. *)
val dom : 'a IMap.t -> ISet.t

val input : Trans.t -> marquage

val img : readstate -> ISet.t -> ISet.t

(** {3 Printing functions.} *)

val printlist : ('a -> string) -> 'a list -> string

val printimap : ('a -> string) -> 'a IMap.t -> string

val printiset : ISet.t -> string
val printisset : ISSet.t -> string
val printsiset : SISet.t -> string
val printmset : MSet.t -> string
val printtrset : TrSet.t -> string

(** {3 Input function.} *)

(** List of the lines in a file. *)
val input_file : string -> string list
