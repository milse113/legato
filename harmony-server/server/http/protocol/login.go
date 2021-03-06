package protocol

import (
	v1 "harmony-server/server/http/core/v1"
	"harmony-server/util"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
	"github.com/thanhpk/randstr"
	"golang.org/x/crypto/bcrypt"

	"harmony-server/server/auth"
	"harmony-server/server/http/hm"
	"harmony-server/server/http/responses"
)

type LoginData struct {
	AuthToken string `validate:"required_without=Email"`
	Domain    string `validate:"required_without=Email"`
	Email     string `validate:"required_without=AuthToken"`
	Password  string `validate:"required_without=AuthToken"`
}

func (h API) Login(c echo.Context) error {
	ctx := c.(hm.HarmonyContext)
	data := ctx.Data.(LoginData)
	if data.AuthToken != "" {
		pem, err := h.Deps.AuthManager.GetPublicKey(data.Domain)
		if err != nil {
			h.Deps.Logger.Exception(err)
			return echo.NewHTTPError(http.StatusInternalServerError, responses.UnknownError)
		}
		pubKey, err := jwt.ParseRSAPublicKeyFromPEM(pem)
		if err != nil {
			h.Deps.Logger.Exception(err)
			return echo.NewHTTPError(http.StatusInternalServerError, responses.UnknownError)
		}
		t, err := jwt.ParseWithClaims(data.AuthToken, &auth.Token{}, func(_ *jwt.Token) (interface{}, error) {
			return pubKey, nil
		})
		if err != nil {
			h.Deps.Logger.Exception(err)
			return echo.NewHTTPError(http.StatusInternalServerError, responses.UnknownError)
		}
		token := t.Claims.(*auth.Token)
		session := randstr.Hex(16)
		localUserID, err := h.Deps.DB.GetLocalUserForForeignUser(token.UserID, data.Domain)
		if err != nil {
			h.Deps.Logger.Exception(err)
			return echo.NewHTTPError(http.StatusInternalServerError, responses.UnknownError)
		}
		if localUserID == 0 {
			id, err := h.Deps.Sonyflake.NextID()
			if err != nil {
				h.Deps.Logger.Exception(err)
				return echo.NewHTTPError(http.StatusInternalServerError, responses.UnknownError)
			}
			localUserID, err = h.Deps.DB.AddForeignUser(data.Domain, token.UserID, id, token.Username, token.Avatar)
			if err != nil {
				h.Deps.Logger.Exception(err)
				return echo.NewHTTPError(http.StatusInternalServerError, responses.UnknownError)
			}
		}
		if err := h.Deps.DB.AddSession(localUserID, session); err != nil {
			h.Deps.Logger.Exception(err)
			return echo.NewHTTPError(http.StatusInternalServerError, responses.UnknownError)
		}
		return ctx.JSON(http.StatusOK, v1.LoginResponse{UserID: util.U64TS(localUserID), Session: session})
	} else {
		user, err := h.Deps.DB.GetUserByEmail(data.Email)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, responses.InvalidEmail)
		}
		if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data.Password)); err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, responses.InvalidPassword)
		}
		session := randstr.Hex(16)
		if err := h.Deps.DB.AddSession(user.UserID, session); err != nil {
			h.Deps.Logger.Exception(err)
			return echo.NewHTTPError(http.StatusInternalServerError, responses.UnknownError)
		}
		return ctx.JSON(http.StatusOK, v1.LoginResponse{UserID: util.U64TS(user.UserID), Session: session})
	}
}
