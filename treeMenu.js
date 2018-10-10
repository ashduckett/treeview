function NodeModel(id, parentId, title, identifier, treeModel) {
    this.childrenNodes = [];
    this.id = id;
    this.parentId = parentId;
    this.title = title;
    this.identifier = identifier;
    this.treeModel = treeModel;

    // Find all of the nodes own children and store them.
    const filteredNodes = treeModel.data.filter(function(item) {
        return item.parentId == id;
    });

    filteredNodes.forEach(function(child) {
        this.childrenNodes.push(new NodeModel(child.id, child.parentId, child.title, child.identifier, treeModel));
    }, this);
}

function TreeModel(data) {
    this.nodes = [];
    this.data = data;


    // You only want to run this on root nodes
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
    

    nodeModel.childrenNodes.forEach(function(child) {
        const childNodeView = new NodeView(child, container, parentTree, treeLevel + 1);

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

function TreeView(container, model) {
    this.model = model;
    this.nodeViews = [];
    this.container = container;

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

        this.nodeViews.push(nodeView);
    
    
    
    }, this);
    
}

TreeView.prototype.render = function() {
    const self = this;
    this.container.innerHTML = '';

    this.nodeViews.forEach(function(nodeView) {
        nodeView.render();
    });
};


function TreeController(container, data) {
    const model = new TreeModel(data);
    const treeView = new TreeView(container, model);
    treeView.render();
};