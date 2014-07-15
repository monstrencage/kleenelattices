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
(** Functions for processing equations. *)

(** Given an equation, returns a boolean corresponding to
    the truth of the equation and a string containg a message
    to display, with for instance the witnesses, if some
    were computed.*)
val solve1 :
  string Expr.eqs -> bool * string

(** [solve_file filename] will process all equations in [filename],
    and write an output in [filename.res]. *)
val solve_file1 : string -> string -> unit

(** Given an equation, returns a boolean corresponding to
    the truth of the equation and a string containg a message
    to display, with for instance the witnesses, if some
    were computed.*)
val solve2 :
  string Expr.eqs -> bool * string

(** [solve_file filename] will process all equations in [filename],
    and write an output in [filename.res]. *)
val solve_file2 : string -> string -> unit

(** Given an equation, returns a boolean corresponding to
    the truth of the equation and a string containg a message
    to display, with for instance the witnesses, if some
    were computed.*)
val solve3 :
  string Expr.eqs -> bool * string

(** [solve_file filename] will process all equations in [filename],
    and write an output in [filename.res]. *)
val solve_file3 : string -> string -> unit
