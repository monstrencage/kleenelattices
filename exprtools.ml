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
  | `Zero -> "ø"
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


type 'a optexpr =
| E : 'a optexpr
| Z : 'a optexpr
| V : 'a -> 'a optexpr
| I : 'a optexpr list -> 'a optexpr
| C : 'a optexpr list -> 'a optexpr
| U : 'a optexpr list -> 'a optexpr
| S : 'a optexpr list -> 'a optexpr
| R : 'a optexpr -> 'a optexpr

let rec expr_of_optexpr : 'a optexpr -> 'a expr= function
  | E -> `Un
  | Z -> `Zero
  | V x -> `Var x
  | I [] -> failwith "expr_of_optexpr"
  | C [] -> `Un
  | U [] -> `Zero
  | I (t::[])
  | C (t::[])
  | U (t::[]) -> expr_of_optexpr t
  | I (t::l) -> `Inter (expr_of_optexpr t,expr_of_optexpr (I l))
  | C (t::l) -> `Conc (expr_of_optexpr t,expr_of_optexpr (C l))
  | U (t::l) -> `Union (expr_of_optexpr t,expr_of_optexpr (U l))
  | S t -> `Star (expr_of_optexpr (U t))
  | R t -> `Conv (expr_of_optexpr t)

let rec optexpr_of_expr : 'a expr -> 'a optexpr= function
  | `Un -> E
  | `Zero -> Z
  | `Var x -> V x
  | `Inter (e,f) -> I [optexpr_of_expr e;optexpr_of_expr f]
  | `Conc (e,f) -> C [optexpr_of_expr e;optexpr_of_expr f]
  | `Union (e,f) -> U [optexpr_of_expr e;optexpr_of_expr f]
  | `Star e -> S [optexpr_of_expr e]
  | `Conv e -> R (optexpr_of_expr e)

let sortexpr l = List.sort compare l

let rec arange = function
  | I l -> I (sortexpr (List.map arange l))
  | U l -> U (sortexpr (List.map arange l))
  | C l -> C (List.map arange l)
  | S l -> S (sortexpr (List.map arange l))
  | R e -> R (arange e)
  | e -> e

let clean e = 
  let rec clean_conc = function
    | [] -> []
    | E::l -> clean_conc l
    | Z::_ -> [Z]
    | (C l1)::l2 ->  clean_conc (l1@l2)
    | (U [a])::l2 -> clean_conc (a::l2)
    | (I [a])::l2 -> clean_conc (a::l2)
    | a::b -> 
      match (clean_conc b) with
      | [Z] -> [Z]
      | l -> (clean a)::l
  and clean_union = function
    | [] -> []
    | Z::l -> clean_union l
    | (C [a])::l -> clean_union (a::l)
    | (I [a])::l -> clean_union (a::l)
    | (U l1)::l2 -> clean_union (l1@l2)
    | a::b::c when a = b -> clean_union (a::c)
    | a::l2 -> (clean a)::(clean_union l2)
  and clean_inter = function
    | [] -> []
    | Z::_ -> [Z]
    | (C [a])::l -> clean_inter (a::l)
    | (U [a])::l -> clean_inter (a::l)
    | (I l1)::l2 -> clean_inter (l1@l2)
    | a::b::c when a = b -> clean_inter (a::c)
    | a::l2 -> 
      match (clean_inter l2) with
      | [Z] -> [Z]
      | l -> (clean a)::l
  and clean = function
    | I l -> I (clean_inter l)
    | U l -> U (clean_union l)
    | C l -> C (clean_conc l)
    | S (E::l) -> clean (U [E;(S l)])
    | S l -> S (clean_union l)
    | R e -> R (clean e)
    | e -> e
  in
  let rec aux e = 
    let e' = clean ((arange e)) in
    if e'=e 
    then e 
    else aux e'
  in
  aux e

let rec prepare = function
  | I l -> I (List.map prepare l)
  | U l -> U (List.map prepare l)
  | C l -> C (List.map prepare l)
  | R e -> R (prepare e)
  | S l -> 
    let l' = List.map prepare l in
    let l1 =
      List.filter 
	(function E | I (E::_) -> true | _ -> false) l'
    in
    C[U (E::l1);S l';U(E::l1)]
  | e -> e

let distrib = 
  let rec aux = function
    | I l -> 
      begin
	match (aux_inter l) with
	| [U l] -> U l
	| l -> I l
      end
    | U l -> U (List.map aux l)
    | C l -> 
      begin
	match (aux_conc l) with
	| [U l] -> U l
	| l -> C l
      end
    | S l -> S (List.map aux l)
    | R e -> R (aux e)
    | e -> e
  and aux_inter = function
    | [] -> []
    | (U l1)::l2 -> 
      [U (List.map (fun a -> I (aux_inter (a::l2))) l1)]
    | a::l2 -> 
      match (aux_inter l2) with
      | [U l] ->  [U (List.map (fun b -> I (aux_inter (a::b::[]))) l)]
      | l -> (aux a)::l
  and aux_conc = function
    | [] -> []
    | (U l1)::l2 -> 
      [U (List.map (fun a -> C (a::l2)) l1)]
    | a::b -> 
      match (aux_conc b) with
      | [U l] ->  [U (List.map (fun b -> C (a::b::[])) l)]
      | l -> (aux a)::l
  in
  aux

let compreps =
  let rec aux = function
    | I l -> I (List.map aux l)
    | U l -> U (List.map aux l)
    | C l -> C (aux_conc l)
    | S l -> S (List.map aux l)
    | R e -> R (aux e)
    | e -> e
  and aux_conc = function
    | [] -> []
    | (I (E::l1))::(I(E::l2))::l3 ->
      aux_conc ((I (E::(l1@l2)))::l3)
    | e::l -> (aux e)::(aux_conc l)
  in
  aux

let normalise e =
  let rec transf e =
    let rec tr1 e = 
      let e' = distrib (clean e) in
      if e' = e
      then e
      else tr1 e' 
    in
    let e' = 
      clean (compreps 
	       (tr1 
		  (prepare (clean e)))) 
    in
    if e' = e
    then e
    else transf e' 
  in 
  (expr_of_optexpr (transf (optexpr_of_expr e)))
