#!/bin/tcsh
awk ' BEGIN { \
 for ( i = 1; i <= 3; i++ ) { getline < "foldconf.txt" } \
 while ( getline < "foldconf.txt"  ) { id ++; nss[id] = $0;  if($1 == "-1" ){ break} } \
 idmax = id -1; \
 id = 1; \
 nuclength = '$2' ; \
} \
{begin = nss[id]; end = nss[id] + nuclength - 1;   \
  if(NR == begin)  { energy = $2 } \
  if( (NR >= begin) && ( NR <= end ) )  { printf "%8d%10.4f%10.4f\n",  NR,  $2, energy}  else { printf "%8d%10.4f%10.4f\n",  NR, $2, 0 } \
  if(NR == end)  { id++;  }  \
}  '  $1
