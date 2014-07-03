type tranche = Tools.SISet.t Tools.IMap.t
type equiv = int -> int -> bool
type ('a,'b) lts = 
  'a * ('b * Petri.marquage) list Tools.ISMap.t * ('a -> bool)

val getlts :
  Petri.net ->
  (Petri.marquage,(equiv * tranche)) lts
    
val simul : Petri.net -> Petri.net -> bool
