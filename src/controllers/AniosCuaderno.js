import pool from '../../config/db.conf.js';
import AnioCuaderno from '../models/AnioCuaderno.js';

export default class AniosCuaderno {
    async getByCuaderno (cuaderno) {
        try {
            let anios = [];
            const connection = await pool.getConnection();
            const [results] = await connection.query(
                'SELECT * FROM `CuadernoAnios` WHERE `Cuaderno`=?', [cuaderno.Id]
            );
            pool.releaseConnection(connection);
            
            anios = results.map((row) => {
                let anio = new AnioCuaderno();
                anio.Id = row.Id;
                anio.Anio = row.Anio;
                if(row.Data){
                    anio.Data = JSON.parse(row.Data);
                }
                return anio;
            });
            cuaderno.Anios = anios;
            return cuaderno;
        } catch (err) {
            console.log(err);
        }
    }
}