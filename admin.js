// Admin - Gerenciamento de produtos e estoque
document.addEventListener('DOMContentLoaded', function() {
    // Cadastro de produtos
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            cadastrarProduto();
        });
    }

    // Gerenciamento de estoque
    if (document.getElementById('stockTable')) {
        carregarEstoque();
        
        // Filtros
        document.getElementById('filterCategory').addEventListener('change', filtrarEstoque);
        document.getElementById('filterStock').addEventListener('change', filtrarEstoque);
    }
});

function cadastrarProduto() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const nextProductId = parseInt(localStorage.getItem('nextProductId')) || 1;
    
    // Obter a imagem (Data URL ou URL padrão)
    const imageData = document.getElementById('productImageData').value;
    const productImage = imageData || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
    
    const novoProduto = {
        id: nextProductId,
        nome: document.getElementById('productName').value,
        preco: document.getElementById('productPrice').value,
        custo: document.getElementById('productCost').value || '0',
        estoque: parseInt(document.getElementById('productStock').value),
        imagem: productImage, // Agora pode ser Data URL ou URL
        descricao: document.getElementById('productDescription').value || '',
        categoria: document.getElementById('productCategory').value,
        material: document.getElementById('productMaterial').value || '',
        dimensoes: document.getElementById('productDimensions').value || '',
        especie: document.getElementById('productSpecies').value || '',
        tamanho: document.getElementById('productSize').value || '',
        cor: document.getElementById('productColor').value || ''
    };
    
    produtos.push(novoProduto);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    localStorage.setItem('nextProductId', (nextProductId + 1).toString());
    
    // Salvar imagem separadamente se for Data URL
    if (imageData.startsWith('data:image')) {
        saveImageToStorage(imageData, nextProductId);
    }
    
    // Feedback
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = `
        <div style="background-color: var(--verde-menta); color: var(--verde-folha); padding: 15px; border-radius: 10px;">
            <i class="fas fa-check-circle"></i> Produto cadastrado com sucesso! ID: ${nextProductId}
        </div>
    `;
    
    // Limpar formulário
    document.getElementById('productForm').reset();
    trocarImagem(); // Resetar a área de imagem
    
    // Atualizar estoque se estiver na página de estoque
    if (document.getElementById('stockTable')) {
        carregarEstoque();
    }
}
    
    produtos.push(novoProduto);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    localStorage.setItem('nextProductId', (nextProductId + 1).toString());
    
    // Feedback
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = `
        <div style="background-color: var(--verde-menta); color: var(--verde-folha); padding: 15px; border-radius: 10px;">
            <i class="fas fa-check-circle"></i> Produto cadastrado com sucesso! ID: ${nextProductId}
        </div>
    `;
    
    // Limpar formulário
    document.getElementById('productForm').reset();
    
    // Atualizar estoque se estiver na página de estoque
    if (document.getElementById('stockTable')) {
        carregarEstoque();
    }


