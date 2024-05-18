
import { Link, useHref, useNavigate } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '../types';
import { LayoutContext } from './context/layoutcontext';
import { useAuth } from "../api/context/AuthContext";

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { logout, isAuthenticated, user } = useAuth();
    const { layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));


    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const accept = () => {
        logout();
        navigate('/', { replace: true, state: { refresh: true } });
    }

    const confirm1 = () => {
        confirmDialog({
            message: 'Realmente quieres cerrar sesión?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept,
        });
    };


    return (
        <div className="layout-topbar">
            <ConfirmDialog />
            <Toast ref={toast} />
            <Link to="/dashboard" className="layout-topbar-logo">
                <img src='/images/logos/sistema-contable-logo.svg' width="47.22px" height={'35px'} alt="logo" />
                <span>SISTEMA CONTABLE</span>
            </Link>
            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <div className='mt-auto -m-1'>
                    {isAuthenticated ? (
                        <h5 className='text-gray-700'>Bienvenido, {user?.name} {user?.last_name} 👋</h5>
                    ) : (
                        <h5></h5>
                    )}
                </div>
                {/* <Link to="/dashboard/company">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button>
                </Link> */}
                
                {/* <Link to="/" onClick={() => { logout(); }}> */}
                <button onClick={confirm1} type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-power-off"></i>
                    <span>Cerrar Sesión</span>
                </button>
                {/* </Link> */}
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;