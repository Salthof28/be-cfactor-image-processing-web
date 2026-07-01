export const ALLOWED_IMAGE_MIMETYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
];

export const IMAGE_PROCESS_MESSAGES = {
    waiting: 'Image upload received. Waiting to be processed.',
    active: 'Image is being processed.',
    completed: 'Image processed successfully.',
}

export const MAX_SIZE_IMAGE = 20 * 1024 * 1024;
export const STORAGE_DIR = 'storage';
export const UPLOAD_DIR = 'uploads';
export const PROCESSED_DIR = 'processed';