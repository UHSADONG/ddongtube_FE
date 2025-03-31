import { useSuspenseQuery } from "@tanstack/react-query"
import { useAuthCheck } from "../hooks/auth/useAuthCheck";
import { getPlaylistMeta } from "../api/playlist";
import HomeCard from "../components/home/card";
import FloatingButton from "../components/common/floatingButton";

const Home = () => {

    const { playlistCode } = useAuthCheck();

    if (!playlistCode) {
        return null;
    }

    const { data } = useSuspenseQuery({
        queryKey: ["playlist", playlistCode],
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
                <section className="flex flex-col items-start justify-center mt-[10%] w-full">
                    <div
                        className={`flex flex-col items-center justify-center w-full h-[200px] border-[1px] border-dashed rounded-md bg-fill-2 border-stroke
                                `}
                    >
                        <img
                            src={thumbnailUrl}
                            alt="Thumbnail Preview"
                            className="object-contain h-full"
                        />
                    </div>
                    <section className="flex flex-col items-start justify-center w-full">
                        <h1 className="text-head-medium-bold font-bold text-font-enabled text-left ml-1 mt-5">
                            {title}
                        </h1>
                        <p className="text-text-medium-md text-font-disabled ml-1 font-medium">{"플레이리스트 설명"}</p>
                    </section>
                </section>
                <div className="flex flex-col items-start justify-center mt-8 w-full">
                    <label className="text-head-medium-bold font-bold text-font-enabled text-left ml-1 mt-5 mb-3">주인장</label>
                    <HomeCard user={owner} />
                    <label className="text-head-medium-bold font-bold text-font-enabled text-left ml-1 mt-5 mb-3" >{`파티원(${userList.length})`}</label>
                    {
                        userList.length === 0 ? (
                            <p className="w-full text-left text-text-medium-sm text-font-disabled font-medium ml-1">{"파티원이 없습니다."}</p>

                        ) :
                            <div className="flex flex-col items-start justify-center w-full gap-y-3">
                                {userList.map((user, index) => (
                                    <HomeCard key={index} user={user} />
                                ))}
                            </div>
                    }
                </div>
                <FloatingButton text="플레이리스트 보러가기" onClick={() => { }} />
            </div>
        </div >
    )
}

export default Home