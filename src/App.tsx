import './bulma.css'
import { useState, useEffect } from 'react'
import { clipboard } from 'electron'
import dropColor from './assets/drop.svg'
import trash from './assets/trash.svg'

const cardColors = ['default', 'primary', 'link', 'dark', 'info', 'success', 'warning', 'danger']

function App() {
  const [cardColor, setCardColor] = useState('warning')
  const [clipboardContents, setClipboardContents] = useState<string[]>([])

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
      if (clipboardContents[0] !== currentClipboardContents) {
        // push the current clipboard contents to the state array called clipboardContents
        setClipboardContents(
          prevState => [currentClipboardContents, ...prevState]
        )
      }
    }, 300)

    // clear the interval when the component unmounts
    return () => clearInterval(interval)
  }, [clipboardContents])
  
  // copyHandler function, will copy the content of the card to the clipboard and delete the card
  const copyHandler = (content: string, index: number) => {
    if (content === clipboardContents[0]) {
      return
    } else {
      clipboard.writeText(content)
      setClipboardContents(prevState => prevState.filter((_, i) => i !== index - 1))
    }
  }

  return (
    <>
      <section className='section title-section'>
        <div className='container is-flex is-justify-content-space-between is-align-items-center'>
          <div className='title-container container'>
            <h1 className='title is-1'>Simple Clipboard Manager</h1>
            <h2 className='subtitle is-3'>Review your clipboard history below</h2>
          </div>
          <div className='is-flex'>
              <button 
                className='mr-3'
                title='Change card color'
                onClick={() => {
                  const currentIndex = cardColors.indexOf(cardColor)
                  setCardColor(cardColors[(currentIndex + 1) % cardColors.length])
                }}
              >
                <img className='icon is-medium' src={dropColor}></img>
              </button>
              <button 
                title='Reset clipboard'
                onClick={() => {
                  clipboard.writeText('')
                  setClipboardContents([])
                }}
              >
                <img className='icon is-medium' src={trash}></img>
              </button>
          </div>
        </div>
      </section>
      <section className='section clipboard-section'>
        <div className='container'>
          <div className='columns is-multiline'>
            {clipboardContents.map((content, index) => (
              <div className='column is-3' key={index}>
                <article className={`message is-${cardColor}`}>
                  <div className='message-header'>
                    <p>#{++index}</p>
                    <div className='is-flex is-align-items-center'>
                      <button 
                        title='Copy'
                        className='delete copy'
                        style={{transform: 'rotate(-45deg)'}}
                        onClick={() => copyHandler(content, index)}
                      >
                      </button>
                      <button 
                        title='Delete'
                        className='delete'>
                      </button>
                    </div>
                  </div>
                  <div className='message-body'>
                    {content}
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section >
    </>
  )
}

export default App
