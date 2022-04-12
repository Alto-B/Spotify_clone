import axios from "axios";
import "./AlbumDetail.css";
import React, { useEffect, useState } from "react";
import ListItem from "../ListItem/ListItem";
import { useParams, Link } from "react-router-dom";
import { Card } from "react-bootstrap";

const AlbumDetail = () => {
  const [album, setAlbum] = useState({});
  const [songs, setSongs] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    getAblum();
  }, []);

  const getAblum = async () => {
    await axios.get(`/album/${id}`).then((res) => {
      console.log(res.data);
      setAlbum(res.data.album);
      setSongs(res.data.songs);
    });
  };

  return (
    <div className="album-info">
      <h1>{album.alb_name}</h1>
      <h2 className="mb-2 text-muted">{`Artist(s): ${album.art_name}`}</h2>
      <p>{`Total Songs: ${album.total_songs}`}</p>
      <div>
        {songs.map((song, i) => {
          return (
            <Link
              key={i}
              to={`/song/${song.song_id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem key={i} item={song} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AlbumDetail;
