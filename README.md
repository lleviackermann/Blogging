<h1 align="center">Blogging Website</h1>

Developed a web application that allows users to create and view Blogs.


## <a name="tech-stack">⚙️ Tech Stack</a>

[![Stack Used](https://skillicons.dev/icons?i=next,html,ts,tailwind,nodejs,express,npm,mongodb)](https://skillicons.dev)

## <a name="features">🔋 **API's**</a>

- **API to Signup.**

- **API to Signin.**
  
- **API to logout.**

- **API to create a blog.**

- **API to get all post.**

- **API to toggle the likes.**

- **API to retrieve all users.**




## <a name="features">🔋 **Backend Architecture**</a>

- **Monolithic Architecture.**




## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
https://github.com/lleviackermann/Blogging.git
cd Blogging
```

**Setting Up the Backend**



1. Navigate to the Backend  directory
   
```bash
cd server
```


2. Set up the ENV File

```
MONGO_USER=<MONGO_USER>             # Put MongoDB username here
MONGO_PASSWORD=<MONGO_PASSWORD>     # Put MongoDB password here
JWT_SECRET_KEY=<JWT_SECRET_KEY>     # Put JWT secret key here
# Cloud Service Credentials (e.g., Cloudinary)
CLOUD_NAME=<CLOUD_NAME>             # Put cloud service account name here
API_KEY=<API_KEY>                   # Put cloud service API key here
API_SECRET=<API_SECRET>             # Put cloud service API secret here
```

**Setting Up the Frontend**
   
1. Navigate to the Frontend directory

```
cd client
```

**Installation**

Install the required dependencies for both backend and frontend using npm:

```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```



**Running the Project**
1. Start the backend server:
```bash
cd server
npm run dev 
```

2. In a new terminal, start the frontend development server:
```bash
cd client
npm run dev 
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.