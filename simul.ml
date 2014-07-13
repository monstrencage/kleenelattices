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
open Petri


exception Nope

let correct_tr (m0 : marquage) ((eq,part),act: trans * marquage) 
    : bool = 
  let m = dom part 
  and supeq = ilst2set (IUF.domain eq) in
  ISet.subset (ISet.inter supeq m0) m && ISet.is_empty (ISet.inter supeq act)

let push (m : marquage) ((eq,part),actif : trans * marquage) 
    : transition -> trans * marquage = function
  | Smpl (p,Some x,q) -> 
    ((eq,
      ISet.fold 
	(fun k acc -> 
	  if IUF.equivalent k p eq 
	  then 
	    IMap.add k 
	      (SISet.add 
		 (x,q) 
		 (get_def SISet.empty IMap.find k part)) 
	      acc
	  else acc)
	m
	part),
     ISet.remove p actif)
  | Smpl (p,None,q) ->
    ((IUF.union p q eq,part),ISet.add q (ISet.remove p actif))
  | Open (p,(q1,q2)) ->
    ((IUF.union p q1 (IUF.union q1 q2 eq),part),
      ISet.add q1 (ISet.add q2 (ISet.remove p actif)))
  | Close ((p1,p2),q) ->
    ((IUF.union p1 p2 (IUF.union p1 q eq),part),
      ISet.add q (ISet.remove p1 (ISet.remove p2 actif)))

let targ (m : tranche) : marquage=
  IMap.fold 
    (fun _ -> SISet.fold (fun (_,j) -> ISet.add j)) m ISet.empty

let mkequiv : equiv -> int -> int -> bool = fun e i j ->
  IUF.equivalent i j e

