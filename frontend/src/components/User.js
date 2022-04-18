import React from 'react';
import lscache from 'lscache';

const initialToken = lscache.get('token');
const initialUser = lscache.get('name');
const initialMajor = lscache.get('major');

export const initialContext = {
	token: initialToken,
	name: initialUser,
	major: initialMajor,
	loggedIn: !!initialToken,
	updateUser(token, name, major) {},
};

const UserContext = React.createContext(initialContext);

export default UserContext;

export function UserProvider({ children }) {
	const [context, setContext] = React.useState(initialContext);

	const providedContext = {
		...context,
		updateUser(token, name, major) {
			setContext({
				...context,
				token,
				name,
				major,
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
