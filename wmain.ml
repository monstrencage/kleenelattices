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
  Js._false

 
let _ =
Html.window##onload <- Html.handler onload
