const knex = require("knex")({
    client: 'mysql'
})

class DataLoader{
    constructor(connection){
        this.conn = connection
    }

    query(queryString) {
        return this.conn.query(queryString)
    }    

    getBands(idsArrayString) { 
        console.log("dataloader got a string in getBands. It's", idsArrayString)
        return this.query(
            `SELECT * FROM bands WHERE band_id IN (${idsArrayString})`
        )
    }

}
module.exports = DataLoader;