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

server.get("/cadastroEquipes", verificarUsuarioLogado,(requisicao,resposta) => {
    resposta.send(`
        <DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <title>Menu do Sistema</title>
            </head>
            <body style="background-color: rgb(137, 137, 137);">
              <div class="d-flex justify-content-center align-items-center vh-100 ">
                <div class="container">
                    <h1 class="text-center border m-3 p-3 bg-light">Cadastro de Equipes</h1>
                    <form method="POST" action="/adicionarUsuario" class="row g-3 m-3 p-3 bg-light">
                            <div class="col-md-4">
                                <label for="nome" class="form-label">Nome da equipe</label>
                                <input type="text" class="form-control" id="nome" name="nome">
                            </div>
                            <div class="col-md-4">
                                <label for="sobrenome" class="form-label">Nome do capitão</label>
                                <input type="text" class="form-control" id="capitao" name="capitao">
                            </div>
                            <div class="col-md-4">
                                <label for="usuario" class="form-label">Telefone/whatsapp de contato</label>
                                <input type="text" class="form-control" id="tel" name="tel" aria-describedby="inputGroupPrepend">
                                </div>
                            <div class="col-12">
                                <button class="btn btn-primary" type="submit">Cadastrar</button>
                                <a class="btn btn-secondary" href="/">Voltar</a>
                            </div>
                    </form> <br><br><br><br><br><br><br><br>
                </div>
              </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>
    `);
})

server.post('/adicionarEquipes', verificarUsuarioLogado, (requisicao, resposta) => {
    const nome = requisicao.body.nome;
    const capitao = requisicao.body.capitao;
    const tel = requisicao.body.tel;

    if (nome && capitao && tel){

        listaEquipes.push({nome, capitao, tel});
        resposta.redirect("/listarEquipes");
    }
    else{

        let conteudo = `
        
        <DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <title>Menu do Sistema</title>
            </head>
            <body style="background-color: rgb(137, 137, 137);">
              <div class="d-flex justify-content-center align-items-center vh-100 ">
                <div class="container">
                    <h1 class="text-center border m-3 p-3 bg-light">Cadastro de Equipes</h1>
                    <form method="POST" action="/adicionarUsuario" class="row g-3 m-3 p-3 bg-light">
                            <div class="col-md-4">
                                <label for="nome" class="form-label">Nome da equipe</label>
                                <input type="text" class="form-control" id="nome" name="nome" value="${nome}">
                            `;
        if (!nome){
            conteudo += `
            <div>
                <p class="text-danger">Por favor, informe o nome da equipe</p>
            </div>
        `
        }

        conteudo += `</div>
                            <div class="col-md-4">
                                <label for="sobrenome" class="form-label">Nome do capitão</label>
                                <input type="text" class="form-control" id="capitao" name="capitao" value="${capitao}">
                            `;
        if (!capitao){
        conteudo += `
            <div>
                <p class="text-danger">Por favor, informe o Nome do capitão</p>
            </div>
        `;
        }

        conteudo+= `</div>
                            <div class="col-md-4">
                                <label for="usuario" class="form-label">Telefone/whatsapp de contato</label>
                                <input type="text" class="form-control" id="tel" name="tel" aria-describedby="inputGroupPrepend" value="${tel}">
                                
                            `;
        if (!tel){

            conteudo += `
                <div>
                    <p class="text-danger">Por favor, informe o Telefone de contato</p>
                </div>
            `;
        }

        conteudo += `</div>
                            <div class="col-12">
                                <button class="btn btn-primary" type="submit">Cadastrar</button>
                                <a class="btn btn-secondary" href="/">Voltar</a>
                            </div>
                    </form> <br><br><br><br><br><br><br><br>
                </div>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>
        
        `;

        resposta.send(conteudo);

    }

    });

server.get("/listarEquipes", verificarUsuarioLogado,(requisicao, resposta) => {
    let conteudo = `
       <DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <title>Lista de usuários no Sistema</title>
            </head>
            <body style="background-color: rgb(137, 137, 137);">
                 <div class="container">
                  <div class="border m-3 p-3 bg-light">
                      <h1 class="text-center border m-3 p-3 bg-light">Lista de Equipes</h1>
                      <table class="table table-striped table-hover">
                          <thead>
                              <tr>
                                  <th>Nome da Equipe</th>
                                  <th>Nome do Capitão</th>
                                  <th>Telefone/whatsapp de contato</th>
                              </tr>
                          </thead>
                          <tbody>`;
    for (let i = 0; i < listaEquipes.length; i++) {
        conteudo += `
            <tr>
                <td>${listaEquipes[i].nome}</td>
                <td>${listaEquipes[i].capitao}</td>
                <td>${listaEquipes[i].tel}</td
            </tr>
        `;
    }
    conteudo+=`
                         </tbody>
                      </table>
                      <a class="btn btn-secondary" href="/cadastroUsuario">Voltar</a>
                  </div>
                </div> 
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>
    `
    resposta.send(conteudo);
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

