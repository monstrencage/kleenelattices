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
open Expr
open Tools

type lettre = string option

type place = int

type transition = Smpl of place * lettre * place | Open of place * (place * place) | Close of (place * place) * place

type net = int * transition list

let input = function
  | Smpl (x,_,_) | Open (x,_) -> ISet.singleton x
  | Close ((x,y),_) -> ISet.add x (ISet.singleton y)

let output = function
  | Smpl (_,_,x) | Close (_,x) -> ISet.singleton x
  | Open (_,(x,y)) -> ISet.add x (ISet.singleton y)


let rename f = function
  | Smpl (p,a,q) -> Smpl (f p,a,f q)
  | Open (p,(q1,q2)) -> Open (f p,(f q1,f q2))
  | Close ((p1,p2),q) -> Close ((f p1,f p2),f q)

let rec trad : string expr -> net = function
  | `Un -> (1,[])
  | `Zero -> (2,[])
  | `Var a -> (2,Smpl(0,Some a,1)::[])
  | `Inter (e,f) -> 
    let (n1,p1) = trad e
    and (n2,p2) = trad f in
    let p1' =List.map (rename (fun x -> x+1)) p1
    and p2' =List.map (rename (fun x -> x+n1+1)) p2 in
    (n1+n2+2,
     (Open(0,(1,n1+1)))::
       (Close((n1,n1+n2),n1+n2+1))::
       p1'@p2')
  | `Union (e,f) -> 
    let (n1,p1) = trad e
    and (n2,p2) = trad f in
    let p1' =List.map (rename (fun x -> x+1)) p1
    and p2' =List.map (rename (fun x -> x+n1+1)) p2 in
    (n1+n2+2,
     (Smpl(0,None,1))::
       (Smpl(0,None,n1+1))::
       (Smpl(n1,None,n1+n2+1))::
       (Smpl(n1+n2,None,n1+n2+1))::
       p1'@p2')
  | `Conc(e,f) ->
    let (n1,p1) = trad e
    and (n2,p2) = trad f in
    let p1' =List.map (rename (fun x -> x)) p1
    and p2' =List.map (rename (fun x -> x+n1)) p2 in
    (n1+n2,
     Smpl(n1-1,None,n1)::
       p1'@p2')
  | `Star e ->
    let (n1,p1) = trad e in
    (n1,
     Smpl (n1-1,None,0) :: p1)
  | `Conv _ -> failwith "nope!"




type marquage = ISet.t

let one_step (m : marquage) (_,p : net) =
  List.filter 
    (fun t -> ISet.subset (input t) m)
    p

let go (m : marquage) tr : marquage =
  ISet.union (output tr) (ISet.diff m (input tr))

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
