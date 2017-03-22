class TimerDashboard extends React.Component {
  // Property initialiser syntax. No need to create constructor to call super
  state = {
    timers: [
      {
        title: 'Practice Barbell Squat',
        project: 'Strength Training',
        id: uuid.v4(),
        elapsed: 5456099,
        runningSince: Date.now(),
      },
      {
        title: 'Bake squash',
        project: 'Kitchen Chores',
        id: uuid.v4(),
        elapsed: 1273998,
        runningSince: null,
      },
      {
        title: 'Max Bench 100kg',
        project: 'Strength Training',
        id: uuid.v4(),
        elapsed: 3890985,
        runningSince: null
      }
    ]
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
  };

  handleDeleteForm = (deleted_timer_id) => {
    // Filter = Return true to keep the element, otherwise remove element
    // i.e. keep everything that doesn't have an id with the deleted timer id
    console.log(deleted_timer_id);
    this.setState({
      timers: this.state.timers.filter(timer => timer.id !== deleted_timer_id)
      })
  }

  render() {
    return (
      <div className="ui three column centered grid">
        <div className="column">
          <EditableTimerList timers={this.state.timers} onFormSubmit={this.handleEditFormSubmit} onFormDelete={this.handleDeleteForm}/>
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
        <div className="ui bottom attached blue basic button">
          Start
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <TimerDashboard />,
  document.getElementById('content')
);
