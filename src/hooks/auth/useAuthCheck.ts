import { useEffect } from 'react'
import { getSessionStorage, removeSessionStorage } from '../../utils/sessionStorage';
import { useNavigate } from 'react-router';

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
        playlistCode : storage?.playlistCode!,
        accessToken : storage?.accessToken,
    }
}   