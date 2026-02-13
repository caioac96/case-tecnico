import { useEffect, useState } from "react";
import { Button, Modal, Table, Input, Space, Form, notification } from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    SaveOutlined
} from "@ant-design/icons";
import { createStudent, deleteStudent, getStudents, updateStudent } from "../api/students.reqs";

interface Student {
    name: string;
    id?: string;
    register: string | undefined;
    key?: string;
    admin?: boolean;
    senha?: string;
}

interface ModalStudentManagementProps {
    modalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalStudentManagement({
    modalOpen,
    setModalOpen,
}: ModalStudentManagementProps) {
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | undefined>(undefined);
    const [data, setData] = useState<Student[]>([]);
    const [newName, setNewName] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (!modalOpen) return;

        const fetchStudents = async () => {
            setLoading(true);
            try {
                const response = await getStudents();
                setData(response.data);
            } catch (error) {
                notification.error({
                    title: "Erro ao buscar usuários",
                    description: "",
                    placement: "topRight",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [modalOpen]);

    const handleAdd = () => {
        setIsCreateOpen(true);
    };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();

            const response = await createStudent(values);

            setData((prev) => [...prev, response.data]);

            notification.success({
                title: "Sucesso!",
                description: "Usuário criado",
                placement: "topRight",
            });

            form.resetFields();
            setIsCreateOpen(false);
        } catch (error) {
            notification.error({
                title: "Erro ao criar usuário",
                description: "",
                placement: "topRight",
            });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteStudent(id);
            setData((prev) => prev.filter((item) => item.id !== id));
            notification.success({
                title: "Sucesso!",
                description: "Usuário deletado",
                placement: "topRight",
            });
        } catch {
            notification.error({
                title: "Erro ao deletar usuário!",
                description: "",
                placement: "topRight",
            });
        }
    };

    const handleEdit = (record: Student) => {
        setEditingId(record.id);
        setNewName(record.name);
    };

    const handleSave = async (id: string) => {
        try {
            const response = await updateStudent(id, {
                name: newName,
            });

            setData((prev) =>
                prev.map((item) => (item.id === id ? response.data : item))
            );

            setEditingId(undefined);
            notification.success({
                title: "Sucesso!",
                description: "Usuário atualizado",
                placement: "topRight",
            });
        } catch {
            notification.error({
                title: "Erro ao atualizar usuário!",
                description: "",
                placement: "topRight",
            });
        }
    };

    const columns = [
        {
            title: "Nome",
            dataIndex: "name",
            render: (_: any, record: Student) =>
                editingId === record.id ? (
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
            title: "Perfil",
            dataIndex: "admin",
            key: "admin",
            render: (_: any, record: Student) =>
                record.admin ? (
                    "Administrador"
                ) : (
                    "Aluno"
                ),
        },
        {
            title: "Editar",
            key: "edit",
            render: (_: any, record: Student) =>
                editingId === record.id ? (
                    <Button
                        type="link"
                        icon={<SaveOutlined />}
                        onClick={() => handleSave(record.id!)}
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
                    onClick={() => handleDelete(record.id!)}
                />
            ),
        },
    ];

    return (
        <>
            <Modal
                title="Gestão de Alunos/Usuários"
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
                        Novo usuário
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
                title="Novo Usuário"
                open={isCreateOpen}
                onCancel={() => setIsCreateOpen(false)}
                onOk={handleCreate}
                okText="Criar"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Nome completo"
                        name="name"
                        rules={[{ required: true, message: "Informe a nome" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Senha inicial"
                        name="password"
                        rules={[{ required: true, message: "Preencha a senha" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}