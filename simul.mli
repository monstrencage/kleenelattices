val getlts :
           Petri.net ->
           int list *
           ((Tools.IMap.key -> Tools.ISet.elt -> bool) *
            (string option * Tools.IMap.key) list Tools.IMap.t *
            Tools.ISSet.elt)
           list Tools.ISMap.t * Tools.ISSet.t
val simul : Petri.net -> Petri.net -> bool
