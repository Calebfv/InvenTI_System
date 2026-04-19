# React Application Setup Guide

## Prerequisites
To run this React application on another computer, you need to install:

### 1. Node.js and npm
- Download and install Node.js from: https://nodejs.org/
- Recommended version: Node.js 16.x or higher
- npm (Node Package Manager) is included with Node.js

### 2. Installation Steps

#### Step 1: Install Node.js
1. Go to https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the installation wizard
4. Verify installation by opening a terminal/command prompt and running:
   ```bash
   node --version
   npm --version
   ```

#### Step 2: Install Project Dependencies
1. Navigate to the project directory (where package.json is located)
2. Run the following command to install all dependencies:
   ```bash
   npm install
   ```

#### Step 3: Start the Development Server
1. After dependencies are installed, start the development server:
   ```bash
   npm start
   ```
2. The application will open automatically in your browser at http://localhost:3000

### 3. Project Dependencies
This project requires the following dependencies (will be installed automatically with `npm install`):

- **React 19.1.0** - JavaScript library for building user interfaces
- **React DOM 19.1.0** - DOM-specific methods for React
- **react-scripts 5.0.1** - Configuration and scripts for Create React App
- **chart.js 4.5.0** - JavaScript charting library
- **react-chartjs-2 5.3.0** - React wrapper for Chart.js
- **xlsx 0.18.5** - Excel file parser and writer
- Testing libraries (@testing-library/*) - For unit testing

### 4. Available Scripts
- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

### 5. Troubleshooting
- If you encounter permission issues, try running commands with administrator privileges
- If you have an older version of Node.js, consider upgrading to the latest LTS version
- Clear npm cache if needed: `npm cache clean --force`

### 6. System Requirements
- Operating System: Windows, macOS, or Linux
- Memory: At least 4GB RAM recommended
- Disk Space: At least 1GB free space

The application should work on any modern computer that meets these requirements.
