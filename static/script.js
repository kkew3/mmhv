/**
 * Scroll to an entry row.
 *
 * @param {number} row_id 
 */
function scrollToRow(row_id) {
    const element = document.getElementById(`row_${row_id}`);
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

/**
 * Get the row id of the currently checked entry. Return null if there is no
 * radio button checked.
 */
function getCheckedRadioRowId() {
    // Get all radio buttons with the name 'indicator'
    const radios = document.querySelectorAll('input[name="indicator"]');
    for (const radio of radios) {
        if (radio.checked) {
            // This get the id (integer) part of "indicator_{id}".
            return parseInt(radio.id.substring(10));
        }
    }
    return null;
}

/**
 * Check the first radio button, and return its row id. Return null if there is
 * no radio button in the document at all.
 */
function checkAndGetFirstRadioRowId() {
    const tbody = document.getElementById("entries");
    const firstRow = tbody.querySelector('tr:first-child');
    if (firstRow === null) {
        return null;
    }

    // This get the id (integer) part of "row_{id}".
    const row_id = parseInt(firstRow.id.substring(4));
    const first_radio = document.getElementById(`indicator_${row_id}`);
    first_radio.checked = true;
    return row_id;
}

/**
 * Move focus down one row. If there is no focus, set focus to the first row.
 */
function moveFocusDown() {
    const row_id = getCheckedRadioRowId();
    // If no radio button is checked.
    if (row_id === null) {
        row_id = checkAndGetFirstRadioRowId();
        // If there is no radio button at all.
        if (row_id === null) {
            return;
        }
        scrollToRow(row_id);
        document.getElementById(`row_${row_id}`).classList.add('checked');
    } else {
        // Get the row id of the next row.
        const next_row_id = row_id + 1;
        const radio = document.getElementById(`indicator_${next_row_id}`)
        // If there is no next radio button.
        if (radio === null) {
            return;
        }
        document.getElementById(`row_${row_id}`).classList.remove('checked');
        radio.checked = true;
        document.getElementById(`row_${next_row_id}`).classList.add('checked');
        scrollToRow(next_row_id);
    }
}

/**
 * Move focus up one row. If there is no focus, set focus to the first row.
 */
function moveFocusUp() {
    const row_id = getCheckedRadioRowId();
    // If no radio button is checked.
    if (row_id === null) {
        row_id = checkAndGetFirstRadioRowId();
        // If there is no radio button at all.
        if (row_id === null) {
            return;
        }
        scrollToRow(row_id);
        document.getElementById(`row_${row_id}`).classList.add('checked');
    } else {
        // Get the row id of the previous row.
        const next_row_id = row_id - 1;
        // If there is no previous radio button.
        if (next_row_id === 0) {
            return;
        }
        const radio = document.getElementById(`indicator_${next_row_id}`)
        document.getElementById(`row_${row_id}`).classList.remove('checked');
        radio.checked = true;
        document.getElementById(`row_${next_row_id}`).classList.add('checked');
        scrollToRow(next_row_id);
    }
}

function updateRowClassBasedOnRadioCheckedState() {
    const radios = document.querySelectorAll('input[name="indicator"]');
    for (const radio of radios) {
        const row_id = radio.id.substring(10);
        const tr = document.getElementById(`row_${row_id}`);
        if (radio.checked) {
            tr.classList.add('checked');
        } else {
            tr.classList.remove('checked');
        }
    }
}

function getUrlRoot(url) {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}`;
}
