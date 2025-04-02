import connection from '../../config/db.conf.js';
import UnidadPresupuestal from '../models/UnidadPresupuestal.js';

export default class UnidadesPresupuestales {
    async getById (idUnidadPresupuestal) {
        let result=new UnidadPresupuestal();
        try {
            const [results] = await connection.query(
                'SELECT * FROM UnidadPresupuestal '
                    +' WHERE UnidadPresupuestal.Id=?;',
                [idUnidadPresupuestal])
            
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
            const [results] = await connection.query(
                'SELECT * FROM UnidadPresupuestal '
                    +' WHERE UnidadPresupuestal.Estado=?'
                    +' ORDER BY Clave ',
                [idEstado])
            
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
            
            const [results] = await connection.query(query,params)
            
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

    async showMontosByVersionPresupuestoClaveUP (idVersion,claveUnidadPresupuestal) {
        let result=[];
        try {
            let query = "SELECT `UnidadPresupuestal`.*, SUM(`Monto`) AS Monto FROM `UnidadPresupuestal` "
            query+=" JOIN `UnidadResponsable` ON `UnidadPresupuestal`.`Id`=`UnidadResponsable`.`UnidadPresupuestal`"
            query+=" JOIN `ObjetoDeGasto` ON `UnidadResponsable`.`Id` =  `ObjetoDeGasto`.`UnidadResponsable` "
            query+=" WHERE `VersionPresupuesto`= ?";
            query+=" AND UnidadPresupuestal.Clave=? "
            query+=" GROUP BY `UnidadPresupuestal`.`Id`;";
            
            let params=[idVersion,claveUnidadPresupuestal];
            
            const [results] = await connection.query(query,params)
            
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
            
            const [results] = await connection.query(query,params)
            
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
            
            const [results] = await connection.query(query,params)
            
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
            
            const [results] = await connection.query(query,params)
            
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
            
            const [results] = await connection.query(query,params)
            
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