open Tools
open Expr
open Simul

let equiv = IUF.equivalent

let canon l =
  let rec aux acc repr = function
    | [] -> acc
    | (e,t)::l -> 
      aux 
	((IMap.fold 
	    (fun i p m -> 
	      if i = IUF.representative i e 
	      then 
		IMap.add 
		  i 
		  (SISet.fold 
		     (fun (a,q) -> 
		       SISet.add 
			 (a,repr q)) 
		     p 
		     SISet.empty) 
		  m 
	      else m) 
	    t 
	    IMap.empty)::acc) 
	(fun i -> IUF.representative i e)
	l
  in
  aux [] (fun i -> -1) l

let img t = IMap.fold (fun _ t -> (SISet.fold (fun (_,q) -> ISet.add q) t)) t ISet.empty

let dom t = IMap.fold (fun i _ -> ISet.add i) t ISet.empty

let rec ok_lst = function
  | [] -> true
  | [t] -> ISet.cardinal (img t) = 1
  | t1::t2::l -> 
    ok_lst (t2::l)

let test l = ok_lst (canon l)

let rec add x l = function
  | 0 -> l
  | n -> add x (x::l) (n-1)

let aux =
  IMap.fold
    (fun i sis (p,f) ->
      let (hist,expr) = IMap.find i p in
      let hist' = add i hist (SISet.cardinal sis - 1) in
      SISet.fold
	(fun (a,j) (p,f) ->
	  let ei = match expr with 
	    | `Un -> `Var a 
	    | expr -> `Conc (expr,`Var a) 
	  in
	  if ISet.mem j f 
	  then 
	    begin
	      match IMap.find j p with
	      | k::lst,e -> (IMap.add j (lst,`Inter (e,ei)) p,f)
	      | _ -> failwith "bad branching"
	    end
	  else 
	    ((try 
		match IMap.find j p with
		| k::lst,e -> IMap.add j (lst,`Inter (e,ei)) p
		| _ -> failwith "bad branching"
	      with
		Not_found -> IMap.add j (hist',ei) p),ISet.add j f))
	sis
	(p,ISet.remove i f))

let trad l =
  let i = (dom (List.hd l)) in
  let res = 
    List.fold_left 
      (fun acc t -> aux t acc) 
      ((ISet.fold (fun i -> IMap.add i ([],`Un)) i IMap.empty),i) 
      l
  in
  snd (IMap.find (-1) (fst res))

let rec print_expr = function
  | `Var x -> x
  | `Inter (e,f) -> Printf.sprintf "(%s ^ %s)" (print_expr e) (print_expr f)
  | `Conc (e,f) ->  Printf.sprintf "%s.%s" (print_expr e) (print_expr f)
  | `Union (e,f) ->  Printf.sprintf "(%s U %s)" (print_expr e) (print_expr f)
  | `Zero -> "ø"
  | `Un -> "ε"
  | `Star e -> Printf.sprintf "(%s)+" (print_expr e)
  | `Conv e -> Printf.sprintf "(%s)~" (print_expr e)
