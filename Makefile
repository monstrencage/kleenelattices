#*********************************************************************#
#                                                                     #
#                           Objective Caml                            #
#                                                                     #
#            Pierre Weis, projet Cristal, INRIA Rocquencourt          #
#                                                                     #
#  Copyright 1998 Institut National de Recherche en Informatique et   #
#  en Automatique.  Distributed only by permission.                   #
#                                                                     #
#*********************************************************************#
# 
# Modified by Didier Remy
# 

#                   Generic Makefile for Objective Caml Programs

############################ Documentation ######################
#
# To use this Makefile:
# -- You must fix the value of the variable SOURCES below.
# (The variable SOURCES is the list of your Caml source files.)
# -- You must create a file .depend, using
# $touch .depend
# (This file will contain the dependancies between your Caml modules,
#  automatically computed by this Makefile.)

# Usage of this Makefile:
# To incrementally recompile the system, type
#     make
# To recompute dependancies between modules, type
#     make depend
# To remove the executable and all the compiled files, type
#     make clean
# To compile using the native code compiler
#     make opt
#
##################################################################


##################################################################
#
# Advanced usage:
# ---------------

# If you want to fix the name of the executable, set the variable
# EXEC, for instance, if you want to obtain a program named my_prog:
# EXEC = my_prog

# If you need special libraries provided with the Caml system,
# (graphics, arbitrary precision numbers, regular expression on strings, ...),
# you must set the variable LIBS to the proper set of libraries. For
# instance, to use the graphics library set LIBS to $(WITHGRAPHICS):
# LIBS=$(WITHGRAPHICS)

# You may use any of the following predefined variable
# WITHGRAPHICS : provides the graphics library
# WITHUNIX : provides the Unix interface library
# WITHSTR : provides the regular expression string manipulation library
# WITHNUMS : provides the arbitrary precision arithmetic package
# WITHTHREADS : provides the byte-code threads library
# WITHDBM : provides the Data Base Manager library
#
#
########################## End of Documentation ####################



########################## User's variables #####################
#
# The Caml sources (including camlyacc and camllex source files)

SOURCES = $(MLI) $(AUTRES) $(ML)

MAIN = main.ml
MLI = expr.mli exprtools.mli solve.mli tools.mli petri.mli printPetri.mli word.mli
#petri.mli printPetri.mli simul.mli unionFind.mli lts.mli printLts.mli
ML = exprtools.ml tools.ml word.ml petri.ml printPetri.ml solve.ml
# lts.ml printLts.ml
# unionFind.ml printPetri.ml simul.ml
AUTRES =  parser.mly lexer.mll
WMAIN = wmain.ml
DRAW= draw.ml

INPUT = $(MLI) $(AUTRES) $(ML) $(MAIN) $(DRAW) $(WMAIN)

# The executable file to generate

NAME=rkl
EXEC = solve draw


########################## Advanced user's variables #####################
#
# The Caml compilers.
# You may fix here the path to access the Caml compiler on your machine
# You may also have to add various -I options.
CAMLC = ocamlc
CAMLOPT = ocamlopt
CAMLDEP = ocamlfind ocamldep -package js_of_ocaml -package js_of_ocaml.syntax -syntax camlp4o
CAMLDOC = ocamldoc
CAMLTOP = ocamlmktop
CAMLLEX = ocamllex
CAMLYACC = ocamlyacc
CAMLWEB = ocamlfind ocamlc -package js_of_ocaml -package js_of_ocaml.syntax -syntax camlp4o -linkpkg

# The list of Caml libraries needed by the program
# For instance:
# LIBS=$(WITHGRAPHICS) $(WITHUNIX) $(WITHSTR) $(WITHNUMS) $(WITHTHREADS)\
# $(WITHDBM)

LIBS=$(WITHUNIX)

# Should be set to -custom if you use any of the libraries above
# or if any C code have to be linked with your program
# (irrelevant for ocamlopt)

# CUSTOM=-custom

# Default setting of the WITH* variables. Should be changed if your
# local libraries are not found by the compiler.
WITHGRAPHICS =graphics.cma -cclib -lgraphics -cclib -L/usr/X11R6/lib -cclib -lX11

WITHUNIX =unix.cma -cclib -lunix

WITHSTR =str.cma -cclib -lstr

WITHNUMS =nums.cma -cclib -lnums

WITHTHREADS =threads.cma -cclib -lthreads

WITHDBM =dbm.cma -cclib -lmldbm -cclib -lndbm

################ End of user's variables #####################


##############################################################
################ This part should be generic
################ Nothing to set up or fix here
##############################################################

std :: dep $(EXEC)

all:: std opt doc libs js

dep : .depend.input .depend

BMLI = $(filter %.mli,$(SMLIYL))
BYTES = $(BMLI:.mli=.cmi) $(OBJS) $(NAME).cma
OPTS = $(OPTOBJS) $(OPTOBJS:.cmx=.o) $(NAME).cmxa $(NAME).a
EXECOPT = $(EXEC:=.opt)

install: std opt libs
	cp $(EXECOPT) /usr/bin/$(NAME)
	mkdir -p /usr/lib/ocaml/$(NAME)
	cp $(BYTES) $(OPTS) /usr/lib/ocaml/solve/

opt : dep $(EXECOPT)

doc : dep $(NAME).html

top : dep $(NAME).top

libs : dep $(NAME).cma $(NAME).cmxa

