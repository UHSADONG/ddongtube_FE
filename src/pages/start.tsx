import Button from "../components/common/button"
import Input from "../components/common/input"
import StartImage from "../assets/start/img_start.webp"

type Props = {}

const Start = (props: Props) => {
    return (
        <div className="h-dvh min-w-screen bg-background">
            <div className="flex flex-col max-w-2xl h-dvh mx-auto items-center justify-start bg-background px-6">
                <img src={StartImage} className="mt-[120px]" />
                <Input
                    label="닉네임"
                    type="text"
                    placeholder="닉네임을 입력해주세요"
                    value=""
                    onChange={(e) => { }}
                    className="mb-8 mt-20"
                />
                <Input
                    label="비밀번호(선택)"
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    value=""
                    onChange={(e) => { }}
                />

                <Button
                    text="시작하기"
                    onClick={() => { }}
                    disabled={false} />
            </div>
        </div>
    )
}

export default Start