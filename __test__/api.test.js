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

    describe('GET /INPC', () => {
      it('should ask clients to always revalidate and send an ETag', async () => {
        const res = await request(app).get('/INPC');
        expect(res.statusCode).toEqual(200);
        expect(res.headers['cache-control']).toEqual('no-cache');
        expect(res.headers['etag']).toBeDefined();
        expect(res.body).toBeInstanceOf(Array);
      });

      it('should answer 304 when the INPC has not changed', async () => {
        const first = await request(app).get('/INPC');
        const res = await request(app).get('/INPC').set('If-None-Match', first.headers['etag']);
        expect(res.statusCode).toEqual(304);
      });
    });
