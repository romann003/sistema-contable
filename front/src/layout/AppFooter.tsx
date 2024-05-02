import { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <img src='/images/logos/sistema-contable-logo.svg' alt="Logo" height="20" className="mr-2" />
            Por
            <span className="font-bold ml-2">Grupo #3</span>
        </div>
    );
};

export default AppFooter;
