import { objectType, stringArg } from "@nexus/schema";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export const Mutation = objectType({
    name: "Mutation",
    definition(t) {
        t.field("signup", {
            type: "AuthPayload",
            args: {
                email: stringArg({ nullable: false }),
                password: stringArg({ nullable: false }),
                name: stringArg()
            },
            resolve: async (parent, args, { prisma }) => {
                // TODO: check email and password are valid in more details

                if (args.email === "" || args.password === "") {
                    throw new Error("Please enter valid email and password");
                }

                const emailExist = await prisma.user.findOne({
                    where: { email: args.email }
                });

                if (emailExist) {
                    throw new Error("Email already taken");
                }

                const password = await bcrypt.hash(args.password, 10);
                const user = await prisma.user.create({
                    data: { ...args, password }
                });

                return {
                    token: jwt.sign(
                        { userId: user.id },
                        process.env.APP_SECRET as string
                    ),
                    user
                };
            }
        });

        t.field("signin", {
            type: "AuthPayload",
            args: {
                email: stringArg({ nullable: false }),
                password: stringArg({ nullable: false })
            },
            resolve: async (parent, { email, password }, { prisma }) => {
                if (email === "" || password === "") {
                    throw new Error("Please enter valid email and password");
                }

                const user = await prisma.user.findOne({
                    where: { email }
                });

                if (user === null || !user) {
                    throw new Error("Incorrect email");
                }

                const validPassword = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!validPassword) {
                    throw new Error("Invalid password");
                }

                return {
                    token: jwt.sign(
                        { userId: user.id },
                        process.env.APP_SECRET as string
                    ),
                    user
                };
            }
        });
    }
});
