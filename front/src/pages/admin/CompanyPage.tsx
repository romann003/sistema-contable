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


interface Product {
    id: number | null;
    name: string;
    nit: number | null;
    phone: number | null;
    address: string;
}

export default function CompanyPage() {
    let emptyProduct: Product = {
        id: null,
        name: '',
        nit: null,
        phone: null,
        address: ''
    };

    const [products, setProducts] = useState<Product[]>([]);
    const [productDialog, setProductDialog] = useState<boolean>(false);
    const [product, setProduct] = useState<Product>(emptyProduct);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        ProductService.getProducts().then((data) => setProducts(data));
    }, []);

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim() && product.nit.trim() && product.phone.trim() && product.address.trim()) {
            let _products = [...products];
            let _product = { ...product };

            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                _product.id = createId();
                _product.image = 'product-placeholder.svg';
                _products.push(_product);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };


    const findIndexById = (id: string) => {
        let index = -1;

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = (): string => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };


    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        // @ts-ignore
        _product[name] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value ?? 0;
        let _product = { ...product };

        // @ts-ignore
        _product[name] = val;

        setProduct(_product);
    };

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
            <Button label="Actualizar" icon="pi pi-check" onClick={saveProduct} />
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

            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Editar Datos" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {/* {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />} */}
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Razón Social
                    </label>
                    <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">Razón Social obligatoria.</small>}
                </div>
                <div className="field">
                    <label htmlFor="nit" className="font-bold">
                        NIT
                    </label>
                    <InputText id="nit" type="number" value={product.nit} onChange={(e) => onInputChange(e, 'nit')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nit })} />
                    {submitted && !product.nit && <small className="p-error">Nit obligatorio.</small>}
                </div>
                <div className="field">
                    <label htmlFor="phone" className="font-bold">
                        Número de Teléfono
                    </label>
                    <InputText id="phone" type="number" value={product.phone} onChange={(e) => onInputChange(e, 'phone')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.phone })} />
                    {submitted && !product.phone && <small className="p-error">Número de Teléfono obligatorio.</small>}
                </div>
                <div className="field">
                    <label htmlFor="address" className="font-bold">
                        Dirección
                    </label>
                    <InputText id="address" value={product.address} onChange={(e) => onInputChange(e, 'address')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.address })} />
                    {submitted && !product.address && <small className="p-error">Dirección obligatoria.</small>}
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
            </Dialog>
        </div>
    )
}