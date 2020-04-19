const inquirer = require("inquirer");

const orm = class Orm {
    constructor(connection) {
        this.connection = connection;
    }
    schema = {
        employee: ["first_name", "last_name", "role_id", "manager_id"],
        role: ["title", "salary", "department_id"],
        department: ["name"],
    };
    getTable(entity, cb) {
        this.connection.query("SELECT * FROM " + entity, cb);
    }
    insert(entity, cb) {
        const fields = this.schema[entity];
        let questions = [];
        fields.forEach((fieldName) => {
            questions.push({
                name: fieldName,
                type: "input",
                message: "What is the " + fieldName + "?",
            });
        });
        inquirer.prompt(questions).then((answers) => {
            let insert = "INSERT INTO " + entity + " SET ";
            Object.keys(answers).forEach((key, i) => {
                insert +=
                    (i > 0 ? ", " : "") + key + '= "' + answers[key] + '"';
            });

            this.connection.query(insert, (err, res) => {
                cb();
            });
        });
    }
};
module.exports = orm;
