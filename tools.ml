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

module StrInt = struct
  type t = string * int
  let compare = Pervasives.compare
end

module SISet = Set.Make (StrInt)

module TrSet = Set.Make(struct
  type t = int * string * int
  let compare = compare
end)

type ptrans = ISet.t * SISet.t
type marquage = ISet.t
type readstate = int IMap.t

module Trans = Set.Make
  (struct type t = ptrans
	  let compare (a,b) (c,d) =
	    match ISet.compare a c with
	    | 0 -> SISet.compare b d
	    | k -> k
   end)

let get_def def get x m =
  try get x m
  with Not_found -> def

let bind f l = 
  let rec aux = function
    | [] -> []
    | (a::b) -> (f a)@(aux b)
  in
  aux l

let input trset =
  Trans.fold (fun (s,_) -> ISet.union s) trset ISet.empty

let img m s =
  ISet.fold
    (fun p -> ISet.add (IMap.find p m))
    s ISet.empty


let dom t = IMap.fold (fun i _ -> ISet.add i) t ISet.empty

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



exception ContreExemple of int * string * string Expr.ground

let input_file filename =
  let chin = open_in filename in
  let rec aux acc =
    try
      aux ((input_line chin)::acc)
    with
      End_of_file -> (close_in chin;acc)
  in
  List.rev (aux [])


(*module Descriptor = struct
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
end*)
