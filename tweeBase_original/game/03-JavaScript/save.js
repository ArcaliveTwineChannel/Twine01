//세이브 설정 준비
window.prepareSaveDetails = function (forceRun){
	if("gridSaveDetails" in localStorage === false || forceRun === true){
		var saveDetails = {autosave: null, slots:[null,null,null,null,null,null,null,null]}
		var SugarCubeSaveDetails = Save.browser.slot.entries();
		if(SugarCubeSaveDetails.autosave != null){
			saveDetails.autosave = {
				title:SugarCubeSaveDetails.autosave.title,
				date:SugarCubeSaveDetails.autosave.date,
				metadata:SugarCubeSaveDetails.autosave.metadata
			}
			if(saveDetails.autosave.metadata === undefined){
				saveDetails.autosave.metadata = {saveName:""};
			}
			if(saveDetails.autosave.metadata.saveName === undefined){
				saveDetails.autosave.metadata.saveName = "";
			}
		}
		for (var i=0; i<SugarCubeSaveDetails.slots.length;i++){
			if(SugarCubeSaveDetails.slots[i] !== null){
				saveDetails.slots[i] = {
					title:SugarCubeSaveDetails.slots[i].title,
					date:SugarCubeSaveDetails.slots[i].date,
					metadata:SugarCubeSaveDetails.slots[i].metadata
				};
				if(saveDetails.slots[i].metadata === undefined){
					saveDetails.slots[i].metadata = {saveName:"old save", saveId:0}
				}
				if(saveDetails.slots[i].metadata.saveName === undefined){
					saveDetails.slots[i].metadata.saveName = "old save";
				}
			}else{
				saveDetails.slots[i] = null;
			}
		}
	
		localStorage.setItem("gridSaveDetails" ,JSON.stringify(saveDetails));
	}
	return;
}

// 세이브 상세 설정 (인수: 슬롯번호, metadate (, story))
window.setSaveDetail = function (saveSlot, metadata, story){
	var saveDetails = JSON.parse(localStorage.getItem("gridSaveDetails"));
	if(saveSlot === "autosave"){
		saveDetails.autosave = {
			title:SugarCube.Story.get(passage()).description(),
			date:Date.now(),
			metadata:metadata
		};
	}else{
		var slot = parseInt(saveSlot);
		saveDetails.slots[slot] = {
			title:SugarCube.Story.get(passage()).description(),
			date:Date.now(),
			metadata:metadata
		};
	}
	localStorage.setItem("gridSaveDetails" ,JSON.stringify(saveDetails));
}

// localStorage에 인수값에 해당되는 슬롯의 세이브 가져오기
window.getSaveDetails = function (saveSlot){
	if("gridSaveDetails" in localStorage) return JSON.parse(localStorage.getItem("gridSaveDetails"));
}

// localStorage에서 인수값에 해당되는 슬롯의 세이브 제거
window.deleteSaveDetails = function (saveSlot){
	var saveDetails = JSON.parse(localStorage.getItem("gridSaveDetails"));
	if(saveSlot === "autosave"){
		saveDetails.autosave = null;
	}else{
		var slot = parseInt(saveSlot);
		saveDetails.slots[slot] = null;
	}
	localStorage.setItem("gridSaveDetails" ,JSON.stringify(saveDetails));
}

// localStorage에서 전체 세이브 초기화
window.deleteAllSaveDetails = function (saveSlot){
	var saveDetails = {autosave: null, slots:[null,null,null,null,null,null,null,null]};
	localStorage.setItem("gridSaveDetails" ,JSON.stringify(saveDetails));
}

// 현재 세이브 리스트 반환
window.returnSaveDetails = function () {
	return Save.browser.slot.entries();
}

window.resetSaveMenu = function () {
	new Wikifier(null, '<<resetSaveMenu>>');
}

window.loadSave = function (saveSlot, confirm) {
	if (SugarCube.State.variables.confirmLoad === true && confirm === undefined) {
		new Wikifier(null, '<<loadConfirm ' + saveSlot + '>>');
	} else {
		if (saveSlot === "auto") {
			Save.autosave.load();
		} else {
			Save.slots.load(saveSlot);
		}
	}
}

