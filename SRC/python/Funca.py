import RW
import numpy as np
import time

def s_ch(s):
	if (s == 'A'):
		d = 0
		p = 'A-T'
	elif(s == 'C'):
		d = 1
		p = 'C-G'
	elif(s == 'G'):
		d = 2
		p = 'G-C'
	elif(s == 'T'):
		d = 3
		p = 'T-A'
	else:
		print 'wrong put'
	return d,p

def s_index(s1,s2):
	d = s_ch(s1)[0]*4 + s_ch(s2)[0]
	return d
	
def write_input():
	pos = RW.Read_position()
	nuc = RW.Read_nucf()
	f = open('input.txt','w')
	for i in range(0,len(pos)):
		f.write(pos[i]+'\n')
		f.write(nuc[i]+'\n')
	f.close()
	
def write_position():
	pos = RW.Read_position()
	nuc = RW.Read_nucf()
	length = []
	for i in range(0,len(nuc)):
		if (nuc[i] == 'oct.par'):
			length.append('147')
		elif (nuc[i] == 'tet.par'):
			length.append('52')
		elif (nuc[i] == 'hex1.par'):
			length.append('99')
		elif (nuc[i] == 'hex2.par'):
			length.append('100')
		else:	
			length.append('147')
	f = open('positions.dat','w')
	for p in pos:
		f.write(p + ' ')
	f.write('\n')
	for l in length:
		f.write(l + ' ')
	f.write('\n')
	for n in nuc:
		f.write(n + ' ')
	f.write('\n')
	f.close()
		
def free_par(seq,d):
	l1 = []
	temp = RW.Read_Tem()
	temp = np.sqrt(temp/298.0)
	if(len(seq)==1):
		pass
	else:
		for i in range(1,len(seq)):
			l = []
			l.append(s_ch(seq[i])[1])
			par = RW.Read_d(d)[s_index(seq[i-1],seq[i])]
			shi = float(par[6])
			sli = float(par[7])
			ris = float(par[8])
			til = float(par[9])
			rol = float(par[10])
			twi = float(par[11])
			if (temp != 0):
				shi = np.random.normal(shi,temp*0.76)
				sli = np.random.normal(sli,temp*0.68)
				ris = np.random.normal(ris,temp*0.37)
				til = np.random.normal(til,temp*4.6)
				rol = np.random.normal(rol,temp*7.2)
				twi = np.random.normal(twi,temp*7.3)
			par[6] = shi
			par[7] = sli
			par[8] = ris
			par[9] = til
			par[10] = rol
			par[11] = twi
			l.extend(par)
			l1.append(l)
	return l1
	
def nuc_par(seq,par):
	#l = seq[1:]
	#for i in range(0,len(seq)-1):
	#	l[i] = s_ch(seq[i+1])[1]
	#l1 = (np.array(((np.array(RW.Read_par(par)).T).tolist()).insert(0,l)).T).tolist()
	l1 = []
	for i in range(1,len(seq)):
		l = []
		l.append(s_ch(seq[i])[1])
		l.extend(RW.Read_par(par)[i])
		l1.append(l)
	return l1
	
def make_par(seq,d):
	l1 = [s_ch(seq[0])[1]]
	l = []
	for i in range(0,12):
		l1.append('0.0')
	l.append(l1)
	lo,pa = RW.Read_input()
	for i in range(0,len(lo)-1):
		if (i%2 ==0):
			l.extend(free_par(seq[(lo[i]-1):(lo[i+1]+1)],d))
		else:
			l.extend(nuc_par(seq[lo[i]:lo[i+1]],pa[i/2]))
	return l
	
def make_free_par():
	seq = RW.Read_seq()
	l1 = [s_ch(seq[0])[1]]
	l = []
	for i in range(0,12):
		l1.append('0.0')
	l.append(l1)
	l.extend(free_par(seq,'MD-B.par'))
	return l

