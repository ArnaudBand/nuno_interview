"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Form,
} from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { auth } from "@/firebase/client";
import { register, login } from "@/lib/actions/auth.actions";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(8),
    });
}

const AuthForm = ({ type } : { type: FormType }) => {

    const router = useRouter();
    // 1. Define your form.
    const formSchema = authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (type === "sign-up") {
                // Sign Up Logic
                const { name, email, password } = values;

                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

                const createdUser = await register({
                    name: name!,
                    email,
                    password,
                    uid: userCredentials.user.uid
                })

                if (!createdUser?.success) {
                    toast.error(createdUser?.message);
                    return;
                }
                toast.success("Sign up successful");
                router.push("/sign-in");
            } else {
                // Sign In logic
                const { email, password } = values;

                const userCredentials = await signInWithEmailAndPassword(auth, email, password);

                const idToken = await userCredentials.user.getIdToken();

                if (!idToken) {
                    toast.error("Failed to login");
                    return;
                }

                const loginResult = await login({
                    email,
                    idToken
                });

                if (!loginResult?.success) {
                    toast.error(loginResult?.message);
                    return;
                }

                toast.success("Sign in successful");
                router.push('/');
            }
        } catch (error) {
            console.log(error);
            toast.error(`An error occurred. Please try again. ${error}`);
        }
    }

    const isSignIn = type === "sign-in";

    return (
        <div className="card-border lg:min-w-[556px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" width={38} height={32} alt="Logo" />
                    <h1 className="text-2xl font-semibold text-white/25">PrepWise</h1>
                </div>
                <h3 className="text-lg font-semibold text-white/75">
                    Practice the Job Interview With AI
                </h3>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full mt-4 form">
                        {!isSignIn && (
                            <FormField
                                control={form.control}
                                name="name"
                                label="Name"
                                placeholder="Your name"
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Your Email Address"
                            type="email"
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            label="Password"
                            type="password"
                            placeholder="Enter Your Password"
                        />
                        <Button type="submit" className="w-full rounded-lg bg-fuchsia-300 text-black/90">
                            {isSignIn ? "Sign In" : "Create an account"}
                        </Button>
                    </form>
                </Form>
                <p className="text-white/50 text-center">
                    {isSignIn ? "Don't have an account?" : "Already have an account?"}
                    <Link className="font-bold ml-1 text-user-primary" href={isSignIn ? "/sign-up" : "/sign-in"}>
                        {isSignIn ? "Sign up" : "Sign in"}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;