/* Collections */
let menuItems = {};
let dropdowns = {};

/* Debug */
logging = true;

function log(message) {
    let time = new Date().toLocaleTimeString();
    console.info(`[LOG] ${time}: ${message}`);
}

/* Controls */

class MenuItem {

    constructor(id, childId, enabled) {
        this.id = id;
        this.childId = childId;
        this.enabled = true;
    }

}

class DropdownMenu {

    constructor(id, parentId, enabled) {
        this.id = id;
        this.parentId = parentId;
        this.enabled = false;
    }

}

/* Load all controls from DOM */

$(function () {

    /* Menu items */
    $(".windows-menu-title").each(function () {

        // Load menu-title attributes
        let id = $(this).attr('id');
        let childId = $(this).attr('data-dropdown-id');
        let parent = new MenuItem(id, childId, false);

        // Load dropdown attributes
        let child = new DropdownMenu(childId, id, false);

        if ($(this).attr('data-enabled') !== "false") $(this).on('click', function () {
            toggleDropdown(parent.childId);
        });

        dropdowns[childId] = child;
        menuItems[id] = parent;
    });

    /* Dropdown-menu items */
    $(".windows-dropdown-menu li").each(function () {
        if ($(this).attr("data-enabled") !== "false") $(this).on("click", function() {
            toggleDropdown($(this).parent().attr('id'));
        });
    });

    // Intercept clicks anywhere on the document.
    $('html').click(function () {

    });

});

/**
 * Toggle the visibility of a dropdown menu.
 * @param {*} id - The ID of the dropdown menu to hide.
 */
function toggleDropdown(id) {
    log(`Toggling visibility of dropdown menu with id: ${id}.`);
    let child = dropdowns[id];
    let parent = menuItems[child.parentId];

    if (parent.enabled) {
        child.enabled ? hideDropdown(child.id) : showDropdown(child.id);
    }
}

/**
 * 
 * @param {*} id - The ID of the dropdown menu.
 */
function showDropdown(id) {
    log(`Showing dropdown menu with id: ${id}.`);
    let child = dropdowns[id];
    let parent = menuItems[child.parentId];

    setDropdownPosition(parent.id, child.id);
    child.enabled = true;
    $(`#${child.id}`).css({ display: 'block' });
    $(`#${parent.id}`).attr("data-active", "true");
}

function hideDropdown(id) {
    log(`Hiding dropdown menu with id: ${id}.`);
    let child = dropdowns[id];
    let parent = menuItems[child.parentId];

    child.enabled = false;
    $(`#${child.id}`).css({ display: 'none' });
    $(`#${parent.id}`).attr("data-active", "false");
}

/**
 * Set the position of a dropdown-menu.
 * @param {*} parentId - The ID of the parent element (windows-menu-title).
 * @param {*} childId - The ID of the child element (windows-dropdown-menu).
 */
function setDropdownPosition(parentId, childId) {
    log(`Setting position of dropdown menu with id: ${childId}.`);
    let parent = $(`#${parentId}`);
    let child = $(`#${childId}`);

    let parentLeft = parent.offset().left;
    let parentTop = parent.offset().top;
    let parentHeight = parent.outerHeight();

    log(`Calculated position: ${parentLeft}, ${parentHeight + parentTop}.`);

    child.css({ left: parentLeft, top: parentHeight + parentTop });
}
