import { Button } from 'primereact/button';
import { Input, Textarea, Label, Span, ErrorText, Group, DropDown } from '../elements/Formularios.js';
import { ErrorMessage } from 'formik';
import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import { Nullable } from "primereact/ts-helpers";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc);



export const InputT = ({ label, span, type, name, id, placeholder, errorText, onChange, onBlur, invalid, value, col, disabled
    // , readonly, onKeyUp 
}) => {
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
                    disabled={disabled}
                // readonly={readonly}
                // onKeyUp={onKeyUp}
                />
                {/* <ErrorText>{errorText}</ErrorText> */}
                <ErrorMessage name={name} component={() => (<small className="p-error mt-1">{errorText}</small>)} />

            </Group>
        </div>
    )
}

export const TextArea = ({ label, span, name, id, placeholder, errorText, onChange, onBlur, invalid, value, col }) => {
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

export const DropDownD = ({ label, span, name, id, placeholder, errorText, onChange, onBlur, invalid, value, options, optionLabel, emptyMessage, disabled, col }) => {

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
                />
                {/* <ErrorText>{errorText}</ErrorText> */}
                <ErrorMessage name={name} component={() => (<small className="p-error mt-1">{errorText}</small>)} />

            </Group>
        </div>
    )
}

export const ButtonB = ({ label, icon, type, onClick, col, color }) => {
    return (
        <div className={`col-${col}`}>
            <Group>
                <Label>{label}</Label>
                <Button type={type} onClick={onClick} icon={icon} label={label} severity={color}></Button>
            </Group>
        </div>
    )
}


export const DatePicker = ({selectedDate, setSelectedDate}) => {
    // const [selectedDate, setSelectedDate] = useState(null);
    // const [selectedDate, setSelectedDate] = useState<Nullable<(Date | null)[]>>(null);

    // const allowedDates = [
    //     new Date('2024-06-03'),
    //     new Date('2024-06-04'),
    //     new Date('2024-06-05')
    // ];

    console.log('selectedDate',dayjs.utc(selectedDate[0]).format('YYYY-MM-DD'));
    console.log('selectedDate',dayjs.utc(selectedDate[1]).format('YYYY-MM-DD'));

    // const minDate = new Date(dayjs.utc(selectedDate[1]).format('YYYY-MM-DD'));
    const maxDate = new Date('2024-04-30');

    addLocale('es', {
        firstDayOfWeek: 1,
        showMonthAfterYear: false,
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        today: 'Hoy',
        // clear: 'Limpiar'
    });

    return (
        <div>
            <Group>

                    <label htmlFor="date" className='text-center font-bold capitalize text-lg'>Selecciona una fecha:</label>
                <div className="flex justify-content-center py-2">
                    {selectedDate[0] && <label htmlFor="date" className='font-medium text-lg mx-2'>{dayjs.utc(selectedDate[0]).format('DD/MM/YYYY')}</label>}
                    {selectedDate[0] && <label htmlFor="date" >al </label>}
                    {selectedDate[1] && <label htmlFor="date" className='font-medium text-lg mx-2'>{dayjs.utc(selectedDate[1]).format('DD/MM/YYYY')}</label>}
                </div>
                <Calendar
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.value)}
                    locale='es'
                    inline
                    selectionMode="range" readOnlyInput hideOnRangeSelection
                />
            </Group>
        </div>
    );
};