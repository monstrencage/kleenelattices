open Tools
open Expr
open Petri
open Simul

let get_eq s =
  Parser.equation Lexer.token (Lexing.from_string s)

let inf e1 e2 =
  match simul (trad e1) (trad e2) with
  | None -> true
  | Some l -> (*assert (PrintTrans.test l);*)false

let solve (c,e1,e2) =
  match c with
  | `Geq -> inf e2 e1
  | `Gt -> inf e2 e1 && (not (inf e1 e2))
  | `Leq -> inf e1 e2
  | `Lt -> inf e1 e2 && (not (inf e2 e1))
  | `Incomp -> (not (inf e2 e1)) && (not (inf e1 e2))
  | `Neq ->  (not (inf e2 e1)) || (not (inf e1 e2)) 
  | `Eq -> inf e1 e2 && (inf e2 e1)

let solve_file filename =
  let chin = open_in filename 
  and chout = open_out (filename^".res") in
  let rec aux () =
    try 
      let s = input_line chin in
      try
	let b = solve (get_eq s) in
	Printf.fprintf chout "%s : %b\n" s b;
	aux ()
      with Parsing.Parse_error -> aux ()
    with 
      End_of_file -> (close_out chout; close_in chin)
  in
  aux ()

