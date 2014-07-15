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
(** Computes the simulation of two petri automata. *)

(** Computes a labeled transition system from a petri automaton. *)
val getlts :
  Petri.net ->
  (Tools.readstate * Tools.tranche) Tools.lts

(** Tries to find a series of transitions of the first net
    such that the associated word is not recognised by the
    second net. In case of success, returns said series of transition.
    Otherwise returns [None]. *)
val simul : Petri.net -> Petri.net -> string Expr.expr option

(** Tries to find a series of transitions of the first net
    such that the associated word is not recognised by the
    second net. In case of success, returns said series of transition.
    Otherwise returns [None]. 
val simul2 : Petri.net -> Petri.net -> string Expr.expr option
*)
