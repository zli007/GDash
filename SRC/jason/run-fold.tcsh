#!/bin/tcsh

### this file runs fold-it using default parameters and a list of positions and generates an xyz file
echo 'start of run-fold.tcsh'
#cd testdata
##rm -fr /tmpdata/*
setenv DIR $1
cd $DIR

if( $# < 2)  then
  echo " \n usage: $0 Pos1 Pos2 ....   \n" 
  echo " You must provide a list of nucleosome positions\n"
  echo " \n" 
  exit()
endif

cat << EOF > foldconf.txt
../../../DAT/X0/MD-B.par
../../../DAT/X/01kx5.min.par
seqin.txt
EOF


####foreach j (`cat positions.dat`) 
foreach j ($argv) 
  if ($j != $DIR) echo $j >> foldconf.txt
end

echo "-1\nicm.par\n" >> foldconf.txt 

cat foldconf.txt | ../../../BIN/fold-conf
../../../BIN/run-seqscans.tcsh

###set numbp=`wc -l seqin.txt | awk '{ print $1} ' `
set nucbp=`wc -l ../../../DAT/X/01kx5.min.par | awk '{ print $1 -3 } ' `
set numnuc=`expr $# - 1`
set temp = `cat Temp.txt`

../../../BIN/nss.awk E.dat $nucbp > icm.dat


echo "$temp\nicm.par\nicm.dat\n$numnuc\n$nucbp\n"  | ../../../BIN/parTocc2xyz > test.xyz

python ../../../SRC/python/setinput.py
python ../../../SRC/python/run-fold.py


set bpcnt=` grep "CA" icm.xyz |  wc -l | awk '{print int($1/5)} ' `
set atoms=`expr $bpcnt +  $numnuc`

echo "  $atoms" > icm.occ.xyz
echo "Comment TcB" >> icm.occ.xyz
grep "CA" icm.xyz | awk '{ if (NR%5 == 0 ) print $0}'  >> icm.occ.xyz
####grep "OC" icm.xyz  >> icm.occ.xyz
grep "OC" icm.xyz  | sed 's/OC/O/'  >> icm.occ.xyz

##echo "  $atoms" > test.occ.xyz
##echo "Comment TcB" >> test.occ.xyz
##grep "CA" test.xyz | awk '{ if (NR%5 == 0 ) print $0}'  >> test.occ.xyz
####grep "OC" icm.xyz  >> icm.occ.xyz
##grep "OC" test.xyz  | sed 's/OC/O/'  >> test.occ.xyz

##awk ' BEGIN{ getline ; last = $3; if (last != 0 ) {printf " %s ",  $1 } } { if ((last != $3 ) && ( $3 != 0 ) ) { printf " %s ", $1; last = $3 } } END { printf "\n" } ' icm.dat > positions.dat
 
##cat positions.dat

###../mkBigWigs.NEW.tcsh icm.par
cp ../../../SRC/jsmol/nuc-cores.txt ../nuc-cores.txt

cd ..
echo 'end of run-fold.tcsh'

