const { configureLyrixcope, getSongLink, scrapeLyrics, getSongLyrics } = require("./main.js");

async function main() {
  configureLyrixcope("12520", "zHw9vAG7r8LlrY5u");
  const songData = await getSongLyrics("a man without love", null);
  console.log(songData);
}

main();
