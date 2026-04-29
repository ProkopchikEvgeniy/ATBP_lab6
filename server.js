const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// Хранилище подписок (в реальном приложении использовалась бы БД)
let subscriptions = {
  'user1': {
    plan: 'basic',
    status: 'active',
    expiryDate: '2025-01-15',
    autoRenew: true,
    paymentMethod: 'credit_card'
  },
  'user2': {
    plan: 'premium',
    status: 'active',
    expiryDate: '2025-02-20',
    autoRenew: true,
    paymentMethod: 'paypal'
  },
  'user3': {
    plan: 'basic',
    status: 'expired',
    expiryDate: '2024-12-01',
    autoRenew: false,
    paymentMethod: 'credit_card'
  }
};

// API endpoints

// Получение информации о подписке
app.get('/api/subscription/:userId', (req, res) => {
  const { userId } = req.params;
  const subscription = subscriptions[userId];
  
  if (!subscription) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(subscription);
});

// Продление подписки
app.post('/api/subscription/:userId/renew', (req, res) => {
  const { userId } = req.params;
  const { duration = 30 } = req.body; // duration in days
  
  const subscription = subscriptions[userId];
  
  if (!subscription) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  if (subscription.status === 'active') {
    // Продлеваем существующую активную подписку
    const currentExpiry = new Date(subscription.expiryDate);
    const newExpiry = new Date(currentExpiry);
    newExpiry.setDate(newExpiry.getDate() + duration);
    subscription.expiryDate = newExpiry.toISOString().split('T')[0];
    subscription.autoRenew = true;
    
    res.json({
      message: 'Subscription renewed successfully',
      subscription
    });
  } else if (subscription.status === 'expired') {
    // Возобновляем истекшую подписку
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + duration);
    subscription.status = 'active';
    subscription.expiryDate = newExpiry.toISOString().split('T')[0];
    subscription.autoRenew = true;
    
    res.json({
      message: 'Subscription reactivated successfully',
      subscription
    });
  }
});

// Отмена подписки
app.post('/api/subscription/:userId/cancel', (req, res) => {
  const { userId } = req.params;
  const subscription = subscriptions[userId];
  
  if (!subscription) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  subscription.autoRenew = false;
  subscription.status = 'cancelled';
  
  res.json({
    message: 'Subscription cancelled successfully',
    subscription
  });
});

// Обновление метода оплаты
app.put('/api/subscription/:userId/payment-method', (req, res) => {
  const { userId } = req.params;
  const { paymentMethod } = req.body;
  
  const subscription = subscriptions[userId];
  
  if (!subscription) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  subscription.paymentMethod = paymentMethod;
  
  res.json({
    message: 'Payment method updated successfully',
    subscription
  });
});

app.listen(port, () => {
  console.log(`Subscription service running at http://localhost:${port}`);
});

module.exports = app;