'use strict';

var React          = require('react'),
    // Constants
    constants      = require('../constants/constants'),
    // Store
    appStore       = require('../stores/appStore'),
    // Widgets
    ProjectList    = require('../widgets/project-list'),
    BugList        = require('../widgets/bug-list'),
    BugDetail      = require('../widgets/bug-detail'),
    // Firebase
    Firebase       = require('firebase'),
    ReactFireMixin = require('reactfire'),
    MainContent;

MainContent = React.createClass({
    mixins: [ReactFireMixin],
    _hashedPassword: appStore.hashedPassword,
    getInitialState: function() {
        return {
            combo                      : '',
            projects                   : [],
            selectedProject            : {},
            selectedProjectName        : '',
            selectedProjectBugs        : [],
            selectedProjectBugComments : [],
            selectedBug                : {},
            selectedBugName            : '',
            selectedBugDescription     : '',
            selectedBugStartDate       : '',
            selectedBugEndDate         : '',
            selectedBugAuthor          : '',
            isSelectedProjectClosed    : false
        };
    },
    componentWillMount: function(){
        this.bindAsArray(new Firebase(constants.FIREBASE.PROJECT_URL), 'projects');
        this.bindAsObject(new Firebase(constants.FIREBASE.PASSWORD_URL), 'combo');
        appStore.addChangeListener(this._onDataUpdate);
    },
    componentWillUnmount: function(){
        this.unbind('projects');
        this.unbind('combo');
        appStore.removeChangeListener(this._onDataUpdate);
    },
    _onDataUpdate: function(){
        var bugsURL, commentsURL;
        if(appStore.selectedProject.name){
            bugsURL = constants.FIREBASE.PROJECT_URL + '/' + appStore.selectedProject.name + '/bugs';
            this.bindAsArray(new Firebase(bugsURL), 'selectedProjectBugs');
        }
        if(appStore.selectedBug.name){
            commentsURL = constants.FIREBASE.PROJECT_URL + 
                '/' + appStore.selectedProject.name + '/bugs/' + appStore.selectedBug.name + '/comments';
            this.bindAsArray(new Firebase(commentsURL), 'selectedProjectBugComments');
        }
        this.setState({
            selectedProject         : appStore.selectedProject,
            selectedProjectName     : appStore.selectedProject.name,
            isSelectedProjectClosed : appStore.selectedProject.isClosed,
            selectedBug             : appStore.selectedBug,
            selectedBugName         : appStore.selectedBug.name,
            selectedBugPriority     : appStore.selectedBug.priority,
            selectedBugDescription  : appStore.selectedBug.description,
            selectedBugStartDate    : appStore.selectedBug.startDate,
            selectedBugEndDate      : appStore.selectedBug.endDate,
            selectedBugAuthor       : appStore.selectedBug.author,
        });
    },
    render: function() {
        return (
            /*jshint ignore:start */
            <div className="main-content-wrapper row">
                <div className="col-xs-3 project-list-wrapper">
                    <ProjectList 
                        projects={this.state.projects}
                        selectedProjectName={this.state.selectedProjectName}
                        combo={this.state.combo}/>
                </div>
                <div className="col-xs-4 bug-list-wrapper">
                    <BugList 
                        selectedProjectName={this.state.selectedProjectName}
                        selectedProjectBugs={this.state.selectedProjectBugs}
                        selectedBugName={this.state.selectedBugName}
                        isSelectedProjectClosed={this.state.isSelectedProjectClosed}
                        combo={this.state.combo}/>
                </div>
                <div className="col-xs-5 bug-detail-wrapper">
                    <BugDetail 
                        selectedBugName={this.state.selectedBugName}
                        selectedProjectBugComments={this.state.selectedProjectBugComments}
                        selectedBugPriority={this.state.selectedBugPriority}
                        selectedBugDescription={this.state.selectedBugDescription}
                        isSelectedProjectClosed={this.state.isSelectedProjectClosed}
                        selectedBugStartDate={this.state.selectedBugStartDate}
                        selectedBugEndDate={this.state.selectedBugEndDate}
                        selectedBugAuthor={this.state.selectedBugAuthor}/>
                </div>
            </div>
            /*jshint ignore:end */
        );
    }
});

module.exports = MainContent;