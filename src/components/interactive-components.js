// Shared interactive components for both SolidJS and static HTML
export const userIdDecoderHTML = `
  <div style="
    margin: 16px 0; 
    padding: 12px; 
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
  ">
    <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #333; font-family: Arial, sans-serif;">YouTube ID Decoder</h4>
    <p style="margin: 0 0 12px 0; font-size: 12px; color: #666; font-family: Arial, sans-serif;">This decoder is applicable to the first 10,000 YouTube IDs.</p>
    <div style="display: flex; gap: 8px; align-items: flex-start; flex-wrap: wrap; margin-bottom: 8px;">
      <input 
        type="text" 
        placeholder="Enter ID (e.g., jNQXAC9IVRw)" 
        style="
          flex: 1;
          min-width: 200px;
          padding: 4px 6px; 
          border: 1px solid #ccc; 
          font-size: 12px;
          font-family: Arial, sans-serif;
          height: 28px;
          box-sizing: border-box;
          border-radius: 4px;
        "
        class="user-id-input"
      />
      <button 
        class="decode-button yt-uix-button"
        style="white-space: nowrap;"
      >
        <span class="yt-uix-button-content">Decode</span>
      </button>
    </div>
    <div class="decode-result" style="
      padding: 6px; 
      background: #f9f9f9; 
      border: 1px solid #ddd; 
      min-height: 16px; 
      font-family: Arial, sans-serif; 
      font-size: 11px;
      color: #333;
      display: none;
    "></div>
  </div>
`;

let csvData = null;

const loadCsvData = async () => {
  if (csvData) return csvData;
  
  try {
    const response = await fetch('/data/first_10k.csv');
    const text = await response.text();
    csvData = new Map();
    
    const lines = text.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed) {
        const [numericId, youtubeId] = trimmed.split(',');
        if (numericId && youtubeId) {
          csvData.set(youtubeId, numericId);
          csvData.set(numericId, youtubeId);
        }
      }
    }
    return csvData;
  } catch (error) {
    console.error('Failed to load CSV data:', error);
    return null;
  }
};

export const initializeUserIdDecoder = (component) => {
  const input = component.querySelector('.user-id-input');
  const button = component.querySelector('.decode-button');
  const buttonContent = button.querySelector('.yt-uix-button-content');
  const result = component.querySelector('.decode-result');
  
  const handleDecode = async () => {
    const userId = input?.value?.trim();
    if (!userId) {
      result.style.display = 'block';
      result.style.color = '#d73a49';
      result.textContent = 'Please enter a YouTube ID';
      return;
    }
    
    button.disabled = true;
    result.style.display = 'block';
    result.style.color = '#666';
    result.textContent = 'Processing...';
    
    try {
      const data = await loadCsvData();
      
      if (!data) {
        result.style.color = '#d73a49';
        result.textContent = 'Error: Could not load decoder data';
        return;
      }
      
      const decodedValue = data.get(userId);
      
      if (decodedValue) {
        result.style.color = '#28a745';
        const isNumeric = /^\d+$/.test(userId);
        if (isNumeric) {
          result.textContent = `YouTube ID: ${decodedValue}`;
        } else {
          result.textContent = `Numeric ID: ${decodedValue}`;
        }
      } else {
        result.style.color = '#d73a49';
        result.textContent = 'ID not found in the first 10k database';
      }
    } catch (error) {
      result.style.color = '#d73a49';
      result.textContent = 'Error: Could not decode ID';
    } finally {
      button.disabled = false;
    }
  };
  
  button?.addEventListener('click', handleDecode);
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleDecode();
    }
  });
};