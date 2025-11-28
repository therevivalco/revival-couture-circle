import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Account = () => {
    const { user, signOut, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFDF9]">
            <Navigation />
            <div className="flex-1 container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-neutral-100">
                    <h1 className="text-3xl font-serif mb-8">My Account</h1>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-500 mb-1">
                                Email
                            </label>
                            <div className="text-lg">{user?.email}</div>
                        </div>

                        <div className="pt-6 border-t border-neutral-100">
                            <Button
                                variant="outline"
                                onClick={() => signOut()}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Account;
