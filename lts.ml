open Tools

type lts = (*int * (((readstate * tranche) * ISet.t) list) ISMap.t * ISSet.t*) (readstate * tranche) Tools.lts

let mergeint _ i j =
  match (i,j) with 
  | None , None -> None
  | Some i,None | None,Some i -> Some i
  | _ -> failwith "mergeint : conflict"

let mergetr _ t1 t2 =
  match (t1,t2) with
  | None,None -> None
  | Some x,None | None, Some x -> Some x
  | Some x,Some y -> 
    Some (x@y)

let mergesis _ t1 t2 =
  match (t1,t2) with
  | None,None -> None
  | Some x,None | None, Some x -> Some x
  | Some x,Some y -> 
    Some (SISet.union x y)

let merge sm sm' = ISMap.merge mergetr sm sm'

let support (i1,t1,o1 : lts) : ISet.t =
  let support (e,t) = 
    IMap.fold
      (fun i j s -> ISet.add i (ISet.add j s))
      e
      (ISet.union (dom t) (img t))
  in
  let extract = 
    List.fold_left
      (fun acc ((e,t),m) -> 
	ISet.union 
	  (support (e,t))
	  (ISet.union acc m))
      ISet.empty
  in
  let po1 = ISSet.fold ISet.union o1 (ISet.singleton i1) in
  let dt1 = ISMap.fold (fun s l acc -> ISet.union (extract l) (ISet.union s acc)) t1 po1 in
  dt1

let distinct l1 l2 = 
  ISet.is_empty (ISet.inter (support l1) (support l2)) 

let union (i1,t1,o1 as l1 : lts) (i2,t2,o2 as l2 : lts) : lts =
  assert (distinct l1 l2);
  let i = i1 in
  let qi2 = 
    List.map 
      (fun ((_,t),m) -> 
	let e' = IMap.singleton i i 
	and t' = IMap.singleton i (IMap.find i2 t) in
	((e',t'),m))
      (ISMap.find (ISet.singleton i2) t2) 
  in
  let t = 
    merge
      (ISMap.singleton (ISet.singleton i) qi2)
      (merge t1 (ISMap.remove (ISet.singleton i2) t2))
  in
  let o = ISSet.union o1 o2 in
  (i,t,o)

let plug o i t =
  let qi = 
    List.map 
      (fun ((_,t),m) -> (IMap.find i t,m))
      (ISMap.find (ISet.singleton i) t) 
  in
  let trans p =
    let p0 = ISet.choose p in
    let e = ISet.fold (fun p' -> IMap.add p' p0) p IMap.empty in
    List.map (fun (t,m) -> ((e,IMap.singleton p0 t),m)) qi
  in
  ISSet.fold
    (fun p acc ->
      ISMap.add p (trans p) acc)
    o
    ISMap.empty

let concat (i1,t1,o1 as l1 : lts) (i2,t2,o2 as l2 : lts) : lts=
  assert (distinct l1 l2);
  let i = i1 
  and o = o2 in
  let t12 = plug o1 i2 t2 in
  let t = merge t12 (merge t1 (ISMap.remove (ISet.singleton i2) t2))
  in
  (i,t,o)


let iter (i,t,o) =
  let toi = plug o i t in
  (i,merge t toi,o)
      
let par t1l t2l =
  let aux ((e1,t1),m1) ((e2,t2),m2) =
    let e = IMap.merge mergeint e1 e2 in
    let m = ISet.union m1 m2 in
    let t = IMap.merge mergesis t1 t2 in
    ((e,t),m)
  in
  List.fold_left
    (fun acc t1 ->
      List.fold_left
	(fun acc t2 ->
	  (aux t1 t2)::acc)
	acc
	t2l)
    []
    t1l

let inter (i1,t1,o1 as l1 : lts) (i2,t2,o2 as l2 : lts) : lts =
  assert (distinct l1 l2);
  let i = i1
  and o =
    ISSet.fold
      (fun f1 ->
	ISSet.fold
	  (fun f2 ->
	    ISSet.add (ISet.union f1 f2))
	  o2)
      o1 
      ISSet.empty
  in 
  let ei = IMap.singleton i i in 
  let ciblei1 = (ISMap.find (ISet.singleton i1) t1)
  and ciblei2 = (ISMap.find (ISet.singleton i2) t2) in
  let ciblei =
    List.fold_left
      (fun acc ((_,t1),m1) -> 
	let qi1 = (IMap.find i1 t1) in
	List.fold_left
	  (fun acc ((_,t2),m2) -> 
	    let qi2 = (IMap.find i2 t2) in
	    let tr = 
	      ((ei,IMap.singleton i (SISet.union qi1 qi2)),
	       (ISet.union m1 m2))
	    in
	    tr::acc)
	  acc
	  ciblei2)
      []
      ciblei1
  in
  let ti = ISMap.singleton (ISet.singleton i) ciblei in
  let t1' = ISMap.remove (ISet.singleton i1) t1
  and t2' = ISMap.remove (ISet.singleton i2) t2 in
  let to1 = 
    ISSet.fold
      (fun o1 ->
	ISMap.fold
	  (fun m2 t2 ->
	    let o1m2 =
	      List.fold_left
		(fun acc ((e,t),m) ->
		  ((e,t),ISet.union o1 m)::acc)
		[]
		t2
	    in
	    ISMap.add (ISet.union o1 m2) o1m2)
	  t2'
      )
      o1
      ISMap.empty
  and to2 = 
    ISSet.fold
      (fun o2 ->
	ISMap.fold
	  (fun m1 t1 ->
	    let o2m1 =
	      List.fold_left
		(fun acc ((e,t),m) ->
		  ((e,t),ISet.union o2 m)::acc)
		[]
		t1
	    in
	    ISMap.add (ISet.union o2 m1) o2m1)
	  t1'
      )
      o2
      ISMap.empty
  in
  let tm =
    ISMap.fold
      (fun m1 t1 acc ->
	ISMap.fold
	  (fun m2 t2 acc ->
	    ISMap.add (ISet.union m1 m2) (par t1 t2) acc)
	  t2'
	  acc)
      t1'
      ISMap.empty 
  in
  (i,merge (merge to1 to2) (merge ti tm),o)

