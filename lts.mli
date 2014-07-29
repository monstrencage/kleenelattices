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
(** Direct constructions of LTS from expressions, 
    and LTS simulation. *)

(** Computes an LTS from an identity-free expression. *)
val trad : string Expr.expr -> Tools.lts

(** Computes an accessible LTS from an identity-free expression. *)
val tradOpt : string Expr.expr -> Tools.lts

(** Tries to find a ground term of the first LTS that
    is not recognised by the second LTS. In case of success, 
    returns said term.
    Otherwise returns [None]. *)
val simul :
  Tools.lts -> Tools.lts -> string Expr.ground option

(** {3 Operators on LTS.} *)


val union : Tools.lts -> Tools.lts -> Tools.lts
val concat : Tools.lts -> Tools.lts -> Tools.lts
val inter : Tools.lts -> Tools.lts -> Tools.lts
val iter : Tools.lts -> Tools.lts

(** Keeps only the accessible states of the LTS. *)
val clean : Tools.lts -> Tools.lts

val decomposed : Tools.lts -> bool

val complete : Tools.lts -> bool
