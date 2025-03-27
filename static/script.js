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
    var row_id = getCheckedRadioRowId();
    // If no radio button is checked.
    if (row_id === null) {
        row_id = checkAndGetFirstRadioRowId();
        // If there is no radio button at all.
        if (row_id === null) {
            return;
        }
        scrollToRow(row_id);
    } else {
        // Get the row id of the next row.
        row_id = row_id + 1;
        const radio = document.getElementById(`indicator_${row_id}`)
        // If there is no next radio button.
        if (radio === null) {
            return;
        }
        radio.checked = true;
        scrollToRow(row_id);
    }
}

/**
 * Move focus up one row. If there is no focus, set focus to the first row.
 */
function moveFocusUp() {
    var row_id = getCheckedRadioRowId();
    // If no radio button is checked.
    if (row_id === null) {
        row_id = checkAndGetFirstRadioRowId();
        // If there is no radio button at all.
        if (row_id === null) {
            return;
        }
        scrollToRow(row_id);
    } else {
        // Get the row id of the previous row.
        row_id = row_id - 1;
        // If there is no previous radio button.
        if (row_id === 0) {
            return;
        }
        const radio = document.getElementById(`indicator_${row_id}`)
        radio.checked = true;
        scrollToRow(row_id);
    }
}

/**
 * Toggle the read checkbox. Return whether the underlying checkbox is checked.
 * Return null if there is no focus.
 * 
 * @param {boolean} set_to_true true to check the checkbox rather than toggling
 * @returns {boolean | null}
 */
function toggleRead(set_to_true) {
    const row_id = getCheckedRadioRowId();
    if (row_id === null) {
        return null;
    }
    const tr = document.getElementById(`row_${row_id}`);
    const checkbox = tr.children[1].children[0];
    if (set_to_true) {
        checkbox.checked = true;
    } else {
        checkbox.checked = !checkbox.checked;
    }
    return checkbox.checked;
}

/**
 * Toggle the star checkbox.
 */
function toggleStar() {
    const row_id = getCheckedRadioRowId();
    const tr = document.getElementById(`row_${row_id}`);
    const checkbox = tr.children[2].children[0];
    checkbox.checked = !checkbox.checked;
}

function openUrl() {
    const row_id = getCheckedRadioRowId();
    if (row_id === null) {
        return;
    }
    const headline = document.getElementById(`headline_${row_id}`);
    const url = headline.getAttribute('data-url');
    window.open(url, '_blank');
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'j') {
        moveFocusDown();
    } else if (event.key == 'k') {
        moveFocusUp();
    } else if (event.key == 'r') {
        toggleRead(false);
    } else if (event.key == 'R') {
        if (toggleRead(false) === true) {
            moveFocusDown();
        }
    } else if (event.key === 's') {
        toggleStar();
    } else if (event.key === 'l') {
        openUrl();
        if (toggleRead(true) === true) {
            moveFocusDown();
        }
    }
});

document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();

    const checkedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const entriesRead = [];
    const entriesStarred = [];
    for (const checkbox of checkedCheckboxes) {
        if (checkbox.id.startsWith('read_')) {
            entriesRead.push(parseInt(checkbox.id.substring(5)));
        } else if (checkbox.id.startsWith('star_')) {
            entriesStarred.push(parseInt(checkbox.id.substring(5)));
        }
    }
    const data = {
        entries_read: entriesRead,
        entries_star: entriesStarred
    };

    fetch(window.location.href, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            alert('Network response was not ok');
        }
    })
    .then(_data => {
        alert('Form submitted successfully!');
    });

    location.reload(true);
});
