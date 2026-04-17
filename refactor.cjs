/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /@\/components\/booking-form/g, replace: '@/modules/appointments/components/booking-form' },
  { search: /@\/components\/booking-form-lazy/g, replace: '@/modules/appointments/components/booking-form-lazy' },
  { search: /@\/lib\/db\/appointments/g, replace: '@/modules/appointments/services/appointments' },
  { search: /@\/lib\/validations\/appointment/g, replace: '@/modules/appointments/validations/appointment' },
  { search: /@\/components\/admin\/LogsTable/g, replace: '@/modules/logs/components/LogsTable' },
  { search: /@\/components\/admin\/LogFilters/g, replace: '@/modules/logs/components/LogFilters' },
  { search: /@\/components\/admin\/LogDetailsModal/g, replace: '@/modules/logs/components/LogDetailsModal' },
  { search: /@\/lib\/logger/g, replace: '@/modules/logs/services/logger' },
  { search: /@\/components\/admin-login-form/g, replace: '@/modules/admin/components/admin-login-form' },
  { search: /@\/components\/admin-signout-button/g, replace: '@/modules/admin/components/admin-signout-button' }
];

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
        processDirectory(fullPath);
      }
    } else if (entry.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const r of replacements) {
        if (content.match(r.search)) {
          content = content.replace(r.search, r.replace);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(__dirname);
