#!/usr/bin/env python
#-*- coding: utf-8 -*-

import csv
import datetime

file_test = open("./test/data.csv", "r")

#################################
######  Usefull functions  ######
#################################

def normalize_colors(a):
	l_color = a.split(",")
	if len(l_color)==3:
		l_color[0]=float(l_color[0].replace("[",""))
		l_color[1]=float(l_color[1])
		l_color[2]=float(l_color[2].replace("]",""))
		for i in range(len(l_color)):
			if l_color[0] <= 1 and l_color[1] <=1 and l_color[2]<=1:
				l_color[0]*=255
				l_color[1]*=255
				l_color[2]*=255			
		return(str(l_color));
	else:
		print("not a RGB color")

#################################
######  Preprocessing  ##########
#################################

######  Clean the file  ###### 

def clean_file(f): 
	test = csv.reader(f, delimiter=';')
	categorie = "a"
	res = []
	for row in test:
		if row[2] != '':                                      # a detergent must have a common name
			if row[3] !='':                               # a detergent must have a volume
				if row[4] != '':                      # a detergent must have a color
					if row[1]!='':
						categorie=row[1]      # if the detergent have a category, add it to the list
						res.append(row)
					else:
						row[1]=categorie      # else, it's category is the same as the previous row
						res.append(row)
				else:
					print("Warning: "+row[2]+" has no color (could not be added)")
			else:
				print("Warning: "+row[2]+" has no volume (could not be added)")
	res=res[1:]
	to_erase=[]
	for i in range(len(res)):
		try:
			float(res[i][3])
		except:
			to_erase.append(i)
	for i in to_erase:
		del res[i]
	return(res);


####################################
######  Write JSON in a file  ######
####################################


######  Write the header of the file  ######

def write_header(f):

	categorie = "a"
	file_res=open(f,"w") #./res.json
	file_res.write("{\n    \"title\" : \"Detergent from converter\",\n    \"date\" : \"last modification date "+str(datetime.datetime.now())+"\",\n    \"author\" : \"CSV_TO_JSON_CONVERTER\",\n    \"data\" : {\n        ")


columns = ["name","vol","color","complete name","Molecular formula","MM","CMC (mM)","Aggregation number","Ref","PDB file","detergent image","SMILES"] # because columns are in french, we have to translate them to english

######  Write the rest of the file  #####

def write_res(f):
	write_header(f)
	file_res=open(f,"a")
	categorie = res[0][1]            #### initialize to the first category 
	file_res.write("\""+res[0][1]+"\" : [\n            ")
	for i in range(len(res)):
		file_res.write("{ ") 
		for j in range(len(columns)):
			if j < len(columns)-1:
				if j == 1:
					file_res.write("\""+columns[j]+"\" : "+ res[i][j+2]+",")
				elif j == 2:
					res[i][j+2]=normalize_colors(res[i][j+2])
					file_res.write("\""+columns[j]+"\" : "+ res[i][j+2]+",")
				elif j==5 or j==6 or j==7 :
					try:
						float(res[i][j+2])
						file_res.write("\""+columns[j]+"\" : "+ res[i][j+2]+",")
					except:
						print("Warning: "+res[i][j+2]+" is not a number for the column "+columns[j]+" of the detergent "+res[i][2]+"(replaced by null)")
						file_res.write("\""+columns[j]+"\" : null,")
				else:
					if res[i][j+2]=="":
						file_res.write("\""+columns[j]+"\" : null,")
						print("Warning: "+columns[j]+" is empty for detergent "+res[i][2])
					else:
						file_res.write("\""+columns[j]+"\" : \""+ res[i][j+2]+"\",")###
			else:
				try:
					if categorie != res[i+1][1]:
						file_res.write("\""+columns[j]+"\" : \""+res[i][j+2]+"\"}\n            ")
						categorie = res[i+1][1]
						file_res.write("],\n        \""+res[i+1][1]+"\" : [\n            ")
					elif categorie == res[i+1][1]:
						file_res.write("\""+columns[j]+"\" : \""+res[i][j+2]+"\"},\n            ")
				except:
					file_res.write("\""+columns[j]+"\" : \""+res[i][j+2]+"\"}\n            ")
	file_res.write("]}}")		





###### Notes #######

"""
row[0] vide
row[1] catégories + autres à enlever
row[2] nom commun -> doit être non vide row[2] != ''
row[3] volume -> doit être != ''
row[4] couleur -> doit être !=''

TO DO:

- paramètres de la fonction
- intervalles (?)

"""
###### Main program #######

res=clean_file(file_test)
output="./res.json"
write_res(output)


###########################
######  Questions  ########
###########################


