import connection from '../../config/db.conf.js';
import ObjetoDeGasto from '../models/ObjetoDeGasto.js';

export default class ObjetosDeGasto {
    async getById (idObjetoDeGasto) {
        let result=[];
        let query='SELECT * FROM `ObjetoDeGasto` '
        query+='WHERE `Id`= ? ';
        let params = [idObjetoDeGasto];
        
        try {
            const [results] = await connection.query(query, params);
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

    async getByClave (claveObjetoDeGasto,versionPresupuesto) {
        let response=new ObjetoDeGasto();
        let query='SELECT * FROM `ObjetoDeGasto` '
        query+='WHERE `Clave`= ? AND `VersionPresupuesto`= ?';
        let params = [claveObjetoDeGasto,versionPresupuesto];
        try {
            const [results] = await connection.query(query, params);
            const result = results.map((row) => {
                let objetoDeGasto = new ObjetoDeGasto();
                objetoDeGasto.Id = row.Id;
                objetoDeGasto.Clave = row.Clave;
                objetoDeGasto.Nombre = row.Nombre;
                delete objetoDeGasto.Monto;
                objetoDeGasto.PartidaGenerica = row.PartidaGenerica;
                return objetoDeGasto;
            });
            if(result.length>0){
                response=result[0]
            }
        } catch (err) {
            console.log(err);
        }
        return response;
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
            const [results] = await connection.query(query, params);
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

    async getByVersionPartidaGenerica (idVersion,clavePartidaGenerica) {
        let result=[];

        let query='SELECT `ObjetoDeGasto`.*  FROM `ObjetoDeGasto` '
        query+='JOIN `PartidasGenericas` ON `PartidasGenericas`.`Id` =  `ObjetoDeGasto`.`PartidaGenerica` '
        query+='WHERE `VersionPresupuesto`= ? ';
        query+='AND `PartidasGenericas`.`Clave` = ? ';
        query+=' ORDER BY `ObjetoDeGasto`.`Clave`;';
        let params = [idVersion, clavePartidaGenerica];

        try {
            const [results] = await connection.query(query, params);
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
            const [results] = await connection.query(query, params);
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
            const [results] = await connection.query(query, params);
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