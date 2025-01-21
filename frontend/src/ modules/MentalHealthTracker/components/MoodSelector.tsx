import React from 'react';
import {Label} from "@app/components/ui/Label";
import {HeartPulse, Info} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@app/components/ui/Tooltip";

interface MoodSelectorProps {
    value: number[];
    onChange: (value: number[]) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({value, onChange}) => {
    const moods = [
        {emoji: "😫", value: 2, label: "Very Sad"},
        {emoji: "😞", value: 4, label: "Sad"},
        {emoji: "😐", value: 6, label: "Neutral"},
        {emoji: "☺️", value: 8, label: "Happy"},
        {emoji: "😄", value: 10, label: "Very Happy"},
    ];

    return (
        <div className="space-y-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Label className="flex items-center gap-2 cursor-help">
                            <HeartPulse className="h-4 w-4 text-primary"/>
                            Mood Rating
                            <Info className="h-4 w-4 text-muted-foreground"/>
                        </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Select the emoji that best matches your current mood</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <div className="flex justify-between items-center mt-4">
                {moods.map((mood) => (
                    <button
                        key={mood.value}
                        onClick={() => onChange([mood.value])}
                        className={`text-3xl p-2 rounded-full transition-transform hover:scale-110 ${
                            value[0] === mood.value ? 'bg-primary/10 scale-110' : ''
                        }`}
                        type="button"
                        aria-label={mood.label}
                    >
            <span role="img" aria-label={mood.label}>
              {mood.emoji}
            </span>
                    </button>
                ))}
            </div>

            <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Very Sad</span>
                <span>Very Happy</span>
            </div>
        </div>
    );
};

export default MoodSelector;
