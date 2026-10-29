// State Management
let books = [
  { id: 1, title: "Data Structures & Algorithms", author: "Narasimha Karumanchi", price: 29.99, category: "Computer Science", semester: "Semester 3", branch: "CSE", img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300" },
  { id: 2, title: "Operating System Concepts", author: "Silberschatz", price: 34.50, category: "Computer Science", semester: "Semester 4", branch: "CSE", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300" },
  { id: 3, title: "Electronic Devices & Circuits", author: "Boylestad", price: 24.99, category: "Electronics", semester: "Semester 2", branch: "ECE", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300" },
  { id: 4, title: "Engineering Mechanics", author: "S.S. Bhavikatti", price: 19.99, category: "Mechanical", semester: "Semester 1", branch: "ME", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300" },
  { id: 5, title: "To Kill a Mockingbird", author: "Harper Lee", price: 12.99, category: "Fiction", semester: "N/A", branch: "N/A", img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300" }
];

let exchangeListings = [
  { id: 1, title: "Database System Concepts", author: "Korth", condition: "Like New", want: "Computer Networks", owner: "Alex" }
];

let cart = [];
let wishlist = [];
let currentUser = null;
let orders = [];
let notes = [];

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderBooks(books, 'bookGrid');
  renderBooks(books, 'semesterBookGrid');
  renderExchangeListings();
});

// UI Navigation / Tab Switching
function switchTab(tabId, element) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId + 'Section').classList.add('active');

  if(element) {
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    element.classList.add('active');
  }
}

// Render Books
function renderBooks(bookList, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = bookList.map(book => {
    const isWish = wishlist.some(item => item.id === book.id);
    return `
      <div class="book-card">
        <button class="wishlist-btn" onclick="toggleWishlist(${book.id})">
          <i class="fa-${isWish ? 'solid' : 'regular'} fa-heart" style="color: ${isWish ? 'red' : 'inherit'}"></i>
        </button>
        <img src="${book.img}" alt="${book.title}">
        <div class="book-title">${book.title}</div>
        <div class="book-author">by ${book.author}</div>
        <div class="book-price">$${book.price.toFixed(2)}</div>
        <div class="card-actions">
          <button class="btn btn-primary btn-block" onclick="addToCart(${book.id})">Add to Cart</button>
        </div>
      </div>
    `;
  }).join('');
}

// Search & Filtering
function handleSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = books.filter(b => 
    b.title.toLowerCase().includes(query) || 
    b.author.toLowerCase().includes(query) ||
    b.category.toLowerCase().includes(query)
  );
  renderBooks(filtered, 'bookGrid');
}

function filterCategory() {
  const cat = document.getElementById('categoryFilter').value;
  const filtered = cat === 'all' ? books : books.filter(b => b.category === cat);
  renderBooks(filtered, 'bookGrid');
}

function filterSemesterBooks() {
  const sem = document.getElementById('semesterSelect').value;
  const branch = document.getElementById('branchSelect').value;

  const filtered = books.filter(b => {
    const matchSem = sem === 'all' || b.semester === sem;
    const matchBranch = branch === 'all' || b.branch === branch;
    return matchSem && matchBranch;
  });

  renderBooks(filtered, 'semesterBookGrid');
}

// Cart & Wishlist Logic
function addToCart(bookId) {
  const book = books.find(b => b.id === bookId);
  cart.push(book);
  updateCartUI();
  alert(`${book.title} added to cart!`);
}

function toggleWishlist(bookId) {
  const index = wishlist.findIndex(b => b.id === bookId);
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(books.find(b => b.id === bookId));
  }
  updateWishlistUI();
  renderBooks(books, 'bookGrid');
}

