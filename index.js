const expresso = require('express');
const { status } = require('express/lib/response');
const minhaApi = expresso();
const Sequelize = require('sequelize');

minhaApi.use(expresso.json());minhaApi.use(expresso.json());
const conexao = new Sequelize('nodejs', 'root', 'root', {
    host: 'localhost', // URL
    dialect: 'mysql'
});

const porta = 4300

conexao.authenticate()
    .then(() => {
        console.log('Conectado com sucesso.');
    }).catch((erro) => {
        console.log('Deu Erro: ', erro);
    });

const Cargo = conexao.define('cargos', {
    codigo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    descricao: {
        type: Sequelize.STRING(128),
        allowNull: false
    }
});
    
const Usuario = conexao.define('usuarios', {
    codigo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING(128),
        allowNull: false
    },
    idade: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    CPF: {
        type: Sequelize.STRING(11),
        allowNull: false
    }
});
    
Usuario.belongsTo(Cargo, { foreignKey: 'cargoId' });

conexao.sync({ alter: true }).then(() => {
    console.log('Tabelas sincronizadas com sucesso.');
}).catch((erro) => {
    console.log('Erro ao sincronizar tabelas: ', erro);
});



// Develor uma lista de usuários 
minhaApi.get('/usuarios',(req, res) => {
    let repostaUser = '';

    for(const user of funcionarioList){
        repostaUser += '<p>';
        repostaUser += "Id: "+user.id+"<br>";
        repostaUser += "Nome: "+user.nome+"<br>";
        repostaUser += "Idade: "+user.idade+"<br>";
        repostaUser += "CPF: "+user.CPF+"<br>";
        repostaUser += "Cargo ID: "+user.Cargo+"<br>";
        repostaUser += '</p>\n';
    }
    res.send(repostaUser);
});


//Devolver os dados de um usuário específico pelo seu ID na URL
minhaApi.get('/usuarios/:idUsuario',(req, res) => {
    let repostaUser = '';
    const idUsuario = req.params.idUsuario;

    const objUser = funcionarioList.find(user => parseInt(user.id) === parseInt(idUsuario));
    //console.log(req.body);
    //res.send('<h1> Hello World!</h1><p>Paragrafo foda</p>');
    //res.send(pessoa);
    repostaUser += '<p>';
    repostaUser += "Id: "+objUser.id+"<br>";
    repostaUser += "Nome: "+objUser.nome+"<br>";
    repostaUser += "Idade: "+objUser.idade+"<br>";
    repostaUser += "CPF: "+objUser.CPF+"<br>";
    repostaUser += "Cargo ID: "+objUser.Cargo+"<br>";
    if(cargoList[objUser.Cargo] !== undefined){
        repostaUser += "Cargo :"+cargoList[objUser.Cargo].nome+"<br>";
    }else repostaUser += "Cargo :"+"Não encontrado"+"<br>";
    repostaUser += '</p>\n';
    res.send(repostaUser);
});


minhaApi.post('/usuarios',(req,res) => {
   // console.log(req.body);
   const maiorID = Math.max(...funcionarioList.map(({ id }) => id));
   
   const objUser = {id: maiorID+1,nome:req.body.nome ,idade:req.body.idade, CPF:req.body.cpf, Cargo:req.body.Cargo};

    funcionarioList.push(objUser);
    res.send('Usuario adicionado');
    return;
});


//Atualizar um usuário pelo ID na URL 
minhaApi.put('/usuarios/:idUsuario',(req,res) => {
    console.log(req.params.idUsuario);
    const idUsuario = req.params.idUsuario;
    const novoUser = {id: parseInt(idUsuario),nome:req.body.nome ,idade:req.body.idade, CPF:req.body.cpf,Cargo:req.body.Cargo};


    const objUser = funcionarioList.find(user => parseInt(user.id) === parseInt(idUsuario));

    console.log(objUser);
    console.log(novoUser);

    
    if (objUser && novoUser) {
        objUser.nome = novoUser.nome;
        objUser.idade = novoUser.idade;
        objUser.CPF = novoUser.CPF;
        objUser.Cargo = novoUser.Cargo;
    }
    res.send();
});


// Requisição para deletar um úsuario pelo seu ID na URL
minhaApi.delete('/usuarios/:idUsuario',(req,res) => {
    console.log(req.params.idUsuario);
    const idUsuario = req.params.idUsuario;

    const index = funcionarioList.findIndex(user => parseInt(user.id) === idUsuario);

    funcionarioList.splice(index, 1);
    
    res.send();
});

//========================================//
//                CARGO                   //
//========================================//

// Requisição para buscar a lista de cargos
minhaApi.get('/cargos', async (req,res) => {
    const cargos = await Cargo.findAll();
    res.send(cargos);
});


// Requisição para buscar um cargo pelo seu código
minhaApi.get('/cargos/:codCargo',(req, res) => {
    const codCargo = req.params.codCargo;

    const cargos = Cargo.findAll({
        where: {
            codigo: codCargo
        }
      });
    res.send(cargos);
});

// Requisição para criar um novo cargo
minhaApi.post('/cargos',(req,res) => {
    const descricao=req.body.descricao;
    Cargo.create({descricao:descricao}).then(()=>{
        res.send('Cargo cadastrado com sucesso');
    }).catch((erro)=>{
        res.send('Ocorreu erro: ',erro);
    });
    
    return;
});

//Atualizar um usuário pelo ID na URL 
minhaApi.put('/cargos/:codCargos',(req,res) => {
    const codCargos = req.params.codCargos;

                                                        // NOME E DESCRIÇÃO
    const novoCargo = {codigo: parseInt(codCargos),nome:req.body.nome ,descricao:req.body.descricao};


    const objCargo = cargoList.find(cargo => parseInt(cargo.codigo) === parseInt(codCargos));
    
    if (objCargo && novoCargo) {
        objCargo.nome = novoCargo.nome;
        objCargo.descricao = novoCargo.descricao;
    }
    res.send();
});


// Requisição para deletar um úsuario pelo seu ID na URL
minhaApi.delete('/cargos/:codCargo',(req,res) => {
    const codCargo = req.params.codCargo;

    const index = cargoList.findIndex(cargo => parseInt(cargo.codigo) === codCargo);
    cargoList.splice(index, 1);
    
    res.send();
});

minhaApi.listen(porta, () => {console.log('Minha Primeira API na porta:'+porta)});