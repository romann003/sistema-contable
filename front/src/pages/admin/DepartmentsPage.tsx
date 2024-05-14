import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';
import { Checkbox } from "primereact/checkbox";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';
import { DataTableFilterMeta } from 'primereact/datatable';
import { useDepartments } from '../../api/context/DepartmentContext';
import { Formik, Form, ErrorMessage } from 'formik';
import { InputTextarea } from 'primereact/inputtextarea';

interface Department {
    id: number | null;
    name: string;
    description: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    company: string | null;
    companyId: number | null;
}
interface Status {
    name: string;
    code: boolean;
}

export default function DepartmentsPage() {

    //?-------------------- INITIAL STATES -------------------
    const emptyDepartment: Department = {
        id: null,
        name: '',
        description: '',
        status: true,
        createdAt: '',
        updatedAt: '',
        company: '',
        companyId: null,
    };

    const typeStatus: Status[] = [
        { name: 'Activo', code: true },
        { name: 'Inactivo', code: false }
    ];


    //? -------------------- CONTEXT API -------------------
    const { departments, getDepartments, createDepartment, deleteDepartment, updateDepartment, setDepartments, errors: departmentErrors } = useDepartments();

    //? -------------------- STATES -------------------
    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const [estados, setEstados] = useState<string[]>([]);
    const [department, setDepartment] = useState<Department>(emptyDepartment);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    //? -------------------- DIALOGS STATES -------------------
    const [departmentDialog, setDepartmentDialog] = useState<boolean>(false);
    const [deleteDepartmentDialog, setDeleteDepartmentDialog] = useState<boolean>(false);
    const [updateStatusDialog, setUpdateStatusDialog] = useState<boolean>(false);

    //? -------------------- DATATABLE STATES -------------------
    const dt = useRef<DataTable<Department[]>>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        description: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        // @ts-ignore
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const onEstadosChange = (e: CheckboxChangeEvent) => {
        let _estados = [...estados];

        if (e.checked)
            _estados.push(e.value);
        else
            _estados.splice(_estados.indexOf(e.value), 1);

        setEstados(_estados);
    }

    //? -------------------- DATATABLE FUNCTIONS -------------------
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <h4 className="m-0">Lista de Departamentos</h4>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
                </IconField>
            </div>
        );
    };

    //? -------------------- DATATABLE INPUT TEMPLATES -------------------
    const desBodyTemplate = (rowData: Department) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.description}</span>
            </div>
        );
    };

    //? -------------------- LOADING DATA -------------------
    const header = renderHeader();
    useEffect(() => {
        getDepartments()
        setLoading(false);
    }, []);

    //? -------------------- MODAL DIALOGS -------------------
    const openNew = () => {
        setDepartment(emptyDepartment);
        setDepartmentDialog(true);
    };

    const hideDialog = () => {
        setEstados([]);
        setSelectedStatus(null);
        setDepartmentDialog(false);
    };

    const editDepartment = (department: Department) => {
        setDepartment({ ...department });
        setDepartmentDialog(true);
    };

    const hideDeleteDepartmentDialog = () => {
        setDeleteDepartmentDialog(false);
    };

    const confirmDeleteDepartment = (department: Department) => {
        setDepartment(department);
        setDeleteDepartmentDialog(true);
    };

    const deleteDepartmentModal = () => {
        deleteDepartment(department.id);
        setDeleteDepartmentDialog(false);
        setDepartment(emptyDepartment);
    };

    //* SET DEPARTMENT STATUS
    const confirmChangeStatusDepartment = () => {
        setUpdateStatusDialog(true);
    };

    const hideChangeStatusDepartmentDialog = () => {
        setUpdateStatusDialog(false);
    };

    const saveDepartment = (values) => {
        if (values) {
            department.companyId = 1;
            if (department.companyId === null) { values.companyId = 1 } else { values.companyId = department.companyId }
            if (department.id) {
                if (selectedStatus?.code === true) { values.status = true }
                else if (selectedStatus?.code === false) { values.status = false } else { values.status = department.status }
                console.log(values)
                updateDepartment(department.id, values);
                setDepartmentDialog(false);
                setUpdateStatusDialog(false);
                setDepartment(emptyDepartment);
                // resetForm();
            } else {
                createDepartment(values);
                setDepartmentDialog(false);
                setUpdateStatusDialog(false);
                setDepartment(emptyDepartment);
                // resetForm();
            }
        } else {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Departamento no registrado', life: 5000 });
        }
    };

    //? -------------------- DATATABLE actions -------------------
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Agregar Departamento" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const statusBodyTemplate = (rowData: Department) => {
        return <Tag className="text-sm font-bold" value={getDatoStatus(rowData)} severity={getSeverity(rowData)}></Tag>;
    };

    const actionBodyTemplate = (rowData: Department) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editDepartment(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteDepartment(rowData)} />
            </React.Fragment>
        );
    };

    const getDatoStatus = (department: Department) => {
        switch (department.status) {
            case true:
                return 'ACTIVO';

            case false:
                return 'INACTIVO';

            default:
                return null;
        }
    };

    const getSeverity = (department: Department) => {
        switch (department.status) {
            case true:
                return 'success';

            case false:
                return 'danger';

            default:
                return null;
        }
    };

    //? -------------------- MODAL BUTTONS -------------------
    const changeStatusDepartmentDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideChangeStatusDepartmentDialog} />
            <Button label="Si, Confirmar" icon="pi pi-check" severity="danger" onClick={saveDepartment} />
        </React.Fragment>
    );

    const deleteDepartmentDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDepartmentDialog} />
            <Button label="Si, eliminar" icon="pi pi-check" severity="danger" onClick={deleteDepartmentModal} />
        </React.Fragment>
    );

    //? -------------------- RENDER -------------------
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <h3>Departamentos</h3>
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                {/* //? -------------------- DATATABLE ------------------- */}
                <DataTable ref={dt} dataKey="id" value={departments} filters={filters} loading={loading}
                    paginator rows={15} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} departamentos"
                    // rowsPerPageOptions={[5, 10, 25]}
                    globalFilterFields={['name', 'description']} header={header} emptyMessage="No se encontraron departamentos."
                    filterDisplay="row"
                >

                    <Column header="ID" body={(rowData) => <span>{departments.indexOf(rowData) + 1}</span>} />
                    <Column sortable field="name" header="NOMBRE" filter filterPlaceholder="Filtrar por nombre" style={{ minWidth: '12rem' }} />
                    <Column sortable field="description" header="DESCRIPCION" filterField="description" style={{ minWidth: '12rem' }} body={desBodyTemplate} filter filterPlaceholder="Filtrar por descripcion" />
                    <Column field="status" header="ESTADO" style={{ minWidth: '4rem' }} body={statusBodyTemplate} sortable />
                    {/* <Column style={{ minWidth: '12rem' }} header="EMPRESA" body={(rowData) => <Chip className='font-bold uppercase' label={`${rowData.company.business_name}`} />} /> */}
                    <Column style={{ minWidth: '12rem' }} header="CREADO EL" body={(rowData) => <Chip className='font-bold' label={`${new Date(rowData.createdAt).toLocaleDateString()} - ${new Date(rowData.createdAt).toLocaleTimeString()}`} />} />
                    <Column style={{ minWidth: '12rem' }} header="ULTIMA ACTUALIZACION" body={(rowData) => <Chip className='font-bold' label={`${new Date(rowData.updatedAt).toLocaleDateString()} - ${new Date(rowData.updatedAt).toLocaleTimeString()}`} />} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
                </DataTable>
            </div>

            {/* //? -------------------- MODAL DIALOG (CREATE AND UPDATE) ------------------- */}
            <Dialog visible={departmentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles del Departamento" modal className="p-fluid" onHide={hideDialog}>

                <Formik
                    initialValues={{ name: '' || department.name, description: '' || department.description }}
                    validate={values => {
                        const errors = {};
                        if (!values.name) {
                            errors.name = 'El nombre del departamento es requerido';
                        } else if (values.name.length < 3) {
                            errors.name = 'El nombre debe tener al menos 3 caracteres';
                        } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.name)) {
                            errors.name = 'El nombre solo puede contener letras';
                        }
                        return errors;
                    }}
                    onSubmit={(values, { resetForm }) => {
                        saveDepartment(values);
                        resetForm();

                        // if (values) {
                        //     department.companyId = 1;
                        //     if (department.companyId === null) { values.companyId = 1 } else { values.companyId = department.companyId }
                        //     if (department.id) {
                        //         if (selectedStatus?.code === true) { values.status = true }
                        //         else if (selectedStatus?.code === false) { values.status = false } else { values.status = department.status }

                        //         updateDepartment(department.id, values);
                        //         setDepartmentDialog(false);
                        //         setUpdateStatusDialog(false);
                        //         setDepartment(emptyDepartment);
                        //         resetForm();
                        //     } else {
                        //         createDepartment(values);
                        //         setDepartmentDialog(false);
                        //         setUpdateStatusDialog(false);
                        //         setDepartment(emptyDepartment);
                        //         resetForm();
                        //     }
                        // } else {
                        //     toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Departamento no registrado', life: 5000 });
                        // }
                    }}
                >
                    {({ values, errors, touched, dirty, isValid, handleChange, handleBlur }) => (
                        <Form>
                            <div className="field">
                                <label htmlFor="name" className="font-bold">Nombre del Departamento</label>
                                <InputText id="name" name='name' type='text' autoFocus value={values.name} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.name && touched.name} />
                                <ErrorMessage name="name" component={() => (<small className="p-error">{errors.name}</small>)} />
                            </div>
                            <div className="field">
                                <label htmlFor="description" className="font-bold">Descripción</label>
                                <InputTextarea id="description" name='description' autoResize rows={1} value={values.description || ''} onChange={handleChange} onBlur={handleBlur} />
                                <ErrorMessage name="description" component={() => (<small className="p-error">{errors.description}</small>)} />
                            </div>

                            <div className="field">
                                {department.id ? (
                                    <>
                                        <label htmlFor="updates" className="font-bold mt-3">
                                            Actualizaciones
                                        </label>
                                        <div className="flex flex-wrap justify-content-start gap-3 mt-2">

                                            <div className="flex align-items-center mb-3">
                                                <Checkbox inputId="e2" name="e2" value="e2" onChange={onEstadosChange} checked={estados.includes('e2')} />
                                                <label htmlFor="checkbox Password" className="ml-2">
                                                    Estado
                                                </label>
                                            </div>

                                        </div>

                                        {estados.includes('e2') ? (
                                            <>
                                                <label htmlFor="status" className="font-bold my-3">
                                                    Estado
                                                </label>
                                                <Dropdown value={selectedStatus} onChange={(e: DropdownChangeEvent) => setSelectedStatus(e.value)} options={typeStatus} optionLabel="name" placeholder="Selecciona un estado" className="w-full" autoFocus />
                                            </>
                                        ) : (<></>)}

                                        <div className="field">
                                            <label className="mb-3 mt-5 font-bold">Otros Datos</label>
                                            <div className="formgrid grid">
                                                <div className="col-12">
                                                    <div className="card flex flex-wrap gap-2 justify-content-evenly">
                                                        {/* <Chip label={`${department.company?.business_name}`} className="text-lg font-bold uppercase" /> */}
                                                        <Tag className="text-sm font-bold" value={`ESTADO ${getDatoStatus(department)}`} severity={getSeverity(department)}></Tag>
                                                        <Chip label={`Creado el: ${new Date(department.createdAt).toLocaleDateString()} - ${new Date(department.createdAt).toLocaleTimeString()}`} className='text-md font-bold' />
                                                        <Chip label={`Ultima Actualización: ${new Date(department.updatedAt).toLocaleDateString()} - ${new Date(department.updatedAt).toLocaleTimeString()}`} className='text-md font-bold' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (<></>)}
                            </div>
                            <div className="field flex mt-7 mb-0 align-content-between justify-content-between">
                                <Button label="Cancelar" type='button' icon="pi pi-times" outlined onClick={hideDialog} className='mx-1' />
                                {/* {department.id && (selectedStatus?.code === false) ? (
                                    <Button label="Guardar Departamento" type='button' icon="pi pi-check"  onClick={confirmChangeStatusDepartment} className='nx-1' disabled={department.id ? false : !(isValid && dirty)} />
                                ) : ( */}
                                    <Button label="Guardar Departamento" icon="pi pi-check" type='submit' className='mx-1' disabled={department.id ? false : !(isValid && dirty)} />
                                 {/* )} */}
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            {/* //? -------------------- MODAL DIALOG (DELETE) ------------------- */}
            <Dialog visible={deleteDepartmentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteDepartmentDialogFooter} onHide={hideDeleteDepartmentDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {department && (
                        <span>
                            ¿Estas seguro que deseas eliminar el departamento: <b className="font-bold">{department.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            {/* //? -------------------- MODAL DIALOG (CHANGE STATUS) ------------------- */}
            {/* <Dialog visible={updateStatusDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Advertencia" modal footer={changeStatusDepartmentDialogFooter} onHide={hideChangeStatusDepartmentDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {department && (
                        <span>
                            Todas las areas pertenecientes a este departamento seran inhabilitados. ¿Estas seguro que deseas deshabilitar el departamento: <b className="font-bold">{department.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog> */}
        </div >

    );
}