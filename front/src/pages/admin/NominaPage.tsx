//? -------------------- COMPONENTES Y LIBRERIAS -------------------
import React, { useEffect, useRef, useState } from 'react';
import { Form, Formik } from 'formik';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { TabPanel, TabPanelHeaderTemplateOptions, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import * as fI from '../../layout/components/FormComponent.js';
import * as cdT from '../../layout/components/ColumnBody.js';
import * as m from '../../layout/components/Modals.js';
import { Formulario } from '../../layout/elements/Formularios.js';
import { BreadComp } from '../../layout/components/BreadComp.js';
import DataTableCrud from '../../layout/components/DataTableCrud.js';

//? -------------------- API -------------------
import { useNominas } from '../../api/context/NominaContext';
import { useEmployees } from '../../api/context/EmployeeContext.js';
import { useNominaDatos } from '../../api/context/nominaDatosContext.js';

//? -------------------- DEFINICION DE CAMPOS -------------------
interface Nomina {
    id: number | null;
    cantidad_horas_extra: number | null;
    sueldo_horas_extra: number | null;
    vacaciones_pagadas: number | null;
    total_percepciones: number | null;
    isr: number | null;
    igss_patronal: number | null;
    igss_laboral: number | null;
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
    bonificacions: Bonificacion[];
    total_bonificaciones: number | null;
}

interface Bonificacion {
    id: number | null;
    descripcion: string;
    cantidad: number | null;
    createdAt: string;
    updatedAt: string;
    nomina: string;
    nominaId: number | null;
}

interface TipoBonificacion {
    name: string;
    code: string;
}

const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'employee.fullName': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'employee.identification': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'employee.department.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'employee.area.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'employee.area.salary': { value: null, matchMode: FilterMatchMode.EQUALS },
    'periodo.fecha_pago': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'periodo.periodo_liquidacion_inicio': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'periodo.periodo_liquidacion_final': { value: null, matchMode: FilterMatchMode.CONTAINS },
}

