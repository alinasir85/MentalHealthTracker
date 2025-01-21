import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@app/components/ui/Tooltip.tsx";
import {Label} from "@app/components/ui/Label.tsx";
import {Dumbbell, Info} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@app/components/ui/Select.tsx";
import {ActivityType} from "@app/lib/types.ts";
import {Input} from "@app/components/ui/Input.tsx";

interface PhysicalActivitySectionProps {
    physicalActivityType: ActivityType | "";
    physicalActivityDuration: string;
    setPhysicalActivityType: (value: ActivityType | "") => void;
    setPhysicalActivityDuration: (value: string) => void;
}

const PhysicalActivitySection: React.FC<PhysicalActivitySectionProps> = ({
                                                                             physicalActivityType,
                                                                             setPhysicalActivityType,
                                                                             physicalActivityDuration,
                                                                             setPhysicalActivityDuration
                                                                         }) => {
    return (
        <div className="space-y-4">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Label className="flex items-center gap-2 cursor-help">
                            <Dumbbell className="h-4 w-4 text-primary"/>
                            Physical Activity
                            <Info className="h-4 w-4 text-muted-foreground"/>
                        </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Select your activity type and duration</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Activity Type</Label>
                    <Select
                        value={physicalActivityType}
                        onValueChange={(value: ActivityType) => setPhysicalActivityType(value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select type"/>
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(ActivityType).map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                        type="number"
                        placeholder="Enter minutes"
                        value={physicalActivityDuration}
                        onChange={(e) => setPhysicalActivityDuration(e.target.value)}
                        min="0"
                        max="1440"
                    />
                </div>
            </div>
        </div>
    )
}
export default PhysicalActivitySection;
