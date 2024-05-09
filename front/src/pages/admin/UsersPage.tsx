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
import { useUsers } from '../../api/context/UsersContext';
import { Chip } from 'primereact/chip';
import { Checkbox } from "primereact/checkbox";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { useRoles } from '../../api/context/RolContext';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';



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
}

interface Status {
    name: string;
    code: string;
}

// interface Rol {
//     name: string;
//     code: string;
// }

export default function UsersPage() {
    let emptyUser: User = {
        id: null,
        name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        status: true,
    };

    const typeStatus: Status[] = [
        { name: 'Activo', code: "1" },
        { name: 'Inactivo', code: "0" }
    ];

    // const typeRoles: Rol[] = [
    //     { name: 'Administrador', code: 'administrador' },
    //     { name: 'Moderador', code: 'moderador' }
    // ];

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { roles, setRoles, getRoles } = useRoles();
    const { users, getUsers, createUser, deleteUser, updateUser, setUsers, errors: userErrors } = useUsers();
    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const [selectedRol, setSelectedRol] = useState<roles>(null);
    const [userDialog, setUserDialog] = useState<boolean>(false);
    const [updateUserDialog, setUpdateUserDialog] = useState<boolean>(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState<boolean>(false);
    const [user, setUser] = useState<User>(emptyUser);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<User[]>>(null);
    const [estados, setEstados] = useState<string[]>([]);

    useEffect(() => {
        getUsers()
        getRoles()
    }, []);


    const onEstadosChange = (e: CheckboxChangeEvent) => {
        let _estados = [...estados];

        if (e.checked)
            _estados.push(e.value);
        else
            _estados.splice(_estados.indexOf(e.value), 1);

        setEstados(_estados);
    }

    const openNewUserDialog = () => {
        setUserDialog(true);
    };

    const hideNewUserDialog = () => {
        setUserDialog(false);
    };

    const hideUpdateUserDialog = () => {
        setEstados([]);
        setSelectedStatus(null);
        setSelectedRol(null);
        setUpdateUserDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    // const saveUser = () => {
    //     setSubmitted(true);

    //     if (user.name.trim() && user.last_name.trim() && user.username.trim() && user.email.trim() && user.password.trim()) {
    //         let _users = [...users];
    //         let _user = { ...user };

    //         if (user.id) {

    //             const index = findIndexById(user.id);
    //             _users[index] = _user;
    //             updateUser(user.id, _user);
    //             toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
    //         } else {
    //             _users.push(_user);
    //             createUser(_user);
    //             toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
    //         }
    //         // window.location.reload();
    //         // setUsers(_users);
    //         setUserDialog(false);
    //         setUser(emptyUser);
    //     }

    // };

    const editUser = (user: User) => {
        setUser({ ...user });
        setUpdateUserDialog(true);
    };

    const confirmDeleteUser = (user: User) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const deleteUserModal = () => {
        let _users = users.filter((val) => val.id !== user.id);
        // setUsers(users.filter((val) => val.id !== user.id));

        deleteUser(user.id);
        setUsers(_users);
        setDeleteUserDialog(false);
        setUser(emptyUser);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
    };

    const findIndexById = (id: string) => {
        let index = -1;

        for (let i = 0; i < users.length; i++) {
            if (users[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Agregar usuario" icon="pi pi-plus" severity="success" onClick={openNewUserDialog} />
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

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Lista de Usuarios</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" placeholder="Buscar..." onInput={(e) => { const target = e.target as HTMLInputElement; setGlobalFilter(target.value); }} />
            </IconField>
        </div>
    );

    const deleteUserDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog} />
            <Button label="Si, eliminar" icon="pi pi-check" severity="danger" onClick={deleteUserModal} />
        </React.Fragment>
    );

    const showInfo = (severity, summary, detail) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
        toast.current?.clear;
    }

    const onSubmit = handleSubmit(async (data) => {
        await createUser(data);
    });

    const onUpdate = handleSubmit(async (data) => {
        updateUser(user.id, data);
        console.log(data)
    });

    return (
        <div>
            <Toast ref={toast} />

            {userErrors.map((error, i) => (
                <div key={i}>
                    {showInfo('error', 'Error', error)}
                </div>
            ))}
            <div className="card">
                <h3>Usuarios</h3>
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={users}
                    dataKey="id"
                    paginator rows={15}
                    // rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} usuarios" globalFilter={globalFilter} header={header}
                >
                    <Column header="ID" body={(rowData) => <span>{users.indexOf(rowData) + 1}</span>} />
                    <Column header="NOMBRE COMPLETO" sortable style={{ minWidth: '8rem' }} body={(rowData) => <span>{`${rowData.name} ${rowData.last_name}`}</span>} />
                    <Column field="username" header="USERNAME" sortable style={{ minWidth: '10rem' }} />
                    <Column field="email" header="EMAIL" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column sortable style={{ minWidth: '12rem' }} header="ROL" body={(rowData) => <Chip className='font-bold uppercase' label={`${rowData.rol.name}`} />} />
                    <Column field="status" header="ESTATUS" body={statusBodyTemplate} sortable style={{ minWidth: '7rem' }}></Column>
                    <Column sortable style={{ minWidth: '12rem' }} header="CREADO EL" body={(rowData) => <Chip className='font-bold' label={`${new Date(rowData.createdAt).toLocaleDateString()} - ${new Date(rowData.createdAt).toLocaleTimeString()}`} />} />
                    <Column sortable style={{ minWidth: '12rem' }} header="ULTIMA ACTUALIZACION" body={(rowData) => <Chip className='font-bold' label={`${new Date(rowData.updatedAt).toLocaleDateString()} - ${new Date(rowData.updatedAt).toLocaleTimeString()}`} />} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={updateUserDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles del Usuario" modal className="p-fluid" onHide={hideUpdateUserDialog}>
                <form onSubmit={onUpdate} className="p-fluid">
                    {user.id ? (
                        <>
                            <div className="field">
                                <label htmlFor="name" className="font-bold">Nombres</label>
                                <InputText id="name" type='text' autoFocus className="mb-2" {...register('name', { required: false })} value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                            </div>
                            <div className="field">
                                <label htmlFor="last_name" className="font-bold">Apellidos</label>
                                <InputText id="last_name" type='text' className="mb-2" {...register('last_name', { required: false })} value={user.last_name} onChange={(e) => setUser({ ...user, last_name: e.target.value })} />
                            </div>
                            <div className="field">
                                <label htmlFor="username" className="font-bold">Nombre de Usuario</label>
                                <InputText id="username" type='text' className="mb-2" {...register('username', { required: false })} value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />
                            </div>
                            <div className="field">
                                <label htmlFor="email" className="font-bold">Correo Electrónico</label>
                                <InputText id="email" type="email" {...register('email', { required: false })} value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                            </div>


                            <div className="field">
                                <label htmlFor="updates" className="font-bold mt-3">
                                    Actualizaciones
                                </label>
                                <div className="flex mt-2 justify-content-evenly align-content-center">
                                    <div className="flex align-items-center mb-3">
                                        <Checkbox inputId="e1" name="e1" value="e1" onChange={onEstadosChange} checked={estados.includes('e1')} />
                                        <label htmlFor="checkbox Password" className="ml-2">
                                            Contraseña
                                        </label>
                                    </div>
                                    <div className="flex align-items-center mb-3">
                                        <Checkbox inputId="e2" name="e2" value="e2" onChange={onEstadosChange} checked={estados.includes('e2')} />
                                        <label htmlFor="checkbox Password" className="ml-2">
                                            Estado&nbsp;&nbsp;&nbsp;&nbsp;
                                        </label>
                                    </div>
                                    <div className="flex align-items-center mb-3">
                                        <Checkbox inputId="e3" name="e3" value="e3" onChange={onEstadosChange} checked={estados.includes('e3')} />
                                        <label htmlFor="checkbox Password" className="ml-2">
                                            Rol&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </label>
                                    </div>
                                </div>
                                {estados.includes('e1') ? (
                                    <>
                                        <div className="field">
                                            <label htmlFor="password" className="font-bold my-3">Contraseña</label>
                                            <InputText id="password" type="password" className="mb-2" {...register('password', { required: false })} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                                        </div>
                                    </>
                                ) : (<></>)}

                                {estados.includes('e2') ? (
                                    <>
                                        <label htmlFor="estado" className="font-bold my-3">
                                            Estado
                                        </label>
                                        <Dropdown value={selectedStatus} {...register('status', { required: false })} onChange={(e: DropdownChangeEvent) => setSelectedStatus(e.value)} options={typeStatus} optionLabel="code" placeholder="Selecciona un estado" className="w-full" />
                                    </>
                                ) : (<></>)}

                                {estados.includes('e3') ? (
                                    <>
                                        <label htmlFor="rol" className="font-bold my-3">
                                            Rol
                                        </label>
                                        <Dropdown value={selectedRol} {...register('rolId', { required: false })} onChange={(e1: DropdownChangeEvent) => setSelectedRol(e1.value)} options={roles} optionLabel="id" placeholder="Selecciona un rol" className="w-full" />
                                        {/* {console.log(selectedRol?.id)} */}
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
                            </div>

                            <div className="flex justify-content-around mt-7">
                                <div className="flex align-items-center w-full mx-1">
                                    <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideUpdateUserDialog} />
                                </div>
                                <div className="flex align-items-center w-full mx-1">
                                    <Button type='submit' label="Modificar Usuario" icon="pi pi-check" />
                                </div>
                            </div>
                        </>
                    ) : (<></>)}

                </form>
            </Dialog>




            <Dialog visible={userDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Nuevo Usuario" modal className="p-fluid" onHide={hideNewUserDialog}>
                <form onSubmit={onSubmit} className="p-fluid">
                    <div className="field">
                        <label htmlFor="name" className="font-bold">Nombres</label>
                        <InputText id="create_name" type='text' autoFocus className="mb-2" {...register('name', { required: true })} />
                        {errors.name && (<small className="p-error">El nombre es requerido.</small>)}
                    </div>
                    <div className="field">
                        <label htmlFor="last_name" className="font-bold">Apellidos</label>
                        <InputText id="create_last_name" type='text' className="mb-2" {...register('last_name', { required: true })} />
                        {errors.last_name && (<small className="p-error">El apellido es requerido.</small>)}
                    </div>
                    <div className="field">
                        <label htmlFor="username" className="font-bold">Nombre de Usuario</label>
                        <InputText id="create_username" type='text' className="mb-2" {...register('username', { required: true })} />
                        {errors.username && (<small className="p-error">El apellido es requerido.</small>)}
                    </div>
                    <div className="field">
                        <label htmlFor="email" className="font-bold">Correo Electrónico</label>
                        <InputText id="create_email" type="email" className="mb-2" {...register('email', { required: true })} />
                        {errors.email && (<small className="p-error">El email es requerido.</small>)}
                    </div>
                    <div className="field">
                        <label htmlFor="password" className="font-bold">Contraseña</label>
                        <InputText id="create_password" type="password" className="mb-2" {...register('password', { required: true })} />
                        {errors.password && (<small className="p-error">La contraseña es requerida.</small>)}
                    </div>

                    <div className="flex justify-content-around mt-7">
                        <div className="flex align-items-center w-full mx-1">
                            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideNewUserDialog} />
                        </div>
                        <div className="flex align-items-center w-full mx-1">
                            <Button type='submit' label="Agregar Usuario" icon="pi pi-check" />
                        </div>
                    </div>
                </form>
            </Dialog>

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
