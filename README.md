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

## My Role in Development
I led the development process in a two-person team, where I carried out most of the implementation. As a fullstack developer I was responsible for backend and frontend functionality. Through this project, I gained experience with REST APIs, Git version control and implementing a third-party authentication system.

> ✍️ *This description was written and maintained by [Csaba Csörgő](https://github.com/Csaba44), who is the lead developer of the project.*

## Features
- Users can indicate their intention to control specific positions and can modify or delete their bookings.  
- The application includes an administration page where users with administrator privileges can manage or remove team members.  
- A permission system was implemented that prevents users from booking positions above their rating.  
- Trainee controllers can book higher positions; these bookings will appear visually highlighted to assist instructors.  

## Planned Improvements
- Refactoring the frontend codebase
- Implementing a sectorization system identical to the one used by real world air traffic control in Hungary. The system dynamically determines the active sectorization layout based on the current user bookings.  
- Implementing a file sharing system to distribute documentation used for controlling traffic  
- Implementing training session booking for trainees  
- Implementing an email notification system  
- Implementing a sectorization map based on bookings  
- Improving responsiveness or mobile UX  

---

## Installation Guide

Follow these steps to set up and run the Crew Center locally using Docker.

### Step 1 - Switch to the `dev` branch
If you're not already on the `dev` branch, switch to it:
```sh
git checkout dev
```

### Step 2 - Create `docker-compose.yaml`
In the root directory, create a `docker-compose.yaml` file with the following contents:
```yaml
version: '3.8'
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

networks:
  mysql_network:
```

### Step 3 - Create a `.env` file in the root directory
Create a `.env` file in the root directory with the following content:
```env
MYSQL_ROOT_PASSWORD=example
MYSQL_DATABASE=vacchuncc
```

### Step 4 - Create the frontend config file
Create a frontend config file at `frontend/src/config.js`:
```js
const config = {
  API_URL: "http://localhost:3000/api",
  CLIENT_ID: 745,
  VATSIM_API_URL: "https://auth-dev.vatsim.net",
  VATSIM_REDIRECT: "http://localhost:5173/login",
  PUBLIC_API_URL: "http://localhost:3000/api"
};

export default config;
```

### Step 5 - Create the backend `.env` file
Create a backend environment file at `backend/.env`:
```env
MYSQL_HOST="mysql"
MYSQL_DB="vacchuncc"
MYSQL_USER="root"
MYSQL_PASSWORD="example"

EXPRESS_PORT=3000
NODE_ENV="dev"

VATSIM_SECRET="2brGUXIxKVznoeR1TOovMA1gKmObcwaBAXRkE2NX" # FOR DEMO
VATSIM_CLIENTID="745" # FOR DEMO
VATSIM_REDIRECT="http://localhost:5173/login"
VATSIM_URL="https://auth-dev.vatsim.net"
SUBDIVISION="FRA"
MIN_RATING=2

LHDC_rwylights=1
LHDC_rwyLightLevel=1
```

### Step 6 - Run the Docker containers
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
