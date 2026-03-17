const fetch = require("node-fetch");
const Parser = require("rss-parser");
const parser = new Parser();

const WEBHOOK_URL = "https://discordapp.com/api/webhooks/1483495154978521149/OMi2nM1W4f59DyLR9J3lEPTeKvB22nl0EcZLkCbfYWaeighd7CvKN5NcM_cqAA1hq0Mv";

const KEYWORD = "メンテナンス中はIRIAMをご利用いただけません"; // 
let sentIds = new Set();

async function checkTweets() {
  try {
    const feed = await parser.parseURL("https://rsshub.app/twitter/user/iriam_official");

    for (const item of feed.items) {
      if (sentIds.has(item.id)) continue;
      if (!item.title.includes(KEYWORD)) continue;
      if (item.title.startsWith("RT")) continue;

      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: "@everyone\n" + item.title + "\n" + item.link
        })
      });

      sentIds.add(item.id);
    }
  } catch (err) {
    console.error(err);
  }
}

setInterval(checkTweets, 300000);
console.log("BOT起動中...");

const http = require("http");

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.write("BOT is running");
  res.end();
}).listen(PORT, () => {
  console.log("Server running on port " + PORT);
});