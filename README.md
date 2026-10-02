const services = [
  {
    id: "steam",
    name: "Steam Wallet",
    category: "games",
    icon: "🎮",
    description: "شحن رصيد ستيم لشراء الألعاب والملحقات.",
    amountOptions: [10, 25, 50, 100],
    basePrice: 150,
  },
  {
    id: "playstation",
    name: "PlayStation Store",
    category: "games",
    icon: "🕹️",
    description: "شحن متجر بلايستيشن لشراء الألعاب والاشتراكات.",
    amountOptions: [15, 30, 50, 75],
    basePrice: 200,
  },
  {
    id: "xbox",
    name: "Xbox Live",
    category: "games",
    icon: "🎯",
    description: "رصيد Xbox Live للعب والاشتراكات والمحتوى الإضافي.",
    amountOptions: [20, 40, 60, 100],
    basePrice: 180,
  },
  {
    id: "netflix",
    name: "Netflix",
    category: "subscription",
    icon: "📺",
    description: "اشتراكات نتفليكس بأسعار مناسبة وتجهيز سريع.",
    amountOptions: [20, 40, 60, 90],
    basePrice: 250,
  },
  {
    id: "spotify",
    name: "Spotify Premium",
    category: "subscription",
    icon: "🎵",
    description: "استماع غير محدود مع اشتراك سبوتيفاي بريميوم.",
    amountOptions: [15, 25, 40, 60],
    basePrice: 170,
  },
  {
    id: "youtube",
    name: "YouTube Premium",
    category: "streaming",
    icon: "📹",
    description: "اشتراك يوتيوب بريميوم والوصول إلى ميزات متقدمة.",
    amountOptions: [20, 35, 50, 80],
    basePrice: 220,
  },
];

const servicesGrid = document.querySelector("#servicesGrid");
const serviceSelect = document.querySelector("#service");
const amountSelect = document.querySelector("#amount");
const tabs = document.querySelectorAll(".tab");
const rechargeForm = document.querySelector("#rechargeForm");
const orderSummary = document.querySelector("#orderSummary");

function renderServices(category = "all") {
  const filtered = category === "all" ? services : services.filter((item) => item.category === category);

  servicesGrid.innerHTML = filtered
    .map(
      (service) => `
        <article class="service-card">
          <div class="icon">${service.icon}</div>
          <h3>${service.name}</h3>
          <p>${service.description}</p>
          <div class="service-meta">
            <strong>${service.amountOptions[0]} - ${service.amountOptions[service.amountOptions.length - 1]}$</strong>
            <span>${service.category === "games" ? "لعبة" : service.category === "subscription" ? "اشتراك" : "استريم"}</span>
          </div>
        </article>
      `
    )
    .join("");
}

function populateServiceOptions() {
  serviceSelect.innerHTML = '<option value="">اختر الخدمة</option>' +
    services
      .map((service) => `<option value="${service.id}">${service.name}</option>`)
      .join("");

  serviceSelect.addEventListener("change", updateAmountOptions);
}

function updateAmountOptions() {
  const selectedService = services.find((item) => item.id === serviceSelect.value);
  amountSelect.innerHTML = '<option value="">اختر المبلغ</option>' +
    (selectedService
      ? selectedService.amountOptions
          .map((amount) => `<option value="${amount}">${amount} دولار</option>`)
          .join("")
      : "");

  updateOrderSummary();
}

function updateOrderSummary() {
  const selectedService = services.find((item) => item.id === serviceSelect.value);
  const selectedAmount = amountSelect.value;

  if (!selectedService || !selectedAmount) {
    orderSummary.innerHTML = "<h3>ملخص الطلب</h3><p>اختر الخدمة والمبلغ لعرض المجموع.</p>";
    return;
  }

  const total = Number(selectedAmount) * 20;
  orderSummary.innerHTML = `
    <h3>ملخص الطلب</h3>
    <p><strong>الخدمة:</strong> ${selectedService.name}</p>
    <p><strong>القيمة:</strong> ${selectedAmount} دولار</p>
    <p><strong>التقدير:</strong> ${total} ج.س.</p>
  `;
}

function bindTabs() {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      renderServices(tab.dataset.category);
    });
  });
}

function saveOrder(formData) {
  const orders = JSON.parse(localStorage.getItem("sudanRechargeOrders") || "[]");
  orders.push({
    ...formData,
    id: `SD-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem("sudanRechargeOrders", JSON.stringify(orders));
}

rechargeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = {
    customerName: document.querySelector("#customerName").value.trim(),
    phone: document.querySelector("#phone").value.trim(),
    service: serviceSelect.options[serviceSelect.selectedIndex]?.text || "",
    amount: amountSelect.value,
    accountId: document.querySelector("#accountId").value.trim(),
    paymentMethod: document.querySelector("#paymentMethod").value,
    notes: document.querySelector("#notes").value.trim(),
  };

  if (!formData.customerName || !formData.phone || !formData.service || !formData.amount || !formData.accountId || !formData.paymentMethod) {
    alert("يرجى تعبئة جميع الحقول المطلوبة.");
    return;
  }

  saveOrder(formData);
  alert(`تم إرسال طلبك بنجاح. رقم الطلب: ${formData.service.toUpperCase().slice(0, 4)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`);
  rechargeForm.reset();
  updateOrderSummary();
});

amountSelect.addEventListener("change", updateOrderSummary);

renderServices();
populateServiceOptions();
bindTabs();
updateOrderSummary();