export default function NominaPage() {

    const emptyNomina: Nomina = {
        id: null,
        cantidad_horas_extra: null,
        sueldo_horas_extra: null,
        vacaciones_pagadas: null,
        total_percepciones: null,
        isr: null,
        igss_patronal: null,
        igss_laboral: null,
        prestamos: null,
        anticipo_salario: null,
        total_deducciones: null,
        liquido_percibir: null,
        createdAt: '',
        updatedAt: '',
        employee: '',
        employeeId: null,
        company: '',
        companyId: null,
        periodo: '',
        periodoId: null,
        bonificacions: [],
        total_bonificaciones: null

    };

    const emptyBonificacion: Bonificacion = {
        id: null,
        descripcion: '',
        cantidad: null,
        createdAt: '',
        updatedAt: '',
        nomina: '',
        nominaId: null
    };

    const typeTipoBonificacion: TipoBonificacion[] = [
        { name: 'Bonificación por Decreto', code: 'bonificacion por decreto' },
        { name: 'Bonificación por Productividad', code: 'bonificacion por productividad' },
        // { name: 'Aguinaldo', code: 'AG' },
        // { name: 'Vacaciones Pagadas', code: 'VP' },
        // { name: 'Bonificación', code: 'BO' },
        // { name: 'ISR', code: 'IS' },
        // { name: 'IGSS Patronal', code: 'IP' },
        // { name: 'IGSS Laboral', code: 'IL' },
        // { name: 'Prestamos', code: 'PR' },
    ];

    //? -------------------- CONTEXT API -------------------
    const { periodos, getPeriodos,
        bonificaciones, setBonificaciones, getBonificaciones, createBonificacion, deleteBonificacion, updateBonificacion
    } = useNominaDatos();
    const { employees, getEmployees } = useEmployees();
    const { nominas, getNominas, createNomina, deleteNomina, updateNomina, nominaId, setNominaId } = useNominas();

    //? -------------------- STATES -------------------
    // const [selectedDepartment, setSelectedDepartment] = useState(null);
    // const [selectedArea, setSelectedArea] = useState(null);
    const [selectedPeriodo, setSelectedPeriodo] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedTipoBonificacion, setSelectedTipoBonificacion] = useState<TipoBonificacion | null>(null);
    const [nomina, setNomina] = useState<Nomina>(emptyNomina);
    const [bonificacion, setBonificacion] = useState<Bonificacion>(emptyBonificacion);
    const toast = useRef<Toast>(null);
    //? -------------------- DIALOG STATES -------------------
    const [nominaDialog, setNominaDialog] = useState<boolean>(false);
    const [seeNominaDialog, setSeeNominaDialog] = useState<boolean>(false);
    const [deleteNominaDialog, setDeleteNominaDialog] = useState<boolean>(false);
    const [deleteBonificacionDialog, setDeleteBonificacionDialog] = useState<boolean>(false);
    const [datosNominaDialog, setDatosNominaDialog] = useState<boolean>(false);
    const [bonificacionDialog, setBonificacionDialog] = useState<boolean>(false);
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
        return <cdT.ColumnSalaryBody value={rowData.employee.area.salary} className={''} />
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
                    <Button icon="pi pi-eye" rounded outlined severity='help' onClick={() => seeNomina(rowData)} />
                    <Button icon="pi pi-pencil" rounded outlined onClick={() => editNomina(rowData)} />
                    <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteNomina(rowData)} />

                </div>
            </React.Fragment>
        );
    };




    //? -------------------- BONIFICACION DATATABLE COLUMN TEMPLATES -------------------
    const descriptionBodyTemplate = (rowData: Bonificacion) => {
        return <cdT.ColumnTextBody value={rowData.descripcion} />
    };

    const cantidadBodyTemplate = (rowData: Bonificacion) => {
        return <cdT.ColumnTextBody value={rowData.cantidad} />
    };

    const actionBoniBodyTemplate = (rowData: Bonificacion) => {
        return (
            <React.Fragment>
                <div className="flex align-align-content-center justify-content-evenly">
                    <Button icon="pi pi-pencil" rounded outlined onClick={() => editBonificacion(rowData)} />
                    <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteBonificacion(rowData)} />
                </div>
            </React.Fragment>
        );
    };

    //? -------------------- DATA LOADING -------------------
    useEffect(() => {
        getNominas();
        getPeriodos();

        setNominaId(nomina.id);

        getEmployees();
        setLoading(false);
    }, [nomina, bonificacion]);


    const openNew = () => {
        setSelectedPeriodo(null);
        setSelectedEmployee(null);
        setNomina(emptyNomina);
        setNominaDialog(true);
        // setDepartments([]);
        // resetFormOnOpen();
    };

    const hideDialog = () => {
        setSelectedPeriodo(null);
        setSelectedEmployee(null);
        setNominaDialog(false);
        // setDepartments([]);
        // setSelectedStatus(null);
    };

    const editNomina = (nomina: Nomina) => {
        setNomina({ ...nomina });
        setNominaDialog(true);

        // setDepartments([]);
        // resetFormOnOpen();
    };

    const seeNomina = (nomina: Nomina) => {
        setNomina({ ...nomina });
        setSeeNominaDialog(true);
    };

    const hideSeeDialog = () => {
        // setEstados([]);
        // setSelectedStatus(null);
        setSeeNominaDialog(false);
    };

    const hideDeleteNominaDialog = () => {
        setDeleteNominaDialog(false);
    };

    const confirmDeleteNomina = (nomina: Nomina) => {
        setNomina(nomina);
        setDeleteNominaDialog(true);
    };

    const deleteNominaModal = () => {
        deleteNomina(nomina.id);
        setDeleteNominaDialog(false);
        setNomina(emptyNomina);
    };

    const datosNomina = () => {
        getBonificaciones(nominaId);
        // setSelectedTipoBonificacion(null);
        setDatosNominaDialog(true);
    };

    const hideDatosNomina = () => {
        setBonificaciones([]);
        // setSelectedTipoBonificacion(null);
        setBonificacion(emptyBonificacion);
        setDatosNominaDialog(false);
    };

    //BONIFICACION
    const openBoni = () => {
        setBonificacion(emptyBonificacion);
        setBonificacionDialog(true);
    };

    const hideBonificacion = () => {
        setSelectedTipoBonificacion(null);
        setBonificacionDialog(false);
        getBonificaciones(nominaId);
    };

    const editBonificacion = (bonificacion: Bonificacion) => {
        setBonificacion({ ...bonificacion });
        setBonificacionDialog(true);
    };

    const hideDeleteBonificacionDialog = () => {
        setDeleteBonificacionDialog(false);
    };

    const confirmDeleteBonificacion = (bonificacion: Bonificacion) => {
        setBonificacion(bonificacion);
        setDeleteBonificacionDialog(true);
    };

    const deleteBonificacionModal = () => {
        deleteBonificacion(bonificacion.id);
        setDeleteBonificacionDialog(false);
        setBonificacion(emptyBonificacion);
    };

    //? -------------------- MODAL BUTTONS -------------------
    const deleteNominaDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteNominaDialog} />
            <Button label="Si, eliminar" icon="pi pi-check" severity="danger" onClick={deleteNominaModal} />
        </React.Fragment>
    );

    const deleteBonificacionDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteBonificacionDialog} />
            <Button label="Si, eliminar" icon="pi pi-check" severity="danger" onClick={deleteBonificacionModal} />
        </React.Fragment>
    );

    const seeDialogFooter = (
        <React.Fragment>
            <Button label="Salir de la vista" icon="pi pi-times" outlined onClick={hideSeeDialog} />
        </React.Fragment>
    );

    //? -------------------- TABS (DETAILS DIALOG) -------------------
    const tab1HeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {
        return (
            <div className="flex align-items-center gap-2 p-3 justify-content-center" style={{ cursor: 'pointer' }} onClick={options.onClick}>
                <span className="font-bold white-space-nowrap">BONIFICACIONES</span>
            </div>
        );
    };

    const tab2HeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {
        return (
            <div className="flex align-items-center gap-2 p-3 justify-content-center" style={{ cursor: 'pointer' }} onClick={options.onClick}>
                <span className="font-bold white-space-nowrap">DATOS DEL TRABAJO</span>
            </div>
        )
    };

    const tab3HeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {
        return (
            <div className="flex align-items-center gap-2 p-3 justify-content-center" style={{ cursor: 'pointer' }} onClick={options.onClick}>
                <span className="font-bold white-space-nowrap">OTROS DATOS</span>
            </div>
        )
    };

    //? -------------------- RENDER -------------------
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <h3>Nominas</h3>
                <BreadComp texto="Nominas" />

                {/* //? -------------------- DATATABLE ------------------- */}
                <DataTableCrud
                    dtSize="small"
                    buscador={true}
                    btActive={true}
                    btnSize="small"
                    btnColor="primary"
                    btnText={"Agregar Nomina"}
                    openNew={openNew}
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
                        // { field: 'status', header: 'Estado', body: statusBodyTemplate, dataType: 'boolean', filter: false },
                        { field: 'createdAt', header: 'Creado el', body: createdAtBodyTemplate, dataType: 'date', filter: false },
                        { field: 'updatedAt', header: 'Ultima Actualización', body: updatedAtBodyTemplate, filter: false, dataType: 'date' },
                    ]}
                    size='12rem'
                    actionBodyTemplate={actionBodyTemplate}
                />
            </div>

            {/* //? -------------------- MODAL DIALOG (CREATE AND UPDATE) ------------------- */}
            <Dialog visible={nominaDialog} style={{ width: '70rem', height: '42rem', minWidth: '50rem', maxWidth: '90vw', minHeight: '40rem', maxHeight: '90vh' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles de la Nomina" modal className="p-fluid" onHide={hideDialog} dismissableMask={false} blockScroll={true} closeOnEscape={false}
            >
                <Formik
                    initialValues={{ sueldo_horas_extra: '' || nomina.sueldo_horas_extra, periodo: nomina.periodo || '', employee: nomina.employee || '' }}
                    validate={values => {
                        const errors = {};

                        if (!values.periodo) {
                            errors.periodo = 'El periodo es requerido';
                        }
                        if (!values.employee) {
                            errors.employee = 'El empleado es requerido';
                        }
                        if (!values.sueldo_horas_extra) {
                            errors.sueldo_horas_extra = 'Las horas extra son requeridas';
                        } else if (values.sueldo_horas_extra <= 0) {
                            errors.sueldo_horas_extra = 'Las horas extra no pueden ser negativas';
                        }
                        // else if (!/^\d{1,2}$/.test(values.horas_extra)) {
                        //     errors.horas_extra = 'Las horas extra son invalidas';
                        // }





                        // if (!nomina.id) {
                        //     if (!values.country) {
                        //         errors.country = 'El pais es requerido';
                        //     }
                        //     if (!values.identification_type) {
                        //         errors.identification_type = 'El tipo de identificacion es requerido';
                        //     }
                        //     if (!values.gender) {
                        //         errors.gender = 'El genero es requerido';
                        //     }
                        //     if (!values.birthdate) {
                        //         errors.birthdate = 'La fecha de nacimiento es requerida';
                        //     }
                        //     if (!values.hire_date) {
                        //         errors.hire_date = 'La fecha de contratación es requerida';
                        //     }
                        //     if (!values.contract_type) {
                        //         errors.contract_type = 'El tipo de contrato es requerido';
                        //     }
                        //     if (!values.work_day) {
                        //         errors.work_day = 'Debes de agregar una jornada laboral';
                        //     }
                        // }
                        return errors;
                    }}
                    onSubmit={(values, { resetForm }) => {
                        if (values) {
                            values.companyId = 1;
                            if (nomina.id) {
                                if (values.periodo !== "") { values.periodoId = values.periodo.id } else { values.periodoId = nomina.periodoId }
                                if (values.employee !== "") { values.employeeId = values.employee.id } else { values.employeeId = nomina.employeeId }

                                updateNomina(nomina.id, values);
                                setNominaDialog(false);
                                setNomina(emptyNomina);
                                resetForm();
                            } else {
                                values.periodoId = values.periodo.id;
                                values.employeeId = values.employee.id;

                                createNomina(values);
                                setNominaDialog(false);
                                setNomina(emptyNomina);
                                resetForm();
                                datosNomina();
                            }
                        } else {
                            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Nomina no registrado', life: 5000 });
                        }
                    }}
                >
                    {({ values, errors, touched, dirty, isValid, handleChange, handleBlur }) => (
                        <Form style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            {/* <div className="flex flex-row justify-content-center align-items-center gap-5">
                                <div className="flex">
                                    <cdT.ColumnOnlyDateBodyWithClass value={values.fecha_pago} className={''} />
                                </div>
                                <div className="flex">
                                    <label className="text-md font-bold">al
                                    </label>
                                </div>
                                <div className="flex">
                                    <cdT.ColumnOnlyDateBodyWithClass value={values.periodo_liquidacion_final} className={''} />
                                </div>

                            </div> */}
                            <TabView style={{ flex: 1, overflow: 'auto' }}>
                                <TabPanel className='w-full' header="Header I" headerTemplate={tab1HeaderTemplate}>
                                    <Formulario>
                                        <div className="grid">
                                            <fI.DropDownD
                                                col={6}
                                                id="periodo"
                                                name="periodo"
                                                placeholder="Seleccione un periodo"
                                                label="Periodo de Liquidación"
                                                value={selectedPeriodo}
                                                optionLabel={(option) => `${dayjs.utc(option.periodo_liquidacion_inicio).format('DD/MM/YYYY')} - AL - ${dayjs.utc(option.periodo_liquidacion_final).format('DD/MM/YYYY')}`}
                                                emptyMessage="No se encontraron periodos"
                                                onChange={(e: DropdownChangeEvent) => { handleChange(e); setSelectedPeriodo(e.value) }}
                                                onBlur={handleBlur}
                                                options={periodos}

                                                span={!nomina.id ? "*" : ""}
                                                invalid={!nomina.id ? !!errors.periodo && touched.periodo : false}
                                                errorText={!nomina.id ? errors.periodo : ""}

                                                disabled={false}
                                            />

                                            <fI.DropDownD
                                                col={6}
                                                id="employee"
                                                name="employee"
                                                placeholder="Seleccione un empleado"
                                                label="Empleado"
                                                value={selectedEmployee}
                                                optionLabel={(option) => `${option.fullName} - ${option.identification_type}: ${option.identification}`}
                                                emptyMessage="No se encontraron empleados"
                                                onChange={(e: DropdownChangeEvent) => { handleChange(e); setSelectedEmployee(e.value) }}
                                                onBlur={handleBlur}
                                                options={employees}

                                                span={!nomina.id ? "*" : ""}
                                                invalid={!nomina.id ? !!errors.employee && touched.employee : false}
                                                errorText={!nomina.id ? errors.employee : ""}

                                                disabled={false}
                                            />

                                            <fI.InputT
                                                col={6}
                                                id="sueldo_horas_extra"
                                                name="sueldo_horas_extra"
                                                type="number"
                                                placeholder="Ingrese las horas extra en Q."
                                                label="Horas Extra"
                                                span="*"
                                                value={values.sueldo_horas_extra}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.sueldo_horas_extra && touched.sueldo_horas_extra}
                                                errorText={errors.sueldo_horas_extra}
                                            />

                                            {nomina.id && (
                                                <fI.ButtonB label="Modificar o Agregar Bonificaciones" icon="pi pi-plus" type='button' onClick={datosNomina} col={6} color={'warning'} />
                                            )}

                                        </div>
                                    </Formulario>
                                </TabPanel>
                                {/* 
                                <TabPanel className='w-full' header="Header II" headerTemplate={tab2HeaderTemplate}>
                                    
                                </TabPanel> */}

                                {/* {nomina.id ? (
                                    <TabPanel className='w-full' header="Header III" headerTemplate={tab3HeaderTemplate}>
                            
                                    </TabPanel>
                                ) : (null)} */}
                            </TabView>

                            <div className="flex mb-0 pt-3">
                                <Button label="Cancelar" type='button' icon="pi pi-times" outlined
                                    onClick={hideDialog} className='mx-1' />
                                <Button label="Guardar Nomina" icon="pi pi-check" type='submit' className='mx-1'
                                    disabled={nomina.id ? false : !(isValid && dirty)}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            {/* //? -------------------- MODAL DIALOG (TABLA BONIFICACIONES) ------------------- */}
            <Dialog visible={datosNominaDialog} style={{ width: '70rem', height: '42rem', minWidth: '50rem', maxWidth: '90vw', minHeight: '40rem', maxHeight: '90vh' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Bonificaciones" modal className="p-fluid" onHide={hideDatosNomina} dismissableMask={false} blockScroll={true} closeOnEscape={false}
            >
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ flex: 1, overflow: 'auto' }}>

                        <DataTableCrud
                            dtSize="small"
                            buscador={false}
                            btActive={true}
                            btnSize="small"
                            btnColor="primary"
                            btnText={"Agregar Bonificación"}
                            openNew={openBoni}
                            //? -------------------- HEADER -------------------
                            message="bonificaciones"
                            headerMessage=""
                            refe={dt}
                            value={bonificaciones}
                            loading={loading}
                            filters={''}
                            setFilters={''}
                            setGlobalFilterValue={''}
                            globalFilterValue={''}
                            globalFilterFields={[]}
                            //? -------------------- COLUMNS -------------------
                            columns={[
                                { field: 'descripcion', header: 'Descripción', body: descriptionBodyTemplate, dataType: 'text', filter: false },
                                { field: 'cantidad', header: 'Cantidad', body: cantidadBodyTemplate, dataType: 'numeric', filter: false },
                            ]}
                            size='8rem'
                            actionBodyTemplate={actionBoniBodyTemplate}
                        />
                    </div>

                    <div className="flex mb-0 pt-3 justify-content-end">
                        <div className="">
                            <Button label="Cerrar Ventana" type='button' icon="pi pi-times" outlined
                                onClick={hideDatosNomina} />
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* //? -------------------- MODAL DIALOG (AGREGAR BONIFICACION) ------------------- */}
            <Dialog visible={bonificacionDialog} style={{ width: '30rem', height: '42rem', minWidth: '30rem', maxWidth: '90vw', minHeight: '42rem', maxHeight: '90vh' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={`Bonificación: ${nominaId}`} modal className="p-fluid" onHide={hideBonificacion} dismissableMask={false} blockScroll={true} closeOnEscape={false}
            >
                <Formik
                    initialValues={{ descripcion: '' || bonificacion.descripcion, cantidad: '' || bonificacion.cantidad }}
                    validate={values => {
                        const errors = {};

                        if (!values.descripcion) {
                            errors.descripcion = 'La descripción es requerida';
                        }

                        // if (!values.descripcion) {
                        //     errors.descripcion = 'La descripción es requerida';
                        // } else if (values.descripcion.length < 5) {
                        //     errors.descripcion = 'La descripción debe tener al menos 5 caracteres';
                        // } else if (values.descripcion.length > 100) {
                        //     errors.descripcion = 'La descripción debe tener menos de 100 caracteres';
                        // }

                        if (!values.cantidad) {
                            errors.cantidad = 'La cantidad es requerida';
                        } else if (values.cantidad <= 0) {
                            errors.cantidad = 'La cantidad no puede ser negativa';
                        } else if (!/^\d{1,10}$/.test(values.cantidad)) {
                            errors.cantidad = 'La cantidad es invalida';
                        }

                        return errors;
                    }}
                    onSubmit={(values, { resetForm }) => {
                        if (values) {
                            if (bonificacion.id) {

                                if (selectedTipoBonificacion?.code) { values.descripcion = selectedTipoBonificacion.code } else { values.descripcion = bonificacion.descripcion }

                                // values.nominaId = bonificacion.nominaId;
                                updateBonificacion(bonificacion.id, values);
                                setBonificacionDialog(false);
                                setBonificacion(emptyBonificacion);
                                resetForm();
                            } else {
                                values.descripcion = selectedTipoBonificacion.code;
                                values.nominaId = nominaId;
                                createBonificacion(values);
                                setBonificacionDialog(false);
                                setBonificacion(emptyBonificacion);
                                resetForm();
                            }
                        } else {
                            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Bonificación no registrada', life: 5000 });
                        }
                    }}
                >
                    {({ values, errors, touched, dirty, isValid, handleChange, handleBlur }) => (
                        <Form style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ flex: 1, overflow: 'auto' }}>

                                <div className='w-full'>
                                    <Formulario>
                                        {/* <fI.TextArea
                                            col={12}
                                            id="descripcion"
                                            name="descripcion"
                                            placeholder="Ingrese una descripción"
                                            label="Descripción de la Bonificación"
                                            span="*"
                                            value={values.descripcion}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            invalid={!!errors.descripcion && touched.descripcion}
                                            errorText={errors.descripcion}
                                        /> */}

                                        <fI.DropDownD
                                            col={12}
                                            id="descripcion"
                                            name="descripcion"
                                            placeholder="Seleccione un tipo de bonificación"
                                            label="Tipo de Bonificación"
                                            value={selectedTipoBonificacion}
                                            optionLabel={(option) => `${option.name}`}
                                            emptyMessage="No se encontraron tipos de bonificaciones"
                                            onChange={(e: DropdownChangeEvent) => { handleChange(e); setSelectedTipoBonificacion(e.value) }}
                                            onBlur={handleBlur}
                                            options={typeTipoBonificacion}

                                            span={!bonificacion.id ? "*" : ""}
                                            invalid={!bonificacion.id ? !!errors.descripcion && touched.descripcion : false}
                                            errorText={!bonificacion.id ? errors.descripcion : ""}

                                            disabled={false}
                                        />

                                        <fI.InputT
                                            col={12}
                                            id="cantidad"
                                            name="cantidad"
                                            type="number"
                                            placeholder="Ingrese la cantidad"
                                            label="Cantidad"
                                            span="*"
                                            value={values.cantidad}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            invalid={!!errors.cantidad && touched.cantidad}
                                            errorText={errors.cantidad}
                                        />
                                    </Formulario>
                                </div>
                            </div>

                            <div className="flex mb-0 pt-3">
                                <Button label="Cancelar" type='button' icon="pi pi-times" outlined
                                    onClick={hideBonificacion} className='mx-1' />
                                <Button label="Guardar Bonificacion" icon="pi pi-check" type='submit' className='mx-1'
                                    disabled={bonificacion.id ? false : !(isValid && dirty)}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            {/* //? -------------------- MODAL DIALOG (ONLY READ) ------------------- */}
            <Dialog visible={seeNominaDialog} style={{ width: '62rem', minWidth: '60rem', maxWidth: '90vw', minHeight: '30rem', maxHeight: '90vh' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Todos los datos de la nomina" modal className='p-fluid' footer={seeDialogFooter} onHide={hideSeeDialog}>
                <div className="confirmation-content">
                    {nomina && (<>
                        {nomina.id ? (<>
                            <div className="card">
                                <TabView>
                                    <TabPanel className='w-full' header="Header I" headerTemplate={tab1HeaderTemplate}>
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

                                                        <label className='text-md capitalize'> <b>AREA:</b> {nomina.employee.area.name}</label>

                                                        <label className='text-md capitalize'> <b>FECHA CONTRATACION:</b> {nomina.employee.hire_date}</label>

                                                        <label className='text-md capitalize'> <b>TIPO CONTRATO:</b> {nomina.employee.contract_type}</label>

                                                        <label className='text-md capitalize'> <b>TIPO TRABAJO:</b> {nomina.employee.work_day}</label>


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
                                    <TabPanel className='w-full' header="Header II" headerTemplate={tab2HeaderTemplate}>
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
                                                        <span className="p-tag">PERCEPCIONES</span>
                                                    </Divider>
                                                    <div className="gap-3 justify-content-between">
                                                        <div className="flex flex-column gap-3">

                                                            <div className="flex justify-content-between">
                                                                <label className='text-md capitalize'> SALARIO BASE</label>
                                                                <label className='text-md capitalize'>Q.{nomina.employee.area.salary}</label>
                                                            </div>

                                                            <div className="flex justify-content-between">
                                                                <label className='text-md capitalize'>BONIFICACIONES</label>
                                                                <div className="flex flex-column gap-2">
                                                                    <label className='text-md capitalize'>{
                                                                        nomina.bonificacions.map((bonificacion, index) => (
                                                                            <div className="flex justify-content-between mb-1">
                                                                                <div className="mr-4">
                                                                                    <span key={index}>{bonificacion.descripcion}</span>
                                                                                </div>
                                                                                <div className="">
                                                                                    <span key={index}>Q.{bonificacion.cantidad}</span>
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    }</label>
                                                                    <Divider align="center" className='-mt-1 -mb-1' />
                                                                    <div className="flex justify-content-end">
                                                                    <label className='text-md capitalize font-bold'>Q.{nomina.total_bonificaciones}</label>
                                                                    </div>
                                                                </div>

                                                            </div>

                                                            <div className="flex justify-content-between">
                                                                <label className='text-md capitalize'> NO. HORAS EXTRA: <b> {nomina.cantidad_horas_extra}</b></label>
                                                                <label className='text-md capitalize'>Q.{nomina.sueldo_horas_extra}</label>
                                                            </div>

                                                            <div className="flex justify-content-between">
                                                                <label className='text-md capitalize'> VACACIONES PAGADAS</label>
                                                                <label className='text-md capitalize'>Q.{nomina.vacaciones_pagadas}</label>
                                                            </div>

                                                            <Divider align="center" className='-mt-1' />
                                                            <Divider align="center" className='-mt-5 -mb-1' />

                                                            <div className="flex justify-content-between">
                                                                <label className='text-md capitalize'><b>TOTAL PERCEPCIONES</b></label>
                                                                <label className='text-md capitalize'><b>Q.{nomina.total_percepciones}</b></label>
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
                                                                <label className='text-md capitalize'>Q.{nomina.isr}</label>
                                                            </div>

                                                            <div className="flex justify-content-between">
                                                                <label className='text-md capitalize'>IGSS (PATRONAL)</label>
                                                                <label className='text-md capitalize'>Q.{nomina.igss_patronal}</label>
                                                            </div>

                                                            <div className="flex justify-content-between">
                                                                <label className='text-md capitalize'>IGSS (LABORAL)</label>
                                                                <label className='text-md capitalize'>Q.{nomina.igss_laboral}</label>
                                                            </div>

                                                            <div className="flex justify-content-between">
                                                                <label className='text-md capitalize'>PRESTAMOS</label>
                                                                <label className='text-md capitalize'>Q.{nomina.prestamos}</label>
                                                            </div>

                                                            <Divider align="center" className='-mt-1' />
                                                            <Divider align="center" className='-mt-5 -mb-1' />

                                                            <div className="flex justify-content-between">
                                                                <label className='text-md capitalize'><b>TOTAL DEDUCCIONES</b></label>
                                                                <label className='text-md capitalize'><b>Q.{nomina.total_deducciones}</b></label>
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
                                                                <label className='text-lg capitalize text-primary'><b>Q.{nomina.liquido_percibir}</b></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel className='w-full' header="Header III" headerTemplate={tab3HeaderTemplate}>
                                        <div className="field mt-5 mb-3">
                                            <div className="formgrid grid">
                                                <div className="col-12">
                                                    <div className="flex flex-wrap gap-3 justify-content-between">
                                                        {/* <label className='text-md capitalize'> <b>USUARIO QUE REALIZO LA ACCION:</b> Aqui va el usuario que hizo la accion</label>

                                                        <label className='text-md capitalize'> <b>USUARIO QUE ACTUALIZO LOS DATOS:</b> Aqui va el usuario que hizo la accion</label> */}

                                                        <Divider align="center" />

                                                        <label className='text-md'> <b>CREADO EL:</b>
                                                            <cdT.ColumnDateBody value={nomina.createdAt} />
                                                        </label>


                                                        <label className='text-md'> <b>ULTIMA ACTUALIZACION:</b>
                                                            <cdT.ColumnDateBody value={nomina.createdAt} />
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
            </Dialog>

            {/* //? -------------------- MODAL DIALOG (DELETE) ------------------- */}
            <m.DeleteModal
                visible={deleteNominaDialog}
                header="Confirmar"
                data={nomina}
                message1="¿Estas seguro que deseas eliminar la nomina del empleado:"
                message1Bold={nomina.employee.fullName}
                message2="para la fecha de pago:"
                message2Bold={<cdT.ColumnOnlyDateBodyText value={nomina.fecha_pago} className={''} />}
                footer={deleteNominaDialogFooter}
                onHide={hideDeleteNominaDialog}
            ></m.DeleteModal>

            {/* //? -------------------- MODAL DIALOG (DELETE BONIFICACION) ------------------- */}
            <m.DeleteModal
                visible={deleteBonificacionDialog}
                header="Confirmar"
                data={bonificacion}
                message1="¿Estas seguro que deseas eliminar esta bonificacion:"
                message1Bold={bonificacion.descripcion}
                message2="para el empleado:"
                message2Bold={nomina.employee.fullName}
                footer={deleteBonificacionDialogFooter}
                onHide={hideDeleteBonificacionDialog}
            ></m.DeleteModal>
        </div>
    );
}