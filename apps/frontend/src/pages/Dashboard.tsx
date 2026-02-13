import { useEffect, useState } from 'react';
import { Button, notification, Table, Typography } from 'antd';
import { EnvironmentFilled, LogoutOutlined, ReloadOutlined, SettingFilled } from '@ant-design/icons';
import { ContainerActions, ContainerDashboard } from './styles';
import { useAuth } from "../context/AuthContext";
import ModalStudentManagement from '../components/ModalStudentManagement';
import ModalEnvironmentManagement, { type Environment } from '../components/ModalEnvironmentManagement';
import { getEnvironments } from '../api/environment.reqs';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Environment[]>([]);
    const [modalStudentsOpen, setModalStudentsOpen] = useState(false);
    const [modalEnvironmentsOpen, setModalEnvironmentsOpen] = useState(false);

    const fetchEnvironments = async () => {
        setLoading(true);
        try {
            const response = await getEnvironments();
            setData(response.data);
        } catch (error) {
            notification.error({
                title: "Erro ao buscar ambientes",
                description: "",
                placement: "topRight",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnvironments();
    }, []);

    const columns = [
        {
            title: "Descrição",
            dataIndex: "description"
        },
        {
            title: "Limite de ocupação",
            dataIndex: "occupancyLimit",
            render: (value: number) => value || 'Sem limite de ocupação'
        },
        {
            title: "Ocupação atual",
            dataIndex: "currentOccupancy",
            render: (value: number) => value || 'Ambiente vazio'
        }
    ];

    return (
        <ContainerDashboard>
            <ContainerActions>
                {user?.admin && <Button icon={<EnvironmentFilled />} onClick={() => setModalEnvironmentsOpen(true)}>Gestão de Ambientes</Button>}
                {user?.admin && <Button icon={<SettingFilled />} onClick={() => setModalStudentsOpen(true)}>Gestão de Alunos/Usuários</Button>}
                <Button icon={<LogoutOutlined />} onClick={logout}>Sair</Button>
            </ContainerActions>
            <Typography.Title>Ocupação atual dos ambientes</Typography.Title>
            <Table
                rowKey="id"
                style={{ minWidth: "60vw" }}
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={false}
            />
            <Button title='Recarregar informações' icon={<ReloadOutlined />} onClick={() => fetchEnvironments()}></Button>
            {modalEnvironmentsOpen && <ModalEnvironmentManagement modalOpen={modalEnvironmentsOpen} setModalOpen={setModalEnvironmentsOpen} />}
            {modalStudentsOpen && <ModalStudentManagement modalOpen={modalStudentsOpen} setModalOpen={setModalStudentsOpen} />}
        </ContainerDashboard>
    );
}