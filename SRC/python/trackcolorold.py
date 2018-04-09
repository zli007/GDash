import sys
import numpy as np

start = sys.argv[1]
end = sys.argv[2]
numnuc = sys.argv[3]

ts = np.zeros(int(end)-int(start))
tstart = np.loadtxt('trackstart.txt')
tend = np.loadtxt('trackend.txt')
tscore = np.loadtxt('trackscore.txt')

for i in range(0,tstart.size):
	if tend[i]<int(start):
		continue
	elif tstart[i]<int(start) and tend[i]<=int(end):
		ts[0:int(tend[i]-int(start)+1)]=tscore[i]
	elif tstart[i]<=int(end) and tend[i]>=int(end):
		ts[int(tstart[i]-int(start)):]=tscore[i]
	elif tstart[i]>int(end):
		continue
	else:
		ts[int(tstart[i]-int(start)):int(tend[i]-int(start)+1)]=tscore[i]
		
ts2 = np.zeros(int(np.ceil(ts.size/5.)))
for j in range(0,ts2.size):
	if (j+1)*5>ts.size:
		ts2[j]=np.mean(ts[j*5:])
	else:
		ts2[j]=np.mean(ts[j*5:(j+1)*5])

if np.min(ts2)<0:
	ts2=ts2-np.min(ts2)
ts2=ts2/np.max(ts2)

f = open('../nuc-cores.txt','a')
for k in range(0,ts2.size):
	scnt=k+1+int(numnuc)
	if ts2[k]<0.1:
		f.write('draw ID @{"dna" +'+str(scnt)+'} DIAMETER 20.0  @{dna['+str(k+1)+'].xyz}  COLOR blue'+'\n')
	elif ts2[k]<0.2 and ts2[k]>=0.1:
		f.write('draw ID @{"dna" +'+str(scnt)+'} DIAMETER 20.0  @{dna['+str(k+1)+'].xyz}  COLOR deepskyblue'+'\n')
	elif ts2[k]<0.3 and ts2[k]>=0.2:
		f.write('draw ID @{"dna" +'+str(scnt)+'} DIAMETER 20.0  @{dna['+str(k+1)+'].xyz}  COLOR lightskyblue'+'\n')
	elif ts2[k]<0.4 and ts2[k]>=0.3:
		f.write('draw ID @{"dna" +'+str(scnt)+'} DIAMETER 20.0  @{dna['+str(k+1)+'].xyz}  COLOR aquamarine'+'\n')
	elif ts2[k]<0.5 and ts2[k]>=0.4:
		f.write('draw ID @{"dna" +'+str(scnt)+'} DIAMETER 20.0  @{dna['+str(k+1)+'].xyz}  COLOR green'+'\n')
	elif ts2[k]<0.6 and ts2[k]>=0.5:
		f.write('draw ID @{"dna" +'+str(scnt)+'} DIAMETER 20.0  @{dna['+str(k+1)+'].xyz}  COLOR greenyellow'+'\n')
	elif ts2[k]<0.7 and ts2[k]>=0.6:
		f.write('draw ID @{"dna" +'+str(scnt)+'} DIAMETER 20.0  @{dna['+str(k+1)+'].xyz}  COLOR yellow'+'\n')
	elif ts2[k]<0.8 and ts2[k]>=0.7:
		f.write('draw ID @{"dna" +'+str(scnt)+'} DIAMETER 20.0  @{dna['+str(k+1)+'].xyz}  COLOR orange'+'\n')
	elif ts2[k]<0.9 and ts2[k]>=0.8:
		f.write('draw ID @{"dna" +'+str(scnt)+'} DIAMETER 20.0  @{dna['+str(k+1)+'].xyz}  COLOR orangered'+'\n')
	else:
		f.write('draw ID @{"dna" +'+str(scnt)+'} DIAMETER 20.0  @{dna['+str(k+1)+'].xyz}  COLOR red'+'\n')
f.close()
