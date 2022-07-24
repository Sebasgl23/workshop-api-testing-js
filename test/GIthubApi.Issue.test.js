require('dotenv').config();

const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');

const urlBase = 'https://api.github.com';
const user = 'Sebasgl23';

describe('Consume POST and PATCH method', () => {
  let userLogedResponse;
  let userReposResponse;
  let issueResponse;
  let issueEditResponse;
  let username;
  let reposUrl;
  let repo;

  before(async () => {
    userLogedResponse = await axios.get(`${urlBase}/user`, {
      headers: {
        Authorization: `token ${process.env.ACCESS_TOKEN}`
      }
    });
    username = userLogedResponse.data.login;
    reposUrl = userLogedResponse.data.repos_url;

    userReposResponse = await axios.get(`${reposUrl}`, {
      headers: {
        Authorization: `token ${process.env.ACCESS_TOKEN}`
      }
    });
    repo = userReposResponse.data.find((element) => element.private === false && element.name === 'workshop-api-testing-js');
  });

  it('Get user loged and check if has an public repository', async () => {
    expect(userLogedResponse.status).to.equal(StatusCodes.OK);
    expect(userReposResponse.status).to.equal(StatusCodes.OK);
    expect(username).to.equal('Sebasgl23');
    expect(reposUrl).to.equal(`${urlBase}/users/${user}/repos`);
    expect(repo).to.not.equal(undefined);
    expect(repo.name).to.equal('workshop-api-testing-js');
  });

  before(async () => {
    issueResponse = await axios.post(`${urlBase}/repos/${username}/${repo.name}/issues`, { title: 'This is the issue title' }, {
      headers: {
        Authorization: `token ${process.env.ACCESS_TOKEN}`
      }
    });

    issueEditResponse = await axios.patch(`${urlBase}/repos/${username}/${repo.name}/issues/${issueResponse.data.number}`, { body: 'This is the body of the issue' }, {
      headers: {
        Authorization: `token ${process.env.ACCESS_TOKEN}`
      }
    });
  });

  it('Get id info and check it has been created succesfuly', async () => {
    expect(issueResponse.data.id).to.not.equal(undefined);
    expect(issueResponse.data.title).to.equal('This is the issue title');
    expect(issueResponse.data.body).to.equal(null);
  });
  it('Check if the issue has been edited succesfuly', async () => {
    expect(issueEditResponse.data.id).to.equal(issueResponse.data.id);
    expect(issueEditResponse.data.title).to.equal(issueResponse.data.title);
    expect(issueEditResponse.data.body).to.equal('This is the body of the issue');
  });
});
