import { google } from 'googleapis';

export interface CreateContactParams {
  id: string;
  name: string;
  phone: string;
}

export interface CreateContactResponse {
  id: string;
  success: boolean;
  resourceName?: string;
  error?: string;
  isPermanentError?: boolean;
}

/**
 * Creates a single Google Contact via Google People API with exponential backoff retry
 */
export async function createSingleGoogleContact(
  accessToken: string,
  param: CreateContactParams,
  maxRetries = 3
): Promise<CreateContactResponse> {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const people = google.people({ version: 'v1', auth });

  let attempt = 0;
  let delay = 1000; // start with 1 second delay

  while (attempt < maxRetries) {
    try {
      const res = await people.people.createContact({
        requestBody: {
          names: [
            {
              givenName: param.name,
            },
          ],
          phoneNumbers: [
            {
              value: param.phone,
              type: 'mobile',
            },
          ],
        },
      });

      return {
        id: param.id,
        success: true,
        resourceName: res.data.resourceName || undefined,
      };
    } catch (err: any) {
      attempt++;
      const statusCode = err.code || err.status || err.response?.status;
      const errorMessage = err.message || err.response?.data?.error?.message || 'Failed to create contact';

      // Check if permanent failure (e.g. 401 Unauthenticated, 403 Permission Denied/Quota Exceeded permanent, 400 Bad Request)
      if (statusCode === 401) {
        return {
          id: param.id,
          success: false,
          error: 'Google OAuth Access Token expired or invalid. Please re-authenticate.',
          isPermanentError: true,
        };
      }

      if (statusCode === 403 && errorMessage.toLowerCase().includes('insufficient')) {
        return {
          id: param.id,
          success: false,
          error: 'Missing Google Contacts scope permission. Please sign in again and grant contacts permission.',
          isPermanentError: true,
        };
      }

      if (statusCode === 400) {
        return {
          id: param.id,
          success: false,
          error: `Invalid contact format: ${errorMessage}`,
          isPermanentError: true,
        };
      }

      // If rate limited (429 or 503), wait with exponential backoff if retries left
      if ((statusCode === 429 || statusCode === 503) && attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }

      if (attempt >= maxRetries) {
        return {
          id: param.id,
          success: false,
          error: errorMessage,
          isPermanentError: false,
        };
      }
    }
  }

  return {
    id: param.id,
    success: false,
    error: 'Exceeded maximum retries for contact creation.',
    isPermanentError: false,
  };
}
