import React, { useState } from "react";
import "./Search.css";
import axios from "axios";
import ListItem from "../ListItem/ListItem";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";

const Search = () => {
  const [wordEntered, setWordEntered] = useState("");
  const [listData, setListData] = useState([]);
  const [type, setType] = useState("");

  const getData = async (path) => {
    setType(path);
    console.log(`Getting data for ${path}, Type: ${type}`);

    const res = await axios.get(`/${path}`, { params: { name: wordEntered } });
    setListData(res.data);
  };

  return (
    <div className="search">
      <div class="search-bar">
        <InputGroup size="lg" variant="smaller">
          <FormControl
            as="input"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="basic-addon1"
            onChange={(e) => setWordEntered(e.target.value)}
          ></FormControl>
        </InputGroup>
        <Button onClick={() => getData("song")} variant="secondary" size="lg" style={{"padding": "0px 50px"}}>
          Song
        </Button>
        <Button onClick={() => getData("album")} variant="secondary" size="lg" style={{"padding": "0px 50px"}}>
          Album
        </Button>
        <Button onClick={() => getData("artist")} variant="secondary" size="lg" style={{"padding": "0px 50px"}}>
          Artist
        </Button>
      </div>
      <div>
        {listData.map((item, ind) => {
          return (
            <Link
              key={ind}
              to={`/${type}/${item.song_id || item.alb_id || item.art_id || item.id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem key={ind} item={item} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Search;
