// src/config/seedAdmin.js
// Script untuk mengaktifkan status is_admin untuk admin user

const db = require('./db');

async function seedAdmin() {
  const adminEmail = 'admin@sahabatdengar.com';
  try {
    const res = await db.query(
      'UPDATE users SET is_admin = TRUE WHERE email = $1 RETURNING id, email, is_admin',
      [adminEmail]
    );
    if (res.rows.length > 0) {
      console.log(`✅ User ${adminEmail} berhasil dijadikan Administrator (is_admin = true)`);
    } else {
      console.log(`ℹ️ User ${adminEmail} belum terdaftar.`);
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
    process.exit(1);
  }
}

seedAdmin();
