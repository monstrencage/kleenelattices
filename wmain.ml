module Html = Dom_html

let (>>=) = Lwt.bind


let cut str =
  let s c = 
    let st = " " in
    st.[0]<- c;
    st
  in
  let rec aux acc1 acc2 i =
    try
      match str.[i] with
      | '\n' -> aux "" (acc1::acc2) (i+1)
      | c -> aux (acc1^(s c)) acc2 (i+1)
    with 
      Invalid_argument _ -> (List.rev (acc1::acc2))
  in
  aux "" [] 0

let solve d str =
  let p = Html.createP d
  and sl = List.map Js.string (Tools.bind (fun (_,s) -> cut s) (List.map Solve.solve (cut str)))
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


let onload _ =
  let d = Html.document in
  let body =
    Js.Opt.get (d##getElementById(Js.string "zob"))
      (fun () -> assert false) in
  let tab = Html.createTable d in
  let row = Html.createTr d in
  let txtcell = Html.createTd d in
  let textbox = Html.createTextarea d in
  textbox##rows <- 20 ; textbox##cols <- 50;
  let preview = Html.createTd d in
  preview##style##border <- Js.string "1px black dashed";
  preview##style##padding <- Js.string "5px";
  preview##style##width <- Js.string "400px";
  Dom.appendChild body tab;
  Dom.appendChild tab row;
  Dom.appendChild row txtcell;
  Dom.appendChild txtcell textbox;
  Dom.appendChild row preview;
  let rec dyn_preview old_text n =
    let text = Js.to_string (textbox##value) in
    let n =
      if text <> old_text then begin
        begin try
          let rendered = solve d text in
          replace_child preview rendered;
        with _ -> () end;
        20
      end else
        max 0 (n - 1)
    in
    Lwt_js.sleep (if n = 0 then 0.5 else 0.1) >>= fun () ->
    dyn_preview text n
  in
  ignore (dyn_preview "" 0);
  Js._false

let _ =
Html.window##onload <- Html.handler onload
