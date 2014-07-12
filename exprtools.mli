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
(** Some basic tools to work with expressions. *)

(** Writes an expression as a string. *)
val print_expr : string Expr.expr -> string

(** Parses a given string as an expression over strings. *)
val get_string : string -> string Expr.expr

(** Parses a given string as an comparison between two 
    expressions over strings. *)
val get_eq : string -> Expr.comp * string Expr.expr * string Expr.expr

