
import Constants from './Constants';

// Fetch Methods

const FetchMethods = {
    post: (url, objData, success, failure, error) => {
        console.log("Posting data to " + Constants.BASE_API_URL + url);
        console.log({ objData });
        var isSuccess = false;
        fetch(Constants.BASE_API_URL + url, {
            method: "post",
            body: JSON.stringify(objData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                var json = response.json();
                if (response.ok) {
                    isSuccess = true;
                } else {
                    isSuccess = false;
                }
                return json;
            })
            .then(json => {
                return isSuccess ? success(json) : failure(json);
            })
            .catch(error);
    },

    get: (url, success, failure, error) => {
        console.log("Getting data from " + Constants.BASE_API_URL + url);
        var isSuccess = false;
        fetch(Constants.BASE_API_URL + url, {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                var json = response.json();
                if (response.ok) {
                    isSuccess = true;
                } else {
                    isSuccess = false;
                }
                return json;
            })
            .then(json => {
                return isSuccess ? success(json) : failure(json);
            })
            .catch(error);
    }
}

export default FetchMethods;