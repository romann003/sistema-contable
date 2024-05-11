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
import { useAreas } from '../../api/context/AreaContext';
import { useDepartments } from '../../api/context/DepartmentContext';
import { Chip } from 'primereact/chip';
import { Checkbox } from "primereact/checkbox";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';
import { DataTableFilterMeta } from 'primereact/datatable';




interface Area {
    id: number | null;
    name: string;
    description: string;
    salary: number | null;
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

export default function AreasPage() {
    let emptyArea: Area = {
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

    const { departments, getDepartments } = useDepartments();
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');

    const { areas, getAreas, createArea, deleteArea, updateArea, setAreas, errors: areaErrors } = useAreas();
    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const [areaDialog, setAreaDialog] = useState<boolean>(false);
    const [deleteAreaDialog, setDeleteAreaDialog] = useState<boolean>(false);
    const [area, setArea] = useState<Area>(emptyArea);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Area[]>>(null);
    const [estados, setEstados] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        description: { value: null, matchMode: FilterMatchMode.CONTAINS },
        salary: { value: null, matchMode: FilterMatchMode.EQUALS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        'department.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
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
                <h4 className="m-0">Lista de Areas (Cargos)</h4>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
                </IconField>
            </div>
        );
    };

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

    const header = renderHeader();


    useEffect(() => {
        getAreas()
        getDepartments();
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
        setArea(emptyArea);
        setSubmitted(false);
        setAreaDialog(true);
    };

    const hideDialog = () => {
        setEstados([]);
        setSelectedStatus(null);
        setSelectedDepartment(null);
        setSubmitted(false);
        setAreaDialog(false);
    };

    const hideDeleteAreaDialog = () => {
        setDeleteAreaDialog(false);
    };

    const saveArea = () => {
        console.log(areaErrors)
        if (areaErrors.length > 0) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Revise los campos', life: 3000 });
            return;
        } else {
            setSubmitted(true);
            if (area.id) {
                if (area.name.trim() && area.salary !== null) {
                    let _areas = [...areas];
                    let _area = { ...area };

                    const index = findIndexById(area.id);
                    _areas[index] = _area;
                    if (selectedStatus?.code === true) {
                        _area.status = true
                    } else if (selectedStatus?.code === false) { _area.status = false } else { _area.status = area.status }
                    // if (area.departmentId === null) { _area.departmentId = 1 } else { _area.departmentId = area.departmentId }
                    if (selectedDepartment !== null) { _area.departmentId = selectedDepartment.id } else { _area.departmentId = area.departmentId }
                    updateArea(area.id, _area);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Area Updated', life: 3000 });
                    setAreaDialog(false);
                    setArea(emptyArea);
                }
            } else {
                if (area.name.trim()) {
                    let _areas = [...areas];
                    let _area = { ...area };
                    if (selectedDepartment !== null) { _area.departmentId = selectedDepartment.id } else { _area.departmentId = area.departmentId }

                    _areas.push(_area);
                    createArea(_area);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Area Created', life: 3000 });

                    setAreaDialog(false);
                    setArea(emptyArea);
                }
            }
        }




    };

    const editArea = (area: Area) => {
        setArea({ ...area });
        setAreaDialog(true);
    };

    const confirmDeleteArea = (area: Area) => {
        setArea(area);
        setDeleteAreaDialog(true);
    };

    const deleteAreaModal = () => {
        let _areas = areas.filter((val) => val.id !== area.id);
        // setAreas(areas.filter((val) => val.id !== area.id));

        deleteArea(area.id);
        setAreas(_areas);
        setDeleteAreaDialog(false);
        setArea(emptyArea);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Area Deleted', life: 3000 });
    };

    const findIndexById = (id: number) => {
        let index = -1;

        for (let i = 0; i < areas.length; i++) {
            if (areas[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _area = { ...area };
        // @ts-ignore
        _area[name] = val;

        setArea(_area);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value ?? 0;
        let _area = { ...area };

        // @ts-ignore
        _area[name] = val;

        setArea(_area);
    };

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

    const areaDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar Area" icon="pi pi-check" onClick={saveArea} />
        </React.Fragment>
    );
    const deleteAreaDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteAreaDialog} />
            <Button label="Si, eliminar" icon="pi pi-check" severity="danger" onClick={deleteAreaModal} />
        </React.Fragment>
    );

    const showInfo = (severity, summary, detail) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
        toast.current?.clear;
    }

