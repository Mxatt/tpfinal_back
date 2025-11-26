require('dotenv').config();

console.log('--- Email Configuration Check ---');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '(Set)' : '(Not Set)');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '(Set)' : '(Not Set)');
console.log('USE_TEST_EMAIL:', process.env.USE_TEST_EMAIL);
