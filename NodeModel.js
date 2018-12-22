function NodeModel(id, parentId, title, identifier, treeModel) {
    this.childrenNodes = [];
    this.id = id;
    this.parentId = parentId;
    this.title = title;
    this.identifier = identifier;
    this.treeModel = treeModel;

    // Find all of the node's own children and store them.
    const filteredNodes = treeModel.data.filter(function(item) {
        return item.parentId == id;
    });

    
    filteredNodes.forEach(function(child) {
        this.childrenNodes.push(new NodeModel(child.id, child.parentId, child.title, child.identifier, treeModel));
    }, this);
}

NodeModel.prototype.save = function() {
    console.log('save happened')
    this.id = 'dummyId';
};