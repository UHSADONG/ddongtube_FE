import { useSuspenseQuery } from "@tanstack/react-query"
import { useAuthCheck } from "../hooks/auth/useAuthCheck";
import { getPlaylistMeta } from "../api/playlist";
import Card from "../components/common/card";
import FloatingButton from "../components/common/floatingButton";
import ImageViewer from "../components/common/imageViewer";
import PlaylistDescription from "../components/common/playlistDescription";
import UserCardText from "../components/user/userCardText";

const Home = () => {

    const { navigate, playlistCode } = useAuthCheck();

    if (!playlistCode) {
        return null;
    }

    const { data } = useSuspenseQuery({
        queryKey: ["playlistMeta", playlistCode],
        queryFn: () => getPlaylistMeta(playlistCode),
    })

    const {
        thumbnailUrl,
        title,
        owner,
        userList,
    } = data.result;


    return (
        <div className="relative h-dvh min-w-screen bg-background overflow-hidden">
            <div className="flex flex-col max-w-[448px] h-dvh mx-auto items-center justify-start bg-background px-6">
                <section key={`${playlistCode}-image`} className="flex flex-col items-start justify-center mt-[10%] w-full">
                    <ImageViewer src={thumbnailUrl} />
                    <PlaylistDescription title={title} description="플레이리스트 설명" />
                </section>
                <div className="flex flex-col items-start justify-center mt-8 w-full overflow-y-scroll mb-[20%]">
                    <label className="text-head-medium-bold font-bold text-font-enabled text-left ml-1 mt-5 mb-3">주인장</label>
                    <Card>
                        <UserCardText user={owner} />
                    </Card>
                    <label className="text-head-medium-bold font-bold text-font-enabled text-left ml-1 mt-5 mb-3" >{`파티원(${userList.length})`}</label>
                    {
                        userList.length === 0 ? (
                            <p className="w-full text-left text-text-medium-sm text-font-disabled font-medium ml-1">{"파티원이 없습니다."}</p>

                        ) :
                            <div className="flex flex-col items-start justify-center w-full gap-y-3">
                                {userList.map((user, index) => (
                                    <Card key={index}>
                                        <UserCardText user={user} />
                                    </Card>
                                ))}
                            </div>
                    }
                </div>
                <FloatingButton
                    playlistCode={playlistCode}
                    playlistMeta={data.result}
                    text="플레이리스트 보러가기" onMusicButtonClick={() => { navigate('/playlist') }} />
            </div>
        </div >
    )
}

export default Home