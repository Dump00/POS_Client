"use strict";
/*===== Save Customer =====*/
$('#btn-save').on('click', (e) => {
    e.preventDefault();
    const txtId = $('#txtId');
    const txtName = $('#txtName');
    const txtAddress = $('#txtAddress');
    let id = txtId.val().trim();
    let name = txtName.val().trim();
    let address = txtAddress.val().trim();
    console.log("Id ", id);
    console.log("name ", name);
    console.log("address ", address);
});
