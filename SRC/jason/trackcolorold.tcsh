#!/bin/tcsh

echo 'start of trackcolor.tcsh'
setenv DIR $3
cd $DIR

setenv start $1 ;
setenv end $2;
set numnuc = ` grep "O" icm.occ.xyz |  wc -l`

python ../../../SRC/python/trackcolorold.py $start $end $numnuc

cd ..
echo 'end of trackcolor.tcsh'


