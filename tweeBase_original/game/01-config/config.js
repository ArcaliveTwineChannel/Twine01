// config.js

Config.history.controls = false;        //히스토리 컨트롤
Config.history.maxStates = 1;           //히스토리 스텍 최소화
//State.prng.init()                       //랜덤 초기화


/**
 * 게임 설정
 */
window.StartConfig = {
    "debug": false,
	"version": "0.0.0.1"
}



/**태그 추가
 * nosave: 저장 비활성화
 * autosave: 오토세이브
 */
Config.saves.isAllowed = function () {
    if (tags().includes("nosave")) {
        return false;
    }
    return true;
};

Config.saves.maxAutoSaves = 1;