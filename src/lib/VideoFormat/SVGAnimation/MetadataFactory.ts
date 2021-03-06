import Metadata from '../../VideoData/Metadata';
import SVG, { SVGA } from '../../Helpers/SVG';
import { AudioSource, AudioSourceType } from '../../AudioData/AudioPlayer';

//namespace VectorScreencast.VideoFormat.SVGAnimation {
				
	/**
	 * Converts metadata to and from SVG elements.
	 */
	export default class MetadataFactory {
		
		/**
		 * Extract metadata information form an SVG element
		 * @param	rootNode	The root node of metadata information
		 * @return				Extracted metadata information
		 * @throws				Error
		 */
		FromSVG(rootNode: Element): Metadata {
			var meta: Metadata = new Metadata();
			
			// [0] is this the correct element?
			if (rootNode.localName !== "metadata") {
				throw new Error(`MetadataFactory error parsing SVG: Wrong metadata element ${rootNode.localName}`);
			}
						
			// [1] video lenght			
			var length: Element = rootNode.firstElementChild;
			if(length.localName !== "length") {
				throw new Error(`MetadataFactory error parsing SVG: Expected 'length', found '${length.nodeName}'`);
			}
			
			meta.Length = Number(length.textContent);
			
			// [2] video width
			var width: Element = length.nextElementSibling;
			length = null;
			if(width.localName !== "width") {
				throw new Error(`MetadataFactory error parsing SVG: Expected 'length', found '${width.nodeName}'`);
			}
			
			meta.Width = Number(width.textContent);
			
			// [3] video lenght
			var height: Element = width.nextElementSibling;
			width = null;
			if(height.localName !== "height") {
				throw new Error(`MetadataFactory error parsing SVG: Expected 'length', found '${height.nodeName}'`);
			}
			
			meta.Height = Number(height.textContent);
						
			// [4] audio tracks
			meta.AudioTracks = [];
			var audioElement: Element = height.nextElementSibling;
			var audioSource: Element = audioElement.firstElementChild;
			while(!!audioSource) {
				var type: AudioSourceType = AudioSource.StringToType(SVGA.attr(audioSource, "type"));
				meta.AudioTracks.push(new AudioSource(SVGA.attr(audioSource, "src"), type));
				audioSource = audioSource.nextElementSibling;
			}
			
			// That's it.
			return meta;
		}
		
		/**
		 * Creates metadata SVG element from video data.
		 * @param	data	The recorded data of the video.
		 * @return			SVG element
		 */
		ToSVG(data: Metadata): Node {			
			// the "root" element - http://www.w3.org/TR/SVG/metadata.html
			var meta: Node = SVG.CreateElement("metadata");
			
			// video lenght
			var length: Node = SVGA.CreateElement("length");
			length.textContent = data.Length.toFixed(3);
			meta.appendChild(length);
			length = null;
			
			// original video width
			var width: Node = SVGA.CreateElement("width");
			width.textContent = data.Width.toFixed(0);
			meta.appendChild(width);
			width = null;
						
			// original video height
			var height: Node = SVGA.CreateElement("height");
			height.textContent = data.Height.toFixed(0);
			meta.appendChild(height);
			height = null;
						
			// audio tracks
			var audioElement: Node = SVGA.CreateElement("audio");
			for(var i = 0; i < data.AudioTracks.length; i++) {
				var audioSource = data.AudioTracks[i];
				var source: Node = SVGA.CreateElement("source", {
					"type": audioSource.MimeType,
					"src": audioSource.Url
				});
				audioElement.appendChild(source);			
				source = null;
			}
			meta.appendChild(audioElement);			
			
			// That's it.
			return meta;
		}
		
	}
	
//}