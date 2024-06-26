//? -------------------- COMPONENTES Y LIBRERIAS --------------------
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode } from 'primereact/api';
import { DataTableFilterMeta } from 'primereact/datatable';
import { Formik, Form } from 'formik';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc);

//? -------------------- COMPONENTES PERSONALIZADOS -------------------
import * as fI from '../../layout/components/FormComponent.js';
import * as cdT from '../../layout/components/ColumnBody.js';
import * as m from '../../layout/components/Modals.js';
import { BreadComp } from '../../layout/components/BreadComp.js';
import { Formulario } from '../../layout/elements/Formularios.js';
import DataTableCrud from '../../layout/components/DataTableCrud.js';

//? -------------------- API -------------------
import { useNominaDatos } from '../../api/context/nominaDatosContext';
import { Divider } from 'primereact/divider';

//? -------------------- DEFINICION DE CAMPOS -------------------
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

export default function PeriodoLiquidacionPage() {

    const emptyPeriodo: Periodo = {
        id: null,
        periodo_liquidacion_inicio: '',
        periodo_liquidacion_final: '',
        fecha_pago: '',
        status: true,
        createdAt: '',
        updatedAt: ''
    };

    //? -------------------- CONTEXT API -------------------
    const { periodos, getPeriodos, createPeriodo, deletePeriodo, updatePeriodo } = useNominaDatos();
    const [periodo, setPeriodo] = useState<Periodo>(emptyPeriodo);
    //? -------------------- STATES -------------------
    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const toast = useRef<Toast>(null);
    //? -------------------- DIALOG STATES -------------------
    const [createDialog, setCreateDialog] = useState<boolean>(false);
    const [infoDialog, setInfoDialog] = useState<boolean>(false);
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
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
                    <Button icon="pi pi-eye" rounded outlined severity='help' onClick={() => watchData(rowData)} />
                    <Button icon="pi pi-pencil" rounded outlined onClick={() => editData(rowData)} />
                    <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteData(rowData)} />

                </div>
            </React.Fragment>
        );
    };

    //? -------------------- DATA LOADING -------------------
    useEffect(() => {
        getPeriodos();
        setLoading(false);
    }, [periodo]);

    //? -------------------- MODAL DIALOGS -------------------
    const openNew = () => {
        setPeriodo(emptyPeriodo);
        setCreateDialog(true);
    };

    const hideDialog = () => {
        setSelectedStatus(null);
        setCreateDialog(false);
    };

    const hideInfoDialog = () => {
        setSelectedStatus(null);
        setInfoDialog(false);
    };

    const editData = (periodo: Periodo) => {
        setPeriodo({ ...periodo });
        setCreateDialog(true);
    };

    const watchData = (periodo: Periodo) => {
        setPeriodo({ ...periodo });
        setInfoDialog(true);
    };

    const hideDeleteDialog = () => {
        setDeleteDialog(false);
    };

    const confirmDeleteData = (periodo: Periodo) => {
        setPeriodo(periodo);
        setDeleteDialog(true);
    };

    const deleteModal = () => {
        deletePeriodo(periodo.id);
        setDeleteDialog(false);
        setPeriodo(emptyPeriodo);
    };

    //? -------------------- MODAL BUTTONS -------------------
    const deleteDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
            <Button label="Si, eliminar" icon="pi pi-check" severity="danger" onClick={deleteModal} />
        </React.Fragment>
    );

    const infoDialogFooter = (
        <React.Fragment>
            <Button label="Salir de la vista" icon="pi pi-times" outlined onClick={hideInfoDialog} />
        </React.Fragment>
    );







    // const [selectedDate, setSelectedDate] = useState('');
    // const allowedDates = ['2024-06-03', '2024-06-04', '2024-06-05'];

    // const handleDateChange = (event) => {
    //     const date = event.target.value;
    //     const dayOfWeek = new Date(date).getUTCDay();

    //     // Check if the date is a weekend (Saturday: 6, Sunday: 0)
    //     if (dayOfWeek === 6 || dayOfWeek === 0) {
    //         alert('La fecha seleccionada es un fin de semana. Por favor, elige otra fecha.');
    //         setSelectedDate('');
    //     } else if (!allowedDates.includes(date)) {
    //         // Check if the date is in the allowed dates
    //         alert('La fecha seleccionada no está permitida. Por favor, elige otra fecha.');
    //         setSelectedDate('');
    //     } else {
    //         setSelectedDate(date);
    //     }
    // };










    //? -------------------- RENDER -------------------
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <h3>Periodo de Liquidación</h3>
                <BreadComp pre={""} texto="Periodos de Liquidación" valid={false} />

                {/* //? -------------------- DATATABLE ------------------- */}
                <DataTableCrud
                    dtSize="small"
                    buscador={true}
                    btActive={true}
                    btnSize="small"
                    btnColor="primary"
                    btnText="Agregar Periodo de Liquidación"
                    openNew={openNew}
                    //? -------------------- HEADER -------------------
                    message="periodos de liquidación"
                    headerMessage=""
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
                        { field: 'updatedAt', header: 'Ultima Actualizacion', body: updatedAtBodyTemplate, dataType: 'date', filter: false }]}
                    size='15rem'
                    actionBodyTemplate={actionBodyTemplate}
                />
            </div>

            {/* //? -------------------- MODAL DIALOG (CREATE AND UPDATE) ------------------- */}
            <Dialog visible={createDialog} style={{ width: '60rem', minWidth: '30rem', maxWidth: '80vw', height: '40rem', minHeight: '40rem', maxHeight: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Periodo de liquidación" modal className="p-fluid" onHide={hideDialog} dismissableMask={false} blockScroll={false} closeOnEscape={true}
            >
                <Formik
                    initialValues={{ periodo_liquidacion_inicio: '' || periodo.periodo_liquidacion_inicio, periodo_liquidacion_final: '' || periodo.periodo_liquidacion_final, fecha_pago: '' || periodo.fecha_pago, status: '' || periodo.status }}
                    validate={values => {
                        const errors = {};

                        if (!values.periodo_liquidacion_inicio) {
                            errors.periodo_liquidacion_inicio = 'La fecha de inicio es requerida';
                        } else if (values.periodo_liquidacion_inicio === values.periodo_liquidacion_final) {
                            errors.periodo_liquidacion_inicio = 'Las fechas no pueden ser iguales';
                        } else if (values.periodo_liquidacion_inicio > values.periodo_liquidacion_final) {
                            errors.periodo_liquidacion_inicio = 'La fecha de inicio no puede ser mayor a la fecha final';
                        }
                        // else if (values.periodo_liquidacion_inicio > values.fecha_pago) {
                        //     errors.periodo_liquidacion_inicio = 'La fecha de inicio no puede ser mayor a la fecha de pago';
                        // }
                        // else if (values.periodo_liquidacion_inicio > dayjs().format()) {
                        //     errors.periodo_liquidacion_inicio = 'La fecha de inicio no puede ser mayor a la fecha actual';
                        // }


                        if (!values.periodo_liquidacion_final) {
                            errors.periodo_liquidacion_final = 'La fecha final es requerida';
                        } else if (values.periodo_liquidacion_inicio === values.periodo_liquidacion_final) {
                            errors.periodo_liquidacion_inicio = 'Las fechas no pueden ser iguales';
                        } else if (values.periodo_liquidacion_final < values.periodo_liquidacion_inicio) {
                            errors.periodo_liquidacion_final = 'La fecha final no puede ser menor a la fecha de inicio';
                        } else if (values.periodo_liquidacion_final > values.fecha_pago) {
                            errors.periodo_liquidacion_final = 'La fecha final no puede ser mayor a la fecha de pago';
                        }
                        // else if (values.periodo_liquidacion_final < dayjs().format()) {
                        //     errors.periodo_liquidacion_final = 'La fecha final no puede ser menor a la fecha actual';
                        // }



                        if (!values.fecha_pago) {
                            errors.fecha_pago = 'La fecha de pago es requerida';
                        } else if (values.fecha_pago === values.periodo_liquidacion_inicio) {
                            errors.fecha_pago = 'La fecha de pago no puede ser igual a la fecha de inicio';
                        } else if (values.fecha_pago === values.periodo_liquidacion_final) {
                            errors.fecha_pago = 'La fecha de pago no puede ser igual a la fecha final';
                        } else if (values.fecha_pago < values.periodo_liquidacion_inicio) {
                            errors.fecha_pago = 'La fecha de pago no puede ser menor a la fecha de inicio';
                        } else if (values.fecha_pago < values.periodo_liquidacion_final) {
                            errors.fecha_pago = 'La fecha de pago no puede ser menor a la fecha final';
                        }
                        // else if (values.fecha_pago < dayjs().format()) {
                        //     errors.fecha_pago = 'La fecha de pago no puede ser menor a la fecha actual';
                        // } 
                        // else if (values.fecha_pago < values.periodo_liquidacion_final) {
                        //     errors.fecha_pago = 'La fecha de pago no puede ser menor a la fecha final';
                        // } 


                        // if (!periodo.id) {

                        // }
                        return errors;
                    }}
                    onSubmit={(values, { resetForm }) => {
                        if (values) {
                            if (periodo.id) {

                                if (selectedStatus?.code === true) { values.status = true }
                                else if (selectedStatus?.code === false) { values.status = false } else { values.status = periodo.status }

                                if (values.periodo_liquidacion_inicio !== "") { values.periodo_liquidacion_inicio = dayjs.utc(values.periodo_liquidacion_inicio).format() } else { values.periodo_liquidacion_inicio = periodo.periodo_liquidacion_inicio }

                                if (values.periodo_liquidacion_final !== "") { values.periodo_liquidacion_final = dayjs.utc(values.periodo_liquidacion_final).format() } else { values.periodo_liquidacion_final = periodo.periodo_liquidacion_final }

                                if (values.fecha_pago !== "") { values.fecha_pago = dayjs.utc(values.fecha_pago).format() } else { values.fecha_pago = periodo.fecha_pago }

                                updatePeriodo(periodo.id, values);
                                setCreateDialog(false);
                                setPeriodo(emptyPeriodo);
                                resetForm();
                            } else {
                                // values.periodo_liquidacion_inicio = dayjs.utc(values.periodo_liquidacion_inicio).format()
                                // values.periodo_liquidacion_final = dayjs.utc(values.periodo_liquidacion_final).format()
                                // values.fecha_pago = dayjs.utc(values.fecha_pago).format()
                                // values.status = true;
                                createPeriodo(values);
                                setCreateDialog(false);
                                setPeriodo(emptyPeriodo);
                                resetForm();
                            }
                        } else {
                            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Periodo de Liquidación no registrado', life: 5000 });
                        }
                    }}
                >
                    {({ values, errors, touched, dirty, isValid, handleChange, handleBlur }) => (
                        <Form style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ flex: 1, overflow: 'auto' }}>
                                <Formulario>
                                    {/* <input type="date" name="date" id="date" value={selectedDate} onChange={handleDateChange} /> */}
                                    {/* <div className="col-6">
                                        <fI.DatePicker
                                            selectedDate={selectedDate}
                                            setSelectedDate={setSelectedDate}
                                        />

                                    </div> */}

                                    <fI.InputT
                                        col={12}
                                        id="periodo_liquidacion_inicio"
                                        name="periodo_liquidacion_inicio"
                                        type="date"
                                        placeholder="Ingrese la fecha de inicio"
                                        label="Fecha Inicio"
                                        span="*"
                                        value={values.periodo_liquidacion_inicio}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        invalid={!!errors.periodo_liquidacion_inicio && touched.periodo_liquidacion_inicio}
                                        errorText={errors.periodo_liquidacion_inicio}
                                        disabled={false}
                                    />
                                    <fI.InputT
                                        col={12}
                                        id="periodo_liquidacion_final"
                                        name="periodo_liquidacion_final"
                                        type="date"
                                        placeholder="Ingrese la fecha final"
                                        label="Fecha Final"
                                        span="*"
                                        value={values.periodo_liquidacion_final}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        invalid={!!errors.periodo_liquidacion_final && touched.periodo_liquidacion_final}
                                        errorText={errors.periodo_liquidacion_final}
                                        disabled={false}
                                    />

                                    <fI.InputT
                                        col={12}
                                        id="fecha_pago"
                                        name="fecha_pago"
                                        type="date"
                                        placeholder="Ingrese la fecha de pago"
                                        label="Fecha Pago"
                                        span="*"
                                        value={values.fecha_pago}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        invalid={!!errors.fecha_pago && touched.fecha_pago}
                                        errorText={errors.fecha_pago}
                                        disabled={false}
                                    />
                                </Formulario>
                            </div>

                            <div className="flex mb-0 pt-3">
                                <Button label="Cancelar" type='button' icon="pi pi-times" outlined onClick={hideDialog} className='mx-1' />
                                <Button label="Guardar Periodo" icon="pi pi-check" type='submit' className='mx-1' disabled={periodo.id ? false : !(isValid && dirty)} />
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>


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


            {/* //? -------------------- MODAL DIALOG (DELETE) ------------------- */}
            <m.DeleteModal
                visible={deleteDialog}
                header="Confirmar"
                data={periodo}
                message1="¿Estas seguro que deseas eliminar el periodo de liquidación del: "
                message1Bold={
                    <>
                        <cdT.ColumnOnlyDateBodyText value={periodo.periodo_liquidacion_inicio} className={'text-primary'} />
                        <span> AL </span>
                        <cdT.ColumnOnlyDateBodyText value={periodo.periodo_liquidacion_final} className={'text-primary'} />
                    </>
                }
                message2={`con fecha de pago:`}
                message2Bold={<cdT.ColumnOnlyDateBodyText value={periodo.fecha_pago} className={''} />}
                footer={deleteDialogFooter}
                onHide={hideDeleteDialog}
            ></m.DeleteModal>
        </div>
    );
}