/* ===== DATA ===== */
const products = [
  { id: 1, name: "Organic Avocados", category: "Fruits", emoji: "🥑", price: 3.99, weight: "Pack of 3", badge: "organic" },
  { id: 2, name: "Fresh Strawberries", category: "Fruits", emoji: "🍓", price: 2.49, oldPrice: 3.29, weight: "500g", badge: "sale" },
  { id: 3, name: "Whole Milk", category: "Dairy", emoji: "🥛", price: 1.79, weight: "1L", badge: null },
  { id: 4, name: "Free-Range Eggs", category: "Dairy", emoji: "🥚", price: 3.49, weight: "12 pack", badge: "new" },
  { id: 5, name: "Sourdough Bread", category: "Bakery", emoji: "🍞", price: 4.20, weight: "800g", badge: null },
  { id: 6, name: "Atlantic Salmon", category: "Meat & Fish", emoji: "🐟", price: 8.99, oldPrice: 11.49, weight: "400g", badge: "sale" },
  { id: 7, name: "Baby Spinach", category: "Vegetables", emoji: "🥬", price: 1.99, weight: "250g", badge: "organic" },
  { id: 8, name: "Greek Yogurt", category: "Dairy", emoji: "🍶", price: 2.79, weight: "500g", badge: null },
  { id: 9, name: "Cherry Tomatoes", category: "Vegetables", emoji: "🍅", price: 2.29, weight: "400g", badge: "new" },
  { id: 10, name: "Orange Juice", category: "Beverages", emoji: "🍊", price: 3.19, weight: "1L", badge: null },
  { id: 11, name: "Chicken Breast", category: "Meat & Fish", emoji: "🍗", price: 5.99, weight: "600g", badge: null },
  { id: 12, name: "Pasta Fusilli", category: "Pantry", emoji: "🍝", price: 1.49, weight: "500g", badge: null },
];

let cart = [];
let favorites = [];

/* ===== NAVIGATION ===== */
function navigate(page) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => a.classList.remove('active'));

  const section = document.getElementById('page-' + page);
  if (section) section.classList.add('active');

  document.querySelectorAll(`[data-page="${page}"]`).forEach(a => a.classList.add('active'));

  document.querySelector('.mobile-nav')?.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===== RENDER PRODUCTS ===== */
function renderProducts(container, items) {
  container.innerHTML = items.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img">
        <span>${p.emoji}</span>
        ${p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge === 'sale' ? '🔖 Sale' : p.badge === 'new' ? '✨ New' : '🌿 Organic'}</span>` : ''}
        <button class="product-fav" onclick="toggleFav(${p.id})" id="fav-${p.id}" title="Add to favorites">
          ${favorites.includes(p.id) ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-weight">${p.weight}</div>
        <div class="product-footer">
          <div>
            <div class="product-price">$${p.price.toFixed(2)}</div>
            ${p.oldPrice ? `<div class="product-old-price">$${p.oldPrice.toFixed(2)}</div>` : ''}
          </div>
          <button class="btn-add" onclick="addToCart(${p.id})" title="Add to cart">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ===== CART ===== */
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartBadge();
  renderCart();
  showToast(`${product.emoji} ${product.name} added to cart`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartBadge();
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { updateCartBadge(); renderCart(); }
}

function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
  }
}

function renderCart() {
  const itemsEl = document.getElementById('cart-items');
  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p style="font-weight:600; margin-bottom:.4rem;">Your cart is empty</p>
        <p style="font-size:.85rem;">Add some fresh products!</p>
      </div>`;
    document.getElementById('cart-subtotal').textContent = '$0.00';
    document.getElementById('cart-total').textContent = '$0.00';
    return;
  }

  itemsEl.innerHTML = cart.map(i => `
    <div class="cart-item">
      <div class="cart-item-emoji">${i.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${i.name}</div>
        <div class="cart-item-price">$${(i.price * i.qty).toFixed(2)}</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="changeQty(${i.id}, -1)">−</button>
        <span class="qty-num">${i.qty}</span>
        <button class="qty-btn" onclick="changeQty(${i.id}, 1)">+</button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal > 40 ? 0 : 3.99;
  document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('cart-delivery').textContent = delivery === 0 ? 'Free' : `$${delivery.toFixed(2)}`;
  document.getElementById('cart-total').textContent = `$${(subtotal + delivery).toFixed(2)}`;
}

function openCart() {
  document.querySelector('.cart-overlay').classList.add('open');
  document.querySelector('.cart-sidebar').classList.add('open');
}
function closeCart() {
  document.querySelector('.cart-overlay').classList.remove('open');
  document.querySelector('.cart-sidebar').classList.remove('open');
}

/* ===== FAVORITES ===== */
function toggleFav(id) {
  const idx = favorites.indexOf(id);
  if (idx > -1) favorites.splice(idx, 1);
  else favorites.push(id);
  document.querySelectorAll(`#fav-${id}`).forEach(btn => {
    btn.textContent = favorites.includes(id) ? '❤️' : '🤍';
  });
}

