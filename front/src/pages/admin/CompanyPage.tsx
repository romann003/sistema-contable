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
import { BreadCrumb } from 'primereact/breadcrumb';
import { MenuItem } from 'primereact/menuitem';
import { Link } from 'react-router-dom';

import { Formulario } from '../../layout/elements/Formularios.js';
import { Company, emptyCompany, Status, typeStatus } from '../../layout/elements/InitialData';
import { ColumnChipBody, ColumnDateBody, ColumnOnlyDateBody, ColumnStatusBody, ColumnTextBody } from '../../layout/components/ColumnBody.js';
import DataTableCrud from '../../layout/components/DataTableCrud.js';
import { FormDropDown, FormInput, FormTextArea } from '../../layout/components/FormComponent.js';

const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    business_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nit: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phone: { value: null, matchMode: FilterMatchMode.EQUALS },
    address: { value: null, matchMode: FilterMatchMode.CONTAINS },
}

export default function CompanyPage() {

    const items: MenuItem[] = [{ template: () => <Link to=""><span className="text-primary font-semibold">Mi Empresa</span></Link> }];
    const home: MenuItem = {
        template: () => <Link to="/dashboard"><span className="text-primary font-semibold">Inicio</span></Link>
    }

    //? -------------------- CONTEXT API -------------------
    const { companies, getCompanies, updateCompany } = useCompany();
    //? -------------------- STATES -------------------
    const [company, setCompany] = useState<Company>(emptyCompany);
    const toast = useRef<Toast>(null);
    //? -------------------- DIALOG STATES -------------------
    const [companyDialog, setCompanyDialog] = useState<boolean>(false);
    //? -------------------- DATATABLE STATES -------------------
    const dt = useRef<DataTable<Company[]>>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
    const [loading, setLoading] = useState<boolean>(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    //? -------------------- DATATABLE INPUT TEMPLATES -------------------
    const businessBodyTemplate = (rowData: Company) => {
        return <ColumnTextBody value={rowData.business_name} />
    };

    const nitBodyTemplate = (rowData: Company) => {
        return <ColumnTextBody value={rowData.nit} />
    };

    const phoneBodyTemplate = (rowData: Company) => {
        return <ColumnTextBody value={rowData.phone} />
    };

    const addressBodyTemplate = (rowData: Company) => {
        return <ColumnTextBody value={rowData.address} />
    };

    const statusBodyTemplate = (rowData: Company) => {
        return <ColumnStatusBody value={rowData} />
    };

    const createdAtBodyTemplate = (rowData: Company) => {
        return <ColumnDateBody value={rowData.createdAt} />
    };

    const updatedAtBodyTemplate = (rowData: Company) => {
        return <ColumnDateBody value={rowData.updatedAt} />
    };

    const actionBodyTemplate = (rowData: Company) => {
        return (
            <React.Fragment>
                <div className="flex align-align-content-center justify-content-evenly">
                    <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editCompany(rowData)} />
                </div>
            </React.Fragment>
        );
    };

    //? -------------------- LOADING DATA -------------------
    useEffect(() => {
        getCompanies();
        setLoading(false);
    }, [company]);



    //? -------------------- MODAL DIALOGS -------------------
    const hideDialog = () => {
        setCompanyDialog(false);
    };

    const editCompany = (company: Company) => {
        setCompany({ ...company });
        setCompanyDialog(true);
    };



    //? -------------------- RENDER -------------------
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <h3>Mi Empresa</h3>
                <BreadCrumb model={items} home={home} className='mb-4' />
                {/* //? -------------------- DATATABLE ------------------- */}
                <DataTableCrud
                    //? -------------------- HEADER -------------------
                    message="empresas"
                    headerMessage="Todas mis Empresas"
                    refe={dt}
                    value={companies}
                    filters={filters}
                    loading={loading}
                    setFilters={setFilters}
                    setGlobalFilterValue={setGlobalFilterValue}
                    globalFilterValue={globalFilterValue}
                    globalFilterFields={['business_name', 'nit', 'phone', 'address']}
                    //? -------------------- COLUMNS -------------------
                    columns={[
                        { field: 'business_name', header: 'Razon Social', body: businessBodyTemplate, dataType: 'text', filter: true },
                        { field: 'nit', header: 'NIT', body: nitBodyTemplate, dataType: 'text', filter: true },
                        { field: 'phone', header: 'Telefono', body: phoneBodyTemplate, dataType: 'text', filter: true },
                        { field: 'address', header: 'Direccion', body: addressBodyTemplate, dataType: 'text', filter: true },
                        // { field: 'status', header: 'Estado', body: statusBodyTemplate, dataType: 'boolean', filter: false },
                        { field: 'createdAt', header: 'Creado el', body: createdAtBodyTemplate, dataType: 'date', filter: false },
                        { field: 'updatedAt', header: 'Ultima Actualización', body: updatedAtBodyTemplate, filter: false, dataType: 'date' },
                    ]}
                    size='12rem'
                    actionBodyTemplate={actionBodyTemplate}
                />
            </div>

            {/* //? -------------------- MODAL DIALOG (UPDATE) ------------------- */}
            <Dialog visible={companyDialog} style={{ width: '30rem', minWidth: '30rem', maxWidth: '30vw', height: '42rem', minHeight: '42rem', maxHeight: '42rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles de la Empresa" modal className="p-fluid" onHide={hideDialog}>
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
                        <Form style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ flex: 1, overflow: 'auto' }}>
                                <Formulario>
                                    <FormInput
                                        col={12}
                                        id="business_name"
                                        name="business_name"
                                        type="text"
                                        placeholder="Ingrese la razon social"
                                        label="Razon Social"
                                        span="*"
                                        value={values.business_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        invalid={!!errors.business_name && touched.business_name}
                                        errorText={errors.business_name}
                                    />

                                    <FormInput
                                        col={12}
                                        id="nit"
                                        name="nit"
                                        type="text"
                                        placeholder="Ingrese el NIT"
                                        label="NIT"
                                        span="*"
                                        value={values.nit}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        invalid={!!errors.nit && touched.nit}
                                        errorText={errors.nit}
                                    />

                                    <FormInput
                                        col={12}
                                        id="phone"
                                        name="phone"
                                        type="number"
                                        placeholder="Ingrese el numero de telefono"
                                        label="Telefono"
                                        span="*"
                                        value={values.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        invalid={!!errors.phone && touched.phone}
                                        errorText={errors.phone}
                                    />

                                    <FormTextArea
                                        col={12}
                                        id="address"
                                        name="address"
                                        placeholder="Ingrese la direccion"
                                        label="Direccion"
                                        span="*"
                                        value={values.address}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        invalid={!!errors.address && touched.address}
                                        errorText={errors.address}
                                    />
                                    {/* {company.id ? (
                                        <>
                                        <div className="w-full">

                                            <div className="field">
                                                <label className="mb-3 mt-5 font-bold">Otros Datos</label>
                                                <div className="formgrid grid">
                                                    <div className="col-12">
                                                        <div className="card flex flex-wrap gap-2 justify-content-evenly">
                                                            <div className="flex">
                                                                <ColumnStatusBody value={company} />
                                                            </div>
                                                            <Chip label={`Creado el: ${new Date(company.createdAt).toLocaleDateString()} - ${new Date(company.createdAt).toLocaleTimeString()}`} className='text-md font-bold' />
                                                            <Chip label={`Ultima Actualización: ${new Date(company.updatedAt).toLocaleDateString()} - ${new Date(company.updatedAt).toLocaleTimeString()}`} className='text-md font-bold' />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </>
                                    ) : (
                                        <></>
                                    )} */}
                                </Formulario>
                            </div>


                            <div className="flex mb-0 pt-3">
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