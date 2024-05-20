//? ------------------------ Model Types ------------------------
export interface Employee {
    id: number | null;
    name: string;
    last_name: string;
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
export const emptyEmployee: Employee = {
    id: null,
    name: '',
    last_name: '',
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