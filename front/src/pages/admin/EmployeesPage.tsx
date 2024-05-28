import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Chip } from 'primereact/chip';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';
import { DataTableFilterMeta } from 'primereact/datatable';
import { Formik, Form } from 'formik';
import { TabView, TabPanel, TabPanelHeaderTemplateOptions } from 'primereact/tabview';
import { Divider } from 'primereact/divider';
import { useDepartments } from '../../api/context/DepartmentContext';
import { useAreas } from '../../api/context/AreaContext';
import { useEmployees } from '../../api/context/EmployeeContext';
import { BreadCrumb } from 'primereact/breadcrumb';
import { MenuItem } from 'primereact/menuitem';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc);
import { Formulario } from '../../layout/elements/Formularios.js';
import {
    emptyEmployee, typeStatus, typeGender, typeCountry, typeIdentification, typeContract, typeWorkDay,
    Status, Country, Gender, Identification_type, Contract_type, Work_day, Employee
} from '../../layout/elements/InitialData';
import { ColumnChipBody, ColumnDateBody, ColumnOnlyDateBody, ColumnStatusBody, ColumnTextBody } from '../../layout/components/ColumnBody.js';
import DataTableCrud from '../../layout/components/DataTableCrud.js';
import * as fI from '../../layout/components/FormComponent.js';
import { DeleteModal } from '../../layout/components/Modals.js';


const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    fullName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phone: { value: null, matchMode: FilterMatchMode.EQUALS },
    identification: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nit: { value: null, matchMode: FilterMatchMode.CONTAINS },
    igss: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'department.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'area.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
    birthdate: { value: null, matchMode: FilterMatchMode.CONTAINS },
}

