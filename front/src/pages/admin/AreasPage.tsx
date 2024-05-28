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
import { BreadCrumb } from 'primereact/breadcrumb';
import { MenuItem } from 'primereact/menuitem';
import { Link } from 'react-router-dom';

//? -------------------- COMPONENTES PERSONALIZADOS -------------------
import * as fI from '../../layout/components/FormComponent.js';
import * as cdT from '../../layout/components/ColumnBody.js';
import * as m from '../../layout/components/Modals.js';
import { BreadComp } from '../../layout/components/BreadComp.js';
import { Formulario } from '../../layout/elements/Formularios.js';
import DataTableCrud from '../../layout/components/DataTableCrud.js';
import { Divider } from 'primereact/divider';

//? -------------------- DEFINICION DE CAMPOS -------------------
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

const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    description: { value: null, matchMode: FilterMatchMode.CONTAINS },
    salary: { value: null, matchMode: FilterMatchMode.EQUALS },
    'department.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
}

export default function AreasPage() {

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
    const { departments, getActiveDepartments } = useDepartments();
    const { areas, getAreas, createArea, deleteArea, updateArea } = useAreas();
    //? -------------------- STATES -------------------
    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [estados, setEstados] = useState<string[]>([]);
    const [area, setArea] = useState<Area>(emptyArea);
    const toast = useRef<Toast>(null);
    //? -------------------- DIALOG STATES -------------------
    const [areaDialog, setAreaDialog] = useState<boolean>(false);
    const [deleteDialog, setDeleteAreaDialog] = useState<boolean>(false);
    //? -------------------- DATATABLE STATES -------------------
    const dt = useRef<DataTable<Area[]>>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
    const [loading, setLoading] = useState<boolean>(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const onEstadosChange = (e: CheckboxChangeEvent) => {
        const _estados = [...estados];

        if (e.checked)
            _estados.push(e.value);
        else
            _estados.splice(_estados.indexOf(e.value), 1);

        setEstados(_estados);
    }

    //? -------------------- DATATABLE COLUMN TEMPLATES -------------------
    const puestoBodyTemplate = (rowData: Area) => {
        return <cdT.ColumnTextBody value={rowData.name} />;
    };

    const descripcionBodyTemplate = (rowData: Area) => {
        return <cdT.ColumnTextBody value={rowData.description} />;
    };

    const salaryBodyTemplate = (rowData: Area) => {
        return <cdT.ColumnTextBody value={rowData.salary} />;
    };

    const departmentBodyTemplate = (rowData: Area) => {
        return <cdT.ColumnChipBody value={rowData.department.name} />;
    };

    const statusBodyTemplate = (rowData: Area) => {
        return <cdT.ColumnStatusBody value={rowData} />;
    };

    const createdAtBodyTemplate = (rowData: Area) => {
        return <cdT.ColumnDateBody value={rowData.createdAt} />
    };

    const updatedAtBodyTemplate = (rowData: Area) => {
        return <cdT.ColumnDateBody value={rowData.updatedAt} />
    };

    const actionBodyTemplate = (rowData: Area) => {
        return (
            <React.Fragment>
                <div className="flex align-align-content-center justify-content-evenly">
                    <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editArea(rowData)} />
                    <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteArea(rowData)} />
                </div>
            </React.Fragment>
        );
    };


    //? -------------------- DATA LOADING -------------------
    useEffect(() => {
        getAreas()
        getActiveDepartments();
        setLoading(false);
    }, [area]);



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

    const hideDeleteDialog = () => {
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

    //? -------------------- MODAL BUTTONS -------------------
    const deleteDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
            <Button label="Si, eliminar" icon="pi pi-check" severity="danger" onClick={deleteAreaModal} />
        </React.Fragment>
    );

    //? -------------------- RENDER -------------------
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <h3>Puestos</h3>
                <BreadComp texto="Puestos" />

                {/* //? -------------------- DATATABLE ------------------- */}
                <DataTableCrud
                    dtSize="small"
                    buscador={true}
                    btActive={true}
                    btnSize="small"
                    btnColor="primary"
                    btnText="Agregar Puesto"
                    openNew={openNew}
                    //? -------------------- HEADER -------------------
                    message="Puestos"
                    headerMessage=""
                    refe={dt}
                    value={areas}
                    filters={filters}
                    loading={loading}
                    setFilters={setFilters}
                    setGlobalFilterValue={setGlobalFilterValue}
                    globalFilterValue={globalFilterValue}
                    globalFilterFields={['name', 'description', 'salary', 'department.name']}
                    //? -------------------- COLUMNS -------------------
                    columns={[
                        { field: 'name', header: 'Puesto', body: puestoBodyTemplate, dataType: 'text', filter: true },
                        { field: 'description', header: 'Descripción', body: descripcionBodyTemplate, dataType: 'text', filter: true },
                        { field: 'salary', header: 'Salario Base', body: salaryBodyTemplate, dataType: 'numeric', filter: true },
                        { field: 'department.name', header: 'Departamento', body: departmentBodyTemplate, dataType: 'text', filter: true },
                        { field: 'status', header: 'Estado', body: statusBodyTemplate, dataType: 'boolean', filter: false },
                        { field: 'createdAt', header: 'Creado el', body: createdAtBodyTemplate, dataType: 'date', filter: false },
                        { field: 'updatedAt', header: 'Ultima Actualizacion', body: updatedAtBodyTemplate, dataType: 'date', filter: false }
                    ]}
                    size="15rem"
                    actionBodyTemplate={actionBodyTemplate}
                />
            </div>

            {/* //? -------------------- MODAL DIALOG (CREATE AND UPDATE) ------------------- */}
            <Dialog visible={areaDialog} style={{ width: '32rem', minWidth: '50rem', maxWidth: '60vw', height: '42rem', minHeight: '40rem', maxHeight: '90vh' }} breakpoints={{ '960px': '70vw', '641px': '90vw' }} header="Detalles del Puesto" modal className="p-fluid" onHide={hideDialog}>
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
                            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Puesto no registrada', life: 5000 });
                        }
                    }}
                >
                    {({ values, errors, touched, dirty, isValid, handleChange, handleBlur }) => (
                        <Form style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ flex: 1, overflow: 'auto' }}>
                                <Formulario>
                                    <div className="grid mx-0">
                                        <fI.InputT
                                            col={6}
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Ingrese el nombre del puesto"
                                            label="Nombre del Puesto"
                                            span="*"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            invalid={!!errors.name && touched.name}
                                            errorText={errors.name}
                                        />

                                        <fI.InputT
                                            col={6}
                                            id="salary"
                                            name="salary"
                                            type="number"
                                            placeholder="Ingrese el sueldo base para este puesto"
                                            label="Sueldo Base"
                                            span="*"
                                            value={values.salary}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            invalid={!!errors.salary && touched.salary}
                                            errorText={errors.salary}
                                        />
                                        <fI.TextArea
                                            col={6}
                                            id="description"
                                            name="description"
                                            placeholder="Ingrese una descripción"
                                            label="Descripción"
                                            span=""
                                            value={values.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            invalid={!!errors.description && touched.description}
                                            errorText={errors.description}
                                        />

                                        <fI.DropDownD
                                            col={6}
                                            id="department"
                                            name="department"
                                            placeholder="Seleccione un departamento"
                                            label="Departamento"
                                            value={values.department}
                                            optionLabel={(option) => `${option.name}`}
                                            emptyMessage="No se encontraron departamentos"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            options={departments}

                                            span={!area.id ? "*" : ""}
                                            invalid={!area.id ? !!errors.department && touched.department : false}
                                            errorText={!area.id ? errors.department : ""}

                                            disabled={false}
                                        />

                                        {area.id ? (
                                            <>
                                                <Divider align="center" className='my-5'>
                                                    <span className="p-tag">Otras Actualizaciones</span>
                                                </Divider>
                                                <fI.DropDownD
                                                    col={12}
                                                    id="status"
                                                    name="status"
                                                    placeholder="Seleccione un estado"
                                                    label="Estado"
                                                    value={selectedStatus}
                                                    optionLabel={(option) => `${option.name}`}
                                                    emptyMessage="No se encontraron departamentos"
                                                    onChange={(e: DropdownChangeEvent) => setSelectedStatus(e.value)}
                                                    onBlur={false}
                                                    options={typeStatus}

                                                    span={""}
                                                    invalid={false}
                                                    errorText={""}
                                                    disabled={false}
                                                />

                                                {/* <label htmlFor="status" className="font-bold my-3">Estado</label>
                                                    <Dropdown value={selectedStatus} onChange={(e: DropdownChangeEvent) => setSelectedStatus(e.value)} options={typeStatus} optionLabel="name" placeholder="Selecciona un estado" className="w-full uppercase" emptyMessage="No se encontraron estados" /> */}

                                                <div className="col-12 field">
                                                    <label className="mb-3 mt-5 font-bold">Otros Datos</label>
                                                    <div className="formgrid grid">
                                                        <div className="col-12">
                                                            <div className="card flex flex-wrap gap-2 justify-content-between">
                                                                <cdT.ColumnStatusBody value={area} />
                                                                <label>
                                                                    <b>Departamento: </b>
                                                                    <cdT.ColumnTextBody value={area.department.name} />
                                                                </label>
                                                                <label>
                                                                    <b>Creado el: </b>
                                                                    <cdT.ColumnDateBodyText value={area.createdAt} className={"font-bold"} />
                                                                </label>
                                                                <label>
                                                                    <b>Ultima Actualización: </b>
                                                                    <cdT.ColumnDateBodyText value={area.updatedAt} className={"font-bold"} />
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (<></>)}
                                    </div>

                                </Formulario>
                            </div>

                            <div className="flex mb-0 pt-3">
                                <Button label="Cancelar" type='button' icon="pi pi-times" outlined onClick={hideDialog} className='mx-1' />
                                <Button label="Guardar Puesto" icon="pi pi-check" type='submit' className='mx-1' disabled={area.id ? false : !(isValid && dirty)} />
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            {/* //? -------------------- MODAL DIALOG (DELETE) ------------------- */}
            <m.DeleteModal
                visible={deleteDialog}
                header="Confirmar"
                data={area}
                message1="¿Estas seguro que deseas eliminar el puesto: "
                message1Bold={<cdT.ColumnTextBodyWithClass value={area.name} className={'text-primary'}/>}
                message2={""}
                message2Bold={""}
                footer={deleteDialogFooter}
                onHide={hideDeleteDialog}
            ></m.DeleteModal>
        </div>
    );
}