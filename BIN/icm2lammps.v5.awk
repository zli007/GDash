#!/bin/tcsh
awk ' BEGIN {   \
  while(getline ) { \
         if ($1 == "CA") { \
          CAcnt ++ ;  \
          CAline[CAcnt] = $0 ; \
          CAType[CAcnt] = 1 ; \
          if(CAcnt == 1) { \
               xmin = xmax = $2; \
               ymin = ymax = $3; \
               zmin = zmax = $4; \
           } else { \
              if ($2 < xmin ) xmin = $2 ; \
              if ($2 > xmax ) xmax = $2 ; \
              if ($3 < ymin ) ymin = $3 ; \
              if ($3 > ymax ) ymax = $3 ; \
              if ($4 < zmin ) zmin = $4 ; \
              if ($4 > zmax ) zmax = $4 ; \
           } \
          } else if ($1 == "O") { \
               Ocnt ++ ; \
               Oline[Ocnt] = $0 ; \
               OCAStart[Ocnt] = CAcnt - 147 + 1; \
               for(i=CAcnt-147+1;i<CAcnt;i++) { ; \
                   CAType[i] = 2; \
               } ; \
          } \
      } \
 }  \
  END { print "#LAMMPS Description ", NR,  CAcnt ;  \
     print  " " ; \
     print  CAcnt+Ocnt, " atoms" ; \
### bond count = number bp - 1 +  2 bonds each octamer to DNA + 7 dna-dna gyres \
     print  CAcnt-1 + Ocnt*16 + Ocnt*8 , " bonds" ; \
### angle count is number bp - 2 \
     print  CAcnt-2, " angles" ; \
     print  0, " dihedrals" ; \
     print  0, " impropers" ; \
     print " " ; \
### DNA atoms and CA atoms \
     print " 3 atom types " ; \
### DNA-DNA-ij ; DNA-DNA-gyre  and DNA-OCT;  \
     print " 3 bond types " ; \
     print " 1 angle types " ; \
     print " 0 dihedral types " ; \
     print " 0 improper types " ; \
     print " " ; \
     skin = 500; \
    printf ("%10.3f %10.3f xlo xhi \n", xmin-skin,xmax+skin) ; \
    printf ("%10.3f %10.3f ylo yhi \n", ymin-skin,ymax+skin) ; \
    printf ("%10.3f %10.3f zlo zhi \n", zmin-skin,zmax+skin) ; \
     print " " ; \
    print "Masses " ; \
     print " " ; \
    print " 1   615 " ; \
    print " 2   615 " ; \
    print " 3   89770 " ; \
    print " # FIX GROUPS " > "fix.groups" ; \
     print " " ; \
               fixlist =sprintf(" "); \
              for(i=1;i<=Ocnt;i++) { \
                 printf "group  %d id %d:%d %d \n" , i,  OCAStart[i] , OCAStart[i]+147, CAcnt +i  >> "fix.groups"   ; \
                 fixlist = sprintf("%s %d", fixlist, i) ; \
              } ; \
     printf " group free subtract all %s \n" , fixlist  >> "fix.groups" ;\
     printf " group fixed union  %s \n" , fixlist >> "fix.groups" ;\
     printf "fix 1 fixed rigid group %d %s \n", Ocnt,fixlist >> "fix.groups"  ; \
     print " " ; \
    print "Atoms " ; \
     print " " ; \
              for(i=1;i<=CAcnt;i++) { \
                 print i,  1, CAType[i], -1.57,  substr(CAline[i],8) ; \
              } ; \
              for(i=1;i<=Ocnt;i++) { \
                 print i+CAcnt, 1, 3, 58,   substr(Oline[i],8) ; \
              } ; \
     print " " ; \
    print "Bonds " ; \
### DNA-DNA-ij bonds => type 1 ~ 3.3 A long \
     print " " ; \
              for(i=1;i<=CAcnt-1;i++) { \
                 print i, 1, i, i+1 ; \
              } ; \
### DNA-DNA gyres => type 3  ~ 25+ A long \
### could also use 8 instead of 6 and get 6 grys instead of  7  \
              for(i=1;i<=Ocnt;i++) { \
                for(j=1 + 6 ; j<=147 - 6 - 78 ; j+=8){ ; \
                 print bndcnt + CAcnt, 3, OCAStart[i] + j, OCAStart[i] + j + 78  ;  \
                  bndcnt ++ ; \
                 print bndcnt + CAcnt, 2, CAcnt+i, OCAStart[i] + j   ;  \
                  bndcnt ++ ; \
                 print bndcnt + CAcnt, 2, CAcnt+i, OCAStart[i] + j + 78  ;  \
                  bndcnt ++ ; \
                 } ; \
              } ; \
     print " " ; \
    print "Angles " ;\
     print " " ; \
              for(i=1;i<=CAcnt-2;i++) { \
                 print i, 1, i, i+1, i+2 ; \
              } ; \
     print " " ; \
    print " " ; } ' $1 
