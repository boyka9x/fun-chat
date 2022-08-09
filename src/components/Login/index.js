import React from 'react';
import { Row, Col, Button, Typography } from 'antd';
import { signInWithPopup, FacebookAuthProvider, getAdditionalUserInfo } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { addDocument, generateKeywords } from '../../firebase/services';

const { Title } = Typography;


export default function Login() {

    const handleFbLogin = () => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
            .then((res) => {
                const { user } = res;
                const additionalUserInfo = getAdditionalUserInfo(res);

                if (additionalUserInfo?.isNewUser) {
                    console.log('Done')
                    addDocument('users', {
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        uid: user.uid,
                        providerId: additionalUserInfo.providerId,
                        keywords: generateKeywords(user.displayName)
                    });
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div>
            <Row justify="center" style={{ height: 800 }}>
                <Col span={8}>
                    <Title style={{ textAlign: 'center' }} level={3}>Fun Chat</Title>
                    <Button style={{ width: '100%', marginBottom: 5 }}>
                        Đăng nhập bằng Google
                    </Button>
                    <Button style={{ width: '100%' }} onClick={handleFbLogin}>
                        Đăng nhập bằng Facebook
                    </Button>
                </Col>
            </Row>
        </div>
    )
}
