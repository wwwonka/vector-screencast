/// <reference path="../UI/Color" />
/// <reference path="../UI/BrushSize" />

module Settings {
	
	/**
	 * The interface defining current brush settings for rendering.
	 */	
	export interface BrushSettings {
		Size: UI.BrushSize;
		Color: UI.Color;
	}
	
}