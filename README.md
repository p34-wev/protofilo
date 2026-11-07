# 🌐 Priyanshi Srivastava | Portfolio

A modern personal portfolio website designed to showcase my skills, projects, and professional journey as a web developer. This project combines a responsive frontend experience with a secure admin dashboard for managing portfolio content efficiently. ✨

## 📌 Overview

This portfolio highlights:

- 👩‍💻 personal branding and developer profile
- 🚀 featured projects and technical work
- 📱 responsive design across devices
- 💬 contact form and message handling
- 🛠️ admin panel for project management
- 🔐 backend-powered content management with authentication

## 🧰 Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: FastAPI, SQLAlchemy, Pydantic
- Database: MySQL
- Authentication: JWT + bcrypt
- Deployment-ready static frontend with API-backed admin functionality

## 📁 Project Structure

```text
protofolio/
├── backend/
│   ├── .env
│   ├── requirements.txt
│   └── ...
├── database/
│   └── schema.sql
├── frontend/
│   ├── admin.html
│   ├── index.html
│   ├── css/
│   └── js/
├── setup.ps1
├── README.md
└── .gitignore
```

## ✨ Features

- Responsive portfolio homepage with smooth UI interactions
- About, skills, project showcase, and contact sections
- GitHub and live project links for selected work
- Visitor contact form for inquiries
- Secure admin login and session management
- CRUD support for portfolio projects in the admin dashboard
- MySQL-backed data model for admin users and contact messages

## 🌍 Live Demo

- Portfolio: https://p34-wev.github.io/protofilo/
- Admin Dashboard: `frontend/admin.html` (local development)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd protofolio
```

### 2. Set up the Python environment

```bash
cd backend
python -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt
```

### 3. Configure environment variables

Update the values in `backend/.env` with your local database and email configuration.

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=portfolio_db
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=your_secure_jwt_secret
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_email_app_password
MAIL_FROM=your_email@gmail.com
OWNER_EMAIL=your_email@gmail.com
BASE_URL=http://localhost:8000
CORS_ORIGINS=http://localhost:3000,http://localhost:5500,http://127.0.0.1:5500
```

### 4. Initialize the database

Import the SQL schema into MySQL:

```bash
mysql -u root -p < database/schema.sql
```

### 5. Start the backend

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

If your application uses a different FastAPI entry point, run the appropriate module accordingly.

### 6. Open the frontend

Open `frontend/index.html` in your browser to view the portfolio, or serve the folder with a local web server if required. 🌐

For the admin panel, open:

```text
frontend/admin.html
```

## 🔐 Default Admin Credentials

The database includes a default admin user for local testing:

- Username: `admin`
- Password: `Admin@123`

> ⚠️ Change the default credentials before deploying to a production environment.

## 🗄️ Database Schema

The project uses MySQL with key tables including:

- `admin_users`
- `projects`
- `contact_messages`

The schema is defined in `database/schema.sql`.

## 📸 Screenshots

Add project screenshots here after deployment:

```md
![Portfolio Homepage](./assets/portfolio-home.png)
![Admin Dashboard](./assets/admin-dashboard.png)
```

## 🤝 Contributing

Contributions are welcome. If you would like to improve the project:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## 📬 Contact

- GitHub: `https://github.com/p34-wev`
- Email: `priyanshi.srivastava@example.com`

## 📄 License

This project is intended for personal portfolio use. Add a dedicated license file if you plan to distribute it publicly under an open-source license.
