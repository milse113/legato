// Code generated by sqlc. DO NOT EDIT.
// source: messages.sql

package queries

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"

	"github.com/lib/pq"
)

const addAttachment = `-- name: AddAttachment :exec
INSERT INTO Attachments(Message_ID, Attachment)
VALUES ($1, $2)
`

type AddAttachmentParams struct {
	MessageID  uint64 `json:"message_id"`
	Attachment string `json:"attachment"`
}

func (q *Queries) AddAttachment(ctx context.Context, arg AddAttachmentParams) error {
	_, err := q.exec(ctx, q.addAttachmentStmt, addAttachment, arg.MessageID, arg.Attachment)
	return err
}

const addMessage = `-- name: AddMessage :one
INSERT INTO Messages (Guild_ID, Channel_ID, User_ID, Content, Embeds, Actions, Created_At)
VALUES ($1, $2, $3, $4, $5, $6, NOW())
RETURNING message_id, guild_id, channel_id, user_id, created_at, edited_at, content, embeds, actions
`

type AddMessageParams struct {
	GuildID   uint64            `json:"guild_id"`
	ChannelID uint64            `json:"channel_id"`
	UserID    uint64            `json:"user_id"`
	Content   string            `json:"content"`
	Embeds    []json.RawMessage `json:"embeds"`
	Actions   []json.RawMessage `json:"actions"`
}

func (q *Queries) AddMessage(ctx context.Context, arg AddMessageParams) (Message, error) {
	row := q.queryRow(ctx, q.addMessageStmt, addMessage,
		arg.GuildID,
		arg.ChannelID,
		arg.UserID,
		arg.Content,
		pq.Array(arg.Embeds),
		pq.Array(arg.Actions),
	)
	var i Message
	err := row.Scan(
		&i.MessageID,
		&i.GuildID,
		&i.ChannelID,
		&i.UserID,
		&i.CreatedAt,
		&i.EditedAt,
		&i.Content,
		pq.Array(&i.Embeds),
		pq.Array(&i.Actions),
	)
	return i, err
}

const deleteMessage = `-- name: DeleteMessage :execrows
DELETE
FROM Messages
WHERE Message_ID = $1
  AND Channel_ID = $2
  AND Guild_ID = $3
`

type DeleteMessageParams struct {
	MessageID uint64 `json:"message_id"`
	ChannelID uint64 `json:"channel_id"`
	GuildID   uint64 `json:"guild_id"`
}

func (q *Queries) DeleteMessage(ctx context.Context, arg DeleteMessageParams) (int64, error) {
	result, err := q.exec(ctx, q.deleteMessageStmt, deleteMessage, arg.MessageID, arg.ChannelID, arg.GuildID)
	if err != nil {
		return 0, err
	}
	return result.RowsAffected()
}

const getAttachments = `-- name: GetAttachments :many
SELECT Attachment
FROM Attachments
WHERE Message_ID = $1
`

