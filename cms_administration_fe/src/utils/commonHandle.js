export function copyClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Text copied to clipboard:', text)
    })
    .catch((error) => {
      console.error('Unable to copy text to clipboard:', error)
    })
}
