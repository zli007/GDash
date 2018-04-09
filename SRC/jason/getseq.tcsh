#!/bin/tcsh

echo 'start of getseq.tcsh'
setenv DIR  $4;
cd $DIR
setenv CHR  $1 ; 
setenv START  $2 ; 
setenv END  $3 ; 

set species=`cat species.txt`

python ../../../SRC/python/read2bit.py ../../../DAT/sequence/$species.2bit $CHR $START $END

cd ..

echo 'end of getseq.tcsh'
