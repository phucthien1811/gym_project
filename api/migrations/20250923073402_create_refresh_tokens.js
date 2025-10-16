// api/migrations/xxxx_create_refresh_tokens.js
export async function up(knex) {
  await knex.schema.createTable("refresh_tokens", (t) => {
    t.increments("id").primary();
    t.integer("user_id").unsigned().notNullable()
      .references("id").inTable("users")
      .onUpdate("CASCADE").onDelete("CASCADE");
    t.string("token").notNullable().unique();
    t.dateTime("expires_at").notNullable();
    t.boolean("revoked").notNullable().defaultTo(false);
    t.timestamps(true, true);
    t.index(["user_id", "revoked"]);
  });
}
export async function down(knex) {
  await knex.schema.dropTableIfExists("refresh_tokens");
}
