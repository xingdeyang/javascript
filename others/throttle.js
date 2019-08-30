// 简单节流
function throttle (callback, delay) {
	var timeoutId
	return function () {
		if (timeoutId) {
			clearTimeout(timeoutId)
		}
		timeoutId = setTimeout(callback, delay)
	}
}

// 高级节流
function throttle (callback, mustRunTime, delay) {
	var timeoutId, prevTime
	return function () {
		var currentTime = Date.now()
		if (timeoutId) {
			clearTimeout(timeoutId)
		}
		if (!prevTime) {
			prevTime = currentTime
		}
		if (currentTime - prevTime < mustRunTime) {
			timeoutId = setTimeout(callback, delay)
			return
		} else {
			callback()
			prevTime = Date.now()
		}
	}
}
