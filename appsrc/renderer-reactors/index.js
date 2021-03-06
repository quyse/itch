
import combine from '../reactors/combine'
import validateReactors from '../reactors/validate-reactors'

import notifications from './notifications'
import shortcuts from './shortcuts'
import encourageGenerosity from './encourage-generosity'
import focusSearch from './focus-search'
import triggers from './triggers'
import loginFailed from './login-failed'
import tabChanged from './tab-changed'

export default validateReactors({
  __MOUNT: combine(shortcuts.mount),

  FOCUS_SEARCH: combine(focusSearch.focusSearch),
  SEARCH_HIGHLIGHT_OFFSET: combine(focusSearch.searchHighlightOffset),
  CLOSE_SEARCH: combine(focusSearch.closeSearch),
  FOCUS_FILTER: combine(focusSearch.focusFilter),
  CLEAR_FILTERS: combine(focusSearch.clearFilters),

  TRIGGER_OK: combine(triggers.triggerOk),
  TRIGGER_LOCATION: combine(triggers.triggerLocation),
  TRIGGER_BACK: combine(triggers.triggerBack),

  ENCOURAGE_GENEROSITY: combine(encourageGenerosity.encourageGenerosity),

  LOGIN_FAILED: combine(loginFailed.loginFailed),

  TAB_CHANGED: combine(tabChanged.tabChanged),

  NOTIFY_HTML5: combine(notifications.notifyHtml5)
})
