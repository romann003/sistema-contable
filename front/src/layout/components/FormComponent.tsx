import { Input, Textarea, Label, Span, ErrorText, Group, DropDown } from '../elements/Formularios.js';
import { ErrorMessage } from 'formik';

const FormInput = ({ label, span, type, name, id, placeholder, errorText, onChange, onBlur, invalid, value, col }) => {
    return (
        <div className={`col-${col}`}>
            <Group>
                <Label htmlFor={id}>{label} <Span>{span}</Span></Label>
                <Input
                    type={type}
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    onKeyUp={onBlur}
                    invalid={invalid}
                />
                {/* <ErrorText>{errorText}</ErrorText> */}
                <ErrorMessage name={name} component={() => (<small className="p-error mt-1">{errorText}</small>)} />

            </Group>
        </div>
    )
}

const FormTextArea = ({ label, span, name, id, placeholder, errorText, onChange, onBlur, invalid, value, col }) => {
    return (
        <div className={`col-${col}`}>
            <Group>
                <Label htmlFor={id}>{label} <Span>{span}</Span></Label>
                <Textarea
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    onKeyUp={onBlur}
                    invalid={invalid}
                    autoResize rows={1}
                />
                {/* <ErrorText>{errorText}</ErrorText> */}
                <ErrorMessage name={name} component={() => (<small className="p-error mt-1">{errorText}</small>)} />

            </Group>
        </div>
    )
}

const FormDropDown = ({ label, span, name, id, placeholder, errorText, onChange, onBlur, invalid, value, options, optionLabel, emptyMessage, disabled, col }) => {

    // const handleDropDownChange = (e: DropdownChangeEvent) => {
    //     if (isRequired) {
    //         setFieldTouched('area', true);
    //         setFieldValue('area', '', true);
    //     }
    //     cambiarSelected(e.value);
    //     onChange(e);
    // }

    return (
        <div className={`col-${col}`}>
            <Group>
                <Label htmlFor={id}>{label} <Span>{span}</Span></Label>
                <DropDown
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    optionLabel={optionLabel}
                    emptyMessage={emptyMessage}
                    onChange={onChange}
                    onBlur={onBlur}
                    invalid={invalid}
                    options={options}
                    disabled={disabled}
                    autoResize rows={1}
                />
                {/* <ErrorText>{errorText}</ErrorText> */}
                <ErrorMessage name={name} component={() => (<small className="p-error mt-1">{errorText}</small>)} />

            </Group>
        </div>
    )
}

export { FormInput, FormTextArea, FormDropDown }