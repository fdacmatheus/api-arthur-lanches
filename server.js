const express = require('express');
const path = require('path');
const multer = require('multer');
const produtosController = require('./controllers/produtosController');
const app = express();

// Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Middleware para lidar com dados do formulário
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// allow cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Rota para servir a página de cadastro
app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cadastro.html'));
});

// Rota para a página de lista de produtos
app.get('/lista-produtos', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'lista-produtos.html'));
});

// Rota para editar produto
app.get('/editar-produto', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'editar-produto.html'));
});

// Rota para cadastrar um produto
app.post('/produtos', upload.single('imagem'), produtosController.cadastrarProduto);

// Rota para buscar todos os produtos
app.get('/produtos', produtosController.buscarProdutos);

// Rota para buscar um produto por ID
app.get('/produtos/:id', produtosController.buscarProdutoPorId);

// Rota para atualizar um produto
app.put('/produtos/:id', produtosController.atualizarProduto);

// Rota para remover um produto
app.delete('/produtos/:id', produtosController.removerProduto);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(3000, () => {
console.log('Servidor iniciado na porta 3000', 'http://localhost:3000/');
});