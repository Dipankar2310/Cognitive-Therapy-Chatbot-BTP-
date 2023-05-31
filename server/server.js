const express = require("express");
const cors = require("cors");
const app = express();

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('d166f64f56db4657a9c479c024d7fb12');

const axios = require("axios");

app.use(cors());

app.get("/", async (req, res) => {
  let searchText = req.query.searchText
  console.log(searchText);
    newsapi.v2.everything({
        q: searchText,
        language: 'en',
        pageSize: 5,
      }).then(response => {
          res.json({ result: response.articles });
      });
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});
