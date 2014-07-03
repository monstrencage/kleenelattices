val getlts :
           Petri.net ->
           int list *
           ((int -> int -> bool) *
            Tools.SISet.t Tools.IMap.t *
            Tools.ISSet.elt)
           list Tools.ISMap.t * Tools.ISSet.t
val simul : Petri.net -> Petri.net -> bool
