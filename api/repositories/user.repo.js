import db from '../config/knex.js';

class UserRepository {
  // Lấy tất cả users với phân trang và filter
  async findAll({ page = 1, limit = 10, search = '', status = '' }) {
    const offset = (page - 1) * limit;
    
    let query = db('users')
      .select(
        'users.id',
        'users.email',
        'users.name',
        'users.role',
        'users.is_active',
        'users.phone',
        'users.avatar_url',
        'users.created_at',
        'users.updated_at'
      )
      .where('users.role', '=', 'member'); // Chỉ hiển thị members

    // Filter theo search
    if (search) {
      query = query.where(function() {
        this.where('users.name', 'like', `%${search}%`)
          .orWhere('users.email', 'like', `%${search}%`)
          .orWhere('users.id', 'like', `%${search}%`);
      });
    }

    // Filter theo status
    if (status === 'active') {
      query = query.where('users.is_active', true);
    } else if (status === 'inactive') {
      query = query.where('users.is_active', false);
    }

    // Đếm tổng số
    const countQuery = query.clone();
    const [{ total }] = await countQuery.count('* as total');

    // Lấy data với phân trang
    const users = await query
      .orderBy('users.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    return {
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Lấy user theo ID
  async findById(id) {
    return await db('users')
      .select(
        'id',
        'email',
        'name',
        'role',
        'is_active',
        'phone',
        'avatar_url',
        'created_at',
        'updated_at'
      )
      .where({ id })
      .first();
  }

  // Lấy user theo email
  async findByEmail(email) {
    return await db('users')
      .where({ email })
      .first();
  }

  // Tạo user mới
  async create(userData) {
    const [id] = await db('users').insert(userData);
    return await this.findById(id);
  }

  // Cập nhật user
  async update(id, userData) {
    await db('users')
      .where({ id })
      .update({
        ...userData,
        updated_at: db.fn.now()
      });
    return await this.findById(id);
  }

  // Xóa user
  async delete(id) {
    return await db('users').where({ id }).del();
  }

  // Toggle trạng thái active
  async toggleActive(id) {
    const user = await db('users').where({ id }).first();
    if (!user) return null;

    const newStatus = !user.is_active;
    await db('users')
      .where({ id })
      .update({
        is_active: newStatus,
        updated_at: db.fn.now()
      });

    return await this.findById(id);
  }

  // Đếm số lượng user theo role
  async countByRole() {
    const counts = await db('users')
      .select('role')
      .count('* as count')
      .groupBy('role');

    return counts.reduce((acc, { role, count }) => {
      acc[role] = parseInt(count);
      return acc;
    }, {});
  }

  // Đếm user active/inactive (chỉ members)
  async countByStatus() {
    const [active] = await db('users')
      .where({ is_active: true, role: 'member' })
      .count('* as count');
    
    const [inactive] = await db('users')
      .where({ is_active: false, role: 'member' })
      .count('* as count');

    return {
      active: parseInt(active.count),
      inactive: parseInt(inactive.count),
      total: parseInt(active.count) + parseInt(inactive.count)
    };
  }
}

export default new UserRepository();
