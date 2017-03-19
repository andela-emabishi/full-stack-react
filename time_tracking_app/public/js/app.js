class TimerDashboard extends React.Component {
  render() {
    return (
      <div className="ui three column centered grid">
        <div className="column">
          <EditableTimerList />
          <ToggleableTimerForm isOpen={true} />
        </div>
      </div>
    );
  }
}

class EditableTimerList extends React.Component {
  render() {
    return (
      <div id="timers">
        <EditableTimer
          title='Learn React'
          project='Javascript'
          elapsed='8986300'
          runningSince={null}
          editFormIsOpen={false}
        />
      <EditableTimer
        title='Max Bench 100kg'
        project='Strength Training'
        elaspsed='3890985'
        runningSince={null}
        editFormIsOpen={true}
      />
      </div>
    );
  }
}

class EditableTimer extends React.Component {
  render() {
    return this.props.editFormIsOpen ?
    <TimerForm
      title={this.props.title}
      project={this.props.project}
    />:
    <Timer
      title={this.props.title}
      project={this.props.project}
      elapsed={this.props.elapsed}
      runningSince={this.props.runningSince}
    />;
  }
}

class TimerForm extends React.Component {
  render() {
    const submitText = this.props.title ? 'Update' : 'Create';
    return (
      <div className="ui centered card">
        <div className="content">
          <div className="ui form">
            <div className="field">
              <label>Title</label>
              <input type="text" defaultValue={this.props.title} />
            </div>
            <div className="field">
              <label>Project</label>
              <input type="text" defaultValue={this.props.project} />
            </div>
            <div className="ui two bottom attached buttons">
              <button className="ui basic blue button">{submitText}</button>
              <button className="ui basic red button">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class ToggleableTimerForm extends React.Component {
  // If prop isOen is true then render TimerForm else render the button
  render() {
    return this.props.isOpen ?
      <TimerForm />:
      <div className="ui basic content center aligned segment">
        <button className="ui basic button icon">
          <i className="plus icon"/>
        </button>
      </div>;
  }
}

class Timer extends React.Component {
  render() {
    const elapsedString = helpers.renderElapsedString(this.props.elapsed, this.props.runningSince);
    return (
      <div className="ui centered card">
        <div className="content">
          <div className="header">{this.props.title}</div>
          <div className="meta">{this.props.project}</div>
          <div className="center aligned description">
            <h2>{elapsedString}</h2>
          </div>
          <div className="extra content">
            <span className="right floated edit icon">
              <i className="edit icon" />
            </span>
            <span className="right floated trash icon">
              <i className="trash icon" />
            </span>
          </div>
        </div>
        <div className="ui bottom attached blue basic icon">Start</div>
      </div>
    );
  }
}


ReactDOM.render(
  <TimerDashboard />,
  document.getElementById('content')
);
