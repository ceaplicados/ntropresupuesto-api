import connection from '../../config/db.conf.js';
import UnidadResponsable from '../models/UnidadResponsable.js';

export default class UnidadesResponsables {
    async getById (idUnidadResponsable) {
        let result=new UnidadResponsable();
        try {
            const [results] = await connection.query(
                'SELECT UnidadResponsable.*, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave) AS ClaveCompleta FROM UnidadResponsable '
                    +' JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal '
                    +' WHERE UnidadResponsable.Id=?;',
                [idUnidadResponsable])
            
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
            if(result.length>0){
                result=result[0];
            }
        }catch (err) {
            console.log(err);
        }
        return result;
    };

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

    async showMontosByVersionPresupuestoClaveUR (idVersion,ClaveUnidadResponsable) {
        let result=[];
        try {
            let query = 'SELECT UnidadResponsable.*,CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave) AS ClaveCompleta, SUM(Monto) AS Monto FROM ObjetoDeGasto '
                query +=' JOIN UnidadResponsable ON UnidadResponsable.Id=ObjetoDeGasto.UnidadResponsable'
                query +=' JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal'
                query +=' WHERE ObjetoDeGasto.VersionPresupuesto= ? '
                query += ' GROUP BY UnidadResponsable.Id ';
                query += ' HAVING ClaveCompleta = ?';
            let params = [idVersion,ClaveUnidadResponsable];

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

    async showMontosByVersionPresupuestoClaveURCapituloGasto (idVersion,ClaveUnidadResponsable,claveCapituloGasto) {
        let result=[];
        try {
            let query = 'SELECT UnidadResponsable.*,CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave) AS ClaveCompleta, SUM(Monto) AS Monto FROM ObjetoDeGasto '
                query +=' JOIN UnidadResponsable ON UnidadResponsable.Id=ObjetoDeGasto.UnidadResponsable'
                query +=' JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal'
                query +=' JOIN PartidasGenericas ON PartidasGenericas.Id=ObjetoDeGasto.PartidaGenerica'
                query +=' JOIN ConceptosGenerales ON ConceptosGenerales.Id=PartidasGenericas.ConceptoGeneral'
                query +=' JOIN CapitulosGasto ON CapitulosGasto.Id=ConceptosGenerales.CapituloGasto'
                query +=' WHERE ObjetoDeGasto.VersionPresupuesto= ? AND CapitulosGasto.Clave= ?'
                query += ' GROUP BY UnidadResponsable.Id ';
                query += ' HAVING ClaveCompleta = ?';
            let params = [idVersion,claveCapituloGasto,ClaveUnidadResponsable];

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

    async showMontosByVersionPresupuestoClaveURConceptoGeneral (idVersion,ClaveUnidadResponsable,claveConceptoGeneral) {
        let result=[];
        try {
            let query = 'SELECT UnidadResponsable.*,CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave) AS ClaveCompleta, SUM(Monto) AS Monto FROM ObjetoDeGasto '
                query +=' JOIN UnidadResponsable ON UnidadResponsable.Id=ObjetoDeGasto.UnidadResponsable'
                query +=' JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal'
                query +=' JOIN PartidasGenericas ON PartidasGenericas.Id=ObjetoDeGasto.PartidaGenerica'
                query +=' JOIN ConceptosGenerales ON ConceptosGenerales.Id=PartidasGenericas.ConceptoGeneral'
                query +=' WHERE ObjetoDeGasto.VersionPresupuesto= ? AND ConceptosGenerales.Clave= ?'
                query += ' GROUP BY UnidadResponsable.Id ';
                query += ' HAVING ClaveCompleta = ?';
            let params = [idVersion,claveConceptoGeneral,ClaveUnidadResponsable];

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

    async showMontosByVersionPresupuestoClaveURPartidaGenerica (idVersion,ClaveUnidadResponsable,clavePartidaGenerica) {
        let result=[];
        try {
            let query = 'SELECT UnidadResponsable.*,CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave) AS ClaveCompleta, SUM(Monto) AS Monto FROM ObjetoDeGasto '
                query +=' JOIN UnidadResponsable ON UnidadResponsable.Id=ObjetoDeGasto.UnidadResponsable'
                query +=' JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal'
                query +=' JOIN PartidasGenericas ON PartidasGenericas.Id=ObjetoDeGasto.PartidaGenerica'
                query +=' WHERE ObjetoDeGasto.VersionPresupuesto= ? AND PartidasGenericas.Clave= ?'
                query += ' GROUP BY UnidadResponsable.Id ';
                query += ' HAVING ClaveCompleta = ?';
            let params = [idVersion,clavePartidaGenerica,ClaveUnidadResponsable];

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

    async showMontosByVersionPresupuestoClaveURObjetoGasto (idVersion,ClaveUnidadResponsable,claveObjetoGasto) {
        let result=[];
        try {
            let query = 'SELECT UnidadResponsable.*,CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave) AS ClaveCompleta, SUM(Monto) AS Monto FROM ObjetoDeGasto '
                query +=' JOIN UnidadResponsable ON UnidadResponsable.Id=ObjetoDeGasto.UnidadResponsable'
                query +=' JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal'
                query +=' WHERE ObjetoDeGasto.VersionPresupuesto= ? AND ObjetoDeGasto.Clave= ?'
                query += ' GROUP BY UnidadResponsable.Id ';
                query += ' HAVING ClaveCompleta = ?';
            let params = [idVersion,claveObjetoGasto,ClaveUnidadResponsable];

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