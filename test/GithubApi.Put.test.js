require('dotenv').config();

const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';

describe('Consume PUT Method', () => {
  let followResponse;

  before(async () => {
    followResponse = await axios.put(`${urlBase}/user/following/${githubUserName}`, {}, {
      headers: {
        Authorization: `token ${process.env.ACCESS_TOKEN}`
      }
    });
  });

  it('Follow User with PUT Method', async () => {
    expect(followResponse.status).to.equal(StatusCodes.NO_CONTENT);
    expect(followResponse.data).to.equal('');
  });
});
