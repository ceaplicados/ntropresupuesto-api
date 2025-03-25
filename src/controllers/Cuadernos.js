import connection from '../../config/db.conf.js';
import Cuaderno from '../models/Cuaderno.js';
import Usuario from '../models/Usuario.js';
export default class Usuarios {
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
            return result;
        }catch (err) {
            console.log(err);
        }
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
            return result;
        }catch (err) {
            console.log(err);
        }
    }
}