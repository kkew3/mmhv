function openUrl() {
    const row_id = getCheckedRadioRowId();
    if (row_id === null) {
        return;
    }
    const a = document.getElementById(`link_${row_id}`);
    const url = a.getAttribute('href');
    window.open(url, '_parent');
}

document.querySelectorAll('input[name="indicator"]')
.forEach(radio => {
    radio.addEventListener('change', function(event) {
        updateRowClassBasedOnRadioCheckedState();
    });
});

// Keyboard shortcuts.
document.addEventListener('keydown', function(event) {
    if (event.key === 'j') {
        moveFocusDown();
    } else if (event.key == 'k') {
        moveFocusUp();
    } else if (event.key === 'l') {
        openUrl();
    }
});
