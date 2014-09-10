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
open Expr

let get_eq s =
  Parser.equation Lexer.token (Lexing.from_string s)

let get_string s = 
  Parser.exp Lexer.token (Lexing.from_string s)


let rec print_expr = function
  | `Var x -> x
  | `Inter (e,f) -> Printf.sprintf "(%s & %s)" (print_expr e) (print_expr f)
  | `Conc (e,f) ->  Printf.sprintf "%s.%s" (print_expr e) (print_expr f)
  | `Union (e,f) ->  Printf.sprintf "(%s | %s)" (print_expr e) (print_expr f)
  | `Zero -> "0" (*"ø"*)
  | `Un -> "1"(*"ε"*)
  | `Star e -> Printf.sprintf "(%s)+" (print_expr e)
  | `Conv e -> Printf.sprintf "(%s)~" (print_expr e)

let print_comp = function
  | `Geq -> ">="
  | `Gt -> ">"
  | `Leq -> "<="
  | `Lt -> "<"
  | `Incomp -> "<>"
  | `Neq -> "=/="
  | `Eq -> "="

let print_eq (c,e,f) =
  Printf.sprintf "%s %s %s" (print_expr e) (print_comp c) (print_expr f)
