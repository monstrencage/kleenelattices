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


type t = ISet.t * Trans.t * int * ISSet.t

let ( ++ ) = Trans.union
let ( -- ) = Trans.diff

let union (p1,t1,i1,f1 : t) (p2,t2,i2,f2 : t) : t =
  let p = ISet.union p1 (ISet.remove i2 p2)
  and i = i1
  and f = ISSet.union f1 f2
  and ti2 = (Trans.filter (fun (x,_) -> (ISet.mem i2 x)) t2)
  in
  let t = t1 ++ t2 -- ti2 ++ 
    (Trans.fold 
       (fun (_,t) -> Trans.add (ISet.singleton i1,t)) 
       ti2 Trans.empty) in
  (p,t,i,f)

let concat (p1,t1,i1,f1 : t) (p2,t2,i2,f2 : t) : t =
  let p = ISet.union p1 (ISet.remove i2 p2)
  and i = i1
  and f = f2
  and ti2 = (Trans.filter (fun (x,_) -> (ISet.mem i2 x)) t2)
  in
  let t = t1 ++ t2 -- ti2 ++
    (ISSet.fold
       (fun f -> 
	 Trans.fold
	   (fun (_,t) ->
	     Trans.add (f,t))
	   ti2)
       f1
       Trans.empty) in
  (p,t,i,f)

let pstar  (p1,t1,i1,f1 : t) : t =
  let p = p1
  and i = i1
  and f = f1
  and ti1 = (Trans.filter (fun (x,_) -> (ISet.mem i1 x)) t1)
  in
  let t = t1 ++
    (ISSet.fold
       (fun f -> 
	 Trans.fold
	   (fun (_,t) ->
	     Trans.add (f,t))
	   ti1)
       f1
       Trans.empty) in
  (p,t,i,f)

