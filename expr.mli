type 'a expr = [
| `Var of 'a
| `Inter of 'a expr * 'a expr
| `Conc  of 'a expr * 'a expr
| `Union  of 'a expr * 'a expr
| `Zero
| `Un
| `Star of 'a expr
| `Conv of 'a expr ]

type 'a rkli = [
| `Var of 'a
| `Inter of 'a rkli * 'a rkli
| `Conc  of 'a rkli * 'a rkli
| `Union  of 'a rkli * 'a rkli
| `Zero
| `Un ]

type 'a rkl = [
| `Var of 'a
| `Inter of 'a rkl * 'a rkl
| `Conc  of 'a rkl * 'a rkl
| `Union  of 'a rkl * 'a rkl
| `Zero ]

type 'a ground = [
| `Var of 'a
| `Inter of 'a ground * 'a ground
| `Conc  of 'a ground * 'a ground ]

type comp = [ `Geq | `Gt | `Leq | `Lt | `Incomp | `Neq | `Eq ]
