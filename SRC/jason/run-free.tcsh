#!/bin/tcsh

echo 'start of run-free.tcsh'
setenv DIR $1;
cd $DIR

python ../../../SRC/python/run-free.py

set bpcnt=` grep "CA" icmfree.xyz |  wc -l | awk '{print int($1/5)} ' `

echo "  $bpcnt" > icmfree.occ.xyz
echo "Comment TcB" >> icmfree.occ.xyz
grep "CA" icmfree.xyz | awk '{ if (NR%5 == 0 ) print $0}'  >> icmfree.occ.xyz

cd ..
echo 'end of run-free.tcsh'

