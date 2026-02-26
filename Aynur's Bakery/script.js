// Aynur's Bakery - JavaScript Logic

// Define Products
// In a real app, these paths or generated images will be synced. We'll set these up.
const products = [
    {
        id: "p1",
        name: "Çikolatalı Rüya",
        description: "Yoğun bitter çikolata ve taze ganajın eşsiz uyumu.",
        price: 950.00,
        image: "assets/cake_chocolate.png"
    },
    {
        id: "p2",
        name: "Çilekli Bahar",
        description: "Taze çilekler ve hafif vanilyalı kremalı enfes yaz pastası.",
        price: 850.00,
        image: "assets/cake_strawberry.png"
    },
    {
        id: "p3",
        name: "New York Cheesecake",
        description: "Klasik New York usulü fırınlanmış, orman meyveli cheesecake.",
        price: 900.00,
        image: "assets/cake_cheesecake.png"
    }
];

// Cart State
let cart = [];

// DOM Elements
const productListEl = document.getElementById('product-list');
const cartIconEl = document.getElementById('cart-icon');
const cartBadgeEl = document.getElementById('cart-badge');
const cartSidebarEl = document.getElementById('cart-sidebar');
const cartOverlayEl = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsEl = document.getElementById('cart-items');
const btnCheckout = document.getElementById('btn-checkout');
const toastEl = document.getElementById('toast');
const heroEl = document.querySelector('.hero');

// Chatbot Elements
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const closeChatbotBtn = document.getElementById('close-chatbot');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInputText = document.getElementById('chatbot-input-text');
const chatbotSendBtn = document.getElementById('chatbot-send');

// Hero Background Slider
const heroImages = [
    'assets/hero_1.png',
    'assets/hero_2.png',
    'assets/hero_3.png'
];
let currentHeroIndex = 0;

function initHeroSlider() {
    // Initial background
    heroEl.style.backgroundImage = `url('${heroImages[currentHeroIndex]}')`;

    // Change background every 5 seconds
    setInterval(() => {
        currentHeroIndex = (currentHeroIndex + 1) % heroImages.length;
        heroEl.style.backgroundImage = `url('${heroImages[currentHeroIndex]}')`;
    }, 5000);
}

// Initialize App
function init() {
    initHeroSlider();

    renderProducts();
    setupEventListeners();
}

// Render Products to the Grid
function renderProducts() {
    productListEl.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.src='https://via.placeholder.com/300x250?text=Aynur%27s+Bakery'">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-options" style="margin-bottom: 1rem;">
                    <label for="size-${product.id}" style="font-size: 0.9rem; color: #666; font-weight: 500;">Boyut / Kişi Sayısı:</label>
                    <select id="size-${product.id}" class="size-select" style="width: 100%; padding: 0.6rem; margin-top: 0.4rem; border: 1px solid #ddd; border-radius: 8px; font-family: inherit; font-size: 0.95rem; outline: none; cursor: pointer; background: #fafafa;">
                        <option value="small">Küçük (4-6 Kişilik)</option>
                        <option value="medium">Orta (8-10 Kişilik)</option>
                        <option value="large">Büyük (12-14 Kişilik)</option>
                    </select>
                </div>
                <div class="add-to-cart-wrapper">
                    <input type="number" id="qty-${product.id}" class="qty-input" value="1" min="1" max="10">
                    <button class="btn-add" onclick="addToCart('${product.id}')">Listeye Ekle</button>
                </div>
            </div>
        `;

        productListEl.appendChild(productCard);
    });
}

// Add Item to Cart
window.addToCart = function (productId) {
    const product = products.find(p => p.id === productId);
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyInput.value) || 1;

    const sizeSelect = document.getElementById(`size-${productId}`);
    const sizeOption = sizeSelect.options[sizeSelect.selectedIndex];
    const sizeLabel = sizeOption.innerText.split(' ')[0]; // Küçük, Orta, Büyük

    // Create a unique cart item ID based on product ID and size
    const cartItemId = `${productId}-${sizeSelect.value}`;

    // Check if item already in cart
    const existingItem = cart.find(item => item.cartItemId === cartItemId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity, size: sizeLabel, cartItemId });
    }

    // Reset input and select to default
    qtyInput.value = 1;
    sizeSelect.value = "small";

    updateCartUI();
    showToast();
};

// Update Cart Display
function updateCartUI() {
    // Update Badge
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadgeEl.innerText = totalItems;

    // Render Cart Items
    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<div class="empty-cart-msg">Listeniz şu an boş.</div>';
        return;
    }

    cart.forEach(item => {
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/70x70?text=Cake'">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name} <span style="font-size: 0.85rem; color: #666; font-weight: normal;">(${item.size})</span></div>
                <div class="cart-item-actions" style="margin-top: 0.5rem;">
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="updateQuantity('${item.cartItemId}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.cartItemId}', 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.cartItemId}')">Sil</button>
                </div>
            </div>
        `;
        cartItemsEl.appendChild(cartItemEl);
    });
}

