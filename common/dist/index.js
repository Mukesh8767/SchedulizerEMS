"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instituteSignin = exports.instituteSignup = void 0;
const zod_1 = require("zod");
exports.instituteSignup = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8)
});
exports.instituteSignin = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8)
});
