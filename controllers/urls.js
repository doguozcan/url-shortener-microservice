const Url = require("../models/Url");
const dns = require("dns");

const createURL = async (req, res) => {
  try {
    const { url } = req.body;
    const parsedUrl = new URL(url);

    dns.lookup(parsedUrl.hostname, async (err, address) => {
      try {
        if (err || !address) {
          res.json({ error: "Invalid URL" });
        } else {
          const existingUrl = await Url.findOne({
            original_url: parsedUrl.href,
          });

          if (existingUrl) {
            return res.status(200).json({
              original_url: existingUrl.original_url,
              short_url: existingUrl.short_url,
            });
          } else {
            const maxShortUrl = await Url.findOne({}, { short_url: -1 });
            const nextShortUrl = maxShortUrl ? maxShortUrl.short_url + 1 : 1;

            const createdURL = await Url.create({
              original_url: parsedUrl.href,
              short_url: nextShortUrl,
            });

            res.status(201).json({
              original_url: createdURL.original_url,
              short_url: createdURL.short_url,
            });
          }
        }
      } catch (error) {
        res.status(400).json({ error: "Invalid URL" });
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Invalid URL" });
  }
};

const getURL = async (req, res) => {
  const { short_url } = req.params;
  const url = await Url.findOne({ short_url: short_url });

  if (url) {
    return res.redirect(url.original_url);
  } else {
    return res.json({ error: "No short URL found for the given input" });
  }
};

module.exports = { createURL, getURL };
