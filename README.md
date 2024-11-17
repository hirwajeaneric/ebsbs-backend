# Electronic Blood Storage and Distribution System - Backend

![Landing Page](https://github.com/hirwajeaneric/ebsbs-backend/blob/main/screenshots/ebsds-1.png)

This repository hosts the backend code for an electronic blood storage and distribution system.

## Technology Stack

- **Framework**: Node.js with Express
- **Database**: MongoDB, managed with PgAdmin
- **ORM**: Prisma

## How to Use this Repository
### Prerequisites

Ensure you have these tools installed:

- Node.js
- npm (Node Package Manager)
- MongoDB Server Community Edition ([download](https://www.mongodb.com/try/download/community))
- MongoDB Compass: Will be installed with MongoDB Server Community Edition.

### Installation Steps

1. Clone the repository:
   `git clone [git url]`
   `cd ebsbs-backend`

2. Install dependencies: `npm i`

3. Setup email provider: In my case, I used gmail for it's simplicity.
You will have to create a app-password to get a password to connect your gmail account with this project.

4. Configure environment variables:
```bash
DATABASE_URL=mongodb://localhost:27017/ebsds
SECRET_KEY=yoursecretkeyhere
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Email
EMAIL_USER=example@text.com
EMAIL_PASSWORD=xssx sdsa ssdf s3we
EMAIL_SERVICE=gmail
```

3. Set up the database:
   `npx prisma generate`

5. Run the project
   `npm run dev`

### System Preview
![Landing Page](https://github.com/hirwajeaneric/ebsbs-backend/blob/main/screenshots/ebsds-1.png)
