/* This script can be loaded as a temporary extension into Firefox, 
 * as described here:
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension
 *
 * After pressing Ctrl+Space, it replaces words/abbreviations 
 * with other expressions in the active input field.
 */

var wordsOld = [];
var wordsNew = [];
//keyCode 17 - Ctrl
//keyCode 32 - Space
var keys = [17, 32];
var keysPressed = [false, false];
var triggered = false;
var breakChars = [' ', '\n', '\t', ']', '(', ')'];

window.onload = WindowLoad;
document.onload = WindowLoad;

// this script is reloaded every 5 seconds
setInterval(WindowLoad, 5000);

function WindowLoad(myEvent) {
	console.log("Loading");
	wordsOld = ["sgh", "sgf", "sgd", "dsm", 
				"mfg", "br",
				"anruf", "call"];
	wordsNew = ["Sehr geehrter Herr ", 
				"Sehr geehrte Frau ",
				"Sehr geehrte Damen und Herren,\n\n", 
				"Dear Sir or Madam,\n\n\n\n",
				"Mit freundlichen Grüßen\n\n",
				"Best regards,\n\n",
				"Ich habe versucht Sie anzurufen, konnte Sie jedoch nicht telefonisch erreichen.\n\n",
				"I tried to call you but was not able to reach you.\n\n"];
	console.log("Length of wordsOld:\t" + wordsOld.length);
	console.log("Length of wordsNew:\t" + wordsNew.length);
}


document.addEventListener("keydown", function (myEvent) {
	for(var i=0; i<keys.length; i++){
		if(myEvent.keyCode === keys[i]){
			keysPressed[i] = true;
		}
	}
	triggered = true;
	for(var i=0; i<keys.length; i++){
		if(!keysPressed[i]){
			triggered = false;
			break;
		}
	}
	if(triggered){
		triggered = false;
		myElement = document.activeElement;
 
		var textFieldString = myElement.value;
		var cursorPos = myElement.selectionStart;
		var posEnd = cursorPos;
		var posBegin = -1;
		var lengthText = textFieldString.length;
		
		// extract the position of the first character
		// of the word to be replaced
		for(var i=cursorPos-1; i>-1; i--){
			posBegin = i;
			var breakOuterLoop = false;
			for(var j=0; j<breakChars.length; j++){
				if (textFieldString.charAt(i) == breakChars[j]){
					breakOuterLoop = true;
				}
			}
			if(breakOuterLoop){
				posBegin++;
				break;
			}
		}
		var stringBefore = textFieldString.substring(0, posBegin);
		var stringAfter = textFieldString.substring(posEnd, lengthText);
		var word = textFieldString.substring(posBegin, posEnd);
		
		// replace words
		if(posBegin > -1){
			var newText = "";
			for(var i=0; i<wordsOld.length; i++){
				if(word === wordsOld[i]){
					newText = stringBefore + wordsNew[i] + stringAfter;
					myElement.value = newText;
					// update cursor position
					cursorPos = cursorPos - wordsOld[i].length + wordsNew[i].length;
					myElement.setSelectionRange(cursorPos, cursorPos);
					break;
				}
			}
		}
	}
});


document.addEventListener("keyup", function (myEvent){
	for(var i=0; i<keys.length; i++){
		if(myEvent.keyCode === keys[i]){
			keysPressed[i] = false;
		}
	}
});
