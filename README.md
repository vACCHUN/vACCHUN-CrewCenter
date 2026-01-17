# Crew Center

Crew Center is a web-based platform designed to help virtual air traffic controllers manage bookings, schedules, and operations efficiently.

Crew Center was developed for vACCHUN (Virtual Area Control Center Hungary). This team controls air traffic within a flight simulator environment.

## Technologies

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MySQL
- **APIs:**
  - VATSIM OAuth API - User authentication via VATSIM CID using OAuth
  - VATSIM members API - Fetching a user's permissions
  - VATSIM Events API - Highlight scheduled events

## Features

- Users can indicate their intention to control specific positions and can modify or delete their bookings.
- The application includes an administration page where users with administrator privileges can manage or remove team members.
- A permission system was implemented that prevents users from booking positions above their rating.
- Trainee controllers can book higher positions; these bookings will appear visually highlighted to assist instructors.

## Planned Improvements

- ✔ Refactoring the frontend codebase
- ✔ Implementing a sectorization system identical to the one used by real world air traffic control in Hungary. The system dynamically determines the active sectorization layout based on the current user bookings.
- ✔ Implementing a file sharing system to distribute documentation used for controlling traffic
- ✔ Implementing different notification systems (User inactivity check, upcoming events) with discord webhooks
- ✔ Docker & GitHub actions CI
- Implementing training session booking for trainees
- Implementing a sectorization map based on bookings
- Improving responsiveness or mobile UX

---

## Installation Guide

Follow these steps to set up and run the Crew Center locally using Docker.

### Step 1 - Copy `.env.dev.example` as `.env.dev`

For the staging version use .env.staging.example -> .env.staging

### Step 2 - Acquire VATSIM OAuth credentials

Go to https://vatsim.dev/services/connect/sandbox/<br> Create an OAuth client: https://auth-dev.vatsim.net/manage/1/clients<br> Redirect url is: `http://localhost:5173/login`<br> (For staging use: `http://localhost/login`)<br>

### Step 3 - Update .env

Find these lines and input your OAuth credentials

```sh
VATSIM_SECRET=""
VATSIM_CLIENTID=""
```

You will need to update the Frontend client ID as well:<br> ./frontend/.env.development (or staging)

```sh
VITE_CLIENT_ID=
```

### Step 4 - Run the containers

```
docker compose -f docker-compose.dev.yml up --build

# Staging:
docker build -t csabi44/vacchuncc_frontend:staging --target=staging frontend
docker build -t csabi44/vacchuncc_backend:staging --target=staging backend
docker compose -f docker-compose.staging.yml up
```