js : dep $(WMAIN:.ml=.js)
	mkdir -p javascripts
	mv $(WPAGE) javascripts 

archive : dep $(NAME).tar.gz

#ocamlc -custom other options graphics.cma other files -cclib -lgraphics -cclib -lX11
#ocamlc -thread -custom other options threads.cma other files -cclib -lthreads
#ocamlc -custom other options str.cma other files -cclib -lstr
#ocamlc -custom other options nums.cma other files -cclib -lnums
#ocamlc -custom other options unix.cma other files -cclib -lunix
#ocamlc -custom other options dbm.cma other files -cclib -lmldbm -cclib -lndbm

SMLIY = $(SOURCES:.mly=.ml)
SMLIYL = $(SMLIY:.mll=.ml) $($(filter %.mly,$(SOURCES)):.mly=.mli)
SMLYL = $(filter %.ml,$(SMLIYL))
OBJS = $(SMLYL:.ml=.cmo)
OPTOBJS = $(SMLYL:.ml=.cmx)

INMLIY = $(INPUT:.mly=.ml)
INLIYL = $(INMLIY:.mll=.ml) $($(filter %.mly,$(INPUT)):.mly=.mli)

WPAGE = $(WMAIN:.ml=.js)

$(NAME).tar.gz : $(NAME).tar
	gzip $(NAME).tar;
	mv $(NAME).tar.gz $(NAME).$$(date +%d.%m.%y_%H%M%S).tar.gz

$(NAME).tar: $(NAME)_src
	tar -c $(NAME)_src -f $(NAME).tar
	rm -rf $(NAME)_src

$(NAME)_src : 
	mkdir -p $(NAME)_src
	mkdir -p $(NAME)_src/doc
	cp $(INPUT) Makefile $(NAME)_src/

solve : $(OBJS) 
	$(CAMLC) $(CUSTOM) -o solve $(LIBS) $(OBJS) $(MAIN)

draw : $(OBJS) 
	$(CAMLC) $(CUSTOM) -o draw $(LIBS) $(OBJS) $(DRAW)

solve.opt : $(OPTOBJS) 
	$(CAMLOPT) $(CUSTOM) -o solve.opt $(LIBS:.cma=.cmxa) $(OPTOBJS) $(MAIN)

draw.opt : $(OPTOBJS) 
	$(CAMLOPT) $(CUSTOM) -o draw.opt $(LIBS:.cma=.cmxa) $(OPTOBJS) $(DRAW)

#$(EXEC)_top : $(OBJSB)
#	$(CAMLTOP) $(CUSTOM) -o $(EXEC)_top $(LIBS) $(OBJSB)

$(NAME).top : $(OBJS)
	$(CAMLTOP) $(CUSTOM) -o $(NAME)_top $(LIBS) $(OBJS)

$(NAME).cma : $(OBJS)
	$(CAMLC) $(CUSTOM) -a -o $(NAME).cma $(LIBS) $(OBJS)

$(NAME).cmxa : $(OPTOBJS)
	$(CAMLOPT) -a -o $(NAME).cmxa $(filter-out %.cma,$(LIBS)) $(OPTOBJS)

$(NAME).html : $(OBJS)
	$(CAMLDOC) $(CUSTOM) -o $(NAME) -html -charset utf8 $(MLI)
	mkdir -p doc/
	mv *.html doc/
	mv *.css doc/

#$(WPAGE).byte: $(OBJS)
#	$(CAMLWEB) -o $(WPAGE).byte $(filter-out print%,$(OBJS)) $(WMAIN)


.SUFFIXES: .ml .mli .cmo .cmi .cmx .mll .mly .js


.ml.js: $(OBJS)
	$(CAMLWEB) -o $*.byte $(filter-out print%,$(OBJS)) $<
	js_of_ocaml $*.byte

.ml.cmo:
	$(CAMLC) -c $<

.mli.cmi:
	$(CAMLC) -c $<

.ml.cmx:
	$(CAMLOPT) -c $<

.mll.cmo:
	$(CAMLLEX) $<

.mll.cmx:
	$(CAMLLEX) $<
	$(CAMLOPT) -c $*.ml

.mly.cmo:
	$(CAMLYACC) $<
	$(CAMLC) -c $*.mli
	$(CAMLC) -c $*.ml

.mly.cmx:
	$(CAMLYACC) $<
	$(CAMLOPT) -c $*.mli
	$(CAMLOPT) -c $*.ml

.mly.cmi:
	$(CAMLYACC) $<
	$(CAMLC) -c $*.mli

.mll.ml:
	$(CAMLLEX) $<

.mly.ml:
	$(CAMLYACC) $<

clean::
	rm -f *.cm[iox] *~ .*~ *.o *.byte *.js #*#
	rm -f $(EXEC) $(EXECOPT)
	rm -f $(NAME)*

.depend.input: Makefile
	@echo -n '--Checking Ocaml input files: '
	@(ls $(INMLIY) $(INMLIY:.ml=.mli) 2>/dev/null || true) \
	     >  .depend.new
	@diff .depend.new .depend.input 2>/dev/null 1>/dev/null && \
	    (echo 'unchanged'; rm -f .depend.new) || \
	    (echo 'changed'; mv .depend.new .depend.input)

depend: .depend

.depend:: $(INMLIYL) .depend.input
	@echo '--Re-building dependencies'
	$(CAMLDEP) $(INMLIY) $(INMLIY:.ml=.mli) > .depend

include .depend
