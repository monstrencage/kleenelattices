module Html = Dom_html
open Tools

let initeq = "(a|b)+.C & d > d & a.b.C & (d|a)\n"

let handle f x =
  try
    f x	
  with Parsing.Parse_error -> (false,"",[])

let solve_eqs d b1 b2 str =
  let p = Html.createImg d in
  let img = match (handle Solve.solve str) with
    | false,_,_ ->  (p##width <- 15;"red-cross.png")
    | true,_,_ -> (p##width <- 20;"green_tick.png")
  in
  p##src <- Js.string img;
  p


let replace_child p n =
  Js.Opt.iter (p##firstChild) (fun c -> Dom.removeChild p c);
  Dom.appendChild p n


let applet tag =
  let d = Html.document in
  let body =
    Js.Opt.get (d##getElementById(Js.string tag))
      (fun () -> raise NotDefined) in
  let nb = ref 0 
  and mx = ref 0 in
  let tab = Html.createTable d in
  Dom.appendChild body tab;
  let rec make_slot k =
    if k>(!mx) 
    then
      begin
	nb:= !nb+1;
	mx:= !mx+1;
	let textbox = Html.createInput d in
	let pre = Html.createTd d in
	textbox##size <- 50;
	textbox##className <- Js.string "solvein";
	let row = Html.createTr d in
	let txtcell = Html.createTd d in
	Dom.appendChild tab row;
	Dom.appendChild row txtcell;
	Dom.appendChild txtcell textbox;
	Dom.appendChild row pre;
	textbox##value <- Js.string "enter equation here";
	textbox##onfocus <- 
	  Html.handler 
	  (fun _ -> 
	    textbox##value <- Js.string "";
	    textbox##onfocus <- Html.handler (fun _ ->Js._false);
	    Js._false);
	let update () =
	  match Js.to_string (textbox##value) with
	  | "" when 1<(!nb) -> 
	    (Dom.removeChild tab row; 
	     nb:=!nb-1; 
	     if k= !mx then mx:= !mx-1)
	  | text ->
	    try
	      let rendered = solve_eqs d true false text in
	      replace_child pre(*view*) rendered;
	      make_slot (k+1)
	    with _ -> () 
	in
	textbox##onchange <- 
	  Html.handler (fun e -> update (); Js._false)
      end
    else ()
  in
  make_slot 1
