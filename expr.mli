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
(** Types of expressions and comparisons.*)

(** Very general type, including ε, ø, union, intersection, sequence,
    converse and non-nul iteration. *)
type 'a expr = [
| `Var of 'a
| `Inter of 'a expr * 'a expr
| `Conc  of 'a expr * 'a expr
| `Union  of 'a expr * 'a expr
| `Zero
| `Un
| `Star of 'a expr
| `Conv of 'a expr ]

(** Without identity ε and ø. *)
type 'a rklm = [
| `Var of 'a
| `Inter of 'a rklm * 'a rklm
| `Conc  of 'a rklm * 'a rklm
| `Union  of 'a rklm * 'a rklm
| `Star of 'a rklm]

(** Without iteration. *)
type 'a rkli = [
| `Var of 'a
| `Inter of 'a rkli * 'a rkli
| `Conc  of 'a rkli * 'a rkli
| `Union  of 'a rkli * 'a rkli
| `Zero
| `Un ]

(** Without iteration and converse. *)
type 'a rkl = [
| `Var of 'a
| `Inter of 'a rkl * 'a rkl
| `Conc  of 'a rkl * 'a rkl
| `Union  of 'a rkl * 'a rkl
| `Zero ]

(** Only variables, intersections and sequences. *)
type 'a ground = [
| `Un
| `Var of 'a
| `Inter of 'a ground * 'a ground
| `Conc  of 'a ground * 'a ground ]

(** Type for comparisons. *)
type comp = [ `Geq | `Gt | `Leq | `Lt | `Incomp | `Neq | `Eq ]

(** Type of (in)equations. *)
type 'a eqs = comp * 'a expr * 'a expr
