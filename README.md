Kleenelattices
==============

Library and tools to compare identity-free regular expressions with intersection.

Project home page : http://monstrencage.github.io/kleenelattices

## Required
:camel: To compile and run this program you need OCaml version 4.00 or higher.

## Installation
To compile a bytecode executable, enter in a shell in the source folder :
```shell
$ make
```

For an optimized version type :
```shell
$ make opt
```

If you want to produce a library, the command :
```shell
$ make libs
```

You can find the complete documentation of the project [there](http://monstrencage.github.io/kleenelattices/doc/rkl.html).

You can also install both the libraries and the executable program :
```shell
$ make install
```

## Use :
A typical input file would look like this
```
<expr1> <cmp> <expr2>
<expr3> <cmp> <expr4>
<expr5> <cmp> <expr6>
```
where an expression can use strings as variables/letters, and the operations :
* `<expr1> | <expr2>` : the set union
* `<expr1> & <expr2>` : the set intersection
* `<expr1> . <expr2>` : the composition of relations
* `<expr1>+` : the transitive closure of a relation
* `<expr1>{int}` : the iteration of a relation. For instance, `(a.b){3}` is a shorthand for `(a.b).(a.b).(a.b)`.

You can also use brackets `(...)`.
The valid comparaisons `<cmp>` are :
* `<=` : loose inclusion
* `>=` : converse of the loose inclusion
* `<` : strict inclusion
* `>` : converse of the strict inclusion
* `=` : equality
* `=\=` : negation of the equality
* `<>` : means that the two expressions are incomparable, *i.e.* neither one of them is included in the other.


If `file` is a correct input file, then calling
```shell
$ ./solve file
```
will produce a file `file.res` in which each (in)equation will have been tested and solved.
