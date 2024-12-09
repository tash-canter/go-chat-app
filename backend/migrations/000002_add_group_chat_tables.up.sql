CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

CREATE TABLE group_members (
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (group_id, user_id)
);

CREATE TABLE group_messages (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Rename the current messages table to private_messages
ALTER TABLE messages RENAME TO private_messages;

-- Add a recipient_id column to track the user the message is sent to
ALTER TABLE private_messages ADD COLUMN recipient_id INT REFERENCES users(id);

-- Ensure that private messages are between valid sender and recipient pairs
ALTER TABLE private_messages ADD CONSTRAINT check_user_relationship CHECK (user_id <> recipient_id);

-- Add a is_read column to track if the message has been read
ALTER TABLE private_messages ADD COLUMN is_read BOOLEAN DEFAULT FALSE;

-- Optional: Index for quick lookup of messages between two users
CREATE INDEX idx_private_messages_user_pair ON private_messages(user_id, recipient_id);
CREATE INDEX idx_private_messages_recipient ON private_messages(recipient_id);

