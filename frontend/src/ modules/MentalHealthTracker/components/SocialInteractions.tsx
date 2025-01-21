import {Label} from "@app/components/ui/Label";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@app/components/ui/Tooltip.tsx";
import {Info, Users} from "lucide-react";
import {Slider} from "@app/components/ui/Slider.tsx";
import React from "react";
import {Badge} from "@app/components/ui/Badge.tsx";

interface SocialInteractionsProps {
    value: string;
    onChange: (value: string) => void;
}

const SocialInteractions: React.FC<SocialInteractionsProps> = ({value, onChange}) => {
    return (
        <div className="space-y-4">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Label className="flex items-center gap-2 cursor-help">
                            <Users className="h-4 w-4 text-primary"/>
                            Social Interactions
                            <Info className="h-4 w-4 text-muted-foreground"/>
                        </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Rate your level of social interaction today from 1 (Very Low) to 10 (Very High)</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Slider
                value={[parseInt(value) || 1]}
                max={10}
                min={1}
                step={1}
                className="mt-2"
                onValueChange={(value) => onChange(value[0].toString())}
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Minimal interaction</div>
                </div>
                <div className="space-y-1 text-right">
                    <div className="text-xs text-muted-foreground">Frequent interaction</div>
                </div>
            </div>
            <Badge className="text-sm" variant={'default'}>
                {(() => {
                    const selectedValue = parseInt(value) || 5;
                    if (selectedValue <= 2) return "Minimal social contact today";
                    if (selectedValue <= 4) return "Some brief interactions";
                    if (selectedValue <= 6) return "Moderate social engagement";
                    if (selectedValue <= 8) return "Regular social activities";
                    return "Very socially active day";
                })()}
            </Badge>
        </div>
    )
}

export default SocialInteractions;
