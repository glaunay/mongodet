# mongodet 


*Light NoSQL database with user-friendly web interface*

*Projet S3 [M2BI](https://www.bioinfo-lyon.fr/) [UCBL](https://www.univ-lyon1.fr/)*

## Introduction

This project was developed during “Master Bioinformatique Moléculaire: Méthodes et Analyses” from Université Lyon 1: Claude Bernard. It was proposed by Mélanie Garnier, Guillaume Launay, Vincent Chaptal and Juliette Martin from IBCP. It’s purpose was to develop a NoSQL database with an user-friendly web interface of membrane detergents destined to be used by the designers of the Det.Belt project.


## Installation

### Project repository

First, use one of the following commands to get the project in the folder your want :

- ```git clone "https://github.com/friton/mongodet.git"```


- ```git clone git@github.com:friton/mongodet.git```

Or, it is possible to clone the directory from the graphical interface of git by clicking on the green button "clone or download"> "Download zip" to the following address :

```https://github.com/friton/mongodet```


### Node.js

Get installation file from Node.js official [website](https://nodejs.org). To check if node is already installed, run `node -v` on your terminal. It will give you node version installed on your computer.

### mongoDB

Download installation file for your OS from mongoDB official [website](https://www.mongodb.com/download-center?jmp=nav#community). The Community edition is needed. You can find usefull tips [here](https://docs.mongodb.com/manual/administration/install-community/) 

### Install dependencies of npm

Locate at root of project folder then run `npm install` on shell to automatically install all dependencies needed in this application, including mongo client and express.


## Set up

### Run the project

#### Initialization of the database

The first time you use our program, you need to initialize the database. To import data into mongoDB, you must add an option to the previous command line with the path of the Json file:

```
node app.js -init [path]
```

**Note** : the Json file must be in Det.belt format. The database now contains detergents of your file.
If the database is already filled and you want to reset it, you can use 

```
node app.js -reinit [path]
```

where path is the path of the file you want to use to fill your database

#### Access to the web page

Locating at root of this project, run the following command line:
```
node app.js
```

Then you will see as response:
```
mongodet server listening on port 3000!
```

Now you can access the web inteface by entering `localhost:3000` on your favorite web browser (Google Chrome recommended ) and enjoy!



### Interact with the web page

Different operation are available on the web page.
You can add a detergent into the database clicking on the "Add new" button.
You can also update a detergent by clicking on the "Update one" button and then select a line.
Finally, you can suppress a detergent by clicking on the button "Remove one" then select the line you want to delete.

### Security

For more security and to avoid loss of data, a backup system has been developped. It's main purpose is to make a copy of the database at it's current state everyday at the same hour (currently at 19.00, 19.10 and 19.20). Note that the application mustn't be off during this process. 

## Additional programs

### Format conversion

Det.belt's Json file format needs to be converted to be integrated into the database. A function returns the format requested by the mongo database from the Det.belt file (Json_detBelt_mongo) ; a second can do the opposite (Json_mongo_detbelt).

### CSV_to_JSON converter

A csv_to_json converter has been developped. It is accessible in the /bin/csv_to_json folder.

## Contacts

If you are experiencing issues with the project, you can contact us: [S. Delolme-Sabatier](mailto:sebastien.delolme-sabatier@etu.univ-lyon1.fr), [C. Gaud](mailto:caroline.gaud@etu.univ-lyon1.fr), [S. Hu](mailto:shangnong.hu@etu.univ-lyon1.fr).
	
## Improvements to be done

Mongod continue to run after the closing of the program, this will be corrected in a next release. A test mode is in developpment, it will allow to use front end and backend separatly.
The backup system currently is activated every day at the same hour, we will soon ensure that this feature work only the days a change has been done.
It is currently possible to delete a characteristic of a detergent. The possibility to add a new one or to update one is also currently in developpement.
Finally, on the next release, a HTML tutorial will be implemented. The webpage will also display tooltips so the user will be guided on how to use our application.