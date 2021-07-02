
const express = require('express');
const app = express();
const port = 8000;
const Stream = require('stream').Transform;
const https = require('https');
const Danbooru = require('danbooru');
const booru = new Danbooru()

app.get('/img', (req,res) => {
    booru.posts({ tags: 'rating:safe order:rank' }).then(posts => {

      const index = Math.floor(Math.random() * posts.length)
      const post = posts[index]

      const url = booru.url(post.file_url)

      https.get(url, imgResponse => {
        var data = new Stream();
        imgResponse.on('data', (chunk)  => data.push(chunk));
        imgResponse.on('end', () => res.end(data.read()));
      });
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});