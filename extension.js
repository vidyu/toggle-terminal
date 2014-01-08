const Shell   = imports.gi.Shell;

const Meta = imports.gi.Meta;
const Main = imports.ui.main;
// const Wnck = imports.gi.Wnck;
const Gio  = imports.gi.Gio;
const Utils = imports.misc.extensionUtils.getCurrentExtension().imports.utils;
// const Tweener = imports.ui.tweener; // Use it for effects

const key_bindings = {
    'toggle-terminal': function() {
        _toggleTerminal();
    }
};

const mySettings = Utils.getSettings();
const TERMINAL_SCHEMA = 'org.gnome.desktop.default-applications.terminal';

function _toggleTerminal() {
	let win = _getWindowActor();

	if (win === 'start') {
		_startTerminal();
		return;
	}
	if (win.minimized){
		win.change_workspace(global.screen.get_active_workspace());
		win.unminimize();
		win.activate(global.get_current_time());
	} else {
		if (win.has_focus()){
			win.minimize();
		} else {
			win.change_workspace(global.screen.get_active_workspace());
			win.activate(global.get_current_time());
		}
	}
}

function _startTerminal(){
	let termSettings = new Gio.Settings({ 'schema': TERMINAL_SCHEMA });
	try {
		imports.misc.util.trySpawnCommandLine(termSettings.get_string('exec'));
	} catch(e) {
		logError(e, 'Error launching terminal');
	}
}

function _getWindowActor(){
	let window = Shell.AppSystem.get_default().lookup_app('gnome-terminal.desktop').get_windows()[0];

	if(typeof window == 'undefined') { window = 'start';}
	return window;
}

function init() {
	// Utils.initTranslations("toggle_terminal@lawlessbg");
}

function enable() {
	for(key in key_bindings) {
		if (Main.wm.addKeybinding && Shell.KeyBindingMode) { // introduced in 3.7.5
            Main.wm.addKeybinding(
				key,
				mySettings,
				Meta.KeyBindingFlags.NONE,
                Shell.KeyBindingMode.NORMAL | Shell.KeyBindingMode.MESSAGE_TRAY,
                key_bindings[key]
			);
		} else if (Main.wm.addKeybinding && Main.KeybindingMode) { // introduced in 3.7.2
            Main.wm.addKeybinding(
				key,
				mySettings,
				Meta.KeyBindingFlags.NONE,
                Main.KeybindingMode.NORMAL | Main.KeybindingMode.MESSAGE_TRAY,
                key_bindings[key]
			);
		} else {
            global.display.add_keybinding(
				key,
				mySettings,
				Meta.KeyBindingFlags.NONE,
                key_bindings[key]
			);
		}
	}
	// Wnck.Screen.get_default().force_update();
}

function disable() {
	for(key in key_bindings) {
		global.display.remove_keybinding(key);
	}
}
