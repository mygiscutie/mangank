-- Enable leaked password protection for better security
UPDATE auth.config SET 
    password_min_length = 8,
    enable_password_history = true,
    enable_leaked_password_protection = true;