"use strict"
const fs = require('fs');
const moment = require('moment');
const shell = require('shelljs');
const NUMBER_RECORDS = 6000;
const FOLDER_NAME = `FILE ${moment().format("YYYYMMDDHHmmss")}`;

// chunk function
Array.prototype.chunk = function ( n ) {
    if ( !this.length ) {
        return [];
    }
    return [ this.slice( 0, n ) ].concat( this.slice(n).chunk(n) );
};

// add slashes
const addslashes = str => (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');

console.time(" - Time to completed: ");
// read json file to Buffer
let rawData = fs.readFileSync('./SourceFile/JSON/cities.json');

// time
const now = moment().format("YYYY-MM-DD HH:mm:ss");

console.log("_______Start convert_______");
// convert to object
console.time("Time to read cities file");
let citiesObject = JSON.parse(rawData);
console.timeEnd("Time to read cities file");

// chunk data to 6000 records per file
citiesObject = citiesObject.chunk(NUMBER_RECORDS)
console.log(" - Number of files: " + citiesObject.length);

// create new folder
shell.mkdir('-p', `./OutputFile/${FOLDER_NAME}`);
console.log(" - Created folder with name: " + FOLDER_NAME);

// begin add;
citiesObject.forEach((data, key) => {
    let str = '';
    if(key === 0){ 
        str = `
        SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
        SET time_zone = "+00:00";
        `;
    }
    str += `INSERT INTO \`cities\` (\`id\`, \`name\`, \`state_id\`, \`state_code\`, \`country_id\`, \`country_code\`, \`latitude\`, \`longitude\`, \`created_at\`, \`updated_at\`, \`flag\`, \`wikiDataId\`) VALUES`;

    for (let row of data){
        str += `(${row.id},'${addslashes(row.name)}',${row.state_id},'${addslashes(row.state_code)}',${row.country_id},'${addslashes(row.country_code)}',${row.latitude},${row.longitude},'${now}','${now}',1,'00000'),`;
    }

    // Add the ; at the end of the string
    str = str.replace(/.$/,";");

    if(key === 0){
        str += `ALTER TABLE \`cities\`
            ADD PRIMARY KEY (\`id\`),
            ADD KEY \`cities_test_ibfk_1\` (\`state_id\`),
            ADD KEY \`cities_test_ibfk_2\` (\`country_id\`);
        ALTER TABLE \`cities\`
            MODIFY \`id\` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=141852;
        ALTER TABLE \`cities\`
            ADD CONSTRAINT \`cities_ibfk_1\` FOREIGN KEY (\`state_id\`) REFERENCES \`states\` (\`id\`),
            ADD CONSTRAINT \`cities_ibfk_2\` FOREIGN KEY (\`country_id\`) REFERENCES \`countries\` (\`id\`);`;
    }

    // write file
    let count = ++key;
    console.log(" - Write file ");
    console.log("  + Write file #" + count);
    console.time(`  - Time to write file #${count}: `);
    fs.writeFileSync(`./OutputFile/${FOLDER_NAME}/cities_sql_${count}.sql`, str);
    console.log(`  + Write file #${count} completed`);
    console.timeEnd(`  - Time to write file #${count}: `);
})
console.log("_____________Done_____________");
console.timeEnd(" - Time to completed: ");