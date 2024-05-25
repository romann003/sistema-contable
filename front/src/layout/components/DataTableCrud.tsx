import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useEffect } from "react";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";


export default function DataTableCrud({ setFilters, setGlobalFilterValue, refe, message, value, filters, loading, columns, actionBodyTemplate, globalFilterFields, globalFilterValue, size, headerMessage, buscador, dtSize, openNew, btActive, btnSize, btnColor, btnText
    //  ,useEffect1, useEffect2, useEffectLoad
}) {

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const _filters = { ...filters };

        // @ts-ignore
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const header = () => {
        return (
            <div className="flex flex-grid gap-2 align-items-center justify-content-between mb-2">
                {btActive && (
                    <div className="col-auto">

                        <Button label={btnText} icon="pi pi-plus" severity={btnColor} size={btnSize} onClick={openNew} />
                    </div>
                )}
                <div className="col-auto">
                    <h4 className="m-0">{headerMessage}</h4>
                </div>
                {buscador && (
                    <div className="col-auto">
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-search" />
                            <InputText type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
                        </IconField>

                    </div>
                )
                }
            </div>
        );
    };

    // const footer = () => {
    //     return (
    //         <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
    //             {/* <h4 className="m-0">{headerMessage}</h4> */}
    //             <IconField iconPosition="left">
    //                 <p className="m-0">{`En total hay ${value.length} ${message}.`}</p>
    //             </IconField>
    //         </div>
    //     );
    // };

    const footer = `En total hay ${value ? value.length : 0} ${message}.`;

    return (
        <DataTable
            size={dtSize}
            dataKey="id"
            scrollable scrollHeight="550px"
            stripedRows
            sortMode="multiple"
            resizableColumns={true}
            footer={footer}
            filterDisplay="row" //row - menu
            ref={refe}
            value={value}
            filters={filters}
            loading={loading}
            header={header}
            globalFilterFields={globalFilterFields}
            emptyMessage={`No se encontraron ${message}.`}
            paginator rows={15}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate={`Mostrando {first} - {last} de {totalRecords} ${message}`}
        // rowsPerPageOptions={[5, 10, 25]}
        >
            <Column header="ID" body={(rowData) => <span>{value.indexOf(rowData) + 1}</span>} />
            {columns.map((col, index) => {
                return (
                    <Column
                        key={index}
                        field={col.field}
                        header={col.header}
                        sortable
                        filter={col.filter}
                        filterField={col.field}
                        filterPlaceholder={`Filtrar por ${col.header}`}
                        body={col.body}
                        dataType={col.dataType}
                        filterType={col.dataType} //text, numeric, date, dateRange, custom
                        showFilterMenu={false}
                        showFilterMenuOptions={false}
                        alignHeader={'left'}
                        style={{ minWidth: '13rem', textTransform: 'capitalize', maxWidth: '20rem' }}
                    />
                )
            }
            )}
            <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: `${size}` }} alignFrozen="right" frozen />
        </DataTable>
    )
}