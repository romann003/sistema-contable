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

import { useAreas } from '../../../api/context/AreaContext';
import { useDepartments } from '../../../api/context/DepartmentContext';
import { useCompany } from '../../../api/context/CompanyContext';

import * as cdT from '../../../layout/components/ColumnBody.js';
import * as m from '../../../layout/components/Modals.js';
import { BreadComp } from '../../../layout/components/BreadComp.js';
import DataTableCrud from '../../../layout/components/DataTableCrud.js';

interface Area {
    id: number | null;
    name: string;
    description: string;
    salary: string | null;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    area: string | null;
    departmentId: number | null;
}

const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    description: { value: null, matchMode: FilterMatchMode.CONTAINS },
    salary: { value: null, matchMode: FilterMatchMode.EQUALS },
    'department.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
}

export default function ReportAreasPage() {

    //? -------------------- CONTEXT API -------------------
    const { departments, getDepartments } = useDepartments();
    const { areas, getAreas } = useAreas();
    const { companies, getCompany } = useCompany();
    //? -------------------- STATES -------------------
    const toast = useRef<Toast>(null);
    //? -------------------- DIALOGS STATES -------------------
    const [area, setArea] = useState<Area | null>(null);
    const [detailsDialog, setDetailsDialog] = useState<boolean>(false);
    //? -------------------- DATATABLE STATES -------------------
    const dt = useRef<DataTable<Area[]>>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
    const [loading, setLoading] = useState<boolean>(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    //? -------------------- DATATABLE INPUT TEMPLATES -------------------
    const nameBodyTemplate = (rowData: Area) => {
        return <cdT.ColumnTextBody value={rowData.name} />;
    };

    const desBodyTemplate = (rowData: Area) => {
        return <cdT.ColumnTextBody value={rowData.description} />;
    };

    const salaryBodyTemplate = (rowData: Area) => {
        return <cdT.SalaryDisplay salary={rowData.salary} className="text-green-500 mx-2"/>
    };

    const departmentBodyTemplate = (rowData: Area) => {
        return <cdT.ColumnChipBody value={rowData.department.name} />;
    };

    const statusBodyTemplate = (rowData: Area) => {
        return <cdT.ColumnStatusBody value={rowData} />;
    };

    const createdAtBodyTemplate = (rowData: Area) => {
        return <cdT.ColumnDateBody value={rowData.createdAt} />
    };

    const updatedAtBodyTemplate = (rowData: Area) => {
        return <cdT.ColumnDateBody value={rowData.updatedAt} />
    };

    const actionBodyTemplate = (rowData: Area) => {
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
        getAreas();
        getCompany(1);
        setLoading(false);
    }, [area]);


    //? -------------------- DETAILS DIALOGS -------------------
    const hideDetailsDialog = () => {
        setDetailsDialog(false);
    };

    const details = (area: Area) => {
        setArea({ ...area });
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
        doc.text('Reporte de Puestos', 105, marginTop + 10, { align: 'center' });

        const tableColumn = ["ID", "Nombre", "Descripción", "Salario", "Departamento", "Estado", "Creado el", "Última Actualización"];
        const tableRows = areas.map((area, index) => [
            // area.id,
            index + 1,
            area.name,
            area.description,
            cdT.formatCurrency(parseFloat(area.salary)),
            area.department.name,
            area.status ? 'ACTIVO' : 'INACTIVO',
            new Date(area.createdAt).toLocaleDateString() + ' ' + new Date(area.createdAt).toLocaleTimeString(),
            new Date(area.updatedAt).toLocaleDateString() + ' ' + new Date(area.updatedAt).toLocaleTimeString()
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: marginTop + 15,
            theme: 'grid',
        });

        doc.save('reporte_puestos.pdf');

    }

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte de Puestos');

        worksheet.columns = [
            { header: 'No.', key: 'id', width: 10 },
            { header: 'Nombre', key: 'name', width: 30 },
            { header: 'Descripción', key: 'description', width: 30 },
            { header: 'Salario', key: 'salary', width: 20 },
            { header: 'Departamento', key: 'department', width: 20 },
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

        areas.forEach((item, index) => {
            worksheet.addRow({
                // id: item.id,
                id: index + 1,
                name: item.name,
                description: item.description,
                salary: cdT.formatCurrency(parseFloat(item.salary)),
                department: item.department.name,
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
        saveAs(blob, 'Reporte_de_Puestos.xlsx');
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
                <h3>Puestos</h3>
                <BreadComp pre="Reportes" texto="Puestos" valid={true} />
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
                    message="puestos"
                    headerMessage="Reporte de Puestos"
                    refe={dt}
                    value={areas}
                    filters={filters}
                    loading={loading}
                    setFilters={setFilters}
                    setGlobalFilterValue={setGlobalFilterValue}
                    globalFilterValue={globalFilterValue}
                    globalFilterFields={['name', 'description', 'salary', 'department.name']}
                    //? -------------------- COLUMNS -------------------
                    columns={[
                        { field: 'name', header: 'Puesto', body: nameBodyTemplate, dataType: 'text', filter: true },
                        { field: 'description', header: 'Descripción', body: desBodyTemplate, dataType: 'text', filter: true },
                        { field: 'salary', header: 'Salario', body: salaryBodyTemplate, dataType: 'numeric', filter: true },
                        { field: 'department.name', header: 'Departamento', body: departmentBodyTemplate, dataType: 'text', filter: true },
                        { field: 'status', header: 'Estado', body: statusBodyTemplate, dataType: 'boolean', filter: false },
                        { field: 'createdAt', header: 'Creado el', body: createdAtBodyTemplate, dataType: 'date', filter: false },
                        { field: 'updatedAt', header: 'Ultima Actualización', body: updatedAtBodyTemplate, filter: false, dataType: 'date' },
                    ]}
                    size='8rem'
                    actionBodyTemplate={actionBodyTemplate}
                />
            </div>
            {/* //? -------------------- MODAL DIALOG (ONLY READ) ------------------- */}
            <m.LargeModal visible={detailsDialog} header="Detalles del Puesto" footer={detailDialogFooter} onHide={hideDetailsDialog} blockScroll={true} closeOnEscape={true} dismissableMask={true}>
                <div className="confirmation-content">
                    {area && (<>
                        {area.id && (
                            <div className="card">
                                <div className="field mt-5 mb-3">
                                    <div className="formgrid grid">
                                        <div className="col-12">
                                            <div className="flex flex-wrap gap-3 justify-content-between">
                                                <label className='text-md capitalize'> <b>PUESTO:</b> {area.name}</label>
                                                <label className='text-md capitalize'> <b>DEPARTAMENTO:</b> {area.department.name}</label>
                                                <div className="flex align-items-center">
                                                    <label className='text-md capitalize'> <b>SALARIO DEL PUESTO:</b></label>
                                                    <cdT.SalaryDisplay salary={area.salary} className="text-green-500"/>
                                                </div>
                                                    <label className='text-md capitalize'> <b>DESCRIPCION:</b> {area.description}</label>
                                            </div>

                                            <Divider align="center" className='my-5'>
                                                <span className="p-tag">Otros Datos</span>
                                            </Divider>
                                            <div className="flex flex-wrap gap-3 justify-content-between">

                                                <label className='text-md capitalize'><b>Fecha de Creación: </b>
                                                    <cdT.ColumnDateBodyText value={area.createdAt} className={"text-primary"} />
                                                </label>

                                                <label className='text-md capitalize'><b>última Actualización: </b>
                                                    <cdT.ColumnDateBodyText value={area.updatedAt} className={"text-primary"} />
                                                </label>
                                                <label className='text-md capitalize'><b>Estado del Departamento: </b>
                                                    {area.status ? (<span className="p-tag text-sm p-tag-success">Activo</span>) : (<span className="p-tag text-sm p-tag-danger">Inactivo</span>)}
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