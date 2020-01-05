import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import h from 'history';
import { toast } from 'react-toastify';

import HarmonySocket from '../socket/socket';
import { AppDispatch } from '../redux/store';
import {
	SetMessages,
	SetCurrentChannel,
	SetChannels,
	SetCurrentGuild,
	SetGuilds,
	AddMessage,
	ToggleGuildDialog,
	SetGuildPicture,
	SetInvites,
	SetGuildName,
	SetUser,
	SetConnected,
} from '../redux/AppReducer';
import { IGuild, IMessage, IState } from '../types/redux';

export function useSocketHandler(socket: HarmonySocket, history: h.History<any>): void {
	const dispatch = useDispatch<AppDispatch>();
	const { currentGuild, currentChannel, channels, invites } = useSelector((state: IState) => state);
	const firstDisconnect = useRef(true);

	const getGuildsCallback = useCallback(
		(raw: any) => {
			if (typeof raw['guilds'] === 'object') {
				const guildsList = raw['guilds'] as {
					[key: string]: IGuild;
				};
				if (Object.keys(guildsList).length === 0) {
					dispatch(SetMessages([]));
					dispatch(SetCurrentChannel(undefined));
					dispatch(SetCurrentGuild(undefined));
					dispatch(SetChannels({}));
				}
				dispatch(SetGuilds(guildsList));
			}
		},
		[dispatch]
	);

	const getMessagesCallback = useCallback(
		(raw: any) => {
			if (Array.isArray(raw['messages'])) {
				dispatch(SetMessages((raw['messages'] as IMessage[]).reverse()));
			} else if (raw['messages'] === null) {
				dispatch(SetMessages([]));
			}
		},
		[dispatch]
	);

	const getChannelsCallback = useCallback(
		(raw: any) => {
			if (typeof raw === 'object') {
				dispatch(SetChannels(raw['channels']));
			}
		},
		[dispatch]
	);

	const messageCallback = useCallback(
		(raw: any) => {
			if (
				typeof raw['userid'] === 'string' &&
				typeof raw['createdat'] === 'number' &&
				typeof raw['guild'] === 'string' &&
				typeof raw['message'] === 'string'
			) {
				dispatch(AddMessage(raw as IMessage));
			}
		},
		[dispatch]
	);

	const leaveGuildCallback = useCallback(() => {
		socket.getGuilds();
	}, [socket]);

	const joinGuildCallback = useCallback(() => {
		socket.getGuilds();
		dispatch(ToggleGuildDialog());
	}, [dispatch, socket]);

	const createGuildCallback = useCallback(() => {
		socket.getGuilds();
		dispatch(ToggleGuildDialog());
	}, [dispatch, socket]);

	const updateGuildPictureCallback = useCallback(
		(raw: any) => {
			if (typeof raw['picture'] === 'string' && typeof raw['guild'] === 'string') {
				toast.success('Successfully set guild picture');
				dispatch(SetGuildPicture({ guild: raw['guild'], picture: raw['picture'] }));
			}
		},
		[dispatch]
	);

	const updateGuildNameCallback = useCallback(
		(raw: any) => {
			if (typeof raw['name'] === 'string' && typeof raw['guild'] === 'string') {
				toast.success('Successfully set guild name');
				dispatch(SetGuildName({ guild: raw['guild'], name: raw['name'] }));
			}
		},
		[dispatch]
	);

	const getInvitesCallback = useCallback(
		(raw: any) => {
			if (typeof raw['invites'] === 'object') {
				dispatch(SetInvites(raw['invites']));
				dispatch(SetInvites(raw['invites']));
			}
		},
		[dispatch]
	);

	const addChannelCallback = useCallback(
		(raw: any) => {
			if (
				typeof raw['channelname'] === 'string' &&
				typeof raw['channelid'] === 'string' &&
				raw['guild'] === currentGuild
			) {
				dispatch(
					SetChannels({
						...channels,
						[raw['channelid']]: raw['channelname'],
					})
				);
			}
		},
		[dispatch, channels, currentGuild]
	);

	const deleteChannelCallback = useCallback(
		(raw: any) => {
			if (typeof raw['guild'] === 'string' && typeof raw['channelid'] === 'string') {
				const deletedChannels = {
					...channels,
				};
				delete deletedChannels[raw['channelid']];
				dispatch(SetChannels(deletedChannels));
			}
		},
		[dispatch, channels]
	);

	const createInviteCallback = useCallback(
		(raw: any) => {
			if (typeof raw['invite'] === 'string') {
				dispatch(
					SetInvites({
						...invites,
						[raw['invite']]: 0,
					})
				);
			}
		},
		[dispatch, invites]
	);

	const deleteInviteCallback = useCallback(
		(raw: any) => {
			if (typeof raw['invite'] === 'string') {
				const deletedInvites = {
					...invites,
				};
				delete deletedInvites[raw['invite']];
				dispatch(
					SetInvites({
						...deletedInvites,
					})
				);
			}
		},
		[dispatch, invites]
	);

	const getUserCallback = useCallback(
		(raw: any) => {
			if (
				typeof raw['userid'] === 'string' &&
				typeof raw['username'] === 'string' &&
				typeof raw['avatar'] === 'string'
			) {
				dispatch(
					SetUser({
						userid: raw['userid'],
						username: raw['username'],
						avatar: raw['avatar'],
					})
				);
			}
		},
		[dispatch]
	);

	const deauthCallback = useCallback(() => {
		toast.warn('Your session expired, please login again');
		history.push('/');
	}, [history]);

	const errorCallback = useCallback((raw: any) => {
		if (typeof raw === 'object' && typeof raw['message'] === 'string') {
			toast.error(raw['message']);
		}
	}, []);

	const closeCallback = useCallback(() => {
		if (firstDisconnect.current) {
			firstDisconnect.current = false;
			dispatch(SetConnected(false));
			toast.error('You have lost connection to the server');
		}
	}, [dispatch]);

	const openCallback = useCallback(() => {
		if (!firstDisconnect.current) {
			toast.success('You have reconnected to the server');
		}
		socket.getGuilds();
		dispatch(SetConnected(true));
		firstDisconnect.current = true;
	}, [dispatch, socket]);

	useEffect(() => {
		if (socket.conn.readyState === WebSocket.OPEN) {
			socket.getGuilds();
		}
	}, [socket]);

	useEffect(() => {
		socket.events.addListener('getguilds', getGuildsCallback);
		socket.events.addListener('getmessages', getMessagesCallback);
		socket.events.addListener('getchannels', getChannelsCallback);
		socket.events.addListener('message', messageCallback);
		socket.events.addListener('leaveguild', leaveGuildCallback);
		socket.events.addListener('joinguild', joinGuildCallback);
		socket.events.addListener('createguild', createGuildCallback);
		socket.events.addListener('updateguildpicture', updateGuildPictureCallback);
		socket.events.addListener('updateguildname', updateGuildNameCallback);
		socket.events.addListener('getinvites', getInvitesCallback);
		socket.events.addListener('addchannel', addChannelCallback);
		socket.events.addListener('deletechannel', deleteChannelCallback);
		socket.events.addListener('createinvite', createInviteCallback);
		socket.events.addListener('deleteinvite', deleteInviteCallback);
		socket.events.addListener('getuser', getUserCallback);
		socket.events.addListener('deauth', deauthCallback);
		socket.events.addListener('error', errorCallback);
		socket.events.addListener('close', closeCallback);
		socket.events.addListener('open', openCallback);
		return (): void => {
			socket.events.removeAllListeners('getguilds');
			socket.events.removeAllListeners('getmessages');
			socket.events.removeAllListeners('getchannels');
			socket.events.removeAllListeners('message');
			socket.events.removeAllListeners('leaveguild');
			socket.events.removeAllListeners('joinguild');
			socket.events.removeAllListeners('createguild');
			socket.events.removeAllListeners('updateguildpicture');
			socket.events.removeAllListeners('updateguildname');
			socket.events.removeAllListeners('getinvites');
			socket.events.removeAllListeners('addchannel');
			socket.events.removeAllListeners('deletechannel');
			socket.events.removeAllListeners('createinvite');
			socket.events.removeAllListeners('deleteinvite');
			socket.events.removeAllListeners('getuser');
			socket.events.removeAllListeners('deauth');
			socket.events.removeAllListeners('error');
			socket.events.removeAllListeners('open');
			socket.events.removeAllListeners('close');
		};
	}, [
		getGuildsCallback,
		getMessagesCallback,
		getChannelsCallback,
		messageCallback,
		leaveGuildCallback,
		joinGuildCallback,
		createGuildCallback,
		updateGuildPictureCallback,
		updateGuildNameCallback,
		getInvitesCallback,
		addChannelCallback,
		deleteChannelCallback,
		createInviteCallback,
		deleteInviteCallback,
		getUserCallback,
		deauthCallback,
		errorCallback,
		closeCallback,
		openCallback,
		socket.events,
	]);

	useEffect(() => {
		if (currentGuild) {
			if (socket.conn.readyState === WebSocket.OPEN) {
				socket.getChannels(currentGuild);
			} else {
				socket.events.addListener('open', () => {
					socket.getChannels(currentGuild);
				});
			}
		}
	}, [currentGuild, socket]);

	useEffect(() => {
		if (currentGuild && currentChannel) {
			if (socket.conn.readyState === WebSocket.OPEN) {
				socket.getMessages(currentGuild, currentChannel);
			} else {
				socket.events.addListener('open', () => {
					socket.getMessages(currentGuild, currentChannel);
				});
			}
		}
	}, [currentChannel, currentGuild, socket]);
}
