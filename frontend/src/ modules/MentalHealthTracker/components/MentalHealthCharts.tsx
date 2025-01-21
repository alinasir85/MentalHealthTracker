import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@app/components/ui/Card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@app/components/ui/Select";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@app/components/ui/Tabs";
import {compareAsc, format, parse} from 'date-fns';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip as ChartTooltip,
    XAxis,
    YAxis
} from "recharts";
import {useEffect, useRef, useState} from "react";
import {useToast} from "@app/hooks/useToast.ts";
import {useAuth} from "@app/providers/AuthContext.tsx";
import {API_BASE_URL, WS_URL} from "@app/lib/types.ts";


enum ChartTypes {
    LINE = 'line',
    BAR = 'bar',
    PIE = 'pie'
}

type TimeRange = 'week' | 'month' | '3months';

interface ChartDataPoint {
    date: string;
    mood: number;
    anxiety: number;
    stress: number;
    sleep: number;
}

interface PieChartDataPoint {
    name: string;
    value: number;
}

interface TimeRangeMap {
    [key: string]: number;

    week: number;
    month: number;
    '3months': number;
}

interface ChartColors {
    [key: string]: string;

    mood: string;
    anxiety: string;
    stress: string;
    sleep: string;
}


// Constants
const COLORS: ChartColors = {
    mood: '#28bf21',
    anxiety: '#ff4444',
    stress: '#a60f85',
    sleep: '#f09930'
};

const TIME_RANGES: TimeRangeMap = {
    week: 7,
    month: 30,
    "3months": 90,
};

