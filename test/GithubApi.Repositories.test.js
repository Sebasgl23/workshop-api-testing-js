require('dotenv').config();

const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');
const chai = require('chai');
const md5 = require('md5');

chai.use(require('chai-subset'));

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const repoName = 'jasmine-json-report';

describe('Consume GET Services from GITHUB API', () => {
  let userResponse;

  before(async () => {
    userResponse = await axios.get(`${urlBase}/users/${githubUserName}`, {
      headers: {
        Authorization: `token ${process.env.ACCESS_TOKEN}`
      }
    });
  });
  it('Get User Data', async () => {
    expect(userResponse.status).to.equal(StatusCodes.OK);
    expect(userResponse.data).to.have.property('name');
    expect(userResponse.data).to.have.property('company');
    expect(userResponse.data).to.have.property('location');
    expect(userResponse.data.name).to.equal('Alejandro Perdomo');
    expect(userResponse.data.company).to.equal('Perficient Latam');
    expect(userResponse.data.location).to.equal('Colombia');
  });

  let reposResponse;
  let repo;

  before(async () => {
    reposResponse = await axios.get(`${userResponse.data.repos_url}`, {
      headers: {
        Authorization: `token ${process.env.ACCESS_TOKEN}`
      }
    });
    repo = reposResponse.data.find((element) => element.name === repoName);
  });

  it('Get Repos List and validate data', async () => {
    expect(reposResponse.status).to.equal(StatusCodes.OK);
    expect(repo.name).to.equal('jasmine-json-report');
    expect(repo).to.have.property('private');
    expect(repo.private).to.equal(false);
    expect(repo).to.have.property('description');
    expect(repo.description).to.equal('A Simple Jasmine JSON Report');
  });

  it('Download Repo in a Zip File', async () => {
    const response = await axios.get(`${repo.url}/zipball/master`);
    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.headers['content-type']).to.equal('application/zip');
  });

  let contentsRespone;
  let file;

  before(async () => {
    contentsRespone = await axios.get(`${repo.url}/contents`);

    file = contentsRespone.data.find((element) => element.name === 'README.md');
  });

  it('Get list of files in the Repo', async () => {
    expect(contentsRespone.status).to.equal(StatusCodes.OK);
    expect(file).to.containSubset({
      path: 'README.md',
      name: 'README.md',
      sha: '360eee6c223cee31e2a59632a2bb9e710a52cdc0'
    });
  });

  it('Download the file and check md5', async () => {
    const download = await axios.get(`${file.download_url}`);
    expect(download.status).to.equal(StatusCodes.OK);
    expect(md5(download.data)).to.equal('497eb689648cbbda472b16baaee45731');
  });
});
