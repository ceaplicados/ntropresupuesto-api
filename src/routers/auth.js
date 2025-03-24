import express from 'express';
import jwt from 'jsonwebtoken';
import Google_Auth from '../services/Google_Auth.js';
import Usuarios from '../controllers/Usuarios.js';

const router = express.Router();
const usuarios=new Usuarios();

router.post("/Google",(req,res) => {
    const google_Auth = new Google_Auth();
    const credential=req.body.credential;
    
    // verificar la credencial y obtener los datos
    google_Auth.verify(credential)
    .then(
        (payload) => buscarUsuarioByGoogleId(payload) ,
        (error) => res.status(500).json({message: 'Error al verificar la credencial'})
    )

    // buscar el usuario por su Id de Google
    const buscarUsuarioByGoogleId = (payload) => {
        usuarios.getByGoogleId(payload['sub'])
            .then( 
                (usuario) => {
                    if(usuario.Id){
                        compararUsuario(usuario,payload);
                    }else{
                        buscarUsuarioByEmail(payload)
                    }
                },
                (error) => res.status(500).json({message: 'Error al consultar la BDD'})
             )
    }

    // buscar el usuario por Email (si es que no fue encontrado por el Id de Google)
    const buscarUsuarioByEmail = (payload) => {
        usuarios.getByEmail(payload['email'])
            .then(
                (usuario) => {
                    if(usuario.Id){
                        compararUsuario(usuario,payload);
                    }else{
                        // Dar de alta
                        res.status(500).json({message: 'Usuario no encontrado'})
                    }
                },
                (error) => res.status(500).json({message: 'Error al consultar la BDD'})
            )
    }

    // verificar si es necesario actualizar los datos del usuario
    const compararUsuario = (usuario,payload) => {
        if(payload['sub']!==usuario.GoogleId || payload['email']!==usuario.Email || payload['given_name']!==usuario.Nombre || payload['givefamily_namen_name']!==usuario.Apellidos || usuario.picture===null){
            usuario.GoogleId=payload['sub'];
            usuario.Email=payload['email'];
            usuario.Nombre=payload['given_name'];
            usuario.Apellidos=payload['family_name'];
            if(!usuario.picture){
                usuario.picture=payload['picture'];
            }
            usuarios.update(usuario)
            .then(
                (usuario) => {
                    iniciarSesion(usuario);
                },
                (error)  => res.status(500).json({message: 'Error al consultar la BDD'})
            )
        }else{
            iniciarSesion(usuario);
        }
    }

    // iniciar sesión
    const iniciarSesion = (usuario) => {
        const usuarioUUID=usuario.UUID
        // Generate JWT access token
        let accessToken = jwt.sign({
            user: usuarioUUID
        }, process.env.SESSION_SECRET , { expiresIn: 60 * 60  });

        return res.status(200).json({
            access_token: accessToken,
            expires_in: 60 * 60,
            token_type: "Bearer"
        })
    }
});

export default router;