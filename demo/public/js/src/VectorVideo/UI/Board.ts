/// <reference path="BasicElements" />
/// <reference path="Cursor" />
/// <reference path="Color" />
/// <reference path="../Helpers/VideoEvents" />
/// <reference path="../Helpers/State" />
/// <reference path="../Helpers/HTML" />

module UI {
	
	import HTML = Helpers.HTML;
	import VideoEvents = Helpers.VideoEvents;
	import VideoEventType = Helpers.VideoEventType;
	
	/**
	 * The board itself.
	 */
	export class Board extends Panel {				
			
		/** Custom cursor that replaces the system arrow. */
		private cursor: Cursor;
				
		/** Get the width of the board in pixels */
		public get Width(): number {
			return this.GetHTML().clientWidth;
		}
		
		/** Get the height of the board in pixels */
		public get Height(): number {
			return this.GetHTML().clientHeight;
		}
		
		/** Set the height of the board in pixels */
		public set Height(height: number) {
			this.GetHTML().clientHeight = height;
		}
				
		/** Get the color of the board */
		public set IsRecording(isRecording: boolean) {
			isRecording ? this.GetHTML().classList.add("recording") : this.GetHTML().classList.remove("recording");
		}
						
		/**
		 * Create a new board
		 * @param	id	HTML element id attribute value
		 */
		constructor(id: string) {
			super("div", id); // Panel
			HTML.SetAttributes(this.GetHTML(), { class: "vector-video-board" });
			
			// create a cursor 
			this.cursor = new Cursor();
			this.AddChild(<IElement> this.cursor);
			
			// make board's position relative for the cursor			
			HTML.SetAttributes(this.GetHTML(), { position: "relative" });
			
			// move the cursor
			VideoEvents.on(VideoEventType.CursorState, 			(state: Helpers.CursorState) 	=> this.UpdateCursorPosition(state));
			VideoEvents.on(VideoEventType.CursorState, 			(state: Helpers.CursorState) 	=> this.UpdateCursorPosition(state));			
			VideoEvents.on(VideoEventType.ChangeBrushSize, 		(state: BrushSize)				=> this.UpdateCursorSize(state));
			VideoEvents.on(VideoEventType.ChangeColor, 			(state: Color)					=> this.UpdateCursorColor(state));
			VideoEvents.on(VideoEventType.ChangeColor, 			(state: Color)					=> this.UpdateCursorColor(state));
			VideoEvents.on(VideoEventType.CanvasScalingFactor, 	(scalingFactor: number)			=> this.UpdateCursorScale(scalingFactor));
		}
				
		/**
		 * Position the element
		 */
		private UpdateCursorPosition(state: Helpers.CursorState): void {			
			this.cursor.MoveTo(state.X, state.Y); // @todo: correct the position
		}
		
		/**
		 * Position the element
		 */
		private UpdateCursorSize(size: BrushSize): void {			
			this.cursor.ChangeSize(size);
		}
		
		/**
		 * 
		 */
		private UpdateCursorColor(color: Color): void {			
			this.cursor.ChangeColor(color);
		}		
		
		/**
		 * Position the element
		 */
		private UpdateCursorScale(scalingFactor: number): void {			
			this.cursor.SetScalingFactor(scalingFactor);
		}
	}
	
}