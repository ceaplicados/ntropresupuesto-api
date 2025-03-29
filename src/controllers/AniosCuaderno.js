import connection from '../../config/db.conf.js';
import AnioCuaderno from '../models/AnioCuaderno.js';

export default class AniosCuaderno {
    async getByCuaderno (cuaderno) {
        try {
            let anios = [];
            const [results] = await connection.query(
                'SELECT * FROM `CuadernoAnios` WHERE `Cuaderno`=?', [cuaderno.Id]
            );
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