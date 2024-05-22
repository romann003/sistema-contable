import { Tag } from "primereact/tag";

const ColumnStatusBody = ({ value }) => {
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
            <Tag  className="text-sm font-bold" value={getDatoStatus(value)} severity={getSeverity(value)}></Tag>
        </div>
    )
}

const ColumnTextBody = ({ value }) => {
    return (
        <div className="w-full flex align-items-center justify-content-start gap-2">
            <span className="font-medium">{value}</span>
        </div>
    )
}

const ColumnChipBody = ({ value }) => {
    return (
        <div className="w-full flex align-items-center justify-content-start gap-2">
            <span className='bg-gray-200 border-round-3xl px-3 py-2 uppercase font-bold text-center'>{value}</span>
        </div>
    )
}

const ColumnDateBody = ({ value }) => {
    return (
        <div className="w-full flex align-items-center justify-content-start gap-2">
                <span className='bg-gray-200 border-round-2xl px-1 py-2 uppercase font-bold text-center'>
                    {`${new Date(value).toLocaleDateString()} - ${new Date(value).toLocaleTimeString()}`}
                </span>
            </div>
    )
}

const ColumnOnlyDateBody = ({ value }) => {
    return (
        <div className="w-full flex align-items-center justify-content-start gap-2">
                <span className='bg-gray-200 border-round-2xl px-3 py-2 uppercase font-bold text-center'>
                    {/* {`${new Date(value).toLocaleDateString()}`} */}
                    {value}
                </span>
            </div>
    )
}

export { ColumnTextBody, ColumnStatusBody, ColumnChipBody, ColumnDateBody, ColumnOnlyDateBody }