const Gio = imports.gi.Gio;

const Config = imports.misc.config;
const Extension = imports.misc.extensionUtils.getCurrentExtension();
const Gettext = imports.gettext;
// End of imports.

function getSettings() {
	let dir = Extension.dir.get_child('schemas').get_path();
	let source = Gio.SettingsSchemaSource.new_from_directory(dir,
			Gio.SettingsSchemaSource.get_default(),
			false);

	if(!source) {
		throw new Error('Error Initializing the thingy.');
	}

	let schema = source.lookup('org.gnome.shell.extensions.toggle_terminal', false);

	if(!schema) {
		throw new Error('Schema missing.');
	}
	
	return new Gio.Settings({
		settings_schema: schema
	});
}

// function initTranslations(domain){

//     domain = domain || extension.metadata['gettext-domain'];

//     // check if this extension was built with "make zip-file", and thus
//     // has the locale files in a subfolder
//     // otherwise assume that extension has been installed in the
//     // same prefix as gnome-shell
// 	Gettext.textdomain(domain);

//     let localeDir = Extension.dir.get_child('locale');
//     if (localeDir.query_exists(null)){
//         Gettext.bindtextdomain(domain, localeDir.get_path());
// 	} else {
//         Gettext.bindtextdomain(domain, Config.LOCALEDIR);
// 	}
// }
