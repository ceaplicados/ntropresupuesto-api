import connection from '../../config/db.conf.js';
import VersionPresupuesto from '../models/VersionPresupuesto.js';

export default class VersionesPresupuesto {
    async show (id) {
        let versionPresupuesto=new VersionPresupuesto();
        try {
            let query='SELECT * FROM `VersionesPresupuesto` WHERE `Id` = ?';
            let params=[id];
            
            const [results] = await connection.query(
                query,
                params)

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

    async showByEstado (idEstado) {
        let result=[];
        try {
            const [results] = await connection.query(
                'SELECT * FROM `VersionesPresupuesto` WHERE `Estado` = ? ORDER BY Anio,Fecha',
                [idEstado])
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
            const [results] = await connection.query(
                query,
                params)

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
}