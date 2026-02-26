# API Contract & Data Model

This document outlines the data structures and proposed API contracts for backend developers looking to build a remote synchronization backend for the HireWithAndi Job Tracker.

Currently, the frontend uses LocalStorage with the key `HiredWithAndi_data`. The state consists of:

- `jobs`: A dictionary/map of Job objects by ID.
- `columnOrder`: An array of column IDs.
- `columns`: A dictionary mapping column IDs to arrays of Job IDs.

To build a backend, we recommend standardizing around a RESTful API.

## Data Models

### 1. Job Object

This is the primary entity representing a job application.

```typescript
interface Job {
  id: string; // Unique identifier (UUID recommended)
  company: string; // Company name
  position: string; // Job title/position
  url: string; // URL to the job posting
  salary: string; // Expected/offered salary
  notes: string; // Custom notes
  workType: string; // 'remote' | 'onsite' | 'hybrid'
  location: string; // Job location
  finalOffer: string; // Final monetary offer (populated when offered)
  benefits: string; // Monetary/insurance benefits
  nonMonetaryBenefits: string; // Non-monetary perks
  dateApplied: string; // ISO 8601 DateTime
  dateAdded: string; // ISO 8601 DateTime
  status: JobStatus; // Current status
  statusChangedAt: string; // ISO 8601 DateTime of last status change
  history: JobHistoryEntry[]; // Array of status changes
}

type JobStatus =
  | "wishlist"
  | "applied"
  | "hr_interview"
  | "technical_interview"
  | "additional_interview"
  | "offered"
  | "rejected_company"
  | "rejected_applicant";

interface JobHistoryEntry {
  status: JobStatus;
  enteredAt: string; // ISO 8601 DateTime
  leftAt: string | null; // ISO 8601 DateTime or null if currently in this status
}
```

### 2. Board State Object

If the backend will also save the exact column ordering (useful for syncing exact visual layout).

```typescript
interface BoardState {
  columnOrder: string[];
  columns: Record<string, string[]>; // Map of Column ID -> Array of Job IDs
}
```

---

## REST Endpoints (Proposed)

### 1. Standard Job CRUD

#### `GET /api/jobs`

Fetches all jobs for the authenticated user.

- **Response `200 OK`**:
  ```json
  {
    "data": [
      {
        /* Job Object */
      },
      {
        /* Job Object */
      }
    ]
  }
  ```

#### `GET /api/jobs/:id`

Fetch a specific job.

#### `POST /api/jobs`

Create a newly tracked job.

- **Request Body**:
  ```json
  {
    "company": "Tech Corp",
    "position": "Frontend Developer",
    "url": "https://example.com/job",
    "salary": "$100,000",
    "notes": "Looks interesting",
    "workType": "remote",
    "location": "New York",
    "status": "wishlist",
    "dateApplied": "2026-02-26T15:46:31.000Z"
  }
  ```
- **Response `201 Created`**: Returns the fully formed `Job` object including generated `id`, `dateAdded`, `dateApplied`, `history`, etc.

#### `PATCH /api/jobs/:id`

Partial update a job. Can be used for modifying details or updating the status. If `status` is updated, the backend is expected to append to the `history` array and update `statusChangedAt` automatically.

- **Request Body**:
  ```json
  {
    "status": "hr_interview",
    "notes": "Passed technical screening"
  }
  ```
- **Response `200 OK`**: Returns the updated `Job` object.

#### `DELETE /api/jobs/:id`

Deletes a tracked job.

- **Response `204 No Content`**

### 2. Board State Management (Optional)

If you wish to maintain sync of the drag-and-drop order independent of statuses:

#### `GET /api/board/state`

Returns the user's board configuration.

#### `PUT /api/board/state`

Updates the entire board layout.

- **Request Body**:
  ```json
  {
    "columnOrder": ["wishlist", "applied", "hr_interview", ...],
    "columns": {
      "wishlist": ["job-id-1", "job-id-2"],
      "applied": ["job-id-3"]
    }
  }
  ```