function updateCartUI() {
  document.getElementById('cartCount').innerText = cart.length;
  const cartItemsContainer = document.getElementById('cartItems');
  
  if(cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cartItemsContainer.innerHTML = cart.map((item, index) => `
      <div style="display:flex; justify-content:space-between; margin-bottom:10px; background:#fff; padding:10px; border-radius:6px;">
        <div>
          <strong>${item.title}</strong>
          <div>$${item.price.toFixed(2)}</div>
        </div>
        <button class="btn btn-outline" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `).join('');
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById('cartSubtotal').innerText = `$${total.toFixed(2)}`;
  document.getElementById('cartTotal').innerText = `$${total.toFixed(2)}`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateWishlistUI() {
  document.getElementById('wishlistCount').innerText = wishlist.length;
  renderBooks(wishlist, 'wishlistGrid');
}

// Checkout & Orders
function proceedToCheckout() {
  if (cart.length === 0) return alert('Your cart is empty!');
  switchTab('checkout');
}

function handleCheckout(e) {
  e.preventDefault();
  const order = {
    id: 'ORD' + Math.floor(Math.random() * 90000 + 10000),
    items: [...cart],
    total: cart.reduce((sum, item) => sum + item.price, 0),
    date: new Date().toLocaleDateString()
  };

  orders.push(order);
  cart = [];
  updateCartUI();
  renderOrders();
  alert('Order placed successfully!');
  switchTab('orders');
}

function renderOrders() {
  const container = document.getElementById('ordersList');
  if (orders.length === 0) {
    container.innerHTML = '<p>No orders placed yet.</p>';
    return;
  }
  container.innerHTML = orders.map(ord => `
    <div style="background:#fff; padding:15px; border-radius:8px; margin-bottom:10px; border:1px solid #e2e8f0;">
      <h4>Order #${ord.id} - ${ord.date}</h4>
      <p>Items: ${ord.items.map(i => i.title).join(', ')}</p>
      <strong>Total: $${ord.total.toFixed(2)}</strong>
    </div>
  `).join('');
}

// Auth Logic
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function switchAuthTab(type) {
  document.getElementById('loginForm').classList.toggle('active', type === 'login');
  document.getElementById('registerForm').classList.toggle('active', type === 'register');
  document.getElementById('loginTabBtn').classList.toggle('active', type === 'login');
  document.getElementById('registerTabBtn').classList.toggle('active', type === 'register');
}

function handleLogin(e) {
  e.preventDefault();
  currentUser = { name: "Student User", email: document.getElementById('loginEmail').value };
  updateAuthUI();
  closeModal('authModal');
}

function handleRegister(e) {
  e.preventDefault();
  currentUser = { name: document.getElementById('regName').value, email: document.getElementById('regEmail').value };
  updateAuthUI();
  closeModal('authModal');
}

function updateAuthUI() {
  if (currentUser) {
    document.getElementById('authContainer').innerHTML = `
      <span>Welcome, <strong>${currentUser.name}</strong></span>
    `;
    document.getElementById('ordersNav').style.display = 'inline-block';
  }
}

// Book Exchange Logic
function renderExchangeListings() {
  const container = document.getElementById('exchangeGrid');
  container.innerHTML = exchangeListings.map(item => `
    <div class="exchange-card">
      <h4>${item.title}</h4>
      <p><strong>Author:</strong> ${item.author}</p>
      <p><strong>Condition:</strong> ${item.condition}</p>
      <p><strong>Wants in return:</strong> ${item.want}</p>
      <p style="font-size:0.8rem; color:#64748b;">Posted by: ${item.owner}</p>
      <button class="btn btn-outline btn-block" style="margin-top:10px;" onclick="alert('Exchange request sent to ${item.owner}!')">Request Exchange</button>
    </div>
  `).join('');
}

function handlePostExchange(e) {
  e.preventDefault();
  exchangeListings.push({
    id: Date.now(),
    title: document.getElementById('exTitle').value,
    author: document.getElementById('exAuthor').value,
    condition: document.getElementById('exCondition').value,
    want: document.getElementById('exWant').value,
    owner: currentUser ? currentUser.name : "Anonymous"
  });
  renderExchangeListings();
  closeModal('listExchangeModal');
  alert('Exchange listing posted!');
}

// Study Tools Logic (Pomodoro & Notes)
let timerInterval;
let timeLeft = 1500;

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      const min = Math.floor(timeLeft / 60).toString().padStart(2, '0');
      const sec = (timeLeft % 60).toString().padStart(2, '0');
      document.getElementById('timerDisplay').innerText = `${min}:${sec}`;
    } else {
      clearInterval(timerInterval);
      alert('Pomodoro completed! Take a break.');
    }
  }, 1000);
}

function pauseTimer() { clearInterval(timerInterval); }
function resetTimer() { clearInterval(timerInterval); timeLeft = 1500; document.getElementById('timerDisplay').innerText = "25:00"; }

function saveNote() {
  const text = document.getElementById('noteInput').value;
  if (!text) return;
  notes.push(text);
  document.getElementById('noteInput').value = '';
  document.getElementById('notesList').innerHTML = notes.map(n => `<li>${n}</li>`).join('');
}

// Quiz Zone Logic
const quizData = [
  { q: "What is the worst-case time complexity of Quick Sort?", opts: ["O(n log n)", "O(n²)", "O(n)", "O(1)"], ans: 1 },
  { q: "Which layer of the OSI model handles routing?", opts: ["Transport", "Data Link", "Network", "Physical"], ans: 2 }
];
let currentQ = 0;

function startQuiz() {
  currentQ = 0;
  showQuestion();
}

function showQuestion() {
  const q = quizData[currentQ];
  document.getElementById('quizQuestion').innerText = q.q;
  document.getElementById('quizOptions').innerHTML = q.opts.map((opt, i) => `
    <button class="btn btn-outline btn-block" style="margin-bottom:5px;" onclick="checkAnswer(${i})">${opt}</button>
  `).join('');
  document.getElementById('quizBtn').style.display = 'none';
}

function checkAnswer(idx) {
  if (idx === quizData[currentQ].ans) {
    document.getElementById('quizResult').innerText = "Correct! 🎉";
  } else {
    document.getElementById('quizResult').innerText = "Incorrect. Try again! ❌";
  }
}

// AI Assistant Floating Chat
function toggleAIChat() {
  const chat = document.getElementById('aiChatWindow');
  chat.style.display = (chat.style.display === 'flex') ? 'none' : 'flex';
}

function handleAIPress(e) { if (e.key === 'Enter') sendAIMessage(); }

function sendAIMessage() {
  const input = document.getElementById('aiInput');
  const msg = input.value.trim();
  if (!msg) return;

  const msgContainer = document.getElementById('aiMessages');
  msgContainer.innerHTML += `<div class="ai-msg user">${msg}</div>`;
  input.value = '';

  setTimeout(() => {
    let reply = "I'm here to help you find academic books or guide your studies!";
    if (msg.toLowerCase().includes('dsa') || msg.toLowerCase().includes('data structure')) {
      reply = "For Data Structures, I highly recommend 'Data Structures & Algorithms' by Narasimha Karumanchi!";
    } else if (msg.toLowerCase().includes('hello') || msg.toLowerCase().includes('hi')) {
      reply = "Hello there! How can I assist with your book search or exam preparation today?";
    }
    msgContainer.innerHTML += `<div class="ai-msg bot">${reply}</div>`;
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }, 600);
}