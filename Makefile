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
MLI = expr.mli exprtools.mli solve.mli tools.mli word.mli lts.mli 
#petri.mli printPetri.mli simul.mli unionFind.mli
ML = exprtools.ml tools.ml word.ml lts.ml solve.ml
# unionFind.ml petri.ml printPetri.ml simul.ml
AUTRES =  parser.mly lexer.mll

# The executable file to generate

EXEC = solve


########################## Advanced user's variables #####################
#
# The Caml compilers.
# You may fix here the path to access the Caml compiler on your machine
# You may also have to add various -I options.
CAMLC = ocamlc
CAMLOPT = ocamlopt
CAMLDEP = ocamldep
CAMLDOC = ocamldoc
CAMLTOP = ocamlmktop
CAMLLEX = ocamllex
CAMLYACC = ocamlyacc

# The list of Caml libraries needed by the program
# For instance:
# LIBS=$(WITHGRAPHICS) $(WITHUNIX) $(WITHSTR) $(WITHNUMS) $(WITHTHREADS)\
# $(WITHDBM)

# LIBS=$(WITHUNIX)

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

std :: .depend.input .depend $(EXEC)

all:: std opt doc libs

BMLI = $(filter %.mli,$(SMLIYL))
BYTES = $(BMLI:.mli=.cmi) $(OBJS) $(EXEC).cma
OPTS = $(OPTOBJS) $(OPTOBJS:.cmx=.o) $(EXEC).cmxa $(EXEC).a

install: std opt libs
	cp $(EXEC).opt /usr/bin/$(EXEC)
	mkdir -p /usr/lib/ocaml/solve
	cp $(BYTES) $(OPTS) /usr/lib/ocaml/solve/

opt : $(EXEC).opt

doc : $(EXEC).html

top : $(EXEC)_top

libs : $(EXEC).cma $(EXEC).cmxa

archive : $(EXEC).tar.gz

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

# SMLIYB = $(SOURCESB:.mly=.ml)
# SMLIYLB = $(SMLIYB:.mll=.ml)
# SMLYLB = $(filter %.ml,$(SMLIYLB))
# OBJSB = $(SMLYLB:.ml=.cmo)
# OPTOBJSB = $(OBJSB:.cmx=.cmx)

$(EXEC).tar.gz : $(EXEC).tar
	gzip $(EXEC).tar;
	mv $(EXEC).tar.gz $(EXEC).$$(date +%d.%m.%y_%H%M%S).tar.gz

$(EXEC).tar: $(EXEC)_src
	tar -c $(EXEC)_src -f $(EXEC).tar
	rm -rf $(EXEC)_src

$(EXEC)_src : 
	mkdir $(EXEC)_src
	mkdir $(EXEC)_src/doc
	cp $(SOURCES) $(MAIN) Makefile $(EXEC)_src/

$(EXEC): $(OBJS) 
	$(CAMLC) $(CUSTOM) -o $(EXEC) $(LIBS) $(OBJS) $(MAIN)

#$(EXEC)_top : $(OBJSB)
#	$(CAMLTOP) $(CUSTOM) -o $(EXEC)_top $(LIBS) $(OBJSB)

$(EXEC)_top : $(OBJS)
	$(CAMLTOP) $(CUSTOM) -o $(EXEC)_top $(LIBS) $(OBJS)

$(EXEC).cma : $(OBJS)
	$(CAMLC) $(CUSTOM) -a -o $(EXEC).cma $(LIBS) $(OBJS)

$(EXEC).cmxa : $(OPTOBJS)
	$(CAMLOPT) -a -o $(EXEC).cmxa $(filter-out %.cma,$(LIBS)) $(OPTOBJS)

$(EXEC).html : $(OBJS)
	$(CAMLDOC) $(CUSTOM) -o $(EXEC) -html -charset utf8 $(MLI)
	mv *.html doc/
	mv *.css doc/

$(EXEC).opt: $(OPTOBJS)
	$(CAMLOPT) -o $(EXEC).opt $(LIBS:.cma=.cmxa) $(OPTOBJS) $(MAIN)

.SUFFIXES: .ml .mli .cmo .cmi .cmx .mll .mly 

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
	rm -f *.cm[iox] *~ .*~ *.o #*#
	rm -f $(EXEC)
	rm -f $(EXEC).opt
	rm -f $(EXEC)_top
	rm -f $(EXEC).cma
	rm -f $(EXEC).cmxa

.depend.input: Makefile
	@echo -n '--Checking Ocaml input files: '
	@(ls $(SMLIY) $(MAIN) $(SMLIY:.ml=.mli) 2>/dev/null || true) \
	     >  .depend.new
	@diff .depend.new .depend.input 2>/dev/null 1>/dev/null && \
	    (echo 'unchanged'; rm -f .depend.new) || \
	    (echo 'changed'; mv .depend.new .depend.input)

depend: .depend

.depend:: $(SMLIYL) $(MAIN) .depend.input
	@echo '--Re-building dependencies'
	$(CAMLDEP) $(MAIN) $(SMLIY) $(SMLIY:.ml=.mli) > .depend

include .depend
