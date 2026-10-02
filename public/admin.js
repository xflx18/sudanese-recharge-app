async function loadOrders() {
  try {
    const response = await fetch('/api/orders');
    if (!response.ok) throw new Error('Failed to load orders');
    const orders = await response.json();
    renderOrders(orders);
  } catch (error) {
    document.getElementById('ordersTableBody').innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">تعذر تحميل الطلبات الآن.</td>
      </tr>
    `;
  }
}

function renderOrders(orders) {
  const tbody = document.getElementById('ordersTableBody');

  if (!orders.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">لا توجد طلبات حتى الآن.</td>
      </tr>
    `;
    document.getElementById('totalOrders').textContent = '0';
    document.getElementById('todayOrders').textContent = '0';
    document.getElementById('totalRevenue').textContent = '0 ج.س';
    return;
  }

  const today = new Date();
  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === today.toDateString();
  }).length;

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.amount || 0) * 20, 0);

  document.getElementById('totalOrders').textContent = String(orders.length);
  document.getElementById('todayOrders').textContent = String(todayOrders);
  document.getElementById('totalRevenue').textContent = `${totalRevenue} ج.س`;

  tbody.innerHTML = orders
    .map(
      (order) => `
        <tr>
          <td>${order.id}</td>
          <td>${order.customerName}</td>
          <td>${order.phone}</td>
          <td>${order.service}</td>
          <td>${order.amount} دولار</td>
          <td>${order.paymentMethod}</td>
          <td><span class="status-pill">${order.status}</span></td>
          <td>${new Date(order.createdAt).toLocaleString('ar-SD')}</td>
        </tr>
      `
    )
    .join('');
}

loadOrders();
