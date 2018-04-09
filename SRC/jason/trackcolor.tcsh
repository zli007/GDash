#!/bin/tcsh

echo 'start of trackcolor.tcsh'
setenv DIR $5
cd $DIR

setenv chr $1 ;
setenv start $2;
setenv end $3 ;
setenv url $4;
set numnuc = ` grep "O" icm.occ.xyz |  wc -l`


python ../../../SRC/python/trackcolor.py $chr $start $end $numnuc $url

cd ..
echo 'end of trackcolor.tcsh'