const MentalHealthCharts = () => {

    const [chartData, setChartData] = useState<ChartDataPoint[]>([])
    const [timeRange, setTimeRange] = useState<TimeRange>("week")
    const {toast} = useToast()
    const {user} = useAuth();
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (user) {
            const token = localStorage.getItem('token');
            const wsUrl = `${WS_URL}?token=${token}`;
            wsRef.current = new WebSocket(wsUrl);

            // Store WebSocket reference globally for access during logout
            window.mentalhealthWS = wsRef.current;

            wsRef.current.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === 'NEW_LOG') {
                    // Update chart data with the new log
                    const newDataPoint = {
                        date: format(new Date(message.data.date), 'MMM dd'),
                        mood: message.data.moodRating[0],
                        anxiety: parseInt(message.data.anxietyLevel),
                        stress: parseInt(message.data.stressLevel),
                        sleep: parseInt(message.data.sleepHours)
                    };
                    setChartData(prev => [...prev, newDataPoint]);
                }
            };

            wsRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                toast({
                    title: 'Connection Error',
                    description: 'Lost connection to the server. Please refresh the page.',
                    variant: 'destructive',
                });
            };
        }

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [user]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/logs?timeRange=${timeRange}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch logs');
                }

                const logs = await response.json();
                const transformedData: ChartDataPoint[] = logs.map((log: any) => ({
                    date: format(new Date(log.date), 'MMM dd'),
                    mood: log.mood_rating,
                    anxiety: log.anxiety_level,
                    stress: log.stress_level,
                    sleep: log.sleep_hours,
                }));

                setChartData(transformedData);
            } catch (error) {
                console.error('Error fetching logs:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to fetch logs. Please try again.',
                    variant: 'destructive',
                });
            }
        };

        if (user) {
            fetchLogs();
        }
    }, [timeRange, user]);

    // Function to sort and filter data by time range
    const getTimeRangeData = (): ChartDataPoint[] => {
        const filteredData = chartData.slice(-TIME_RANGES[timeRange]);

        return filteredData.sort((a, b) => {
            const dateA = parse(a.date, 'MMM dd', new Date());
            const dateB = parse(b.date, 'MMM dd', new Date());
            return compareAsc(dateA, dateB);
        });
    };

    const calculateAverages = (): PieChartDataPoint[] => {
        const data = getTimeRangeData();
        if (data.length === 0) return [];

        const sum = data.reduce((acc, curr) => ({
            mood: acc.mood + curr.mood,
            anxiety: acc.anxiety + curr.anxiety,
            stress: acc.stress + curr.stress,
            sleep: acc.sleep + curr.sleep
        }), {mood: 0, anxiety: 0, stress: 0, sleep: 0});

        const count = data.length;

        return [
            {name: 'Mood', value: sum.mood / count},
            {name: 'Anxiety', value: sum.anxiety / count},
            {name: 'Stress', value: sum.stress / count},
            {name: 'Sleep', value: sum.sleep / count}
        ];
    };

    // Custom tooltip formatter
    const formatTooltipValue = (value: number): string => {
        return value.toFixed(1);
    };

    const tooltipStyle: React.CSSProperties = {
        backgroundColor: "hsl(var(--background))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "var(--radius)",
    };

    const tooltipLabelStyle: React.CSSProperties = {
        color: "hsl(var(--foreground))",
    };

    return (
        <Card className="md:col-span-1">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Your Mental Health Trends</CardTitle>
                        <CardDescription>View your progress over time</CardDescription>
                    </div>
                    <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select time range"/>
                        </SelectTrigger>
                        <SelectContent>
                            {(Object.keys(TIME_RANGES) as TimeRange[]).map((range) => (
                                <SelectItem key={range} value={range}>
                                    {range === 'week' ? 'Last 7 Days' :
                                        range === 'month' ? 'Last 30 Days' :
                                            'Last 90 Days'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={ChartTypes.LINE} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        {Object.values(ChartTypes).map((type) => (
                            <TabsTrigger key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)} Chart
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value={ChartTypes.LINE}>
                        <div className="h-[400px] mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={getTimeRangeData()}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-50"/>
                                    <XAxis
                                        dataKey="date"
                                        stroke="currentColor"
                                        className="text-muted-foreground text-xs"
                                    />
                                    <YAxis
                                        domain={[0, 10]}
                                        stroke="currentColor"
                                        className="text-muted-foreground text-xs"
                                        tickFormatter={formatTooltipValue}
                                    />
                                    <ChartTooltip
                                        contentStyle={tooltipStyle}
                                        labelStyle={tooltipLabelStyle}
                                        formatter={formatTooltipValue}
                                    />
                                    {Object.entries(COLORS).map(([key, color]) => (
                                        <Line
                                            key={key}
                                            type="monotone"
                                            dataKey={key}
                                            stroke={color}
                                            name={key.charAt(0).toUpperCase() + key.slice(1)}
                                            strokeWidth={2}
                                            dot={{strokeWidth: 2}}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>

                    <TabsContent value={ChartTypes.BAR}>
                        <div className="h-[400px] mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={getTimeRangeData()}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-50"/>
                                    <XAxis
                                        dataKey="date"
                                        stroke="currentColor"
                                        className="text-muted-foreground text-xs"
                                    />
                                    <YAxis
                                        domain={[0, 10]}
                                        stroke="currentColor"
                                        className="text-muted-foreground text-xs"
                                        tickFormatter={formatTooltipValue}
                                    />
                                    <ChartTooltip
                                        contentStyle={tooltipStyle}
                                        labelStyle={tooltipLabelStyle}
                                        formatter={formatTooltipValue}
                                    />
                                    {Object.entries(COLORS).map(([key, color]) => (
                                        <Bar
                                            key={key}
                                            dataKey={key}
                                            fill={color}
                                            name={key.charAt(0).toUpperCase() + key.slice(1)}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>

                    <TabsContent value={ChartTypes.PIE}>
                        <div className="h-[400px] mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={calculateAverages()}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({name, value}: PieChartDataPoint) =>
                                            `${name}: ${formatTooltipValue(value)}`
                                        }
                                        outerRadius={150}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {calculateAverages().map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
                                            />
                                        ))}
                                    </Pie>
                                    <ChartTooltip formatter={formatTooltipValue}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default MentalHealthCharts;
