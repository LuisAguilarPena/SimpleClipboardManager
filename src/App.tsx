import './bulma.css'
import { useState, useEffect } from 'react'
import { clipboard } from 'electron'
import dropColor from './assets/drop.svg'
import trash from './assets/trash.svg'
import 'animate.css'
import logo from './assets/logo.svg'

const cardColors = ['default', 'primary', 'link', 'dark', 'info', 'success', 'warning', 'danger']
// https://stackoverflow.com/questions/71757346/how-to-import-datetimeformatoptions-in
const timeOptions: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }

interface ClipboardItem {
  content: string
  timestamp: string
}

function App() {
  const [cardColor, setCardColor] = useState('warning')
  const [dropAnimation, setDropAnimation] = useState(false)
  const [trashAnimation, setTrashAnimation] = useState(false)
  const [clipboardContents, setClipboardContents] = useState<ClipboardItem[]>([])

  // set an interval to check the clipboard every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      // get the current clipboard contents
      const currentClipboardContents = clipboard.readText()

      // if the clipboard contents are empty, return
      if (currentClipboardContents.length === 0) {
        return
      }
      // if the current clipboard contents are different from the last clipboard contents
      if (clipboardContents.length === 0 || clipboardContents[0].content !== currentClipboardContents) {
        const timestamp = new Date().toLocaleString('en-US', { ...timeOptions })
        // push the current clipboard contents to the state array called clipboardContents
        setClipboardContents(prevState => [
          { content: currentClipboardContents, timestamp },
          ...prevState,
        ])
      }
    }, 1000)

    // clear the interval when the component unmounts
    return () => clearInterval(interval)
  }, [clipboardContents])

  // copyHandler function, will copy the content of the card to the clipboard and move the card to the top of the clipboard
  const copyHandler = (content: string, index: number) => {
    // if the content is the same as the most recent clipboard item, return
    if (content === clipboardContents[0].content) {
      return
    } else {
      clipboard.writeText(content)
      const timestamp = new Date().toLocaleString('en-US', { ...timeOptions })
      const newClipboardContents = clipboardContents.filter((_, i) => i !== index)
      setClipboardContents([{ content, timestamp }, ...newClipboardContents])
    }
  }

  // deleteHander function, will delete the card
  const deleteHandler = (index: number) => {
    // filter out the card that was clicked on
    setClipboardContents(prevState => prevState.filter((_, i) => i !== index))
    // if there is only one clipboard item, clear the clipboard
    if (index === 0 && clipboardContents.length === 1) {
      clipboard.writeText('')
      // if it was the most recent clipboard item, copy the next most recent clipboard item to the clipboard
    } else if (index === 0) {
      clipboard.writeText(clipboardContents[1].content)
    }
  }

  return (
    <>
      <section className='section title-section has-background-black-ter'>
        <div className='container is-flex is-justify-content-space-between is-align-items-center animate__animated animate__fadeInDown animate__faster'>
          <div className='title-container container'>
            <h1 className='is-unselectable title is-size-1-desktop is-size-2-tablet is-size-3-mobile'>
              <img className='icon is-medium' src={logo}></img> Simple Clipboard Manager V0.1
            </h1>
            <h2 className='is-unselectable subtitle is-size-3-desktop is-size-4-tablet is-size-5-mobile'>Manage your clipboard history below</h2>
          </div>
          <div className='is-flex is-hidden-mobile'>
              <button 
                className={`mr-3 ${dropAnimation ? 'animate__animated animate__pulse animate__fast animate__infinite' : ''}`}
                title='Change card color'
                onClick={() => {
                  const currentIndex = cardColors.indexOf(cardColor)
                  setCardColor(cardColors[(currentIndex + 1) % cardColors.length])
                }}
                onMouseEnter={() => setDropAnimation(true)}
                onMouseLeave={() => setDropAnimation(false)}
              >
                <img className='icon is-medium' src={dropColor}></img>
              </button>
              <button 
                className={`${trashAnimation ? 'animate__animated animate__pulse animate__fast animate__infinite' : ''}`}
                title='Reset clipboard'
                onClick={() => {
                  clipboard.writeText('')
                  setClipboardContents([])
                }}
                onMouseEnter={() => setTrashAnimation(true)}
                onMouseLeave={() => setTrashAnimation(false)}
              >
                <img className='icon is-medium' src={trash}></img>
              </button>
          </div>
        </div>
      </section>
      <section className='section clipboard-section mb-6'>
        <div className='container'>
          <div className='columns is-multiline is-mobile'>
            {clipboardContents.map((item, index) => (
              <div className='column is-3-desktop is-4-tablet is-half-mobile animate__animated animate__fadeInUp animate__faster' key={index}>
                <article className={`message is-${cardColor}`}>
                  <div className='message-header'>
                    <p className='is-unselectable is-size-7-mobile'>{item.timestamp}</p>
                    <div className='is-flex is-align-items-center'>
                      <button 
                        title='Copy'
                        className='delete copy'
                        style={{transform: 'rotate(-45deg)'}}
                        onClick={() => copyHandler(item.content, index)}
                      >
                      </button>
                      <button 
                        title='Delete'
                        className='delete'
                        onClick={() => deleteHandler(index)}
                      >
                      </button>
                    </div>
                  </div>
                  <div className='message-body'>
                    <p>
                      {item.content}
                    </p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* add a footer here, position at bottom of page */}
      <footer className='footer p-4 has-background-black-ter animate__animated animate__fadeInUp animate__faster'>
        <div className='content has-text-centered'>
          <p className='footer-text has-text-weight-light'>
            <span className='is-unselectable'>Made with ❤️ by Luis Aguilar - Contact me at: </span><strong>fredo.aguilar.la@gmail.com</strong>
          </p>
        </div>
      </footer>
    </>
  )
}

export default App