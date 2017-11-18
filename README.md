# mongodet
*Light NoSQL database with user-friendly web interface - *
*Projet S3 M2BI UCBL*

## Introduction

This project was developed during “Master Bioinformatique Moléculaire: Méthodes et Analyses” from Université Lyon 1: Claude Bernard. It was proposed by Mélanie Garnier, Guillaume Launay, Vincent Chaptal and Juliette Martin from IBCP. It’s purpose was to develop a NoSQL database with an user-friendly web interface of membrane detergents destined to be used by IBCP’s biologists.


## Installation

### Project repository

First, use one of the following commands to get the project in the folder your want :

- ```git clone "https://github.com/friton/mongodet.git"```


- ```git clone git@github.com:friton/mongodet.git```

It contains the main program and a csv_to_json converter (in the /bin/csv_to_json folder).

### Node.js

Get installation file from Node.js official [website](https://nodejs.org). To check if node is already installed, run `node -v` on your terminal.

### mongoDB

Download installation file for your OS from mongoDB official [website](https://www.mongodb.com/download-center?jmp=nav#community). The Community edition is needed. You can find usefull tips [here](https://docs.mongodb.com/manual/administration/install-community/) 

### Install dependencies of npm

Locate at root of project folder then run `npm install` on shell to automatically install all dependencies needed in this application, including mongo client and express.


## Set up

### Run the project

Locating at root of this project, run the following command line:
```
node app.js
```

Then you will see as response:
```
mongodet server listening on port 3000!
```

Now you can access the web inteface by entering `localhost:3000` on your favorite web browser and enjoy!


### Import data into mongoDB

To import data into mongoDB, you must had an option to the previous command line with the path of the Json file:

```
app.js --init [path]
```
**Note** : the Json file must be in Det.belt format. The database now contains detergents of your file.


## Additional programs

### Format conversion
Det.belt's Json file format needs to be converted to be integrated into the database. A function returns the format requested by the mongo database from the Det.belt file (Json_detBelt_mongo) ; a second can do the opposite (Json_mongo_detbelt).


## Contacts

If you are experiencing issues with the project, you can contact us: [S. Delolme-Sabatier](mailto:sebastien.delolme-sabatier@etu.univ-lyon1.fr), [C. Gaud](mailto:caroline.gaud@etu.univ-lyon1.fr), [S. Hu](mailto:shangnong.hu@etu.univ-lyon1.fr).
	

