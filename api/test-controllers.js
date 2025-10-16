// Test controllers
import packageController from './controllers/package.controller.js';
import memberPackageController from './controllers/member-package.controller.js';

console.log('✅ All controllers imported successfully');
console.log('Package controller methods:', Object.keys(packageController));
console.log('Member package controller methods:', Object.keys(memberPackageController));

process.exit(0);