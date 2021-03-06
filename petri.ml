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


type t = ISet.t * Trans.t * int 

let ( ++ ) = Trans.union
let ( -- ) = Trans.diff

let union (p1,t1,i1 : t) (p2,t2,i2 : t) : t =
  let p = ISet.union p1 (ISet.remove i2 p2)
  and i = i1
  and ti2 = (Trans.filter (fun (x,_) -> (ISet.mem i2 x)) t2)
  in
  let t = t1 ++ t2 -- ti2 ++ 
    (Trans.fold 
       (fun (_,t) -> Trans.add (ISet.singleton i1,t)) 
       ti2 Trans.empty) in
  (p,t,i)

let concat (p1,t1,i1 : t) (p2,t2,i2 : t) : t =
  let p = ISet.union p1 (ISet.remove i2 p2)
  and i = i1
  and ti2 = (Trans.filter (fun (x,_) -> (ISet.mem i2 x)) t2)
  and tf1 = (Trans.filter (fun (_,x) -> (SISet.is_empty x)) t1)
  in
  let t = t1 ++ t2 -- ti2 -- tf1 ++
    (Trans.fold
       (fun (f,_) -> 
	 Trans.fold
	   (fun (_,t) ->
	     Trans.add (f,t))
	   ti2)
       tf1
       Trans.empty) in
  (p,t,i)

let pstar  (p1,t1,i1 : t) : t =
  let p = p1
  and i = i1
  and ti1 = (Trans.filter (fun (x,_) -> (ISet.mem i1 x)) t1)
  and tf1 = (Trans.filter (fun (_,x) -> (SISet.is_empty x)) t1)
  in
  let t = t1 ++
    (Trans.fold
       (fun (f,_) -> 
	 Trans.fold
	   (fun (_,t) ->
	     Trans.add (f,t))
	   ti1)
       tf1
       Trans.empty) in
  (p,t,i)

