import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@app/components/ui/Card.tsx";
import {AlertCircle, Brain} from "lucide-react";
import {Alert, AlertDescription} from "@app/components/ui/Alert.tsx";
import {Label} from "@app/components/ui/Label.tsx";
import {Progress} from "@app/components/ui/Progress.tsx";
import {AnimatePresence, motion} from "framer-motion";
import MoodSelector from "@app/ modules/MentalHealthTracker/components/MoodSelector.tsx";
import AnxietyStressLevels from "@app/ modules/MentalHealthTracker/components/AnxietyStressLevels.tsx";
import SleepSection from "@app/ modules/MentalHealthTracker/components/SleepSection.tsx";
import PhysicalActivitySection from "@app/ modules/MentalHealthTracker/components/PhysicalActivitySection.tsx";
import SocialInteractions from "@app/ modules/MentalHealthTracker/components/SocialInteractions.tsx";
import NotesSection from "@app/ modules/MentalHealthTracker/components/NotesSection.tsx";
import {Button} from "@app/components/ui/Button.tsx";
import {API_BASE_URL, MentalHealthFormData} from "@app/lib/types.ts";
import {useEffect, useState} from "react";
import {toast} from "@app/hooks/useToast.ts";


const initialFormData: MentalHealthFormData = {
    moodRating: -1,
    anxietyLevel: "",
    sleepHours: "",
    sleepQuality: "",
    sleepDisturbances: [],
    physicalActivityType: "",
    physicalActivityDuration: "",
    socialInteractions: "",
    stressLevel: "",
    symptoms: "",
}

const MentalHealthTrackerForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<MentalHealthFormData>(initialFormData)
    const [formProgress, setFormProgress] = useState(0)

    const handleFormChange = <K extends keyof MentalHealthFormData>(field: K, value: MentalHealthFormData[K]) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/logs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit log');
            }

            toast({
                title: 'Success!',
                description: 'Your daily log has been recorded.',
            });

            setFormData(initialFormData);
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'Failed to submit your daily log. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    // Calculate form completion progress
    useEffect(() => {
        const totalFields = 8
        let completedFields = 0

        if (formData.moodRating !== -1) completedFields++
        if (formData.anxietyLevel) completedFields++
        if (formData.sleepHours) completedFields++
        if (formData.sleepQuality) completedFields++
        if (formData.physicalActivityType) completedFields++
        if (formData.socialInteractions) completedFields++
        if (formData.stressLevel) completedFields++
        if (formData.symptoms.length > 0) completedFields++

        setFormProgress((completedFields / totalFields) * 100)
    }, [formData])


    return (
        <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Brain className="h-6 w-6 text-primary"/>
                    Daily Mental Health Log
                </CardTitle>
                <CardDescription>Track your mental well-being</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert className="mb-6 bg-primary/10 border-primary/20 flex items-center">
                    <AlertCircle className="h-4 w-4 text-primary"/>
                    <AlertDescription className="mt-1">Your data is encrypted and stored
                        securely</AlertDescription>
                </Alert>
                <div className="mb-6">
                    <Label className="text-sm text-muted-foreground">Form Completion</Label>
                    <Progress value={formProgress} className="mt-2"/>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className="space-y-4"
                        >
                            <MoodSelector
                                value={formData.moodRating}
                                onChange={(value) => handleFormChange("moodRating", value)}
                            />
                            <AnxietyStressLevels
                                anxietyLevel={formData.anxietyLevel}
                                stressLevel={formData.stressLevel}
                                setAnxietyLevel={(value) => handleFormChange("anxietyLevel", value)}
                                setStressLevel={(value) => handleFormChange("stressLevel", value)}
                            />
                            <SleepSection
                                sleepHours={formData.sleepHours}
                                sleepQuality={formData.sleepQuality}
                                sleepDisturbances={formData.sleepDisturbances}
                                setSleepHours={(value) => handleFormChange("sleepHours", value)}
                                setSleepQuality={(value) => handleFormChange("sleepQuality", value)}
                                setSleepDisturbances={(value) => handleFormChange("sleepDisturbances", value)}
                            />
                            <PhysicalActivitySection
                                physicalActivityType={formData.physicalActivityType}
                                setPhysicalActivityType={(value) => handleFormChange("physicalActivityType", value)}
                                physicalActivityDuration={formData.physicalActivityDuration}
                                setPhysicalActivityDuration={(value) => handleFormChange("physicalActivityDuration", value)}
                            />
                            <SocialInteractions
                                value={formData.socialInteractions}
                                onChange={(value) => handleFormChange("socialInteractions", value)}
                            />
                            <NotesSection
                                symptoms={formData.symptoms}
                                setSymptoms={(value) => handleFormChange("symptoms", value)}
                            />
                        </motion.div>
                    </AnimatePresence>

                    <Button type="submit" className="w-full text-md"
                            disabled={isSubmitting || formProgress < 100}>
                        {isSubmitting
                            ? "Submitting..."
                            : formProgress < 100
                                ? "Please Complete All Fields"
                                : "Submit Daily Log"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
export default MentalHealthTrackerForm;
