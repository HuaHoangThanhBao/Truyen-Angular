function getGAPIInstance() {
    return gapi;
}

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.readonly" });
}

function loadClient(apiKey) {
    gapi.client.setApiKey(apiKey);
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/drive/v2/rest");
}

// Make sure the client is loaded and sign-in is complete before calling this method.
async function execute(folderID) {
    return await gapi.client.drive.children.list({
        "folderId": folderID,
        "maxResults": 100000,
        "orderBy": "title"
    }).then(function (response) {
        // Handle the results here (response.result has the parsed body).
        //console.log("Response", response);
        return response.result.items;
    });
}

async function executeSearch(folderID, parentFolderName, subFolderName) {
    return await gapi.client.drive.children.list({
        "folderId": folderID,
        "maxResults": 100000,
        "orderBy": "title"
    }).then(function (response) {
        // Handle the results here (response.result has the parsed body).
        //console.log("Response", response);
        return new Promise((resolve, reject) => {
            response.result.items.forEach(async (item) => {
                //console.log(item.id)
                getFile(item.id).then(a => {
                    if (a.title == parentFolderName) {
                        //console.log(a);
                        execute(item.id).then(a => {
                            //console.log(a);
                            a.forEach(i => {
                                getFile(i.id).then(m => {
                                    if (m.title === subFolderName) {
                                        resolve({id: m.id, title: m.title})
                                    }
                                })
                            })
                        })
                    }
                });
            })
        })
    });
}

function getFile(id) {
    return new Promise(async (resolve) => {
        await gapi.client.drive.files.get({
            'fileId': id
        }).then(t => {
            //console.log(t);
            resolve({ id: id, title: t.result.title })
        });
    })
}

async function searchSubFolder(chapterFolderID, parentFolderName, subFolderName) {
    const a = await executeSearch(chapterFolderID, parentFolderName, subFolderName);
    return a;
}