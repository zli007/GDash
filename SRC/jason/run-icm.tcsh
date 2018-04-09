#!/bin/tcsh

### this file runs ICM using default parameters and generates and XYZ file

## in this version the number of nucleosomes are automatically determined using an optimal linker
### lenght of 19 bp
###  num_nuc  =  70% of seqlength / (nuc_length + length_length) 

echo 'start of run-icm.tcsh'
##mv tmpdata tmpdatas
##mkdir -p tmpdata
setenv DIR $1;
cd $DIR

set seqlength=`wc -l seqin.txt | awk '{ print $1} '`
set nucbp=`wc -l ../../../DAT/X/01kx5.min.par | awk '{ print $1 -3 } ' `
set lk=19
set denominator=`expr $nucbp + $lk `
set numnuc=`expr $seqlength  \* 7 / $denominator  /  10 ` 
set temp = `cat Temp.txt`
setenv CHR  $1 ;
setenv START  $2 ;
setenv END  $3 ;
setenv PAR  $4 ;
echo  "seq nucbp lk denom numnuc "
echo $seqlength $nucbp $lk $denominator $numnuc

##echo " positions are "
##cat positions.dat

cat << EOF > icmconf.txt
../../../DAT/X0/MD-B.par
../../../DAT/X/01kx5.min.par
../../../DAT/K/MD-B.dat
seqin.txt
eq.out.par
E.dat
$numnuc
$lk
EOF

cat icmconf.txt | ../../../BIN/icm > icm.log
echo "$temp\nicm.par\nicm.dat\n$numnuc\n$nucbp\n"  | ../../../BIN/parTocc2xyz > icm.xyz

set bpcnt=` grep "CA" icm.xyz |  wc -l | awk '{print int($1/5)} ' `
set atoms=`expr $bpcnt +  $numnuc`

echo "  $atoms" > icm.occ.xyz
echo "Comment TcB" >> icm.occ.xyz
grep "CA" icm.xyz | awk '{ if (NR%5 == 0 ) print $0}'  >> icm.occ.xyz
grep "OC" icm.xyz  | sed 's/OC/O/'  >> icm.occ.xyz


### and now dump out he positions
awk ' BEGIN{ getline ; last = $3; if (last != 0 ) {printf " %s ",  $1 } } { if ((last != $3 ) && ( $3 != 0 ) ) { printf " %s ", $1; last = $3 } } END { printf "\n" } ' icm.dat > positions.dat
 
cat positions.dat

set icmd = `wc -l E.dat |awk '{ print $1} '`
mv icm.dat icm2.dat
head -n $icmd icm2.dat > icm.dat
cp ../../../SRC/jsmol/nuc-cores.txt ../nuc-cores.txt
###../mkBigWigs.tcsh icm.par
cd ..
echo 'end of run-icm.tcsh'

