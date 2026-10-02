const defaultServices = [
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

const serviceSelect = document.getElementById('service');
const amountSelect = document.getElementById('amount');
const servicesGrid = document.getElementById('servicesGrid');
const tabs = document.querySelectorAll('.tab');
const orderSummary = document.getElementById('orderSummary');
const rechargeForm = document.getElementById('rechargeForm');

let allServices = [...defaultServices];

async function loadServices() {
  try {
    const response = await fetch('/api/services');
    if (!response.ok) throw new Error('Failed to load services');
    allServices = await response.json();
  } catch (error) {
    allServices = [...defaultServices];
  }

  renderServices('all');
  populateServiceOptions();
}

function renderServices(category = 'all') {
  const filtered = category === 'all' ? allServices : allServices.filter((item) => item.category === category);

  servicesGrid.innerHTML = filtered
    .map(
      (service) => `
        <article class="service-card">
          <div class="icon">${service.icon}</div>
          <h3>${service.name}</h3>
          <p>${service.description}</p>
          <div class="service-meta">
            <strong>${service.amounts[0]} - ${service.amounts[service.amounts.length - 1]}$</strong>
            <span>${service.category === 'games' ? 'لعبة' : service.category === 'subscription' ? 'اشتراك' : 'استريم'}</span>
          </div>
        </article>
      `
    )
    .join('');
}

function populateServiceOptions() {
  serviceSelect.innerHTML = '<option value="">اختر الخدمة</option>' +
    allServices
      .map((service) => `<option value="${service.name}">${service.name}</option>`)
      .join('');
}

function updateAmountOptions() {
  const selectedName = serviceSelect.value;
  const selectedService = allServices.find((item) => item.name === selectedName);

  amountSelect.innerHTML = '<option value="">اختر المبلغ</option>' +
    (selectedService
      ? selectedService.amounts.map((amount) => `<option value="${amount}">${amount} دولار</option>`).join('')
      : '');

  updateOrderSummary();
}

function getServiceEstimate() {
  const serviceName = serviceSelect.value;
  const amount = amountSelect.value;
  const selectedService = allServices.find((item) => item.name === serviceName);

  if (!selectedService || !amount) return null;

  return {
    service: selectedService.name,
    amount: Number(amount),
    total: Number(amount) * 20,
  };
}

function updateOrderSummary() {
  const estimate = getServiceEstimate();

  if (!estimate) {
    orderSummary.innerHTML = '<h3>ملخص الطلب</h3><p>اختر الخدمة والمبلغ لعرض المجموع.</p>';
    return;
  }

  orderSummary.innerHTML = `
    <h3>ملخص الطلب</h3>
    <p><strong>الخدمة:</strong> ${estimate.service}</p>
    <p><strong>المبلغ:</strong> ${estimate.amount} دولار</p>
    <p><strong>التقدير:</strong> ${estimate.total} ج.س.</p>
  `;
}

serviceSelect.addEventListener('change', updateAmountOptions);
amountSelect.addEventListener('change', updateOrderSummary);

for (const tab of tabs) {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');
    renderServices(tab.dataset.category);
  });
}

rechargeForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    customerName: document.getElementById('customerName').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    service: document.getElementById('service').value,
    amount: document.getElementById('amount').value,
    accountId: document.getElementById('accountId').value.trim(),
    paymentMethod: document.getElementById('paymentMethod').value,
    notes: document.getElementById('notes').value.trim(),
  };

  if (!payload.customerName || !payload.phone || !payload.service || !payload.amount || !payload.accountId || !payload.paymentMethod) {
    alert('يرجى تعبئة جميع الحقول المطلوبة.');
    return;
  }

  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'تعذر إرسال الطلب');
    }

    alert(`تم إرسال الطلب بنجاح. رقم الطلب: ${result.order.id}`);
    rechargeForm.reset();
    updateOrderSummary();
  } catch (error) {
    alert(error.message || 'حدث خطأ أثناء إرسال الطلب.');
  }
});

loadServices();
