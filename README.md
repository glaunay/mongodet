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

It is also possible to clone the directory from the graphical interface of git by clicking on the green button "clone or download"> "Download zip" to the following address :

```https://github.com/friton/mongodet```


### Node.js

Get installation file from Node.js official [website](https://nodejs.org). To check if node is already installed, run `node -v` on your terminal. It will give you node version installed on your computer.

### MongoDB

Download installation file for your OS from mongoDB official [website](https://www.mongodb.com/download-center?jmp=nav#community). The Community edition is needed. You can find usefull tips [here](https://docs.mongodb.com/manual/administration/install-community/) 

### Install dependencies of npm

Locate at root of project folder then run `npm install` on shell to automatically install all dependencies needed in this application, including mongo client and express.


## Set up

### Run the project

#### Initialization of the database

The first time you use our program, you need to initialize the database. To import data into mongoDB, you must add an option to the previous command line with the path of the JSON file:

```
node app.js -init [path]
```

To perform tests, the res.json file is provided in the data folder ([path]: ./data/res.json)

**Note**: the JSON file must be in Det.belt format. The database now contains detergents of your file.
If the database is already filled and you want to reset it, you can use:

```
node app.js -reinit [path]
```

where path is the path of the file you want to use to fill your database. 

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

#### Additional options

* Security

For more security and to avoid loss of data, a backup system has been developped. It's main purpose is to make a copy of the database at it's current state everyday at the same hour. To define the time at which the backup will take place, an option must be used. For example, if you want the system to run every day at 9:30 pm, use the following command:
```
node app.js -backup 21 30
```
Note that the application mustn't be off during this process. 

* Modification history

A modification history has been developped. You can use it using the following command:
```
node app.js --history
```

This command create and complete a csv file named history.csv. Each time a modification is done on the database, a line is added at the end of the file. A line is composed of the date the modification has be done, the nature of the modification (init, reinit, insertion, deletion, update) and the data that has been affected (a file if it's init or reinit, a detergent if other). Finally, the user that did the modification is also reported.


### Interact with the web page

Different operations are available on the web page.
You can add a detergent into the database clicking on the "Add new" button.
You can also update a detergent by clicking on the "Update one" button and then select a line.
Finally, you can suppress a detergent by clicking on the button "Remove one" then select the line you want to delete.
It is possible to manage the columns of the table. You can delete them by clicking first on the button "Manage column", then you choose the column you want to delete and confirm. You can also change a column name by clicking on the button "change a column name". Select the column you want to update and enter the new name you want, then confirm. Note that this operation still needs to be improved so it's not possible to use it as of today.


## Additional programs

### Format conversion

Det.belt's JSON file format needs to be converted to be integrated into the database. A function returns the format requested by the mongo database from the Det.belt file (Json_detBelt_mongo) ; a second can do the opposite (Json_mongo_detbelt).

### CSV_to_JSON converter

A csv_to_json converter has been developped. It is accessible in the /bin/csv_to_json folder.

## Contacts

If you are experiencing issues with the project, you can contact us: [S. Delolme-Sabatier](mailto:sebastien.delolme-sabatier@etu.univ-lyon1.fr), [C. Gaud](mailto:caroline.gaud@etu.univ-lyon1.fr), [S. Hu](mailto:shangnong.hu@etu.univ-lyon1.fr).
	
## Improvements to be done

Here is a list of the features that still needs to be done:
* Column management needs to be improved
* It is actually not possible to add files to the database
* Mongod continue to run after the closing of the program, this will be corrected in a next release.
* A test mode is in developpment, it will allow to use front end and backend separatly.
* Other features still need to be implemented, for example it's currently not possible to download files or images on the application. 
* Another feature that's need to be added is a correction of the fact that the reinit command doesn't work if the database is empty. 
* Modification history will be available in a specific HTML page
* During an update, pdb_file and image fields will contain an inidication if there is a file or not in the database.