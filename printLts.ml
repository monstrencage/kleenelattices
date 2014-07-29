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
open Tools

let cantor (i,j) =
  let k = i+j in
  (((k+2)*(k+1))/2) - i


let add_set i k m =
  IMap.add i (ISet.add k (get_def ISet.empty IMap.find i m)) m

let printInit n0 (c:marquage) (e,_ : trans) =
  ISet.fold
    (fun i (k,acc,pset) -> 
      try
	let i' = n0 + cantor (IMap.find i e, k) in
	(k,Printf.sprintf
	  "%s%d -> %d[arrowtail=\"crow\";arrowhead=\"none\"];\n"
	  acc i i',add_set k i' pset)
      with Not_found -> 
	let i' = n0 + cantor (i, k) in
	(k,Printf.sprintf
	  "%s%d -> %d[style = \"dotted\";arrowhead=\"none\"];\n"
	  acc i i',add_set k i' pset))
    c

(*none, normal, inv, dot, odot, invdot, invodot, tee, empty, invempty, open, halfopen, diamond, odiamond, box, obox, crow*)
    
let printTranche n0 (_,t : trans) (k,acc,pset) =
    (k+1,
     IMap.fold
       (fun i sis acc -> 
	 SISet.fold
	   (fun (a,j) acc ->
	     Printf.sprintf
	       "%s%d -> %d [label = \"%s\"];\n"
	       acc
	       (n0+cantor (i,k)) 
	       j
	       a)
	   sis
	   acc)
       t
       acc,
     pset)

let trans_to_string n0 c tr acc =
  printTranche n0 tr (printInit n0 c tr acc)

let printInterm chout k ps =
  if ISet.cardinal ps = 1
  then 
    ISet.iter
      (fun i ->
	Printf.fprintf 
	  chout 
	  "%d [label=\"%d\";shape=rectangle];\n" 
	  i k)
      ps
  else
    begin
      Printf.fprintf chout
	"subgraph clusterT%d {\nnode [shape=rectangle];\n" k;
      ISet.iter
	(fun i ->
	  Printf.fprintf 
	    chout 
	    "%d [label=\"%d\"];\n" 
	    i k)
	ps;
      Printf.fprintf chout "}\n"  
    end

let printFn chout k ps =
  Printf.fprintf 
    chout 
    "Fn%d [label=\"%s\";shape=rectangle];\n" 
    k (printiset ps)

let draw opts format (i,tr,fn : lts) filename =
  let chout = open_out (filename^".gv") in
  Printf.fprintf chout "digraph structs {\nnode [shape=circle];\n";
  let states = places (i,tr,fn) in
  let n0 = ISet.max_elt states +1 in
  let stdstates = (*ISSet.fold (fun fn acc -> ISet.diff acc fn) 
    fn*)
    (ISet.remove i states)
  in
  let nbtr,codetr,interm =
    ISMap.fold
      (fun c lst acc ->
	List.fold_left
	  (fun acc (tr,d) ->
	    trans_to_string n0 c tr acc)
	  acc
	  lst)
      tr (0,"",IMap.empty)
  in
  Printf.fprintf 
    chout 
    "%d [label=\"%d\";shape=invhouse];\n" i i ;
  let _ = 
    ISSet.fold
      (fun s k -> printFn chout k s ; k+1)
      fn
      0
  in
  ISet.iter
    (fun j ->
      Printf.fprintf 
	chout 
	"%d [label=\"%d\"];\n" 
	j j)
    stdstates;
  IMap.iter
    (printInterm chout)
    interm;
  Printf.fprintf chout "%s" codetr;
  Printf.fprintf chout " }";
  close_out chout;
  let cmd = 
    Printf.sprintf "dot %s \"%s.gv\" -T%s > \"%s.%s\"" opts 
      filename format filename format
  in
  let _ = Printf.printf "%s\n" cmd;Unix.system cmd
  in ()