    return (
        <div>
            <Toast ref={toast} />

            {areaErrors.map((error, i) => (
                <div key={i}>
                    {showInfo('error', 'Error', error)}
                </div>
            ))}
            <div className="card">
                <h3>Areas (Cargos)</h3>
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                <DataTable ref={dt} dataKey="id" value={areas} filters={filters} loading={loading}
                    paginator rows={15} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} areas (cargos)"
                    // rowsPerPageOptions={[5, 10, 25]}
                    globalFilterFields={['name', 'description', 'salary', 'department.name', 'status']} header={header} emptyMessage="No se encontraron areas."
                    filterDisplay="row"
                >

                    <Column header="ID" body={(rowData) => <span>{areas.indexOf(rowData) + 1}</span>} />
                    <Column sortable field="name" header="NOMBRE" filter filterPlaceholder="Buscar por nombre" style={{ minWidth: '12rem' }} />
                    <Column sortable header="DESCRIPCION" filterField="description" style={{ minWidth: '12rem' }} body={desBodyTemplate} filter filterPlaceholder="Busar por descripcion" />
                    <Column sortable header="SALARIO" filterField="salary" style={{ minWidth: '8rem' }} body={salaryBodyTemplate} filter filterPlaceholder="Busar por salario" />
                    <Column field="status" header="ESTADO" style={{ minWidth: '4rem' }} body={statusBodyTemplate} sortable />
                    <Column style={{ minWidth: '12rem' }} header="DEPARTAMENTO" body={(rowData) => <Chip className='font-bold uppercase' label={`${rowData.department.name}`} />} />
                    <Column style={{ minWidth: '12rem' }} header="CREADO EL" body={(rowData) => <Chip className='font-bold' label={`${new Date(rowData.createdAt).toLocaleDateString()} - ${new Date(rowData.createdAt).toLocaleTimeString()}`} />} />
                    <Column style={{ minWidth: '12rem' }} header="ULTIMA ACTUALIZACION" body={(rowData) => <Chip className='font-bold' label={`${new Date(rowData.updatedAt).toLocaleDateString()} - ${new Date(rowData.updatedAt).toLocaleTimeString()}`} />} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={areaDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles del Area" modal className="p-fluid" footer={areaDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nombre del Area o Cargo *
                    </label>

                    <InputText id="name" value={area.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !area.name })} />
                    {submitted && !area.name && <small className="p-error">El nombre es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Descripción
                    </label>
                    <InputText id="description" value={area.description || ''} onChange={(e) => onInputChange(e, 'description')} required autoFocus />
                </div>
                <div className="field">
                    <label htmlFor="salary" className="font-bold">
                        Salario base *
                    </label>
                    <InputNumber id="salary" value={area.salary} onValueChange={(e) => onInputNumberChange(e, 'salary')} mode="currency" currency="GTQ" locale="en-US" />
                    {submitted && !area.salary && <small className="p-error">El salario base es requerido.</small>}
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
                                    <Dropdown value={selectedStatus} onChange={(e: DropdownChangeEvent) => setSelectedStatus(e.value)} options={typeStatus} optionLabel="name" placeholder="Selecciona un estado" className="w-full" autoFocus />
                                </>
                            ) : (<></>)}

                            {estados.includes('e3') ? (
                                <>
                                    <label htmlFor="department" className="font-bold my-3">
                                        Departamento
                                    </label>
                                    <Dropdown value={selectedDepartment} onChange={(e: DropdownChangeEvent) => setSelectedDepartment(e.value)} options={departments} optionLabel="name" placeholder="Selecciona un Nuevo Departamento" className="w-full" />
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
                            <label htmlFor="department" className="font-bold my-3">
                                Departamento
                            </label>
                            <Dropdown id="department" value={selectedDepartment} onChange={(e: DropdownChangeEvent) => setSelectedDepartment(e.value)} options={departments} optionLabel="name" placeholder="Selecciona un Departamento" className={classNames({ 'w-full p-invalid': submitted && !area.department })} required/>
                            {submitted && !area.department && <small className="p-error">El departamento es requerido.</small>}
                        </>
                    )}
                </div>


                {/* <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Description
                    </label>
                    <InputTextarea id="description" value={area.description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onInputTextAreaChange(e, 'description')} required rows={3} cols={20} />
                </div>
                <div className="field">
                    <label className="mb-3 font-bold">Category</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={area.category === 'Accessories'} />
                            <label htmlFor="category1">Accessories</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={area.category === 'Clothing'} />
                            <label htmlFor="category2">Clothing</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={area.category === 'Electronics'} />
                            <label htmlFor="category3">Electronics</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={area.category === 'Fitness'} />
                            <label htmlFor="category4">Fitness</label>
                        </div>
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            Price
                        </label>
                        <InputNumber id="price" value={area.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">
                            Quantity
                        </label>
                        <InputNumber id="quantity" value={area.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                    </div>
                </div> */}
            </Dialog>

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