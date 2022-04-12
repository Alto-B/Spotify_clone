import axios from "axios";
import "./SongDetail.css";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";
import { msToHMS } from "../../Helper/helper";

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

const SongDetail = () => {
  const [song, setSong] = useState({});
  const { id } = useParams();

  useEffect(() => {
    getSong();
  }, []);

  const getSong = async () => {
    await axios.get(`/song/${id}`).then((res) => {
        console.log(res.data);
        setSong(res.data)});
  };

  return (
    <div>
      <Card key={song.id} style={styles.card}>
        <Card.Img src={song.img} style={styles.cardImage} />
        <Card.Body>
          <Card.Title style={styles.title}>{song.song_name}</Card.Title>
          <Card.Subtitle
            className="mb-2 text-muted"
            style={styles.sub}
          >{`Album of: ${song.alb_name}`}</Card.Subtitle>
          <Card.Subtitle
            className="mb-2 text-muted"
            style={styles.sub}
          >{`Artist(s): ${song.art_name}`}</Card.Subtitle>
          <Card.Text>{`Duration: ${msToHMS(song.duration)}`}</Card.Text>
        </Card.Body>
      </Card>
      <p style={styles.lyrics}>{song.lyrics}</p>
    </div>
  );
};

export default SongDetail;
