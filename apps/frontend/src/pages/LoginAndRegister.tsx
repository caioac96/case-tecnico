import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Typography, App, Button, Space, Switch, Select } from "antd";
import { useAuth } from "../context/AuthContext";
import { ContainerLoginAndRegister } from "./styles";
import { getEnvironments } from "../api/environment.reqs";
import type { Environment } from "../components/ModalEnvironmentManagement";

const { Title } = Typography;

interface LoginFormValues {
    register: string;
    password: string;
    environmentId: string;
}

export default function LoginAndRegister() {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [dataEnvironments, setDataEnvironments] = useState<Environment[]>([]);
    const [registerError, setRegisterError] = useState(false);
    const { notification } = App.useApp();
    const [titleCard, setTitleCard] = useState("Registrar Entrada/Saída");
    const [textButton, setTextButton] = useState("Registrar entrada");
    const [selectEnvsVisible, setSelectEnvsVisible] = useState(true);

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRegisterError(value.length > 4);
    };

    useEffect(() => {
        const fetchEnvironments = async () => {
            setLoading(true);
            try {
                const response = await getEnvironments();
                setDataEnvironments(response.data);
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
    }, []);

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
                setSelectEnvsVisible(false);
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
            setSelectEnvsVisible(true);
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

                    <Form.Item
                        label="Ambiente"
                        name="environmentId"
                        hidden={!selectEnvsVisible}
                        rules={[{ required: selectEnvsVisible ? true : false, message: "O ambiente é obrigatório" }]}
                    >
                        <Select options={dataEnvironments.map(env => ({
                            label: env.description,
                            value: env.id,
                        }))} placeholder="Selecione o ambiente para check-in" />
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