def par2xyz(par):
	##seq = RW.Read_seq()
	##par = make_par(seq,'MD-B.par')
	#par = RW.Read_pars('tet.par')
	pi = np.pi/180
	Mt = np.zeros((3,3))
	Mm = np.zeros((3,3))
	Ti = np.eye(3)
	Tmst = np.zeros((3,3))
	r = np.zeros((3,1))
	D = np.zeros((3,1))
	xyz = []
	for i in range(0,len(par)):
		ca = ['CA']
		h1 = ['H1']
		h2 = ['H2']
		h3 = ['H3']
		shi = float(par[i][7])
		sli = float(par[i][8])
		ris = float(par[i][9])
		til = float(par[i][10])*pi
		rol = float(par[i][11])*pi
		twi = float(par[i][12])*pi
		
		bend = np.sqrt(til*til+rol*rol)
		
		D = np.array([[shi],[sli],[ris]])
		c20 = np.cos(0.5*twi)
		s20 = np.sin(0.5*twi)
		c0 = np.cos(twi)
		s0 = np.sin(twi)
		if (bend != 0):
			c2G = np.cos(0.5*bend)
			s2G = np.sin(0.5*bend)
			cG = np.cos(bend)
			sG = np.sin(bend)
			tG = til/bend
			rG = rol/bend
			cgp = cG + 1.0
			cgm = cG - 1.0
			trc = tG*rG*cgm
			rct = rG*c20 + tG*s20
			rmt = rG*s20 - tG*c20
			tr = tG*tG - rG*rG
			ccg = c0*cgp
			tcm = tr*cgm
			Mt = np.array([[0.5*(ccg-tcm),0.5*s0*cgp-trc,sG*(tG*s20-rG*c20)],[-0.5*s0*cgp-trc,0.5*(ccg+tcm),sG*(rG*s20+tG*c20)],[sG*rct,sG*rmt,cG]])
			c2gm = c2G - 1.0
			rcg = rG*c2gm
			tcg = tG*c2gm
			Mm = np.array([[c20+rcg*rct,-s20-tcg*rct,s2G*rct],[s20+rcg*rmt,c20-tcg*rmt,s2G*rmt],[-s2G*rG,s2G*tG,c2G]])
			Tmst = np.dot(Ti.transpose(),Mm)
			Ti = np.dot(Mt,Ti)
			
		else:
			Tmst = np.array([[Ti[0][0]*c20+Ti[1][0]*s20,-Ti[0][0]*s20+Ti[1][0]*c20,Ti[2][0]],[Ti[0][1]*c20+Ti[1][1]*s20,-Ti[0][1]*s20+Ti[1][1]*c20,Ti[2][1]],[Ti[0][2]*c20+Ti[1][2]*s20,-Ti[0][2]*s20+Ti[1][2]*c20,Ti[2][2]]])
			Ti00 = np.copy(Ti[0][0])
			Ti01 = np.copy(Ti[0][1])
			Ti02 = np.copy(Ti[0][2])
			Ti[0][0] = c0*Ti00+s0*Ti[1][0]
			Ti[0][1] = c0*Ti01+s0*Ti[1][1]
			Ti[0][2] = c0*Ti02+s0*Ti[1][2]
			Ti[1][0] = -s0*Ti00+c0*Ti[1][0]
			Ti[1][1] = -s0*Ti01+c0*Ti[1][1]
			Ti[1][2] = -s0*Ti02+c0*Ti[1][2]
		r = r + np.dot(Tmst,D)
		ca.extend([r[0][0],r[1][0],r[2][0]])
		h1.extend([(r[0]+Ti[0][0])[0],(r[1]+Ti[0][1])[0],(r[2]+Ti[0][2])[0]])
		h2.extend([(r[0]+Ti[1][0])[0],(r[1]+Ti[1][1])[0],(r[2]+Ti[1][2])[0]])
		h3.extend([(r[0]+Ti[2][0])[0],(r[1]+Ti[2][1])[0],(r[2]+Ti[2][2])[0]])
		xyz.append(ca)
		xyz.append(h1)
		xyz.append(h2)
		xyz.append(h3)
	return xyz
		
