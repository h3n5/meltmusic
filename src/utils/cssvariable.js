class CssVariable {
  get(key) {
    return document.documentElement.style.getPropertyValue(key).trim()
  }
  set(key, value) {
    document.documentElement.style.setProperty(key, value)
  }
  remove(key) {
    document.body.style.removeProperty(key)
  }
}

export default CssVariable
