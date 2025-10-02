import { db } from '../config/database.js';
import { generateTokens, verifyToken } from '../utils/jwt.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const loginUserWithEmailAndPassword = async (email, password) => {
    try {
        // Tìm user theo email
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        
        const user = rows[0];
        if (!user) {
            throw new Error('Email hoặc mật khẩu không chính xác');
        }

        // Kiểm tra password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Email hoặc mật khẩu không chính xác');
        }

        const payload = { 
            id: user.id, 
            sub: user.id, // Để tương thích 
            email: user.email,
            name: user.full_name,
            role: user.role 
        };
        const tokens = generateTokens(payload);

        // Lưu refresh token vào database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Hết hạn sau 7 ngày
        
        await db.execute(
            'INSERT INTO refresh_tokens (token, user_id, expires_at, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
            [tokens.refreshToken, user.id, expiresAt]
        );

        // Bỏ password khỏi object trả về
        const userResponse = {
            id: user.id,
            email: user.email,
            name: user.full_name, // Fix: use full_name from database
            role: user.role
        };

        return { user: userResponse, token: tokens.accessToken, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
    } catch (error) {
        throw error;
    }
};

const refreshAuthToken = async (refreshToken) => {
    try {
        // 1. Tìm và xác thực refresh token
        const [tokenRows] = await db.execute(
            'SELECT * FROM refresh_tokens WHERE token = ?',
            [refreshToken]
        );
        
        const tokenDoc = tokenRows[0];
        if (!tokenDoc) {
            const err = new Error("Refresh token không hợp lệ");
            err.status = 401;
            throw err;
        }

        // 2. Kiểm tra token đã hết hạn chưa
        if (new Date(tokenDoc.expires_at) < new Date()) {
            await db.execute('DELETE FROM refresh_tokens WHERE id = ?', [tokenDoc.id]);
            const err = new Error("Refresh token đã hết hạn");
            err.status = 401;
            throw err;
        }
        
        // 3. Lấy thông tin người dùng
        const [userRows] = await db.execute(
            'SELECT * FROM users WHERE id = ?',
            [tokenDoc.user_id]
        );
        
        const user = userRows[0];
        if (!user) {
            await db.execute('DELETE FROM refresh_tokens WHERE id = ?', [tokenDoc.id]);
            const err = new Error("Không tìm thấy người dùng");
            err.status = 401;
            throw err;
        }

        // 4. Tạo cặp token mới
        const payload = { sub: user.id, role: user.role };
        const newTokens = generateTokens(payload);

        // 5. Xoay vòng token (Token Rotation): Xóa token cũ, lưu token mới
        await db.execute('DELETE FROM refresh_tokens WHERE id = ?', [tokenDoc.id]);
        
        const newExpiresAt = new Date();
        newExpiresAt.setDate(newExpiresAt.getDate() + 7);
        
        await db.execute(
            'INSERT INTO refresh_tokens (token, user_id, expires_at, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
            [newTokens.refreshToken, user.id, newExpiresAt]
        );

        const userResponse = {
            id: user.id,
            email: user.email,
            name: user.full_name, // Fix: use full_name from database
            role: user.role
        };

        return { user: userResponse, token: newTokens.accessToken, accessToken: newTokens.accessToken, refreshToken: newTokens.refreshToken };
    } catch (error) {
        throw error;
    }
};


export {
    loginUserWithEmailAndPassword,
    refreshAuthToken // Xuất service mới
};

