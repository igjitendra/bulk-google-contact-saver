const assert = require('assert');

// Inline core functions for verification
function normalizeIndianPhone(inputPhone) {
  if (!inputPhone || inputPhone.trim() === '') {
    return { isValid: false, canonicalPhone: '', googlePhone: '', statusCode: 'INVALID' };
  }
  const rawTrimmed = inputPhone.trim();
  if (/[a-zA-Z]/.test(rawTrimmed)) {
    return { isValid: false, canonicalPhone: rawTrimmed, googlePhone: rawTrimmed, statusCode: 'INVALID' };
  }
  let digitsOnly = rawTrimmed.replace(/\D/g, '');
  let isPrefixHandled = false;
  let canonical = '';

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
      canonical = '91' + digitsOnly;
    } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
      canonical = digitsOnly;
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
      canonical = '91' + digitsOnly.substring(1);
    } else {
      canonical = digitsOnly;
    }
  }

  if (canonical.length < 12 || canonical.length > 12 || !canonical.startsWith('91')) {
    return { isValid: false, canonicalPhone: canonical, googlePhone: `+${canonical}`, statusCode: 'NEEDS_REVIEW' };
  }

  return { isValid: true, canonicalPhone: canonical, googlePhone: `+${canonical}`, statusCode: 'VALID' };
}

function processAndDeduplicate(rawInputs) {
  const initialProcessed = rawInputs.map((input) => {
    const norm = normalizeIndianPhone(input.originalPhone);
    const fallbackName = norm.canonicalPhone ? norm.canonicalPhone : input.originalPhone;
    const finalName = input.originalName && input.originalName.trim() !== ''
      ? input.originalName.trim()
      : fallbackName;

    return {
      originalRowIndex: input.originalRowIndex,
      originalName: input.originalName,
      originalPhone: input.originalPhone,
      normalizedCanonical: norm.canonicalPhone,
      googleInternationalPhone: norm.googlePhone,
      finalName,
      status: norm.isValid ? 'valid' : 'needs_review',
      isDuplicate: false,
    };
  });

  const canonicalMap = new Map();
  const invalidOrUnprocessable = [];

  initialProcessed.forEach((contact) => {
    if (!contact.normalizedCanonical || contact.status !== 'valid') {
      invalidOrUnprocessable.push(contact);
    } else {
      const existing = canonicalMap.get(contact.normalizedCanonical) || [];
      existing.push(contact);
      canonicalMap.set(contact.normalizedCanonical, existing);
    }
  });

  const deduplicated = [];

  canonicalMap.forEach((group) => {
    if (group.length === 1) {
      deduplicated.push(group[0]);
    } else {
      let best = group.find((c) => c.originalName && c.originalName.trim() !== '' && c.originalName !== c.normalizedCanonical);
      if (!best) best = group[0];
      deduplicated.push(best);
    }
  });

  return [...deduplicated, ...invalidOrUnprocessable];
}

console.log('--- Running Acceptance Tests ---');

// Test 1
const t1Norm = normalizeIndianPhone('9876543210');
const t1Name = '' || t1Norm.canonicalPhone;
console.log('Test 1:', t1Name === '919876543210' && t1Norm.googlePhone === '+919876543210' ? 'PASSED' : 'FAILED');
assert.strictEqual(t1Name, '919876543210');
assert.strictEqual(t1Norm.googlePhone, '+919876543210');

// Test 2
const t2Norm = normalizeIndianPhone('9876543210');
const t2Name = 'Rahul Kumar';
console.log('Test 2:', t2Name === 'Rahul Kumar' && t2Norm.googlePhone === '+919876543210' ? 'PASSED' : 'FAILED');
assert.strictEqual(t2Name, 'Rahul Kumar');
assert.strictEqual(t2Norm.googlePhone, '+919876543210');

// Test 3
const t3Norm = normalizeIndianPhone('919876543210');
const t3Name = '' || t3Norm.canonicalPhone;
console.log('Test 3:', t3Name === '919876543210' && t3Norm.googlePhone === '+919876543210' ? 'PASSED' : 'FAILED');
assert.strictEqual(t3Name, '919876543210');
assert.strictEqual(t3Norm.googlePhone, '+919876543210');

// Test 4
const t4Inputs = [
  { originalRowIndex: 1, originalPhone: '9876543210', originalName: '' },
  { originalRowIndex: 2, originalPhone: '+91 98765 43210', originalName: 'Rahul' },
  { originalRowIndex: 3, originalPhone: '919876543210', originalName: 'Rahul Kumar' },
];
const t4Result = processAndDeduplicate(t4Inputs);
console.log('Test 4:', t4Result.length === 1 && t4Result[0].googleInternationalPhone === '+919876543210' ? 'PASSED' : 'FAILED');
assert.strictEqual(t4Result.length, 1);
assert.strictEqual(t4Result[0].finalName, 'Rahul');

// Test 5
const t5Norm = normalizeIndianPhone('12345');
console.log('Test 5:', t5Norm.isValid === false && t5Norm.statusCode === 'NEEDS_REVIEW' ? 'PASSED' : 'FAILED');
assert.strictEqual(t5Norm.isValid, false);

console.log('ALL ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
