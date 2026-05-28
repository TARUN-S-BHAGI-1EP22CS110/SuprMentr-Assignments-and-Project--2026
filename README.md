# Installation and Dependencies

## Backend Dependencies

Install the required backend packages using the following command:

```bash
npm i express mongoose cors dotenv jsonwebtoken bcryptjs multer uuid morgan helmet express-validator nodemailer
```

Install development dependency:

```bash
npm i -D nodemon 
```

### Backend Package Usage

* **express** – Backend web framework for API development
* **mongoose** – MongoDB object modeling and database management
* **cors** – Enables cross-origin resource sharing
* **dotenv** – Environment variable management
* **jsonwebtoken** – JWT-based authentication and authorization
* **bcryptjs** – Password hashing and encryption
* **multer** – File upload handling middleware
* **uuid** – Unique ID generation
* **morgan** – HTTP request logger middleware
* **helmet** – Application security middleware
* **express-validator** – Request and form validation
* **nodemon** – Automatic backend server restart during development
* **nodemailer** – Email sending service used for OTP verification, password reset links, notifications, and account-related email communication within the LMS application

---

## Frontend Dependencies

Install the required frontend packages using the following command:

```bash
npm i axios html2canvas jspdf react react-dom react-google-recaptcha react-hot-toast react-icons react-router-dom react-toastify react-youtube
```

Install frontend development dependencies:

```bash
npm i -D @eslint/js @types/react @types/react-dom @vitejs/plugin-react @vitejs/plugin-react-swc eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals vite
```

### Frontend Package Usage

* **axios** – API communication between frontend and backend
* **html2canvas** – Capturing HTML elements as images
* **jspdf** – PDF generation for certificates and reports
* **react** – Frontend JavaScript library
* **react-dom** – React DOM rendering support
* **react-google-recaptcha** – CAPTCHA integration for security
* **react-hot-toast** – Real-time toast notifications
* **react-icons** – Icon library for UI components
* **react-router-dom** – Frontend routing and navigation
* **react-toastify** – Notification and alert management
* **react-youtube** – YouTube video integration for lectures

### Frontend Development Dependencies

* **vite** – Fast frontend build tool and development server
* **eslint** – Code quality and linting tool
* **@vitejs/plugin-react** – React plugin for Vite
* **@vitejs/plugin-react-swc** – Faster React compilation using SWC
* **eslint-plugin-react-hooks** – React hooks linting support
* **eslint-plugin-react-refresh** – React refresh support for Vite
* **globals** – Global variable handling for linting
* **@types/react** – TypeScript support for React
* **@types/react-dom** – TypeScript support for React DOM

---

## Project Setup

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Technologies Used

* MongoDB
* Express.js
* React.js
* Node.js
* HTML
* CSS
* JavaScript
* REST APIs
* JWT Authentication
* Vite
* Axios
* MongoDB Atlas
* Git & GitHub
