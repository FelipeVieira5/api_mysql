const Sequelize = require('sequelize');

const conexao = new Sequelize('nodejs', 'root', 'root', {
    host: 'localhost', // URL
    dialect: 'mysql'
});

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