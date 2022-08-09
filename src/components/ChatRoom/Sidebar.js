import { Col, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
import UserInfo from './UserInfo';
import RoomList from './RoomList';

const SidebarStyled = styled.div`
    background: #3f0e40;
    color: withe;
    height: 100vh;
`;

export default function Sidebar() {
    return (
        <SidebarStyled>
            <Row>
                <Col span={24}><UserInfo /></Col>
                <Col span={24}><RoomList /></Col>
            </Row>
        </SidebarStyled>
    )
}
