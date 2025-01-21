# Mental Health Progress Tracker

A simple and secure web application designed to help users log and track their mental health trends over time. The app
allows users to record daily mental health statuses and view trends through interactive visualizations.

## Features

### Frontend (React)

- **User Authentication:**  
  Login with Google for secure and personalized access.
- **Daily Log Form:**  
  Track the following mental health parameters:
    - Mood Ratings: Self-reported on a scale from very sad to very happy.
    - Anxiety Levels: Self-assessed anxiety levels.
    - Sleep Patterns: Hours of sleep, quality of sleep, and disturbances.
    - Physical Activity: Type and duration of physical activity.
    - Social Interactions: Frequency of social engagements.
    - Stress Levels: Self-reported stress levels.
    - Symptoms of Depression/Anxiety: Presence and severity of specific symptoms.
- **Data Visualization:**  
  View weekly or monthly trends of selected parameters via interactive charts.
- **Real-Time Updates:**  
  Leverages WebSocket technology to provide real-time data updates for visualizations.
- **Interactive UI/UX:**  
  Features modals, tooltips, and transitions to enhance usability.

### Backend (Node.js)

- **API Endpoints:**
    - User authentication endpoints.
    - `POST /log`: Submit daily logs.
    - `GET /logs`: Retrieve logs for visualization.
- **Database Integration:**  
  Uses SQLite for secure storage of user credentials and daily logs.

---
