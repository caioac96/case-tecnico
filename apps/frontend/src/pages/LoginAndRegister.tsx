import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Typography, App, Button, Space, Switch } from "antd";
import { useAuth } from "../context/AuthContext";
import { ContainerLoginAndRegister } from "./styles";

const { Title } = Typography;

interface LoginFormValues {
    register: string;
    password: string;
}

export default function LoginAndRegister() {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [registerError, setRegisterError] = useState(false);
    const { notification } = App.useApp();
    const [titleCard, setTitleCard] = useState("Registrar Entrada/Saída");
    const [textButton, setTextButton] = useState("Registrar entrada");

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRegisterError(value.length > 4);
    };

    const handleSubmit = async (values: LoginFormValues) => {
        const { register, password } = values;

        if (register.length < 4) {
            setRegisterError(true);
            notification.error({
                title: "Erro",
                description: "Digite um registro válido",
                placement: "topRight",
            });
            return;
        }

        setLoading(true);
        const result = await login(register, password);
        setLoading(false);

        if (!result.success) {
            notification.error({
                title: "Erro",
                description: result.message || "Número de registro ou senha inválidos",
                placement: "topRight",
            });
            return;
        }

        notification.success({
            title: "Sucesso!",
            description: `Seja bem vindo(a) ${result.message}`, 
            placement: "topRight",
        });

        navigate("/dashboard");
    };

    const onChange = (e: any) => {
        if (!e) {
            if (!user) {
                setTitleCard("Login");
                setTextButton("Entrar");
            }
            else {
                notification.success({
                    title: "Usuário com sessão ativa",
                    description: "Login realizado",
                    placement: "topRight",
                });

                navigate("/dashboard");
            }
        }
        else {
            setTitleCard("Registrar Entrada/Saída");
            setTextButton("Registrar entrada");
        }
    }

    return (
        <ContainerLoginAndRegister>
            <Space vertical>
                <Switch className="switch-login-register" checkedChildren="Check-in" unCheckedChildren="Login" onChange={onChange} defaultChecked />
            </Space>
            <Card style={{ minWidth: 400, margin: "auto" }}>
                <Title level={4}>{titleCard}</Title>

                <Form<LoginFormValues> layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Registro"
                        name="register"
                        validateStatus={registerError ? "error" : ""}
                        help={registerError ? "Digite um registro válido" : ""}
                        rules={[{ required: true, message: "O registro é obrigatório" }]}
                    >
                        <Input placeholder="Digite seu número de registro" onChange={handleRegisterChange} />
                    </Form.Item>

                    <Form.Item
                        label="Senha"
                        name="password"
                        rules={[{ required: true, message: "A senha é obrigatória" }]}
                    >
                        <Input.Password placeholder="Digite sua senha" />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{ width: "100%" }}
                    >
                        {textButton}
                    </Button>
                </Form>
            </Card>
        </ContainerLoginAndRegister>
    );
}