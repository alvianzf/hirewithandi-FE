# API Contract & Data Schema

_(Note: HiredWithAndi currently operates entirely client-side using `localStorage`. This document outlines the local state schema that acts as our "database".)_

## 1. Job Tracker Schema (`hwa_jobs` or equivalent storage key)

The primary state for job applications is stored as a serialized JSON object containing columns for the Kanban board and the dictionary of jobs.

### `Job` Object

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
  "dateAdded": "string (ISO 8601 Date)",
  "status": "string (enum matching column IDs)",
  "statusChangedAt": "string (ISO 8601 Date)",
  "history": [
    {
      "status": "string (enum matching column IDs)",
      "enteredAt": "string (ISO 8601 Date)",
      "leftAt": "string (ISO 8601 Date) | null" // Used to calculate accurate continuous active duration, excluding time spent in final states
    }
  ]
}
```

### Main Jobs State (`JobContext`)

```json
{
  "jobs": {
    "job_id_1": {
      /* Job Object */
    },
    "job_id_2": {
      /* Job Object */
    }
  },
  "columns": {
    "wishlist": ["job_id_1"],
    "applied": ["job_id_2"],
    "hr_interview": [],
    "technical_interview": [],
    "additional_interview": [],
    "offered": [],
    "rejected_company": [],
    "rejected_applicant": []
  }
}
```

---

## 2. Authentication Schema (`hwa_auth`)

Stores basic identity information.

```json
{
  "name": "string",
  "email": "string",
  "createdAt": "string (ISO 8601 Date)"
}
```

---

## 3. User Profile Schema (`hwa_profile`)

Stores the extended user profile including the base64 encoded avatar.

```json
{
  "name": "string",
  "email": "string",
  "bio": "string",
  "role": "string",
  "organization": "string",
  "location": "string",
  "linkedIn": "string (URL)",
  "avatarUrl": "string (Base64 Data URL) | null"
}
```

---

## 4. Initialization (I18n Context)

Language preferences are stored separately:

**Key**: `HiredWithAndi_locale`
**Value**: `string (enum: 'en', 'id', 'id_corp', 'sg')`
