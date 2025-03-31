type Props = {
    user: string;
}

const UserCardText = ({ user }: Props) => {
    return (
        <p className="w-full text-left text-text-medium-sm text-font-enabled font-semibold">{user}</p>
    )
}

export default UserCardText