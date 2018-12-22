// What does this need to know, and how will it work?
// In order to function it will need the specific item it was clicked on.
// Or will it? The callback called will, but the actual menu may not.


// Pass in an array of objects:


function ContextMenuItem(title, action) {
    this.title = title;
    this.action = action;

    console.log('initialising menu items')
}

function ContextMenu(container, arrayOfContextMenuItems, evt) {
    this.container = container;
    this.arrayOfContextMenuItems = arrayOfContextMenuItems;

    // Create view
    this.view = new ContextMenuView(container, arrayOfContextMenuItems, evt);
    this.evt = evt;
}

ContextMenu.prototype.renderContextMenu = function() {
    this.view.renderContextMenu(this.evt);
};


function ContextMenuView(container, arrayOfContextMenuItems, evt) {
    this.arrayOfContextMenuItems = arrayOfContextMenuItems;
    
    container.addEventListener('contextmenu', function(evt) {
        evt.preventDefault();
    });
}

ContextMenuView.prototype.renderContextMenu = function(evt) {

    console.log('calling render!')
    if (document.getElementById('treeMenuContextMenu') !== null) {
        document.getElementById('treeMenuContextMenu').remove();
    }

    console.log('rendering context menu')
    console.log(this.arrayOfContextMenuItems)
    const menuContainer = document.createElement('div');
    menuContainer.style.position = 'absolute';
    menuContainer.style.top = evt.clientY + 'px';
    menuContainer.style.left = evt.clientX + 'px';
    menuContainer.style.backgroundColor = 'white';
    menuContainer.style.borderColor = 'black';
    menuContainer.style.borderStyle = 'solid';
    menuContainer.style.borderWidth = '1px';
    menuContainer.id = 'treeMenuContextMenu';

    const menuList = document.createElement('ul');

    this.arrayOfContextMenuItems.forEach(function(item) {
        const menuItemNewRootItem = document.createElement('li');
        const menuItemNewRootItemLink = document.createElement('a');
        menuItemNewRootItemLink.href = '#';
        menuItemNewRootItemLink.innerHTML = item.title;
        menuItemNewRootItem.appendChild(menuItemNewRootItemLink);
        menuList.appendChild(menuItemNewRootItem);    

        // Here we should notify the controller that a click was made.

        menuItemNewRootItem.addEventListener('click', function() {
            item.action();
            document.getElementById('treeMenuContextMenu').remove();

        });

    });

    
    menuContainer.appendChild(menuList);

    console.log(menuContainer);
    
    console.log('appending to body')
    document.body.appendChild(menuContainer);
};


