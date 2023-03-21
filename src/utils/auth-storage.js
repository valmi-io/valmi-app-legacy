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