let trad chout =
  let rec aux k = function
    | `Var a ->
      let i = ISet.singleton k
      and o = ISet.singleton (k+1) in
      let eq = IMap.singleton k k 
      and ti = IMap.singleton k (SISet.singleton (a,k+1)) in
      let t = ISMap.singleton i [(eq,ti),o] in
      ((k,t,ISSet.singleton o),k+2)
    | `Union (e,f) ->
      let (l1,k1) = aux k e in
      let (l2,k2) = aux k1 f in
      (union l1 l2, k2)
    | `Conc (e,f) -> 
      let (l1,k1) = aux k e in
      let (l2,k2) = aux k1 f in
      (concat l1 l2, k2)
    | `Inter (e,f) -> 
      let (l1,k1) = aux k e in
      let (l2,k2) = aux k1 f in
      (inter l1 l2, k2)
    | `Star e -> 
      let (l1,k1) = aux k e in
      (iter l1, k1)
    | `Conv _ | `Un | `Zero ->
      failwith "Lts.trad : unsupported operation"
  in
  (fun e -> 
    let res = fst (aux 0 e) 
    in 
    Printf.fprintf chout "Automaton for %s :\n%s\n" 
      (Exprtools.print_expr e)
      (printlts res);
    res)

exception ContreExemple2 of string Expr.expr

let ltsfninf fn1 fn2 (mk,ms) =
  if ISSet.mem mk fn1
  then MSet.exists (fun m -> ISSet.mem (dom m) fn2) ms
  else true

let mkrn e i = 
  try IMap.find i e
  with Not_found -> i

let read lts ms w =
  MSet.fold
    (fun m ms ->
      let mk = dom m in
      let next =  get_def [] ISMap.find mk lts in
      List.fold_left
	(fun acc (trans,_) ->
	  MSet.union acc (Word.read mkrn w m trans))
	ms
	next)
    ms
    MSet.empty

let compose m1 m2 =
  IMap.map (fun i -> try IMap.find i m2 with Not_found -> i) m1

let rev m =
  IMap.fold (fun i j -> IMap.add j i) m IMap.empty

let simul (i1,l1,fn1) (i2,l2,fn2) =
  let module LMSet = 
	Set.Make(struct 
	  type t = ISet.t * MSet.t
	  let compare (i,m) (j,n) =
	    let t = ISet.compare i j in
	    if t = 0
	    then MSet.compare m n
	    else t
	end)
  in
(*  let (i1,l1,fn1) = trad e1 
  and (i2,l2,fn2) = trad e2 in*)
  let rec aux (_,_,f as w) acc (mk,ms) =
    if LMSet.mem (mk,ms) acc
    then ()
    else 
      let acc' = LMSet.add (mk,ms) acc in
      if ltsfninf fn1 fn2 (mk,ms)
      then
	let next =  get_def [] ISMap.find mk l1 in
	if next = []
	then ()
	else
	  List.iter
	    (fun ((eq,t1),mark') -> 
	      let (_,_,f' as w') = Word.evolve_word mkrn w (eq,t1) in
	      let ms0 = 
		MSet.fold
		  (fun m -> MSet.add (compose (compose m eq) f))
		  ms 
		  MSet.empty
	      in
	      let ms1 = read l2 ms0 w' in
	      let finv = rev f' in
	      let ms' = 
		MSet.fold
		  (fun m -> MSet.add (compose m finv))
		  ms1
		  MSet.empty
	      in
	      aux w' acc' (mark',ms'))
	    next
      else raise 
	(ContreExemple2 (Word.get_expr (Word.close w)))
  in
  try
    (aux 
       (Word.init i1)
       LMSet.empty 
       (ISet.singleton i1,MSet.singleton (IMap.singleton i2 i1))); 
    None
  with ContreExemple2 x -> Some x

