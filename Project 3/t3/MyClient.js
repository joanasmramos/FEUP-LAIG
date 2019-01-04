/**
* MyClient class
*/
class MyClient {
    /**
     * @constructor
     * @param port - Port in which requests are made
     */
    constructor(port) {
        this.requested_port = port || 8081;

        this.effectiveRequest = function (data) { console.log("Request successful. Reply: " + data.target.response); };
        this.deniedRequest = function () { console.log("Error waiting for response, please check SICStus server config..."); };
    }

    /**
    * Sending a request string to prolog server
    * in which success/error cases for handler are treated 
    * @param requestString request in proccess 
    * @param onSuccess recall for effective request 
    * @param onError recall for denied request 
    */
    getPrologRequest(requestString, onSuccess, onError) {
        let request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + this.requested_port + '/' + requestString, true);

        request.onload = onSuccess || this.effectiveRequest;
        request.onerror = onError || this.deniedRequest;

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    };

    /**
     * Creation of request to Prolog server
     */
    makeRequest() {
        // Get Parameter Values
        let requestString = [];

        // Make Request
        this.getPrologRequest(requestString, this.handleReply);
    };

    /**
     * Handler for reply responses
     * @param  {data} Information regarding the request
     */
    handleReply(data) {
        console.log(data.target.response);
    };
}