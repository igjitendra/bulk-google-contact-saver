export interface NormalizationResult {
  isValid: boolean;
  canonicalPhone: string; // e.g. "919876543210" or original if invalid
  googlePhone: string; // e.g. "+919876543210" or original if invalid
  validationMessage?: string;
  statusCode: 'VALID' | 'NEEDS_REVIEW' | 'INVALID';
}

/**
 * Indian Mobile Number Normalizer and Validator
 */
export function normalizeIndianPhone(inputPhone: string): NormalizationResult {
  if (!inputPhone || inputPhone.trim() === '') {
    return {
      isValid: false,
      canonicalPhone: '',
      googlePhone: '',
      validationMessage: 'Phone number is empty',
      statusCode: 'INVALID',
    };
  }

  const rawTrimmed = inputPhone.trim();

  // Check for alphabetic characters in phone string
  if (/[a-zA-Z]/.test(rawTrimmed)) {
    return {
      isValid: false,
      canonicalPhone: rawTrimmed,
      googlePhone: rawTrimmed,
      validationMessage: 'Contains alphabetic characters',
      statusCode: 'INVALID',
    };
  }

  // Remove non-digit characters except leading '+' if present in check
  let digitsOnly = rawTrimmed.replace(/\D/g, '');

  // Check prefix variations before stripping all leading 0s/plus
  let isPrefixHandled = false;
  let canonical = '';

  // Handle +91 or 0091 prefixes
  if (rawTrimmed.startsWith('+91')) {
    const afterPlus = rawTrimmed.substring(3).replace(/\D/g, '');
    if (afterPlus.length === 10) {
      canonical = '91' + afterPlus;
      isPrefixHandled = true;
    }
  } else if (rawTrimmed.startsWith('0091')) {
    const after0091 = rawTrimmed.substring(4).replace(/\D/g, '');
    if (after0091.length === 10) {
      canonical = '91' + after0091;
      isPrefixHandled = true;
    }
  }

  if (!isPrefixHandled) {
    if (digitsOnly.length === 10) {
      // 10 digits -> prepend 91
      canonical = '91' + digitsOnly;
    } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
      // 12 digits starting with 91 -> keep 91XXXXXXXXXX
      canonical = digitsOnly;
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
      // 11 digits starting with 0 (e.g. 09876543210) -> strip leading 0, prepend 91
      const tenDigits = digitsOnly.substring(1);
      canonical = '91' + tenDigits;
    } else {
      canonical = digitsOnly;
    }
  }

  // Validation Checks on canonical
  if (canonical.length < 12) {
    return {
      isValid: false,
      canonicalPhone: canonical,
      googlePhone: canonical ? `+${canonical}` : rawTrimmed,
      validationMessage: `Too few digits (${canonical.length} digits). Requires 10-digit mobile number`,
      statusCode: 'NEEDS_REVIEW',
    };
  }

  if (canonical.length > 12) {
    return {
      isValid: false,
      canonicalPhone: canonical,
      googlePhone: `+${canonical}`,
      validationMessage: `Too many digits (${canonical.length} digits)`,
      statusCode: 'NEEDS_REVIEW',
    };
  }

  if (!canonical.startsWith('91')) {
    return {
      isValid: false,
      canonicalPhone: canonical,
      googlePhone: `+${canonical}`,
      validationMessage: '12-digit number does not begin with country code 91',
      statusCode: 'NEEDS_REVIEW',
    };
  }

  // Validate the 10-digit mobile number part (Indian mobile numbers start with 6, 7, 8, 9)
  const mobileTenDigits = canonical.substring(2);
  const isValidIndianMobileStart = /^[6-9]\d{9}$/.test(mobileTenDigits);

  if (!isValidIndianMobileStart) {
    return {
      isValid: true, // Still acceptable canonical format, but warn user
      canonicalPhone: canonical,
      googlePhone: `+${canonical}`,
      validationMessage: 'Non-standard Indian mobile prefix (usually starts with 6-9)',
      statusCode: 'VALID',
    };
  }

  return {
    isValid: true,
    canonicalPhone: canonical,
    googlePhone: `+${canonical}`,
    statusCode: 'VALID',
  };
}
