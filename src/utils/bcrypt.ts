import * as bcrypt from 'bcryptjs';

export const encodeInformation = (information: string) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(information, salt);
}

export const isInformationMatching = (rawInformation: string, hashedInformation: string) => {
    return bcrypt.compareSync(rawInformation, hashedInformation);
}

