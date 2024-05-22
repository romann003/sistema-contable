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

import { ColumnChipBody, ColumnDateBody, ColumnOnlyDateBody, ColumnStatusBody, ColumnTextBody } from '../../layout/components/ColumnBody.js';
import DataTableCrud from '../../layout/components/DataTableCrud.js';
import { FormDropDown, FormInput, FormTextArea } from '../../layout/components/FormComponent.js';
import { Formulario } from '../../layout/elements/Formularios.js';
import { Nomina, Status, emptyNomina, typeStatus } from '../../layout/elements/InitialData';

dayjs.extend(utc);

const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'employee.fullName': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'employee.identification': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'employee.department.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'employee.area.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'employee.area.salary': { value: null, matchMode: FilterMatchMode.EQUALS },
    fecha_pago: { value: null, matchMode: FilterMatchMode.EQUALS },
}

export default function NominaPage() {
    const items: MenuItem[] = [{ template: () => <Link to=""><span className="text-primary font-semibold">Nominas</span></Link> }];
    const home: MenuItem = {
        template: () => <Link to="/dashboard"><span className="text-primary font-semibold">Inicio</span></Link>
    }

    //? -------------------- CONTEXT API -------------------
    const { departments, getActiveDepartments, setDepartments } = useDepartments();
    const { areas, getAreasById, setAreas } = useAreas();
    const { nominas, getNominas, createNomina, deleteNomina, updateNomina } = useNominas();

    //? -------------------- STATES -------------------
    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);
    const [estados, setEstados] = useState<string[]>([]);
    const [nomina, setNomina] = useState<Nomina>(emptyNomina);
    const toast = useRef<Toast>(null);
    //? -------------------- DIALOG STATES -------------------
    const [nominaDialog, setNominaDialog] = useState<boolean>(false);
    const [seeNominaDialog, setSeeNominaDialog] = useState<boolean>(false);
    const [deleteNominaDialog, setDeleteNominaDialog] = useState<boolean>(false);
    //? -------------------- DATATABLE STATES -------------------
    const dt = useRef<DataTable<Nomina[]>>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
    const [loading, setLoading] = useState<boolean>(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    //? -------------------- DATATABLE COLUMN TEMPLATES -------------------
    const nameBodyTemplate = (rowData: Nomina) => {
        return <ColumnTextBody value={rowData.employee.fullName} />
    };

    const identificationBodyTemplate = (rowData: Nomina) => {
        return <ColumnTextBody value={rowData.employee.identification} />
    };

    const departmentBodyTemplate = (rowData: Nomina) => {
        return <ColumnChipBody value={rowData.employee.department.name} />
    };

    const areaBodyTemplate = (rowData: Nomina) => {
        return <ColumnChipBody value={rowData.employee.area.name} />
    };

    const salaryBodyTemplate = (rowData: Nomina) => {
        return <ColumnTextBody value={rowData.employee.area.salary} />
    };

    const fechaPagoBodyTemplate = (rowData: Nomina) => {
        return <ColumnOnlyDateBody value={rowData.fecha_pago} />
    };


    // const phoneBodyTemplate = (rowData: Nomina) => {
    //     return <ColumnTextBody value={rowData.phone} />
    // };

    // const nitBodyTemplate = (rowData: Nomina) => {
    //     return <ColumnTextBody value={rowData.nit} />
    // };

    // const igssBodyTemplate = (rowData: Nomina) => {
    //     return <ColumnTextBody value={rowData.igss} />
    // };

    const statusBodyTemplate = (rowData: Nomina) => {
        return <ColumnStatusBody value={rowData} />
    };

    const createdAtBodyTemplate = (rowData: Nomina) => {
        return <ColumnDateBody value={rowData.createdAt} />
    };

    const updatedAtBodyTemplate = (rowData: Nomina) => {
        return <ColumnDateBody value={rowData.updatedAt} />
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
        getActiveDepartments();
        setLoading(false);
    }, [nomina]);

    //? -------------------- HANDLE CHANGE -------------------
    const handleDepartmentChange = (e, handleChange, setFieldTouched, setFieldValue) => {
        const department = e.value;
        setSelectedDepartment(department);
        setSelectedArea(null);
        handleChange(e);
        if (department) {
            getAreasById(department.id);
        } else {
            setSelectedArea(null);
            setAreas([]);
        }

        setFieldTouched('area', true);
        setFieldValue('area', '', true);
    };

    const handleCancel = (resetForm) => {
        setSelectedDepartment(null);
        setSelectedArea(null);
        setAreas([]);
        resetForm();
        hideDialog();
    };

    const resetFormOnOpen = () => {
        setSelectedDepartment(nomina.department || null);
        setSelectedArea(nomina.area || null);
        if (nomina.department) {
            getAreasById(nomina.department.id);
        } else {
            setAreas([]);
        }
    };


    //? -------------------- MODAL DIALOGS -------------------
    const openNew = () => {
        setNomina(emptyNomina);
        setNominaDialog(true);
        // setDepartments([]);
        resetFormOnOpen();
    };

    const hideDialog = () => {
        setEstados([]);
        setDepartments([]);
        setSelectedStatus(null);
        setNominaDialog(false);
    };

    const hideSeeDialog = () => {
        setEstados([]);
        setSelectedStatus(null);
        setSeeNominaDialog(false);
    };

    const editNomina = (nomina) => {
        setNomina({ ...nomina });
        setNominaDialog(true);

        // setDepartments([]);
        // resetFormOnOpen();
    };

    const seeNomina = (nomina: Nomina) => {
        setNomina({ ...nomina });
        setSeeNominaDialog(true);
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
                    globalFilterFields={['employee.fullName', 'employee.identification', 'employee.department.name', 'employee.area.name', 'employee.area.salary', 'fecha_pago']}
                    //? -------------------- COLUMNS -------------------
                    columns={[
                        { field: 'employee.fullName', header: 'Empleado', body: nameBodyTemplate, dataType: 'text', filter: true },
                        { field: 'employee.identification', header: 'No. Identificación', body: identificationBodyTemplate, dataType: 'text', filter: true},
                        { field: 'employee.department.name', header: 'Departamento', body: departmentBodyTemplate, dataType: 'text', filter: true },
                        { field: 'employee.area.name', header: 'Area (Cargo)', body: areaBodyTemplate, dataType: 'text', filter: true },
                        { field: 'employee.area.salary', header: 'Salario Base', body: salaryBodyTemplate, dataType: 'numeric', filter: true },
                        { field: 'fecha_pago', header: 'Fecha de Pago', body: fechaPagoBodyTemplate, dataType: 'date', filter: true },
                        { field: 'status', header: 'Estado', body: statusBodyTemplate, dataType: 'boolean', filter: false },
                        { field: 'createdAt', header: 'Creado el', body: createdAtBodyTemplate, dataType: 'date', filter: false },
                        { field: 'updatedAt', header: 'Ultima Actualización', body: updatedAtBodyTemplate, filter: false, dataType: 'date' },
                    ]}
                    size='12rem'
                    actionBodyTemplate={actionBodyTemplate}
                />
            </div>

            {/* //? -------------------- MODAL DIALOG (CREATE AND UPDATE) ------------------- */}
            <Dialog visible={nominaDialog} style={{ width: '70rem', height: '42rem', minWidth: '50rem', maxWidth: '90vw', minHeight: '40rem', maxHeight: '90vh' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles del Nomina" modal className="p-fluid" onHide={hideDialog} dismissableMask={false} blockScroll={true} closeOnEscape={false}
            >
                <Formik
                    initialValues={{ name: '' || nomina.name, last_name: '' || nomina.last_name, phone: '' || nomina.phone, country: '' || nomina.country, identification_type: '' || nomina.identification_type, identification: '' || nomina.identification, nit: '' || nomina.nit, igss: '' || nomina.igss, gender: '' || nomina.gender, birthdate: '' || nomina.birthdate, address: '' || nomina.address, hire_date: '' || nomina.hire_date, contract_type: '' || nomina.contract_type, work_day: '' || nomina.work_day, department: nomina.department || '', area: nomina.area || '' }}
                    validate={values => {
                        const errors = {};
                        if (!values.name) {
                            errors.name = 'Los nombres son requeridos';
                        } else if (values.name.length < 3) {
                            errors.name = 'El nombre debe tener al menos 3 caracteres';
                        } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.name)) {
                            errors.name = 'El nombre solo puede contener letras';
                        }

                        if (!values.last_name) {
                            errors.last_name = 'Los apellidos son requeridos';
                        } else if (values.last_name.length < 3) {
                            errors.last_name = 'Los apellidos deben tener al menos 3 caracteres';
                        } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.last_name)) {
                            errors.last_name = 'Los apellidos solo pueden contener letras';
                        }

                        if (!values.phone) {
                            errors.phone = 'El numero de telefono es requerido';
                        } else if (values.phone <= 0) {
                            errors.phone = 'El numero de telefono no puede ser negativo';
                        } else if (values.phone.length < 8) {
                            errors.phone = 'El numero de telefono debe tener al menos 8 digitos';
                        } else if (!/^\d{8}$/.test(values.phone)) {
                            errors.phone = 'El numero de telefono es invalido';
                        }

                        if (!values.identification) {
                            errors.identification = 'El numero de identificacion es requerido';
                        } else if (values.identification.length < 3) {
                            errors.identification = 'El numero de identificacion debe tener al menos 3 caracteres';
                        } else if (values.identification <= 0) {
                            errors.identification = 'El numero de identificacion no puede ser negativo';
                        } else if (!/^\d{9}$/.test(values.identification)) {
                            errors.identification = 'Tu numero de identificacion solo puede contener 9 caracteres';
                        }

                        if (!values.nit) {
                            errors.nit = 'El nit es requerido';
                        } else if (values.nit.length < 3) {
                            errors.nit = 'El nit debe tener al menos 8 caracteres';
                        } else if (!/^\d{8}-[0-9a-zA-Z]$/.test(values.nit)) {
                            errors.nit = 'El nit solo puede contener 8 numeros, un guion y una letra';
                        }

                        if (!values.igss) {
                            errors.igss = 'El numero de igss es requerido';
                        } else if (values.igss.length < 3) {
                            errors.igss = 'El numero de igss debe tener al menos 3 caracteres';
                        } else if (!/^\d{6}$/.test(values.igss)) {
                            errors.igss = 'Tu numero de igss solo puede contener 6 caracteres';
                        }

                        if (!values.address) {
                            errors.address = 'La direccion es requerida';
                        } else if (values.address.length < 3) {
                            errors.address = 'La direccion debe tener al menos 3 caracteres';
                        }
                        else if (!/^[a-zA-Z0-9.,\- áéíóúÁÉÍÓÚ]+$/.test(values.address)) {
                            errors.address = 'La direccion no es valida';
                        }

                        if (!values.department) {
                            errors.department = 'El departamento es requerido';
                        }
                        if (!values.area) {
                            errors.area = 'El area es requerida';
                        }

                        if (!nomina.id) {
                            if (!values.country) {
                                errors.country = 'El pais es requerido';
                            }
                            if (!values.identification_type) {
                                errors.identification_type = 'El tipo de identificacion es requerido';
                            }
                            if (!values.gender) {
                                errors.gender = 'El genero es requerido';
                            }
                            if (!values.birthdate) {
                                errors.birthdate = 'La fecha de nacimiento es requerida';
                            }
                            if (!values.hire_date) {
                                errors.hire_date = 'La fecha de contratación es requerida';
                            }
                            if (!values.contract_type) {
                                errors.contract_type = 'El tipo de contrato es requerido';
                            }
                            if (!values.work_day) {
                                errors.work_day = 'Debes de agregar una jornada laboral';
                            }
                        }
                        return errors;
                    }}
                    onSubmit={(values, { resetForm }) => {
                        if (values) {
                            // values.birthdate = dayjs.utc(values.birthdate).format()
                            // values.hire_date = dayjs.utc(values.hire_date).format()
                            if (nomina.id) {
                                if (selectedCountry?.code) { values.country = selectedCountry.code }
                                else { values.country = nomina.country }

                                if (selectedTypeIdentification?.code) { values.identification_type = selectedTypeIdentification.code }
                                else { values.identification_type = nomina.identification_type }

                                if (selectedGender?.code) { values.gender = selectedGender.code }
                                else { values.gender = nomina.gender }

                                if (selectedContractType?.code) { values.contract_type = selectedContractType.code }
                                else { values.contract_type = nomina.contract_type }

                                if (selectedWorkDay?.code) { values.work_day = selectedWorkDay.code }
                                else { values.work_day = nomina.work_day }

                                if (selectedStatus?.code === true) { values.status = true }
                                else if (selectedStatus?.code === false) { values.status = false } else { values.status = nomina.status }

                                if (values.department !== "") { values.departmentId = values.department.id } else { values.departmentId = nomina.departmentId }

                                if (values.area !== "") { values.areaId = values.area.id } else { values.areaId = nomina.areaId }

                                updateNomina(nomina.id, values);
                                setNominaDialog(false);
                                setNomina(emptyNomina);
                                resetForm();
                            } else {
                                values.country = selectedCountry.code
                                values.identification_type = selectedTypeIdentification.code
                                values.gender = selectedGender.code
                                values.contract_type = selectedContractType.code
                                values.work_day = selectedWorkDay.code

                                values.departmentId = values.department.id
                                values.areaId = values.area.id

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
                    {({ values, errors, touched, dirty, isValid, handleChange, handleBlur, resetForm, setFieldTouched, setFieldValue }) => (
                        <Form style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <TabView style={{ flex: 1, overflow: 'auto' }}>

                                <TabPanel className='w-full' header="Header I" headerTemplate={tab1HeaderTemplate}>
                                    <Formulario>
                                        <div className="grid">
                                            <FormInput
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
                                            />

                                            <FormDropDown
                                                id="country"
                                                name="country"
                                                placeholder="Seleccione un país"
                                                label="País"
                                                value={selectedCountry}
                                                optionLabel="name"
                                                emptyMessage="No se encontraron países"
                                                onChange={(e: DropdownChangeEvent) => { handleChange(e); setSelectedCountry(e.value) }}
                                                onBlur={handleBlur}
                                                options={typeCountry}

                                                span={!nomina.id ? "*" : ""}
                                                invalid={!nomina.id ? !!errors.country && touched.country : false}
                                                errorText={!nomina.id ? errors.country : ""}

                                                disabled={false}
                                            />

                                            <FormDropDown
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
                                            />
                                        </div>
                                    </Formulario>
                                </TabPanel>

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
                                </TabPanel>

                                {nomina.id ? (
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
                                ) : (null)}
                            </TabView>

                            <div className="flex mb-0 pt-3">
                                <Button label="Cancelar" type='button' icon="pi pi-times" outlined
                                    onClick={() => handleCancel(resetForm)} className='mx-1' />
                                <Button label="Guardar Nomina" icon="pi pi-check" type='submit' className='mx-1' disabled={nomina.id ? false : !(isValid && dirty)} />
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
                                                    <div className="flex flex-wrap gap-3 justify-content-evenly">
                                                        <Chip label={`EMPLEADO: ${nomina.name} ${nomina.last_name}`} className='text-lg font-bold uppercase' />
                                                        <Chip label={`No. Telefono: ${nomina.phone}`} className='text-lg font-bold uppercase' />
                                                        <Chip label={`Tipo Identificacion: ${nomina.identification_type}`} className='text-lg font-bold uppercase' />
                                                        <Chip label={`No. Identificacion: ${nomina.identification}`} className='text-lg font-bold uppercase' />
                                                        <Chip label={`No. NIT: ${nomina.nit}`} className='text-lg font-bold uppercase' />
                                                        <Chip label={`No. IGSS: ${nomina.igss}`} className='text-lg font-bold uppercase' />
                                                    </div>
                                                    <Divider align="center" className='my-5'>
                                                        <span className="p-tag">Otros Datos</span>
                                                    </Divider>
                                                    <div className="flex flex-wrap gap-3 justify-content-evenly">
                                                        <Chip label={`Pais: ${nomina.country}`} className='text-lg font-bold uppercase' />
                                                        <Chip label={`Genero: ${nomina.gender}`} className='text-lg font-semibold uppercase' />
                                                        <Chip label={`Fecha Cumpleaños: 
                                                    ${dayjs(nomina.birthdate).utc().format("DD/MM/YYYY")}`} className='text-lg font-semibold uppercase' />
                                                        <Chip label={`DIRECCIÓN: ${nomina.address}`} className='text-lg font-semibold' />

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel className='w-full' header="Header II" headerTemplate={tab2HeaderTemplate}>
                                        <div className="field mt-5 mb-3">
                                            <div className="formgrid grid">
                                                <div className="col-12">
                                                    <div className=" flex flex-wrap gap-3 justify-content-evenly">
                                                        <Chip label={`Fecha Contratación: ${dayjs(nomina.hire_date).utc().format("DD/MM/YYYY")}`} className='text-lg font-bold uppercase' />
                                                        {/* <Chip label={`Fecha Contratación: ${new Date(nomina.hire_date).toLocaleDateString()}`} className='text-lg font-bold uppercase' /> */}

                                                        <Chip label={`Tipo Contrato: ${nomina.contract_type}`} className='text-lg font-bold uppercase' />
                                                        <Chip label={`Jornada laboral ordinaria: ${nomina.work_day}`} className='text-lg font-bold uppercase' />
                                                        <Chip label={`Salario Base: ${nomina.area?.salary}`} className='text-lg font-bold uppercase' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel className='w-full' header="Header III" headerTemplate={tab3HeaderTemplate}>
                                        <div className="field mt-5 mb-3">
                                            <div className="formgrid grid">
                                                <div className="col-12">
                                                    <div className=" flex flex-wrap gap-3 justify-content-evenly">
                                                        <Chip label={`DEPARTAMENTO - ${nomina.department?.name}`} className="text-lg font-bold uppercase" />
                                                        <Chip label={`CARGO(PUESTO) - ${nomina.area?.name}`} className="text-lg font-bold uppercase" />
                                                        <Chip label={`CREADO EL: ${new Date(nomina.createdAt).toLocaleDateString()} - ${new Date(nomina.createdAt).toLocaleTimeString()}`} className='text-lg font-bold' />
                                                        <Chip label={`ULTIMA ACTUALIZACION: ${new Date(nomina.updatedAt).toLocaleDateString()} - ${new Date(nomina.updatedAt).toLocaleTimeString()}`} className='text-lg font-bold' />
                                                        <ColumnStatusBody value={nomina} />
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
            <Dialog visible={deleteNominaDialog} style={{ width: '32rem', minWidth: '32rem', maxWidth: '40rem', minHeight: '16rem', maxHeight: '16rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal className='p-fluid' footer={deleteNominaDialogFooter} onHide={hideDeleteNominaDialog}>
                <div className="confirmation-content flex">
                    <i className="pi pi-exclamation-triangle mr-4 mb-2" style={{ fontSize: '2rem' }} />
                    {nomina && (
                        <span>
                            ¿Estas seguro que deseas eliminar al empleado: <b className="font-bold">{nomina.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}