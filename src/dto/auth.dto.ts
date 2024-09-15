export interface UserLoginInput {
    email: string;
    password: string;
};

export interface UserPayload {
    _id: string;
    email: string;
    role: string;
    accountStatus: string;
    hospitalId: string;
    verified: boolean;
}

export interface ResetTokenPayload {
    _id: string;
    email: string;
    role: string;
    accountStatus: string;
}