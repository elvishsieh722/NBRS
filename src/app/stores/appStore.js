'use strict';

var appDispatcher = require('../dispatcher/appDispatcher.js'),
    eventEmitter  = require('events').EventEmitter,
    // Constants
    constants     = require('../constants/constants'),
    // Underscore
    _             = require('underscore'),
    // Firebase
    Firebase      = require('firebase'),
    appStore;

appStore = _.extend({}, eventEmitter.prototype, {
    _firebaseRef    : new Firebase(constants.FIREBASE.PROJECT_URL),
    selectedProject : {},
    selectedBug     : {},
    addProject: function(newProject) {
        var isProjectIdentical = false;
        this._firebaseRef.on('value', function(snapshot){
            snapshot.forEach(function(project){
                if(project.val().name === newProject.name){
                    isProjectIdentical = true;
                }
            });
        });
        if(!isProjectIdentical){
            this._firebaseRef.child(newProject.name).set(newProject);
        }else{
            swal(constants.EN_LEXICON.OOPS, 
                constants.EN_LEXICON.PROJECT_EXIST, 'error');
        }
    },
    deleteProject: function(name) { 
        this._firebaseRef.child(name).remove();
    },
    closeProject: function(name){
        this._firebaseRef.child(name).child('isClosed').set(true);
    },
    selectProject: function(projectName){
        var thisModule = this;
        if(projectName !== thisModule.selectedProject.name){
            thisModule.selectedProject = {};
            thisModule.selectedBug = {};
            this._firebaseRef.on('value', function(snapshot){
                snapshot.forEach(function(project){
                    if(project.val().name === projectName){
                        thisModule.selectedProject = project.val();
                    }
                });
            });
        }        
    },
    addBug: function(newBug){
        var isBugIdentical = false;
        this._firebaseRef.child(this.selectedProject.name).child('bugs').on('value', function(snapshot){
            snapshot.forEach(function(project){
                if(project.val().name === newBug.name){
                    isBugIdentical = true;
                }
            });
        });
        if(!isBugIdentical){
            this._firebaseRef
                .child(this.selectedProject.name)
                .child('bugs')
                .child(newBug.name)
                .set(newBug);
        }else{
            swal(constants.EN_LEXICON.OOPS, 
                constants.EN_LEXICON.PROJECT_EXIST, 'error');
        }
    },
    deleteBug: function(bugName){
        this._firebaseRef
            .child(this.selectedProject.name)
            .child('bugs')
            .child(bugName)
            .remove();
    },
    closeBug: function(bugName){
        this._firebaseRef
            .child(this.selectedProject.name)
            .child('bugs')
            .child(bugName)
            .child('priority')
            .set(constants.PRIORITY.SOLVED);
    },
    selectBug: function(bugName){
        var thisModule = this;
        thisModule.selectedBug = {};
        if(this.selectedProject.name){
            this._firebaseRef.child(this.selectedProject.name).child('bugs').on('value', function(snapshot){
                snapshot.forEach(function(bug){
                    if(bug.val().name === bugName){
                        thisModule.selectedBug = bug.val();
                    }
                });
            });
        }        
    },
    clearSelectedBug: function(data){
        this.selectedBug = {};
    },
    addComment: function(comment){
        this._firebaseRef
            .child(this.selectedProject.name)
            .child('bugs')
            .child(this.selectedBug.name)
            .child('comments')
            .push(comment);
    },
    emitChange: function() {
        this.emit('change');
    },
    addChangeListener: function(callback) {
        this.on('change', callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    },
});
appDispatcher.register(function(payload) {
    var action = payload.action;
    switch (action.actionType) {
        case constants.ADD_PROJECT:
            appStore.addProject(action.data);
            break;
        case constants.DELETE_PROJECT:
            appStore.deleteProject(action.data);
            break;
        case constants.CLOSE_PROJECT:
            appStore.closeProject(action.data);
            break;
        case constants.SELECT_PROJECT:
            appStore.selectProject(action.data);
            break;
        case constants.ADD_BUG:
            appStore.addBug(action.data);
            break;
        case constants.DELETE_BUG:
            appStore.deleteBug(action.data);
            break;
        case constants.CLOSE_BUG:
            appStore.closeBug(action.data);
            break;
        case constants.SELECT_BUG:
            appStore.selectBug(action.data);
            break;
        case constants.ADD_COMMENT:
            appStore.addComment(action.data);
            break;
        case constants.CLEAR_SELECTED_BUG:
            appStore.clearSelectedBug(action.data);
            break;
        default:
            return true;
    }
    appStore.emitChange();
    return true;
});

module.exports = appStore;