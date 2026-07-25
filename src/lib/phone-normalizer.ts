export interface NormalizationResult { isValid:boolean; canonicalPhone:string; googlePhone:string; validationMessage?:string; statusCode:'VALID'|'NEEDS_REVIEW'|'INVALID'; }
export function normalizeIndianPhone(inputPhone:string):NormalizationResult {
 const input=inputPhone.trim();
 if(!input) return {isValid:false,canonicalPhone:'',googlePhone:'',validationMessage:'Phone number is empty',statusCode:'INVALID'};
 if(/[a-z]/i.test(input)) return {isValid:false,canonicalPhone:'',googlePhone:'',validationMessage:'Contains alphabetic characters',statusCode:'INVALID'};
 let canonical=''; const plus=input.match(/^\+91\D*(\d(?:\D*\d){9})$/); const zero=input.match(/^0091\D*(\d(?:\D*\d){9})$/);
 if(plus) canonical='91'+plus[1].replace(/\D/g,''); else if(zero) canonical='91'+zero[1].replace(/\D/g,''); else { const d=input.replace(/\D/g,''); if(d.length===10) canonical='91'+d; else if(d.length===12&&d.startsWith('91')) canonical=d; else if(d.length===11&&d.startsWith('0')) canonical='91'+d.slice(-10); else canonical=d; }
 const base={canonicalPhone:canonical,googlePhone:canonical?`+${canonical}`:''};
 if(canonical.length<12) return {...base,isValid:false,statusCode:'NEEDS_REVIEW',validationMessage:'Too few digits for an Indian mobile number'};
 if(canonical.length>12) return {...base,isValid:false,statusCode:'NEEDS_REVIEW',validationMessage:'Too many digits for an Indian mobile number'};
 if(!canonical.startsWith('91')) return {...base,isValid:false,statusCode:'NEEDS_REVIEW',validationMessage:'Number does not begin with country code 91'};
 if(!/^[6-9]\d{9}$/.test(canonical.slice(2))) return {...base,isValid:true,statusCode:'VALID',validationMessage:'Non-standard Indian mobile prefix (usually starts with 6-9)'};
 return {...base,isValid:true,statusCode:'VALID'};
}
