const credentials = require('./credentials');
const mysql = require('mysql');



module.exports = {
    connection:false,
    init(environment){
       this.connection = mysql.createConnection(credentials[environment]);
       this.connection.connect(function (err) {
            if(err) throw new Error('Failed to connect to database')
       })
    },
    installation(){
        
    }
};