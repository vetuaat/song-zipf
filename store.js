'use strict'

const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

const utilities = o => {
  return Object.assign({}, o, {
    zipf (number) { return 1 / number},

    qualityIndex(frequency,index) {return frequency / this.zipf(index)},

    calculateQuality(frequency, index) {return this.qualityIndex(frequency,index)},

    sortedByQuality (album) {
      const addedQuality = album.map((song, index) => {
        song.qualityIndex = this.calculateQuality(song.frequency,index + 1)
        return song
      })
      return addedQuality.sort((a, b) => a.qualityIndex - b.qualityIndex).reverse()
    },

    bestSongFinder (album,n) {return this.sortedByQuality(album).slice(0,n).map(song => song.title)},
  })
}

const store = o => {
  let albums = []

  return Object.assign({}, o, {

    getAll: async () => albums,    

    create: async (album) => {
      const created = {id: albums.length + 1 , songs: album}
      albums.push(created)
      return created
    },
    getBestSongs: async function (albumId, top) {  
      const titles = this.bestSongFinder(albums[albumId - 1].songs, top)
      return titles.map(title => ({'title' : title}))
    }
  })
}

const songStore =pipe(
  utilities,
  store
);

module.exports = songStore