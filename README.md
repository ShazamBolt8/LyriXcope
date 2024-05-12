# LyriXcope

LyriXcope is a simple Node.js library that allows you to scrape song lyrics from [lyrics.com](https://www.lyrics.com/) with ease. It requires the use of npm, axios, and cheerio. A lyrics.com account is also required.

## Installation

Before using LyriXcope, make sure you have npm, axios, and cheerio installed. You can install them via npm if you haven't already:

```bash
npm install axios
npm install cheerio
```

## Usage

To use LyriXcope, simply include it in your project and call the `getSongLyrics(song, artist)` function. Here's an example:

```javascript
const { configureLyrixcope, getSongLyrics } = require("lyrixcope");

async function main() {
  configureLyrixcope("user_id", "api_key");
  const songData = await getSongLyrics("a man without love");
  console.log(songData);
}

main();
```

This will output:

```json
{
  "status": 200,
  "song": {
    "song": "Man Without Love",
    "song-link": "https://www.lyrics.com/lyric/4710969/Engelbert+Humperdinck/Man+Without+Love",
    "artist": "Engelbert Humperdinck",
    "artist-link": "https://www.lyrics.com/artist/Engelbert+Humperdinck/14870",
    "album": "Easy Listening Gold: 1968-1969",
    "album-link": "https://www.lyrics.com/album/529992/Easy Listening Gold: 1968-1969"
  },
  "lyrics": "I can remember when we walked together\n
  Sharing a love I thought would last forever\n
  Moonlight to show the way so we can follow\n
  Waiting inside her eyes was my tomorrow\n
  Then something changed her mind, her kisses told me\n
  I had no lovin' arms to hold me\n\n
  Every day I wake up, then I start to break up\n
  Lonely is a man without love\n
  Every day I start out, then I cry my heart out\n
  Lonely is a man without love\n\n
  Every day I wake up, then I start to break up\nK
  nowing that it's cloudy above\n
  Every day I start out, then I cry my heart out\n
  Lonely is a man without love\n\n
  I cannot face this world that's fallen down on me\n
  So, if you see my girl, please send her home to me\n
  Tell her about my heart that's slowly dying\n
  Say I can't stop myself from crying\n\n
  Every day I wake up, then I start to break up\n
  Lonely is a man without love\n
  Every day I start out, then I cry my heart out\n
  Lonely is a man without love\n\n
  Every day I wake up, then I start to break up\n
  Knowing that it's cloudy above\n
  Every day I start out, then I cry my heart out\n
  Lonely is a man without love\n\n
  Every day I wake up, then I start to break up\n
  Lonely is a man without love\n
  Every day I start out, then I cry my heart out\n
  Lonely is a man without love"
}

```

If the API keys are invalid or the song isn't available, the response will be:

```js
{ status: 403, song: null, lyrics: null }
{ status: 404, song: null, lyrics: null }
```

The artist name parameter is optional. If provided, it helps narrow down the search results.

## Requirements

- Node.js
- Lyrics.com account
- npm
- axios
- cheerio

## API Key

LyriXcope requires an API key and User ID from lyrics.com to function properly. You can obtain a free API key by signing up [here](https://www.lyrics.com/api.php). Please note that there is a limit of 100 requests per day.

## License

LyriXcope is licensed under the MIT License.

## Contributors

- [ShazamBolt8](https://github.com/shazambolt8) - Spotify annoyed me