// Update Item Quantity in Cart
window.updateQuantity = function (cartItemId, change) {
    const item = cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(cartItemId);
    } else {
        updateCartUI();
    }
};

// Remove from Cart
window.removeFromCart = function (cartItemId) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    updateCartUI();
};

// Setup Event Listeners for UI
function setupEventListeners() {
    // Open Cart
    cartIconEl.addEventListener('click', () => {
        cartSidebarEl.classList.add('open');
        cartOverlayEl.classList.add('open');
    });

    // Close Cart
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlayEl.addEventListener('click', closeCart);

    // Checkout (WhatsApp)
    btnCheckout.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Listeniz boş. Lütfen önce ürün ekleyin.");
            return;
        }

        let orderMessage = "Merhaba Aynur's Bakery, sipariş vermek istiyorum:\n\n";
        cart.forEach(item => {
            orderMessage += `- ${item.name} (${item.size}): ${item.quantity} adet\n`;
        });

        orderMessage += "\nMüsait olduğunuzda siparişimle ilgili bilgi alabilir miyim?";

        const encodedMessage = encodeURIComponent(orderMessage);
        const whatsappUrl = `https://wa.me/905056891955?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');

        cart = [];
        closeCart();
        updateCartUI();
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            question.classList.toggle('active');
            const answer = question.nextElementSibling;
            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // Chatbot Logic
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.add('open');
    });

    closeChatbotBtn.addEventListener('click', () => {
        chatbotWindow.classList.remove('open');
    });

    chatbotSendBtn.addEventListener('click', sendChatMessage);
    chatbotInputText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });

    function sendChatMessage() {
        const text = chatbotInputText.value.trim();
        if (!text) return;

        // User message
        appendChatMessage(text, 'user-message');
        chatbotInputText.value = '';

        // Bot response (Mock AI)
        setTimeout(() => {
            let response = "Lütfen siparişler, pastalar veya teslimat hakkında sorunuzu tekrar iletin.";
            const lowerText = text.toLowerCase();

            if (lowerText.includes('fiyat') || lowerText.includes('ne kadar')) {
                response = "Fiyatlarımız pastanın boyutuna ve tasarımına göre değişmektedir. Standart pastalarımız 850 TL'den başlamaktadır.";
            } else if (lowerText.includes('teslimat') || lowerText.includes('kargo') || lowerText.includes('gönderim')) {
                response = "İstanbul içi kendi araçlarımızla güvenli teslimat yapıyoruz. Avrupa yakası için teslimat ücretsizdir, diğer bölgeler mesafe bazlı hesaplanmaktadır.";
            } else if (lowerText.includes('sipariş') || lowerText.includes('nasıl')) {
                response = "Siparişinizi sitemiz üzerinden sepete ekleyerek başlatabilir ya da sayfanın altındaki WhatsApp veya Instagram ikonlarına tıklayarak direkt Aynur Hanım'a yazabilirsiniz.";
            } else if (lowerText.includes('teşekkür') || lowerText.includes('sağol') || lowerText.includes('merhaba')) {
                response = "Rica ederim! Size yardımcı olmak bir zevk. Başka bir sorunuz var mı?";
            }

            appendChatMessage(response, 'bot-message');
        }, 800);
    }

    function appendChatMessage(text, className) {
        const msgDiv = document.createElement('div');
        msgDiv.className = className;
        msgDiv.innerText = text;
        chatbotMessages.appendChild(msgDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Navbar Background on Scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.85)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
        }
    });
}

function closeCart() {
    cartSidebarEl.classList.remove('open');
    cartOverlayEl.classList.remove('open');
}

// Show Toast Notification
function showToast() {
    toastEl.classList.add('show');

    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

// Run init
init();
