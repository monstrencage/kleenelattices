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
  | (n,sim,None) -> 
    (true,
     [sim,Printf.sprintf "%s <= %s -- true (%d pairs)" se1 se2 n])
  | (n,sim,Some l) -> 
    let w = print_expr l
    in 
    (false,
     [sim,
      Printf.sprintf "%s <= %s -- false (%d pairs)\nWitness: %s" 
	se1 se2 n w])

let solve bld inf s=
  try
    let (c,e1,e2) = (get_eq s) in
    let se1,se2 = (print_expr e1,print_expr e2) in
    let e1,e2 = (bld e1,bld e2) in
    let not (a,b) = (not a,b)
    and ( && ) (a,b) (c,d) = (a && c,b@d)
    in
    let res,msg =
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
	  in (c,b@d)
      | `Eq -> inf se1 se2  e1 e2 && (inf se2 se1  e2 e1)
    in
    (res,
     Printf.sprintf "%s %s %s --------- %s" 
       se1 (print_comp c) se2 (if res then "OK" else "Incorrect"),
     msg)
  with 
    Failure msg ->
      (false,
       Printf.sprintf "%s --------- Failed" s,
       ["No result.",Printf.sprintf "Error : Failure(%s)" msg])
  | Parsing.Parse_error -> 
    (false,
     Printf.sprintf "%s --------- Failed" s,
     ["No result.",Printf.sprintf "Error : parsing error"])


let handle f x =
  try
    f x	
  with Parsing.Parse_error -> ()

let print_msg printDet printSim chout (sim,resdet) =
  if printDet
  then Printf.fprintf chout "\n%s\n" resdet; 
  if printSim
  then Printf.fprintf chout "Relation computed:\n%s\n" sim

let solve_file bld inf printDet printSim filename fdest =
  let chout = open_out (fdest^".res") in
  List.iter 
    (handle 
       (fun s -> 
	 let _,res,msg = (solve bld inf s) in
	 Printf.fprintf chout "%s\n" res;
	 List.iter (print_msg printDet printSim chout) msg;
	 Printf.fprintf chout "\n---------\n\n"))
    (input_file filename);
  close_out chout

let inf = inf Petri.simul

let solve = solve Petri.trad inf

let solve_file = solve_file Petri.trad inf
