const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/server');
const db = require('../../src/database/db');

describe('US03 - Visualizar Barbeiros', () => {

    // Limpa a tabela antes de começar os testes desta suíte
    before((done) => {
        db.run('DELETE FROM barbeiros', [], (err) => {
            done();
        });
    });

    it('CT03.2 - Deve retornar lista vazia quando não há barbeiros cadastrados', async () => {
        const response = await request(app).get('/barbeiros');
        
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array').with.lengthOf(0);
    });

    it('CT03.1 e CT03.3 - Deve listar barbeiros com nome e especialidade', (done) => {
        // Inserindo barbeiros de teste manualmente para validar a listagem
        const query = 'INSERT INTO barbeiros (nome, especialidade) VALUES (?, ?), (?, ?)';
        const params = ['Barbeiro João', 'Corte Clássico', 'Barbeiro José', 'Barba e Toalha Quente'];

        db.run(query, params, async function(err) {
            if (err) return done(err);

            const response = await request(app).get('/barbeiros');

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array').with.lengthOf(2);
            
            // Valida a estrutura (CT03.3)
            expect(response.body[0]).to.have.property('id');
            expect(response.body[0]).to.have.property('nome', 'Barbeiro João');
            expect(response.body[0]).to.have.property('especialidade', 'Corte Clássico');
            
            done();
        });
    });

});
