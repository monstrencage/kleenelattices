open Expr
open Tools

let get_file filename =
  let ch = open_in filename in
  Parser.exp Lexer.token (Lexing.from_channel ch)

let get_string s = 
  Parser.exp Lexer.token (Lexing.from_string s)

type lettre = string option

type place = int

type transition = Smpl of place * lettre * place | Open of place * (place * place) | Close of (place * place) * place

type net = int * transition list

let input = function
  | Smpl (x,_,_) | Open (x,_) -> [x]
  | Close ((x,y),_) -> sort [x;y]

let output = function
  | Smpl (_,_,x) | Close (_,x) -> [x]
  | Open (_,(x,y)) -> sort [x;y]


let rename f = function
  | Smpl (p,a,q) -> Smpl (f p,a,f q)
  | Open (p,(q1,q2)) -> Open (f p,(f q1,f q2))
  | Close ((p1,p2),q) -> Close ((f p1,f p2),f q)

let rec trad : string expr -> net = function
  | `Un -> (1,[])
  | `Zero -> (2,[])
  | `Var a -> (2,Smpl(0,Some a,1)::[])
  | `Inter (e,f) -> 
    let (n1,p1) = trad e
    and (n2,p2) = trad f in
    let p1' =List.map (rename (fun x -> x+1)) p1
    and p2' =List.map (rename (fun x -> x+n1+1)) p2 in
    (n1+n2+2,
     (Open(0,(1,n1+1)))::
       (Close((n1,n1+n2),n1+n2+1))::
       p1'@p2')
  | `Union (e,f) -> 
    let (n1,p1) = trad e
    and (n2,p2) = trad f in
    let p1' =List.map (rename (fun x -> x+1)) p1
    and p2' =List.map (rename (fun x -> x+n1+1)) p2 in
    (n1+n2+2,
     (Smpl(0,None,1))::
       (Smpl(0,None,n1+1))::
       (Smpl(n1,None,n1+n2+1))::
       (Smpl(n1+n2,None,n1+n2+1))::
       p1'@p2')
  | `Conc(e,f) ->
    let (n1,p1) = trad e
    and (n2,p2) = trad f in
    let p1' =List.map (rename (fun x -> x)) p1
    and p2' =List.map (rename (fun x -> x+n1)) p2 in
    (n1+n2,
     Smpl(n1-1,None,n1)::
       p1'@p2')
  | `Star e ->
    let (n1,p1) = trad e in
    (n1,
     Smpl (n1-1,None,0) :: p1)
  | `Conv _ -> failwith "nope!"




type marquage = ISet.t

let one_step (m : marquage) (_,p : net) =
  List.filter 
    (fun t -> List.for_all (fun x -> ISet.mem x m) (input t))
    p

let go (m : marquage) tr : marquage =
  List.fold_left (fun acc x -> ISet.add x acc)
    (List.fold_left (fun acc x -> ISet.remove x acc) m (input tr))
    (output tr)

