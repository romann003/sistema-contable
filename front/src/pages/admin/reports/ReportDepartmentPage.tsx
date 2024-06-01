import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { FilterMatchMode } from 'primereact/api';
import { DataTableFilterMeta } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { useDepartments } from '../../../api/context/DepartmentContext';
import { useCompany } from '../../../api/context/CompanyContext';

import * as cdT from '../../../layout/components/ColumnBody.js';
import * as m from '../../../layout/components/Modals.js';
import { BreadComp } from '../../../layout/components/BreadComp.js';
import DataTableCrud from '../../../layout/components/DataTableCrud.js';

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

const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    description: { value: null, matchMode: FilterMatchMode.CONTAINS },
}

export default function ReportDepartmentPage() {

    //? -------------------- CONTEXT API -------------------
    const { departments, getDepartments } = useDepartments();
    const { companies, getCompanyReportes } = useCompany();
    //? -------------------- STATES -------------------
    const toast = useRef<Toast>(null);
    //? -------------------- DIALOGS STATES -------------------
    const [department, setDepartment] = useState<Department | null>(null);
    const [detailsDialog, setDetailsDialog] = useState<boolean>(false);
    //? -------------------- DATATABLE STATES -------------------
    const dt = useRef<DataTable<Department[]>>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
    const [loading, setLoading] = useState<boolean>(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    //? -------------------- DATATABLE INPUT TEMPLATES -------------------
    const nameBodyTemplate = (rowData: Department) => {
        return <cdT.ColumnTextBody value={rowData.name} />;
    };

    const desBodyTemplate = (rowData: Department) => {
        return <cdT.ColumnTextBody value={rowData.description} />;
    };

    const statusBodyTemplate = (rowData: Department) => {
        return <cdT.ColumnStatusBody value={rowData} />;
    };

    const createdAtBodyTemplate = (rowData: Department) => {
        return <cdT.ColumnDateBody value={rowData.createdAt} />
    };

    const updatedAtBodyTemplate = (rowData: Department) => {
        return <cdT.ColumnDateBody value={rowData.updatedAt} />
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

    //? -------------------- LOADING DATA -------------------
    useEffect(() => {
        getDepartments()
        getCompanyReportes(1);
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

    //? -------------------- DATATABLE ACTIONS -------------------
    const exportPDF = () => {
        const doc = new jsPDF();

        const headerText = `${companies.business_name.toUpperCase()}\nNIT: ${companies.nit}\n${companies.address}\nNO. TEL: ${companies.phone}`;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(headerText, 105, 10, { align: 'center' });

        const marginTop = doc.getTextDimensions(headerText).h + 30;
        doc.text('Reporte de Departamentos', 105, marginTop + 10, { align: 'center' });

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
                <Button label="Exportar a EXCEL" icon="pi pi-file-excel" className="p-button-warning" onClick={exportToExcel} />
                <Button label="Exportar a PDF" icon="pi pi-file-pdf" className="p-button-danger" onClick={exportPDF} />
            </div>
        );
    };

    //? -------------------- RENDER -------------------
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <h3>Departamentos</h3>
                <BreadComp pre="Reportes" texto="Departamentos" valid={true} />
                <Toolbar className="my-4" right={rightToolbarTemplate}></Toolbar>

                {/* //? -------------------- DATATABLE ------------------- */}
                <DataTableCrud
                    dtSize="small"
                    buscador={true}
                    btActive={false}
                    btnSize="small"
                    btnColor="primary"
                    btnText={""}
                    openNew={null}
                    //? -------------------- HEADER -------------------
                    message="departamentos"
                    headerMessage="Reporte de Departamentos"
                    refe={dt}
                    value={departments}
                    filters={filters}
                    loading={loading}
                    setFilters={setFilters}
                    setGlobalFilterValue={setGlobalFilterValue}
                    globalFilterValue={globalFilterValue}
                    globalFilterFields={['name', 'description']}
                    //? -------------------- COLUMNS -------------------
                    columns={[
                        { field: 'name', header: 'Departamento', body: nameBodyTemplate, dataType: 'text', filter: true },
                        { field: 'description', header: 'Descripción', body: desBodyTemplate, dataType: 'text', filter: true },
                        { field: 'status', header: 'Estado', body: statusBodyTemplate, dataType: 'boolean', filter: false },
                        { field: 'createdAt', header: 'Creado el', body: createdAtBodyTemplate, dataType: 'date', filter: false },
                        { field: 'updatedAt', header: 'Ultima Actualización', body: updatedAtBodyTemplate, filter: false, dataType: 'date' },
                    ]}
                    size='5rem'
                    actionBodyTemplate={actionBodyTemplate}
                />
            </div>
            {/* //? -------------------- MODAL DIALOG (ONLY READ) ------------------- */}
            <m.LargeModal visible={detailsDialog} header="Detalles del Departamento" footer={detailDialogFooter} onHide={hideDetailsDialog} blockScroll={true} closeOnEscape={true} dismissableMask={true}>
                <div className="confirmation-content">
                    {department && (<>
                        {department.id && (
                            <div className="card">
                                <div className="field mt-5 mb-3">
                                    <div className="formgrid grid">
                                        <div className="col-12">
                                            <div className="flex flex-wrap gap-3 justify-content-between">

                                                <label className='text-md capitalize'> <b>DEPARTAMENTO:</b> {department.name}</label>
                                                <label className='text-md capitalize'> <b>DESCRIPCION:</b> {department.description}</label>
                                            </div>
                                            <Divider align="center" className='my-5'>
                                                <span className="p-tag">Otros Datos</span>
                                            </Divider>
                                            <div className="flex flex-wrap gap-3 justify-content-between">

                                                <label className='text-md capitalize'><b>Fecha de Creación: </b>
                                                    <cdT.ColumnDateBodyText value={department.createdAt} className={"text-primary"} />
                                                </label>

                                                <label className='text-md capitalize'><b>última Actualización: </b>
                                                    <cdT.ColumnDateBodyText value={department.updatedAt} className={"text-primary"} />
                                                </label>
                                                <label className='text-md capitalize'><b>Estado del Departamento: </b>
                                                    {department.status ? (<span className="p-tag text-sm p-tag-success">Activo</span>) : (<span className="p-tag text-sm p-tag-danger">Inactivo</span>)}
                                                </label>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>)}
                </div>
            </m.LargeModal>
        </div >
    );
}