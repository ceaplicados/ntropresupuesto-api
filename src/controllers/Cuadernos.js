import connection from '../../config/db.conf.js';
import Cuaderno from '../models/Cuaderno.js';
import Usuario from '../models/Usuario.js';
import RenglonesCuaderno from './RenglonesCuaderno.js';
import AniosCuaderno from './AniosCuaderno.js';
import VersionesPresupuesto from './VersionesPresupuesto.js';
import UnidadesPresupuestales from './UnidadesPresupuestales.js';
import UnidadesResponsables from './UnidadesResponsables.js';

export default class Usuarios {
    renglonesCuaderno = new RenglonesCuaderno();
    aniosCuaderno = new AniosCuaderno();
    versionesPresupuesto=new VersionesPresupuesto();
    unidadesPresupuestales=new UnidadesPresupuestales();
    unidadesResponsables=new UnidadesResponsables();

    async getUsers (cuaderno) {
        try{
            let Usuarios=[];
            const [results] = await connection.query(
                'SELECT * FROM `Usuarios` WHERE `Id` IN (SELECT `Usuario` FROM `UsuariosCuaderno` WHERE `Cuaderno`=?)',[cuaderno.Id])
            Usuarios=results.map((row) => {
                let usuario=new Usuario();
                delete usuario.Id
                usuario.UUID  = row.UUID
                usuario.Nombre = row.Nombre
                usuario.Apellidos = row.Apellidos
                usuario.Sobrenombre = row.Sobrenombre
                usuario.Email = row.Email
                delete usuario.Password
                usuario.Estado = row.Estado
                if(row.Activo===0){
                    usuario.Activo=false
                }
                delete usuario.ResetKey 
                usuario.Image = row.Image
                delete usuario.GoogleId 
                delete usuario.Admin
                return usuario;
            })
            cuaderno.Usuarios=Usuarios;
            return cuaderno;
        }catch (err) {
            console.log(err);
        }
    }

    async listPublic () {
        let result=[];
        try {
            const [results] = await connection.query(
                'SELECT *, Cuadernos.Id AS CuadernosId, Cuadernos.Nombre AS CuadernosNombre, Usuarios.Nombre AS UsuariosNombre FROM Cuadernos JOIN Usuarios ON Cuadernos.Owner=Usuarios.Id WHERE Cuadernos.Publico=1')
            
                result=results.map((row) => {
                
                    let owner=new Usuario();
                    delete owner.Id
                    owner.UUID  = row.UUID
                    owner.Nombre = row.UsuariosNombre
                    owner.Apellidos = row.Apellidos
                    owner.Sobrenombre = row.Sobrenombre
                    delete owner.Email
                    delete owner.Password
                    delete owner.Estado
                    owner.Activo = true
                    if(row.Activo==0){
                        owner.Activo = false
                    }
                    delete owner.ResetKey
                    owner.Image = row.Image
                    delete owner.GoogleId 
                    delete owner.Admin

                    let cuaderno=new Cuaderno();
                    cuaderno.Id  = row.CuadernosId
                    cuaderno.Owner  = owner
                    cuaderno.DateBorn = row.DateBorn
                    cuaderno.Nombre = row.CuadernosNombre
                    cuaderno.Descripcion = row.Descripcion
                    cuaderno.Publico = true
                    cuaderno.AnioINPC = row.AnioINPC
                    cuaderno.Anios = []
                    cuaderno.Renglones = []
                    cuaderno.Usuarios = []
                    delete cuaderno.Anios;
                    delete cuaderno.Renglones;

                    return cuaderno;
                }
            );
        }catch (err) {
            console.log(err);
        }
        for(let i=0;i<result.length;i++){
            result[i]=await this.getUsers(result[i]);
        }
        return result;
    }

    async getByUser (UUID) {
        let result=[];
        try {
            const [results] = await connection.query(
                'SELECT Cuadernos.* FROM Cuadernos JOIN Usuarios ON Cuadernos.Owner=Usuarios.Id WHERE Usuarios.UUID=?',[UUID])
            
                result=results.map((row) => {
                    let cuaderno=new Cuaderno();
                    cuaderno.Id  = row.Id
                    delete cuaderno.Owner 
                    cuaderno.DateBorn = row.DateBorn
                    cuaderno.Nombre = row.Nombre
                    cuaderno.Descripcion = row.Descripcion
                    cuaderno.Publico = true
                    if(row.Publico==0){
                        cuaderno.Publico = false
                    }
                    cuaderno.AnioINPC = row.AnioINPC
                    cuaderno.Anios = []
                    cuaderno.Renglones = []
                    cuaderno.Usuarios = []
                    delete cuaderno.Anios;
                    delete cuaderno.Renglones;
                    return cuaderno;
                }
            );
        }catch (err) {
            console.log(err);
        }
        for(let i=0;i<result.length;i++){
            result[i]=await this.getUsers(result[i]);
        }
        return result;
    }

