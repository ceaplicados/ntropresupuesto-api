import connection from '../../config/db.conf.js';
import ProgramaPresupuestal from '../models/ProgramaPresupuestal.js';
import VersionPresupuesto from '../models/VersionPresupuesto.js';

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

    async getByClaveEstado (claveProgramaPresupuestal,idEstado) {
        let programa=new ProgramaPresupuestal();
        try {
            const [results] = await connection.query(
                'SELECT Programas.*, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave,"-",Programas.Clave) AS ClaveCompleta FROM Programas '
                    +' JOIN UnidadResponsable ON UnidadResponsable.Id=Programas.UnidadResponsable'
                    +' JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal '
                    +' WHERE UnidadPresupuestal.Estado=? HAVING ClaveCompleta=?;',
                [idEstado,claveProgramaPresupuestal])
            
            const result=results.map((row) => {
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
                programa=result[0];
            }
        }catch (err) {
            console.log(err);
        }
        return programa;
    }

    async showMontosByVersion (idVersion,quantity) {
        if(!quantity){
            quantity=25;
        }
        let result=[];
        try {
            let query = 'SELECT Programas.*, Monto, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave,"-",Programas.Clave) AS ClaveCompleta FROM Programas '
                +'JOIN UnidadResponsable ON UnidadResponsable.Id=Programas.UnidadResponsable '
                +'JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal  '
                +'JOIN ProgramasMonto ON ProgramasMonto.Programa = Programas.Id '
                +'WHERE Version = ? ORDER BY Monto DESC';
            let params = [idVersion];
            if(quantity>0){
                query += ' LIMIT '+quantity;
            }

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
        } catch (err) {
            console.log(err);
        }
        return result;
    };

    async showMontosByVersionClaveUR (idVersion,claveUR) {
        claveUR+='-%';
        let result=[];
        try {
            let query = 'SELECT Programas.*, Monto, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave,"-",Programas.Clave) AS ClaveCompleta FROM Programas '
                +'JOIN UnidadResponsable ON UnidadResponsable.Id=Programas.UnidadResponsable '
                +'JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal  '
                +'JOIN ProgramasMonto ON ProgramasMonto.Programa = Programas.Id '
                +'WHERE Version = ? HAVING ClaveCompleta LIKE ? ORDER BY Monto DESC';
            let params = [idVersion,claveUR];

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
        } catch (err) {
            console.log(err);
        }
        return result;
    };

    async showMontosByVersionPresupuestoClavePP (idsVersiones,claveProgramaPresupuestal) {
        if(!Array.isArray(idsVersiones)){
            idsVersiones=[idsVersiones];
        }
        let result=[];
        try {
            let query = 'SELECT Programas.*, Monto, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave,"-",Programas.Clave) AS ClaveCompleta FROM Programas '
                +'JOIN UnidadResponsable ON UnidadResponsable.Id=Programas.UnidadResponsable '
                +'JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal  '
                +'JOIN ProgramasMonto ON ProgramasMonto.Programa = Programas.Id '
                +'WHERE Version IN ('+idsVersiones.join(',')+') HAVING ClaveCompleta=?;';
            let params = [claveProgramaPresupuestal];

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

    async showMontosByVersionesPresupuestoClavePP (idsVersiones,claveProgramaPresupuestal) {
        if(!Array.isArray(idsVersiones)){
            idsVersiones=[idsVersiones];
        }
        let result=[];
        try {
            let query = 'SELECT VersionesPresupuesto.*, Monto, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave,"-",Programas.Clave) AS ClaveCompleta FROM Programas '
                +'JOIN UnidadResponsable ON UnidadResponsable.Id=Programas.UnidadResponsable '
                +'JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal  '
                +'JOIN ProgramasMonto ON ProgramasMonto.Programa = Programas.Id '
                +'JOIN VersionesPresupuesto ON VersionesPresupuesto.Id = ProgramasMonto.Version '
                +'WHERE Version IN ('+idsVersiones.join(',')+') HAVING ClaveCompleta=?;';
            let params = [claveProgramaPresupuestal];

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

    async buscarByVersion (idVersion,buscar) {
        let result=[];
        buscar='%'+buscar+'%';
        try {
            let query = 'SELECT Programas.*, Monto, CONCAT(UnidadPresupuestal.Clave,"-",UnidadResponsable.Clave,"-",Programas.Clave) AS ClaveCompleta, '
                +'CONCAT(Programas.Nombre,UnidadResponsable.Nombre,UnidadPresupuestal.Nombre) AS Buscar '
                +'FROM Programas '
                +'JOIN UnidadResponsable ON UnidadResponsable.Id=Programas.UnidadResponsable '
                +'JOIN UnidadPresupuestal ON UnidadPresupuestal.Id=UnidadResponsable.UnidadPresupuestal  '
                +'JOIN ProgramasMonto ON ProgramasMonto.Programa = Programas.Id '
                +'WHERE Version = ? HAVING ClaveCompleta LIKE ? OR Buscar LIKE ? ORDER BY ClaveCompleta';
            let params = [idVersion,buscar,buscar];

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
        } catch (err) {
            console.log(err);
        }
        return result;
    };
}