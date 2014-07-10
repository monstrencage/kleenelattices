val equiv : Tools.IUF.item -> Tools.IUF.item -> Tools.IUF.state -> bool
val canon :
  (Tools.IUF.state * Tools.SISet.t Tools.IMap.t) list ->
  Tools.SISet.t Tools.IMap.t list
val img : Tools.SISet.t Tools.IMap.t -> Tools.ISet.t
val dom : 'a Tools.IMap.t -> Tools.ISet.t
val ok_lst : Tools.SISet.t Tools.IMap.t list -> bool
val test : (Tools.IUF.state * Tools.SISet.t Tools.IMap.t) list -> bool
