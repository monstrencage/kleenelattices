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
(*let _ =
  let e,proc,fdest,test = 
    let e = ref "" 
    and proc = ref Lts.trad
    and fdest = ref "" 
    and test = ref false in
    Arg.parse 
      ["-o",Arg.Set_string fdest,
       "Set the destination name";
       "-c",Arg.Unit (fun () -> proc:=(fun e -> Lts.clean (Lts.trad e))),
       "Clean the LTS before printing";
       "-opt",Arg.Unit (fun () -> proc:=(fun e -> (Lts.tradOpt e))),
       "Clean the LTS before printing";
       "-t",Arg.Set test,
       "Test wether the LTS is saturated"
      ] 
      (fun s -> e:=s) "";
    (Exprtools.get_string (!e)),
    !proc,
    (if !fdest = "" 
     then Printf.sprintf "examples/expr_%s" (!e) (*Unix.time ()*) 
     else !fdest),
    !test
  in
  let lts = proc e in
  if test
  then 
    Printf.printf "Test :%s\ndecomposed ---- %b\ncomplete ---- %b.\n"
      (Exprtools.print_expr e)
      (Lts.decomposed lts)
      (Lts.complete lts);
  PrintLts.draw "" "png" lts fdest*)

let _ =
  let e,proc,fdest,test = 
    let e = ref "" 
    and proc = ref Petri.trad
    and fdest = ref "" 
    and test = ref false in
    Arg.parse 
      ["-o",Arg.Set_string fdest,
       "Set the destination name";
      ] 
      (fun s -> e:=s) "";
    (Exprtools.get_string (!e)),
    !proc,
    (if !fdest = "" 
     then Printf.sprintf "examples/expr_%s" (!e) (*Unix.time ()*) 
     else !fdest),
    !test
  in
  let lts = proc e in
  PrintPetri.draw "" "png" lts fdest
