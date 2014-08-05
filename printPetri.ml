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
open Petri

let printTrans (s,t) (k,acc) =
  let acc' =
    ISet.fold
      (fun p acc ->
	Printf.sprintf
	  "%s%d -> %d[arrowtail=\"crow\";arrowhead=\"none\"];\n"
	  acc p k)
      s
      acc
  in
  let acc'' =
    SISet.fold
      (fun (x,q) acc ->
	Printf.sprintf
	  "%s%d -> %d [label = \"%s\"];\n"
	  acc k q x)
      t
      acc'
  in
  (k+1,acc'')

let printInterm chout n0 nb =
  for i = n0 to nb do
    Printf.fprintf 
      chout 
      "%d [label=\"%d\";shape=rectangle];\n" 
      i (i-n0)
  done

let printFn chout k ps =
  Printf.fprintf 
    chout 
    "Fn%d [label=\"%s\";shape=rectangle];\n" 
    k (printiset ps)

let draw opts format (p,t,i,f : Petri.t) filename =
  let chout = open_out (filename^".gv") in
  let states = p in
  let n0 = ISet.max_elt states +1 in
  let stdstates = (ISet.remove i states)
  in
  let ntr,codetr =
    PTrSet.fold printTrans t (n0,"")
  in
  Printf.fprintf chout "digraph structs {\nnode [shape=circle];\n";
  Printf.fprintf 
    chout 
    "%d [label=\"%d\";shape=invhouse];\n" i i ;
  let _ =
    ISSet.fold
      (fun s k -> printFn chout k s ; k+1)
      f
      0
  in
  ISet.iter
    (fun j ->
      Printf.fprintf 
	chout 
	"%d [label=\"%d\"];\n" 
	j j)
    stdstates;
  printInterm chout n0 (ntr - 1);
  Printf.fprintf chout "%s" codetr;
  Printf.fprintf chout " }";
  close_out chout;
  let cmd = 
    Printf.sprintf "dot %s \"%s.gv\" -T%s > \"%s.%s\"" opts 
      filename format filename format
  in
  let _ = Printf.printf "%s\n" cmd;Unix.system cmd
  in ()
