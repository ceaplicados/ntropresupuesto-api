import express from 'express';
import Google_Auth from '../services/Google_Auth.js';
import Usuarios from '../controllers/Usuarios.js';

const router = express.Router();
const usuarios=new Usuarios();
/*
async function verify(token) {
    
    

    
    
    if(usuario.Id){
        if(userid!==usuario.GoogleId || email!==usuario.Email || given_name!==usuario.Nombre || family_name!==usuario.Apellidos || usuario.picture===null){
            usuario.GoogleId=usuario;
            usuario.Email=email;
            usuario.Nombre=given_name;
            usuario.Apellidos=family_name;
            if(!usuario.picture){
                usuario.picture=picture;
            }
            //usuarios.update(usuario);
        }
    }
}
*/

const comparePayloadGoogle = (usuario, payload) => {
    let res=false;
    if(usuario.Id){
        if(payload['sub']!==usuario.GoogleId || payload['email']!==usuario.Email || payload['given_name']!==usuario.Nombre || payload['givefamily_namen_name']!==usuario.Apellidos || usuario.picture===null){
            res=true;
        }
    }else{
        res =true;
    }
    return res;
}

router.post("/Google",(req,res) => {
    const google_Auth = new Google_Auth();
    const credential=req.body.credential;
    
    google_Auth.verify(credential)
    .then(
        (payload) => {
            const userid = payload['sub']
            const email = payload['email']
            
            usuarios.getByGoogleId(userid)
            .then(
                (usuario) => {
                    if(usuario.Id){
                        if(comparePayloadGoogle(usuario,payload)){
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
                                    res.status(200).json(usuario)
                                },
                                (error)  => res.status(500).json({message: 'Error al consultar la BDD'})
                            )
                        }else{
                            res.status(200).json(usuario)
                        }
                    }else{
                        usuarios.getByEmail(email)
                        .then((usuario) => {
                                if(comparePayloadGoogle(usuario,payload)){
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
                                            res.status(200).json(usuario)
                                        },
                                        (error)  => res.status(500).json({message: 'Error al consultar la BDD'})
                                    )
                                }else{
                                    res.status(200).json(usuario)
                                }
                                
                            },
                            (error)  => res.status(500).json({message: 'Error al consultar la BDD'})
                        )
                    }
                },
                (error) => res.status(500).json({message: 'Error al consultar la BDD'})
            )
        },
        (error) => res.status(500).json({message: 'Error al verificar la credencial'})
    )
});

export default router;