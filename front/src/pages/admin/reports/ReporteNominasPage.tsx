//? -------------------- COMPONENTES Y LIBRERIAS -------------------
import React, { useEffect, useRef, useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import { TabPanel, TabPanelHeaderTemplateOptions, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import * as cdT from '../../../layout/components/ColumnBody.js';
import * as m from '../../../layout/components/Modals.js';
import { BreadComp } from '../../../layout/components/BreadComp.js';
import DataTableCrud from '../../../layout/components/DataTableCrud.js';

//? -------------------- API -------------------
import { useNominas } from '../../../api/context/NominaContext';
import { useCompany } from '../../../api/context/CompanyContext';


interface Nomina {
  id: number | null;
  cantidad_horas_extra: number | null;
  sueldo_horas_extra: number | null;
  total_percepciones: number | null;
  isr: number | null;
  total_igss: number | null;
  prestamos: number | null;
  anticipo_salario: number | null;
  total_deducciones: number | null;
  liquido_percibir: number | null;
  createdAt: string;
  updatedAt: string;
  employee: string;
  employeeId: number | null;
  company: string;
  companyId: number | null;
  periodo: string;
  periodoId: number | null;
  bonificaciones: Bonificacion[];
  total_bonificaciones: number | null;
}

interface Bonificacion {
  descripcion: string;
  cantidad: number | null;
}

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'employee.fullName': { value: null, matchMode: FilterMatchMode.CONTAINS },
  'employee.identification': { value: null, matchMode: FilterMatchMode.CONTAINS },
  'employee.department.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
  'employee.area.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
  'employee.area.salary': { value: null, matchMode: FilterMatchMode.CONTAINS },
  'periodo.fecha_pago': { value: null, matchMode: FilterMatchMode.CONTAINS },
  'periodo.periodo_liquidacion_inicio': { value: null, matchMode: FilterMatchMode.CONTAINS },
  'periodo.periodo_liquidacion_final': { value: null, matchMode: FilterMatchMode.CONTAINS },
}

export default function ReporteNominasPage() {

  //? -------------------- CONTEXT API -------------------
  const { nominas, getNominas } = useNominas();
  const { companies, getCompanyReportes } = useCompany();
  //? -------------------- STATES -------------------
  const [nomina, setNomina] = useState<Nomina | null>(null);
  const toast = useRef<Toast>(null);
  //? -------------------- DIALOG STATES -------------------
  const [seeNominaDialog, setSeeNominaDialog] = useState<boolean>(false);
  const [getFecha, setGetFecha] = useState<string>('');
  //? -------------------- DATATABLE STATES -------------------
  const dt = useRef<DataTable<Nomina[]>>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  //? -------------------- NOMINAS DATATABLE COLUMN TEMPLATES -------------------
  const nameBodyTemplate = (rowData: Nomina) => {
    return <cdT.ColumnTextBody value={rowData.employee.fullName} />
  };

  const identificationBodyTemplate = (rowData: Nomina) => {
    return <cdT.ColumnTextBody value={rowData.employee.identification} />
  };

  const departmentBodyTemplate = (rowData: Nomina) => {
    return <cdT.ColumnChipBody value={rowData.employee.department.name} />
  };

  const areaBodyTemplate = (rowData: Nomina) => {
    return <cdT.ColumnChipBody value={rowData.employee.area.name} />
  };

  const salaryBodyTemplate = (rowData: Nomina) => {
    return <cdT.SalaryDisplay salary={rowData.employee.area.salary} className="text-green-500" />
  };

  const fechaPagoBodyTemplate = (rowData: Nomina) => {
    return <cdT.ColumnOnlyDateBodyWithClass value={rowData.periodo.fecha_pago} className={'text-orange-600'} />
  };

  const fechaLiquiIniBodyTemplate = (rowData: Nomina) => {
    return <cdT.ColumnOnlyDateBodyWithClass value={rowData.periodo.periodo_liquidacion_inicio} className={'bg-gray-200 border-round-2xl '} />
  };

  const fechaLiquiFinBodyTemplate = (rowData: Nomina) => {
    return <cdT.ColumnOnlyDateBodyWithClass value={rowData.periodo.periodo_liquidacion_final} className={'bg-gray-200 border-round-2xl '} />
  };

  const createdAtBodyTemplate = (rowData: Nomina) => {
    return <cdT.ColumnDateBody value={rowData.createdAt} />
  };

  const updatedAtBodyTemplate = (rowData: Nomina) => {
    return <cdT.ColumnDateBody value={rowData.updatedAt} />
  };

  const actionBodyTemplate = (rowData: Nomina) => {
    return (
      <React.Fragment>
        <div className="flex align-align-content-center justify-content-evenly">
          <Button icon="pi pi-eye" rounded outlined severity='info' onClick={() => seeNomina(rowData)} />

        </div>
      </React.Fragment>
    );
  };

  //? -------------------- DATA LOADING -------------------
  useEffect(() => {
    getNominas();
    getCompanyReportes(1);
    setLoading(false);
  }, [nomina]);

  useEffect(() => {
  }, [getFecha]);
  //? -------------------- DETAILS DIALOGS -------------------
  const seeNomina = (nomina: Nomina) => {
    setNomina({ ...nomina });
    setSeeNominaDialog(true);
  };

  const hideSeeDialog = () => {
    setSeeNominaDialog(false);
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

    doc.text('Reporte de Nominas', 105, marginTop + 10, { align: 'center' });

    const tableColumn = ["ID", "Empleado", "Fecha Inicio", "Fecha Final", "Fecha Pago", "Total Ingresos", "Total Descuentos", "Salario Total", "Creado el"];

    const tableRows = nominas.map((nomina, index) => [
      index + 1,
      nomina.employee.fullName,
      dayjs.utc(nomina.periodo.periodo_liquidacion_inicio).format('DD/MM/YYYY'),
      dayjs.utc(nomina.periodo.periodo_liquidacion_final).format('DD/MM/YYYY'),
      dayjs.utc(nomina.periodo.fecha_pago).format('DD/MM/YYYY'),
      cdT.formatCurrency(parseFloat(nomina.total_percepciones)),
      cdT.formatCurrency(parseFloat(nomina.total_deducciones)),
      cdT.formatCurrency(parseFloat(nomina.liquido_percibir)),
      new Date(nomina.createdAt).toLocaleDateString() + ' ' + new Date(nomina.createdAt).toLocaleTimeString()
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: marginTop + 15,
      theme: 'grid',
    });

    doc.save('reporte_nominas.pdf');
  }

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Nominas');

    worksheet.columns = [
      { header: 'No.', key: 'id', width: 10 },
      { header: 'Empleado', key: 'name', width: 30 },
      { header: 'Departamento', key: 'department', width: 30 },
      { header: 'Puesto', key: 'area', width: 20 },
      { header: 'Tipo de Contrato', key: 'contract_type', width: 20 },
      { header: 'Jornada Laboral', key: 'work_day', width: 20 },
      { header: 'Fecha Inicio Mes', key: 'periodo_liquidacion_inicio', width: 20 },
      { header: 'Fecha Final Mes', key: 'periodo_liquidacion_final', width: 20 },
      { header: 'Fecha de Pago', key: 'fecha_pago', width: 20 },
      { header: 'Salario Base', key: 'salary', width: 20 },
      { header: 'Bonificaciones', key: 'total_bonificaciones', width: 20 },
      { header: 'Numero Horas Extra', key: 'cantidad_horas_extra', width: 20 },
      { header: 'Total Horas Extra', key: 'total_horas_extra', width: 20 },
      { header: 'Total Ingresos', key: 'total_ingresos', width: 20 },
      { header: 'ISR', key: 'isr', width: 20 },
      { header: 'IGSS', key: 'igss', width: 20 },
      { header: 'Prestamos', key: 'prestamos', width: 20 },
      { header: 'Salario anticipado', key: 'anticipo_salario', width: 20 },
      { header: 'Total Deducciones', key: 'total_deducciones', width: 20 },
      { header: 'Liquido Total a Recibir', key: 'liquido_total', width: 30 },
      { header: 'Creado el', key: 'createdAt', width: 30 },
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

    nominas.forEach((item, index) => {
      worksheet.addRow({
        id: index + 1,
        name: item.employee.fullName,
        department: item.employee.department.name,
        area: item.employee.area.name,
        contract_type: item.employee.contract_type,
        work_day: item.employee.work_day,
        periodo_liquidacion_inicio: dayjs.utc(item.periodo.periodo_liquidacion_inicio).format('DD/MM/YYYY'),
        periodo_liquidacion_final: dayjs.utc(item.periodo.periodo_liquidacion_final).format('DD/MM/YYYY'),
        fecha_pago: dayjs.utc(item.periodo.fecha_pago).format('DD/MM/YYYY'),
        salary: cdT.formatCurrency(parseFloat(item.employee.area.salary)),
        total_bonificaciones: cdT.formatCurrency(parseFloat(item.total_bonificaciones)),
        cantidad_horas_extra: item.cantidad_horas_extra,
        total_horas_extra: cdT.formatCurrency(parseFloat(item.sueldo_horas_extra)),
        total_ingresos: cdT.formatCurrency(parseFloat(item.total_percepciones)),
        isr: cdT.formatCurrency(parseFloat(item.isr)),
        igss: cdT.formatCurrency(parseFloat(item.total_igss)),
        prestamos: cdT.formatCurrency(parseFloat(item.prestamos)),
        anticipo_salario: cdT.formatCurrency(parseFloat(item.anticipo_salario)),
        total_deducciones: cdT.formatCurrency(parseFloat(item.total_deducciones)),
        liquido_total: cdT.formatCurrency(parseFloat(item.liquido_percibir)),
        createdAt: new Date(item.createdAt).toLocaleString(),
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
    saveAs(blob, 'Reporte_de_Nominas.xlsx');
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
        <h3>Nominas</h3>
        <BreadComp texto="Nominas" pre={'Reportes'} valid={true} />
        <Toolbar className="my-4" right={rightToolbarTemplate}></Toolbar>

        {/* //? -------------------- DATATABLE ------------------- */}
        <DataTableCrud
          // setGetFecha={setGetFecha}

          dtSize="small"
          buscador={true}
          btActive={false}
          btnSize="small"
          btnColor="primary"
          btnText={""}
          openNew={null}
          //? -------------------- HEADER -------------------
          message="nominas"
          headerMessage=""
          refe={dt}
          value={nominas}
          filters={filters}
          loading={loading}
          setFilters={setFilters}
          setGlobalFilterValue={setGlobalFilterValue}
          globalFilterValue={globalFilterValue}
          globalFilterFields={['employee.fullName', 'employee.identification', 'employee.department.name', 'employee.area.name', 'employee.area.salary', 'periodo.fecha_pago', 'periodo.periodo_liquidacion_inicio', 'periodo.periodo_liquidacion_final']}
          //? -------------------- COLUMNS -------------------
          columns={[
            { field: 'periodo.periodo_liquidacion_inicio', header: 'Periodo L. Inicio', body: fechaLiquiIniBodyTemplate, dataType: 'date', filter: true },
            { field: 'periodo.periodo_liquidacion_final', header: 'Periodo L. Final', body: fechaLiquiFinBodyTemplate, dataType: 'date', filter: true },
            { field: 'periodo.fecha_pago', header: 'Fecha de Pago', body: fechaPagoBodyTemplate, dataType: 'date', filter: true },
            { field: 'employee.fullName', header: 'Empleado', body: nameBodyTemplate, dataType: 'text', filter: true },
            { field: 'employee.identification', header: 'No. Identificación', body: identificationBodyTemplate, dataType: 'text', filter: true },
            { field: 'employee.department.name', header: 'Departamento', body: departmentBodyTemplate, dataType: 'text', filter: true },
            { field: 'employee.area.name', header: 'Area (Cargo)', body: areaBodyTemplate, dataType: 'text', filter: true },
            { field: 'employee.area.salary', header: 'Salario Base', body: salaryBodyTemplate, dataType: 'numeric', filter: true },
            { field: 'createdAt', header: 'Creado el', body: createdAtBodyTemplate, dataType: 'date', filter: false },
            { field: 'updatedAt', header: 'Ultima Actualización', body: updatedAtBodyTemplate, filter: false, dataType: 'date' },
          ]}
          size='5rem'
          actionBodyTemplate={actionBodyTemplate}
        />
      </div>

      {/* //? -------------------- MODAL DIALOG (ONLY READ) ------------------- */}
      <m.LargeModal visible={seeNominaDialog} header="Todos los datos de la nomina" footer={seeDialogFooter} onHide={hideSeeDialog} dismissableMask={false} blockScroll={true} closeOnEscape={true} >
        <div className="confirmation-content">
          {nomina && (<>
            {nomina.id ? (<>
              <div className="card">
                <TabView>
                  <TabPanel className='w-full' header="Header I" headerTemplate={(options: TabPanelHeaderTemplateOptions) => m.TabHeaderTemplate(options, 'DATOS DEL EMPLEADO')}>
                    <div className="field mt-5 mb-3">
                      <div className="formgrid grid">
                        <div className="col-12">
                          <div className="flex flex-wrap gap-3 justify-content-between">
                            <label className='text-md capitalize'> <b>EMPLEADO:</b> {nomina.employee.fullName}</label>
                            <label className='text-md capitalize'> <b>NO {nomina.employee.identification_type}:</b> {nomina.employee.identification}</label>
                            <label className='text-md capitalize'> <b>NO NIT:</b> {nomina.employee.nit}</label>
                            <label className='text-md capitalize'> <b>NO IGSS:</b> {nomina.employee.igss}</label>

                            <Divider align="center" />

                            <label className='text-md capitalize'> <b>DEPARTAMENTO:</b> {nomina.employee.department.name}</label>

                            <label className='text-md capitalize'> <b>PUESTO:</b> {nomina.employee.area.name}</label>

                            <label className='text-md capitalize'> <b>FECHA CONTRATACION:</b> <cdT.ColumnOnlyDateBodyText value={nomina.employee.hire_date} className={''} /> </label>

                            <label className='text-md capitalize'> <b>TIPO CONTRATO:</b> {nomina.employee.contract_type}</label>

                            <label className='text-md capitalize'> <b>JORNADA LABORAL:</b> {nomina.employee.work_day}</label>


                          </div>
                          <Divider align="center" className='my-5'>
                            <span className="p-tag">Otros Datos</span>
                          </Divider>
                          <div className="flex flex-wrap gap-3 justify-content-center">
                            <label className='text-md capitalize'><b>Estado del Empleado: </b>
                              {nomina.employee.status ? (<span className="p-tag text-sm p-tag-success">Activo</span>) : (<span className="p-tag text-sm p-tag-danger">Inactivo</span>)}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel className='w-full' header="Header II" headerTemplate={(options: TabPanelHeaderTemplateOptions) => m.TabHeaderTemplate(options, 'DETALLES DE LA NOMINA')}>
                    <div className="field mt-5 mb-3">
                      <div className="formgrid grid">
                        <div className="col-12">

                          <div className="gap-3 justify-content-between -mt-3">
                            <div className="flex flex-column gap-2 mb-5">
                              <div className="flex justify-content-between">
                                <label className='text-md font-semibold'>FECHA DE PAGO</label>
                                <label className='text-md font-semibold'>PERIODO LIQUIDACION</label>
                              </div>
                              <div className="flex justify-content-between">
                                <label className='text-md font-bold text-orange-700'>
                                  <cdT.ColumnOnlyDateBodyText value={nomina.periodo.fecha_pago} className={''} />
                                </label>
                                <label className='text-md font-bold text-orange-700'>
                                  <cdT.ColumnOnlyDateBodyText value={nomina.periodo.periodo_liquidacion_inicio} className={''} />
                                  &nbsp;&nbsp;al&nbsp;&nbsp;
                                  <cdT.ColumnOnlyDateBodyText value={nomina.periodo.periodo_liquidacion_final} className={''} /></label>
                              </div>
                            </div>
                          </div>

                          <Divider align="center">
                            <span className="p-tag">INGRESOS</span>
                          </Divider>
                          <div className="gap-3 justify-content-between">
                            <div className="flex flex-column gap-3">

                              <div className="flex justify-content-between">
                                <label className='text-md capitalize'> SALARIO BASE</label>
                                <label className='text-md capitalize'><cdT.SalaryDisplay salary={nomina.employee.area.salary} className="" /></label>
                              </div>

                              <div className="flex justify-content-between">
                                <label className='text-md capitalize'>BONIFICACIONES</label>
                                <div className="flex flex-column gap-2">
                                  <label className='text-md capitalize'>{
                                    nomina.bonificaciones.map((bonificacion, index) => (
                                      <div className="flex justify-content-between mb-1">
                                        <div className="mr-4">
                                          <span key={index}>{bonificacion.descripcion}</span>
                                        </div>
                                        <div className="">
                                          <span key={index}><cdT.SalaryDisplay salary={bonificacion.cantidad} className="" /></span>
                                        </div>
                                      </div>
                                    ))
                                  }</label>
                                  <Divider align="center" className='-mt-1 -mb-1' />
                                  <div className="flex justify-content-end">
                                    <label className='text-md capitalize font-bold'><cdT.SalaryDisplay salary={nomina.total_bonificaciones} className="font-bold" /></label>
                                  </div>
                                </div>

                              </div>

                              <div className="flex justify-content-between">
                                <label className='text-md capitalize'> NO. HORAS EXTRA: <b> {nomina.cantidad_horas_extra}</b></label>
                                <label className='text-md capitalize'><cdT.SalaryDisplay salary={nomina.sueldo_horas_extra} className="" /></label>
                              </div>

                              <Divider align="center" className='-mt-1' />
                              <Divider align="center" className='-mt-5 -mb-1' />

                              <div className="flex justify-content-between">
                                <label className='text-md capitalize'><b>TOTAL INGRESOS</b></label>
                                <label className='text-md capitalize'><b><cdT.SalaryDisplay salary={nomina.total_percepciones} className="font-bold" /></b></label>
                              </div>
                            </div>
                          </div>
                          <Divider align="center" className='my-5'>
                            <span className="p-tag">DEDUCCIONES</span>
                          </Divider>
                          <div className="gap-3 justify-content-between">
                            <div className="flex flex-column gap-3">

                              <div className="flex justify-content-between">
                                <label className='text-md capitalize'>ISR</label>
                                <label className='text-md capitalize'><cdT.SalaryDisplay salary={nomina.isr} className="" /></label>
                              </div>

                              <div className="flex justify-content-between">
                                <label className='text-md capitalize'>IGSS</label>
                                <label className='text-md capitalize'><cdT.SalaryDisplay salary={nomina.total_igss} className="" /></label>
                              </div>

                              <div className="flex justify-content-between">
                                <label className='text-md capitalize'>PRESTAMOS</label>
                                <label className='text-md capitalize'><cdT.SalaryDisplay salary={nomina.prestamos} className="" /></label>
                              </div>

                              <div className="flex justify-content-between">
                                <label className='text-md capitalize'>SALARIO ANTICIPADO</label>
                                <label className='text-md capitalize'><cdT.SalaryDisplay salary={nomina.anticipo_salario} className="" /></label>
                              </div>

                              <Divider align="center" className='-mt-1' />
                              <Divider align="center" className='-mt-5 -mb-1' />

                              <div className="flex justify-content-between">
                                <label className='text-md capitalize'><b>TOTAL DEDUCCIONES</b></label>
                                <label className='text-md capitalize'><b><cdT.SalaryDisplay salary={nomina.total_deducciones} className="font-bold" /></b></label>
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 gap-3 justify-content-between">
                            <div className="flex flex-column gap-3">
                              <Divider align="center" className='-mt-1' />
                              <Divider align="center" className='-mt-5' />
                              <Divider align="center" className='-mt-5 -mb-1' />

                              <div className="flex justify-content-between">
                                <label className='text-lg capitalize text-primary'><b>LIQUIDO TOTAL A RECIBIR</b></label>
                                <label className='text-lg capitalize text-primary'><b><cdT.SalaryDisplay salary={nomina.liquido_percibir} className="font-bold" /></b></label>
                              </div>
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

                            <label className='text-md capitalize'><b>Fecha de Creación: </b>
                              <cdT.ColumnDateBodyText value={nomina.createdAt} className={"text-primary"} />
                            </label>

                            <label className='text-md capitalize'><b>última Actualización: </b>
                              <cdT.ColumnDateBodyText value={nomina.updatedAt} className={"text-primary"} />
                            </label>

                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                </TabView>
              </div>
            </>) : (<></>)}
          </>)}
        </div>
      </m.LargeModal>
    </div>
  )
}