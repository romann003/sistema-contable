import AppMenuitem from './AppMenuitem.tsx';
import { MenuProvider } from './context/menucontext.tsx';
import { AppMenuItem } from '../types';
import { useCompany } from '../api/context/CompanyContext.tsx';
import { useEffect } from 'react';
import { useAuth } from '../api/context/AuthContext.tsx';


const AppMenu = () => {
    const { isAuthenticated, user } = useAuth();

    const model: AppMenuItem[] = [
        {
            label: 'Inicio',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
        },
        {
            label: user?.rol !== 'moderador' ? 'Mi Empresa' : '', // Establecer el label principal condicionalmente
            items: (() => {
                const items = [];
                if (user?.rol === 'root' || user?.rol === 'administrador') {
                    items.splice(0, 0, { label: 'Departamentos', icon: 'pi pi-fw pi-clone', to: '/dashboard/departments' });
                    items.splice(1, 0, { label: 'Puestos', icon: 'pi pi-fw pi-table', to: '/dashboard/puestos' });
                }
                if (user?.rol === 'root') {
                    items.splice(3, 0, { label: 'Usuarios', icon: 'pi pi-verified pi-fw', to: '/dashboard/users' });
                    items.splice(4, 0, { label: 'Mi empresa', icon: 'pi pi-fw pi-cog', to: '/dashboard/company' });
                }
                return items;
            })()
        },
        {
            label: 'Otras Acciones',
            items: (() => {
                const items = [];
                if (user?.rol === 'root' || user?.rol === 'administrador') {
                    items.splice(2, 0, { label: 'Empleados', icon: 'pi pi-fw pi-user', to: '/dashboard/employees' });
                }
                items.push({
                    label: 'Registros Contables',
                    items: [
                        { label: 'Periodo Liquidación', icon: 'pi pi-calendar', to: '/dashboard/rc/periodo-liquidacion' },
                        { label: 'Nomina', icon: 'pi pi-inbox', to: '/dashboard/rc/nomina' }
                    ]
                });

                return items;
            })()
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