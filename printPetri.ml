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

let lettre_to_string = function
  | None -> ""
  | Some s -> s

let trans_to_string (k,acc) = function
  | Smpl (x,a,y) -> 
    (k,acc^
      (Printf.sprintf 
	 "%d -> %d [label = \"%s\"];\n" 
	 x y (lettre_to_string a)))
  | Open (x,(y,z)) ->
    (k+1,acc^
      (Printf.sprintf 
	 "%d -> %d[arrowhead=\"none\"];\n %d -> %d;\n %d -> %d;\n" 
	 x k k y k z))
  | Close ((x,y),z) ->
    (k+1,acc^
      (Printf.sprintf 
	 "%d -> %d[arrowhead=\"none\"];\n %d -> %d[arrowhead=\"none\"];\n %d -> %d;\n" 
	 x k y k k z))

let draw_petri opts format (n,tr : net) filename =
  let chout = open_out (filename^".dot") in
  Printf.fprintf chout "digraph structs {\nnode [shape=circle];\n";
  let nbtr,codetr =
    List.fold_left trans_to_string (n,"") tr
  in
  Printf.fprintf 
    chout 
    "0 [label=\"0\";shape=invhouse];\n";
  for i = 1 to (n-2) do
    Printf.fprintf 
      chout 
      "%d [label=\"%d\"];\n" 
      i i
  done;
  Printf.fprintf 
    chout 
    "%d [label=\"%d\";shape=doublecircle];\n" 
    (n-1) (n-1);
  for i = n to (nbtr - 1) do
    Printf.fprintf 
      chout 
      "%d [label=\"\";shape=rectangle];\n" 
      i
  done;
  Printf.fprintf chout "%s" codetr;
  Printf.fprintf chout " }";
  close_out chout;
  let cmd = 
    Printf.sprintf "dot %s %s.dot -T%s > %s.%s" opts 
      filename format filename format
  in
  let _ = Printf.printf "%s\n" cmd;Unix.system cmd
  in ()
