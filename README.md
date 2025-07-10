# ChallengeTracker1Certainly! Here's the updated README.md with all mentions of "Topcoder" removed, while keeping the content and structure intact:

markdown
Copy
Edit
# 🛠️ Challenge API Update: Add `challengeSource` Field

## 📘 Overview

This project enhances the existing Challenge API by adding a new optional field `challengeSource` to indicate the origin of a challenge (e.g., Work Manager, Topgear, GitHub, etc.).

The objective is to:
- Add a new `challengeSource` field (type: `String`) to the Challenge model.
- Ensure this field is supported across Create, Update, Search, and Delete operations in the Challenge API.
- Update the Prisma schema accordingly.
- Maintain compatibility with the current code structure and style.
- Ensure all existing tests pass.

## 🗃️ Technologies Used

- Node.js
- PostgreSQL (via Prisma ORM)
- Express.js
- Swagger (OpenAPI v3)

---

## ✨ Features Added

- ✅ New optional field `challengeSource` added to the Challenge model.
- ✅ Field is available in:
  - POST `/challenges`
  - PUT `/challenges/:id`
  - GET `/challenges/:id`
  - GET `/challenges` (supports filtering by `challengeSource`)
  - DELETE `/challenges/:id`
- ✅ Field is stored and retrieved using **PostgreSQL + Prisma**, with all DAL/gRPC/ElasticSearch dependencies removed as per project goals.

---

## 🚀 Deployment & Configuration

### Prerequisites
- Node.js >= 14
- PostgreSQL configured and running
- Prisma CLI installed (`npm install prisma --save-dev`)
- Environment file configured (`.env`)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/challenge-api-v6.git
   cd challenge-api-v6
Checkout the latest develop branch:

bash
Copy
Edit
git checkout develop
Apply patch file (if working from patch):

bash
Copy
Edit
git apply your-submission.patch
Install dependencies:

bash
Copy
Edit
npm install
Run Prisma migration to update schema:

bash
Copy
Edit
npx prisma migrate dev --name add-challenge-source
Run the application:

bash
Copy
Edit
npm start
✅ Validation Guide
Functional Testing
1. Create a Challenge with challengeSource
bash
Copy
Edit
POST /challenges
{
  "name": "Sample Challenge",
  ...
  "challengeSource": "Topgear"
}
2. Update an Existing Challenge
bash
Copy
Edit
PUT /challenges/:id
{
  ...
  "challengeSource": "GitHub"
}
3. Search Challenges by challengeSource
bash
Copy
Edit
GET /challenges?challengeSource=Topgear
4. Retrieve a Challenge
bash
Copy
Edit
GET /challenges/:id
Confirm challengeSource is returned

5. Delete a Challenge
bash
Copy
Edit
DELETE /challenges/:id
⚙️ Patch Info
Base Commit Hash: a970a228f49d3a755855839a1416a3df1f079b9f

Submission: Includes this README.md and validation.md for testing reference

All existing unit/integration tests pass

📎 Notes
No unit tests were added per challenge scope, but none were broken.

Code styling and structure follow existing standards.

No ElasticSearch, Informix, or DynamoDB dependencies involved.

📁 Related Links
Challenge API Repo

Issue #9 - Add challengeSource field

yaml
Copy
Edit

---










