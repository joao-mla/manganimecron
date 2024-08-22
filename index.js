import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const apiUrl = "https://api.jikan.moe/v4";

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const result = await axios.get(apiUrl + "/anime?sfw=true&page=1&order_by=popularity&limit=19");
    const content = result.data;
    const animes = [];
    content["data"].forEach(anime => {
      animes.push(getAnime(anime));
    });
    console.log(animes);
    res.render("index.ejs", { 
      animes: animes
  });
  } catch (error) {
      console.log(error);
      res.status(500);
  }
});

app.get("/search", async (req, res) => {
  const q = req.query.q;
  console.log(q);
  try {
    const result = await axios.get(apiUrl + "/anime?sfw=true&page=1&order_by=popularity&limit=20&q="+ q);
    const content = result.data;
    const animes = [];
    content["data"].forEach(anime => {
      animes.push(getAnime(anime));
    });
    console.log(animes);
    res.render("index.ejs", { 
      animes: animes
  });
  } catch (error) {
      console.log(error);
      res.status(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


function getAnime(animeVm) {
  var synopsis = animeVm["synopsis"];
  if (synopsis.length > 100) {
    synopsis = synopsis.substring(0,297) + "...";
  }
  const anime = new Anime(
    animeVm["mal_id"],
    animeVm["title"],
    animeVm["images"]["jpg"]["large_image_url"],
    synopsis
  );
  return anime;
}

function Anime(id, title, image, synopsis) {
  this._id = id;
  this.title = title;
  this.image = image;
  this.synopsis = synopsis;
}