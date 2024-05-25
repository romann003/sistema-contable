//? ------------------------ Model Types ------------------------
export interface Company {
    id: number | null;
    business_name: string;
    nit: string | null;
    phone: string | null;
    address: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface Employee {
    id: number | null;
    name: string;
    last_name: string;
    fullName: string;
    phone: string | null;
    country: string | null;
    identification_type: string | null;
    identification: string | null;
    nit: string | null;
    igss: string | null;
    gender: string | null;
    birthdate: string;
    address: string;
    hire_date: string;
    contract_type: string;
    work_day: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    department: string | null;
    departmentId: number | null;
    employee: string | null;
    area: string;
    areaId: number | null;
}

// export interface Nomina {
//     id: number | null;
//     // bonificacion: number | null;
//     horas_extra: number | null;
//     // vacaciones_pagadas: number | null;
//     // aguinaldo: number | null;
//     // total_percepciones: number | null;
//     // isr: number | null;
//     // igss_patronal: number | null;
//     // igss_laboral: number | null;
//     // prestamos: number | null;
//     // total_deducciones: number | null;
//     // liquido_percibir: number | null;
//     // periodo_liquidacion_inicio: string;
//     // periodo_liquidacion_final: string;
//     // fecha_pago: string;
//     // status: boolean;
//     createdAt: string;
//     updatedAt: string;
//     employee: string;
//     employeeId: number | null;
//     company: string;
//     companyId: number | null;
//     periodo: string;
//     periodoId: number | null;
// }
// export interface Periodo {
//     id: number | null;
//     periodo_liquidacion_inicio: string;
//     periodo_liquidacion_final: string;
//     fecha_pago: string;
//     status: boolean;
//     createdAt: string;
//     updatedAt: string;
// }

// export interface Bonificacion {
//     id: number | null;
//     descripcion: string;
//     cantidad: number | null;
//     createdAt: string;
//     updatedAt: string;
//     nomina: string;
//     nominaId: number | null;
// }

//? ------------------------ Types ------------------------
export interface Status {
    name: string;
    code: boolean;
}
export interface Country {
    name: string;
    code: string;
}
export interface Gender {
    name: string;
    code: string;
}
export interface Identification_type {
    name: string;
    code: string;
}
export interface Contract_type {
    name: string;
    code: string;
}
export interface Work_day {
    name: string;
    code: string;
}

//? ------------------------ Initial Model Data ------------------------
export const emptyCompany: Company = {
    id: null,
    business_name: '',
    nit: null,
    phone: null,
    address: '',
    status: true,
    createdAt: '',
    updatedAt: ''
};

export const emptyEmployee: Employee = {
    id: null,
    name: '',
    last_name: '',
    fullName: '',
    phone: '',
    country: '',
    identification_type: '',
    identification: '',
    nit: '',
    igss: '',
    gender: '',
    birthdate: '',
    address: '',
    hire_date: '',
    contract_type: '',
    work_day: '',
    status: true,
    createdAt: '',
    updatedAt: '',
    department: '',
    departmentId: null,
    employee: '',
    area: '',
    areaId: null
};

// export const emptyNomina: Nomina = {
//     id: null,
//     // bonificacion: null,
//     horas_extra: null,
//     // vacaciones_pagadas: null,
//     // aguinaldo: null,
//     // total_percepciones: null,
//     // isr: null,
//     // igss_patronal: null,
//     // igss_laboral: null,
//     // prestamos: null,
//     // total_deducciones: null,
//     // liquido_percibir: null,
//     // periodo_liquidacion_inicio: '',
//     // periodo_liquidacion_final: '',
//     // fecha_pago: '',
//     // status: true,
//     createdAt: '',
//     updatedAt: '',
//     employee: '',
//     employeeId: null,
//     company: '',
//     companyId: null,
//     periodo: '',
//     periodoId: null
// };

// export const emptyPeriodo: Periodo = {
//     id: null,
//     periodo_liquidacion_inicio: '',
//     periodo_liquidacion_final: '',
//     fecha_pago: '',
//     status: true,
//     createdAt: '',
//     updatedAt: ''
// };

// export const emptyBonificacion: Bonificacion = {
//     id: null,
//     descripcion: '',
//     cantidad: null,
//     createdAt: '',
//     updatedAt: '',
//     nomina: '',
//     nominaId: null
// };

//? ------------------------ Initial Data ------------------------

export const typeStatus: Status[] = [
    { name: 'Activo', code: true },
    { name: 'Inactivo', code: false }
];

export const typeGender: Gender[] = [
    { name: 'Hombre', code: 'hombre' },
    { name: 'Mujer', code: 'mujer' }
];

export const typeCountry: Country[] = [
    { name: 'Guatemala', code: 'guatemala' },
    { name: 'Mexico', code: 'mexico' },
    { name: 'Estados Unidos', code: 'estados unidos' }
];

export const typeIdentification: Identification_type[] = [
    { name: 'Dpi', code: 'dpi' },
    { name: 'Pasaporte', code: 'pasaporte' },
];

export const typeContract: Contract_type[] = [
    { name: 'Contrato', code: 'contrato' },
    { name: 'Indefinido', code: 'indefinido' },
];

export const typeWorkDay: Work_day[] = [
    { name: '8 Horas Diarias', code: '8 horas diarias' },
];