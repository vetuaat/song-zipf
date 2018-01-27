'use strict'

const songStore = require('./store')
const { expect } = require('chai');
const store = songStore()

const songs = [
  { "frequency": 30, "title": "one" },
  { "frequency": 30, "title": "two" },
  { "frequency": 15, "title": "three" },
  { "frequency": 25, "title": "four" }
]

describe('Store', function() {
  describe('utilities', function () {
    it('zipf', function() {
      expect(store.zipf(2)).to.eql(1/2);
    })
    it('qualityIndex', function() {
      expect(store.qualityIndex(30,1)).to.eql(30);
    })
    it('calculate quality', function() {
      expect(store.calculateQuality(songs[3].frequency,4)).to.be.above(store.calculateQuality(songs[0].frequency,1));
    })
    it('calculated quality for songs', function() {
      const sortedSongs = store.sortedByQuality(songs)
      expect(sortedSongs[0].title).to.eql('four');
      expect(sortedSongs[1].title).to.eql('two');
    })
    it('gives back the n best song', function(){
      expect(store.bestSongFinder(songs,2)).to.has.length(2)
      expect(store.bestSongFinder(songs,2)[0]).to.not.have.property('frequency')
      expect(store.bestSongFinder(songs,3)).to.has.length(3)
    })
  }) 
  describe('endpoints', function () {
    it('is empty when created', async function() {
      const newStore = songStore()
      const albums = await newStore.getAll();
      expect(albums).to.eql([]);
    })
    describe('adding new albums', function() {
      it('returns the created album with ID', async function() {
        const newStore = songStore()
        const newAlbum = [
          { frequency: 1, title: 'title1' }          
        ];
  
        const result = await newStore.create(newAlbum);
        expect(result.songs[0].title).to.eql('title1');
        expect(result.songs[0].frequency).to.eql(1);
        expect(result).to.include.key('id');
      })
    })
    it('all created albums can be retrieved', async function() {
      const newStore = songStore()
      const newAlbum = [
        { frequency: 1, title: 'title1' }          
      ];

      const firstResult = await newStore.create(newAlbum);
      const secondResult = await newStore.create(newAlbum);

      const albums = await newStore.getAll();
      expect(albums).to.have.lengthOf(2);
      expect(albums).to.include(firstResult);
      expect(albums).to.include(secondResult);
    })
    it('top songs from a specific album', async function() {
      const newStore = songStore()
      const newAlbum = [
        { frequency: 1, title: 'title1' }          
      ];
      const newAlbum2 = [
      { "frequency": 30, "title": "one" },
      { "frequency": 30, "title": "two" },
      { "frequency": 15, "title": "three" },
      { "frequency": 25, "title": "four" }
    ]

      const firstResult = await newStore.create(newAlbum);
      const secondResult = await newStore.create(newAlbum2);

      const songs1 = await newStore.getBestSongs(1,2)
      const songs2 = await newStore.getBestSongs(2,2);
      expect(songs1).to.eql([{ "title": "title1" }])
      expect(songs2).to.eql([{ "title": "four" }, { "title": "two" }])
    })
  })   
})