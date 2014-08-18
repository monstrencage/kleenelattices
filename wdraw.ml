module Html = Dom_html
open Tools

let initex = "(a|b)+.C & d | e.(a|b)"

let initeq = "(a|b)+.C & d > d & a.b.C & (d|a)\n"

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

let applet tag =
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
  let update () = 
    let text = Js.to_string (textbox_draw##value) in
    try
      let data,fns = data text in
      (Js.Unsafe.variable "window")##data <- data; 
      Js.Unsafe.eval_string cmd;
      preview_draw2##innerHTML <- fns
    with _ -> () 
  in
  update();
  textbox_draw##onchange <- Html.handler
    (fun e -> update();Js._false)
