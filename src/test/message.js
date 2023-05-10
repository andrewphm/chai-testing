require('dotenv').config();
const app = require('../server.js');
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;

const User = require('../models/user.js');
const Message = require('../models/message.js');

chai.config.includeStack = true;

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('Message API endpoints', () => {
  beforeEach((done) => {
    // TODO: add any beforeEach code here
    done();
  });

  afterEach((done) => {
    // TODO: add any afterEach code here
    done();
  });

  it('should load all messages', async () => {
    // TODO: Complete this
    const res = await chai.request(app).get('/messages');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  it('should get one specific message', async () => {
    // TODO: Complete this
    const message = new Message({
      title: 'Test Message',
      body: 'This is a test message.',
    });

    const user = new User({
      username: 'test',
      password: 'test',
    });

    await user.save();

    message.author = user._id;
    await message.save();
    const res = await chai.request(app).get(`/messages/${message._id}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('title', message.title);
    expect(res.body).to.have.property('body', message.body);
  });

  it('should post a new message', async () => {
    // TODO: Complete this

    const user = await User.findOne({ username: 'test' });

    const res = await chai.request(app).post('/messages').send({
      title: 'Test Message',
      body: 'This is a test message.',
      author: user._id,
    });

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('title', 'Test Message');
    expect(res.body).to.have.property('body', 'This is a test message.');
  });

  it('should update a message', async () => {
    // TODO: Complete this

    const user = await User.findOne({ username: 'test' });
    const message = new Message({
      title: 'Test Message',
      body: 'This is a test message.',
      author: user._id,
    });

    await message.save();

    const res = await chai.request(app).put(`/messages/${message._id}`).send({
      title: 'Updated title',
      body: 'Updated Body',
      author: user._id,
    });

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('title', 'Updated title');
    expect(res.body).to.have.property('body', 'Updated Body');
  });

  it('should delete a message', async () => {
    // TODO: Complete this
    const user = await User.findOne({ username: 'test' });

    const message = new Message({
      title: 'Test Message',
      body: 'This is a test message.',
      author: user._id,
    });

    await message.save();

    const res = await chai.request(app).delete(`/messages/${message._id}`);
    res.should.have.status(200);
    res.body.should.be.an('object');
    res.body.should.have.property('message', 'Message has been deleted');
  });
});