func (q *Queries) GetAttachments(ctx context.Context, messageID uint64) ([]string, error) {
	rows, err := q.query(ctx, q.getAttachmentsStmt, getAttachments, messageID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []string
	for rows.Next() {
		var attachment string
		if err := rows.Scan(&attachment); err != nil {
			return nil, err
		}
		items = append(items, attachment)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getMessage = `-- name: GetMessage :one
SELECT message_id, guild_id, channel_id, user_id, created_at, edited_at, content, embeds, actions
FROM Messages
WHERE Message_ID = $1
`

func (q *Queries) GetMessage(ctx context.Context, messageID uint64) (Message, error) {
	row := q.queryRow(ctx, q.getMessageStmt, getMessage, messageID)
	var i Message
	err := row.Scan(
		&i.MessageID,
		&i.GuildID,
		&i.ChannelID,
		&i.UserID,
		&i.CreatedAt,
		&i.EditedAt,
		&i.Content,
		pq.Array(&i.Embeds),
		pq.Array(&i.Actions),
	)
	return i, err
}

const getMessageAuthor = `-- name: GetMessageAuthor :one
SELECT User_ID
FROM Messages
WHERE Message_ID = $1
`

func (q *Queries) GetMessageAuthor(ctx context.Context, messageID uint64) (uint64, error) {
	row := q.queryRow(ctx, q.getMessageAuthorStmt, getMessageAuthor, messageID)
	var user_id uint64
	err := row.Scan(&user_id)
	return user_id, err
}

const getMessageDate = `-- name: GetMessageDate :one
SELECT Created_At
FROM Messages
WHERE Message_ID = $1
`

func (q *Queries) GetMessageDate(ctx context.Context, messageID uint64) (time.Time, error) {
	row := q.queryRow(ctx, q.getMessageDateStmt, getMessageDate, messageID)
	var created_at time.Time
	err := row.Scan(&created_at)
	return created_at, err
}

const getMessages = `-- name: GetMessages :many
SELECT message_id, guild_id, channel_id, user_id, created_at, edited_at, content, embeds, actions
FROM Messages
WHERE Guild_ID = $1
  AND Channel_ID = $2
  AND Created_At < $3
ORDER BY Created_At DESC
LIMIT $4
`

type GetMessagesParams struct {
	Guildid   uint64    `json:"guildid"`
	Channelid uint64    `json:"channelid"`
	Before    time.Time `json:"before"`
	Max       int32     `json:"max"`
}

func (q *Queries) GetMessages(ctx context.Context, arg GetMessagesParams) ([]Message, error) {
	rows, err := q.query(ctx, q.getMessagesStmt, getMessages,
		arg.Guildid,
		arg.Channelid,
		arg.Before,
		arg.Max,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Message
	for rows.Next() {
		var i Message
		if err := rows.Scan(
			&i.MessageID,
			&i.GuildID,
			&i.ChannelID,
			&i.UserID,
			&i.CreatedAt,
			&i.EditedAt,
			&i.Content,
			pq.Array(&i.Embeds),
			pq.Array(&i.Actions),
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateMessageActions = `-- name: UpdateMessageActions :one
UPDATE Messages
  SET Actions = $2,
      Edited_At = NOW()
  WHERE Message_ID = $1
RETURNING Actions, Edited_At
`

type UpdateMessageActionsParams struct {
	MessageID uint64            `json:"message_id"`
	Actions   []json.RawMessage `json:"actions"`
}

type UpdateMessageActionsRow struct {
	Actions  []json.RawMessage `json:"actions"`
	EditedAt sql.NullTime      `json:"edited_at"`
}

func (q *Queries) UpdateMessageActions(ctx context.Context, arg UpdateMessageActionsParams) (UpdateMessageActionsRow, error) {
	row := q.queryRow(ctx, q.updateMessageActionsStmt, updateMessageActions, arg.MessageID, pq.Array(arg.Actions))
	var i UpdateMessageActionsRow
	err := row.Scan(pq.Array(&i.Actions), &i.EditedAt)
	return i, err
}

const updateMessageContent = `-- name: UpdateMessageContent :one
UPDATE Messages
  SET Content = $2,
      Edited_At = NOW()
  WHERE Message_ID = $1
RETURNING Content, Edited_At
`

type UpdateMessageContentParams struct {
	MessageID uint64 `json:"message_id"`
	Content   string `json:"content"`
}

type UpdateMessageContentRow struct {
	Content  string       `json:"content"`
	EditedAt sql.NullTime `json:"edited_at"`
}

func (q *Queries) UpdateMessageContent(ctx context.Context, arg UpdateMessageContentParams) (UpdateMessageContentRow, error) {
	row := q.queryRow(ctx, q.updateMessageContentStmt, updateMessageContent, arg.MessageID, arg.Content)
	var i UpdateMessageContentRow
	err := row.Scan(&i.Content, &i.EditedAt)
	return i, err
}

const updateMessageEmbeds = `-- name: UpdateMessageEmbeds :one
UPDATE Messages
  SET Embeds = $2,
      Edited_At = NOW()
  WHERE Message_ID = $1
RETURNING Embeds, Edited_At
`

type UpdateMessageEmbedsParams struct {
	MessageID uint64            `json:"message_id"`
	Embeds    []json.RawMessage `json:"embeds"`
}

type UpdateMessageEmbedsRow struct {
	Embeds   []json.RawMessage `json:"embeds"`
	EditedAt sql.NullTime      `json:"edited_at"`
}

func (q *Queries) UpdateMessageEmbeds(ctx context.Context, arg UpdateMessageEmbedsParams) (UpdateMessageEmbedsRow, error) {
	row := q.queryRow(ctx, q.updateMessageEmbedsStmt, updateMessageEmbeds, arg.MessageID, pq.Array(arg.Embeds))
	var i UpdateMessageEmbedsRow
	err := row.Scan(pq.Array(&i.Embeds), &i.EditedAt)
	return i, err
}
