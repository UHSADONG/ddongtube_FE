export const checkYoutubeVideoExists = async (url: string): Promise<boolean> => {
    try {
        const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
        const res = await fetch(oEmbedUrl);
        return res.ok;
    } catch {
        return false;
    }
};

export const extractYoutubeVideoId = (url: string): string | null => {
    const match = url.match(/(?:v=|youtu\.be\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
};

export const validateYoutubeUrlFormat = (url: string): boolean => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
    return regex.test(url);
};