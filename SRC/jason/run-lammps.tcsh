#!/bin/tcsh

### this file runs fold-it using default parameters and a list of positions and generates an xyz file

echo 'start of run-lammps.tcsh'
setenv DIR $1
#cd testdata
cd $DIR

## minimize the chromatin model
##egrep "CA|O" icm.xyz | sed 's/OC/O/'  | ../icm2lammps.v5.awk > icm.occ.lmp
##mpirun -np 24 lammps < ../icm.v4.in > icm.occ.out &
##lammps < ../icm.v4.in > icm.occ.out 
touch test.txt
../../../SRC/jason/run-lammps-on-icm.tcsh

set xyznum = `sed -n 4p icm.occ.lammpstrj`
set numnuc = `head -1 positions.dat | awk '{print NF}' `
set fxyz = `expr $xyznum - $numnuc`

echo "$xyznum " > icm2.xyz
echo "Comment TcB" >>icm2.xyz
tail -n $xyznum icm.occ.lammpstrj |head -n $fxyz >>icm2.xyz

tail -n $numnuc icm.occ.lammpstrj | grep "C" |sed 's/C/O/'>>icm2.xyz

set bpcnt=` grep "C" icm2.xyz |  wc -l | awk '{print int($1/5)} ' `
set atoms=`expr $bpcnt +  $numnuc`

echo "  $atoms" > icm2.occ.xyz
echo "Comment TcB" >> icm2.occ.xyz
grep "C" icm2.xyz | sed 's/C/CA/' | awk '{ if (NR%5 == 0 ) print $0}'  >> icm2.occ.xyz
grep "O" icm2.xyz >> icm2.occ.xyz

cd ..

echo 'end of run-lammps.tcsh'
