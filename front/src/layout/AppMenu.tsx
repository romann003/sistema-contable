import AppMenuitem from './AppMenuitem.tsx';
import { MenuProvider } from './context/menucontext.tsx';
import { AppMenuItem } from '../types';
import { useCompany } from '../api/context/CompanyContext.tsx';
import { useEffect } from 'react';


const AppMenu = () => {
    // const {getUsers, getCompany, companies} = useCompany();

    // useEffect(() => {
    //     getUsers();
    // }, []);

    // companies.map((company) => {
    //     // getCompany(company.id);
    //     console.log(company.id);
    // })
    // console.log(companies[1]);

    const model: AppMenuItem[] = [
        {
            label: 'Inicio',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
        },
        {
            label: 'Mi Empresa',
            items: [
                { label: 'Departamentos', icon: 'pi pi-fw pi-clone', to: '/dashboard/departments' },
                { label: 'Areas (Cargos)', icon: 'pi pi-fw pi-table', to: '/dashboard/areas' },
                { label: 'Usuarios', icon: 'pi pi-verified pi-fw', to: '/dashboard/users' },
                { label: 'Mi empresa', icon: 'pi pi-fw pi-cog', to: '/dashboard/company' },
            ]
        },
        {
            label: 'Otras Acciones',
            items: [
                { label: 'Empleados', icon: 'pi pi-fw pi-user', to: '/dashboard/employees'},
                { label: 'Nomina', icon: 'pi pi-inbox', to: '/dashboard/nomina'},
            ]
        },
        {
            label: 'Reportes',
            items: [
                {
                    label: 'Todos los Reportes',
                    icon: 'pi pi-fw pi-book',
                    items:
                        [
                            { label: 'Departamentos', icon: 'pi pi-chart-pie', to: '/dashboard/reports/departments' },
                            { label: 'Areas (Cargos)', icon: 'pi pi-chart-pie', to: '/dashboard/reports/areas' },
                            { label: 'Empleados', icon: 'pi pi-chart-pie', to: '/dashboard/reports/employees' },
                            { label: 'Usuarios', icon: 'pi pi-chart-pie', to: '/dashboard/reports/users' },
                            { label: 'Nomina', icon: 'pi pi-chart-pie', to: '/dashboard/reports/nomina' },
                        ]
                },
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;