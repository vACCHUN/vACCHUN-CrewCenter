# Crew Center

Crew Center is a web-based platform designed to help virtual air traffic controllers manage bookings, schedules, and operations efficiently.

## Installation Guide

Follow these steps to set up and run the Crew Center locally using Docker.

### Step 1 - Switch to the 'dev' branch
If you're not already on the dev branch, switch to it:
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

### Step 3 - Create `.env` file in the root directory
Create a `.env` file in the root directory with the following variables:
```env
MYSQL_ROOT_PASSWORD=example
MYSQL_DATABASE=vacchuncc
```

### Step 4 - Create frontend config file
Create a frontend config file at `rootdirectory/frontend/src/config.js`:
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

### Step 5 - Create backend `.env` file
Create a backend environment file at `rootdirectory/backend/.env`:
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