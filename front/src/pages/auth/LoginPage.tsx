import { useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../api/context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';


import { LayoutContext } from '../../layout/context/layoutcontext';
import { classNames } from 'primereact/utils';

export default function LoginPage() {
    const { layoutConfig } = useContext(LayoutContext);
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const { signin, errors: signinErrors, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const onSubmit = handleSubmit(async (data) => {
        signin(data);
        // console.clear();
    });

    useEffect(() => {
        if (isAuthenticated) navigate("/dashboard");
    }, [isAuthenticated, navigate]);



    const toast = useRef<Toast>(null);
    const showInfo = (severity, summary, detail) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
        toast.current?.clear;
    }

    // const clear = () => {
    //     toast.current?.clear();
    // };

    return (
        <>
            <form onSubmit={onSubmit} className="p-fluid">

                {/* ERRORES */}
                <Toast ref={toast} />

                {signinErrors.map((error, i) => (
                    <div key={i}>
                        {showInfo('error', 'Error', error)}
                    </div>
                ))}

                <div className={containerClassName}>

                    <div className="flex flex-column align-items-center justify-content-center">
                        <Link to="/">
                            <img src="/images/logos/sistema-contable-logo.svg" alt="logo" className="my-5 w-4rem flex-shrink-0" />
                        </Link>
                        <div
                            style={{
                                borderRadius: '56px',
                                padding: '0.3rem',
                                background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                            }}
                        >
                            <div className="w-full surface-card py-8 px-6 sm:px-6" style={{ borderRadius: '53px' }}>
                                <div className="text-center mb-6">
                                    <div className="text-900 text-3xl font-medium mb-3">Inicia Sesión</div>
                                    <span className="text-600 font-medium">Sistema Conable - Proyecto UMG</span>
                                </div>

                                <div>
                                    <div className="flex flex-column ">
                                        <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                            Correo electrónico
                                        </label>
                                        <InputText
                                            id="email"
                                            type="email"
                                            placeholder="Correo electrónico"
                                            className="w-full md:w-30rem mb-2"
                                            style={{ padding: '1rem' }}
                                            {...register('email', { required: true })}
                                        />

                                        {errors.email && (<div>{showInfo('warn', 'Error', 'Email requerido')}
                                        </div>)}

                                    </div>

                                    <div className="flex flex-column mt-3">
                                        <label htmlFor="password" className="block text-900 text-xl font-medium mb-2">
                                            Contraseña
                                        </label>
                                        {/* <Password value={value1} onChange={(e) => setValue1(e.target.value)} feedback={false} 
                                        id="password" placeholder="Contraseña" toggleMask className="w-full md:w-30rem mb-2" inputClassName="w-full p-3 md:w-30rem" 
                                        {...register("password", { required: true })}
                                        /> */}
                                        <InputText
                                            id="password"
                                            type="password"
                                            placeholder="Contraseña"
                                            className="w-full md:w-30rem mb-2"
                                            style={{ padding: '1rem' }}
                                            {...register('password', { required: true })}
                                        />
                                        {/* {errors.password && (<p className="text-red-500">Contraseña requerido</p>)} */}
                                        {errors.password && (<div>{showInfo('warn', 'Error', 'Contraseña requerida')}</div>)}

                                    </div>
                                    <div className="flex align-items-center justify-content-between mb-5 gap-5"></div>
                                    <Button type="submit" label="Iniciar Sesión" className="w-full p-3 text-xl"></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}
