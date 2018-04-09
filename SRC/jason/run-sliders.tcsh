#!/bin/tcsh

### this file runs fold-it using default parameters and a list of positions and generates an xyz file
echo 'start of run-sliders.tcsh'
#cd testdata
##rm -fr /tmpdata/*
setenv DIR $3
cd $DIR

##if( $# < 1)  then
##  echo " \n usage: $0 Pos1 Pos2 ....   \n" 
## echo " You must provide a list of nucleosome positions\n"
##  echo " \n" 
##  exit()
##endif
setenv phi  $1 ; 
setenv lk  $2 ; 
set seqlength=`wc -l seqin.txt | awk '{ print $1} '`
set nucsbp=`wc -l ../../../DAT/X/01kx5.min.par | awk '{ print $1 -3 } ' `
set maxpos = `expr $seqlength - $nucsbp - $lk `

cat << EOF > foldconf.txt
../../../DAT/X0/MD-B.par
../../../DAT/X/01kx5.min.par
seqin.txt
EOF


####foreach j (`cat positions.dat`) 
###foreach j ($argv) 
###  echo $j >> foldconf.txt
###end
set j = `expr $phi + 1`
while ($j < $maxpos)
    echo $j >> foldconf.txt
    @ j = $j + 147 + $lk
end
    

echo "-1\nicm.par\n" >> foldconf.txt 

cat foldconf.txt | ../../../BIN/fold-conf
../../../BIN/run-seqscans.tcsh

###set numbp=`wc -l seqin.txt | awk '{ print $1} ' `
set nucbp=`wc -l ../../../DAT/X/01kx5.min.par | awk '{ print $1 -3 } ' `
#set numnuc=$#
set numnuc = `wc -l foldconf.txt | awk '{ print $1 -6 } ' `
set temp = `cat Temp.txt`

../../../BIN/nss.awk E.dat $nucbp > icm.dat


echo "$temp\nicm.par\nicm.dat\n$numnuc\n$nucbp\n"  | ../../../BIN/parTocc2xyz > icm.xyz


set bpcnt=` grep "CA" icm.xyz |  wc -l | awk '{print int($1/5)} ' `
set atoms=`expr $bpcnt +  $numnuc`

echo "  $atoms" > icm.occ.xyz
echo "Comment TcB" >> icm.occ.xyz
grep "CA" icm.xyz | awk '{ if (NR%5 == 0 ) print $0}'  >> icm.occ.xyz
####grep "OC" icm.xyz  >> icm.occ.xyz
grep "OC" icm.xyz  | sed 's/OC/O/'  >> icm.occ.xyz

awk ' BEGIN{ getline ; last = $3; if (last != 0 ) {printf " %s ",  $1 } } { if ((last != $3 ) && ( $3 != 0 ) ) { printf " %s ", $1; last = $3 } } END { printf "\n" } ' icm.dat > positions.dat
 
cat positions.dat

###../mkBigWigs.NEW.tcsh icm.par
cp ../../../SRC/jsmol/nuc-cores.txt ../nuc-cores.txt
cd ..
echo 'end of run-sliders.tcsh'









