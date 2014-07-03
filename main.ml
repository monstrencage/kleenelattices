let _ =
  let file = 
    let f = ref "" in
    Arg.parse [] (fun s -> f:=s) "";
    !f
  in
  Solve.solve_file file
