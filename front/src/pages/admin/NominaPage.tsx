import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Form, Formik } from 'formik';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { MenuItem } from 'primereact/menuitem';
import { TabPanel, TabPanelHeaderTemplateOptions, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAreas } from '../../api/context/AreaContext';
import { useDepartments } from '../../api/context/DepartmentContext';
import { useNominas } from '../../api/context/NominaContext';
import { useEmployees } from '../../api/context/EmployeeContext.js';
import { useNominaDatos } from '../../api/context/nominaDatosContext.js';

import { Formulario } from '../../layout/elements/Formularios.js';
import { Nomina, Status, emptyNomina, typeStatus } from '../../layout/elements/InitialData';
import * as TemplatesBody from '../../layout/components/ColumnBody.js';
import { DeleteModal } from '../../layout/components/Modals.js';
import DataTableCrud from '../../layout/components/DataTableCrud.js';
import { FormDropDown, FormInput, FormTextArea } from '../../layout/components/FormComponent.js';

dayjs.extend(utc);

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
    const items: MenuItem[] = [{ template: () => <Link to=""><span className="text-primary font-semibold">Nominas</span></Link> }];
    const home: MenuItem = {
        template: () => <Link to="/dashboard"><span className="text-primary font-semibold">Inicio</span></Link>
    }

    //? -------------------- CONTEXT API -------------------
    const { departments, getActiveDepartments, setDepartments } = useDepartments();
    const { areas, getAreasById, setAreas } = useAreas();
    const { periodos, getPeriodos, setPeriodos } = useNominaDatos();
    const { employees, getEmployees, setEmployees } = useEmployees();
    const { nominas, getNominas, createNomina, deleteNomina, updateNomina } = useNominas();

    //? -------------------- STATES -------------------
    // const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    // const [selectedDepartment, setSelectedDepartment] = useState(null);
    // const [selectedArea, setSelectedArea] = useState(null);
    const [selectedPeriodo, setSelectedPeriodo] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [estados, setEstados] = useState<string[]>([]);
    const [nomina, setNomina] = useState<Nomina>(emptyNomina);
    const toast = useRef<Toast>(null);
    //? -------------------- DIALOG STATES -------------------
    const [nominaDialog, setNominaDialog] = useState<boolean>(false);
    const [seeNominaDialog, setSeeNominaDialog] = useState<boolean>(false);
    const [datosNominaDialog, setDatosNominaDialog] = useState<boolean>(false);
    const [deleteNominaDialog, setDeleteNominaDialog] = useState<boolean>(false);
    //? -------------------- DATATABLE STATES -------------------
    const dt = useRef<DataTable<Nomina[]>>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
    const [loading, setLoading] = useState<boolean>(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    //? -------------------- DATATABLE COLUMN TEMPLATES -------------------
    const nameBodyTemplate = (rowData: Nomina) => {
        return <TemplatesBody.ColumnTextBody value={rowData.employee.fullName} />
    };

    const identificationBodyTemplate = (rowData: Nomina) => {
        return <TemplatesBody.ColumnTextBody value={rowData.employee.identification} />
    };

    const departmentBodyTemplate = (rowData: Nomina) => {
        return <TemplatesBody.ColumnChipBody value={rowData.employee.department.name} />
    };

    const areaBodyTemplate = (rowData: Nomina) => {
        return <TemplatesBody.ColumnChipBody value={rowData.employee.area.name} />
    };

    const salaryBodyTemplate = (rowData: Nomina) => {
        return <TemplatesBody.ColumnTextBody value={rowData.employee.area.salary} />
    };

    const fechaPagoBodyTemplate = (rowData: Nomina) => {
        return <TemplatesBody.ColumnOnlyDateBodyWithClass value={rowData.periodo.fecha_pago} className={'text-orange-600'}/>
    };

    const fechaLiquiIniBodyTemplate = (rowData: Nomina) => {
        return <TemplatesBody.ColumnOnlyDateBodyWithClass value={rowData.periodo.periodo_liquidacion_inicio} className={'bg-gray-200 border-round-2xl '} />
    };

    const fechaLiquiFinBodyTemplate = (rowData: Nomina) => {
        return <TemplatesBody.ColumnOnlyDateBodyWithClass value={rowData.periodo.periodo_liquidacion_final} className={'bg-gray-200 border-round-2xl '}/>
    };

    const statusBodyTemplate = (rowData: Nomina) => {
        return <TemplatesBody.ColumnStatusBody value={rowData} />
    };

    const createdAtBodyTemplate = (rowData: Nomina) => {
        return <TemplatesBody.ColumnDateBody value={rowData.createdAt} />
    };

    const updatedAtBodyTemplate = (rowData: Nomina) => {
        return <TemplatesBody.ColumnDateBody value={rowData.updatedAt} />
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

    //? -------------------- DTATABLE MAIN ACTIONS -------------------
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Agregar Nomina" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    //? -------------------- DATA LOADING -------------------
    useEffect(() => {
        getNominas();
        getPeriodos();
        getEmployees();
        setLoading(false);
    }, [nomina]);

    //? -------------------- HANDLE CHANGE -------------------
    // const handleDepartmentChange = (e, handleChange, setFieldTouched, setFieldValue) => {
    //     const department = e.value;
    //     setSelectedDepartment(department);
    //     setSelectedArea(null);
    //     handleChange(e);
    //     if (department) {
    //         getAreasById(department.id);
    //     } else {
    //         setSelectedArea(null);
    //         setAreas([]);
    //     }

    //     setFieldTouched('area', true);
    //     setFieldValue('area', '', true);
    // };

    // const handleCancel = (resetForm) => {
    //     setSelectedDepartment(null);
    //     setSelectedArea(null);
    //     setAreas([]);
    //     resetForm();
    //     hideDialog();
    // };

    // const resetFormOnOpen = () => {
    //     setSelectedDepartment(nomina.department || null);
    //     setSelectedArea(nomina.area || null);
    //     if (nomina.department) {
    //         getAreasById(nomina.department.id);
    //     } else {
    //         setAreas([]);
    //     }
    // };


    //? -------------------- MODAL DIALOGS -------------------
    const openNew = () => {
        setNomina(emptyNomina);
        setPeriodos([]);
        setEmployees([]);
        setNominaDialog(true);
        // setDepartments([]);
        // resetFormOnOpen();
    };

    const hideDialog = () => {
        setEstados([]);
        setPeriodos([]);
        setEmployees([]);
        // setDepartments([]);
        // setSelectedStatus(null);
        setNominaDialog(false);
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
        setEstados([]);
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

    const datosNomina = (nomina) => {
        setNomina({ ...nomina });
        console.log(nomina.id);
        setDatosNominaDialog(true);
    };

    const hideDatosNomina = () => {
        setEstados([]);
        // setSelectedStatus(null);
        setDatosNominaDialog(false);
    };

    //? -------------------- MODAL BUTTONS -------------------
    const deleteNominaDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteNominaDialog} />
            <Button label="Si, eliminar" icon="pi pi-check" severity="danger" onClick={deleteNominaModal} />
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
                <span className="font-bold white-space-nowrap">DATOS PERSONALES</span>
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
                <BreadCrumb model={items} home={home} />
                <Toolbar className="my-4" left={leftToolbarTemplate}></Toolbar>

                {/* //? -------------------- DATATABLE ------------------- */}
                <DataTableCrud
                    //? -------------------- HEADER -------------------
                    message="nominas"
                    headerMessage="Lista de Nominas"
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
                    initialValues={{ horas_extra: '' || nomina.horas_extra, periodo: nomina.periodo || '', employee: nomina.employee || '' }}
                    validate={values => {
                        const errors = {};

                        if (!values.periodo) {
                            errors.periodo = 'El periodo es requerido';
                        }
                        if (!values.employee) {
                            errors.employee = 'El empleado es requerido';
                        }
                        if (!values.horas_extra) {
                            errors.horas_extra = 'Las horas extra son requeridas';
                        } else if (values.horas_extra <= 0) {
                            errors.horas_extra = 'Las horas extra no pueden ser negativas';
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

                                // if (selectedStatus?.code === true) { values.status = true }
                                // else if (selectedStatus?.code === false) { values.status = false } else { values.status = nomina.status }

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
                                datosNomina(nomina);
                            }
                        } else {
                            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Nomina no registrado', life: 5000 });
                        }
                    }}
                >
                    {({ values, errors, touched, dirty, isValid, handleChange, handleBlur }) => (
                        <Form style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <TabView style={{ flex: 1, overflow: 'auto' }}>

                                <TabPanel className='w-full' header="Header I" headerTemplate={tab1HeaderTemplate}>
                                    <Formulario>
                                        <div className="grid">
                                            {/* <FormInput
                                            col={4}
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder="Ingrese los nombres"
                                                label="Nombre del Nomina"
                                                span="*"
                                                value={values.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.name && touched.name}
                                                errorText={errors.name}
                                            />
                                            <FormInput
                                                id="last_name"
                                                name="last_name"
                                                type="text"
                                                placeholder="Ingrese los apellidos"
                                                label="Apellidos del Nomina"
                                                span="*"
                                                value={values.last_name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.last_name && touched.last_name}
                                                errorText={errors.last_name}
                                            />

                                            <FormInput
                                                id="phone"
                                                name="phone"
                                                type="number"
                                                placeholder="Ingrese el No. Telefono"
                                                label="No. Teléfono"
                                                span="*"
                                                value={values.phone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.phone && touched.phone}
                                                errorText={errors.phone}
                                            /> */}

                                            <FormDropDown
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

                                            <FormDropDown
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

                                            <FormInput
                                                col={6}
                                                id="horas_extra"
                                                name="horas_extra"
                                                type="number"
                                                placeholder="Ingrese las horas extra"
                                                label="Horas Extra"
                                                span="*"
                                                value={values.horas_extra}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.horas_extra && touched.horas_extra}
                                                errorText={errors.horas_extra}
                                            />

                                            {/* <FormDropDown
                                                id="gender"
                                                name="gender"
                                                placeholder="Seleccione un género"
                                                label="Género"
                                                value={selectedGender}
                                                optionLabel="name"
                                                emptyMessage="No se encontraron géneros"
                                                onChange={(e: DropdownChangeEvent) => { handleChange(e); setSelectedGender(e.value) }}
                                                onBlur={handleBlur}
                                                options={typeGender}

                                                span={!nomina.id ? "*" : ""}
                                                invalid={!nomina.id ? !!errors.gender && touched.gender : false}
                                                errorText={!nomina.id ? errors.gender : ""}

                                                disabled={false}
                                            />

                                            <FormDropDown
                                                id="identification_type"
                                                name="identification_type"
                                                placeholder="Seleccione un tipo"
                                                label="Tipo Identificación"
                                                value={selectedTypeIdentification}
                                                optionLabel="name"
                                                emptyMessage="No se encontraron tipos"
                                                onChange={(e: DropdownChangeEvent) => { handleChange(e); setSelectedTypeIdentification(e.value) }}
                                                onBlur={handleBlur}
                                                options={typeIdentification}

                                                span={!nomina.id ? "*" : ""}
                                                invalid={!nomina.id ? !!errors.identification_type && touched.identification_type : false}
                                                errorText={!nomina.id ? errors.identification_type : ""}

                                                disabled={false}
                                            />

                                            <FormInput
                                                id="identification"
                                                name="identification"
                                                type="number"
                                                placeholder="Ingrese el No. dentificación"
                                                label="No. Identificación"
                                                span="*"
                                                value={values.identification}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.identification && touched.identification}
                                                errorText={errors.identification}
                                            />

                                            <FormInput
                                                id="nit"
                                                name="nit"
                                                type="text"
                                                placeholder="Ingrese el No. NIT"
                                                label="No. NIT"
                                                span="*"
                                                value={values.nit}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.nit && touched.nit}
                                                errorText={errors.nit}
                                            />

                                            <FormInput
                                                id="igss"
                                                name="igss"
                                                type="number"
                                                placeholder="Ingrese el No. Igss"
                                                label="No. IGSS"
                                                span="*"
                                                value={values.igss}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.igss && touched.igss}
                                                errorText={errors.igss}
                                            />

                                            <FormInput
                                                id="birthdate"
                                                name="birthdate"
                                                type="date"
                                                placeholder=""
                                                label="Fecha Nacimiento"
                                                span="*"
                                                value={values.birthdate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.birthdate && touched.birthdate}
                                                errorText={errors.birthdate}
                                            />

                                            <FormTextArea
                                                id="address"
                                                name="address"
                                                placeholder="Ingrese la dirección"
                                                label="Dirección"
                                                span="*"
                                                value={values.address}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.address && touched.address}
                                                errorText={errors.address}
                                            /> */}
                                        </div>
                                    </Formulario>
                                </TabPanel>
                                {/* 
                                <TabPanel className='w-full' header="Header II" headerTemplate={tab2HeaderTemplate}>
                                    <Formulario>
                                        <div className="grid">
                                            <FormInput
                                                id="hire_date"
                                                name="hire_date"
                                                type="date"
                                                placeholder=""
                                                label="Fecha Contratación"
                                                span="*"
                                                value={values.hire_date}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.hire_date && touched.hire_date}
                                                errorText={errors.hire_date}
                                            />

                                            <FormDropDown
                                                id="contract_type"
                                                name="contract_type"
                                                placeholder="Seleccione un tipo"
                                                label="Tipo Contrato"
                                                value={selectedContractType}
                                                optionLabel="name"
                                                emptyMessage="No se encontraron tipos"
                                                onChange={(e: DropdownChangeEvent) => { handleChange(e); setSelectedContractType(e.value) }}
                                                onBlur={handleBlur}
                                                options={typeContract}

                                                span={!nomina.id ? "*" : ""}
                                                invalid={!nomina.id ? !!errors.contract_type && touched.contract_type : false}
                                                errorText={!nomina.id ? errors.contract_type : ""}

                                                disabled={false}
                                            />

                                            <FormDropDown
                                                id="work_day"
                                                name="work_day"
                                                placeholder="Seleccione una jornada"
                                                label="Jornada Laboral"
                                                value={selectedWorkDay}
                                                optionLabel="name"
                                                emptyMessage="No se encontraron jornadas"
                                                onChange={(e: DropdownChangeEvent) => { handleChange(e); setSelectedWorkDay(e.value) }}
                                                onBlur={handleBlur}
                                                options={typeWorkDay}

                                                span={!nomina.id ? "*" : ""}
                                                invalid={!nomina.id ? !!errors.work_day && touched.work_day : false}
                                                errorText={!nomina.id ? errors.work_day : ""}
                                                disabled={false}
                                            />

                                            <FormDropDown
                                                id="department"
                                                name="department"
                                                placeholder="Seleccione un departamento"
                                                label="Departamento"
                                                value={selectedDepartment}
                                                optionLabel="name"
                                                emptyMessage="No se encontraron departamentos"
                                                onChange={(e) => handleDepartmentChange(e, handleChange, setFieldTouched, setFieldValue)}
                                                onBlur={handleBlur}
                                                options={departments}

                                                span="*"
                                                invalid={!!errors.department && touched.department}
                                                errorText={errors.department}

                                                disabled={false}
                                            />

                                            <FormDropDown
                                                id="area"
                                                name="area"
                                                placeholder="Seleccione un area"
                                                label="Area"
                                                value={selectedArea}
                                                optionLabel="name"
                                                emptyMessage="No se encontraron areas"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    setSelectedArea(e.value);
                                                }}
                                                onBlur={handleBlur}
                                                options={areas}

                                                span="*"
                                                invalid={!!errors.area && touched.area}
                                                errorText={errors.area}
                                                disabled={!areas.length}
                                            />
                                        </div>
                                    </Formulario>
                                </TabPanel> */}

                                {/* {nomina.id ? (
                                    <TabPanel className='w-full' header="Header III" headerTemplate={tab3HeaderTemplate}>
                                        <Formulario>
                                            <div className="grid">
                                                <FormDropDown
                                                    id="status"
                                                    name="status"
                                                    placeholder="Seleccione un estado"
                                                    label="Estado"
                                                    value={selectedStatus}
                                                    optionLabel="name"
                                                    emptyMessage="No se encontraron estados"
                                                    onChange={(e: DropdownChangeEvent) => setSelectedStatus(e.value)}
                                                    onBlur={handleBlur}
                                                    options={typeStatus}

                                                    span=""
                                                    invalid={false}
                                                    errorText={""}
                                                    disabled={false}
                                                />
                                            </div>
                                            <div className="field">
                                                <label className="mb-3 mt-5 font-bold">Otros Datos</label>
                                                <div className="formgrid grid">
                                                    <div className="col-12">
                                                        <div className="card flex flex-wrap gap-2 justify-content-evenly">
                                                            <ColumnStatusBody value={nomina} />
                                                            <Chip label={`Creado el: ${new Date(nomina.createdAt).toLocaleDateString()} - ${new Date(nomina.createdAt).toLocaleTimeString()}`} className='text-md font-bold' />
                                                            <Chip label={`Ultima Actualización: ${new Date(nomina.updatedAt).toLocaleDateString()} - ${new Date(nomina.updatedAt).toLocaleTimeString()}`} className='text-md font-bold' />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Formulario>
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

            {/* //? -------------------- MODAL DIALOG (DATOS NOMINA) ------------------- */}
            <Dialog visible={datosNominaDialog} style={{ width: '70rem', height: '42rem', minWidth: '50rem', maxWidth: '90vw', minHeight: '40rem', maxHeight: '90vh' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles de la Nomina" modal className="p-fluid" onHide={hideDatosNomina} dismissableMask={false} blockScroll={true} closeOnEscape={false}
            >
                <Formik
                    initialValues={{ horas_extra: '' || nomina.horas_extra, periodo: nomina.periodo || '', employee: nomina.employee || '' }}
                    validate={values => {
                        const errors = {};

                        if (!values.periodo) {
                            errors.periodo = 'El periodo es requerido';
                        }
                        if (!values.employee) {
                            errors.employee = 'El empleado es requerido';
                        }
                        if (!values.horas_extra) {
                            errors.horas_extra = 'Las horas extra son requeridas';
                        } else if (values.horas_extra <= 0) {
                            errors.horas_extra = 'Las horas extra no pueden ser negativas';
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

                                // if (selectedStatus?.code === true) { values.status = true }
                                // else if (selectedStatus?.code === false) { values.status = false } else { values.status = nomina.status }

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
                            }
                        } else {
                            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Nomina no registrado', life: 5000 });
                        }
                    }}
                >
                    {({ values, errors, touched, dirty, isValid, handleChange, handleBlur }) => (
                        <Form style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <TabView style={{ flex: 1, overflow: 'auto' }}>

                                <TabPanel className='w-full' header="Header I" headerTemplate={tab1HeaderTemplate}>
                                    <Formulario>
                                        <div className="grid">
                                            {/* <FormInput
                                            col={4}
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder="Ingrese los nombres"
                                                label="Nombre del Nomina"
                                                span="*"
                                                value={values.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.name && touched.name}
                                                errorText={errors.name}
                                            />
                                            <FormInput
                                                id="last_name"
                                                name="last_name"
                                                type="text"
                                                placeholder="Ingrese los apellidos"
                                                label="Apellidos del Nomina"
                                                span="*"
                                                value={values.last_name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.last_name && touched.last_name}
                                                errorText={errors.last_name}
                                            />

                                            <FormInput
                                                id="phone"
                                                name="phone"
                                                type="number"
                                                placeholder="Ingrese el No. Telefono"
                                                label="No. Teléfono"
                                                span="*"
                                                value={values.phone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.phone && touched.phone}
                                                errorText={errors.phone}
                                            /> */}

                                            <FormDropDown
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

                                            <FormDropDown
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

                                            <FormInput
                                                col={6}
                                                id="horas_extra"
                                                name="horas_extra"
                                                type="number"
                                                placeholder="Ingrese las horas extra"
                                                label="Horas Extra"
                                                span="*"
                                                value={values.horas_extra}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.horas_extra && touched.horas_extra}
                                                errorText={errors.horas_extra}
                                            />

                                            {/* <FormDropDown
                                                id="gender"
                                                name="gender"
                                                placeholder="Seleccione un género"
                                                label="Género"
                                                value={selectedGender}
                                                optionLabel="name"
                                                emptyMessage="No se encontraron géneros"
                                                onChange={(e: DropdownChangeEvent) => { handleChange(e); setSelectedGender(e.value) }}
                                                onBlur={handleBlur}
                                                options={typeGender}

                                                span={!nomina.id ? "*" : ""}
                                                invalid={!nomina.id ? !!errors.gender && touched.gender : false}
                                                errorText={!nomina.id ? errors.gender : ""}

                                                disabled={false}
                                            />

                                            <FormDropDown
                                                id="identification_type"
                                                name="identification_type"
                                                placeholder="Seleccione un tipo"
                                                label="Tipo Identificación"
                                                value={selectedTypeIdentification}
                                                optionLabel="name"
                                                emptyMessage="No se encontraron tipos"
                                                onChange={(e: DropdownChangeEvent) => { handleChange(e); setSelectedTypeIdentification(e.value) }}
                                                onBlur={handleBlur}
                                                options={typeIdentification}

                                                span={!nomina.id ? "*" : ""}
                                                invalid={!nomina.id ? !!errors.identification_type && touched.identification_type : false}
                                                errorText={!nomina.id ? errors.identification_type : ""}

                                                disabled={false}
                                            />

                                            <FormInput
                                                id="identification"
                                                name="identification"
                                                type="number"
                                                placeholder="Ingrese el No. dentificación"
                                                label="No. Identificación"
                                                span="*"
                                                value={values.identification}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.identification && touched.identification}
                                                errorText={errors.identification}
                                            />

                                            <FormInput
                                                id="nit"
                                                name="nit"
                                                type="text"
                                                placeholder="Ingrese el No. NIT"
                                                label="No. NIT"
                                                span="*"
                                                value={values.nit}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.nit && touched.nit}
                                                errorText={errors.nit}
                                            />

                                            <FormInput
                                                id="igss"
                                                name="igss"
                                                type="number"
                                                placeholder="Ingrese el No. Igss"
                                                label="No. IGSS"
                                                span="*"
                                                value={values.igss}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.igss && touched.igss}
                                                errorText={errors.igss}
                                            />

                                            <FormInput
                                                id="birthdate"
                                                name="birthdate"
                                                type="date"
                                                placeholder=""
                                                label="Fecha Nacimiento"
                                                span="*"
                                                value={values.birthdate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.birthdate && touched.birthdate}
                                                errorText={errors.birthdate}
                                            />

                                            <FormTextArea
                                                id="address"
                                                name="address"
                                                placeholder="Ingrese la dirección"
                                                label="Dirección"
                                                span="*"
                                                value={values.address}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.address && touched.address}
                                                errorText={errors.address}
                                            /> */}
                                        </div>
                                    </Formulario>
                                </TabPanel>
                                {/* 
                                <TabPanel className='w-full' header="Header II" headerTemplate={tab2HeaderTemplate}>
                                    <Formulario>
                                        <div className="grid">
                                            <FormInput
                                                id="hire_date"
                                                name="hire_date"
                                                type="date"
                                                placeholder=""
                                                label="Fecha Contratación"
                                                span="*"
                                                value={values.hire_date}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.hire_date && touched.hire_date}
                                                errorText={errors.hire_date}
                                            />

                                            <FormDropDown
                                                id="contract_type"
                                                name="contract_type"
                                                placeholder="Seleccione un tipo"
                                                label="Tipo Contrato"
                                                value={selectedContractType}
                                                optionLabel="name"
                                                emptyMessage="No se encontraron tipos"
                                                onChange={(e: DropdownChangeEvent) => { handleChange(e); setSelectedContractType(e.value) }}
                                                onBlur={handleBlur}
                                                options={typeContract}

                                                span={!nomina.id ? "*" : ""}
                                                invalid={!nomina.id ? !!errors.contract_type && touched.contract_type : false}
                                                errorText={!nomina.id ? errors.contract_type : ""}

                                                disabled={false}
                                            />

                                            <FormDropDown
                                                id="work_day"
                                                name="work_day"
                                                placeholder="Seleccione una jornada"
                                                label="Jornada Laboral"
                                                value={selectedWorkDay}
                                                optionLabel="name"
                                                emptyMessage="No se encontraron jornadas"
                                                onChange={(e: DropdownChangeEvent) => { handleChange(e); setSelectedWorkDay(e.value) }}
                                                onBlur={handleBlur}
                                                options={typeWorkDay}

                                                span={!nomina.id ? "*" : ""}
                                                invalid={!nomina.id ? !!errors.work_day && touched.work_day : false}
                                                errorText={!nomina.id ? errors.work_day : ""}
                                                disabled={false}
                                            />

                                            <FormDropDown
                                                id="department"
                                                name="department"
                                                placeholder="Seleccione un departamento"
                                                label="Departamento"
                                                value={selectedDepartment}
                                                optionLabel="name"
                                                emptyMessage="No se encontraron departamentos"
                                                onChange={(e) => handleDepartmentChange(e, handleChange, setFieldTouched, setFieldValue)}
                                                onBlur={handleBlur}
                                                options={departments}

                                                span="*"
                                                invalid={!!errors.department && touched.department}
                                                errorText={errors.department}

                                                disabled={false}
                                            />

                                            <FormDropDown
                                                id="area"
                                                name="area"
                                                placeholder="Seleccione un area"
                                                label="Area"
                                                value={selectedArea}
                                                optionLabel="name"
                                                emptyMessage="No se encontraron areas"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    setSelectedArea(e.value);
                                                }}
                                                onBlur={handleBlur}
                                                options={areas}

                                                span="*"
                                                invalid={!!errors.area && touched.area}
                                                errorText={errors.area}
                                                disabled={!areas.length}
                                            />
                                        </div>
                                    </Formulario>
                                </TabPanel> */}

                                {/* {nomina.id ? (
                                    <TabPanel className='w-full' header="Header III" headerTemplate={tab3HeaderTemplate}>
                                        <Formulario>
                                            <div className="grid">
                                                <FormDropDown
                                                    id="status"
                                                    name="status"
                                                    placeholder="Seleccione un estado"
                                                    label="Estado"
                                                    value={selectedStatus}
                                                    optionLabel="name"
                                                    emptyMessage="No se encontraron estados"
                                                    onChange={(e: DropdownChangeEvent) => setSelectedStatus(e.value)}
                                                    onBlur={handleBlur}
                                                    options={typeStatus}

                                                    span=""
                                                    invalid={false}
                                                    errorText={""}
                                                    disabled={false}
                                                />
                                            </div>
                                            <div className="field">
                                                <label className="mb-3 mt-5 font-bold">Otros Datos</label>
                                                <div className="formgrid grid">
                                                    <div className="col-12">
                                                        <div className="card flex flex-wrap gap-2 justify-content-evenly">
                                                            <ColumnStatusBody value={nomina} />
                                                            <Chip label={`Creado el: ${new Date(nomina.createdAt).toLocaleDateString()} - ${new Date(nomina.createdAt).toLocaleTimeString()}`} className='text-md font-bold' />
                                                            <Chip label={`Ultima Actualización: ${new Date(nomina.updatedAt).toLocaleDateString()} - ${new Date(nomina.updatedAt).toLocaleTimeString()}`} className='text-md font-bold' />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Formulario>
                                    </TabPanel>
                                ) : (null)} */}
                            </TabView>

                            <div className="flex mb-0 pt-3">
                                <Button label="Cancelar" type='button' icon="pi pi-times" outlined
                                    onClick={hideDatosNomina} className='mx-1' />
                                <Button label="Guardar Nomina" icon="pi pi-check" type='submit' className='mx-1'
                                    disabled={nomina.id ? false : !(isValid && dirty)}
                                    />
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            {/* //? -------------------- MODAL DIALOG (ONLY READ) ------------------- */}
            <Dialog visible={seeNominaDialog} style={{ width: '62rem', minWidth: '30rem', minHeight: '30rem', maxWidth: '90vw', maxHeight: '90vh' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Todos los datos del empleado" modal className='p-fluid' footer={seeDialogFooter} onHide={hideSeeDialog}>
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

                                                        <label className='text-md capitalize'> {nomina.employee.work_day}</label>


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
                                                                    <TemplatesBody.ColumnOnlyDateBodyText value={nomina.periodo.fecha_pago} className={''} />
                                                                </label>
                                                                <label className='text-md font-bold text-orange-700'>
                                                                    <TemplatesBody.ColumnOnlyDateBodyText value={nomina.periodo.periodo_liquidacion_inicio} className={''} />
                                                                    &nbsp;&nbsp;al&nbsp;&nbsp;
                                                                    <TemplatesBody.ColumnOnlyDateBodyText value={nomina.periodo.periodo_liquidacion_final} className={''} /></label>
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
                                                                <label className='text-md capitalize'>Q.{nomina.bonificacion}</label>
                                                            </div>

                                                            <div className="flex justify-content-between">
                                                                <label className='text-md capitalize'> NO. HORAS EXTRA</label>
                                                                <label className='text-md capitalize'>Q.{nomina.horas_extra}</label>
                                                            </div>

                                                            <div className="flex justify-content-between">
                                                                <label className='text-md capitalize'> VACACIONES PAGADAS</label>
                                                                <label className='text-md capitalize'>Q.{nomina.vacaciones_pagadas}</label>
                                                            </div>

                                                            <div className="flex justify-content-between">
                                                                <label className='text-md capitalize'> AGUINALDO</label>
                                                                <label className='text-md capitalize'>Q.{nomina.aguinaldo}</label>
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
                                                        <label className='text-md capitalize'> <b>USUARIO QUE REALIZO LA ACCION:</b> Aqui va el usuario que hizo la accion</label>

                                                        <label className='text-md capitalize'> <b>USUARIO QUE ACTUALIZO LOS DATOS:</b> Aqui va el usuario que hizo la accion</label>

                                                        <Divider align="center" />

                                                        <label className='text-md'> <b>CREADO EL:</b>
                                                            <TemplatesBody.ColumnDateBody value={nomina.createdAt} />
                                                        </label>


                                                        <label className='text-md'> <b>ULTIMA ACTUALIZACION:</b>
                                                            <TemplatesBody.ColumnDateBody value={nomina.createdAt} />
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
            <DeleteModal
                visible={deleteNominaDialog}
                header="Confirmar"
                data={nomina}
                message1="¿Estas seguro que deseas eliminar la nomina del empleado:"
                message1Bold={nomina.employee.fullName}
                message2="para la fecha de pago:"
                message2Bold={<TemplatesBody.ColumnOnlyDateBodyText value={nomina.fecha_pago} className={''} />}
                footer={deleteNominaDialogFooter}
                onHide={hideDeleteNominaDialog}
            ></DeleteModal>
        </div>
    );
}