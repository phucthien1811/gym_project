import { loginUserWithEmailAndPassword, refreshAuthToken } from '../service/auth.js'; // Import các function cần thiết
import { loginSchema } from '../validations/auth.js'; // Sửa lại cách import

// Sử dụng export const thay vì gán vào object
export const login = async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        
        const { email, password } = value;
        const result = await loginUserWithEmailAndPassword(email, password);
        
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

// Thêm controller cho refresh token
export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        const result = await refreshAuthToken(refreshToken);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 401).json({ message: error.message });
    }
};