let inter (p1,t1,i1,f1 : t) (p2,t2,i2,f2 : t) : t =
  let p = ISet.union p1 (ISet.remove i2 p2)
  and i = i1
  and f = 
    ISSet.fold 
      (fun f -> 
	ISSet.fold 
	  (fun f' -> 
	    ISSet.add 
	      (ISet.union f f')) 
	  f2) 
      f1 ISSet.empty
  and ti1 = (Trans.filter (fun (x,_) -> (ISet.mem i1 x)) t1)
  and ti2 = (Trans.filter (fun (x,_) -> (ISet.mem i2 x)) t2)
  in
  let t = t1 ++ t2 -- ti2 -- ti1 ++
    (Trans.fold
       (fun (_,t1) -> 
	 Trans.fold
	   (fun (_,t2) ->
	     Trans.add (ISet.singleton i1,SISet.union t1 t2))
	   ti2)
       ti1
       Trans.empty) in
  (p,t,i,f)

let trad =
  let rec aux k = function    
    | `Un -> aux k (`Var "")
    | `Var a ->
      let p = ISet.add (k+1) (ISet.singleton k)
      and t = 
	Trans.singleton 
	  (ISet.singleton k,SISet.singleton (a,k+1))
      and i = k
      and f = ISSet.singleton (ISet.singleton (k+1)) in
      ((p,t,i,f),k+2)
    | `Union (e,f) ->
      let (a1,k1) = aux k e in
      let (a2,k2) = aux k1 f in
      (union a1 a2, k2)
    | `Conc (e,f) -> 
      let (a1,k1) = aux k e in
      let (a2,k2) = aux k1 f in
      (concat a1 a2, k2)    
    | `Inter (`Un,f) -> 
      let (a1,k1) = aux k `Un in
      let (a2,k2) = aux k1 f in
      (pstar (inter a1 a2), k2)
    | `Inter (e,f) -> 
      let (a1,k1) = aux k e in
      let (a2,k2) = aux k1 f in
      ((inter a1 a2), k2)
    | `Star e -> 
      let (a1,k1) = aux k e in
      (pstar a1, k1)
    | `Conv _ | `Zero ->
      failwith "Petri.trad : unsupported operation"
  in
  (fun e -> (fst (aux 0 (Normal.normalise e))))


let candidates (p2,t2,i2,f2 : t) (m : readstate) (s,t : ptrans) 
    : Trans.t list =
  let c0 = dom m in
  let transet = 
    ISet.fold (fun q -> Trans.add (ISet.singleton q,SISet.singleton ("",q))) c0 t2
  in
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
  let cand = (Trans.filter (fun (s',t') -> ISet.subset s' c0) transet)
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
    (p2,t2,i2,f2 : t) (c,e : ISet.t * MSet.t) (s,t : ptrans) =
  let succ m acc =
    let cand = (candidates (p2,t2,i2,f2) m (s,t)) in
    List.fold_left 
      (fun acc tr -> 
	MSet.union (read m (s,t) tr) acc) 
      acc cand
  in
  (progress c (s,t),MSet.fold succ e MSet.empty)

exception Found of string Expr.ground

let simul (p1,t1,i1,f1 : t) (p2,t2,i2,f2 : t) = 
  let step = simul_step (p2,t2,i2,f2) in
  let get_word p = 
    Word.get_expr (Word.graph (List.rev p))
  in
  let lmcomp (i,m) (j,n) =
    match ISet.compare i j with
    | 0 -> MSet.compare m n
    | t -> t
  in
  let module LMSet = 
	Set.Make(struct 
	  type t = ISet.t * MSet.t
	  let compare = lmcomp
	end)
  in
  let init = 
    (ISet.singleton i1,MSet.singleton (IMap.singleton i2 i1))
  in
  let accesspath trans a =
    let augm (path,b) =
      let next = 
	List.filter (fun (x,t,y) -> lmcomp x b = 0) trans
      in
      List.map
	(fun (_,t,c) ->
	  if lmcomp c a = 0 
	  then raise (Found (get_word (t::path)))
	  else (t::path,c))
	next
    in
    let rec aux state =
      aux (Tools.bind augm state)
    in
    try aux [[],init]
    with Found x -> x
  in
  let rec final trans acc (c,e) =
    if LMSet.mem (c,e) acc
    then false 
    else
      if (ISSet.mem c f1)
      then 
	if (MSet.exists (fun m -> ISSet.mem (dom m) f2) e)
	then true
	else 
	  let acc' = (LMSet.add (c,e) acc) in
	  List.exists
	    (fun (a,(_,t),b) -> 
	      (lmcomp a (c,e) = 0) 
	      && (SISet.exists 
		    (function ("",_) -> true | _ -> false) t)
	      && (final trans acc' b))
	    trans
      else false
  in
  let good trans (c,e) = 
    if (ISSet.mem c f1)
    then final trans LMSet.empty (c,e)
    else true
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
  let rec aux path (sim,trans) (c,e) =
    if LMSet.mem (c,e) sim
    then (sim,trans)
    else
      begin
	Trans.fold
	  (fun tr (sim,trans) ->
	    let (c',e') = step (c,e) tr in
(*	    if good (c',e') 
	    then*) aux (tr::path) (sim,(((c,e),tr,(c',e'))::trans)) (c',e')
(*	    else 
	      let acc' = LMSet.add (c',e') acc
	      in raise (ContreExemple (LMSet.cardinal acc',
				       printLMS acc',
				       get_word (tr::path)))*))
	  (Trans.filter (fun (s,_) -> ISet.subset s c) t1)
	  (LMSet.add (c,e) sim,trans)
      end
  in
(*  try *)
    let s,trans =
      aux 
	[]
	(LMSet.empty,[]) 
	init
    in
    let contrex = 
      let bad = LMSet.filter (fun a -> not (good trans a)) s
      in
      if LMSet.is_empty bad 
      then None
      else Some (accesspath trans (LMSet.choose bad))
    in
    (LMSet.cardinal s,printLMS s,contrex)
(*  with
    ContreExemple (n,s,p) -> (n,s,Some p)*)
