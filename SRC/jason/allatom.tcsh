#!/bin/tcsh

echo 'start of allatom.tcsh'

setenv DIR $2
cd $DIR

setenv nstart  $1 ;
set nend = `expr $nstart + 146 `
cut -c $nstart-$nend seqin.txt > seq.txt
tmb5
/usr/local/bin/vmd1.9.2 -dispdev none -pdb ../../../DAT/PDB/1kx5.pdb -e ../../../BIN/call-dsdnadock.vmd -args seq.txt
##/usr/local/bin/vmd -dispdev none -pdb ../../../DAT/PDB/1kx5.pdb -e ../../../BIN/call-dsdnadock.vmd -args seq.txt
exit
echo $nend

cd ..
echo 'end of allatom.tcsh'

