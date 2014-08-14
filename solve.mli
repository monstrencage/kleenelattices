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

(** Given a string reprensenting an equation, returns a boolean corresponding to
    the truth of the equation and a string containg a message
    to display, with for instance the witnesses, if some
    were computed.*)
val solve :
  string -> bool * string * (string * string) list

(** [solve_file filename dest] will process all equations in 
    [filename], and write an output in [dest.res]. *)
val solve_file : bool -> bool -> string -> string -> unit
