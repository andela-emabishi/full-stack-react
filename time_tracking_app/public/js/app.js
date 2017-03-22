class TimerDashboard extends React.Component {
  state = {
    timers: []
  };

  componentDidMount() {
    // call client to fetch timers from data.js
    this.loadTimersFromServer();
    // synchronise state with server periodically
    setInterval(this.loadTimersFromServer(),5000)
  }

  loadTimersFromServer = () => {
    client.getTimers(timers => {
      this.setState({
        timers //ES6 shorthand for timers: timers
      })
    })
  }

  handleCreateFormSubmit = (timer) => {
    this.createTimer(timer);
  }

  createTimer = (timer) => {
    // create and add new timer to EditableTimerList
    const newTimer = helpers.newTimer(timer);
    // this.setState(Object.assign({}, this.state, this.state.timers.push(newTimer)))
    this.setState({
      timers: this.state.timers.concat(newTimer)
    });
    // Propagate event to server and then data.js
    client.createTimer({
      title: newTimer.title,
      project: newTimer.project,
      id: newTimer.id
    })
  };

  handleEditFormSubmit = (edited_timer_attributes) => {
    this.updateTimer(edited_timer_attributes);
  };

  updateTimer = (edited_timer_attributes) => {
    this.setState({
      // timers: this.editTimer(edited_timer_attributes)
      // edited_timer_attributes include id,title,project
      timers: this.state.timers.map(timer => {
          return timer.id === edited_timer_attributes.id ?
            Object.assign({}, timer, { title: edited_timer_attributes.title, project: edited_timer_attributes.project }):
            timer
        })
    });
    client.updateTimer(
      // id: edited_timer_attributes.id,
      // title: edited_timer_attributes.title,
      // project: edited_timer_attributes.project
      edited_timer_attributes
    )
  };

  handleDeleteForm = (deleted_timer_id) => {
    // Filter = Return true to keep the element, otherwise remove element
    // i.e. keep everything that doesn't have an id with the deleted timer id
    // console.log(deleted_timer_id);
    this.setState({
      timers: this.state.timers.filter(timer => timer.id !== deleted_timer_id)
      })
      client.deleteTimer({
        id: deleted_timer_id
      })
  }

  handleStartClick = (timerId) => {
    // console.log('Start', timerId);
    const now = Date.now();
    this.setState({
      timers: this.state.timers.map(timer => {
          return timer.id === timerId ?
           Object.assign({}, timer, { runningSince: now }):
          timer
      })
    });
    client.startTimer({id: timerId, start: now });
  }

  handleStopClick = (timerId) => {
    // set elapsed to previously elapsed + elapsed since the timer was started then
    // set runningSince of stopped timer to null then setState
    // console.log('Stop', timerId);
    const now = Date.now();
    this.setState({
      timers: this.state.timers.map(timer => {
        const lastElapsed = now - timer.runningSince
            return timer.id === timerId ?
              Object.assign({}, timer, { elapsed: timer.elapsed + lastElapsed, runningSince: null }):
              timer
      })
    });
    // Propagate stop to the server after rendering component with new state
    // Optimistic rendering. Optimistic that post to server will go well
    client.stopTimer({id: timerId, stop: now });
  }

  render() {
    return (
      <div className="ui three column centered grid">
        <div className="column">
          <EditableTimerList timers={this.state.timers}
                            onFormSubmit={this.handleEditFormSubmit}
                            onFormDelete={this.handleDeleteForm}
                            onStopClick={this.handleStopClick}
                            onStartClick={this.handleStartClick}/>
          <ToggleableTimerForm onFormSubmit={this.handleCreateFormSubmit}/>
        </div>
      </div>
    );
  }
}

class EditableTimerList extends React.Component {
  render() {
    const TimerComponents = this.props.timers.map(timer => {
      return <EditableTimer
        key={'timer' + timer.id}
        id={timer.id}
        title={timer.title}
        project={timer.project}
        elapsed={timer.elapsed}
        runningSince={timer.runningSince}
        onFormSubmit={this.props.onFormSubmit}
        onFormDelete={this.props.onFormDelete}
        onStopClick={this.props.onStopClick}
        onStartClick={this.props.onStartClick}
        />
    })
    return (
      <div id="timers">
        {TimerComponents}
      </div>
    );
  }
}

// renders TimerForm or Timer depending on whether the editFormIsOpen bool is true or false
// manages the state of the edit form because top level component TimerDashboard and EditableTimer
// don't need to know whether the timer form is open or not
class EditableTimer extends React.Component {
  state = {
    // closed by default
    editFormIsOpen: false
  }

  handleEditClick = () => {
    this.openForm()
  }

  openForm = () => {
    this.setState({
      editFormIsOpen: true
    })
  }

  handleFormClose = () => {
    this.closeForm()
  }

  closeForm = () => {
    this.setState({
      editFormIsOpen: false
    })
  }

  handleSubmit = (timer) => {
    this.props.onFormSubmit(timer);
    this.closeForm();
  }

  handleDeleteClick = (timer_id) => {
    this.props.onFormDelete(this.props.id);
  }