/* ===== TOAST ===== */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ===== SEARCH ===== */
function handleSearch(query) {
  if (!query.trim()) return;
  const results = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );
  navigate('shop');
  const grid = document.getElementById('shop-products');
  if (grid) renderProducts(grid, results);
  document.querySelector('.results-count').textContent = `${results.length} results for "${query}"`;
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Render home featured products
  const featuredGrid = document.getElementById('featured-products');
  if (featuredGrid) renderProducts(featuredGrid, products.slice(0, 8));

  // Render shop products
  const shopGrid = document.getElementById('shop-products');
  if (shopGrid) renderProducts(shopGrid, products);

  // Category filter on home
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const cat = card.dataset.category;
      const filtered = cat === 'all' ? products : products.filter(p => p.category === cat);
      const grid = document.getElementById('featured-products');
      if (grid) renderProducts(grid, filtered.slice(0, 8));
    });
  });

  // Search
  const searchInput = document.querySelector('.search-bar input');
  const searchBtn = document.querySelector('.search-btn');
  if (searchInput) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleSearch(searchInput.value);
    });
  }
  if (searchBtn) searchBtn.addEventListener('click', () => handleSearch(searchInput?.value));

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      document.querySelector('.mobile-nav').classList.toggle('open');
    });
  }

  // Price range
  const priceRange = document.getElementById('price-range');
  if (priceRange) {
    priceRange.addEventListener('input', () => {
      document.getElementById('price-max').textContent = `$${priceRange.value}`;
      const max = parseFloat(priceRange.value);
      const filtered = products.filter(p => p.price <= max);
      const grid = document.getElementById('shop-products');
      if (grid) renderProducts(grid, filtered);
      document.querySelector('.results-count').textContent = `${filtered.length} products`;
    });
  }

  // Sort
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      let sorted = [...products];
      if (sortSelect.value === 'price-asc') sorted.sort((a,b) => a.price - b.price);
      else if (sortSelect.value === 'price-desc') sorted.sort((a,b) => b.price - a.price);
      else if (sortSelect.value === 'name') sorted.sort((a,b) => a.name.localeCompare(b.name));
      const grid = document.getElementById('shop-products');
      if (grid) renderProducts(grid, sorted);
    });
  }

  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('✅ Message sent! We\'ll get back to you soon.');
      contactForm.reset();
    });
  }

  // Category filter chips in shop
  document.querySelectorAll('.shop-category-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.shop-category-chip').forEach(c => c.style.background = '');
      chip.style.background = 'var(--green-pale)';
      const cat = chip.dataset.category;
      const filtered = cat === 'all' ? products : products.filter(p => p.category === cat);
      const grid = document.getElementById('shop-products');
      if (grid) renderProducts(grid, filtered);
      document.querySelector('.results-count').textContent = `${filtered.length} products`;
    });
  });

  updateCartBadge();
  renderCart();
  navigate('home');
});
