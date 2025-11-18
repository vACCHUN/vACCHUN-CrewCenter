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
- Implementing training session booking for trainees  
- Implementing a sectorization map based on bookings  
- Improving responsiveness or mobile UX

---

## Installation Guide

Follow these steps to set up and run the Crew Center locally using Docker.

### Step 1 - Create `docker-compose.yaml`
In the root directory, create a `docker-compose.yaml` file with the following contents:
```yaml
services:
  backend:
    build: ./backend
    container_name: vacchuncc_backend
    ports:
      - 3000:3000
      - 4000:4000
    volumes:
      - ./backend:/app
      - /app/node_modules
    networks:
      - mysql_network
    depends_on:
      - mysql

  frontend:
    build: ./frontend
    container_name: vacchuncc_frontend
    ports:
      - 5173:5173
    volumes:
      - ./frontend:/app
      - /app/node_modules

  mysql:
    container_name: vacchuncc_mysql
    image: mysql:9.0.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
    ports:
      - 3306:3306
    networks:
      - mysql_network
    volumes:
      - ./db/init_testdata.sql:/docker-entrypoint-initdb.d/init_testdata.sql

  phpmyadmin:
    container_name: vacchuncc_pma
    depends_on:
      - mysql
    image: phpmyadmin:latest
    restart: always
    ports:
      - "8080:80"
    environment:
      PMA_HOST: mysql
      MYSQL_ROOT_PASSWORD: example
    networks:
      - mysql_network

  cron-worker:
    build:
      context: ./backend
      dockerfile: Dockerfile.cron
    container_name: vacchuncc_cron_worker
    depends_on:
      - mysql
    volumes:
      - ./backend:/app
      - /app/node_modules
    networks:
      - mysql_network

networks:
  mysql_network:
```

### Step 2 - Create a `.env` file in the root directory
Create a `.env` file in the root directory with the following content:
```env
MYSQL_ROOT_PASSWORD="example"
MYSQL_DATABASE="vacchuncc"
```

### Step 3 - Create the frontend config file
Create a frontend config file at `frontend/src/config.ts`:
```js
const config = {
  API_URL: "http://localhost:3000/api",
  CLIENT_ID: ,
  VATSIM_API_URL: "https://auth-dev.vatsim.net",
  VATSIM_REDIRECT: "http://localhost:5173/login",
  PUBLIC_API_URL: "http://localhost:3000/api",
  defaultSectorIds: ["CDC", "GRC", "ADC", "TRE/L", "EL"],
  SENTRY_DSN: ""
};

export default config;
```

### Step 4 - Create the backend `.env` file
Create a backend environment file at `backend/.env`:
```env
MYSQL_HOST="mysql"
MYSQL_DB="vacchuncc"
MYSQL_USER="root"
MYSQL_PASSWORD="example"

EXPRESS_PORT=3000
NODE_ENV="dev"

VATSIM_SECRET="" # https://vatsim.dev/services/connect/sandbox
VATSIM_CLIENTID="" # https://vatsim.dev/services/connect/sandbox
VATSIM_REDIRECT="http://localhost:5173/login"
VATSIM_URL="https://auth-dev.vatsim.net"
SUBDIVISION="FRA" # use Ten Web account
MIN_RATING=2

LHDC_rwylights=1
LHDC_rwyLightLevel=1

VATSIM_BOOKING_API=https://atc-bookings.vatsim.net/api/booking
VATSIM_BOOKING_KEY=

CORE_API=""
INACTIVITY_WEBHOOK="https://discord.com/api/webhooks/"
EVENTS_WEBHOOK="https://discord.com/api/webhooks/"
ATCO_ROLE_ID=

BACKBLAZE_APPKEY_ID=""
BACKBLAZE_APPKEY=""
BACKBLAZE_BUCKET_ID=""
```

### Step 5 - Run the Docker containers
Run the following command to build and start the application:
```sh
docker-compose up --build
```
**Note:** MySQL may take some time to initialize.

## Troubleshooting

### Backend Issues
If you encounter issues with the backend, try re-saving the `index.js` file in the `backend` directory. This will trigger **nodemon** to reload the server and attempt to reconnect. The issue occurs because MySQL may take longer to initialize than the backend, causing Node.js to try connecting before the database is fully ready.

For further assistance, check the logs:
```sh
docker-compose logs -f backend
```