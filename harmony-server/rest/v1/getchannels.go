package v1

import (
	"github.com/labstack/echo/v4"
	"harmony-server/harmonydb"
	"harmony-server/rest/hm"
	"net/http"
)

//TODO add a Position element that determines the channel's position on the list
type returnChannel struct {
	Name string `json:"name"`
}

func GetChannels(c echo.Context) error {
	ctx, _ := c.(*hm.HarmonyContext)
	guildid := ctx.FormValue("guildid")
	if !ctx.Limiter.Allow() {
		return echo.NewHTTPError(http.StatusTooManyRequests, "you're getting channels too often! Please try again in a few seconds.")
	}
	res, err := harmonydb.DBInst.Query("SELECT channelid, channelname FROM channels WHERE guildid=$1", guildid)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "unable to list channels, please try again later")
	}
	var returnChannels = make(map[string]returnChannel)
	for res.Next() {
		var channelID string
		var channel returnChannel
		err = res.Scan(&channelID, &channel.Name)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "unable to get channel, please try again later")
		}
		returnChannels[channelID] = channel
	}
 	return ctx.JSON(http.StatusOK, returnChannels)
}