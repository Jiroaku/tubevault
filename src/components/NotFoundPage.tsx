function NotFoundPage() {
  return (
    <>
      <style>{`
        .search-container {
          display: flex;
        }
        .error-message {
          font-size: 16px;
          color: #333333;
          text-align: center;
          margin: 0 0 20px 0;
        }
        @media (max-width: 768px) {
          .search-container {
            display: none !important;
          }
          .error-message {
            font-size: 14px;
            padding: 0 10px;
          }
        }
        @media (max-width: 480px) {
          .error-message {
            font-size: 13px;
            padding: 0 15px;
          }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        'background-color': '#ffffff',
        'font-family': 'Arial, sans-serif',
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        'justify-content': 'center',
        'z-index': 9999
      }}>
      <a href="/" style={{ 'text-decoration': 'none' }}>
        <img 
          src="https://s.ytimg.com/yts/img/image-hh-404-vflxxCpNv.png"
          alt="404 Error"
          style={{
            'max-width': '100%',
            height: 'auto',
            'margin-bottom': '20px',
            cursor: 'pointer'
          }}
        />
      </a>
      <p class="error-message">
        We're sorry, the page you requested cannot be found. Try searching for something else.
      </p>
      <div style={{
        display: 'flex',
        'align-items': 'center',
        'max-width': '684px',
        width: '100%',
        padding: '0 20px',
        'box-sizing': 'border-box'
      }} class="search-container">
        <a 
          href="/"
          style={{
            'margin-right': '20px',
            'text-decoration': 'none',
            display: 'flex',
            'align-items': 'center'
          }}
        >
          <img 
            src="/tubevault.png" 
            alt="TubeVault" 
            style={{
              height: '32px',
              width: 'auto'
            }}
          />
        </a>
        <div style={{
          display: 'flex',
          'flex-grow': 1,
          height: '40px',
          border: '1px solid #ccc',
          'border-radius': '2px 0 0 2px',
          'background-color': '#ffffff',
          'box-shadow': 'inset 0 1px 2px rgba(0,0,0,0.1)',
          'box-sizing': 'border-box'
        }}>
          <input
            type="text"
            placeholder="Search"
            style={{
              'flex-grow': 1,
              border: 'none',
              outline: 'none',
              padding: '0 16px',
              'font-size': '16px',
              'font-family': 'Arial, sans-serif',
              'background-color': 'transparent',
              height: '38px',
              'box-sizing': 'border-box'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const query = (e.target as HTMLInputElement).value
                if (query.trim()) {
                  window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim())}`, '_blank')
                }
              }
            }}
          />
        </div>
        <button
          style={{
            height: '40px',
            width: '65px',
            border: '1px solid #ccc',
            'border-left': 'none',
            'border-radius': '0 2px 2px 0',
            'background-color': '#f8f8f8',
            cursor: 'pointer',
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'center',
            'box-sizing': 'border-box'
          }}
          onClick={() => {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement
            const query = input?.value
            if (query?.trim()) {
              window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim())}`, '_blank')
            }
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
      </div>
    </div>
    </>
  )
}

export default NotFoundPage