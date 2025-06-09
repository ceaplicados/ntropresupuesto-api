import pool from '../../config/db.conf.js';
import RenglonCuaderno from '../models/RenglonCuaderno.js';

export default class RenglonesCuaderno {
    async getByCuaderno (cuaderno) {
        try {
            let renglones = [];

            const connection = await pool.getConnection();
            const [results] = await connection.query(
                'SELECT * FROM `RenglonCuaderno` WHERE `Cuaderno`=?', [cuaderno.Id]
            );
            pool.releaseConnection(connection);
            
            renglones = results.map((row) => {
                let renglon = new RenglonCuaderno();
                renglon.Id = row.Id;
                renglon.Tipo = row.Tipo;
                renglon.Estado = row.Estado;
                renglon.IdReferencia = row.IdReferencia;
                renglon.TipoFiltro = row.TipoFiltro;
                renglon.IdFiltro = row.IdFiltro;
                renglon.Graph = row.Graph;
                renglon.Mostrar = row.Mostrar;
                if(row.Data){
                    renglon.Data = JSON.parse(row.Data);
                }
                return renglon;
            });
            cuaderno.Renglones = renglones;
            return cuaderno;
        } catch (err) {
            console.log(err);
        }
    }
}