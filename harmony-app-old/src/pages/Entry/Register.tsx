import React, { useState } from 'react';
import { TextField, Typography, Button, makeStyles, Theme } from '@material-ui/core';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

import { AuthAPI } from '../../api/Auth';
import { useDialog } from '../../component/Dialog/CommonDialogContext';
import { ReqHelper } from '../../api/ReqHelper';

const registerStyles = makeStyles((theme: Theme) => ({
	root: {
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(1),
	},
	submitBtn: {
		marginTop: theme.spacing(2),
	},
}));

export const Register = () => {
	const classes = registerStyles();
	const history = useHistory();
	const dialog = useDialog();
	const { t } = useTranslation(['entry', 'common']);
	const [err, setErr] = useState<string>(' ');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const onSubmit = async (e: React.FormEvent<EventTarget>) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setErr(t('entry:passwords-no-match'));
			return;
		}
		setErr('');
		try {
			const resp = await AuthAPI.register(email, username, password);
			localStorage.setItem('authsession', resp.session);
			ReqHelper.refreshAuthSession();
			history.push('/app');
		} catch (err) {
			dialog({
				type: 'alert',
				title: t('common:error'),
				description: err.message,
			});
			console.error('error registering', err);
		}
	};

	return (
		<div className={classes.root}>
			<form onSubmit={onSubmit}>
				<TextField
					label="Email"
					type="email"
					name="email"
					autoComplete="email"
					margin="normal"
					fullWidth
					required
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.currentTarget.value)}
				/>
				<TextField
					label="Username"
					type="text"
					name="username"
					autoComplete="username"
					margin="normal"
					fullWidth
					required
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.currentTarget.value)}
				/>
				<TextField
					label="Password"
					type="password"
					name="password"
					autoComplete="new-password"
					margin="normal"
					fullWidth
					required
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
				/>
				<TextField
					label="Confirm Password"
					type="password"
					name="confirmpassword"
					autoComplete="none"
					margin="normal"
					fullWidth
					required
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.currentTarget.value)}
				/>
				<Typography variant="subtitle1" color={'error'}>
					{err}
				</Typography>
				<Button
					variant="contained"
					color="secondary"
					className={classes.submitBtn}
					disabled={!email || !username || !password || !confirmPassword}
					type="submit"
					fullWidth
				>
					{t('entry:register')}
				</Button>
			</form>
		</div>
	);
};
