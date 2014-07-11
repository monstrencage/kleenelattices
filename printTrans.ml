open Tools
open Expr
open Simul


let rec print_expr = function
  | `Var x -> x
  | `Inter (e,f) -> Printf.sprintf "(%s ^ %s)" (print_expr e) (print_expr f)
  | `Conc (e,f) ->  Printf.sprintf "%s.%s" (print_expr e) (print_expr f)
  | `Union (e,f) ->  Printf.sprintf "(%s U %s)" (print_expr e) (print_expr f)
  | `Zero -> "ø"
  | `Un -> "ε"
  | `Star e -> Printf.sprintf "(%s)+" (print_expr e)
  | `Conv e -> Printf.sprintf "(%s)~" (print_expr e)


module TrSet = Set.Make(struct
  type t = int * string * int
  let compare = compare
end)

type word = int * TrSet.t * int

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

let build_word l =
  let rec aux (w,f,k) (eq,t) =
    let rn i = IUF.representative i eq in
    let cl = classes f rn in
    let m = dom t in
    let f0 = IMap.filter (fun i _ -> not (ISet.mem i m)) f in
    let f1 = IMap.mapi (fun i p -> try ISet.choose (IMap.find i cl) with Not_found -> p) f in
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
    assert (ISet.subset (img t) (dom f2));
    (w2,f2,k2)
  in 
  let w,f,k = List.fold_left aux (TrSet.empty,IMap.singleton 0 0,1) l in
  (0,rename k (IMap.fold (fun _ -> ISet.add) f ISet.empty) w,k)

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

let rec get_expression (i,w,o) =
  ((*Printf.printf "%d -> %d\n%s\n" i o (print_word (i,w,o))*));
  let e = 
    let r = reachability (i,w,o) in
    if i = o
    then `Un
    else
      match succ i w with
      | [] -> `Zero
      | [(x,a,y)] -> conc (`Var a,get_expression (y,w,o))
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
	   conc (get_expression (i,w,ij),get_expression (ij,w,o)))
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
		(get_expression 
		   (i,TrSet.filter 
		     (fun tr -> not (List.mem tr now)) w,
		    o),
		 get_expression 
		   (i,TrSet.filter 
		     (fun tr -> not (List.mem tr later)) w,
		    o)))
	   else
	     (List.fold_left (fun e (_,a,_) -> par (e,`Var a)) 
		`Zero later))
  in
  e


let get_expr (i,w,o) =
  (*Printf.printf "get_expr\n";*)
  get_expression (i,w,o)

let print_trace l = 
  let w = (build_word (List.rev l)) in
  Printf.sprintf "%s"
    (print_expr (get_expr w))
    (*print_word w*)
