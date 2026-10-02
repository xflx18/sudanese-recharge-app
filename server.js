const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(__dirname, 'data');
const ordersFile = path.join(dataDir, 'orders.json');

const services = [
  {
    id: 'steam',
    name: 'Steam Wallet',
    category: 'games',
    icon: '🎮',
    description: 'شحن رصيد ستيم لشراء الألعاب والملحقات.',
    amounts: [10, 25, 50, 100],
    basePrice: 150,
  },
  {
    id: 'playstation',
    name: 'PlayStation Store',
    category: 'games',
    icon: '🕹️',
    description: 'شحن متجر بلايستيشن لشراء الألعاب والاشتراكات.',
    amounts: [15, 30, 50, 75],
    basePrice: 200,
  },
  {
    id: 'xbox',
    name: 'Xbox Live',
    category: 'games',
    icon: '🎯',
    description: 'رصيد Xbox Live للعب والاشتراكات والمحتوى الإضافي.',
    amounts: [20, 40, 60, 100],
    basePrice: 180,
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'subscription',
    icon: '📺',
    description: 'اشتراكات نتفليكس بأسعار مناسبة وتجهيز سريع.',
    amounts: [20, 40, 60, 90],
    basePrice: 250,
  },
  {
    id: 'spotify',
    name: 'Spotify Premium',
    category: 'subscription',
    icon: '🎵',
    description: 'استماع غير محدود مع اشتراك سبوتيفاي بريميوم.',
    amounts: [15, 25, 40, 60],
    basePrice: 170,
  },
  {
    id: 'youtube',
    name: 'YouTube Premium',
    category: 'streaming',
    icon: '📹',
    description: 'اشتراك يوتيوب بريميوم والوصول إلى ميزات متقدمة.',
    amounts: [20, 35, 50, 80],
    basePrice: 220,
  },
];

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
}

app.use(express.json({ limit: '1mb' }));
app.use(express.static(publicDir));

function readOrders() {
  try {
    return JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
  } catch (error) {
    return [];
  }
}

function writeOrders(orders) {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

app.get('/api/services', (req, res) => {
  res.json(services);
});

app.get('/api/orders', (req, res) => {
  res.json(readOrders());
});

app.post('/api/orders', (req, res) => {
  const { customerName, phone, service, amount, accountId, paymentMethod, notes } = req.body;

  if (!customerName || !phone || !service || !amount || !accountId || !paymentMethod) {
    return res.status(400).json({ message: 'الرجاء تعبئة جميع الحقول المطلوبة.' });
  }

  const serviceItem = services.find((item) => item.name === service) || services[0];
  const currentOrders = readOrders();
  const order = {
    id: `SD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    customerName,
    phone,
    service: serviceItem.name,
    amount,
    accountId,
    paymentMethod,
    notes: notes || '',
    status: 'قيد المعالجة',
    createdAt: new Date().toISOString(),
  };

  currentOrders.unshift(order);
  writeOrders(currentOrders);

  res.status(201).json({ message: 'تم إرسال الطلب بنجاح', order });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(publicDir, 'admin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Sudanese recharge app running on http://localhost:${PORT}`);
});
