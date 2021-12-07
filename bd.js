const { PASSWORD } = require('./config.json') 
module.exports = {
    mysqlInit: function() {
        var mysql = require(`mysql`);

        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: `${PASSWORD}`
        });

        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
        });
    }
}