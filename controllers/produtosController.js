const mariadb = require('mariadb');
require('dotenv').config();
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5
});

const produtosController = {
  cadastrarProduto: async (req, res) => {
    try {
      const { nome, descricao, preco } = req.body;
      const imagem = req.file.filename; // Nome do arquivo de imagem

      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO produtos (nome, descricao, preco, imagem) VALUES (?, ?, ?, ?)',
        [nome, descricao, preco, imagem]
      );
      conn.release();
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao cadastrar o produto' });
    }
  },

  buscarProdutos: async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM produtos');
      conn.release();
      res.json({ produtos: rows.map(row => ({ ...row, preco: row.preco.toString() })) });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar os produtos' });
    }
  },

  buscarProdutoPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM produtos WHERE id = ?', [id]);
      conn.release();
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ error: 'Produto não encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar o produto' });
    }
  },

  atualizarProduto: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, descricao, preco } = req.body;
      const conn = await pool.getConnection();
      await conn.query(
        'UPDATE produtos SET nome = ?, descricao = ?, preco = ? WHERE id = ?',
        [nome, descricao, preco, id]
      );
      conn.release();
      res.json({ message: 'Produto atualizado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar o produto' });
    }
  },

  removerProduto: async (req, res) => {
    try {
      const { id } = req.params;
      const conn = await pool.getConnection();
      await conn.query('DELETE FROM produtos WHERE id = ?', [id]);
      conn.release();
      res.json({ message:'Produto removido com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao remover o produto' });
    }
  }
};

// Importar o módulo path
const path = require('path');

// Função para renderizar a página de cadastro
const renderizarPaginaCadastro = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/cadastro.html'));
};

// Função para renderizar a página inicial
const renderizarPaginaInicial = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
};

// Função para renderizar a página de lista de produtos
const renderizarPaginaListaProdutos = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/lista-produtos.html'));
};


module.exports = produtosController;
