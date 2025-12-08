import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const host = "0.0.0.0";
const porta = 3000;
var listaUsuarios = [];

var usuarioLogado = false; 

const server = express();

server.use(session({
    secret:"Minh4Ch4v3S3cr3t4",
    resave: true, //Nao salvar se nao mudar
    saveUninitialized: true, //Nao salvar sessao vazia
    cookie: {
        maxAge: 1000 * 60 * 30 
    }
}));

server.use(express.urlencoded({extended: true}));

server.use(cookieParser());

server.get("/", verificarUsuarioLogado, (requisicao, resposta) => {

    let ultimoAcesso = requisicao.cookies?.ultimoAcesso;

    if (usuarioLogado){
        resposta.redirect("/cadastroUsuario");
    }

    const data = new Date();
    resposta.cookie("ultimoAcesso",data.toLocaleString());
    resposta.setHeader("Content-Type", "text/html");
    resposta.write(`
        <!doctype html>
        <html lang="pt-br">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Campeonato de League of Legends</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
            <style>
            </style>
        </head>
        <body class="bg-dark">
                <h3 style="color: white; text-align: right;">ultimo acesso: ${ultimoAcesso || "Primeiro acesso"}</h3>
                <div class="d-flex justify-content-center align-items-center vh-100 ">
                <div class="card p-4 shadow" style="width: 750px; background-color: rgb(16, 21, 55);">
                    <h1 class="text-center mb-3" style="color: rgb(198, 203, 42);">Campeonato de League of Legends</h1>
                    <h3 class="text-center mb-3" style="color: white;">Cadastro de equipes e jogadores</h3>

                    <form action="">
                        <div class="mb-3 text-center">
                            <button class="btn btn-primary w-50" id="btn_equipe">Cadastro de equipe</button>
                        </div>
                        <div class="mb-3 text-center">
                            <button class="btn btn-primary w-50" id="btn_jogador">Cadastro de jogadores</button>
                        </div>
                        <div class="mb-3 text-center">
                            <button class="btn btn-secondary w-50" aria-current="page" href="/logout">Logout</button>
                        </div>
                    </form>

                </div>
                </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
        </body>
        </html>
    `);

    
    resposta.end();
});




server.get("/login", (requisicao, resposta) => {
    resposta.send(`
        <!doctype html>
        <html lang="pt-br">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Login</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head>
        <body class="bg-dark">

            <div class="d-flex justify-content-center align-items-center vh-100">
                <div class="card p-4 shadow" style="width: 350px; background-color: rgb(187, 187, 187);">
                    <h3 class="text-center mb-3">Login</h3>

                    <form action='/login' method='POST' class="row g-3 needs-validation" novalidate>
                        <div class="mb-3">
                            <label class="form-label">Usuário</label>
                            <input type="text" class="form-control" id="Login" placeholder="Digite seu usuário">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Senha</label>
                            <input type="password" class="form-control" id="Senha" placeholder="Digite sua senha">
                        </div>

                        <button class="btn btn-primary w-100" type="submit">Entrar</button>
                    </form>
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
        </body>
        </html>
    `);
});

server.post("/login", (requisicao, resposta) => {
    const {usuario, senha} = requisicao.body;

    if (usuario === "admin" && senha === "admin"){
        requisicao.session.dadosLogin= {
            nome: "Administrador", 
            logado: true
        };
        resposta.redirect("/");
    } else {
        resposta.write(`
        <!doctype html>
        <html lang="pt-br">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Login</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head>
        <body class="bg-dark">

            <div class="d-flex justify-content-center align-items-center vh-100">
                <div class="card p-4 shadow" style="width: 350px; background-color: rgb(187, 187, 187);">
                    <h3 class="text-center mb-3">Login</h3>

                    <form action='/login' method='POST' class="row g-3 needs-validation" novalidate>
                        <div class="mb-3">
                            <label class="form-label">Usuário</label>
                            <input type="text" class="form-control" id="Login" placeholder="Digite seu usuário">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Senha</label>
                            <input type="password" class="form-control" id="Senha" placeholder="Digite sua senha">
                        </div>

                        <button class="btn btn-primary w-100" type="submit">Entrar</button>
                        
                        <div class="col-12 mt-2">
                            <p class="text-danger">Usuário ou senha inválidos</p>
                        </div>
                    </form>
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
        </body>
        </html>
        `);
    }
    
});

server.get("/logout",(requisicao, resposta) =>{
    requisicao.session.destroy();
    resposta.redirect("/login");
});

//função para verificar se o usuário está logado (middleware)
function verificarUsuarioLogado(requisicao, resposta, proximo) {
    if (requisicao.session.dadosLogin?.logado){ 
        proximo();
    } else {
        resposta.redirect("/login");
    }
    
}
server.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`)
});

