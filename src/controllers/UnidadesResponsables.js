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

    async showMontosByVersionPresupuesto (idVersion) {
        let result=[];
        try {
            const [results] = await connection.query(
                'SELECT UnidadResponsable.*,CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave) AS ClaveCompleta, SUM(Monto) AS Monto FROM ObjetoDeGasto '
                    +' JOIN UnidadResponsable ON UnidadResponsable.Id=ObjetoDeGasto.UnidadResponsable'
                    +' JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal'
                    +' WHERE ObjetoDeGasto.VersionPresupuesto=?'
                    +' GROUP BY ObjetoDeGasto.UnidadResponsable ',
                [idVersion])
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