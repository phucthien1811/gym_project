// knexfile.js
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',   // hoặc 'localhost'
      port: 3306,
      user: 'root',
      password: '',        // nếu MySQL của bạn có mật khẩu thì điền vào đây
      database: 'gym_db'   // <-- tên DB bạn đã tạo trong phpMyAdmin
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
