const request = require('supertest');
const app = require('../server');

describe('Subscription API Unit Tests', () => {
  
  test('TC-01: GET /api/subscription/:userId - should return subscription for existing user', async () => {
    const response = await request(app)
      .get('/api/subscription/user1');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('plan');
    expect(response.body).toHaveProperty('status', 'active');
    expect(response.body).toHaveProperty('autoRenew', true);
  });
  
  test('TC-02: GET /api/subscription/:userId - should return 404 for non-existing user', async () => {
    const response = await request(app)
      .get('/api/subscription/nonexistent');
    
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });
  
  test('TC-03: POST /api/subscription/:userId/renew - should extend active subscription', async () => {
    const beforeResponse = await request(app).get('/api/subscription/user1');
    const oldExpiry = beforeResponse.body.expiryDate;
    
    const response = await request(app)
      .post('/api/subscription/user1/renew')
      .send({ duration: 30 });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Subscription renewed successfully');
    expect(response.body.subscription.expiryDate).not.toBe(oldExpiry);
  });
  
  test('TC-04: POST /api/subscription/:userId/renew - should reactivate expired subscription', async () => {
    const response = await request(app)
      .post('/api/subscription/user3/renew')
      .send({ duration: 30 });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Subscription reactivated successfully');
    expect(response.body.subscription.status).toBe('active');
  });
  
  test('TC-05: POST /api/subscription/:userId/cancel - should cancel subscription', async () => {
    const response = await request(app)
      .post('/api/subscription/user2/cancel');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Subscription cancelled successfully');
    expect(response.body.subscription.autoRenew).toBe(false);
    expect(response.body.subscription.status).toBe('cancelled');
  });
  
  test('TC-06: PUT /api/subscription/:userId/payment-method - should update payment method', async () => {
    const response = await request(app)
      .put('/api/subscription/user1/payment-method')
      .send({ paymentMethod: 'apple_pay' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Payment method updated successfully');
    expect(response.body.subscription.paymentMethod).toBe('apple_pay');
  });
});