def partxyz(par):
	##seq = RW.Read_seq()
	##par = make_par(seq,'MD-B.par')
	##par = make_free_par()
	#par = RW.Read_pars(A)
	##start = time.time()
	pi = np.pi/180
	RY = np.zeros((3,3))
	RZ1 = np.zeros((3,3))
	RZ2 = np.zeros((3,3))
	Ti = np.eye(3)
	Tmst = np.zeros((3,3))
	r = np.zeros((3,1))
	D = np.zeros((3,1))
	xyz = []
	for i in range(0,len(par)):
		ca = ['CA']
		h1 = ['H1']
		h2 = ['H2']
		h3 = ['H3']
		shi = float(par[i][7])
		sli = float(par[i][8])
		ris = float(par[i][9])
		til = float(par[i][10])*pi
		rol = float(par[i][11])*pi
		twi = float(par[i][12])*pi		
		
		bend = np.sqrt(til*til+rol*rol)
		
		D = np.array([[shi],[sli],[ris]])
		
		if (bend == 0):
			phi = 0.0
		elif (rol == 0):
			phi = np.pi/2
		elif (rol < 0):
			phi = np.arctan(til/rol) + np.pi
		else:
			phi = np.arctan(til/rol)
		
		RZ1 = np.array([[np.cos(twi*0.5-phi),-np.sin(twi*0.5-phi),0.0],[np.sin(twi*0.5-phi),np.cos(twi*0.5-phi),0.0],[0.0,0.0,1.0]])
		RY = np.array([[np.cos(bend*0.5),0.0,np.sin(bend*0.5)],[0.0,1.0,0.0],[-np.sin(bend*0.5),0.0,np.cos(bend*0.5)]])
		RZ2 = np.array([[np.cos(phi),-np.sin(phi),0.0],[np.sin(phi),np.cos(phi),0.0],[0.0,0.0,1.0]])
		Mm = np.dot(RZ1,np.dot(RY,RZ2))
		Tmst = np.dot(Ti,Mm)
		RY = np.array([[np.cos(bend),0.0,np.sin(bend)],[0.0,1.0,0.0],[-np.sin(bend),0.0,np.cos(bend)]])
		RZ2 = np.array([[np.cos(twi*0.5+phi),-np.sin(twi*0.5+phi),0.0],[np.sin(twi*0.5+phi),np.cos(twi*0.5+phi),0.0],[0.0,0.0,1.0]])
		Mt = np.dot(RZ1,np.dot(RY,RZ2))
		Ti = np.dot(Ti,Mt)
		r = r + np.dot(Tmst,D)
		ca.extend([r[0][0],r[1][0],r[2][0]])
		h1.extend([(r[0]+Ti[0][0])[0],(r[1]+Ti[1][0])[0],(r[2]+Ti[2][0])[0]])
		h2.extend([(r[0]+Ti[0][1])[0],(r[1]+Ti[1][1])[0],(r[2]+Ti[2][1])[0]])
		h3.extend([(r[0]+Ti[0][2])[0],(r[1]+Ti[1][2])[0],(r[2]+Ti[2][2])[0]])
		xyz.append(ca)
		xyz.append(h1)
		xyz.append(h2)
		xyz.append(h3)
	##end = time.time()
	##print end-start
				
	return xyz
	
def par2occ2xyz():
	seq = RW.Read_seq()
	par = make_par(seq,'MD-B.par')
	xyz = par2xyz(par)
	lo,pa = RW.Read_input()
	occ = []
	for i in range(0,len(lo)-1):
		x = 0
		y = 0
		z = 0
		oc = ['OC']
		if (i%2 != 0):
			for j in range(lo[i]*4,lo[i+1]*4):
				if (pa[(i-1)/2] == 'tet.par'):
					x = (xyz[(lo[i]+5)*4][1]+xyz[(lo[i+1]-5)*4][1])*(lo[i+1]-lo[i])/2
					y = (xyz[(lo[i]+5)*4][2]+xyz[(lo[i+1]-5)*4][2])*(lo[i+1]-lo[i])/2
					z = (xyz[(lo[i]+5)*4][3]+xyz[(lo[i+1]-5)*4][3])*(lo[i+1]-lo[i])/2
				else:
					if (j%4 == 0):
						x = x + xyz[j][1]
						y = y + xyz[j][2]
						z = z + xyz[j][3]
			oc.extend([x/(lo[i+1]-lo[i]),y/(lo[i+1]-lo[i]),z/(lo[i+1]-lo[i])])
			occ.append(oc)
	for k in range(0,len(occ)):
		xyz.insert((lo[2*k+2]-2)*4+k,occ[k])
	return xyz

