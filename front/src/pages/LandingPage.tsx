import { Button } from 'primereact/button';
import {Link} from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="flex flex-column align-items-center justify-content-center">
                <img src="/images/logos/sistema-contable-logo.svg" alt="logo" className="my-5 w-4rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-6 sm:px-6 flex flex-column align-items-center" style={{ borderRadius: '53px' }}>
                        <h1 className="text-900 font-bold text-5xl mb-2">Página de Inicio</h1>
                        <div className="text-600 mb-3">Bienvenido al sistema contable - PROYECTO UMG</div>
                        <img src="/images/welcome/welcome-page.svg" alt="Error" className="mb-2" width="60%" />
                        <Link to="/login">
                            <Button icon="pi pi-arrow-right" iconPos="right" label="Ir a Iniciar Sesión" text />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

}
