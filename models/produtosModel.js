const express = require('express');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const pool = require('./database'); // Importe o módulo de conexão com o banco de dados

const produtosModel = {
  cadastrarProduto: async (produto) => {
    try {
      const { nome, descricao, preco, imagem } = produto;
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO produtos (nome, descricao, preco, imagem) VALUES (?, ?, ?, ?)',
        [nome, descricao, preco, imagem]
      );
      conn.release();
      return result;
    } catch (error) {
      throw new Error('Erro ao cadastrar o produto');
    }
  },

  buscarProdutos: async () => {
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM produtos');
      conn.release();
      return rows;
    } catch (error) {
      throw new Error('Erro ao buscar os produtos');
    }
  },

  buscarProdutoPorId: async (id) => {
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM produtos WHERE id = ?', [id]);
      conn.release();
      if (rows.length > 0) {
        return rows[0];
      } else {
        throw new Error('Produto não encontrado');
      }
    } catch (error) {
      throw new Error('Erro ao buscar o produto');
    }
  },

  atualizarProduto: async (id, produto) => {
    try {
      const { nome, descricao, preco } = produto;
      const conn = await pool.getConnection();
      await conn.query(
        'UPDATE produtos SET nome = ?, descricao = ?, preco = ? WHERE id = ?',
        [nome, descricao, preco, id]
      );
      conn.release();
    } catch (error) {
      throw new Error('Erro ao atualizar o produto');
    }
  },

  removerProduto: async (id) => {
    try {
      const conn = await pool.getConnection();
      await conn.query('DELETE FROM produtos WHERE id = ?', [id]);
      conn.release();
    } catch (error) {
      throw new Error('Erro ao remover o produto');
    }
  },
};

module.exports = produtosModel;
