import connection from '../../config/db.conf.js';

export default class VersionesPresupuesto {
    async showByEstado (idEstado) {
        try {
            const [results] = await connection.query(
                'SELECT * FROM `VersionesPresupuesto` WHERE `Estado` = ? ORDER BY Anio,Fecha',
                [idEstado])
            return results;
        } catch (err) {
            console.log(err);
        }
    };
}