function carregarEstoque() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const tbody = document.getElementById('stockTableBody');
    const summaryDiv = document.getElementById('stockSummary');
    
    if (produtos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Nenhum produto cadastrado</td></tr>';
        summaryDiv.innerHTML = '<p>Nenhum produto cadastrado no sistema.</p>';
        return;
    }
    
    // Calcular totais
    const totalProdutos = produtos.length;
    const totalEstoque = produtos.reduce((sum, p) => sum + parseInt(p.estoque), 0);
    const produtosSemEstoque = produtos.filter(p => parseInt(p.estoque) === 0).length;
    const estoqueBaixo = produtos.filter(p => parseInt(p.estoque) > 0 && parseInt(p.estoque) <= 5).length;
    
    summaryDiv.innerHTML = `
        <h3>Resumo do Estoque</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 10px;">
            <div style="background: white; padding: 15px; border-radius: 10px; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--verde-folha);">${totalProdutos}</div>
                <div>Total de Produtos</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 10px; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--verde-folha);">${totalEstoque}</div>
                <div>Unidades em Estoque</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 10px; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: bold; color: ${estoqueBaixo > 0 ? '#e67e22' : 'var(--verde-oliva)'};">${estoqueBaixo}</div>
                <div>Estoque Baixo (≤ 5)</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 10px; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: bold; color: ${produtosSemEstoque > 0 ? '#e74c3c' : 'var(--verde-oliva)'};">${produtosSemEstoque}</div>
                <div>Fora de Estoque</div>
            </div>
        </div>
    `;
    
    // Renderizar tabela
    tbody.innerHTML = produtos.map(produto => `
        <tr>
            <td>${produto.id}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${produto.imagem}" alt="${produto.nome}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" onerror="this.src='https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'">
                    <div>
                        <strong>${produto.nome}</strong><br>
                        <small style="color: var(--cinza-texto);">${produto.descricao.substring(0, 50)}...</small>
                    </div>
                </div>
            </td>
            <td>
                <span style="background-color: var(--verde-menta); color: var(--verde-folha); padding: 4px 8px; border-radius: 15px; font-size: 0.8rem;">
                    ${produto.categoria}
                </span>
            </td>
            <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
            <td>
                <span class="${produto.estoque <= 5 ? 'stock-low' : 'stock-ok'}">
                    ${produto.estoque} un
                </span>
            </td>
            <td>
                ${produto.estoque === 0 ? 
                    '<span style="color: #e74c3c; font-weight: bold;">Fora de Estoque</span>' : 
                    produto.estoque <= 5 ? 
                    '<span style="color: #e67e22; font-weight: bold;">Estoque Baixo</span>' : 
                    '<span style="color: var(--verde-oliva); font-weight: bold;">Em Estoque</span>'
                }
            </td>
            <td>
                <button class="btn btn-outline" onclick="editarEstoque(${produto.id})" style="padding: 5px 10px; font-size: 0.8rem;">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn" onclick="excluirProduto(${produto.id})" style="padding: 5px 10px; font-size: 0.8rem; background-color: var(--rosa-floral);">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        </tr>
    `).join('');
}

function filtrarEstoque() {
    const categoria = document.getElementById('filterCategory').value;
    const estoque = document.getElementById('filterStock').value;
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    
    let produtosFiltrados = produtos;
    
    if (categoria !== 'all') {
        produtosFiltrados = produtosFiltrados.filter(p => p.categoria === categoria);
    }
    
    if (estoque !== 'all') {
        if (estoque === 'low') {
            produtosFiltrados = produtosFiltrados.filter(p => p.estoque > 0 && p.estoque <= 5);
        } else if (estoque === 'out') {
            produtosFiltrados = produtosFiltrados.filter(p => p.estoque === 0);
        }
    }
    
    const tbody = document.getElementById('stockTableBody');
    tbody.innerHTML = produtosFiltrados.map(produto => `
        <tr>
            <td>${produto.id}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${produto.imagem}" alt="${produto.nome}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" onerror="this.src='https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'">
                    <div>
                        <strong>${produto.nome}</strong><br>
                        <small style="color: var(--cinza-texto);">${produto.descricao.substring(0, 50)}...</small>
                    </div>
                </div>
            </td>
            <td>
                <span style="background-color: var(--verde-menta); color: var(--verde-folha); padding: 4px 8px; border-radius: 15px; font-size: 0.8rem;">
                    ${produto.categoria}
                </span>
            </td>
            <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
            <td>
                <span class="${produto.estoque <= 5 ? 'stock-low' : 'stock-ok'}">
                    ${produto.estoque} un
                </span>
            </td>
            <td>
                ${produto.estoque === 0 ? 
                    '<span style="color: #e74c3c; font-weight: bold;">Fora de Estoque</span>' : 
                    produto.estoque <= 5 ? 
                    '<span style="color: #e67e22; font-weight: bold;">Estoque Baixo</span>' : 
                    '<span style="color: var(--verde-oliva); font-weight: bold;">Em Estoque</span>'
                }
            </td>
            <td>
                <button class="btn btn-outline" onclick="editarEstoque(${produto.id})" style="padding: 5px 10px; font-size: 0.8rem;">
                    <i class="fas fa-edit"></i> Editar
                </button>
            </td>
        </tr>
    `).join('');
}

