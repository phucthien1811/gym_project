// migrations/xxxx_create_members.js
export async function up(knex) {
  await knex.schema.createTable("members", (t) => {
    t.increments("id").primary();

    // Liên kết với bảng users để tránh lặp dữ liệu
    t.integer("user_id").unsigned().notNullable().unique();
    t.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");

    t.string("phone");
    t.date("joined_at").notNullable().defaultTo(knex.fn.now());
    t.timestamps(true, true);
  });
}