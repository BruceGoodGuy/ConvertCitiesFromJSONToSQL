ConvertCitiesFromJSONToSQL
Just simple tool to convert a json to sql. the data base on repository countries-states-cities-database of dr5hn
____________________
#Prerequisites to get started#

1. Clone this project
2. Go to folder of project
3. Run `npm install` to install all dependencies
4. Run `node app` or `npm start` to start
5. Results will be presented in the directory ./OutputFile/FILE xxxxxx

____________________
#By default,

- Each file will contain less than or equal 6000 cities (24 files).
  + If you want to change this behavior, please go to the code ./app.js and change the constant NUMBER_RECORDS (line 5)
- The output folder is: `./OutputFile/FILE YYYYMMDDHHmmss`
  + If you want to change this behavior, please go to the code ./app.js and change the constant FOLDER_NAME (line 6 and line 37)
- The output file name is: `./OutputFile/FILE YYYYMMDDHHmmss/cities_sql_${number}.sql`
  + If you want to change this behavior, please go to the code ./app.js and change the file name at line 75
 
 __________________
Resource: https://github.com/dr5hn/countries-states-cities-database/blob/master/cities.json
