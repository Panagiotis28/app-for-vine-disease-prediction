# Vine Vision - AI Disease Detection
 
 A web application for detecting diseases in vine leaves using a pre-trained CNN model.
 
 ## Features
 
 - Upload vine leaf images for disease classification
 - AI-powered detection of multiple vine diseases:
   - Black Rot
   - ESCA
   - Healthy Leaves
   - Leaf Blight
 - History tracking of predictions
 - Responsive design for mobile and desktop
 
 ## Tech Stack
 
 - **Frontend:** React with Tailwind CSS
 - **Backend:** Node.js with Express
 - **Machine Learning API:** Flask/Python
 - **Database:** MySQL
 - **Image Processing:** TensorFlow, OpenCV
 
 ## Setup Instructions
 
 ### Prerequisites
 
 - Node.js 14+
 - Python 3.8+
 - MySQL
 
 ### Frontend Setup
 
 1. Clone this repository
 2. Install dependencies:
    ```
    npm install
    ```
 3. Create a `.env` file in the project root with:
    ```
    VITE_API_URL=http://localhost:3000/api
    ```
 4. Start the development server:
    ```
    npm run dev
    ```
 
 ### Node.js Backend Setup
 
 1. Navigate to the API directory:
    ```
    cd src/api
    ```
 2. Install dependencies:
    ```
    npm install
    ```
 3. Configure your MySQL database by editing the `.env` file:
    ```
    DB_HOST=localhost
    DB_USER=your_mysql_username
    DB_PASSWORD=your_mysql_password
    DB_NAME=vine_vision
    FLASK_API_URL=http://localhost:5000
    ```
 4. Start the Node.js server:
    ```
    npm run dev
    ```
 
 ### Flask API Setup
 
 1. Create a Python virtual environment:
    ```
    python -m venv venv
    ```
 2. Activate the virtual environment:
    ```
    # On Windows
    venv\Scripts\activate
    
    ```
 3. Install required Python packages:
    ```
    pip install -r src/api/flask/requirements.txt
    ```
 4. Place your pre-trained model file (`experiment_16_fold_5_best_model.h5`) in the `src/api` directory
 5. Start the Flask server:
    ```
    python flask_api.py
    ```
 
 ### MySQL Database Setup
 
 1. Create a new MySQL database:
    ```sql
    CREATE DATABASE vine_vision;
    ```
 2. The necessary tables will be created automatically when you start the Node.js server
 
 ## Usage
 
 1. Open your browser and navigate to `http://localhost:8080`
 2. Upload an image of a vine leaf using the interface
 3. View the prediction results and recommended actions
 
 ## Project Structure
  ```
  ├── src/
  │   ├── api/                # Node.js & Flask backend
  │   ├── components/         # React components
  │   ├── services/           # API services
  │   ├── types/              # TypeScript type definitions
  │   └── pages/              # Page components
  ```
