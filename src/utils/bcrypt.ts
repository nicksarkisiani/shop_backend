import * as bcrypt from 'bcryptjs';

export const encodePassword = (rawPassword: string) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(rawPassword, salt);
}