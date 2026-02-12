import { useState } from "react";
import { Button, Modal, Table, Input, Space } from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    SaveOutlined,
} from "@ant-design/icons";

interface Environment {
    description: string;
    key?: string;
    occupancyLimit?: number;
    currentOccupancy?: number;
}

interface ModalEnvironmentManagementProps {
    modalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalEnvironmentManagement({ modalOpen, setModalOpen }: ModalEnvironmentManagementProps) {
    const [editingKey, setEditingKey] = useState<string | undefined>(undefined);
    const [data, setData] = useState<Environment[]>([
        {
            description: "Lab 01",
            currentOccupancy: 10,
            occupancyLimit: 20
        },
    ]);

    const [newDescription, setNewDescription] = useState("");

    const handleAdd = () => {
        const newEnv: Environment = {
            description: "Lab 02",
            occupancyLimit: 30
        };

        setData([...data, newEnv]);
    };

    const handleDelete = (key: string) => {
        setData(data.filter((item) => item.key !== key));
    };

    const handleEdit = (record: Environment) => {
        setEditingKey(record.key);
        setNewDescription(record.description);
    };

    const handleSave = (key: string) => {
        const newData = data.map((item) =>
            item.key === key ? { ...item, description: newDescription } : item
        );
        setData(newData);
        setEditingKey(undefined);
    };

    const columns = [
        {
            title: "Descrição",
            dataIndex: "description",
            key: "description",
            render: (_: any, record: Environment) =>
                editingKey === record.key ? (
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
            key: "occupancyLimit",
        },
        {
            title: "Ocupação atual",
            dataIndex: "currentOccupancy",
            key: "currentOccupancy",
        },
        {
            title: "Editar",
            key: "edit",
            render: (_: any, record: Environment) =>
                editingKey === record.key ? (
                    <Button
                        type="link"
                        icon={<SaveOutlined />}
                        onClick={() => handleSave(record.key!)}
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
            key: "delete",
            render: (_: any, record: Environment) => (
                <Button
                    danger
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record.key!)}
                />
            ),
        },
    ];

    return (
        <Modal
            title="Gestão de Ambientes"
            open={modalOpen}
            onCancel={() => setModalOpen(false)}
            footer={null}
            width={800}
        >
            <Space
                style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }}
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

            <Table columns={columns} dataSource={data} pagination={false} />
        </Modal>
    );
}
