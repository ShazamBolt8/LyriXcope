const axios = require("axios");
const cheerio = require("cheerio");

const api = {
  endpoint: "https://www.stands4.com/services/v2/lyrics.php",
  user_id: null,
  token: null,
  format: "json",
};

/**
 * Configures the Lyrixcope API with the provided user ID and API key.
 * @param {string} user_id - Lyrics.com User ID
 * @param {string} api_key - Lyrics.com Token
 */
function configureLyrixcope(user_id, api_key) {
  api.user_id = user_id;
  api.token = api_key;
}

/**
 * Gets a song's URL from lyrics.com based on its name and optionally its artist.
 * @param {string} songName - The name of the song to search for.
 * @param {string} [artistName=""] - The name of the artist of the song (optional).
 * @returns {Promise<Object>} A promise that resolves with an object containing the status code and information about the song.
 * @throws {Error} Throws an error if the API is not configured or if there is an issue with the request.
 * @example
 * const result = await getSongLink("A Man Without Love", "Engelbert Humperdinck");
 * console.log(result);
 * //Response:
 * {
 *   status: 200,
 *   song: {
 *     song: 'A Man Without Love',
 *     'song-link': 'https://www.lyrics.com/lyric/937895/Engelbert+Humperdinck/A+Man+Without+Love',
 *     artist: 'Engelbert Humperdinck',
 *     'artist-link': 'https://www.lyrics.com/artist/Engelbert+Humperdinck/14870',
 *     album: 'The Very Best of Engelbert Humperdinck',
 *     'album-link': 'https://www.lyrics.com/album/210454/The Very Best of Engelbert Humperdinck'
 *   }
 * }
 */
async function getSongLink(songName, artistName = "") {
  artistName = artistName || "";
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

/**
 * Scrapes lyrics from a lyrics.com link.
 * @param {string} url - The link to the lyrics.com page of the song.
 * @returns {Promise<string|null>} A promise that resolves with the lyrics of the song if found, otherwise returns null.
 * @throws {Error} Throws an error if there is an issue with fetching or parsing the lyrics page.
 * @example
 * const lyrics = await scrapeLyrics("https://www.lyrics.com/lyric/937895/Engelbert+Humperdinck/A+Man+Without+Love");
 * console.log(lyrics);
 * "I can remember when we walked together..." // Output
 */
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

/**
 * Retrieves information about a song, including its lyrics, based on the song name and optionally the artist name.
 * @param {string} songName - The name of the song to search for.
 * @param {string} [artistName=""] - The name of the artist of the song (optional).
 * @returns {Promise<Object>} A promise that resolves with an object containing the status code, information about the song, and its lyrics.
 * @throws {Error} Throws an error if there is an issue with fetching song information or scraping lyrics.
 * @example
 * const songInfo = await getSongLyrics("A Man Without Love");
 * console.log(songInfo);
 * //Response:
 * {
 *   status: 200,
 *   song: {
 *     song: 'A Man Without Love',
 *     'song-link': 'https://www.lyrics.com/lyric/937895/Engelbert+Humperdinck/A+Man+Without+Love',
 *     artist: 'Engelbert Humperdinck',
 *     'artist-link': 'https://www.lyrics.com/artist/Engelbert+Humperdinck/14870',
 *     album: 'The Very Best of Engelbert Humperdinck',
 *     'album-link': 'https://www.lyrics.com/album/210454/The Very Best of Engelbert Humperdinck'
 *   },
 *   lyrics: 'I can remember when we walked together\n' +
 *     'Sharing a love I thought would last forever\n' +
 *     '...'
 * }
 */

async function getSongLyrics(songName, artistName = "") {
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
