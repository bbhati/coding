var EventEmitter = function() {
	this._events = {}
}

EventEmitter.prototype.on = function(name, listener, times) {
	if (typeof this._events[name] != "object") {
		this._events[name] = [];
	}

	this._events[name].push({listener: listener, times: times});
}

EventEmitter.prototype.once = function(name, listener) {
	//register a listener calling removeListener
	this.on(name, function g(){
		this.removeListener(name, g);
		listener.apply(this, arguments);
	})
}

EventEmitter.prototype.emit = function(name) {
	var args = [].slice.call(arguments, 1);

	if (typeof this._events[name] == "object") {
		var listeners = this._events[name];
		var len = listeners.length;

		for(var i = 0; i < len; i++) {
			listenerObj = listeners[i];
			if (typeof listenerObj["times"] == "number") {
				var times = listenerObj["times"];
				if (times > 0) {
					listeners[i][listener].apply(this, args);
					times -= 1;
					listenerObj["times"] = times;
				} if (times == 0) {
					this.removeListener(this, listener);
				}
			}
			else {
				listeners[i][listener].apply(this, args);
			}

		}
	}
}

EventEmitter.prototype.removeListener(name, listener) {
	var idx;

	if (typeof this._events[name] == "object") {
		var objs = this._events[name];
		for(var i = 0; i < objs.length; i++) {
			var obj = objs[i];
			if(obj["listener"].toString() === listener.toString()) {
				this._events[name].splice(i, 1);	
				return;
			}
		}
	}
}
