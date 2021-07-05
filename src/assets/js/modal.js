// const update_btns = document.getElementsByClassName('update-btn');
// const add_btn = document.getElementById('add-btn');
// const ndt_update_btns = document.getElementsByClassName('control-btn');

// const modal_update = document.getElementById('modal-update');
// const modal_add = document.getElementById('modal-add');
// const modal_ndt_add = document.getElementById('modal-ndt-add');

// const closeBtnUpdate = document.getElementById('closeBtnUpdate');
// const closeBtnAdd = document.getElementById('closeBtnAdd');
// const closeBtnNDTAdd = document.getElementById('closeBtnNDTAdd');

// /*Update Btns*/
// for(let i = 0; i < update_btns.length; i++){
//     update_btns[i].addEventListener('click', function(){
//         modal_update.classList.add('enable');
//         LoadModalByObj("Edit","Truyen");
//     });
// }

// closeBtnUpdate.addEventListener('click', function(){
//     modal_update.classList.remove('enable');
// });
// /**/

// /*Add Button*/
// add_btn.addEventListener('click', function(){
//     debugger
//     modal_add.classList.add('enable');
//     LoadModalByObj("Add","Truyen");
// });

// closeBtnAdd.addEventListener('click', function(){
//     modal_add.classList.remove('enable');
// });
// /**/

// /*Noi dung truyen Button*/
// for(let i = 0; i < ndt_update_btns.length; i++){
//     ndt_update_btns[i].addEventListener('click', function(){
//         modal_ndt_add.classList.add('enable');
//     });
// }

// if(closeBtnNDTAdd != null){
//     closeBtnNDTAdd.addEventListener('click', function(){
//         modal_ndt_add.classList.remove('enable');
//     });
// }

function getAPIData(buttonPropertyJson) {
    return { 'jsonData': [], 'buttonPropertyJson': buttonPropertyJson };
}

buttonStatus = {
    'Add': "Add",
}


