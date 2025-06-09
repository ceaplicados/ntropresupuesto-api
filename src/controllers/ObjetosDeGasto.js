import pool from '../../config/db.conf.js';
import ObjetoDeGasto from '../models/ObjetoDeGasto.js';
import VersionPresupuesto from '../models/VersionPresupuesto.js';

export default class ObjetosDeGasto {
    async getById (idObjetoDeGasto) {
        let result=[];
        let query='SELECT * FROM `ObjetoDeGasto` '
        query+='WHERE `Id`= ? ';
        let params = [idObjetoDeGasto];
        
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);

            result = results.map((row) => {
                let objetoDeGasto = new ObjetoDeGasto();
                objetoDeGasto.Id = row.Id;
                objetoDeGasto.Clave = row.Clave;
                objetoDeGasto.Nombre = row.Nombre;
                delete objetoDeGasto.Monto;
                objetoDeGasto.PartidaGenerica = row.PartidaGenerica;
                return objetoDeGasto;
            });
        } catch (err) {
            console.log(err);
        }
        return result;
    }

    async getByClave (claveObjetoDeGasto) {
        let response=new ObjetoDeGasto();
        let query='SELECT DISTINCT Clave, Nombre, PartidaGenerica FROM `ObjetoDeGasto` '
        query+='WHERE `Clave`= ? ORDER BY ObjetoDeGasto.Clave, ObjetoDeGasto.Nombre';
        let params = [claveObjetoDeGasto];
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);

            const result = results.map((row) => {
                let objetoDeGasto = new ObjetoDeGasto();
                delete objetoDeGasto.Id ;
                objetoDeGasto.Clave = row.Clave;
                objetoDeGasto.Nombre = row.Nombre;
                delete objetoDeGasto.Monto;
                objetoDeGasto.PartidaGenerica = row.PartidaGenerica;
                return objetoDeGasto;
            });
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    async getByClavePartidaGenerica (clavePartidaGenerica) {
        let response=new ObjetoDeGasto();
        let query='SELECT DISTINCT ObjetoDeGasto.Clave, ObjetoDeGasto.Nombre, ObjetoDeGasto.PartidaGenerica FROM `ObjetoDeGasto` '
                +'JOIN `PartidasGenericas` ON `PartidasGenericas`.`Id` =  `ObjetoDeGasto`.`PartidaGenerica` '
                +'WHERE PartidasGenericas.Clave= ? ORDER BY ObjetoDeGasto.Clave, ObjetoDeGasto.Nombre';
        let params = [clavePartidaGenerica];
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);

            const result = results.map((row) => {
                let objetoDeGasto = new ObjetoDeGasto();
                delete objetoDeGasto.Id
                objetoDeGasto.Clave = row.Clave;
                objetoDeGasto.Nombre = row.Nombre;
                delete objetoDeGasto.Monto;
                objetoDeGasto.PartidaGenerica = row.PartidaGenerica;
                return objetoDeGasto;
            });
            return result;
        } catch (err) {
            console.log(err);
        }
    }


    async getByClaveConceptoGeneral (claveConceptoGeneral) {
        let response=new ObjetoDeGasto();
        let query='SELECT DISTINCT ObjetoDeGasto.Clave, ObjetoDeGasto.Nombre, ObjetoDeGasto.PartidaGenerica FROM `ObjetoDeGasto` '
                +'JOIN `PartidasGenericas` ON `PartidasGenericas`.`Id` =  `ObjetoDeGasto`.`PartidaGenerica` '
                +'JOIN `ConceptosGenerales` ON `ConceptosGenerales`.`Id` =  `PartidasGenericas`.`ConceptoGeneral` '
                +'WHERE ConceptosGenerales.Clave= ? ORDER BY ObjetoDeGasto.Clave, ObjetoDeGasto.Nombre';
        let params = [claveConceptoGeneral];
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);

            const result = results.map((row) => {
                let objetoDeGasto = new ObjetoDeGasto();
                delete objetoDeGasto.Id ;
                objetoDeGasto.Clave = row.Clave;
                objetoDeGasto.Nombre = row.Nombre;
                delete objetoDeGasto.Monto;
                objetoDeGasto.PartidaGenerica = row.PartidaGenerica;
                return objetoDeGasto;
            });
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    async getByClaveCapituloGasto (claveCapituloGasto) {
        let response=new ObjetoDeGasto();
        let query='SELECT DISTINCT ObjetoDeGasto.Clave, ObjetoDeGasto.Nombre, ObjetoDeGasto.PartidaGenerica FROM `ObjetoDeGasto` '
                +'JOIN `PartidasGenericas` ON `PartidasGenericas`.`Id` =  `ObjetoDeGasto`.`PartidaGenerica` '
                +'JOIN `ConceptosGenerales` ON `ConceptosGenerales`.`Id` =  `PartidasGenericas`.`ConceptoGeneral` '
                +'JOIN `CapitulosGasto` ON `CapitulosGasto`.`Id` =  `ConceptosGenerales`.`CapituloGasto` '
                +'WHERE CapitulosGasto.Clave= ? ORDER BY ObjetoDeGasto.Clave, ObjetoDeGasto.Nombre';
        let params = [claveCapituloGasto];
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);

            const result = results.map((row) => {
                let objetoDeGasto = new ObjetoDeGasto();
                delete objetoDeGasto.Id ;
                objetoDeGasto.Clave = row.Clave;
                objetoDeGasto.Nombre = row.Nombre;
                delete objetoDeGasto.Monto;
                objetoDeGasto.PartidaGenerica = row.PartidaGenerica;
                return objetoDeGasto;
            });
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    async getByVersion (idVersion,claveObjetoDeGasto) {
        let result=[];
        let query='SELECT * FROM `ObjetoDeGasto` '
        query+='WHERE `VersionPresupuesto`= ? ';
        let params = [idVersion];
        
        if(claveObjetoDeGasto){
            query+='AND `Clave` = ? ';
            params.push(claveObjetoDeGasto);
        }

        query+=' ORDER BY `ObjetoDeGasto`.`Clave`;';

        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);

            result = results.map((row) => {
                let objetoDeGasto = new ObjetoDeGasto();
                objetoDeGasto.Id = row.Id;
                objetoDeGasto.Clave = row.Clave;
                objetoDeGasto.Nombre = row.Nombre;
                objetoDeGasto.Monto = row.Monto;
                delete objetoDeGasto.PartidaGenerica;
                return objetoDeGasto;
            });
        } catch (err) {
            console.log(err);
        }
        return result;
    }

    async getByVersiones (idsVersiones,claveObjetoGasto,nombreObjetoGasto) {
        let result=[];
        let query='SELECT VersionesPresupuesto.*, SUM(Monto) AS Monto FROM VersionesPresupuesto '
                +'JOIN ObjetoDeGasto ON VersionPresupuesto = VersionesPresupuesto.Id '
                +'WHERE VersionesPresupuesto.Id IN ('+idsVersiones.join(',')+') AND ObjetoDeGasto.Clave=? AND ObjetoDeGasto.Nombre=? '
                +'GROUP BY VersionesPresupuesto.Id';
        let params = [claveObjetoGasto,nombreObjetoGasto];
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);

            result = results.map((row) => {
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
        } catch (err) {
            console.log(err);
        }
        return result;
    }

    async getByVersionPartidaGenerica (idVersion,clavePartidaGenerica) {
        let result=[];

        let query='SELECT `ObjetoDeGasto`.*  FROM `ObjetoDeGasto` '
        query+='JOIN `PartidasGenericas` ON `PartidasGenericas`.`Id` =  `ObjetoDeGasto`.`PartidaGenerica` '
        query+='WHERE `VersionPresupuesto`= ? ';
        query+='AND `PartidasGenericas`.`Clave` = ? ';
        query+=' ORDER BY `ObjetoDeGasto`.`Clave`;';
        let params = [idVersion, clavePartidaGenerica];

        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);

            result = results.map((row) => {
                let objetoDeGasto = new ObjetoDeGasto();
                objetoDeGasto.Id = row.Id;
                objetoDeGasto.Clave = row.Clave;
                objetoDeGasto.Nombre = row.Nombre;
                objetoDeGasto.Monto = row.Monto;
                delete objetoDeGasto.PartidaGenerica;
                return objetoDeGasto;
            });
        } catch (err) {
            console.log(err);
        }
        return result;
    }

    async getByVersionConceptoGeneral (idVersion,claveConceptoGeneral) {
        let result=[];

        let query='SELECT `ObjetoDeGasto`.*  FROM `ObjetoDeGasto` '
        query+='JOIN `PartidasGenericas` ON `PartidasGenericas`.`Id` =  `ObjetoDeGasto`.`PartidaGenerica` '
        query+='JOIN `ConceptosGenerales` ON `ConceptosGenerales`.`Id` =  `PartidasGenericas`.`ConceptoGeneral` '
        query+='WHERE `VersionPresupuesto`= ? ';
        query+='AND `ConceptosGenerales`.`Clave` = ? ';
        query+='ORDER BY `ObjetoDeGasto`.`Clave`;';
        let params = [idVersion, claveConceptoGeneral];
                
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);

            result = results.map((row) => {
                let objetoDeGasto = new ObjetoDeGasto();
                objetoDeGasto.Id = row.Id;
                objetoDeGasto.Clave = row.Clave;
                objetoDeGasto.Nombre = row.Nombre;
                objetoDeGasto.Monto = row.Monto;
                delete objetoDeGasto.PartidaGenerica;
                return objetoDeGasto;
            });
        } catch (err) {
            console.log(err);
        }
        return result;
    }


    async getByVersionCapituloGasto (idVersion,claveCapituloGasto) {
        let result=[];

        let query='SELECT `ObjetoDeGasto`.*  FROM `ObjetoDeGasto` '
        query+='JOIN `PartidasGenericas` ON `PartidasGenericas`.`Id` =  `ObjetoDeGasto`.`PartidaGenerica` '
        query+='JOIN `ConceptosGenerales` ON `ConceptosGenerales`.`Id` =  `PartidasGenericas`.`ConceptoGeneral` '
        query+='JOIN `CapitulosGasto` ON `CapitulosGasto`.`Id` =  `ConceptosGenerales`.`CapituloGasto` '
        query+='WHERE `VersionPresupuesto`= ? ';
        query+='AND `CapitulosGasto`.`Clave` = ? ';
        query+='ORDER BY `ObjetoDeGasto`.`Clave`;';
        let params = [idVersion, claveCapituloGasto];
                
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);
            
            result = results.map((row) => {
                let objetoDeGasto = new ObjetoDeGasto();
                objetoDeGasto.Id = row.Id;
                objetoDeGasto.Clave = row.Clave;
                objetoDeGasto.Nombre = row.Nombre;
                objetoDeGasto.Monto = row.Monto;
                delete objetoDeGasto.PartidaGenerica;
                return objetoDeGasto;
            });
        } catch (err) {
            console.log(err);
        }
        return result;
    }
}