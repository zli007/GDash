def Read_par(A):
	f = open('../../../DAT/X/'+A,'r')
	content = [x.rstrip('\n') for x in f]
	f.close()
	data = [x.split()[1:] for x in content[3:]]
	return data
	
def Read_pars(A):
	f = open(A,'r')
	content = [x.rstrip('\n') for x in f]
	f.close()
	data = [x.split()[0:] for x in content[3:]]
	return data
	
def Read_d(A):
	f = open('../../../DAT/X0/'+A,'r')
	content = [x.rstrip('\n') for x in f]
	f.close()
	data = [x.split()[1:] for x in content[3:]]
	return data
	
def Read_seq():
	seq = []
	with open('seqin.txt') as f:
		for line in f:
			seq.append(line.rstrip())
	return seq

def Read_input():
	inp1 = []
	with open('input.txt') as f:
		for line in f:
			inp1.append(line.rstrip())
		inp2 = inp1[1::2]
		for i in range(0,len(inp1)/2):
			inp1[2*i] = int(inp1[2*i])
			inp1[2*i+1] = inp1[2*i]+len(Read_par(inp1[2*i+1]))
		inp1.insert(0,1)
		inp1.append(len(Read_seq())-1)
	return inp1, inp2
	
def Read_K(A):
	f =  open('../../../DAT/K/'+A,'r')
	content = [x.rstrip('\n') for x in f]
	f.close()
	data = []
	for i in range(0,16):
		a = [x.split()[1:] for x in content[i*7+1:i*7+7]]
		data.extend(a)
	return data
	
def Read_position():
	f = open('foldconf.txt','r')
	content = [x.rstrip('\n') for x in f]
	f.close()
	data = content[3:len(content)-3]
	return data
	
def Read_nucf():
	f = open('nucfamily.txt','r')
	content = [x.rstrip('\n\r') for x in f]
	f.close()	
	return content
	
def Read_Tem():
	f = open('Temp.txt','r')
	content = [x.rstrip('\n\r') for x in f]
	f.close()
	return float(content[0])
	
def Read_xyz(A):
	f = open(A,'r')
	content = [x.rstrip('\n') for x in f]
	f.close()
	data = [x.split()[0:] for x in content[2:]]
	return data