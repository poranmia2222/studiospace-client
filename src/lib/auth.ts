import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("studiospace");

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true,
        autoSignIn: false
    }, 
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    database: mongodbAdapter(db, {
        client,
    }),
    plugins: [
        jwt(), 
    ],
    session:{
        cookieCache:{
            enabled:true,
            strategy:'jwt',
            maxAge: 60 * 60 * 24 * 7,
        }
    }
});