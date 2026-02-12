import styled from "styled-components";

export const ContainerLoginAndRegister = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    justify-content: center;
    align-items: center;

    .switch-login-register {
        border: 1px solid #FFFFFF55;
    }
    .switch-login-register.ant-switch-checked {
        background-color: #1890ff !important;
    }
    .switch-login-register.ant-switch:not(.ant-switch-checked) {
        background-color: #1890ff !important;
    }
`;

export const ContainerCreateUser = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    justify-content: center;
    align-items: center;
`;

export const ContainerDashboard = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    justify-content: center;
    align-items: center;
`;

export const ContainerActions = styled.div`
    position: absolute;
    display: flex;
    flex-direction: row;
    gap: 5px;
    right: 10px;
    top: 10px;
    width: 300px;
    height: 50px;
    justify-content: end;
    /* background-color: #FFFFFF11; */
    /* border-radius: 8px; */
`;