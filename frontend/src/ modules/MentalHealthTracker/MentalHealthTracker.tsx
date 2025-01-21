import {motion} from "framer-motion"
import MentalHealthCharts from "@app/ modules/MentalHealthTracker/components/MentalHealthCharts.tsx";
import MentalHealthTrackerForm from "@app/ modules/MentalHealthTracker/components/MentalHealthTrackerForm.tsx";


const MentalHealthTracker = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="grid gap-6 md:grid-cols-2"
                >
                    {/* Form Section */}
                    <MentalHealthTrackerForm/>
                    {/* Charts Section */}
                    <MentalHealthCharts/>
                </motion.div>
            </div>
        </div>
    )
}

export default MentalHealthTracker;
