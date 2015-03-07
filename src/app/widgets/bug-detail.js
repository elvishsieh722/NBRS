'use strict';

var React          = require('react'),
    CX             = require('react/lib/cx'),
    // constants
    constants      = require('../constants/constants'),
    // Store
    appStore       = require('../stores/appStore.js'),
    // Components
    AddCommentForm = require('../components/add-comment-form'),
    ToggleInputBtn = require('../components/toggle-input-btn'),
    Comment        = require('../components/comment'),
    CloseBugBtn    = require('../components/close-bug-btn'),
    BugIntro       = require('../components/bug-intro'),
    BugDetail;

BugDetail = React.createClass({
    propTypes: {
        selectedBugName            : React.PropTypes.string,
        selectedProjectBugComments : React.PropTypes.array,
        selectedBugPriority        : React.PropTypes.string,
        isSelectedProjectClosed    : React.PropTypes.bool,
        selectedBugDescription     : React.PropTypes.string,
        selectedBugStartDate       : React.PropTypes.string,
        selectedBugEndDate         : React.PropTypes.string,
        selectedBugAuthor          : React.PropTypes.string
    },
    getDefaultProps: function() {
        return {
            selectedBugName            : '',
            selectedProjectBugComments : [],
            selectedBugPriority        : '',
            selectedBugDescription     : '',
            selectedBugStartDate       : '',
            selectedBugEndDate         : '',
            selectedBugAuthor          : '',
            isSelectedProjectClosed    : false
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
                    <AddCommentForm 
                        selectedBugName={this.props.selectedBugName}/>
                    <CloseBugBtn 
                        selectedProjectName={this.props.selectedProjectName}
                        selectedBugName={this.props.selectedBugName}/>
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
    _renderComments: function(){
        var resultHTML = this.props.selectedProjectBugComments.map(function(comment, i){
            /* jshint ignore:start */
            return (
                <Comment 
                    key={i}
                    detail={comment}/>
            );
            /* jshint ignore:end */
        });
        if(this.props.selectedProjectBugComments.length === 0){
            resultHTML = (
                /* jshint ignore:start */
                <div>There are no comment in {this.props.selectedBugName}</div>
                /* jshint ignore:end */
            );
        }
        return resultHTML;
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
                <BugIntro 
                    selectedBugDescription={this.props.selectedBugDescription}
                    selectedBugStartDate={this.props.selectedBugStartDate}
                    selectedBugEndDate={this.props.selectedBugEndDate}
                    selectedBugAuthor={this.props.selectedBugAuthor}/>
                <div className="comments">
                    <h2>{this.props.selectedProjectName} Comments</h2>
                    {this._renderComments()}
                </div>
            </div>
        );
        /* jshint ignore:end */
    }
});

module.exports = BugDetail;