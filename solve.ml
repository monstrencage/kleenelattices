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
open Tools
open Expr
open Exprtools
open Petri
open Simul

let inf se1 se2 e1 e2 =
  match simul (trad e1) (trad e2) with
  | None -> (true,Printf.sprintf "\n%s <= %s : true" se1 se2)
  | Some l -> 
    let w = print_expr l
    in (false,Printf.sprintf "\n%s <= %s : %s (false)" se1 se2 w)

let solve (c,e1,e2) =
  let not (a,b) = (not a,b)
  and ( && ) (a,b) (c,d) = (a && c,b^d)
  and ( || ) (a,b) (c,d) = (a || c,b^d)  in
  match c with
  | `Geq -> inf "e2" "e1" e2 e1
  | `Leq -> inf "e1" "e2" e1 e2
  | `Gt -> inf "e2" "e1"  e2 e1 && (not (inf "e1" "e2" e1 e2))
  | `Lt -> inf "e1" "e2" e1 e2 && (not (inf "e2" "e1"  e2 e1))
  | `Incomp -> (not (inf "e2" "e1" e2 e1)) && (not (inf "e1" "e2" e1 e2))
  | `Neq ->  (not (inf "e2" "e1" e2 e1)) || (not (inf "e1" "e2" e1 e2)) 
  | `Eq -> inf "e1" "e2"  e1 e2 && (inf "e2" "e1"  e2 e1)

let solve_file filename =
  let chin = open_in filename 
  and chout = open_out (filename^".res") in
  let rec aux () =
    try 
      let s = input_line chin in
      try
	let _,b = solve (get_eq s) in
	Printf.fprintf chout "%s : %s\n\n" s b;
	aux ()
      with Parsing.Parse_error -> aux ()
    with 
      End_of_file -> (close_out chout; close_in chin)
  in
  aux ()

