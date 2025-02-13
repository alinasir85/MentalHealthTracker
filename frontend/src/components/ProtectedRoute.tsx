import {ReactNode} from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from "@app/providers/AuthContext.tsx";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const {isAuthenticated, isLoading} = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
