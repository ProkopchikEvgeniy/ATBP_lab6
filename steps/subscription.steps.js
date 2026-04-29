const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const app = require('../../server');
const assert = require('assert');

let response;
let userId;
let renewalDays;

Given('the subscription service is running', async function() {
  // Service is running via server.js
  this.baseURL = 'http://localhost:3000';
});

Given('user {string} has an active subscription', async function(userId) {
  this.userId = userId;
  const response = await request(app)
    .get(`/api/subscription/${userId}`);
  assert.strictEqual(response.body.status, 'active');
});

Given('user {string} has an expired subscription', async function(userId) {
  this.userId = userId;
  const response = await request(app)
    .get(`/api/subscription/${userId}`);
  assert.strictEqual(response.body.status, 'expired');
});

When('I request subscription for user {string}', async function(userId) {
  this.response = await request(app)
    .get(`/api/subscription/${userId}`);
});

When('I renew subscription for user {string} with {int} days', async function(userId, days) {
  this.userId = userId;
  this.renewalDays = days;
  this.response = await request(app)
    .post(`/api/subscription/${userId}/renew`)
    .send({ duration: days });
});

When('I cancel subscription for user {string}', async function(userId) {
  this.response = await request(app)
    .post(`/api/subscription/${userId}/cancel`);
});

Then('the response status should be {int}', function(statusCode) {
  assert.strictEqual(this.response.status, statusCode);
});

Then('the subscription status should be {string}', function(status) {
  assert.strictEqual(this.response.body.status, status);
});

Then('the plan should be {string}', function(plan) {
  assert.strictEqual(this.response.body.plan, plan);
});

Then('auto-renew should be {string}', function(value) {
  const expected = value === 'true';
  assert.strictEqual(this.response.body.autoRenew, expected);
});

Then('the subscription should be renewed successfully', function() {
  assert.strictEqual(this.response.body.message, 'Subscription renewed successfully');
});

Then('the new expiry date should be extended by {int} days', function(days) {
  assert.ok(this.response.body.subscription.expiryDate);
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