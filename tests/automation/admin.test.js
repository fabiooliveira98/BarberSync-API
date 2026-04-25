const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/server');
const db = require('../../src/database/db');

describe('US07 e US08 - Funcionalidades de Administrador', () => {
    let tokenAdmin, tokenCliente;
    const adminKey = 'batman123';

    before((done) => {
        db.serialize(() => {
            // Limpeza do banco de TESTE
            db.run('DELETE FROM agendamentos');
            db.run('DELETE FROM usuarios');
            db.run('DELETE FROM barbeiros');
            db.run('DELETE FROM servicos');

            // 1. Criar e Logar um Cliente (Neville)
            request(app).post('/autenticacao/registrar').send({ 
                nome: 'Neville Longbottom', email: 'neville@hogwarts.com', senha: '123' 
            }).end(() => {
                request(app).post('/autenticacao/login').send({ 
                    email: 'neville@hogwarts.com', senha: '123' 
                }).end((err, res) => {
                    tokenCliente = res.body.token;

                    // 2. Criar e Logar um Admin (Minerva)
                    request(app).post('/autenticacao/registrar').send({ 
                        nome: 'Minerva McGonagall', 
                        email: 'minerva@hogwarts.com', 
                        senha: '123', 
                        cargo: 'admin',
                        admin_key: adminKey 
                    }).end(() => {
                        request(app).post('/autenticacao/login').send({ 
                            email: 'minerva@hogwarts.com', senha: '123' 
                        }).end((err, res) => {
                            tokenAdmin = res.body.token;
                            done();
                        });
                    });
                });
            });
        });
    });

    it('CT07.1 - Admin deve conseguir cadastrar um novo barbeiro', async () => {
        const novoBarbeiro = { nome: 'Rubeus Hagrid', especialidade: 'Corte de Barbas Gigantes' };
        
        const response = await request(app)
            .post('/barbeiros')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(novoBarbeiro);

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
        expect(response.body.nome).to.equal('Rubeus Hagrid');
    });

    it('CT07.2 - Cliente NÃO deve conseguir cadastrar barbeiros', async () => {
        const response = await request(app)
            .post('/barbeiros')
            .set('Authorization', `Bearer ${tokenCliente}`)
            .send({ nome: 'Tentativa Hacker', especialidade: 'Invasão' });

        expect(response.status).to.equal(403);
    });

    it('CT08.2 - Não deve registrar admin com chave incorreta', async () => {
        const response = await request(app)
            .post('/autenticacao/registrar')
            .send({ 
                nome: 'Draco Malfoy', 
                email: 'draco@hogwarts.com', 
                senha: '123', 
                cargo: 'admin',
                admin_key: 'chave_errada' 
            });

        expect(response.status).to.equal(403);
        expect(response.body.erro).to.equal('Chave de registro admin inválida ou ausente');
    });

    it('CT08.3 - Não deve registrar admin sem enviar a chave', async () => {
        const response = await request(app)
            .post('/autenticacao/registrar')
            .send({ 
                nome: 'Voldemort', 
                email: 'voldy@hogwarts.com', 
                senha: '123', 
                cargo: 'admin'
                // sem admin_key
            });

        expect(response.status).to.equal(403);
    });

});
