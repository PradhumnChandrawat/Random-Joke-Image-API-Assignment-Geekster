const express = require("express");
const axios = require("axios");
const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Simple route to confirm the server is running
app.get("/", (req, res) => {
  res.send("Welcome to the Random Jokes and Images API!");
});

// Fetching a random image
app.get("/api/images/random", async (req, res) => {
  try {
    const imageResponse = await axios.get(
      "https://api.unsplash.com/photos/random?&client_id=GJJUdnbxXkU2xjMVTEej7TIyz459m3jHfoqFcA7DUTQ"
    );
    const image = `${imageResponse.data.urls.raw}&w=200&h=200&fit=crop`;
    res.redirect(image);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching image", error: error.toString() });
  }
});

// Fetching a random joke
app.get("/api/jokes/random", async (req, res) => {
  try {
    const jokeResponse = await axios.get(
      "https://official-joke-api.appspot.com/random_joke"
    );
    res.json({
      setup: jokeResponse.data.setup,
      punchline: jokeResponse.data.punchline,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching joke", error: error.toString() });
  }
});

//  combining random jokes and images
app.get("/api/jokes-and-images/random", async (req, res) => {
  const jokePromise = axios.get(
    "https://official-joke-api.appspot.com/random_joke"
  );
  const imagePromise = axios.get(
    "https://api.unsplash.com/photos/random?client_id=GJJUdnbxXkU2xjMVTEej7TIyz459m3jHfoqFcA7DUTQ"
  );

  Promise.all([jokePromise, imagePromise])
    .then((results) => {
      const jokeData = results[0].data;
      const imageData = results[1].data;
      const imageUrl = `${imageData.urls.raw}&w=200&h=200&fit=crop`;
      res.send(`
        <html>
        <head><title>Random Joke and Image</title></head>
        <body>
          <h1>Joke of the Moment</h1>
          <p>${jokeData.setup} - ${jokeData.punchline}</p>
          <img src="${imageUrl}" alt="Random Image" style="width: 200px; height: 200px;">
        </body>
        </html>
      `);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error combining data", error: error.toString() });
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Server setup
app.listen(8000, () => {
  console.log(`Server running on http://localhost:8000`);
});
