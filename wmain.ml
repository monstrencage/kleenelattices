module Html = Dom_html
let (>>=) = Lwt.bind
open Tools

let handle f x = 
  try f x
  with NotDefined -> ()

let onload _ = 
  handle Wdraw.applet "draw";
  handle Wdetsolve.applet "details";
  handle Wsolve.applet "solve";

(*  let d = Html.document in
  let _ =
    try
      let body =
	Js.Opt.get (d##getElementById(Js.string "solve"))
	  (fun () -> raise NotDefined) 
      in
      let table = Html.createTable d
      and row = Html.createTr d
      and td1 = Html.createTd d
      and app = Html.createTd d 
      and butt = Html.createButton d 
      and det = ref false in
      app##id<-Js.string "solve_applet";
      Dom.appendChild body table;
      Dom.appendChild table row;
      Dom.appendChild row td1;
      Dom.appendChild row app;
      Dom.appendChild td1 butt;
      butt##innerHTML<- Js.string "Simple";
      td1##style##verticalAlign <- Js.string "top";
      butt##style##width <- Js.string "80px";
      butt##onclick <- Html.handler 
	(fun _ -> 
	  if !det 
	  then 
	    begin
	      butt##innerHTML<- Js.string "Simple";
	      app##innerHTML<-Js.string "";
	      handle Wsolveneat.applet "solve_applet";
	      det:=false
	    end
	  else 
	    begin
	      butt##innerHTML<- Js.string "Detailed";
	      app##innerHTML<-Js.string "";
	      handle Wsolve.applet "solve_applet";
	      det:=true
	    end;
	  Js._false);
      handle Wsolveneat.applet "solve_applet"
    with NotDefined -> ()
  in*)
  Js._false

 
let _ =
Html.window##onload <- Html.handler onload
