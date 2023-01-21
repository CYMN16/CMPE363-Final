var sql = require("mssql"),
    db;

require('dotenv').config();


  const config = {
    user: process.env.DB_USER, // better stored in an app setting such as process.env.DB_USER
    password: process.env.DB_PASSWORD, // better stored in an app setting such as process.env.DB_PASSWORD
    server: process.env.DB_SERVER, // better stored in an app setting such as process.env.DB_SERVER
    port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: process.env.DB_NAME, // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
  }

  var singletonConnection = async function() {
    if(!db) {
        let db = await sql.connect(config);
        return db;
    }
    return db;
    
  }
module.exports = {
    get:  singletonConnection
};
