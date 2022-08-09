import { PlusSquareOutlined } from '@ant-design/icons/lib/icons';
import { Button, Collapse, Typography } from 'antd'
import { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../../Context/AppProvider';

const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
    &&& {
        .ant-collapse-header, p {
            color: white;
        }

        .ant-collapse-content-box {
            padding: 0 40px;
        }

        .add-room {
            color: white;
            padding 0;
        }
    }
`;

const LinkStyled = styled(Typography.Link)`
    display: block;
    margin-bottom: 5px;
    color: white;
`;

export default function RoomList() {
    const { rooms, setAddRoomVisible, setSelectedRoomId } = useContext(AppContext);

    const handleAddRoom = () => {
        setAddRoomVisible(true);
    }

    return (
        <Collapse defaultActiveKey={['1']} ghost>
            <PanelStyled header="Danh sách các phòng" key='1'>
                {rooms.map((room) => (
                    <LinkStyled
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                    >
                        {room.name}
                    </LinkStyled>)
                )}
                <Button type='text' icon={<PlusSquareOutlined />} className='add-room' onClick={handleAddRoom}>Thêm phòng</Button>
            </PanelStyled>
        </Collapse>
    )
}
