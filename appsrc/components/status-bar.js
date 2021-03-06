
import classNames from 'classnames'
import React, {Component, PropTypes} from 'react'

import * as actions from '../actions'
import urls from '../constants/urls'

import Icon from './icon'

import {connect} from './connect'
import {createStructuredSelector} from 'reselect'

/**
 * Displays our current progress when checking for updates, etc.
 */
class StatusBar extends Component {
  constructor () {
    super()
    this.state = {}
  }

  render () {
    const {t, statusMessages, selfUpdate} = this.props
    const {dismissStatus, dismissStatusMessage, applySelfUpdateRequest, showAvailableSelfUpdate} = this.props
    let {status, error, uptodate, available, downloading, downloaded, checking} = selfUpdate

    let children = []
    let active = true
    let busy = false
    let indev = false

    let onClick = () => null

    if (status) {
      onClick = dismissStatus
      children = [
        <Icon icon='heart-filled'/>,
        <span>{status}</span>,
        <Icon icon='cross'/>
      ]
    } else if (statusMessages.length > 0) {
      onClick = dismissStatusMessage
      children = [
        <Icon icon='heart-filled'/>,
        <span>{t.format(statusMessages[0])}</span>,
        <Icon icon='cross'/>
      ]
    } else if (error) {
      onClick = dismissStatus
      children = [
        <Icon icon='heart-broken'/>,
        <span>Update error: {error}</span>,
        <Icon icon='cross'/>
      ]
    } else if (downloaded) {
      onClick = applySelfUpdateRequest
      children = [
        <Icon icon='install'/>,
        <span>{t('status.downloaded')}</span>
      ]
    } else if (downloading) {
      busy = true
      children = [
        <Icon icon='download'/>,
        <span>{t('status.downloading')}</span>
      ]
    } else if (available) {
      onClick = showAvailableSelfUpdate
      children = [
        <Icon icon='earth'/>,
        <span>{t('status.available')}</span>
      ]
    } else if (checking) {
      busy = true
      children = [
        <Icon icon='stopwatch'/>,
        <span>{t('status.checking')}</span>
      ]
    } else if (uptodate) {
      children = [
        <Icon icon='like'/>,
        <span>{t('status.uptodate')}</span>
      ]
    } else {
      active = false
    }

    if (urls.itchio !== urls.originalItchio) {
      children = [
        ...children,
        <span> </span>,
        <Icon icon='star'/>,
        <span>{urls.itchio}</span>
      ]
      indev = true
      active = true
    }

    const classes = classNames('status-bar', {active, busy, indev})
    const selfUpdateClasses = classNames('self-update', {busy})

    return <div className={classes}>
      <div className='filler'/>
      <div className={selfUpdateClasses} onClick={onClick}>
        {children}
      </div>
      <div className='filler'/>
    </div>
  }

  componentWillReceiveProps (nextProps) {
    // such pure, much react
    if (nextProps.finishedDownloads.length > this.props.finishedDownloads.length) {
      this.setState({...this.state, downloadsBounce: true})
      setTimeout(() => this.setState({...this.state, downloadsBounce: false}), 500)
    }
    if (nextProps.historyItems.length > this.props.historyItems.length) {
      this.setState({...this.state, historyBounce: true})
      setTimeout(() => this.setState({...this.state, historyBounce: false}), 500)
    }
  }
}

StatusBar.propTypes = {
  offlineMode: PropTypes.bool,
  historyItems: PropTypes.array,
  downloadItems: PropTypes.array,
  finishedDownloads: PropTypes.array,
  selfUpdate: PropTypes.shape({
    status: PropTypes.string,
    error: PropTypes.string,

    available: PropTypes.object,
    downloading: PropTypes.object,
    checking: PropTypes.bool,
    uptodate: PropTypes.bool
  }),

  t: PropTypes.func.isRequired,
  applySelfUpdateRequest: PropTypes.func.isRequired,
  showAvailableSelfUpdate: PropTypes.func.isRequired,
  dismissStatus: PropTypes.func.isRequired,
  dismissStatusMessage: PropTypes.func.isRequired,
  updatePreferences: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired
}

const mapStateToProps = createStructuredSelector({
  offlineMode: (state) => state.preferences.offlineMode,
  historyItems: (state) => state.history.itemsByDate,
  downloadItems: (state) => state.downloads.downloadsByOrder,
  finishedDownloads: (state) => state.downloads.finishedDownloads,
  selfUpdate: (state) => state.selfUpdate,
  statusMessages: (state) => state.status.messages
})

const mapDispatchToProps = (dispatch) => ({
  updatePreferences: (payload) => dispatch(actions.updatePreferences(payload)),
  showAvailableSelfUpdate: () => dispatch(actions.showAvailableSelfUpdate()),
  applySelfUpdateRequest: () => dispatch(actions.applySelfUpdateRequest()),
  dismissStatus: () => dispatch(actions.dismissStatus()),
  dismissStatusMessage: () => dispatch(actions.dismissStatusMessage()),
  navigate: (path) => dispatch(actions.navigate(path))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusBar)
