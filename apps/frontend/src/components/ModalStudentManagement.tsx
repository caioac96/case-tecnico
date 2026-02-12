import { useState } from "react";
import { Button, Modal, Table, Input, Space } from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    SaveOutlined,
} from "@ant-design/icons";

interface Student {
    name: string;
    key?: string;
    senha?: string;
    register?: string | undefined;
}

interface ModalStudentManagementProps {
    modalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalStudentManagement({ modalOpen, setModalOpen }: ModalStudentManagementProps) {
    const [editingKey, setEditingKey] = useState<string | undefined>(undefined);
    const [data, setData] = useState<Student[]>([
        {
            name: "João Silva",
            register: "5948"
        },
    ]);

    const [newName, setNewName] = useState("");

    const handleAdd = () => {
        const newStudent: Student = {
            name: "New",
            senha: `1234`
        };

        setData([...data, newStudent]);
    };

    const handleDelete = (key: string) => {
        setData(data.filter((item) => item.key !== key));
    };

    const handleEdit = (record: Student) => {
        setEditingKey(record.key);
        setNewName(record.name);
    };

    const handleSave = (key: string) => {
        const newData = data.map((item) =>
            item.key === key ? { ...item, name: newName } : item
        );
        setData(newData);
        setEditingKey(undefined);
    };

    const columns = [
        {
            title: "Nome",
            dataIndex: "name",
            key: "name",
            render: (_: any, record: Student) =>
                editingKey === record.key ? (
                    <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                ) : (
                    record.name
                ),
        },
        {
            title: "Registro",
            dataIndex: "register",
            key: "register",
        },
        {
            title: "Ambiente Atual",
            dataIndex: "currentEnvironment",
            key: "currentEnvironment",
        },
        {
            title: "Editar",
            key: "edit",
            render: (_: any, record: Student) =>
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
            render: (_: any, record: Student) => (
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
            title="Gestão de Alunos"
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
                    Novo aluno
                </Button>
            </Space>

            <Table columns={columns} dataSource={data} pagination={false} />
        </Modal>
    );
}