let inter (p1,t1,i1 : t) (p2,t2,i2 : t) : t =
  let p = ISet.union p1 (ISet.remove i2 p2)
  and i = i1
  and tf1 = (Trans.filter (fun (_,x) -> (SISet.is_empty x)) t1)
  and tf2 = (Trans.filter (fun (_,x) -> (SISet.is_empty x)) t2)
  and ti1 = (Trans.filter (fun (x,_) -> (ISet.mem i1 x)) t1)
  and ti2 = (Trans.filter (fun (x,_) -> (ISet.mem i2 x)) t2)
  in
  let tf = 
    Trans.fold 
      (fun (f,_) -> 
	Trans.fold 
	  (fun (f',_) -> 
	   Trans.add 
	     (ISet.union f f',SISet.empty)) 
	  tf2) 
      tf1 Trans.empty
  in
  let t = t1 ++ t2 -- ti2 -- ti1 --tf1 --tf2 ++ tf ++
	    (Trans.fold
	       (fun (_,t1) -> 
		Trans.fold
		  (fun (_,t2) ->
		   Trans.add (ISet.singleton i1,SISet.union t1 t2))
		  ti2)
	       ti1
	       Trans.empty) in
  (p,t,i)

let trad =
  let rec aux k = function
    | `Var a ->
      let p = ISet.add (k+1) (ISet.singleton k)
      and t =
	Trans.add
	  (ISet.singleton (k+1),SISet.empty)
	  (Trans.singleton 
	     (ISet.singleton k,SISet.singleton (a,k+1)))
      and i = k in
      ((p,t,i),k+2)
    | `Union (e,f) ->
      let (a1,k1) = aux k e in
      let (a2,k2) = aux k1 f in
      (union a1 a2, k2)
    | `Conc (e,f) -> 
      let (a1,k1) = aux k e in
      let (a2,k2) = aux k1 f in
      (concat a1 a2, k2)
    | `Inter (e,f) -> 
      let (a1,k1) = aux k e in
      let (a2,k2) = aux k1 f in
      ((inter a1 a2), k2)
    | `Star e -> 
      let (a1,k1) = aux k e in
      (pstar a1, k1)
    | `Conv _ | `Un | `Zero ->
      failwith "Petri.trad : unsupported operation"
  in
  (fun e -> (fst (aux 0 e)))


let candidates (p2,t2,i2 : t) (m : readstate) (s,t : ptrans) 
    : Trans.t list =
  let c0 = dom m in
  let compat trset (s',t') =
    (ISet.is_empty (ISet.inter s' (input trset)))
    &&
      (ISet.subset (img m s') s)
    &&
      (SISet.for_all 
	 (fun (x,_) -> 
	   SISet.exists (fun (y,_) -> x=y) t)
	 t')
  in
  let cand = (Trans.filter (fun (s',t') -> ISet.subset s' c0) t2)
  in
  List.filter
    (fun trset -> 
      let it = input trset in
      IMap.for_all
	(fun p2 p1 ->
	  if ISet.mem p1 s
	  then ISet.mem p2 it
	  else true)
	m)
    (Trans.fold
       (fun tr acc ->
	 bind 
	   (fun trset -> 
	     if compat trset tr 
	     then [Trans.add tr trset;trset]
	     else [trset])
	   acc)
       cand
       [Trans.empty])

let progress c (s,t : ptrans) =
 (SISet.fold 
    (fun (_,q) -> ISet.add q) 
    t 
    (ISet.diff c s))

let read_step
    (m1 : readstate) (s,t : ptrans) (m2 : readstate) (s',t' : ptrans)
    : MSet.t =
  let compat x = 
    SISet.fold 
      (fun (y,q) ->  
	if x = y 
	then (ISet.add q)
	else (fun s -> s))
      t
      ISet.empty
  in
  let ms = 
    MSet.singleton
      (IMap.filter (fun p _ -> not (ISet.mem p s')) m2) 
  in
  let add q q' ms =
    MSet.fold
      (fun m ->
	MSet.add
	  (IMap.add q q' m))
      ms
      MSet.empty
  in
  SISet.fold
    (fun (x,q) acc ->
      let vals = compat x in
      let upd q' = add q q' acc
      in
      ISet.fold
	(fun q' -> MSet.union (upd q'))
	vals
	MSet.empty)
    t'
    ms

let read m tr1 trset =
  Trans.fold
    (fun tr2 acc ->
      MSet.fold
	(fun m' acc ->
	  MSet.union (read_step m tr1 m' tr2) acc)
	acc
	MSet.empty)
    trset
    (MSet.singleton m)

let simul_step 
    (p2,t2,i2 : t) (c,e : ISet.t * MSet.t) (s,t : ptrans) =
  let succ m acc =
    let cand = (candidates (p2,t2,i2) m (s,t)) in
    List.fold_left 
      (fun acc tr -> 
	MSet.union (read m (s,t) tr) acc) 
      acc cand
  in
  (progress c (s,t),MSet.fold succ e MSet.empty)

let simul (p1,t1,i1 : t) (p2,t2,i2 : t) = 
  let step = simul_step (p2,t2,i2) in
  let get_word p = 
    Word.get_expr (Word.graph (List.rev p))
  in
  let good (c,e) =
    if ISet.is_empty c
    then MSet.exists (fun m -> ISet.is_empty (dom m)) e
    else true
  in
  let module LMSet = 
	Set.Make(struct 
	  type t = ISet.t * MSet.t
	  let compare (i,m) (j,n) =
	    match ISet.compare i j with
	    | 0 -> MSet.compare m n
	    | t -> t
	end)
  in
  let printLMS sim =
    Printf.sprintf "{%s}"
      (String.concat ",\n"
	 (List.map 
	    (fun (c,ms) -> 
	      Printf.sprintf "(%s,%s)" 
		(printiset c) (printmset ms)) 
	    (LMSet.elements sim)))
  in
  let rec aux path sim (c,e) =
    if LMSet.mem (c,e) sim
    then sim
    else
      begin
	Trans.fold
	  (fun tr acc ->
	    let (c',e') = step (c,e) tr in
	    if good (c',e') 
	    then aux (tr::path) acc (c',e')
	    else 
	      let acc' = LMSet.add (c',e') acc
	      in raise (ContreExemple (LMSet.cardinal acc',
				       printLMS acc',
				       get_word (tr::path))))
	  (Trans.filter (fun (s,_) -> ISet.subset s c) t1)
	  (LMSet.add (c,e) sim)
      end
  in
  try
    let s =
      aux 
	[]
	LMSet.empty 
	(ISet.singleton i1,MSet.singleton (IMap.singleton i2 i1))
    in
    (LMSet.cardinal s,printLMS s,None)
  with
    ContreExemple (n,s,p) -> (n,s,Some p)