function editarEstoque(productId) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produto = produtos.find(p => p.id === productId);
    
    if (!produto) return;
    
    const novoEstoque = prompt(`Editar estoque para "${produto.nome}":`, produto.estoque);
    
    if (novoEstoque !== null && !isNaN(novoEstoque) && novoEstoque >= 0) {
        produto.estoque = parseInt(novoEstoque);
        localStorage.setItem('produtos', JSON.stringify(produtos));
        carregarEstoque();
        alert('Estoque atualizado com sucesso!');
    }
}

function excluirProduto(productId) {
    if (!confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos = produtos.filter(p => p.id !== productId);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    carregarEstoque();
    alert('Produto excluído com sucesso!');


}

function editarProduto(productId) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produto = produtos.find(p => p.id === productId);
    
    if (!produto) return;
    
    // Preencher formulário com dados do produto
    document.getElementById('productName').value = produto.nome;
    document.getElementById('productPrice').value = produto.preco;
    document.getElementById('productCost').value = produto.custo;
    document.getElementById('productStock').value = produto.estoque;
    document.getElementById('productDescription').value = produto.descricao;
    document.getElementById('productCategory').value = produto.categoria;
    document.getElementById('productMaterial').value = produto.material;
    document.getElementById('productDimensions').value = produto.dimensoes;
    document.getElementById('productSpecies').value = produto.especie;
    document.getElementById('productSize').value = produto.tamanho;
    document.getElementById('productColor').value = produto.cor;
    
    // Mostrar imagem atual se existir
    if (produto.imagem) {
        const previewImage = document.getElementById('previewImage');
        const imagePreview = document.getElementById('imagePreview');
        const uploadArea = document.getElementById('uploadArea');
        const productImageData = document.getElementById('productImageData');
        
        previewImage.src = produto.imagem;
        productImageData.value = produto.imagem;
        imagePreview.style.display = 'block';
        uploadArea.style.display = 'none';
    }
    
    // Alterar o botão para "Atualizar Produto"
    const submitBtn = document.querySelector('#productForm button[type="submit"]');
    submitBtn.textContent = 'Atualizar Produto';
    submitBtn.onclick = function(e) {
        e.preventDefault();
        atualizarProduto(productId);
    };
    
    // Scroll para o formulário
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
}

function atualizarProduto(productId) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produtoIndex = produtos.findIndex(p => p.id === productId);
    
    if (produtoIndex === -1) return;
    
    // Obter a imagem (mantém a atual ou usa nova)
    const imageData = document.getElementById('productImageData').value;
    const productImage = imageData || produtos[produtoIndex].imagem;
    
    // Atualizar produto
    produtos[produtoIndex] = {
        ...produtos[produtoIndex],
        nome: document.getElementById('productName').value,
        preco: document.getElementById('productPrice').value,
        custo: document.getElementById('productCost').value || '0',
        estoque: parseInt(document.getElementById('productStock').value),
        imagem: productImage,
        descricao: document.getElementById('productDescription').value || '',
        categoria: document.getElementById('productCategory').value,
        material: document.getElementById('productMaterial').value || '',
        dimensoes: document.getElementById('productDimensions').value || '',
        especie: document.getElementById('productSpecies').value || '',
        tamanho: document.getElementById('productSize').value || '',
        cor: document.getElementById('productColor').value || ''
    };
    
    localStorage.setItem('produtos', JSON.stringify(produtos));
    
    // Feedback
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = `
        <div style="background-color: var(--verde-menta); color: var(--verde-folha); padding: 15px; border-radius: 10px;">
            <i class="fas fa-check-circle"></i> Produto atualizado com sucesso!
        </div>
    `;
    
    // Resetar formulário
    document.getElementById('productForm').reset();
    trocarImagem();
    
    // Resetar botão
    const submitBtn = document.querySelector('#productForm button[type="submit"]');
    submitBtn.textContent = 'Cadastrar Produto';
    submitBtn.onclick = function(e) {
        e.preventDefault();
        cadastrarProduto();
    };
    
    // Atualizar estoque
    if (document.getElementById('stockTable')) {
        carregarEstoque();
    }
}