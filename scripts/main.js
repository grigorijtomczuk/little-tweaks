import { CHAT_MEDIA_TWEAK_CLASS, MODULE_ID } from "./constants.js";

export function chatMediaTweak() {
	function onRenderChatMessage(message, html, messageData) {
		const $images = html.find(".chat-media-image > img");
		const $newImages = $images.clone(false);

		$images.replaceWith($newImages);

		$newImages.click(function (event) {
			event.preventDefault();
			const imagePopout = new ImagePopout({
				src: $(this).attr("src"),
				window: {
					title: game.i18n.localize(
						`${MODULE_ID}.image-popout-title`,
					),
				},
			});
			imagePopout.options.classes.push(CHAT_MEDIA_TWEAK_CLASS);
			imagePopout.render(true);
		});
	}

	function removeOptionsFromImagePopoutHeader() {
		function removeOptionsFromImagePopoutHeaderWrapper(wrapped, ...args) {
			const headerOptions = wrapped.apply(this, args);
			if (this.options.classes.includes(CHAT_MEDIA_TWEAK_CLASS))
				return [];
			return headerOptions;
		}

		libWrapper.register(
			MODULE_ID,
			"ImagePopout.prototype._getHeaderControls",
			removeOptionsFromImagePopoutHeaderWrapper,
			"WRAPPER",
		);
	}

	Hooks.on("renderChatMessage", onRenderChatMessage);
	Hooks.once("ready", removeOptionsFromImagePopoutHeader);
}

export async function quickModuleEnableTranslation() {
	const response = await fetch(`modules/${MODULE_ID}/lang/tweak.ru.json`);
	const translations = await response.json();

	game.i18n.translations = foundry.utils.mergeObject(
		game.i18n.translations,
		translations,
		{ inplace: true },
	);
}
