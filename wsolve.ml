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

let printmsg b1 b2 (_,_,msg) =
  cut
    (String.concat "\n\n"
       (List.map
	  (fun (x,y) ->
	    (if b1 then Printf.sprintf "%s" y else "")^
	      (if b1&&b2 then "\n" else "")^
	      (if b2 then Printf.sprintf "%s" x else ""))
	  msg))
    
let solve_eqs d b1 b2 b3 str =
  let p = Html.createP d in
  let i = Html.createImg d in
  let pre = Html.createPre d in
  let c = Html.createCode d in
  let (b,_,_ as msg) = (handle Solve.solve str) in
  let img = 
    if b 
    then (i##width <- 20;
       (Js.Unsafe.variable "window")##ok)
    else (i##width <- 15;
       (Js.Unsafe.variable "window")##nope)
  in  
  if b1 
  then i##src <- img;
  pre##className <- Js.string "output";
  p##style##margin <- Js.string "0px";
  Dom.appendChild p i;
  Dom.appendChild p pre;
  Dom.appendChild pre c; 
  List.iter
    (fun s -> 
      let sa = Html.createA d in
      sa##innerHTML <- (Js.string s);
      Dom.appendChild c sa; 
      Dom.appendChild c (Html.createBr d))
    (printmsg b2 b3 msg);
  p

let solve_eqs_smpl d _ _ str =
  let p = Html.createP d in
  let i = Html.createImg d in
  let img = match (handle Solve.solve str) with
    | false,_,_ ->  
      (i##width <- 15;
       (Js.Unsafe.variable "window")##nope)
    | true,_,_ -> 
      (i##width <- 20;
       (Js.Unsafe.variable "window")##ok)
  in
  Dom.appendChild p i;
  p##style##margin <- Js.string "0px";
  i##src <- img;
  p


let replace_child p n =
  Js.Opt.iter (p##firstChild) (fun c -> Dom.removeChild p c);
  Dom.appendChild p n

let printval d p res =
  let i = Html.createImg d in
  let img = match res with
    | false,_,_ ->  
      (i##width <- 15;
       (Js.Unsafe.variable "window")##nope)
    | true,_,_ -> 
      (i##width <- 20;
       (Js.Unsafe.variable "window")##ok)
  in
  p##style##margin <- Js.string "0px";
  i##src <- img;
  replace_child p i

let printmsg d p b1 b2 title res =
  let ttle = Html.createP d in
  let pre = Html.createPre d in
  let c = Html.createCode d in
  ttle##innerHTML<- Js.string title;
  pre##className <- Js.string "output";
  ttle##style##margin <- Js.string "0px";
  replace_child p pre;
  Dom.appendChild pre ttle; 
  Dom.appendChild pre c; 
  List.iter
    (fun s -> 
      let sa = Html.createA d in
      sa##innerHTML <- (Js.string s);
      Dom.appendChild c sa; 
      Dom.appendChild c (Html.createBr d))
    (""::(printmsg b1 b2 res))

let printres d p res =
  printmsg d p true false "Details:" res

let printsim d p res =
  printmsg d p false true "Simulations:" res

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
	let det = ref 0
	and res = ref (false,"",[])
	in
	let textbox = Html.createInput d
	and row = Html.createTr d 
	and buttcell = Html.createTd d
	and txtcell = Html.createTd d
	and valcell = Html.createTd d
	and rescell = Html.createTd d
(*	and simcell = Html.createTd d*)
	and butt = Html.createButton d 
	and i = Html.createImg d 
	in
	Dom.appendChild tab row;      
	Dom.appendChild row buttcell;
	Dom.appendChild row txtcell;
	Dom.appendChild row valcell;
	Dom.appendChild row rescell;
(*	Dom.appendChild row simcell;*)
	Dom.appendChild buttcell butt;
	Dom.appendChild butt i;
	Dom.appendChild txtcell textbox;
	buttcell##style##verticalAlign <- Js.string "top";
	txtcell##style##verticalAlign <- Js.string "top";
	valcell##style##verticalAlign <- Js.string "top";
	rescell##style##verticalAlign <- Js.string "top";
(*	simcell##style##verticalAlign <- Js.string "top";*)
	textbox##size <- 50;
	textbox##style##height <- Js.string "18px";
	textbox##className <- Js.string "solvein";
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
	      res := (handle Solve.solve text);
	      printval d valcell (!res);
	      if (!det) >0 
	      then printres d rescell (!res);
(*	      if (!det)>1
	      then printsim d simcell (!res);*)
	      make_slot (k+1)
	    with _ -> () 
	in
	textbox##onchange <- 
	  Html.handler (fun e -> update (); Js._false);
	butt##style##width <- Js.string "24px";
	butt##style##padding <- Js.string "0 0";
	butt##style##height <- Js.string "24px";
	i##width <- 20;
	i##src <- (Js.Unsafe.variable "window")##eyeopen;
	i##title<- Js.string "Show details";
	butt##onclick <- Html.handler 
	  (fun _ -> 
	    (match (!det) with
	    | 0 ->		
	      (i##src <- (Js.Unsafe.variable "window")##eyeclose;
	       i##title<- Js.string "Hide details";
	       det:=1)
(*	    | 1 ->		
	      (butt##innerHTML<- Js.string "Hide Details";
	       det:=2)*)
	    | _ ->
	      (i##src <- (Js.Unsafe.variable "window")##eyeopen;
	       i##title<- Js.string "Show details";
	       rescell##innerHTML<- Js.string "";
(*	       simcell##innerHTML<- Js.string "";*)
	       det:=0));
	    update();
	    Js._false);
      end
    else ()
  in
  make_slot 1

