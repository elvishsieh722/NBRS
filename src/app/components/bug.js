'use strict';

var React        = require('react'),
    CX           = require('react/lib/cx'),
    // Constants
    constants    = require('../constants/constants'),
    // Actions
    AppActions   = require('../actions/appActions'),    
    // Hash
    passwordHash = require('password-hash'),
    // Constants
    constants    = require('../constants/constants'),
    Bug;

Bug = React.createClass({
	propTypes: {
		selectedProjectName     : React.PropTypes.string,
		bugDetail               : React.PropTypes.object,
		selectedBugName         : React.PropTypes.string,
        isSelectedProjectClosed : React.PropTypes.bool,
        combo                   : React.PropTypes.string,
        showBug                 : React.PropTypes.bool,
	},
	getDefaultProps: function() {
		return {
			selectedProjectName     : '',
			bugDetail               : {},
			selectedBugName         : '',
            isSelectedProjectClosed : false,
            combo                   : '',
            showBug                 : true
		};
	},
	_deleteBugByName: function(e){
        var bugName        = e.target.getAttribute('data-name'),
            projectName    = this.props.selectedProjectName,
            hashedPassword = passwordHash.generate(this.props.combo),
            thisModule     = this,
            passwordInput;
        e.preventDefault();
        e.stopPropagation();
        swal(
            {
                type: 'prompt',   
                title: constants.EN_LEXICON.CAUTION,   
                text: constants.EN_LEXICON.PASSWORD_PROMPT,   
                promptPlaceholder: constants.EN_LEXICON.PASSWORD_PLACEHOLDER
            }, 
            function(passwordInput){
                if(passwordHash.verify(passwordInput, hashedPassword)){
                    if(thisModule.props.isSelectedProjectClosed){
                        swal(constants.EN_LEXICON.OOPS, 
                            constants.EN_LEXICON.ALERT_CLOSE_SUBTITLE, 'error');
                        return;
                    }
                    AppActions.deleteBug(bugName);        
                    if(bugName === thisModule.props.selectedBugName){
                        AppActions.selectBugByName('');
                    }                    
                    swal(constants.EN_LEXICON.ALERT_DELETE_RESULT,
                     constants.EN_LEXICON.ALERT_DELETE_SUBTITLE, 'success');
                }else{
                    swal(constants.EN_LEXICON.OOPS, 
                        constants.EN_LEXICON.ALERT_FAIL_SUBTITLE, 'error');
                } 
            }
        );        
    },
    _onBugSelect: function(e){
        var selectedBugName = $(e.target).closest('div')[0].id;
        e.preventDefault();
        if(!$(e.target).hasClass('cancel-icon')){
            AppActions.selectBugByName(selectedBugName);
        }
    },
    _renderPriority: function(){
        var result = '';
        if(!this.props.bugDetail.priority){
            return;
        }
        switch(this.props.bugDetail.priority){
            case 'Low':
                result = constants.EN_LEXICON.PRIORITY_LOW;
                break;
            case 'Medium':
                result = constants.EN_LEXICON.PRIORITY_MEDIUM;
                break;
            case 'High':
                result = constants.EN_LEXICON.PRIORITY_HIGH;
                break;
            case 'Solved':
                result = constants.EN_LEXICON.PRIORITY_SOLVED;
                break;
            default:
                throw 'Error!';
        }
        return result;        
    },
	render: function() {
		var bugStatusTagClass, cancelClass, bugClass;
		if(this.props.bugDetail.priority){
			bugStatusTagClass = CX({
                'bug-status'    : true,
                'label'         : true,
                'label-success' : this.props.bugDetail.priority === constants.PRIORITY.SOLVED,
                'label-primary' : this.props.bugDetail.priority === constants.PRIORITY.LOW,
                'label-warning' : this.props.bugDetail.priority === constants.PRIORITY.MEDIUM,
                'label-danger'  : this.props.bugDetail.priority === constants.PRIORITY.HIGH
            });
            cancelClass = CX({
                'cancel-icon' : true,
                'hide'        : this.props.isSelectedProjectClosed
            });
            bugClass = CX({
                'bug'      : true,
                'highlight': this.props.bugDetail.name === this.props.selectedBugName,
                'hide'     : !this.props.showBug 
            });
		}            
		return (
			/* jshint ignore:start */
			<div className={bugClass} id={this.props.bugDetail.name} onClick={this._onBugSelect}>
                {this.props.bugDetail.name}
                <i className={bugStatusTagClass}>{this._renderPriority()}</i>
                <i 
                    className={cancelClass} 
                    data-name={this.props.bugDetail.name} 
                    onClick={this._deleteBugByName}></i>
            </div>
			/* jshint ignore:end */
		);
	}
});

module.exports = Bug;
/* all rights reserved to Howard Chang */