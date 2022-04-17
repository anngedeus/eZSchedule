import React from 'react';
import lscache from 'lscache';

const initialToken = lscache.get('token');
const initialUser = lscache.get('name');

export const initialContext = {
	token: initialToken,
	name: initialUser,
	loggedIn: !!initialToken,
	updateUser(token, name) {},
};

const UserContext = React.createContext(initialContext);

export default UserContext;

export function UserProvider({ children }) {
	const [context, setContext] = React.useState(initialContext);

	const providedContext = {
		...context,
		updateUser(token, name) {
			setContext({
				...context,
				token,
				name,
				loggedIn: !!token,
			});
		},
	};

	return (
		<UserContext.Provider value={providedContext}>
			{children}
		</UserContext.Provider>
	);
};

export function useUser() {
	return React.useContext(UserContext);
};
