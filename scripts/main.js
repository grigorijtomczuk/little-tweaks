import { CHAT_MEDIA_TWEAK_CLASS, MODULE_ID } from "./constants.js";

export function chatMediaTweak() {
	function onRenderChatMessage(message, html, messageData) {
		html.find(".chat-media-image > img").each(function () {
			const $original = $(this);
			const $clone = $original.clone(false);
			$original.replaceWith($clone);

			$clone.on("click", function (e) {
				e.preventDefault();
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
	Hooks.once("ready", () => {
		removeOptionsFromImagePopoutHeader();
	});
}

export async function applyTranslations() {
	const response = await fetch(`modules/${MODULE_ID}/lang/tweak.ru.json`);
	const translations = await response.json();

	game.i18n.translations = foundry.utils.mergeObject(
		game.i18n.translations,
		translations,
		{ inplace: true },
	);
}
