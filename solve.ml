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

let inf simul se1 se2 e1 e2 =
  match simul e1 e2 with
  | None -> (true,Printf.sprintf "\n%s <= %s -- true" se1 se2)
  | Some l -> 
    let w = print_expr l
    in (false,Printf.sprintf "\n%s <= %s -- false : %s" se1 se2 w)

let solve bld inf s=
  let (c,e1,e2) = (get_eq s) in
  let se1,se2 = (print_expr e1,print_expr e2) in
  let e1,e2 = (bld e1,bld e2) in
  let not (a,b) = (not a,b)
  and ( && ) (a,b) (c,d) = (a && c,b^d)
  in
  let res,b =
    match c with
    | `Geq -> inf se2 se1 e2 e1
    | `Leq -> inf se1 se2 e1 e2
    | `Gt -> (not (inf se1 se2 e1 e2)) && inf se2 se1  e2 e1
    | `Lt -> inf se1 se2 e1 e2 && (not (inf se2 se1  e2 e1))
    | `Incomp -> 
      (not (inf se1 se2 e1 e2)) && 
	(not (inf se2 se1 e2 e1)) 
    | `Neq ->  
      let a,b = (not (inf se1 se2 e1 e2)) 
      in 
      if a 
      then (a,b) 
      else 
	let c,d = (not (inf se2 se1 e2 e1))
	in (c,b^d)
    | `Eq -> inf se1 se2  e1 e2 && (inf se2 se1  e2 e1)
  in
  (res,
   Printf.sprintf "%s %s %s --------- %s\n%s\n\n" 
     se1 (print_comp c) se2 (if res then "OK" else "Incorrect") b)

let handle f x =
  try
    f x	
  with Parsing.Parse_error -> ()


let solve_file bld inf filename fdest =
  let chout = open_out (fdest^".res") in
  List.iter 
    (handle 
       (fun s -> 
	 Printf.fprintf chout "%s" 
	   (snd (solve bld inf s))))
       (input_file filename);
  close_out chout

let inf = inf Lts.simul

let solve = solve Lts.trad inf

let solve_file = solve_file Lts.trad inf
