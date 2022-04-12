import axios from "axios";
import './ArtistDetail.css';
import ListItem from '../ListItem/ListItem';
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";

const styles = {
  card: {
    display: "flex",
    flexDirection: "row",
    margin: "50px 500px",
  },
  cardImage: {
    width: "300px",
    height: "300px",
  },
  title: {
    fontSize: "50px",
  },
  sub: {
    fontSize: "20px",
  },
  lyrics: {
    whiteSpace: "pre-line",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    minHeight: "100vh",
  },
};

const ArtistDetail = () => {
  const [artist, setArtist] = useState({});
  const [albums, setAlbums] = useState([]);
  const [genres, setGenres] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    getArtist();
  }, []);

  const getArtist = async () => {
    await axios.get(`/artist/${id}`).then((res) => {
      console.log(res.data);
      setAlbums(res.data.albums);
      setArtist(res.data.artist);
      setGenres(res.data.genres);
    });
  };

  return (
    <div>
      <Card key={artist.id} style={styles.card}>
        <Card.Img src={artist.img} style={styles.cardImage} />
        <Card.Body>
          <Card.Title style={styles.title}>{artist.art_name}</Card.Title>
          <Card.Subtitle
            className="mb-2 text-muted"
            style={styles.sub}
          >{`Followers: ${artist.followers}`}</Card.Subtitle>
          <Card.Text>{`Genres: ${genres.map(g => ` ${g.type}`)}`}</Card.Text>
        </Card.Body>
      </Card>
      <div className="art-albums">
        {albums.map((alb, i) => {
          return (
            <Link
              key={i}
              to={`/album/${alb.alb_id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem key={i} item={alb} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ArtistDetail;
