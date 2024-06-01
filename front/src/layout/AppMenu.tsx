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
                { label: 'Puestos', icon: 'pi pi-fw pi-table', to: '/dashboard/puestos' },
                { label: 'Usuarios', icon: 'pi pi-verified pi-fw', to: '/dashboard/users' },
                { label: 'Mi empresa', icon: 'pi pi-fw pi-cog', to: '/dashboard/company' },
            ]
        },
        {
            label: 'Otras Acciones',
            items: [
                { label: 'Empleados', icon: 'pi pi-fw pi-user', to: '/dashboard/employees' },
                {
                    label: 'Registros Contables',
                    items: [
                        { label: 'Periodo Liquidación', icon: 'pi pi-calendar', to: '/dashboard/rc/periodo-liquidacion' },
                        { label: 'Nomina', icon: 'pi pi-inbox', to: '/dashboard/rc/nomina' },
                    ]
                }
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
                            { label: 'Puestos', icon: 'pi pi-chart-pie', to: '/dashboard/reports/puestos' },
                            { label: 'Empleados', icon: 'pi pi-chart-pie', to: '/dashboard/reports/employees' },
                            { label: 'Periodos (Meses)', icon: 'pi pi-chart-pie', to: '/dashboard/reports/periodos-liquidacion' },
                            { label: 'Nominas', icon: 'pi pi-chart-pie', to: '/dashboard/reports/nominas' },
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