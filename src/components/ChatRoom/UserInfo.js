import { Avatar, Button, Typography } from 'antd'
import { useContext } from 'react';
import styled from 'styled-components';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { AuthContext } from '../../Context/AuthProvider';


const WrapperStyled = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(82, 38, 83, 0.5);
    height: 56px;

    .username {
        color: white;
        margin-left: 5px;
    }
`;

export default function UserInfo() {
    const { user: { displayName, photoURL} } = useContext(AuthContext);


    return (
        <WrapperStyled>
            <div>
                <Avatar src={photoURL}>{photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}</Avatar>
                <Typography.Text className="username">{ displayName }</Typography.Text>
            </div>
            <Button
                ghost
                onClick={() => {
                    signOut(auth)
                        .then(() => console.log('Sign-out successful!'))
                        .catch((err) => console.log(err.message))
                }}
            >
                Đăng xuất
            </Button>
        </WrapperStyled>
    )
}
