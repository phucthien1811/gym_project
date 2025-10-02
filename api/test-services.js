// Test services
import packageService from './services/package.service.js';
import memberPackageService from './services/member-package.service.js';

console.log('✅ All services imported successfully');
console.log('Package service methods:', Object.keys(packageService));
console.log('Member package service methods:', Object.keys(memberPackageService));

process.exit(0);