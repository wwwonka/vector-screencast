/// <references path="BasicElements" />
/// <references path="../Helpers/VideoEvents" />

module UI {
	
	import VideoEvents = Helpers.VideoEvents;
	import VideoEventType = Helpers.VideoEventType;
	
	export class TimeLine extends Panel {
		
		/** Length of the video in milliseconds */
		private length: number;		
		public set Length(length: number) { this.length = length; }
		
		/** Visual representation of the progress bar */
		private progresbar: IElement;
		/** Visual representation of the buffering bar */
		private bufferbar: IElement;
		/** Hovering helper */
		private arrow: IElement;
		
		constructor(id: string) {
			super("div", id);
			this.length = 0;
			
			//
			this.GetHTML().classList.add("ui-progressbar");
			
			// create progress bar
			var bar: SimpleElement = new SimpleElement("div");
			bar.GetHTML().classList.add("ui-progress");			
			this.progresbar = bar;
			this.AddChild(bar);
			
			// create progress bar
			bar = new SimpleElement("div");
			bar.GetHTML().classList.add("ui-buffer");			
			this.bufferbar = bar;
			this.AddChild(bar);
			
			// skipping helper
			this.arrow = new SimpleElement("div", "0:00");
			this.arrow.GetHTML().classList.add("ui-arrow");
			this.AddChild(this.arrow);
			
			// init progresbar with
			this.Sync(0);
			
			// change video position, when the bar is clicked
			this.GetHTML().onclick = (e: MouseEvent) => this.OnClick(e);
			this.GetHTML().onmousemove = (e: MouseEvent) => this.OnMouseMove(e);
		}
		
		/**
		 * Skip to given moment after user clicks on the timeline
		 */
		private OnClick(e: MouseEvent) : void {
			var time: number = (e.clientX - this.GetHTML().clientLeft) / this.GetHTML().clientWidth * this.length;
			this.SkipTo(time);  
		}
	
		/**
		 * Show the user an information about the point he is pointing to
		 */
		private OnMouseMove(e: MouseEvent) : void {
			var progress: number = (e.clientX - this.GetHTML().clientLeft) / this.GetHTML().clientWidth;
			var time: string = Helpers.millisecondsToString(progress * this.length);
			this.arrow.GetHTML().textContent = time;
			this.arrow.GetHTML().style.left = `${progress * 100}%`;  
			
			var rect = this.arrow.GetHTML().getBoundingClientRect();			
			if(rect.left < 0) {
				this.arrow.GetHTML().style.left = `${rect.width / 2}px`;
			} else if (rect.right > this.GetHTML().getBoundingClientRect().right) {
				this.arrow.GetHTML().style.left = `${this.GetHTML().getBoundingClientRect().right - (rect.width / 2)}px`;
			}
		}
		
		/**
		 * Synchronize progress bar width with current time 
		 * @param	{number} 	time	What is the current progress in milliseconds.
		 */
		public Sync(time: number) : void {
			this.progresbar.GetHTML().style.width = this.length > 0 ? `${time / this.length * 100}%` : "O%";
		}
		
		/**
		 * Synchronize buffer bar width with current time 
		 * @param	{number} 	time	How much is loaded in seconds.
		 */
		public SetBuffer(time: number) : void {
			this.bufferbar.GetHTML().style.width = this.length > 0 ? `${time / this.length * 100}%` : "O%";
		}
		
		/**
		 * @param	time	Time in milliseconds
		 */
		public SkipTo(time: number) : void {
			// triger an event...			
			VideoEvents.trigger(VideoEventType.JumpTo, time / this.length);
			
			// sync self
			this.Sync(time);			
		} 
		
	}
	
}