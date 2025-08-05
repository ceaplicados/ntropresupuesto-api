    import request from 'supertest';
    import app  from '../app.js';
    
    describe('GET /JAL', () => {
      it('should return a list of versions', async () => {
        const res = await request(app).get('/JAL');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
      });

      it('should return 404 for a non-existent endpoint', async () => {
        const res = await request(app).get('/non-existent');
        expect(res.statusCode).toEqual(404);
      });
    });