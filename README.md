# Bug Reporter

A full-stack bug reporting system with user and admin dashboards, authentication, bug status updates, search/filter features, and a clean Tailwind-styled UI.

## Project Structure
```
BugReporter/
├── backend/
├── frontend/
```

---

## Backend Setup (Node.js, Express, Prisma)

1. **Navigate to backend directory:**
   ```sh
   cd backend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Setup environment variables:**
   - Create a `.env` file in `backend/` with:
     ```env
     PORT=3000
     DATABASE_URL="your_postgres_or_mysql_connection_string"
     JWT_SECRET="your_secret_key"
     ```
4. **Run Prisma migrations:**
   ```sh
   npx prisma migrate deploy
   ```
5. **Start backend server:**
   ```sh
   npm start
   ```
   The backend will run on `http://localhost:3000`.

---

## Frontend Setup (React, Vite, Tailwind CSS)

1. **Navigate to frontend directory:**
   ```sh
   cd frontend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Setup environment variables:**
   - Create a `.env` file in `frontend/` with:
     ```env
     SERVER_URL="YOUR_BACKEND_URL"
     ```
4. **Start frontend dev server:**
   ```sh
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (default Vite port).

---

## Usage
- Sign up and log in as a user to report bugs and view your submissions.
- Log in as an admin to view and manage all reported bugs.
- Use the dashboard to search and filter bugs by status, severity, or title.

---

## Additional Notes
- Ensure both backend and frontend servers are running for full functionality.
- Update environment variables as needed for deployment.
- For database setup, refer to `backend/prisma/schema.prisma`.
- For API endpoints, see backend route files.

---


### DATABASE SCHEMA

### USER TABLE
<img width="700" height="411" alt="image" src="https://github.com/user-attachments/assets/958fc9ee-148b-4329-af4c-06460a64382e" />


### BUG TABLE
<img width="1168" height="574" alt="image" src="https://github.com/user-attachments/assets/4f6b6a22-c968-4ad1-a5cd-1eef554b8fc0" />


### Live Link : https://bug-reporter-nine.vercel.app/

### AI Usage:

- Used Copilot to apply generic tailwind styles to pages
- To generate form templates for login, sign up, bug reporting
- To fix typescript errors
- Fixing some cors issue by setting right cors options


