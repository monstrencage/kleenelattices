module Html = Dom_html
open Tools

let initeq = "(a|b)+.C & d > d & a.b.C & (d|a)\n"

let cut str =
  let s c = 
    let st = " " in
    st.[0]<- c;
    st
  in
  let rec aux acc1 acc2 i =
    try
      match str.[i] with
(*      | '\n' when acc1="" -> aux "" acc2 (i+1)*)
      | '\n' -> aux "" (acc1::acc2) (i+1)
      | c -> aux (acc1^(s c)) acc2 (i+1)
    with 
      Invalid_argument _ -> (List.rev (acc1::acc2))
  in
  aux "" [] 0


let handle f x =
  try
    f x	
  with Parsing.Parse_error -> (false,"",[])

let printmsg b1 b2 (_,s,msg) =
  cut
    (Printf.sprintf "%s\n%s\n"
       s
       (List.fold_left
	  (fun acc (x,y) ->
	    acc^
	      (if b1 then Printf.sprintf "\n%s" y else "")^
	      (if b2 then Printf.sprintf "\n%s" x else ""))
	  ""
	  msg))
       

let solve_eqs d b1 b2 str =
  let p = Html.createCode d
  and sl = 
    List.map 
      Js.string 
      (Tools.bind 
	 (function
	 | _,"",_ -> [] 
	 | res -> printmsg b1 b2 res) 
	 (List.map 
	    (handle Solve.solve) 
	    (cut str)))
  in
  List.iter
    (fun s -> 
      let sa = Html.createA d in
      sa##innerHTML <- s;
      Dom.appendChild p sa; 
      Dom.appendChild p (Html.createBr d))
    ((Js.string "Result:")::(Js.string "")::sl);
  p

let replace_child p n =
  Js.Opt.iter (p##firstChild) (fun c -> Dom.removeChild p c);
  Dom.appendChild p n


let applet tag =
  let d = Html.document in
  let body =
    Js.Opt.get (d##getElementById(Js.string tag))
      (fun () -> raise NotDefined(*Html.createDiv d*)) in
  let textbox = Html.createTextarea d in
  let pre = Html.createTd d in
  let preview = Html.createPre d in
  textbox##rows <- 20 ; textbox##cols <- 50;
  textbox##value <- Js.string initeq;
  preview##className <- Js.string "output";
  textbox##className <- Js.string "solvein";
  let tab = Html.createTable d in
  let row = Html.createTr d in
  let txtcell = Html.createTd d in
  Dom.appendChild body tab;
  Dom.appendChild tab row;
  Dom.appendChild row txtcell;
  Dom.appendChild txtcell textbox;
  Dom.appendChild row pre;
  Dom.appendChild pre preview;
  let dyn_preview old_text n =
    let text = Js.to_string (textbox##value) in
    if text <> old_text
    then 
      begin
        begin 
	  try
	    let rendered = solve_eqs d true false text in
	    replace_child preview rendered
	  with _ -> () 
	end;
	(20,text)
      end 
    else (max 0 (n - 1),text)
  in
  dyn_preview

