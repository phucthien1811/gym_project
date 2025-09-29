import bcrypt from "bcrypt";

export async function seed(knex) {
  // Xóa admin cũ nếu có
  await knex("users").where({ email: "admin@gym.com" }).del();

  // Tạo mật khẩu hash
  const passwordHash = await bcrypt.hash("admin123", 10);

  // Insert admin
  await knex("users").insert({
    email: "admin@gym.com",
    name: "Super Admin",
    password_hash: passwordHash,
    role: "admin",
    created_at: new Date(),
    updated_at: new Date(),
  });
}
