import connection from '../../config/db.conf.js';
import Usuario from '../models/Usuario.js';
import { v4 as uuidv4 } from 'uuid';

export default class Usuarios {
    async getByEmail (email) {
        let usuario=new Usuario();
        try {
            let query='SELECT * FROM `Usuarios` WHERE `Email` = ?';
            let params=[email];
            
            const [results] = await connection.query(
                query,
                params)

            let result=results.map((row) => {
                let usuario=new Usuario();
                usuario.Id  = row.Id
                usuario.UUID  = row.UUID
                usuario.Nombre = row.Nombre
                usuario.Apellidos = row.Apellidos
                usuario.Sobrenombre = row.Sobrenombre
                usuario.Email = row.Email
                usuario.Password = row.Password
                usuario.Estado = row.Estado
                if(row.Activo===0){
                    usuario.Activo=false
                }
                usuario.ResetKey = row.ResetKey
                usuario.Image = row.Image
                usuario.GoogleId = row.GoogleId
                usuario.Admin = false
                if(row.Admin===1){
                    usuario.Admin=true
                }
                return usuario;
            });
            
            if(result.length>0){
                usuario=result[0];
            }
            
            return usuario;
        } catch (err) {
            console.log(err);
        }
    }

    async getByGoogleId (googleId) {
        let usuario=new Usuario();
        try {
            let query='SELECT * FROM `Usuarios` WHERE `GoogleId` = ?';
            let params=[googleId];
            
            const [results] = await connection.query(
                query,
                params)

            let result=results.map((row) => {
                let usuario=new Usuario();
                usuario.Id  = row.Id
                usuario.UUID  = row.UUID
                usuario.Nombre = row.Nombre
                usuario.Apellidos = row.Apellidos
                usuario.Sobrenombre = row.Sobrenombre
                usuario.Email = row.Email
                usuario.Password = row.Password
                usuario.Telefono = row.Telefono
                usuario.Estado = row.Estado
                if(row.Activo===0){
                    usuario.Activo=false
                }
                usuario.ResetKey = row.ResetKey
                usuario.Image = row.Image
                usuario.GoogleId = row.GoogleId
                usuario.Admin = false
                if(row.Admin===1){
                    usuario.Admin=true
                }
                return usuario;
            });
            
            if(result.length>0){
                usuario=result[0];
            }
            
            return usuario;
        } catch (err) {
            console.log(err);
        }
    }

    async getByUUID (uuid) {
        let usuario=new Usuario();
        try {
            let query='SELECT * FROM `Usuarios` WHERE `UUID` = ?';
            let params=[uuid];
            
            const [results] = await connection.query(
                query,
                params)

            let result=results.map((row) => {
                let usuario=new Usuario();
                usuario.Id  = row.Id
                usuario.UUID  = row.UUID
                usuario.Nombre = row.Nombre
                usuario.Apellidos = row.Apellidos
                usuario.Sobrenombre = row.Sobrenombre
                usuario.Email = row.Email
                usuario.Telefono = row.Telefono
                usuario.Password = row.Password
                usuario.Estado = row.Estado
                if(row.Activo===0){
                    usuario.Activo=false
                }
                usuario.ResetKey = row.ResetKey
                usuario.Image = row.Image
                usuario.GoogleId = row.GoogleId
                usuario.Admin = false
                if(row.Admin===1){
                    usuario.Admin=true
                }
                return usuario;
            });
            
            if(result.length>0){
                usuario=result[0];
            }
            
            return usuario;
        } catch (err) {
            console.log(err);
        }
    }

    async update (usuario) {
        try {
            let query='UPDATE `Usuarios` SET `Nombre` = ?, `Apellidos` = ?, `Sobrenombre` = ?, `Image` = ?, `GoogleId` = ?, `Estado` = ?, `Email` = ?, `Telefono` = ? WHERE `Id` = ?';
            let params=[
                usuario.Nombre,
                usuario.Apellidos,
                usuario.Sobrenombre,
                usuario.Image,
                usuario.GoogleId,
                usuario.Estado,
                usuario.Email,
                usuario.Telefono,
                usuario.Id
            ];
            
            const [results] = await connection.query(
                query,
                params)            

            return usuario;
        } catch (err) {
            console.log(err);
        }
    }

    async create (usuario) {
        try {
            let DateBorn=new Date()
            usuario.DateBorn=DateBorn.toISOString().replace(/T/, ' ').replace(/\..+/, '');
            usuario.UUID=uuidv4();
            let query='INSERT INTO `Usuarios` (`UUID`, `Nombre`, `Apellidos`, `Sobrenombre`, `Image`, `GoogleId`, `Estado`, `Email`, `Telefono`, `DateBorn`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
            let params=[
                usuario.UUID,
                usuario.Nombre,
                usuario.Apellidos,
                usuario.Sobrenombre,
                usuario.Image,
                usuario.GoogleId,
                usuario.Estado,
                usuario.Email,
                usuario.Telefono,
                usuario.DateBorn
            ];
            
            const [results] = await connection.query(
                query,
                params)            
            
            console.log(results);
            usuario.Id=results.insertId;
            return usuario;
        } catch (err) {
            console.log(err);
        }
    }
}