// Gerenciamento de produtos - Versão Completa
let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
let nextProductId = parseInt(localStorage.getItem('nextProductId')) || 27; // Continuando dos IDs anteriores

// Inicializar produtos de exemplo se não houver produtos
if (produtos.length === 0) {
    produtos = [
        // Produtos de exemplo originais
        {
            id: 1,
            nome: "Orquídea Phalaenopsis Branca",
            preco: "45.00",
            custo: "25.00",
            estoque: 10,
            imagem: "https://images.unsplash.com/photo-1545241047-6083c3681330?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            descricao: "Orquídea adulta, florida, perfeita para decoração de interiores.",
            categoria: "plantas",
            material: "",
            dimensoes: "30cm altura",
            especie: "Phalaenopsis",
            tamanho: "adulta",
            cor: "branco"
        },
        {
            id: 2,
            nome: "Vaso de Barro Médio",
            preco: "20.00",
            custo: "8.00",
            estoque: 15,
            imagem: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            descricao: "Vaso de barro queimado, tamanho médio, ideal para plantas médias.",
            categoria: "vasos",
            material: "barro",
            dimensoes: "15cm diâmetro",
            especie: "",
            tamanho: "m",
            cor: "terracota"
        },
        // Adicionando mais produtos de exemplo para variedade
        {
            id: 3,
            nome: "Suculenta Echeveria",
            preco: "18.00",
            custo: "9.00",
            estoque: 20,
            imagem: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            descricao: "Suculenta roseta perfeita para ambientes internos.",
            categoria: "plantas",
            material: "",
            dimensoes: "8cm diâmetro",
            especie: "Echeveria",
            tamanho: "muda",
            cor: "verde"
        },
        {
            id: 4,
            nome: "Samambaia Americana",
            preco: "32.00",
            custo: "16.00",
            estoque: 12,
            imagem: "https://images.unsplash.com/photo-1599599810692-87b2108627bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            descricao: "Planta de sombra ideal para varandas e interiores.",
            categoria: "plantas",
            material: "",
            dimensoes: "35cm altura",
            especie: "Samambaia",
            tamanho: "adulta",
            cor: "verde"
        }
    ];
    localStorage.setItem('produtos', JSON.stringify(produtos));
    localStorage.setItem('nextProductId', '27');
}

function carregarProdutosPorCategoria(categoria, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const produtosFiltrados = produtos.filter(produto => produto.categoria === categoria);
    
    if (produtosFiltrados.length === 0) {
        container.innerHTML = '<p>Nenhum produto encontrado nesta categoria.</p>';
        return;
    }
    
    container.innerHTML = produtosFiltrados.map(produto => `
        <div class="product-card" data-category="${produto.categoria}" data-size="${produto.tamanho || 'all'}" data-color="${produto.cor || 'all'}">
            <div class="product-img">
                <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'">
                ${produto.estoque < 5 ? '<span class="product-badge">Últimas unidades</span>' : ''}
                ${produto.estoque === 0 ? '<span class="product-badge" style="background-color: #e74c3c;">Fora de estoque</span>' : ''}
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
                            data-image="${produto.imagem}"
                            ${produto.estoque <= 0 ? 'disabled' : ''}>
                        ${produto.estoque <= 0 ? 'Sem Estoque' : 'Adicionar'}
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

// Função para filtrar produtos (genérica)
function filtrarProdutos(containerId, filtros) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let produtosFiltrados = produtos.filter(produto => {
        for (let key in filtros) {
            if (filtros[key] !== 'all' && produto[key] !== filtros[key]) {
                return false;
            }
        }
        return true;
    });
    
    // Atualizar a exibição
    container.innerHTML = produtosFiltrados.map(produto => `
        <div class="product-card" data-category="${produto.categoria}" data-size="${produto.tamanho || 'all'}" data-color="${produto.cor || 'all'}">
            <div class="product-img">
                <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'">
                ${produto.estoque < 5 ? '<span class="product-badge">Últimas unidades</span>' : ''}
                ${produto.estoque === 0 ? '<span class="product-badge" style="background-color: #e74c3c;">Fora de estoque</span>' : ''}
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
                            data-image="${produto.imagem}"
                            ${produto.estoque <= 0 ? 'disabled' : ''}>
                        ${produto.estoque <= 0 ? 'Sem Estoque' : 'Adicionar'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Re-atachar event listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        });
    });
}

function carregarProdutosPorCategoria(categoria, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produtosFiltrados = produtos.filter(produto => produto.categoria === categoria);
    
    if (produtosFiltrados.length === 0) {
        container.innerHTML = '<p>Nenhum produto encontrado nesta categoria.</p>';
        return;
    }
    
    container.innerHTML = produtosFiltrados.map(produto => {
        // Usar imagem local se disponível, senão usar URL padrão
        const imagemProduto = produto.imagem && produto.imagem.startsWith('data:image') ? 
                            produto.imagem : 
                            (produto.imagem || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
        
        return `
        <div class="product-card" data-category="${produto.categoria}" data-size="${produto.tamanho || 'all'}" data-color="${produto.cor || 'all'}">
            <div class="product-img">
                <img src="${imagemProduto}" alt="${produto.nome}" onerror="this.src='https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'">
                ${produto.estoque < 5 ? '<span class="product-badge">Últimas unidades</span>' : ''}
                ${produto.estoque === 0 ? '<span class="product-badge" style="background-color: #e74c3c;">Fora de estoque</span>' : ''}
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
                            data-image="${imagemProduto}"
                            ${produto.estoque <= 0 ? 'disabled' : ''}>
                        ${produto.estoque <= 0 ? 'Sem Estoque' : 'Adicionar'}
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');

    // Adicionar event listeners aos botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        });
    });
}