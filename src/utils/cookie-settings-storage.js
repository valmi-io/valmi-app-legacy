import Storage from "./storage";

class CookieSettingsStorage extends Storage {
	get accepted() {
		return !!this.value && !!this.value.accepted;
	}

	set accepted(val) {
		this.value = { ...this.value, accepted: val };
	}
}

export default new CookieSettingsStorage("COOKIE_SETTINGS", {
	accepted: false,
});
