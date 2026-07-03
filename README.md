# CFactor Image Processing Backend

Backend service built with **NestJS** and **BullMQ** for asynchronous image processing. The application accepts image uploads, compresses and converts them to **WebP** format in the background, provides job status tracking, and allows downloading the processed image.

## Features

* Upload image files
* Background image processing using BullMQ
* Resize images to a maximum of **1280px** on the longest side while preserving aspect ratio
* Convert images to **WebP**
* Compress images with configurable quality
* Check processing status by `jobId`
* Download processed images
* Automatic deletion of uploaded and processed images
* Automatic cleanup of BullMQ jobs from Redis

---

## Tech Stack

* NestJS
* BullMQ
* Redis
* Sharp
* TypeScript

---

## Project Structure

```text
src/
├── common/                  # Shared exceptions, middleware, filter, and interceptors
├── image/
│   ├── constants/           # Image-related constants (limits, messages, etc.)
│   ├── controller/          # HTTP controllers exposing image APIs
│   ├── dto/                 # Request and response Data Transfer Objects
│   ├── interfaces/          # Service interfaces and shared type definitions
│   ├── services/            # Business logic for image processing and storage
│   ├── image.module.ts      # Registers the image module and its dependencies
│   ├── image.service.ts     # Coordinates image upload, job creation, status checking, and download
│   └── image.processor.ts   # BullMQ worker that processes background jobs (compress and delete)
└── main.ts                  # Application entry point
```

---

## Requirements

* Node.js 22+
* Redis

---

## Installation

Clone the repository:
```bash
git clone https://github.com/Salthof28/be-cfactor-image-processing-web.git
cd be-cfactor-image-processing-web
```
Install dependencies:
```bash
pnpm install
```

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
PORT=4000 
HOST_BULLMQ=localhost 
PORT_BULLMQ=6379 
```

| Variable      | Description                           |
| ------------- | ------------------------------------- |
| `PORT`        | Port used by the NestJS application.  |
| `HOST_BULLMQ` | Redis server hostname used by BullMQ. |
| `PORT_BULLMQ` | Redis server port used by BullMQ.     |

> **Note:** Ensure the Redis server is running before starting the application, as BullMQ requires an active Redis connection to process background jobs.
```

---

## Running Redis

Start the Redis server before running the application.

If Redis is installed locally:

```bash
redis-server --port 6379
```

Verify Redis is running:

```bash
redis-cli ping
```

Expected output:

```text
PONG
```

---

## Running the Application

Development

```bash
pnpm start:dev
```

Production

```bash
pnpm build
pnpm start:prod
```

---

## API Endpoints

### Upload Image

```http
POST /image/upload
```

Response

```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "message": "Image is waiting to be processed."
}
```

---

### Check Processing Status

```http
GET /image/status/:jobId
```

Response

```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "Processing",
  "message": "Image processed successfully."
}
```

Possible statuses:

* `pending` → Image is waiting to be processed
* `processing` → Image is currently being processed
* `completed` → Image processing finished successfully
* `failed` → Image processing failed

---

### Download Processed Image

```http
GET /image/:jobId/download
```

Response

Returns the processed image as a downloadable file.

> **Note:** Processed images are automatically deleted after the configured retention period. Attempting to download an expired image will return a `404 Not Found` response.

---

## Image Processing Flow

```text
Client
   │
   ▼
Upload Image
   │
   ▼
Store Original Image
   │
   ▼
Create BullMQ Job
   │
   ▼
Worker Processes Image
   │
   ├── Resize (max 1280px)
   ├── Convert to WebP
   └── Compress
   │
   ▼
Save Processed Image
   │
   ▼
Schedule Delete Job
   │
   ▼
Delete Original & Processed Images
```

---

## Image Processing Rules

* Supported image formats are validated before processing.
* Maximum upload size is validated before saving.
* Images are resized while maintaining their original aspect ratio.
* Output format is WebP.
* Compression quality is 80%.
* Uploaded and processed images are automatically removed after 10 minutes.

---

## BullMQ Job Cleanup

Completed jobs are automatically removed from Redis after **30 minutes**.

Failed jobs are automatically removed from Redis after **5 minutes**.

Download processed images are automatically removed in storage after **10 minutes**

---

## Error Handling

The application returns appropriate HTTP status codes for common scenarios, including:

* Invalid file type
* File size exceeds limit
* Invalid job ID (Processed image not found)
* Internal server errors

---

## License

This project is created for technical assessment purposes.

---

## Author
🔧 Salman Althof
