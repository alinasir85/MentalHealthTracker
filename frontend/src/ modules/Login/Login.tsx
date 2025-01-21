import React from 'react';
import {GoogleLogin} from '@react-oauth/google';
import {useNavigate} from 'react-router-dom';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@app/components/ui/Card.tsx";
import {useAuth} from "@app/providers/AuthContext.tsx";

const Login: React.FC = () => {
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSuccess = async (response: any) => {
        try {
            await login(response);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome to Mental Health Tracker</CardTitle>
                        <CardDescription>Please sign in to continue</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={() => console.log('Login Failed')}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
