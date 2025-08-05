import pool from '../../config/db.conf.js';
import VersionPresupuesto from '../models/VersionPresupuesto.js';

export default class VersionesPresupuesto {
    async show (id) {
        let versionPresupuesto=new VersionPresupuesto();
        try {
            let query='SELECT * FROM `VersionesPresupuesto` WHERE `Id` = ?';
            let params=[id];
            
            const connection = await pool.getConnection();
            const [results] = await connection.query(
                query,
                params);
            pool.releaseConnection(connection);

            let result=results.map((row) => {
                let versionPresupuesto=new VersionPresupuesto();
                versionPresupuesto.Id=row.Id;
                versionPresupuesto.Estado=row.Estado;
                versionPresupuesto.Anio=row.Anio;
                versionPresupuesto.Tipo=row.Nombre;
                versionPresupuesto.Descripcion=row.Descripcion;
                versionPresupuesto.Fecha=new Date(row.Fecha);
                versionPresupuesto.Actual=false;
                if(row.Actual===1){
                    versionPresupuesto.Actual=true;
                }
                versionPresupuesto.ObjetoGasto=false;
                if(row.ObjetoGasto===1){
                    versionPresupuesto.ObjetoGasto=true;
                }
                versionPresupuesto.ProgramaPresupuestal=false;
                if(row.ProgramaPresupuestal===1){
                    versionPresupuesto.ProgramaPresupuestal=true;
                }
                return versionPresupuesto;
            });
            
            if(result.length>0){
                versionPresupuesto=result[0];
            }
            
            return versionPresupuesto;
        } catch (err) {
            console.log(err);
        }
    }

