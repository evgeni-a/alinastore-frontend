import { jwtDecode } from 'jwt-decode';

export interface User {
	id: string;
	email: string;
	name: string;
	roles: string[];
}

export interface JWTPayload {
	sub: string;
	email: string;
	name: string;
	roles: string[];
	iat?: number;
	exp?: number;
}

export function decodeJWT(token: string): User {
	try {
		const decoded = jwtDecode<JWTPayload>(token);
		return {
			id: decoded.sub,
			email: decoded.email,
			name: decoded.name || '',
			roles: decoded.roles || []
		};
	} catch (error) {
		throw new Error('Failed to decode JWT token');
	}
}

