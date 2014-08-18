module Html = Dom_html
let (>>=) = Lwt.bind
open Tools

let handle f x = 
  try f x
  with NotDefined -> ()

let onload _ = 
  handle Wdraw.applet "draw";
  handle Wsolve.applet "solve";
  handle Wsolveneat.applet "solve2";
  handle Wdetsolve.applet "details";
  Js._false

 
let _ =
Html.window##onload <- Html.handler onload
