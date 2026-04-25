const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/server');
const db = require('../../src/database/db');

describe('US04 - Criar Agendamento', () => {
    let token;
    let barbeiro_id;
    let servico_id;

    // Setup: Limpeza e criação de dados necessários para o agendamento
    before((done) => {
        db.serialize(() => {
            db.run('DELETE FROM agendamentos');
            db.run('DELETE FROM usuarios');
            db.run('DELETE FROM barbeiros');
            db.run('DELETE FROM servicos');

            // 1. Criar um barbeiro
            db.run('INSERT INTO barbeiros (nome, especialidade) VALUES (?, ?)', ['Barbeiro Teste', 'Corte'], function() {
                barbeiro_id = this.lastID;
                
                // 2. Criar um serviço
                db.run('INSERT INTO servicos (nome, preco) VALUES (?, ?)', ['Corte Simples', 35.0], function() {
                    servico_id = this.lastID;

                    // 3. Criar usuário e fazer login para obter o Token
                    request(app)
                        .post('/autenticacao/registrar')
                        .send({ nome: 'User Teste', email: 'teste.agendamento@test.com', senha: '123' })
                        .end(() => {
                            request(app)
                                .post('/autenticacao/login')
                                .send({ email: 'teste.agendamento@test.com', senha: '123' })
                                .end((err, res) => {
                                    token = res.body.token;
                                    done();
                                });
                        });
                });
            });
        });
    });

    it('CT04.1 - Deve criar um agendamento com sucesso', async () => {
        const agendamento = {
            barbeiro_id,
            servico_id,
            data: '2026-12-25',
            hora: '14:00'
        };

        const response = await request(app)
            .post('/agendamentos')
            .set('Authorization', `Bearer ${token}`)
            .send(agendamento);

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
        expect(response.body.status).to.equal('agendado');
    });

    it('CT04.2 - Não deve permitir agendamento em horário já ocupado (Conflito)', async () => {
        const agendamentoConflitante = {
            barbeiro_id,
            servico_id,
            data: '2026-12-25',
            hora: '14:00'
        };

        const response = await request(app)
            .post('/agendamentos')
            .set('Authorization', `Bearer ${token}`)
            .send(agendamentoConflitante);

        expect(response.status).to.equal(400);
        expect(response.body.erro).to.equal('O barbeiro já possui um agendamento neste horário');
    });

    it('CT04.3 - Não deve permitir agendamento em data retroativa', async () => {
        const agendamentoPassado = {
            barbeiro_id,
            servico_id,
            data: '2020-01-01',
            hora: '10:00'
        };

        const response = await request(app)
            .post('/agendamentos')
            .set('Authorization', `Bearer ${token}`)
            .send(agendamentoPassado);

        expect(response.status).to.equal(400);
        expect(response.body.erro).to.equal('Não é possível agendar no passado');
    });

    it('CT04.4 - Deve impedir agendamento sem autenticação (Token)', async () => {
        const agendamentoSemToken = {
            barbeiro_id,
            servico_id,
            data: '2026-12-25',
            hora: '16:00'
        };

        const response = await request(app)
            .post('/agendamentos')
            .send(agendamentoSemToken); 

        // Deve retornar 401 Unauthorized por causa do middleware
        expect(response.status).to.equal(401);
    });

});
