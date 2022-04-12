const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const db = require("./db");
const path = require("path");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});


/**
 * ====== Song ======
 */
app.get("/song", async (req, res) => {
  var name = req.query.name;

  name = `%${name}%`;
  var songs = await db.query(
    `select song_id, song_name, s.duration, s.lyrics, alb_name, album.img from 
      ((select * from song where song_name like ?)) as s
      inner join album on s.song_album_id = alb_id`,
    [name]
  );

  if (songs == null) return res.send("No album with this name");
  console.log(songs);
  res.json(songs);
});

app.get("/song/:id", async (req, res) => {
  const songId = req.params.id;
  console.log(songId)

  var song = await db.query(
    `select song_id, s.song_name, s.duration, s.lyrics, alb_name, album.img, art_name from 
      (select * from song where song_id = ?) as s
    left join album on song_album_id = alb_id 
    left join artist on song_art_id = art_id `,[songId]
  );

  if(song == null && song.length != 1) return res.send("No song found");
  console.log(song); 

  res.json(song[0]);
});


/**
 *  ====== Album ======
 */
app.get("/album", async (req, res) => {
  var name = req.query.name;

  name = `%${name}%`;
  var album = await db.query(
    `select alb_id, alb_name, alb.img, date, total_songs, group_concat(art_name) as art_name from 
      (select * from album where alb_name like ?) 
      as alb inner join artist on album_art_id = art_id 
      group by alb_name
      `, 
    [name]);

  if (album == null) return res.send("No album with this name");
  console.log(album);
  res.json(album);
});

app.get("/album/:id", async (req,res) => {
  var albumId = req.params.id; 

  var album = await db.query(
    `select alb_name, alb.img, alb.date, alb.total_songs, group_concat(art_name) as art_name from 
    (select * from album where alb_id = ?)
    as alb
    inner join artist on album_art_id = art_id
    group by alb_name`, 
    [albumId]);

  if (album == null && album.length != 0) return res.send("No album found");
  console.log(album);

  var albumSongs = await db.query(
    `select song_id, song_album_id, song_art_id, song_name, duration, lyrics, alb_name, album.img
    from (select * from song where song_album_id = ?) 
    as s
    inner join album on alb_id = song_album_id
    group by song_name`,
    [albumId]);

  if(albumSongs == null) return res.send("No songs for this album found");
  console.log(albumSongs);

  res.json({
    album: album[0],
    songs: albumSongs
  })
});

/**
 * ====== Artist ======
 */
app.get("/artist", async (req, res) => {
  var name = req.query.name;

  name = `%${name}%`
  var artist = await db.query(
    "select * from artist where art_name like ?",
    [name]);

  if (artist == null) return res.send("No album with this name");
  console.log(artist);
  res.json(artist);
});

app.get("/artist/:id", async (req, res) => {
  const artId = req.params.id; 

  var artist = await db.query(
    `select * from (select * from artist where art_id = ?)`, 
    [artId]);

  var genres = await db.query(
    `select genre.id, type from genre 
    inner join (select * from type_of where type_artist_id = ?) as a
    on genre.id = a.type_genre_id;`,
    [artId]);
  

  if(artist == null) return res.send("No artist")

  var artistAlbums = await db.query(
    `select alb_id, alb_name, alb.date, alb.total_songs, alb.img from
    (select * from album where album_art_id = ?) 
    as alb
    inner join artist on art_id = album_art_id`,
    [artId]);

  if (artistAlbums == null) return res.send("No Albums for this artist")

  res.json({
    artist: artist[0],
    albums: artistAlbums,
    genres: genres
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
