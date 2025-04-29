import { useNavigate } from "react-router";
import RoundButton from "@/components/common/roundButton";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="h-dvh min-w-screen bg-background overflow-hidden fixed inset-0 flex flex-col items-center justify-center">
      <h1 className="text-9xl font-bold text-white">404</h1>
      <p className="text-white text-text-medium-md mt-4 mb-10">존재하지 않는 페이지입니다.</p>
      <RoundButton onClick={() => navigate("/", { replace: true })} text={'홈으로 돌아가기'} />
    </div>
  )
}

export default NotFound