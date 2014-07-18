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


module TrSet = Set.Make(struct
  type t = int * string * int
  let compare = compare
end)

let support m =
  IMap.fold (fun i _ -> ISet.add i) m ISet.empty

module Descriptor = struct
    type descriptor = int
    let default = 0
    type accumulator = unit
    let union d1 d2 acc = (d1+d2,())
  end

(*module IUF = struct
  include
    UnionFind.Make(struct
      include Int
      let equal i j = (compare i j = 0)
      module Map = Map.Make(Int)
    end)(Descriptor)
  let union i j eq =
    fst (union i j eq ())
end*)

let eqstates eq1 eq2 m = 
  ISet.for_all 
    (fun i -> 
      ISet.for_all 
	(fun j -> eq1 i j = eq2 i j)
	m)
    m


let img t = IMap.fold (fun _ t -> (SISet.fold (fun (_,q) -> ISet.add q) t)) t ISet.empty

let dom t = IMap.fold (fun i _ -> ISet.add i) t ISet.empty

let compose m1 m2 =
  IMap.map (fun i -> try IMap.find i m2 with Not_found -> i) m1

let rev m =
  IMap.fold (fun i j -> IMap.add j i) m IMap.empty



type marquage = ISet.t
type tranche = SISet.t IMap.t
(*type equiv = IUF.state*)
type readstate = int IMap.t
type readstateset = MSet.t
type trans = readstate * tranche
type lts = 
  int * (trans * marquage) list ISMap.t * ISSet.t

let printimap f2 m =
  Printf.sprintf "(%s)"
    (String.concat ","
       (List.map (fun (i,j) -> Printf.sprintf "%d -> %s" i (f2 j)) 
	  (IMap.bindings m)))

let printiset m =
Printf.sprintf "{%s}"
  (String.concat ","
     (List.map string_of_int (ISet.elements m)))
let printisset m =
Printf.sprintf "{%s}"
  (String.concat ","
     (List.map printiset (ISSet.elements m)))

let printlist f l =
Printf.sprintf "[%s]"
  (String.concat ";"
     (List.map f l))

let printsiset m =
Printf.sprintf "{%s}"
  (String.concat ","
     (List.map (fun (s,i) -> Printf.sprintf "(%s,%d)" s i) (SISet.elements m)))

let printtrset m =
Printf.sprintf "{%s}"
  (String.concat ","
     (List.map (fun (i,s,j) -> Printf.sprintf "(%d,%s,%d)" i s j) (TrSet.elements m)))


let printmset m =
Printf.sprintf "{%s}"
  (String.concat ","
     (List.map (printimap string_of_int) (MSet.elements m)))


let printismap f2 m =
  Printf.sprintf "(%s)"
    (String.concat ",\n"
       (List.map (fun (i,j) -> Printf.sprintf "%s -> %s" (printiset i) (f2 j)) 
	  (ISMap.bindings m)))

let printtrans ((e,l),m) =
  Printf.sprintf 
    "(%s|%s|%s)" 
    (printiset m)
    (printimap string_of_int e)
    (printimap printsiset l)

let printlts (i,t,o) =
  Printf.sprintf "init : %d\nTrans:\n%s\nfinals:%s\n" i
    (printismap  
       (printlist printtrans)
       t)
    (printisset o)

exception ContreExemple of string Expr.ground

let input_file filename =
  let chin = open_in filename in
  let rec aux acc =
    try
      aux ((input_line chin)::acc)
    with
      End_of_file -> (close_in chin;acc)
  in
  aux []
