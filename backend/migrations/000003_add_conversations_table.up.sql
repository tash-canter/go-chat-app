CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    is_group BOOLEAN NOT NULL,
    group_id INT REFERENCES groups(id),
    chat_name VARCHAR(100),
    last_message TEXT,
    last_message_at TIMESTAMP,
    last_message_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversation_participants (
    id SERIAL PRIMARY KEY,
    conversation_id INT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    unread_count INT DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    UNIQUE (conversation_id, user_id)
);

ALTER TABLE private_messages
ADD COLUMN conversation_id INT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE;

ALTER TABLE group_messages
ADD COLUMN conversation_id INT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE;
