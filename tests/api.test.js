const request = require('supertest');
const app = require('../src/index');
const jwt = require('jsonwebtoken');

describe('Sample Test', () => {
  let id;
  let falseId;
  const client = {
    name: 'Davi Rogerio',
    cpf: '17834632140',
    email: 'davi@gmail.com',
    phone: '988884444',
    office: 'Policial',
    policeStation: 'DPSS',
    city: 'brasília',
  };
  const falseClient = {
    name: 'Bruno',
    cpf: '17840632140',
    email: 'brunoTI@gmail.com',
    phone: '977854444',
    office: 'Policial',
    policeStation: 'DPSS',
    city: 'Ceilândia',
    active: false,
  };
  const token = jwt.sign({
    name: 'Test',
    cpf: '12345678911',
    email: 'test@hotmail.com',
    phone: '988884444',
    office: 'Policial',
    policeStation: 'DPSS',
    city: 'brasilia',
  }, process.env.SECRET, {
    expiresIn: 240,
  });

  it('App is defined', (done) => {
    expect(app).toBeDefined();
    done();
  });

  it('Post client', async (done) => {
    const res = await request(app).post('/clients/create/').set('x-access-token', token).send(client);
    expect(res.statusCode).toBe(200);
    expect(res.body.phone).toBe(client.phone);
    expect(res.body.cpf).toBe(client.cpf);
    expect(res.body.name).toBe(client.name);
    expect(res.body.email).toBe(client.email);
    expect(res.body.policeStation).toBe(client.policeStation);
    expect(res.body.city).toBe(client.city);
    expect(res.body.office).toBe(client.office);
    id = res.body._id;
    done();
  });

  it('Post false client', async (done) => {
    const res = await request(app).post('/clients/create/').set('x-access-token', token).send(falseClient);
    expect(res.statusCode).toBe(200);
    expect(res.body.phone).toBe(falseClient.phone);
    expect(res.body.cpf).toBe(falseClient.cpf);
    expect(res.body.name).toBe(falseClient.name);
    expect(res.body.email).toBe(falseClient.email);
    expect(res.body.policeStation).toBe(falseClient.policeStation);
    expect(res.body.city).toBe(falseClient.city);
    expect(res.body.office).toBe(falseClient.office);
    expect(res.body.active).toBe(falseClient.active);
    falseId = res.body._id;
    done();
  });

  it('Post client error', async (done) => {
    const errorClient = {
      name: '',
      cpf: '',
      email: '',
      phone: '',
      office: '',
      policeStation: '',
      city: ''
    };
    const res = await request(app).post('/clients/create/').set('x-access-token', token).send(errorClient);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(["invalid name", "invalid cpf", "invalid email","invalid phone", "invalid office", "invalid police station", "invalid city"]);
    done();
  });

  it('Get clients', async (done) => {
    const res = await request(app).get('/clients/').set('x-access-token', token);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].name).toBe(client.name);
    expect(res.body[0].cpf).toBe(client.cpf);
    expect(res.body[0].email).toBe(client.email);
    expect(res.body[0].phone).toBe(client.phone);
    expect(res.body[0].office).toBe(client.office);
    expect(res.body[0].policeStation).toBe(client.policeStation);
    expect(res.body[0].city).toBe(client.city);
    expect(res.body[0].active).toBe(true);
    done();
  });

  it('Get deactivated clients', async (done) => {
    const res = await request(app).get('/clients?active=false').set('x-access-token', token);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].city).toBe(falseClient.city);
    expect(res.body[0].policeStation).toBe(falseClient.policeStation);
    expect(res.body[0].email).toBe(falseClient.email);
    expect(res.body[0].office).toBe(falseClient.office);
    expect(res.body[0].cpf).toBe(falseClient.cpf);
    expect(res.body[0].name).toBe(falseClient.name);
    expect(res.body[0].phone).toBe(falseClient.phone);
    expect(res.body[0].active).toBe(false);
    done();
  });

});

afterAll(async (done) => {
  done();
});
