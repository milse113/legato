package server

import (
	"harmony-server/server/config"

	"github.com/getsentry/sentry-go"
)

// This file shouldn't exist, but sentry's package is garbage so I had to deviate from the standard package layout.
// Lord forgive me for my sins.

// ConnectSentry connects to sentry
func ConnectSentry(cfg *config.Config) error {
	if !cfg.Sentry.Enabled {
		return nil
	}

	err := sentry.Init(sentry.ClientOptions{
		Dsn:              cfg.Sentry.Dsn,
		AttachStacktrace: cfg.Sentry.AttachStacktrace,
	})

	if err != nil {
		return err
	}

	sentry.CaptureMessage("Harmony Server Started")

	return nil
}
