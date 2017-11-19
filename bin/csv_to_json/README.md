CSV To JSON Converter
=====================

This file will explain you how to use the CSVtoFile conveter made during the project from the Master's degree of Bioinformatcis at Claude Bernard Lyon 1 University. It was developped to convert a file given by the biologists working at IBCP 

Installation 
-------------

To use this converter, python3 must be installed on your computer. You can download it here at https://www.python.org/downloads/
You also need two python packages, csv and datetime if they are not installed enter

> pip3 install csv

> pip3 install datetime

> pip3 install sys

Note: if you don't have pip3 on your computer, try ```sudo apt-get install python3-pip``` first.

Use
---

When everything is ok place yourself in the program directory with ```cd```
> cd mongodet/bin/csv_to_json directory

then 
> python3 conv.py -i [path_of_file_to_convert] -o [path_of_result_file]

For example you can do ```python3 conv.py -i ./test/data.csv``` 
Note that you can use -i or --input and -o or --output.
Note also that -o (--output) is optionnal. If it's not specified, the result will be saved in res.json file.

Notes
-----

Note that the csv file was obtain by converting the file Base-donnees-detergents-VZ-20171004.xlsx placed in the test directory. It was converted thanks to LibreOfficeCalc using Unicode(UTF-8) using ";" as field separator and " as text separator.

Note also that due to a mistake in the file, the line with Oléate was deleted before using the converter. Empty columns in the table were also deleted, these columns not being able to be detected
