// Navegação e funcionalidades gerais
document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
    }

    // Fechar menu ao clicar em um link
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
    });

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`Obrigado por se inscrever com o email: ${email}`);
            this.reset();
        });
    }

    // Carregar produtos em destaque na página inicial
    if (document.getElementById('featuredProducts')) {
        carregarProdutosDestaque();
    }
});

function carregarProdutosDestaque() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const featuredContainer = document.getElementById('featuredProducts');
    
    // Filtra produtos em destaque (primeiros 4 produtos)
    const produtosDestaque = produtos.slice(0, 4);
    
    if (produtosDestaque.length === 0) {
        featuredContainer.innerHTML = '<p>Nenhum produto cadastrado ainda.</p>';
        return;
    }
    
    featuredContainer.innerHTML = produtosDestaque.map(produto => `
        <div class="product-card" data-category="${produto.categoria}" data-size="${produto.tamanho || 'all'}" data-color="${produto.cor || 'all'}">
            <div class="product-img">
                <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'">
                ${produto.estoque < 5 ? '<span class="product-badge">Últimas unidades</span>' : ''}
            </div>
            <div class="product-content">
                <h3>${produto.nome}</h3>
                <p class="product-description">${produto.descricao}</p>
                <div class="product-price">R$ ${parseFloat(produto.preco).toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn btn-outline">Detalhes</button>
                    <button class="btn add-to-cart" 
                            data-id="${produto.id}" 
                            data-name="${produto.nome}" 
                            data-price="${produto.preco}" 
                            data-image="${produto.imagem}">
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Adicionar event listeners aos botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        });
    });
}