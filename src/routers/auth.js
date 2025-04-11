import express from 'express';
import jwt from 'jsonwebtoken';
import Google_Auth from '../services/Google_Auth.js';
import Usuarios from '../controllers/Usuarios.js';
import Usuario  from '../models/Usuario.js';
import Sessions from '../controllers/Sessions.js';
import Session from '../models/Session.js';

const router = express.Router();
const usuarios=new Usuarios();
const sessions=new Sessions();

router.post("/Google",(req,res) => {
    const google_Auth = new Google_Auth();
    const credential=req.body.credential;

    // verificar la credencial y obtener los datos
    google_Auth.verify(credential.credential)
    .then(
        (payload) => buscarUsuarioByGoogleId(payload) ,
        (error) => {
            console.log(error);
            res.status(500).json({message: 'Error al verificar la credencial'})
        }
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
                        crearUsuario(payload);
                    }
                },
                (error) => res.status(500).json({message: 'Error al consultar la BDD'})
            )
    }

    // verificar si es necesario actualizar los datos del usuario
    const compararUsuario = (usuario,payload) => {
        if(payload['sub']!==usuario.GoogleId || payload['email']!==usuario.Email || payload['given_name']!==usuario.Nombre || payload['family_name']!==usuario.Apellidos || usuario.picture===null){
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

    // verificar si es necesario actualizar los datos del usuario
    const crearUsuario = (payload) => {
        let usuario=new Usuario();
        usuario.Nombre=payload['given_name'];
        usuario.Apellidos=payload['family_name'];
        usuario.Sobrenombre=payload['given_name'];
        usuario.Email=payload['email'];
        usuario.Image=payload['picture'];
        usuario.GoogleId=payload['sub'];
        usuarios.create(usuario)
        .then(
            (usuario) => {
                iniciarSesion(usuario);
            },
            (error)  => res.status(500).json({message: 'Error al consultar la BDD'})
        )
    }

    // iniciar sesión
    const iniciarSesion = (usuario) => {
        const usuarioUUID=usuario.UUID
        // Generate JWT access token
        let accessToken = jwt.sign(
            { user: usuarioUUID }, 
            process.env.SESSION_SECRET, 
            { expiresIn: '30s' }
        );

        let refreshToken = jwt.sign(
            { user: usuarioUUID }, 
            process.env.REFRESH_SECRET, 
            { expiresIn: '1d' }
        );

        let DateDeath=new Date();
        DateDeath.setDate(DateDeath.getDate() + 1);

        let session=new Session();
        session.UID=refreshToken;
        session.Usuario=usuario.Id;
        session.DateDeath=DateDeath.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        sessions.create(session)
            .then(
                (session) => {
                    res.cookie('jwt',refreshToken, {httpOnly: true, sameSite : 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});

                    return res.status(200).json({
                        access_token: accessToken,
                        expires_in: 60 * 60,
                        token_type: "Bearer"
                    })
                },
                (error)  => res.status(500).json({message: 'Error al consultar la BDD'})
            )

        
    }
});

router.get("/refresh", (req,res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({message: 'Missing token'})
    const refreshToken = cookies.jwt;
    sessions.getByUID(refreshToken)
    .then(
        (session) => {
            if(session.Id){
                jwt.verify(
                    refreshToken,
                    process.env.REFRESH_SECRET,
                    (err, decoded) => {
                        if (err || session.Usuario !== decoded.user) return res.status(403).json({message: 'Corrupted token'});
                        const accessToken = jwt.sign(
                            { user: decoded.user }, 
                            process.env.SESSION_SECRET, 
                            { expiresIn: '30s' }
                        );
                        return res.status(200).json({
                            access_token: accessToken,
                            expires_in: 60 * 60,
                            token_type: "Bearer"
                        })
                    }
                );
            }else{
                res.status(403).json({message: 'Not valid token'})
            }
        },
        (error)  => res.status(500).json({message: 'Error al consultar la BDD'})
    )
});

export default router;