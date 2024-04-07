const { parse } = require("rss-to-json");

const blog = async (req, res) => {
  try {
    const publicationURL = "https://medium.com/feed/@adlydavid2";
    const feed = await parse(publicationURL);

    return res.status(200).json(feed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { blog };
