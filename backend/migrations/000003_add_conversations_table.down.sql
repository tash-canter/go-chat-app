DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS conversation_participants;

ALTER TABLE private_messages
DROP CONSTRAINT private_messages_conversation_id_fkey,  -- Drop the foreign key constraint
DROP COLUMN conversation_id;  -- Drop the conversation_id column

ALTER TABLE group_messages
DROP CONSTRAINT group_messages_conversation_id_fkey,  -- Drop the foreign key constraint
DROP COLUMN conversation_id;  -- Drop the conversation_id column
