const inquirer = require('inquirer');
const db = require('./database/db');

db.init('development');

db.connection.query('SELECT first_name FROM employee WHERE manager_id IS NOT NULL', function (err, res, fields) {
    console.log(res);
    process.exit();
});