  render() {
    return this.state.editFormIsOpen ?
    // Form only requires title and project to render editable form
    // id required to identify each timer
    <TimerForm
      id={this.props.id}
      title={this.props.title}
      project={this.props.project}
      onFormSubmit={this.handleSubmit}
      onFormClose={this.handleFormClose}
    />:
    <Timer
      id={this.props.id}
      title={this.props.title}
      project={this.props.project}
      elapsed={this.props.elapsed}
      runningSince={this.props.runningSince}
      onEditClick={this.handleEditClick}
      onDeleteClick={this.handleDeleteClick}
      onStopClick={this.props.onStopClick}
      onStartClick={this.props.onStartClick}
    />;
  }
}

class TimerForm extends React.Component {
  constructor(props,context) {
    super(props,context);
    this.state = {
      // since we're using props to initialise the state object, we must have a constructor that calls super with props
      // When the ToggleableTimerForm Component is used to create a new timer, the title and project description will be blank
      // To prevent an undefined error when this occurs we initialise the title and description as blank in this case
      // When it's used to edit a timer, the props from EditableTimer will be valid
      title: this.props.title || '',
      project: this.props.project || ''
    }
  }

  handleTitleChange = (event) => {
    let title = event.target.value;
    this.setState({
      // ES6 shorthand for title: title
      title
    })
  }

  handleProjectChange = (event) => {
    let project = event.target.value;
    this.setState({
      // ES6 shorthand for project: project
      project
    })
  }

  handleSubmit = () => {
    this.props.onFormSubmit({
      id: this.props.id,
      title: this.state.title,
      project: this.state.project
    })
  }

  render() {
    const submitText = this.props.id ? 'Update' : 'Create';
    return (
      <div className="ui centered card">
        <div className="content">
          <div className="ui form">
            <div className="field">
              <label>Title</label>
              <input type="text" value={this.state.title} onChange={this.handleTitleChange}/>
            </div>
            <div className="field">
              <label>Project</label>
              <input type="text" value={this.state.project} onChange={this.handleProjectChange}/>
            </div>
            <div className="ui two bottom attached buttons">
              <button className="ui basic blue button" onClick={this.handleSubmit}>{submitText}</button>
              <button className="ui basic red button" onClick={this.props.onFormClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class ToggleableTimerForm extends React.Component {
  // If prop isOen is true then render TimerForm else render the button
  // manages its own state i.e. if isOpen, the form will show, if !isOpen, the button will show
  state = {
    // Form closed by default and the button shows
    isOpen: false
  }

// ES7 property initialiser syntax.
// No need to bind this of function to instance of parent class to be extended
  handleFormOpen = () => {
    // when state changes, Component is re-rendered
    this.setState({
      isOpen: true
    })
  }

  handleFormClose = () => {
    this.setState({
      isOpen: false
    });
  }

  handleFormSubmit = (timer) => {
    // add timer to list of timers
    // call function in parent component TimerDashboard
    this.props.onFormSubmit(timer);
    // close form after you're done
    this.setState({
      isOpen: false
    })
  }

  render() {
    return this.state.isOpen ?
      <TimerForm onFormClose={this.handleFormClose} onFormSubmit={this.handleFormSubmit}/>:
      <div className="ui basic content center aligned segment">
        <button className="ui basic button icon">
          <i className="plus icon" onClick={this.handleFormOpen}/>
        </button>
      </div>;
  }
}

class Timer extends React.Component {
  componentDidMount() {
    // set force update interval at which to re-render Timer
    // React's forceUpdate method forces a component to re-render
    // JavaScript setInterval calls the function within it after a specified time period
    // setInterval(function() {}, timeToTriggerFunction)
    this.forceUpdateInterval = setInterval(() => (this.forceUpdate(), 50))
  }

  componentWillUnmount() {
    // clearInterval stops the setInterval function invocation
    // id value returned by setInterval is passed into clearInterval to stop the function invocation
    // componentWillUnmount called before the component is unmounted from the DOM
    clearInterval(this.forceUpdateInterval)
  }

  handleStopClick = () => {
    let timerId = this.props.id
    this.props.onStopClick(timerId)
    console.log(timerId);
  }

  handleStartClick = () => {
    let timerId = this.props.id;
    this.props.onStartClick(timerId)
    console.log(timerId);
  }

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
            <span className="right floated edit icon" onClick={this.props.onEditClick}>
              <i className="edit icon"/>
            </span>
            <span className="right floated trash icon" onClick={this.props.onDeleteClick}>
              <i className="trash icon"/>
            </span>
          </div>
        </div>
        <TimerButton timerIsRunning={!!this.props.runningSince}
                      handleStopTimerClick={this.handleStopClick}
                      handleStartTimerClick={this.handleStartClick}/>
      </div>
    );
  }
}


class TimerButton extends React.Component {
  // const actionText = return this.props.runningSince ? `Start` : `Stop`
  render() {
    return this.props.timerIsRunning ?
      <div className="ui bottom attached red basic button" onClick={this.props.handleStopTimerClick}>
        Stop
      </div>:
      <div className="ui bottom attached green basic button" onClick={this.props.handleStartTimerClick}>
        Start
      </div>
  }
}

ReactDOM.render(
  <TimerDashboard />,
  document.getElementById('content')
);
