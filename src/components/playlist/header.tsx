
import IconHome from "@/assets/playlist/ic_home.svg?react";
import { getSessionStorage } from '@/utils/sessionStorage';
import { useAuthCheck } from '@/hooks/auth/useAuthCheck';

type HeaderProps = {
    isLive: boolean;
    listenerCount: number;
}

const Header = ({ isLive, listenerCount }: HeaderProps) => {

    const { navigate } = useAuthCheck();

    return (
        <nav className="relative flex items-center justify-center mt-[10%] py-3 w-full">
            <div className="absolute left-0" onClick={() => navigate("/home")}>
                <IconHome />
            </div>
            <div className="flex-1 flex-row w-full text-center justify-center items-center inline-block">
                <h1 className={`text-text-medium-sm font-bold text-center transition-colors duration-300 text-main`}>
                    {`${getSessionStorage()?.nickname}님${isLive ? '과' : '은'}`}
                </h1>
                <h1 className={`text-text-medium-sm font-semibold text-center transition-colors duration-300 text-font-disabled`}>
                    {isLive ? `${listenerCount}명이 같이 듣고 있어요!` : '실시간이 아닙니다.'}
                </h1>
            </div>
        </nav>
    )
}

export default Header;