
const express = require('express');
const app = express();
const port = 8000;
const Stream = require('stream').Transform;
const https = require('https');
const Danbooru = require('danbooru');
const booru = new Danbooru();

let booruCache = [];

function cacheBoorus() {
    booru.posts({ tags: 'rating:safe order:rank', limit: 100 }).then(posts => {
        for (let post of posts) {
            const url = booru.url(post.file_url)

            https.get(url, imgResponse => {
                var data = new Stream();
                imgResponse.on('data', chunk => data.push(chunk));
                imgResponse.on('end', () => booruCache.push(data.read()));
            });
        }

    });
}
cacheBoorus();

app.get('/img', (req, res) => {
    res.send(booruCache.shift());
});

app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});