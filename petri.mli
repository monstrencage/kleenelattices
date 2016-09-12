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
(** Module for Petri Automata. *)

(** Type of an automaton. *)
type t = Tools.ISet.t * Tools.Trans.t * int

(** Union of automata. *)
val union : t -> t -> t

(** Sequential product of automata. *)
val concat : t -> t -> t

(** Iteration of an automaton. *)
val pstar : t -> t

(** Intersection of automata. *)
val inter : t -> t -> t

(** Conversion of an expression into an automaton. *)
val trad : string Expr.expr -> t

(** Makes a configuration go through a transition. *)
val progress : Tools.ISet.t -> Tools.ptrans -> Tools.ISet.t

(** Makes an embedding go through a transition. *)
val read : Tools.readstate -> Tools.ptrans -> Tools.Trans.t -> Tools.MSet.t

(** Tries to find a ground term recognised by the first automaton
    that is not recognised by the second. In case of success, 
    returns said term.
    Otherwise returns [None]. 
    It also returns the number of pairs examined, and a [string] 
    representing these pairs. *)
val simul : t -> t -> int * string * string Expr.ground option
