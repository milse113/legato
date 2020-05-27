import { ITheme } from './theming';

export interface IGuild {
	guildid: string;
	picture: string;
	guildname: string;
	owner: boolean;
}

export interface IChannels {
	[key: string]: string;
}

export interface IMessage {
	userid: string;
	createdat: number;
	guild: string;
	channel: string;
	message: string;
	attachment?: string;
	messageid: string;
}

export interface IState {
	theme: ITheme;
	themeDialog: boolean;
	connected: boolean;
	guildList: {
		[key: string]: IGuild;
	};
	guildMembers: {
		[guildid: string]: string[];
	};
	currentGuild: string | undefined;
	currentChannel: string | undefined;
	messages: IMessage[];
	channels: {
		[channelid: string]: string;
	};
	guildDialog: boolean;
	guildSettingsDialog: boolean;
	invites: {
		[key: string]: number;
	};
	users: {
		[key: string]: {
			username: string;
			avatar: string;
		};
	};
	self: {
		userid?: string;
		username?: string;
		avatar?: string;
	};
	userSettingsDialog: boolean;
	chatInputFocus: boolean;
}

export interface IInstanceList {
	[key: string]: {
		name: string;
		host: string;
	};
}

export interface IAuthState {
	instanceList: IInstanceList;
}
