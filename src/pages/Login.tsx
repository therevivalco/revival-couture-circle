import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;

                if (data.session) {
                    toast.success("Successfully created account!");
                    navigate(from, { replace: true });
                } else {
                    toast.success("Check your email for the confirmation link!");
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success("Successfully logged in!");
                navigate(from, { replace: true });
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFDF9]">
            <Navigation />
            <div className="flex-1 flex items-center justify-center p-4 pt-24">
                <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-sm border border-neutral-100">
                    <div className="text-center">
                        <h2 className="text-3xl font-serif text-neutral-900">
                            {isSignUp ? "Create an account" : "Welcome back"}
                        </h2>
                        <p className="mt-2 text-neutral-600">
                            {isSignUp
                                ? "Join our community of conscious fashion lovers"
                                : "Sign in to access your account"}
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                        <div className="space-y-4">
                            {isSignUp && (
                                <div>
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="mt-1"
                                        placeholder="John Doe"
                                    />
                                </div>
                            )}
                            <div>
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-olive hover:bg-olive/90 text-white"
                            disabled={loading}
                        >
                            {loading
                                ? "Loading..."
                                : isSignUp
                                    ? "Create Account"
                                    : "Sign In"}
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-neutral-600">
                                {isSignUp
                                    ? "Already have an account? "
                                    : "Don't have an account? "}
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="font-medium text-olive hover:underline"
                            >
                                {isSignUp ? "Sign in" : "Sign up"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
