#!/usr/bin/env python
#-*- coding: utf-8 -*-

import csv
import json
import datetime

file_test = open("./test/data.csv", "r")



######  Clean the file (put it in a function)  ###### 
 
test = csv.reader(file_test, delimiter=';')
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


######  Write JSON in a file  ######

######  Write the header  ######
categorie = "a"
file_res=open("./res.json","w")
file_res.write("{\n    \"title\" : \"Detergent from converter\",\n    \"date\" : \"last modification date "+str(datetime.datetime.now())+"\",\n    \"author\" : \"CSV_TO_JSON_CONVERTER\",\n    \"data\" : {\n        ")
columns = ["name","vol","color","complete name","Molecular formula","MM","?","CMC (mM)","Aggregation number","Ref","PDB file","detergent image","?","SMILES"]


######  Write the rest of the file  #####

file_res=open("./res.json","a")
categorie = res[0][1]            #### initialize to the first category 
file_res.write("\""+res[0][1]+"\" : [\n            ")
for i in range(len(res)):
	file_res.write("{ ") 
	for j in range(len(columns)):
		if j < len(columns)-1:
			if j == 1 or j == 2:
				file_res.write("\""+columns[j]+"\" : "+ res[i][j+2]+",")
			elif j==5 or j==7 or j==8:
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
					#problème avec la première ligne de la catégorie suivante!!!!
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

8 espaces = 1 tabulation

['', 'Catégorie', 'nom commun', 'volume (VOIDOO) (A3)', 'couleur', 'nom réel', 'Molecular Formula', 'MM', '', 'CMC (mM)', 'Nb aggrégation', 'Ref', 'fichier PDB', 'image du détergent', '', 'SMILES'


			file_res.write("{ \"name\" : \""+ res[i][2]+"\", \"vol\" : "+res[i][3]+", \"color\" : "+res[i][4]+", \"complete name\" : \""+res[i][5]+"\", \"Molecular formula\" : \""+res[i][6]+"\", \"MM\" : \""+res[i][7]+"\", \"''\" : \""+res[i][8]+"\", \"CMC (mM)\" : \""+res[i][9]+"\", \"Aggregation number\" : \""+res[i][10]+"\", \"Ref\" : \""+res[i][11]+"\", \"PDB file\" : \""+res[i][12]+"\", \"detergent image\" : \""+res[i][13]+"\", \"''\" : \""+res[i][14]+"\", \"SMILES\" : \""+res[i][15]+"\"},\n            ")

"""



