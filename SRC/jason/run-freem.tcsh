#!/bin/tcsh

echo 'start of run-freem.tcsh'
setenv DIR $1
cd $DIR

python ../../../SRC/python/run-freem.py

rm icmfreem1.occ.xyz
touch icmfreem1.occ.xyz

foreach fp (1 2 3 4 5 6 7 8 9 10)    
    set bpcnt=` grep "CA" ${fp}.xyz |  wc -l | awk '{print int($1/5)} ' `
    echo "  $bpcnt" >> icmfreem1.occ.xyz
    echo "Comment TcB" >> icmfreem1.occ.xyz
    grep "CA" ${fp}.xyz | awk '{ if (NR%5 == 0 ) print $0}'  >> icmfreem1.occ.xyz
end





#set bpcnt=` grep "CA" icmfreem.xyz |  wc -l | awk '{print int($1/5)} ' `

#echo "  $bpcnt" > icmfreem.occ.xyz
#echo "Comment TcB" >> icmfreem.occ.xyz
#grep "CA" icmfreem.xyz | awk '{ if (NR%5 == 0 ) print $0}'  >> icmfreem.occ.xyz

cd ..
echo 'end of run-freem.tcsh'

