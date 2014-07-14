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


module TrSet = Set.Make(struct
  type t = int * string * int
  let compare = compare
end)

type word = int * TrSet.t * int

type partword = int * TrSet.t * int IMap.t

let init = (0,TrSet.empty,IMap.singleton 0 0)

let read mkrn (i0,w,f) m1 (eq,tr) =
  let rn = mkrn eq in
  if
    IMap.exists
      (fun i j -> IMap.find (rn i) m1 <> j)
      m1
  then (MSet.empty)
  else
    let dm = dom m1 in
    let m1' = 
      IMap.filter
	(fun i _ ->
	  if not (IMap.mem i tr)
	  then
	    ISet.for_all
	      (fun j -> rn i <> rn j)
	      dm
	  else false)
	m1
    in
    let aux i (a,j) m =
      let p = IMap.find i m1 in
      TrSet.fold
	(fun (_,_,q) -> MSet.add (IMap.add j q m))
	(TrSet.filter (fun (x,b,_) -> x = p && a=b) w)
	MSet.empty
    in
    let ms =
      IMap.fold
	(fun i tri ->
	  SISet.fold
	    (fun (a,j) ms ->
	      MSet.fold
		(fun m ->
		  MSet.union (aux i (a,j) m))
		ms
		MSet.empty)
	    tri)
	tr
	(MSet.singleton m1')
    in ms
      


let classes f rn =
  IMap.filter
    (fun _ s -> ISet.cardinal s > 1)
    (IMap.fold 
       (fun i p acc -> 
	 IMap.add 
	   (rn i) 
	   (ISet.add p (get_def ISet.empty IMap.find (rn i) acc)) 
	   acc) 
       f IMap.empty)

let rename p ps w =
  TrSet.fold 
    (fun (i,a,j) -> 
      if ISet.mem j ps 
      then TrSet.add (i,a,p)
      else TrSet.add (i,a,j))
    w
    TrSet.empty

let fresh (i0,w,f) = 
  1+(TrSet.fold (fun (i,_,j) m -> max i (max j m)) w i0)

let evolve_word mkrn (i0,w,f) (eq,t) =
  let k = fresh (i0,w,f) in
  let rn = mkrn eq in
  let cl = classes f rn in
  let m = dom t in
  let f0 = IMap.filter (fun i _ -> not (ISet.mem i m)) f in
  let f1 = 
    IMap.mapi 
      (fun i p -> 
	try IMap.find (rn i) f
	with Not_found -> p) 
      f 
  in
  assert (ISet.subset m (dom f));
  let w1 = 
    IMap.fold 
      (fun i ps w ->
	let p = IMap.find i f1 in 
	(rename p ps w))
      cl w
  in
  let (w2,f2,k2) =
    IMap.fold
      (fun i sis (w,f,k) ->
	let pi = IMap.find (rn i) f1 in
	SISet.fold
	  (fun (a,j) (w,f,k) ->
	    let (p',k) = 
	      try (IMap.find j f,k)
	      with Not_found -> (k,k+1)
	    in
	    (TrSet.add (pi,a,p') w,IMap.add j p' f,k))
	  sis
	  (w,f,k))
      t
      (w1,f0,k)
  in
  (i0,w2,f2)

let close (i,w,f) =
  let o = (fresh (i,w,f)) in
  (i,rename o (IMap.fold (fun _ -> ISet.add) f ISet.empty) w,o)

let build_word mkrn l =
  let i0,w,f = 
    List.fold_left (evolve_word mkrn) (0,TrSet.empty,IMap.singleton 0 0) l 
  in
  close (i0,w,f)

let print_word (_,w,_) = 
  TrSet.fold 
    (fun (i,a,j) -> 
      Printf.sprintf "(%d,%s,%d); %s" i a j) 
    w 
    ""


let par = function
  | `Zero,x | x,`Zero -> x
  | e1,e2 -> `Inter (e1,e2)

let conc = function
  | `Zero,x | x,`Zero -> `Zero
  | `Un,x | x,`Un -> x
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

let print_reach r =
  IMap.fold
    (fun i ri ->
      Printf.sprintf "%d : %s\n%s"
	i
	(ISet.fold
	   (Printf.sprintf "%d,%s")
	   ri ""))
    r
    ""

let rec get_expr (i,w,o) =
  ((*Printf.printf "%d -> %d\n%s\n" i o (print_word (i,w,o))*));
  let e = 
    let r = reachability (i,w,o) in
    if i = o
    then `Un
    else
      match succ i w with
      | [] -> `Zero
      | [(x,a,y)] -> conc (`Var a,get_expr (y,w,o))
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
	     (List.fold_left (fun e (_,a,_) -> par (e,`Var a)) 
		`Zero later))
  in
  e
