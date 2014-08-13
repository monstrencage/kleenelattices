module Html = Dom_html

let (>>=) = Lwt.bind

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
      | '\n' when acc1="" -> aux "" acc2 (i+1)
      | '\n' -> aux "" (acc1::acc2) (i+1)
      | c -> aux (acc1^(s c)) acc2 (i+1)
    with 
      Invalid_argument _ -> (List.rev (acc1::acc2))
  in
  aux "" [] 0


let handle f x =
  try
    f x	
  with Parsing.Parse_error -> (false,"")

let solve d str =
  let p = Html.createP d
  and sl = 
    List.map 
      Js.string 
      (Tools.bind 
	 (function
	 | _,"" -> [] 
	 | (_,s) -> cut s) 
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
    sl;
  p

let replace_child p n =
  Js.Opt.iter (p##firstChild) (fun c -> Dom.removeChild p c);
  Dom.appendChild p n

open Tools

let initex = "(a|b)+.C & d"

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
  let nb = Trans.cardinal tr in
  let conv a =   
    Js.Unsafe.inject 
      (Js.array (Array.of_list (List.map Js.Unsafe.inject a)))
  in
  let _,nodes,edges =
      Trans.fold 
	(fun t acc -> printTrans nb t acc)
	tr (ISet.max_elt p +1,places,[])
  in
  Js.Unsafe.obj 
    [|("nodes",conv nodes);
      ("edges",conv edges)|]

let onload _ = 
  let d = Html.document in
  let draw =
    Js.Opt.get (d##getElementById(Js.string "draw"))
      (fun () -> assert false) in
  let textbox_draw = Html.createInput d in
  let preview_draw = Html.createTd d in
  let _ =
    (*textbox_draw##rows <- 1 ; *)
    textbox_draw##size <- 20;
    textbox_draw##value <- Js.string initex;
    preview_draw##id <- Js.string "auto";
    let tab = Html.createTable d in
    let row = Html.createTr d in
    let txtcell = Html.createTd d in
    Dom.appendChild draw tab;
    Dom.appendChild tab row;
    Dom.appendChild row txtcell;
    Dom.appendChild txtcell textbox_draw;
    Dom.appendChild row preview_draw;
  in
  let body =
    Js.Opt.get (d##getElementById(Js.string "solve"))
      (fun () -> assert false) in

  let textbox = Html.createTextarea d in
  let preview = Html.createTd d in
  let _ =
    textbox##rows <- 20 ; textbox##cols <- 50;
    textbox##value <- Js.string initeq;
    preview##style##border <- Js.string "1px black dashed";
    preview##style##padding <- Js.string "5px";
    preview##style##width <- Js.string "400px";
    let tab = Html.createTable d in
    let row = Html.createTr d in
    let txtcell = Html.createTd d in
    Dom.appendChild body tab;
    Dom.appendChild tab row;
    Dom.appendChild row txtcell;
    Dom.appendChild txtcell textbox;
    Dom.appendChild row preview;
  in
  let rec dyn_preview old_textex old_texteq n =
    let textex = Js.to_string (textbox_draw##value) in
    let n =
      if textex <> old_textex then begin
        begin try
          let data = data textex in
	  (Js.Unsafe.variable "window")##montexte <-  Js.string "caca";
	  (Js.Unsafe.variable "window")##data <- data; 
	  Js.Unsafe.eval_string 
	     "new vis.Network(document.getElementById('auto'),data, {})"
        with _ -> () end;
        20
      end else
        max 0 (n - 1)
    in
    let texteq = Js.to_string (textbox##value) in
    let n =
      if texteq <> old_texteq then begin
        begin try
          let rendered = solve d texteq in
          replace_child preview rendered;
        with _ -> () end;
        20
      end else
        max 0 (n - 1)
    in
    Lwt_js.sleep (if n = 0 then 0.5 else 0.1) >>= fun () ->
    dyn_preview textex old_texteq n
  in
  ignore (dyn_preview "" "" 0);
  Js._false

 
let _ =
Html.window##onload <- Html.handler onload
