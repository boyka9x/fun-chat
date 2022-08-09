import { UserAddOutlined } from '@ant-design/icons/lib/icons';
import { Alert, Avatar, Button, Form, Input, Tooltip } from 'antd';
import { useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../../Context/AppProvider';
import { AuthContext } from '../../Context/AuthProvider';
import { addDocument } from '../../firebase/services';
import useFirestore from '../../hooks/useFirestore';
import Message from './Message';

const HeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    height: 56px;
    padding: 0 16px;
    align-items: center;
    border-bottom: 1px solid rgba(230, 230, 230, 0.8);

    .header {
        &__info {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        &__title {
            margin: 0;
            font-weight: bold;
        }

        &__description {
            font-size: 12px;
        }
    }
`;

const ButtonGroupStyled = styled.div`
    display: flex;
    align-items: center;
`;

const WrapperStyled = styled.div`
    height: 100vh;
`;

const ContentStyled = styled.div`
    height: calc( 100% - 56px);
    display: flex;
    flex-direction: column;
    padding: 11px;
    justify-content: flex-end;
`;

const FormStyled = styled(Form)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 2px 2px 0;
    border: 1px solid rgba(230, 230, 230);
    border-radius: 2px;

    .ant-form-item {
        flex: 1;
        margin-bottom: 0px;
    }
`;

const MessageListStyled = styled.div`
    max-height: 100%;
    overflow-y: auto;
`;

export default function ChatWindow() {
    const { members, selectedRoom, setInviteMemberVisible } = useContext(AppContext);
    const { user: { uid, displayName, photoURL } } = useContext(AuthContext);
    const [inputValue, setInputValue] = useState('');
    const [form] = Form.useForm();

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }

    const handleOnSubmit = () => {
        addDocument('messages', {
            text: inputValue,
            uid,
            photoURL,
            roomId: selectedRoom.id,
            displayName
        })

        form.resetFields(['message']);
    }

    const condition = useMemo(() => ({
        fieldName: 'roomId',
        operator: '==',
        value: selectedRoom.id
    }), [selectedRoom.id])

    const messages = useFirestore('messages', condition);

    return (
        <WrapperStyled>
            {selectedRoom.id ? (<>
                <HeaderStyled>
                    <div className="header__info">
                        <p className="header__title">{selectedRoom ? selectedRoom.name : ''}</p>
                        <span className="header__description">{selectedRoom ? selectedRoom.description : ''}</span>
                    </div>
                    <ButtonGroupStyled>
                        <Button type='text' icon={<UserAddOutlined />} onClick={() => setInviteMemberVisible(true)}>Mời</Button>
                        <Avatar.Group size="small" maxCount={2}>
                            {
                                members.map(member =>
                                    <Tooltip title={member.displayName} key={member.id}>
                                        <Avatar src={member.photoURL}>{member.photoURL ? '' : member.displayName.charAt(0).toUpperCase()}</Avatar>
                                    </Tooltip>)
                            }
                        </Avatar.Group>
                    </ButtonGroupStyled>
                </HeaderStyled>
                <ContentStyled>
                    <MessageListStyled>
                        {
                            messages.map(mes => <Message
                                key={mes.id}
                                text={mes.text}
                                displayName={mes.displayName}
                                createdAt={mes.createdAt}
                                photoURL={mes.photoURL}
                            />)
                        }
                    </MessageListStyled>
                    <FormStyled form={form}>
                        <Form.Item name='message'>
                            <Input
                                onChange={handleInputChange}
                                onPressEnter={handleOnSubmit}
                                placeholder='Nhập tin nhắn...'
                                bordered={false}
                                autoComplete='off'
                                value={inputValue}
                            />
                        </Form.Item>
                        <Button type='primary' onClick={handleOnSubmit}>Gửi</Button>
                    </FormStyled>
                </ContentStyled>
            </>) : <Alert message="Select a room!" type="info" showIcon style={{ margin: 4 }} />}
        </WrapperStyled>
    )
}
