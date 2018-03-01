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


    addBand(bandObj) {
        let insertString;
        console.log("dataLoader is adding a band, bandObj is", bandObj)
        // console.log("dataLoader is adding a band, bandname is", bandObj.band_name)
        insertString = knex.insert(bandObj).into("bands").toString()
        return this.query(insertString).then(result => {
            //once it's inserted, we will have the ID. From that we derive the two URLs
            //where the photos will be uploaded,
            //and update the just-inserted row with those two urls.
            let id = result.insertId
            let full_photo_url = `https://storage.cloud.google.com/montreal-artist-database.appspot.com/images/artistImages2/${id}_full.jpg`
            let thumb_photo_url = `https://storage.cloud.google.com/montreal-artist-database.appspot.com/images/artistImages2/${id}_thumb.jpg`
            let updateString = knex("bands")
                .where({ band_id:id })
                .update({ full_photo_url, thumb_photo_url }).toString()
                console.log(updateString)
            this.query(updateString)
            return id
        })
            .catch(err => { console.error(err) })

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
            .select("band_name", "band_id", "music_link", "apple_music_url", "spotify_url", "facebook_url", "instagram_url", "twitter_url", "youtube_url", "thumb_photo_url")
            .whereIn("band_id", idsArrayString).toString()

        return this.query(
            queryString
        )
    }
    getSingleBand(id) {
        let queryString = knex("bands")
            .select("band_id", "band_name", "band_genre", "music_link", "apple_music_url", "spotify_url",
                "facebook_url", "instagram_url", "twitter_url", "youtube_url", "full_photo_url", "band_email", "management_email", "booking_email", "pr_email", "members", "band_description")
            .where("band_id", id).toString()

        return this.query(
            queryString
        )
    }

}
module.exports = DataLoader;