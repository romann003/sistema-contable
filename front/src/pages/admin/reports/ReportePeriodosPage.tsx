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

import { useNominaDatos } from '../../../api/context/nominaDatosContext';
import { useCompany } from '../../../api/context/CompanyContext';

import * as cdT from '../../../layout/components/ColumnBody.js';
import * as m from '../../../layout/components/Modals.js';
import { BreadComp } from '../../../layout/components/BreadComp.js';
import DataTableCrud from '../../../layout/components/DataTableCrud.js';

interface Periodo {
  id: number | null;
  periodo_liquidacion_inicio: string;
  periodo_liquidacion_final: string;
  fecha_pago: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  periodo_liquidacion_inicio: { value: null, matchMode: FilterMatchMode.CONTAINS },
  periodo_liquidacion_final: { value: null, matchMode: FilterMatchMode.CONTAINS },
  fecha_pago: { value: null, matchMode: FilterMatchMode.CONTAINS },
}

export default function ReportePeriodosPage() {
  //? -------------------- CONTEXT API -------------------
  const { periodos, getPeriodos } = useNominaDatos();
  const { companies, getCompanyReportes } = useCompany();
  const [periodo, setPeriodo] = useState<Periodo | null>(null);
  //? -------------------- STATES -------------------
  const toast = useRef<Toast>(null);
  //? -------------------- DIALOG STATES -------------------
  const [infoDialog, setInfoDialog] = useState<boolean>(false);
  //? -------------------- DATATABLE STATES -------------------
  const dt = useRef<DataTable<Periodo[]>>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  //? -------------------- DATATABLE COLUMN TEMPLATES -------------------
  const fechaPagoBodyTemplate = (rowData: Periodo) => {
    return <cdT.ColumnOnlyDateBodyWithClass value={rowData.fecha_pago} className={'text-orange-500'} />
  };

  const plInicioBodyTemplate = (rowData: Periodo) => {
    return <cdT.ColumnOnlyDateBody value={rowData.periodo_liquidacion_inicio} />
  };

  const plFinalBodyTemplate = (rowData: Periodo) => {
    return <cdT.ColumnOnlyDateBody value={rowData.periodo_liquidacion_final} />
  };

  const createdAtBodyTemplate = (rowData: Periodo) => {
    return <cdT.ColumnDateBody value={rowData.createdAt} />
  };

  const updatedAtBodyTemplate = (rowData: Periodo) => {
    return <cdT.ColumnDateBody value={rowData.updatedAt} />
  };

  const actionBodyTemplate = (rowData: Periodo) => {
    return (
      <React.Fragment>
        <div className="flex align-align-content-center justify-content-evenly">
          <Button icon="pi pi-eye" rounded outlined severity='info' onClick={() => watchData(rowData)} />

        </div>
      </React.Fragment>
    );
  };

  //? -------------------- DATA LOADING -------------------
  useEffect(() => {
    getPeriodos();
    getCompanyReportes(1);
    setLoading(false);
  }, [periodo]);

  //? -------------------- DETAILS DIALOGS -------------------
  const watchData = (periodo: Periodo) => {
    setPeriodo({ ...periodo });
    setInfoDialog(true);
  };

  const hideInfoDialog = () => {
    setInfoDialog(false);
  };

  const infoDialogFooter = (
    <React.Fragment>
      <Button label="Salir de la vista" icon="pi pi-times" outlined onClick={hideInfoDialog} />
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
    doc.text('Reporte de Periodos de Liquidacion', 105, marginTop + 10, { align: 'center' });

    const tableColumn = ["ID", "Fecha de Inicio", "Fecha Final", "Fecha de Pago", "Creado el", "Última Actualización"];
    const tableRows = periodos.map((periodo, index) => [
      // periodo.id,
      index + 1,
      dayjs.utc(periodo.periodo_liquidacion_inicio).format('DD/MM/YYYY'),
      dayjs.utc(periodo.periodo_liquidacion_final).format('DD/MM/YYYY'),
      dayjs.utc(periodo.fecha_pago).format('DD/MM/YYYY'),
      new Date(periodo.createdAt).toLocaleDateString() + ' ' + new Date(periodo.createdAt).toLocaleTimeString(),
      new Date(periodo.updatedAt).toLocaleDateString() + ' ' + new Date(periodo.updatedAt).toLocaleTimeString()
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: marginTop + 15,
      theme: 'grid',
    });

    doc.save('reporte_periodos_liquidacion.pdf');
  }

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Periodos de Liquidacion');

    worksheet.columns = [
      { header: 'No.', key: 'id', width: 10 },
      { header: 'Fecha de Inicio', key: 'periodo_liquidacion_inicio', width: 30 },
      { header: 'Fecha Final', key: 'periodo_liquidacion_final', width: 30 },
      { header: 'Fecha de Pago', key: 'fecha_pago', width: 20 },
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

    periodos.forEach((item, index) => {
      worksheet.addRow({
        // id: item.id,
        id: index + 1,
        periodo_liquidacion_inicio: dayjs.utc(item.periodo_liquidacion_inicio).format('DD/MM/YYYY'),
        periodo_liquidacion_final: dayjs.utc(item.periodo_liquidacion_final).format('DD/MM/YYYY'),
        fecha_pago: dayjs.utc(item.fecha_pago).format('DD/MM/YYYY'),
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
    saveAs(blob, 'Reporte_de_Periodos.xlsx');
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
        <h3>Periodos de Liquidacion (Meses)</h3>
        <BreadComp pre="Reportes" texto="Periodos de Liquidacion" valid={true} />
        <Toolbar className="my-4" right={rightToolbarTemplate}></Toolbar>

        {/* //? -------------------- DATATABLE ------------------- */}
        <DataTableCrud
          dtSize="small"
          buscador={false}
          btActive={false}
          btnSize="small"
          btnColor="primary"
          btnText={""}
          openNew={null}
          //? -------------------- HEADER -------------------
          message="periodos de liquidacion"
          headerMessage="Reporte de Periodos de Liquidacion"
          refe={dt}
          value={periodos}
          filters={filters}
          loading={loading}
          setFilters={setFilters}
          setGlobalFilterValue={setGlobalFilterValue}
          globalFilterValue={globalFilterValue}
          globalFilterFields={['fecha_pago', 'periodo_liquidacion_inicio', 'periodo_liquidacion_final']}
          //? -------------------- COLUMNS -------------------
          columns={[
            { field: 'periodo_liquidacion_inicio', header: 'Fecha Li. Inicio', body: plInicioBodyTemplate, dataType: 'date', filter: true },
            { field: 'periodo_liquidacion_final', header: 'Fecha Li. Final', body: plFinalBodyTemplate, dataType: 'date', filter: true },
            { field: 'fecha_pago', header: 'Fecha Pago', body: fechaPagoBodyTemplate, dataType: 'date', filter: true },
            { field: 'createdAt', header: 'Creado el', body: createdAtBodyTemplate, dataType: 'date', filter: false },
            { field: 'updatedAt', header: 'Ultima Actualizacion', body: updatedAtBodyTemplate, dataType: 'date', filter: false }
          ]}
          size='5rem'
          actionBodyTemplate={actionBodyTemplate}
        />
      </div>

      {/* //? -------------------- MODAL DIALOG (ONLY READ) ------------------- */}
      <m.LargeModal visible={infoDialog} header="Detalles del Periodo de Liquidacion" footer={infoDialogFooter} onHide={hideInfoDialog} blockScroll={true} closeOnEscape={true} dismissableMask={true}>
        <div className="confirmation-content">
          {periodo && (<>
            {periodo.id && (
              <div className="card">
                <div className="field mt-5 mb-3">
                  <div className="formgrid grid">
                    <div className="col-12">
                      <div className="flex flex-wrap gap-3 justify-content-between">
                        <label className='text-md capitalize'> <b>FECHA DE INICIO:</b> <cdT.ColumnOnlyDateBodyText value={periodo.periodo_liquidacion_inicio} className={'text-primary'} /></label>
                        <label className='text-md capitalize'> <b>FECHA FINAL:</b> <cdT.ColumnOnlyDateBodyText value={periodo.periodo_liquidacion_final} className={'text-primary'} /></label>
                        <label className='text-md capitalize'> <b>FECHA DE PAGO:</b> <cdT.ColumnOnlyDateBodyText value={periodo.fecha_pago} className={'text-primary'} /></label>
                      </div>

                      <Divider align="center" className='my-5'>
                        <span className="p-tag">Otros Datos</span>
                      </Divider>
                      <div className="flex flex-wrap gap-3 justify-content-between">

                        <label className='text-md capitalize'><b>Fecha de Creación: </b>
                          <cdT.ColumnDateBodyText value={periodo.createdAt} className={"text-primary"} />
                        </label>

                        <label className='text-md capitalize'><b>última Actualización: </b>
                          <cdT.ColumnDateBodyText value={periodo.updatedAt} className={"text-primary"} />
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
    </div>
  )
}