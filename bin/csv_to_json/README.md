CSV To JSON Converter
=====================

This file will explain you how to use the CSVtoFile conveter made during the project from the Master's degree of Bioinformatcis at Claude Bernard Lyon 1 University. It was developped to convert a file given by the biologists working at IBCP 

Installation and use of the converter
-------------------------------------

To use this converter, python3 must be installed on your computer. You can dowload it here at https://www.python.org/downloads/
You also need two python packages, csv and datetime if they are not installed enter
> pip3 install csv
> pip3 install datetime

When everything is ok do 
> cd mongodet/bin/csv_to_json directory

then 
> python3 conv.py

This command line will take the data.csv file in the test folder and convert it to json.
The result is saved in a file named res.json, placed in the directory where you launched 
the command line. Note that the csv file was obtain by converting the file Base-donnees-detergents-VZ-20171004.xlsx placed in the test directory. It was converted thanks to LibreOfficeCalc using Unicode(UTF-8) using ";" as field separator and " as text separator.

Note also that due to a mistake in the file, the line with Oléate was deleted before using the converter.


Developpment
------------

Some improvement still need to be done, including detection of empty columns and better warnings
