// require packages
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

// require mongodb models
const db = require("./models");

// what port our app is running on
const PORT = 3000;

// initiate the app
const app = express();
app.use(express.urlencoded({ extended: true }))

// public assets will be located in the folder called "public"
app.use(express.static("public"));

// make a connection to our mongo database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/musicScraper";
mongoose.connect(MONGODB_URI);

// -------------------------------- ROUTES --------------------------------------------

// GET /scrape gets the article information from npr and saves to our mongo db
app.get("/scrape", (req,res) => {
    axios.get("https://www.npr.org/sections/music-news/").then(response => {
        const $ = cheerio.load(response.data);

        $(".item-info").each((i, element) => {
            const result = {};

            result.title = $(element)
              .children(".title")
              .text();

            result.summary = $(element)
              .children(".teaser")
              .children("a")
              .text();
            
            result.link = $(element)
              .children(".teaser")
              .children("a")
              .attr("href");

            result.time = $(element)
              .children(".teaser")
              .children("a")
              .children("time")
              .text();

              db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle)
                })
                .catch(function(err) {
                     console.log(err);
                });
        })
        res.send("scrape complete");
    });
});

// GET /articles gets all the articles from the Articles collection returned as json
app.get("/articles", (req, res) => {
  db.Article.find({})
    .then(dbArticle => {
      res.json(dbArticle)
    })
    .catch(err => res.json(err));
});

// GET /articles/id returns specific article as json by providing an id to the route
app.get("/articles/:id", (req, res) => {
  db.Article.findOne({ _id: req.params.id})
    .populate("comments") // this will include data of the comment(s) that belong to the article
    .then(dbArticle => res.json(dbArticle))
    .catch(err => res.json(err));
});

// POST /articles/id  allows save and update of note attached to article
app.post("/articles/:id", (req, res) =>  {
  db.Comment.create(req.body)
    .then(dbComment => {
      return db.Article.findOneAndUpdate({_id: req.params.id }, {$push: {comments: dbComment._id }}, {new: true})
    })
    .then(dbArticle => res.json(dbArticle))
    .catch(err => res.json(err))
})

// start server
app.listen(process.env.PORT || PORT, () => {
    console.log("app running on port https://localhost:" + PORT);
});

