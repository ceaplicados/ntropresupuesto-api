import connection from '../../config/db.conf.js';
import UnidadResponsable from '../models/UnidadResponsable.js';

export default class UnidadesResponsables {
    async getByEstado (idEstado) {
        let result=[];
        try {
            const [results] = await connection.query(
                'SELECT UnidadResponsable.*, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave) AS ClaveCompleta FROM UnidadResponsable '
                    +' JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal '
                    +' WHERE UnidadPresupuestal.Estado=?'
                    +' ORDER BY ClaveCompleta ',
                [idEstado])
            
                result=results.map((row) => {
                let unidadResponsable=new UnidadResponsable();
                unidadResponsable.Id=row.Id;
                unidadResponsable.Clave=row.ClaveCompleta;
                unidadResponsable.Nombre=row.Nombre;
                unidadResponsable.UnidadPresupuestal=row.UnidadPresupuestal;
                unidadResponsable.OtrosNombres=row.OtrosNombres;
                delete unidadResponsable.Monto;
                return unidadResponsable;
            });
            return result;
        }catch (err) {
            console.log(err);
        }
    };

    async showMontosByVersionPresupuesto (idVersion,idUnidadResponsable) {
        let result=[];
        try {
            let query = 'SELECT UnidadResponsable.*,CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave) AS ClaveCompleta, SUM(Monto) AS Monto FROM ObjetoDeGasto '
                query +=' JOIN UnidadResponsable ON UnidadResponsable.Id=ObjetoDeGasto.UnidadResponsable'
                query +=' JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal'
                query +=' WHERE ObjetoDeGasto.VersionPresupuesto= ? '
            let params = [idVersion];

            if (idUnidadResponsable) {
                query += ' AND ObjetoDeGasto.UnidadResponsable=?';
                params.push(idUnidadResponsable);
            }
            
            query += ' GROUP BY UnidadResponsable.Id ';
            
            const [results] = await connection.query(query,params)
            result=results.map((row) => {
                let unidadResponsable=new UnidadResponsable();
                unidadResponsable.Id=row.Id;
                unidadResponsable.Clave=row.ClaveCompleta;
                unidadResponsable.Nombre=row.Nombre;
                unidadResponsable.UnidadPresupuestal=row.UnidadPresupuestal;
                unidadResponsable.OtrosNombres=row.OtrosNombres;
                unidadResponsable.Monto=row.Monto;
                return unidadResponsable;
            });
            return result;
        } catch (err) {
            console.log(err);
        }
    };
}