module Html = Dom_html
open Tools

let initeq = "(a|b)+.C & d > d & a.b.C & (d|a)\n"

let replace_child p n =
  Js.Opt.iter (p##firstChild) (fun c -> Dom.removeChild p c);
  Dom.appendChild p n


let applet tag =
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
  pre##className <- Js.string "output";
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
    let data,fns = Wdraw.data se in
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
	    let rendered = Wsolve.solve_eqs d true true text in
	    replace_child outmsg rendered
          with _ -> () 
	end;
        (20,text)
      end else
      (max 0 (n - 1),text)
  in
  dyn_preview
