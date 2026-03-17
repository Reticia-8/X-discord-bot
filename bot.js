const fetch = require("node-fetch");
const Parser = require("rss-parser");

const parser = new Parser({
  headers: { "User-Agent": "Mozilla/5.0" } // 403対策
});

const WEBHOOK_URL = "YOUR_WEBHOOK_URL";
const KEYWORD = "#IRIAM で配信中！"; 
let sentIds = new Set();

async function checkTweets() {
  try {
    const feed = await parser.parseURL("http://localhost:1200/x/user/Retia_R"); // 自前RSSHub
    for (const item of feed.items) {
      if (sentIds.has(item.id)) continue;
      const text = item.title;
      if (text.startsWith("RT @") || text.startsWith("@")) continue;
      if (!text.includes(KEYWORD)) continue;

      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: "@everyone\n" + item.title + "\n" + item.link,
          embeds: [{ timestamp: new Date(item.pubDate) }]
        })
      });
      sentIds.add(item.id);
    }
  } catch (err) { console.error(err); }
}

setInterval(checkTweets, 300000); // 5分ごと
console.log("BOT起動中...");


const http = require("http");

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.write("BOT is running");
  res.end();
}).listen(PORT, () => {
  console.log("Server running on port " + PORT);
});