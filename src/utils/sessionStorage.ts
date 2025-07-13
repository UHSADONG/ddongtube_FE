import { NullableType } from '@/types/common';
import { StorageObject } from '@/types/storage';

type SessionStorageObject = StorageObject<NullableType<string>>;

type UnSerializedSessionStorageObject = {
  playlistCode: string;
  accessToken: string;
  isAdmin: boolean;
  nickname: string;
};

export const setSessionStorage = ({
  playlistCode,
  accessToken,
}: Omit<SessionStorageObject, 'isAdmin' | 'nickname'>) => {
  window.sessionStorage.setItem('playlistCode', playlistCode ?? '');
  window.sessionStorage.setItem('accessToken', accessToken ?? '');
};

export const addSessionStorage = (key: string, value: string) => {
  window.sessionStorage.setItem(key, value);
};

export const getSessionStorage = (): UnSerializedSessionStorageObject | null => {
  const playlistCode = window.sessionStorage.getItem('playlistCode');
  const accessToken = window.sessionStorage.getItem('accessToken');
  const isAdmin = window.sessionStorage.getItem('isAdmin');
  const nickname = window.sessionStorage.getItem('nickname');

  if (!playlistCode || !accessToken || !isAdmin || !nickname) return null;

  return {
    playlistCode,
    accessToken,
    isAdmin: isAdmin === 'true',
    nickname,
  };
};

export const removeSessionStorage = () => {
  window.sessionStorage.clear();
};
