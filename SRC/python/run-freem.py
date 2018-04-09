import Funca
#xyz=Funca.merge_xyz(10)
#Funca.Write_file_free_xyz_mul(xyz)

name=[]
for i in range(0,10):
	name.append(str(i+1)+'.xyz')
	Funca.Write_file_free_xyz_m(name[i])