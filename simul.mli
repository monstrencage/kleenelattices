type tranche = Tools.SISet.t Tools.IMap.t
type equiv = int -> int -> bool
type ('a,'b) lts = 
  'a * ('b * Petri.marquage) list Tools.ISMap.t * ('a -> bool)
type trans = equiv * tranche

val getlts :
  Petri.net ->
  (Petri.marquage,(equiv * tranche)) lts
    
val simul : Petri.net -> Petri.net -> trans list option
