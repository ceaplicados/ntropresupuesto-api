import connection from '../../config/db.conf.js';
import ProgramaPresupuestal from '../models/ProgramaPresupuestal.js';

export default class ProgramasPresupuestales {
    async getById (idProgramaPresupuestal) {
        let result=new ProgramaPresupuestal();
        try {
            const [results] = await connection.query(
                'SELECT Programas.*, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave,"-",Programas.Clave) AS ClaveCompleta FROM Programas '
                    +' JOIN UnidadResponsable ON UnidadResponsable.Id=Programas.UnidadResponsable'
                    +' JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal '
                    +' WHERE Programas.Id=?;',
                [idProgramaPresupuestal])
            
            result=results.map((row) => {
                let programaPresupuestal=new ProgramaPresupuestal();
                programaPresupuestal.Id=row.Id;
                programaPresupuestal.Clave=row.ClaveCompleta;
                programaPresupuestal.Nombre=row.Nombre;
                programaPresupuestal.UnidadResponsable=row.UnidadResponsable;
                delete programaPresupuestal.ODS;
                delete programaPresupuestal.MetaODS;
                delete programaPresupuestal.Monto;
                return programaPresupuestal;
            });
            if(result.length>0){
                result=result[0];
            }
        }catch (err) {
            console.log(err);
        }
        return result;
    };

    async showMontosByVersionPresupuestoClavePP (idVersion,claveProgramaPresupuestal) {
        let result=[];
        try {
            let query = 'SELECT Programas.*, Monto, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave,"-",Programas.Clave) AS ClaveCompleta FROM Programas '
                +'JOIN UnidadResponsable ON UnidadResponsable.Id=Programas.UnidadResponsable '
                +'JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal  '
                +'JOIN ProgramasMonto ON ProgramasMonto.Programa = Programas.Id '
                +'WHERE Version = ? HAVING ClaveCompleta=?;';
            let params = [idVersion,claveProgramaPresupuestal];

            const [results] = await connection.query(query,params)
            result=results.map((row) => {
                let programaPresupuestal=new ProgramaPresupuestal();
                programaPresupuestal.Id=row.Id;
                programaPresupuestal.Clave=row.ClaveCompleta;
                programaPresupuestal.Nombre=row.Nombre;
                programaPresupuestal.UnidadResponsable=row.UnidadResponsable;
                delete programaPresupuestal.ODS;
                delete programaPresupuestal.MetaODS;
                programaPresupuestal.Monto = row.Monto;
                return programaPresupuestal;
            });
            return result;
        } catch (err) {
            console.log(err);
        }
    };
}