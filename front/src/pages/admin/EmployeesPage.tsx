import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';
import { Checkbox } from "primereact/checkbox";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';
import { DataTableFilterMeta } from 'primereact/datatable';
import { Formik, Form, ErrorMessage } from 'formik';
import { InputTextarea } from 'primereact/inputtextarea';
import { TabView, TabPanel, TabPanelHeaderTemplateOptions } from 'primereact/tabview';
import { Divider } from 'primereact/divider';
import { Calendar } from 'primereact/calendar';
import { Nullable } from "primereact/ts-helpers";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import { useDepartments } from '../../api/context/DepartmentContext';
import { useAreas } from '../../api/context/AreaContext';
import { useEmployees } from '../../api/context/EmployeeContext';
import { BreadCrumb } from 'primereact/breadcrumb';
import { MenuItem } from 'primereact/menuitem';
import { Link } from 'react-router-dom';

dayjs.extend(utc);
interface Employee {
    id: number | null;
    name: string;
    last_name: string;
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
    areaId: number | null;
}
interface Status {
    name: string;
    code: boolean;
}
interface Country {
    name: string;
    code: string;
}
interface Gender {
    name: string;
    code: string;
}
interface Identification_type {
    name: string;
    code: string;
}
interface Contract_type {
    name: string;
    code: string;
}
interface Work_day {
    name: string;
    code: string;
}

