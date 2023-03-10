import { API_URL } from '../constants/urls';

class AuthService {
    async login(email, password){
        try{
            const res = await fetch(`${API_URL}/authentication_token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email, password})
            });
            if(res.status === 200){
                return res.json();
            }else{
                return false;
            }
        }catch(e){
            console.error(e.message);
            return false;
        }
    }

    async signup(payload){
        try{
            const res = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            if(res.status === 201){
                return true;
            }else{
                return false;
            }
        }catch(e){
            console.error(e.message);
            return false;
        }
    }

    async forgotPassword(payload){
        try{
            const res = await fetch(`${API_URL}/users/forgot_password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json"
                },
                body: JSON.stringify(payload)
            });
            console.log(res);
            if(res.status === 202){
                return true;
            }else{
                return false;
            }
        }catch(e){
            console.error(e.message);
            return false;
        }
    }

}

export default new AuthService();