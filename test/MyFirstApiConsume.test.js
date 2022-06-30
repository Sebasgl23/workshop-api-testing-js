const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

describe('First Api Tests', () => {
});

it('Consume GET Service', async () => {
    const response = await axios.get('https://httpbin.org/ip');
  
    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data).to.have.property('origin');
  });

  it('Consume GET Service with query parameters', async () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York'
    };
  
    const response = await axios.get('https://httpbin.org/get', { query });
  
    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.config.query).to.eql(query);
  });

  
  it('Consume PATCH Service' , async () => {
    const query = {
      name: 'Sebastian',
      city: 'Cartagena'
    };

    const response = await axios.patch('https://httpbin.org/patch' , { query });

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data).to.have.property('args');

  });

  it('Consume HEAD Service' , async () => {

    const response = await axios.head('https://httpbin.org/get');

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data).to.not.have.property('origin');

  })

  it('Consume PUT Service' , async () => {
    const query = {
      name: 'Carlos',
      age: '45',
      city: 'Orlando'

    };

    const response = await axios.put('https://httpbin.org/put' , { query });

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.args).to.exist;

  });


  it('Consume DELETE Service' , async () => {
    const query = {
      name: 'Carlos',
      age: '45'
    };

    const response = await axios.delete('https://httpbin.org/delete' , { query });

    expect(response.status).to.equal(StatusCodes.OK);

  });


