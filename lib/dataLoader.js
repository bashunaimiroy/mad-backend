require('dotenv').config();


const knex = require("knex")({
    client: 'mysql'
})

class DataLoader {
    constructor(connection) {
        this.conn = connection
    }

    query(queryString) {
        return this.conn.query(queryString)
    }




    getIDs(genre, searchterm) {
        let queryString;
        console.log("dataloader is retrieving genre IDs")
        if (genre === "all") {
            if (searchterm) {                
                queryString = knex("bands").select("band_id").where("pending", "0").andWhereRaw(`MATCH(band_name) AGAINST(?)`,searchterm).toString()
            } else {
                queryString = knex("bands").select("band_id").where("pending", "0").toString()
            }
        }
        else {
            queryString = knex("bands").select("band_id").where("pending", "0").andWhere("admin_genre", genre).toString()
        }
        console.log(queryString)
        return this.query(queryString)
    }
    getBands(idsArrayString) {
        console.log("dataloader got a string in getBands. Length is", idsArrayString.length)
        return this.query(
            `SELECT * FROM bands WHERE band_id IN (${idsArrayString})`
        )
    }

}
module.exports = DataLoader;