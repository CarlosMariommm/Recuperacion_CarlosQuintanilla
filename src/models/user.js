import {Schema, model} from "mongoose";

const userSchema = new Schema(
    {
        name:{ type: String},
        lastName:{ type: String},
        email: {type: String},
        password: {type: String},
        phone: {String},
        birthDate: {Date},
        picture: {String},
        clodinaryPublicId: {String},
        verificationCode: {String},
        codeExpires: {Date},
        isVerified: {Boolean},
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model ("User", userSchema);