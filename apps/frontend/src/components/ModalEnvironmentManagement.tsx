import { useEffect, useState } from "react";
import { Button, Modal, Table, Input, Space, Form, InputNumber, notification } from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    SaveOutlined,
} from "@ant-design/icons";

import {
    getEnvironments,
    createEnvironment,
    updateEnvironment,
    deleteEnvironment,
} from "../api/environment.reqs";

export interface Environment {
    id: string;
    description: string;
    occupancyLimit?: number;
    currentOccupancy?: number;
}

interface ModalEnvironmentManagementProps {
    modalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalEnvironmentManagement({
    modalOpen,
    setModalOpen,
}: ModalEnvironmentManagementProps) {
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [data, setData] = useState<Environment[]>([]);
    const [newDescription, setNewDescription] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (!modalOpen) return;

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

        fetchEnvironments();
    }, [modalOpen]);

    const handleAdd = () => {
        setIsCreateOpen(true);
    };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();

            const response = await createEnvironment(values);

            setData((prev) => [...prev, response.data]);

            notification.success({
                title: "Sucesso!",
                description: "Ambiente criado",
                placement: "topRight",
            });

            form.resetFields();
            setIsCreateOpen(false);
        } catch (error) {
            notification.error({
                title: "Erro ao criar ambiente",
                description: "",
                placement: "topRight",
            });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteEnvironment(id);
            setData((prev) => prev.filter((item) => item.id !== id));
            notification.success({
                title: "Sucesso!",
                description: "Ambiente deletado",
                placement: "topRight",
            });
        } catch {
            notification.error({
                title: "Erro ao deletar ambiente!",
                description: "",
                placement: "topRight",
            });
        }
    };

    const handleEdit = (record: Environment) => {
        setEditingId(record.id);
        setNewDescription(record.description);
    };

    const handleSave = async (id: string) => {
        try {
            const response = await updateEnvironment(id, {
                description: newDescription,
            });

            setData((prev) =>
                prev.map((item) => (item.id === id ? response.data : item))
            );

            setEditingId(null);
            notification.success({
                title: "Sucesso!",
                description: "Ambiente atualizado",
                placement: "topRight",
            });
        } catch {
            notification.error({
                title: "Erro ao atualizar ambiente!",
                description: "",
                placement: "topRight",
            });
        }
    };

    const columns = [
        {
            title: "Descrição",
            dataIndex: "description",
            render: (_: any, record: Environment) =>
                editingId === record.id ? (
                    <Input
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                    />
                ) : (
                    record.description
                ),
        },
        {
            title: "Limite de ocupação",
            dataIndex: "occupancyLimit",
        },
        {
            title: "Ocupação atual",
            dataIndex: "currentOccupancy",
        },
        {
            title: "Editar",
            render: (_: any, record: Environment) =>
                editingId === record.id ? (
                    <Button
                        type="link"
                        icon={<SaveOutlined />}
                        onClick={() => handleSave(record.id)}
                    />
                ) : (
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                ),
        },
        {
            title: "Remover",
            render: (_: any, record: Environment) => (
                <Button
                    danger
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record.id)}
                />
            ),
        },
    ];

    return (
        <>
            <Modal
                title="Gestão de Ambientes"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                width={800}
            >
                <Space
                    style={{
                        width: "100%",
                        justifyContent: "space-between",
                        marginBottom: 16,
                    }}
                >
                    <div />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Novo ambiente
                    </Button>
                </Space>

                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={false}
                />
            </Modal>
            <Modal
                title="Novo Ambiente"
                open={isCreateOpen}
                onCancel={() => setIsCreateOpen(false)}
                onOk={handleCreate}
                okText="Criar"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Descrição"
                        name="description"
                        rules={[{ required: true, message: "Informe a descrição" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Limite de ocupação"
                        name="occupancyLimit"
                        rules={[{ required: true, message: "Informe o limite" }]}
                    >
                        <InputNumber style={{ width: "100%" }} min={1} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}