window.save = function (saveSlot, confirm, saveId, saveName) {
	if (saveId == null) {
		new Wikifier(null, '<<saveConfirm ' + saveSlot + '>>');
	} else if ((SugarCube.State.variables.confirmSave === true && confirm != true) || (SugarCube.State.variables.saveId != saveId && saveId != null)) {
		new Wikifier(null, '<<saveConfirm ' + saveSlot + '>>');
	} else {
		if (saveSlot != undefined) {
			updateSavesCount();
			Save.slots.save(saveSlot, null, { "saveId": saveId, "saveName": saveName });
			setSaveDetail(saveSlot, { "saveId": saveId, "saveName": saveName })
			SugarCube.State.variables.currentOverlay = null;
			overlayShowHide("customOverlay");
		}
	}
}

window.deleteSave = function (saveSlot, confirm) {
	if (saveSlot === "all") {
		if (confirm === undefined) {
			new Wikifier(null, '<<clearSaveMenu>>');
			return;
		} else if (confirm === true) {
			Save.clear();
			deleteAllSaveDetails();
		}
	} else if (saveSlot === "auto") {
		if (SugarCube.State.variables.confirmDelete === true && confirm === undefined) {
			new Wikifier(null, '<<deleteConfirm ' + saveSlot + '>>');
			return;
		} else {
			Save.autosave.delete();
			deleteSaveDetails("autosave");
		}
	} else {
		if (SugarCube.State.variables.confirmDelete === true && confirm === undefined) {
			new Wikifier(null, '<<deleteConfirm ' + saveSlot + '>>');
			return;
		} else {
			Save.slots.delete(saveSlot);
			deleteSaveDetails(saveSlot)
		}
	}
	new Wikifier(null, '<<resetSaveMenu>>');
}

window.importSave = function (saveFile) {
	if (!window.FileReader) return; // Browser is not compatible

	var reader = new FileReader();

	reader.onloadend = function () {
		DeserializeGame(this.result);
	}

	reader.readAsText(saveFile[0]);
}

window.SerializeGame = function () { return Save.serialize(); }; window.DeserializeGame = function (myGameState) { return Save.deserialize(myGameState) };

window.getSaveData = function () {
	var input = document.getElementById("saveDataInput");
	updateExportDay();
	input.value = Save.serialize();
}

window.loadSaveData = function () {
	var input = document.getElementById("saveDataInput");
	var result = Save.deserialize(input.value);
	if (result === null) {
		input.value = "Invalid Save."
	}
}

window.clearTextBox = function (id) {
	document.getElementById(id).value = "";
}

window.topTextArea = function (id) {
	var textArea = document.getElementById(id);
	textArea.scroll(0, 0);
}

window.bottomTextArea = function (id) {
	var textArea = document.getElementById(id);
	textArea.scroll(0, textArea.scrollHeight);
}

window.copySavedata = function (id) {
	var saveData = document.getElementById(id);
	saveData.focus();
	saveData.select();

	try {
		var successful = document.execCommand('copy');
	} catch (err) {
		var copyTextArea = document.getElementById("CopyTextArea");
		copyTextArea.value = "Copying Error";
		console.log('Unable to copy: ', err);
	}
}

window.copySavedata = function (id) {
	var saveData = document.getElementById(id);
	saveData.focus();
	saveData.select();

	try {
		var successful = document.execCommand('copy');
	} catch (err) {
		var copyTextArea = document.getElementById("CopyTextArea");
		copyTextArea.value = "Copying Error";
		console.log('Unable to copy: ', err);
	}
}

window.updateExportDay = function(){
	if(SugarCube.State.variables.saveDetails != undefined && SugarCube.State.history[0].variables.saveDetails != undefined){
		SugarCube.State.variables.saveDetails.exported.days = clone(SugarCube.State.variables.days);
		SugarCube.State.history[0].variables.saveDetails.exported.days = clone(SugarCube.State.history[0].variables.days);
		SugarCube.State.variables.saveDetails.exported.count++;
		SugarCube.State.history[0].variables.saveDetails.exported.count++;
	}
}

window.updateSavesCount = function(){
	if(SugarCube.State.variables.saveDetails != undefined && SugarCube.State.history[0].variables.saveDetails != undefined){
		SugarCube.State.variables.saveDetails.slot.count++;
		SugarCube.State.history[0].variables.saveDetails.slot.count++;
	}
}

