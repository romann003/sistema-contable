//? -------------------- COMPONENTES Y LIBRERIAS -------------------
import React, { useEffect, useRef, useState } from 'react';
import { Form, Formik } from 'formik';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
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
    'employee.area.salary': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'periodo.fecha_pago': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'periodo.periodo_liquidacion_inicio': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'periodo.periodo_liquidacion_final': { value: null, matchMode: FilterMatchMode.CONTAINS },
}

export default function NominaPage() {

    const emptyNomina: Nomina = {
        id: null,
        cantidad_horas_extra: null,
        sueldo_horas_extra: null,
        total_percepciones: null,
        isr: null,
        total_igss: null,
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
        bonificaciones: [],
        total_bonificaciones: null

    };

    const emptyBonificacion: Bonificacion = {
        descripcion: '',
        cantidad: null
    };

    const typeTipoBonificacion: TipoBonificacion[] = [
        { name: 'Bonificación por Productividad', code: 'bonificacion por productividad' },
        { name: 'Bonificación por Cumplimiento de objetivos', code: 'bonificacion por cumplimiento de objetivos' },
        { name: 'Bonificación por Asistencia', code: 'bonificacion por asistencia' },
    ];

    //? -------------------- CONTEXT API -------------------
    const { periodos, getPeriodos } = useNominaDatos();
    const { employees, getEmployees } = useEmployees();
    const { nominas, getNominas, createNomina, deleteNomina } = useNominas();

    //? -------------------- STATES -------------------
    const [cantidadHorasExtra, setCantidadHorasExtra] = useState<number>(0);
    const [sueldoBase, setSueldoBase] = useState<number>(0);
    const [totalHorasExtra, setTotalHorasExtra] = useState<number>(0);
    const [totalIgss, setTotalIgss] = useState<number>(0);
    const [bonificacionesT, setBonificacionesT] = useState<Bonificacion[]>([]);

    const [selectedPeriodo, setSelectedPeriodo] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedTipoBonificacion, setSelectedTipoBonificacion] = useState<TipoBonificacion | null>(null);
    const [nomina, setNomina] = useState<Nomina>(emptyNomina);
    const [bonificacion, setBonificacion] = useState<Bonificacion>(emptyBonificacion);
    const toast = useRef<Toast>(null);
    //? -------------------- DIALOG STATES -------------------
    const [nominaDialog, setNominaDialog] = useState<boolean>(false);
    const [cNominaDialog, setCNominaDialog] = useState<boolean>(false);
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
        return <cdT.ColumnSalaryBody value={rowData.employee.area.salary} className={'text-green-400'} />
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
                    {/* <Button icon="pi pi-pencil" rounded outlined onClick={() => editNomina(rowData)} /> */}
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
                    {/* <Button icon="pi pi-pencil" rounded outlined onClick={() => editBonificacion(rowData)} /> */}
                    <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteBonificacion(rowData)} />
                </div>
            </React.Fragment>
        );
    };

    //? -------------------- DATA LOADING -------------------
    useEffect(() => {
        getNominas();
        getPeriodos();
        getEmployees();
        setLoading(false);
    }, [nomina]);

    //Nomina
    const openNew = () => {
        setSelectedPeriodo(null);
        setSelectedEmployee(null);
        setNomina(emptyNomina);
        setNominaDialog(true);
        setBonificacionesT([]);
    };

    const hideDialog = () => {
        setSelectedPeriodo(null);
        setSelectedEmployee(null);
        setTotalIgss(0);
        setTotalHorasExtra(0);
        setSueldoBase(0);
        setCantidadHorasExtra(0);
        setNominaDialog(false);
        // setNomina(emptyNomina);
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

    //Ver Nomina
    const seeNomina = (nomina: Nomina) => {
        setNomina({ ...nomina });
        setSeeNominaDialog(true);
    };

    const hideSeeDialog = () => {
        setSelectedPeriodo(null);
        setSelectedEmployee(null);
        setTotalIgss(0);
        setTotalHorasExtra(0);
        setSueldoBase(0);
        setCantidadHorasExtra(0);
        setSeeNominaDialog(false);
    };

    //Confirmar Cerrar
    const cNomina = () => {
        setCNominaDialog(true);
    };

    const hideCNominaDialog = () => {
        setCNominaDialog(false);
    };

    const confirmCNomina = () => {
        setCNominaDialog(false);
        hideDialog();
    }

    //Nomina Datos

    const datosNomina = () => {
        setDatosNominaDialog(true);
    };

    const hideDatosNomina = () => {
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
    };

    const hideDeleteBonificacionDialog = () => {
        setDeleteBonificacionDialog(false);
    };

    const confirmDeleteBonificacion = (bonificacion: Bonificacion) => {
        setBonificacion(bonificacion);
        setDeleteBonificacionDialog(true);
    };

    const deleteBonificacionModal = () => {
        deleteBoni(bonificacion.id);
        setDeleteBonificacionDialog(false);
        setBonificacion(emptyBonificacion);
    };

    const addBonificacion = (bon) => {
        bon.id = bonificacionesT.length + 1;
        setBonificacionesT([...bonificacionesT, bon]);
    };

    const deleteBoni = (index) => {
        setBonificacionesT(bonificacionesT.filter(bonificacion => bonificacion.id !== index));
    };

    //? -------------------- MODAL BUTTONS -------------------
    const deleteNominaDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteNominaDialog} />
            <Button label="Si, eliminar" icon="pi pi-check" severity="danger" onClick={deleteNominaModal} />
        </React.Fragment>
    );

    const closeNominaDatosDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideCNominaDialog} />
            <Button label="Si, Cerrar" icon="pi pi-check" severity="danger" onClick={confirmCNomina} />
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

    //? -------------------- CALCULOS -------------------
    const calcularTotalHorasExtra = (cantidadHorasExtra, sueldoBase) => {
        let jornada = 0;
        if (selectedEmployee.work_day === 'Ordinaria' || selectedEmployee.work_day === 'Continua' || selectedEmployee.work_day === 'Mixta' || selectedEmployee.work_day === 'Nocturna') {
            jornada = 8;
        } else if (selectedEmployee.work_day === 'Medio Tiempo') {
            jornada = 4;
        }
        const valorHora = sueldoBase / 30 / jornada;
        const valorHorasExtra = valorHora * 1.5;
        const totalHE = cantidadHorasExtra * valorHorasExtra;
        setTotalHorasExtra(totalHE.toFixed(2));
        return totalHE.toFixed(2);
    }

    const calcularIgss = (sueldoBase) => {
        const igss = sueldoBase * 0.0483;
        setTotalIgss(igss.toFixed(2));
    }

    const handleCantidadHorasChange = (event) => {
        const horas = parseFloat(event.target.value);
        setCantidadHorasExtra(horas);
        const total = calcularTotalHorasExtra(horas, sueldoBase);
        setTotalHorasExtra(total);
    }

    useEffect(() => {
        if (selectedEmployee) {
            setSueldoBase(selectedEmployee.area.salary);
            calcularTotalHorasExtra(cantidadHorasExtra, selectedEmployee.area.salary);
            calcularIgss(selectedEmployee.area.salary);
        }
    }, [selectedEmployee]);

    //? -------------------- RENDER -------------------
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <h3>Nominas</h3>
                <BreadComp texto="Nominas" pre={''} valid={false} />

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
                        { field: 'createdAt', header: 'Creado el', body: createdAtBodyTemplate, dataType: 'date', filter: false },
                        { field: 'updatedAt', header: 'Ultima Actualización', body: updatedAtBodyTemplate, filter: false, dataType: 'date' },
                    ]}
                    size='8rem'
                    actionBodyTemplate={actionBodyTemplate}
                />
            </div>

            {/* //? -------------------- MODAL DIALOG (CREATE) ------------------- */}
            <m.LargeModal visible={nominaDialog} header="Detalles de la Nomina" onHide={hideDialog} footer={null} dismissableMask={false} blockScroll={true} closeOnEscape={true} >
                <Formik
                    initialValues={{
                        sueldo_horas_extra: '' || nomina.sueldo_horas_extra, cantidad_horas_extra: '' || nomina.cantidad_horas_extra, isr: '' || nomina.isr, total_igss: '' || nomina.total_igss, prestamos: '' || nomina.prestamos, anticipo_salario: '' || nomina.anticipo_salario, periodo: nomina.periodo || '', employee: nomina.employee || '', bonificaciones: bonificacionesT || ''
                    }}
                    validate={values => {
                        const errors = {};

                        if (!values.periodo) {
                            errors.periodo = 'El periodo es requerido';
                        }
                        if (!values.employee) {
                            errors.employee = 'El empleado es requerido';
                        }

                        if (values.cantidad_horas_extra < 0) {
                            errors.cantidad_horas_extra = 'Las horas extra no pueden ser negativas';
                        }

                        if (values.sueldo_horas_extra < 0) {
                            errors.sueldo_horas_extra = 'Las horas extra no pueden ser negativas';
                        }

                        if (values.vacaciones_pagadas < 0) {
                            errors.vacaciones_pagadas = 'Las vacaciones pagadas no pueden ser negativas';
                        }

                        if (values.isr < 0) {
                            errors.isr = 'El ISR no puede ser negativo';
                        }

                        if (values.total_igss < 0) {
                            errors.total_igss = 'El IGSS Patronal no puede ser negativo';
                        }

                        if (values.prestamos < 0) {
                            errors.prestamos = 'Los prestamos no pueden ser negativos';
                        }

                        if (values.anticipo_salario < 0) {
                            errors.anticipo_salario = 'El anticipo de salario no puede ser negativo';
                        }
                        return errors;
                    }}
                    onSubmit={(values, { resetForm }) => {
                        if (values) {
                            values.companyId = 1;
                            values.periodoId = values.periodo.id;
                            values.employeeId = values.employee.id;

                            if (values.cantidad_horas_extra === "" || values.cantidad_horas_extra === null || values.cantidad_horas_extra === undefined || isNaN(values.cantidad_horas_extra)) {
                                values.cantidad_horas_extra = 0;
                            } else { values.cantidad_horas_extra = parseFloat(cantidadHorasExtra).toFixed(2); }

                            if (isNaN(values.sueldo_horas_extra)) { values.sueldo_horas_extra = 0; } else { values.sueldo_horas_extra = parseFloat(totalHorasExtra).toFixed(2); }

                            if (isNaN(values.total_igss)) { values.total_igss = 0; } else { values.total_igss = parseFloat(totalIgss).toFixed(2); }

                            if (values.isr === "" || values.isr === null || values.isr === undefined || isNaN(values.isr)) { values.isr = 0; } else { values.isr = parseFloat(values.isr).toFixed(2); }

                            if (values.prestamos === "" || values.prestamos === null || values.prestamos === undefined || isNaN(values.prestamos)) { values.prestamos = 0; } else { values.prestamos = parseFloat(values.prestamos).toFixed(2); }

                            if (values.anticipo_salario === "" || values.anticipo_salario === null || values.anticipo_salario === undefined || isNaN(values.anticipo_salario)) { values.anticipo_salario = 0; } else { values.anticipo_salario = parseFloat(values.anticipo_salario).toFixed(2); }

                            values.bonificaciones = bonificacionesT;
                            console.log(values);
                            createNomina(values);
                            setNominaDialog(false);
                            setNomina(emptyNomina);
                            resetForm();
                        } else {
                            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Nomina no registrado', life: 5000 });
                        }
                    }}
                >
                    {({ values, errors, touched, dirty, isValid, handleChange, handleBlur }) => (
                        <Form style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <TabView style={{ flex: 1, overflow: 'auto' }}>
                                <TabPanel className='w-full' header="Header I" headerTemplate={(options: TabPanelHeaderTemplateOptions) => m.TabHeaderTemplate(options, 'EMPLEADO E INGRESOS')}>
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
                                                onChange={(e: DropdownChangeEvent) => { handleChange(e); setSelectedEmployee(e.value); }}
                                                onBlur={handleBlur}
                                                options={employees}

                                                span={!nomina.id ? "*" : ""}
                                                invalid={!nomina.id ? !!errors.employee && touched.employee : false}
                                                errorText={!nomina.id ? errors.employee : ""}

                                                disabled={false}
                                            />

                                            <fI.InputT
                                                col={3}
                                                id="sueldoBase"
                                                name="sueldoBase"
                                                type="number"
                                                placeholder="Salario Base en Q."
                                                label="Salario Base"
                                                span=""
                                                value={selectedEmployee ? selectedEmployee.area.salary.toFixed(2) : ''}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={null}
                                                errorText={null}
                                                disabled={true}
                                            />

                                            <fI.InputT
                                                col={3}
                                                id="work_day"
                                                name="work_day"
                                                type="text"
                                                placeholder="Jornada Laboral"
                                                label="Jornada Laboral"
                                                span=""
                                                value={values.employee.work_day}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={null}
                                                errorText={null}
                                                disabled={true}
                                            />

                                            <fI.InputT
                                                col={3}
                                                id="cantidad_horas_extra"
                                                name="cantidad_horas_extra"
                                                type="number"
                                                placeholder="Ingrese las horas extra"
                                                label="Cantidad de Horas Extra"
                                                span=""
                                                value={values.cantidad_horas_extra}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    handleCantidadHorasChange(e);
                                                }}
                                                onBlur={handleBlur}
                                                invalid={!!errors.cantidad_horas_extra && touched.cantidad_horas_extra}
                                                errorText={errors.cantidad_horas_extra}
                                                disabled={selectedEmployee ? false : true}
                                            />

                                            <fI.InputT
                                                col={3}
                                                id="sueldo_horas_extra"
                                                name="sueldo_horas_extra"
                                                type="number"
                                                placeholder="Ingrese las horas extra en Q."
                                                label="Sueldo Total Horas Extra"
                                                span=""
                                                value={totalHorasExtra}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.sueldo_horas_extra && touched.sueldo_horas_extra}
                                                errorText={errors.sueldo_horas_extra}
                                                disabled={true}
                                            />

                                            <fI.ButtonB label="Agregar o Eliminar Bonificaciones" icon="pi pi-plus" type='button' onClick={datosNomina} col={6} color={'warning'} />

                                        </div>
                                    </Formulario>
                                </TabPanel>

                                <TabPanel className='w-full' header="Header II" headerTemplate={(options: TabPanelHeaderTemplateOptions) => m.TabHeaderTemplate(options, 'DEDUCCIONES')
                                }>
                                    <Formulario>
                                        <div className="grid">
                                            <fI.InputT
                                                col={6}
                                                id="isr"
                                                name="isr"
                                                type="number"
                                                placeholder="Ingrese el ISR"
                                                label="ISR"
                                                span=""
                                                value={values.isr}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.isr && touched.isr}
                                                errorText={errors.isr}
                                                disabled={false}
                                            />

                                            <fI.InputT
                                                col={6}
                                                id="total_igss"
                                                name="total_igss"
                                                type="number"
                                                placeholder="Ingrese el IGSS Laboral"
                                                label="Sueldo Total IGSS"
                                                span=""
                                                value={totalIgss}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.total_igss && touched.total_igss}
                                                errorText={errors.total_igss}
                                                disabled={true}
                                            />

                                            <fI.InputT
                                                col={6}
                                                id="prestamos"
                                                name="prestamos"
                                                type="number"
                                                placeholder="Ingrese los prestamos"
                                                label="Prestamos"
                                                span=""
                                                value={values.prestamos}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.prestamos && touched.prestamos}
                                                errorText={errors.prestamos}
                                                disabled={false}
                                            />

                                            <fI.InputT
                                                col={6}
                                                id="anticipo_salario"
                                                name="anticipo_salario"
                                                type="number"
                                                placeholder="Ingrese el anticipo de salario"
                                                label="Anticipo de Salario"
                                                span=""
                                                value={values.anticipo_salario}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.anticipo_salario && touched.anticipo_salario}
                                                errorText={errors.anticipo_salario}
                                                disabled={false}
                                            />
                                        </div>
                                    </Formulario>
                                </TabPanel>
                            </TabView>

                            <div className="flex mb-0 pt-3">
                                <Button label="Cancelar" type='button' icon="pi pi-times" outlined
                                    onClick={cNomina} className='mx-1' />
                                <Button label="Guardar Nomina" icon="pi pi-check" type='submit' className='mx-1'
                                    disabled={nomina.id ? false : !(isValid && dirty)}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </m.LargeModal>

            {/* //? -------------------- MODAL DIALOG (TABLA BONIFICACIONES) ------------------- */}
            <m.MediumModal visible={datosNominaDialog} header={"Bonificaciones"} onHide={hideDatosNomina} footer={null} dismissableMask={true} blockScroll={true} closeOnEscape={true} >
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
                            value={bonificacionesT}
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
                            size='4rem'
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
            </m.MediumModal>

            {/* //? -------------------- MODAL DIALOG (AGREGAR BONIFICACION) ------------------- */}
            <m.SmallModal visible={bonificacionDialog} header={`Detalles de la Bonificación`} onHide={hideBonificacion} footer={null} dismissableMask={false} blockScroll={true} closeOnEscape={true} >
                <Formik
                    initialValues={{ descripcion: '' || bonificacion.descripcion, cantidad: '' || bonificacion.cantidad }}
                    validate={values => {
                        const errors = {};

                        if (!values.descripcion) {
                            errors.descripcion = 'La descripción es requerida';
                        }
                        if (bonificacionesT.some(bonificacion => bonificacion.descripcion === values.descripcion)) {
                            errors.descripcion = 'La descripción ya existe';
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
                        }
                        return errors;
                    }}
                    onSubmit={(values, { resetForm }) => {
                        if (values) {

                            values.descripcion = selectedTipoBonificacion.code;

                            if (bonificacionesT.some(bonificacion => bonificacion.descripcion === values.descripcion)) {
                                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'La bonificación ya existe', life: 5000 });
                            }
                            else {
                                addBonificacion(values);
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
                                            disabled={false}
                                        />
                                    </Formulario>
                                </div>
                            </div>

                            <div className="flex mb-0 pt-3">
                                <Button label="Cancelar" type='button' icon="pi pi-times" outlined onClick={hideBonificacion} className='mx-1' />
                                <Button label="Guardar Bonificacion" icon="pi pi-check" type='submit' className='mx-1' disabled={!(isValid && dirty)} />
                            </div>
                        </Form>
                    )}
                </Formik>
            </m.SmallModal>

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
            </m.LargeModal>

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

            {/* //? -------------------- CONFIRMAR HIDE ------------------- */}
            <m.ComfirmHideModal
                visible={cNominaDialog}
                header="Confirmar"
                message1="¿Estas seguro que deseas cancelar"
                message1Bold="la creación de la nomina?"
                message2="Tendrás que volver a ingresar todos los datos"
                message2Bold="para esta nómina."
                footer={closeNominaDatosDialogFooter}
                onHide={hideCNominaDialog}
            ></m.ComfirmHideModal>

        </div>
    );
}