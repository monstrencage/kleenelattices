open Tools
open Expr


type t = ISet.t * PTrSet.t * int * ISSet.t


let ( ++ ) = PTrSet.union
let ( -- ) = PTrSet.diff

let union (p1,t1,i1,f1 : t) (p2,t2,i2,f2 : t) : t =
  let p = ISet.union p1 (ISet.remove i2 p2)
  and i = i1
  and f = ISSet.union f1 f2
  and ti2 = (PTrSet.filter (fun (x,_) -> (ISet.mem i2 x)) t2)
  in
  let t = t1 ++ t2 -- ti2 ++ 
    (PTrSet.fold 
       (fun (_,t) -> PTrSet.add (ISet.singleton i1,t)) 
       ti2 PTrSet.empty) in
  (p,t,i,f)

let concat (p1,t1,i1,f1 : t) (p2,t2,i2,f2 : t) : t =
  let p = ISet.union p1 (ISet.remove i2 p2)
  and i = i1
  and f = f2
  and ti2 = (PTrSet.filter (fun (x,_) -> (ISet.mem i2 x)) t2)
  in
  let t = t1 ++ t2 -- ti2 ++
    (ISSet.fold
       (fun f -> 
	 PTrSet.fold
	   (fun (_,t) ->
	     PTrSet.add (f,t))
	   ti2)
       f1
       PTrSet.empty) in
  (p,t,i,f)

let pstar  (p1,t1,i1,f1 : t) : t =
  let p = p1
  and i = i1
  and f = f1
  and ti1 = (PTrSet.filter (fun (x,_) -> (ISet.mem i1 x)) t1)
  in
  let t = t1 ++
    (ISSet.fold
       (fun f -> 
	 PTrSet.fold
	   (fun (_,t) ->
	     PTrSet.add (f,t))
	   ti1)
       f1
       PTrSet.empty) in
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
  and ti1 = (PTrSet.filter (fun (x,_) -> (ISet.mem i1 x)) t1)
  and ti2 = (PTrSet.filter (fun (x,_) -> (ISet.mem i2 x)) t2)
  in
  let t = t1 ++ t2 -- ti2 -- ti1 ++
    (PTrSet.fold
       (fun (_,t1) -> 
	 PTrSet.fold
	   (fun (_,t2) ->
	     PTrSet.add (ISet.singleton i1,SISet.union t1 t2))
	   ti2)
       ti1
       PTrSet.empty) in
  (p,t,i,f)

let trad =
  let rec aux k = function
    | `Var a ->
      let p = ISet.add (k+1) (ISet.singleton k)
      and t = 
	PTrSet.singleton 
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

let input trset =
  PTrSet.fold (fun (s,_) -> ISet.union s) trset ISet.empty

let img m s =
  ISet.fold
    (fun p -> ISet.add (IMap.find p m))
    s ISet.empty

let candidates (p2,t2,i2,f2 : t) (m : readstate) (s,t : ptrans) 
    : PTrSet.t list =
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
  let cand = (PTrSet.filter (fun (s',t') -> ISet.subset s' c0) t2)
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
    (PTrSet.fold
       (fun tr acc ->
	 bind 
	   (fun trset -> 
	     if compat trset tr 
	     then [PTrSet.add tr trset;trset]
	     else [trset])
	   acc)
       cand
       [PTrSet.empty])

let compatible m (s,_ : ptrans) = 
  ISet.for_all (fun p -> IMap.mem p m) s  

let valid 
    (m1 : readstate) (s,t : ptrans) (trset : PTrSet.t) (m2 :readstate) 
    =
  
    (IMap.for_all 
       (fun a p -> 
	 if ISet.mem p s 
	 then true 
	 else 
	   try (p=IMap.find a m2) 
	   with Not_found -> false)
       m1) &&
  (ISet.equal (input trset) 
     (ISet.inter s (IMap.fold (fun _ -> ISet.add) m1 ISet.empty)))
  &&
    (PTrSet.for_all
       (fun (s',t') ->
	 SISet.for_all
	   (fun (x,q) ->
	     try SISet.mem (x,IMap.find q m2) t
	     with Not_found -> false)
	   t')
       trset)

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
  PTrSet.fold
    (fun tr2 acc ->
      MSet.fold
	(fun m' acc ->
	  MSet.union (read_step m tr1 m' tr2) acc)
	acc
	MSet.empty)
    trset
    (MSet.singleton m)

let ( |> ) (t,m) l =
  if List.exists 
    (fun (t',m') -> PTrSet.equal t t' && IMap.equal ( = ) m m')
    l
  then l
  else (t,m)::l
  


let simul_step 
    (p2,t2,i2,f2 : t) (c,e : ISet.t * MSet.t) (s,t : ptrans) =
  Printf.printf "step :";
  let succ m acc =
    let cand = (candidates (p2,t2,i2,f2) m (s,t)) in
    Printf.printf "%d " (List.length cand);
    List.fold_left 
      (fun acc tr -> 
	MSet.union (read m (s,t) tr) acc) 
      acc cand
  in
  let res = 
    (progress c (s,t),MSet.fold succ e MSet.empty)
  in print_newline (); res

(*  
let simul_step 
    (p2,t2,i2,f2 : t) (c,e : ISet.t * MSet.t) (s,t : ptrans) =
   let rec aux m1 e' = function
    | [] -> e'
    | (trset,m)::todo ->
      let cand = PTrSet.filter (compatible m) t2 in
      let (e'',todo') = 
	PTrSet.fold
	  (fun tr (en,tdn) ->
	    let trs = PTrSet.add tr trset 
	    and ms = (read m1 (s,t) m tr) in
	    MSet.fold
	      (fun m (acc1,acc2) -> 
		if valid m1 (s,t) trs m
		then (MSet.add m acc1,acc2)
		else (acc1,(trs,m) |> acc2))
	      ms
	      (en,tdn))
	  cand
	  (e',todo)
      in
      aux m1 e'' todo'
  in
  let c' = progress c (s,t) 
  and e' =
    MSet.fold
      (fun m1 acc ->
	if valid m1 (s,t) PTrSet.empty m1
	then (MSet.add m1 acc)
	else (aux m1 acc [PTrSet.empty,m1]))
      e
      MSet.empty
  in
  (c',e')*)

exception NoSim of ptrans list

let simul (p1,t1,i1,f1 : t) (p2,t2,i2,f2 : t) = 
  Printf.printf "Start\n";
  let step = simul_step (p2,t2,i2,f2) in
  let good (c,e) =
    if ISSet.mem c f1
    then MSet.exists (fun m -> ISSet.mem (dom m) f2) e
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
  let rec aux path sim (c,e) =
    if LMSet.mem (c,e) sim
    then sim
    else
      begin
	Printf.printf "%d : %d" (LMSet.cardinal sim) (MSet.cardinal e);
	print_newline ();
	PTrSet.fold
	  (fun tr acc ->
	    let (c',e') = step (c,e) tr in
	    if good (c',e') 
	    then aux (tr::path) acc (c',e')
	    else raise (NoSim (tr::path)))
	  (PTrSet.filter (fun (s,_) -> ISet.subset s c) t1)
	  (LMSet.add (c,e) sim)
      end
  in
  try
    let _ =
      aux 
	[]
	LMSet.empty 
	(ISet.singleton i1,MSet.singleton (IMap.singleton i2 i1))
    in
    Printf.printf "End\n";
    None
  with
    NoSim p ->
    Printf.printf "End\n";
      Some ((Word.get_expr (Word.graph (List.rev p))))
