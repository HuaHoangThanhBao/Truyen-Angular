export interface UserForRegistrationDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    quyen: number,
    confirmPassword: string;
    clientURI: string;
}