// Variables globales
let currentSlide = 0;
let slides = [];
let totalSlides = 0;
let slideInterval;
let cart = [];

// Variables pour la pagination et le filtrage
let currentCategory = 'tous';
let currentPage = 1;
const itemsPerPage = 8;

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing...');
    
    // Initialiser les slides
    slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;
    
    // Initialiser toutes les fonctionnalités
    initIntro();
    initSlider();
    initDarkMode();
    initCart();
    initMenuItems();
    initSearch();
    initCategoryFilters();
    initPagination();
    initPageNavigation();
    initCheckout();
    
    console.log('Initialization complete');
});

// ========== INTRO ==========
function initIntro() {
    const introOverlay = document.getElementById('introOverlay');
    
    if (!introOverlay) {
        console.log('No intro overlay found');
        return;
    }
    
    // L'intro s'affichera toujours (commenté la vérification localStorage)
    // const introSeen = localStorage.getItem('introSeen');
    // 
    // if (introSeen === 'true') {
    //     introOverlay.remove();
    //     document.body.style.overflow = 'auto';
    //     console.log('Intro already seen - skipping');
    //     return;
    // }
    
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        document.body.style.overflow = 'auto';
    }, 5000);
    
    setTimeout(() => {
        if (introOverlay) {
            introOverlay.remove();
        }
        // Commenté pour que l'intro s'affiche à chaque fois
        // localStorage.setItem('introSeen', 'true');
    }, 6000);
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' && introOverlay) {
        introOverlay.setAttribute('data-theme', 'dark');
    }
}

// ========== SLIDER ==========
function initSlider() {
    if (totalSlides === 0) {
        console.log('No slides found');
        return;
    }
    
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slider = document.querySelector('.slider');
    
    if (!dotsContainer || !prevBtn || !nextBtn || !slider) {
        console.log('Slider elements not found');
        return;
    }
    
    // Créer les points
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    prevBtn.addEventListener('click', () => changeSlide(-1));
    nextBtn.addEventListener('click', () => changeSlide(1));
    
    startAutoSlide();
    
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
    
    console.log('Slider initialized');
}

function changeSlide(direction) {
    if (totalSlides === 0) return;
    
    slides[currentSlide].classList.remove('active');
    const dots = document.querySelectorAll('.dot');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.remove('active');
    }
    
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
}

function goToSlide(index) {
    if (totalSlides === 0) return;
    
    slides[currentSlide].classList.remove('active');
    const dots = document.querySelectorAll('.dot');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.remove('active');
    }
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
    
    stopAutoSlide();
    startAutoSlide();
}

function startAutoSlide() {
    if (totalSlides === 0) return;
    slideInterval = setInterval(() => changeSlide(1), 2000);
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

// ========== MODE SOMBRE ==========
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (!darkModeToggle) {
        console.log('Dark mode toggle not found');
        return;
    }
    
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkModeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            body.removeAttribute('data-theme');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        }
    });
    
    console.log('Dark mode initialized');
}

// ========== NAVIGATION PAGES ==========
function initPageNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    
    if (navLinks.length === 0) {
        console.log('No nav links found');
        return;
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const targetPage = this.getAttribute('data-page');
            
            pages.forEach(page => page.classList.remove('active'));
            
            const pageToShow = document.getElementById('page-' + targetPage);
            if (pageToShow) {
                pageToShow.classList.add('active');
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            console.log('Navigated to:', targetPage);
        });
    });
    
    console.log('Page navigation initialized');
}

// ========== FILTRES CATÉGORIES ==========
function initCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    if (categoryButtons.length === 0) {
        console.log('No category buttons found');
        return;
    }
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentCategory = this.getAttribute('data-category');
            currentPage = 1;
            
            filterProducts();
            updatePagination();
            
            console.log('Category changed to:', currentCategory);
        });
    });
    
    filterProducts();
    updatePagination();
    
    console.log('Category filters initialized');
}

