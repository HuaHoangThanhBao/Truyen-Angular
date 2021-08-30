export interface AdminForRegistrationDto {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    quyen?: number,
    confirmPassword?: string;
}