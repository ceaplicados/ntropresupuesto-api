import connection from '../../config/db.conf.js';
import Indicador from '../models/Indicador.js';

export default class Indicadores {
    async getByClaveProgramaIdEstado (clavePrograma,idEstado) {
        let result=[];
        try {
            let query = 'SELECT IndicadoresProgramas.*, CONCAT(UnidadPresupuestal.Clave,\'-\',UnidadResponsable.Clave,\'-\',Programas.Clave) AS Clave FROM IndicadoresProgramas  '
                +'JOIN Programas ON Programas.Id=IndicadoresProgramas.Programa '
                +'JOIN `UnidadResponsable` ON UnidadResponsable.Id=Programas.UnidadResponsable  '
                +'JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal '
                +'WHERE UnidadPresupuestal.Estado=? HAVING Clave=?';
            let params = [idEstado,clavePrograma];

            const [results] = await connection.query(query,params)
            result=results.map((row) => {
                let indicador=new Indicador();
                indicador.Id  = row.Id;
                indicador.IdMIR = row.IdMIR;
                indicador.Nombre = row.Nombre;
                indicador.Nivel = row.Nivel;
                indicador.Resumen = row.Resumen;
                indicador.Medios = row.Medios;
                indicador.Supuesto = row.Supuesto;
                indicador.Data = row.Data ? JSON.parse(row.Data) : [];
                return indicador;
            });
        } catch (err) {
            console.log(err);
        }
        return result;
    };
}