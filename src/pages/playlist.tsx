import { useSuspenseQuery } from "@tanstack/react-query";
import ImageViewer from "../components/common/imageViewer"
import PlaylistDescription from "../components/common/playlistDescription"
import { ResponsiveContainer } from "../container/responsiveContainer"
import { useAuthCheck } from "../hooks/auth/useAuthCheck";
import { getPlaylistMeta } from "../api/playlist";
import Card from "../components/common/card";
import FloatingButton from "../components/common/floatingButton";


import IconHome from "../assets/playlist/ic_home.svg?react";
import PlayNext from "../assets/playlist/ic_play_next.svg?react";
import IconHamburgerDisabled from "../assets/playlist/ic_hamburger_disabled.svg?react";

const Playlist = () => {

    const { navigate, playlistCode } = useAuthCheck();

    if (!playlistCode) {
        return null;
    }

    const { data } = useSuspenseQuery({
        queryKey: ["playlist", playlistCode],
        queryFn: () => getPlaylistMeta(playlistCode),
    });

    const {
        thumbnailUrl,
        title,
        owner,
        userList,
    } = data.result;

    return (
        <ResponsiveContainer>
            <nav className="relative flex items-center justify-center mt-[10%] py-3 w-full">
                <div className="absolute left-0" onClick={() => navigate('/home')}>
                    <IconHome />
                </div>
                <h1 className="text-text-medium-sm font-semibold text-font-disabled text-center">
                    23명이 함께 보고 있어요!
                </h1>
            </nav>
            <section key={`${playlistCode}-image`} className="flex flex-col items-start justify-center w-full mt-3 mb-8">
                <ImageViewer src={thumbnailUrl} />
                <div className="flex flex-row items-end justify-center w-full my-3">
                    <PlaylistDescription title={title} description="플레이리스트 설명" />
                    <PlayNext />
                </div>
                <Card>
                    <p className="text-text-medium-md font-medium text-font-enabled">바쿠고 카츠키는 신이 맞다. 그를 숭배해야만해.. 무조건.. 무조건 숭배해야만해 어? 알겠냐고?? 어어어?? 진짜</p>
                </Card>
            </section>
            <div className="flex flex-col items-start justify-center w-full">
                <nav className="flex flex-row items-start justify-center w-full">
                    <label className="w-full text-head-medium-bold font-bold text-font-enabled text-left ml-1 mt-5 mb-3">재생목록</label>
                </nav>
                <Card>
                    <section className="flex flex-row items-center justify-between w-full">
                        <article className="flex flex-col items-start justify-center w-full text-left flex-1">
                            <p className={`text-font-disabled text-text-medium-md font-medium`}>닉네임</p>
                            <h1 className={`text-font-disabled text-text-large-bold font-bold`}>플리 제목</h1>
                        </article>
                        <IconHamburgerDisabled />
                    </section>
                </Card>
            </div>
            <FloatingButton text="영상 추가하기" onClick={() => { }} />
        </ResponsiveContainer>
    )
}

export default Playlist