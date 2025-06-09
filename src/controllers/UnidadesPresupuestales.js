import pool from '../../config/db.conf.js';
import UnidadPresupuestal from '../models/UnidadPresupuestal.js';
import VersionPresupuesto from '../models/VersionPresupuesto.js';

export default class UnidadesPresupuestales {
    async getById (idUnidadPresupuestal) {
        let result=new UnidadPresupuestal();
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(
                'SELECT * FROM UnidadPresupuestal '
                    +' WHERE UnidadPresupuestal.Id=?;',
                [idUnidadPresupuestal]);
            pool.releaseConnection(connection);
            
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
            if(results.length>0){
                result=results[0];
            }
        }catch (err) {
            console.log(err);
        }
        return result;
    };

    async getByClaveEstado (claveUnidadPresupuestal,idEstado) {
        let result=new UnidadPresupuestal();
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(
                'SELECT * FROM UnidadPresupuestal '
                    +' WHERE  Clave = ? AND Estado=?;',
                [claveUnidadPresupuestal,idEstado]);
            pool.releaseConnection(connection);
            
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
            if(results.length>0){
                result=results[0];
            }
        }catch (err) {
            console.log(err);
        }
        return result;
    };
    
    async getByEstado (idEstado) {
        let result=[];
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(
                'SELECT * FROM UnidadPresupuestal '
                    +' WHERE UnidadPresupuestal.Estado=?'
                    +' ORDER BY Clave ',
                [idEstado]);
            pool.releaseConnection(connection);
            
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
            const connection = await pool.getConnection();
            const [results] = await connection.query(query,params);
            pool.releaseConnection(connection);
            
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

    async showMontosByVersionPresupuestoClaveUP (idsVersiones,claveUnidadPresupuestal) {
        let result=[];
        try {
            let query = "SELECT `VersionesPresupuesto`.*, SUM(`Monto`) AS Monto FROM `ObjetoDeGasto` "
            query+=" JOIN `VersionesPresupuesto` ON `VersionesPresupuesto`.`Id` =  `ObjetoDeGasto`.`VersionPresupuesto` "
            query+=" JOIN `UnidadResponsable` ON `UnidadResponsable`.`Id` =  `ObjetoDeGasto`.`UnidadResponsable` "
            query+=" JOIN `UnidadPresupuestal` ON `UnidadPresupuestal`.`Id`=`UnidadResponsable`.`UnidadPresupuestal`"
            query+=" WHERE `VersionPresupuesto`IN ("+idsVersiones.join(',')+")";
            query+=" AND UnidadPresupuestal.Clave=? "
            query+=" GROUP BY `VersionesPresupuesto`.`Id`;";
            
            let params=[claveUnidadPresupuestal];
            
            const connection = await pool.getConnection();
            const [results] = await connection.query(query,params);
            pool.releaseConnection(connection);
            
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
            
        }catch (err) {
            console.log(err);
        }
        return result;
    }

    async showMontosByVersionPresupuestoClaveUPCapituloGasto (idVersion,claveUnidadPresupuestal,claveCapituloGasto) {
        let result=[];
        try {
            let query = "SELECT `UnidadPresupuestal`.*, SUM(`Monto`) AS Monto FROM `UnidadPresupuestal` "
            query+=" JOIN `UnidadResponsable` ON `UnidadPresupuestal`.`Id`=`UnidadResponsable`.`UnidadPresupuestal`"
            query+=" JOIN `ObjetoDeGasto` ON `UnidadResponsable`.`Id` =  `ObjetoDeGasto`.`UnidadResponsable` "
            query +=' JOIN PartidasGenericas ON PartidasGenericas.Id=ObjetoDeGasto.PartidaGenerica'
            query +=' JOIN ConceptosGenerales ON ConceptosGenerales.Id=PartidasGenericas.ConceptoGeneral'
            query +=' JOIN CapitulosGasto ON CapitulosGasto.Id=ConceptosGenerales.CapituloGasto'
            query+=" WHERE `VersionPresupuesto`= ?";
            query+=" AND UnidadPresupuestal.Clave=? "
            query+=" AND CapitulosGasto.Clave=? "
            query+=" GROUP BY `UnidadPresupuestal`.`Id`;";
            
            let params=[idVersion,claveUnidadPresupuestal,claveCapituloGasto];
            
            const connection = await pool.getConnection();
            const [results] = await connection.query(query,params);
            pool.releaseConnection(connection);
            
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

    async showMontosByVersionPresupuestoClaveUPConceptoGeneral (idVersion,claveUnidadPresupuestal,claveConceptoGeneral) {
        let result=[];
        try {
            let query = "SELECT `UnidadPresupuestal`.*, SUM(`Monto`) AS Monto FROM `UnidadPresupuestal` "
            query+=" JOIN `UnidadResponsable` ON `UnidadPresupuestal`.`Id`=`UnidadResponsable`.`UnidadPresupuestal`"
            query+=" JOIN `ObjetoDeGasto` ON `UnidadResponsable`.`Id` =  `ObjetoDeGasto`.`UnidadResponsable` "
            query +=' JOIN PartidasGenericas ON PartidasGenericas.Id=ObjetoDeGasto.PartidaGenerica'
            query +=' JOIN ConceptosGenerales ON ConceptosGenerales.Id=PartidasGenericas.ConceptoGeneral'
            query+=" WHERE `VersionPresupuesto`= ?";
            query+=" AND UnidadPresupuestal.Clave=? "
            query+=" AND ConceptosGenerales.Clave=? "
            query+=" GROUP BY `UnidadPresupuestal`.`Id`;";
            
            let params=[idVersion,claveUnidadPresupuestal,claveConceptoGeneral];
            
            const connection = await pool.getConnection();
            const [results] = await connection.query(query,params);
            pool.releaseConnection(connection);
            
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

    async showMontosByVersionPresupuestoClaveUPPartidaGenerica (idVersion,claveUnidadPresupuestal,clavePartidaGenerica) {
        let result=[];
        try {
            let query = "SELECT `UnidadPresupuestal`.*, SUM(`Monto`) AS Monto FROM `UnidadPresupuestal` "
            query+=" JOIN `UnidadResponsable` ON `UnidadPresupuestal`.`Id`=`UnidadResponsable`.`UnidadPresupuestal`"
            query+=" JOIN `ObjetoDeGasto` ON `UnidadResponsable`.`Id` =  `ObjetoDeGasto`.`UnidadResponsable` "
            query +=' JOIN PartidasGenericas ON PartidasGenericas.Id=ObjetoDeGasto.PartidaGenerica'
            query+=" WHERE `VersionPresupuesto`= ?";
            query+=" AND UnidadPresupuestal.Clave=? "
            query+=" AND PartidasGenericas.Clave=? "
            query+=" GROUP BY `UnidadPresupuestal`.`Id`;";
            
            let params=[idVersion,claveUnidadPresupuestal,clavePartidaGenerica];
            
            const connection = await pool.getConnection();
            const [results] = await connection.query(query,params);
            pool.releaseConnection(connection);
            
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

    async showMontosByVersionPresupuestoClaveUPObjetoGasto (idVersion,claveUnidadPresupuestal,claveObjetoGasto) {
        let result=[];
        try {
            let query = "SELECT `UnidadPresupuestal`.*, SUM(`Monto`) AS Monto FROM `UnidadPresupuestal` "
            query+=" JOIN `UnidadResponsable` ON `UnidadPresupuestal`.`Id`=`UnidadResponsable`.`UnidadPresupuestal`"
            query+=" JOIN `ObjetoDeGasto` ON `UnidadResponsable`.`Id` =  `ObjetoDeGasto`.`UnidadResponsable` "
            query+=" WHERE `VersionPresupuesto`= ?";
            query+=" AND UnidadPresupuestal.Clave=? "
            query+=" AND ObjetoDeGasto.Clave=? "
            query+=" GROUP BY `UnidadPresupuestal`.`Id`;";
            
            let params=[idVersion,claveUnidadPresupuestal,claveObjetoGasto];
            
            const connection = await pool.getConnection();
            const [results] = await connection.query(query,params);
            pool.releaseConnection(connection);
            
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