import connection from '../../config/db.conf.js';
import UnidadPresupuestal from '../models/UnidadPresupuestal.js';

export default class UnidadesPresupuestales {
    async getByEstado (idEstado) {
        let result=[];
        try {
            const [results] = await connection.query(
                'SELECT * FROM UnidadPresupuestal '
                    +' WHERE UnidadPresupuestal.Estado=?'
                    +' ORDER BY Clave ',
                [idEstado])
            
                result=results.map((row) => {
                let unidadPresupuestal=new UnidadPresupuestal();
                unidadPresupuestal.Id=row.Id;
                unidadPresupuestal.Clave=row.Clave;
                unidadPresupuestal.Nombre=row.Nombre;
                unidadPresupuestal.Estado=row.Estado;
                delete unidadPresupuestal.Monto;
                delete unidadPresupuestal.UnidadesResponsables;
                return unidadPresupuestal;
            });
            return result;
        }catch (err) {
            console.log(err);
        }
    };
}