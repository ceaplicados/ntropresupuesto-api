import connection from '../../config/db.conf.js';
import UnidadResponsable from '../models/UnidadResponsable.js';
import VersionPresupuesto from '../models/VersionPresupuesto.js';

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

    async getByClaveEstado (claveUnidadResponsable,idEstado) {
        let result=new UnidadResponsable();
        try {
            const [results] = await connection.query(
                'SELECT UnidadResponsable.*, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave) AS ClaveCompleta FROM UnidadResponsable '
                    +' JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal '
                    +' WHERE UnidadPresupuestal.Estado=?'
                    +' HAVING ClaveCompleta=?;',
                [idEstado,claveUnidadResponsable])
            
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

    async getByEstado (idEstado,q) {
        let result=[];
        try {
            let query='SELECT UnidadResponsable.*, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave) AS ClaveCompleta FROM UnidadResponsable '
                    +' JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal '
                    +' WHERE UnidadPresupuestal.Estado=?'
                    +' ORDER BY ClaveCompleta ';
            let params=[idEstado];
            if(q){
                query='SELECT UnidadResponsable.*, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave) AS ClaveCompleta FROM UnidadResponsable '
                    +' JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal '
                    +' WHERE UnidadPresupuestal.Estado=?'
                    +' HAVING ClaveCompleta LIKE ? OR Nombre LIKE ?'
                    +' ORDER BY ClaveCompleta ';
                params=[idEstado,'%'+q+'%',,'%'+q+'%'];
            }
            const [results] = await connection.query(query,params)
            
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
                query += ' ORDER BY ClaveCompleta '
            
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

    async showMontosByVersionesPresupuestoClaveUR (idsVersiones,ClaveUnidadResponsable) {
        let result=[];
        try {
            let query = 'SELECT VersionesPresupuesto.*, SUM(Monto) AS Monto FROM VersionesPresupuesto  '
                    +'JOIN ObjetoDeGasto ON VersionPresupuesto = VersionesPresupuesto.Id '
                    +'JOIN ( '
                    +'	SELECT UnidadResponsable.Id, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave) AS ClaveCompleta '
                    +'	FROM UnidadResponsable '
                    +'	JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal '
                    +'	HAVING ClaveCompleta = ? '
                    +') AS UnidadResponsable ON UnidadResponsable.Id=ObjetoDeGasto.UnidadResponsable '
                    +'WHERE VersionesPresupuesto.Id IN ('+idsVersiones.join(',')+') '
                    +'GROUP BY VersionesPresupuesto.Id '
                    +'ORDER BY VersionesPresupuesto.Anio ASC, VersionesPresupuesto.Fecha ASC ';
            let params = [ClaveUnidadResponsable];

            const [results] = await connection.query(query,params)
            result=results.map((row) => {
                let versionPresupuesto = new VersionPresupuesto();
                versionPresupuesto.Id  = row.Id;
                versionPresupuesto.Estado = row.Estado;
                versionPresupuesto.Anio = row.Anio;
                versionPresupuesto.Tipo = row.Nombre;
                versionPresupuesto.Descripcion = row.Descripcion;
                versionPresupuesto.Fecha = row.Fecha;
                versionPresupuesto.Actual = true;
                if(row.Actual==0){
                    versionPresupuesto.Actual = false;
                }
                delete versionPresupuesto.ObjetoGasto;
                delete versionPresupuesto.ProgramaPresupuestal;
                versionPresupuesto.Monto = row.Monto;
                return versionPresupuesto;
            });
            return result;
        } catch (err) {
            console.log(err);
        }
    };

    async showMontosByVersionesPresupuestoClaveURCapituloGasto (idsVersiones,ClaveUnidadResponsable,claveCapituloGasto) {
        let result=[];
        try {
            let query = 'SELECT VersionesPresupuesto.*, SUM(Monto) AS Monto FROM VersionesPresupuesto  '
                    +'JOIN ObjetoDeGasto ON VersionPresupuesto = VersionesPresupuesto.Id '
                    +'JOIN ( '
                    +'	SELECT UnidadResponsable.Id, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave) AS ClaveCompleta '
                    +'	FROM UnidadResponsable '
                    +'	JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal '
                    +'	HAVING ClaveCompleta = ? '
                    +') AS UnidadResponsable ON UnidadResponsable.Id=ObjetoDeGasto.UnidadResponsable '
                    +'JOIN PartidasGenericas ON PartidasGenericas.Id=ObjetoDeGasto.PartidaGenerica  '
                    +'JOIN ConceptosGenerales ON ConceptosGenerales.Id=PartidasGenericas.ConceptoGeneral  '
                    +'JOIN CapitulosGasto ON CapitulosGasto.Id=ConceptosGenerales.CapituloGasto  '
                    +'WHERE VersionesPresupuesto.Id IN ('+idsVersiones.join(',')+') '
                    +'AND CapitulosGasto.Clave=? '
                    +'GROUP BY VersionesPresupuesto.Id ';
            let params = [ClaveUnidadResponsable,claveCapituloGasto];

            const [results] = await connection.query(query,params)
            result=results.map((row) => {
                let versionPresupuesto = new VersionPresupuesto();
                versionPresupuesto.Id  = row.Id;
                versionPresupuesto.Estado = row.Estado;
                versionPresupuesto.Anio = row.Anio;
                versionPresupuesto.Tipo = row.Nombre;
                versionPresupuesto.Descripcion = row.Descripcion;
                versionPresupuesto.Fecha = row.Fecha;
                versionPresupuesto.Actual = true;
                if(row.Actual==0){
                    versionPresupuesto.Actual = false;
                }
                delete versionPresupuesto.ObjetoGasto;
                delete versionPresupuesto.ProgramaPresupuestal;
                versionPresupuesto.Monto = row.Monto;
                return versionPresupuesto;
            });
            return result;
        } catch (err) {
            console.log(err);
        }
    };

    async showMontosByVersionesPresupuestoClaveURConceptoGeneral (idsVersiones,ClaveUnidadResponsable,claveConceptoGeneral) {
        let result=[];
        try {
            let query = 'SELECT VersionesPresupuesto.*, SUM(Monto) AS Monto FROM VersionesPresupuesto  '
                    +'JOIN ObjetoDeGasto ON VersionPresupuesto = VersionesPresupuesto.Id '
                    +'JOIN ( '
                    +'	SELECT UnidadResponsable.Id, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave) AS ClaveCompleta '
                    +'	FROM UnidadResponsable '
                    +'	JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal '
                    +'	HAVING ClaveCompleta = ? '
                    +') AS UnidadResponsable ON UnidadResponsable.Id=ObjetoDeGasto.UnidadResponsable '
                    +'JOIN PartidasGenericas ON PartidasGenericas.Id=ObjetoDeGasto.PartidaGenerica  '
                    +'JOIN ConceptosGenerales ON ConceptosGenerales.Id=PartidasGenericas.ConceptoGeneral  '
                    +'WHERE VersionesPresupuesto.Id IN ('+idsVersiones.join(',')+') '
                    +'AND ConceptosGenerales.Clave=? '
                    +'GROUP BY VersionesPresupuesto.Id ';
            let params = [ClaveUnidadResponsable,claveConceptoGeneral];

            const [results] = await connection.query(query,params)
            result=results.map((row) => {
                let versionPresupuesto = new VersionPresupuesto();
                versionPresupuesto.Id  = row.Id;
                versionPresupuesto.Estado = row.Estado;
                versionPresupuesto.Anio = row.Anio;
                versionPresupuesto.Tipo = row.Nombre;
                versionPresupuesto.Descripcion = row.Descripcion;
                versionPresupuesto.Fecha = row.Fecha;
                versionPresupuesto.Actual = true;
                if(row.Actual==0){
                    versionPresupuesto.Actual = false;
                }
                delete versionPresupuesto.ObjetoGasto;
                delete versionPresupuesto.ProgramaPresupuestal;
                versionPresupuesto.Monto = row.Monto;
                return versionPresupuesto;
            });
            return result;
        } catch (err) {
            console.log(err);
        }
    };

    async showMontosByVersionesPresupuestoClaveURPartidaGenerica (idsVersiones,ClaveUnidadResponsable,clavePartidaGenerica) {
        let result=[];
        try {
            let query = 'SELECT VersionesPresupuesto.*, SUM(Monto) AS Monto FROM VersionesPresupuesto  '
                    +'JOIN ObjetoDeGasto ON VersionPresupuesto = VersionesPresupuesto.Id '
                    +'JOIN ( '
                    +'	SELECT UnidadResponsable.Id, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave) AS ClaveCompleta '
                    +'	FROM UnidadResponsable '
                    +'	JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal '
                    +'	HAVING ClaveCompleta = ? '
                    +') AS UnidadResponsable ON UnidadResponsable.Id=ObjetoDeGasto.UnidadResponsable '
                    +'JOIN PartidasGenericas ON PartidasGenericas.Id=ObjetoDeGasto.PartidaGenerica  '
                    +'WHERE VersionesPresupuesto.Id IN ('+idsVersiones.join(',')+') '
                    +'AND PartidasGenericas.Clave=? '
                    +'GROUP BY VersionesPresupuesto.Id ';
            let params = [ClaveUnidadResponsable,clavePartidaGenerica];

            const [results] = await connection.query(query,params)
            result=results.map((row) => {
                let versionPresupuesto = new VersionPresupuesto();
                versionPresupuesto.Id  = row.Id;
                versionPresupuesto.Estado = row.Estado;
                versionPresupuesto.Anio = row.Anio;
                versionPresupuesto.Tipo = row.Nombre;
                versionPresupuesto.Descripcion = row.Descripcion;
                versionPresupuesto.Fecha = row.Fecha;
                versionPresupuesto.Actual = true;
                if(row.Actual==0){
                    versionPresupuesto.Actual = false;
                }
                delete versionPresupuesto.ObjetoGasto;
                delete versionPresupuesto.ProgramaPresupuestal;
                versionPresupuesto.Monto = row.Monto;
                return versionPresupuesto;
            });
            return result;
        } catch (err) {
            console.log(err);
        }
    };

    async showMontosByVersionesPresupuestoClaveURObjetoGasto (idsVersiones,ClaveUnidadResponsable,claveObjetoGasto) {
        let result=[];
        try {
            let query = 'SELECT VersionesPresupuesto.*, SUM(Monto) AS Monto FROM VersionesPresupuesto  '
                    +'JOIN ObjetoDeGasto ON VersionPresupuesto = VersionesPresupuesto.Id '
                    +'JOIN ( '
                    +'	SELECT UnidadResponsable.Id, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave) AS ClaveCompleta '
                    +'	FROM UnidadResponsable '
                    +'	JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal '
                    +'	HAVING ClaveCompleta = ? '
                    +') AS UnidadResponsable ON UnidadResponsable.Id=ObjetoDeGasto.UnidadResponsable '
                    +'WHERE VersionesPresupuesto.Id IN ('+idsVersiones.join(',')+') '
                    +'AND ObjetoDeGasto.Clave=? '
                    +'GROUP BY VersionesPresupuesto.Id ';
            let params = [ClaveUnidadResponsable,claveObjetoGasto];

            const [results] = await connection.query(query,params)
            result=results.map((row) => {
                let versionPresupuesto = new VersionPresupuesto();
                versionPresupuesto.Id  = row.Id;
                versionPresupuesto.Estado = row.Estado;
                versionPresupuesto.Anio = row.Anio;
                versionPresupuesto.Tipo = row.Nombre;
                versionPresupuesto.Descripcion = row.Descripcion;
                versionPresupuesto.Fecha = row.Fecha;
                versionPresupuesto.Actual = true;
                if(row.Actual==0){
                    versionPresupuesto.Actual = false;
                }
                delete versionPresupuesto.ObjetoGasto;
                delete versionPresupuesto.ProgramaPresupuestal;
                versionPresupuesto.Monto = row.Monto;
                return versionPresupuesto;
            });
            return result;
        } catch (err) {
            console.log(err);
        }
    };
}