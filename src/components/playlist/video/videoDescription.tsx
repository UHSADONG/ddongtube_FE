import Card from '@/components/common/card';

type VideoDescriptionProps = {
    description?: string | undefined;
}

const VideoDescription = ({
    description
}: VideoDescriptionProps) => {
    return (
        <Card>
            <p className="text-text-medium-md font-medium text-font-enabled">
                {description === "" || !description ? "상세 설명이 없습니다." : description}
            </p>
        </Card>
    )
}

export default VideoDescription