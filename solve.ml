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

let inf simul se1 se2 e1 e2 =
  match simul e1 e2 with
  | None -> (true,Printf.sprintf "\n%s <= %s : true" se1 se2)
  | Some l -> 
    let w = print_expr l
    in (false,Printf.sprintf "\n%s <= %s : false (%s)" se1 se2 w)

let solve bld inf (c,e1,e2) =
  let e1,e2 = (bld e1,bld e2) in
  let not (a,b) = (not a,b)
  and ( && ) (a,b) (c,d) = (a && c,b^d)
  in
  match c with
  | `Geq -> inf "e2" "e1" e2 e1
  | `Leq -> inf "e1" "e2" e1 e2
  | `Gt -> (not (inf "e1" "e2" e1 e2)) && inf "e2" "e1"  e2 e1
  | `Lt -> inf "e1" "e2" e1 e2 && (not (inf "e2" "e1"  e2 e1))
  | `Incomp -> 
    (not (inf "e1" "e2" e1 e2)) && 
      (not (inf "e2" "e1" e2 e1)) 
  | `Neq ->  
    let a,b = (not (inf "e1" "e2" e1 e2)) 
    in 
    if a 
    then (a,b) 
    else 
      let c,d = (not (inf "e2" "e1" e2 e1))
      in (c,b^d)
  | `Eq -> inf "e1" "e2"  e1 e2 && (inf "e2" "e1"  e2 e1)

let solve_file bld inf filename fdest =
  let chin = open_in filename 
  and chout = open_out (fdest^".res") in
  let rec aux () =
    try 
      let s = input_line chin in
      try
	Printf.printf "Computing %s\n" s;
	let res,b = solve bld inf (get_eq s) in
	Printf.fprintf chout "%s --------- %s\n%s\n\n" 
	  s (if res then "OK" else "Incorrect") b;
	aux ()
      with Parsing.Parse_error -> aux ()
    with 
      End_of_file -> (close_out chout; close_in chin)
  in
  aux ()

let inf1 = inf Simul.simul

let inf2 = inf Lts.simul

let solve1 = solve trad inf1

let solve_file1 = solve_file trad inf1

let solve2 = solve (fun e -> Simul.getlts (trad e)) inf2

let solve_file2 = solve_file (fun e -> Simul.getlts (trad e)) inf2

let solve3 = solve Lts.trad inf2

let solve_file3 = solve_file Lts.trad inf2
