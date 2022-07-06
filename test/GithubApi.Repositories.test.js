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
  it('Get User Data', async () => {
    const response = await axios.get(`${urlBase}/users/${githubUserName}`);
    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data).to.have.property('name');
    expect(response.data).to.have.property('company');
    expect(response.data).to.have.property('location');
    expect(response.data.name).to.equal('Alejandro Perdomo');
    expect(response.data.company).to.equal('Perficient Latam');
    expect(response.data.location).to.equal('Colombia');
  });

  it('Get Repos List and validate data', async () => {
    const response = await axios.get(`${urlBase}/users/${githubUserName}/repos`);
    expect(response.status).to.equal(StatusCodes.OK);
    const repo = response.data.find((element) => element.name === repoName);
    expect(repo.name).to.equal('jasmine-json-report');
    expect(repo).to.have.property('private');
    expect(repo.private).to.equal(false);
    expect(repo).to.have.property('description');
    expect(repo.description).to.equal('A Simple Jasmine JSON Report');
  });

  it('Download Repo in a Zip File', async () => {
    const response = await axios.get(`${urlBase}/repos/${githubUserName}/${repoName}/zipball/master`);
    expect(response.status).to.equal(StatusCodes.OK);
  });

  it('Get list of files in the Repo', async () => {
    const response = await axios.get(`${urlBase}/repos/${githubUserName}/${repoName}/contents`);
    expect(response.status).to.equal(StatusCodes.OK);
    const file = response.data.find((element) => element.name === 'README.md');
    expect(file.name).to.equal('README.md');
    expect(file.path).to.equal('README.md');
    expect(file).to.have.property('sha');
    const download = await axios.get(`https://raw.githubusercontent.com/${githubUserName}/${repoName}/master/README.md`);
    expect(download.status).to.equal(StatusCodes.OK);
    expect(md5(download.data)).to.equal('497eb689648cbbda472b16baaee45731');
  });
});
