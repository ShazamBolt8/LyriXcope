const axios = require("axios");
const cheerio = require("cheerio");

const api = {
  endpoint: "https://www.stands4.com/services/v2/lyrics.php",
  user_id: null,
  token: null,
  format: "json",
};

function configureLyrixcope(user_id, api_key) {
  api.user_id = user_id;
  api.token = api_key;
}

async function getSongLink(songName, artistName = "") {
  let responseData = { status: 400, song: null };
  try {
    if (api.user_id == null || api.token == null) {
      throw new Error("API not configured. Try:\n\tconfigureLyrixcope(user_id, api_key)\n");
    }
    const response = await fetch(
      `${api.endpoint}?uid=${api.user_id}&tokenid=${api.token}&term=${encodeURIComponent(
        songName,
      )}&format=${api.format}`,
    );
    const responseBody = await response.text();
    if (responseBody == "{}") {
      responseData.status = 404;
    } else {
      let jsonData = JSON.parse(responseBody);
      if (jsonData.error) {
        responseData.status = 403;
        return responseData;
      }
      let result = jsonData.result;
      responseData.status = 200;
      let artistNames = artistName.toLowerCase().split(" ");
      responseData.song = result.find((song) => {
        let artist = song.artist.toLowerCase();
        return artistNames.some((name) => artist.includes(name));
      });
      if (!responseData.song) {
        responseData.song = result[0];
      }
    }
  } catch (error) {
    console.error(error);
    responseData.status = 500;
  }
  return responseData;
}

async function scrapeLyrics(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const lyrics = $("pre.lyric-body").text().trim();
    return lyrics;
  } catch (error) {
    console.error("An error occured while scraping song:", error);
    return null;
  }
}

async function getSongLyrics(songName, artistName) {
  const request = await getSongLink(songName, artistName);
  let response = { status: request.status, song: null, lyrics: null };
  if (request.status == 200) {
    response.status = 200;
    response.song = request.song;
    response.lyrics = await scrapeLyrics(request.song["song-link"]);
  }
  return response;
}

module.exports = { configureLyrixcope, getSongLink, scrapeLyrics, getSongLyrics };
