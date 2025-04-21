export interface User {
    name: string;
    email: string;
    img?: string; // Optional, as it might not always be set
    role: 'regular' | 'owner';
    responsibleCompanyId?: string; // Optional, only for owners
    score: number;
    plastic: number;
    glass: number;
    metal: number;
    other: number;
    createdAt: string;
    updatedAt: string;
}