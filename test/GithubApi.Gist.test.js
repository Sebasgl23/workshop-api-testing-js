require('dotenv').config();

const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const chai = require('chai');
const axios = require('axios');
chai.use(require('chai-subset'));

const urlBase = 'https://api.github.com';

let createGistResponse;
let gistUrl;
let getGistResponse;
let deleteGistResponse;
let getGistAgainResponse;

const gistParameters = {
  description: 'This is example gist with a promise',
  public: true,
  files: {
    'promise.js': {
      content: 'This file should contain a promise'
    }
  }
};

describe('Consume DELETE Method', () => {
  describe('Create the gist and check all is ok', () => {
    before(async () => {
      createGistResponse = await axios.post(`${urlBase}/gists`, gistParameters, {
        headers: {
          Authorization: `token ${process.env.ACCESS_TOKEN}`
        }
      });
      gistUrl = createGistResponse.data.url;
    });

    it('Check the Gist creation and its parameters', async () => {
      expect(createGistResponse.status).to.equal(StatusCodes.CREATED);
      expect(createGistResponse.data).to.containSubset(gistParameters);
    });
  });

  describe('Get the gist and check that it is accesible', () => {
    before(async () => {
      getGistResponse = await axios.get(`${gistUrl}`, {
        headers: {
          Authorization: `token ${process.env.ACCESS_TOKEN}`
        }
      });
    });

    it('Check that the gist exist with its url', async () => {
      expect(getGistResponse.status).to.equal(StatusCodes.OK);
      expect(getGistResponse.data).to.containSubset(gistParameters);
    });
  });

  describe('Delete the gist through the url', () => {
    before(async () => {
      deleteGistResponse = await axios.delete(`${gistUrl}`, {
        headers: {
          Authorization: `token ${process.env.ACCESS_TOKEN}`
        }
      });
    });

    it('Check that the gist have been deleted', async () => {
      expect(deleteGistResponse.status).to.equal(StatusCodes.NO_CONTENT);
    });
  });

  describe('Check the Gist have been deleted trying to GET it', () => {
    before(async () => {
      try {
        await axios.get(`${gistUrl}`, {
          headers: {
            Authorization: `token ${process.env.ACCESS_TOKEN}`
          }
        });
      } catch (response) {
        getGistAgainResponse = response.response;
      }
    });

    it('Check that does not exist the gist', async () => {
      expect(getGistAgainResponse.status).to.equal(StatusCodes.NOT_FOUND);
    });
  });
});
