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
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc);

import { useEmployees } from '../../../api/context/EmployeeContext';
import { useCompany } from '../../../api/context/CompanyContext';

import * as cdT from '../../../layout/components/ColumnBody.js';
import * as m from '../../../layout/components/Modals.js';
import { BreadComp } from '../../../layout/components/BreadComp.js';
import DataTableCrud from '../../../layout/components/DataTableCrud.js';
import { TabPanel, TabPanelHeaderTemplateOptions, TabView } from 'primereact/tabview';

export interface Employee {
  id: number | null;
  name: string;
  last_name: string;
  fullName: string;
  phone: string | null;
  country: string | null;
  identification_type: string | null;
  identification: string | null;
  nit: string | null;
  igss: string | null;
  gender: string | null;
  birthdate: string;
  address: string;
  hire_date: string;
  contract_type: string;
  work_day: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  department: string | null;
  departmentId: number | null;
  employee: string | null;
  area: string;
  areaId: number | null;
}

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  fullName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  phone: { value: null, matchMode: FilterMatchMode.CONTAINS },
  identification: { value: null, matchMode: FilterMatchMode.CONTAINS },
  nit: { value: null, matchMode: FilterMatchMode.CONTAINS },
  igss: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'department.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
  'area.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
  birthdate: { value: null, matchMode: FilterMatchMode.CONTAINS },
}

