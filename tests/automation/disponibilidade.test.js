const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/server');
const db = require('../../src/database/db');

describe('US06 - Consulta de Disponibilidade', () => {
    let barbeiroId, servicoId, token;

    before((done) => {
        db.serialize(() => {
            db.run('DELETE FROM agendamentos');
            db.run('DELETE FROM usuarios');
            db.run('DELETE FROM barbeiros');
            db.run('DELETE FROM servicos');

            // Criar um Barbeiro
            db.run('INSERT INTO barbeiros (nome, especialidade) VALUES (?, ?)', ['Barbeiro Disponível', 'Corte'], function() {
                barbeiroId = this.lastID;

                // Criar um Serviço
                db.run('INSERT INTO servicos (nome, preco) VALUES (?, ?)', ['Corte', 30.0], function() {
                    servicoId = this.lastID;

                    // Criar e Logar Usuário
                    request(app).post('/autenticacao/registrar').send({ nome: 'QA Tester', email: 'qa@test.com', senha: '123' }).end(() => {
                        request(app).post('/autenticacao/login').send({ email: 'qa@test.com', senha: '123' }).end((err, res) => {
                            token = res.body.token;
                            done();
                        });
                    });
                });
            });
        });
    });

    it('CT06.1 - Deve listar todos os horários livres em um dia sem agendamentos', async () => {
        const response = await request(app)
            .get(`/barbeiros/${barbeiroId}/disponibilidade`)
            .query({ data: '2026-12-10' });

        expect(response.status).to.equal(200);
        expect(response.body.horarios_disponiveis).to.have.lengthOf(9); // 09:00 às 17:00
    });

    it('CT06.2 - Deve remover o horário da lista após um agendamento ser realizado', async () => {
        // Primeiro, agendamos às 10:00
        await request(app)
            .post('/agendamentos')
            .set('Authorization', `Bearer ${token}`)
            .send({
                barbeiro_id: barbeiroId,
                servico_id: servicoId,
                data: '2026-12-10',
                hora: '10:00'
            });

        // Agora consultamos a disponibilidade
        const response = await request(app)
            .get(`/barbeiros/${barbeiroId}/disponibilidade`)
            .query({ data: '2026-12-10' });

        expect(response.status).to.equal(200);
        expect(response.body.horarios_disponiveis).to.not.include('10:00');
        expect(response.body.horarios_disponiveis).to.have.lengthOf(8);
    });

    it('CT06.3 - Agendamentos em outras datas não devem afetar a consulta de hoje', async () => {
        // Agendamos para o dia seguinte
        await request(app)
            .post('/agendamentos')
            .set('Authorization', `Bearer ${token}`)
            .send({
                barbeiro_id: barbeiroId,
                servico_id: servicoId,
                data: '2026-12-11',
                hora: '14:00'
            });

        // Consultamos o dia 10 novamente
        const response = await request(app)
            .get(`/barbeiros/${barbeiroId}/disponibilidade`)
            .query({ data: '2026-12-10' });

        // O horário 14:00 deve continuar disponível no dia 10
        expect(response.body.horarios_disponiveis).to.include('14:00');
    });

    it('CT06.4 -Deve retornar 404 ao consultar barbeiro inexistente', async () => {
        const response = await request(app)
            .get('/barbeiros/9999/disponibilidade')
            .query({ data: '2026-12-10' });

        
        expect(response.status).to.equal(404);
    });

});
