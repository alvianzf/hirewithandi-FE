# API Contract & Data Schema

_(Note: HiredWithAndi currently utilizes a backend cloud API for data persistence, replacing the previous `localStorage` implementation. This document outlines the REST API endpoints and local stage schema that acts as our frontend cache.)_

## 1. Authentication (`/auth`)

Stores basic identity information and manages sessions.

| Endpoint               | Method | Payload                                                          | Response                                                  | Description                                        |
| ---------------------- | ------ | ---------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------- |
| `/auth/check-email`    | `POST` | `{ "email": "string" }`                                          | `{ "exists": boolean, "hasPassword": boolean }`           | Checks if a user or pre-seeded email exists.       |
| `/auth/setup-password` | `POST` | `{ "email": "string", "password": "...", "app": "job-tracker" }` | `{ "user": User, "token": "...", "refreshToken": "..." }` | Assigns an initial password to an invited email.   |
| `/auth/login`          | `POST` | `{ "email": "string", "password": "...", "app": "job-tracker" }` | `{ "user": User, "token": "...", "refreshToken": "..." }` | Standard login, returning the JWT tokens.          |
| `/auth/refresh`        | `POST` | `{ "refreshToken": "string" }`                                   | `{ "user": User, "token": "...", "refreshToken": "..." }` | Refreshes the session using a valid refresh token. |

## 2. User Profile (`/profile`)

Manages the extended user profile including multi-part uploads.

| Endpoint   | Method  | Payload                     | Response         | Description                                       |
| ---------- | ------- | --------------------------- | ---------------- | ------------------------------------------------- |
| `/profile` | `GET`   | `none`                      | `Profile Object` | Fetches the current authenticated user's profile. |
| `/profile` | `PATCH` | `FormData` or `{...fields}` | `Profile Object` | Updates profile details or avatar picture.        |

### `Profile` Object Schema

```json
{
  "name": "string",
  "email": "string",
  "bio": "string",
  "role": "string",
  "organization": "string (read-only)",
  "location": "string",
  "linkedIn": "string (URL)",
  "avatarUrl": "string (URL) | null"
}
```

---

## 3. Job Tracker API (`/jobs`)

The primary resource for tracking job applications.

| Endpoint           | Method   | Payload                                           | Response             | Description                                           |
| ------------------ | -------- | ------------------------------------------------- | -------------------- | ----------------------------------------------------- |
| `/jobs`            | `GET`    | `none`                                            | `[Job Object, ...]`  | Retrieves all jobs for the authenticated user.        |
| `/jobs`            | `POST`   | `{ ...JobFields }`                                | `Job Object`         | Creates a new job application entry.                  |
| `/jobs/:id`        | `PATCH`  | `{ ...JobFields }`                                | `Job Object`         | Updates specific details of an existing job.          |
| `/jobs/:id/status` | `PATCH`  | `{ "status": "string", "boardPosition": number }` | `Job Object`         | Specialized endpoint for moving a job across columns. |
| `/jobs/:id`        | `DELETE` | `none`                                            | `{ message: "..." }` | Deletes a specific job application.                   |

### `Job` Object Schema

```json
{
  "id": "string (unique identifier)",
  "company": "string",
  "position": "string",
  "url": "string (optional job posting URL)",
  "salary": "string (optional monthly salary range)",
  "notes": "string (optional)",
  "workType": "string (enum: 'remote', 'onsite', 'hybrid')",
  "location": "string (optional)",
  "finalOffer": "string (optional, populated when in 'offered' status)",
  "benefits": "string (optional, populated when in 'offered' status)",
  "nonMonetaryBenefits": "string (optional, populated when in 'offered' status)",
  "jobFitPercentage": "number (0-100)",
  "dateApplied": "string (ISO 8601 Date)",
  "createdAt": "string (ISO 8601 Date)",
  "status": "string (enum)",
  "statusChangedAt": "string (ISO 8601 Date)",
  "history": [
    {
      "status": "string (enum)",
      "enteredAt": "string (ISO 8601 Date)",
      "leftAt": "string (ISO 8601 Date) | null"
    }
  ]
}
```

### Valid Job Statuses

Jobs follow a strict flow through these columns:

- `wishlist`
- `applied`
- `hr_interview`
- `technical_interview`
- `additional_interview`
- `offered` (Final State)
- `rejected_company` (Final State)
- `rejected_applicant` (Final State)

---

## 4. Initialization (I18n Context)

Language preferences remain localized to the user's browser:

**Key**: `HiredWithAndi_locale`
**Value**: `string (enum: 'en', 'id', 'id_corp', 'sg')`
