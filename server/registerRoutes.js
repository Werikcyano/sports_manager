const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const router = express.Router();

require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const pool = new Pool({
user: process.env.DB_USER,
host: process.env.DB_HOST,
database: process.env.DB_DATABASE,
password: process.env.DB_PASSWORD,
port: process.env.DB_PORT,
});

router.post('/', async (req, res) => {
  const { email, password, nome } = req.body;

  try {
    // Verificar se o usuário já existe
    const userExists = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).send('Usuário já existe.');
    }

    // Criptografar a senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Armazenar o novo usuário no banco de dados
    const newUser = await pool.query(
      'INSERT INTO usuarios (email, hashedPassword, nome) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, nome]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error('Erro ao registrar usuário', err);
    res.status(500).send('Erro ao registrar usuário');
  }
});

module.exports = router;