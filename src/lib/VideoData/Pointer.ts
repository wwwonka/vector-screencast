import VideoEvents, { VideoEventType } from '../Helpers/VideoEvents';
import { CursorState } from '../Helpers/State';
import VideoTimer from '../Helpers/VideoTimer';
import PointingDevice from './PointingDevice';
	
//namespace VectorScreencast.VideoData {
	
	export interface PointingDeviceFactory {
		(events: VideoEvents, board: HTMLElement, timer: VideoTimer): PointingDevice;
	}
	
	/**
		* Mouse input detection and processing. 
		*/
	export default class PointerEventsAPI extends PointingDevice {
						
		private currentEvent: PointerEvent; 
						
		constructor(events: VideoEvents, container: HTMLElement, board: HTMLElement, timer: VideoTimer) {
			super(events, board, timer);
							
			// board events			
			container.addEventListener("pointermove",  	(e) => this.onPointerMove(e));
			container.addEventListener("pointerdown", 	(e) => this.onPointerDown(e));
			container.addEventListener("pointerup",  	(e) => this.onPointerUp(e));
			container.addEventListener("pointerleave",  (e) => this.onPointerLeave(e)); // release the mouse also when the user tries to draw outside of the "board"
			container.addEventListener("pointerenter",  (e)	=> this.onPointerLeave(e));
			container.addEventListener("pointerover",  	(e)	=> this.onPointerOver(e)); // maybe start a new line, if the button is pressed
			this.currentEvent = null;
			this.isDown = false;
		}
		
		/**
			* Return pressure of the mouse, touch or pen.
			* @return		Current presure in percent
			*/
		public GetPressure(): number {
			if(this.isDown === false || this.currentEvent === null) {
					return 0; // no envent, no pressure
			}
	
			if(this.currentEvent.pointerType === "pen") {
				return this.currentEvent.pressure; // this device knows, what is current applied pressure
			}
	
			return 1; // button is pressed or touchscreen touched - maximum presure
		}
		
		/**
			* Filter all clicks on buttons and other possible UI controls
			*/
		public InitControlsAvoiding(): void {			
			var controls: NodeList = document.getElementsByClassName("ui-control");
			for (var i = 0; i < controls.length; i++) {
				var element = <HTMLElement> controls[i];
				element.onpointerover = (e: PointerEvent) => this.isHoveringOverUIControl = true;
				element.onpointerout = (e: PointerEvent) => this.isHoveringOverUIControl = false; 
			}
		}
	
		/**
			* Trace mouse movement.
			*/
		protected onPointerMove(e: PointerEvent) : any {
			this.onMove(e);
			this.currentEvent = e;
		}
	
		/**
			* Start drawing lines.
			*/
		protected onPointerDown(e: PointerEvent) : any {
			this.onDown(e);
			this.currentEvent = e;
		}
	
		/**
			* Stop drawing lines.
			*/
		protected onPointerUp(e: PointerEvent) : any {
			this.onUp(e);
			this.currentEvent = e;
		}
		
		/**
			* Stop drawing lines.
			*/
		protected onPointerLeave(e: PointerEvent) : any {
			this.onLeave(e);
			this.currentEvent = e;
		}
		
		/**
			* Make sure the status of mouse button is consistent.
			*/
		protected onPointerEnter(e: PointerEvent) : any {
			if(e.buttons === 0) {
				this.isDown = false; // check mouse down status
			}
			this.currentEvent = e;
		}
				
		/**
			* Mark down that the cursor is hovering over the canvas.
			*/
		protected onPointerOver(e: PointerEvent) : any {
			this.isInside = true;
			this.currentEvent = e;
		}		
	}
	
//}