let nextstep (n,tr : net) (m : marquage) 
    : (trans * marquage) list=
  let rec aux acc eq part actif =
    let trans = 
      List.map 
	(push m ((eq,part),actif))
	(one_step actif (n,tr))
    in
    List.fold_left
      (fun acc ((eq',part'),act') -> 
	if act' = actif
	then acc 
	else  
	  let acc' =
	    if correct_tr m ((eq',part'),act')
	    then
	      if List.exists 
		(fun ((e,p),_) -> 
		  IMap.equal 
		    SISet.equal p part' && 
		    eqstates (mkequiv e) (mkequiv eq') m)
		acc
	      then acc
	      else 
		((eq',part'),ISet.union act' (targ part'))
		::acc
	    else acc
	  in
	  aux acc' eq' part' act')
      acc
      trans
  in
  aux [] IUF.initial IMap.empty m


let getlts (pet : Petri.net) : (marquage,equiv * tranche) lts =
  let rec aux states lts = function
    | [] -> states,lts
    | m::todo ->
      if ISSet.mem m states
      then aux states lts todo 
      else 
	let st = ISSet.add m states in
	let lts',td' =
	  (List.fold_left 
	     (fun (lts,todo) ((r,tr),m') -> 
	       add_set m ((r,tr),m') lts,
	       if ISSet.mem m' st then todo else m'::todo)
	     (lts,todo)
	     (nextstep pet m))
	in
	aux st lts' td'
  in
  let (s,lts) = aux ISSet.empty ISMap.empty [ISet.singleton 0] in
  let fnst = ISSet.filter (fn pet) s in
  (ISet.singleton 0,lts,(fun m -> ISSet.mem m fnst))

exception Echec

let apply (m1 : readstate) (eq,t1 : trans) 
    : transition -> readstateset = function
    | Smpl (i,None,j) -> 
      MSet.singleton (IMap.add j (IMap.find i m1) (IMap.remove i m1))
    | Smpl (i,Some x,j) ->
      let k = IMap.find i m1 
      and m' = IMap.remove i m1 in
      SISet.fold
	(fun (_,k') -> MSet.add (IMap.add j k' m'))
	(SISet.filter 
	   (fun (w,_) -> w=x) 
	   (get_def SISet.empty IMap.find k t1))
	MSet.empty
    | Open (i,(j1,j2)) ->
      let k = IMap.find i m1 in
      MSet.singleton (IMap.add j1 k (IMap.add j2 k (IMap.remove i m1)))
    | Close ((i1,i2),j) ->
      let k1 = IMap.find i1 m1 
      and k2 = IMap.find i2 m1 in
      if mkequiv eq k1 k2 
      then 
	MSet.singleton 
	  (IMap.add j k1 (IMap.remove i1 (IMap.remove i2 m1)))
      else MSet.empty

type readtrans = tranche * ISet.t IMap.t

let move (i : int) (jl : int list) (tr2,tr2eps : readtrans) 
    : readtrans = 
  let tr2' = 
    IMap.map 
      (fun s -> 
	SISet.fold 
	  (fun (x,m) acc -> 
	    if m=i 
	    then 
	      List.fold_left 
		(fun acc j -> SISet.add (x,j) acc) 
		acc jl
	    else SISet.add (x,m) acc) 
	  s SISet.empty)
      tr2
  and tr2eps' =
    let js = ilst2set jl in
    IMap.map (fun s -> if ISet.mem i s then ISet.union js (ISet.remove i s) else s)
      tr2eps
  in
  (tr2',tr2eps')

let pred (i : int) tr2eps : ISet.t =
  IMap.fold 
    (fun k s acc -> 
      if ISet.mem i s then ISet.add k acc else acc)
    tr2eps
    ISet.empty

let tryandmove i x j (tr2,tr2eps : readtrans) 
    : readtrans =
  if IMap.exists 
    (fun _ s -> SISet.exists (fun (_,l) -> l=i) s)
    tr2
  then raise Echec
  else
    let newbindings = 
      ISet.fold
	(fun k -> IMap.add k (SISet.singleton (x,j)))
	(pred i tr2eps)
	IMap.empty
    in
    (IMap.merge 
       (fun _ a b -> 
	 match (a,b) with
	 | None,None -> None
	 | Some x,None | None,Some x -> Some x
	 | Some s1,Some s2 -> Some (SISet.union s1 s2))
       tr2 newbindings,
     IMap.map
       (ISet.remove i) tr2eps)

let add_trans (acc :readtrans)
    : transition -> readtrans = function
  | Smpl (i,None,j) -> 
    move i [j] acc
  | Smpl (i,Some x,j) ->
    tryandmove i x j acc
  | Close ((i1,i2),j) ->
    move i1 [j] (move i2 [j] acc)
  | Open (i,(j1,j2)) ->
    move i [j1;j2] acc

(*let sortmaps l1 =
  List.fast_sort (IMap.compare compare) l1*)

let ( >> ) 
    (m1,(eq,t1) : readstate * trans) 
    (m2,(t2,t2eps) : readstate * readtrans) : bool =
    (IMap.for_all
       (fun i ->
	 ISet.for_all
	   (fun j ->
	     let k = (IMap.find i m1) in
	     if IMap.mem k t1
	     then false
	     else
	       mkequiv eq (IMap.find j m2) k))
       t2eps)
    &&
      (IMap.for_all
	 (fun i ->
	   SISet.for_all 
	     (fun (x,j) ->
	       SISet.mem 
		 (x,IMap.find j m2) 
		 (IMap.find (IMap.find i m1) t1)))
	 t2)

let simulstep (pet2 : Petri.net) (eq,t1 : trans) (m1lst : readstateset)
    : readstateset =
(** tries to find a sequence of transitions in pet2 
    that allow for m1 to be transformed in something
    compatible with t1. *)
  let rec aux m1 (m,(tr2,tr2eps)) =
    let trpos = (one_step (dom m) pet2) in
    bind
      (fun t2 ->
	try 
	  let tr2' = add_trans (tr2,tr2eps) t2 in
	  MSet.fold
	    (fun m' acc -> 
	      if (m1,(eq,t1)) >> (m',tr2') 
	      then (tr2',m')::acc
	      else (aux m1 (m',tr2'))@acc) 
	    (apply m (eq,t1) t2)
	    []
	with Echec -> [])
      trpos
  in
  let trinit m1 acc =
    (m1,
     (IMap.empty,
      IMap.fold 
	(fun i _ -> 
	  IMap.add i (ISet.singleton i)) 
	m1 
	IMap.empty))::acc
  in
  (List.fold_left 
     (fun acc (_,m) -> MSet.add m acc)
     MSet.empty
     (bind (fun (m1,tr2) -> aux m1 (m1,tr2)) 
	(MSet.fold trinit m1lst [])))

let fninf (fn1 : marquage -> bool) (pet2 : Petri.net) 
    (mark,m1 : marquage * readstateset) : bool =
  if fn1 mark
  then
    MSet.exists
      (fun m1 ->
	let mark2 = 
	  (IMap.fold (fun i _ -> ISet.add i) m1 ISet.empty) 
	in
	fn pet2 mark2)
      m1
  else true

exception ContreExemple of trans list

let simul pet1 pet2 =
  let module LMMap = 
	Map.Make(struct 
	  type t = ISet.t * MSet.t
	  let compare (i,m) (j,n) =
	    let t = ISet.compare i j in
	    if t = 0
	    then MSet.compare m n
	    else t
	end)
  in
  let (init,lts,fn1) = getlts pet1 in
  let rec aux trlst acc k (mk,ms) =
    (*let mk,ms = ilst2set mark, mlst2set m1 in*)
    if LMMap.mem (mk,ms) acc
    then ()
    else 
      let acc' = LMMap.add (mk,ms) k acc in
      if fninf fn1 pet2 (mk,ms)
      then
	let next =  get_def [] ISMap.find mk lts in
	if next = []
	then ()
	else
	  List.iter
	    (fun ((eq,t1),mark') -> 
	      aux ((eq,t1)::trlst) acc' (k+1) (mark',simulstep pet2 (eq,t1) ms))
	    next
      else raise 
	(ContreExemple trlst)
  in
  try
    (aux [] LMMap.empty 0 (ISet.singleton 0,MSet.singleton (IMap.singleton 0 0))); None
  with ContreExemple x -> Some (Word.get_expr (Word.build_word (List.rev x)))



