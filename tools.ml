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

module Lst = struct
  type t = int list
  let compare = compare
end
module Int = struct
  type t = int
  let compare = compare
end

module LMap = Map.Make(Lst)

module IMap = Map.Make(Int)

module LSet = Set.Make(Lst)

module ISet = Set.Make(Int)

module MSet = 
  Set.Make(struct
    type t = int IMap.t
    let compare = IMap.compare compare
  end)

let add_lst x y m =
  try LMap.add x (y::(LMap.find x m)) m
  with Not_found -> LMap.add x [y] m

let get_def def get x m =
  try get x m
  with Not_found -> def


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

module ISSet = Set.Make(ISet)
module ISMap = Map.Make(ISet)
