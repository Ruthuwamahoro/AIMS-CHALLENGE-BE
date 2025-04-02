# Multilingual File Manager Application

# Pre-requisites
- Install [Node.js](https://nodejs.org/en/)
- Install [MongoDB](https://www.mongodb.com/)


# Getting started
- Clone the repository
```
git clone https://github.com/Ruthuwamahoro/multilingual-file-manager-app.git

```
- Install dependencies
```
cd multilingual-file-manager-app
npm install
```
- Build and run the project
```
npm run dev
```

##Technologies used
   ```
    -*Backend*: Node.js
    -*Database*: MongoDB with Mongoose
    -*Authentication*: `bcryptjs` for hashing password and `passport` for authentication
    -*Testing*: Mocha, Chai, Chai-HTTP
    -*Internationalization*: i18n package
    -*File upload and Cloud Storage*: Multer & Cloudinary
    -*Queuing*: `bull`
  ```

### Running tests using NPM Scripts
````
npm run test

````
Test files are created under tests folder.

##LANGUAGES:
```
  English: en
  French: fr
  replace {language} with either en or fr when using the authentication routes
```


## ROUTES FOR AUTHENTICATION, FILES AND DIRECTORY UPLOADS

#### 1. **Sign Up** (`POST`)
Use this route to create a new user account.
    
    http://localhost:5000/api/auth/signup?lng={fr/en}  
    
**Request Body**:  
```json
    {   
        "fullName": "test",
        "email": "test@gmail.com",
        "password": "Password123",
        "gender": "female",
        "telephone": "123233443"
    }
```


#### 2. **Login ** (`POST`)
Use this route to Login.
    
    http://localhost:5000/api/auth/login?lng={fr/en}   
    
**Request Body**:  
```json
    {   
        "email": "test@gmail.com",
        "password": "Password123",
    }
```

### 3. **Files** (`POST,GET,PATCH,DELETE`)
use this route to upload files
    
    http://localhost:5000/api/files/   

### 4. **Directories** (`POST,GET,PATCH,DELETE`)
use this route to upload files
    
    http://localhost:5000/api/directories/  

The following route is used to retrieve all files by directory id
    http://localhost:5000/api/directories/${:id}/files


### 5. **Share** (`POST`)
This route is used to share files

    http://localhost:5000/api/files/{$id}/share


## PROJECT STRUCTURE
multilingual-file-manager-app/
```
├── src/
│   ├── config/         # Configuration for services, i18n, queue and db
│   ├── locales/        # Localization files for i18n
│   ├── middlewares/    # Authentication and validation middleware
│   ├── models/         # Mongoose schemas for database
│   ├── routes/         # API routes for files, authentication, and directories
│   ├── scripts/        
│   ├── utils/          # Helper functions like cloudinary, validation, token generation
|── app.js              # Main application entry point
├── uploads/            # Temporary file storage
├── tests/              # Test cases for all files, directory and authentication
├── .env                # Environment configuration
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```


## Contributors
   - [Ruth Uwamahoro](https://github.com/Ruthuwamahoro)
   - [Irene Akawin Agigiba](https://github.com/agigibairene)
# AIMS-CHALLENGE-BE
