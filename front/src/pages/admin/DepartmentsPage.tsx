import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

export default function DepartmentsPage() {
    const toast = useRef<Toast>(null);

    const detail = 'This is an external variable';


    const show = (severity, summary, detail) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
    };

    return (
        <div>
            <h5>Departments Page</h5>
            <div className="card flex justify-content-center">
                <Toast ref={toast} />
                <input
                    onClick={() => show('error', 'Mensaje de error',  detail)}
                />
            </div>
        </div>
    )
}
