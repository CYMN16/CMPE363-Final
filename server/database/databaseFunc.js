var dbInit = require('./dbInit');

var listHscores = async function() {
    try {
        console.log("Reading rows from the Table...");
        var db = await dbInit.get()
        var resultSet = await db.request().query(`SELECT username as name, 
        hscore as hscore,
        ID as id
        FROM [dbo].[hscore]
        ORDER BY hscore DESC;`);


        console.log(`${resultSet.recordset.length} rows returned.`);

        // output column headers
        var columns = "";
        for (var column in resultSet.recordset.columns) {
            columns += column + ", ";
        }
        
        console.log("%s\t", columns.substring(0, columns.length +5 ));

        // ouput row contents from default record set
        resultSet.recordset.forEach(row => {
           // console.log("%s\t%s\t%s\t%s\t%s", row.name, row.surname,row.phone,row.address, row.id);
        })

        var tempObj = [];

        await resultSet.recordset.forEach(row => {
            var rsElements = {};
            rsElements['name'] = row.name;
            rsElements['hscore'] = row.hscore;
            rsElements['id'] = row.id;
            tempObj.push(rsElements);
        })

        

        var jsonf = await JSON.stringify(tempObj,undefined,2)
        return jsonf
        // close connection only when we're certain application is finished
    } catch (err) {
        console.error(err.message);
    }
}

async function insertScore(scoredata) { 
    try {
        console.log(scoredata);
        var insertString = `INSERT INTO [dbo].[hscore] ("username","hscore") VALUES ('${scoredata.username}','${scoredata.hscore}');`;
        var db = await dbInit.get();
        await db.request().query(insertString);

    } catch (err) {
        console.error(err.message);
    }
}

module.exports = {
    listHscores: listHscores,
    insertScore: insertScore
}