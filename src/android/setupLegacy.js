var path = require('path');
var semver = require('semver');

function setupLegacy(context) {
	var version = require(path.join(context.opts.projectRoot, 'platforms/android/cordova/Api')).version();

	if (semver.gte(version, '11.0.0')) {
		var common = require('cordova-common');
		var config = new common.ConfigParser(path.join(context.opts.projectRoot, 'platforms/android/app/src/main/res/xml/config.xml'));

		var autoHide = config.getGlobalPreference('AutoHideSplashScreen');
		if (autoHide) {
			config.setGlobalPreference('AutoHideSplashScreenLegacy', autoHide);
		}

		var delay = config.getGlobalPreference('SplashScreenDelay');
		if (delay) {
			config.setGlobalPreference('SplashScreenDelayLegacy', delay);
		}

		var fade = config.getGlobalPreference('FadeSplashScreen');
		if (fade) {
			config.setGlobalPreference('FadeSplashScreenLegacy', fade);
		}

		var fadeDuration = config.getGlobalPreference('FadeSplashScreenDuration');
		if (fadeDuration) {
			config.setGlobalPreference('FadeSplashScreenDurationLegacy', fadeDuration);
		}

		config.setGlobalPreference('AutoHideSplashScreen', 'true');
		config.setGlobalPreference('SplashScreenDelay', '0');
		config.setGlobalPreference('FadeSplashScreen', 'false');
		config.setGlobalPreference('FadeSplashScreenDuration', '0');

		var splash = config.getSplashScreens();
		if (splash.length === 1 && splash[0].density === undefined) {
			common.FileUpdater.updatePath(
				splash[0].src,
				'platforms/android/app/src/main/res/drawable-mdpi/screen' + path.extname(splash[0].src),
				{ rootDir: context.opts.projectRoot });
		} else if (splash.length > 0) {
			console.warn('Per-density splash screens not supported.');
		}

		config.write();
	}
}

module.exports = setupLegacy;
