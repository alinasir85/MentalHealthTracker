import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@app/components/ui/Tooltip.tsx";
import {Label} from "@app/components/ui/Label.tsx";
import {Info, Moon} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@app/components/ui/Select.tsx";
import {SLEEP_DISTURBANCES, SleepQuality} from "@app/lib/types.ts";
import {Input} from "@app/components/ui/Input.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@app/components/ui/Dialog.tsx";
import {Button} from "@app/components/ui/Button.tsx";
import {Badge} from "@app/components/ui/Badge.tsx";

interface SleepSectionProps {
    sleepHours: string;
    sleepQuality: SleepQuality | "";
    sleepDisturbances: string[];
    setSleepHours: (value: string) => void;
    setSleepQuality: (value: SleepQuality | "") => void;
    setSleepDisturbances: (value: string[]) => void;
}

const SleepSection: React.FC<SleepSectionProps> = ({
                                                       sleepHours,
                                                       setSleepHours,
                                                       sleepQuality,
                                                       setSleepQuality,
                                                       sleepDisturbances,
                                                       setSleepDisturbances
                                                   }) => {
    return (
        <div className="space-y-4">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Label className="flex items-center gap-2 cursor-help">
                            <Moon className="h-4 w-4 text-primary"/>
                            Sleep Details
                            <Info className="h-4 w-4 text-muted-foreground"/>
                        </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Enter your sleep duration and quality</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Hours of Sleep</Label>
                    <Input
                        type="number"
                        placeholder="Enter hours"
                        value={sleepHours}
                        onChange={(e) => setSleepHours(e.target.value)}
                        min="0"
                        max="24"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Sleep Quality</Label>
                    <Select
                        value={sleepQuality}
                        onValueChange={(value: SleepQuality) => setSleepQuality(value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select quality"/>
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(SleepQuality).map((quality) => (
                                <SelectItem key={quality} value={quality}>
                                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                        Add Sleep Disturbances
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sleep Disturbances</DialogTitle>
                        <DialogDescription>Select any sleep issues you
                            experienced</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2">
                        {SLEEP_DISTURBANCES.map((disturbance) => (
                            <Label
                                key={disturbance}
                                className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-accent"
                            >
                                <input
                                    type="checkbox"
                                    checked={sleepDisturbances.includes(disturbance)}
                                    onChange={(e) => {
                                        const newDisturbances = e.target.checked
                                            ? [...sleepDisturbances, disturbance]
                                            : sleepDisturbances.filter((d) => d !== disturbance)
                                        setSleepDisturbances(newDisturbances)
                                    }}
                                    className="rounded"
                                />
                                {disturbance}
                            </Label>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {sleepDisturbances.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {sleepDisturbances.map((disturbance) => (
                        <Badge key={disturbance} variant="default">
                            {disturbance}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}
export default SleepSection;
