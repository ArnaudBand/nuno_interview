'use server';

import { SignInParams, SignUpParams, User } from "@/types";
import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";
import { ONE_WEEK_MS } from "@/lib/utils";

export async function register(params: SignUpParams) {
    const { uid, email, name } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if (userRecord.exists) {
            return {
                success: false,
                message: 'User Already Exists. Please Login'
            }
        }

        await db.collection('users').doc(uid).set({
            email,
            name
        })

        return {
            success: true,
            message: 'Registration Successful'
        }
    } catch (error: unknown) {
        console.log('Error in register:', error);

        if ((error as { code?: string }).code === 'auth/email-already-in-use') {
            return {
                success: false,
                message: 'Email Already In Use'
            }
        }

        return {
            success: false,
            message: 'Failed To Register'
        }
    }
}

export async function login(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if (!userRecord) {
            return {
                success: false,
                message: 'User Not Found. Please Register'
            }
        }

        await setSessionCookie(idToken);

        return {
            success: true,
            message: 'Logged In'
        }
    } catch (error: unknown) {
        console.log('Error in login:', error);

        return {
            success: false,
            message: 'Failed To Login'
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK_MS * 1000
    })

    cookieStore.set('my-session', sessionCookie, {
        maxAge: ONE_WEEK_MS,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('my-session')?.value;

    if (!sessionCookie) return null;

    try {
        const decodedClaim = await auth.verifySessionCookie(sessionCookie);

        const userRecord = await db
            .collection('users')
            .doc(decodedClaim.uid)
            .get();

        if (!userRecord) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id
        } as User

    } catch (error) {
        console.log('Failed to get current session:', error);

        return null;
    }
}

export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser();

    return !!user;
}