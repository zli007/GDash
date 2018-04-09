import sys
import twobitreader
 
tbfile = sys.argv[1] 
chrn = sys.argv[2]
start = sys.argv[3]
end = sys.argv[4]

tbf = twobitreader.TwoBitFile(str(tbfile))
seq = tbf[str(chrn)][int(start):int(end)]
f = open('seqin.txt','w')
for i in range(0,len(seq)):
	f.write(seq[i].upper() +'\n')
f.close()

f1 = open('../tmpdatas/seqin.txt','w')
for i in range(0,len(seq)):
	f1.write(seq[i].upper())
f1.close()