// Gerenciamento de upload de imagens
let currentImageData = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('productImageFile');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const productImageData = document.getElementById('productImageData');

    // Event listener para seleção de arquivo
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Verificar tamanho do arquivo (máx 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    alert('A imagem deve ter no máximo 2MB');
                    return;
                }

                // Verificar tipo do arquivo
                if (!file.type.match('image.*')) {
                    alert('Por favor, selecione uma imagem');
                    return;
                }

                // Ler a imagem como Data URL
                const reader = new FileReader();
                reader.onload = function(e) {
                    currentImageData = e.target.result;
                    previewImage.src = currentImageData;
                    productImageData.value = currentImageData;
                    
                    // Mostrar preview e esconder área de upload
                    imagePreview.style.display = 'block';
                    uploadArea.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Drag and drop
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--verde-oliva');
            uploadArea.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--verde-menta');
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--verde-menta');
            uploadArea.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bege-claro');
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--verde-menta');
            uploadArea.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bege-claro');
            
            const file = e.dataTransfer.files[0];
            if (file) {
                fileInput.files = e.dataTransfer.files;
                fileInput.dispatchEvent(new Event('change'));
            }
        });
    }
});

// Funções globais para trocar e remover imagem
function trocarImagem() {
    const uploadArea = document.getElementById('uploadArea');
    const imagePreview = document.getElementById('imagePreview');
    
    uploadArea.style.display = 'block';
    imagePreview.style.display = 'none';
    currentImageData = null;
    document.getElementById('productImageData').value = '';
    document.getElementById('productImageFile').value = '';
}

function removerImagem() {
    trocarImagem();
}

// Função para obter a imagem do produto
function getProductImage(productId) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produto = produtos.find(p => p.id === productId);
    
    if (produto && produto.imagem && produto.imagem.startsWith('data:image')) {
        // É uma imagem em base64
        return produto.imagem;
    } else if (produto && produto.imagem) {
        // É uma URL externa
        return produto.imagem;
    } else {
        // Imagem padrão
        return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
    }
}

// Função para salvar imagem no localStorage
function saveImageToStorage(imageData, productId) {
    const imageStorage = JSON.parse(localStorage.getItem('productImages')) || {};
    imageStorage[productId] = imageData;
    localStorage.setItem('productImages', JSON.stringify(imageStorage));
}

// Função para carregar imagem do localStorage
function loadImageFromStorage(productId) {
    const imageStorage = JSON.parse(localStorage.getItem('productImages')) || {};
    return imageStorage[productId] || null;
}