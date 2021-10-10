
/*===== Save Customer =====*/

$('#btn-save').on('click', (e) => {
    e.preventDefault();

    const txtId = $('#txtId');
    const txtName = $('#txtName');
    const txtAddress = $('#txtAddress');

    let id = (txtId.val() as string).trim();
    let name = (txtName.val() as string).trim();
    let address = (txtAddress.val() as string).trim();

    console.log("Id ", id);
    console.log("name ", name);
    console.log("address ", address); 
})

