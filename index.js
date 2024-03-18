const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const { check, validationResult } = require('express-validator');


const app = express();
const port = 3000;


// Dados de usuário (poderiam estar em um banco de dados)
const usuarios = {
    'usuario1': 'senha1',
    'usuario2': 'senha2'
};


// Configurações do Express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));


// Middleware para analisar os corpos das requisições
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware para analisar cookies
app.use(cookieParser());


// Rota para página index
app.get('/', (req, res) => {
    res.render('index');
});


// Middleware array contendo as validação dos campos do formulário
const validateFormFields = [
    check('usuario').notEmpty().withMessage('Usuário é obrigatório'),
    check('senha').notEmpty().withMessage('Senha é obrigatória')
];


// Rota para autenticar o usuário
app.post('/auth', validateFormFields, (req, res) => { 
    const errors = validationResult(req); 
    if (!errors.isEmpty()) { //Se errors não estiver vazio, significa que houve falha na validação.
        return res.status(400).send(errors.array()[0].msg);
    }


    const { usuario, senha } = req.body;
    if (usuarios[usuario] === senha) {  //verifica se a combinação usuário/senha fornecida pelo cliente está correta ao objeto usuarios
        res.cookie('usuario', usuario); // Cria um cookie para armazenar o usuário
        res.redirect('/pagina_usuario');
    } else {
        res.send('Credenciais inválidas. Tente novamente.');
    }
});


// Rota para página de usuarios
app.get('/pagina_usuario', (req, res) => {
    const usuario = req.cookies.usuario; //extrai o valor do cookie chamado 'usuario' da requisição
    if (usuario) { // verifica se o cookie 'usuario' está definido. 
        res.render('pagina_usuario', { usuario });
    } else {
        res.redirect('/');
    }
});


// Rota para logout
app.get('/logout', (req, res) => {
    res.clearCookie('usuario'); // Apaga o cookie do usuário
    res.redirect('/');
});


// Rota para exibir informações do usuário
app.get('/informacoes_usuario', (req, res) => {
    const usuario = req.cookies.usuario; //extrai o valor do cookie chamado usuario
    const senha = usuarios[usuario]; // Obtendo a senha do usuário, Usa o valor do usuário obtido do cookie para procurar no objeto usuarios a senha correspondente ao usuário.
    if (usuario && senha) {
        res.render('informacoes_usuario', { usuario, senha });
    } else {
        res.redirect('/');
    }
});




// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
