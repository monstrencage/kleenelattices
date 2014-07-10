open Tools
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
    if ISet.equal (img t1) (dom t2)
    then ok_lst (t2::l)
    else false

let test l = ok_lst (canon l)
