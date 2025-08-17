import { useParams, A } from '@solidjs/router'
import { createSignal, onMount, Show, createEffect } from 'solid-js'
import '../styles/tubevault.css'

// Initialize interactive components after content loads
const initializeInteractiveComponents = async () => {
  // @ts-ignore - JavaScript module without type declarations
  const { userIdDecoderHTML, initializeUserIdDecoder } = await import('./interactive-components.js')
  
  const decoderComponents = document.querySelectorAll('.user-id-decoder-component')
  decoderComponents.forEach(component => {
    component.innerHTML = userIdDecoderHTML
    initializeUserIdDecoder(component)
  })
}

function DocsPage() {
  const params = useParams()
  const [content, setContent] = createSignal('')
  const [isLoading, setIsLoading] = createSignal(true)
  const [error, setError] = createSignal('')

  const articleId = () => params.article || 'overview'

  onMount(() => {
    loadArticle()
  })

  createEffect(() => {
    loadArticle()
  })

  const loadArticle = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/t/${articleId()}.html`)
      if (!response.ok) {
        throw new Error('Article not found')
      }
      
      const html = await response.text()
      // Extract just the article content from the full HTML
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const articleContent = doc.querySelector('#article-container')
      const navigation = doc.querySelector('.ytg-1col')
      
      if (articleContent && navigation) {
        setContent(`
          <div class="ytg-1col">${navigation.innerHTML}</div>
          <div id="yts-article">
            <div id="article-container">
              ${articleContent.innerHTML}
            </div>
          </div>
        `)
      } else {
        throw new Error('Invalid article format')
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load article')
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize components after content changes
  createEffect(() => {
    if (content() && !isLoading()) {
      setTimeout(async () => {
        // Initialize Prism if available
        if (typeof window !== 'undefined' && (window as any).Prism) {
          (window as any).Prism.highlightAll()
        }
        // Initialize interactive components
        await initializeInteractiveComponents()
      }, 0)
    }
  })

  return (
    <div class="about-pages">
      <div id="content">
        <div class="ytg-base">
          <div class="ytg-wide">
            <Show when={isLoading()}>
              <div style="text-align: center; padding: 50px;">
                <div>Loading documentation...</div>
              </div>
            </Show>
            
            <Show when={error()}>
              <div style="text-align: center; padding: 50px;">
                <div>Error: {error()}</div>
                <div style="margin-top: 30px;">
                  <A href="/t/overview" class="yt-uix-button">
                    <span class="yt-uix-button-content">Back to Overview</span>
                  </A>
                </div>
              </div>
            </Show>
            
            <Show when={content() && !isLoading() && !error()}>
              <div innerHTML={content()}></div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocsPage