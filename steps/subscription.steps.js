const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const app = require('../server');
const assert = require('assert');

let response;

Given('the subscription service is running', async function() {
  // Сервер используется через supertest
  this.app = app;
});

Given('user {string} has an active subscription', async function(userId) {
  const res = await request(app).get(`/api/subscription/${userId}`);
  assert.strictEqual(res.body.status, 'active');
});

Given('user {string} has an expired subscription', async function(userId) {
  const res = await request(app).get(`/api/subscription/${userId}`);
  assert.strictEqual(res.body.status, 'expired');
});

When('I request subscription for user {string}', async function(userId) {
  this.response = await request(app).get(`/api/subscription/${userId}`);
});

When('I renew subscription for user {string} with {int} days', async function(userId, days) {
  this.response = await request(app)
    .post(`/api/subscription/${userId}/renew`)
    .send({ duration: days });
});

When('I cancel subscription for user {string}', async function(userId) {
  this.response = await request(app)
    .post(`/api/subscription/${userId}/cancel`);
});

Then('the response status should be {int}', function(statusCode) {
  const status = this.response.statusCode || this.response.status;
  assert.strictEqual(status, statusCode);
});

Then('the subscription status should be {string}', function(status) {
  assert.strictEqual(this.response.body.status, status);
});

Then('the plan should be {string}', function(plan) {
  assert.strictEqual(this.response.body.plan, plan);
});

Then('auto-renew should be true', function() {
  assert.strictEqual(this.response.body.autoRenew, true);
});

Then('the subscription should be renewed successfully', function() {
  assert.strictEqual(this.response.body.message, 'Subscription renewed successfully');
});

Then('the subscription should be reactivated', function() {
  assert.strictEqual(this.response.body.message, 'Subscription reactivated successfully');
});

Then('the status should become {string}', function(status) {
  assert.strictEqual(this.response.body.subscription.status, status);
});

Then('the subscription should be cancelled', function() {
  assert.strictEqual(this.response.body.message, 'Subscription cancelled successfully');
});

Then('auto-renew should be set to false', function() {
  assert.strictEqual(this.response.body.subscription.autoRenew, false);
});