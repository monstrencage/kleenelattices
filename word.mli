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
(** Converting a series of transitions into a word, and printing it. *)

(** Type of words. *)
type word = int * Tools.TrSet.t * int

(** Converts a list of transitions into a word. *)
val graph : Tools.ptrans list -> word

(** Prints a word. *)
val print_word : word -> string


(** Converts a word into an expression. *)
val get_expr : word -> string Expr.ground
