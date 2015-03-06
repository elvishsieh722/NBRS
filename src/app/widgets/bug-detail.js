'use strict';

var React     = require('react'),
    CX        = require('react/lib/cx'),
    // constants
    constants = require('../constants/constants'),
    // Store
    appStore  = require('../stores/appStore.js'),
    // Components
    AddCommentForm   = require('../components/add-comment-form'),
    ToggleInputBtn = require('../components/toggle-input-btn'),
    BugDetail;

BugDetail = React.createClass({
    propTypes: {
        selectedBugName: React.PropTypes.string,
        selectedProjectBugComments: React.PropTypes.array,
        selectedBugPriority: React.PropTypes.string,
        isSelectedProjectClosed: React.PropTypes.bool,
        selectedBugDescription: React.PropTypes.string,
        selectedBugStartDate: React.PropTypes.string,
        selectedBugEndDate: React.PropTypes.string,
        selectedBugAuthor: React.PropTypes.string,
    },
    getDefaultProps: function() {
        return {
            selectedBugName: '',
            selectedProjectBugComments: [],
            selectedBugPriority: '',
            selectedBugDescription: '',
            selectedBugStartDate: '',
            selectedBugEndDate: '',
            selectedBugAuthor: '',
            isSelectedProjectClosed: false
        };
    },
    getInitialState: function() {
        return {
            selectedBugPriority: this.props.selectedBugPriority 
        };
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            selectedBugPriority: nextProps.selectedBugPriority
        });
    },
    _renderCommentInputs: function(){
        var resultHTML;
        if(this.props.selectedBugPriority !== constants.PRIORITY.SOLVED && !this.props.isSelectedProjectClosed){
            resultHTML = (
                /*jshint ignore:start */
                <div>
                    <ToggleInputBtn 
                        target=".add-comment-form-wrapper"
                        displayText="New Comment" />
                    <AddCommentForm />
                </div>
                /*jshint ignore:end */
            );
        }        
        return resultHTML;
    },
    _updatePriority: function(e){
        this.setState({
            selectedBugPriority: e.target.value
        });
    },
    render: function() {
        if(!this.props.selectedBugName){
            /* jshint ignore:start */
            return (
                <div className="bug-detail">Please select a Bug</div>
            );
            /* jshint ignore:end */
        }
        /* jshint ignore:start */
        return (
            <div className="bug-detail">
                <h2>{this.props.selectedBugName} Details</h2>
                {this._renderCommentInputs()}
                <div className="form-group">
                    <label htmlFor="comment">Bug Description:</label>
                    <textarea className="form-control allow-cursor" disabled rows="5" id="comment" value={this.props.selectedBugDescription}></textarea>
                    <div>Start Date: {this.props.selectedBugStartDate}</div>
                    <div>End Date: {this.props.selectedBugEndDate}</div>
                    <div>Author: {this.props.selectedBugAuthor}</div>
                </div>
            </div>
        );
        /* jshint ignore:end */
    }

});

module.exports = BugDetail;