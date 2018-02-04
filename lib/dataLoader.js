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
                queryString = knex("bands").select("band_id").where("pending", "0").andWhereRaw(`MATCH(band_name) AGAINST(?)`, searchterm).toString()
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
        let queryString = knex("bands")
            .select("band_name","band_id", "music_link", "apple_music_url", "spotify_url", "facebook_url","instagram_url", "twitter_url", "youtube_url", "photo_url")
            .whereIn("band_id", idsArrayString).toString()

        return this.query(
            queryString
        )
    }

}
module.exports = DataLoader;