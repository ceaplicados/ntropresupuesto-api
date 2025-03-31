import connection from '../../config/db.conf.js';
import PartidaGenerica from '../models/PartidaGenerica.js';

export default class PartidasGenericas {
    async getByVersion (idVersion,clavePartidaGenerica) {
        let result=[];
        let query='SELECT `PartidasGenericas`.*, SUM(`Monto`) AS Monto FROM `PartidasGenericas` '
        query+='JOIN `ObjetoDeGasto` ON `PartidasGenericas`.`Id` =  `ObjetoDeGasto`.`PartidaGenerica` '
        query+='WHERE `VersionPresupuesto`= ? ';
        let params = [idVersion];
        
        if(clavePartidaGenerica){
            query+='AND `PartidasGenericas`.`Clave` = ? ';
            params.push(clavePartidaGenerica);
        }

        query+='GROUP BY `PartidasGenericas`.`Id`;';
        
        try {
            const [results] = await connection.query(query, params);
            result = results.map((row) => {
                let partidaGenerica = new PartidaGenerica();
                delete partidaGenerica.Id;
                partidaGenerica.Clave = row.Clave;
                partidaGenerica.Nombre = row.Nombre;
                partidaGenerica.Monto = row.Monto;
                delete partidaGenerica.ConceptoGeneral;
                return partidaGenerica;
            });
        } catch (err) {
            console.log(err);
        }
        if(result.length==1){
            result=result[0];
        }
        return result;
    }
}