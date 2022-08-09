import { useContext } from 'react';
import { Modal, Form, Input } from 'antd';
import { AppContext } from '../../Context/AppProvider';
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../Context/AuthProvider';

export default function AddRoomModal() {
    const { isAddRoomVisible, setAddRoomVisible } = useContext(AppContext);
    const { user: { uid }, } = useContext(AuthContext);
    const [form] = Form.useForm();

    const handleOk = () => {
        // handle logic
        // add new room to firestore
        addDocument('rooms', {
            ...form.getFieldValue(),
            members: [uid]
        })

        // reset form values
        form.resetFields();

        setAddRoomVisible(false);
    }

    const handleCancel = () => {
        form.resetFields();

        setAddRoomVisible(false);
    }

    return (
        <div>
            <Modal
                title='Create room'
                visible={isAddRoomVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Room name">
                        <Input placeholder="Enter room name..." />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea placeholder="Enter description..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
