open Tools
open Petri

let tr2tuple = function
  | Smpl (a,b,c) -> [a,b,c]
  | Open (p,(q1,q2)) -> [p,None,q1;p,None,q2]
  | Close ((p1,p2),q) -> [p1,None,q;p2,None,q]

let print_tripl = function
  | (i,None,j) -> (Printf.sprintf "%d ---> %d" i j)
  | (i,Some x,j) -> (Printf.sprintf "%d --%s--> %d" i x j)

let print_trans t = 
  String.concat "\n" (List.map print_tripl (tr2tuple t))


let ilget x m = get_def [] IMap.find x m

let iladd q x acc = 
  IMap.add q (x::(ilget q acc)) acc

let inget x m = get_def 0 IMap.find x m

let inadd q x acc = 
  IMap.add q (x + (inget q acc)) acc

exception Nope

let extract part =
  let m,part2 =
    IMap.fold
      (fun i l (acc1,acc2) ->
	ISet.add i acc1,List.fold_left (fun (acc2) (j,x) -> iladd j (x,i) acc2) acc2 l)
      part (ISet.empty,IMap.empty)
  in
  if 
    (IMap.for_all
       (fun i l -> 
	 match l with
	 | [] -> true
	 | [j,None] -> 
	   i=j
	 | [j,x] -> true
	 | l -> List.for_all (function | _,None -> false | _ -> true) l) 
       part)
  then
    (m,part2)
  else 
    raise Nope

