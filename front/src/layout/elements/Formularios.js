import styled, { css } from 'styled-components';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';

const colors = {
    borde: "#0075FF",
    error: "#e45656",
    exito: "#1ed12d"
}

const Formulario = styled.form`
    display: grid;
    // grid-template-columns: auto auto auto;
    gap: 20px;
    margin: 20px 0;

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
    }
`;

const Label = styled.label`
    display: block;
    font-weight: 700;
    margin-bottom: 10px;
    cursor: pointer;
`;

const Span = styled.span`
    font-weight: 700;
    margin-bottom: 10px;
    cursor: pointer;
    color: ${colors.error};
`;

const ErrorText = styled.small`
    font-size: 12px;
    margin-top: 10px;
    margin-bottom: 0;
    color: ${colors.error};
    display: none;

    ${props => props.valido === 'true' && css`
        display: none;
    `}
    ${props => props.valido === 'false' && css`
        display: block;
    `}
`;

const Group = styled.div`
    display: flex;
    flex-direction: column;
`;

const Input = styled(InputText)`
    width: 100%;
    border-radius: 5px;
    transition: .3s ease all;
`;

const Textarea = styled(InputTextarea)`
    width: 100%;
    border-radius: 5px;
    transition: .3s ease all;
`;

const DropDown = styled(Dropdown)`
    width: 100%;
    text-transform: uppercase;
    border-radius: 5px;
    transition: .3s ease all;
`;

export { Formulario, Label, Span, Group, ErrorText, Input, Textarea, DropDown };