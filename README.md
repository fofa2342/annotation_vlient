# Annotation Vliënt

![Python](https://img.shields.io/badge/Python-3.9-blue.svg)
![Django](https://img.shields.io/badge/Django-3.2-green.svg)
![SQLite](https://img.shields.io/badge/SQLite-3.36.0-yellow.svg)

## Project Description

Annotation Vliënt is a web application designed for managing and annotating data efficiently. Built using the Django framework, this project provides a user-friendly interface for users to interact with various datasets, allowing for seamless data upload, annotation, and retrieval. The application is structured to support multiple functionalities, including user authentication, data visualization, and historical data tracking.

### Key Features
- User authentication for secure access.
- Data upload and annotation capabilities.
- Historical data tracking for easy reference.
- Responsive design for an optimal user experience.

## Tech Stack

| Technology | Description |
|------------|-------------|
| ![Python](https://img.shields.io/badge/Python-3.9-blue.svg) | Programming Language |
| ![Django](https://img.shields.io/badge/Django-3.2-green.svg) | Web Framework |
| ![SQLite](https://img.shields.io/badge/SQLite-3.36.0-yellow.svg) | Database |

## Installation Instructions

### Prerequisites
- Python 3.9 or higher
- pip (Python package installer)
- SQLite (included with Python)

### Step-by-Step Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/fofa2342/annotation_vlient.git
   cd annotation_vlient
   ```

2. **Install the required packages:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up the database:**
   The project uses SQLite as its database. You can initialize the database by running:
   ```bash
   python manage.py migrate
   ```

4. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

5. **Access the application:**
   Open your web browser and navigate to `http://127.0.0.1:8000/`.

## Usage

Once the server is running, you can use the application by navigating through the various pages:
- **Login Page:** Access the login functionality.
- **Upload Page:** Upload data for annotation.
- **Results Page:** View annotated data.
- **History Page:** Track historical annotations.

## Project Structure

The project structure is organized as follows:

```
annotation_vlient/
└── annotation/
    ├── static/               # Contains static files (CSS and JavaScript)
    │   ├── css/              # Stylesheets for the application
    │   └── js/               # JavaScript files for interactivity
    ├── templates/            # HTML templates for rendering views
    │   ├── history.html       # Template for the history page
    │   ├── index.html         # Main landing page
    │   ├── login.html         # Login page template
    │   ├── results.html       # Results page template
    │   └── upload.html        # Data upload page template
    ├── __init__.py           # Initializes the package
    ├── asgi.py                # ASGI configuration for asynchronous support
    ├── settings.py            # Django settings configuration
    ├── urls.py                # URL routing for the application
    ├── views.py               # View functions for handling requests
    └── wsgi.py                # WSGI configuration for deployment
└── db.sqlite3                # SQLite database file
└── manage.py                 # Command-line utility for administrative tasks
```

### Main Directories and Files
- **annotation/**: Contains all application logic, including views, URLs, and settings.
- **static/**: Holds static assets like CSS and JavaScript files used in the application.
- **templates/**: Contains HTML templates for rendering the user interface.
- **manage.py**: A script that helps manage the Django project, allowing for tasks like running the server and applying migrations.

## Contributing

Contributions are welcome! Please follow these guidelines:
- Fork the repository.
- Create a new branch for your feature or bug fix.
- Make your changes and commit them.
- Submit a pull request detailing your changes.

We appreciate your contributions to make Annotation Vliënt better!
