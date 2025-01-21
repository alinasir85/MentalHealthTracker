import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@app/components/ui/Tooltip.tsx";
import {Label} from "@app/components/ui/Label.tsx";
import {Info} from "lucide-react";
import {Textarea} from "@app/components/ui/Textarea.tsx";

interface NotesSectionProps {
    symptoms: string;
    setSymptoms: (symptoms: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({symptoms, setSymptoms}) => {
    return (
        <div className="space-y-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Label className="flex items-center gap-2 cursor-help">
                            Symptoms & Notes
                            <Info className="h-4 w-4 text-muted-foreground"/>
                        </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Add any additional symptoms or notes about your day</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Textarea
                placeholder="Describe any symptoms or add notes..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="min-h-[100px]"
            />
        </div>
    )
}
export default NotesSection;