function filterProducts() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (menuItems.length === 0) return;
    
    if (currentCategory === 'tous') {
        menuItems.forEach(item => {
            item.dataset.filtered = 'false';
        });
        paginateItems();
    } else {
        menuItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (itemCategory === currentCategory) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// ========== PAGINATION ==========
function initPagination() {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (!prevPageBtn || !nextPageBtn) {
        console.log('Pagination buttons not found');
        return;
    }
    
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            paginateItems();
            updatePagination();
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        const totalPages = getTotalPages();
        if (currentPage < totalPages) {
            currentPage++;
            paginateItems();
            updatePagination();
        }
    });
    
    console.log('Pagination initialized');
}

function paginateItems() {
    const menuItems = document.querySelectorAll('.menu-item');
    const menuSection = document.querySelector('.menu-section');
    
    if (menuItems.length === 0 || !menuSection) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    menuItems.forEach((item, index) => {
        if (index >= startIndex && index < endIndex) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.5s ease';
        } else {
            item.style.display = 'none';
        }
    });
    
    menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getTotalPages() {
    const menuItems = document.querySelectorAll('.menu-item');
    return Math.ceil(menuItems.length / itemsPerPage);
}

function updatePagination() {
    const paginationDiv = document.getElementById('pagination');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumbersDiv = document.getElementById('pageNumbers');
    
    if (!paginationDiv || !prevPageBtn || !nextPageBtn || !pageNumbersDiv) return;
    
    if (currentCategory === 'tous') {
        paginationDiv.style.display = 'flex';
        
        const totalPages = getTotalPages();
        
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
        
        pageNumbersDiv.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageNum = document.createElement('button');
            pageNum.classList.add('page-number');
            if (i === currentPage) {
                pageNum.classList.add('active');
            }
            pageNum.textContent = i;
            pageNum.addEventListener('click', () => {
                currentPage = i;
                paginateItems();
                updatePagination();
            });
            pageNumbersDiv.appendChild(pageNum);
        }
    } else {
        paginationDiv.style.display = 'none';
    }
}

// ========== PANIER ==========
function initCart() {
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    
    if (!cartBtn || !cartModal || !closeCart) {
        console.log('Cart elements not found');
        return;
    }
    
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
        updateCartDisplay();
    });
    
    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });
    
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });
    
    console.log('Cart initialized');
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: parseFloat(price),
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('✅ Produit ajouté au panier!');
    
    console.log('Item added to cart:', name);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('🗑️ Produit supprimé du panier');
}

window.removeFromCart = removeFromCart;

function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        saveCart();
        updateCartCount();
        updateCartDisplay();
    }
}

window.updateQuantity = updateQuantity;

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItemsContainer || !cartTotal) return;
    
    const customerForm = cartItemsContainer.querySelector('.customer-form');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = customerForm.outerHTML + '<p class="empty-cart">Votre panier est vide</p>';
        cartTotal.textContent = '0.00€';
        return;
    }
    
    let total = 0;
    let html = customerForm.outerHTML;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
                <div style="flex: 1;">
                    <h4 style="margin-bottom: 0.5rem; color: var(--text-primary);">${item.name}</h4>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">${item.price.toFixed(2)}€ x ${item.quantity}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button onclick="window.updateQuantity(${index}, -1)" style="background: var(--accent-color); color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer; font-weight: bold;">-</button>
                        <span style="min-width: 30px; text-align: center; color: var(--text-primary);">${item.quantity}</span>
                        <button onclick="window.updateQuantity(${index}, 1)" style="background: var(--accent-color); color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer; font-weight: bold;">+</button>
                    </div>
                    <strong style="min-width: 60px; text-align: right; color: var(--text-primary);">${itemTotal.toFixed(2)}€</strong>
                    <button onclick="window.removeFromCart(${index})" style="background: #dc3545; color: white; border: none; padding: 0.5rem; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    cartTotal.textContent = total.toFixed(2) + '€';
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ========== MENU ITEMS ==========
function initMenuItems() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    if (addToCartButtons.length === 0) {
        console.log('No add to cart buttons found');
        return;
    }
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const name = menuItem.querySelector('h3').textContent;
            const priceText = menuItem.querySelector('.price').textContent;
            const price = priceText.replace('€', '').trim();
            
            addToCart(name, price);
        });
    });
    
    console.log('Menu items initialized:', addToCartButtons.length);
}

