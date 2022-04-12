import React from "react";

const HowToUse = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        flexDirection: "column",
        textAlign: "center",
        marginTop: "100px"
      }}
    >
      <h1>How To Use </h1>
      <p>
        Type in characters in the search bar. <br />
        Results will be items that contain the chracters <br />
        Example: "dr" for songs returns "Break. Up. Drunk., Driveway, SIR
        BAUDELAIRE (feat. DJ Drama), etc.."<br />

        Nothing in the input field will return all the songs/albums/artist in the DB
      </p>
    </div>
  );
};

export default HowToUse;
