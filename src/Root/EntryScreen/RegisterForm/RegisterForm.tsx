import React, { useEffect } from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import { useStyles } from './styles';
import { socketServer } from '../../Root';
import { Events } from '../../../socket/socket';
import { updateUser } from '../../../store/actions/AppActions';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { ILoginDetails } from '../../types';
import { toast } from 'react-toastify';

const RegisterForm: React.FC<{}> = () => {
    const classes = useStyles();
    const [email, setEmail] = React.useState<string | undefined>(undefined);
    const [username, setUsername] = React.useState<string | undefined>(undefined);
    const [password, setPassword] = React.useState<string | undefined>(undefined);
    const [confirmPassword, setConfirmPassword] = React.useState<string | undefined>(undefined);
    const [error, setError] = React.useState<string | undefined>(undefined);
    const dispatch = useDispatch();
    const history = useHistory();

    const register = (): void => {
        if (!socketServer.connection.connected) {
            toast.error('Unable to register. No connection to server.');
        }
        if (confirmPassword !== password) {
            setError('Passwords do not match!');
        } else {
            if (email && username && password) {
                socketServer.register(email, username, password);
            } else {
                setError(`Missing email, username, or password`);
            }
        }
    };

    const onFormSubmit = (e: React.FormEvent<EventTarget>): void => {
        e.preventDefault();
    };

    useEffect(() => {
        socketServer.connection.on(Events.REGISTER_ERROR, (error: string) => {
            setError(error);
        });
        socketServer.connection.on(Events.REGISTER, (response: ILoginDetails) => {
            history.push('/app');
            localStorage.setItem('token', response.token);
            dispatch(updateUser({ username: response.username, avatar: response.avatar }));
        });

        return (): void => {
            // cleanup event listeners
            socketServer.connection.removeListener(Events.REGISTER);
            socketServer.connection.removeListener(Events.REGISTER_ERROR);
        };
    }, [dispatch, history]);

    return (
        <div className={classes.root}>
            <form onSubmit={onFormSubmit}>
                <TextField label='Email' type='email' name='email' autoComplete='email' margin='normal' fullWidth onChange={(event): void => setEmail(event.target.value)} />
                <TextField label='Username' type='username' name='username' autoComplete='username' margin='normal' fullWidth onChange={(event): void => setUsername(event.target.value)} />
                <TextField label='Password' type='password' name='password' margin='normal' fullWidth onChange={(event): void => setPassword(event.target.value)} />
                <TextField label='Confirm Password' type='password' name='confirmpassword' margin='normal' fullWidth onChange={(event): void => setConfirmPassword(event.target.value)} />
                {error ? (
                    <Typography variant='subtitle1' color={'error'}>
                        {error}
                    </Typography>
                ) : (
                    undefined
                )}
                <Button variant='contained' color='primary' className={classes.submitButton} onClick={register} type='submit'>
                    Register
                </Button>
            </form>
        </div>
    );
};

export default RegisterForm;
