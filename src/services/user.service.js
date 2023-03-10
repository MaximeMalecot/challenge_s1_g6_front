import { API_URL } from '../constants/urls';
import authHeader from './auth.header';

class UserService {

    async getUsers(){
        try{
            const res = await fetch(`${API_URL}/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader()
                }
            });
            if(res.status === 200){
                return await res.json();
            }else{
                return false;
            }
        }catch(e){
            console.error(e.message);
            return false;
        }
    }

    async getSelfUser(id){
        try{
            const res = await fetch(`${API_URL}/users/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader()
                }
            });
            if(res.status === 200){
                return await res.json();
            }else{
                return false;
            }
        }catch(e){
            console.error(e.message);
            return false;
        }
    }

    async updateUser(id, payload){
        try{
            const res = await fetch(`${API_URL}/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader()
                },
                body: JSON.stringify(payload)
            });
            if(res.status === 200){
                return await res.json();
            }else{
                return false;
            }
        }catch(e){
            console.error(e.message);
            return false;
        }
    }

    async modifyPwd(id, payload){
        try{
            const res = await fetch(`${API_URL}/users/modify_password/${id}`, {
                method: "Patch",
                headers: {
                    "Content-Type": "application/merge-patch+json",
                    ...authHeader()
                },
                body: JSON.stringify(payload)
            });
            if(res.status === 200){
                return await res.json();
            }else{
                return false;
            }
        }catch(e){
            console.error(e.message);
            return false;
        }
    }

    async submitKYC(siret){
        try{
            const res = await fetch(`${API_URL}/freelancer_infos/kyc`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader()
                },
                body: JSON.stringify({siret})
            });
            if(res.status === 202){
                return await res.json();
            }else{
                return false;
            }
        }catch(e){
            console.error(e.message);
            return false;
        }
    }

    async verifyAccount(payload){
        try{
            const res = await fetch(`${API_URL}/users/verify_email`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json",
                    ...authHeader()
                },
                body: JSON.stringify(payload)
            });
            if(res.status === 204){
                return true;
            }else{
                return false;
            }
        }catch(e){
            console.error(e.message);
            return false;
        }
    }

    async resetPassword(payload){
        try{
            const res = await fetch(`${API_URL}/users/update_password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json",
                    ...authHeader()
                },
                body: JSON.stringify(payload)
            });
            if(res.status === 204){
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

export default new UserService();