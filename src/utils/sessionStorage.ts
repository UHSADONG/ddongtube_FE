type SessionStorageObject = {   
    playlistCode: string;
    accessToken: string;
};

export const setSessionStorage = (
    {playlistCode, accessToken} : SessionStorageObject
) => {
    window.sessionStorage.setItem("playlistCode", playlistCode);
    window.sessionStorage.setItem("accessToken", accessToken);
}

export const getSessionStorage = () : SessionStorageObject | null => {
    const playlistCode = window.sessionStorage.getItem("playlistCode");
    const accessToken = window.sessionStorage.getItem("accessToken");

    if (!playlistCode || !accessToken) return null;

    return {
        playlistCode,
        accessToken,
    };
}

export const removeSessionStorage = () => {
    window.sessionStorage.removeItem("playlistCode");
    window.sessionStorage.removeItem("accessToken");
}