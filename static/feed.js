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
    const entry_id = tr.getAttribute('data-entry-id');
    const checkbox = document.getElementById(`read_${entry_id}`);
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
    const entry_id = tr.getAttribute('data-entry-id');
    const checkbox = document.getElementById(`star_${entry_id}`);
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

    window.location.assign(getUrlRoot(window.location.href));
});
