import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { ProductService } from '../../demo/service/ProductService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Chip } from 'primereact/chip';
import { OrganizationChart } from 'primereact/organizationchart';
import { TreeNode } from 'primereact/treenode';
import { useForm } from 'react-hook-form';
import { useCompany } from '../../api/context/CompanyContext';


interface Company {
    id: number | null;
    name: string;
    nit: number | null;
    phone: number | null;
    address: string;
}

export default function CompanyPage() {
    let emptyCompany: Company = {
        id: null,
        name: '',
        nit: null,
        phone: null,
        address: ''
    };

    const { register, handleSubmit } = useForm();
    // const { getCompany } = useCompany();
    // const [companies, setCompanies] = useState<Company[]>([]);
    const [companyDialog, setCompanyDialog] = useState<boolean>(false);
    // const [company, setCompany] = useState<Company>(emptyCompany);
    // const [submitted, setSubmitted] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    // useEffect(() => {
    //     ProductService.getProducts().then((data) => setCompanies(data));
    // }, []);

    const openNew = () => {
        // setCompany(emptyCompany);
        // setSubmitted(false);
        setCompanyDialog(true);
    };

    const hideDialog = () => {
        // setSubmitted(false);
        setCompanyDialog(false);
    };

    const onSubmit = handleSubmit((data) => {
        console.log(data)
        setCompanyDialog(false);
    })

    // const saveCompany = () => {
    //     setSubmitted(true);

    //     if (company.name.trim() && company.nit.trim() && company.phone.trim() && company.address.trim()) {
    //         let _companies = [...companies];
    //         let _company = { ...company };

    //         if (company.id) {
    //             const index = findIndexById(company.id);

    //             _companies[index] = _company;
    //             toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Company Updated', life: 3000 });
    //             console.log(companies)
    //         } else {
    //             _company.id = createId();
    //             _company.image = 'company-placeholder.svg';
    //             _companies.push(_company);
    //             toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Company Created', life: 3000 });
    //             console.log(companies)
    //         }

    //         setCompanies(_companies);
    //         setCompanyDialog(false);
    //         setCompany(emptyCompany);
    //     }
    // };


    // const findIndexById = (id: string) => {
    //     let index = -1;

    //     for (let i = 0; i < companies.length; i++) {
    //         if (companies[i].id === id) {
    //             index = i;
    //             break;
    //         }
    //     }

    //     return index;
    // };

    // const createId = (): string => {
    //     let id = '';
    //     let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    //     for (let i = 0; i < 5; i++) {
    //         id += chars.charAt(Math.floor(Math.random() * chars.length));
    //     }

    //     return id;
    // };


    // const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    //     const val = (e.target && e.target.value) || '';
    //     let _company = { ...company };

    //     // @ts-ignore
    //     _company[name] = val;

    //     setCompany(_company);
    // };

    // const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
    //     const val = e.value ?? 0;
    //     let _company = { ...company };

    //     // @ts-ignore
    //     _company[name] = val;

    //     setCompany(_company);
    // };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Editar Datos" icon="pi pi-pencil" severity="warning" onClick={openNew} />
                {/* <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} /> */}
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        // return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Actualizar" icon="pi pi-check" onClick={onSubmit} />
        </React.Fragment>
    );


    const [data] = useState<TreeNode[]>([
        {
            label: 'Nombre Empresa',
            expanded: true,
            className: 'font-bold text-xl border-bluegray-300',
            children: [
                {
                    label: 'Fecha Creacion',
                    className: 'font-medium text-xl border-bluegray-300',
                    expanded: true,
                    children: [
                        {
                            label: '19/02/2022 - 15:30',
                            className: 'font-medium text-xl border-bluegray-300 text-blue-600',
                        },

                    ]
                },
                {
                    label: 'Numero NIT',
                    className: 'font-medium text-xl border-bluegray-300',
                    expanded: true,
                    children: [
                        {
                            label: '123456789',
                            className: 'font-medium text-xl border-bluegray-300 text-blue-600',
                            expanded: false,
                            children: [
                                {
                                    label: 'Numero Telefono',
                                    className: 'font-medium text-xl border-bluegray-300',
                                    expanded: true,
                                    children: [
                                        {
                                            label: '4400-2288',
                                            className: 'font-medium text-xl border-bluegray-300 text-blue-600',
                                            expanded: true,
                                            children: [
                                                {
                                                    label: 'Direccion',
                                                    className: 'font-medium text-xl border-bluegray-300',
                                                    expanded: true,
                                                    children: [
                                                        {
                                                            label: 'Calle 1',
                                                            className: 'font-medium text-xl border-bluegray-300 text-blue-600',
                                                        }
                                                    ]
                                                },
                                            ]

                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    label: 'Ultima Actualizacion',
                    className: 'font-medium text-xl border-bluegray-300',
                    expanded: true,
                    children: [
                        {
                            label: '19/02/2022 - 15:30',
                            className: 'font-medium text-xl border-bluegray-300 text-blue-600',
                        },

                    ]
                }
            ]
        }
    ]);

    

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <h3>Mi Empresa</h3>
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <div className="card overflow-x-auto">
                    <OrganizationChart value={data} />
                </div>
            </div>

            <Dialog visible={companyDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Editar Datos" modal className="p-fluid" onHide={hideDialog} footer={productDialogFooter}>
                <form>

                    <div className="field">
                        <label htmlFor="name" className="font-bold">
                            Razón Social
                        </label>
                        <InputText id="name" autoFocus {...register('name', { required: true })}/>
                        {/* {submitted && !company.name && <small className="p-error">Razón Social obligatoria.</small>} */}
                    </div>
                    <div className="field">
                        <label htmlFor="nit" className="font-bold">
                            NIT
                        </label>
                        <InputText id="nit" type="number" {...register('nit', { required: true })}/>
                        {/* {submitted && !company.nit && <small className="p-error">Nit obligatorio.</small>} */}
                    </div>
                    <div className="field">
                        <label htmlFor="phone" className="font-bold">
                            Número de Teléfono
                        </label>
                        <InputText id="phone" type="number" {...register('phone', { required: true })}/>
                        {/* {submitted && !company.phone && <small className="p-error">Número de Teléfono obligatorio.</small>} */}
                    </div>
                    <div className="field">
                        <label htmlFor="address" className="font-bold">
                            Dirección
                        </label>
                        <InputText id="address" {...register('address', { required: true })}/>
                        {/* {submitted && !company.address && <small className="p-error">Dirección obligatoria.</small>} */}
                    </div>

                    <div className="field">
                        <label className="mb-3 mt-5 font-bold">Otros Datos</label>
                        <div className="formgrid grid">
                            <div className="col-12">
                                <div className="card flex flex-wrap gap-2 justify-content-between">
                                    <Chip label="Creado el: 01/01/2021 - 00:00" />
                                    <Chip label="Ultima Actualización: 01/01/2021 - 00:00" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} /> */}
                    {/* <Button label="Actualizar" icon="pi pi-check"/> */}
                </form>
            </Dialog>
        </div>
    )
}