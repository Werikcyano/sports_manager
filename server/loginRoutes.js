const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const router = express.Router();
const path = require('path');

require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const pool = new Pool({
user: process.env.DB_USER,
host: process.env.DB_HOST,
database: process.env.DB_DATABASE,
password: process.env.DB_PASSWORD,
port: process.env.DB_PORT,
});

// Função para buscar um usuário pelo email
const findUserByEmail = async (email) => {
    try {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const { rows } = await pool.query(query, [email]);
        if (rows.length > 0) {
            return rows[0]; // Retorna o primeiro usuário encontrado
        } else {
            return null; // Não encontrou nenhum usuário
        }
    } catch (err) {
        console.error('Erro ao buscar usuário por email', err);
        throw err;
    }
};

// Rota para servir a página de login
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html')); // Ajuste o caminho conforme necessário
  });

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  
  // Buscar o usuário pelo email
  const user = await findUserByEmail(email);
  if (!user) {
      return res.status(404).send('Usuário não encontrado');
  }
  
  // Verificar a senha
  const passwordIsValid = await bcrypt.compare(password, user.hashedpassword);
  if (!passwordIsValid) {
      return res.status(401).send('Senha inválida');
  }
  
  // Gerar o token JWT
  const token = jwt.sign({ userId: user.id },  process.env.JWT_SECRET, { expiresIn: '24h' });
  
  // Enviar o token para o cliente
  res.send({ token });
});

module.exports = router;