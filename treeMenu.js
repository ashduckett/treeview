document.body.addEventListener('contextmenu', function(evt) {
    evt.preventDefault();
});

// This made the menu disappear but not respond to selections
document.body.addEventListener('click', function(evt) {
    if (document.getElementById('treeMenuContextMenu') !== null) {
         document.getElementById('treeMenuContextMenu').remove();
    }
});

function TreeModel(data) {
    this.nodes = [];
    this.data = data;

    // You only want to run this on root nodes...actually, that might not be a problem. You might get away with just...find out what data is initially.
    const parentNodes = data.filter(function(item) {
        return item.parentId == null;
    });

    parentNodes.forEach(function(item) {
        const node = new NodeModel(item.id, item.parentId, item.title, item.identifier, this);
        this.nodes.push(node);
    }, this);
}

TreeModel.prototype.getAllRoots = function() {
    return this.nodes.filter(function(node) {
        return node.parentId === null;
    });
};

TreeModel.prototype.addNewRoot = function(newRoot) {
    this.nodes.push(newRoot);
};


function NodeView(nodeModel, container, parentTree, treeLevel) {
    // Each node will be a div
    this.element = document.createElement('div');
    this.element.innerHTML = nodeModel.title;
    this.container = container;
    this.nodeModel = nodeModel;
    this.showChildren = false;
    this.parentTree = parentTree;
    this.childrenNodeViews = [];
    this.treeLevel = treeLevel;
    
    const self = this;
    nodeModel.childrenNodes.forEach(function(child) {
        const childNodeView = new NodeView(child, container, parentTree, treeLevel + 1);

        childNodeView.element.addEventListener('mousedown', function(evt) {
            if (evt.button === 2) {
                self.parentTree.handleContextMenu(evt, childNodeView);
            }
        });

        childNodeView.element.addEventListener('dblclick', function(evt) {
            if (childNodeView.showChildren == false) {
                childNodeView.showChildren = true;
            } else {
                childNodeView.showChildren = false;
            }
            parentTree.render();
        });


        this.childrenNodeViews.push(childNodeView);
    }, this);
}

NodeView.prototype.render = function() {
    this.element.style.paddingLeft = this.treeLevel * 10 + 'px';
    this.container.appendChild(this.element);
    const self = this;

    this.childrenNodeViews.forEach(function(childNodeView) {
        if (this.showChildren == true)
        childNodeView.render();
    }, this);
};

function TreeView(container, model, controller) {
    this.model = model;
    this.nodeViews = [];
    this.container = container;
    this.controller = controller;

    const self = this;


    this.model.nodes.forEach(function(node) {
       
        const nodeView = new NodeView(node, container, self, 0);
        
        // How are we going to add this to new the children of the children?
        nodeView.element.addEventListener('dblclick', function(evt) {
            if (nodeView.showChildren == false) {
                nodeView.showChildren = true;
            } else {
                nodeView.showChildren = false;
            }
            self.render();
        });

        // Let the controller know an item has been selected and which
        nodeView.element.addEventListener('click', function() {
            self.controller.treeItemClicked(nodeView);
        });

        // Let the controller know an item is being right clicked and fire the context menu
        nodeView.element.addEventListener('mousedown', function(evt) {
            if (evt.button === 2) {
                self.handleContextMenu(evt, nodeView);
            }
        });
        this.nodeViews.push(nodeView);
    }, this);
}


TreeView.prototype.handleContextMenu = function(evt, nodeView) {

    console.log('handlecontextmenu fired. Here we need to talk to the context menu object.');

    console.log(nodeView);

    // How about we create a new context menu instance here and then render it based on evt.
    // We can add our actions and the correct functions here.

    var self = this;
    const newRoot = new ContextMenuItem('New Root', function() {
        self.controller.newTreeRootItemClicked();
    });

    const newItem = new ContextMenuItem('New Item', function() {
        self.controller.newTreeItemClicked(nodeView);
    });

    const delItem = new ContextMenuItem('Remove Item', function() {
        self.controller.removeTreeItemClicked(nodeView);
    });

    console.log('new menu initialised')
    const contextMenu = new ContextMenu(nodeView.element, [newRoot, newItem, delItem], evt);
    contextMenu.renderContextMenu();
};

TreeView.prototype.render = function() {
    this.container.innerHTML = '';

    this.nodeViews.forEach(function(nodeView) {
        nodeView.render();
    });
};

TreeView.prototype.addRoot = function(nodeView) {
    this.nodeViews.push(nodeView)
};

function TreeController(container, data, parentController) {
    this.model = new TreeModel(data);
    this.treeView = new TreeView(container, this.model, this);
    this.treeView.render();
    this.container = container;
    this.parentController = parentController;
};

TreeController.prototype.newTreeRootItemClicked = function() {
    console.log('We should construct a new tree root item here');
    this.parentController.contextMenuItemAddRootItem();
};

TreeController.prototype.newTreeItemClicked = function(nodeView) {
    console.log('We should construct a new tree item here');
    this.parentController.contextMenuItemAddItem();

};

// Swap the node view for a node model
TreeController.prototype.removeTreeItemClicked = function(nodeView) {
    console.log('We should remove tree item here');
    this.parentController.contextMenuRemoveItem();
};

TreeController.prototype.treeItemClicked = function(nodeView) {
    console.log('We should display correct documentation here');
    console.log(nodeView.nodeModel.identifier)
    this.parentController.itemSelected();
};