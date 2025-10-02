import { db } from './config/database.js';

async function createMemberProfilesTable() {
    try {
        console.log('🔄 Creating member_profiles table...');
        
        await db.execute(`
            CREATE TABLE IF NOT EXISTS member_profiles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT UNSIGNED NOT NULL,
                
                -- Personal Information
                phone VARCHAR(20),
                birth_date DATE,
                gender ENUM('male', 'female', 'other'),
                address TEXT,
                avatar_url VARCHAR(500),
                
                -- Physical Information
                height DECIMAL(5,2), -- cm (e.g., 175.50)
                weight DECIMAL(5,2), -- kg (e.g., 70.50)
                bmi DECIMAL(4,2), -- calculated BMI
                
                -- Fitness Goals
                fitness_goals TEXT,
                activity_level ENUM('sedentary', 'light', 'moderate', 'active', 'very_active') DEFAULT 'moderate',
                
                -- Emergency Contact
                emergency_contact_name VARCHAR(255),
                emergency_contact_phone VARCHAR(20),
                emergency_contact_relationship VARCHAR(100),
                
                -- Membership Info
                membership_status VARCHAR(50) DEFAULT 'inactive',
                membership_start_date DATE,
                membership_end_date DATE,
                membership_type VARCHAR(50),
                
                -- Medical Information
                medical_conditions TEXT,
                allergies TEXT,
                
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                UNIQUE KEY unique_user_profile (user_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);
        
        console.log('✅ member_profiles table created successfully!');
        
        // Insert sample profiles for existing users
        console.log('🔄 Creating sample profiles...');
        
        // Get existing users
        const [users] = await db.execute('SELECT id, name, email FROM users');
        console.log(`📊 Found ${users.length} users`);
        
        for (const user of users) {
            // Check if profile already exists
            const [existing] = await db.execute('SELECT id FROM member_profiles WHERE user_id = ?', [user.id]);
            
            if (existing.length === 0) {
                await db.execute(`
                    INSERT INTO member_profiles (
                        user_id, phone, gender, height, weight, 
                        fitness_goals, membership_status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [
                    user.id,
                    '0123456789',
                    'male',
                    175.0,
                    70.0,
                    'Tăng cơ bắp và giảm mỡ thừa',
                    user.email.includes('admin') ? 'inactive' : 'active'
                ]);
                
                console.log(`✅ Created profile for user: ${user.name}`);
            } else {
                console.log(`⏭️ Profile already exists for user: ${user.name}`);
            }
        }
        
        console.log('🎉 All done!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createMemberProfilesTable();