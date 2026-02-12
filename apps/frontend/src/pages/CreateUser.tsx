import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Typography, App, Button } from "antd";
import { useAuth } from "../context/AuthContext";
import { ContainerCreateUser } from "./styles";

const { Title } = Typography;

interface CreateUserFormValues {
    name: string;
    password: string;
    key?: string
}

export default function CreateUser() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const { notification } = App.useApp();
    const [titleCard, setTitleCard] = useState("Criar usuário administrador");

    const handleSubmit = async (values: CreateUserFormValues) => {
        if (values.key != "CR1AD0R") {
            notification.error({
                title: "Erro",
                description: "Chave inválida!",
                placement: "topRight",
            });
            return;
        }

        delete values.key;

        setLoading(true);
        const result = await register(values);
        setLoading(false);

        if (!result.success) {
            notification.error({
                title: "Erro",
                description: result.message || "Nome ou senha inválidos",
                placement: "topRight",
            });
            return;
        }

        notification.success({
            title: "Sucesso!",
            description: "Administrador criado",
            placement: "topRight",
        });

        navigate("/");
    };

    return (
        <ContainerCreateUser>
            <Card style={{ minWidth: 400, margin: "auto" }}>
                <Title level={4}>{titleCard}</Title>

                <Form<CreateUserFormValues> layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Nome"
                        name="name"
                        rules={[{ required: true, message: "O nome é obrigatório" }]}
                    >
                        <Input placeholder="Digite seu nome" />
                    </Form.Item>

                    <Form.Item
                        label="Senha"
                        name="password"
                        rules={[{ required: true, message: "A senha é obrigatória" }]}
                    >
                        <Input.Password placeholder="Digite sua senha" />
                    </Form.Item>

                    <Form.Item
                        label="Key"
                        name="key"
                        rules={[{ required: true, message: "A chave é obrigatória" }]}
                    >
                        <Input.Password placeholder="Digite a chave secreta" />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Criar
                    </Button>
                </Form>
            </Card>
        </ContainerCreateUser>
    );
}