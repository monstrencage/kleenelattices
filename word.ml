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
open Exprtools

type word = int * TrSet.t * int

let print_word (_,w,_) = 
  TrSet.fold 
    (fun (i,a,j) -> 
      Printf.sprintf "(%d,%s,%d); %s" i a j) 
    w 
    ""

let par = function
  | e1,e2 -> `Inter (e1,e2)

let conc = function
  | e1,e2 -> `Conc (e1,e2)
    
let succ k w =
  TrSet.elements (TrSet.filter (fun (i,_,_) -> i=k) w)

let get i m = get_def ISet.empty IMap.find i m

let reachability (_,w,k) =
  let dom = 
    TrSet.fold
      (fun (i,_,j) acc ->
	ISet.add i (ISet.add j acc))
      w
      ISet.empty
  in
  let id = ISet.fold (fun i -> IMap.add i (ISet.singleton i)) dom IMap.empty in
  let rec aux mat =
    let mat' =
      (IMap.fold
	 (fun i mi acc -> 
	   IMap.add 
	     i
	     (ISet.fold
		(fun j acc -> 
		  ISet.fold 
		    (fun k acc ->
		      ISet.add k acc)
		    (get j mat)
		    acc)
		mi
		mi)
	     acc)
	 mat
	 IMap.empty)
    in
    if IMap.equal ISet.equal mat' mat 
    then mat
    else aux mat'
  in
  aux 
    (TrSet.fold 
       (fun (i,_,j) m -> 
	 IMap.add i 
	   (ISet.add j (get i m))
	   m)
       w id)


let join r i j =
  let joints =
    ISet.inter (get i r) (get j r)
  in
  (if i=j then assert (not (ISet.is_empty joints));
   joints)

(*let print_reach r =
  IMap.fold
    (fun i ri ->
      Printf.sprintf "%d : %s\n%s"
	i
	(ISet.fold
	   (Printf.sprintf "%d,%s")
	   ri ""))
    r
    ""*)

let rec cleanup = function
  | `Var "" -> `Un
  | `Conc (e,f) -> `Conc (cleanup e,cleanup f)
  | `Inter (e,f) -> `Inter (cleanup e,cleanup f)
  | e -> e

let rec get_expr (i,w,o) =
  ((*Printf.printf "%d -> %d\n%s\n" i o (print_word (i,w,o))*));
  let e = 
    let r = reachability (i,w,o) in
    if i = o
    then failwith "get_expr : empty word"
    else
      match succ i w with
      | [] -> failwith "get_expr : stuck" (*`Zero*)
      | [(x,a,y)] -> 
	if y=o
	then `Var a
	else conc (`Var a,get_expr (y,w,o))
      | (x,a,y)::lst ->
	let joints =
	  ISet.filter
	    (fun ij -> not (ISet.mem ij (get o r)))
	    (List.fold_left
	       (fun joints (_,a,j) -> 
		 ISet.inter joints (get j r))
	       (get y r)
	       lst)
	in
	if not (ISet.is_empty joints)
	then 
	  (let ij = ISet.choose joints in
	   conc (get_expr (i,w,ij),get_expr (ij,w,o)))
	else 
	  let (now,later) =
	    List.partition
	      (fun (_,b,j) ->
		ISet.exists 
		  (fun k -> not (ISet.mem k (get o r))) 
		  (join r y j))
	      ((i,a,y)::lst)
	  in
	  (assert (later <> []);
	   if (now <> [])
	   then
	     (par
		(get_expr 
		   (i,TrSet.filter 
		     (fun tr -> not (List.mem tr now)) w,
		    o),
		 get_expr 
		   (i,TrSet.filter 
		     (fun tr -> not (List.mem tr later)) w,
		    o)))
	   else
	     begin
	       match later with
	       | [_,a,_] -> `Var a
	       | [] -> failwith "get_expr : stuck"
	       | (_,a,_)::later ->
		 (List.fold_left (fun e (_,a,_) -> par (e,`Var a)) 
		    (`Var a) later)
	     end)
  in
  (cleanup e)

let nu (tr : ptrans list) k p =
  fst
    (List.fold_left
       (fun (l,b) (s,t) -> 
	 if b 
	 then (l,b)
	 else
	   if l > k && ISet.mem p s
	   then (l,true)
	   else (l+1,false))
       (0,false)
       tr)

let graph tr =
  let n = List.length tr in
  let rec nu p k = function
    | [] -> n
    | (s,t)::lst -> 
      if ISet.mem p s 
      then k
      else nu p (k+1) lst
  in
  let rec aux e k = function
    | [] -> (0,e,n)
    | (s,t)::lst ->
      aux
	(SISet.fold
	   (fun (x,p) acc ->
	     Tools.TrSet.add (k,x, nu p (k+1) lst) acc)
	   t e)
	(k+1)
	lst
  in
  let w = 
    aux Tools.TrSet.empty 0 tr
  in
  w
