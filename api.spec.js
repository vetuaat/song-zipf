'use strict'

const request = require('supertest-as-promised')
const api = require('./api')
const { expect } = require('chai')

describe('HTTP API /albums', function() {

    const expectAlbums = async function(expectedAlbums) {
      const response = await request(api).get('/albums')
      const albums = response.body
  
      expect(albums).to.eql(expectedAlbums)
    }
  
    describe('GET', function() {
      it('responds 200', async function() {
        const response = await request(api).get('/albums')
        expect(response.status).to.eql(200)
      })

      it('responds with empty json body', async function() {
        const response = await request(api).get('/albums')
        expect(response.type).to.eql('application/json')
        expect(response.body).to.eql([])
      })
    })
  
    describe('POST', function() {
      it('creates new album and get it', async function() {
        const albums = [
            { frequency: 1, title: 'title1' },
            { frequency: 2, title: 'title2' }
        ]
        const postResponse = await request(api)
          .post('/albums')
          .send(albums)
        expect(postResponse.status).to.eql(201)
        expect(postResponse.body.songs[0].title).to.eql('title1')
        expect(postResponse.body).to.include.key('id')
        
        const response = await request(api).get('/albums')
        expect(response.type).to.eql('application/json')
        expect(response.body).to.eql([{
          id: 1,
          songs: [{ frequency: 1, title: 'title1' }, { frequency: 2, title: 'title2' }]
        }])
        expectAlbums([postResponse.body])
      })
    })
})