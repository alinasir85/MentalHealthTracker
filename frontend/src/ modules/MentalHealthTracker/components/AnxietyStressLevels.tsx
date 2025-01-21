import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@app/components/ui/Tooltip.tsx";
import {Label} from "@app/components/ui/Label.tsx";
import {Activity, Brain, Info} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@app/components/ui/Select.tsx";
import {ANXIETY_LEVELS, STRESS_LEVELS} from "@app/lib/types.ts";

interface AnxietyStressLevelsProps {
    anxietyLevel: string;
    stressLevel: string;
    setAnxietyLevel: (value: string) => void;
    setStressLevel: (value: string) => void;
}

const AnxietyStressLevels: React.FC<AnxietyStressLevelsProps> = ({
                                                                     anxietyLevel,
                                                                     stressLevel,
                                                                     setAnxietyLevel,
                                                                     setStressLevel
                                                                 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Label className="flex items-center gap-2 cursor-help">
                                <Activity className="h-4 w-4 text-primary"/>
                                Anxiety Level
                                <Info className="h-4 w-4 text-muted-foreground"/>
                            </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Rate your current anxiety level</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Select
                    value={anxietyLevel}
                    onValueChange={(value) => setAnxietyLevel(value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select level"/>
                    </SelectTrigger>
                    <SelectContent>
                        {ANXIETY_LEVELS.map(({value, label}) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Label className="flex items-center gap-2 cursor-help">
                                <Brain className="h-4 w-4 text-primary"/>
                                Stress Level
                                <Info className="h-4 w-4 text-muted-foreground"/>
                            </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Rate your current stress level</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Select
                    value={stressLevel}
                    onValueChange={(value) => setStressLevel(value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select level"/>
                    </SelectTrigger>
                    <SelectContent>
                        {STRESS_LEVELS.map(({value, label}) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
export default AnxietyStressLevels;
