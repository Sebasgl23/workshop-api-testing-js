require('dotenv').config();

const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';

describe('Consume PUT Method', () => {
  let followResponse;
  let followList;
  let username;
  let newFollowList;

  before(async () => {
    followResponse = await axios.put(`${urlBase}/user/following/${githubUserName}`, {}, {
      headers: {
        Authorization: `token ${process.env.ACCESS_TOKEN}`
      }
    });

    followList = await axios.get(`${urlBase}/user/following`, {
      headers: {
        Authorization: `token ${process.env.ACCESS_TOKEN}`
      }
    });

    username = followList.data.find((element) => element.login === 'aperdomob');
  });

  it('Follow User with PUT Method', async () => {
    expect(followResponse.status).to.equal(StatusCodes.NO_CONTENT);
    expect(followResponse.data).to.equal('');
  });

  it('Check following list to confirm', async () => {
    expect(followList.status).to.equal(StatusCodes.OK);
    expect(username.login).to.equal(githubUserName);
  });

  it('Check idempotence of the PUT Method', async () => {
    expect(followResponse.status).to.equal(StatusCodes.NO_CONTENT);
    expect(followResponse.data).to.equal('');
  });

  it('Confirm that i am following the user', async () => {
    newFollowList = await axios.get(`${urlBase}/user/following`, {
      headers: {
        Authorization: `token ${process.env.ACCESS_TOKEN}`
      }
    });
    username = newFollowList.data.find((element) => element.login === 'aperdomob');
    expect(newFollowList.status).to.equal(StatusCodes.OK);
    expect(username.login).to.equal(githubUserName);
  });
});
