/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import Storage from "./storage";

class AuthStorage extends Storage {
	get loggedIn() {
		return !!this.value && !!this.value.token;
	}

	get token() {
		return this.value && this.value.token;
	}

	get userId() {
		return this.value && this.value.userId;
	}

	get role() {
		return this.value && this.value.role;
	}
}

export default new AuthStorage("AUTH");
