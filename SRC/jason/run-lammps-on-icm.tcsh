#!/bin/tcsh

## minimize the free DNA model
##../icm2lammps.v5.awk eq.out.xyz > eq.v4.lmp
##mpirun -np 24 lammps < ../eq.v4.in > eq.v4.out &

## minimize the chromatin model
egrep "CA|O" icm.xyz | sed 's/OC/O/'  | ../../../BIN/icm2lammps.v5.awk > icm.occ.lmp
##mpirun -np 24 lammps < ../icm.v4.in > icm.occ.out &
##lammps < ../icm.v4.in > icm.occ.out 
../../../../lammps-17Nov16/src/lmp_serial < ../../../BIN/icm.v4k.in > icm.occ.out 
