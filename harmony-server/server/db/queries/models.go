// Code generated by sqlc. DO NOT EDIT.

package queries

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"
)

type Userstatus string

const (
	UserstatusStreaming Userstatus = "streaming"
	UserstatusOnline    Userstatus = "online"
	UserstatusMobile    Userstatus = "mobile"
	UserstatusIdle      Userstatus = "idle"
	UserstatusOffline   Userstatus = "offline"
)

func (e *Userstatus) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = Userstatus(s)
	case string:
		*e = Userstatus(s)
	default:
		return fmt.Errorf("unsupported scan type for Userstatus: %T", src)
	}
	return nil
}

type Attachment struct {
	MessageID  uint64 `json:"message_id"`
	Attachment string `json:"attachment"`
}

type Channel struct {
	ChannelID   uint64        `json:"channel_id"`
	GuildID     sql.NullInt64 `json:"guild_id"`
	ChannelName string        `json:"channel_name"`
}

type File struct {
	Hash   []byte `json:"hash"`
	FileID string `json:"file_id"`
}

type ForeignUser struct {
	UserID      uint64 `json:"user_id"`
	HomeServer  string `json:"home_server"`
	LocalUserID uint64 `json:"local_user_id"`
}

type Guild struct {
	GuildID    uint64 `json:"guild_id"`
	OwnerID    uint64 `json:"owner_id"`
	GuildName  string `json:"guild_name"`
	PictureUrl string `json:"picture_url"`
}

type GuildMember struct {
	UserID  uint64 `json:"user_id"`
	GuildID uint64 `json:"guild_id"`
}

type Invite struct {
	InviteID     string        `json:"invite_id"`
	Uses         int32         `json:"uses"`
	PossibleUses sql.NullInt32 `json:"possible_uses"`
	GuildID      uint64        `json:"guild_id"`
}

type LocalUser struct {
	UserID    uint64            `json:"user_id"`
	Email     string            `json:"email"`
	Password  []byte            `json:"password"`
	Instances []json.RawMessage `json:"instances"`
}

type Message struct {
	MessageID uint64            `json:"message_id"`
	GuildID   uint64            `json:"guild_id"`
	ChannelID uint64            `json:"channel_id"`
	UserID    uint64            `json:"user_id"`
	CreatedAt time.Time         `json:"created_at"`
	EditedAt  sql.NullTime      `json:"edited_at"`
	Content   string            `json:"content"`
	Embeds    []json.RawMessage `json:"embeds"`
	Actions   []json.RawMessage `json:"actions"`
}

type Profile struct {
	UserID   uint64         `json:"user_id"`
	Username string         `json:"username"`
	Avatar   sql.NullString `json:"avatar"`
	Status   Userstatus     `json:"status"`
}

type Session struct {
	Session    string `json:"session"`
	UserID     uint64 `json:"user_id"`
	Expiration int64  `json:"expiration"`
}

type User struct {
	UserID uint64 `json:"user_id"`
}
