export interface UpdatePasswordDto {
    email: string;
    oldPassword: string;
    password: string;
    confirmPassword: string;
}