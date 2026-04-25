const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/server');
const db = require('../../src/database/db');

describe('US05 - Meus Agendamentos (Isolamento de Dados)', () => {
    let tokenHarry, tokenHermione, tokenRon, tokenDumbledore;
    let harryId, hermioneId;
    let barbeiroId, servicoId;

    before((done) => {
        db.serialize(() => {
            // Limpeza do banco de TESTE
            db.run('DELETE FROM agendamentos');
            db.run('DELETE FROM usuarios');
            db.run('DELETE FROM barbeiros');
            db.run('DELETE FROM servicos');

            // Setup de Dados
            db.run('INSERT INTO barbeiros (nome, especialidade) VALUES (?, ?)', ['Severus Snape', 'Corte de Poções'], function() {
                barbeiroId = this.lastID;
            });
            db.run('INSERT INTO servicos (nome, preco) VALUES (?, ?)', ['Corte Bruxo', 50.0], function() {
                servicoId = this.lastID;
            });

            // Criar e Logar Harry (Cliente A)
            request(app).post('/autenticacao/registrar').send({ nome: 'Harry Potter', email: 'harry@hogwarts.com', senha: '123' }).end(() => {
                request(app).post('/autenticacao/login').send({ email: 'harry@hogwarts.com', senha: '123' }).end((err, res) => {
                    tokenHarry = res.body.token;
                    harryId = res.body.usuario.id;

                    // Criar e Logar Hermione (Cliente B)
                    request(app).post('/autenticacao/registrar').send({ nome: 'Hermione Granger', email: 'hermione@hogwarts.com', senha: '123' }).end(() => {
                        request(app).post('/autenticacao/login').send({ email: 'hermione@hogwarts.com', senha: '123' }).end((err, res) => {
                            tokenHermione = res.body.token;
                            hermioneId = res.body.usuario.id;

                            // Criar e Logar Ron (Cliente C - Sem Agendamentos)
                            request(app).post('/autenticacao/registrar').send({ nome: 'Ron Weasley', email: 'ron@hogwarts.com', senha: '123' }).end(() => {
                                request(app).post('/autenticacao/login').send({ email: 'ron@hogwarts.com', senha: '123' }).end((err, res) => {
                                    tokenRon = res.body.token;

                                    // Criar e Logar Dumbledore (Admin)
                                    request(app).post('/autenticacao/registrar').send({ 
                                        nome: 'Albus Dumbledore', 
                                        email: 'albus@hogwarts.com', 
                                        senha: '123', 
                                        cargo: 'admin',
                                        admin_key: 'batman123' 
                                    }).end(() => {
                                        request(app).post('/autenticacao/login').send({ email: 'albus@hogwarts.com', senha: '123' }).end((err, res) => {
                                            tokenDumbledore = res.body.token;

                                            // Criar Agendamentos
                                            // 1 para o Harry
                                            request(app).post('/agendamentos').set('Authorization', `Bearer ${tokenHarry}`).send({
                                                barbeiro_id: barbeiroId, servico_id: servicoId, data: '2026-12-01', hora: '10:00'
                                            }).end(() => {
                                                // 1 para a Hermione
                                                request(app).post('/agendamentos').set('Authorization', `Bearer ${tokenHermione}`).send({
                                                    barbeiro_id: barbeiroId, servico_id: servicoId, data: '2026-12-01', hora: '11:00'
                                                }).end(() => {
                                                    done();
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it('CT05.1 - Harry deve ver apenas o seu agendamento', async () => {
        const response = await request(app)
            .get('/agendamentos')
            .set('Authorization', `Bearer ${tokenHarry}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array').with.lengthOf(1);
        expect(response.body[0].usuario_id).to.equal(harryId);
    });

    it('CT05.3 - Ron não deve ver nenhum agendamento (Lista vazia)', async () => {
        const response = await request(app)
            .get('/agendamentos')
            .set('Authorization', `Bearer ${tokenRon}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array').with.lengthOf(0);
    });

    it('CT05.2 - Dumbledore (Admin) deve ver os agendamentos de todos (Harry e Hermione)', async () => {
        const response = await request(app)
            .get('/agendamentos')
            .set('Authorization', `Bearer ${tokenDumbledore}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array').with.lengthOf(2);
        
        const ids = response.body.map(a => a.usuario_id);
        expect(ids).to.include(harryId);
        expect(ids).to.include(hermioneId);
    });

    it('CT05.4 - Deve impedir o acesso se o Token não for enviado', async () => {
        const response = await request(app).get('/agendamentos');
        expect(response.status).to.equal(401);
    });

});
