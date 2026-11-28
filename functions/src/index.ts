import { getApps, initializeApp } from 'firebase-admin/app';
import { onRequest } from 'firebase-functions/v2/https';
import { FUNCTIONS_REGION, GEMINI_API_KEY } from './config.js';
import { createApiHandler } from './routes/apiHandler.js';

if (getApps().length === 0) {
  initializeApp();
}

const handler = createApiHandler({
  getGeminiKey: () => GEMINI_API_KEY.value() || process.env.GEMINI_API_KEY,
});

export const api = onRequest(
  {
    region: FUNCTIONS_REGION,
    secrets: [GEMINI_API_KEY],
    memory: '512MiB',
    timeoutSeconds: 60,
    maxInstances: 20,
  },
  handler
);

export {
  onQuoteCreated,
  onSwitchAnalysisCreated,
  onClaimCreated,
  onClaimUpdated,
  onComplaintCreated,
  onComplaintUpdated,
  onPolicyUpdated,
} from './triggers/firestoreTriggers.js';

export { dailyRenewalAndSlaMonitor } from './triggers/scheduledJobs.js';
