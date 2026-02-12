import React, { useState } from 'react';
import { Button, Flex, Space, Table, Tag, Typography } from 'antd';
import { EnvironmentFilled, LogoutOutlined, SettingFilled } from '@ant-design/icons';
import { ContainerActions, ContainerDashboard } from './styles';
import { useAuth } from "../context/AuthContext";
import ModalStudentManagement from '../components/ModalStudentManagement';
import ModalEnvironmentManagement from '../components/ModalEnvironmentManagement';

const { Column, ColumnGroup } = Table;

interface DataType {
    key: React.Key;
    firstName: string;
    lastName: string;
    age: number;
    address: string;
    tags: string[];
}

const data: DataType[] = [
    {
        key: '1',
        firstName: 'John',
        lastName: 'Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        firstName: 'Jim',
        lastName: 'Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        firstName: 'Joe',
        lastName: 'Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [modalStudentsOpen, setModalStudentsOpen] = useState(false);
    const [modalEnvironmentsOpen, setModalEnvironmentsOpen] = useState(false);

    return (
        <ContainerDashboard>
            <ContainerActions>
                {user?.admin && <Button icon={<EnvironmentFilled />} onClick={() => setModalEnvironmentsOpen(true)}>Gestão de Ambientes</Button>}
                {user?.admin && <Button icon={<SettingFilled />} onClick={() => setModalStudentsOpen(true)}>Gestão de Alunos</Button>}
                <Button icon={<LogoutOutlined />} onClick={logout}>Sair</Button>
            </ContainerActions>
            <Typography.Title>Ocupação atual</Typography.Title>
            <Table<DataType> dataSource={data}>
                <ColumnGroup title="Name">
                    <Column title="First Name" dataIndex="firstName" key="firstName" />
                    <Column title="Last Name" dataIndex="lastName" key="lastName" />
                </ColumnGroup>
                <Column title="Age" dataIndex="age" key="age" />
                <Column title="Address" dataIndex="address" key="address" />
                <Column
                    title="Tags"
                    dataIndex="tags"
                    key="tags"
                    render={(tags: string[]) => (
                        <Flex gap="small" align="center" wrap>
                            {tags.map((tag) => {
                                let color = tag.length > 5 ? 'geekblue' : 'green';
                                if (tag === 'loser') {
                                    color = 'volcano';
                                }
                                return (
                                    <Tag color={color} key={tag}>
                                        {tag.toUpperCase()}
                                    </Tag>
                                );
                            })}
                        </Flex>
                    )}
                />
                <Column
                    title="Action"
                    key="action"
                    render={(_: any, record: DataType) => (
                        <Space size="middle">
                            <a>Invite {record.lastName}</a>
                            <a>Delete</a>
                        </Space>
                    )}
                />
            </Table>
            {modalEnvironmentsOpen && <ModalEnvironmentManagement modalOpen={modalEnvironmentsOpen} setModalOpen={setModalEnvironmentsOpen} />}
            {modalStudentsOpen && <ModalStudentManagement modalOpen={modalStudentsOpen} setModalOpen={setModalStudentsOpen} />}
        </ContainerDashboard>
    );
}