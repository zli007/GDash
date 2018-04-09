#!/bin/tcsh

echo 'start of color.tcsh'
setenv DIR $2
cd $DIR

setenv nucid  $1 ;
setenv color  $3 ;

set scnt = `expr $1 + 1`

echo "select oxygen" >> ../nuc-cores.txt
echo "var cores = {selected}" >> ../nuc-cores.txt
echo "ncores = cores.size" >> ../nuc-cores.txt
echo "draw ID @{"nuc" + $scnt} DIAMETER 80.0  @{cores[$scnt].xyz} COLOR $color" >> ../nuc-cores.txt



cd ..
echo 'end of color.tcsh'


