# mtl-artist-database-backend

### Overview of this repository:
  * Server written in Node.js using Express.Js
  * Database Wrapper uses Knex.js,and promise-mysql
  * MySQL database 


### API Documentation:

   You can consume this API. All endpoints are located at path http://mad-backend.herokuapp.com/api/v1

  #### Endpoints
   * ##### /genreIDs
     Accepts two query parameters: **genre** and **searchterm**, responds with an array of objects containing the property "band_id", representing ID numbers of bands which matched the genre or searchterm query. Currently, searchterm overrides genre (so if both genre and searchterm are specified, the genre will be ignored).
     
     **genre** should be one of the following: 
     'all',
    'Classical & Traditional',
    'DJ',
    'Electro/Pop',
    'Experimental',
    'Hip-Hop',
    'Jazz',
    'Metal',
    'Punk',
    'R&B, Soul, Funk',
    'Rock/Alternative',
    'Singer-Songwriter',
    'World & Reggae'
    
     **searchterm** can be blank or any desired searchterm. 
     
   * ##### /bands
     accepts one query parameter: **bandIDarray**, responds with an array of objects, each representing limited info on a band (for previewing purposes). 
     
     **bandIDarray** should be an array of ID numbers, such as those returned by /genreIDs. 
     
     Objects sent in response will have the properties: ```{apple_music_url, band_id, band_name, facebook_url, instagram_url, music_link, spotify_url, thumb_photo_url, twitter_url, youtube_url} ```
     
  * ##### /bandData
  
    accepts one query parameter: **band_id**, responds with an array containing one object, representing extended info on a band (for full profile purposes).
    
    **band_id** should be a single ID number, such as those returned by /genreIDs.
    
    The Object sent in response will have the properties: ```{band_id, band_name, band_genre, music_link, apple_music_url, spotify_url, facebook_url, instagram_url, twitter_url, youtube_url, photo_url, band_email, management_email, booking_email, pr_email, members, band_description, full_photo_url}```