    async showByIds (ids) {
        try {
            let query='SELECT * FROM `VersionesPresupuesto` WHERE `Id` IN ('+ids.join(',')+')';
            
            const connection = await pool.getConnection();
            const [results] = await connection.query(query)
            pool.releaseConnection(connection);

            let result=results.map((row) => {
                let versionPresupuesto=new VersionPresupuesto();
                versionPresupuesto.Id=row.Id;
                versionPresupuesto.Estado=row.Estado;
                versionPresupuesto.Anio=row.Anio;
                versionPresupuesto.Tipo=row.Nombre;
                versionPresupuesto.Descripcion=row.Descripcion;
                versionPresupuesto.Fecha=new Date(row.Fecha);
                versionPresupuesto.Actual=false;
                if(row.Actual===1){
                    versionPresupuesto.Actual=true;
                }
                versionPresupuesto.ObjetoGasto=false;
                if(row.ObjetoGasto===1){
                    versionPresupuesto.ObjetoGasto=true;
                }
                versionPresupuesto.ProgramaPresupuestal=false;
                if(row.ProgramaPresupuestal===1){
                    versionPresupuesto.ProgramaPresupuestal=true;
                }
                return versionPresupuesto;
            });
            
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    async showByEstado (idEstado,anios) {
        let result=[];
        try {
            let query='SELECT * FROM `VersionesPresupuesto` WHERE `Estado` = ? ORDER BY Anio ASC, Actual DESC, Fecha ASC';
            let params=[idEstado];
            if(anios){
                query = 'SELECT * FROM `VersionesPresupuesto` WHERE `Estado` = ? AND Anio IN (?) AND Actual=1 ORDER BY Anio ASC,Fecha';
                params = [idEstado,anios];
            }
            const connection = await pool.getConnection();
            const [results] = await connection.query(query,params);
            pool.releaseConnection(connection);

            result=results.map((row) => {
                let versionPresupuesto=new VersionPresupuesto();
                versionPresupuesto.Id=row.Id;
                versionPresupuesto.Estado=row.Estado;
                versionPresupuesto.Anio=row.Anio;
                versionPresupuesto.Tipo=row.Nombre;
                versionPresupuesto.Descripcion=row.Descripcion;
                versionPresupuesto.Fecha=new Date(row.Fecha);
                versionPresupuesto.Actual=false;
                if(row.Actual===1){
                    versionPresupuesto.Actual=true;
                }
                versionPresupuesto.ObjetoGasto=false;
                if(row.ObjetoGasto===1){
                    versionPresupuesto.ObjetoGasto=true;
                }
                versionPresupuesto.ProgramaPresupuestal=false;
                if(row.ProgramaPresupuestal===1){
                    versionPresupuesto.ProgramaPresupuestal=true;
                }
                return versionPresupuesto;
            });
            return result;
        } catch (err) {
            console.log(err);
        }
    };

    async getActiva (idEstado,anio) {
        let versionPresupuesto=new VersionPresupuesto();
        try {
            let query='SELECT * FROM `VersionesPresupuesto` WHERE Actual=1 AND `Estado` = ? AND `Anio`=?';
            let params=[idEstado,anio];
            if(!anio){
                query = 'SELECT * FROM `VersionesPresupuesto` WHERE Actual=1 AND `Estado` = ? ORDER BY Anio DESC LIMIT 1';
                params = [idEstado];
            }

            const connection = await pool.getConnection();
            const [results] = await connection.query(
                query,
                params);
            pool.releaseConnection(connection);

            let result=results.map((row) => {
                let versionPresupuesto=new VersionPresupuesto();
                versionPresupuesto.Id=row.Id;
                versionPresupuesto.Estado=row.Estado;
                versionPresupuesto.Anio=row.Anio;
                versionPresupuesto.Tipo=row.Nombre;
                versionPresupuesto.Descripcion=row.Descripcion;
                versionPresupuesto.Fecha=new Date(row.Fecha);
                versionPresupuesto.Actual=false;
                if(row.Actual===1){
                    versionPresupuesto.Actual=true;
                }
                versionPresupuesto.ObjetoGasto=false;
                if(row.ObjetoGasto===1){
                    versionPresupuesto.ObjetoGasto=true;
                }
                versionPresupuesto.ProgramaPresupuestal=false;
                if(row.ProgramaPresupuestal===1){
                    versionPresupuesto.ProgramaPresupuestal=true;
                }
                return versionPresupuesto;
            });
            
            if(result.length>0){
                versionPresupuesto=result[0];
            }
            
            return versionPresupuesto;
        } catch (err) {
            console.log(err);
        }
    };

    async getTotal (idVersion) {
        let total=0;
        try {
            let query='SELECT SUM(`Monto`) AS Total FROM `ObjetoDeGasto` WHERE `VersionPresupuesto` =  ?';
            let params=[idVersion];

            const connection = await pool.getConnection();
            const [results] = await connection.query(
                query,
                params);
            pool.releaseConnection(connection);

            total=results[0].Total;
        } catch (err) {
            console.log(err);
        }
        return total;
    }

    async getHistoricoByEstado (idEstado) {
        let result=[];
        try {
            let query='SELECT `VersionesPresupuesto`.*, SUM(Monto) AS Monto '
            +'FROM `VersionesPresupuesto` '
            +'JOIN `ObjetoDeGasto` ON `ObjetoDeGasto`.`VersionPresupuesto`=`VersionesPresupuesto`.`Id` '
            +'WHERE `Estado` = ? AND `Actual`=1 '
            +'GROUP BY `VersionesPresupuesto`.`Id` '
            +'ORDER BY Anio ASC,Fecha DESC';
            let params=[idEstado];

            const connection = await pool.getConnection();
            const [results] = await connection.query(query,params);
            pool.releaseConnection(connection);
            
            result=results.map((row) => {
                let versionPresupuesto=new VersionPresupuesto();
                versionPresupuesto.Id=row.Id;
                versionPresupuesto.Estado=row.Estado;
                versionPresupuesto.Anio=row.Anio;
                versionPresupuesto.Tipo=row.Nombre;
                versionPresupuesto.Descripcion=row.Descripcion;
                versionPresupuesto.Fecha=new Date(row.Fecha);
                versionPresupuesto.Actual=false;
                if(row.Actual===1){
                    versionPresupuesto.Actual=true;
                }
                versionPresupuesto.ObjetoGasto=false;
                if(row.ObjetoGasto===1){
                    versionPresupuesto.ObjetoGasto=true;
                }
                versionPresupuesto.ProgramaPresupuestal=false;
                if(row.ProgramaPresupuestal===1){
                    versionPresupuesto.ProgramaPresupuestal=true;
                }
                versionPresupuesto.Monto=row.Monto;
                return versionPresupuesto;
            });
        } catch (err) {
            console.log(err);
        }
        return result;
    }
}