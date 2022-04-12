from array import array
import sqlite3
import requests
import random
import json
import lyricsgenius as lg

FILE = "./test.json"
ACCESS_TOKEN = "BQC8q9422PHN9_JUPBLqk4VfYG2-pbY2uVaUbpz9oMOk6gT8WepYOBIjsRd7w0_lk_5Np_3HMd4eSScwaOu8WwDubkC_QoszWWagwUSKsjNIk08X956kT_JstLCSDQhd12lETa9LhG-ry_TGPztjRDndOV5pCnrbVCVvl6zXrV9PUph-iPcipg"

# Get data from spotify
def get_spotify_req(url):
    response = requests.get(
        url,
        headers={
            "Authorization": f"Bearer {ACCESS_TOKEN}",
            "Content-Type": "application/json",
        },
    )

    return response.json()


# Write json to .json file
def write_to_file(data):
    with open(FILE, "w") as f:
        json.dump(data, f)


# Gets random albums from spotify
def create_json_db():
    SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search?type=album&limit=15&include_external=audio&q=album:"
    SPOTIFY_SEVERAL_ARTISTS_URL = "https://api.spotify.com/v1/artists?ids="
    SPOTIFY_GET_ALBUM_TRACK_URL = "https://api.spotify.com/v1/albums/"
    SPOTIFY_GET_ALBUM_URL = "https://api.spotify.com/v1/albums/"
    GENIUS_ACCESS_TOKEN = (
        "wERoKafegCk-Wt7wwcLdydFJ-MD8UMH01BwqcsgxALZqUOrM-ZL3kSwpYMCmWbV4"
    )

    database = {"albums": [], "artist": [], "songs": [], "genre": []}

    # === Albums ===
    characters = "abcdefghijklmnopqrstuvwxyz"
    randomChar = characters[random.randrange(len(characters)) - 1]
    SPOTIFY_SEARCH_URL += randomChar

    print(f"Getting albums from spotify")
    data = get_spotify_req(SPOTIFY_SEARCH_URL)

    album_ids = []  # all the albums ids
    artist_ids = ""  # all the artist id
    for album in data["albums"]["items"]:
        alb = {
            "name": album["name"],
            "date": album["release_date"],
            "total_tracks": album["total_tracks"],
            "image": album["images"][0]["url"],
            "artist": [],
        }

        # Don't add album id if already in list
        if alb not in album_ids:
            album_ids.append(album["id"])

        for artist in album["artists"]:
            alb["artist"].append({"name": artist["name"]})

            # Don't add aritst id if already in string
            if artist["id"] not in artist_ids:
                artist_ids += artist["id"] + ","

        if alb not in database["albums"]:
            database["albums"].append(alb)

    print(f"Writing to album data to file")
    write_to_file(database)

    # === Songs ===
    print("Getting songs from spotify and lyrics fro genius")
    genius = lg.Genius(GENIUS_ACCESS_TOKEN)
    for album_id in album_ids:
        url = SPOTIFY_GET_ALBUM_TRACK_URL + album_id + "/tracks?limit=15"

        tracks = get_spotify_req(url)  # Get the tracks of that album
        album_info = get_spotify_req(
            SPOTIFY_GET_ALBUM_URL + album_id
        )  # Get the album information

        for song in tracks["items"]:

            new_song = {
                "name": song["name"],
                "duration": song["duration_ms"],
                "album": album_info["name"],
                "artist": [],
            }

            for art in song["artists"]:
                new_song["artist"].append(art["name"])

            try:
                print(f"Getting {song['name']} lyrics")
                genius_song = genius.search_song(
                    song["name"].split("(", 1)[0], song["artists"][0]["name"]
                )
            except:
                continue
            lyrics = ""
            try:
                lyrics = genius_song.lyrics
            except:
                lyrics = "No lyrics"

            new_song["lyrics"] = lyrics
            database["songs"].append(new_song)

    print(f"Writing songs to file")
    write_to_file(database)

    # === Artist ===
    print(f"Getting artists from spotify")
    SPOTIFY_SEVERAL_ARTISTS_URL += artist_ids
    data = get_spotify_req(SPOTIFY_SEVERAL_ARTISTS_URL[:-1])

    # === Genres ===
    genres = []
    for artist in data["artists"]:
        art = {
            "name": artist["name"],
            "followers": artist["followers"]["total"],
            "image": artist["images"][0]["url"],
            "genres": [],
        }

        for genre in artist["genres"]:
            art["genres"].append(genre)

            g = {"type": genre}
            # Don't add genre if already in list
            if g not in genres:
                genres.append(g)

        database["artist"].append(art)
    database["genre"] = genres

    print(f"Writing album to file")
    write_to_file(database)


def create_connection(db_file):

    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)

    return conn