// ========== RECHERCHE ==========
function initSearch() {
    const searchInput = document.querySelector('.search-bar input');
    
    if (!searchInput) {
        console.log('Search input not found');
        return;
    }
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const menuItems = document.querySelectorAll('.menu-item');
        const paginationDiv = document.getElementById('pagination');
        
        if (searchTerm) {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            
            if (paginationDiv) {
                paginationDiv.style.display = 'none';
            }
            
            menuItems.forEach(item => {
                const name = item.querySelector('h3')?.textContent.toLowerCase() || '';
                const description = item.querySelector('p')?.textContent.toLowerCase() || '';
                
                if (name.includes(searchTerm) || description.includes(searchTerm)) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        } else {
            const activeBtn = document.querySelector('.category-btn.active');
            if (!activeBtn) {
                const defaultBtn = document.querySelector('.category-btn[data-category="tous"]');
                if (defaultBtn) {
                    defaultBtn.classList.add('active');
                }
            }
            filterProducts();
            updatePagination();
        }
    });
    
    console.log('Search initialized');
}

// ========== NOTIFICATIONS ==========
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--accent-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

// ========== CHECKOUT ==========
function initCheckout() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (!checkoutBtn) {
        console.log('Checkout button not found');
        return;
    }
    
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Votre panier est vide!');
            return;
        }
        
        const name = document.getElementById('customerName')?.value.trim();
        const firstName = document.getElementById('customerFirstName')?.value.trim();
        const email = document.getElementById('customerEmail')?.value.trim();
        
        if (!name || !firstName || !email) {
            showNotification('⚠️ Veuillez remplir tous les champs obligatoires');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('⚠️ Veuillez entrer une adresse email valide');
            return;
        }
        
        let message = `🎯 *NOUVELLE COMMANDE - Mon Café*\n\n`;
        message += `📋 *INFORMATIONS CLIENT*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n`;
        message += `👤 Nom: ${name}\n`;
        message += `👤 Prénom: ${firstName}\n`;
        message += `📧 Email: ${email}\n\n`;
        
        message += `🛒 *DÉTAILS DE LA COMMANDE*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n`;
        
        let total = 0;
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            message += `\n${index + 1}. *${item.name}*\n`;
            message += `   • Quantité: ${item.quantity}\n`;
            message += `   • Prix unitaire: ${item.price.toFixed(2)}€\n`;
            message += `   • Sous-total: ${itemTotal.toFixed(2)}€\n`;
        });
        
        message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        message += `💰 *TOTAL: ${total.toFixed(2)}€*\n\n`;
        message += `📅 Date: ${new Date().toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}\n\n`;
        message += `✨ Merci pour votre commande !\n`;
        message += `Nous vous contacterons rapidement pour confirmer.`;
        
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = '212690702486';
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappURL, '_blank');
        
        showNotification('✅ Redirection vers WhatsApp...');
        
        setTimeout(() => {
            cart = [];
            saveCart();
            updateCartCount();
            updateCartDisplay();
            
            if (document.getElementById('customerName')) {
                document.getElementById('customerName').value = '';
            }
            if (document.getElementById('customerFirstName')) {
                document.getElementById('customerFirstName').value = '';
            }
            if (document.getElementById('customerEmail')) {
                document.getElementById('customerEmail').value = '';
            }
            
            showNotification('🛒 Panier vidé avec succès!');
        }, 1000);
    });
    
    console.log('Checkout initialized');
}