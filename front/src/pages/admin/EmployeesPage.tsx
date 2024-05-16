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
import { useDepartments } from '../../api/context/DepartmentContext';
import { useAreas } from '../../api/context/AreaContext';

interface Area {
    id: number | null;
    name: string;
    description: string;
    salary: string | null;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    department: string | null;
    departmentId: number | null;
}
interface Status {
    name: string;
    code: boolean;
}

export default function EmployeesPage() {

    //? -------------------- INITIAL STATES -------------------
    const emptyArea: Area = {
        id: null,
        name: '',
        description: '',
        salary: null,
        status: true,
        createdAt: '',
        updatedAt: '',
        department: '',
        departmentId: null,
    };

    const typeStatus: Status[] = [
        { name: 'Activo', code: true },
        { name: 'Inactivo', code: false }
    ];

    //? -------------------- CONTEXT API -------------------
    const { departments, getDepartments } = useDepartments();
    const { areas, getAreas, createArea, deleteArea, updateArea, setAreas, errors: areaErrors } = useAreas();
    //? -------------------- STATES -------------------
    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const [estados, setEstados] = useState<string[]>([]);
    const [area, setArea] = useState<Area>(emptyArea);
    const toast = useRef<Toast>(null);
    //? -------------------- DIALOG STATES -------------------
    const [areaDialog, setAreaDialog] = useState<boolean>(false);
    const [deleteAreaDialog, setDeleteAreaDialog] = useState<boolean>(false);
    //? -------------------- DATATABLE STATES -------------------
    const dt = useRef<DataTable<Area[]>>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        description: { value: null, matchMode: FilterMatchMode.CONTAINS },
        salary: { value: null, matchMode: FilterMatchMode.EQUALS },
        'department.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
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
                <h4 className="m-0">Lista de Areas (Cargos)</h4>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
                </IconField>
            </div>
        );
    };

    //? -------------------- DATATABLE INPUT TEMPLATES -------------------
    const desBodyTemplate = (rowData: Area) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.description}</span>
            </div>
        );
    };

    const salaryBodyTemplate = (rowData: Area) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.salary}</span>
            </div>
        );
    };

    const departmentBodyTemplate = (rowData: Area) => {
        return (
            <div className="flex align-items-center gap-2">
                <span className='bg-gray-200 border-round-3xl px-3 py-2 uppercase font-bold'>{rowData.department.name}</span>
            </div>
        );
    };

    //? -------------------- LOADING DATA -------------------
    const header = renderHeader();
    useEffect(() => {
        getAreas()
        getDepartments();
        setLoading(false);
    }, []);



    //? -------------------- MODAL DIALOGS -------------------
    const openNew = () => {
        setArea(emptyArea);
        setAreaDialog(true);
    };

    const hideDialog = () => {
        setEstados([]);
        setSelectedStatus(null);
        setAreaDialog(false);
    };

    const editArea = (area: Area) => {
        setArea({ ...area });
        setAreaDialog(true);
    };

    const hideDeleteAreaDialog = () => {
        setDeleteAreaDialog(false);
    };

    const confirmDeleteArea = (area: Area) => {
        setArea(area);
        setDeleteAreaDialog(true);
    };

    const deleteAreaModal = () => {
        deleteArea(area.id);
        setDeleteAreaDialog(false);
        setArea(emptyArea);
    };

    //? -------------------- DTATABLE ACTIONS -------------------
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Agregar Area" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const statusBodyTemplate = (rowData: Area) => {
        return <Tag className="text-sm font-bold" value={getDatoStatus(rowData)} severity={getSeverity(rowData)}></Tag>;
    };

    const actionBodyTemplate = (rowData: Area) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editArea(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteArea(rowData)} />
            </React.Fragment>
        );
    };

    const getDatoStatus = (area: Area) => {
        switch (area.status) {
            case true:
                return 'ACTIVO';

            case false:
                return 'INACTIVO';

            default:
                return null;
        }
    };

    const getSeverity = (area: Area) => {
        switch (area.status) {
            case true:
                return 'success';

            case false:
                return 'danger';

            default:
                return null;
        }
    };


    //? -------------------- MODAL BUTTONS -------------------
    const deleteAreaDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteAreaDialog} />
            <Button label="Si, eliminar" icon="pi pi-check" severity="danger" onClick={deleteAreaModal} />
        </React.Fragment>
    );

    //? -------------------- RENDER -------------------
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <h3>Areas (Cargos)</h3>
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                {/* //? -------------------- DATATABLE ------------------- */}
                <DataTable ref={dt} dataKey="id" value={areas} filters={filters} loading={loading}
                    paginator rows={15} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} areas (cargos)"
                    // rowsPerPageOptions={[5, 10, 25]}
                    globalFilterFields={['name', 'description', 'salary', 'department.name']} header={header} emptyMessage="No se encontraron areas."
                    filterDisplay="row"
                >

                    <Column header="ID" body={(rowData) => <span>{areas.indexOf(rowData) + 1}</span>} />
                    <Column sortable field="name" header="NOMBRE" filter filterPlaceholder="Filtrar por nombre" style={{ minWidth: '12rem' }} />
                    <Column sortable field="description" header="DESCRIPCION" filterField="description" style={{ minWidth: '12rem' }} body={desBodyTemplate} filter filterPlaceholder="Filtrar por descripcion" />
                    <Column sortable field="salary" header="SALARIO" filterField="salary" style={{ minWidth: '8rem' }} body={salaryBodyTemplate} filter filterPlaceholder="Filtrar por salario" />
                    <Column sortable field="department.name" header="DEPARTAMENTO" filterField="department.name" style={{ minWidth: '8rem' }} body={departmentBodyTemplate} filter filterPlaceholder="Filtrar por departamento" />
                    <Column field="status" header="ESTADO" style={{ minWidth: '4rem' }} body={statusBodyTemplate} sortable />
                    <Column style={{ minWidth: '12rem' }} header="CREADO EL" body={(rowData) => <Chip className='font-bold' label={`${new Date(rowData.createdAt).toLocaleDateString()} - ${new Date(rowData.createdAt).toLocaleTimeString()}`} />} />
                    <Column style={{ minWidth: '12rem' }} header="ULTIMA ACTUALIZACION" body={(rowData) => <Chip className='font-bold' label={`${new Date(rowData.updatedAt).toLocaleDateString()} - ${new Date(rowData.updatedAt).toLocaleTimeString()}`} />} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
                </DataTable>
            </div>

            {/* //? -------------------- MODAL DIALOG (CREATE AND UPDATE) ------------------- */}
            <Dialog visible={areaDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles del Area" modal className="p-fluid" onHide={hideDialog}>
                <Formik
                    initialValues={{ name: '' || area.name, description: '' || area.description, salary: '' || area.salary, department: '' }}
                    validate={values => {
                        const errors = {};
                        if (!values.name) {
                            errors.name = 'El nombre es requerido';
                        } else if (values.name.length < 3) {
                            errors.name = 'El nombre debe tener al menos 3 caracteres';
                        } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.name)) {
                            errors.name = 'El nombre solo puede contener letras';
                        }
                        if (!values.salary) {
                            errors.salary = 'El salario es requerido';
                        } else if (values.salary <= 0) {
                            errors.salary = 'El salario debe ser mayor a 0';
                        } else if (!/^[0-9]+(\.[0-9]+)?$/.test(values.salary)) {
                            errors.salary = 'El salario solo puede contener números y un punto decimal opcional';
                        }
                        if (!area.id) {
                            if (!values.department) {
                                errors.department = 'El departamento es requerido';
                            }
                        }
                        return errors;
                    }}
                    onSubmit={(values, { resetForm }) => {

                        if (values) {
                            if (area.id) {

                                if (selectedStatus?.code === true) { values.status = true }
                                else if (selectedStatus?.code === false) { values.status = false } else { values.status = area.status }
                                if (values.department !== "") { values.departmentId = values.department.id } else { values.departmentId = area.departmentId }
                                updateArea(area.id, values);
                                setAreaDialog(false);
                                setArea(emptyArea);
                                resetForm();
                            } else {
                                values.departmentId = values.department.id
                                createArea(values);
                                setAreaDialog(false);
                                setArea(emptyArea);
                                resetForm();
                            }

                        } else {
                            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Area no registrada', life: 5000 });
                        }
                    }}
                >
                    {({ values, errors, touched, dirty, isValid, handleChange, handleBlur }) => (
                        <Form>
                            <div className="field">
                                <label htmlFor="name" className="font-bold">Nombre del Area o Cargo *</label>
                                <InputText id="name" name='name' type='text' value={values.name} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.name && touched.name} />
                                <ErrorMessage name="name" component={() => (<small className="p-error">{errors.name}</small>)} />
                            </div>
                            <div className="field">
                                <label htmlFor="description" className="font-bold">Descripción</label>
                                <InputTextarea id="description" name='description' autoResize rows={1} value={values.description || ''} onChange={handleChange} onBlur={handleBlur} />
                                <ErrorMessage name="description" component={() => (<small className="p-error">{errors.description}</small>)} />
                            </div>
                            <div className="field">
                                <label htmlFor="salary" className="font-bold">Salario base *</label>
                                <InputText id="salary" name='salary' type='number' value={values.salary || ''} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.salary && touched.salary} />
                                <ErrorMessage name="salary" component={() => (<small className="p-error">{errors.salary}</small>)} />
                            </div>
                            <div className="field">
                                {area.id ? (
                                    <>
                                        <label htmlFor="updates" className="font-bold mt-3">
                                            Actualizaciones
                                        </label>
                                        <div className="flex flex-wrap justify-content-evenly gap-3 mt-2">
                                            <div className="flex align-items-center mb-3">
                                                <Checkbox inputId="e2" name="e2" value="e2" onChange={onEstadosChange} checked={estados.includes('e2')} />
                                                <label htmlFor="checkbox Estado" className="ml-2">
                                                    Estado
                                                </label>
                                            </div>
                                            <div className="flex align-items-center mb-3">
                                                <Checkbox inputId="e3" name="e3" value="e3" onChange={onEstadosChange} checked={estados.includes('e3')} />
                                                <label htmlFor="checkbox Departamento" className="ml-2">
                                                    Departamento
                                                </label>
                                            </div>
                                        </div>
                                        {estados.includes('e2') ? (
                                            <>
                                                <label htmlFor="status" className="font-bold my-3">
                                                    Estado
                                                </label>
                                                <Dropdown value={selectedStatus} onChange={(e: DropdownChangeEvent) => setSelectedStatus(e.value)} options={typeStatus} optionLabel="name" placeholder="Selecciona un estado" className="w-full uppercase" emptyMessage="No se encontraron estados" />
                                            </>
                                        ) : (<></>)}

                                        {estados.includes('e3') ? (
                                            <>
                                                <label htmlFor="department" className="font-bold my-3">Departamento</label>
                                                <Dropdown id="department" name="department" value={values.department} onChange={handleChange} onBlur={handleBlur} options={departments} optionLabel="name" placeholder="Selecciona un Departamento" emptyMessage="No se encontraron departamentos" className="w-full uppercase" />
                                            </>
                                        ) : (<></>)}


                                        <div className="field">
                                            <label className="mb-3 mt-5 font-bold">Otros Datos</label>
                                            <div className="formgrid grid">
                                                <div className="col-12">
                                                    <div className="card flex flex-wrap gap-2 justify-content-evenly">
                                                        <Chip label={`${area.department?.name}`} className="text-lg font-bold uppercase" />
                                                        <Tag className="text-sm font-bold" value={`ESTADO ${getDatoStatus(area)}`} severity={getSeverity(area)}></Tag>
                                                        <Chip label={`Creado el: ${new Date(area.createdAt).toLocaleDateString()} - ${new Date(area.createdAt).toLocaleTimeString()}`} className='text-md font-bold' />
                                                        <Chip label={`Ultima Actualización: ${new Date(area.updatedAt).toLocaleDateString()} - ${new Date(area.updatedAt).toLocaleTimeString()}`} className='text-md font-bold' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <label htmlFor="department" className="font-bold my-3">Departamento</label>
                                        <Dropdown id="department" name="department" value={values.department} onChange={handleChange} onBlur={handleBlur} options={departments} optionLabel="name" placeholder="Selecciona un Departamento" invalid={!!errors.department && touched.department} emptyMessage="No se encontraron departamentos" className="w-full uppercase"/>
                                        <ErrorMessage name="department" component={() => (<small className="p-error">{errors.department}</small>)} />

                                    </>
                                )}
                            </div>
                            <div className="field flex mt-7 mb-0 align-content-between justify-content-between">
                                <Button label="Cancelar" type='button' icon="pi pi-times" outlined onClick={hideDialog} className='mx-1' />
                                <Button label="Guardar Area" icon="pi pi-check" type='submit' className='mx-1' disabled={area.id ? false : !(isValid && dirty)} />
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            {/* //? -------------------- MODAL DIALOG (DELETE) ------------------- */}
            <Dialog visible={deleteAreaDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteAreaDialogFooter} onHide={hideDeleteAreaDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {area && (
                        <span>
                            ¿Estas seguro que deseas eliminar el area(cargo): <b className="font-bold">{area.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}