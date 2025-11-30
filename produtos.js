// Gerenciamento de produtos
let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
let nextProductId = parseInt(localStorage.getItem('nextProductId')) || 1;

// Inicializar produtos de exemplo se não houver produtos
if (produtos.length === 0) {
    produtos = [
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
        }
    ];
    localStorage.setItem('produtos', JSON.stringify(produtos));
    localStorage.setItem('nextProductId', '3');
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