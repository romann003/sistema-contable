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
import { useDepartments } from '../../api/context/DepartmentContext';
import { Chip } from 'primereact/chip';
import { Checkbox } from "primereact/checkbox";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';







import { FilterMatchMode } from 'primereact/api';
import { DataTableFilterMeta } from 'primereact/datatable';




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
    let emptyDepartment: Department = {
        id: null,
        name: '',
        description: '',
        status: true,
        createdAt: '',
        updatedAt: '',
        company: '',
        companyId: 1,
    };

    const typeStatus: Status[] = [
        { name: 'Activo', code: true },
        { name: 'Inactivo', code: false }
    ];

    const { departments, getDepartments, createDepartment, deleteDepartment, updateDepartment, setDepartments, errors: departmentErrors } = useDepartments();
    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const [departmentDialog, setDepartmentDialog] = useState<boolean>(false);
    const [deleteDepartmentDialog, setDeleteDepartmentDialog] = useState<boolean>(false);
    const [department, setDepartment] = useState<Department>(emptyDepartment);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Department[]>>(null);
    const [estados, setEstados] = useState<string[]>([]);












    const [loading, setLoading] = useState<boolean>(true);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        description: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        // @ts-ignore
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <h4 className="m-0">Lista de Departamentos</h4>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
            </div>
        );
    };

    const desBodyTemplate = (rowData: Department) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.description}</span>
            </div>
        );
    };

    const header = renderHeader();














    useEffect(() => {
        getDepartments()
        setLoading(false);

    }, []);


    const onEstadosChange = (e: CheckboxChangeEvent) => {
        let _estados = [...estados];

        if (e.checked)
            _estados.push(e.value);
        else
            _estados.splice(_estados.indexOf(e.value), 1);

        setEstados(_estados);
    }

    const openNew = () => {
        setDepartment(emptyDepartment);
        setSubmitted(false);
        setDepartmentDialog(true);
    };

    const hideDialog = () => {
        setEstados([]);
        setSelectedStatus(null);
        setSubmitted(false);
        setDepartmentDialog(false);
    };

    const hideDeleteDepartmentDialog = () => {
        setDeleteDepartmentDialog(false);
    };

    const saveDepartment = () => {
        console.log(departmentErrors)
        if (departmentErrors.length > 0) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Revise los campos', life: 3000 });
            return;
        } else {
            setSubmitted(true);
            department.companyId = 1;
            if (department.id) {
                if (department.name.trim()) {
                    let _departments = [...departments];
                    let _department = { ...department };

                    const index = findIndexById(department.id);
                    _departments[index] = _department;
                    if (selectedStatus?.code === true) {
                        _department.status = true
                    } else if (selectedStatus?.code === false) { _department.status = false } else { _department.status = department.status }
                    // if(department.description === null || department.description === '') { _department.description = '' } else { _department.description = department.description }
                    if (department.companyId === null) { _department.companyId = 1 } else { _department.companyId = department.companyId }
                    updateDepartment(department.id, _department);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Department Updated', life: 3000 });
                    setDepartmentDialog(false);
                    setDepartment(emptyDepartment);
                }
            } else {
                if (department.name.trim()) {
                    let _departments = [...departments];
                    let _department = { ...department };

                    _departments.push(_department);
                    createDepartment(_department);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Department Created', life: 3000 });

                    setDepartmentDialog(false);
                    setDepartment(emptyDepartment);
                }
            }
        }




    };

    const editDepartment = (department: Department) => {
        setDepartment({ ...department });
        setDepartmentDialog(true);
    };

    const confirmDeleteDepartment = (department: Department) => {
        setDepartment(department);
        setDeleteDepartmentDialog(true);
    };

    const deleteDepartmentModal = () => {
        let _departments = departments.filter((val) => val.id !== department.id);
        // setDepartments(departments.filter((val) => val.id !== department.id));

        deleteDepartment(department.id);
        setDepartments(_departments);
        setDeleteDepartmentDialog(false);
        setDepartment(emptyDepartment);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Department Deleted', life: 3000 });
    };

    const findIndexById = (id: number) => {
        let index = -1;

        for (let i = 0; i < departments.length; i++) {
            if (departments[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _department = { ...department };
        // @ts-ignore
        _department[name] = val;

        setDepartment(_department);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value ?? 0;
        let _department = { ...department };

        // @ts-ignore
        _department[name] = val;

        setDepartment(_department);
    };

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

    const departmentDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar Departamento" icon="pi pi-check" onClick={saveDepartment} />
        </React.Fragment>
    );
    const deleteDepartmentDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDepartmentDialog} />
            <Button label="Si, eliminar" icon="pi pi-check" severity="danger" onClick={deleteDepartmentModal} />
        </React.Fragment>
    );

    const showInfo = (severity, summary, detail) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
        toast.current?.clear;
    }

    return (
        <div>
            <Toast ref={toast} />

            {departmentErrors.map((error, i) => (
                <div key={i}>
                    {showInfo('error', 'Error', error)}
                </div>
            ))}
            <div className="card">
                <h3>Departamentos</h3>
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                <DataTable ref={dt} dataKey="id" value={departments} filters={filters} loading={loading}
                    paginator rows={15} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} departamentos"
                    // rowsPerPageOptions={[5, 10, 25]}
                    globalFilterFields={['name', 'description', 'status']} header={header} emptyMessage="No se encontraron departamentos."
                    filterDisplay="row"
                    >

                    <Column header="ID" body={(rowData) => <span>{departments.indexOf(rowData) + 1}</span>} />
                    <Column field="name" header="NOMBRE" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                    <Column header="DESCRIPCION" filterField="description" style={{ minWidth: '12rem' }} body={desBodyTemplate} filter filterPlaceholder="Search by department" />
                    <Column field="status" header="ESTADO" style={{ minWidth: '4rem' }} body={statusBodyTemplate} sortable />
                    {/* <Column style={{ minWidth: '12rem' }} header="EMPRESA" body={(rowData) => <Chip className='font-bold uppercase' label={`${rowData.company.business_name}`} />} /> */}
                    <Column style={{ minWidth: '12rem' }} header="CREADO EL" body={(rowData) => <Chip className='font-bold' label={`${new Date(rowData.createdAt).toLocaleDateString()} - ${new Date(rowData.createdAt).toLocaleTimeString()}`} />} />
                    <Column style={{ minWidth: '12rem' }} header="ULTIMA ACTUALIZACION" body={(rowData) => <Chip className='font-bold' label={`${new Date(rowData.updatedAt).toLocaleDateString()} - ${new Date(rowData.updatedAt).toLocaleTimeString()}`} />} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={departmentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles del Departamento" modal className="p-fluid" footer={departmentDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nombre del departamento *
                    </label>

                    <InputText id="name" value={department.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !department.name })} />
                    {submitted && !department.name && <small className="p-error">El nombre es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Descripción
                    </label>
                    <InputText id="description" value={department.description || ''} onChange={(e) => onInputChange(e, 'description')} required autoFocus />
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


                {/* <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Description
                    </label>
                    <InputTextarea id="description" value={department.description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onInputTextAreaChange(e, 'description')} required rows={3} cols={20} />
                </div>
                <div className="field">
                    <label className="mb-3 font-bold">Category</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={department.category === 'Accessories'} />
                            <label htmlFor="category1">Accessories</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={department.category === 'Clothing'} />
                            <label htmlFor="category2">Clothing</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={department.category === 'Electronics'} />
                            <label htmlFor="category3">Electronics</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={department.category === 'Fitness'} />
                            <label htmlFor="category4">Fitness</label>
                        </div>
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            Price
                        </label>
                        <InputNumber id="price" value={department.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">
                            Quantity
                        </label>
                        <InputNumber id="quantity" value={department.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                    </div>
                </div> */}
            </Dialog>

            <Dialog visible={deleteDepartmentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteDepartmentDialogFooter} onHide={hideDeleteDepartmentDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {department && (
                        <span>
                            ¿Estas seguro que deseas eliminar al usuario: <b className="font-bold">{department.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            {/* <Dialog visible={deleteUsersDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteUsersDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {department && <span>Are you sure you want to delete the selected userss?</span>}
                </div>
            </Dialog> */}
        </div>

    );
}