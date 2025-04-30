import { useNavigate, useParams } from "react-router";

import { ResponsiveContainer } from "@/container/responsiveContainer";

import RoundButton from "@/components/common/roundButton";

import IconError from "@/assets/error/ic_error.svg?react";

const Error = () => {

    const { code } = useParams();

    const navigate = useNavigate();

    const convertCodeToText = (code: string = "") => {
        switch (code) {
            case "PNF":
                return "잘못된 플레이리스트 코드입니다.";
            default:
                return "알 수 없는 오류입니다.";
        }
    }

    const convertCodeToButtonText = (code: string = "") => {
        switch (code) {
            case "PNF":
                return "홈으로 돌아가기";
            default:
                return "홈으로 돌아가기";
        }
    }

    const handleClick = (code: string = "") => {
        switch (code) {
            case "PNF":
                navigate("/", { replace: true });
                break;
            default:
                navigate("/"), { replace: true };
                break;
        }
    }

    return (
        <ResponsiveContainer>
            <div className="flex flex-col items-center justify-center w-full h-full">
                <IconError />
                <p className="text-head-medium-bold font-bold text-center text-white mt-3 mb-10">{convertCodeToText(code)}</p>
                <RoundButton onClick={handleClick} text={convertCodeToButtonText(code)} />
            </div>

        </ResponsiveContainer>
    )
}

export default Error