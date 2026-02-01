import {randomUUID} from "crypto";
import path from "path";

/**
 * Generates a unique filename (S3 Object Key) while preserving the original file extension.
 * @param {string} originalFileName The original name of the file, e.g., "document.pdf".
 * @param {string} [folderPrefix] An optional folder prefix/path to organize files within S3.
 * @returns {string} A unique S3 object key, e.g., "uploads/d2e46f61-....pdf" or "d2e46f61-....pdf".
 */
export const generateUniqueS3Key = (originalFileName: string, folderPrefix: string = ''): string => {
    const fileExtension: string = path.extname(originalFileName);
    const uniqueId: string = randomUUID();

    // Ensure we handle cases where a prefix is provided or not
    if (folderPrefix) {
        // Use path.join for robust path handling if available in your environment, 
        // otherwise simple string concatenation works for S3 prefixes
        return `${folderPrefix}/${uniqueId}${fileExtension}`;
    } else {
        return `${uniqueId}${fileExtension}`;
    }
};
