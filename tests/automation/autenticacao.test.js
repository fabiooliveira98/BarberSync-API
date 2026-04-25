const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/server'); // Importa o app express
const db = require('../../src/database/db'); // Importa o banco para limpeza

describe('US01 - Cadastro de Usuário', () => {
    
    // Limpeza do banco antes dos testes de cadastro
    before((done) => {
        db.run('DELETE FROM usuarios', [], (err) => {
            done();
        });
    });

    it('CT01.1 - Deve cadastrar um cliente com sucesso', async () => {
        const novoUsuario = {
            nome: 'Cliente de Teste',
            email: 'teste@barbersync.com',
            senha: 'senha123'
        };

        const response = await request(app)
            .post('/autenticacao/registrar')
            .send(novoUsuario);

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
        expect(response.body.nome).to.equal(novoUsuario.nome);
        expect(response.body.email).to.equal(novoUsuario.email);
        expect(response.body.cargo).to.equal('cliente'); // Valida cargo padrão
    });

    it('CT01.2 - Não deve permitir cadastro com e-mail duplicado', async () => {
        const usuarioDuplicado = {
            nome: 'Outro Nome',
            email: 'teste@barbersync.com',
            senha: 'outrasenha'
        };

        const response = await request(app)
            .post('/autenticacao/registrar')
            .send(usuarioDuplicado);

        expect(response.status).to.equal(400);
        expect(response.body.erro).to.equal('E-mail já cadastrado');
    });

    it('CT01.3 - Não deve cadastrar usuário com campos ausentes (senha)', async () => {
        const usuarioIncompleto = {
            nome: 'Sem Senha',
            email: 'semsenha@test.com'
            // senha ausente
        };

        const response = await request(app)
            .post('/autenticacao/registrar')
            .send(usuarioIncompleto);

        expect(response.status).to.equal(400);
        expect(response.body.erro).to.equal('Campos obrigatórios ausentes');
    });

    it('CT01.4 - Deve salvar a senha de forma criptografada no banco', (done) => {
        const emailParaChecar = 'teste@barbersync.com';
        
        db.get('SELECT senha FROM usuarios WHERE email = ?', [emailParaChecar], (err, row) => {
            expect(err).to.be.null;
            expect(row.senha).to.not.equal('senha123'); // A senha não pode ser o texto plano
            expect(row.senha).to.have.lengthOf.at.least(20); // Hashes bcrypt são longos
            done();
        });
    });

});

describe('US02 - Login de Usuário', () => {

    it('CT02.1 - Deve realizar login com sucesso e retornar um token', async () => {
        const credenciais = {
            email: 'teste@barbersync.com',
            senha: 'senha123'
        };

        const response = await request(app)
            .post('/autenticacao/login')
            .send(credenciais);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');
        expect(response.body.usuario.nome).to.equal('Cliente de Teste');
    });

    it('CT02.2 - Não deve logar com senha incorreta', async () => {
        const credenciaisErradas = {
            email: 'teste@barbersync.com',
            senha: 'senha_errada'
        };

        const response = await request(app)
            .post('/autenticacao/login')
            .send(credenciaisErradas);

        expect(response.status).to.equal(401);
        expect(response.body.erro).to.equal('Credenciais inválidas');
    });

    it('CT02.3 - Não deve logar com e-mail não cadastrado', async () => {
        const usuarioInexistente = {
            email: 'naoexiste@test.com',
            senha: 'senha123'
        };

        const response = await request(app)
            .post('/autenticacao/login')
            .send(usuarioInexistente);

        expect(response.status).to.equal(401);
        expect(response.body.erro).to.equal('Credenciais inválidas');
    });

    it('CT02.4 - O token retornado deve ser um JWT válido', async () => {
        const credenciais = {
            email: 'teste@barbersync.com',
            senha: 'senha123'
        };

        const response = await request(app)
            .post('/autenticacao/login')
            .send(credenciais);

        const token = response.body.token;
        const partes = token.split('.');
        
        expect(partes).to.have.lengthOf(3); // Um JWT tem 3 partes: Header.Payload.Signature
    });

});
