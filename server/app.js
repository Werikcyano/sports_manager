const express = require('express');
const app = express();
const authenticateToken = require('./middleware/authenticateToken'); // Importe o middleware

app.use(express.json());

const loginRoutes = require('./loginRoutes');
const registerRoutes = require('./registerRoutes');


app.use('/login', loginRoutes);
app.use('/registrar', registerRoutes);
app.use(express.static('public')); // Adicione esta linha, substituindo 'public' pelo nome da sua pasta de arquivos estáticos


app.listen(2000, () => {
  console.log('Servidor rodando na porta 2000');
});