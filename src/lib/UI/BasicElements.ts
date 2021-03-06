import HTML from '../Helpers/HTML';
	
//export namespace VectorScreencast.UI {
	
	/**
	 * Basic UI interface
	 */
	export interface IElement {
		GetHTML(): HTMLElement;
		Refresh(): void;
		HasClass(className: string): boolean;
		AddClass(className: string): IElement;
		AddClasses(...classes: Array<string>): IElement;
		RemoveClass(className: string): IElement;
		RemoveClasses(...classes: Array<string>): IElement;
	}
	
	export abstract class SimpleElement implements IElement {		
		/** The simple element */
		private element: HTMLElement;
		
		/**
		 * Create a simple HTML element, that can be part of a Panel
		 * @param	tag		Tag name or HTMLElement instance
		 * @param	content	Optional textual content of the tag 
		 */
		constructor(tag: string|HTMLElement, content?: string) {
			if(tag instanceof HTMLElement) {
				this.element = tag;
			} else {
				this.element = HTML.CreateElement(<string> tag);				
			}
			
			if(!!content) { // if content argument is passed
				this.element.textContent = content;				
			}
		}
		
		/**
		 * Getter of the element.
		 */
		public GetHTML() : HTMLElement { return this.element; }
		
		/**
		 * DOM has changed, element should adapt to the changes.
		 */
		public Refresh() { }
		
		/**
		 * Does the HTML element has a specific class in it's class list?
		 */
		public HasClass(className: string): boolean {
			return this.GetHTML().classList.contains(className);
		}
		
		/**
		 * Add one class to the class attribute of the HTML element.
		 */
		public AddClass(className: string): IElement {
			return this.AddClasses(className);
		}
		
		/**
		 * Add any number of classes to the class attribute of the HTML element.
		 */
		public AddClasses(...classes: Array<string>): IElement {
			for (var i = 0; i < classes.length; i++) {
				this.GetHTML().classList.add(classes[i]);				
			}
			return this;
		}		
		
		/**
		 * Remove one class from the class attribute of the HTML element.
		 */
		public RemoveClass(className: string): IElement {
			return this.RemoveClasses(className);
		}
		
		/**
		 * Remove any number of classes from the class attribute of the HTML element.
		 */
		public RemoveClasses(...classes: Array<string>): IElement {
			for (var i = 0; i < classes.length; i++) {
				this.GetHTML().classList.remove(classes[i]);				
			}
			return this;
		}		
	}	
	
	
	
	/**
	 * A few concrete UI elements
	 */
	
	export class Span extends SimpleElement {
		constructor(text?: string) {
			text = text || "";
			super("span", text);
		}
	}
	 
	/**
	 * A few concrete UI elements
	 */
	
	export class Div extends SimpleElement {
		constructor(text: string = "") {
			super("div", text);
		}
	}
	 
	/**
	 * Basic UI button
	 */
	export class Button extends SimpleElement {
			
		protected content: IElement;
		
		/**
		 * Create a basic button with a text in it
		 * @param	text	Button caption
		 * @param	onClick	Optional click event handler
		 */
		constructor(text: string) {
			super("button");	
			this.AddClass("ui-button");
			this.content = new Span(text);
			this.GetHTML().appendChild(this.content.GetHTML());
		}		
		
		/**
		 * Set the DOM event handler to detect user's clicks.
		 */
		set Click(handler: (e: MouseEvent) => void) {			
			this.GetHTML().onclick = handler;
		}
		
		/**
		 * Change the content of the button.
		 * @param	content	The content - might be HTML 
		 */
		public ChangeContent(content: string): Button {
			this.content.GetHTML().innerHTML = content;
			return this;
		}
	}
	
	/**
	 * Create an icon
	 */
	export interface IconFactory {
		(iconClass: string): IElement;
	}
	
	/**
	 * Extended UI button
	 */
	export class IconButton extends Button {
			
		protected icon: IElement;		
		
		/**
		 * A factory for creating a specific icon
		 */
		static CreateIcon: IconFactory = (iconClass: string) => {
			return new Span().AddClasses('fa', `fa-${iconClass}`);
		};
			
		/**
		 * Create a basic button with a text in it
		 * @param	iconClass	CSS class of the icon
		 * @param	content		The textual content of the button	
		 * @param	onClick	Optional click event handler
		 */
		constructor(protected iconClass: string, content: string, onClick?: (e: Event) => void) {
			super(content);
			this.Click = onClick;
			
			// the content isn't a simple text..
			this.icon = IconButton.CreateIcon(iconClass);
			this.AddClass("has-icon");
			this.GetHTML().appendChild(this.icon.GetHTML());						
		}
		
		public ChangeIcon(iconClass: string): IconButton {	
			this.icon.RemoveClass(this.iconClass).AddClass(iconClass);
			this.iconClass = iconClass;
			return this;
		}
	}
	
	/**
	 * Button with an icon but without any text.
	 */
	export class IconOnlyButton extends IconButton {
		constructor(iconClass: string, title: string = "", onClick?: (e: Event) => void) {
			super(iconClass, "", onClick); // empty content
			this.ChangeContent(title);			
			this.AddClass("icon-only-button");
		}
		
		/**
		 * Change the title attribute of the button.
		 * @param	content		New button title.
		 */
		public ChangeContent(content: string): IconButton {
			HTML.SetAttributes(this.GetHTML(), { title: content });
			return this;
		}
	}
		
	/**
	 * Basic HTML heading
	 */
	export class Heading extends SimpleElement {
		constructor(level: number, text: string) {
			super(`h${level}`, text);
		}
	}
	
	/**
	 * Basic HTML heading of level two
	 */
	export class H2 extends Heading {
		constructor(text: string) {
			super(2, text);
		}
	}
	
	
	/**
	 * A composite UI element
	 */
	export class Panel implements IElement {
				
		/** The root HTML element */
		private element: HTMLElement;
				
		/** Children - in the order they were added */
		private elements: Array<IElement>;
		public get Children() : Array<IElement> { return this.elements; }
		
		/**
		 * Create a new specific panel 
		 * @param	tag		The tag name of the panel
		 * @param	id		The HTML ID of the panel
		 */
		constructor(tag: string, id?: string) {
			this.element = HTML.CreateElement(tag);
			if(!!id) {
				HTML.SetAttributes(this.element, { id: id });
			}			
			this.elements = [];			
		}
		
		/**
		 * Refresh all the elements beneath.
		 */
		Refresh() {
			this.Children.forEach(element => {
				element.Refresh();
			});
		}
		
		/**
		 * Add another element to the collection.
		 * @param	el		Element instance.
		 */
		public AddChild(el: IElement): Panel {
			return this.AddChildren(el);
		}
		
		/**
		 * Add muiltiple children to the panel.
		 * @param	elements	Array of elements
		 */
		public AddChildren(...elements: Array<IElement>): Panel {
			for (var i = 0; i < elements.length; i++) {
				this.elements.push(elements[i]);
				this.GetHTML().appendChild(elements[i].GetHTML());
			}
			
			return this;
		}
		
		/**
		 * Remove a child element from the DOM and from the list of children.
		 * @param	el		Element instance
		 */
		public RemoveChild(el: IElement): boolean {
			var i = this.elements.indexOf(el);
			if(i === -1) {
				return false; // the element does not exist
			}
			
			let child = this.elements[i]; 			
			this.GetHTML().removeChild(child.GetHTML()); // remove from the DOM
			this.elements.splice(i, 1); // remove from the list
			return true;
		}		
		
		/**
		 * Getter of the element.
		 */
		public GetHTML() : HTMLElement { return this.element; }
		
		/**
		 * Does the HTML element has a specific class in it's class list?
		 */
		public HasClass(className: string): boolean {
			return this.GetHTML().classList.contains(className);
		}
		
		/**
		 * Add one class to the class attribute of the HTML element.
		 */
		public AddClass(className: string): Panel {
			return this.AddClasses(className);
		}
		
		/**
		 * Add any number of classes to the class attribute of the HTML element.
		 */
		public AddClasses(...classes: Array<string>): Panel {
			for (var i = 0; i < classes.length; i++) {
				this.GetHTML().classList.add(classes[i]);				
			}
			return this;
		}		
		
		/**
		 * Remove one class from the class attribute of the HTML element.
		 */
		public RemoveClass(className: string): Panel {
			return this.RemoveClasses(className);
		}
		
		/**
		 * Remove any number of classes from the class attribute of the HTML element.
		 */
		public RemoveClasses(...classes: Array<string>): Panel {
			for (var i = 0; i < classes.length; i++) {
				this.GetHTML().classList.remove(classes[i]);				
			}
			return this;
		}		
	}

	
//}