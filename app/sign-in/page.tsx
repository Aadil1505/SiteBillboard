import GoogleSignInButton from "@/components/global/google-sign-in-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignInPage() {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (session) {
        redirect("/");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-semibold text-foreground">Welcome back</CardTitle>
                    <CardDescription className="text-muted-foreground">Sign in to your account to continue</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center">
                    <GoogleSignInButton />
                </CardContent>
                <CardDescription>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground px-4">
                            By signing in, you agree to our{" "}
                            <a href="#" className="text-primary hover:underline">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-primary hover:underline">
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                </CardDescription>
            </Card>
        </div>
    )
}
