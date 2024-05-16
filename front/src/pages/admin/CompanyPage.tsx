import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';
import { FilterMatchMode } from 'primereact/api';
import { DataTableFilterMeta } from 'primereact/datatable';
import { Formik, Form, ErrorMessage } from 'formik';
import { InputTextarea } from 'primereact/inputtextarea';
import { useCompany } from '../../api/context/CompanyContext';
interface Company {
    id: number | null;
    business_name: string;
    nit: string | null;
    phone: string | null;
    address: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function CompanyPage() {

    //? -------------------- INITIAL STATES -------------------
    const emptyCompany: Company = {
        id: null,
        business_name: '',
        nit: null,
        phone: null,
        address: '',
        status: true,
        createdAt: '',
        updatedAt: ''
    };

    //? -------------------- CONTEXT API -------------------
    const { companies, getCompanies, updateCompany } = useCompany();
    //? -------------------- STATES -------------------
    const [company, setCompany] = useState<Company>(emptyCompany);
    const toast = useRef<Toast>(null);
    //? -------------------- DIALOG STATES -------------------
    const [companyDialog, setCompanyDialog] = useState<boolean>(false);
    //? -------------------- DATATABLE STATES -------------------
    const dt = useRef<DataTable<Company[]>>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        business_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nit: { value: null, matchMode: FilterMatchMode.CONTAINS },
        phone: { value: null, matchMode: FilterMatchMode.EQUALS },
        address: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const _filters = { ...filters };

        // @ts-ignore
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    //? -------------------- DTATABLE FUNCTIONS -------------------
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <h4 className="m-0">Todas mis Empresas</h4>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
                </IconField>
            </div>
        );
    };

    //? -------------------- DATATABLE INPUT TEMPLATES -------------------
    const businessBodyTemplate = (rowData: Company) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.business_name}</span>
            </div>
        );
    };

    const nitBodyTemplate = (rowData: Company) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.nit}</span>
            </div>
        );
    };

    const phoneBodyTemplate = (rowData: Company) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.phone}</span>
            </div>
        );
    };

    const addressBodyTemplate = (rowData: Company) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.address}</span>
            </div>
        );
    };

    const statusBodyTemplate = (rowData: Company) => {
        return <Tag className="text-sm font-bold" value={getDatoStatus(rowData)} severity={getSeverity(rowData)}></Tag>;
    };

    //? -------------------- LOADING DATA -------------------
    const header = renderHeader();
    useEffect(() => {
        getCompanies();
        setLoading(false);
    }, []);



    //? -------------------- MODAL DIALOGS -------------------
    const hideDialog = () => {
        setCompanyDialog(false);
    };

    const editCompany = (company: Company) => {
        setCompany({ ...company });
        setCompanyDialog(true);
    };

    //? -------------------- DTATABLE ACTIONS -------------------
        const actionBodyTemplate = (rowData: Company) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editCompany(rowData)} />
            </React.Fragment>
        );
    };

    const getDatoStatus = (company: Company) => {
        switch (company.status) {
            case true:
                return 'ACTIVO';

            case false:
                return 'INACTIVO';

            default:
                return null;
        }
    };

    const getSeverity = (company: Company) => {
        switch (company.status) {
            case true:
                return 'success';

            case false:
                return 'danger';

            default:
                return null;
        }
    };

    //? -------------------- RENDER -------------------
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <h3 className='mb-6'>Mi Empresa</h3>
                {/* //? -------------------- DATATABLE ------------------- */}
                <DataTable ref={dt} dataKey="id" value={companies} filters={filters} loading={loading}
                    paginator rows={15} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} empresas"
                    // rowsPerPageOptions={[5, 10, 25]}
                    globalFilterFields={['business_name', 'nit', 'phone', 'address']} header={header} emptyMessage="No se encontraron empresas."
                    filterDisplay="row"
                >
                    <Column header="ID" body={(rowData) => <span>{companies.indexOf(rowData) + 1}</span>} />
                    <Column sortable field='business_name' header="RAZON SOCIAL" filterField="business_name" style={{ minWidth: '12rem' }} body={businessBodyTemplate} filter filterPlaceholder="Filtrar por razon social" />
                    <Column sortable field='nit' header="NUMERO DE NIT" filterField="nit" style={{ minWidth: '12rem' }} body={nitBodyTemplate} filter filterPlaceholder="Filtrar por nit" />
                    <Column sortable field='phone' header="NUMERO DE TELEFONO" filterField="phone" style={{ minWidth: '12rem' }} body={phoneBodyTemplate} filter filterPlaceholder="Filtrar por telefono" />
                    <Column sortable field='address' header="DIRECCION" filterField="address" style={{ minWidth: '12rem' }} body={addressBodyTemplate} filter filterPlaceholder="Filtrar por direccion" />
                    {/* <Column field="status" header="ESTADO" style={{ minWidth: '4rem' }} body={statusBodyTemplate} sortable /> */}
                    <Column style={{ minWidth: '12rem' }} header="CREADO EL" body={(rowData) => <Chip className='font-bold' label={`${new Date(rowData.createdAt).toLocaleDateString()} - ${new Date(rowData.createdAt).toLocaleTimeString()}`} />} />
                    <Column style={{ minWidth: '12rem' }} header="ULTIMA ACTUALIZACION" body={(rowData) => <Chip className='font-bold' label={`${new Date(rowData.updatedAt).toLocaleDateString()} - ${new Date(rowData.updatedAt).toLocaleTimeString()}`} />} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
                </DataTable>
            </div>

            {/* //? -------------------- MODAL DIALOG (UPDATE) ------------------- */}
            <Dialog visible={companyDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles de la Empresa" modal className="p-fluid" onHide={hideDialog}>
                <Formik
                    initialValues={{ business_name: '' || company.business_name, nit: '' || company.nit, phone: '' || company.phone, address: '' || company.address }}
                    validate={values => {
                        const errors = {};
                        if (!values.business_name) {
                            errors.business_name = 'La razon social es requerida';
                        } else if (values.business_name.length < 3) {
                            errors.business_name = 'La razon social debe tener al menos 3 caracteres';
                        } else if (!/^[a-zA-Z0-9.&'-\s]{1,100}$/.test(values.business_name)) {
                            errors.business_name = 'La razon social no es valida';
                        }
                        if (!values.nit) {
                            errors.nit = 'El nit es requerido';
                        } else if (values.nit.length < 3) {
                            errors.nit = 'El nit debe tener al menos 8 caracteres';
                        } else if (!/^\d{8}-[0-9a-zA-Z]$/.test(values.nit)) {
                            errors.nit = 'El nit solo puede contener 8 numeros, un guion y una letra';
                        }
                        if (!values.phone) {
                            errors.phone = 'El numero de telefono es requerido';
                        } else if (values.phone <= 0) {
                            errors.phone = 'El numero de telefono no puede ser negativo';
                        } else if (!/^(?:\+?(?:502)?[\s-]?)?[1-9]\d{3}[\s-]?\d{4}$/.test(values.phone)) {
                            errors.phone = 'El numero de telefono solo puede contener numeros';
                        }
                        if (!values.address) {
                            errors.address = 'La direccion es requerida';
                        } else if (values.address.length < 3) {
                            errors.address = 'La direccion debe tener al menos 3 caracteres';
                        } 
                        // else if (!/^[a-zA-Z0-9.&'-\s,]+$/.test(values.address)) {
                        //     errors.address = 'La direccion no es valida';
                        // }
                        return errors;
                    }}
                    onSubmit={(values, { resetForm }) => {

                        if (values) {
                            if (company.id) {
                                updateCompany(company.id, values);
                                setCompanyDialog(false);
                                setCompany(emptyCompany);
                                resetForm();
                            } 
                        } else {
                            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Empresa no registrada', life: 5000 });
                        }
                    }}
                >
                    {({ values, errors, touched, dirty, isValid, handleChange, handleBlur }) => (
                        <Form>
                            <div className="field">
                                <label htmlFor="business_name" className="font-bold">Nombre de la Empresa</label>
                                <InputText id="business_name" name='business_name' type='text' value={values.business_name} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.business_name && touched.business_name} />
                                <ErrorMessage name="business_name" component={() => (<small className="p-error">{errors.business_name}</small>)} />
                            </div>
                            <div className="field">
                                <label htmlFor="nit" className="font-bold">Numero de NIT</label>
                                <InputText id="nit" name='nit' type='text' value={values.nit || ''} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.nit && touched.nit} />
                                <ErrorMessage name="nit" component={() => (<small className="p-error">{errors.nit}</small>)} />
                            </div>
                            <div className="field">
                                <label htmlFor="phone" className="font-bold">Numero de Telefono</label>
                                <InputText id="phone" name='phone' type='number' value={values.phone || ''} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.phone && touched.phone} />
                                <ErrorMessage name="phone" component={() => (<small className="p-error">{errors.phone}</small>)} />
                            </div>
                            <div className="field">
                                <label htmlFor="address" className="font-bold">Dirección</label>
                                <InputTextarea id="address" name='address' autoResize rows={1} value={values.address || ''} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.address && touched.address}  />
                                <ErrorMessage name="address" component={() => (<small className="p-error">{errors.address}</small>)} />
                            </div>
                            <div className="field">
                                {company.id ? (
                                    <>
                                        <div className="field">
                                            <label className="mb-3 mt-5 font-bold">Otros Datos</label>
                                            <div className="formgrid grid">
                                                <div className="col-12">
                                                    <div className="card flex flex-wrap gap-2 justify-content-evenly">
                                                        {/* <Chip label={`${company.business_name}`} className="text-lg font-bold uppercase" /> */}
                                                        <Tag className="text-sm font-bold" value={`ESTADO ${getDatoStatus(company)}`} severity={getSeverity(company)}></Tag>
                                                        <Chip label={`Creado el: ${new Date(company.createdAt).toLocaleDateString()} - ${new Date(company.createdAt).toLocaleTimeString()}`} className='text-md font-bold' />
                                                        <Chip label={`Ultima Actualización: ${new Date(company.updatedAt).toLocaleDateString()} - ${new Date(company.updatedAt).toLocaleTimeString()}`} className='text-md font-bold' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="field flex mt-7 mb-0 align-content-between justify-content-between">
                                <Button label="Cancelar" type='button' icon="pi pi-times" outlined onClick={hideDialog} className='mx-1' />
                                <Button label="Actualizar Empresa" icon="pi pi-check" type='submit' className='mx-1' disabled={company.id ? false : !(isValid && dirty)} />
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </div>
    );
}