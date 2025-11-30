// Carrinho de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Elementos do DOM
const cartIcon = document.getElementById('cartIcon');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartSummary = document.getElementById('cartSummary');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const cartCount = document.querySelector('.cart-count');

// Inicialização do carrinho
document.addEventListener('DOMContentLoaded', function() {
    updateCart();
    
    // Event Listeners do carrinho
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            cartOverlay.style.display = 'flex';
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartOverlay.style.display = 'none';
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) {
                cartOverlay.style.display = 'none';
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
});

// Funções do carrinho
function updateCart() {
    // Atualiza contador do carrinho
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    // Salva carrinho no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Atualiza exibição do carrinho
    renderCartItems();
}

function renderCartItems() {
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="cart-item">
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = itemsHTML;
    if (cartTotal) cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    if (cartSummary) cartSummary.style.display = 'block';
    
    // Adiciona event listeners para os botões do carrinho
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            decreaseQuantity(id);
        });
    });
    
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            increaseQuantity(id);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('.remove-item').dataset.id);
            removeFromCart(id);
        });
    });
}

function addToCart(productId) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const product = produtos.find(p => p.id === productId);
    
    if (!product) {
        alert('Produto não encontrado!');
        return;
    }
    
    // Verificar estoque
    if (product.estoque <= 0) {
        alert('Produto fora de estoque!');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= product.estoque) {
            alert('Quantidade máxima em estoque atingida!');
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.nome,
            price: parseFloat(product.preco),
            image: product.imagem,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Feedback visual
    const button = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
    if (button) {
        const originalText = button.textContent;
        button.textContent = 'Adicionado!';
        button.style.backgroundColor = 'var(--verde-folha)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 1500);
    }
}

function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const product = produtos.find(p => p.id === productId);
    
    if (item && product) {
        if (item.quantity >= product.estoque) {
            alert('Quantidade máxima em estoque atingida!');
            return;
        }
        item.quantity += 1;
        updateCart();
    }
}

function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(productId);
        }
        updateCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function checkout() {
    if (cart.length === 0) return;
    
   let message = "🪴 *PEDIDO - IZAPLANTAS* 🪴\n\n";
message += "Olá! Gostaria de fazer o seguinte pedido:\n\n";
message += "📋 *ITENS DO PEDIDO:*\n\n";
    
cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    message += `• ${item.name}\n`;
    message += `  Quantidade: ${item.quantity}\n`;
    message += `  Preço unitário: R$ ${item.price.toFixed(2)}\n`;
    message += `  Subtotal: R$ ${itemTotal.toFixed(2)}\n\n`;
});

const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
message += `💰 *VALOR TOTAL: R$ ${total.toFixed(2)}*\n\n`;
message += "📝 *OBSERVAÇÕES:* \n";
message += "(Por favor, informe se há preferência de cor, tamanho ou outras observações)\n\n";
message += "📍 *RETIRADA NA LOJA:*\n";
message += "Vila Marambaia KM6 - Atrás do Posto PRF\n";
message += "Segunda a Sexta: 8h às 17h | Sábado: 8h às 12h";
    
    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Número do WhatsApp da loja ATUALIZADO
    const phoneNumber = "5573999535407";
    
    // Abre o WhatsApp com a mensagem pré-preenchida
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    
    // Atualizar estoque
    atualizarEstoquePedido();
    
    // Limpa o carrinho após o pedido
    cart = [];
    updateCart();
    
    // Fecha o carrinho
    cartOverlay.style.display = 'none';
}

function atualizarEstoquePedido() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    
    cart.forEach(item => {
        const produto = produtos.find(p => p.id === item.id);
        if (produto) {
            produto.estoque -= item.quantity;
            if (produto.estoque < 0) produto.estoque = 0;
        }
    });
    
    localStorage.setItem('produtos', JSON.stringify(produtos));
}