    async show (id) {
        let cuaderno=new Cuaderno();
        let result=[];
        try {
            const [results] = await connection.query(
                'SELECT *, Cuadernos.Id AS CuadernosId, Cuadernos.Nombre AS CuadernosNombre, Usuarios.Nombre AS UsuariosNombre FROM Cuadernos JOIN Usuarios ON Cuadernos.Owner=Usuarios.Id WHERE Cuadernos.Id=?',[id])
            
                result=results.map((row) => {
                    let owner=new Usuario();
                    delete owner.Id
                    owner.UUID  = row.UUID
                    owner.Nombre = row.UsuariosNombre
                    owner.Apellidos = row.Apellidos
                    owner.Sobrenombre = row.Sobrenombre
                    delete owner.Email
                    delete owner.Password
                    delete owner.Estado
                    owner.Activo = true
                    if(row.Activo==0){
                        owner.Activo = false
                    }
                    delete owner.ResetKey
                    owner.Image = row.Image
                    delete owner.GoogleId 
                    delete owner.Admin

                    let cuaderno=new Cuaderno();
                    cuaderno.Id  = row.CuadernosId
                    cuaderno.Owner = owner
                    cuaderno.DateBorn = row.DateBorn
                    cuaderno.Nombre = row.Nombre
                    cuaderno.Descripcion = row.Descripcion
                    cuaderno.Publico = true
                    if(row.Publico==0){
                        cuaderno.Publico = false
                    }
                    cuaderno.AnioINPC = row.AnioINPC
                    cuaderno.Anios = []
                    cuaderno.Renglones = []
                    cuaderno.Usuarios = []
                    return cuaderno;
                }
            );
        }catch (err) {
            console.log(err);
        }
        if(result.length>0){
            cuaderno=result[0];
            cuaderno=await this.getUsers(cuaderno);
            cuaderno=await this.renglonesCuaderno.getByCuaderno(cuaderno);
            cuaderno=await this.aniosCuaderno.getByCuaderno(cuaderno);

            // calcular los años necesarios (si hay un YoY asegurarse de que se incluye el año anterior)
            let anios=cuaderno.Anios.map((anio) => {
                return anio.Anio
            })
            let existeYoY=false;
            for(let i=0;i<cuaderno.Renglones.length;i++){
                if(cuaderno.Renglones[i].Mostrar==="YoY"){
                    existeYoY=true;
                    break;
                }
            }
            if(existeYoY){
                let aniosFinal=[...anios]
                for(let i=0;i<anios.length;i++){
                    !anios.includes((anios[i]-1)) ? aniosFinal.push(anios[i]-1): null;
                }
                aniosFinal.sort()
                anios=aniosFinal;
            }

            // obtener las versiones de presupuesto para cada estado
            let estados=[];
            for(let i=0;i<cuaderno.Renglones.length;i++){
                if(!estados.includes(cuaderno.Renglones[i].Estado)){
                    estados.push(cuaderno.Renglones[i].Estado);
                }
            }
            let versionesPorEstado=[];
            for(let i=0;i<estados.length;i++){
                let versionPresupuesto = {
                    estado: estados[i],
                    versiones: []
                }
                versionPresupuesto.versiones = await this.versionesPresupuesto.showByEstado(estados[i],anios);
                versionesPorEstado.push(versionPresupuesto);
            }
            cuaderno.VersionesPresupuesto=versionesPorEstado;

            // para cada renglón, obtener los datos para cada versión
            let datos=[];
            for(let i=0;i<cuaderno.Renglones.length;i++){
                let renglon=cuaderno.Renglones[i];
                let estado=renglon.Estado;
                let versionesEstado=versionesPorEstado.filter((version) => {
                    return version.estado===estado;
                });
                if(versionesEstado.length>0){
                    versionesEstado=versionesEstado[0].versiones;
                }
                        
                let row={
                    renglon: renglon.Id,
                    data: []
                };
                
                for(let j=0;j<versionesEstado.length;j++){
                    let version=versionesEstado[j];
                    let dato={
                        version: version.Id,
                        monto: null
                    }
                    
                    let resultado=[];
                    switch (renglon.Tipo){
                        case "Total":
                            switch (renglon.TipoFiltro) {
                                case "Estado":
                                    dato.monto=await this.versionesPresupuesto.getTotal(version.Id);
                                    break;

                                case "UP":
                                    resultado = await this.unidadesPresupuestales.showMontosByVersionPresupuesto(version.Id,renglon.IdFiltro);
                                    if(resultado.length>0){
                                        dato.monto=resultado[0].Monto;
                                    }
                                    break;

                                case "UR":
                                    resultado = await this.unidadesResponsables.showMontosByVersionPresupuesto(version.Id,renglon.IdFiltro);
                                    if(resultado.length>0){
                                        dato.monto=resultado[0].Monto;
                                    }
                                    break;
                            }
                            break;
                        
                        case "CapituloGasto":
                            break;
                        
                        case "ConceptoGeneral":
                            break;

                        case "PartidaGenerica":
                            break;

                        case "ObjetoGasto":
                            break;

                        case "ProgramaPresupuestal":
                            break;
                    }
                    row.data.push(dato);
                    
                }
                datos.push(row);
            }
            cuaderno.Datos=datos;
        }
        return cuaderno;
    }
}