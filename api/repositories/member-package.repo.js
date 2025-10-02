import db from '../config/knex.js';

export const memberPackageRepo = {
  // Lấy packages của member
  async findByMemberId(memberId, filters = {}) {
    let query = db('member_packages as mp')
      .join('packages as p', 'mp.package_id', 'p.id')
      .where('mp.user_id', memberId) // Changed from member_id to user_id
      .select(
        'mp.*',
        'p.name as package_name',
        'p.description',
        'p.features',
        'p.duration_days'
      );

    if (filters.status) {
      query = query.where('mp.status', filters.status);
    }

    return query.orderBy('mp.created_at', 'desc');
  },

  // Lấy package hiện tại đang active của member
  async getCurrentPackage(memberId) {
    return db('member_packages as mp')
      .join('packages as p', 'mp.package_id', 'p.id')
      .where('mp.user_id', memberId) // Changed from member_id to user_id
      .where('mp.status', 'active')
      .where('mp.end_date', '>=', new Date())
      .select(
        'mp.*',
        'p.name as package_name',
        'p.description',
        'p.features',
        'p.duration_days'
      )
      .first();
  },

  // Tạo đăng ký package mới
  async create(memberPackageData) {
    const [id] = await db('member_packages').insert(memberPackageData);
    return this.findById(id);
  },

  // Lấy theo ID
  async findById(id) {
    return db('member_packages as mp')
      .join('packages as p', 'mp.package_id', 'p.id')
      .join('users as u', 'mp.user_id', 'u.id') // Changed from members to users
      .where('mp.id', id)
      .select(
        'mp.*',
        'p.name as package_name',
        'p.description',
        'p.features',
        'u.name as full_name', // Changed from m.full_name to u.name
        'u.email'              // Changed from m.email to u.email
      )
      .first();
  },

  // Cập nhật trạng thái
  async updateStatus(id, status) {
    await db('member_packages').where('id', id).update({
      status,
      updated_at: new Date()
    });
    return this.findById(id);
  },

  // Lấy tất cả với filter
  async findAll(filters = {}) {
    let query = db('member_packages as mp')
      .join('packages as p', 'mp.package_id', 'p.id')
      .join('users as u', 'mp.user_id', 'u.id') // Changed from members to users
      .select(
        'mp.*',
        'p.name as package_name',
        'p.price',
        'u.name as full_name', // Changed from m.full_name to u.name
        'u.email'              // Changed from m.email to u.email, removed phone
      );

    if (filters.status) {
      query = query.where('mp.status', filters.status);
    }

    if (filters.packageId) {
      query = query.where('mp.package_id', filters.packageId);
    }

    if (filters.memberId) {
      query = query.where('mp.member_id', filters.memberId);
    }

    return query.orderBy('mp.created_at', 'desc');
  },

  // Gia hạn package
  async extend(memberPackageId, days) {
    const memberPackage = await db('member_packages').where('id', memberPackageId).first();
    if (!memberPackage) {
      throw new Error('Member package not found');
    }

    const newEndDate = new Date(memberPackage.end_date);
    newEndDate.setDate(newEndDate.getDate() + days);

    await db('member_packages').where('id', memberPackageId).update({
      end_date: newEndDate,
      updated_at: new Date()
    });

    return this.findById(memberPackageId);
  },

  // Cập nhật packages hết hạn
  async updateExpiredPackages() {
    return db('member_packages')
      .where('status', 'active')
      .where('end_date', '<', new Date())
      .update({
        status: 'expired',
        updated_at: new Date()
      });
  }
};

export default memberPackageRepo;