export default function EmployeesPage() {

    const items: MenuItem[] = [{template: () => <Link to=""><span className="text-primary font-semibold">Empleados</span></Link> }];
    const home: MenuItem = {
        template: () => <Link to="/dashboard"><span className="text-primary font-semibold">Inicio</span></Link>
    }

    //? -------------------- INITIAL STATES -------------------
    const emptyEmployee: Employee = {
        id: null,
        name: '',
        last_name: '',
        phone: '',
        country: '',
        identification_type: '',
        identification: '',
        nit: '',
        igss: '',
        gender: '',
        birthdate: '',
        address: '',
        hire_date: '',
        contract_type: '',
        work_day: '',
        status: true,
        createdAt: '',
        updatedAt: '',
        department: '',
        departmentId: null,
        employee: '',
        areaId: null
    };

    const typeStatus: Status[] = [
        { name: 'Activo', code: true },
        { name: 'Inactivo', code: false }
    ];

    const typeGender: Gender[] = [
        { name: 'Hombre', code: 'hombre' },
        { name: 'Mujer', code: 'mujer' }
    ];

    const typeCountry: Country[] = [
        { name: 'Guatemala', code: 'guatemala' },
        { name: 'Mexico', code: 'mexico' },
        { name: 'Estados Unidos', code: 'usa' }
    ];

    const typeIdentification: Identification_type[] = [
        { name: 'Dpi', code: 'dpi' },
        { name: 'Pasaporte', code: 'pasaporte' },
    ];
    const typeContract: Contract_type[] = [
        { name: 'Contrato', code: 'contrato' },
        { name: 'Indefinido', code: 'indefinido' },
    ];

    const typeWorkDay: Work_day[] = [
        { name: '8 Horas Diarias', code: '8 horas diarias' },
    ];

    //? -------------------- CONTEXT API -------------------
    const { departments, getDepartments, getActiveDepartments } = useDepartments();
    const { areas, getAreasById } = useAreas();
    const { employees, getEmployees, createEmployee, deleteEmployee, updateEmployee } = useEmployees();
    //? -------------------- STATES -------------------
    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
    const [selectedTypeIdentification, setSelectedTypeIdentification] = useState<Identification_type | null>(null);
    const [selectedContractType, setSelectedContractType] = useState<Contract_type | null>(null);
    const [selectedWorkDay, setSelectedWorkDay] = useState<Work_day | null>(null);
    const [estados, setEstados] = useState<string[]>([]);
    const [dId, setdId] = useState(0);
    const [employee, setEmployee] = useState<Employee>(emptyEmployee);
    const [date, setDate] = useState<Nullable<Date>>(null);
    const toast = useRef<Toast>(null);
    //? -------------------- DIALOG STATES -------------------
    const [employeeDialog, setEmployeeDialog] = useState<boolean>(false);
    const [seeEmployeeDialog, setSeeEmployeeDialog] = useState<boolean>(false);
    const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState<boolean>(false);
    //? -------------------- DATATABLE STATES -------------------
    const dt = useRef<DataTable<Employee[]>>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        last_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        phone: { value: null, matchMode: FilterMatchMode.EQUALS },
        identification: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nit: { value: null, matchMode: FilterMatchMode.CONTAINS },
        igss: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'department.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'area.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const _filters = { ...filters };

        // @ts-ignore
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const onEstadosChange = (e: CheckboxChangeEvent) => {
        const _estados = [...estados];

        if (e.checked)
            _estados.push(e.value);
        else
            _estados.splice(_estados.indexOf(e.value), 1);

        setEstados(_estados);
    }

    //? -------------------- DTATABLE FUNCTIONS -------------------
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <h4 className="m-0">Lista de Empleados</h4>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
                </IconField>
            </div>
        );
    };

    //? -------------------- DATATABLE INPUT TEMPLATES -------------------
    const last_nameBodyTemplate = (rowData: Employee) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.last_name}</span>
            </div>
        );
    };

    const phoneBodyTemplate = (rowData: Employee) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.phone}</span>
            </div>
        );
    };

    const identificationBodyTemplate = (rowData: Employee) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.identification}</span>
            </div>
        );
    };

    const nitBodyTemplate = (rowData: Employee) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.nit}</span>
            </div>
        );
    };

    const igssBodyTemplate = (rowData: Employee) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.igss}</span>
            </div>
        );
    };

    const departmentBodyTemplate = (rowData: Employee) => {
        return (
            <div className="flex align-items-center gap-2">
                <span className='bg-gray-200 border-round-3xl px-3 py-2 uppercase font-bold text-center'>{rowData.department.name}</span>
            </div>
        );
    };

    const areaBodyTemplate = (rowData: Employee) => {
        return (
            <div className="flex align-items-center gap-2">
                <span className='bg-gray-200 border-round-3xl px-3 py-2 uppercase font-bold text-center'>{rowData.area.name}</span>
            </div>
        );
    };

    const createdAtBodyTemplate = (rowData: Employee) => {
        return (
            <div className="flex align-items-center gap-2">
                <span className='bg-gray-200 border-round-2xl px-1 py-2 uppercase font-bold text-center'>
                    {`${new Date(rowData.createdAt).toLocaleDateString()} - ${new Date(rowData.createdAt).toLocaleTimeString()}`}
                </span>
            </div>
        );
    };

    const updatedAtBodyTemplate = (rowData: Employee) => {
        return (
            <div className="flex align-items-center gap-2">
                <span className='bg-gray-200 border-round-2xl px-1 py-2 uppercase font-bold text-center'>
                    {`${new Date(rowData.updatedAt).toLocaleDateString()} - ${new Date(rowData.updatedAt).toLocaleTimeString()}`}
                </span>
            </div>
        );
    };

    //? -------------------- LOADING DATA -------------------
    const header = renderHeader();
    // useEffect(() => {
    //     getEmployees();
    //     getActiveDepartments();
    //     setLoading(false);
    //     console.log('dId' + dId)

    //     if (dId !== 0) {
    //         getAreasById(dId);
    //     }
    // }, [employee, dId]);



    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await getEmployees();
            await getActiveDepartments();
            setLoading(false);
        };

        fetchData();
    }, [employee]);


    useEffect(() => {
        if (dId !== 0 && dId !== null && dId !== undefined) {
            const fetchAreas = async () => {
                setLoading(true);
                await getAreasById(dId);
                setLoading(false);
            };

            fetchAreas();
        }
    }, [dId]);


    //? -------------------- MODAL DIALOGS -------------------
    const openNew = () => {
        setEmployee(emptyEmployee);
        setEmployeeDialog(true);
    };

    const hideDialog = () => {
        setEstados([]);
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

    const editEmployee = (employee: Employee) => {
        setEmployee({ ...employee });
        setEmployeeDialog(true);
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

    //? -------------------- DTATABLE ACTIONS -------------------
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Agregar Empleado" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const statusBodyTemplate = (rowData: Employee) => {
        return <Tag className="text-sm font-bold" value={getDatoStatus(rowData)} severity={getSeverity(rowData)}></Tag>;
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

    const getDatoStatus = (employee: Employee) => {
        switch (employee.status) {
            case true:
                return 'ACTIVO';

            case false:
                return 'INACTIVO';

            default:
                return null;
        }
    };

    const getSeverity = (employee: Employee) => {
        switch (employee.status) {
            case true:
                return 'success';

            case false:
                return 'danger';

            default:
                return null;
        }
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
                <DataTable ref={dt} dataKey="id" value={employees} filters={filters} loading={loading}
                    paginator rows={15} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} empleados"
                    // rowsPerPageOptions={[5, 10, 25]}
                    globalFilterFields={['name', 'last_name', 'phone', 'identification', 'nit', 'igss', 'department.name', 'area.name']} header={header} emptyMessage="No se encontraron empleados."
                    filterDisplay="row"
                    stripedRows
                    scrollable
                >

                    <Column header="ID" body={(rowData) => <span>{employees.indexOf(rowData) + 1}</span>} />

                    <Column sortable field="name" header="NOMBRES" filter filterPlaceholder="Filtrar por nombres" style={{ minWidth: '12rem' }} />

                    <Column sortable field="last_name" header="APELLIDOS" filterField="last_name" style={{ minWidth: '12rem' }} body={last_nameBodyTemplate} filter filterPlaceholder="Filtrar por apellidos" />

                    <Column sortable field="phone" header="TELEFONO" filterField="phone" style={{ minWidth: '12rem' }} body={phoneBodyTemplate} filter filterPlaceholder="Filtrar por telefono" />

                    <Column sortable field="identification" header="IDENTIFICACION" filterField="identification" style={{ minWidth: '12rem' }} body={identificationBodyTemplate} filter filterPlaceholder="Filtrar por identificacion" />

                    <Column sortable field="nit" header="NIT" filterField="nit" style={{ minWidth: '12rem' }} body={nitBodyTemplate} filter filterPlaceholder="Filtrar por NIT" />

                    <Column sortable field="igss" header="IGSS" filterField="igss" style={{ minWidth: '12rem' }} body={igssBodyTemplate} filter filterPlaceholder="Filtrar por IGSS" />

                    <Column sortable field="department.name" header="DEPARTAMENTO" filterField="department.name" style={{ minWidth: '12rem' }} body={departmentBodyTemplate} filter filterPlaceholder="Filtrar por departamento" />

                    <Column sortable field="area.name" header="AREA" filterField="area.name" style={{ minWidth: '12rem' }} body={areaBodyTemplate} filter filterPlaceholder="Filtrar por area" />


                    <Column field="status" header="ESTADO" style={{ minWidth: '4rem' }} body={statusBodyTemplate} sortable />
                    <Column header="CREADO EL" style={{ minWidth: '12rem' }} body={createdAtBodyTemplate} />
                    <Column header="ULTIMA ACTUALIZACION" style={{ minWidth: '12rem' }} body={updatedAtBodyTemplate} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '15rem' }} alignFrozen='right' frozen></Column>
                </DataTable>
            </div>

            {/* //? -------------------- MODAL DIALOG (CREATE AND UPDATE) ------------------- */}
            <Dialog visible={employeeDialog} style={{ width: '70rem', height: '42rem', minWidth: '50rem', maxWidth: '90vw', minHeight: '40rem', maxHeight: '90vh' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles del Empleado" modal className="p-fluid" onHide={hideDialog} dismissableMask={false} blockScroll={true} closeOnEscape={false}
            >
                <Formik
                    initialValues={{ name: '' || employee.name, last_name: '' || employee.last_name, phone: '' || employee.phone, country: '' || employee.country, identification_type: '' || employee.identification_type, identification: '' || employee.identification, nit: '' || employee.nit, igss: '' || employee.igss, gender: '' || employee.gender, birthdate: '' || employee.birthdate, address: '' || employee.address, hire_date: '' || employee.hire_date, contract_type: '' || employee.contract_type, work_day: '' || employee.work_day, department: '', area: '' }}
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
                        } else if (!/^(?:\+?(?:502)?[\s-]?)?[1-9]\d{3}[\s-]?\d{4}$/.test(values.phone)) {
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
                        else if (!/^[a-zA-Z0-9.&'-\s,]+$/.test(values.address)) {
                            errors.address = 'La direccion no es valida';
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
                            if (!values.department) {
                                errors.department = 'El departamento es requerido';
                            }
                            if (!values.area) {
                                errors.area = 'El area es requerida';
                            }
                        }
                        return errors;
                    }}
                    onSubmit={(values, { resetForm }) => {

                        if (values) {
                            values.birthdate = dayjs.utc(values.birthdate).format()
                            values.hire_date = dayjs.utc(values.hire_date).format()
                            if (employee.id) {
                                if( selectedCountry?.code) { values.country = selectedCountry.code }
                                else { values.country = employee.country }

                                if( selectedTypeIdentification?.code) { values.identification_type = selectedTypeIdentification.code }
                                else { values.identification_type = employee.identification_type }

                                if( selectedGender?.code) { values.gender = selectedGender.code }
                                else { values.gender = employee.gender }

                                if( selectedContractType?.code) { values.contract_type = selectedContractType.code }
                                else { values.contract_type = employee.contract_type }

                                if( selectedWorkDay?.code) { values.work_day = selectedWorkDay.code }
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
                    {({ values, errors, touched, dirty, isValid, handleChange, handleBlur }) => (
                        <Form style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <TabView style={{ flex: 1, overflow: 'auto' }}>
                                <TabPanel className='w-full' header="Header I" headerTemplate={tab1HeaderTemplate}>
                                    <div className="formgrid grid mt-5">
                                        <div className="p-fluid grid">
                                            <div className="field col-4">
                                                <label htmlFor="name" className="font-bold">Nombres del Empleado <span className='text-red-600'>*</span></label>
                                                <InputText id="name" name='name' type='text' value={values.name} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.name && touched.name} />
                                                <ErrorMessage name="name" component={() => (<small className="p-error">{errors.name}</small>)} />
                                            </div>
                                            <div className="field col-4">
                                                <label htmlFor="last_name" className="font-bold">Apellidos del Empleado <span className='text-red-600'>*</span></label>
                                                <InputText id="last_name" name='last_name' type='text' value={values.last_name} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.last_name && touched.last_name} />
                                                <ErrorMessage name="last_name" component={() => (<small className="p-error">{errors.last_name}</small>)} />
                                            </div>
                                            <div className="field col-4">
                                                <label htmlFor="phone" className="font-bold">Número de Teléfono <span className='text-red-600'>*</span></label>
                                                <InputText id="phone" name='phone' type='number' value={values.phone || ''} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.phone && touched.phone} />
                                                <ErrorMessage name="phone" component={() => (<small className="p-error">{errors.phone}</small>)} />
                                            </div>

                                            {!employee.id ? (<>
                                                <div className="field col-4">
                                                    <label htmlFor="country" className="font-bold">País <span className='text-red-600'>*</span>
                                                    </label>
                                                    <Dropdown id='country' name='country' value={selectedCountry} onChange={(e: DropdownChangeEvent) => { setSelectedCountry(e.value); handleChange(e) }} onBlur={handleBlur} options={typeCountry} optionLabel="name" placeholder="Selecciona un país"
                                                        invalid={!!errors.country && touched.country} className="w-full uppercase" emptyMessage="No se encontraron países" />
                                                    <ErrorMessage name="country" component={() => (<small className="p-error">{errors.country}</small>)} />
                                                </div>

                                                <div className="field col-4">
                                                    <label htmlFor="gender" className="font-bold">Género <span className='text-red-600'>*</span>
                                                    </label>
                                                    <Dropdown id='gender' name='gender' value={selectedGender} onChange={(e: DropdownChangeEvent) => { setSelectedGender(e.value); handleChange(e) }} onBlur={handleBlur} options={typeGender} optionLabel="name" placeholder="Selecciona un género"
                                                        invalid={!!errors.gender && touched.gender} className="w-full uppercase" emptyMessage="No se encontraron generos" />
                                                    <ErrorMessage name="gender" component={() => (<small className="p-error">{errors.gender}</small>)} />
                                                </div>

                                                <div className="field col-4">
                                                    <label htmlFor="identification_type" className="font-bold">Tipo Identificación <span className='text-red-600'>*</span>
                                                    </label>
                                                    <Dropdown id='identification_type' name='identification_type' value={selectedTypeIdentification} onChange={(e: DropdownChangeEvent) => { setSelectedTypeIdentification(e.value); handleChange(e) }} onBlur={handleBlur} options={typeIdentification} optionLabel="name" placeholder="Selecciona un tipo"
                                                        invalid={!!errors.identification_type && touched.identification_type} className="w-full uppercase" emptyMessage="No se encontraron tipos" />
                                                    <ErrorMessage name="identification_type" component={() => (<small className="p-error">{errors.identification_type}</small>)} />
                                                </div>
                                            </>) : (<>
                                                <div className="field col-4">
                                                    <label htmlFor="country" className="font-bold">País
                                                    </label>
                                                    <Dropdown id='country' name='country' value={selectedCountry} onChange={(e: DropdownChangeEvent) => { setSelectedCountry(e.value); handleChange(e) }} onBlur={handleBlur} options={typeCountry} optionLabel="name" placeholder="Selecciona un país" className="w-full uppercase" emptyMessage="No se encontraron países" />
                                                </div>

                                                <div className="field col-4">
                                                    <label htmlFor="gender" className="font-bold">Género
                                                    </label>
                                                    <Dropdown id='gender' name='gender' value={selectedGender} onChange={(e: DropdownChangeEvent) => { setSelectedGender(e.value); handleChange(e) }} onBlur={handleBlur} options={typeGender} optionLabel="name" placeholder="Selecciona un género" className="w-full uppercase" emptyMessage="No se encontraron generos" />
                                                </div>

                                                <div className="field col-4">
                                                    <label htmlFor="identification_type" className="font-bold">Tipo Identificación
                                                    </label>
                                                    <Dropdown id='identification_type' name='identification_type' value={selectedTypeIdentification} onChange={(e: DropdownChangeEvent) => { setSelectedTypeIdentification(e.value); handleChange(e) }} onBlur={handleBlur} options={typeIdentification} optionLabel="name" placeholder="Selecciona un tipo" className="w-full uppercase" emptyMessage="No se encontraron tipos" />
                                                </div>
                                            </>)}

                                            <div className="field col-4">
                                                <label htmlFor="nit" className="font-bold">Número de NIT <span className='text-red-600'>*</span></label>
                                                <InputText id="nit" name='nit' type='text' value={values.nit || ''} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.nit && touched.nit} />
                                                <ErrorMessage name="nit" component={() => (<small className="p-error">{errors.nit}</small>)} />
                                            </div>
                                            <div className="field col-4">
                                                <label htmlFor="igss" className="font-bold">Número de IGSS <span className='text-red-600'>*</span></label>
                                                <InputText id="igss" name='igss' type='number' value={values.igss || ''} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.igss && touched.igss} />
                                                <ErrorMessage name="igss" component={() => (<small className="p-error">{errors.igss}</small>)} />
                                            </div>
                                            <div className="field col-4">
                                                <label htmlFor="identification" className="font-bold">Número de Identificación <span className='text-red-600'>*</span></label>
                                                <InputText id="identification" name='identification' type='number' value={values.identification || ''} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.identification && touched.identification} />
                                                <ErrorMessage name="identification" component={() => (<small className="p-error">{errors.identification}</small>)} />
                                            </div>
                                            <div className="field col-4">
                                                <label htmlFor="birthdate" className="font-bold">Fecha Nacimiento <span className='text-red-600'>*</span></label>
                                                {/* <Calendar id='birthdate' name='birthdate' value={values.birthdate} onChange={(e) => { e.stopPropagation(); setDate(e.value); handleChange(e); }} onBlur={handleBlur} invalid={!!errors.birthdate && touched.birthdate} touchUI /> */}
                                                <InputText id="birthdate" name='birthdate' type='date' value={values.birthdate || ''} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.birthdate && touched.birthdate} />
                                                <ErrorMessage name="birthdate" component={() => (<small className="p-error">{errors.birthdate}</small>)} />
                                            </div>
                                            <div className="field col-8">
                                                <label htmlFor="address" className="font-bold">Dirección <span className='text-red-600'>*</span></label>
                                                <InputTextarea id="address" name='address' autoResize rows={1} value={values.address || ''} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.address && touched.address} />
                                                <ErrorMessage name="address" component={() => (<small className="p-error">{errors.address}</small>)} />
                                            </div>
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel className='w-full' header="Header II" headerTemplate={tab2HeaderTemplate}>
                                    <div className="formgrid grid mt-5">
                                        <div className="p-fluid grid">
                                            <div className="field col-4">
                                                <label htmlFor="hire_date" className="font-bold">Fecha Contratación <span className='text-red-600'>*</span></label>
                                                {/* <Calendar id='hire_date' name='hire_date' value={values.hire_date} onChange={(e) => { e.stopPropagation(); setDate(e.value); handleChange(e); }} onBlur={handleBlur} invalid={!!errors.hire_date && touched.hire_date} touchUI /> */}
                                                <InputText id="hire_date" name='hire_date' type='date' value={values.hire_date || ''} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.hire_date && touched.hire_date} />
                                                <ErrorMessage name="hire_date" component={() => (<small className="p-error">{errors.hire_date}</small>)} />
                                            </div>
                                            {!employee.id ? (<>
                                                <div className="field col-4">
                                                    <label htmlFor="contract_type" className="font-bold">Tipo Contrato <span className='text-red-600'>*</span>
                                                    </label>
                                                    <Dropdown id='contract_type' name='contract_type' value={selectedContractType} onChange={(e: DropdownChangeEvent) => { setSelectedContractType(e.value); handleChange(e) }} onBlur={handleBlur} options={typeContract} optionLabel="name" placeholder="Selecciona el tipo de contrato"
                                                        invalid={!!errors.contract_type && touched.contract_type} className="w-full uppercase" emptyMessage="No se encontraron tipos" />
                                                    <ErrorMessage name="contract_type" component={() => (<small className="p-error">{errors.contract_type}</small>)} />
                                                </div>

                                                <div className="field col-4">
                                                    <label htmlFor="work_day" className="font-bold">Jornada Laboral <span className='text-red-600'>*</span>
                                                    </label>
                                                    <Dropdown id='work_day' name='work_day' value={selectedWorkDay} onChange={(e: DropdownChangeEvent) => { setSelectedWorkDay(e.value); handleChange(e) }} onBlur={handleBlur} options={typeWorkDay} optionLabel="name" placeholder="Selecciona una jornada"
                                                        invalid={!!errors.work_day && touched.work_day} className="w-full uppercase" emptyMessage="No se encontraron jornadas" />
                                                    <ErrorMessage name="work_day" component={() => (<small className="p-error">{errors.work_day}</small>)} />
                                                </div>

                                                <div className="field col-4">
                                                    <label htmlFor="department" className="font-bold">Departamento<span className='text-red-600'>*</span></label>
                                                    <Dropdown id="department" name="department" value={values.department} onChange={(e) => {
                                                        handleChange(e);
                                                        setdId(e.value.id);
                                                    }} onBlur={handleBlur} options={departments} optionLabel="name" placeholder="Selecciona un Departamento" invalid={!!errors.department && touched.department} emptyMessage="No se encontraron departamentos" className="w-full uppercase" />
                                                    <ErrorMessage name="department" component={() => (<small className="p-error">{errors.department}</small>)} />
                                                </div>
                                                {/* {setdId(values.department.id)} */}
                                                <div className="field col-4">
                                                    <label htmlFor="area" className="font-bold">Area <span className='text-red-600'>*</span></label>
                                                    <Dropdown id="area" name="area" value={values.area} onChange={handleChange} onBlur={handleBlur} options={areas} optionLabel="name" placeholder="Selecciona un Area" invalid={!!errors.area && touched.area} emptyMessage="No se encontraron areas" className="w-full uppercase" />
                                                    <ErrorMessage name="area" component={() => (<small className="p-error">{errors.area}</small>)} />
                                                </div>

                                            </>) : (<>
                                                <div className="field col-4">
                                                    <label htmlFor="contract_type" className="font-bold">Tipo Contrato
                                                    </label>
                                                    <Dropdown id='contract_type' name='contract_type' value={selectedContractType} onChange={(e: DropdownChangeEvent) => { setSelectedContractType(e.value); handleChange(e) }} onBlur={handleBlur} options={typeContract} optionLabel="name" placeholder="Selecciona el tipo de contrato" className="w-full uppercase" emptyMessage="No se encontraron tipos" />
                                                </div>

                                                <div className="field col-4">
                                                    <label htmlFor="work_day" className="font-bold">Jornada Laboral
                                                    </label>
                                                    <Dropdown id='work_day' name='work_day' value={selectedWorkDay} onChange={(e: DropdownChangeEvent) => { setSelectedWorkDay(e.value); handleChange(e) }} onBlur={handleBlur} options={typeWorkDay} optionLabel="name" placeholder="Selecciona una jornada" className="w-full uppercase" emptyMessage="No se encontraron jornadas" />
                                                </div>

                                                <div className="field col-4">
                                                    <label htmlFor="department" className="font-bold">Departament</label>
                                                    <Dropdown id="department" name="department" value={values.department} onChange={(e) => {
                                                        handleChange(e);
                                                        setdId(e.value.id);
                                                    }} onBlur={handleBlur} options={departments} optionLabel="name" placeholder="Selecciona un Departamento" emptyMessage="No se encontraron departamentos" className="w-full uppercase" />
                                                </div>
                                                {/* {setdId(values.department.id)} */}
                                                <div className="field col-4">
                                                    <label htmlFor="area" className="font-bold">Area</label>
                                                    <Dropdown id="area" name="area" value={values.area} onChange={handleChange} onBlur={handleBlur} options={areas} optionLabel="name" placeholder="Selecciona un Area" emptyMessage="No se encontraron areas" className="w-full uppercase" />
                                                </div>
                                            </>)}
                                        </div>
                                    </div>
                                </TabPanel>
                                {employee.id ? (
                                    <TabPanel className='w-full' header="Header III" headerTemplate={tab3HeaderTemplate}>
                                        <div className="formgrid grid mt-5">
                                            <div className="p-fluid grid">
                                                <div className="field col-12">
                                                    <label htmlFor="status" className="font-bold my-3">
                                                        Estado
                                                    </label>
                                                    <Dropdown value={selectedStatus} onChange={(e: DropdownChangeEvent) => setSelectedStatus(e.value)} options={typeStatus} optionLabel="name" placeholder="Selecciona un estado" className="w-full uppercase" emptyMessage="No se encontraron estados" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="field">
                                            <label className="mb-3 mt-5 font-bold">Otros Datos</label>
                                            <div className="formgrid grid">
                                                <div className="col-12">
                                                    <div className="card flex flex-wrap gap-2 justify-content-evenly">
                                                        <Tag className="text-sm font-bold" value={`ESTADO ${getDatoStatus(employee)}`} severity={getSeverity(employee)}></Tag>
                                                        <Chip label={`Creado el: ${new Date(employee.createdAt).toLocaleDateString()} - ${new Date(employee.createdAt).toLocaleTimeString()}`} className='text-md font-bold' />
                                                        <Chip label={`Ultima Actualización: ${new Date(employee.updatedAt).toLocaleDateString()} - ${new Date(employee.updatedAt).toLocaleTimeString()}`} className='text-md font-bold' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                ) : (<></>)}
                            </TabView>

                            <div className="flex mb-0 pt-3">
                                <Button label="Cancelar" type='button' icon="pi pi-times" outlined onClick={hideDialog} className='mx-1' />
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
                                                        <Tag className="text-lg font-bold" value={`ESTADO ${getDatoStatus(employee)}`} severity={getSeverity(employee)}></Tag>
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
            <Dialog visible={deleteEmployeeDialog} style={{ width: '32rem', minWidth: '32rem', maxWidth: '40rem', minHeight: '16rem', maxHeight: '16rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal className='p-fluid' footer={deleteEmployeeDialogFooter} onHide={hideDeleteEmployeeDialog}>
                <div className="confirmation-content flex">
                    <i className="pi pi-exclamation-triangle mr-4 mb-2" style={{ fontSize: '2rem' }} />
                    {employee && (
                        <span>
                            ¿Estas seguro que deseas eliminar al empleado: <b className="font-bold">{employee.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}