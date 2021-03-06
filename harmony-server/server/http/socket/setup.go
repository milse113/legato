package socket

import (
	"harmony-server/server/http/socket/client"
	"harmony-server/server/http/socket/events"
	"time"
)

// Setup sets up a Handler
func (h Handler) Setup() {
	e := events.Events{
		DB:     h.DB,
		State:  h.State,
		Logger: h.Logger,
	}
	h.Bus.Bind(client.NewEvent(e.Subscribe, "subscribe", 3*time.Second, 10))
	h.Bus.Bind(client.NewEvent(e.SubscribeToGuild, "subscribe_to_guild", 3*time.Second, 10))
	h.Bus.Bind(client.NewEvent(e.SubscribeToUserUpdates, "subscribe_to_user_updates", 3*time.Second, 3))
}
