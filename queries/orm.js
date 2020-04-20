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
    getEntity(entity, id, cb) {
        this.connection.query(
            "SELECT * FROM " + entity + " WHERE id = " + parseInt(id),
            cb
        );
    }
    generateQuestions(entity, row = false) {
        const fields = this.schema[entity];
        let questions = [];
        let defaultValue;
        fields.forEach((fieldName) => {
            if (row) {
                defaultValue = row[fieldName];
            } else {
                defaultValue = "";
            }
            questions.push({
                name: fieldName,
                type: "input",
                message: "What is the " + fieldName + "?",
                default: defaultValue,
            });
        });
        return questions;
    }
    generateQuery(entity, questions, where = false, cb) {
        inquirer.prompt(questions).then((answers) => {
            let q = (!where ? "INSERT INTO " : "UPDATE ") + entity + " SET ";
            Object.keys(answers).forEach((key, i) => {
                q += (i > 0 ? ", " : "") + key + '= "' + answers[key] + '"';
            });
            if (where) {
                q += " WHERE ";
                Object.keys(where).forEach((column) => {
                    q += column + " = " + where[column];
                });
            }
            this.connection.query(q, (err, res) => {
                cb();
            });
        });
    }
    update(entity, id, cb) {
        this.getEntity(entity, id, (err, row) => {
            const questions = this.generateQuestions(entity, row[0]);
            this.generateQuery(entity, questions, { id: id }, cb);
        });
    }
    insert(entity, cb) {
        const questions = this.generateQuestions(entity);
        this.generateQuery(entity, questions, false, cb);
    }
};
module.exports = orm;
