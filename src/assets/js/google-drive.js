function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.readonly" });
}

function loadClient() {
    gapi.client.setApiKey("AIzaSyBY6ueBgxRiu67wSD8mgKc1Lh3Lgj5Bf4E");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/drive/v2/rest");
}

// Make sure the client is loaded and sign-in is complete before calling this method.
async function execute(folderID) {
    return await gapi.client.drive.children.list({
        "folderId": folderID,
        "maxResults": 100000
    }).then(function (response) {
        // Handle the results here (response.result has the parsed body).
        //console.log("Response", response);
        return response.result.items;
    });
}