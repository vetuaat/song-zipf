'use strict'

const songUtilities = require('./store')
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const store = songUtilities()

app.post('/albums', async function(req, res) {
    try {
        const createdAlbum = await store.create(req.body);
        res.status(201).send(createdAlbum).end();
    } catch(err) {
        res.status(500).end();
    }
});

app.get('/albums', async function(req, res) {
    res.status(200).send(await store.getAll()).end();
});

app.get('/albums/:albumId/', async function(req, res) {
    const albumId = req.param.albumId
    const top = req.query.top
    res.status(200).send(await store.getBestSongs(albumId,top)).end();
});

module.exports = app;
