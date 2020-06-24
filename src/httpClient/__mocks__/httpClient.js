/**
 * HTTP Client mock
 *
 * @author: gkar5861 on 23/06/20
 **/

const mockRequestBody = {
    fileNames: [
        "fileName1",
        "fileName2"
    ]
};

const mockResponse = {
    data: [
        {
            "fileName": "fileName1",
            "putUrl": "https://batch-output.s3.amazonaws.com/fileName1?AWSAccessKeyId=ASIAQRLXWZJ"
        },
        {
            "fileName": "fileName2",
            "putUrl": "https://batch-output.s3.amazonaws.com/fileName2?AWSAccessKeyId=ASIAQRLXWZJ"
        }
    ]
}

class HttpClient {
    constructor(configs) {
        return null
    }

    static async makeRequest(method, URL, data, headers, params) {
        if (JSON.stringify(data) === JSON.stringify(mockRequestBody)) {
            return mockResponse;
        }
    }

}

export default HttpClient;
