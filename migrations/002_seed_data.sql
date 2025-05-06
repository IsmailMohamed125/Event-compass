-- Insert sample users into auth.users
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
)
VALUES 
    (
        '00000000-0000-0000-0000-000000000001',
        'john@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"John Doe"}',
        false,
        'authenticated'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'jane@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"Jane Smith"}',
        false,
        'authenticated'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'bob@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"Bob Wilson"}',
        false,
        'authenticated'
    );

-- Insert sample profiles
INSERT INTO profiles (id, full_name, avatar_url)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'John Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'),
    ('00000000-0000-0000-0000-000000000002', 'Jane Smith', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'),
    ('00000000-0000-0000-0000-000000000003', 'Bob Wilson', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob');

-- Insert sample events
INSERT INTO events (
    name,
    description,
    date,
    location,
    image_url,
    price,
    max_attendees,
    organizer_id,
    status
)
VALUES 
    (
        'Tech Conference 2024',
        'Join us for a day of cutting-edge technology talks and workshops.',
        NOW() + INTERVAL '30 days',
        '123 Tech Street, Silicon Valley, CA',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
        99.99,
        100,
        '00000000-0000-0000-0000-000000000001',
        'active'
    ),
    (
        'Community Art Exhibition',
        'Showcasing local artists and their amazing work.',
        NOW() + INTERVAL '15 days',
        '456 Art Avenue, Downtown, NY',
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop',
        25.00,
        50,
        '00000000-0000-0000-0000-000000000002',
        'active'
    ),
    (
        'Charity Fundraiser Gala',
        'An evening of entertainment and giving back to the community.',
        NOW() + INTERVAL '45 days',
        '789 Charity Road, Uptown, NY',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop',
        150.00,
        200,
        '00000000-0000-0000-0000-000000000003',
        'active'
    ),
    (
        'Coding Workshop',
        'Learn the basics of web development in this hands-on workshop.',
        NOW() + INTERVAL '7 days',
        '101 Code Lane, Tech District, SF',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop',
        49.99,
        30,
        '00000000-0000-0000-0000-000000000001',
        'active'
    ),
    (
        'Food Festival',
        'Taste cuisines from around the world at our annual food festival.',
        NOW() + INTERVAL '60 days',
        '202 Food Court, Downtown, LA',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop',
        35.00,
        500,
        '00000000-0000-0000-0000-000000000002',
        'active'
    );

-- Insert sample registrations
INSERT INTO registrations (event_id, user_id, status)
SELECT 
    e.id as event_id,
    p.id as user_id,
    CASE 
        WHEN random() < 0.7 THEN 'confirmed'
        WHEN random() < 0.9 THEN 'pending'
        ELSE 'cancelled'
    END as status
FROM events e
CROSS JOIN profiles p
WHERE random() < 0.3; -- Only create registrations for 30% of possible combinations

-- Update current_attendees count based on confirmed registrations
UPDATE events e
SET current_attendees = (
    SELECT COUNT(*)
    FROM registrations r
    WHERE r.event_id = e.id
    AND r.status = 'confirmed'
); 