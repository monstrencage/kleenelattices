module Html = Dom_html

let (>>=) = Lwt.bind

exception NotDefined

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


let solve_applet tag =
  let d = Html.document in
  let body =
    Js.Opt.get (d##getElementById(Js.string tag))
      (fun () -> raise NotDefined(*Html.createDiv d*)) in
  let textbox = Html.createTextarea d in
  let pre = Html.createTd d in
  let preview = Html.createPre d in
  textbox##rows <- 20 ; textbox##cols <- 50;
  textbox##value <- Js.string initeq;
  preview##style##border <- Js.string "1px black dashed";
  preview##style##padding <- Js.string "5px";
(*  preview##style##width <- Js.string "520px";*)
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



open Tools

let initex = "(a|b)+.C & d | e.(a|b)"

let blue = Js.Unsafe.obj [|
  ( "border" , Js.Unsafe.inject ( Js.string "#2B7CE9"));
  ( "background" , Js.Unsafe.inject ( Js.string "#97C2FC"));
  ( "highlight" , Js.Unsafe.inject ( Js.Unsafe.obj [|
    ( "border" , Js.Unsafe.inject ( Js.string "#2B7CE9"));
    ( "background" , Js.Unsafe.inject ( Js.string "#D2E5FF"))
  |]))
|]

let green = Js.Unsafe.obj [| 
  ("border"  , Js.Unsafe.inject ( Js.string "#41A906"));
  ("background"  , Js.Unsafe.inject ( Js.string "#7BE141"));
  ("highlight"  , Js.Unsafe.inject ( Js.Unsafe.obj [|
    ("border"  , Js.Unsafe.inject ( Js.string "#41A906"));
    ("background"  , Js.Unsafe.inject ( Js.string "#A1EC76"))
  |]))
|]

let purple= Js.Unsafe.obj [|
  ("border", Js.Unsafe.inject ( Js.string "#7C29F0"));
  ("background", Js.Unsafe.inject ( Js.string "#AD85E4"));
  ("highlight", Js.Unsafe.inject ( Js.Unsafe.obj [|
    ("border", Js.Unsafe.inject ( Js.string "#7C29F0"));
    ("background", Js.Unsafe.inject ( Js.string "#D3BDF0"))
  |]))
|]

let node_trans nb i = 
  Js.Unsafe.obj 
    [| 
      ("id", Js.Unsafe.inject ( Js.string (Printf.sprintf "%d" i))) ;
      ("label", Js.Unsafe.inject ( Js.string (Printf.sprintf "   %d   "  (i-nb))));
      ("shape", Js.Unsafe.inject ( Js.string "box" ));
      ("color", Js.Unsafe.inject ( green )); 
      ("fontSize", Js.Unsafe.inject ( Js.number_of_float 25. ))
    |]

let node_place i = 
  Js.Unsafe.obj 
    [| 
      ("id", Js.Unsafe.inject ( Js.string (Printf.sprintf "%d" i))) ;
      ("label", Js.Unsafe.inject ( Js.string (Printf.sprintf "%d" i)));
      ("shape", Js.Unsafe.inject ( Js.string "circle" ));
      ("color", Js.Unsafe.inject ( blue )); 
      ("fontSize", Js.Unsafe.inject ( Js.number_of_float 27. ))
    |]


let node_init i = 
  Js.Unsafe.obj 
    [| 
      ("id", Js.Unsafe.inject ( Js.string (Printf.sprintf "%d" i))) ;
      ("label", Js.Unsafe.inject ( Js.string (Printf.sprintf "%d" i)));
      ("shape", Js.Unsafe.inject ( Js.string "circle" ));
      ("color", Js.Unsafe.inject ( purple )); 
      ("fontSize", Js.Unsafe.inject ( Js.number_of_float 27. ))
    |]

let edge_trans_init i j =
  Js.Unsafe.obj 
    [|("from", Js.Unsafe.inject (Js.string (string_of_int i))); 
      ("to", Js.Unsafe.inject (Js.string (string_of_int j))); 
      ("style", Js.Unsafe.inject (Js.string "arrow-center"))|]

let edge_trans_lettre i x j =
  Js.Unsafe.obj 
    [|("from", Js.Unsafe.inject (Js.string (string_of_int i))); 
      ("to", Js.Unsafe.inject (Js.string (string_of_int j))); 
      ("fontSize", Js.Unsafe.inject (Js.string "25")); 
      ("label", Js.Unsafe.inject (Js.string x)); 
      ("style", Js.Unsafe.inject (Js.string "arrow"))|]

let printTrans nb (s,t) (k,nodes,edges) =
  let edges' =
    ISet.fold (fun p acc -> (edge_trans_init p k)::acc)
      s edges
  in
  let edges'' = 
    SISet.fold 
      (fun (x,q) acc -> (edge_trans_lettre k x q)::acc)
      t edges'
  in
  (k+1,(node_trans nb k)::nodes,edges'')
     
let data expr = 
  let (p,tr,i,fn) = Petri.trad (Exprtools.get_string expr) in
  let places = 
    ISet.fold
      (fun p acc -> 
	(node_place p)::acc)
      (ISet.remove i p)
      [node_init i]
  in
  let nb = ISet.max_elt p +1 in
  let conv a =   
    Js.Unsafe.inject 
      (Js.array (Array.of_list (List.map Js.Unsafe.inject a)))
  in
  let _,nodes,edges =
      Trans.fold 
	(fun t acc -> printTrans nb t acc)
	tr (nb,places,[])
  in
  let fns = Printf.sprintf "Final states : %s" (printisset fn) in
  (Js.Unsafe.obj 
     [|("nodes",conv nodes);
       ("edges",conv edges)|],
   Js.string fns)

let draw_applet tag =
  let d = Html.document in
  let body_draw =
    Js.Opt.get (d##getElementById(Js.string tag))
      (fun () -> raise NotDefined(*Html.createDiv d*)) in
  let textbox_draw = Html.createInput d in
  let preview_draw = Html.createDiv d in
  let preview_draw2 = Html.createP d in
  textbox_draw##size <- 20;
  textbox_draw##value <- Js.string initex;
  preview_draw##id <- Js.string (tag^"_auto");
  preview_draw##className <- Js.string "auto";
  preview_draw2##className <- Js.string "center";
  textbox_draw##className <- Js.string "drawin";
  let tab = Html.createTable d in
  let row = Html.createTr d in
  let txtcell1 = Html.createTd d in
  let txtcell2 = Html.createTd d in
  Dom.appendChild body_draw tab;
  Dom.appendChild tab row;
  Dom.appendChild row txtcell1;
  Dom.appendChild txtcell1 textbox_draw;
  Dom.appendChild row txtcell2;
  Dom.appendChild txtcell2 preview_draw;
  Dom.appendChild txtcell2 preview_draw2;
  let cmd = 
    Printf.sprintf 
      "new vis.Network(document.getElementById('%s_auto'),data, {})" 
      (tag)
  in
  let dyn_preview old_text n =
    let text = Js.to_string (textbox_draw##value) in
    if text <> old_text 
    then 
      begin
        begin 
	  try
	    let data,fns = data text in
	    (Js.Unsafe.variable "window")##data <- data; 
	    Js.Unsafe.eval_string cmd;
	    preview_draw2##innerHTML <- fns
          with _ -> () 
	end;
        (20,text)
      end else
      (max 0 (n - 1),text)
  in
  dyn_preview

let details_applet tag =
  let d = Html.document in
  let body_draw =
    Js.Opt.get (d##getElementById(Js.string tag))
      (fun () -> raise NotDefined(*Html.createDiv d*)) in
  let textbox_draw = Html.createInput d in
  let title1 = Html.createCode d in
  let graph1 = Html.createDiv d in
  let fn1 = Html.createP d in
  let title2 = Html.createCode d in
  let graph2 = Html.createDiv d in
  let fn2 = Html.createP d in
  let outmsg = Html.createCode d in
  textbox_draw##size <- 50;
  textbox_draw##value <- Js.string initeq;
  textbox_draw##className <- Js.string "drawin";
  graph1##id <- Js.string (tag^"_auto1");
  graph1##className <- Js.string "auto";
  graph2##id <- Js.string (tag^"_auto2");
  graph2##className <- Js.string "auto";
  let tab = Html.createTable d in
  let row1 = Html.createTr d in
  let row2 = Html.createTr d in
  let row3 = Html.createTr d in
  let txtcell1 = Html.createTd d in
  let txtcell2 = Html.createTd d in
  let txtcell3 = Html.createTd d in
  let txtcell4 = Html.createTd d in
  let pre = Html.createPre d in
  pre##style##border <- Js.string "1px black dashed";
  Dom.appendChild body_draw tab;
  Dom.appendChild tab row1;
  Dom.appendChild tab row2;
  Dom.appendChild tab row3;
  Dom.appendChild row1 txtcell1;
  Dom.appendChild txtcell1 textbox_draw;
  Dom.appendChild row2 txtcell2;
  Dom.appendChild row2 txtcell3;
  Dom.appendChild txtcell2 title1;
  Dom.appendChild txtcell2 graph1;
  Dom.appendChild txtcell2 fn1;
  Dom.appendChild txtcell3 title2;
  Dom.appendChild txtcell3 graph2;
  Dom.appendChild txtcell3 fn2;
  Dom.appendChild row3 txtcell4;
  Dom.appendChild txtcell4 pre;
  Dom.appendChild pre outmsg;
  let cmd i = 
    Printf.sprintf 
      "new vis.Network(document.getElementById('%s_auto%d'),data, {})" 
      (tag) i
  in
  let refresh i e =
    let se = (Exprtools.print_expr e) in
    let data,fns = data se in
    (Js.Unsafe.variable "window")##data <- data; 
    Js.Unsafe.eval_string (cmd i);
    if i = 1
    then 
      begin
	title1##innerHTML <- (Js.string ("Automaton for : "^se));
	fn1##innerHTML <- fns
      end
    else
      begin
	title2##innerHTML <- (Js.string ("Automaton for : "^se));
	fn2##innerHTML <- fns
      end
  in
  let dyn_preview old_text n =
    let text = Js.to_string (textbox_draw##value) in
    if text <> old_text 
    then 
      begin
        begin 
	  try
	    let (_,e,f) = Exprtools.get_eq text in
	    refresh 1 e;
	    refresh 2 f;
	    let rendered = solve_eqs d true true text in
	    replace_child outmsg rendered
          with _ -> () 
	end;
        (20,text)
      end else
      (max 0 (n - 1),text)
  in
  dyn_preview

let onload _ = 
  let draw = 
    try draw_applet "draw"
    with NotDefined -> (fun t n -> (n,t))
  and solve = 
    try solve_applet "solve" 
    with NotDefined -> (fun t n -> (n,t))
  and detail = 
    try details_applet "details" 
    with NotDefined -> (fun t n -> (n,t))
  in
  let rec dyn_preview old_textex old_texteq old_textdet n =
    let (n1,t1) = draw old_textex n in
    let (n2,t2) = solve old_texteq n1 in
    let (n3,t3) = detail old_textdet n2 in
    Lwt_js.sleep (if n3 = 0 then 0.5 else 0.1) >>= fun () ->
    dyn_preview t1 t2 t3 n3
  in
  ignore (dyn_preview "" "" "" 0);
  Js._false

 
let _ =
Html.window##onload <- Html.handler onload
