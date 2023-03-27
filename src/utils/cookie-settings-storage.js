/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

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
