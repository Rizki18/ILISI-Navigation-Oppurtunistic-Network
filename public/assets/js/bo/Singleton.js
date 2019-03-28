var Singleton = (function () {
    var instance;
 
    function createInstance() {
        var appContext = new contextApp();
        return appContext;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();