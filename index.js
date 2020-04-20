const inquirer = require("inquirer");
const db = require("./database/db");
db.init("development");

const orm = require("./queries/orm");
const models = new orm(db.connection);

// what do you want to do?

let memorizedEntity;

const choices = ["add a new entry", "list entries", "exit"];

const deepChoices = ["edit entry"];

let usedChoices = [];

const questions = [
    {
        name: "task",
        message: "What would you like to do?",
        type: "list",
        choices: function () {
            return usedChoices;
        },
    },
    {
        name: "entity",
        type: "list",
        message: "Which type?",
        choices: ["department", "role", "employee"],
        when: (answers) => {
            return answers.task !== "exit" && answers.task !== "edit entry";
        },
    },
];

usedChoices = [...choices];

let program = {
    async start() {
        let answers = await inquirer.prompt(questions);
        switch (answers.task) {
            case "add a new entry":
                await program.add(answers.entity);
                break;
            case "list entries":
                // which entry?
                program.list(answers.entity);
                break;
            case "edit entry":
                program.update(memorizedEntity);
                break;
            case "exit":
                process.exit();
                break;
        }
    },
    async add(entity) {
        models.insert(entity, () => {
            program.list(entity);
        });
    },
    update(entity) {
        inquirer
            .prompt({
                name: "id",
                message: "which id do you want to update?",
                type: "input",
            })
            .then((res) => {
                models.update(entity, res.id, (final) => {
                    program.list(entity);
                });
            });
    },
    list(entity) {
        usedChoices = [...deepChoices].concat(choices);
        memorizedEntity = entity;
        models.getTable(entity, (err, res) => {
            console.table(res);
            program.start();
        });
    },
};

program.start();
