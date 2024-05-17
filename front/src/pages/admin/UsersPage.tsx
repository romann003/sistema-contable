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
import { Formik, Form, ErrorMessage } from 'formik';
import { useUsers } from '../../api/context/UsersContext';
import { useRoles } from '../../api/context/RolContext';




interface User {
    id: number | null;
    name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    rol: string | null;
    rolId: number | null;
}

interface Status {
    name: string;
    code: boolean;
}

// interface Rol {
//     name: string;
//     code: string;
// }

export default function UsersPage() {

    //? -------------------- INITIAL STATES -------------------
    const emptyUser: User = {
        id: null,
        name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        status: true,
        createdAt: '',
        updatedAt: '',
        rol: '',
        rolId: null
    };

    const typeStatus: Status[] = [
        { name: 'Activo', code: true },
        { name: 'Inactivo', code: false }
    ];

    // const typeRoles: Rol[] = [
    //     { name: 'Administrador', code: 'administrador' },
    //     { name: 'Moderador', code: 'moderador' }
    // ];

    //? -------------------- CONTEXT API -------------------
    const { roles, getRoles } = useRoles();
    const { users, getUsers, createUser, deleteUser, updateUser, setUsers, errors: userErrors } = useUsers();

    //? -------------------- STATES -------------------
    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const [selectedRol, setSelectedRol] = useState<string>('');
    const [estados, setEstados] = useState<string[]>([]);
    const [user, setUser] = useState<User>(emptyUser);
    const toast = useRef<Toast>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);

    //? -------------------- DIALOG STATES -------------------
    const [userDialog, setUserDialog] = useState<boolean>(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState<boolean>(false);

    //? -------------------- DATATABLE STATES -------------------
    const dt = useRef<DataTable<User[]>>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        last_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        username: { value: null, matchMode: FilterMatchMode.CONTAINS },
        email: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        'rol.name': { value: null, matchMode: FilterMatchMode.EQUALS },
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

    //? -------------------- DTATABLE FUNCTIONS -------------------
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <h4 className="m-0">Lista de Usuarios</h4>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
                </IconField>
            </div>
        );
    };

    //? -------------------- DATATABLE INPUT TEMPLATES -------------------
    const last_nameBodyTemplate = (rowData: User) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.last_name}</span>
            </div>
        );
    };

    const usernameBodyTemplate = (rowData: User) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.username}</span>
            </div>
        );
    };

    const emailBodyTemplate = (rowData: User) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.email}</span>
            </div>
        );
    };

    const rolBodyTemplate = (rowData: User) => {
        return (
            <div className="flex align-items-center gap-2">
                <span className='bg-gray-200 border-round-3xl px-3 py-2 font-bold uppercase'>{rowData.rol.name}</span>
            </div>
        );
    };

    //? -------------------- LOADING DATA -------------------
    const header = renderHeader();

    useEffect(() => {
        getUsers()
        getRoles()
        setLoading(false);
    }, [user]);

    //? -------------------- MODAL DIALOGS -------------------
    const openNew = () => {
        setUser(emptyUser);
        // setSubmitted(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setEstados([]);
        setSelectedStatus(null);
        setSelectedRol(null);
        // setSubmitted(false);
        setUserDialog(false);
    };

    const editUser = (user: User) => {
        setUser({ ...user });
        setUserDialog(true);
    };

    const confirmDeleteUser = (user: User) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const deleteUserModal = () => {
        // let _users = users.filter((val) => val.id !== user.id);
        // setUsers(users.filter((val) => val.id !== user.id));

        deleteUser(user.id);
        // setUsers(_users);
        setDeleteUserDialog(false);
        setUser(emptyUser);
        // toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const saveUser = () => {
        console.log(userErrors)
        if (userErrors.length > 0) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Revise los campos', life: 3000 });
            return;
        } else {
            setSubmitted(true);

            if (user.id) {
                if (user.name.trim() && user.last_name.trim() && user.username.trim() && user.email.trim()) {
                    let _users = [...users];
                    let _user = { ...user };

                    const index = findIndexById(user.id);
                    _users[index] = _user;
                    if (selectedStatus?.code === true) {
                        _user.status = true
                    } else if (selectedStatus?.code === false) { _user.status = false } else { _user.status = user.status }
                    if (selectedRol !== null) { _user.rolId = selectedRol.id } else { _user.rolId = user.rolId }
                    updateUser(user.id, _user);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
                    setUserDialog(false);
                    setUser(emptyUser);
                }
            } else {
                if (user.name.trim() && user.last_name.trim() && user.username.trim() && user.email.trim() && user.password.trim()) {
                    let _users = [...users];
                    let _user = { ...user };

                    _users.push(_user);
                    createUser(_user);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });

                    setUserDialog(false);
                    setUser(emptyUser);
                }
            }
        }
    };




    const findIndexById = (id: number) => {
        let index = -1;

        for (let i = 0; i < users.length; i++) {
            if (users[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };

        // @ts-ignore
        _user[name] = val;

        setUser(_user);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value ?? 0;
        let _user = { ...user };

        // @ts-ignore
        _user[name] = val;

        setUser(_user);
    };


    //? -------------------- DTATABLE ACTIONS -------------------
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Agregar Usuario" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const statusBodyTemplate = (rowData: User) => {
        return <Tag className="text-sm font-bold" value={getDatoStatus(rowData)} severity={getSeverity(rowData)}></Tag>;
    };

    const actionBodyTemplate = (rowData: User) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUser(rowData)} />
            </React.Fragment>
        );
    };

    const getDatoStatus = (user: User) => {
        switch (user.status) {
            case true:
                return 'ACTIVO';

            case false:
                return 'INACTIVO';

            default:
                return null;
        }
    };

    const getSeverity = (user: User) => {
        switch (user.status) {
            case true:
                return 'success';

            case false:
                return 'danger';

            default:
                return null;
        }
    };

    //? -------------------- MODAL BUTTONS -------------------
    // const userDialogFooter = (
    //     <React.Fragment>
    //         <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
    //         <Button label="Guardar Usuario" icon="pi pi-check" onClick={saveUser} />
    //     </React.Fragment>
    // );
    const deleteUserDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog} />
            <Button label="Si, eliminar" icon="pi pi-check" severity="danger" onClick={deleteUserModal} />
        </React.Fragment>
    );

    // const showInfo = (severity, summary, detail) => {
    //     toast.current?.show({ severity, summary, detail, life: 3000 });
    //     toast.current?.clear;
    // }

    //? -------------------- RENDER -------------------
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <h3>Usuarios</h3>
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                {/* //? -------------------- DATATABLE ------------------- */}
                <DataTable ref={dt} dataKey="id" value={users} filters={filters} loading={loading}
                    paginator rows={15} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} usuarios"
                    // rowsPerPageOptions={[5, 10, 25]}
                    globalFilterFields={['name', 'last_name', 'username', 'email', 'rol.name']} header={header} emptyMessage="No se encontraron usuarios."
                    filterDisplay="row"
                    stripedRows 
                >
                    <Column header="ID" body={(rowData) => <span>{users.indexOf(rowData) + 1}</span>} />
                    {/* <Column header="NOMBRE COMPLETO" style={{ minWidth: '8rem' }} body={(rowData) => <span>{`${rowData.name} ${rowData.last_name}`}</span>} /> */}
                    <Column field="name" header="NOMBRES" filter filterPlaceholder="Filtrar por nombres" sortable style={{ minWidth: '12rem' }} />
                    <Column sortable field="last_name" header="APELLIDOS" filterField="last_name" body={last_nameBodyTemplate} filter filterPlaceholder="Filtrar por apellidos" style={{ minWidth: '12rem' }} />
                    <Column sortable field="username" header="USERNAME" filterField="username" body={usernameBodyTemplate} filter filterPlaceholder="Filtrar por username" style={{ minWidth: '12rem' }} />
                    <Column sortable field="email" header="EMAIL" filterField="email" body={emailBodyTemplate} filter filterPlaceholder="Filtrar por email" style={{ minWidth: '12rem' }} />
                    <Column sortable field="rol.name" header="ROL" filterField="rol.name" body={rolBodyTemplate} filter filterPlaceholder="Filtrar por rol" style={{ minWidth: '12rem' }} />
                    <Column field="status" header="ESTADO" style={{ minWidth: '4rem' }} body={statusBodyTemplate} sortable />
                    <Column style={{ minWidth: '12rem' }} header="CREADO EL" body={(rowData) => <Chip className='font-bold' label={`${new Date(rowData.createdAt).toLocaleDateString()} - ${new Date(rowData.createdAt).toLocaleTimeString()}`} />} />
                    <Column style={{ minWidth: '12rem' }} header="ULTIMA ACTUALIZACION" body={(rowData) => <Chip className='font-bold' label={`${new Date(rowData.updatedAt).toLocaleDateString()} - ${new Date(rowData.updatedAt).toLocaleTimeString()}`} />} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
                </DataTable>
            </div>

            {/* //? -------------------- MODAL DIALOG (CREATE AND UPDATE) ------------------- */}
            <Dialog visible={userDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles del Usuario" modal className="p-fluid" onHide={hideDialog}>
                <Formik
                    initialValues={{ name: '' || user.name, last_name: '' || user.last_name, username: '' || user.username, email: '' || user.email, password: '' || user.password, rol: '' }}
                    validate={values => {
                        const errors = {};
                        if (!values.name) {
                            errors.name = 'El nombre es requerido';
                        } else if (values.name.length < 3) {
                            errors.name = 'El nombre debe tener al menos 3 caracteres';
                        } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.name)) {
                            errors.name = 'El nombre solo puede contener letras';
                        }
                        if (!values.last_name) {
                            errors.last_name = 'El apellido es requerido';
                        } else if (values.last_name.length < 3) {
                            errors.last_name = 'El apellido debe tener al menos 3 caracteres';
                        } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.last_name)) {
                            errors.last_name = 'El apellido solo puede contener letras';
                        }
                        if (!values.username) {
                            errors.username = 'El nombre de usuario es requerido';
                        } else if (values.username.length < 3) {
                            errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
                        } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.username)) {
                            errors.username = 'El nombre de usuario solo puede contener letras';
                        }
                        if (!values.email) {
                            errors.email = 'El email es requerido';
                        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.email)) {
                            errors.email = 'El email es invalido';
                        }
                        if (!user.id) {
                            if (!values.password) {
                                errors.password = 'La contraseña es requerida';
                            } else if (values.password.length < 6) {
                                errors.password = 'La contraseña debe tener al menos 6 caracteres';
                            }
                            if (!values.rol) {
                                errors.rol = 'El rol es requerido';
                            }
                        }
                        return errors;
                    }}
                    onSubmit={(values, { resetForm }) => {

                        if (values) {
                            if (user.id) {

                                if (selectedStatus?.code === true) { values.status = true }
                                else if (selectedStatus?.code === false) { values.status = false } else { values.status = user.status }
                                if (values.rol !== "") { values.rolId = values.rol.id } else { values.rolId = user.rolId }
                                updateUser(user.id, values);
                                setUserDialog(false);
                                setUser(emptyUser);
                                resetForm();
                            } else {
                                values.rolId = values.rol.id
                                createUser(values);
                                setUserDialog(false);
                                setUser(emptyUser);
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
                                <label htmlFor="name" className="font-bold">Nombres</label>
                                <InputText id="name" name='name' type='text' value={values.name} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.name && touched.name} />
                                <ErrorMessage name="name" component={() => (<small className="p-error">{errors.name}</small>)} />
                            </div>
                            <div className="field">
                                <label htmlFor="last_name" className="font-bold">Apellidos</label>
                                <InputText id="last_name" name='last_name' type='text' value={values.last_name} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.last_name && touched.last_name} />
                                <ErrorMessage name="last_name" component={() => (<small className="p-error">{errors.last_name}</small>)} />
                            </div>
                            <div className="field">
                                <label htmlFor="username" className="font-bold">Nombre de Usuario</label>
                                <InputText id="username" name='username' type='text' value={values.username} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.username && touched.username} />
                                <ErrorMessage name="username" component={() => (<small className="p-error">{errors.username}</small>)} />
                            </div>
                            <div className="field">
                                <label htmlFor="email" className="font-bold">Correo Electrónico</label>
                                <InputText id="email" name='email' type='email' value={values.email} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.email && touched.email} />
                                <ErrorMessage name="email" component={() => (<small className="p-error">{errors.email}</small>)} />
                            </div>
                            <div className="field">
                                {user.id ? (
                                    <>
                                        <label htmlFor="updates" className="font-bold mt-3">
                                            Actualizaciones
                                        </label>
                                        <div className="flex flex-wrap justify-content-evenly gap-3 mt-2">
                                            <div className="flex align-items-center mb-3">
                                                <Checkbox inputId="e1" name="e1" value="e1" onChange={onEstadosChange} checked={estados.includes('e1')} />
                                                <label htmlFor="checkbox Password" className="ml-2">
                                                    Contraseña
                                                </label>
                                            </div>
                                            <div className="flex align-items-center mb-3">
                                                <Checkbox inputId="e2" name="e2" value="e2" onChange={onEstadosChange} checked={estados.includes('e2')} />
                                                <label htmlFor="checkbox Estado" className="ml-2">
                                                    Estado
                                                </label>
                                            </div>
                                            <div className="flex align-items-center mb-3">
                                                <Checkbox inputId="e3" name="e3" value="e3" onChange={onEstadosChange} checked={estados.includes('e3')} />
                                                <label htmlFor="checkbox Rol" className="ml-2">
                                                    Rol
                                                </label>
                                            </div>


                                        </div>
                                        {estados.includes('e1') ? (
                                            <>
                                                <label htmlFor="password" className="font-bold">Contraseña</label>
                                                <InputText id="password" name='password' type='password' value={values.password} onChange={handleChange} onBlur={handleBlur} />
                                                {/* <ErrorMessage name="password" component={() => (<small className="p-error">{errors.password}</small>)} /> */}
                                            </>
                                        ) : (<></>)}
                                        {estados.includes('e2') ? (
                                            <>
                                                <label htmlFor="status" className="font-bold my-3">Estado</label>
                                                <Dropdown value={selectedStatus} onChange={(e: DropdownChangeEvent) => setSelectedStatus(e.value)} options={typeStatus} optionLabel="name" placeholder="Selecciona un estado" className="w-full uppercase" emptyMessage="No se encontraron Estados." />
                                            </>
                                        ) : (<></>)}

                                        {estados.includes('e3') ? (
                                            <>
                                                <label htmlFor="rol" className="font-bold my-3">Rol</label>
                                                <Dropdown id="rol" name="rol" value={values.rol} onChange={handleChange} onBlur={handleBlur} options={roles} optionLabel="name" placeholder="Selecciona un Rol" emptyMessage="No se encontraron Roles." className="w-full uppercase" />
                                            </>
                                        ) : (<></>)}


                                        <div className="field">
                                            <label className="mb-3 mt-5 font-bold">Otros Datos</label>
                                            <div className="formgrid grid">
                                                <div className="col-12">
                                                    <div className="card flex flex-wrap gap-2 justify-content-evenly">
                                                        <Chip label={`${user.rol?.name}`} className="text-lg font-bold uppercase" />
                                                        <Tag className="text-sm font-bold" value={`ESTADO ${getDatoStatus(user)}`} severity={getSeverity(user)}></Tag>
                                                        <Chip label={`Creado el: ${new Date(user.createdAt).toLocaleDateString()} - ${new Date(user.createdAt).toLocaleTimeString()}`} className='text-md font-bold' />
                                                        <Chip label={`Ultima Actualización: ${new Date(user.updatedAt).toLocaleDateString()} - ${new Date(user.updatedAt).toLocaleTimeString()}`} className='text-md font-bold' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="field">
                                            <label htmlFor="password" className="font-bold">Contraseña</label>
                                            <InputText id="password" name='password' type='password' value={values.password} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.password && touched.password} />
                                            <ErrorMessage name="password" component={() => (<small className="p-error">{errors.password}</small>)} />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="rol" className="font-bold">Rol</label>
                                            <Dropdown id="rol" name="rol" value={values.rol} onChange={handleChange} onBlur={handleBlur} options={roles} optionLabel="name" placeholder="Selecciona un Rol" invalid={!!errors.rol && touched.rol} emptyMessage="No se encontraron Roles." className="w-full uppercase" />
                                            <ErrorMessage name="rol" component={() => (<small className="p-error">{errors.rol}</small>)} />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="field flex mt-7 mb-0 align-content-between justify-content-between">
                                <Button label="Cancelar" type='button' icon="pi pi-times" outlined onClick={hideDialog} className='mx-1' />
                                <Button label="Guardar Usuario" icon="pi pi-check" type='submit' className='mx-1' disabled={user.id ? false : !(isValid && dirty)} />
                            </div>
                        </Form>
                    )}
                </Formik>






            </Dialog>

            {/* //? -------------------- MODAL DIALOG (DELETE) ------------------- */}
            <Dialog visible={deleteUserDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {user && (
                        <span>
                            ¿Estas seguro que deseas eliminar al usuario: <b className="font-bold">{user.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}