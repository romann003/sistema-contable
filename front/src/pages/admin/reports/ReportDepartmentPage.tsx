import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';
import { FilterMatchMode } from 'primereact/api';
import { DataTableFilterMeta } from 'primereact/datatable';
import { useDepartments } from '../../../api/context/DepartmentContext';
import { TabPanel, TabPanelHeaderTemplateOptions, TabView } from 'primereact/tabview';
import { Divider } from 'primereact/divider';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { BreadCrumb } from 'primereact/breadcrumb';
import { MenuItem } from 'primereact/menuitem';
import { Link } from 'react-router-dom';
import { useCompany } from '../../../api/context/CompanyContext';

interface Department {
    id: number | null;
    name: string;
    description: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    company: string | null;
    companyId: number | null;
}

export default function ReportDepartmentPage() {

    const items: MenuItem[] = [{ label: 'Reportes' }, {template: () => <Link to=""><span className="text-primary font-semibold">Departamentos</span></Link> }];
    const home: MenuItem = {
        template: () => <Link to="/dashboard"><span className="text-primary font-semibold">Inicio</span></Link>
    }


    //? -------------------- CONTEXT API -------------------
    const { departments, getDepartments } = useDepartments();
    const { companies, getCompany } = useCompany();


    //? -------------------- STATES -------------------
    const toast = useRef<Toast>(null);

    //? -------------------- DIALOGS STATES -------------------
    const [department, setDepartment] = useState<Department | null>(null);
    const [detailsDialog, setDetailsDialog] = useState<boolean>(false);


    //? -------------------- DATATABLE STATES -------------------
    const dt = useRef<DataTable<Department[]>>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        description: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const _filters = { ...filters };

        // @ts-ignore
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    //? -------------------- DATATABLE FUNCTIONS -------------------
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <h4 className="m-0">Reporte de Departamentos</h4>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
                </IconField>
            </div>
        );
    };

    //? -------------------- DATATABLE INPUT TEMPLATES -------------------
    const desBodyTemplate = (rowData: Department) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.description}</span>
            </div>
        );
    };

    //? -------------------- LOADING DATA -------------------
    const header = renderHeader();
    useEffect(() => {
        getDepartments()
        getCompany(1);
        setLoading(false);
    }, [department]);


    //? -------------------- DETAILS DIALOGS -------------------
    const hideDetailsDialog = () => {
        setDetailsDialog(false);
    };

    const details = (department: Department) => {
        setDepartment({ ...department });
        setDetailsDialog(true);
    };

    const detailDialogFooter = (
        <React.Fragment>
            <Button label="Salir de la vista" icon="pi pi-times" outlined onClick={hideDetailsDialog} />
        </React.Fragment>
    );

    //? -------------------- DATATABLE actions -------------------
    // const exportCSV = () => {
    //     dt.current?.exportCSV();
    // };

    // const exportExcel = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(departments);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Departamentos");
    //     XLSX.writeFile(workbook, 'reporte_departamentos.xlsx');
    // };

    const exportPDF = () => {
        const doc = new jsPDF();
        
        const headerText = `${companies.business_name.toUpperCase()}\nNIT: ${companies.nit}\nDIRECCION: ${companies.address}\nTELEFONO: ${companies.phone}`;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(headerText, 105, 10, { align: 'center' });

        const marginTop = doc.getTextDimensions(headerText).h + 30;
        doc.text('Reporte de Areas (Cargos)',105, marginTop+10, {align: 'center'});

        const tableColumn = ["ID", "Nombre", "Descripción", "Estado", "Creado el", "Última Actualización"];
        const tableRows = departments.map((department, index) => [
            // department.id,
            index + 1,
            department.name,
            department.description,
            department.status ? 'ACTIVO' : 'INACTIVO',
            new Date(department.createdAt).toLocaleDateString() + ' ' + new Date(department.createdAt).toLocaleTimeString(),
            new Date(department.updatedAt).toLocaleDateString() + ' ' + new Date(department.updatedAt).toLocaleTimeString()
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: marginTop + 15,
            theme: 'grid',
        });

        doc.save('reporte_departamentos.pdf');
    }

    const exportJSON = () => {
        const json = JSON.stringify(departments);
        const blob = new Blob([json], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'reporte_departamentos.json';
        link.click();
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte de Departamentos');

        worksheet.columns = [
            { header: 'No.', key: 'id', width: 10 },
            { header: 'Nombre', key: 'name', width: 30 },
            { header: 'Descripción', key: 'description', width: 30 },
            { header: 'Estado', key: 'status', width: 10 },
            { header: 'Creado El', key: 'createdAt', width: 20 },
            { header: 'Actualizado El', key: 'updatedAt', width: 20 },
        ];

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '4472C4' },
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        departments.forEach((item, index) => {
            worksheet.addRow({
                // id: item.id,
                id: index + 1,
                name: item.name,
                description: item.description,
                status: item.status ? 'Activo' : 'Inactivo',
                createdAt: new Date(item.createdAt).toLocaleString(),
                updatedAt: new Date(item.updatedAt).toLocaleString(),
            });
        });

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber !== 1) {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                });
            }
        });

        const buf = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'Reporte_de_Departamentos.xlsx');
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-3">
                <Button label="Exportar a JSON" icon="pi pi-file" className="p-button-warning" onClick={exportJSON} />
                <Button label="Exportar a EXCEL" icon="pi pi-file-excel" className="p-button-success" onClick={exportToExcel} />
                <Button label="Exportar a PDF" icon="pi pi-file-pdf" className="p-button-danger" onClick={exportPDF} />
            </div>
        );
    };

    const statusBodyTemplate = (rowData: Department) => {
        return <Tag className="text-sm font-bold" value={getDatoStatus(rowData)} severity={getSeverity(rowData)}></Tag>;
    };

    const actionBodyTemplate = (rowData: Department) => {
        return (
            <React.Fragment>
                <div className="flex align-align-content-center justify-content-evenly">
                    <Button icon="pi pi-eye" rounded outlined severity='info' onClick={() => details(rowData)} />
                </div>
            </React.Fragment>
        );
    };

    const getDatoStatus = (department: Department) => {
        switch (department.status) {
            case true:
                return 'ACTIVO';

            case false:
                return 'INACTIVO';

            default:
                return null;
        }
    };

    const getSeverity = (department: Department) => {
        switch (department.status) {
            case true:
                return 'success';

            case false:
                return 'danger';

            default:
                return null;
        }
    };

    //? -------------------- TABS (DETAILS DIALOG) -------------------
    // const tab1HeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {
    //     return (
    //         <div className="flex align-items-center gap-2 p-3 justify-content-center" style={{ cursor: 'pointer' }} onClick={options.onClick}>
    //             <span className="font-bold white-space-nowrap">DATOS PERSONALES</span>
    //         </div>
    //     );
    // };

    // const tab2HeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {
    //     return (
    //         <div className="flex align-items-center gap-2 p-3 justify-content-center" style={{ cursor: 'pointer' }} onClick={options.onClick}>
    //             <span className="font-bold white-space-nowrap">DATOS DEL TRABAJO</span>
    //         </div>
    //     )
    // };

    // const tab3HeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {
    //     return (
    //         <div className="flex align-items-center gap-2 p-3 justify-content-center" style={{ cursor: 'pointer' }} onClick={options.onClick}>
    //             <span className="font-bold white-space-nowrap">OTROS DATOS</span>
    //         </div>
    //     )
    // };

    //? -------------------- RENDER -------------------
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <h3>Departamentos</h3>
                <BreadCrumb model={items} home={home} />

                <Toolbar className="my-4" right={rightToolbarTemplate}></Toolbar>

                {/* //? -------------------- DATATABLE ------------------- */}

                <DataTable ref={dt} dataKey="id" value={departments} filters={filters} loading={loading}
                    paginator rows={15} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} departamentos"
                    // rowsPerPageOptions={[5, 10, 25]}
                    globalFilterFields={['name', 'description']} header={header} emptyMessage="No se encontraron departamentos."
                    filterDisplay="row"
                    stripedRows
                    scrollable
                >
                    <Column header="ID" body={(rowData) => <span>{departments.indexOf(rowData) + 1}</span>} />
                    <Column sortable field="name" header="NOMBRE" filter filterPlaceholder="Filtrar por nombre" style={{ minWidth: '12rem' }} />
                    <Column sortable field="description" header="DESCRIPCION" filterField="description" style={{ minWidth: '12rem' }} body={desBodyTemplate} filter filterPlaceholder="Filtrar por descripcion" />
                    <Column field="status" header="ESTADO" style={{ minWidth: '4rem' }} body={statusBodyTemplate} sortable />
                    {/* <Column style={{ minWidth: '12rem' }} header="EMPRESA" body={(rowData) => <Chip className='font-bold uppercase' label={`${rowData.company.business_name}`} />} /> */}
                    <Column style={{ minWidth: '12rem' }} header="CREADO EL" body={(rowData) => <Chip className='font-bold' label={`${new Date(rowData.createdAt).toLocaleDateString()} - ${new Date(rowData.createdAt).toLocaleTimeString()}`} />} />
                    <Column style={{ minWidth: '12rem' }} header="ULTIMA ACTUALIZACION" body={(rowData) => <Chip className='font-bold' label={`${new Date(rowData.updatedAt).toLocaleDateString()} - ${new Date(rowData.updatedAt).toLocaleTimeString()}`} />} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '5rem' }} alignFrozen='right' frozen></Column>
                </DataTable>
            </div>
            {/* //? -------------------- MODAL DIALOG (ONLY READ) ------------------- */}
            <Dialog visible={detailsDialog} style={{ width: '62rem', minWidth: '40rem', maxWidth: '90vw', minHeight: '40rem', maxHeight: '90vh' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles del departamento" modal className='p-fluid' footer={detailDialogFooter} onHide={hideDetailsDialog}>
                <div className="confirmation-content">
                    {department && (<>
                        {department.id ? (<>
                            <div className="card">
                                <div className="field mt-5 mb-3">
                                    <div className="formgrid grid">
                                        <div className="col-12">
                                            <div className="flex flex-wrap gap-3 justify-content-evenly">
                                                <Chip label={`DEPARTAMENTO: ${department.name}`} className='text-lg font-bold uppercase' />
                                                <Chip label={`DESCRIPCION: ${department.description}`} className='text-lg font-bold uppercase' />
                                            </div>
                                            <Divider align="center" className='my-5'>
                                                <span className="p-tag">Otros Datos</span>
                                            </Divider>
                                            <div className="flex flex-wrap gap-3 justify-content-evenly">
                                                <Chip label={`CREADO EL: ${new Date(department.createdAt).toLocaleDateString()} - ${new Date(department.createdAt).toLocaleTimeString()}`} className='text-lg font-bold' />
                                                <Chip label={`ULTIMA ACTUALIZACION: ${new Date(department.updatedAt).toLocaleDateString()} - ${new Date(department.updatedAt).toLocaleTimeString()}`} className='text-lg font-bold' />
                                                <Tag className="text-lg font-bold" value={`ESTADO ${getDatoStatus(department)}`} severity={getSeverity(department)}></Tag>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>) : (<></>)}
                    </>)}
                </div>
            </Dialog>
        </div >
    );
}