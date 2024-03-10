export type User = {
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    day_of_birth?: string;
}

export type UsersJson = {
    source: string;
    users?: UserPayroll[];
    people?: UserEhr[];
}

export type UserPayroll = {
    payroll_id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    date_of_birth: string;
}

export type UserEhr = {
    ehr_id: number;
    name: string;
    date_of_birth: string;
    contact_info: {
        email_address?: string;
        email?: string;
        phone: string;
    }
}

