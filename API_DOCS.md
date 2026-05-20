# Smart Leads Dashboard — API Documentation

Base URL: `http://localhost:5000/api` (local) or `http://localhost:3000/api` (Docker via Nginx)

All protected routes require header:

```
Authorization: Bearer <jwt_token>
```

---

## Auth Routes

### POST `/auth/register`

| | |
|---|---|
| **Description** | Register a new user |
| **Auth** | No |

**Request body:**

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "secret123",
  "role": "sales"
}
```

`role` is optional (`admin` \| `sales`). Default: `sales`.

**Success response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "665f1a2b3c4d5e6f7a8b9c0d",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "role": "sales"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST `/auth/login`

| | |
|---|---|
| **Description** | Login and receive JWT |
| **Auth** | No |

**Request body:**

```json
{
  "email": "rahul@example.com",
  "password": "secret123"
}
```

**Success response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "665f1a2b3c4d5e6f7a8b9c0d",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "role": "sales"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### GET `/auth/me`

| | |
|---|---|
| **Description** | Get current logged-in user profile |
| **Auth** | Yes |

**Success response (200):**

```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "role": "sales"
  }
}
```

---

## Lead Routes

### GET `/leads`

| | |
|---|---|
| **Description** | List leads with filtering, search, sort, and pagination |
| **Auth** | Yes (Admin, Sales) |

**Query parameters (all optional):**

| Param | Values | Description |
|-------|--------|-------------|
| `status` | `new`, `contacted`, `qualified`, `lost` | Filter by status |
| `source` | `website`, `instagram`, `referral` | Filter by source |
| `search` | string | Search name or email |
| `sort` | `latest`, `oldest` | Sort by created date |
| `page` | number | Page number (default `1`) |
| `limit` | number | Items per page (default `10`, max `50`) |

**Example:** `GET /leads?status=qualified&page=1&limit=10`

**Success response (200):**

```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [
    {
      "_id": "665f1a2b3c4d5e6f7a8b9c0e",
      "name": "Priya Singh",
      "email": "priya@example.com",
      "status": "qualified",
      "source": "website",
      "createdBy": {
        "_id": "665f1a2b3c4d5e6f7a8b9c0d",
        "name": "Rahul Sharma",
        "email": "rahul@example.com"
      },
      "createdAt": "2026-05-20T10:00:00.000Z",
      "updatedAt": "2026-05-20T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### GET `/leads/stats`

| | |
|---|---|
| **Description** | Dashboard overview statistics |
| **Auth** | Yes (Admin, Sales) |

**Success response (200):**

```json
{
  "success": true,
  "message": "Lead stats fetched successfully",
  "data": {
    "total": 25,
    "byStatus": {
      "new": 8,
      "contacted": 6,
      "qualified": 7,
      "lost": 4
    },
    "bySource": {
      "website": 10,
      "instagram": 8,
      "referral": 7
    },
    "recentLeads": []
  }
}
```

---

### GET `/leads/:id`

| | |
|---|---|
| **Description** | Get a single lead by ID |
| **Auth** | Yes (Admin, Sales) |

**Success response (200):**

```json
{
  "success": true,
  "message": "Lead fetched successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0e",
    "name": "Priya Singh",
    "email": "priya@example.com",
    "status": "new",
    "source": "referral",
    "createdBy": {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "name": "Rahul Sharma",
      "email": "rahul@example.com"
    },
    "createdAt": "2026-05-20T10:00:00.000Z",
    "updatedAt": "2026-05-20T10:00:00.000Z"
  }
}
```

---

### POST `/leads`

| | |
|---|---|
| **Description** | Create a new lead |
| **Auth** | Yes (Admin, Sales) |

**Request body:**

```json
{
  "name": "Priya Singh",
  "email": "priya@example.com",
  "status": "new",
  "source": "website"
}
```

`status` is optional (default `new`).

**Success response (201):**

```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0e",
    "name": "Priya Singh",
    "email": "priya@example.com",
    "status": "new",
    "source": "website",
    "createdBy": "665f1a2b3c4d5e6f7a8b9c0d",
    "createdAt": "2026-05-20T10:00:00.000Z",
    "updatedAt": "2026-05-20T10:00:00.000Z"
  }
}
```

---

### PUT `/leads/:id`

| | |
|---|---|
| **Description** | Update an existing lead |
| **Auth** | Yes (Admin, Sales) |

**Request body (partial update allowed):**

```json
{
  "name": "Priya Singh",
  "email": "priya.updated@example.com",
  "status": "contacted",
  "source": "instagram"
}
```

**Success response (200):**

```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0e",
    "name": "Priya Singh",
    "email": "priya.updated@example.com",
    "status": "contacted",
    "source": "instagram",
    "createdBy": {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "name": "Rahul Sharma",
      "email": "rahul@example.com"
    },
    "createdAt": "2026-05-20T10:00:00.000Z",
    "updatedAt": "2026-05-20T11:30:00.000Z"
  }
}
```

---

### DELETE `/leads/:id`

| | |
|---|---|
| **Description** | Delete a lead |
| **Auth** | Yes (**Admin only**) |

**Success response (200):**

```json
{
  "success": true,
  "message": "Lead deleted successfully",
  "data": null
}
```

---

### GET `/leads/export/csv`

| | |
|---|---|
| **Description** | Export leads as CSV (respects filters) |
| **Auth** | Yes (Admin, Sales) |

**Query parameters (optional):** `status`, `source`, `search`

**Response:** CSV file download (`Content-Type: text/csv`)

---

## Health Check

### GET `/health`

| | |
|---|---|
| **Description** | Verify API is running |
| **Auth** | No |

**Success response (200):**

```json
{
  "success": true,
  "message": "Smart Leads Dashboard API is running 🚀",
  "timestamp": "2026-05-20T12:00:00.000Z"
}
```

---

## Error Responses

Most errors follow this shape:

```json
{
  "success": false,
  "message": "Error description"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Validation failed |
| 401 | Missing or invalid token |
| 403 | Insufficient role permissions |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate email) |
| 500 | Server error |