let nextstep (n,tr : net) (m : marquage) =
  let next part m = function
    | (i,p,None,q) -> 
      (iladd q (i,None) (IMap.remove p part),
       ISet.add q (ISet.remove p m))
    | (i,p,Some x,q) -> 
      (iladd q (i,Some x) (IMap.remove p part),
       ISet.remove p m)
  in
  let rec aux acc eq part actif =
    let trans = 
      List.map 
	(function
	| Smpl (p,Some x,q) -> 
	  (eq,List.map (fun (i,_) -> (i,p,Some x,q)) 
	    (IMap.find p part))
	| Smpl (p,None,q) ->
	  ((p,q)::eq,List.map (fun (i,_) -> (i,p,None,q)) 
	    (IMap.find p part))
	| Open (p,(q1,q2)) ->
	  ((q1,q2)::(p,q1)::eq,
	   bind (fun (i,_) -> [i,p,None,q1;i,p,None,q2]) 
	     (IMap.find p part))
	| Close ((p1,p2),q) ->
	  ((p1,p2)::(p1,q)::eq,
	   (List.map 
	      (fun (i,_) -> (i,p1,None,q)) (IMap.find p1 part))@
	   (List.map 
	      (fun (i,_) -> (i,p2,None,q)) (IMap.find p2 part))))
	(one_step actif (n,tr))
    in
    List.fold_left
      (fun acc (eq,l) -> 
	let p,m =
	  List.fold_left 
	    (fun (part,m) tr ->
	      next part m tr)
	    (part,actif)
	    l
	in
	if ISet.equal m actif
	then acc
	else 
	  let acc' = 
	    try let p' = (extract p) in 
		if List.exists (fun (_,p) -> p = p') acc 
		then acc 
		else (eq,p')::acc
	    with Nope -> acc 
	  in
	  aux acc' eq p m)
      acc
      trans
  in
  let res =
    aux [] [] 
      (ISet.fold
	 (fun i -> IMap.add i [i,None]) m IMap.empty) 
      m
  in
  res

let compose1 m1 t1 =
  try
    IMap.fold
      (fun i j acc ->
	IMap.add 
	  i
	  (IMap.find j t1)
	  acc)
      m1
      IMap.empty
  with
    Not_found -> failwith "compose1 : incompatible"

let compose2 t2 m2 =
  if 
    (IMap.for_all 
       (fun i _ -> 
	 IMap.exists 
	   (fun _ -> List.exists (fun (_,j) -> i=j))
	   t2) 
       m2)
  then
    IMap.fold
      (fun i l acc ->
	IMap.add 
	  i
	  (List.map (fun (x,j) -> (x,IMap.find j m2)) l)
	  acc)
      t2
      IMap.empty
  else failwith "compose2 : incompatible"

exception Echec

let apply m1 eq t1 = function
    | Smpl (i,None,j) -> 
      MSet.singleton (IMap.add j (IMap.find i m1) (IMap.remove i m1))
    | Smpl (i,Some x,j) ->
      let k = IMap.find i m1 
      and m' = IMap.remove i m1 in
      List.fold_left
	(fun acc (_,k') -> MSet.add (IMap.add j k' m') acc)
	MSet.empty
	(List.filter 
	   (fun (w,_) -> w=Some x) 
	   (IMap.find k t1))
    | Open (i,(j1,j2)) ->
      let k = IMap.find i m1 in
      MSet.singleton (IMap.add j1 k (IMap.add j2 k (IMap.remove i m1)))
    | Close ((i1,i2),j) ->
      let k1 = IMap.find i1 m1 
      and k2 = IMap.find i2 m1 in
      if eq k1 k2 
      then 
	MSet.singleton 
	  (IMap.add j k1 (IMap.remove i1 (IMap.remove i2 m1)))
      else MSet.empty

let move i j acc = 
  IMap.map 
    (List.map (fun (x,m) -> if m=i then (x,j) else (x,m)))
    acc

let tryandmove i x j acc =    
  IMap.map 
    (List.map 
       (function 
       | (None,m) when m=i -> if m=i then (x,j) else (x,m)
       | (Some _,m) when m=i -> raise Echec
       | p -> p))
    acc

let add_trans acc = function
  | Smpl (i,None,j) -> 
    move i j acc
  | Smpl (i,x,j) ->
    tryandmove i x j acc
  | Close ((i1,i2),j) ->
    move i1 j (move i2 j acc)
  | Open (i,(j1,j2)) ->
    IMap.map 
      (List.fold_left 
	 (fun acc (x,m) -> 
	   if m = i 
	   then (x,j1)::(x,j2)::acc 
	   else (x,m)::acc) []) 
      acc

let sortmaps l1 =
  List.fast_sort (IMap.compare compare) l1

let ( >> ) m1 m2 =
  IMap.for_all 
    (fun i2 l2 ->
      try 
	let l1 = IMap.find i2 m1 in
	List.for_all
	  (fun k -> List.mem k l1)
	  l2
      with Not_found -> l2=[])
    m2

let simulstep pet2 eq t1 m1 =
(** tries to find a sequence of transitions in pet2 
    that allow for m1 to be transformed in something
    compatible with t1. *)
  let ok m1 =
    let goal = compose1 m1 t1 in
    fun t2 m ->
      goal >> (compose2 t2 m)
  in
  let rec aux ok (tr2,m) =
    let trpos =
      (one_step 
	 (IMap.fold 
	    (fun i _ -> ISet.add i) 
	    m ISet.empty) 
	 pet2)
    in
    bind
      (fun t2 ->
	try 
	  let tr2' = add_trans tr2 t2 in
	  MSet.fold
	    (fun m' acc -> 
	      if ok tr2' m' 
	      then (tr2',m')::acc
	      else (aux ok (tr2',m'))@acc) 
	    (apply m eq t1 t2)
	    []
	with Echec -> [])
      trpos
  in
  let trinit m1 acc =
    (IMap.fold 
       (fun i _ -> IMap.add i [None,i]) 
       m1 
       IMap.empty,m1)::acc
  in
  (List.fold_left (fun acc (_,m) -> MSet.add m acc)
     MSet.empty
     (bind (fun (tr2,m1) -> aux (ok m1) (tr2,m1)) 
	(MSet.fold trinit m1 [])))

let fn pet m = 
  let fnst = ISet.singleton (fst pet -1) in
  let eps = function
    | Open _ | Close _ | Smpl (_,None,_) -> true
    | Smpl _ -> false
  in
  let rec aux m =
    if ISet.equal m fnst
    then true
    else 
      let next = List.filter eps (one_step m pet) in
      List.fold_left
	(fun b tr ->
	  if b 
	  then b
	  else aux (go m tr))
	false
	next
  in
  aux m

let fninf fn1 pet2 (mark,m1) =
  if ISSet.mem mark fn1
  then
    MSet.exists
      (fun m1 ->
	let mark2 = 
	  (IMap.fold (fun i _ -> ISet.add i) m1 ISet.empty) 
	in
	fn pet2 mark2)
      m1
  else true

exception ContreExemple of 
    ((int list * int Tools.IMap.t list) * int) list

let add_set m x lts =
  ISMap.add m (x::(get_def [] ISMap.find m lts)) lts

let build_classes eq : ISet.t IMap.t=
  let rec aux1 acc = function
    | [] -> acc
    | (i,j)::lst -> 
      let cl = ISet.union (IMap.find i acc) (IMap.find j acc) in
      aux1 (IMap.add i cl (IMap.add j cl acc)) lst
  in
  let rec aux acc =
    let acc' = aux1 acc eq in
    if IMap.equal ISet.equal acc acc'
    then acc
    else aux acc'
  in
  aux 
    (List.fold_left 
       (fun acc (i,j) -> 
	 IMap.add i 
	   (ISet.singleton i) 
	   (IMap.add j (ISet.singleton j) acc))
       IMap.empty eq)

let getlts pet =
  let rec aux states lts = function
    | [] -> states,lts
    | m::todo ->
      if ISSet.mem m states
      then aux states lts todo 
      else 
	let st = ISSet.add m states in
	let lts',td' =
	  (List.fold_left 
	     (fun (lts,todo) (r,(m',tr)) -> 
	       if ISSet.mem m' st 
	       then (add_set m (r,tr,m') lts,todo)
	       else (add_set m (r,tr,m') lts,m'::todo))
	     (lts,todo)
	     (nextstep pet m))
	in
	aux st lts' td'
  in
  let (s,lts) = aux ISSet.empty ISMap.empty [ISet.singleton 0] in
  let lts' =
    ISMap.mapi
      (fun i ->
	List.map
	  (fun (eq,tr,j) ->
	    let im = build_classes eq in
	    let pertinent = ISet.union i j in
	    let classes : ISet.t IMap.t=
	      IMap.map
		(fun s -> 
		  ISet.filter 
		    (fun k -> ISet.mem k pertinent)
		    s)
		(IMap.filter 
		   (fun k _ -> ISet.mem k pertinent) 
		   im)
	    in
	    ((fun i j -> 
	      try ISet.mem j (IMap.find i classes)
	      with Not_found -> i=j),tr,j)))
      lts
  in
  ([0],lts',ISSet.filter (fn pet) s)

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
  let rec aux acc k (mk,ms) =
    (*let mk,ms = ilst2set mark, mlst2set m1 in*)
    if LMMap.mem (mk,ms) acc
    then true
    else 
      let acc' = LMMap.add (mk,ms) k acc in
      if fninf fn1 pet2 (mk,ms)
      then
	let next =  get_def [] ISMap.find mk lts in
	if next = []
	then true
	else
	  List.fold_left
	    (fun b (eq,t1,mark') -> 
	      aux acc' (k+1) (mark',simulstep pet2 eq t1 ms))
	    true
	    next
      else raise 
	(ContreExemple 
	   (List.map 
	      (fun ((s,ms),i) -> 
		(ISet.elements s,MSet.elements ms),i) 
	      (LMMap.bindings acc)))
  in
  try
    (aux LMMap.empty 0 (ISet.singleton 0,MSet.singleton (IMap.singleton 0 0)))
  with ContreExemple _ -> false