def insert_cmd(conn, table, col, values, extra, ignore):

    if ignore == True:
        ignore = "or ignore"
    values = list_to_sql_str(values)
    sql = """ insert %s into %s (%s) values (%s)""" % (ignore, table, col, values)
    print(sql)
    if extra != None:
        sql += extra

    cur = conn.cursor()
    cur.execute(sql)
    conn.commit()


def select_cmd(conn, table, col, cond_col, condition):
    condition = list_to_sql_str(condition)
    sql = """ select (%s) from %s where %s = %s """ % (col, table, cond_col, condition)
    print(sql)
    cur = conn.cursor()
    cur.execute(sql)

    rows = cur.fetchall()

    if len(rows) >= 1:
        return list(rows[0])[0]

    return rows


def list_to_sql_str(list):
    val = ""
    first = True
    for i in list:
        if not first:
            val += ", "
        first = False
        if type(i) == str:
            i = str(i).replace("'"," ")
            val += f"\'{i}\'"
        elif type(i) == int:
            val += f"{i}"
    print(val)
    return val


def main():
    # Make the JSON file and fill with data
    # create_json_db()

    with open("./test.json", "r") as f:
        jsonData = json.loads(f.read())

    conn = create_connection("./test.db")
    with conn:

        # === Insert to Artist table ===
        for entry in jsonData["artist"]:
            values = [entry.get(key, None) for key in ["name", "followers", "image"]]
            print(values)
            insert_cmd(conn, "artist", "art_name, followers, img", values, None, True)

        # === Insert to Album table ===
        # Get the last known alb_track id
        cur = conn.cursor()
        cmd = """SELECT (alb_id) FROM album ORDER BY id DESC LIMIT 1"""
        cur.execute(cmd, [])
        conn.commit()

        rows = cur.fetchall()
        alb_track_id = 1
        if len(rows) != 0:
            print(f"rows: {list(rows[0])[0]}")
            alb_track_id = list(rows[0])[0] + 1

        # Getting albums and inserting to DB
        for entry in jsonData["albums"]:
            for art in entry["artist"]:
                # Find the artist id
                values = [art.get(key, None) for key in ["name"]]
                print(values)
                artist_id = select_cmd(conn, "artist", "art_id", "art_name", values)

                values = [entry.get(key, None) for key in ["name", "image", "date", "total_tracks"]]
                values.insert(0, alb_track_id)
                values.insert(1, artist_id)
                print(values)

                cmd = f""" insert into album(alb_id, album_art_id, alb_name, img, date, total_songs)
                            select ?, ?, ?, ?, ?, ?
                            where not exists(select 1 from album where album_art_id = {values[1]} and alb_name = "{values[2]}") """
                cur.execute(cmd, values)
                conn.commit()
            alb_track_id += 1

        # Insert to Song table
        for entry in jsonData["songs"]:
            for art in entry["artist"]:
                # Find the artist and get id
                artist_id = select_cmd(conn, "artist", "art_id", "art_name", [art])

                print(f"artist id: {artist_id}")
                if type(artist_id) == list and len(artist_id) == 0:
                    break

                album_name = entry["album"]
                album_id = select_cmd(conn, "album", "alb_id", "alb_name", [album_name])
                print(f"Album id: {album_id}")

                values = [entry.get(key, None) for key in ["name", "duration", "lyrics"]]
                values.insert(0, album_id)
                values.insert(1, artist_id)
                cmd = f""" insert into song(song_album_id, song_art_id, song_name, duration, lyrics)
                        select ?, ?, ?, ?, ?
                        where not exists (select 1 from song where song_album_id = {values[0]} and song_art_id = {values[1]} and song_name = "{values[2]}")"""
                print(cmd)
                conn.execute(cmd, values)
                conn.commit()

        # # Insert to genre table
        for entry in jsonData["genre"]:
            values = [entry.get(key, None) for key in ["type"]]
            insert_cmd(conn, "genre", "type", values, None, True)

        # Inserting album_of
        for entry in jsonData['albums']:
            for art in entry['artist']:
                # Artist Id
                values = [art.get(key, None) for key in ['name']]
                art_id = select_cmd(conn, 'artist', 'art_id', 'art_name', values)
                print(art_id)

                # Album Id 
                values = [entry.get(key, None) for key in ['name']]
                alb_id = select_cmd(conn, 'album', 'alb_id', 'alb_name', values)
                if(type(alb_id) == list):
                    break
                print(alb_id)

                # Insert row 
                insert_cmd(conn, 'album_of', "artist_id, album_id", [art_id, alb_id], None, True)

        # Inserting type_of
        for entry in jsonData['artist']:
            for gen in entry['genres']:
                values = [entry.get(key, None) for key in ['name']]
                art_id = select_cmd(conn, 'artist', 'art_id', 'art_name', values)
                gen_id = select_cmd(conn, 'genre', 'id', 'type', [gen])

                insert_cmd(conn, 'type_of', 'type_artist_id, type_genre_id', [art_id, gen_id], None, True)

if __name__ == "__main__":
    main()
