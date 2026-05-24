export const normalizePhoneForGymforce = (phoneNumber = '') => {
  return String(phoneNumber).replace(/[^\d]/g, '');
};

export const isGymforceEnabledForUser = (userId, allowlist = process.env.GYMFORCE_INTEGRATION_ENABLED_USER_IDS || '') => {
  if (!userId || !allowlist) return false;
  return allowlist
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
    .includes(userId.toString());
};

export const buildGymforceOpenUrl = (adminBaseUrl, phoneNumber) => {
  if (!adminBaseUrl) return null;

  const baseUrl = adminBaseUrl.endsWith('/') ? adminBaseUrl : `${adminBaseUrl}/`;
  const url = new URL('leads/open', baseUrl);
  url.searchParams.set('phone', normalizePhoneForGymforce(phoneNumber));
  url.searchParams.set('source', 'synqzy');
  return url.toString();
};

export const resolveGymforceUrl = (adminBaseUrl, urlPath) => {
  if (!adminBaseUrl || !urlPath) return null;
  return new URL(urlPath, adminBaseUrl.endsWith('/') ? adminBaseUrl : `${adminBaseUrl}/`).toString();
};

export const sanitizeGymforceLookupResponse = (payload = {}) => {
  const status = ['found', 'not_found', 'multiple', 'unavailable'].includes(payload.status)
    ? payload.status
    : 'unavailable';

  const response = {
    success: payload.success !== false,
    status
  };

  if (payload.lead && status === 'found') {
    response.lead = {
      id: payload.lead.id || payload.lead._id || null,
      name: payload.lead.name || null,
      phone: payload.lead.phone || payload.lead.phone_number || null,
      detail_url: payload.lead.detail_url || null,
      open_url: payload.lead.open_url || null
    };
  } else if (payload.lead === null || status === 'not_found') {
    response.lead = null;
  }

  if (typeof payload.count === 'number') {
    response.count = payload.count;
  }

  if (payload.leads_url) {
    response.leads_url = payload.leads_url;
  }

  if (payload.open_url) {
    response.open_url = payload.open_url;
  }

  return response;
};
