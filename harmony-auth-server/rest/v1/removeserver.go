package v1

import (
	"github.com/labstack/echo/v4"
	"harmony-auth-server/authentication"
	"harmony-auth-server/db"
	"harmony-auth-server/rest/hm"
	"net/http"
)

// RemoveServer removes a server from a user's list
func RemoveServer(c echo.Context) error {
	ctx := c.(hm.HarmonyContext)
	session, host := ctx.FormValue("session"), ctx.FormValue("host")
	if session == "" || host == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "session and host required")
	}
	user, err := authentication.GetUserBySession(session)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "invalid session")
	}
	if err := db.RemoveServerTransaction(user.ID, host); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "error removing server from list")
	}
	return ctx.JSON(http.StatusOK, map[string]string{
		"message": "successfully added server to list!",
	})
}