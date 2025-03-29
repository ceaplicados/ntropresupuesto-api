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

    async showMontosByVersionPresupuesto (idVersion,idUnidadPresupuestal) {
        let result=[];
        try {
            let query = "SELECT `UnidadPresupuestal`.*, SUM(`Monto`) AS Monto FROM `UnidadPresupuestal` "
            query+=" JOIN `UnidadResponsable` ON `UnidadPresupuestal`.`Id`=`UnidadResponsable`.`UnidadPresupuestal`"
            query+=" JOIN `ObjetoDeGasto` ON `UnidadResponsable`.`Id` =  `ObjetoDeGasto`.`UnidadResponsable` "
            query+=" WHERE `VersionPresupuesto`= ?";
            
            let params=[idVersion];
            
            if(idUnidadPresupuestal){
                query+=" AND UnidadPresupuestal.Id=? "
                params.push(idUnidadPresupuestal);
            }
            query+=" GROUP BY `UnidadPresupuestal`.`Id`;";
            
            const [results] = await connection.query(query,params)
            
                result=results.map((row) => {
                let unidadPresupuestal=new UnidadPresupuestal();
                unidadPresupuestal.Id=row.Id;
                unidadPresupuestal.Clave=row.Clave;
                unidadPresupuestal.Nombre=row.Nombre;
                unidadPresupuestal.Estado=row.Estado;
                unidadPresupuestal.Monto=row.Monto;
                unidadPresupuestal.UnidadesResponsables=row.UnidadesResponsables;
                return unidadPresupuestal;
            });
            
        }catch (err) {
            console.log(err);
        }
        return result;
    }
}