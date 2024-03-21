const Sequelize = require('sequelize');

const conexao=new Sequelize('nodejs', 'root', 'root', {
    host: 'localhost', // URL
    dialect: 'mysql'
});

conexao.authenticate()
    .then(()=>{
        console.log('Conectado com sucesso.');
    }).catch((erro)=>{
        console.log('Deu Erro: ', erro);
    });
    
const Cargo=conexao.define('cargos',{
    codigo:{
        type:    Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement:true
    },
    descricao:{
        type: Sequelize.STRING(128),
        allowNull:false
    }
});

Cargo.sync({
    alter:true,
});