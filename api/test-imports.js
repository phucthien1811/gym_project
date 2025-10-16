// Test import
import packageRepo from './repositories/package.repo.js';
import memberPackageRepo from './repositories/member-package.repo.js';
import memberRepo from './repositories/member.repo.js';

console.log('✅ All repositories imported successfully');
console.log('Package repo methods:', Object.keys(packageRepo));
console.log('Member package repo methods:', Object.keys(memberPackageRepo));
console.log('Member repo methods:', Object.keys(memberRepo));

process.exit(0);