function Init(json, buttonPropertyJson) {
    const update_btns = document.getElementsByClassName(buttonPropertyJson.btnAdd);
    const add_btn = document.getElementById('add-btn');
    const ndt_update_btns = document.getElementsByClassName('control-btn');

    update_btns.addEventListener('click', function(){

    })

    function LoadModalByObj(act, name) {

        if (act == buttonStatus.Add) {

            if (name == "Truyen") {
                for (let i = 0; i < json.data.length; i++) {
                    if (json.data[i].author != null) {
                        const parent = document.getElementById(buttonPropertyJson.btnAdd);
                        parent.innerHTML = "";

                        const select = document.createElement('select');
                        for (let j = 0; j < json.data[i].author.length; j++) {
                            const option = document.createElement('option');
                            option.value = json.data[i].author[j];
                            option.innerHTML = json.data[i].author[j];
                            select.appendChild(option);
                        }
                        parent.appendChild(select);
                    }

                    if (json.data[i].status != null) {
                        const parent = document.getElementById('add-input-status');
                        parent.innerHTML = "";

                        const select = document.createElement('select');
                        for (let j = 0; j < json.data[i].status.length; j++) {
                            const option = document.createElement('option');
                            option.value = json.data[i].status[j];
                            option.innerHTML = json.data[i].status[j];
                            select.appendChild(option);
                        }
                        parent.appendChild(select);
                    }

                    if (json.data[i].viewers != null) {
                        const parent = document.getElementById('add-input-view-amount');
                        parent.innerHTML = "";
                        const input = document.createElement('input');
                        input.value = json.data[i].viewers;
                        parent.appendChild(input);
                    }

                    if (json.data[i].describ != null) {
                        const parent = document.getElementById('add-input-describ');
                        parent.innerHTML = "";
                        const input = document.createElement('input');
                        input.value = json.data[i].describ;
                        parent.appendChild(input);
                    }

                    if (json.data[i].checkBox != null) {
                        const parent = document.getElementById('add-checkbox-form');
                        parent.innerHTML = "";

                        for (let j = 0; j < json.data[i].checkBox.length; j++) {
                            const infoInputRow = document.createElement('div');
                            infoInputRow.classList.add('info-input-row');

                            const ChildCheckBox = document.createElement('input')
                            ChildCheckBox.type = 'checkbox'
                            ChildCheckBox.classList.add('info-input');

                            const LabelChild = document.createElement('label');
                            LabelChild.innerHTML = ' ' + json.data[i].checkBox[j];

                            infoInputRow.appendChild(ChildCheckBox);
                            infoInputRow.appendChild(LabelChild);

                            parent.appendChild(infoInputRow);
                        }
                    }
                }
                const button = document.getElementById('add-button-form');
                button.innerHTML = "";

                const buttonSave = document.createElement('button');
                buttonSave.innerHTML = "Lưu";
                buttonSave.classList.add('btn-func');
                buttonSave.classList.add('bg-blue');
                button.appendChild(buttonSave);
            }

            if (name == "TheLoai") {

                for (let i = 0; i < json.data.length; i++) {

                    if (json.data[i].tacGia != null) {
                        const parent = document.getElementById('add-theloai');
                        parent.innerHTML = "";

                        const input = document.createElement('input');
                        input.value = "Giật gân";

                        parent.appendChild(input);
                    }

                    if (json.data[i].status != null) {
                        const parent = document.getElementById('add-status');
                        parent.innerHTML = "";

                        const select = document.createElement('select');
                        for (let j = 0; j < json.data[i].status.length; j++) {
                            const option = document.createElement('option');
                            option.value = json.data[i].status[j];
                            option.innerHTML = json.data[i].status[j];
                            select.appendChild(option);
                        }
                        parent.appendChild(select);
                    }
                }
            }

            if (name == "TacGia") {

                for (let i = 0; i < json.data.length; i++) {

                    if (json.data[i].tacGia != null) {
                        const parent = document.getElementById('add-author');
                        parent.innerHTML = "";

                        const input = document.createElement('input');
                        input.value = "Nguyễn Văn A";

                        parent.appendChild(input);
                    }

                    if (json.data[i].status != null) {
                        const parent = document.getElementById('add-status');
                        parent.innerHTML = "";

                        const select = document.createElement('select');
                        for (let j = 0; j < json.data[i].status.length; j++) {
                            const option = document.createElement('option');
                            option.value = json.data[i].status[j];
                            option.innerHTML = json.data[i].status[j];
                            select.appendChild(option);
                        }
                        parent.appendChild(select);
                    }
                }
            }
        }

        if (act == "Edit") {
            if (name == "Truyen") {

                for (let i = 0; i < json.data.length; i++) {

                    if (json.data[i].author != null) {
                        const parent = document.getElementById('edt-input-author');
                        parent.innerHTML = "";

                        const select = document.createElement('select');
                        for (let j = 0; j < json.data[i].author.length; j++) {
                            const option = document.createElement('option');
                            option.value = json.data[i].author[j];
                            option.innerHTML = json.data[i].author[j];
                            select.appendChild(option);
                        }
                        parent.appendChild(select);
                    }

                    if (json.data[i].status != null) {
                        const parent = document.getElementById('edt-input-status');
                        parent.innerHTML = "";

                        const select = document.createElement('select');
                        for (let j = 0; j < json.data[i].status.length; j++) {
                            const option = document.createElement('option');
                            option.value = json.data[i].status[j];
                            option.innerHTML = json.data[i].status[j];
                            select.appendChild(option);
                        }
                        parent.appendChild(select);
                    }

                    if (json.data[i].viewers != null) {
                        const parent = document.getElementById('edt-input-view-amount');
                        parent.innerHTML = "";
                        const input = document.createElement('input');
                        input.value = json.data[i].viewers;
                        parent.appendChild(input);
                    }

                    if (json.data[i].describ != null) {
                        const parent = document.getElementById('edt-input-describ');
                        parent.innerHTML = "";
                        const input = document.createElement('input');
                        input.value = json.data[i].describ;
                        parent.appendChild(input);
                    }

                    if (json.data[i].checkBox != null) {
                        const parent = document.getElementById('edt-checkbox-form');
                        parent.innerHTML = "";

                        for (let j = 0; j < json.data[i].checkBox.length; j++) {
                            const infoInputRow = document.createElement('div');
                            infoInputRow.classList.add('info-input-row');

                            const ChildCheckBox = document.createElement('input')
                            ChildCheckBox.type = 'checkbox'
                            ChildCheckBox.classList.add('info-input');

                            const LabelChild = document.createElement('label');
                            LabelChild.innerHTML = ' ' + json.data[i].checkBox[j];

                            infoInputRow.appendChild(ChildCheckBox);
                            infoInputRow.appendChild(LabelChild);

                            parent.appendChild(infoInputRow);
                        }
                    }
                }
                const button = document.getElementById('edt-button-form');
                button.innerHTML = "";

                const buttonDelete = document.createElement('button');
                buttonDelete.innerHTML = "Xóa";
                buttonDelete.classList.add('btn-func');
                buttonDelete.classList.add('bg-blue');

                const buttonUpdate = document.createElement('button');
                buttonUpdate.innerHTML = "Cập nhật";
                buttonUpdate.classList.add('btn-func');
                buttonUpdate.classList.add('bg-red');

                button.appendChild(buttonUpdate);
                button.appendChild(buttonDelete);
            }

            if (name == "TheLoai") {

                for (let i = 0; i < json.data.length; i++) {

                    if (json.data[i].tacGia != null) {
                        const parent = document.getElementById('edt-theloai');
                        parent.innerHTML = "";

                        const input = document.createElement('input');
                        input.value = "Giật gân";

                        parent.appendChild(input);
                    }

                    if (json.data[i].status != null) {
                        const parent = document.getElementById('edt-status');
                        parent.innerHTML = "";

                        const select = document.createElement('select');
                        for (let j = 0; j < json.data[i].status.length; j++) {
                            const option = document.createElement('option');
                            option.value = json.data[i].status[j];
                            option.innerHTML = json.data[i].status[j];
                            select.appendChild(option);
                        }
                        parent.appendChild(select);
                    }
                }
            }

            if (name == "TacGia") {

                for (let i = 0; i < json.data.length; i++) {

                    if (json.data[i].tacGia != null) {
                        const parent = document.getElementById('edt-author');
                        parent.innerHTML = "";

                        const input = document.createElement('input');
                        input.value = "Nguyễn Văn A";

                        parent.appendChild(input);
                    }

                    if (json.data[i].status != null) {
                        const parent = document.getElementById('edt-status');
                        parent.innerHTML = "";

                        const select = document.createElement('select');
                        for (let j = 0; j < json.data[i].status.length; j++) {
                            const option = document.createElement('option');
                            option.value = json.data[i].status[j];
                            option.innerHTML = json.data[i].status[j];
                            select.appendChild(option);
                        }
                        parent.appendChild(select);
                    }
                }
            }
        }

    }
}


