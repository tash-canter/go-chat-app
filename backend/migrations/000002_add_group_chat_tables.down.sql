DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS group_members;
DROP TABLE IF EXISTS group_messages;

-- Rename the private_messages table back to messages
ALTER TABLE private_messages RENAME TO messages;

-- Drop the recipient_id column (if you no longer need it)
ALTER TABLE messages DROP COLUMN recipient_id;

-- Drop the is_read column (if you no longer need it)
ALTER TABLE messages DROP COLUMN is_read;

-- Drop the check constraint (if you no longer need it)
ALTER TABLE messages DROP CONSTRAINT check_user_relationship;

-- Drop the indexes created for private messaging (if no longer needed)
DROP INDEX IF EXISTS idx_private_messages_user_pair;
DROP INDEX IF EXISTS idx_private_messages_recipient;

