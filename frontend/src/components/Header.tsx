import {useAuth} from "@app/providers/AuthContext.tsx";
import {Button} from "@app/components/ui/Button.tsx";
import {LogOut, User} from "lucide-react";
import {Avatar, AvatarFallback} from "@app/components/ui/Avatar.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@app/components/ui/Dropdown.tsx";

const Header: React.FC = () => {
    const {user, logout} = useAuth();

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    return (
        <header className="w-full py-4 px-6 border-b bg-background">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-semibold">Mental Health Tracker</h1>

                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuItem className="flex items-center gap-2">
                                <User className="h-4 w-4"/>
                                <span>{user.name}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive flex items-center gap-2" onClick={logout}>
                                <LogOut className="h-4 w-4"/>
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
};

export default Header;
