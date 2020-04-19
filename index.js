const inquirer = require("inquirer");
const db = require("./database/db");
db.init("development");

const orm = require("./queries/orm");
const models = new orm(db.connection);

// what do you want to do?

let position;

const questions = [
    {
        name: "task",
        message: "What would you like to do?",
        type: "list",
        choices: ["add a new entry", "list entries", "exit"],
    },
    {
        name: "entity",
        type: "list",
        message: "Which type?",
        choices: ["department", "role", "employee"],
        when: (answers) => {
            return answers.task !== "exit";
        },
    },
];
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
    update(id, entity) {},
    delete(id, entity) {},
    list(entity) {
        models.getTable(entity, (err, res) => {
            console.table(res);
            program.start();
        });
    },
};

program.start();
