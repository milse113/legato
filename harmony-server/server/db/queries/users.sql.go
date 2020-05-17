// Code generated by sqlc. DO NOT EDIT.
// source: users.sql

package queries

import (
	"context"
)

const getUser = `-- name: GetUser :one
SELECT User_ID, Email, Username, Avatar, Password
FROM Users
WHERE Email = $1
`

func (q *Queries) GetUser(ctx context.Context, email string) (User, error) {
	row := q.queryRow(ctx, q.getUserStmt, getUser, email)
	var i User
	err := row.Scan(
		&i.UserID,
		&i.Email,
		&i.Username,
		&i.Avatar,
		&i.Password,
	)
	return i, err
}