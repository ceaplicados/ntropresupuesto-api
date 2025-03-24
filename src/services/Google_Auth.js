import {OAuth2Client} from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config({ path: '../../config/config.env' });

const client = new OAuth2Client();
export default class Google_Auth {
    async verify (token) {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, 
        });
        const payload = ticket.getPayload();
        return payload;
    }
}