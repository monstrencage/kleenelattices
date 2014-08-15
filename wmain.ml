module Html = Dom_html
let (>>=) = Lwt.bind
open Tools

let onload _ = 
  let draw = 
    try Wdraw.applet "draw"
    with NotDefined -> (fun t n -> (n,t))
  and solve = 
    try Wsolve.applet "solve" 
    with NotDefined -> (fun t n -> (n,t))
  and detail = 
    try Wdetsolve.applet "details" 
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