export default function ReporteEmployeesPage() {
  //? -------------------- CONTEXT API -------------------
  const { employees, getEmployees } = useEmployees();
  const { companies, getCompanyReportes } = useCompany();
  //? -------------------- STATES -------------------
  const toast = useRef<Toast>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  //? -------------------- DIALOG STATES -------------------
  const [seeEmployeeDialog, setSeeEmployeeDialog] = useState<boolean>(false);
  //? -------------------- DATATABLE STATES -------------------
  const dt = useRef<DataTable<Employee[]>>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  //? -------------------- DATATABLE COLUMN TEMPLATES -------------------
  const fullNameBodyTemplate = (rowData: Employee) => {
    return <cdT.ColumnTextBody value={rowData.fullName} />
  };

  const phoneBodyTemplate = (rowData: Employee) => {
    return <cdT.ColumnTextBody value={rowData.phone} />
  };

  const identificationBodyTemplate = (rowData: Employee) => {
    return <cdT.ColumnTextBody value={rowData.identification} />
  };

  const nitBodyTemplate = (rowData: Employee) => {
    return <cdT.ColumnTextBody value={rowData.nit} />
  };

  const igssBodyTemplate = (rowData: Employee) => {
    return <cdT.ColumnTextBody value={rowData.igss} />
  };

  const departmentBodyTemplate = (rowData: Employee) => {
    return <cdT.ColumnChipBody value={rowData.department.name} />
  };

  const areaBodyTemplate = (rowData: Employee) => {
    return <cdT.ColumnChipBody value={rowData.area.name} />
  };

  const birthdateBodyTemplate = (rowData: Employee) => {
    return <cdT.ColumnOnlyDateBody value={rowData.birthdate} />
  }

  const statusBodyTemplate = (rowData: Employee) => {
    return <cdT.ColumnStatusBody value={rowData} />
  };

  const createdAtBodyTemplate = (rowData: Employee) => {
    return <cdT.ColumnDateBody value={rowData.createdAt} />
  };

  const updatedAtBodyTemplate = (rowData: Employee) => {
    return <cdT.ColumnDateBody value={rowData.updatedAt} />
  };

  const actionBodyTemplate = (rowData: Employee) => {
    return (
      <React.Fragment>
        <div className="flex align-align-content-center justify-content-evenly">
          <Button icon="pi pi-eye" rounded outlined severity='info' onClick={() => seeEmployee(rowData)} />

        </div>
      </React.Fragment>
    );
  };

  //? -------------------- DATA LOADING -------------------
  useEffect(() => {
    getEmployees();
    getCompanyReportes(1);
    setLoading(false);
  }, [employee]);

  //? -------------------- DETAILS DIALOGS -------------------
  const hideSeeDialog = () => {
    setSeeEmployeeDialog(false);
  };

  const seeEmployee = (employee: Employee) => {
    setEmployee({ ...employee });
    setSeeEmployeeDialog(true);
  };

  const seeDialogFooter = (
    <React.Fragment>
      <Button label="Salir de la vista" icon="pi pi-times" outlined onClick={hideSeeDialog} />
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
    doc.text('Reporte de Empleados', 105, marginTop + 10, { align: 'center' });

    const tableColumn = ["ID", "Empleado", "No.Telefono", "No.Identificacion", "No.NIT", "No.IGSS", "Estado", "Creado el", "Última Actualización"];
    const tableRows = employees.map((employee, index) => [
      // employee.id,
      index + 1,
      employee.fullName,
      employee.phone,
      employee.identification_type + ': ' + employee.identification,
      employee.nit,
      employee.igss,
      employee.status ? 'ACTIVO' : 'INACTIVO',
      new Date(employee.createdAt).toLocaleDateString() + ' ' + new Date(employee.createdAt).toLocaleTimeString(),
      new Date(employee.updatedAt).toLocaleDateString() + ' ' + new Date(employee.updatedAt).toLocaleTimeString()
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: marginTop + 15,
      theme: 'grid',
    });

    doc.save('reporte_empleados.pdf');

  }

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Empleados');

    worksheet.columns = [
      { header: 'No.', key: 'id', width: 10 },
      { header: 'Empleado', key: 'name', width: 30 },
      { header: 'Tipo Identificacion', key: 'identification_type', width: 30 },
      { header: 'Numero Identificacion', key: 'identification', width: 20 },
      { header: 'Numero NIT', key: 'nit', width: 20 },
      { header: 'Numero IGSS', key: 'igss', width: 20 },
      { header: 'Numero Telefono', key: 'phone', width: 20 },
      { header: 'Pais', key: 'country', width: 20 },
      { header: 'Genero', key: 'gender', width: 20 },
      { header: 'Fecha Nacimiento', key: 'birthdate', width: 20 },
      { header: 'Direccion', key: 'address', width: 20 },
      { header: 'Fecha Contratacion', key: 'hire_date', width: 20 },
      { header: 'Tipo Contrato', key: 'contract_type', width: 20 },
      { header: 'Jornada Laboral', key: 'work_day', width: 20 },
      { header: 'Departamento', key: 'department', width: 20 },
      { header: 'Puesto', key: 'area', width: 20 },
      { header: 'Salario Base', key: 'salary', width: 20 },
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

    employees.forEach((item, index) => {
      worksheet.addRow({
        // id: item.id,
        id: index + 1,
        name: item.fullName,
        identification_type: item.identification_type,
        identification: item.identification,
        nit: item.nit,
        igss: item.igss,
        phone: item.phone,
        country: item.country,
        gender: item.gender,
        birthdate: dayjs.utc(item.birthdate).format('DD/MM/YYYY'),
        address: item.address,
        hire_date: dayjs.utc(item.hire_date).format('DD/MM/YYYY'),
        contract_type: item.contract_type,
        work_day: item.work_day,
        department: item.department.name,
        area: item.area.name,
        salary: cdT.formatCurrency(parseFloat(item.area.salary)),
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
    saveAs(blob, 'Reporte_de_Empleados.xlsx');
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
        <h3>Empleados</h3>
        <BreadComp pre="Reportes" texto="Empleados" valid={true} />
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
          message="empleados"
          headerMessage="Reporte de Empleados"
          refe={dt}
          value={employees}
          filters={filters}
          loading={loading}
          setFilters={setFilters}
          setGlobalFilterValue={setGlobalFilterValue}
          globalFilterValue={globalFilterValue}
          globalFilterFields={['fullName', 'phone', 'identification', 'nit', 'igss', 'department.name', 'area.name', 'birthdate']}
          //? -------------------- COLUMNS -------------------
          columns={[
            { field: 'fullName', header: 'Empleado', body: fullNameBodyTemplate, dataType: 'text', filter: true },
            { field: 'phone', header: 'Telefono', body: phoneBodyTemplate, dataType: 'numeric', filter: true },
            { field: 'identification', header: 'Identificacion', body: identificationBodyTemplate, dataType: 'numeric', filter: true },
            { field: 'nit', header: 'NIT', body: nitBodyTemplate, dataType: 'text', filter: true },
            { field: 'igss', header: 'IGSS', body: igssBodyTemplate, dataType: 'numeric', filter: true },
            { field: 'department.name', header: 'Departamento', body: departmentBodyTemplate, dataType: 'text', filter: true },
            { field: 'area.name', header: 'Area', body: areaBodyTemplate, dataType: 'text', filter: true },
            { field: 'birthdate', header: 'Fecha Cumple', body: birthdateBodyTemplate, dataType: 'date', filter: true },
            { field: 'status', header: 'Estado', body: statusBodyTemplate, dataType: 'boolean', filter: false },
            { field: 'createdAt', header: 'Creado el', body: createdAtBodyTemplate, dataType: 'date', filter: false },
            { field: 'updatedAt', header: 'Ultima Actualizacion', body: updatedAtBodyTemplate, dataType: 'date', filter: false }]}
          size='5rem'
          actionBodyTemplate={actionBodyTemplate}
        />
      </div>
      {/* //? -------------------- MODAL DIALOG (ONLY READ) ------------------- */}
      <m.LargeModal visible={seeEmployeeDialog} header="Detalles del Empleado" footer={seeDialogFooter} onHide={hideSeeDialog} blockScroll={true} closeOnEscape={true} dismissableMask={true}>
        {employee && (<>
          {employee.id && (
            <div className="card">
              <TabView>
                <TabPanel className='w-full' header="Header I" headerTemplate={(options: TabPanelHeaderTemplateOptions) => m.TabHeaderTemplate(options, 'DATOS DEL EMPLEADO')}>
                  <div className="field mt-5 mb-3">
                    <div className="formgrid grid">
                      <div className="col-12">
                        <div className="flex flex-wrap gap-3 justify-content-between">
                          <label className='text-md capitalize'> <b>EMPLEADO:</b> {employee.fullName}</label>
                          <label className='text-md capitalize'> <b>NO TELEFONO:</b> {employee.phone}</label>
                          <label className='text-md capitalize'> <b>NO {employee.identification_type}:</b> {employee.identification}</label>
                          <label className='text-md capitalize'> <b>NO NIT:</b> {employee.nit}</label>
                          <label className='text-md capitalize'> <b>NO IGSS:</b> {employee.igss}</label>
                          <Divider align="center" />
                          <label className='text-md capitalize'> <b>PAIS:</b> {employee.country}</label>
                          <label className='text-md capitalize'> <b>GENERO:</b> {employee.gender}</label>
                          <label className='text-md capitalize'> <b>FECHA NACIMIENTO: </b>
                            <cdT.ColumnOnlyDateBodyText value={employee.birthdate} className={''} />
                          </label>
                          <label className='text-md capitalize'> <b>DIRECCION:</b> {employee.address}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel className='w-full' header="Header II" headerTemplate={(options: TabPanelHeaderTemplateOptions) => m.TabHeaderTemplate(options, 'LUGAR DE TRABAJO')}>
                  <div className="field mt-5 mb-3">
                    <div className="formgrid grid">
                      <div className="col-12">
                        <div className="flex flex-wrap gap-3 justify-content-between">
                          <label className='text-md capitalize'> <b>FECHA CONTRATACION:</b> <cdT.ColumnOnlyDateBodyText value={employee.hire_date} className={''} /> </label>
                          <label className='text-md capitalize'> <b>TIPO CONTRATO:</b> {employee.contract_type}</label>
                          <label className='text-md capitalize'> <b>JORNADA LABORAL:</b> {employee.work_day}</label>
                          <label className='text-md capitalize'> <b>DEPARTAMENTO:</b> {employee.department.name}</label>
                          <label className='text-md capitalize'> <b>PUESTO:</b> {employee.area.name}</label>
                          <div className="flex align-items-center">
                            <label className='text-md capitalize'> <b>SALARIO BASE:</b></label>
                            <cdT.SalaryDisplay salary={employee.area.salary} className="text-green-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel className='w-full' header="Header III" headerTemplate={(options: TabPanelHeaderTemplateOptions) => m.TabHeaderTemplate(options, 'OTROS DATOS')}>
                  <div className="field mt-5 mb-3">
                    <div className="formgrid grid">
                      <div className="col-12">
                        <div className="flex flex-wrap gap-3 justify-content-between">
                          <Divider align="center" />
                          <label className='text-md'> <b>CREADO EL: </b>
                            <cdT.ColumnDateBodyText value={employee.createdAt} className={'text-primary'} />
                          </label>
                          <label className='text-md'> <b>ULTIMA ACTUALIZACION: </b>
                            <cdT.ColumnDateBodyText value={employee.createdAt} className={'text-primary'} />
                          </label>

                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabView>
            </div>
          )}
        </>)}
      </m.LargeModal>
    </div>
  )
}