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

(** Type of partial words. *)
type partword = int * Tools.TrSet.t * int Tools.IMap.t

(** Empty word. *)
val init : int -> partword

(** Reads a partial word according to some LTS transition. *)
val read : partword -> Tools.readstate -> Tools.trans 
  -> Tools.readstateset

(** Updates a partial word with a new LTS transition. *)
val evolve_word : partword -> Tools.trans -> partword

(** Closes a partial word, by merging all actives branches. *)
val close : partword -> word

(** Converts a list of transitions into a word. *)
val build_word : Tools.trans list -> word

(** Prints a word. *)
val print_word : word -> string

(** Prints a partword. *)
val printpartword : partword -> string

(** Converts a word into an expression. *)
val get_expr : word -> string Expr.ground
