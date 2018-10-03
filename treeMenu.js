// Build some dummy data.
// Data should be an array of objects.

const sourceTreeData = [
    {
        id: 0,
        parentId: null,
        title: 'Item 1',
        identifier: 'item_1'
    },
    {
        id: 1,
        parentId: null,
        title: 'Item 2',
        identifier: 'item_2'
    },
    {
        id: 2,
        parentId: null,
        title: 'Item 3',
        identifier: 'item_3'
    },
    {
        id: 3,
        parentId: 0,
        title: 'Child Item 1',
        identifier: 'child_item_1'
    },
    {
        id: 5,
        parentId: 0,
        title: 'Child Item 2',
        identifier: 'child_item_2'
    },
    {
        id: 10,
        parentId: 3,
        title: 'Child of child',
        identifier: 'child_of_child'
    },
    {
        id: 10,
        parentId: 1,
        title: 'Child of id 1',
        identifier: 'child_of_id_1'
    }
];
let descendentToHide = [];

// Will need to hide everything that is a child of something.
// Will need to make visible all children of single item when single item selected.

function NewTreeNode(title, id, parentId, parentTree) {
    this.title = title;
    this.id = id;
    this.parentId = parentId;
    this.parentTree = parentTree;
    this.element = document.createElement('div');
    this.element.innerHTML = title;
    this.everyDescendent = [];
    this.immediateDescendents = [];
};

// Experiment. Iterate over all of the data one time so we know all about it when it comes to rendering it.
function NewTreeNodeCollection(data) {
    this.treeNodes = [];

    NewTreeNodeCollection.treeNodesStatic = this.treeNodes;
    // Now run over sourceTreeData and add all the nodes
    data.forEach(function(dataItem) {

        // Find the children
        const node = new NewTreeNode(dataItem.title, dataItem.id, dataItem.parentId, this);
        this.addNode(node);
    }, this);

    // Grab every descendent and attach it to each individual node.
    this.treeNodes.forEach(function(treeNode) {
        NewTreeNode.everyDescendent = [];
        NewTreeNode.getEveryDescendent(treeNode);
        treeNode.everyDescendent = NewTreeNode.everyDescendent;
    });

    // For convenience grab immediate descendence and attach those
    this.treeNodes.forEach(function(item) {
        const immediateDescendents = this.treeNodes.filter(function(desc) {
            return desc.parentId === item.id;
        });

        item.immediateDescendents = immediateDescendents;
    }, this);


    // Now all the nodes are added, can we add event handlers?
    this.treeNodes.forEach(function(node) {

        node.element.addEventListener('dblclick', function() {
            // If the first of the immediate children is hidden, show all immediate
            if (node.immediateDescendents[0] && node.immediateDescendents[0].element.style.display == 'none') {
                node.immediateDescendents.forEach(function(desc) {
                    desc.element.style.display = 'block';
                });
            } else {
                node.everyDescendent.forEach(function(desc) {
                    desc.element.style.display = 'none';
                });
            }


        });
        
    }, this);


};


NewTreeNodeCollection.renderData = function(data, container, currentPadding = 10) {
    
    data.forEach(function(item, index) {
        item.element.style.paddingLeft = currentPadding + 'px';
        container.appendChild(item.element);

        const childrenOfCurrent = NewTreeNodeCollection.treeNodesStatic.filter(function(child) {
            
            return child.parentId === item.id;
        });

        NewTreeNodeCollection.renderData(childrenOfCurrent, container, currentPadding + 10);
    });


    // Now absolutely everything is rendered, hide anything that isn't a parent
    const childrenOfAll = NewTreeNodeCollection.treeNodesStatic.filter(function(child) {
        return child.parentId !== null;
    });

    childrenOfAll.forEach(function(child) {
        child.element.style.display = 'none';
    });


};



NewTreeNode.getEveryDescendent = function(node) {
    const immediateDescendents = NewTreeNodeCollection.treeNodesStatic.filter(function(desc) {
        return desc.parentId == node.id;
    });

    immediateDescendents.forEach(function(desc) {
        NewTreeNode.everyDescendent.push(desc);
        NewTreeNode.getEveryDescendent(desc);
    });

    
};

NewTreeNodeCollection.prototype.addNode = function(node) {
    this.treeNodes.push(node);
};

NewTreeNodeCollection.prototype.render = function(container) {

    const parents = this.treeNodes.filter(function(node) {
        return node.parentId == null;
    });
    
    NewTreeNodeCollection.renderData(parents, container);
};

// Initialise this in a constructor later
const treeNodeCollection = new NewTreeNodeCollection(sourceTreeData);


// When you click on one, you want to display the immediate children.

const TreeMenu = function(container, data) {
    //container.style.backgroundColor = 'lightblue';
    treeNodeCollection.render(container);

    
    
};