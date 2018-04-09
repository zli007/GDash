#!/bin/tcsh
echo 'start of mkBigWigs.tcsh'

setenv DIR $6
cd $DIR
if ( $# != 6  ) then  
  echo " \n \n USAGE ERROR:  "
  echo " \n usage: $0 [chrom num] [start coord] [end coord]  [output par]\n" ;
  echo "   you must specify the chromosome coordinates as indicated above and an output.par "
  echo " \n" ;
  echo " \n" ;
  exit() ;
else 
  setenv CHR  $1 ; 
  setenv START  $2 ; 
  setenv END  $3 ; 
  setenv PAR $4;
  setenv DIFF $5;
endif

set species=`cat species.txt`

awk ' BEGIN {  getline; getline; getline pars ; split(pars,name) ; \
 print pars ; \
 for(i=1; i<=12; i++) {  \
   fp = sprintf("%s.in",name[i]) \
   print "file name and fields ", fp,NF; \
   print "browser position '$CHR':'$START'-'$END'" > fp ; \
   print "browser hide all " >> fp; \
   print "variableStep chrom='$CHR'" >> fp; \
 } \
}  { \
 for(i=2; i<=13; i++) {  \
   fp = sprintf("%s.in",name[i-1]) \
   printf (" %d %f \n", NR + '$START', $i)  >> fp ; \
} }   '  $PAR

foreach fp   ( Buckle Prop-Tw  Roll   Shift  Stagger  Tilt Opening Rise  Shear   Slide   Stretch   Twist   ) 
  echo $fp 
  ../../../BIN/wigToBigWig ${fp}.in ../../../DAT/CHS/$species.chrom.bin  ${fp}.bw 
end


### make the energy bigwig file
echo "browser position ${CHR}:${START}-${END}"  > E.bwin
echo "browser hide all" >> E.bwin
echo "variableStep chrom=${CHR}" >> E.bwin
##cat E.dat >> E.bwin
cat E.dat | awk '{print $1+'$START', $2}' >>E.bwin
../../../BIN/wigToBigWig E.bwin ../../../DAT/CHS/$species.chrom.bin  E.bw 



### make the positions bigwig file
echo "browser position ${CHR}:${START}-${END}"  >  Positions.in
echo "browser hide all" >>  Positions.in
echo "variableStep chrom=${CHR}" >> Positions.in

cat icm.dat | awk '{print $1+'$START', $3}' >> Positions.in
../../../BIN/wigToBigWig Positions.in ../../../DAT/CHS/$species.chrom.bin  Positions.bw 



echo "var chrID = 22 ," > ../view.js
echo "    default_viewStart = `expr $START - $DIFF `," >> ../view.js
echo "    default_viewEnd = ` expr $END + $DIFF ` ;" >> ../view.js
echo "    diff = $DIFF ;" >> ../view.js

cd ..
echo 'end of mkBigWigs.tcsh'

  