def Write_par():
	seq = RW.Read_seq()
	par = make_par(seq,'MD-B.par')
	f = open('icm.par','w')
	f.write(str(len(par))+' base pairs'+'\n')
	f.write('0  ***local base-pair & step parameters***'+'\n')
	f.write('	Shear  	Stretch  	Stagger 	Buckle 	Prop-Tw 	Opening   	Shift  	Slide  	  Rise   	 Tilt  	  Roll  	 Twist'+'\n')
	for i in range(0,len(par)):
		f.write(par[i][0] + '\t')
		for j in range(1,13):
			
			f.write(('%.5f'%float(par[i][j])).ljust(10,' '))
		f.write('\n')	
	f.close()
	
def Write_file_xyz():
	xyz = par2occ2xyz()
	temp = RW.Read_Tem()
	f = open('icm.xyz','w')
	f.write(str(len(xyz))+'\n')
	f.write('COMMENT  TcB parTocc2xyz Temp(K): ' +str(temp)+'\n')
	for i in range(0,len(xyz)):
		##f.write(xyz[i][0] + '\t')
		f.write((xyz[i][0] ).ljust(20,' '))
		for j in range(1,4):
			
			f.write(('%.5f'%xyz[i][j]).ljust(20,' '))
		f.write('\n')	
	f.close()
	
def Write_file_free_xyz():
	par = make_free_par()
	xyz = par2xyz(par)
	temp = RW.Read_Tem()
	f = open('icmfree.xyz','w')
	f.write(str(len(xyz))+'\n')
	f.write('COMMENT  TcB parTocc2xyz Temp(K): ' +str(temp)+'\n')
	for i in range(0,len(xyz)):
		##f.write(xyz[i][0] + '\t')
		f.write((xyz[i][0] ).ljust(20,' '))
		for j in range(1,4):			
			f.write(('%.5f'%xyz[i][j]).ljust(20,' '))
		f.write('\n')	
	f.close()
	
def Write_file_free_xyz_m(filename):
	par = make_free_par()
	xyz = par2xyz(par)
	temp = RW.Read_Tem()
	f = open(filename,'w')
	f.write(str(len(xyz))+'\n')
	f.write('COMMENT  TcB parTocc2xyz Temp(K): ' +str(temp)+'\n')
	for i in range(0,len(xyz)):
		##f.write(xyz[i][0] + '\t')
		f.write((xyz[i][0] ).ljust(20,' '))
		for j in range(1,4):			
			f.write(('%.5f'%xyz[i][j]).ljust(20,' '))
		f.write('\n')	
	f.close()
	
def Write_file_free_xyz_mul(xyz):
	temp = RW.Read_Tem()
	f = open('icmfreem.xyz','w')
	f.write(str(len(xyz))+'\n')
	f.write('COMMENT  TcB parTocc2xyz Temp(K): ' +str(temp)+'\n')
	for i in range(0,len(xyz)):
		##f.write(xyz[i][0] + '\t')
		f.write((xyz[i][0] ).ljust(20,' '))
		for j in range(1,4):			
			f.write(('%.5f'%xyz[i][j]).ljust(20,' '))
		f.write('\n')	
	f.close()

def merge_xyz(n):
	xyz=[]
	for i in range(0,n):
		par = make_free_par()
		xyztmp = par2xyz(par)
		xyz.extend(xyztmp)
	return xyz
	
def Write_merge_xyz(n):
	temp = RW.Read_Tem()
	f = open('icmfreem.xyz','w')
	for i in range(0,n):
		par = make_free_par()
		xyztmp = par2xyz(par)
		f.write(str(len(xyztmp))+'\n')
		f.write('COMMENT  TcB parTocc2xyz Temp(K): ' +str(temp)+'\n')
		for i in range(0,len(xyztmp)):
			f.write((xyztmp[i][0] ).ljust(20,' '))
			for j in range(1,4):			
				f.write(('%.5f'%xyztmp[i][j]).ljust(20,' '))
			f.write('\n')	
		f.close