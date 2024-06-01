import { Tag } from "primereact/tag";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc);

//? ------------------------ ESTADOS ------------------------
export const ColumnStatusBody = ({ value }) => {
    const getDatoStatus = (value) => {
        switch (value.status) {
            case true:
                return 'ACTIVO';

            case false:
                return 'INACTIVO';

            default:
                return null;
        }
    };

    const getSeverity = (value) => {
        switch (value.status) {
            case true:
                return 'success';

            case false:
                return 'danger';

            default:
                return null;
        }
    };

    return (
        <div className="w-full flex align-items-center justify-content-start gap-2">
            <Tag className="text-sm font-bold" value={getDatoStatus(value)} severity={getSeverity(value)}></Tag>
        </div>
    )
}

//? ------------------------ TEXTOS ------------------------
export const ColumnTextBody = ({ value }) => {
    return (
        // <div className="w-full flex align-items-center justify-content-start gap-2">
        <span className="font-medium">{value}</span>
        // </div>
    )
}

export const ColumnTextBodyWithClass = ({ value, className }) => {
    return (
        // <div className="w-full flex align-items-center justify-content-start gap-2">
        <span className={`font-bold ${className}`}>{value}</span>
        // </div>
    )
}

//? ------------------------ CON FONDO REDONDEADO (CHIP) ------------------------
export const ColumnChipBody = ({ value }) => {
    return (
        <div className="w-full flex align-items-center justify-content-start gap-2">
            <span className='bg-gray-200 border-round-3xl px-3 py-2 uppercase font-bold text-center'>{value}</span>
        </div>
    )
}

//? ------------------------ FECHAS ------------------------
export const ColumnDateBodyText = ({ value, className }) => {
    return (
        <span className={`${className}`}>
            {/* {`${new Date(value).toUTCString().trimEnd().slice(0, 16)}`} */}
            {`${new Date(value).toLocaleDateString()} - ${new Date(value).toLocaleTimeString()}`}

            {/* {dayjs.utc(value).format('DD/MM/YYYY')} */}
        </span>
    )
}

export const ColumnDateBody = ({ value }) => {
    return (
        <div className="w-full flex align-items-center justify-content-start gap-2">
            <span className='bg-gray-200 border-round-2xl px-2 py-2 uppercase font-bold text-center'>
                {`${new Date(value).toLocaleDateString()} - ${new Date(value).toLocaleTimeString()}`}
                {/* {`${new Date(value).toUTCString().trimEnd().slice(0, 16)}`} */}
                {/* {dayjs.utc(value).format('DD/MM/YYYY')} */}
            </span>
        </div>
    )
}

export const ColumnOnlyDateBodyText = ({ value, className }) => {
    return (
        <span className={`${className}`}>
            {/* {`${new Date(value).toLocaleDateString()}`} */}

            {/* {`${new Date(value).toUTCString().trimEnd().slice(0, 16)}`} */}
            {dayjs.utc(value).format('DD/MM/YYYY')}
        </span>
    )
}

export const ColumnOnlyDateBody = ({ value }) => {
    return (
        <div className="w-full flex align-items-center justify-content-start gap-2">
            <span className='bg-gray-200 border-round-2xl px-2 py-2 uppercase font-bold text-center'>
                {/* {`${new Date(value).toUTCString().trimEnd().slice(0, 16)}`} */}
                {dayjs.utc(value).format('DD/MM/YYYY')}
            </span>
        </div>
    )
}

export const ColumnOnlyDateBodyWithClass = ({ value, className }) => {
    return (
        <div className="w-full flex align-items-center justify-content-start gap-2">
            <span className={`font-bold text-center px-2 py-2 ${className}`}>
                {/* {`${new Date(value).toUTCString().trimEnd().slice(0, 16)}`} */}
                {dayjs.utc(value).format('DD/MM/YYYY')}
            </span>
        </div>
    )
}

//? ------------------------ SALARIOS ------------------------
export const formatCurrency = (value, locale = 'es-GT', currency = 'GTQ') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol', // Ensure the symbol is used
    }).format(value);
};

export const SalaryDisplay = ({ salary, className }) => {
    const formattedSalary = formatCurrency(parseFloat(salary));

    return (
        <div className="ml-2">
            <p className={`font-medium ${className}`}>{formattedSalary}</p>
        </div>
    );
};

export const ColumnSalaryBody = ({ value, className }) => {
    return (
        <div className="w-full flex align-items-center justify-content-start gap-2 ml-3">
            <span className={`font-medium ${className}`}>Q. {value}</span>
        </div>
    )
}