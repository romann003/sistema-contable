import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

export default function DataTableCrud({ ref, message, value, filters, loading, columns, actionBodyTemplate, globalFilterFields, globalFilterValue, onGlobalFilterChange, size, headerMessage}) {

    const header = () => {
        return (
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <h4 className="m-0">{headerMessage}</h4>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
                </IconField>
            </div>
        );
    };

    return (
        <DataTable
            ref={ref}
            dataKey="id"
            value={value}
            filters={filters}
            loading={loading}
            header={header}
            globalFilterFields={globalFilterFields}
            filterDisplay="row"
            scrollable
            stripedRows
            emptyMessage={`No se encontraron ${message}.`}
            paginator rows={15}
            // rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate={`Mostrando {first} - {last} de {totalRecords} ${message}`}
        >
            <Column header="ID" body={(rowData) => <span>{value.indexOf(rowData) + 1}</span>} />
            {columns.map((col, index) => {
                return (
                    <Column key={index} field={col.field} header={col.header} sortable filter filterField={col.field} filterPlaceholder={`Filtrar por ${col.header}`} style={{ minWidth: '12rem' }} body={col.body}
                    />
                )
            }
            )}
            <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: `${size}` }} alignFrozen="right" frozen />
        </DataTable>
    )
}