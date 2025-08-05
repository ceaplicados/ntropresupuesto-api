import pool from '../../config/db.conf.js';
import Session from '../models/Session.js';

export default class Sessions {
    async getByUID (UID) {
        let session = new Session();
        try {
            let DateDeath=new Date()
            DateDeath=DateDeath.toISOString().replace(/T/, ' ').replace(/\..+/, '');
            const query='SELECT `Sessions`.*, `Usuarios`.UUID as UserUUID '
                +' FROM `Sessions` JOIN `Usuarios` ON `Usuarios`.`Id`=`Sessions`.`Usuario` '
                +' WHERE `UID`=? AND DateDeath>=?';
            const params=[UID,DateDeath]

            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);

            let result = results.map((row) => {
                let session = new Session();
                session.Id  = row.Id;
                session.UID  = row.UID;
                session.Usuario = row.UserUUID;
                session.Cliente = row.Cliente;
                session.DateBorn = row.DateBorn;
                session.DateDeath = row.DateDeath;
                session.IP = row.IP;
                session.Agent = row.Agent;
                return session;
            });
            if(result.length>0){
                session=result[0];
            }
        } catch (err) {
            console.log(err);
        }
        return session;
    }

    async create (session) {
        try {
            let DateBorn=new Date()
            session.DateBorn=DateBorn.toISOString().replace(/T/, ' ').replace(/\..+/, '');
            let query='INSERT INTO `Sessions` (`UID`, `Usuario`, `Cliente`, `DateBorn`, `DateDeath`, `IP`, `Agent`) VALUES (?, ?, ?, ?, ?, ?, ?);';
            let params=[
                session.UID, 
                session.Usuario , 
                session.Cliente, 
                session.DateBorn, 
                session.DateDeath, 
                session.IP, 
                session.Agent
            ];
            
            const connection = await pool.getConnection();
            const [results] = await connection.query(
                query,
                params);
            pool.releaseConnection(connection);          
            
                session.Id=results.insertId;
            return session;
        } catch (err) {
            console.log(err);
        }
    }

    async updateDateDeath (session) {
        try {
            let query='UPDATE `Sessions` SET `DateDeath` = ? WHERE `Id` = ?';
            let params=[
                session.DateDeath,
                session.Id
            ];
            
            const connection = await pool.getConnection();
            const [results] = await connection.query(
                query,
                params);
            pool.releaseConnection(connection);            
            if(results.affectedRows===0){
                return null;
            }
            return session;
        } catch (err) {
            console.log(err);
        }
    }
}