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
let _ =
  let file,solve,fdest = 
    let f = ref "" 
    and solve = ref Solve.solve_file
    and fdest = ref "" 
    and printSim = ref false
    and printDet = ref false in
    Arg.parse 
      ["-o",Arg.Set_string fdest,
       "Set the destination name";
       "-s",Arg.Set printSim,
       "Print the computed simulation";
       "-d",Arg.Set printDet,
       "Print the details of the answer";
       "-v",Arg.Unit (fun () -> printSim:=true;printDet:=true),
       "Print all details"
       
      ] 
      (fun s -> f:=s) "Use : solve [OPTIONS] filename";
    !f,!solve !printDet !printSim,(if !fdest = "" then !f else !fdest)
  in
  solve file fdest
