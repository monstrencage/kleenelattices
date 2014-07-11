let sort l = List.fast_sort compare l

let ( <! ) l1 l2 =
  let rec aux = function
    | ([],_) -> true
    | (x::l,y::m) when x = y -> aux (l,m)
    | (x::l,y::m) when x > y -> aux (x::l,m)
    | _ -> false
  in
  aux (l1,l2)

let rm l1 l2 = 
  let rec aux = function
    | ([],l) -> l
    | (x::l,y::m) when x = y -> aux (l,m)
    | (x::l,y::m) when x > y -> y::aux (x::l,m)
    | _ -> failwith "nope"
  in
  aux (l1,l2)

module Int = struct
  type t = int
  let compare = compare
end

module IMap = Map.Make(Int)

module ISet = Set.Make(Int)

module MSet = 
  Set.Make(struct
    type t = int IMap.t
    let compare = IMap.compare compare
  end)

module ISSet = Set.Make(ISet)
module ISMap = Map.Make(ISet)

let get_def def get x m =
  try get x m
  with Not_found -> def

(*let add_lst x y m =
  try LMap.add x (y::(LMap.find x m)) m
  with Not_found -> LMap.add x [y] m*)

let add_set m x lts =
  ISMap.add m (x::(get_def [] ISMap.find m lts)) lts

let bind f l = 
  let rec aux = function
    | [] -> []
    | (a::b) -> (f a)@(aux b)
  in
  aux l

let ilst2set =
  List.fold_left (fun acc i -> ISet.add i acc) ISet.empty

let mlst2set =
  List.fold_left (fun acc i -> MSet.add i acc) MSet.empty


module StrInt = struct
  type t = string * int
  let compare = Pervasives.compare
end

module SISet = Set.Make (StrInt)

let support m =
  IMap.fold (fun i _ -> ISet.add i) m ISet.empty

module Descriptor = struct
    type descriptor = int
    let default = 0
    type accumulator = unit
    let union d1 d2 acc = (d1+d2,())
  end

module IUF = struct
  include
    UnionFind.Make(struct
      include Int
      let equal i j = (compare i j = 0)
      module Map = Map.Make(Int)
    end)(Descriptor)
  let union i j eq =
    fst (union i j eq ())
end

let eqstates eq1 eq2 m = 
  ISet.for_all 
    (fun i -> 
      ISet.for_all 
	(fun j -> eq1 i j = eq2 i j)
	m)
    m


let img t = IMap.fold (fun _ t -> (SISet.fold (fun (_,q) -> ISet.add q) t)) t ISet.empty

let dom t = IMap.fold (fun i _ -> ISet.add i) t ISet.empty
