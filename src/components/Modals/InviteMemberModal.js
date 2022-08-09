import { Modal, Form, Select, Spin, Avatar } from 'antd';
import { collection, doc, getDocs, limit, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { debounce } from 'lodash';
import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../Context/AppProvider";
import { db } from '../../firebase/config';

function DebounceSelect({ fetchOptions, debounceTimeout = 300, curMembers, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value, curMembers)
                .then((newOptions) => {
                    setOptions(newOptions);
                    setFetching(false);
                })
                .catch(err => console.log(err.message));
        }

        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions, curMembers]);

    useEffect(() => {

        return () => {
            setOptions([])
        }
    }, []);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size='small' /> : null}
            {...props}
        >
            {options.map((opt) => (
                <Select.Option key={opt.value} value={opt.value} title={opt.label}>
                    <Avatar size='small' src={opt.photoURL}>
                        {opt.photoURL ? '' : opt.label?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    {` ${opt.label}`}
                </Select.Option>
            ))}
        </Select>
    );
}

async function fetchUserList(search, curMembers) {
    const usersRef = collection(db, 'users');

    const q = query(
        usersRef,
        where('keywords', 'array-contains', search),
        orderBy('displayName'),
        limit(20)
    );

    const docSnap = await getDocs(q);

    return (
        docSnap.docs.map(doc => ({
            label: doc.data().displayName,
            value: doc.data().uid,
            photoURL: doc.data().photoURL,
        })).filter(opt => !curMembers.includes(opt.value))
    )
}

export default function InviteMemberModal() {
    const { isInviteMemberVisible, setInviteMemberVisible, selectedRoomId, selectedRoom } = useContext(AppContext);
    const [value, setValue] = useState();
    const [form] = Form.useForm();

    const handleOk = () => {
        // update members in  current room
        const roomRef = doc(db, 'rooms', selectedRoomId);

        updateDoc(roomRef, {
            members: [...selectedRoom.members, ...value.map(val => val.value)]
        })

        form.resetFields();
        setInviteMemberVisible(false);
    }


    const handleCancel = () => {
        form.resetFields();
        setInviteMemberVisible(false);
    }

    console.log(selectedRoom)

    return (
        <div>
            <Modal
                title='Create room'
                visible={isInviteMemberVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <DebounceSelect
                        mode="multiple"
                        label="Members"
                        value={value}
                        placeholder="Enter member name..."
                        fetchOptions={fetchUserList}
                        onChange={(newValue) => setValue(newValue)}
                        style={{ width: '100%' }}
                        curMembers={selectedRoom.members}
                    />
                </Form>
            </Modal>
        </div>
    )
}
