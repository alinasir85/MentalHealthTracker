import MentalHealthTracker from "@app/ modules/MentalHealthTracker/MentalHealthTracker.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {AuthProvider} from "@app/providers/AuthContext.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import ProtectedRoute from "@app/components/ProtectedRoute.tsx";
import Login from "@app/ modules/Login/Login.tsx";
import Header from "@app/components/Header.tsx";

function App() {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID!}>
            <AuthProvider>
                <BrowserRouter>
                    <div className="min-h-screen bg-background">
                        <Routes>
                            <Route path="/login" element={<Login/>}/>
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <>
                                            <Header/>
                                            <MentalHealthTracker/>
                                        </>
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
                        </Routes>
                    </div>
                </BrowserRouter>
            </AuthProvider>
        </GoogleOAuthProvider>
    )
}

export default App
