import { useEffect } from 'react'
import { useNavigate } from 'react-router';
import { getSessionStorage, removeSessionStorage } from '@/utils/sessionStorage';

export const useAuthCheck = () => {

    const navigate = useNavigate();
    const storage = getSessionStorage();
    
    useEffect(() => {
        if (!storage || !storage?.playlistCode) {
            removeSessionStorage();
            navigate("/start", { replace: true });
        }
    }, []);

    return {
        navigate : (url : string) => {
            navigate(url, { replace: true });
        },
        authCheck: storage ? true : false,
        playlistCode : storage?.playlistCode ?? null,
        accessToken : storage?.accessToken,
        isAdmin : storage?.isAdmin,
        nickname : storage?.nickname,
    }
}   