export default function EmployeesPage() {

    const items: MenuItem[] = [{ template: () => <Link to=""><span className="text-primary font-semibold">Empleados</span></Link> }];
    const home: MenuItem = {
        template: () => <Link to="/dashboard"><span className="text-primary font-semibold">Inicio</span></Link>
    }


    //? -------------------- CONTEXT API -------------------
    const { departments, getActiveDepartments, setDepartments } = useDepartments();
    const { areas, getAreasById, setAreas } = useAreas();
    const { employees, getEmployees, createEmployee, deleteEmployee, updateEmployee } = useEmployees();

    //? -------------------- STATES -------------------
    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
    const [selectedTypeIdentification, setSelectedTypeIdentification] = useState<Identification_type | null>(null);
    const [selectedContractType, setSelectedContractType] = useState<Contract_type | null>(null);
    const [selectedWorkDay, setSelectedWorkDay] = useState<Work_day | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);
    const [estados, setEstados] = useState<string[]>([]);
    const [employee, setEmployee] = useState<Employee>(emptyEmployee);
    const toast = useRef<Toast>(null);
    //? -------------------- DIALOG STATES -------------------
    const [employeeDialog, setEmployeeDialog] = useState<boolean>(false);
    const [seeEmployeeDialog, setSeeEmployeeDialog] = useState<boolean>(false);
    const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState<boolean>(false);
    //? -------------------- DATATABLE STATES -------------------
    const dt = useRef<DataTable<Employee[]>>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
    const [loading, setLoading] = useState<boolean>(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    //? -------------------- DATATABLE COLUMN TEMPLATES -------------------
    const fullNameBodyTemplate = (rowData: Employee) => {
        return <ColumnTextBody value={rowData.fullName} />
    };

    const phoneBodyTemplate = (rowData: Employee) => {
        return <ColumnTextBody value={rowData.phone} />
    };

    const identificationBodyTemplate = (rowData: Employee) => {
        return <ColumnTextBody value={rowData.identification} />
    };

    const nitBodyTemplate = (rowData: Employee) => {
        return <ColumnTextBody value={rowData.nit} />
    };

    const igssBodyTemplate = (rowData: Employee) => {
        return <ColumnTextBody value={rowData.igss} />
    };

    const departmentBodyTemplate = (rowData: Employee) => {
        return <ColumnChipBody value={rowData.department.name} />
    };

    const areaBodyTemplate = (rowData: Employee) => {
        return <ColumnChipBody value={rowData.area.name} />
    };

    const birthdateBodyTemplate = (rowData: Employee) => {
        return <ColumnOnlyDateBody value={rowData.birthdate} />
    }

    const statusBodyTemplate = (rowData: Employee) => {
        return <ColumnStatusBody value={rowData} />
    };

    const createdAtBodyTemplate = (rowData: Employee) => {
        return <ColumnDateBody value={rowData.createdAt} />
    };

    const updatedAtBodyTemplate = (rowData: Employee) => {
        return <ColumnDateBody value={rowData.updatedAt} />
    };

    const actionBodyTemplate = (rowData: Employee) => {
        return (
            <React.Fragment>
                <div className="flex align-align-content-center justify-content-evenly">
                    <Button icon="pi pi-eye" rounded outlined severity='help' onClick={() => seeEmployee(rowData)} />
                    <Button icon="pi pi-pencil" rounded outlined onClick={() => editEmployee(rowData)} />
                    <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteEmployee(rowData)} />

                </div>
            </React.Fragment>
        );
    };

    //? -------------------- DTATABLE MAIN ACTIONS -------------------
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Agregar Empleado" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    //? -------------------- DATA LOADING -------------------
    useEffect(() => {
        getEmployees();
        getActiveDepartments();
        setLoading(false);
    }, [employee]);

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
        setSelectedDepartment(employee.department || null);
        setSelectedArea(employee.area || null);
        if (employee.department) {
            getAreasById(employee.department.id);
        } else {
            setAreas([]);
        }
    };

    //? -------------------- MODAL DIALOGS -------------------
    const openNew = () => {
        setEmployee(emptyEmployee);
        setEmployeeDialog(true);
        // setDepartments([]);
        resetFormOnOpen();
    };

    const hideDialog = () => {
        setEstados([]);
        setDepartments([]);
        setSelectedStatus(null);
        setSelectedCountry(null);
        setSelectedGender(null);
        setSelectedTypeIdentification(null);
        setSelectedContractType(null);
        setSelectedWorkDay(null);
        setEmployeeDialog(false);
    };

    const hideSeeDialog = () => {
        setEstados([]);
        setSelectedStatus(null);
        setSelectedCountry(null);
        setSelectedGender(null);
        setSelectedTypeIdentification(null);
        setSelectedContractType(null);
        setSelectedWorkDay(null);
        setSeeEmployeeDialog(false);
    };

    const editEmployee = (employee) => {
        setEmployee({ ...employee });
        setEmployeeDialog(true);

        // setDepartments([]);
        // resetFormOnOpen();
    };

    const seeEmployee = (employee: Employee) => {
        setEmployee({ ...employee });
        setSeeEmployeeDialog(true);
    };

    const hideDeleteEmployeeDialog = () => {
        setDeleteEmployeeDialog(false);
    };

    const confirmDeleteEmployee = (employee: Employee) => {
        setEmployee(employee);
        setDeleteEmployeeDialog(true);
    };

    const deleteEmployeeModal = () => {
        deleteEmployee(employee.id);
        setDeleteEmployeeDialog(false);
        setEmployee(emptyEmployee);
    };

    //? -------------------- MODAL BUTTONS -------------------
    const deleteEmployeeDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteEmployeeDialog} />
            <Button label="Si, eliminar" icon="pi pi-check" severity="danger" onClick={deleteEmployeeModal} />
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
                <h3>Empleados</h3>
                <BreadCrumb model={items} home={home} />
                <Toolbar className="my-4" left={leftToolbarTemplate}></Toolbar>

                {/* //? -------------------- DATATABLE ------------------- */}
                <DataTableCrud
                    //? -------------------- HEADER -------------------
                    message="empleados"
                    headerMessage="Lista de Empleados"
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
                    size='15rem'
                    actionBodyTemplate={actionBodyTemplate}
                />
            </div>

            {/* //? -------------------- MODAL DIALOG (CREATE AND UPDATE) ------------------- */}
            <Dialog visible={employeeDialog} style={{ width: '70rem', height: '42rem', minWidth: '50rem', maxWidth: '90vw', minHeight: '40rem', maxHeight: '90vh' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles del Empleado" modal className="p-fluid" onHide={hideDialog} dismissableMask={false} blockScroll={true} closeOnEscape={false}
            >
                <Formik
                    initialValues={{ name: '' || employee.name, last_name: '' || employee.last_name, phone: '' || employee.phone, country: '' || employee.country, identification_type: '' || employee.identification_type, identification: '' || employee.identification, nit: '' || employee.nit, igss: '' || employee.igss, gender: '' || employee.gender, birthdate: '' || employee.birthdate, address: '' || employee.address, hire_date: '' || employee.hire_date, contract_type: '' || employee.contract_type, work_day: '' || employee.work_day, department: employee.department || '', area: employee.area || '' }}
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

                        if (!employee.id) {
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
                            if (employee.id) {
                                if (selectedCountry?.code) { values.country = selectedCountry.code }
                                else { values.country = employee.country }

                                if (selectedTypeIdentification?.code) { values.identification_type = selectedTypeIdentification.code }
                                else { values.identification_type = employee.identification_type }

                                if (selectedGender?.code) { values.gender = selectedGender.code }
                                else { values.gender = employee.gender }

                                if (selectedContractType?.code) { values.contract_type = selectedContractType.code }
                                else { values.contract_type = employee.contract_type }

                                if (selectedWorkDay?.code) { values.work_day = selectedWorkDay.code }
                                else { values.work_day = employee.work_day }

                                if (selectedStatus?.code === true) { values.status = true }
                                else if (selectedStatus?.code === false) { values.status = false } else { values.status = employee.status }

                                if (values.department !== "") { values.departmentId = values.department.id } else { values.departmentId = employee.departmentId }

                                if (values.area !== "") { values.areaId = values.area.id } else { values.areaId = employee.areaId }

                                updateEmployee(employee.id, values);
                                setEmployeeDialog(false);
                                setEmployee(emptyEmployee);
                                resetForm();
                            } else {
                                values.country = selectedCountry.code
                                values.identification_type = selectedTypeIdentification.code
                                values.gender = selectedGender.code
                                values.contract_type = selectedContractType.code
                                values.work_day = selectedWorkDay.code

                                values.departmentId = values.department.id
                                values.areaId = values.area.id

                                createEmployee(values);
                                setEmployeeDialog(false);
                                setEmployee(emptyEmployee);
                                resetForm();
                            }
                        } else {
                            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Empleado no registrado', life: 5000 });
                        }
                    }}
                >
                    {({ values, errors, touched, dirty, isValid, handleChange, handleBlur, resetForm, setFieldTouched, setFieldValue }) => (
                        <Form style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <TabView style={{ flex: 1, overflow: 'auto' }}>

                                <TabPanel className='w-full' header="Header I" headerTemplate={tab1HeaderTemplate}>
                                    <Formulario>
                                        <div className="grid">
                                            <fI.InputT
                                                col={4}
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder="Ingrese los nombres"
                                                label="Nombre del Empleado"
                                                span="*"
                                                value={values.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.name && touched.name}
                                                errorText={errors.name}
                                            />
                                            <fI.InputT
                                                col={4}
                                                id="last_name"
                                                name="last_name"
                                                type="text"
                                                placeholder="Ingrese los apellidos"
                                                label="Apellidos del Empleado"
                                                span="*"
                                                value={values.last_name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                invalid={!!errors.last_name && touched.last_name}
                                                errorText={errors.last_name}
                                            />

                                            <fI.InputT
                                                col={4}
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

                                            <fI.DropDownD
                                                col={4}
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

                                                span={!employee.id ? "*" : ""}
                                                invalid={!employee.id ? !!errors.country && touched.country : false}
                                                errorText={!employee.id ? errors.country : ""}

                                                disabled={false}
                                            />

                                            <fI.DropDownD
                                                col={4}
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

                                                span={!employee.id ? "*" : ""}
                                                invalid={!employee.id ? !!errors.gender && touched.gender : false}
                                                errorText={!employee.id ? errors.gender : ""}

                                                disabled={false}
                                            />

                                            <fI.DropDownD
                                                col={4}
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

                                                span={!employee.id ? "*" : ""}
                                                invalid={!employee.id ? !!errors.identification_type && touched.identification_type : false}
                                                errorText={!employee.id ? errors.identification_type : ""}

                                                disabled={false}
                                            />

                                            <fI.InputT
                                                col={4}
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

                                            <fI.InputT
                                                col={4}
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

                                            <fI.InputT
                                                col={4}
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

                                            <fI.InputT
                                                col={4}
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

                                            <fI.TextArea
                                                col={8}
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
                                            <fI.InputT
                                                col={4}
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

                                            <fI.DropDownD
                                                col={4}
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

                                                span={!employee.id ? "*" : ""}
                                                invalid={!employee.id ? !!errors.contract_type && touched.contract_type : false}
                                                errorText={!employee.id ? errors.contract_type : ""}

                                                disabled={false}
                                            />

                                            <fI.DropDownD
                                                col={4}
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

                                                span={!employee.id ? "*" : ""}
                                                invalid={!employee.id ? !!errors.work_day && touched.work_day : false}
                                                errorText={!employee.id ? errors.work_day : ""}
                                                disabled={false}
                                            />

                                            <fI.DropDownD
                                                col={4}
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

                                            <fI.DropDownD
                                                col={4}
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

                                {employee.id ? (
                                    <TabPanel className='w-full' header="Header III" headerTemplate={tab3HeaderTemplate}>
                                        <Formulario>
                                            <div className="grid">
                                                <fI.DropDownD
                                                    col={4}
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
                                                            <ColumnStatusBody value={employee} />
                                                            <Chip label={`Creado el: ${new Date(employee.createdAt).toLocaleDateString()} - ${new Date(employee.createdAt).toLocaleTimeString()}`} className='text-md font-bold' />
                                                            <Chip label={`Ultima Actualización: ${new Date(employee.updatedAt).toLocaleDateString()} - ${new Date(employee.updatedAt).toLocaleTimeString()}`} className='text-md font-bold' />
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
                                <Button label="Guardar Empleado" icon="pi pi-check" type='submit' className='mx-1' disabled={employee.id ? false : !(isValid && dirty)} />
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            {/* //? -------------------- MODAL DIALOG (ONLY READ) ------------------- */}
            <Dialog visible={seeEmployeeDialog} style={{ width: '62rem', minWidth: '30rem', minHeight: '30rem', maxWidth: '90vw', maxHeight: '90vh' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Todos los datos del empleado" modal className='p-fluid' footer={seeDialogFooter} onHide={hideSeeDialog}>
                <div className="confirmation-content">
                    {employee && (<>
                        {employee.id ? (<>
                            <div className="card">
                                <TabView>
                                    <TabPanel className='w-full' header="Header I" headerTemplate={tab1HeaderTemplate}>
                                        <div className="field mt-5 mb-3">
                                            <div className="formgrid grid">
                                                <div className="col-12">
                                                    <div className="flex flex-wrap gap-3 justify-content-evenly">
                                                        <Chip label={`EMPLEADO: ${employee.name} ${employee.last_name}`} className='text-lg font-bold uppercase' />
                                                        <Chip label={`No. Telefono: ${employee.phone}`} className='text-lg font-bold uppercase' />
                                                        <Chip label={`Tipo Identificacion: ${employee.identification_type}`} className='text-lg font-bold uppercase' />
                                                        <Chip label={`No. Identificacion: ${employee.identification}`} className='text-lg font-bold uppercase' />
                                                        <Chip label={`No. NIT: ${employee.nit}`} className='text-lg font-bold uppercase' />
                                                        <Chip label={`No. IGSS: ${employee.igss}`} className='text-lg font-bold uppercase' />
                                                    </div>
                                                    <Divider align="center" className='my-5'>
                                                        <span className="p-tag">Otros Datos</span>
                                                    </Divider>
                                                    <div className="flex flex-wrap gap-3 justify-content-evenly">
                                                        <Chip label={`Pais: ${employee.country}`} className='text-lg font-bold uppercase' />
                                                        <Chip label={`Genero: ${employee.gender}`} className='text-lg font-semibold uppercase' />
                                                        <Chip label={`Fecha Cumpleaños: 
                                                        ${dayjs(employee.birthdate).utc().format("DD/MM/YYYY")}`} className='text-lg font-semibold uppercase' />
                                                        <Chip label={`DIRECCIÓN: ${employee.address}`} className='text-lg font-semibold' />

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
                                                        <Chip label={`Fecha Contratación: ${dayjs(employee.hire_date).utc().format("DD/MM/YYYY")}`} className='text-lg font-bold uppercase' />
                                                        {/* <Chip label={`Fecha Contratación: ${new Date(employee.hire_date).toLocaleDateString()}`} className='text-lg font-bold uppercase' /> */}

                                                        <Chip label={`Tipo Contrato: ${employee.contract_type}`} className='text-lg font-bold uppercase' />
                                                        <Chip label={`Jornada laboral ordinaria: ${employee.work_day}`} className='text-lg font-bold uppercase' />
                                                        <Chip label={`Salario Base: ${employee.area?.salary}`} className='text-lg font-bold uppercase' />
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
                                                        <Chip label={`DEPARTAMENTO - ${employee.department?.name}`} className="text-lg font-bold uppercase" />
                                                        <Chip label={`CARGO(PUESTO) - ${employee.area?.name}`} className="text-lg font-bold uppercase" />
                                                        <Chip label={`CREADO EL: ${new Date(employee.createdAt).toLocaleDateString()} - ${new Date(employee.createdAt).toLocaleTimeString()}`} className='text-lg font-bold' />
                                                        <Chip label={`ULTIMA ACTUALIZACION: ${new Date(employee.updatedAt).toLocaleDateString()} - ${new Date(employee.updatedAt).toLocaleTimeString()}`} className='text-lg font-bold' />
                                                        <ColumnStatusBody value={employee} />
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
                visible={deleteEmployeeDialog}
                header="Confirmar"
                data={employee}
                message1="Estas seguro que deseas eliminar al empleado"
                message1Bold={employee.fullName}
                message2={`con el numero de identificacion ${employee.identification_type}:`}
                message2Bold={employee.identification}
                footer={deleteEmployeeDialogFooter}
                onHide={hideDeleteEmployeeDialog}
            ></DeleteModal>
        </div>
    );
}