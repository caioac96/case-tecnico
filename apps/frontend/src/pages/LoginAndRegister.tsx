import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Typography, App, Button, Space, Switch, Select, Modal } from "antd";
import { useAuth } from "../context/AuthContext";
import { ContainerLoginAndRegister } from "./styles";
import { getEnvironments } from "../api/environment.reqs";
import type { Environment } from "../components/ModalEnvironmentManagement";
import { checkin, checkout } from "../api/common.reqs";

const { Title } = Typography;

interface LoginFormValues {
    register: string;
    password: string;
    environmentId: string;
}

export default function LoginAndRegister() {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [loadingEntry, setLoadingEntry] = useState(false);
    const [loadingExit, setLoadingExit] = useState(false);
    const [dataEnvironments, setDataEnvironments] = useState<Environment[]>([]);
    const [registerError, setRegisterError] = useState(false);
    const { notification } = App.useApp();
    const [titleCard, setTitleCard] = useState("Registrar Entrada");
    const [textButton, setTextButton] = useState("Realizar check-in");
    const [selectEnvsVisible, setSelectEnvsVisible] = useState(true);
    const [modalCheckout, setModalCheckout] = useState(false);
    const [form] = Form.useForm();
    const [checkoutForm] = Form.useForm();

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRegisterError(value.length > 4);
    };

    useEffect(() => {
        const fetchEnvironments = async () => {
            setLoadingEntry(true);
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
                setLoadingEntry(false);
            }
        };

        fetchEnvironments();
    }, []);

    const handleSubmitEntryAndLogin = async (values: LoginFormValues) => {
        const { register, password, environmentId } = values;

        if (register.length < 4) {
            setRegisterError(true);
            notification.error({
                title: "Erro",
                description: "Digite um registro válido",
                placement: "topRight",
            });
            return;
        }

        if (environmentId) {
            setLoadingEntry(true);
            const { data } = await checkin(register, password, environmentId);
            setLoadingEntry(false);

            if (!data.success) {
                notification.error({
                    title: "Erro",
                    description: data.message || "Número de registro ou senha inválidos",
                    placement: "topRight",
                });
                return;
            }

            notification.success({
                title: "Sucesso!",
                description: `Entrada processada, registro: ${data.userRegister}`,
                placement: "topRight",
            });
            form.resetFields();
            return;
        }
        else {
            setLoadingEntry(true);
            const result = await login(register, password);
            setLoadingEntry(false);

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

            form.resetFields();
            navigate("/dashboard");
        }
    };

    const handleSubmitExit = async (values: LoginFormValues) => {
        const { register, password, environmentId } = values;

        if (register.length < 4) {
            setRegisterError(true);
            notification.error({
                title: "Erro",
                description: "Digite um registro válido",
                placement: "topRight",
            });
            return;
        }

        if (!environmentId) {
            notification.error({
                title: "Erro",
                description: "environmentId inválido!",
                placement: "topRight",
            });
            return;
        }

        setLoadingExit(true);
        const { data } = await checkout(register, password, environmentId);
        setLoadingExit(false);

        if (!data.success) {
            notification.error({
                title: "Erro",
                description: data.message || "Número de registro ou senha inválidos",
                placement: "topRight",
            });
            return;
        }

        notification.success({
            title: "Sucesso!",
            description: `Check-out realizado, registro: ${data.userRegister}`,
            placement: "topRight",
        });
        setModalCheckout(false);
        checkoutForm.resetFields();
        return;
    };

    const onChange = (e: any) => {
        form.resetFields();
        checkoutForm.resetFields();
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
            setTitleCard("Registrar Entrada");
            setSelectEnvsVisible(true);
            setTextButton("Realizar check-in");
        }
    }

    return (
        <ContainerLoginAndRegister>
            <Space vertical>
                <Switch className="switch-login-register" checkedChildren="Check-in" unCheckedChildren="Login" onChange={onChange} defaultChecked />
            </Space>
            <Card style={{ minWidth: 400, margin: "auto" }}>
                <Title level={4}>{titleCard}</Title>

                <Form<LoginFormValues> layout="vertical" onFinish={handleSubmitEntryAndLogin} form={form}>
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
                        disabled={loadingEntry}
                        loading={loadingEntry}
                        style={{ width: "100%", backgroundColor: "#1890ff" }}
                    >
                        {textButton}
                    </Button>
                </Form>
                <Button
                    type="link"
                    hidden={!selectEnvsVisible}
                    disabled={loadingExit}
                    loading={loadingExit}
                    onClick={() => setModalCheckout(true)}
                    style={{ width: "100%", marginTop: "20px" }}
                >
                    Realizar check-out
                </Button>
            </Card>
            <Modal
                title="Realizar check-out"
                open={modalCheckout}
                onCancel={() => setModalCheckout(false)}
                onOk={() => checkoutForm.submit()}
                okText="Check-out"
            >
                <Form<LoginFormValues> layout="vertical" onFinish={handleSubmitExit} form={checkoutForm} disabled={loadingExit}>
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
                        rules={[{ required: true, message: "O ambiente é obrigatório" }]}
                    >
                        <Select options={dataEnvironments.map(env => ({
                            label: env.description,
                            value: env.id,
                        }))} placeholder="Selecione o ambiente para check-out" />
                    </Form.Item>
                </Form>
            </Modal>
        </ContainerLoginAndRegister>
    );
}